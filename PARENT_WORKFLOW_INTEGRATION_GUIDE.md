# Parent Workflow Integration Examples

This document shows how to use the 10 AWS remediation subworkflows in parent workflows.

## Pattern 1: Problem-Based Remediation

Parent workflow triggered by Dynatrace problem event:

```json
{
  "title": "Parent - Remediate RDS Performance Problem",
  "tasks": {
    "get-problem-details": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "67df876f-6e4a-4942-b565-7f40c502daec",
        "workflowInput": "{\"event.id\": \"{{ event.id }}\"}"
      }
    },
    "increase-storage": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6",
        "workflowInput": "{\n  \"dbInstanceIdentifier\": \"{{ result(\"identify-instance\").instanceId }}\",\n  \"newStorageSize\": \"{{ result(\"get-problem-details\").recommendedSize }}\",\n  \"awsregion\": \"us-east-1\",\n  \"applyImmediately\": \"true\",\n  \"dynatraceawsconnection\": \"awsplayground\"\n}"
      },
      "predecessors": ["get-problem-details"]
    },
    "verify-problem-resolved": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "subworkflow-dynatrace-check-if-problem-is-solved-or-closed",
        "workflowInput": "{\"problemId\": \"{{ event.id }}\"}"
      },
      "predecessors": ["increase-storage"],
      "retry": {
        "count": 10,
        "delay": 60
      }
    }
  }
}
```

## Pattern 2: Metric-Triggered Scaling

Parent triggered by high metric alert:

```json
{
  "title": "Parent - Auto-Scale DynamoDB on Throttling",
  "trigger": {
    "type": "davis_problem",
    "filters": {
      "problemType": "RESOURCE_EXHAUSTION",
      "affectedEntityType": "DYNAMODB_TABLE"
    }
  },
  "tasks": {
    "get-table-metrics": {
      "action": "dynatrace.automations:run-javascript",
      "input": {
        "script": "// Get current table metrics\nimport { metricsClient } from '@dynatrace-sdk/client-classic-environment-v2';\n\nexport default async function() {\n  const metrics = await metricsClient.query({\n    metric: 'builtin:dynamodb_table.throttledRequests()',\n    filter: 'eq(table_name, \"' + entityId + '\")'\n  });\n  return { throttled: metrics.result[0].values[0][1] > 0 };\n}"
      }
    },
    "calculate-new-capacity": {
      "action": "dynatrace.automations:run-javascript",
      "input": {
        "script": "export default async function() {\n  return {\n    readCapacityUnits: 500,\n    writeCapacityUnits: 500\n  };\n}"
      },
      "predecessors": ["get-table-metrics"]
    },
    "scale-table": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "a7b8c9da-e1f2-53ge-b5c6-d7e8f9a0b1c2",
        "workflowInput": "{\n  \"tableName\": \"{{ event.affectedEntityId }}\",\n  \"readCapacityUnits\": \"{{ result(\"calculate-new-capacity\").readCapacityUnits }}\",\n  \"writeCapacityUnits\": \"{{ result(\"calculate-new-capacity\").writeCapacityUnits }}\",\n  \"awsregion\": \"us-east-1\",\n  \"dynatraceawsconnection\": \"awsplayground\"\n}"
      },
      "predecessors": ["calculate-new-capacity"]
    }
  }
}
```

## Pattern 3: Compliance Enforcement

Parent workflow for security remediation:

```json
{
  "title": "Parent - Enable Security Logging Across AWS Account",
  "trigger": {
    "type": "manual"
  },
  "tasks": {
    "enable-vpc-flow-logs": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "e5f6a7b8-c9da-51ec-f3a4-b5c6d7e8f9a0",
        "workflowInput": "{\n  \"vpcId\": \"vpc-12345678\",\n  \"trafficType\": \"ALL\",\n  \"logGroupName\": \"/aws/vpc/flowlogs\",\n  \"iamRoleArn\": \"arn:aws:iam::123456789012:role/vpc-flow-logs\",\n  \"awsregion\": \"us-east-1\",\n  \"dynatraceawsconnection\": \"awsplayground\"\n}"
      }
    },
    "enable-cloudtrail": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "f6a7b8c9-dae0-52fd-a4b5-c6d7e8f9a0b1",
        "workflowInput": "{\n  \"trailName\": \"organization-trail\",\n  \"s3BucketName\": \"my-cloudtrail-logs\",\n  \"isMultiRegionTrail\": \"true\",\n  \"enableLogFileValidation\": \"true\",\n  \"awsregion\": \"us-east-1\",\n  \"dynatraceawsconnection\": \"awsplayground\"\n}"
      }
    },
    "enable-ebs-encryption": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "b2c3d4e5-f6a7-48b9-c0d1-e2f3a4b5c6d7",
        "workflowInput": "{\n  \"volumeId\": \"vol-12345678\",\n  \"awsregion\": \"us-east-1\",\n  \"instanceId\": \"i-1234567890abcdef0\",\n  \"deviceName\": \"/dev/sda1\",\n  \"dynatraceawsconnection\": \"awsplayground\"\n}"
      }
    }
  }
}
```

## Pattern 4: Proactive Backup & DR

Parent workflow for backup maintenance:

```json
{
  "title": "Parent - Daily RDS Backup and Retention Check",
  "trigger": {
    "type": "scheduled",
    "schedule": "0 2 * * *"
  },
  "tasks": {
    "create-snapshot": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "c9dae1f2-a3b4-55hi-d7e8-f9a0b1c2d3e4",
        "workflowInput": "{\n  \"dbInstanceIdentifier\": \"my-database\",\n  \"snapshotIdentifier\": \"my-database-backup-$(date +%Y%m%d-%H%M%S)\",\n  \"tagsJson\": \"{\\\"Environment\\\":\\\"production\\\",\\\"BackupType\\\":\\\"daily\\\"}\",\n  \"awsregion\": \"us-east-1\",\n  \"dynatraceawsconnection\": \"awsplayground\"\n}"
      }
    },
    "update-backup-retention": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "f6a7b8c9-dae0-52fd-a4b5-c6d7e8f9a0b1",
        "workflowInput": "{\n  \"dbInstanceIdentifier\": \"my-database\",\n  \"backupRetentionPeriod\": \"30\",\n  \"preferredBackupWindow\": \"03:00-04:00\",\n  \"awsregion\": \"us-east-1\",\n  \"dynatraceawsconnection\": \"awsplayground\"\n}"
      },
      "predecessors": ["create-snapshot"]
    }
  }
}
```

## Pattern 5: Cost Optimization

Parent workflow for resource cleanup:

```json
{
  "title": "Parent - Cost Optimization - Terminate Unused Resources",
  "trigger": {
    "type": "manual"
  },
  "tasks": {
    "identify-unused-instances": {
      "action": "dynatrace.automations:run-javascript",
      "input": {
        "script": "// Identify instances with < 5% CPU for 7 days\nexport default async function() {\n  return {\n    unusedInstances: [\"i-1234567890abcdef0\", \"i-0987654321zyxwvut9\"]\n  };\n}"
      }
    },
    "terminate-instances": {
      "action": "dynatrace.automations:run-workflow",
      "input": {
        "workflowId": "b8c9dae1-f2a3-54gh-c6d7-e8f9a0b1c2d3",
        "workflowInput": "{\n  \"instanceIds\": \"{{ result(\"identify-unused-instances\").unusedInstances }}\",\n  \"awsregion\": \"us-east-1\",\n  \"requireConfirmation\": \"true\",\n  \"preserveInstances\": \"[]\",\n  \"dynatraceawsconnection\": \"awsplayground\"\n}"
      },
      "predecessors": ["identify-unused-instances"]
    }
  }
}
```

## Key Integration Points

### Trigger Types
- **Problem Events**: `{{ event.problemId }}`, `{{ event.affectedEntityId }}`
- **Alert Metrics**: Custom metrics via `dynatrace.automations:run-javascript`
- **Scheduled**: CRON expressions
- **Manual**: User-initiated execution

### Error Handling
```json
{
  "task-name": {
    "onFailure": "restart",
    "retry": {
      "count": 3,
      "delay": 60
    }
  }
}
```

### Workflow Results
```json
"workflowInput": "{\n  \"param\": \"{{ result(\"previous-task\").field }}\",\n  \"derived\": \"{{ input()[\"passthrough\"] }}\"\n}"
```

### Conditional Execution
```json
{
  "conditions": {
    "states": {
      "previous-task": "OK"
    }
  },
  "predecessors": ["previous-task"]
}
```

## Testing Recommendations

1. **Dev Environment**: Test with non-critical resources
2. **Parameter Validation**: Verify all parameters before subworkflow call
3. **Monitoring**: Track subworkflow execution metrics
4. **Feedback Loop**: Notify teams of automated actions
5. **Runbook Update**: Document any custom configurations

## Dynatrace Event Values Reference

Common event variables for problem-triggered workflows:

```
event.id              - Problem UUID
event.problemId       - Easily readable ID
event.title           - Problem title
event.affectedEntityId - Entity under problem
event.affectedEntityType - Type of entity
event.severity        - RESOURCE_CONTENTION, SLOWDOWN, AVAILABILITY, etc.
event.impact          - APPLICATION, INFRASTRUCTURE, etc.
```

## Connection Setup

All workflows require AWS OIDC connection configuration in Dynatrace:

```
Connection Type: builtin:hyperscaler-authentication.connections.aws
Connection Name: awsplayground (or custom name)
Authentication: OIDC Token Exchange
IAM Role: Role allowing subworkflow actions
```

