#!/usr/bin/env python3
"""Generate GitHub Pages catalog data for all workflow JSON files."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

REPO_OWNER = "danatrace"
REPO_NAME = "dynatrace-subworkflow-collection"
DEFAULT_BRANCH = "main"

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "docs" / "data" / "workflows.json"


def normalize_guide_text(guide: str) -> str:
    """Collapse markdown-heavy guide content into readable text."""
    text = guide.replace("\\r\\n", "\\n").replace("\\r", "\\n")
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"^\s*#+\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[-*]\s+", "- ", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def first_nonempty_block(text: str) -> str:
    """Return first substantial paragraph-like block from normalized guide text."""
    for block in text.split("\n\n"):
        candidate = " ".join(line.strip() for line in block.splitlines() if line.strip())
        if candidate:
            return candidate
    return ""


def build_download_url(relative_path: str) -> str:
    encoded_path = quote(relative_path, safe="/")
    return (
        f"https://raw.githubusercontent.com/{REPO_OWNER}/{REPO_NAME}/"
        f"{DEFAULT_BRANCH}/{encoded_path}"
    )


def build_source_url(relative_path: str) -> str:
    encoded_path = quote(relative_path, safe="/")
    return (
        f"https://github.com/{REPO_OWNER}/{REPO_NAME}/blob/"
        f"{DEFAULT_BRANCH}/{encoded_path}"
    )


def collect_workflows() -> list[dict]:
    workflows: list[dict] = []

    for path in sorted(ROOT.rglob("*.workflow.json")):
        relative_path = path.relative_to(ROOT).as_posix()

        if relative_path.startswith(".git/"):
            continue

        section = "tested" if "/" not in relative_path else "untested"
        folder = "top-level" if section == "tested" else relative_path.split("/")[0]

        with path.open("r", encoding="utf-8") as file_handle:
            payload = json.load(file_handle)

        title = payload.get("title") or path.stem
        guide = payload.get("guide") if isinstance(payload.get("guide"), str) else ""
        normalized_guide = normalize_guide_text(guide)
        guide_summary = first_nonempty_block(normalized_guide)

        workflows.append(
            {
                "title": title,
                "path": relative_path,
                "section": section,
                "folder": folder,
                "guide": guide,
                "guideText": normalized_guide,
                "guideSummary": guide_summary,
                "description": payload.get("description", ""),
                "downloadUrl": build_download_url(relative_path),
                "sourceUrl": build_source_url(relative_path),
                "tags": payload.get("tags", []) if isinstance(payload.get("tags"), list) else [],
            }
        )

    workflows.sort(key=lambda item: (0 if item["section"] == "tested" else 1, item["path"]))
    return workflows


def main() -> None:
    workflows = collect_workflows()
    tested_count = sum(1 for item in workflows if item["section"] == "tested")
    untested_count = len(workflows) - tested_count

    output = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "repository": {
            "owner": REPO_OWNER,
            "name": REPO_NAME,
            "branch": DEFAULT_BRANCH,
        },
        "counts": {
            "total": len(workflows),
            "tested": tested_count,
            "untested": untested_count,
        },
        "workflows": workflows,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as output_file:
        json.dump(output, output_file, indent=2)
        output_file.write("\n")

    print(f"Catalog data generated: {OUTPUT_PATH}")
    print(f"Total: {len(workflows)} | Tested: {tested_count} | Untested: {untested_count}")


if __name__ == "__main__":
    main()
