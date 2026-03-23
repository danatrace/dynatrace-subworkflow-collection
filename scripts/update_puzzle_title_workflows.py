#!/usr/bin/env python3
"""Refresh puzzle-title-workflows.ts from top-level root JSON files.

Rules:
- Include only top-level root *.json files.
- Exclude generated and non-root files.
- Include only JSON documents whose title contains the puzzle icon (U+1F9E9).
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "puzzle-title-workflows.ts"
PUZZLE_ICON = "\U0001F9E9"


def collect_puzzle_title_workflows() -> list[dict]:
    workflows: list[dict] = []

    for path in sorted(ROOT.glob("*.json")):
        if path.parent != ROOT:
            continue
        if path.name == "dynatrace-create-coe-subworkflows.workflow.json":
            continue

        with path.open("r", encoding="utf-8") as file_handle:
            payload = json.load(file_handle)

        title = payload.get("title", "")
        if isinstance(title, str) and PUZZLE_ICON in title:
            workflows.append(payload)

    return workflows


def write_typescript_file(workflows: list[dict]) -> None:
    rendered_array = json.dumps(workflows, ensure_ascii=False, indent=2)
    content = f"export const puzzleTitleWorkflows = {rendered_array} as const;\n"
    OUTPUT_PATH.write_text(content, encoding="utf-8")


def main() -> None:
    workflows = collect_puzzle_title_workflows()
    write_typescript_file(workflows)
    print(f"Updated {OUTPUT_PATH.name} with {len(workflows)} workflows")


if __name__ == "__main__":
    main()