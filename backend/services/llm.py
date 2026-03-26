"""LLM provider router — instantiates the correct LangChain chat model
based on the user's chosen provider and their own API key.

Supported providers:
  - openai    -> ChatOpenAI
  - anthropic -> ChatAnthropic
  - google    -> ChatGoogleGenerativeAI
"""

from __future__ import annotations

from typing import Any

from langchain_core.language_models.chat_models import BaseChatModel


def get_chat_model(
    provider: str,
    api_key: str,
    *,
    model_name: str | None = None,
    temperature: float = 0.2,
    streaming: bool = True,
) -> BaseChatModel:
    """Return a LangChain chat model for the given provider.

    Parameters
    ----------
    provider:
        One of ``"openai"``, ``"anthropic"``, ``"google"``.
    api_key:
        The user's own API key for the provider.
    model_name:
        Override the default model.  If ``None``, a sensible default is chosen.
    temperature:
        Sampling temperature.
    streaming:
        Whether to enable token-level streaming.

    Raises
    ------
    ValueError
        If *provider* is not recognised.
    """
    provider = provider.lower().strip()

    if provider == "openai":
        from langchain_openai import ChatOpenAI

        return ChatOpenAI(
            api_key=api_key,
            model=model_name or "gpt-4o",
            temperature=temperature,
            streaming=streaming,
        )

    if provider == "anthropic":
        from langchain_anthropic import ChatAnthropic

        return ChatAnthropic(
            api_key=api_key,
            model_name=model_name or "claude-sonnet-4-20250514",
            temperature=temperature,
            streaming=streaming,
        )

    if provider == "google":
        from langchain_google_genai import ChatGoogleGenerativeAI

        return ChatGoogleGenerativeAI(
            google_api_key=api_key,
            model=model_name or "gemini-2.0-flash",
            temperature=temperature,
            streaming=streaming,
        )

    raise ValueError(
        f"Unknown LLM provider '{provider}'. "
        "Supported: openai, anthropic, google."
    )
