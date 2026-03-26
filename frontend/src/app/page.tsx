import Link from 'next/link';
import { TrendingUp, BarChart3, Search, Zap, ArrowRight, Check } from 'lucide-react';

/** QPilot landing page — marketing, features, pricing */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#00D4AA]" />
            <span className="text-xl font-bold"><span className="text-[#00D4AA]">Q</span>Pilot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="text-sm bg-[#00D4AA] text-[#0A1628] px-4 py-2 rounded-lg font-medium hover:bg-[#00D4AA]/90 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-[#00D4AA]/10 text-[#00D4AA] px-3 py-1 rounded-full text-sm mb-6">
          <Zap className="h-3.5 w-3.5" /> Powered by OpenBB + AI Agents
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Your <span className="text-[#00D4AA]">Quantitative Edge</span><br />in the Market
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          AI-powered stock analysis that gives retail investors institutional-grade insights.
          Screen the S&amp;P 500, get deep-dive reports, and make informed investment decisions.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/login" className="inline-flex items-center gap-2 bg-[#00D4AA] text-[#0A1628] px-6 py-3 rounded-lg font-semibold hover:bg-[#00D4AA]/90 transition-colors">
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">
            Learn more
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Two Powerful Features, One Platform</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-[#00D4AA]" />}
            title="S&P 500 Screener"
            description="Daily AI-scored leaderboard of all 500 stocks. Filter by sector, score, rating. See the top picks at a glance."
            features={['QPilot Score (0-100)', 'Strong Buy to Strong Sell ratings', 'Filter by sector & market cap', 'Updated daily pre-market']}
          />
          <FeatureCard
            icon={<Search className="h-8 w-8 text-[#00D4AA]" />}
            title="AI Deep-Dive Agent"
            description="Comprehensive 10-section analysis for any S&P 500 stock. Financials, technicals, risk, sentiment — all powered by AI."
            features={['10-section research report', 'Streamed in real-time (SSE)', '350+ data endpoints via OpenBB', 'Uses your own LLM API key']}
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-muted-foreground mb-12">Start free. Upgrade when you need more.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <PricingCard tier="Free" price={0} features={['5 AI analyses per day', 'Top 20 stocks in screener', 'Basic sort & filter', 'QPilot Score for all stocks']} />
          <PricingCard tier="Plus" price={15} popular features={['50 AI analyses per day', 'Full S&P 500 screener', 'All filters & sorts', 'Priority analysis queue']} />
          <PricingCard tier="Pro" price={39} features={['Unlimited AI analyses', 'Full S&P 500 screener', 'CSV export', 'API access (coming soon)']} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-[#00D4AA]" />
              QPilot by Realize Labs
            </div>
            <div className="text-xs text-muted-foreground">
              &copy; 2026 Realize Labs. All rights reserved.
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-4 max-w-4xl">
            Disclaimer: QPilot provides quantitative analysis and algorithmic stock ratings
            for educational and informational purposes only. QPilot is not a registered investment
            advisor, broker-dealer, or financial planner. The ratings, scores, and analysis
            presented do not constitute investment advice, recommendations, or solicitations
            to buy or sell any securities. All analysis is generated algorithmically and is
            impersonal in nature. Past performance does not guarantee future results. Investing
            involves risk, including loss of principal. Always consult a qualified financial
            advisor before making investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, features }: { icon: React.ReactNode; title: string; description: string; features: string[] }) {
  return (
    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      {icon}
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-[#00D4AA] flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({ tier, price, features, popular }: { tier: string; price: number; features: string[]; popular?: boolean }) {
  return (
    <div className={`relative border rounded-xl p-6 ${popular ? 'border-[#00D4AA] bg-[#00D4AA]/5' : 'border-white/10 bg-white/[0.02]'}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D4AA] text-[#0A1628] text-xs font-semibold px-3 py-0.5 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-lg font-semibold">{tier}</h3>
      <div className="mt-2 mb-4">
        <span className="text-4xl font-bold">${price}</span>
        {price > 0 && <span className="text-muted-foreground">/mo</span>}
      </div>
      <ul className="space-y-2 mb-6">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-[#00D4AA] flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={`block text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
          popular
            ? 'bg-[#00D4AA] text-[#0A1628] hover:bg-[#00D4AA]/90'
            : 'border border-white/10 hover:bg-white/5'
        }`}
      >
        {price === 0 ? 'Get Started Free' : 'Start 14-Day Trial'}
      </Link>
    </div>
  );
}
