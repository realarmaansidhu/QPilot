"""Pydantic models for user profiles and subscription tiers."""

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class SubscriptionTier(str, Enum):
    """QPilot subscription tiers — controls rate limits and feature access."""

    FREE = "free"
    PLUS = "plus"
    PRO = "pro"


class UserProfile(BaseModel):
    """Authenticated user profile (derived from Supabase JWT + metadata)."""

    id: str = Field(..., description="Supabase auth.users UUID")
    email: str = ""
    tier: SubscriptionTier = SubscriptionTier.FREE
    stripe_customer_id: str | None = None
