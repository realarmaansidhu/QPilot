'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TickerCard } from '@/components/stock/TickerCard';
import type { StockScore, Rating } from '@/types/stock';

const SECTORS = ['All', 'Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Energy', 'Industrials', 'Communication Services', 'Utilities', 'Materials', 'Real Estate', 'Consumer Staples'];

/** S&P 500 screener with filters and leaderboard */
export default function ScreenerPage() {
  const [sector, setSector] = useState('All');
  const [minScore, setMinScore] = useState(0);

  // TODO: Replace with real API call to GET /screener
  const stocks: StockScore[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">S&P 500 Screener</h1>
        <p className="text-muted-foreground mt-1">Filter and rank stocks by QPilot Score.</p>
      </div>

      {/* Filter panel */}
      <Card className="bg-[#0A1628]/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sector filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sector</label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map(s => (
                <Badge
                  key={s}
                  variant={sector === s ? 'default' : 'outline'}
                  className={`cursor-pointer ${sector === s ? 'bg-[#00D4AA] text-[#0A1628]' : 'hover:bg-white/10'}`}
                  onClick={() => setSector(s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Score filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Min Score:</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-20 bg-white/5 border-white/10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {stocks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map(stock => (
            <TickerCard key={stock.ticker} stock={stock} />
          ))}
        </div>
      ) : (
        <Card className="bg-[#0A1628]/50 border-white/10">
          <CardContent className="py-16 text-center text-muted-foreground">
            <p className="text-lg mb-2">Screener data loading...</p>
            <p className="text-sm">The S&P 500 screener will populate once the daily batch job runs.</p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground/60">
        Disclaimer: QPilot provides quantitative analysis for informational purposes only.
        Not financial advice.
      </p>
    </div>
  );
}
