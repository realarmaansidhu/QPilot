"""QPilot API — FastAPI application factory."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI

from config import get_settings
from middleware.cors import add_cors_middleware
from routers import analysis, health, screener, stock, watchlist


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup / shutdown lifecycle hook.

    Startup:
      - Warm in-memory caches (S&P 500 list, etc.)
      - Initialize Redis connection pool
    Shutdown:
      - Drain Redis pool
    """
    # ── startup ──
    # TODO: initialise cache, redis pool, openbb client
    yield
    # ── shutdown ──
    # TODO: cleanup resources


def create_app() -> FastAPI:
    """Build and return the configured FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="QPilot API",
        description="AI-powered stock analysis SaaS — LangGraph + OpenBB MCP",
        version="0.1.0",
        lifespan=lifespan,
    )

    # Middleware
    add_cors_middleware(app, allowed_origins=[settings.FRONTEND_URL])

    # Routers
    app.include_router(health.router)
    app.include_router(analysis.router)
    app.include_router(screener.router)
    app.include_router(stock.router)
    app.include_router(watchlist.router)

    return app


app = create_app()
