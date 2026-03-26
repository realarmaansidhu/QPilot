'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Star, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScoreGauge } from '@/components/stock/ScoreGauge';
import { RatingBadge } from '@/components/stock/RatingBadge';
import { LoadingState } from '@/components/common/LoadingState';
import { useStockData } from '@/hooks/useStockData';

/** Deep-dive page for individual stock analysis */
export default function StockPage() {
  const params = useParams();
  const ticker = (params.ticker as string)?.toUpperCase() ?? '';
  const { stock, loading, error } = useStockData(ticker);
  const [analyzing, setAnalyzing] = useState(false);

  if (loading) return <LoadingState variant="report" />;

  if (error) {
    return (
      <Card className="bg-[#0A1628]/50 border-white/10">
        <CardContent className="py-16 text-center text-muted-foreground">
          <p>Could not load data for {ticker}.</p>
          <p className="text-sm mt-2">{error}</p>
        </CardContent>
      </Card>
    );
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    // TODO: Call POST /analyze/{ticker} and handle SSE streaming
    setTimeout(() => setAnalyzing(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{ticker}</h1>
            {stock?.score && <RatingBadge rating={stock.score.rating} />}
          </div>
          {stock && (
            <p className="text-muted-foreground mt-1">
              {stock.company_name} &middot; {stock.sector}
            </p>
          )}
          {stock?.price != null && (
            <p className="text-2xl font-semibold mt-2">${stock.price.toFixed(2)}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {stock?.score && <ScoreGauge score={stock.score.score} size="lg" />}
          <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Analyze button */}
      <Button
        onClick={handleAnalyze}
        disabled={analyzing}
        className="bg-[#00D4AA] text-[#0A1628] hover:bg-[#00D4AA]/90"
      >
        {analyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
        {analyzing ? 'Analyzing...' : 'Run AI Deep Dive'}
      </Button>

      {/* Report tabs (placeholder for AI report sections) */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-white/5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-[#0A1628]/50 border-white/10">
            <CardHeader><CardTitle>Company Overview</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Run an AI Deep Dive to generate a comprehensive analysis report for {ticker}.</p>
              <p className="text-sm mt-2">The report includes financial health, valuation, technical analysis, risk assessment, analyst consensus, insider activity, and sentiment analysis.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <Card className="bg-[#0A1628]/50 border-white/10">
            <CardContent className="py-12 text-center text-muted-foreground">
              Financial data will appear here after analysis.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card className="bg-[#0A1628]/50 border-white/10">
            <CardContent className="py-12 text-center text-muted-foreground">
              Technical analysis will appear here after analysis.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card className="bg-[#0A1628]/50 border-white/10">
            <CardContent className="py-12 text-center text-muted-foreground">
              Risk assessment will appear here after analysis.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card className="bg-[#0A1628]/50 border-white/10">
            <CardContent className="py-12 text-center text-muted-foreground">
              News and sentiment analysis will appear here after analysis.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground/60">
        Disclaimer: QPilot provides quantitative analysis for informational purposes only.
        Not financial advice. Consult a licensed advisor.
      </p>
    </div>
  );
}
