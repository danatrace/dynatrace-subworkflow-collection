#!/usr/bin/env python3
"""Refresh the COE workflow embedded subworkflow array and guide list.

Rules:
- Include only top-level root subworkflow JSON files matching subworkflow*.json.
- Exclude anything not in root and the COE workflow itself.
- Include only files whose title contains the puzzle icon (U+1F9E9).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COE_WORKFLOW_PATH = ROOT / "dynatrace-create-coe-subworkflows.workflow.json"
PUZZLE_ICON = "\U0001F9E9"


def collect_subworkflows() -> list[dict]:
    """Collect top-level subworkflow JSON payloads with puzzle icon in title."""
    subworkflows: list[dict] = []

    for path in sorted(ROOT.glob("subworkflow*.json")):
        # Guard against accidental nested paths and excluded directories.
        if path.parent != ROOT:
            continue
        if "untested" in path.parts:
            continue

        with path.open("r", encoding="utf-8") as fh:
            payload = json.load(fh)

        title = payload.get("title", "")
        if isinstance(title, str) and PUZZLE_ICON in title:
            subworkflows.append(payload)

    return subworkflows


def build_guide(titles: list[str]) -> str:
    bullets = "\n".join(f"- {title}" for title in titles)
    return (
        "## **\U0001F9E9dynatrace create coe subworkflows**\n\n"
        "\u2699\ufe0f This workflow provides a simple and automated way to **create all coe subworkflows in your tenant**.\n\n"
        "* All created subworkflows are created in the tenant **under the actor user executing the workflow**, "
        "so the actor user becomes the **owner and actor** of each created subworkflow.\n \n"
        "* If a subworkflow already exists, it is **skipped** and not recreated.\n \n"
        "* Simply run the workflow to create subworkflows in your tenant. \n"
        "* User that runs the workflow must have workflow write permissions\n\n\n"
        "---\n\n\n"
        "### \U0001F4DA **Subworkflow that will be created**\n\n"
        f"{bullets}"
    )


def update_embedded_script(script: str, subworkflows: list[dict]) -> str:
    """Replace only the embedded const subworkflows array in the task script."""
    new_array = "const subworkflows = " + json.dumps(
        subworkflows,
        ensure_ascii=False,
        indent=2,
    ) + "\n;"

    pattern = re.compile(r"const subworkflows = \[(?:.|\n)*?\n\]\n;", re.MULTILINE)
    updated, count = pattern.subn(lambda _match: new_array, script, count=1)
    if count != 1:
        raise ValueError("Could not locate embedded subworkflows array in create-subworkflow-array script")
    return updated


def main() -> None:
    subworkflows = collect_subworkflows()
    titles = [w.get("title", "") for w in subworkflows if isinstance(w.get("title"), str)]

    with COE_WORKFLOW_PATH.open("r", encoding="utf-8") as fh:
        coe = json.load(fh)

    coe["guide"] = build_guide(titles)

    script_path = ["tasks", "create-subworkflow-array", "input", "script"]
    script = coe
    for key in script_path:
        script = script[key]

    coe["tasks"]["create-subworkflow-array"]["input"]["script"] = update_embedded_script(
        script,
        subworkflows,
    )

    with COE_WORKFLOW_PATH.open("w", encoding="utf-8") as fh:
        json.dump(coe, fh, indent=2, ensure_ascii=True)
        fh.write("\n")

    print(f"Updated {COE_WORKFLOW_PATH.name} with {len(subworkflows)} subworkflows")


if __name__ == "__main__":
    main()
