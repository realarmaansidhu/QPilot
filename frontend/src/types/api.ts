// QPilot API request/response types

import type { Rating, StockScore } from './stock';

export interface ScreenerParams {
  sector?: string;
  min_score?: number;
  rating?: Rating;
  sort_by?: string;
  limit?: number;
  offset?: number;
}

export interface ScreenerResponse {
  stocks: StockScore[];
  total: number;
  page: number;
  per_page: number;
}

export interface ApiError {
  message: string;
  status_code: number;
}
