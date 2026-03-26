'use client';

import { TickerCard } from '@/components/stock/TickerCard';
import { LoadingState } from '@/components/common/LoadingState';
import type { StockScore } from '@/types/stock';

// Mock data for initial scaffold — replaced with real API calls in Sprint 2
const MOCK_TOP_STOCKS: StockScore[] = [
  { ticker: 'NVDA', company_name: 'NVIDIA Corporation', sector: 'Technology', score_date: '2026-03-26', qpilot_score: 92, rating: 'strong_buy', fundamental_score: 88, technical_score: 95, momentum_score: 94, risk_score: 78, sentiment_score: 90, price: 875.50, market_cap: 2150000000000, pe_ratio: 65.2, revenue_growth: 0.265, eps_growth: 0.33, rsi: 62, beta: 1.68, dividend_yield: 0.0003, fifty_two_week_high: 950, fifty_two_week_low: 475 },
  { ticker: 'AAPL', company_name: 'Apple Inc.', sector: 'Technology', score_date: '2026-03-26', qpilot_score: 78, rating: 'buy', fundamental_score: 82, technical_score: 75, momentum_score: 72, risk_score: 85, sentiment_score: 80, price: 228.30, market_cap: 3500000000000, pe_ratio: 32.1, revenue_growth: 0.048, eps_growth: 0.095, rsi: 55, beta: 1.21, dividend_yield: 0.0052, fifty_two_week_high: 260, fifty_two_week_low: 169 },
  { ticker: 'MSFT', company_name: 'Microsoft Corporation', sector: 'Technology', score_date: '2026-03-26', qpilot_score: 81, rating: 'buy', fundamental_score: 85, technical_score: 78, momentum_score: 76, risk_score: 88, sentiment_score: 82, price: 442.10, market_cap: 3290000000000, pe_ratio: 35.8, revenue_growth: 0.126, eps_growth: 0.21, rsi: 58, beta: 0.93, dividend_yield: 0.0072, fifty_two_week_high: 470, fifty_two_week_low: 362 },
  { ticker: 'META', company_name: 'Meta Platforms Inc.', sector: 'Technology', score_date: '2026-03-26', qpilot_score: 74, rating: 'buy', fundamental_score: 79, technical_score: 70, momentum_score: 75, risk_score: 65, sentiment_score: 72, price: 585.20, market_cap: 1480000000000, pe_ratio: 26.4, revenue_growth: 0.22, eps_growth: 0.35, rsi: 48, beta: 1.35, dividend_yield: 0.0035, fifty_two_week_high: 640, fifty_two_week_low: 390 },
  { ticker: 'AMZN', company_name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', score_date: '2026-03-26', qpilot_score: 71, rating: 'buy', fundamental_score: 75, technical_score: 68, momentum_score: 70, risk_score: 72, sentiment_score: 74, price: 198.40, market_cap: 2050000000000, pe_ratio: 58.7, revenue_growth: 0.11, eps_growth: 0.55, rsi: 52, beta: 1.15, dividend_yield: 0, fifty_two_week_high: 220, fifty_two_week_low: 151 },
  { ticker: 'GOOGL', company_name: 'Alphabet Inc.', sector: 'Technology', score_date: '2026-03-26', qpilot_score: 76, rating: 'buy', fundamental_score: 80, technical_score: 73, momentum_score: 74, risk_score: 80, sentiment_score: 75, price: 172.80, market_cap: 2130000000000, pe_ratio: 24.3, revenue_growth: 0.14, eps_growth: 0.28, rsi: 50, beta: 1.05, dividend_yield: 0.005, fifty_two_week_high: 195, fifty_two_week_low: 133 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your quantitative edge in the market.</p>
      </div>

      {/* Today's top stocks */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Top Rated Stocks Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TOP_STOCKS.map(stock => (
            <TickerCard key={stock.ticker} stock={stock} />
          ))}
        </div>
      </section>

      {/* Legal disclaimer */}
      <p className="text-xs text-muted-foreground/60 max-w-3xl">
        Disclaimer: QPilot provides quantitative analysis for informational purposes only.
        Not financial advice. Consult a licensed advisor before making investment decisions.
      </p>
    </div>
  );
}
