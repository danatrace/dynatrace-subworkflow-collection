# Orchestration Subworkflows

⚠️ This folder contains orchestration-focused templates for high-priority operational control flows.

All workflows follow strict non-fire-and-forget behavior: execute action -> wait -> check.

## 📦 Inventory

- Total orchestration subworkflows: **100**
- Distinct available Dynatrace primary actions used: **17**

## 🔁 Reliability Pattern

1. Execute primary action
2. Wait for stabilization and terminal state
3. Check final status and fail on unsuccessful outcomes

## ⚙️ Primary Action Distribution

| Action | Count |
|---|---:|
| `dynatrace.automations:execute-dql-query` | 6 |
| `dynatrace.automations:http-function` | 6 |
| `dynatrace.automations:run-javascript` | 6 |
| `dynatrace.automations:run-workflow` | 6 |
| `dynatrace.aws.connector:ec2-describe-security-groups` | 6 |
| `dynatrace.aws.connector:ec2-reboot-instances` | 6 |
| `dynatrace.aws.connector:ec2-wait-state` | 6 |
| `dynatrace.aws.connector:s3-put-public-access-block` | 6 |
| `dynatrace.aws.connector:ssm-get-automation-execution` | 6 |
| `dynatrace.aws.connector:ssm-list-commands` | 6 |
| `dynatrace.aws.connector:ssm-send-command` | 6 |
| `dynatrace.aws.connector:ssm-start-automation-execution` | 6 |
| `dynatrace.azure.connector:azure-automation-get-job` | 6 |
| `dynatrace.azure.connector:azure-automation-start-runbook-job` | 6 |
| `dynatrace.github.connector:create-or-replace-file` | 6 |
| `dynatrace.kubernetes.connector:kubernetes-batch-v1-create-namespaced-job` | 5 |
| `dynatrace.kubernetes.connector:kubernetes-batch-v1-read-namespaced-job-status` | 5 |

## 📚 Catalog (100 Subworkflows)

| File | Purpose | Primary Action |
|---|---|---|
| `subworkflow-orchestration-incident-bridge-triage-and-route-001.workflow.json` | Orchestrate incident bridge with triage and route and enforced post-action verification. | `dynatrace.automations:execute-dql-query` |
| `subworkflow-orchestration-incident-bridge-stabilize-and-rollback-002.workflow.json` | Orchestrate incident bridge with stabilize and rollback and enforced post-action verification. | `dynatrace.automations:http-function` |
| `subworkflow-orchestration-incident-bridge-scale-and-verify-003.workflow.json` | Orchestrate incident bridge with scale and verify and enforced post-action verification. | `dynatrace.automations:run-javascript` |
| `subworkflow-orchestration-incident-bridge-restart-and-healthcheck-004.workflow.json` | Orchestrate incident bridge with restart and healthcheck and enforced post-action verification. | `dynatrace.automations:run-workflow` |
| `subworkflow-orchestration-incident-bridge-quarantine-and-restore-005.workflow.json` | Orchestrate incident bridge with quarantine and restore and enforced post-action verification. | `dynatrace.aws.connector:ec2-describe-security-groups` |
| `subworkflow-orchestration-incident-bridge-backup-and-validate-006.workflow.json` | Orchestrate incident bridge with backup and validate and enforced post-action verification. | `dynatrace.aws.connector:ec2-reboot-instances` |
| `subworkflow-orchestration-incident-bridge-failover-and-confirm-007.workflow.json` | Orchestrate incident bridge with failover and confirm and enforced post-action verification. | `dynatrace.aws.connector:ec2-wait-state` |
| `subworkflow-orchestration-incident-bridge-patch-and-assert-008.workflow.json` | Orchestrate incident bridge with patch and assert and enforced post-action verification. | `dynatrace.aws.connector:s3-put-public-access-block` |
| `subworkflow-orchestration-incident-bridge-drill-and-report-009.workflow.json` | Orchestrate incident bridge with drill and report and enforced post-action verification. | `dynatrace.aws.connector:ssm-get-automation-execution` |
| `subworkflow-orchestration-incident-bridge-optimize-and-close-010.workflow.json` | Orchestrate incident bridge with optimize and close and enforced post-action verification. | `dynatrace.aws.connector:ssm-list-commands` |
| `subworkflow-orchestration-change-window-triage-and-route-011.workflow.json` | Orchestrate change window with triage and route and enforced post-action verification. | `dynatrace.aws.connector:ssm-send-command` |
| `subworkflow-orchestration-change-window-stabilize-and-rollback-012.workflow.json` | Orchestrate change window with stabilize and rollback and enforced post-action verification. | `dynatrace.aws.connector:ssm-start-automation-execution` |
| `subworkflow-orchestration-change-window-scale-and-verify-013.workflow.json` | Orchestrate change window with scale and verify and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-get-job` |
| `subworkflow-orchestration-change-window-restart-and-healthcheck-014.workflow.json` | Orchestrate change window with restart and healthcheck and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-start-runbook-job` |
| `subworkflow-orchestration-change-window-quarantine-and-restore-015.workflow.json` | Orchestrate change window with quarantine and restore and enforced post-action verification. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-orchestration-change-window-backup-and-validate-016.workflow.json` | Orchestrate change window with backup and validate and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-create-namespaced-job` |
| `subworkflow-orchestration-change-window-failover-and-confirm-017.workflow.json` | Orchestrate change window with failover and confirm and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-read-namespaced-job-status` |
| `subworkflow-orchestration-change-window-patch-and-assert-018.workflow.json` | Orchestrate change window with patch and assert and enforced post-action verification. | `dynatrace.automations:execute-dql-query` |
| `subworkflow-orchestration-change-window-drill-and-report-019.workflow.json` | Orchestrate change window with drill and report and enforced post-action verification. | `dynatrace.automations:http-function` |
| `subworkflow-orchestration-change-window-optimize-and-close-020.workflow.json` | Orchestrate change window with optimize and close and enforced post-action verification. | `dynatrace.automations:run-javascript` |
| `subworkflow-orchestration-release-control-triage-and-route-021.workflow.json` | Orchestrate release control with triage and route and enforced post-action verification. | `dynatrace.automations:run-workflow` |
| `subworkflow-orchestration-release-control-stabilize-and-rollback-022.workflow.json` | Orchestrate release control with stabilize and rollback and enforced post-action verification. | `dynatrace.aws.connector:ec2-describe-security-groups` |
| `subworkflow-orchestration-release-control-scale-and-verify-023.workflow.json` | Orchestrate release control with scale and verify and enforced post-action verification. | `dynatrace.aws.connector:ec2-reboot-instances` |
| `subworkflow-orchestration-release-control-restart-and-healthcheck-024.workflow.json` | Orchestrate release control with restart and healthcheck and enforced post-action verification. | `dynatrace.aws.connector:ec2-wait-state` |
| `subworkflow-orchestration-release-control-quarantine-and-restore-025.workflow.json` | Orchestrate release control with quarantine and restore and enforced post-action verification. | `dynatrace.aws.connector:s3-put-public-access-block` |
| `subworkflow-orchestration-release-control-backup-and-validate-026.workflow.json` | Orchestrate release control with backup and validate and enforced post-action verification. | `dynatrace.aws.connector:ssm-get-automation-execution` |
| `subworkflow-orchestration-release-control-failover-and-confirm-027.workflow.json` | Orchestrate release control with failover and confirm and enforced post-action verification. | `dynatrace.aws.connector:ssm-list-commands` |
| `subworkflow-orchestration-release-control-patch-and-assert-028.workflow.json` | Orchestrate release control with patch and assert and enforced post-action verification. | `dynatrace.aws.connector:ssm-send-command` |
| `subworkflow-orchestration-release-control-drill-and-report-029.workflow.json` | Orchestrate release control with drill and report and enforced post-action verification. | `dynatrace.aws.connector:ssm-start-automation-execution` |
| `subworkflow-orchestration-release-control-optimize-and-close-030.workflow.json` | Orchestrate release control with optimize and close and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-get-job` |
| `subworkflow-orchestration-capacity-guard-triage-and-route-031.workflow.json` | Orchestrate capacity guard with triage and route and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-start-runbook-job` |
| `subworkflow-orchestration-capacity-guard-stabilize-and-rollback-032.workflow.json` | Orchestrate capacity guard with stabilize and rollback and enforced post-action verification. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-orchestration-capacity-guard-scale-and-verify-033.workflow.json` | Orchestrate capacity guard with scale and verify and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-create-namespaced-job` |
| `subworkflow-orchestration-capacity-guard-restart-and-healthcheck-034.workflow.json` | Orchestrate capacity guard with restart and healthcheck and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-read-namespaced-job-status` |
| `subworkflow-orchestration-capacity-guard-quarantine-and-restore-035.workflow.json` | Orchestrate capacity guard with quarantine and restore and enforced post-action verification. | `dynatrace.automations:execute-dql-query` |
| `subworkflow-orchestration-capacity-guard-backup-and-validate-036.workflow.json` | Orchestrate capacity guard with backup and validate and enforced post-action verification. | `dynatrace.automations:http-function` |
| `subworkflow-orchestration-capacity-guard-failover-and-confirm-037.workflow.json` | Orchestrate capacity guard with failover and confirm and enforced post-action verification. | `dynatrace.automations:run-javascript` |
| `subworkflow-orchestration-capacity-guard-patch-and-assert-038.workflow.json` | Orchestrate capacity guard with patch and assert and enforced post-action verification. | `dynatrace.automations:run-workflow` |
| `subworkflow-orchestration-capacity-guard-drill-and-report-039.workflow.json` | Orchestrate capacity guard with drill and report and enforced post-action verification. | `dynatrace.aws.connector:ec2-describe-security-groups` |
| `subworkflow-orchestration-capacity-guard-optimize-and-close-040.workflow.json` | Orchestrate capacity guard with optimize and close and enforced post-action verification. | `dynatrace.aws.connector:ec2-reboot-instances` |
| `subworkflow-orchestration-security-containment-triage-and-route-041.workflow.json` | Orchestrate security containment with triage and route and enforced post-action verification. | `dynatrace.aws.connector:ec2-wait-state` |
| `subworkflow-orchestration-security-containment-stabilize-and-rollback-042.workflow.json` | Orchestrate security containment with stabilize and rollback and enforced post-action verification. | `dynatrace.aws.connector:s3-put-public-access-block` |
| `subworkflow-orchestration-security-containment-scale-and-verify-043.workflow.json` | Orchestrate security containment with scale and verify and enforced post-action verification. | `dynatrace.aws.connector:ssm-get-automation-execution` |
| `subworkflow-orchestration-security-containment-restart-and-healthcheck-044.workflow.json` | Orchestrate security containment with restart and healthcheck and enforced post-action verification. | `dynatrace.aws.connector:ssm-list-commands` |
| `subworkflow-orchestration-security-containment-quarantine-and-restore-045.workflow.json` | Orchestrate security containment with quarantine and restore and enforced post-action verification. | `dynatrace.aws.connector:ssm-send-command` |
| `subworkflow-orchestration-security-containment-backup-and-validate-046.workflow.json` | Orchestrate security containment with backup and validate and enforced post-action verification. | `dynatrace.aws.connector:ssm-start-automation-execution` |
| `subworkflow-orchestration-security-containment-failover-and-confirm-047.workflow.json` | Orchestrate security containment with failover and confirm and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-get-job` |
| `subworkflow-orchestration-security-containment-patch-and-assert-048.workflow.json` | Orchestrate security containment with patch and assert and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-start-runbook-job` |
| `subworkflow-orchestration-security-containment-drill-and-report-049.workflow.json` | Orchestrate security containment with drill and report and enforced post-action verification. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-orchestration-security-containment-optimize-and-close-050.workflow.json` | Orchestrate security containment with optimize and close and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-create-namespaced-job` |
| `subworkflow-orchestration-service-healing-triage-and-route-051.workflow.json` | Orchestrate service healing with triage and route and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-read-namespaced-job-status` |
| `subworkflow-orchestration-service-healing-stabilize-and-rollback-052.workflow.json` | Orchestrate service healing with stabilize and rollback and enforced post-action verification. | `dynatrace.automations:execute-dql-query` |
| `subworkflow-orchestration-service-healing-scale-and-verify-053.workflow.json` | Orchestrate service healing with scale and verify and enforced post-action verification. | `dynatrace.automations:http-function` |
| `subworkflow-orchestration-service-healing-restart-and-healthcheck-054.workflow.json` | Orchestrate service healing with restart and healthcheck and enforced post-action verification. | `dynatrace.automations:run-javascript` |
| `subworkflow-orchestration-service-healing-quarantine-and-restore-055.workflow.json` | Orchestrate service healing with quarantine and restore and enforced post-action verification. | `dynatrace.automations:run-workflow` |
| `subworkflow-orchestration-service-healing-backup-and-validate-056.workflow.json` | Orchestrate service healing with backup and validate and enforced post-action verification. | `dynatrace.aws.connector:ec2-describe-security-groups` |
| `subworkflow-orchestration-service-healing-failover-and-confirm-057.workflow.json` | Orchestrate service healing with failover and confirm and enforced post-action verification. | `dynatrace.aws.connector:ec2-reboot-instances` |
| `subworkflow-orchestration-service-healing-patch-and-assert-058.workflow.json` | Orchestrate service healing with patch and assert and enforced post-action verification. | `dynatrace.aws.connector:ec2-wait-state` |
| `subworkflow-orchestration-service-healing-drill-and-report-059.workflow.json` | Orchestrate service healing with drill and report and enforced post-action verification. | `dynatrace.aws.connector:s3-put-public-access-block` |
| `subworkflow-orchestration-service-healing-optimize-and-close-060.workflow.json` | Orchestrate service healing with optimize and close and enforced post-action verification. | `dynatrace.aws.connector:ssm-get-automation-execution` |
| `subworkflow-orchestration-dependency-recovery-triage-and-route-061.workflow.json` | Orchestrate dependency recovery with triage and route and enforced post-action verification. | `dynatrace.aws.connector:ssm-list-commands` |
| `subworkflow-orchestration-dependency-recovery-stabilize-and-rollback-062.workflow.json` | Orchestrate dependency recovery with stabilize and rollback and enforced post-action verification. | `dynatrace.aws.connector:ssm-send-command` |
| `subworkflow-orchestration-dependency-recovery-scale-and-verify-063.workflow.json` | Orchestrate dependency recovery with scale and verify and enforced post-action verification. | `dynatrace.aws.connector:ssm-start-automation-execution` |
| `subworkflow-orchestration-dependency-recovery-restart-and-healthcheck-064.workflow.json` | Orchestrate dependency recovery with restart and healthcheck and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-get-job` |
| `subworkflow-orchestration-dependency-recovery-quarantine-and-restore-065.workflow.json` | Orchestrate dependency recovery with quarantine and restore and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-start-runbook-job` |
| `subworkflow-orchestration-dependency-recovery-backup-and-validate-066.workflow.json` | Orchestrate dependency recovery with backup and validate and enforced post-action verification. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-orchestration-dependency-recovery-failover-and-confirm-067.workflow.json` | Orchestrate dependency recovery with failover and confirm and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-create-namespaced-job` |
| `subworkflow-orchestration-dependency-recovery-patch-and-assert-068.workflow.json` | Orchestrate dependency recovery with patch and assert and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-read-namespaced-job-status` |
| `subworkflow-orchestration-dependency-recovery-drill-and-report-069.workflow.json` | Orchestrate dependency recovery with drill and report and enforced post-action verification. | `dynatrace.automations:execute-dql-query` |
| `subworkflow-orchestration-dependency-recovery-optimize-and-close-070.workflow.json` | Orchestrate dependency recovery with optimize and close and enforced post-action verification. | `dynatrace.automations:http-function` |
| `subworkflow-orchestration-platform-governance-triage-and-route-071.workflow.json` | Orchestrate platform governance with triage and route and enforced post-action verification. | `dynatrace.automations:run-javascript` |
| `subworkflow-orchestration-platform-governance-stabilize-and-rollback-072.workflow.json` | Orchestrate platform governance with stabilize and rollback and enforced post-action verification. | `dynatrace.automations:run-workflow` |
| `subworkflow-orchestration-platform-governance-scale-and-verify-073.workflow.json` | Orchestrate platform governance with scale and verify and enforced post-action verification. | `dynatrace.aws.connector:ec2-describe-security-groups` |
| `subworkflow-orchestration-platform-governance-restart-and-healthcheck-074.workflow.json` | Orchestrate platform governance with restart and healthcheck and enforced post-action verification. | `dynatrace.aws.connector:ec2-reboot-instances` |
| `subworkflow-orchestration-platform-governance-quarantine-and-restore-075.workflow.json` | Orchestrate platform governance with quarantine and restore and enforced post-action verification. | `dynatrace.aws.connector:ec2-wait-state` |
| `subworkflow-orchestration-platform-governance-backup-and-validate-076.workflow.json` | Orchestrate platform governance with backup and validate and enforced post-action verification. | `dynatrace.aws.connector:s3-put-public-access-block` |
| `subworkflow-orchestration-platform-governance-failover-and-confirm-077.workflow.json` | Orchestrate platform governance with failover and confirm and enforced post-action verification. | `dynatrace.aws.connector:ssm-get-automation-execution` |
| `subworkflow-orchestration-platform-governance-patch-and-assert-078.workflow.json` | Orchestrate platform governance with patch and assert and enforced post-action verification. | `dynatrace.aws.connector:ssm-list-commands` |
| `subworkflow-orchestration-platform-governance-drill-and-report-079.workflow.json` | Orchestrate platform governance with drill and report and enforced post-action verification. | `dynatrace.aws.connector:ssm-send-command` |
| `subworkflow-orchestration-platform-governance-optimize-and-close-080.workflow.json` | Orchestrate platform governance with optimize and close and enforced post-action verification. | `dynatrace.aws.connector:ssm-start-automation-execution` |
| `subworkflow-orchestration-cross-cloud-failover-triage-and-route-081.workflow.json` | Orchestrate cross cloud failover with triage and route and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-get-job` |
| `subworkflow-orchestration-cross-cloud-failover-stabilize-and-rollback-082.workflow.json` | Orchestrate cross cloud failover with stabilize and rollback and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-start-runbook-job` |
| `subworkflow-orchestration-cross-cloud-failover-scale-and-verify-083.workflow.json` | Orchestrate cross cloud failover with scale and verify and enforced post-action verification. | `dynatrace.github.connector:create-or-replace-file` |
| `subworkflow-orchestration-cross-cloud-failover-restart-and-healthcheck-084.workflow.json` | Orchestrate cross cloud failover with restart and healthcheck and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-create-namespaced-job` |
| `subworkflow-orchestration-cross-cloud-failover-quarantine-and-restore-085.workflow.json` | Orchestrate cross cloud failover with quarantine and restore and enforced post-action verification. | `dynatrace.kubernetes.connector:kubernetes-batch-v1-read-namespaced-job-status` |
| `subworkflow-orchestration-cross-cloud-failover-backup-and-validate-086.workflow.json` | Orchestrate cross cloud failover with backup and validate and enforced post-action verification. | `dynatrace.automations:execute-dql-query` |
| `subworkflow-orchestration-cross-cloud-failover-failover-and-confirm-087.workflow.json` | Orchestrate cross cloud failover with failover and confirm and enforced post-action verification. | `dynatrace.automations:http-function` |
| `subworkflow-orchestration-cross-cloud-failover-patch-and-assert-088.workflow.json` | Orchestrate cross cloud failover with patch and assert and enforced post-action verification. | `dynatrace.automations:run-javascript` |
| `subworkflow-orchestration-cross-cloud-failover-drill-and-report-089.workflow.json` | Orchestrate cross cloud failover with drill and report and enforced post-action verification. | `dynatrace.automations:run-workflow` |
| `subworkflow-orchestration-cross-cloud-failover-optimize-and-close-090.workflow.json` | Orchestrate cross cloud failover with optimize and close and enforced post-action verification. | `dynatrace.aws.connector:ec2-describe-security-groups` |
| `subworkflow-orchestration-ops-escalation-triage-and-route-091.workflow.json` | Orchestrate ops escalation with triage and route and enforced post-action verification. | `dynatrace.aws.connector:ec2-reboot-instances` |
| `subworkflow-orchestration-ops-escalation-stabilize-and-rollback-092.workflow.json` | Orchestrate ops escalation with stabilize and rollback and enforced post-action verification. | `dynatrace.aws.connector:ec2-wait-state` |
| `subworkflow-orchestration-ops-escalation-scale-and-verify-093.workflow.json` | Orchestrate ops escalation with scale and verify and enforced post-action verification. | `dynatrace.aws.connector:s3-put-public-access-block` |
| `subworkflow-orchestration-ops-escalation-restart-and-healthcheck-094.workflow.json` | Orchestrate ops escalation with restart and healthcheck and enforced post-action verification. | `dynatrace.aws.connector:ssm-get-automation-execution` |
| `subworkflow-orchestration-ops-escalation-quarantine-and-restore-095.workflow.json` | Orchestrate ops escalation with quarantine and restore and enforced post-action verification. | `dynatrace.aws.connector:ssm-list-commands` |
| `subworkflow-orchestration-ops-escalation-backup-and-validate-096.workflow.json` | Orchestrate ops escalation with backup and validate and enforced post-action verification. | `dynatrace.aws.connector:ssm-send-command` |
| `subworkflow-orchestration-ops-escalation-failover-and-confirm-097.workflow.json` | Orchestrate ops escalation with failover and confirm and enforced post-action verification. | `dynatrace.aws.connector:ssm-start-automation-execution` |
| `subworkflow-orchestration-ops-escalation-patch-and-assert-098.workflow.json` | Orchestrate ops escalation with patch and assert and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-get-job` |
| `subworkflow-orchestration-ops-escalation-drill-and-report-099.workflow.json` | Orchestrate ops escalation with drill and report and enforced post-action verification. | `dynatrace.azure.connector:azure-automation-start-runbook-job` |
| `subworkflow-orchestration-ops-escalation-optimize-and-close-100.workflow.json` | Orchestrate ops escalation with optimize and close and enforced post-action verification. | `dynatrace.github.connector:create-or-replace-file` |

## ✅ Validation Checklist

- ✅ 100 orchestration workflows generated
- ✅ No `id` fields included
- ✅ All JSON files parse successfully
- ✅ Every workflow includes execute, wait, and check tasks
- ✅ Emoji guides included
