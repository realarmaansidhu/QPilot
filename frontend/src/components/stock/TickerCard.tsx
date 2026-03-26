'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { RatingBadge } from './RatingBadge';
import { ScoreGauge } from './ScoreGauge';
import type { StockScore } from '@/types/stock';

interface TickerCardProps {
  stock: StockScore;
}

/** Compact card for leaderboard/screener — links to deep-dive page */
export function TickerCard({ stock }: TickerCardProps) {
  const formatPrice = (n: number | null) => n != null ? `$${n.toFixed(2)}` : '—';
  const formatPct = (n: number | null) => n != null ? `${(n * 100).toFixed(1)}%` : '—';
  const formatCap = (n: number | null) => {
    if (n == null) return '—';
    if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    return `$${(n / 1e6).toFixed(0)}M`;
  };

  return (
    <Link href={`/stock/${stock.ticker}`}>
      <Card className="hover:border-[#00D4AA]/50 transition-colors cursor-pointer bg-[#0A1628]/50 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left: ticker + company */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{stock.ticker}</span>
                <RatingBadge rating={stock.rating} />
              </div>
              <p className="text-sm text-muted-foreground truncate">{stock.company_name}</p>
              <p className="text-xs text-muted-foreground mt-1">{stock.sector}</p>
            </div>

            {/* Right: score gauge */}
            <ScoreGauge score={stock.qpilot_score} size="sm" />
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-4 gap-2 mt-3 text-xs text-muted-foreground">
            <div>
              <span className="block font-medium text-foreground">{formatPrice(stock.price)}</span>
              Price
            </div>
            <div>
              <span className="block font-medium text-foreground">{formatCap(stock.market_cap)}</span>
              Mkt Cap
            </div>
            <div>
              <span className="block font-medium text-foreground">{stock.pe_ratio?.toFixed(1) ?? '—'}</span>
              P/E
            </div>
            <div>
              <span className="block font-medium text-foreground">{formatPct(stock.revenue_growth)}</span>
              Rev Growth
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
