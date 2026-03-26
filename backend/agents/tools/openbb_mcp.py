"""OpenBB MCP client wrapper — bridges langchain-mcp-adapters to the OpenBB MCP server.

This module initialises an MCP client session pointing at the OpenBB MCP
server and exposes the available tools as LangChain-compatible tool objects
that can be bound to any LLM agent.

Usage (inside an agent)::

    tools = await get_openbb_tools()
    agent = create_react_agent(llm, tools)
"""

from __future__ import annotations

from typing import Any

# from langchain_mcp_adapters.client import MultiServerMCPClient


async def get_openbb_tools() -> list[Any]:
    """Connect to the OpenBB MCP server and return available tools.

    Returns
    -------
    list of LangChain ``BaseTool`` instances wrapping MCP tool calls.
    """
    # TODO: Initialise the MCP client
    #
    # async with MultiServerMCPClient(
    #     {
    #         "openbb": {
    #             "url": "http://localhost:8000/mcp",  # or SSE endpoint
    #             "transport": "sse",
    #         }
    #     }
    # ) as client:
    #     tools = client.get_tools()
    #     return tools

    raise NotImplementedError(
        "OpenBB MCP client not yet initialised — "
        "configure the MCP server URL and transport in this module."
    )
