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
            <ScoreGauge score={stock.score} size="sm" />
          </div>

          {/* Sub-score breakdown */}
          <div className="grid grid-cols-5 gap-2 mt-3 text-xs text-muted-foreground">
            <div>
              <span className="block font-medium text-foreground">{stock.fundamental.toFixed(0)}</span>
              Fund
            </div>
            <div>
              <span className="block font-medium text-foreground">{stock.technical.toFixed(0)}</span>
              Tech
            </div>
            <div>
              <span className="block font-medium text-foreground">{stock.momentum.toFixed(0)}</span>
              Momen
            </div>
            <div>
              <span className="block font-medium text-foreground">{stock.risk.toFixed(0)}</span>
              Risk
            </div>
            <div>
              <span className="block font-medium text-foreground">{stock.sentiment.toFixed(0)}</span>
              Sent
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
