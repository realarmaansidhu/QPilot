"""Pydantic models for stock data, QPilot Score, and screener responses."""

from __future__ import annotations

from pydantic import BaseModel, Field


class StockScore(BaseModel):
    """QPilot composite score for a single equity.

    The overall *score* is a weighted blend:
      - fundamental  35 %
      - technical    25 %
      - momentum     20 %
      - risk         10 %
      - sentiment    10 %
    """

    ticker: str
    company_name: str
    sector: str
    score: float = Field(..., ge=0, le=100, description="Composite QPilot Score (0-100)")
    rating: str = Field(
        ..., description="Derived rating: strong_buy | buy | hold | sell | strong_sell"
    )

    # Sub-scores
    fundamental: float = Field(0.0, ge=0, le=100)
    technical: float = Field(0.0, ge=0, le=100)
    momentum: float = Field(0.0, ge=0, le=100)
    risk: float = Field(0.0, ge=0, le=100)
    sentiment: float = Field(0.0, ge=0, le=100)


class StockProfile(BaseModel):
    """Extended profile for the stock detail page."""

    ticker: str
    company_name: str
    sector: str
    market_cap: float | None = None
    price: float | None = None
    change_pct: float | None = None
    score: StockScore | None = None


class ScreenerResponse(BaseModel):
    """Paginated response for the screener / leaderboard endpoint."""

    results: list[StockScore]
    total: int
    limit: int
    offset: int
