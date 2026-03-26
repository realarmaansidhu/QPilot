"""OpenBB Platform SDK client — initialisation and helper utilities.

Wraps the ``openbb`` Python SDK so the rest of the codebase can import a
pre-configured client without caring about credential setup.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Any

from config import get_settings


@lru_cache
def get_openbb_client() -> Any:
    """Return a configured OpenBB ``OBBject`` client.

    The client is created once per process and cached.  It uses the
    ``OPENBB_TOKEN`` and ``FMP_API_KEY`` from settings.

    Returns
    -------
    An initialised ``openbb.obb`` instance.
    """
    settings = get_settings()

    # TODO: Initialise the OpenBB SDK
    #
    # from openbb import obb
    # obb.account.login(pat=settings.OPENBB_TOKEN)
    # # Configure FMP as the default provider for equity data
    # obb.user.preferences.default_provider = "fmp"
    # obb.user.credentials.fmp_api_key = settings.FMP_API_KEY
    # return obb

    raise NotImplementedError(
        "OpenBB client not yet initialised — "
        "set OPENBB_TOKEN and FMP_API_KEY in .env and uncomment the code above."
    )
