# GitHub Remediation and Orchestration Subworkflows

⚠️ This folder contains GitHub-focused remediation/orchestration templates for high-priority engineering operations.

All workflows enforce strict non-fire-and-forget behavior: execute action -> wait -> check.

## 📦 Inventory

- Total subworkflows: **100**
- Available Dynatrace GitHub connector actions used: **1**
  - `dynatrace.github.connector:create-or-replace-file`

## 🔁 Reliability Pattern

1. Execute GitHub connector action
2. Wait for finalized operation result
3. Verify terminal success indicators (commit/content SHA)

## 🚀 Setup

1. Ensure Dynatrace GitHub connection id is configured in `githubConnectionId`.
2. Provide `githubOwner`, `githubRepository`, and branch values.
3. Optionally set `filePathOverride` and `fileContentOverride` per workflow run.

## 📚 Catalog (100 Subworkflows)

| File | Context | Purpose | Primary Action |
|---|---|---|---|
| `subworkflow-github-incident-response-create-incident-branch-readme-001.workflow.json` | incident-response | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-incident-response-update-remediation-runbook-002.workflow.json` | incident-response | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-incident-response-publish-postmortem-draft-003.workflow.json` | incident-response | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-incident-response-sync-reliability-checklist-004.workflow.json` | incident-response | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-incident-response-write-change-evidence-log-005.workflow.json` | incident-response | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-release-governance-create-incident-branch-readme-006.workflow.json` | release-governance | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-release-governance-update-remediation-runbook-007.workflow.json` | release-governance | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-release-governance-publish-postmortem-draft-008.workflow.json` | release-governance | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-release-governance-sync-reliability-checklist-009.workflow.json` | release-governance | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-release-governance-write-change-evidence-log-010.workflow.json` | release-governance | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-runbook-management-create-incident-branch-readme-011.workflow.json` | runbook-management | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-runbook-management-update-remediation-runbook-012.workflow.json` | runbook-management | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-runbook-management-publish-postmortem-draft-013.workflow.json` | runbook-management | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-runbook-management-sync-reliability-checklist-014.workflow.json` | runbook-management | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-runbook-management-write-change-evidence-log-015.workflow.json` | runbook-management | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-postmortem-automation-create-incident-branch-readme-016.workflow.json` | postmortem-automation | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-postmortem-automation-update-remediation-runbook-017.workflow.json` | postmortem-automation | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-postmortem-automation-publish-postmortem-draft-018.workflow.json` | postmortem-automation | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-postmortem-automation-sync-reliability-checklist-019.workflow.json` | postmortem-automation | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-postmortem-automation-write-change-evidence-log-020.workflow.json` | postmortem-automation | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-security-remediation-create-incident-branch-readme-021.workflow.json` | security-remediation | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-security-remediation-update-remediation-runbook-022.workflow.json` | security-remediation | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-security-remediation-publish-postmortem-draft-023.workflow.json` | security-remediation | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-security-remediation-sync-reliability-checklist-024.workflow.json` | security-remediation | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-security-remediation-write-change-evidence-log-025.workflow.json` | security-remediation | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-compliance-reporting-create-incident-branch-readme-026.workflow.json` | compliance-reporting | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-compliance-reporting-update-remediation-runbook-027.workflow.json` | compliance-reporting | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-compliance-reporting-publish-postmortem-draft-028.workflow.json` | compliance-reporting | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-compliance-reporting-sync-reliability-checklist-029.workflow.json` | compliance-reporting | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-compliance-reporting-write-change-evidence-log-030.workflow.json` | compliance-reporting | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-service-catalog-sync-create-incident-branch-readme-031.workflow.json` | service-catalog-sync | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-service-catalog-sync-update-remediation-runbook-032.workflow.json` | service-catalog-sync | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-service-catalog-sync-publish-postmortem-draft-033.workflow.json` | service-catalog-sync | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-service-catalog-sync-sync-reliability-checklist-034.workflow.json` | service-catalog-sync | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-service-catalog-sync-write-change-evidence-log-035.workflow.json` | service-catalog-sync | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-change-management-create-incident-branch-readme-036.workflow.json` | change-management | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-change-management-update-remediation-runbook-037.workflow.json` | change-management | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-change-management-publish-postmortem-draft-038.workflow.json` | change-management | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-change-management-sync-reliability-checklist-039.workflow.json` | change-management | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-change-management-write-change-evidence-log-040.workflow.json` | change-management | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-slo-governance-create-incident-branch-readme-041.workflow.json` | slo-governance | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-slo-governance-update-remediation-runbook-042.workflow.json` | slo-governance | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-slo-governance-publish-postmortem-draft-043.workflow.json` | slo-governance | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-slo-governance-sync-reliability-checklist-044.workflow.json` | slo-governance | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-slo-governance-write-change-evidence-log-045.workflow.json` | slo-governance | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-dependency-updates-create-incident-branch-readme-046.workflow.json` | dependency-updates | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-dependency-updates-update-remediation-runbook-047.workflow.json` | dependency-updates | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-dependency-updates-publish-postmortem-draft-048.workflow.json` | dependency-updates | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-dependency-updates-sync-reliability-checklist-049.workflow.json` | dependency-updates | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-dependency-updates-write-change-evidence-log-050.workflow.json` | dependency-updates | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-operations-handover-create-incident-branch-readme-051.workflow.json` | operations-handover | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-operations-handover-update-remediation-runbook-052.workflow.json` | operations-handover | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-operations-handover-publish-postmortem-draft-053.workflow.json` | operations-handover | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-operations-handover-sync-reliability-checklist-054.workflow.json` | operations-handover | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-operations-handover-write-change-evidence-log-055.workflow.json` | operations-handover | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cost-optimization-create-incident-branch-readme-056.workflow.json` | cost-optimization | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cost-optimization-update-remediation-runbook-057.workflow.json` | cost-optimization | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cost-optimization-publish-postmortem-draft-058.workflow.json` | cost-optimization | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cost-optimization-sync-reliability-checklist-059.workflow.json` | cost-optimization | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cost-optimization-write-change-evidence-log-060.workflow.json` | cost-optimization | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-availability-hardening-create-incident-branch-readme-061.workflow.json` | availability-hardening | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-availability-hardening-update-remediation-runbook-062.workflow.json` | availability-hardening | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-availability-hardening-publish-postmortem-draft-063.workflow.json` | availability-hardening | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-availability-hardening-sync-reliability-checklist-064.workflow.json` | availability-hardening | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-availability-hardening-write-change-evidence-log-065.workflow.json` | availability-hardening | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-oncall-enablement-create-incident-branch-readme-066.workflow.json` | oncall-enablement | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-oncall-enablement-update-remediation-runbook-067.workflow.json` | oncall-enablement | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-oncall-enablement-publish-postmortem-draft-068.workflow.json` | oncall-enablement | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-oncall-enablement-sync-reliability-checklist-069.workflow.json` | oncall-enablement | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-oncall-enablement-write-change-evidence-log-070.workflow.json` | oncall-enablement | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-kubernetes-ops-create-incident-branch-readme-071.workflow.json` | kubernetes-ops | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-kubernetes-ops-update-remediation-runbook-072.workflow.json` | kubernetes-ops | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-kubernetes-ops-publish-postmortem-draft-073.workflow.json` | kubernetes-ops | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-kubernetes-ops-sync-reliability-checklist-074.workflow.json` | kubernetes-ops | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-kubernetes-ops-write-change-evidence-log-075.workflow.json` | kubernetes-ops | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cloud-ops-create-incident-branch-readme-076.workflow.json` | cloud-ops | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cloud-ops-update-remediation-runbook-077.workflow.json` | cloud-ops | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cloud-ops-publish-postmortem-draft-078.workflow.json` | cloud-ops | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cloud-ops-sync-reliability-checklist-079.workflow.json` | cloud-ops | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-cloud-ops-write-change-evidence-log-080.workflow.json` | cloud-ops | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-platform-engineering-create-incident-branch-readme-081.workflow.json` | platform-engineering | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-platform-engineering-update-remediation-runbook-082.workflow.json` | platform-engineering | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-platform-engineering-publish-postmortem-draft-083.workflow.json` | platform-engineering | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-platform-engineering-sync-reliability-checklist-084.workflow.json` | platform-engineering | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-platform-engineering-write-change-evidence-log-085.workflow.json` | platform-engineering | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-audit-traceability-create-incident-branch-readme-086.workflow.json` | audit-traceability | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-audit-traceability-update-remediation-runbook-087.workflow.json` | audit-traceability | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-audit-traceability-publish-postmortem-draft-088.workflow.json` | audit-traceability | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-audit-traceability-sync-reliability-checklist-089.workflow.json` | audit-traceability | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-audit-traceability-write-change-evidence-log-090.workflow.json` | audit-traceability | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-reliability-program-create-incident-branch-readme-091.workflow.json` | reliability-program | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-reliability-program-update-remediation-runbook-092.workflow.json` | reliability-program | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-reliability-program-publish-postmortem-draft-093.workflow.json` | reliability-program | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-reliability-program-sync-reliability-checklist-094.workflow.json` | reliability-program | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-reliability-program-write-change-evidence-log-095.workflow.json` | reliability-program | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-automation-control-plane-create-incident-branch-readme-096.workflow.json` | automation-control-plane | Create incident branch README with diagnostics summary. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-automation-control-plane-update-remediation-runbook-097.workflow.json` | automation-control-plane | Update remediation runbook with latest outage handling steps. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-automation-control-plane-publish-postmortem-draft-098.workflow.json` | automation-control-plane | Publish postmortem draft template for rapid analysis. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-automation-control-plane-sync-reliability-checklist-099.workflow.json` | automation-control-plane | Sync reliability checklist to repository control docs. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-github-automation-control-plane-write-change-evidence-log-100.workflow.json` | automation-control-plane | Write change evidence log entry for audit traceability. | `dynatrace.github.connector:create-or-replace-file` |

## ✅ Validation Checklist

- ✅ 100 workflows generated
- ✅ No `id` fields included
- ✅ All JSON files are parseable
- ✅ Every workflow has execute, wait, and check tasks
- ✅ Emoji guides included
