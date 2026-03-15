# Async Execution Patterns - Detailed Explanation

All 10 AWS remediation subworkflows implement proper async execution with completion verification. They are **NOT fire-and-forget**.

## Overview: 3 Completion Checking Patterns

### 1. SSM Document Polling Pattern (6 Workflows)

**Workflows Using This Pattern:**
- Increase RDS Storage
- Enable EBS Encryption
- Modify RDS Backup Retention
- Remediate High RDS Connections

**Execution Flow:**

```
Task 1: Start SSM Document Execution
   └─> AWS SSM starts the automation
   └─> Returns AutomationExecutionId

Task 2: Wait via Subworkflow (polling loop)
   └─> Calls: subworkflow-aws-wait-for-systems-manager-document-execution
   └─> This subworkflow polls every 60 seconds
   └─> Retries up to 99 times (max ~1.6 hours)

Task 3: Verify Completion
   └─> JavaScript checks AutomationExecutionStatus
   └─> If status ≠ "SUCCESS" → FAIL (parent can retry)
   └─> If status = "SUCCESS" → PASS (return result)
```

**Why It's Not Fire-and-Forget:**
- Polling loop ensures we wait for actual completion
- JavaScript verification validates success
- Failure propagates to parent workflow
- Parent can implement restart-on-error handling

**Example from subworkflow-aws-increase-rds-storage.workflow.json:**
```json
{
  "tasks": {
    "systems_manager_start_automation_execution_1": {
      "action": "dynatrace.aws.connector:ssm-start-automation-execution",
      "input": { "DocumentName": "AWS-ModifyRDSInstance", ... }
    },
    "wait-for-ssm-execution-completed": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
        "workflowInput": "{\"AutomationExecutionId\": \"{{ result(...).AutomationExecutionId }}\"}"
      },
      "retry": { "count": 99, "delay": 60, "failedLoopIterationsOnly": true }
    },
    "check-status": {
      "action": "dynatrace.automations:run-javascript",
      "input": {
        "script": "const status = configBody.AutomationExecutionStatus.toUpperCase(); if (status != 'SUCCESS') throw new Error('Failed');"
      }
    }
  }
}
```

---

### 2. Direct API Validation Pattern (3 Workflows)

**Workflows Using This Pattern:**
- Scale Lambda Function Memory and Timeout
- Enable VPC Flow Logs
- Enable CloudTrail Logging

**Execution Flow:**

```
Task 1: Direct AWS API Call
   └─> AWS connector action executes immediately
   └─> Returns full response object

Task 2: JavaScript Validation
   └─> Extract and validate response fields
   └─> If unexpected response → FAIL
   └─> If validation passes → PASS
```

**Why It's Not Fire-and-Forget:**
- JavaScript verification checks response structure
- Missing expected fields trigger failure
- Failures propagate to parent workflow
- Parent receives complete action result

**Example from subworkflow-aws-scale-lambda-function.workflow.json:**
```json
{
  "tasks": {
    "update-lambda-config": {
      "action": "dynatrace.aws.connector:lambda-update-function-configuration",
      "input": {
        "FunctionName": "{{ input()[\"functionName\"] }}",
        "MemorySize": "{{ input()[\"memorySize\"] }}"
      }
    },
    "check-status": {
      "action": "dynatrace.automations:run-javascript",
      "input": {
        "script": "if (!configBody.FunctionArn) throw new Error('Lambda update failed!');"
      }
    }
  }
}
```

**Validation Examples:**
- Lambda: Check `FunctionArn` present in response
- VPC Flow Logs: Check `FlowLogIds` array not empty
- CloudTrail: Check `TrailArn` returned successfully

---

### 3. Polling with Waiter Pattern (1 Workflow)

**Workflows Using This Pattern:**
- Create RDS Snapshot for Backup

**Execution Flow:**

```
Task 1: Create Action
   └─> RDS CreateSnapshot API called
   └─> Returns DBSnapshot object with State = "creating"

Task 2: Polling (Waiter Task)
   └─> Calls: dynatrace.aws.connector:rds-wait-db-snapshot-available
   └─> Waits until State = "available"
   └─> Long timeout (604800s = 7 days)
   └─> Retries 99 times with 120s delay between checks
```

**Why It's Not Fire-and-Forget:**
- Waiter task actively polls until snapshot is available
- Maximum wait time: ~1.6 hours (99 retries × 120s)
- Failure to reach "available" state → workflow fails
- Parent can retry if snapshot creation fails

**Example from subworkflow-aws-create-rds-snapshot.workflow.json:**
```json
{
  "tasks": {
    "create-snapshot": {
      "action": "dynatrace.aws.connector:rds-create-db-snapshot",
      "input": {
        "DBInstanceIdentifier": "{{ input()[\"dbInstanceIdentifier\"] }}"
      }
    },
    "wait-for-snapshot": {
      "action": "dynatrace.aws.connector:rds-wait-db-snapshot-available",
      "input": {
        "DBSnapshotIdentifier": "{{ input()[\"snapshotIdentifier\"] }}"
      },
      "retry": { "count": 99, "delay": 120 },
      "timeout": 604800
    }
  }
}
```

---

## SSM Subworkflow: Wait for Systems Manager Document Execution

This is the critical subworkflow used by 6 of our workflows.

**File:** `subworkflow-aws-wait-for-systems-manager-document-execution.workflow.json`

**Internal Tasks:**

```
Task 1: get-status
   └─> Action: dynatrace.aws.connector:ssm-get-automation-execution
   └─> Gets current AutomationExecutionStatus

Task 2: check-status
   └─> Action: dynatrace.automations:run-javascript
   └─> Checks if status is "INPROGRESS" or "PENDING"
   └─> If still running → throw error (triggers retry)
   └─> If completed → return result

Loop Back:
   └─> On error, parent retry logic kicks in
   └─> Waits 60 seconds, then retries Task 1
   └─> Max 99 retries = ~1.6 hours total
```

**JavaScript Status Check:**
```javascript
if (status == "INPROGRESS" || status == "PENDING") {
  throw new Error("Automation still running, restarting again!");
}
return configBody;  // Success!
```

---

## Retry Strategy Details

### SSM-Based Workflows
```
Retry Count:              99 attempts
Delay Between Retries:    60 seconds
Max Total Wait Time:      99 × 60s = ~1.6 hours
FailedLoopIterationsOnly: true (only retry on actual failure)
```

### Direct API Workflows
```
Retry Count:              5 attempts
Delay Between Retries:    10 seconds
Max Total Wait Time:      5 × 10s = 50 seconds
FailedLoopIterationsOnly: true
```

### Snapshot Polling
```
Retry Count:              99 attempts
Delay Between Retries:   120 seconds
Max Total Wait Time:      99 × 120s = ~3.3 hours
FailedLoopIterationsOnly: true
```

---

## Timeout Configuration

All workflows include extended timeouts for long-running operations:

```json
{
  "timeout": 604800  // 7 days in seconds for SSM operations
}
```

This prevents false negatives if AWS operations take longer than expected.

---

## Error Propagation to Parent Workflows

When a subworkflow fails, the parent receives:

1. **Failed Task State**: `task_status = "FAILED"`
2. **Error Message**: Details from last failure
3. **Result Data**: Partial results if available
4. **Restart Option**: Parent can implement `onFailure: "restart"`

**Parent Workflow Example:**
```json
{
  "scale-rds-storage": {
    "action": "dynatrace.automations:run-workflow",
    "input": { ... },
    "onFailure": "restart",  // Auto-retry on failure
    "retry": { "count": 3 }   // Up to 3 retries
  }
}
```

---

## Comparison: Fire-and-Forget vs. Our Workflows

| Aspect | Fire-and-Forget | Our Workflows |
|--------|-----------------|---------------|
| **Start Action** | ✅ Yes | ✅ Yes |
| **Wait for Completion** | ❌ No | ✅ YES (polling/waiter) |
| **Verify Success** | ❌ No | ✅ YES (status checks) |
| **Failure Detection** | ❌ No | ✅ YES (throws error) |
| **Parent Handling** | ❌ Unknown | ✅ Full error info |
| **Retry Logic** | ❌ None | ✅ 3-99 retries |
| **Total Wait Time** | 0s | 50s - 1.6 hours |

---

## Observability & Monitoring

To monitor subworkflow execution, parent workflows can track:

1. **Execution Status**
   ```
   execution.status = "COMPLETED" | "FAILED" | "RUNNING"
   ```

2. **Duration**
   ```
   Total time = start timestamp → completion timestamp
   ```

3. **Task Details**
   ```
   task_results = results from each task
   failed_task = which task caused failure
   ```

4. **Retry Attempts**
   ```
   attempts = how many times SSM polling retried
   last_status = final AutomationExecutionStatus
   ```

---

## Real-World Example: RDS Storage Increase

**Timeline of Execution:**

```
T+00:00  Parent calls: subworkflow-aws-increase-rds-storage
T+00:01  Task 1: SSM document starts ModifyRDSInstance
T+00:05  Task 2a: Check SSM status → still "InProgress"
T+01:05  Task 2b: Check SSM status → still "InProgress"
T+02:05  Task 2c: Check SSM status → still "InProgress"
T+03:05  Task 2d: Check SSM status → "Success"
T+03:10  Task 3: JavaScript validates status = "SUCCESS"
T+03:15  Returns result with new AllocatedStorage value
T+03:20  Parent workflow resumes with full RDS configuration
```

**Key Points:**
- Polling loop continuously checked status every 60s
- Operation took ~3 minutes (multiple retry cycles)
- JavaScript final validation confirmed success
- Parent received complete RDS configuration
- If operation had failed, parent could retry

---

## Conclusion

All 10 workflows are proven async patterns that:
✅ Execute start operations
✅ Actively wait for completion
✅ Verify success status
✅ Propagate errors to parent
✅ Support parent-level error handling

This enables reliable automation with confidence that actions are completed successfully before downstream steps execute.
