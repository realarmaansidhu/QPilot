'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Key, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiKeyInput } from '@/components/common/ApiKeyInput';
import type { LLMProvider } from '@/types/user';

const STEPS = ['Welcome', 'API Key', 'Ready'];

/** First-run onboarding wizard — guides users through API key setup */
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  async function handleSaveKey(provider: LLMProvider, key: string) {
    // TODO: Save key via backend, then advance
    setStep(2);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-lg bg-[#0A1628]/50 border-white/10">
        <CardContent className="p-8">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? 'bg-[#00D4AA] text-[#0A1628]' : 'bg-white/10 text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 h-0.5 ${i < step ? 'bg-[#00D4AA]' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center space-y-4">
              <TrendingUp className="h-12 w-12 text-[#00D4AA] mx-auto" />
              <h2 className="text-2xl font-bold">Welcome to QPilot</h2>
              <p className="text-muted-foreground">
                Your quantitative edge in the market. QPilot uses AI to analyze stocks and
                help you make informed investment decisions.
              </p>
              <p className="text-sm text-muted-foreground">
                To get started, you&apos;ll need to provide your own LLM API key. Your key is
                encrypted and stored securely — QPilot never sees your queries.
              </p>
              <Button onClick={() => setStep(1)} className="bg-[#00D4AA] text-[#0A1628] hover:bg-[#00D4AA]/90">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 1: API Key */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <Key className="h-10 w-10 text-[#00D4AA] mx-auto mb-2" />
                <h2 className="text-xl font-bold">Connect Your AI Provider</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose your preferred LLM provider and enter your API key.
                </p>
              </div>
              <ApiKeyInput onSave={handleSaveKey} />
              <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="w-full text-muted-foreground">
                Skip for now
              </Button>
            </div>
          )}

          {/* Step 2: Ready */}
          {step === 2 && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-[#00D4AA] mx-auto" />
              <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
              <p className="text-muted-foreground">
                Start exploring the S&P 500 screener or dive deep into any stock.
              </p>
              <Button onClick={() => router.push('/dashboard')} className="bg-[#00D4AA] text-[#0A1628] hover:bg-[#00D4AA]/90">
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
