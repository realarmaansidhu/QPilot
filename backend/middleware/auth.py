"""Supabase JWT verification — FastAPI dependency for protected routes."""

from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from config import Settings, get_settings
from models.user import SubscriptionTier, UserProfile

_bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> UserProfile:
    """Extract and verify the Supabase JWT from the ``Authorization: Bearer <token>`` header.

    Steps:
      1. Decode the JWT using the Supabase JWT secret (derived from SUPABASE_SERVICE_KEY).
      2. Validate ``exp``, ``aud``, and ``iss`` claims.
      3. Return a ``UserProfile`` populated from the token's metadata.

    Raises ``401`` if the token is missing, expired, or invalid.
    """
    token = credentials.credentials

    try:
        # TODO: Replace stub with real JWT verification:
        #   from jose import jwt, JWTError
        #   payload = jwt.decode(
        #       token,
        #       settings.SUPABASE_SERVICE_KEY,
        #       algorithms=["HS256"],
        #       audience="authenticated",
        #   )
        #   user_id = payload.get("sub")
        #   email = payload.get("email", "")
        #   tier_raw = payload.get("user_metadata", {}).get("tier", "free")

        # ── Stub: accept any non-empty token for development ──
        if not token:
            raise ValueError("Empty token")

        return UserProfile(
            id="stub-user-id",
            email="dev@qpilot.app",
            tier=SubscriptionTier.FREE,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
