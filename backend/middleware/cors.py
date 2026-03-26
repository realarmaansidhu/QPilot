"""CORS configuration helper."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def add_cors_middleware(app: FastAPI, *, allowed_origins: list[str] | None = None) -> None:
    """Attach CORS middleware to *app*.

    Parameters
    ----------
    app:
        The FastAPI application instance.
    allowed_origins:
        Explicit list of allowed origins.  Defaults to ``["http://localhost:3000"]``
        for local development.
    """
    origins = allowed_origins or ["http://localhost:3000"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
