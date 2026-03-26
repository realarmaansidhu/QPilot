"""Dual-layer cache service — in-memory dict (L1) + Upstash Redis (L2).

Read path:  L1 -> L2 -> miss
Write path: write to both L1 and L2

The in-memory layer avoids Redis round-trips for hot keys (e.g. S&P 500
leaderboard) and is invalidated on TTL or explicit flush.
"""

from __future__ import annotations

import json
import time
from typing import Any

import httpx

from config import get_settings


class CacheService:
    """Dual-layer cache backed by a local dict and Upstash Redis REST API."""

    def __init__(self) -> None:
        self._memory: dict[str, tuple[Any, float]] = {}  # key -> (value, expires_at)
        settings = get_settings()
        self._redis_url = settings.UPSTASH_REDIS_REST_URL
        self._redis_token = settings.UPSTASH_REDIS_REST_TOKEN

    # ── L1: memory ──────────────────────────────────────────────

    def _mem_get(self, key: str) -> Any | None:
        entry = self._memory.get(key)
        if entry is None:
            return None
        value, expires_at = entry
        if expires_at and time.time() > expires_at:
            del self._memory[key]
            return None
        return value

    def _mem_set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        expires_at = time.time() + ttl_seconds if ttl_seconds else 0.0
        self._memory[key] = (value, expires_at)

    # ── L2: Upstash Redis REST ──────────────────────────────────

    async def _redis_get(self, key: str) -> Any | None:
        """GET from Upstash Redis via REST API."""
        if not self._redis_url:
            return None
        # TODO: implement with httpx
        #   async with httpx.AsyncClient() as client:
        #       resp = await client.get(
        #           f"{self._redis_url}/get/{key}",
        #           headers={"Authorization": f"Bearer {self._redis_token}"},
        #       )
        #       data = resp.json()
        #       return json.loads(data["result"]) if data.get("result") else None
        return None

    async def _redis_set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """SET on Upstash Redis via REST API."""
        if not self._redis_url:
            return
        # TODO: implement with httpx
        #   async with httpx.AsyncClient() as client:
        #       await client.post(
        #           f"{self._redis_url}/set/{key}",
        #           headers={"Authorization": f"Bearer {self._redis_token}"},
        #           json={"value": json.dumps(value), "EX": ttl_seconds},
        #       )

    # ── Public API ──────────────────────────────────────────────

    async def get(self, key: str) -> Any | None:
        """Read-through: L1 -> L2 -> None."""
        hit = self._mem_get(key)
        if hit is not None:
            return hit
        hit = await self._redis_get(key)
        if hit is not None:
            self._mem_set(key, hit)
        return hit

    async def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """Write-through: L1 + L2."""
        self._mem_set(key, value, ttl_seconds)
        await self._redis_set(key, value, ttl_seconds)

    def flush_memory(self) -> None:
        """Clear the in-memory L1 cache."""
        self._memory.clear()


# Module-level singleton
cache = CacheService()
