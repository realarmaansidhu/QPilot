"""S&P 500 constituent list manager.

Maintains an in-memory list of S&P 500 tickers, refreshable from
Wikipedia or a local JSON fallback.  Used by the batch screener
and for ticker validation.
"""

from __future__ import annotations

import json
from pathlib import Path

# Fallback: a small representative sample (full list loaded at runtime)
_SAMPLE_TICKERS: list[str] = [
    "AAPL", "ABBV", "ABT", "ACN", "ADBE", "AMD", "AMGN", "AMZN", "AVGO", "BAC",
    "BRK-B", "CAT", "COP", "COST", "CRM", "CSCO", "CVX", "DHR", "DIS", "GOOGL",
    "GS", "HD", "HON", "IBM", "INTC", "JNJ", "JPM", "KO", "LIN", "LLY",
    "MA", "MCD", "META", "MRK", "MSFT", "NEE", "NFLX", "NKE", "NVDA", "ORCL",
    "PEP", "PFE", "PG", "PM", "QCOM", "RTX", "SBUX", "T", "TMO", "TSLA",
    "TXN", "UNH", "UNP", "UPS", "V", "VZ", "WFC", "WMT", "XOM",
]

_cached_list: list[str] | None = None


async def get_sp500_tickers(*, force_refresh: bool = False) -> list[str]:
    """Return the current S&P 500 constituent ticker list.

    On first call (or when *force_refresh* is True), attempts to fetch from
    an external source.  Falls back to the built-in sample list.
    """
    global _cached_list

    if _cached_list is not None and not force_refresh:
        return _cached_list

    # TODO: fetch from Wikipedia / OpenBB / local JSON
    #   try:
    #       import pandas as pd
    #       table = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")
    #       _cached_list = sorted(table[0]["Symbol"].tolist())
    #   except Exception:
    #       _cached_list = _SAMPLE_TICKERS

    _cached_list = _SAMPLE_TICKERS
    return _cached_list


def is_valid_ticker(ticker: str) -> bool:
    """Quick synchronous check whether *ticker* is in the cached S&P 500 list."""
    if _cached_list is None:
        return ticker.upper() in _SAMPLE_TICKERS
    return ticker.upper() in _cached_list
