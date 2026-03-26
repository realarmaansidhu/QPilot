// QPilot stock data types — aligned with backend Pydantic models

export type Rating = 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';

/** Matches backend models.stock.StockScore */
export interface StockScore {
  ticker: string;
  company_name: string;
  sector: string;
  score: number;          // QPilot composite score 0-100
  rating: Rating;
  fundamental: number;
  technical: number;
  momentum: number;
  risk: number;
  sentiment: number;
}

/** Matches backend models.stock.StockProfile */
export interface StockProfile {
  ticker: string;
  company_name: string;
  sector: string;
  market_cap: number | null;
  price: number | null;
  change_pct: number | null;
  score: StockScore | null;
}

export type SectionType =
  | 'executive_summary'
  | 'company_overview'
  | 'financial_health'
  | 'valuation'
  | 'technical'
  | 'risk'
  | 'analyst_consensus'
  | 'insider_activity'
  | 'news_sentiment'
  | 'verdict';

export interface ReportSection {
  type: SectionType;
  title: string;
  content: string; // markdown
  data?: Record<string, unknown>;
}

export interface AnalysisReport {
  id: string;
  ticker: string;
  sections: ReportSection[];
  score: number;
  rating: Rating;
  model_used: string | null;
  created_at: string;
}

/** Maps rating to display label and color */
export const RATING_CONFIG: Record<Rating, { label: string; color: string; bg: string }> = {
  strong_buy:  { label: 'Strong Buy',  color: 'text-green-400',  bg: 'bg-green-500/20' },
  buy:         { label: 'Buy',         color: 'text-green-300',  bg: 'bg-green-400/20' },
  hold:        { label: 'Hold',        color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  sell:        { label: 'Sell',        color: 'text-orange-400', bg: 'bg-orange-500/20' },
  strong_sell: { label: 'Strong Sell', color: 'text-red-400',    bg: 'bg-red-500/20' },
};
