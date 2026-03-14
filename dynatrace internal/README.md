# 🧠 Dynatrace Internal Automation Subworkflows

> ⚠️ **These subworkflows are generated templates and have not been validated in a live Dynatrace environment.**
> They intentionally **do not include `id` fields**, so Dynatrace can assign them during import.

This folder contains **100 Dynatrace-internal automation subworkflows** focused on the areas customers most frequently struggle with when operating Dynatrace at scale: access governance, workflow lifecycle, dashboard sprawl, alerting noise, maintenance windows, tagging and scoping, synthetic and SLO upkeep, token governance, DQL-driven operational reporting, and extension or Kubernetes-related administration.

These themes were selected from common Dynatrace Community discussion patterns and day-to-day platform administration needs. Direct Community scraping was limited in this environment, so the catalogue is deliberately conservative and centered on the most common operational pain points.

---

## 🏗️ Design Pattern

Every subworkflow uses a **single JavaScript action** and follows the same operating model:

```text
[1] perform-operation
      ↓  JavaScript action executes a Dynatrace API or SDK call
      ✅ Returns the response body on success
      ❌ Fails the workflow on non-2xx responses
```

### ⚙️ Common Inputs

| Input | Purpose |
|---|---|
| `accountUuid`, `groupUuid`, `userUuid` | IAM and user-group administration |
| `workflowId`, `executionId` | Workflow lifecycle and execution operations |
| `dashboardId`, `documentId` | Dashboard, notebook, and document lifecycle |
| `problemId`, `entityId` | Problem and entity-scoped operations |
| `objectId`, `configId`, `monitorId`, `guardianId`, `tokenId`, `policyUuid`, `metricKey` | Configuration-specific operations |
| `payloadJson` | Raw JSON body for create, update, patch, or ingest calls |
| `dqlQuery` | DQL string used by query-oriented subworkflows |
| `queryString` | Optional raw query-string parameters appended to the request URL |

### 🧩 SDK Usage

- Workflow lifecycle creation, update, and deletion use `@dynatrace-sdk/client-automation`.
- All subworkflows run inside `dynatrace.automations:run-javascript`.
- All other operations use `fetch` against Dynatrace platform or environment APIs.

---

## 👤 Access Governance

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-add-user-to-group.workflow.json](subworkflow-dynatrace-add-user-to-group.workflow.json) | Add a Dynatrace user to a target user group automatically for onboarding or access repair. | POST | `/platform/iam/v1/accounts/{accountUuid}/groups/{groupUuid}/users/{userUuid}` |
| [subworkflow-dynatrace-remove-user-from-group.workflow.json](subworkflow-dynatrace-remove-user-from-group.workflow.json) | Remove a Dynatrace user from a user group during offboarding or least-privilege cleanup. | DELETE | `/platform/iam/v1/accounts/{accountUuid}/groups/{groupUuid}/users/{userUuid}` |
| [subworkflow-dynatrace-delete-user.workflow.json](subworkflow-dynatrace-delete-user.workflow.json) | Delete a Dynatrace user automatically during offboarding workflows. | DELETE | `/platform/iam/v1/accounts/{accountUuid}/users/{userUuid}` |
| [subworkflow-dynatrace-disable-user.workflow.json](subworkflow-dynatrace-disable-user.workflow.json) | Disable a Dynatrace user quickly during a security response workflow. | PATCH | `/platform/iam/v1/accounts/{accountUuid}/users/{userUuid}` |
| [subworkflow-dynatrace-enable-user.workflow.json](subworkflow-dynatrace-enable-user.workflow.json) | Re-enable a Dynatrace user after access issues or temporary suspension. | PATCH | `/platform/iam/v1/accounts/{accountUuid}/users/{userUuid}` |
| [subworkflow-dynatrace-invite-user.workflow.json](subworkflow-dynatrace-invite-user.workflow.json) | Invite a new user into the Dynatrace account automatically. | POST | `/platform/iam/v1/accounts/{accountUuid}/users` |
| [subworkflow-dynatrace-create-user-group.workflow.json](subworkflow-dynatrace-create-user-group.workflow.json) | Create a Dynatrace user group for a new team or tenant segment. | POST | `/platform/iam/v1/accounts/{accountUuid}/groups` |
| [subworkflow-dynatrace-delete-user-group.workflow.json](subworkflow-dynatrace-delete-user-group.workflow.json) | Delete an obsolete Dynatrace user group during governance cleanup. | DELETE | `/platform/iam/v1/accounts/{accountUuid}/groups/{groupUuid}` |
| [subworkflow-dynatrace-assign-group-permissions.workflow.json](subworkflow-dynatrace-assign-group-permissions.workflow.json) | Assign account or environment permissions to a Dynatrace user group automatically. | PUT | `/platform/iam/v1/accounts/{accountUuid}/groups/{groupUuid}/permissions` |
| [subworkflow-dynatrace-list-user-group-members.workflow.json](subworkflow-dynatrace-list-user-group-members.workflow.json) | List all users currently assigned to a Dynatrace user group for audit workflows. | GET | `/platform/iam/v1/accounts/{accountUuid}/groups/{groupUuid}/users` |

---

## 🔁 Workflow Administration

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-create-workflow.workflow.json](subworkflow-dynatrace-create-workflow.workflow.json) | Create a Dynatrace workflow from JSON to support workflow-as-code deployment. | SDK | `workflow.create` |
| [subworkflow-dynatrace-update-workflow.workflow.json](subworkflow-dynatrace-update-workflow.workflow.json) | Update an existing Dynatrace workflow from a supplied JSON definition. | SDK | `workflow.update` |
| [subworkflow-dynatrace-delete-workflow.workflow.json](subworkflow-dynatrace-delete-workflow.workflow.json) | Delete a Dynatrace workflow automatically during governance cleanup. | SDK | `workflow.delete` |
| [subworkflow-dynatrace-export-workflow.workflow.json](subworkflow-dynatrace-export-workflow.workflow.json) | Export a Dynatrace workflow definition for backup or Git synchronization. | GET | `/platform/automation/v1/workflows/{workflowId}` |
| [subworkflow-dynatrace-list-workflows.workflow.json](subworkflow-dynatrace-list-workflows.workflow.json) | List workflows in the environment for inventory and governance checks. | GET | `/platform/automation/v1/workflows` |
| [subworkflow-dynatrace-deploy-workflow.workflow.json](subworkflow-dynatrace-deploy-workflow.workflow.json) | Deploy a Dynatrace workflow draft so it becomes the live version. | POST | `/platform/automation/v1/workflows/{workflowId}:deploy` |
| [subworkflow-dynatrace-run-workflow-by-id.workflow.json](subworkflow-dynatrace-run-workflow-by-id.workflow.json) | Run a target Dynatrace workflow programmatically from another automation path. | POST | `/platform/automation/v1/workflows/{workflowId}:run` |
| [subworkflow-dynatrace-pause-workflow-trigger.workflow.json](subworkflow-dynatrace-pause-workflow-trigger.workflow.json) | Pause a workflow trigger during incident mitigation or change freeze windows. | PATCH | `/platform/automation/v1/workflows/{workflowId}` |
| [subworkflow-dynatrace-resume-workflow-trigger.workflow.json](subworkflow-dynatrace-resume-workflow-trigger.workflow.json) | Resume a paused workflow trigger after change validation is complete. | PATCH | `/platform/automation/v1/workflows/{workflowId}` |
| [subworkflow-dynatrace-get-workflow-execution-result.workflow.json](subworkflow-dynatrace-get-workflow-execution-result.workflow.json) | Fetch workflow execution details for downstream checks or reporting. | GET | `/platform/automation/v1/executions/{executionId}` |

---

## 📊 Dashboards & Reporting

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-create-dashboard.workflow.json](subworkflow-dynatrace-create-dashboard.workflow.json) | Create a dashboard automatically from a supplied JSON definition. | POST | `/platform/dashboards/v1/dashboards` |
| [subworkflow-dynatrace-update-dashboard.workflow.json](subworkflow-dynatrace-update-dashboard.workflow.json) | Update a dashboard definition to roll out standard views or fixes. | PUT | `/platform/dashboards/v1/dashboards/{dashboardId}` |
| [subworkflow-dynatrace-delete-dashboard.workflow.json](subworkflow-dynatrace-delete-dashboard.workflow.json) | Delete an obsolete or non-compliant dashboard automatically. | DELETE | `/platform/dashboards/v1/dashboards/{dashboardId}` |
| [subworkflow-dynatrace-clone-dashboard.workflow.json](subworkflow-dynatrace-clone-dashboard.workflow.json) | Clone a dashboard for a new team, environment, or tenant context. | POST | `/platform/dashboards/v1/dashboards` |
| [subworkflow-dynatrace-list-dashboards.workflow.json](subworkflow-dynatrace-list-dashboards.workflow.json) | List dashboards to identify sprawl, stale content, or ownership gaps. | GET | `/platform/dashboards/v1/dashboards` |
| [subworkflow-dynatrace-share-dashboard-with-group.workflow.json](subworkflow-dynatrace-share-dashboard-with-group.workflow.json) | Grant dashboard access to a user group automatically. | PATCH | `/platform/dashboards/v1/dashboards/{dashboardId}` |
| [subworkflow-dynatrace-create-notebook.workflow.json](subworkflow-dynatrace-create-notebook.workflow.json) | Create a notebook for incident investigations or runbook guidance. | POST | `/platform/document/v1/documents` |
| [subworkflow-dynatrace-update-notebook.workflow.json](subworkflow-dynatrace-update-notebook.workflow.json) | Update a notebook with new troubleshooting content or links. | PUT | `/platform/document/v1/documents/{documentId}` |
| [subworkflow-dynatrace-delete-notebook.workflow.json](subworkflow-dynatrace-delete-notebook.workflow.json) | Delete an obsolete notebook during documentation cleanup. | DELETE | `/platform/document/v1/documents/{documentId}` |
| [subworkflow-dynatrace-export-dashboard-json.workflow.json](subworkflow-dynatrace-export-dashboard-json.workflow.json) | Export a dashboard JSON definition for backup or Git sync. | GET | `/platform/dashboards/v1/dashboards/{dashboardId}` |

---

## 🚨 Problems & Events

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-get-problem-details.workflow.json](subworkflow-dynatrace-get-problem-details.workflow.json) | Get full problem details for enrichment or automated decision making. | GET | `/api/v2/problems/{problemId}` |
| [subworkflow-dynatrace-close-problem.workflow.json](subworkflow-dynatrace-close-problem.workflow.json) | Close a resolved problem automatically from a remediation workflow. | POST | `/api/v2/problems/{problemId}/close` |
| [subworkflow-dynatrace-comment-on-problem.workflow.json](subworkflow-dynatrace-comment-on-problem.workflow.json) | Add a remediation or operator comment to a Dynatrace problem. | POST | `/api/v2/problems/{problemId}/comments` |
| [subworkflow-dynatrace-list-open-problems.workflow.json](subworkflow-dynatrace-list-open-problems.workflow.json) | List active problems for triage dashboards and automation routing. | GET | `/api/v2/problems` |
| [subworkflow-dynatrace-get-problem-impacted-entities.workflow.json](subworkflow-dynatrace-get-problem-impacted-entities.workflow.json) | Extract impacted entities from a problem for downstream remediation steps. | GET | `/api/v2/problems/{problemId}` |
| [subworkflow-dynatrace-ingest-custom-info-event.workflow.json](subworkflow-dynatrace-ingest-custom-info-event.workflow.json) | Ingest a custom info event into Dynatrace during automation workflows. | POST | `/api/v2/events/ingest` |
| [subworkflow-dynatrace-ingest-custom-alert.workflow.json](subworkflow-dynatrace-ingest-custom-alert.workflow.json) | Ingest a custom alert event to mark automation findings or failures. | POST | `/api/v2/events/ingest` |
| [subworkflow-dynatrace-create-change-event.workflow.json](subworkflow-dynatrace-create-change-event.workflow.json) | Create a change event in Dynatrace before or after risky operations. | POST | `/api/v2/events/ingest` |
| [subworkflow-dynatrace-mute-problem-notifications.workflow.json](subworkflow-dynatrace-mute-problem-notifications.workflow.json) | Temporarily mute notifications for a known noisy problem workflow. | POST | `/platform/classicConfig/v1/anomalyDetection/mutingRules` |
| [subworkflow-dynatrace-reopen-problem-evidence-query.workflow.json](subworkflow-dynatrace-reopen-problem-evidence-query.workflow.json) | Query recent problem evidence and related events using DQL. | POST | `/platform/storage/query/v1/query:execute` |

---

## 🔔 Alerting & Maintenance

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-create-maintenance-window.workflow.json](subworkflow-dynatrace-create-maintenance-window.workflow.json) | Create a maintenance window before planned changes. | POST | `/api/v2/settings/objects` |
| [subworkflow-dynatrace-update-maintenance-window.workflow.json](subworkflow-dynatrace-update-maintenance-window.workflow.json) | Update an existing maintenance window schedule or scope. | PUT | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-delete-maintenance-window.workflow.json](subworkflow-dynatrace-delete-maintenance-window.workflow.json) | Delete a maintenance window after cleanup or rollback. | DELETE | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-create-alerting-profile.workflow.json](subworkflow-dynatrace-create-alerting-profile.workflow.json) | Create an alerting profile for a team or service domain. | POST | `/api/v2/settings/objects` |
| [subworkflow-dynatrace-update-alerting-profile.workflow.json](subworkflow-dynatrace-update-alerting-profile.workflow.json) | Update alerting profile rules to reduce noise or add routing. | PUT | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-delete-alerting-profile.workflow.json](subworkflow-dynatrace-delete-alerting-profile.workflow.json) | Delete a stale alerting profile during governance cleanup. | DELETE | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-create-notification-integration.workflow.json](subworkflow-dynatrace-create-notification-integration.workflow.json) | Create a notification integration for Slack, Teams, or email automation. | POST | `/api/v2/settings/objects` |
| [subworkflow-dynatrace-update-notification-integration.workflow.json](subworkflow-dynatrace-update-notification-integration.workflow.json) | Update a notification integration endpoint or credential binding. | PUT | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-disable-notification-integration.workflow.json](subworkflow-dynatrace-disable-notification-integration.workflow.json) | Disable a broken notification integration to stop delivery failures. | PUT | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-create-muting-rule.workflow.json](subworkflow-dynatrace-create-muting-rule.workflow.json) | Create a muting rule to suppress known false-positive alerts. | POST | `/api/v2/settings/objects` |
| [subworkflow-dynatrace-update-custom-anomaly-detector.workflow.json](subworkflow-dynatrace-update-custom-anomaly-detector.workflow.json) | Update anomaly detector settings for a service or infrastructure scope. | PUT | `/api/v2/settings/objects/{objectId}` |

---

## 🏷️ Tags & Scoping

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-create-auto-tag-rule.workflow.json](subworkflow-dynatrace-create-auto-tag-rule.workflow.json) | Create an auto-tagging rule to improve ownership and routing. | POST | `/api/v2/settings/objects` |
| [subworkflow-dynatrace-update-auto-tag-rule.workflow.json](subworkflow-dynatrace-update-auto-tag-rule.workflow.json) | Update an auto-tagging rule after naming or scoping changes. | PUT | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-delete-auto-tag-rule.workflow.json](subworkflow-dynatrace-delete-auto-tag-rule.workflow.json) | Delete an obsolete auto-tagging rule during cleanup. | DELETE | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-create-management-zone.workflow.json](subworkflow-dynatrace-create-management-zone.workflow.json) | Create a management zone for a team or application boundary. | POST | `/api/config/v1/managementZones` |
| [subworkflow-dynatrace-update-management-zone.workflow.json](subworkflow-dynatrace-update-management-zone.workflow.json) | Update management zone rules to reflect topology changes. | PUT | `/api/config/v1/managementZones/{configId}` |
| [subworkflow-dynatrace-delete-management-zone.workflow.json](subworkflow-dynatrace-delete-management-zone.workflow.json) | Delete an unused management zone. | DELETE | `/api/config/v1/managementZones/{configId}` |
| [subworkflow-dynatrace-list-entities-by-tag.workflow.json](subworkflow-dynatrace-list-entities-by-tag.workflow.json) | List entities carrying a given tag for governance or remediation targeting. | GET | `/api/v2/entities` |
| [subworkflow-dynatrace-add-tag-to-entity.workflow.json](subworkflow-dynatrace-add-tag-to-entity.workflow.json) | Add a tag to an entity automatically during classification workflows. | POST | `/api/v2/tags` |
| [subworkflow-dynatrace-remove-tag-from-entity.workflow.json](subworkflow-dynatrace-remove-tag-from-entity.workflow.json) | Remove an obsolete tag from an entity automatically. | DELETE | `/api/v2/tags/{entityId}` |
| [subworkflow-dynatrace-query-smartscape-neighbors.workflow.json](subworkflow-dynatrace-query-smartscape-neighbors.workflow.json) | Query related entities around a service or host using topology-aware DQL. | POST | `/platform/storage/query/v1/query:execute` |

---

## 🧪 Synthetic & Reliability

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-create-synthetic-http-monitor.workflow.json](subworkflow-dynatrace-create-synthetic-http-monitor.workflow.json) | Create a synthetic HTTP monitor for an app or endpoint. | POST | `/api/v1/synthetic/monitors` |
| [subworkflow-dynatrace-update-synthetic-http-monitor.workflow.json](subworkflow-dynatrace-update-synthetic-http-monitor.workflow.json) | Update an existing synthetic HTTP monitor configuration. | PUT | `/api/v1/synthetic/monitors/{monitorId}` |
| [subworkflow-dynatrace-delete-synthetic-monitor.workflow.json](subworkflow-dynatrace-delete-synthetic-monitor.workflow.json) | Delete a synthetic monitor that is obsolete or duplicated. | DELETE | `/api/v1/synthetic/monitors/{monitorId}` |
| [subworkflow-dynatrace-enable-synthetic-monitor.workflow.json](subworkflow-dynatrace-enable-synthetic-monitor.workflow.json) | Enable a paused synthetic monitor after maintenance ends. | PUT | `/api/v1/synthetic/monitors/{monitorId}` |
| [subworkflow-dynatrace-disable-synthetic-monitor.workflow.json](subworkflow-dynatrace-disable-synthetic-monitor.workflow.json) | Disable a synthetic monitor during a known outage or maintenance. | PUT | `/api/v1/synthetic/monitors/{monitorId}` |
| [subworkflow-dynatrace-create-slo.workflow.json](subworkflow-dynatrace-create-slo.workflow.json) | Create a Dynatrace Service-Level Objective for a service or journey. | POST | `/api/v2/settings/objects` |
| [subworkflow-dynatrace-update-slo.workflow.json](subworkflow-dynatrace-update-slo.workflow.json) | Update SLO targets, burn thresholds, or query definitions. | PUT | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-delete-slo.workflow.json](subworkflow-dynatrace-delete-slo.workflow.json) | Delete an obsolete SLO definition during cleanup. | DELETE | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-create-site-reliability-guardian.workflow.json](subworkflow-dynatrace-create-site-reliability-guardian.workflow.json) | Create a Site Reliability Guardian for release validation. | POST | `/platform/guardians/v1/guardians` |
| [subworkflow-dynatrace-run-site-reliability-guardian.workflow.json](subworkflow-dynatrace-run-site-reliability-guardian.workflow.json) | Trigger a Site Reliability Guardian validation before deployment. | POST | `/platform/guardians/v1/guardians/{guardianId}:validate` |

---

## ⚙️ Settings & Config

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-create-metric-event.workflow.json](subworkflow-dynatrace-create-metric-event.workflow.json) | Create a metric event configuration for custom alerting needs. | POST | `/api/v2/settings/objects` |
| [subworkflow-dynatrace-update-metric-event.workflow.json](subworkflow-dynatrace-update-metric-event.workflow.json) | Update metric event thresholds or dimensions. | PUT | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-delete-metric-event.workflow.json](subworkflow-dynatrace-delete-metric-event.workflow.json) | Delete an obsolete metric event configuration. | DELETE | `/api/v2/settings/objects/{objectId}` |
| [subworkflow-dynatrace-create-request-attribute.workflow.json](subworkflow-dynatrace-create-request-attribute.workflow.json) | Create a request attribute configuration for service analysis. | POST | `/api/config/v1/service/requestAttributes` |
| [subworkflow-dynatrace-update-request-attribute.workflow.json](subworkflow-dynatrace-update-request-attribute.workflow.json) | Update a request attribute after header or capture changes. | PUT | `/api/config/v1/service/requestAttributes/{id}` |
| [subworkflow-dynatrace-delete-request-attribute.workflow.json](subworkflow-dynatrace-delete-request-attribute.workflow.json) | Delete an obsolete request attribute definition. | DELETE | `/api/config/v1/service/requestAttributes/{id}` |
| [subworkflow-dynatrace-create-calculated-service-metric.workflow.json](subworkflow-dynatrace-create-calculated-service-metric.workflow.json) | Create a calculated service metric for SLOs or dashboards. | POST | `/api/config/v1/calculatedMetrics/service` |
| [subworkflow-dynatrace-update-calculated-service-metric.workflow.json](subworkflow-dynatrace-update-calculated-service-metric.workflow.json) | Update a calculated service metric definition. | PUT | `/api/config/v1/calculatedMetrics/service/{metricKey}` |
| [subworkflow-dynatrace-delete-calculated-service-metric.workflow.json](subworkflow-dynatrace-delete-calculated-service-metric.workflow.json) | Delete a no-longer-used calculated service metric. | DELETE | `/api/config/v1/calculatedMetrics/service/{metricKey}` |
| [subworkflow-dynatrace-execute-dql-query.workflow.json](subworkflow-dynatrace-execute-dql-query.workflow.json) | Run a DQL query and return the result for automation decisions. | POST | `/platform/storage/query/v1/query:execute` |

---

## 🛡️ Platform Governance

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-create-api-token.workflow.json](subworkflow-dynatrace-create-api-token.workflow.json) | Create an API token automatically for a service or integration. | POST | `/api/v2/apiTokens` |
| [subworkflow-dynatrace-revoke-api-token.workflow.json](subworkflow-dynatrace-revoke-api-token.workflow.json) | Revoke an API token during offboarding or security response. | POST | `/api/v2/apiTokens/{tokenId}/revoke` |
| [subworkflow-dynatrace-list-api-tokens.workflow.json](subworkflow-dynatrace-list-api-tokens.workflow.json) | List API tokens for governance, ownership, and age audits. | GET | `/api/v2/apiTokens` |
| [subworkflow-dynatrace-create-access-token-policy.workflow.json](subworkflow-dynatrace-create-access-token-policy.workflow.json) | Create an access token policy to standardize token scopes and expiry. | POST | `/platform/iam/v1/accounts/{accountUuid}/policies` |
| [subworkflow-dynatrace-update-access-token-policy.workflow.json](subworkflow-dynatrace-update-access-token-policy.workflow.json) | Update an access token policy after governance changes. | PUT | `/platform/iam/v1/accounts/{accountUuid}/policies/{policyUuid}` |
| [subworkflow-dynatrace-delete-access-token-policy.workflow.json](subworkflow-dynatrace-delete-access-token-policy.workflow.json) | Delete an obsolete access token policy. | DELETE | `/platform/iam/v1/accounts/{accountUuid}/policies/{policyUuid}` |
| [subworkflow-dynatrace-list-openpipeline-configurations.workflow.json](subworkflow-dynatrace-list-openpipeline-configurations.workflow.json) | List OpenPipeline configurations for governance and troubleshooting. | GET | `/platform/openpipeline/v1/configurations` |
| [subworkflow-dynatrace-create-openpipeline-route.workflow.json](subworkflow-dynatrace-create-openpipeline-route.workflow.json) | Create an OpenPipeline route to direct logs or events. | POST | `/platform/openpipeline/v1/configurations` |
| [subworkflow-dynatrace-update-openpipeline-route.workflow.json](subworkflow-dynatrace-update-openpipeline-route.workflow.json) | Update an OpenPipeline route after schema or routing changes. | PUT | `/platform/openpipeline/v1/configurations/{configId}` |
| [subworkflow-dynatrace-delete-openpipeline-route.workflow.json](subworkflow-dynatrace-delete-openpipeline-route.workflow.json) | Delete an unused OpenPipeline route. | DELETE | `/platform/openpipeline/v1/configurations/{configId}` |

---

## 📈 Logs & Metrics Operations

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-list-log-processing-rules.workflow.json](subworkflow-dynatrace-list-log-processing-rules.workflow.json) | List log processing rules to investigate ingest issues or drift. | GET | `/platform/openpipeline/v1/configurations` |
| [subworkflow-dynatrace-create-log-processing-rule.workflow.json](subworkflow-dynatrace-create-log-processing-rule.workflow.json) | Create a log processing rule for enrichment or routing. | POST | `/platform/openpipeline/v1/configurations` |
| [subworkflow-dynatrace-update-log-processing-rule.workflow.json](subworkflow-dynatrace-update-log-processing-rule.workflow.json) | Update a log processing rule after parser or route changes. | PUT | `/platform/openpipeline/v1/configurations/{configId}` |
| [subworkflow-dynatrace-delete-log-processing-rule.workflow.json](subworkflow-dynatrace-delete-log-processing-rule.workflow.json) | Delete an obsolete log processing rule. | DELETE | `/platform/openpipeline/v1/configurations/{configId}` |
| [subworkflow-dynatrace-query-recent-logs.workflow.json](subworkflow-dynatrace-query-recent-logs.workflow.json) | Query recent logs via DQL during troubleshooting or enrichment. | POST | `/platform/storage/query/v1/query:execute` |
| [subworkflow-dynatrace-query-recent-spans.workflow.json](subworkflow-dynatrace-query-recent-spans.workflow.json) | Query recent spans via DQL for tracing automation decisions. | POST | `/platform/storage/query/v1/query:execute` |
| [subworkflow-dynatrace-query-metric-timeseries.workflow.json](subworkflow-dynatrace-query-metric-timeseries.workflow.json) | Query metric timeseries data for threshold checks or reports. | GET | `/api/v2/metrics/query` |

---

## ☸️ Kubernetes & Extensions

| File | Use Case | Method / Mode | Target |
|---|---|---|---|
| [subworkflow-dynatrace-create-kubernetes-credential.workflow.json](subworkflow-dynatrace-create-kubernetes-credential.workflow.json) | Create a Kubernetes credential object for cluster access automation. | POST | `/api/v2/settings/objects` |
| [subworkflow-dynatrace-update-kubernetes-credential.workflow.json](subworkflow-dynatrace-update-kubernetes-credential.workflow.json) | Update Kubernetes credential settings after certificate rotation. | PUT | `/api/v2/settings/objects/{objectId}` |

---

## ✅ Validation Checklist

- [ ] Import each `.workflow.json` file into Dynatrace
- [ ] Confirm the actor running the workflow has the required API scopes and IAM permissions
- [ ] Replace default `payloadJson` and identifiers with operation-specific inputs
- [ ] Run each subworkflow manually against a non-production target first
- [ ] Confirm API path, request body shape, and permission model in your tenant
- [ ] After testing, add `🧩` to the `title` field and move production-ready files to the repository root

## 📁 Naming Convention

- File names follow `subworkflow-dynatrace-<action>.workflow.json`
- Titles follow `subworkflow - dynatrace <action>`
- `id` is intentionally omitted so Dynatrace can assign it on import
