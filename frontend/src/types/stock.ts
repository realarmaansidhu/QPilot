// QPilot stock data types — shared across frontend components

export type Rating = 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';

export interface StockScore {
  ticker: string;
  company_name: string;
  sector: string;
  score_date: string;
  qpilot_score: number;
  rating: Rating;
  fundamental_score: number | null;
  technical_score: number | null;
  momentum_score: number | null;
  risk_score: number | null;
  sentiment_score: number | null;
  price: number | null;
  market_cap: number | null;
  pe_ratio: number | null;
  revenue_growth: number | null;
  eps_growth: number | null;
  rsi: number | null;
  beta: number | null;
  dividend_yield: number | null;
  fifty_two_week_high: number | null;
  fifty_two_week_low: number | null;
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
  qpilot_score: number;
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
