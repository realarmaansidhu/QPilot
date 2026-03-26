"""QPilot scoring algorithm utilities — statistical helpers for sub-score computation.

These functions operate on numpy/pandas data and produce normalised 0-100 scores
consumed by ``agents/tools/scoring.py``.
"""

from __future__ import annotations

import numpy as np
import pandas as pd


def normalise_to_score(
    value: float,
    *,
    min_val: float,
    max_val: float,
    invert: bool = False,
) -> float:
    """Linearly map *value* from [min_val, max_val] to [0, 100].

    If *invert* is True, the mapping is reversed (useful for risk metrics
    where lower raw values are better).
    """
    if max_val == min_val:
        return 50.0
    clamped = max(min(value, max_val), min_val)
    ratio = (clamped - min_val) / (max_val - min_val)
    if invert:
        ratio = 1.0 - ratio
    return round(ratio * 100.0, 2)


def compute_momentum_score(prices: pd.Series) -> float:
    """Derive a momentum sub-score from a price series.

    Considers:
      - 20-day vs 50-day moving average crossover
      - Rate-of-change (ROC) over 14 days
      - RSI (relative strength index) proximity to overbought/oversold

    Returns a score in [0, 100].
    """
    if len(prices) < 50:
        return 50.0  # insufficient data

    # TODO: implement real momentum calculation
    #   ma20 = prices.rolling(20).mean().iloc[-1]
    #   ma50 = prices.rolling(50).mean().iloc[-1]
    #   roc = (prices.iloc[-1] - prices.iloc[-14]) / prices.iloc[-14] * 100
    #   ...

    return 50.0  # placeholder


def compute_volatility(prices: pd.Series, window: int = 30) -> float:
    """Annualised volatility from a daily price series over *window* days."""
    if len(prices) < window:
        return 0.0
    log_returns = np.log(prices / prices.shift(1)).dropna()
    recent = log_returns.tail(window)
    return float(recent.std() * np.sqrt(252) * 100)  # annualised %
