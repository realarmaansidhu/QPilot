"""Watchlist CRUD router — per-user ticker watchlist backed by Supabase."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from middleware.auth import get_current_user
from models.user import UserProfile

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


@router.get("")
async def get_watchlist(
    current_user: UserProfile = Depends(get_current_user),
) -> dict:
    """Return the authenticated user's watchlist with latest scores.

    Each entry includes the ticker, company name, and most recent QPilot Score.
    """
    # TODO: query Supabase watchlist table joined with latest scores
    return {
        "user_id": current_user.id,
        "tickers": [
            {"ticker": "AAPL", "added_at": "2026-01-15T10:30:00Z", "score": 82.5},
            {"ticker": "MSFT", "added_at": "2026-02-01T14:00:00Z", "score": 79.3},
        ],
    }


@router.post("/{ticker}")
async def add_to_watchlist(
    ticker: str,
    current_user: UserProfile = Depends(get_current_user),
) -> dict:
    """Add *ticker* to the authenticated user's watchlist."""
    # TODO: insert into Supabase watchlist table (upsert to avoid duplicates)
    return {"status": "added", "ticker": ticker.upper(), "user_id": current_user.id}


@router.delete("/{ticker}")
async def remove_from_watchlist(
    ticker: str,
    current_user: UserProfile = Depends(get_current_user),
) -> dict:
    """Remove *ticker* from the authenticated user's watchlist."""
    # TODO: delete from Supabase watchlist table
    return {"status": "removed", "ticker": ticker.upper(), "user_id": current_user.id}
