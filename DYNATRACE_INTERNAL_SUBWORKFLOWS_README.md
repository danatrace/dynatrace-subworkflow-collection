# Dynatrace Internal Task Subworkflows - Complete

Created **10 new Dynatrace subworkflows** focused on internal Dynatrace operations, platform management, and monitoring automation.

## 📋 Created Subworkflows

### 1. Get Recent Problems with Filters
- **File**: `subworkflow-dynatrace-get-recent-problems-with-filters.workflow.json`
- **Purpose**: Retrieve recent Dynatrace problems with flexible filtering
- **Capabilities**: Filter by status, severity, time range
- **Use Cases**: Dashboards, reporting, trend analysis, SLA tracking
- **SDK**: problemsClient.listProblems()

### 2. Get Metrics for Entity
- **File**: `subworkflow-dynatrace-get-metrics-for-entity.workflow.json`
- **Purpose**: Query timeseries metric data for specific entities
- **Capabilities**: Custom metric selectors, time range, data resolution
- **Use Cases**: Performance trending, SLA reports, capacity planning
- **SDK**: metricsClient.queryMetricsData()

### 3. Manage Entity Tags
- **File**: `subworkflow-dynatrace-manage-entity-tags.workflow.json`
- **Purpose**: Add, update, or remove tags from entities
- **Capabilities**: Bulk tagging, tag management, tag-based automation
- **Use Cases**: Organization, cost allocation, automation targeting
- **SDK**: entitiesClient.updateEntityTags()

### 4. Query Service Topology
- **File**: `subworkflow-dynatrace-query-service-topology.workflow.json`
- **Purpose**: Retrieve service and application dependencies/relationships
- **Capabilities**: Entity relationships, topology discovery
- **Use Cases**: Dependency mapping, blast radius analysis, change impact
- **SDK**: entitiesClient.getEntity()

### 5. Export Problem Analysis Report
- **File**: `subworkflow-dynatrace-export-problem-analysis-report.workflow.json`
- **Purpose**: Generate comprehensive problem analysis reports
- **Capabilities**: Problem details, impact analysis, timeline, root causes
- **Use Cases**: Incident documentation, post-mortems, compliance
- **SDK**: problemsClient.getProblem()

### 6. Update Problem Priority and Metadata
- **File**: `subworkflow-dynatrace-update-problem-priority-and-metadata.workflow.json`
- **Purpose**: Update problem properties, priority, and comments
- **Capabilities**: Priority adjustment, comment addition, metadata updates
- **Use Cases**: Automated escalation, enrichment, audit trail
- **SDK**: problemsClient.updateProblem(), problemsClient.addCommentToProblem()

### 7. Get Deployment Info
- **File**: `subworkflow-dynatrace-get-deployment-info.workflow.json`
- **Purpose**: Retrieve deployment information and version history
- **Capabilities**: Recent deployments, version tracking, deployment status
- **Use Cases**: Change correlation, regression detection, release tracking
- **SDK**: eventsClient.getEvents()

### 8. Bulk Entity Selector Query
- **File**: `subworkflow-dynatrace-bulk-entity-selector-query.workflow.json`
- **Purpose**: Query multiple entities using flexible DQL selectors
- **Capabilities**: Complex filtering, bulk discovery, field selection
- **Use Cases**: Bulk tagging, inventory queries, report generation
- **SDK**: entitiesClient.listEntities()

### 9. Create Compliance Audit Event
- **File**: `subworkflow-dynatrace-create-compliance-audit-event.workflow.json`
- **Purpose**: Create audit trail events for compliance and tracking
- **Capabilities**: Audit event creation, compliance tagging, evidence collection
- **Use Cases**: SOC 2, PCI-DSS, HIPAA compliance, forensic analysis
- **SDK**: eventsClient.createEvent()

### 10. List and Filter Execution History
- **File**: `subworkflow-dynatrace-list-and-filter-execution-history.workflow.json`
- **Purpose**: Retrieve and analyze workflow execution history
- **Capabilities**: Status filtering, time-based queries, execution metrics
- **Use Cases**: Performance monitoring, SLA tracking, troubleshooting
- **SDK**: workflowsClient.listExecutions()

---

## 🏗️ Architecture & Design

### SDKs Used

All subworkflows utilize Dynatrace TypeScript SDKs:

```typescript
// SDK Module Imports
import { execution } from '@dynatrace-sdk/automation-utils';
import { problemsClient } from '@dynatrace-sdk/client-classic-environment-v2';
import { metricsClient } from '@dynatrace-sdk/client-classic-environment-v2';
import { eventsClient } from '@dynatrace-sdk/client-classic-environment-v2';
import { entitiesClient } from '@dynatrace-sdk/client-classic-environment-v2';
import { workflowsClient } from '@dynatrace-sdk/client-automation';
```

### Common Patterns

1. **Fetching Execution Input**
```typescript
const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());
```

2. **SDK Client Operations**
```typescript
const problems = await problemsClient.listProblems({ ... });
const metrics = await metricsClient.queryMetricsData({ ... });
const entities = await entitiesClient.listEntities({ ... });
```

3. **Error Handling**
```typescript
try {
  // SDK operation
  return result;
} catch (error) {
  console.error('Error:', error);
  throw new Error(`Failed to ...: ${error}`);
}
```

4. **Retry Configuration**
- Count: 3-5 retries
- Delay: 10 seconds
- Scope: failedLoopIterationsOnly: true

5. **Timeout**
- Standard: 30 seconds
- Longer operations: Up to 9000 seconds

### Parameter Types

- **Required**: Strings, entity IDs, selectors
- **Optional**: Filters, time ranges, result limits
- **JSON Objects**: Tags, audit details, metric selectors

---

## 💡 Use Cases

### 1. Monitoring & Observability
- Get metrics for trends and SLA tracking
- Query topologies for dependency understanding
- Export reports for documentation

### 2. Automated Remediation
- Update problem priority based on analysis
- Get deployment info to correlate issues
- Create audit events for compliance

### 3. Compliance & Auditing
- Create audit events with compliance tags
- Export problem analysis reports
- List execution history for SLA tracking

### 4. Infrastructure Management
- Manage tags for cost allocation
- Query entity relationships
- Bulk entity selector queries

### 5. Workflow Monitoring
- List execution history
- Monitor execution success rates
- Track performance metrics

---

## 🔗 Integration Points

These subworkflows can be consumed by parent workflows to:

1. **Problem Management**
   - Automatically escalate high-impact problems
   - Update priority based on analysis
   - Generate audit trails

2. **Performance Optimization**
   - Query metrics for trending
   - Alert on performance degradation
   - Create reports for review

3. **Compliance**
   - Create audit events automatically
   - Generate compliance reports
   - Track remediation actions

4. **Inventory Management**
   - Bulk tag entities
   - Query by selectors
   - Maintain entity metadata

---

## 📊 Data Flow

```
Trigger (Problem/Metric/Event)
    ↓
Dynatrace Subworkflow
    ↓
SDK Client Call
    ↓
Dynatrace Platform API
    ↓
Process & Return Data
    ↓
Parent Workflow
    ↓
Action (Update, Escalate, Report, etc.)
```

---

## ✅ Quality Attributes

- **Modular**: Each subworkflow focuses on a single task
- **Reusable**: Can be called from multiple parent workflows
- **Extensible**: Parameters allow customization
- **Observable**: All operations logged to execution logs
- **Resilient**: Built-in retry logic for transient failures
- **Non-Blocking**: All async operations with proper error handling

---

## 📝 Naming Convention

All new subworkflows follow the pattern:
```
subworkflow-dynatrace-[action]-[resource].workflow.json
```

Examples:
- `subworkflow-dynatrace-get-recent-problems-with-filters.workflow.json`
- `subworkflow-dynatrace-manage-entity-tags.workflow.json`
- `subworkflow-dynatrace-create-compliance-audit-event.workflow.json`

---

## 🚀 Next Steps

1. **Review**: Examine subworkflows for your specific needs
2. **Test**: Test in development environment with sample data
3. **Customize**: Modify parameters for your environment
4. **Integrate**: Call from parent workflows
5. **Monitor**: Track execution success rates
6. **Document**: Create runbooks for common patterns

---

## 📚 SDK Documentation References

- **Automation Utils**: Execution context and utilities
- **Client Classic Environment V2**: Problems, Metrics, Events, Entities
- **Client Automation**: Workflows and execution management

All subworkflows are TypeScript-based and execute in the Dynatrace Automation Engine.

---

**Status**: ✅ All 10 subworkflows created and ready for testing
**Location**: `/untested/` directory
**Type**: Dynatrace Internal Task Operations
**SDK Version**: Compatible with @dynatrace-sdk v1.x+
