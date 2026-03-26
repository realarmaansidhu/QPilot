'use client';

import { type ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import type { SubscriptionTier } from '@/types/user';

interface PaywallGateProps {
  requiredTier: SubscriptionTier;
  children: ReactNode;
  featureName?: string;
}

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, plus: 1, pro: 2 };

/** Wraps premium features — shows upgrade prompt if user's tier is insufficient */
export function PaywallGate({ requiredTier, children, featureName = 'This feature' }: PaywallGateProps) {
  const { effectiveTier, loading } = useSubscription();

  if (loading) return null;

  if (TIER_RANK[effectiveTier] >= TIER_RANK[requiredTier]) {
    return <>{children}</>;
  }

  return (
    <Card className="border-[#00D4AA]/30 bg-[#0A1628]/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Lock className="h-10 w-10 text-[#00D4AA] mb-4" />
        <h3 className="text-lg font-semibold mb-2">{featureName} requires {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade your plan to unlock this feature.
        </p>
        <Button className="bg-[#00D4AA] text-[#0A1628] hover:bg-[#00D4AA]/90">
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
}
