# Experimental Outage-Prevention Subworkflows

⚠️ This folder contains experimental templates organized by domain.

All workflows enforce non-fire-and-forget behavior: execute action -> wait -> check.

## 📁 Domain Layout

| Domain | Workflows | Forecast-enabled | Path |
|---|---:|---:|---|
| aws | 125 | 15 | `aws/` |
| azure | 125 | 15 | `azure/` |
| kubernetes | 125 | 15 | `kubernetes/` |
| dynatrace | 75 | 9 | `dynatrace/` |
| operations | 50 | 6 | `operations/` |

## 📦 Totals

- Total workflows: **500**
- Total forecast-enabled workflows: **60**

## 🧭 Source Signals Used

- Engineering forum outage themes
- Stack Overflow trend tags (public API)
- ServiceNow automation/operations community themes
- Generalized Gartner/Forrester-aligned resilience categories

## 🔮 Forecasting Integration

- Forecast-enabled scenarios run a Davis analyzer pre-check via `@dynatrace-sdk/client-davis-analyzers`.
- Forecast errors fall back gracefully; remediation still follows wait+check enforcement.

## ✅ Validation Expectations

- No workflow file includes an `id` field
- All workflow JSON files are parseable
- Each workflow has explicit wait and check tasks
- Emoji guides included for readability
