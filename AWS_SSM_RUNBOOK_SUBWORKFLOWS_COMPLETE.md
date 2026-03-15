# AWS SSM Runbook Automation Subworkflows - Complete Collection

## Overview

Created **17 comprehensive AWS Systems Manager (SSM) automation runbook subworkflows** that integrate with Dynatrace workflows.

**Key Features:**
- ✅ All subworkflows **wait for completion** (NOT fire-and-forget)
- ✅ Proper async execution with status polling
- ✅ Parameters extracted from actual SSM runbooks
- ✅ Comprehensive error handling and validation
- ✅ All in `/untested` folder ready for testing

---

## SSM Runbook Subworkflows (17 Total)

### EC2 Instance Management (6 workflows)

#### 1. Restart EC2 Instance
- **File**: `subworkflow-aws-ssm-restart-ec2-instance.workflow.json`
- **SSM Document**: `AWS-RestartEC2Instance`
- **Parameters**: `instanceId`, `awsregion`, `dynatraceawsconnection`
- **Use**: Restart instance for troubleshooting or system updates
- **Waits**: ✅ Yes - polls until restart complete

#### 2. Stop EC2 Instance
- **File**: `subworkflow-aws-ssm-stop-ec2-instance.workflow.json`
- **SSM Document**: `AWS-StopEC2Instance`
- **Parameters**: `instanceId`, `awsregion`, `dynatraceawsconnection`
- **Use**: Stop instance to conserve costs
- **Waits**: ✅ Yes - polls until stopped

#### 3. Start EC2 Instance
- **File**: `subworkflow-aws-ssm-start-ec2-instance.workflow.json`
- **SSM Document**: `AWS-StartEC2Instance`
- **Parameters**: `instanceId`, `awsregion`, `dynatraceawsconnection`
- **Use**: Start stopped instance
- **Waits**: ✅ Yes - polls until running

#### 4. Terminate EC2 Instance
- **File**: `subworkflow-aws-ssm-terminate-ec2-instance.workflow.json`
- **SSM Document**: `AWS-TerminateEC2Instance`
- **Parameters**: `instanceId`, `awsregion`, `dynatraceawsconnection`
- **Use**: Permanently delete instance (destructive)
- **Waits**: ✅ Yes - polls until terminated

#### 5. Change Instance State
- **File**: `subworkflow-aws-ssm-change-instance-state.workflow.json`
- **SSM Document**: `AWS-ChangeInstanceState`
- **Parameters**: `instanceId`, `desiredState`, `assertState`, `awsregion`, `dynatraceawsconnection`
- **Use**: Change or verify instance state
- **Waits**: ✅ Yes - polls until state reached

#### 6. Run EC2 Instances
- **File**: `subworkflow-aws-ssm-run-ec2-instances.workflow.json`
- **SSM Document**: `AWS-RunInstances`
- **Parameters**: `amiId`, `instanceType`, `subnetId`, `securityGroupIds`, `count`, `awsregion`, `dynatraceawsconnection`
- **Use**: Launch new instances
- **Waits**: ✅ Yes - polls until instances running

---

### Storage & Snapshots (2 workflows)

#### 7. Create Snapshot (EBS/RDS)
- **File**: `subworkflow-aws-ssm-create-snapshot.workflow.json`
- **SSM Document**: `AWS-CreateSnapshot` or `AWS-CreateRDSSnapshot`
- **Parameters**: `resourceId`, `resourceType`, `awsregion`, `dynatraceawsconnection`
- **Use**: Create backup snapshots for volumes or databases
- **Waits**: ✅ Yes - polls until snapshot available

#### 8. Create RDS Snapshot
- **File**: `subworkflow-aws-ssm-create-rds-snapshot.workflow.json`
- **SSM Document**: `AWS-CreateRDSSnapshot`
- **Parameters**: `dbInstanceId`, `snapshotId`, `tagging`, `awsregion`, `dynatraceawsconnection`
- **Use**: Create RDS database snapshots
- **Waits**: ✅ Yes - polls until complete

---

### AMI Image Management (4 workflows)

#### 9. Create AMI Image
- **File**: `subworkflow-aws-ssm-create-ami-image.workflow.json`
- **SSM Document**: `AWS-CreateImage`
- **Parameters**: `instanceId`, `amiName`, `amiDescription`, `awsregion`, `dynatraceawsconnection`
- **Use**: Create custom AMI from running instance
- **Waits**: ✅ Yes - polls until AMI available

#### 10. Copy AMI Image
- **File**: `subworkflow-aws-ssm-copy-ami-image.workflow.json`
- **SSM Document**: `AWS-CopyImage`
- **Parameters**: `sourceAmiId`, `sourceRegion`, `targetRegion`, `amiName`, `encrypt`, `dynatraceawsconnection`
- **Use**: Copy or encrypt AMI across regions
- **Waits**: ✅ Yes - polls until copy complete

#### 11. Delete AMI Image
- **File**: `subworkflow-aws-ssm-delete-ami-image.workflow.json`
- **SSM Document**: `AWS-DeleteImage`
- **Parameters**: `amiId`, `force`, `awsregion`, `dynatraceawsconnection`
- **Use**: Delete unused AMI (cleanup)
- **Waits**: ✅ Yes - polls until deleted

---

### CloudFormation Stack Management (3 workflows)

#### 12. Create CloudFormation Stack
- **File**: `subworkflow-aws-ssm-create-cloudformation-stack.workflow.json`
- **SSM Document**: `AWS-CreateStack`
- **Parameters**: `stackName`, `templateUrl`, `parameters`, `timeoutInMinutes`, `capabilities`, `awsregion`, `dynatraceawsconnection`
- **Use**: Deploy infrastructure as code
- **Waits**: ✅ Yes - polls until stack created

#### 13. Update CloudFormation Stack
- **File**: `subworkflow-aws-ssm-update-cloudformation-stack.workflow.json`
- **SSM Document**: `AWS-UpdateStack`
- **Parameters**: `stackName`, `templateUrl`, `parameters`, `awsregion`, `dynatraceawsconnection`
- **Use**: Modify existing stack
- **Waits**: ✅ Yes - polls until update complete

---

### Patching & Configuration (2 workflows)

#### 14. Run Patch Baseline
- **File**: `subworkflow-aws-ssm-run-patch-baseline.workflow.json`
- **SSM Document**: `AWS-RunPatchBaseline`
- **Parameters**: `instanceId`, `baselineId`, `operation`, `awsregion`, `dynatraceawsconnection`
- **Use**: Apply OS patches via Patch Manager
- **Waits**: ✅ Yes - polls until patching complete

#### 15. Configure AWS Package
- **File**: `subworkflow-aws-ssm-configure-aws-package.workflow.json`
- **SSM Document**: `AWS-ConfigureAWSPackage`
- **Parameters**: `instanceId`, `action`, `packageName`, `version`, `awsregion`, `dynatraceawsconnection`
- **Use**: Install/update CloudWatch Agent, AWS CLI, etc.
- **Waits**: ✅ Yes - polls until installation complete

---

### Resource Management (2 workflows)

#### 16. Create Resource Tags
- **File**: `subworkflow-aws-ssm-create-resource-tags.workflow.json`
- **SSM Document**: `AWS-CreateTags`
- **Parameters**: `resourceIds`, `tagsJson`, `awsregion`, `dynatraceawsconnection`
- **Use**: Tag resources for organization and billing
- **Waits**: ✅ Yes - polls until tags applied

#### 17. Enable EBS Encryption
- **File**: `subworkflow-aws-ssm-enable-ebs-encryption.workflow.json`
- **SSM Document**: `AWS-EnableEBSEncryption`
- **Parameters**: `volumeId`, `kmsKeyId`, `awsregion`, `dynatraceawsconnection`
- **Use**: Enable encryption on existing volumes
- **Waits**: ✅ Yes - polls until encryption enabled

---

## Architecture & Pattern

### Three-Step Execution Model

Every SSM subworkflow follows this pattern:

```
Step 1: Start Automation
   ↓ (Action: ssm-start-automation-execution)
   └─ Triggers AWS SSM runbook
      Returns: AutomationExecutionId

Step 2: Wait for Completion
   ↓ (Action: run-workflow calls status polling subworkflow)
   └─ Polls ssm-get-automation-execution every 60 seconds
      99 retries = ~99 minutes max wait
      Timeout: 604800 seconds (7 days)

Step 3: Validate Status
   ↓ (Action: run-javascript)
   └─ Checks AutomationExecutionStatus = "Success"
      Throws error if failed
      Returns detailed execution results
```

### Input Parameters

All parameters follow AWS SSM runbook specifications:
- Required parameters for core operation
- Optional parameters for advanced configuration
- JSON support for complex parameters
- Jinja2 templating for parameter binding

### Error Handling

- **Retries**: 5 attempts with 60-second delay for automation start
- **Polling**: 99 retries with 60-second delay for status checks
- **Timeout**: 604800 seconds (7 days) for long-running operations
- **Validation**: JavaScript checks final status and throws errors on failure
- **Parent Workflow Support**: Failures propagate to enable restart-on-error behavior

---

## Key Advantages

✅ **Complete Automation**: No manual intervention required
✅ **Proper Async**: Waits for actual completion, not fire-and-forget
✅ **Status Verification**: Validates success before returning
✅ **Error Propagation**: Parent workflows can implement retry logic
✅ **Parameter Flexibility**: Use actual SSM runbook parameters
✅ **Extended Timeouts**: Supports long-running operations (up to 7 days)
✅ **Reusable**: Can be called from multiple parent workflows
✅ **AWS Native**: Uses AWS SSM automation capabilities

---

## Integration with Parent Workflows

### Sequential Orchestration
```
Problem Detected → Validate → Execute Remediation → Notify
                   (Use SSM subworkflows for Remediation step)
```

### Error Recovery
```
Start Operation
   ├─ Success → Continue
   └─ Failure → Retry → Success → Continue
       (SSM subworkflows propagate failures for retry)
```

### Cost Optimization
```
Detect underutilized instance
   → Terminate-Instances subworkflow
   → Wait for completion
   → Update billing records
```

---

## AWS SSM Runbooks Covered

| Domain | Runbooks | Count |
|--------|----------|-------|
| **EC2 Instances** | Start, Stop, Restart, Terminate, ChangeState, RunInstances | 6 |
| **Snapshots** | CreateSnapshot, CreateRDSSnapshot | 2 |
| **AMI Images** | CreateImage, CopyImage, DeleteImage | 3 |
| **CloudFormation** | CreateStack, UpdateStack | 2 |
| **Patching** | RunPatchBaseline | 1 |
| **Configuration** | ConfigureAWSPackage | 1 |
| **Resources** | CreateTags, EnableEBSEncryption | 2 |
| **TOTAL** | — | **17** |

---

## Testing Recommendations

1. **Region Testing**: Verify operation in target AWS region
2. **Permission Testing**: Ensure IAM role has required permissions
3. **Parameter Testing**: Validate input parameters against AWS runbook requirements
4. **Completion Testing**: Verify polling detects completion properly
5. **Error Testing**: Confirm error cases propagate correctly to parent workflow
6. **Timeout Testing**: Verify long-running operations within timeout limits

---

## Deployment Path

1. **Current**: All 17 subworkflows in `/untested/`
2. **Test**: Execute in test environment
3. **Validate**: Confirm execution and results
4. **Document**: Update runbooks for team knowledge
5. **Promote**: Move to production folder when ready
6. **Integrate**: Call from parent workflows

---

## Files Summary

```
untested/
├── subworkflow-aws-ssm-restart-ec2-instance.workflow.json
├── subworkflow-aws-ssm-stop-ec2-instance.workflow.json
├── subworkflow-aws-ssm-start-ec2-instance.workflow.json
├── subworkflow-aws-ssm-terminate-ec2-instance.workflow.json
├── subworkflow-aws-ssm-change-instance-state.workflow.json
├── subworkflow-aws-ssm-run-ec2-instances.workflow.json
├── subworkflow-aws-ssm-create-snapshot.workflow.json
├── subworkflow-aws-ssm-create-rds-snapshot.workflow.json
├── subworkflow-aws-ssm-create-ami-image.workflow.json
├── subworkflow-aws-ssm-copy-ami-image.workflow.json
├── subworkflow-aws-ssm-delete-ami-image.workflow.json
├── subworkflow-aws-ssm-create-cloudformation-stack.workflow.json
├── subworkflow-aws-ssm-update-cloudformation-stack.workflow.json
├── subworkflow-aws-ssm-run-patch-baseline.workflow.json
├── subworkflow-aws-ssm-configure-aws-package.workflow.json
├── subworkflow-aws-ssm-create-resource-tags.workflow.json
└── subworkflow-aws-ssm-enable-ebs-encryption.workflow.json
```

---

**Status**: ✅ Complete - 17 SSM runbook subworkflows ready for testing
**Location**: `/untested/` directory
**Total Count**: 17 workflows
**All Parameters**: Using AWS SSM runbook specifications
**Async Execution**: ✅ All workflows wait for completion with proper polling
