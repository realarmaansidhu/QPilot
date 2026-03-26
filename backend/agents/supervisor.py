"""LangGraph supervisor — orchestrates the QPilot 4-agent analysis pipeline.

Architecture
============
The supervisor implements a **hierarchical multi-agent** pattern using LangGraph:

    Supervisor
      |
      +-- ScreeningAgent   (fast quantitative pre-screen)
      +-- DeepDiveAgent    (fundamental + technical deep analysis)
      +-- RiskAgent        (risk assessment: volatility, beta, drawdown)
      +-- SentimentAgent   (news & social sentiment scoring)

Flow
----
1. The supervisor receives a ticker and user preferences.
2. It dispatches the **ScreeningAgent** first to gather base financial data
   via the OpenBB MCP tools.
3. Using the screening output, it fans out **DeepDiveAgent**, **RiskAgent**,
   and **SentimentAgent** in parallel.
4. Each sub-agent returns structured JSON that the supervisor merges into a
   single ``AnalysisReport``.
5. The supervisor computes the composite QPilot Score using the weighted
   algorithm (see agents/tools/scoring.py) and streams the final report
   section-by-section via SSE.

All sub-agents use **langchain-mcp-adapters** to call the OpenBB MCP server
for market data, ensuring a clean tool-boundary separation.
"""

from __future__ import annotations

from typing import Any

# from langgraph.graph import StateGraph, END


async def build_analysis_graph(
    ticker: str,
    *,
    llm_provider: str = "openai",
    api_key: str = "",
) -> Any:
    """Construct and return a compiled LangGraph for full ticker analysis.

    Parameters
    ----------
    ticker:
        The equity ticker symbol (e.g. ``AAPL``).
    llm_provider:
        Which LLM backend to use (``openai``, ``anthropic``, ``google``).
    api_key:
        The user's own API key for the chosen provider.

    Returns
    -------
    A compiled LangGraph ``Runnable`` ready to ``.astream()`` events.
    """
    # TODO: Build the StateGraph
    #
    # graph = StateGraph(AnalysisState)
    # graph.add_node("screening", screening_agent)
    # graph.add_node("deepdive", deepdive_agent)
    # graph.add_node("risk", risk_agent)
    # graph.add_node("sentiment", sentiment_agent)
    # graph.add_node("scorer", compute_score)
    #
    # graph.set_entry_point("screening")
    # graph.add_edge("screening", "deepdive")
    # graph.add_edge("screening", "risk")
    # graph.add_edge("screening", "sentiment")
    # graph.add_edge(["deepdive", "risk", "sentiment"], "scorer")
    # graph.add_edge("scorer", END)
    #
    # return graph.compile()

    raise NotImplementedError(
        "Supervisor graph not yet implemented — "
        "wire up sub-agents and LangGraph StateGraph here."
    )
