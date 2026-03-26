"""Analysis router — triggers the LangGraph agent pipeline and streams results via SSE."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from middleware.auth import get_current_user
from models.analysis import AnalysisRequest
from models.user import UserProfile

router = APIRouter(prefix="/analyze", tags=["analysis"])


async def _stream_analysis(ticker: str, request: AnalysisRequest) -> str:
    """Placeholder SSE generator.

    In production this will:
      1. Invoke the LangGraph supervisor with the ticker.
      2. Yield ``data: {json}`` events as each agent completes a section.
      3. Persist the final AnalysisReport to Supabase.
    """
    # TODO: wire up agents/supervisor.py
    yield f"data: {{\"section\": \"start\", \"ticker\": \"{ticker}\"}}\n\n"
    yield f"data: {{\"section\": \"screening\", \"status\": \"pending\"}}\n\n"
    yield f"data: {{\"section\": \"deepdive\", \"status\": \"pending\"}}\n\n"
    yield f"data: {{\"section\": \"risk\", \"status\": \"pending\"}}\n\n"
    yield f"data: {{\"section\": \"sentiment\", \"status\": \"pending\"}}\n\n"
    yield f"data: {{\"section\": \"complete\", \"ticker\": \"{ticker}\", \"score\": 75.0}}\n\n"


@router.post("/{ticker}")
async def analyze_ticker(
    ticker: str,
    request: AnalysisRequest | None = None,
    current_user: UserProfile = Depends(get_current_user),
) -> StreamingResponse:
    """Run a full QPilot analysis on *ticker* and stream the results as SSE.

    Requires authentication.  Rate-limited per subscription tier.
    """
    req = request or AnalysisRequest()
    return StreamingResponse(
        _stream_analysis(ticker.upper(), req),
        media_type="text/event-stream",
    )
