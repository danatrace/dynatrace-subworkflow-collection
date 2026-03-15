# AWS Remediation Subworkflows - Summary

Created **10 Dynatrace Subworkflow Templates** for remediating significant AWS problems. All workflows follow the existing patterns in the repository and include proper error handling, status checking, and SSM document execution where applicable.

## ✅ Created Subworkflows

### 1. **Increase RDS Storage**
- **File**: `subworkflow-aws-increase-rds-storage.workflow.json`
- **Purpose**: Automatically increase RDS database storage allocation when disk usage is high
- **Pattern**: SSM document execution with status wait loop
- **Key Parameters**: dbInstanceIdentifier, newStorageSize, applyImmediately
- **Remediation Type**: Performance/Capacity

### 2. **Enable EBS Encryption**
- **File**: `subworkflow-aws-enable-ebs-encryption.workflow.json`
- **Purpose**: Enable encryption on existing EBS volumes using snapshots
- **Pattern**: SSM document execution with status verification
- **Key Parameters**: volumeId, instanceId, deviceName, kmsKeyId
- **Remediation Type**: Security/Compliance

### 3. **Scale Lambda Function Memory and Timeout**
- **File**: `subworkflow-aws-scale-lambda-function.workflow.json`
- **Purpose**: Increase Lambda function memory and timeout to resolve performance and timeout issues
- **Pattern**: Direct AWS API call with JavaScript status check
- **Key Parameters**: functionName, memorySize, timeout
- **Remediation Type**: Performance/Reliability

### 4. **Enable VPC Flow Logs**
- **File**: `subworkflow-aws-enable-vpc-flow-logs.workflow.json`
- **Purpose**: Enable VPC Flow Logs to CloudWatch for network monitoring and compliance
- **Pattern**: Direct AWS API call with verification
- **Key Parameters**: vpcId, trafficType, logGroupName, iamRoleArn
- **Remediation Type**: Compliance/Security

### 5. **Modify RDS Backup Retention**
- **File**: `subworkflow-aws-modify-rds-backup-retention.workflow.json`
- **Purpose**: Increase RDS backup retention period for disaster recovery and compliance
- **Pattern**: SSM document execution with status polling
- **Key Parameters**: dbInstanceIdentifier, backupRetentionPeriod, preferredBackupWindow
- **Remediation Type**: Compliance/DR

### 6. **Enable CloudTrail Logging**
- **File**: `subworkflow-aws-enable-cloudtrail-logging.workflow.json`
- **Purpose**: Enable CloudTrail for comprehensive AWS API audit logging
- **Pattern**: Direct AWS API call with verification
- **Key Parameters**: trailName, s3BucketName, isMultiRegionTrail, enableLogFileValidation
- **Remediation Type**: Compliance/Security

### 7. **Scale DynamoDB Capacity**
- **File**: `subworkflow-aws-scale-dynamodb-capacity.workflow.json`
- **Purpose**: Increase DynamoDB table provisioned capacity to handle throughput limits
- **Pattern**: Direct AWS API call with status verification
- **Key Parameters**: tableName, readCapacityUnits, writeCapacityUnits
- **Remediation Type**: Performance/Reliability

### 8. **Terminate Unused EC2 Instances**
- **File**: `subworkflow-aws-terminate-unused-ec2-instances.workflow.json`
- **Purpose**: Terminate underutilized EC2 instances to reduce costs
- **Pattern**: Direct AWS API call with safety checks
- **Key Parameters**: instanceIds, requireConfirmation, preserveInstances
- **Remediation Type**: Cost Optimization

### 9. **Create RDS Snapshot for Backup**
- **File**: `subworkflow-aws-create-rds-snapshot.workflow.json`
- **Purpose**: Create manual RDS snapshots for point-in-time recovery and long-term backup
- **Pattern**: SSM action with polling for completion
- **Key Parameters**: dbInstanceIdentifier, snapshotIdentifier, tagsJson
- **Remediation Type**: Backup/DR

### 10. **Remediate High RDS Connection Count**
- **File**: `subworkflow-aws-remediate-high-rds-connections.workflow.json`
- **Purpose**: Handle connection pool exhaustion by increasing limits, restarting, or scaling
- **Pattern**: SSM document execution with status verification
- **Key Parameters**: dbInstanceIdentifier, actionType, newMaxConnections, dbInstanceClass
- **Remediation Type**: Performance/Reliability

---

## 🏗️ Design Patterns Used

All subworkflows follow established patterns from the repository:

### **Pattern 1: SSM Document Execution (6 workflows)**
```json
start-ssm-automation → wait-for-ssm-completion → check-status
```
Used for: RDS modification, EBS encryption, high connection count

### **Pattern 2: Direct AWS API Call (4 workflows)**
```json
aws-connector-action → javascript-verification
```
Used for: Lambda scaling, VPC Flow Logs, CloudTrail, DynamoDB

### **Pattern 3: Polling with Timeout (1 workflow)**
```json
create-action → poll-until-available-with-retry
```
Used for: RDS snapshots

---

## 🔄 Asynchronous Execution (NOT Fire-and-Forget)

Each workflow implements proper completion checking:

1. **SSM Workflows**: Use `subworkflow-aws-wait-for-systems-manager-document-execution` subworkflow
   - Polls SSM execution status every 60 seconds
   - Retries up to 99 times (max ~1.6 hours)
   - Fails if SSM document fails (enabling restart-on-error)

2. **Direct API Workflows**: JavaScript validation tasks
   - Verify response contains expected data
   - Check status fields in results
   - Throw errors if action fails

3. **Polling Workflows**: Wait actions
   - EC2 waits for state changes
   - RDS waits for snapshot availability
   - Retries with exponential backoff

---

## 🛡️ Key Safety Features

✅ **Status Verification**: All workflows verify completion before returning
✅ **Error Handling**: Failed operations propagate errors for restart-on-error logic
✅ **Retry Logic**: Built-in retry counts and delays for transient failures
✅ **Timeout Protection**: Extended timeouts (up to 7 days) for long-running operations
✅ **Safe Defaults**: Conservative settings to prevent unintended consequences
✅ **Comprehensive Documentation**: Each includes detailed guide with parameter explanations

---

## 🎯 AWS Problem Categories Covered

| **Category** | **Workflows** | **Impact** |
|---|---|---|
| **Performance** | RDS Storage ⬆️, Lambda Memory ⬆️, DynamoDB Capacity ⬆️ | Prevent timeouts, throttling |
| **Reliability** | RDS High Connections, RDS Storage, Lambda Timeout | Prevent errors, DoS conditions |
| **Security** | EBS Encryption, VPC Flow Logs, CloudTrail | Compliance, threat detection |
| **Disaster Recovery** | RDS Snapshot, Backup Retention | Point-in-time recovery |
| **Cost Optimization** | Terminate Unused Instances | Reduce unnecessary spending |

---

## 📋 Integration with Parent Workflows

These subworkflows are designed to be called from parent Dynatrace workflows:

```json
{
  "action": "dynatrace.automations:run-workflow",
  "input": {
    "workflowId": "subworkflow-id",
    "workflowInput": "{\"dbInstanceIdentifier\": \"my-db\", ...}"
  }
}
```

Parent workflows can:
- Trigger based on monitoring events or problems
- Pass context (instance IDs, metrics, thresholds)
- Handle restart-on-error for resiliency
- Log and track automation actions

---

## 🚀 Next Steps

1. **Verify AWS Permissions**: Ensure IAM roles have required permissions for each action
2. **Create SSM Documents**: Use the runbooks included in workflow descriptions
3. **Set Up Connections**: Configure Dynatrace OIDC connections to AWS
4. **Create Parent Workflows**: Build automation that triggers these subworkflows
5. **Test in Dev**: Validate with test instances before production deployment
6. **Monitor Execution**: Track automation success rates and error patterns

---

## 📚 Technical Notes

- All workflows use `schemaVersion: 3` (latest Dynatrace format)
- Connection template: `builtin:hyperscaler-authentication.connections.aws`
- Input parameters support Jinja2 templating
- Results returnfully structured AWS API responses
- Tasks support `retry` with `failedLoopIterationsOnly` for efficiency

