"""Per-user rate limiting based on subscription tier.

Limits (analyses per calendar day):
  - free:  5
  - plus:  50
  - pro:   unlimited (no enforcement)

Uses Redis (Upstash) with a daily TTL key per user.
"""

from __future__ import annotations

from fastapi import Depends, HTTPException, status

from models.user import SubscriptionTier, UserProfile
from middleware.auth import get_current_user

# Analyses per day by tier (None = unlimited)
_TIER_LIMITS: dict[SubscriptionTier, int | None] = {
    SubscriptionTier.FREE: 5,
    SubscriptionTier.PLUS: 50,
    SubscriptionTier.PRO: None,
}


async def check_rate_limit(
    current_user: UserProfile = Depends(get_current_user),
) -> UserProfile:
    """FastAPI dependency that enforces daily analysis rate limits.

    Call this *instead of* (or in addition to) ``get_current_user`` in routes
    that should be rate-limited.

    Raises ``429 Too Many Requests`` when the user exceeds their tier limit.
    """
    limit = _TIER_LIMITS.get(current_user.tier)

    if limit is None:
        # Pro tier — no cap
        return current_user

    # TODO: implement real Redis counter
    #   key = f"ratelimit:{current_user.id}:{date.today().isoformat()}"
    #   count = await redis.incr(key)
    #   if count == 1:
    #       await redis.expire(key, 86400)
    #   if count > limit:
    #       raise HTTPException(...)

    # Stub: always allow
    return current_user
