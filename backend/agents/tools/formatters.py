"""Output formatters — convert raw agent data into presentation-ready structures.

These helpers transform the structured dicts returned by each agent into
``ReportSection`` models and SSE-friendly JSON payloads.
"""

from __future__ import annotations

import json
from typing import Any

from models.analysis import ReportSection, SectionType


def format_section(
    section_type: SectionType,
    title: str,
    content: str,
    *,
    data: dict[str, Any] | None = None,
    agent: str = "",
) -> ReportSection:
    """Build a ``ReportSection`` from raw agent output."""
    return ReportSection(
        section_type=section_type,
        title=title,
        content=content,
        data=data,
        agent=agent,
    )


def section_to_sse(section: ReportSection) -> str:
    """Serialise a ``ReportSection`` into an SSE ``data:`` line."""
    payload = section.model_dump(mode="json")
    return f"data: {json.dumps(payload)}\n\n"
