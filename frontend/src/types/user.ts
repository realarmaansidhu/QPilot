// QPilot user and subscription types

export type SubscriptionTier = 'free' | 'plus' | 'pro';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  trial_ends_at: string | null;
  daily_analysis_count: number;
  created_at: string;
}

export type LLMProvider = 'openai' | 'anthropic' | 'google';

export interface ApiKeyConfig {
  provider: LLMProvider;
  is_active: boolean;
  last_verified_at: string | null;
}

/** Tier limits for display and gating */
export const TIER_LIMITS: Record<SubscriptionTier, { analyses_per_day: number; full_screener: boolean; csv_export: boolean; price: number }> = {
  free: { analyses_per_day: 5,      full_screener: false, csv_export: false, price: 0 },
  plus: { analyses_per_day: 50,     full_screener: true,  csv_export: false, price: 15 },
  pro:  { analyses_per_day: 999999, full_screener: true,  csv_export: true,  price: 39 },
};
