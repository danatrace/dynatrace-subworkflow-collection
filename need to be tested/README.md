# 🛠️ AWS Remediation Subworkflows — Staging Area

> ⚠️ **These subworkflows have not yet been tested in a live Dynatrace environment.**
> Once validated, add the 🧩 prefix to each title and move the files to the root of the repository.

This folder contains **50 AWS remediation subworkflows** built for the Dynatrace Automation Engine. Each one targets a high-frequency enterprise AWS outage scenario, executing remediation via AWS Systems Manager (SSM) Automation runbooks. Every subworkflow follows the **wait-and-verify** pattern — none are fire-and-forget.

---

## 🏗️ How Every Subworkflow Works

Each subworkflow follows an identical 3-task execution chain:

```
[1] systems_manager_start_automation_execution_1
        ↓  Starts the SSM Automation runbook
[2] wait-for-ssm-execution-completed
        ↓  Polls until execution finishes (up to 7 days, retry × 99)
[3] check-status
        ✅ Verifies AutomationExecutionStatus === SUCCESS, throws on failure
```

### ⚙️ Common Input Parameters

| Parameter | Required | Description |
|---|---|---|
| `primaryResourceId` | ✅ Yes | The AWS resource ID to remediate |
| `awsregion` | ✅ Yes | AWS region where remediation runs |
| `dynatraceawsconnection` | ✅ Yes | Dynatrace AWS OIDC connection name |
| `AutomationAssumeRolearn` | ⬜ Optional | IAM role ARN for automation context |

### 🔗 Required Dependency

All subworkflows depend on:
> **`subworkflow - aws wait for systems manager document execution`**
> Workflow ID: `20661ec0-29d5-471f-9973-29679d5fe908`

---

## 📋 Subworkflow Catalogue

### 🖥️ EC2 & Compute

| # | File | Use Case |
|---|---|---|
| 1 | [subworkflow-aws-remediate-restart-ec2-instance.workflow.json](subworkflow-aws-remediate-restart-ec2-instance.workflow.json) | Remediate EC2 compute outage symptoms by restarting an impacted instance |
| 2 | [subworkflow-aws-remediate-restart-ec2-by-tag.workflow.json](subworkflow-aws-remediate-restart-ec2-by-tag.workflow.json) | Restart EC2 fleet members selected by tag during zonal incidents |
| 3 | [subworkflow-aws-remediate-recover-ec2-status-check-failure.workflow.json](subworkflow-aws-remediate-recover-ec2-status-check-failure.workflow.json) | Recover EC2 instances failing system or instance status checks |
| 4 | [subworkflow-aws-remediate-stop-runaway-ec2-process.workflow.json](subworkflow-aws-remediate-stop-runaway-ec2-process.workflow.json) | Stop a runaway process on EC2 via automation runbook pattern |
| 5 | [subworkflow-aws-remediate-quarantine-ec2-instance.workflow.json](subworkflow-aws-remediate-quarantine-ec2-instance.workflow.json) | Isolate compromised EC2 instances to contain active security incidents |
| 6 | [subworkflow-aws-remediate-detach-public-ip-from-ec2.workflow.json](subworkflow-aws-remediate-detach-public-ip-from-ec2.workflow.json) | Remove public IP association from EC2 during security outage handling |

---

### 📦 EBS & Storage

| # | File | Use Case |
|---|---|---|
| 7 | [subworkflow-aws-remediate-increase-ebs-volume-size.workflow.json](subworkflow-aws-remediate-increase-ebs-volume-size.workflow.json) | Increase EBS volume capacity to resolve disk saturation outages |
| 8 | [subworkflow-aws-remediate-recover-impaired-ebs-volume.workflow.json](subworkflow-aws-remediate-recover-impaired-ebs-volume.workflow.json) | Recover impaired EBS volumes to restore storage availability |
| 9 | [subworkflow-aws-remediate-enable-ebs-encryption-by-default.workflow.json](subworkflow-aws-remediate-enable-ebs-encryption-by-default.workflow.json) | Enable account-level default EBS encryption as security remediation |

---

### 🐳 ECS, Fargate & App Runner

| # | File | Use Case |
|---|---|---|
| 10 | [subworkflow-aws-remediate-restart-ecs-service.workflow.json](subworkflow-aws-remediate-restart-ecs-service.workflow.json) | Restart ECS service tasks to recover container runtime failures |
| 11 | [subworkflow-aws-remediate-scale-out-ecs-service.workflow.json](subworkflow-aws-remediate-scale-out-ecs-service.workflow.json) | Scale out ECS service to recover from under-provisioning outages |
| 12 | [subworkflow-aws-remediate-restart-fargate-task.workflow.json](subworkflow-aws-remediate-restart-fargate-task.workflow.json) | Restart failing Fargate tasks for service restoration |
| 13 | [subworkflow-aws-remediate-restart-app-runner-service.workflow.json](subworkflow-aws-remediate-restart-app-runner-service.workflow.json) | Restart App Runner service during runtime outage |

---

### ☸️ EKS & Kubernetes

| # | File | Use Case |
|---|---|---|
| 14 | [subworkflow-aws-remediate-cordon-and-drain-eks-node.workflow.json](subworkflow-aws-remediate-cordon-and-drain-eks-node.workflow.json) | Cordon and drain a problematic EKS node to stabilize workloads |
| 15 | [subworkflow-aws-remediate-restart-eks-deployment.workflow.json](subworkflow-aws-remediate-restart-eks-deployment.workflow.json) | Restart EKS deployment rollout to recover unhealthy pods |
| 16 | [subworkflow-aws-remediate-recreate-eks-nodegroup.workflow.json](subworkflow-aws-remediate-recreate-eks-nodegroup.workflow.json) | Recreate unhealthy EKS nodegroup during cluster degradation |

---

### 🗄️ RDS, Aurora & Redshift

| # | File | Use Case |
|---|---|---|
| 17 | [subworkflow-aws-remediate-restart-rds-instance.workflow.json](subworkflow-aws-remediate-restart-rds-instance.workflow.json) | Restart impacted RDS instance to recover service availability |
| 18 | [subworkflow-aws-remediate-failover-rds-aurora-cluster.workflow.json](subworkflow-aws-remediate-failover-rds-aurora-cluster.workflow.json) | Initiate Aurora failover to restore database service quickly |
| 19 | [subworkflow-aws-remediate-rotate-rds-master-password.workflow.json](subworkflow-aws-remediate-rotate-rds-master-password.workflow.json) | Rotate compromised RDS master credential during security incidents |
| 20 | [subworkflow-aws-remediate-recover-redshift-cluster.workflow.json](subworkflow-aws-remediate-recover-redshift-cluster.workflow.json) | Reboot Redshift cluster to recover from control-plane or node issues |

---

### ⚡ Lambda & Serverless

| # | File | Use Case |
|---|---|---|
| 21 | [subworkflow-aws-remediate-rollback-lambda-alias.workflow.json](subworkflow-aws-remediate-rollback-lambda-alias.workflow.json) | Rollback Lambda alias to known-good version during bad release incidents |
| 22 | [subworkflow-aws-remediate-reset-lambda-concurrency.workflow.json](subworkflow-aws-remediate-reset-lambda-concurrency.workflow.json) | Reset Lambda concurrency settings after outage-level throttling |
| 23 | [subworkflow-aws-remediate-redeploy-lambda-function.workflow.json](subworkflow-aws-remediate-redeploy-lambda-function.workflow.json) | Redeploy Lambda function package from trusted source |

---

### 🔀 API Gateway & EventBridge

| # | File | Use Case |
|---|---|---|
| 24 | [subworkflow-aws-remediate-reset-api-gateway-stage-deployment.workflow.json](subworkflow-aws-remediate-reset-api-gateway-stage-deployment.workflow.json) | Redeploy API Gateway stage to recover from a bad API release |
| 25 | [subworkflow-aws-remediate-reenable-eventbridge-rule.workflow.json](subworkflow-aws-remediate-reenable-eventbridge-rule.workflow.json) | Re-enable critical EventBridge rule to restore automation flows |

---

### 📨 SQS & SNS Messaging

| # | File | Use Case |
|---|---|---|
| 26 | [subworkflow-aws-remediate-purge-stuck-sqs-messages.workflow.json](subworkflow-aws-remediate-purge-stuck-sqs-messages.workflow.json) | Purge poison-message backlog from SQS queue during incident response |
| 27 | [subworkflow-aws-remediate-increase-sqs-visibility-timeout.workflow.json](subworkflow-aws-remediate-increase-sqs-visibility-timeout.workflow.json) | Increase SQS visibility timeout to reduce duplicate processing failures |
| 28 | [subworkflow-aws-remediate-enable-sns-dlq.workflow.json](subworkflow-aws-remediate-enable-sns-dlq.workflow.json) | Enable SNS DLQ routing to capture failed deliveries reliably |

---

### 🗃️ DynamoDB

| # | File | Use Case |
|---|---|---|
| 29 | [subworkflow-aws-remediate-increase-dynamodb-read-capacity.workflow.json](subworkflow-aws-remediate-increase-dynamodb-read-capacity.workflow.json) | Scale DynamoDB read capacity to mitigate outage-causing read throttling |
| 30 | [subworkflow-aws-remediate-increase-dynamodb-write-capacity.workflow.json](subworkflow-aws-remediate-increase-dynamodb-write-capacity.workflow.json) | Scale DynamoDB write capacity during sustained write throttling events |

---

### ⚖️ Load Balancing & Auto Scaling

| # | File | Use Case |
|---|---|---|
| 31 | [subworkflow-aws-remediate-recycle-unhealthy-elb-target.workflow.json](subworkflow-aws-remediate-recycle-unhealthy-elb-target.workflow.json) | Replace unhealthy ELB targets to restore load balancer service health |
| 32 | [subworkflow-aws-remediate-replace-unhealthy-asg-instance.workflow.json](subworkflow-aws-remediate-replace-unhealthy-asg-instance.workflow.json) | Replace unhealthy instance in Auto Scaling Group |

---

### 🌐 Networking & VPC

| # | File | Use Case |
|---|---|---|
| 33 | [subworkflow-aws-remediate-enable-vpc-flow-logs.workflow.json](subworkflow-aws-remediate-enable-vpc-flow-logs.workflow.json) | Enable VPC Flow Logs during network outage investigation |
| 34 | [subworkflow-aws-remediate-reattach-internet-gateway.workflow.json](subworkflow-aws-remediate-reattach-internet-gateway.workflow.json) | Restore internet gateway attachment after routing disruption |
| 35 | [subworkflow-aws-remediate-recreate-nat-gateway-route.workflow.json](subworkflow-aws-remediate-recreate-nat-gateway-route.workflow.json) | Restore private subnet egress via NAT route remediation |
| 36 | [subworkflow-aws-remediate-recreate-vpn-tunnel.workflow.json](subworkflow-aws-remediate-recreate-vpn-tunnel.workflow.json) | Replace failing VPN tunnel to restore hybrid connectivity |
| 37 | [subworkflow-aws-remediate-detach-stale-eni.workflow.json](subworkflow-aws-remediate-detach-stale-eni.workflow.json) | Detach stale ENIs that block instance lifecycle operations |

---

### 🔴 ElastiCache & OpenSearch

| # | File | Use Case |
|---|---|---|
| 38 | [subworkflow-aws-remediate-restart-elasticache-cluster.workflow.json](subworkflow-aws-remediate-restart-elasticache-cluster.workflow.json) | Reboot ElastiCache cluster nodes for cache recovery operations |
| 39 | [subworkflow-aws-remediate-failover-elasticache-replication-group.workflow.json](subworkflow-aws-remediate-failover-elasticache-replication-group.workflow.json) | Trigger ElastiCache replication group failover for primary node failure |
| 40 | [subworkflow-aws-remediate-restart-opensearch-node.workflow.json](subworkflow-aws-remediate-restart-opensearch-node.workflow.json) | Restart OpenSearch node to address degraded search availability |

---

### 📡 Kafka & MSK

| # | File | Use Case |
|---|---|---|
| 41 | [subworkflow-aws-remediate-restart-msk-broker.workflow.json](subworkflow-aws-remediate-restart-msk-broker.workflow.json) | Restart Kafka broker in MSK to recover ingestion and consumer lag incidents |

---

### 🌍 CloudFront & Route 53

| # | File | Use Case |
|---|---|---|
| 42 | [subworkflow-aws-remediate-invalidate-cloudfront-cache.workflow.json](subworkflow-aws-remediate-invalidate-cloudfront-cache.workflow.json) | Invalidate stale CloudFront cache after faulty edge content rollout |
| 43 | [subworkflow-aws-remediate-restore-route53-health-check.workflow.json](subworkflow-aws-remediate-restore-route53-health-check.workflow.json) | Restore Route53 health check behavior to recover DNS failover |

---

### 🏗️ CloudFormation

| # | File | Use Case |
|---|---|---|
| 44 | [subworkflow-aws-remediate-rollback-cloudformation-stack.workflow.json](subworkflow-aws-remediate-rollback-cloudformation-stack.workflow.json) | Rollback failed CloudFormation deployment to stable state |
| 45 | [subworkflow-aws-remediate-continue-cloudformation-rollback.workflow.json](subworkflow-aws-remediate-continue-cloudformation-rollback.workflow.json) | Continue a paused CloudFormation rollback after dependency fixes |

---

### 🔐 Security & IAM

| # | File | Use Case |
|---|---|---|
| 46 | [subworkflow-aws-remediate-disable-compromised-iam-user.workflow.json](subworkflow-aws-remediate-disable-compromised-iam-user.workflow.json) | Disable compromised IAM user access as immediate containment |
| 47 | [subworkflow-aws-remediate-rotate-iam-access-key.workflow.json](subworkflow-aws-remediate-rotate-iam-access-key.workflow.json) | Rotate compromised IAM access keys during credential incidents |
| 48 | [subworkflow-aws-remediate-remediate-s3-public-access.workflow.json](subworkflow-aws-remediate-remediate-s3-public-access.workflow.json) | Block public S3 bucket exposure during active security incidents |
| 49 | [subworkflow-aws-remediate-enable-cloudtrail-multi-region.workflow.json](subworkflow-aws-remediate-enable-cloudtrail-multi-region.workflow.json) | Enable multi-region CloudTrail to restore audit coverage |
| 50 | [subworkflow-aws-remediate-remediate-acm-certificate-expiry.workflow.json](subworkflow-aws-remediate-remediate-acm-certificate-expiry.workflow.json) | Renew or replace expiring ACM certificate to avoid TLS outages |

---

## ✅ Testing Checklist

Before promoting a subworkflow to the root repository:

- [ ] Import the `.workflow.json` file into Dynatrace
- [ ] Verify the `dynatraceawsconnection` input matches your environment's OIDC connection name
- [ ] Run manually with a test `primaryResourceId` and confirm `AutomationExecutionStatus === SUCCESS`
- [ ] Confirm the dependency subworkflow (`20661ec0-29d5-471f-9973-29679d5fe908`) is deployed and live
- [ ] After passing: add `🧩` to the title and move file to the repo root

---

## 📁 Repository Convention

Once tested and confirmed working, files should be:
- **Renamed** with `🧩` at the start of the `title` field
- **Moved** from `need to be tested/` to the repository root
- Following the naming pattern: `subworkflow-aws-<action>.workflow.json`
