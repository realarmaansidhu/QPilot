'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/** User's saved tickers watchlist */
export default function WatchlistPage() {
  // TODO: Fetch from GET /watchlist
  const watchlist: [] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Watchlist</h1>
        <p className="text-muted-foreground mt-1">Your saved tickers with latest QPilot Scores.</p>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* TickerCards will render here */}
        </div>
      ) : (
        <Card className="bg-[#0A1628]/50 border-white/10">
          <CardContent className="py-16 text-center text-muted-foreground">
            <Star className="h-10 w-10 mx-auto mb-4 text-[#00D4AA]/50" />
            <p className="text-lg mb-2">No stocks in your watchlist yet</p>
            <p className="text-sm">Search for a ticker or browse the screener to add stocks.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
