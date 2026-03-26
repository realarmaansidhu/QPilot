-- QPilot Database Schema (Supabase PostgreSQL)
-- Run this in the Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'pro')),
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'), -- 14-day reverse trial
    daily_analysis_count INTEGER NOT NULL DEFAULT 0,
    daily_analysis_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USER API KEYS (encrypted storage for LLM keys)
-- ============================================================
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
    encrypted_key TEXT NOT NULL, -- Encrypted with pgcrypto
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- ============================================================
-- S&P 500 CONSTITUENTS
-- ============================================================
CREATE TABLE public.sp500_constituents (
    ticker TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    sector TEXT NOT NULL,
    sub_industry TEXT,
    market_cap_bucket TEXT CHECK (market_cap_bucket IN ('mega', 'large', 'mid')),
    cik TEXT, -- SEC EDGAR identifier
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMPTZ -- NULL if currently in index
);

-- ============================================================
-- DAILY STOCK SCORES (batch screener results)
-- ============================================================
CREATE TABLE public.stock_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker TEXT NOT NULL REFERENCES public.sp500_constituents(ticker),
    score_date DATE NOT NULL,
    qpilot_score NUMERIC(5,2) NOT NULL CHECK (qpilot_score >= 0 AND qpilot_score <= 100),
    rating TEXT NOT NULL CHECK (rating IN ('strong_buy', 'buy', 'hold', 'sell', 'strong_sell')),
    fundamental_score NUMERIC(5,2),
    technical_score NUMERIC(5,2),
    momentum_score NUMERIC(5,2),
    risk_score NUMERIC(5,2),
    sentiment_score NUMERIC(5,2),
    -- Key metrics snapshot
    price NUMERIC(12,2),
    market_cap BIGINT,
    pe_ratio NUMERIC(10,2),
    revenue_growth NUMERIC(8,4), -- as decimal (0.15 = 15%)
    eps_growth NUMERIC(8,4),
    rsi NUMERIC(6,2),
    beta NUMERIC(6,3),
    dividend_yield NUMERIC(8,4),
    fifty_two_week_high NUMERIC(12,2),
    fifty_two_week_low NUMERIC(12,2),
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(ticker, score_date)
);

-- Index for fast leaderboard queries
CREATE INDEX idx_stock_scores_date_score ON public.stock_scores(score_date DESC, qpilot_score DESC);
CREATE INDEX idx_stock_scores_ticker ON public.stock_scores(ticker);

-- ============================================================
-- ANALYSIS CACHE (deep-dive reports)
-- ============================================================
CREATE TABLE public.analysis_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker TEXT NOT NULL,
    report_json JSONB NOT NULL, -- Full structured report
    model_used TEXT, -- Which LLM generated this
    qpilot_score NUMERIC(5,2),
    rating TEXT,
    expires_at TIMESTAMPTZ NOT NULL, -- Cache TTL (24h default)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analysis_cache_ticker ON public.analysis_cache(ticker, created_at DESC);
CREATE INDEX idx_analysis_cache_expiry ON public.analysis_cache(expires_at);

-- ============================================================
-- WATCHLISTS
-- ============================================================
CREATE TABLE public.watchlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ticker TEXT NOT NULL,
    notes TEXT,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, ticker)
);

CREATE INDEX idx_watchlists_user ON public.watchlists(user_id);

-- ============================================================
-- ANALYSIS HISTORY (user's past deep-dives for usage tracking)
-- ============================================================
CREATE TABLE public.analysis_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ticker TEXT NOT NULL,
    analysis_cache_id UUID REFERENCES public.analysis_cache(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analysis_history_user ON public.analysis_history(user_id, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sp500_constituents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- API Keys: users can CRUD their own keys only
CREATE POLICY "Users can view own keys" ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own keys" ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own keys" ON public.api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own keys" ON public.api_keys FOR DELETE USING (auth.uid() = user_id);

-- S&P 500: readable by all authenticated users
CREATE POLICY "Authenticated users can read constituents" ON public.sp500_constituents 
    FOR SELECT USING (auth.role() = 'authenticated');

-- Stock Scores: readable by all authenticated users
CREATE POLICY "Authenticated users can read scores" ON public.stock_scores 
    FOR SELECT USING (auth.role() = 'authenticated');

-- Analysis Cache: readable by all authenticated users (shared cache)
CREATE POLICY "Authenticated users can read analysis" ON public.analysis_cache 
    FOR SELECT USING (auth.role() = 'authenticated');

-- Watchlists: users can CRUD their own watchlists
CREATE POLICY "Users can view own watchlist" ON public.watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to watchlist" ON public.watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from watchlist" ON public.watchlists FOR DELETE USING (auth.uid() = user_id);

-- Analysis History: users can view their own history
CREATE POLICY "Users can view own history" ON public.analysis_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.analysis_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Reset daily analysis count
CREATE OR REPLACE FUNCTION public.check_and_reset_daily_limit(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
    v_reset_at TIMESTAMPTZ;
    v_tier TEXT;
    v_limit INTEGER;
BEGIN
    SELECT daily_analysis_count, daily_analysis_reset_at, subscription_tier
    INTO v_count, v_reset_at, v_tier
    FROM public.profiles WHERE id = p_user_id;
    
    -- Reset if new day
    IF v_reset_at < DATE_TRUNC('day', NOW()) THEN
        UPDATE public.profiles 
        SET daily_analysis_count = 0, daily_analysis_reset_at = NOW()
        WHERE id = p_user_id;
        v_count := 0;
    END IF;
    
    -- Get limit based on tier
    v_limit := CASE v_tier
        WHEN 'free' THEN 5
        WHEN 'plus' THEN 50
        WHEN 'pro' THEN 999999 -- unlimited
        ELSE 5
    END;
    
    RETURN v_limit - v_count; -- remaining analyses
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment analysis count
CREATE OR REPLACE FUNCTION public.increment_analysis_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles 
    SET daily_analysis_count = daily_analysis_count + 1, updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
