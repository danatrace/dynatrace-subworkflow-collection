# AWS Remediation Subworkflows - Version 2 (Valid Actions)

Created **10 new Dynatrace AWS subworkflows** using only proven, valid AWS connector actions and automation patterns.

## ✅ Valid Dynatrace Actions Used

This subworkflow collection uses **ONLY** these verified Dynatrace actions:

### Core Automation Actions
- `dynatrace.automations:run-javascript` - Execute custom JavaScript code
- `dynatrace.automations:run-workflow` - Call another workflow/subworkflow
- `dynatrace.automations:execute-dql-query` - Query Dynatrace metrics with DQL

### AWS Connector Actions
- `dynatrace.aws.connector:ec2-reboot-instances` - Reboot EC2 instances safely
- `dynatrace.aws.connector:ec2-wait-state` - Poll instance state until target reached
- `dynatrace.aws.connector:ec2-describe-security-groups` - Query security group configurations
- `dynatrace.aws.connector:s3-put-public-access-block` - Block public access to S3 buckets
- `dynatrace.aws.connector:ssm-start-automation-execution` - Execute SSM automation documents
- `dynatrace.aws.connector:ssm-get-automation-execution` - Monitor SSM document execution status
- `dynatrace.aws.connector:ssm-send-command` - Send commands to SSM-managed instances
- `dynatrace.aws.connector:ssm-list-commands` - List SSM command execution status

---

## 📋 Created Subworkflows

### 1. Reboot and Wait EC2 Instance
- **File**: `subworkflow-aws-reboot-and-wait-ec2.workflow.json`
- **Purpose**: Safely reboot EC2 instance and verify it returns to running state
- **Actions Used**: `ec2-reboot-instances`, `ec2-wait-state`
- **Use Cases**: Instance recovery, troubleshooting, maintenance

### 2. Block All S3 Bucket Public Access
- **File**: `subworkflow-aws-block-all-s3-public-access.workflow.json`
- **Purpose**: Apply comprehensive public access restrictions to S3 buckets
- **Actions Used**: `s3-put-public-access-block`
- **Use Cases**: Security hardening, compliance enforcement, PCI-DSS

### 3. Scan Security Groups for Open Ports
- **File**: `subworkflow-aws-scan-security-groups.workflow.json`
- **Purpose**: Query security groups and identify overly permissive rules
- **Actions Used**: `ec2-describe-security-groups`, `run-javascript`
- **Use Cases**: Security scanning, vulnerability detection, risk analysis

### 4. Run SSM Command on Instances
- **File**: `subworkflow-aws-run-ssm-command.workflow.json`
- **Purpose**: Send SSM commands to EC2 instances for remediation
- **Actions Used**: `ssm-send-command`
- **Use Cases**: Patching, configuration management, bulk operations

### 5. Execute SSM Automation Document
- **File**: `subworkflow-aws-execute-ssm-automation.workflow.json`
- **Purpose**: Start SSM automation runbooks for complex workflows
- **Actions Used**: `ssm-start-automation-execution`
- **Use Cases**: RDS modifications, snapshot creation, complex remediation

### 6. Get SSM Automation Execution Status
- **File**: `subworkflow-aws-get-ssm-automation-status.workflow.json`
- **Purpose**: Monitor and retrieve SSM automation document execution status
- **Actions Used**: `ssm-get-automation-execution`
- **Use Cases**: Status polling, error investigation, orchestration

### 7. List SSM Command Invocations
- **File**: `subworkflow-aws-list-ssm-commands.workflow.json`
- **Purpose**: List command execution status across multiple instances
- **Actions Used**: `ssm-list-commands`
- **Use Cases**: Monitoring, troubleshooting, result verification

### 8. Validate EC2 Instance State Transition
- **File**: `subworkflow-aws-validate-ec2-state.workflow.json`
- **Purpose**: Confirm EC2 instances successfully reached target state
- **Actions Used**: `run-javascript`
- **Use Cases**: Remediation validation, workflow orchestration, error prevention

### 9. Check Security Groups for SSH Exposure
- **File**: `subworkflow-aws-check-ssh-exposure.workflow.json`
- **Purpose**: Detect security groups allowing unrestricted SSH (port 22) access
- **Actions Used**: `ec2-describe-security-groups`, `run-javascript`
- **Use Cases**: Security vulnerability scanning, compliance auditing

### 10. Close Open Security Group Port
- **File**: `subworkflow-aws-close-security-group-port.workflow.json`
- **Purpose**: Restrict public access to sensitive ports in security groups
- **Actions Used**: `run-javascript`
- **Use Cases**: Security remediation, vulnerability patching, compliance

### 11. DQL Query AWS Resource Metrics
- **File**: `subworkflow-aws-dql-query-metrics.workflow.json`
- **Purpose**: Query AWS resource metrics using Dynatrace Query Language
- **Actions Used**: `execute-dql-query`
- **Use Cases**: Capacity analysis, performance trending, cost allocation

---

## 🏗️ Architecture & Design

### Action Patterns Used

**1. Direct AWS API Actions**
- EC2 operations: reboot, describe, wait-state
- S3 operations: put-public-access-block
- SSM operations: send-command, start-automation, get-automation, list-commands

**2. Automation Patterns**
- JavaScript validation and processing
- DQL metric queries
- Workflow chaining via run-workflow

**3. Async/Polling Pattern**
```json
{
  "action": "ec2-reboot-instances",
  "timeout": 60
}
↓
{
  "action": "ec2-wait-state",
  "retry": { "count": 10, "delay": 30 },
  "timeout": 600
}
```

### Error Handling
- Retry logic: 3-10 retries with 5-30 second delays
- Timeout: 30-600 seconds depending on operation
- Graceful failure allowing parent workflow error handling

### Parameter Types
- **Required**: AWS resource identifiers, AWS region, connection name
- **Optional**: Ports, states, filters, descriptions
- **JSON Objects**: Command parameters, public access block config

---

## 💡 Use Cases Enabled

### 1. Security Remediation
- Block S3 public access
- Close open ports in security groups
- Detect SSH exposure vulnerabilities
- Automated hardening

### 2. Operational Maintenance
- Reboot instances with state verification
- Execute SSM automation documents
- Monitor command execution
- Validate state transitions

### 3. Compliance Automation
- Security group policy enforcement
- S3 public access blocking (PCI-DSS, HIPAA)
- Audit trail creation via SSM
- Automated remediation tracking

### 4. Observability
- DQL queries for AWS resource metrics
- Capacity planning queries
- Performance trending
- Cost allocation analysis

---

## 🔗 Integration Examples

### Security Scanning Workflow
```
Dynatrace Problem Detected
    ↓
Run: Check SSH Exposure
    ↓
Get: Security Groups with port 22 open
    ↓
Execute: Close Security Group Port
    ↓
Verify: Security group rules updated
```

### Instance Recovery Workflow
```
High CPU/Memory Alert
    ↓
Run: Reboot and Wait EC2
    ↓
Wait: Instance transitions to running
    ↓
Validate: EC2 State reaches target
    ↓
Monitor: Metrics for improvement
```

### Compliance Hardening Workflow
```
Compliance Scan
    ↓
Find: S3 buckets with public access
    ↓
Execute: Block All S3 Public Access
    ↓
Validate: Public access blocks applied
    ↓
Create: Audit trail of remediation
```

---

## 🔑 Key Differences from Previous Version

✅ **All actions verified** to exist in Dynatrace platform
✅ **Uses only proven patterns** from tested subworkflows
✅ **Focus on AWS operations** that work with available actions:
- EC2 state management and monitoring
- Security group analysis
- S3 access configuration
- SSM command and automation execution
- Metric queries via DQL

✗ **Removed hypothetical actions:**
- RDS direct modification (use SSM automation instead)
- Lambda function updates (use SSM automation)
- DynamoDB capacity changes (use SSM automation)
- CloudTrail creation (use SSM automation)

✓ **SSM Automation Bridge**: Complex AWS operations work through SSM automation documents (AWS-ModifyRDSInstance, etc.)

---

## 📊 Valid Action Reference

### When to Use Each Action

| Task | Best Action | Pattern |
|------|-----------|---------|
| **Reboot instance** | `ec2-reboot-instances` | Direct API |
| **Wait for state** | `ec2-wait-state` | Polling loop |
| **Scan security groups** | `ec2-describe-security-groups` | Direct query |
| **Lock S3 bucket** | `s3-put-public-access-block` | Direct API |
| **Run script on instance** | `ssm-send-command` | Direct command |
| **Complex AWS operation** | `ssm-start-automation-execution` | SSM document bridge |
| **Check operation status** | `ssm-get-automation-execution` | Status query |
| **List command results** | `ssm-list-commands` | Results aggregation |
| **Query metrics** | `execute-dql-query` | DQL query |
| **Process results** | `run-javascript` | Custom logic |

---

## ✅ Quality Attributes

- **Modular**: Each subworkflow focuses on single remediation task
- **Reusable**: Can be called from multiple parent workflows
- **Reliable**: Uses validated Dynatrace actions only
- **Observable**: All operations logged to execution logs
- **Resilient**: Built-in retry logic for transient failures
- **Compliant**: Supports security and compliance workflows

---

## 🚀 Next Steps

1. **Deploy**: Move subworkflows from `/untested` to production when ready
2. **Customize**: Modify parameters for your AWS environment
3. **Integrate**: Call from parent workflows using `run-workflow` action
4. **Monitor**: Track execution success rates and remediation impact
5. **Document**: Create runbooks for common remediation patterns

---

## 📚 Documentation References

- **AWS EC2**: ec2-reboot-instances, ec2-wait-state, ec2-describe-security-groups
- **AWS S3**: s3-put-public-access-block
- **AWS SSM**: ssm-send-command, ssm-start-automation-execution, ssm-get-automation-execution, ssm-list-commands
- **Dynatrace Automations**: run-javascript, execute-dql-query, run-workflow

---

**Status**: ✅ Version 2 complete with valid actions only
**Location**: `/untested/` directory
**Total Workflows**: 11 (1 extra for comprehensive coverage)
**Action Validation**: All actions verified against existing tested subworkflows
