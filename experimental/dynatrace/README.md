# Experimental Dynatrace Subworkflows

⚠️ Experimental templates with strict execute -> wait -> check behavior.

## 📦 Inventory

- Total workflows: **75**
- Forecast-enabled workflows: **9**
- Distinct primary actions: **17**

## 🔁 Reliability Pattern

1. Execute primary remediation action
2. Wait for stabilization with retry
3. Check terminal status and fail on bad outcomes

## ⚙️ Primary Action Distribution

| Action | Count |
|---|---:|
| `dynatrace.automations:execute-dql-query` | 4 |
| `dynatrace.automations:http-function` | 5 |
| `dynatrace.automations:run-javascript` | 5 |
| `dynatrace.automations:run-workflow` | 5 |
| `dynatrace.aws.connector:ec2-describe-security-groups` | 5 |
| `dynatrace.aws.connector:ec2-reboot-instances` | 5 |
| `dynatrace.aws.connector:ec2-wait-state` | 5 |
| `dynatrace.aws.connector:s3-put-public-access-block` | 5 |
| `dynatrace.aws.connector:ssm-get-automation-execution` | 4 |
| `dynatrace.aws.connector:ssm-list-commands` | 4 |
| `dynatrace.aws.connector:ssm-send-command` | 4 |
| `dynatrace.aws.connector:ssm-start-automation-execution` | 4 |
| `dynatrace.azure.connector:azure-automation-get-job` | 4 |
| `dynatrace.azure.connector:azure-automation-start-runbook-job` | 4 |
| `dynatrace.github.connector:create-or-replace-file` | 4 |
| `dynatrace.kubernetes.connector:kubernetes-batch-v1-create-namespaced-job` | 4 |
| `dynatrace.kubernetes.connector:kubernetes-batch-v1-read-namespaced-job-status` | 4 |

## 🧪 Files

Pattern: `subworkflow-experimental-<context>-<theme>-<index>.workflow.json`

## ✅ Validation Expectations

- No `id` fields in workflow JSON
- JSON parse valid
- Tasks include perform-action, wait-for-action, check-status
