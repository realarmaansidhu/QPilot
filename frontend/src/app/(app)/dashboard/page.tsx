'use client';

import { TickerCard } from '@/components/stock/TickerCard';
import type { StockScore } from '@/types/stock';

// Mock data for initial scaffold — replaced with real API calls in Sprint 2
const MOCK_TOP_STOCKS: StockScore[] = [
  { ticker: 'NVDA', company_name: 'NVIDIA Corporation', sector: 'Technology', score: 92, rating: 'strong_buy', fundamental: 88, technical: 95, momentum: 94, risk: 78, sentiment: 90 },
  { ticker: 'AAPL', company_name: 'Apple Inc.', sector: 'Technology', score: 82.5, rating: 'strong_buy', fundamental: 85, technical: 78, momentum: 80, risk: 88, sentiment: 82 },
  { ticker: 'MSFT', company_name: 'Microsoft Corporation', sector: 'Technology', score: 79.3, rating: 'buy', fundamental: 82, technical: 75, momentum: 77, risk: 85, sentiment: 78 },
  { ticker: 'META', company_name: 'Meta Platforms Inc.', sector: 'Technology', score: 74, rating: 'buy', fundamental: 79, technical: 70, momentum: 75, risk: 65, sentiment: 72 },
  { ticker: 'AMZN', company_name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', score: 71, rating: 'buy', fundamental: 75, technical: 68, momentum: 70, risk: 72, sentiment: 74 },
  { ticker: 'GOOGL', company_name: 'Alphabet Inc.', sector: 'Technology', score: 76, rating: 'buy', fundamental: 80, technical: 73, momentum: 74, risk: 80, sentiment: 75 },
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
