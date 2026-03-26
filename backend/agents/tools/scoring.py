"""QPilot Score calculation — composite scoring algorithm.

Weights
=======
  - Fundamental:  35 %
  - Technical:    25 %
  - Momentum:     20 %
  - Risk:         10 %  (inverted: higher = safer)
  - Sentiment:    10 %

Score range: 0 - 100.

Rating thresholds:
  - >= 80  -> strong_buy
  - >= 65  -> buy
  - >= 50  -> hold
  - >= 35  -> sell
  - <  35  -> strong_sell
"""

from __future__ import annotations

from models.stock import StockScore

# Weights must sum to 1.0
WEIGHTS: dict[str, float] = {
    "fundamental": 0.35,
    "technical": 0.25,
    "momentum": 0.20,
    "risk": 0.10,
    "sentiment": 0.10,
}

_RATING_THRESHOLDS: list[tuple[float, str]] = [
    (80.0, "strong_buy"),
    (65.0, "buy"),
    (50.0, "hold"),
    (35.0, "sell"),
    (0.0, "strong_sell"),
]


def score_to_rating(score: float) -> str:
    """Map a composite score (0-100) to a human-readable rating string."""
    for threshold, rating in _RATING_THRESHOLDS:
        if score >= threshold:
            return rating
    return "strong_sell"


def compute_qpilot_score(
    *,
    ticker: str,
    company_name: str,
    sector: str,
    fundamental: float,
    technical: float,
    momentum: float,
    risk: float,
    sentiment: float,
) -> StockScore:
    """Calculate the composite QPilot Score from sub-scores.

    All sub-scores should be in the 0-100 range.

    Returns a fully populated ``StockScore`` model.
    """
    composite = (
        fundamental * WEIGHTS["fundamental"]
        + technical * WEIGHTS["technical"]
        + momentum * WEIGHTS["momentum"]
        + risk * WEIGHTS["risk"]
        + sentiment * WEIGHTS["sentiment"]
    )
    composite = round(min(max(composite, 0.0), 100.0), 2)

    return StockScore(
        ticker=ticker,
        company_name=company_name,
        sector=sector,
        score=composite,
        rating=score_to_rating(composite),
        fundamental=fundamental,
        technical=technical,
        momentum=momentum,
        risk=risk,
        sentiment=sentiment,
    )
