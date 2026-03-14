# Experimental Operations Subworkflows

⚠️ Experimental templates with strict execute -> wait -> check behavior.

## 📦 Inventory

- Total workflows: **50**
- Forecast-enabled workflows: **6**
- Distinct primary actions: **17**

## 🔁 Reliability Pattern

1. Execute primary remediation action
2. Wait for stabilization with retry
3. Check terminal status and fail on bad outcomes

## ⚙️ Primary Action Distribution

| Action | Count |
|---|---:|
| `dynatrace.automations:execute-dql-query` | 3 |
| `dynatrace.automations:http-function` | 3 |
| `dynatrace.automations:run-javascript` | 3 |
| `dynatrace.automations:run-workflow` | 3 |
| `dynatrace.aws.connector:ec2-describe-security-groups` | 3 |
| `dynatrace.aws.connector:ec2-reboot-instances` | 3 |
| `dynatrace.aws.connector:ec2-wait-state` | 3 |
| `dynatrace.aws.connector:s3-put-public-access-block` | 2 |
| `dynatrace.aws.connector:ssm-get-automation-execution` | 3 |
| `dynatrace.aws.connector:ssm-list-commands` | 3 |
| `dynatrace.aws.connector:ssm-send-command` | 3 |
| `dynatrace.aws.connector:ssm-start-automation-execution` | 3 |
| `dynatrace.azure.connector:azure-automation-get-job` | 3 |
| `dynatrace.azure.connector:azure-automation-start-runbook-job` | 3 |
| `dynatrace.github.connector:create-or-replace-file` | 3 |
| `dynatrace.kubernetes.connector:kubernetes-batch-v1-create-namespaced-job` | 3 |
| `dynatrace.kubernetes.connector:kubernetes-batch-v1-read-namespaced-job-status` | 3 |

## 🧪 Files

Pattern: `subworkflow-experimental-<context>-<theme>-<index>.workflow.json`

## ✅ Validation Expectations

- No `id` fields in workflow JSON
- JSON parse valid
- Tasks include perform-action, wait-for-action, check-status
