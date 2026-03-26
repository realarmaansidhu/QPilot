// QPilot API client — communicates with FastAPI backend
import type { ScreenerParams, ScreenerResponse } from '@/types/api';
import type { AnalysisReport, StockProfile, StockScore } from '@/types/stock';
import { createClient } from '@/lib/supabase/client';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/** Get auth headers with current user's Supabase JWT */
async function authHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...headers, ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || err.message || `API error ${res.status}`);
  }
  return res.json();
}

/** Trigger deep-dive analysis for a ticker (returns SSE stream URL) */
export async function analyzeStock(ticker: string): Promise<AnalysisReport> {
  return apiFetch<AnalysisReport>(`/analyze/${ticker}`, { method: 'POST' });
}

/** Fetch S&P 500 screener leaderboard */
export async function getScreener(params: ScreenerParams = {}): Promise<ScreenerResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) query.set(k, String(v));
  });
  return apiFetch<ScreenerResponse>(`/screener?${query}`);
}

/** Fetch basic stock data + latest score */
export async function getStock(ticker: string): Promise<StockProfile> {
  return apiFetch<StockProfile>(`/stock/${ticker}`);
}

/** Fetch user's watchlist */
export async function getWatchlist(): Promise<StockScore[]> {
  return apiFetch<StockScore[]>('/watchlist');
}

/** Add ticker to watchlist */
export async function addToWatchlist(ticker: string): Promise<void> {
  await apiFetch(`/watchlist/${ticker}`, { method: 'POST' });
}

/** Remove ticker from watchlist */
export async function removeFromWatchlist(ticker: string): Promise<void> {
  await apiFetch(`/watchlist/${ticker}`, { method: 'DELETE' });
}
