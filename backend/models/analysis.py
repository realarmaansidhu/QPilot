"""Pydantic models for analysis reports and requests."""

from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class SectionType(str, Enum):
    """Types of report sections produced by the agent pipeline."""

    SCREENING = "screening"
    DEEP_DIVE = "deep_dive"
    RISK = "risk"
    SENTIMENT = "sentiment"
    SUMMARY = "summary"


class ReportSection(BaseModel):
    """A single section of a QPilot analysis report."""

    section_type: SectionType
    title: str
    content: str = ""
    data: dict | None = Field(default=None, description="Structured data payload (charts, tables)")
    agent: str = Field("", description="Name of the agent that produced this section")


class AnalysisReport(BaseModel):
    """Complete QPilot analysis report for a ticker."""

    id: str | None = None
    ticker: str
    user_id: str | None = None
    sections: list[ReportSection] = Field(default_factory=list)
    overall_score: float = Field(0.0, ge=0, le=100)
    rating: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    llm_provider: str = Field("", description="LLM provider used (openai, anthropic, google)")
    model_name: str = ""


class AnalysisRequest(BaseModel):
    """Incoming request body for the /analyze/{ticker} endpoint."""

    llm_provider: str = Field("openai", description="User's chosen LLM provider")
    api_key: str = Field("", description="User's own API key for the chosen provider")
    depth: str = Field("standard", description="Analysis depth: quick | standard | deep")
