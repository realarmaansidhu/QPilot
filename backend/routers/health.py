"""Health-check endpoint."""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def healthcheck() -> dict[str, str]:
    """Lightweight liveness probe."""
    return {"status": "ok", "service": "qpilot-api"}
