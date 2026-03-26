"""Screening Agent — fast quantitative pre-screen using OpenBB MCP tools.

This agent gathers baseline financial data for a ticker:
  - Key fundamentals (P/E, EPS, revenue growth, margins)
  - Technical indicators (RSI, MACD, moving averages)
  - Price / volume summary

The output is a structured dict consumed by the supervisor to fan-out
the parallel deep-analysis agents.
"""

from __future__ import annotations

from typing import Any


async def run_screening(ticker: str, *, tools: list[Any] | None = None) -> dict[str, Any]:
    """Execute the screening pass for *ticker*.

    Parameters
    ----------
    ticker:
        Equity ticker symbol.
    tools:
        MCP-adapter tool handles bound to the OpenBB server.

    Returns
    -------
    dict with keys: ``fundamentals``, ``technicals``, ``price_summary``.
    """
    # TODO: Use langchain-mcp-adapters to call OpenBB MCP tools
    raise NotImplementedError(
        "ScreeningAgent not yet implemented — "
        "call OpenBB equity.fundamental and equity.technical endpoints via MCP here."
    )
