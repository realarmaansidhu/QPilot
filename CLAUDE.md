# CLAUDE.md — QPilot Project Context

## What is QPilot?
QPilot (tryqpilot.com) is an AI-powered quantitative stock analysis SaaS built by
Realize Labs (Armaan Sidhu). It connects to OpenBB's MCP server to provide retail
investors with institutional-grade stock analysis through natural language AI agents.

## Architecture
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS + shadcn/ui → Vercel
- **Backend**: FastAPI (Python 3.12) + LangGraph + OpenBB MCP → Oracle Cloud VM / Railway
- **Database**: Supabase (PostgreSQL + Auth + RLS policies)
- **Payments**: Stripe (subscription billing, 3 tiers: Free/$15/$39)
- **Cache**: Redis (Upstash serverless)
- **Charts**: TradingView Lightweight Charts
- **LLM**: User-provided API keys (OpenAI, Anthropic, Google)

## Key Design Decisions
1. Users bring their own LLM API keys (like XPilot) — zero LLM cost for us
2. OpenBB MCP server provides all financial data via `langchain-mcp-adapters`
3. LangGraph supervisor pattern with 4 sub-agents: Fundamental, Technical, Risk, Sentiment
4. Daily batch screening of S&P 500 via cron job, results cached
5. Deep-dive reports stream via SSE for real-time UX
6. Publisher's exclusion compliance — impersonal analysis, no personalized advice

## OpenBB MCP Integration
- Package: `openbb-mcp-server` (PyPI)
- LangGraph bridge: `langchain-mcp-adapters` → `MultiServerMCPClient`
- Transport: stdio (local) or HTTP (remote)
- Free data providers: FMP (250/day), SEC EDGAR (unlimited), FRED (unlimited)
- All data standardized via OpenBB Pydantic models regardless of provider

## Database Schema (Supabase)
Core tables: profiles, api_keys (encrypted), sp500_constituents, stock_scores
(daily screener results), analysis_cache (deep-dive reports), watchlists,
analysis_history

## File Structure Conventions
- Frontend components: PascalCase (TickerCard.tsx)
- Backend modules: snake_case (screening_agent.py)
- API routes: RESTful (GET /screener, POST /analyze/{ticker})
- Environment vars: UPPER_SNAKE_CASE

## Legal Requirements
- Every page with ratings must include: "For informational purposes only.
  Not financial advice. Consult a licensed advisor."
- No personalized advice based on individual financial profiles
- QPilot Score methodology must be documented and transparent
- All analysis is impersonal (same output for all users given same ticker)

## Coding Standards
- TypeScript strict mode in frontend
- Python type hints everywhere in backend
- Pydantic models for all API request/response schemas
- Supabase RLS policies on every table
- Error boundaries in React, try/except in FastAPI
- All financial numbers formatted with proper precision (2 decimal for prices,
  1 decimal for percentages, abbreviated for large numbers: 1.2B, 45.3M)

## Sister Product Reference
QPilot follows XPilot's (tryxpilot.com) proven architecture:
- Same Supabase auth flow (email + OAuth)
- Same Stripe webhook pattern
- Same Vercel + Oracle Cloud deployment model
- Same user-provided API key pattern

## Commands
- Frontend: `cd frontend && npm run dev` (dev server on :3000)
- Backend: `cd backend && uvicorn main:app --reload` (dev server on :8000)
- Database: Run `database/schema.sql` in Supabase SQL Editor
