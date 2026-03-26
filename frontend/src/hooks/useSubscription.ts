'use client';

import { useMemo } from 'react';
import { useUser } from './useUser';
import { TIER_LIMITS, type SubscriptionTier } from '@/types/user';

/** Hook to check subscription status, trial, and analysis limits */
export function useSubscription() {
  const { profile, loading } = useUser();

  return useMemo(() => {
    const tier: SubscriptionTier = profile?.subscription_tier ?? 'free';
    const limits = TIER_LIMITS[tier];

    const trialEndsAt = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const isTrialActive = trialEndsAt ? trialEndsAt > new Date() : false;

    // During trial, user gets pro-level access
    const effectiveTier: SubscriptionTier = isTrialActive ? 'pro' : tier;
    const effectiveLimits = TIER_LIMITS[effectiveTier];

    const remainingAnalyses = effectiveLimits.analyses_per_day - (profile?.daily_analysis_count ?? 0);
    const canAnalyze = remainingAnalyses > 0;

    return {
      tier,
      effectiveTier,
      isTrialActive,
      trialEndsAt,
      canAnalyze,
      remainingAnalyses: Math.max(0, remainingAnalyses),
      limits: effectiveLimits,
      loading,
    };
  }, [profile, loading]);
}
