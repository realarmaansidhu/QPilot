"""Screener / leaderboard router — returns ranked stock scores."""

from __future__ import annotations

from fastapi import APIRouter, Query

from models.stock import ScreenerResponse, StockScore

router = APIRouter(prefix="/screener", tags=["screener"])


@router.get("", response_model=ScreenerResponse)
async def get_leaderboard(
    sector: str | None = Query(None, description="Filter by GICS sector"),
    min_score: float | None = Query(None, ge=0, le=100, description="Minimum QPilot Score"),
    rating: str | None = Query(None, description="Filter by rating (strong_buy, buy, hold, sell, strong_sell)"),
    sort_by: str = Query("score", description="Sort field (score, ticker, sector)"),
    limit: int = Query(25, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
) -> ScreenerResponse:
    """Return the QPilot leaderboard with optional filters.

    Data is sourced from the pre-computed batch screening cache (Redis).
    Falls back to mock data until the batch screener is wired up.
    """
    # TODO: read from services/cache.py -> Redis leaderboard
    mock_scores = [
        StockScore(
            ticker="AAPL",
            company_name="Apple Inc.",
            sector="Technology",
            score=82.5,
            rating="strong_buy",
            fundamental=85.0,
            technical=78.0,
            momentum=80.0,
            risk=88.0,
            sentiment=82.0,
        ),
        StockScore(
            ticker="MSFT",
            company_name="Microsoft Corporation",
            sector="Technology",
            score=79.3,
            rating="buy",
            fundamental=82.0,
            technical=75.0,
            momentum=77.0,
            risk=85.0,
            sentiment=78.0,
        ),
    ]
    return ScreenerResponse(
        results=mock_scores,
        total=len(mock_scores),
        limit=limit,
        offset=offset,
    )
