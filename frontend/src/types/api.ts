// QPilot API request/response types — aligned with backend Pydantic models

import type { Rating, StockScore } from './stock';

export interface ScreenerParams {
  sector?: string;
  min_score?: number;
  rating?: Rating;
  sort_by?: string;
  limit?: number;
  offset?: number;
}

/** Matches backend models.stock.ScreenerResponse */
export interface ScreenerResponse {
  results: StockScore[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  detail: string; // FastAPI uses 'detail' for error messages
}
