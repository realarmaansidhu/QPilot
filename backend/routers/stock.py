"""Stock detail router — individual ticker data + latest QPilot Score."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from models.stock import StockProfile, StockScore

router = APIRouter(prefix="/stock", tags=["stock"])


@router.get("/{ticker}", response_model=StockProfile)
async def get_stock(ticker: str) -> StockProfile:
    """Return basic profile and latest QPilot Score for *ticker*.

    Data is composed from:
      - OpenBB equity profile (cached)
      - Most recent QPilot Score from Supabase / Redis
    """
    # TODO: fetch real data from services/openbb_client.py + cache
    ticker = ticker.upper()
    if ticker not in ("AAPL", "MSFT", "GOOGL"):
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found in cache")

    return StockProfile(
        ticker=ticker,
        company_name=f"{ticker} Inc.",
        sector="Technology",
        market_cap=3_000_000_000_000,
        price=185.50,
        change_pct=1.25,
        score=StockScore(
            ticker=ticker,
            company_name=f"{ticker} Inc.",
            sector="Technology",
            score=82.5,
            rating="strong_buy",
            fundamental=85.0,
            technical=78.0,
            momentum=80.0,
            risk=88.0,
            sentiment=82.0,
        ),
    )
