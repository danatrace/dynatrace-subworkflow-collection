# AWS Cross-Region Failover Subworkflows

⚠️ This folder contains **300** AWS region-failover remediation/orchestration templates (from EC2 to Lambda and additional platform services).

All workflows enforce a strict non-fire-and-forget pattern with explicit wait and status verification steps.

## 📦 Inventory

- Main failover subworkflows: **300**
- Helper subworkflows: **2**
- Total workflow files in folder: **302**

## 🧠 Orchestration Pattern

1. 🔎 Pre-flight AWS security posture check (`ec2-describe-security-groups`)
2. 🛡️ Artifact bucket hardening (`s3-put-public-access-block`)
3. 🧾 Dispatch SSM run command (`ssm-send-command`) and wait via helper (`ssm-list-commands`)
4. 🚀 Start SSM automation failover runbook (`ssm-start-automation-execution`) and wait via helper (`ssm-get-automation-execution`)
5. ♻️ Optional reboot stabilization (`ec2-reboot-instances` + `ec2-wait-state`)
6. ✅ Final JS check asserts terminal success

## 🔗 Helper Dependencies

- `subworkflow-awsregionfailover-wait-for-run-command-execution.workflow.json`
- `subworkflow-awsregionfailover-wait-for-ssm-automation-execution.workflow.json`

## 🚀 Setup Steps

1. Import and deploy both helper subworkflows first.
2. Replace helper workflow placeholders in failover files:

```bash
RUN_CMD_WAIT_ID="<id-of-subworkflow-awsregionfailover-wait-for-run-command-execution>"
AUTO_WAIT_ID="<id-of-subworkflow-awsregionfailover-wait-for-ssm-automation-execution>"
for f in awsregionfailover/subworkflow-awsregionfailover-*.workflow.json; do
  sed -i "s/11111111-1111-4111-8111-111111111111/$RUN_CMD_WAIT_ID/g" "$f"
  sed -i "s/22222222-2222-4222-8222-222222222222/$AUTO_WAIT_ID/g" "$f"
done
```

3. Provide `instanceId`, `primaryResourceId`, `sourceRegion`, `targetRegion`, and AWS connection values when executing workflows.
4. Optionally override `runbookDocumentNameOverride` for account-specific or custom SSM runbooks.

## 📚 Catalog (300 Main Subworkflows)

| File | Service | Pattern | Default Runbook |
|---|---|---|---|
| `subworkflow-awsregionfailover-ec2-initiate-cross-region-failover-001.workflow.json` | ec2 | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-validate-dr-readiness-002.workflow.json` | ec2 | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-shift-read-traffic-003.workflow.json` | ec2 | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-promote-secondary-primary-004.workflow.json` | ec2 | Promote secondary region resources to primary role. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-sync-state-pre-failover-005.workflow.json` | ec2 | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-restart-failover-target-006.workflow.json` | ec2 | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-rewire-dependencies-007.workflow.json` | ec2 | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-verify-health-and-slo-008.workflow.json` | ec2 | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-stabilize-post-failover-009.workflow.json` | ec2 | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ec2-prepare-failback-plan-010.workflow.json` | ec2 | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverEc2Workload` |
| `subworkflow-awsregionfailover-ebs-initiate-cross-region-failover-011.workflow.json` | ebs | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-validate-dr-readiness-012.workflow.json` | ebs | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-shift-read-traffic-013.workflow.json` | ebs | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-promote-secondary-primary-014.workflow.json` | ebs | Promote secondary region resources to primary role. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-sync-state-pre-failover-015.workflow.json` | ebs | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-restart-failover-target-016.workflow.json` | ebs | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-rewire-dependencies-017.workflow.json` | ebs | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-verify-health-and-slo-018.workflow.json` | ebs | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-stabilize-post-failover-019.workflow.json` | ebs | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-ebs-prepare-failback-plan-020.workflow.json` | ebs | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverEbsVolume` |
| `subworkflow-awsregionfailover-rds-initiate-cross-region-failover-021.workflow.json` | rds | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-validate-dr-readiness-022.workflow.json` | rds | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-shift-read-traffic-023.workflow.json` | rds | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-promote-secondary-primary-024.workflow.json` | rds | Promote secondary region resources to primary role. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-sync-state-pre-failover-025.workflow.json` | rds | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-restart-failover-target-026.workflow.json` | rds | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-rewire-dependencies-027.workflow.json` | rds | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-verify-health-and-slo-028.workflow.json` | rds | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-stabilize-post-failover-029.workflow.json` | rds | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-rds-prepare-failback-plan-030.workflow.json` | rds | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-awsregionfailover-aurora-initiate-cross-region-failover-031.workflow.json` | aurora | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-validate-dr-readiness-032.workflow.json` | aurora | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-shift-read-traffic-033.workflow.json` | aurora | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-promote-secondary-primary-034.workflow.json` | aurora | Promote secondary region resources to primary role. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-sync-state-pre-failover-035.workflow.json` | aurora | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-restart-failover-target-036.workflow.json` | aurora | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-rewire-dependencies-037.workflow.json` | aurora | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-verify-health-and-slo-038.workflow.json` | aurora | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-stabilize-post-failover-039.workflow.json` | aurora | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-aurora-prepare-failback-plan-040.workflow.json` | aurora | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-awsregionfailover-dynamodb-initiate-cross-region-failover-041.workflow.json` | dynamodb | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-validate-dr-readiness-042.workflow.json` | dynamodb | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-shift-read-traffic-043.workflow.json` | dynamodb | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-promote-secondary-primary-044.workflow.json` | dynamodb | Promote secondary region resources to primary role. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-sync-state-pre-failover-045.workflow.json` | dynamodb | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-restart-failover-target-046.workflow.json` | dynamodb | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-rewire-dependencies-047.workflow.json` | dynamodb | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-verify-health-and-slo-048.workflow.json` | dynamodb | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-stabilize-post-failover-049.workflow.json` | dynamodb | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-dynamodb-prepare-failback-plan-050.workflow.json` | dynamodb | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverDynamoDbGlobalTable` |
| `subworkflow-awsregionfailover-eks-initiate-cross-region-failover-051.workflow.json` | eks | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-validate-dr-readiness-052.workflow.json` | eks | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-shift-read-traffic-053.workflow.json` | eks | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-promote-secondary-primary-054.workflow.json` | eks | Promote secondary region resources to primary role. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-sync-state-pre-failover-055.workflow.json` | eks | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-restart-failover-target-056.workflow.json` | eks | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-rewire-dependencies-057.workflow.json` | eks | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-verify-health-and-slo-058.workflow.json` | eks | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-stabilize-post-failover-059.workflow.json` | eks | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-eks-prepare-failback-plan-060.workflow.json` | eks | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverEksWorkloads` |
| `subworkflow-awsregionfailover-ecs-initiate-cross-region-failover-061.workflow.json` | ecs | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-validate-dr-readiness-062.workflow.json` | ecs | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-shift-read-traffic-063.workflow.json` | ecs | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-promote-secondary-primary-064.workflow.json` | ecs | Promote secondary region resources to primary role. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-sync-state-pre-failover-065.workflow.json` | ecs | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-restart-failover-target-066.workflow.json` | ecs | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-rewire-dependencies-067.workflow.json` | ecs | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-verify-health-and-slo-068.workflow.json` | ecs | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-stabilize-post-failover-069.workflow.json` | ecs | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-ecs-prepare-failback-plan-070.workflow.json` | ecs | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverEcsService` |
| `subworkflow-awsregionfailover-lambda-initiate-cross-region-failover-071.workflow.json` | lambda | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-validate-dr-readiness-072.workflow.json` | lambda | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-shift-read-traffic-073.workflow.json` | lambda | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-promote-secondary-primary-074.workflow.json` | lambda | Promote secondary region resources to primary role. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-sync-state-pre-failover-075.workflow.json` | lambda | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-restart-failover-target-076.workflow.json` | lambda | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-rewire-dependencies-077.workflow.json` | lambda | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-verify-health-and-slo-078.workflow.json` | lambda | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-stabilize-post-failover-079.workflow.json` | lambda | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-lambda-prepare-failback-plan-080.workflow.json` | lambda | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverLambdaAliasRouting` |
| `subworkflow-awsregionfailover-api-gateway-initiate-cross-region-failover-081.workflow.json` | api-gateway | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-validate-dr-readiness-082.workflow.json` | api-gateway | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-shift-read-traffic-083.workflow.json` | api-gateway | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-promote-secondary-primary-084.workflow.json` | api-gateway | Promote secondary region resources to primary role. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-sync-state-pre-failover-085.workflow.json` | api-gateway | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-restart-failover-target-086.workflow.json` | api-gateway | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-rewire-dependencies-087.workflow.json` | api-gateway | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-verify-health-and-slo-088.workflow.json` | api-gateway | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-stabilize-post-failover-089.workflow.json` | api-gateway | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-api-gateway-prepare-failback-plan-090.workflow.json` | api-gateway | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverApiGatewayRegionalEndpoint` |
| `subworkflow-awsregionfailover-sqs-initiate-cross-region-failover-091.workflow.json` | sqs | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-validate-dr-readiness-092.workflow.json` | sqs | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-shift-read-traffic-093.workflow.json` | sqs | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-promote-secondary-primary-094.workflow.json` | sqs | Promote secondary region resources to primary role. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-sync-state-pre-failover-095.workflow.json` | sqs | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-restart-failover-target-096.workflow.json` | sqs | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-rewire-dependencies-097.workflow.json` | sqs | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-verify-health-and-slo-098.workflow.json` | sqs | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-stabilize-post-failover-099.workflow.json` | sqs | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sqs-prepare-failback-plan-100.workflow.json` | sqs | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverSqsQueueProcessing` |
| `subworkflow-awsregionfailover-sns-initiate-cross-region-failover-101.workflow.json` | sns | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-validate-dr-readiness-102.workflow.json` | sns | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-shift-read-traffic-103.workflow.json` | sns | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-promote-secondary-primary-104.workflow.json` | sns | Promote secondary region resources to primary role. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-sync-state-pre-failover-105.workflow.json` | sns | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-restart-failover-target-106.workflow.json` | sns | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-rewire-dependencies-107.workflow.json` | sns | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-verify-health-and-slo-108.workflow.json` | sns | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-stabilize-post-failover-109.workflow.json` | sns | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-sns-prepare-failback-plan-110.workflow.json` | sns | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverSnsTopicSubscriptions` |
| `subworkflow-awsregionfailover-msk-initiate-cross-region-failover-111.workflow.json` | msk | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-validate-dr-readiness-112.workflow.json` | msk | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-shift-read-traffic-113.workflow.json` | msk | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-promote-secondary-primary-114.workflow.json` | msk | Promote secondary region resources to primary role. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-sync-state-pre-failover-115.workflow.json` | msk | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-restart-failover-target-116.workflow.json` | msk | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-rewire-dependencies-117.workflow.json` | msk | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-verify-health-and-slo-118.workflow.json` | msk | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-stabilize-post-failover-119.workflow.json` | msk | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-msk-prepare-failback-plan-120.workflow.json` | msk | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverMskCluster` |
| `subworkflow-awsregionfailover-elasticache-initiate-cross-region-failover-121.workflow.json` | elasticache | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-validate-dr-readiness-122.workflow.json` | elasticache | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-shift-read-traffic-123.workflow.json` | elasticache | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-promote-secondary-primary-124.workflow.json` | elasticache | Promote secondary region resources to primary role. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-sync-state-pre-failover-125.workflow.json` | elasticache | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-restart-failover-target-126.workflow.json` | elasticache | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-rewire-dependencies-127.workflow.json` | elasticache | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-verify-health-and-slo-128.workflow.json` | elasticache | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-stabilize-post-failover-129.workflow.json` | elasticache | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-elasticache-prepare-failback-plan-130.workflow.json` | elasticache | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-awsregionfailover-opensearch-initiate-cross-region-failover-131.workflow.json` | opensearch | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-validate-dr-readiness-132.workflow.json` | opensearch | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-shift-read-traffic-133.workflow.json` | opensearch | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-promote-secondary-primary-134.workflow.json` | opensearch | Promote secondary region resources to primary role. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-sync-state-pre-failover-135.workflow.json` | opensearch | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-restart-failover-target-136.workflow.json` | opensearch | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-rewire-dependencies-137.workflow.json` | opensearch | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-verify-health-and-slo-138.workflow.json` | opensearch | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-stabilize-post-failover-139.workflow.json` | opensearch | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-opensearch-prepare-failback-plan-140.workflow.json` | opensearch | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverOpenSearchDomain` |
| `subworkflow-awsregionfailover-route53-initiate-cross-region-failover-141.workflow.json` | route53 | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-validate-dr-readiness-142.workflow.json` | route53 | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-shift-read-traffic-143.workflow.json` | route53 | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-promote-secondary-primary-144.workflow.json` | route53 | Promote secondary region resources to primary role. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-sync-state-pre-failover-145.workflow.json` | route53 | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-restart-failover-target-146.workflow.json` | route53 | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-rewire-dependencies-147.workflow.json` | route53 | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-verify-health-and-slo-148.workflow.json` | route53 | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-stabilize-post-failover-149.workflow.json` | route53 | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-route53-prepare-failback-plan-150.workflow.json` | route53 | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverRoute53RecordSet` |
| `subworkflow-awsregionfailover-cloudfront-initiate-cross-region-failover-151.workflow.json` | cloudfront | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-validate-dr-readiness-152.workflow.json` | cloudfront | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-shift-read-traffic-153.workflow.json` | cloudfront | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-promote-secondary-primary-154.workflow.json` | cloudfront | Promote secondary region resources to primary role. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-sync-state-pre-failover-155.workflow.json` | cloudfront | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-restart-failover-target-156.workflow.json` | cloudfront | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-rewire-dependencies-157.workflow.json` | cloudfront | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-verify-health-and-slo-158.workflow.json` | cloudfront | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-stabilize-post-failover-159.workflow.json` | cloudfront | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-cloudfront-prepare-failback-plan-160.workflow.json` | cloudfront | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-awsregionfailover-alb-initiate-cross-region-failover-161.workflow.json` | alb | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-validate-dr-readiness-162.workflow.json` | alb | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-shift-read-traffic-163.workflow.json` | alb | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-promote-secondary-primary-164.workflow.json` | alb | Promote secondary region resources to primary role. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-sync-state-pre-failover-165.workflow.json` | alb | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-restart-failover-target-166.workflow.json` | alb | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-rewire-dependencies-167.workflow.json` | alb | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-verify-health-and-slo-168.workflow.json` | alb | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-stabilize-post-failover-169.workflow.json` | alb | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-alb-prepare-failback-plan-170.workflow.json` | alb | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverApplicationLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-initiate-cross-region-failover-171.workflow.json` | nlb | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-validate-dr-readiness-172.workflow.json` | nlb | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-shift-read-traffic-173.workflow.json` | nlb | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-promote-secondary-primary-174.workflow.json` | nlb | Promote secondary region resources to primary role. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-sync-state-pre-failover-175.workflow.json` | nlb | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-restart-failover-target-176.workflow.json` | nlb | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-rewire-dependencies-177.workflow.json` | nlb | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-verify-health-and-slo-178.workflow.json` | nlb | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-stabilize-post-failover-179.workflow.json` | nlb | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-nlb-prepare-failback-plan-180.workflow.json` | nlb | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverNetworkLoadBalancer` |
| `subworkflow-awsregionfailover-vpc-initiate-cross-region-failover-181.workflow.json` | vpc | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-validate-dr-readiness-182.workflow.json` | vpc | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-shift-read-traffic-183.workflow.json` | vpc | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-promote-secondary-primary-184.workflow.json` | vpc | Promote secondary region resources to primary role. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-sync-state-pre-failover-185.workflow.json` | vpc | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-restart-failover-target-186.workflow.json` | vpc | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-rewire-dependencies-187.workflow.json` | vpc | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-verify-health-and-slo-188.workflow.json` | vpc | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-stabilize-post-failover-189.workflow.json` | vpc | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpc-prepare-failback-plan-190.workflow.json` | vpc | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverVpcConnectivity` |
| `subworkflow-awsregionfailover-vpn-initiate-cross-region-failover-191.workflow.json` | vpn | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-validate-dr-readiness-192.workflow.json` | vpn | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-shift-read-traffic-193.workflow.json` | vpn | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-promote-secondary-primary-194.workflow.json` | vpn | Promote secondary region resources to primary role. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-sync-state-pre-failover-195.workflow.json` | vpn | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-restart-failover-target-196.workflow.json` | vpn | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-rewire-dependencies-197.workflow.json` | vpn | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-verify-health-and-slo-198.workflow.json` | vpn | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-stabilize-post-failover-199.workflow.json` | vpn | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-vpn-prepare-failback-plan-200.workflow.json` | vpn | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverSiteToSiteVpn` |
| `subworkflow-awsregionfailover-nat-gateway-initiate-cross-region-failover-201.workflow.json` | nat-gateway | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-validate-dr-readiness-202.workflow.json` | nat-gateway | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-shift-read-traffic-203.workflow.json` | nat-gateway | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-promote-secondary-primary-204.workflow.json` | nat-gateway | Promote secondary region resources to primary role. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-sync-state-pre-failover-205.workflow.json` | nat-gateway | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-restart-failover-target-206.workflow.json` | nat-gateway | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-rewire-dependencies-207.workflow.json` | nat-gateway | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-verify-health-and-slo-208.workflow.json` | nat-gateway | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-stabilize-post-failover-209.workflow.json` | nat-gateway | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-nat-gateway-prepare-failback-plan-210.workflow.json` | nat-gateway | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverNatGatewayRoute` |
| `subworkflow-awsregionfailover-elastic-beanstalk-initiate-cross-region-failover-211.workflow.json` | elastic-beanstalk | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-validate-dr-readiness-212.workflow.json` | elastic-beanstalk | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-shift-read-traffic-213.workflow.json` | elastic-beanstalk | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-promote-secondary-primary-214.workflow.json` | elastic-beanstalk | Promote secondary region resources to primary role. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-sync-state-pre-failover-215.workflow.json` | elastic-beanstalk | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-restart-failover-target-216.workflow.json` | elastic-beanstalk | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-rewire-dependencies-217.workflow.json` | elastic-beanstalk | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-verify-health-and-slo-218.workflow.json` | elastic-beanstalk | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-stabilize-post-failover-219.workflow.json` | elastic-beanstalk | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-elastic-beanstalk-prepare-failback-plan-220.workflow.json` | elastic-beanstalk | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverElasticBeanstalkEnvironment` |
| `subworkflow-awsregionfailover-app-runner-initiate-cross-region-failover-221.workflow.json` | app-runner | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-validate-dr-readiness-222.workflow.json` | app-runner | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-shift-read-traffic-223.workflow.json` | app-runner | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-promote-secondary-primary-224.workflow.json` | app-runner | Promote secondary region resources to primary role. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-sync-state-pre-failover-225.workflow.json` | app-runner | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-restart-failover-target-226.workflow.json` | app-runner | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-rewire-dependencies-227.workflow.json` | app-runner | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-verify-health-and-slo-228.workflow.json` | app-runner | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-stabilize-post-failover-229.workflow.json` | app-runner | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-app-runner-prepare-failback-plan-230.workflow.json` | app-runner | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverAppRunnerService` |
| `subworkflow-awsregionfailover-step-functions-initiate-cross-region-failover-231.workflow.json` | step-functions | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-validate-dr-readiness-232.workflow.json` | step-functions | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-shift-read-traffic-233.workflow.json` | step-functions | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-promote-secondary-primary-234.workflow.json` | step-functions | Promote secondary region resources to primary role. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-sync-state-pre-failover-235.workflow.json` | step-functions | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-restart-failover-target-236.workflow.json` | step-functions | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-rewire-dependencies-237.workflow.json` | step-functions | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-verify-health-and-slo-238.workflow.json` | step-functions | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-stabilize-post-failover-239.workflow.json` | step-functions | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-step-functions-prepare-failback-plan-240.workflow.json` | step-functions | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverStepFunctionsStateMachine` |
| `subworkflow-awsregionfailover-eventbridge-initiate-cross-region-failover-241.workflow.json` | eventbridge | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-validate-dr-readiness-242.workflow.json` | eventbridge | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-shift-read-traffic-243.workflow.json` | eventbridge | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-promote-secondary-primary-244.workflow.json` | eventbridge | Promote secondary region resources to primary role. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-sync-state-pre-failover-245.workflow.json` | eventbridge | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-restart-failover-target-246.workflow.json` | eventbridge | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-rewire-dependencies-247.workflow.json` | eventbridge | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-verify-health-and-slo-248.workflow.json` | eventbridge | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-stabilize-post-failover-249.workflow.json` | eventbridge | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-eventbridge-prepare-failback-plan-250.workflow.json` | eventbridge | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverEventBridgeRules` |
| `subworkflow-awsregionfailover-glue-initiate-cross-region-failover-251.workflow.json` | glue | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-validate-dr-readiness-252.workflow.json` | glue | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-shift-read-traffic-253.workflow.json` | glue | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-promote-secondary-primary-254.workflow.json` | glue | Promote secondary region resources to primary role. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-sync-state-pre-failover-255.workflow.json` | glue | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-restart-failover-target-256.workflow.json` | glue | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-rewire-dependencies-257.workflow.json` | glue | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-verify-health-and-slo-258.workflow.json` | glue | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-stabilize-post-failover-259.workflow.json` | glue | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-glue-prepare-failback-plan-260.workflow.json` | glue | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverGlueJobs` |
| `subworkflow-awsregionfailover-emr-initiate-cross-region-failover-261.workflow.json` | emr | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-validate-dr-readiness-262.workflow.json` | emr | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-shift-read-traffic-263.workflow.json` | emr | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-promote-secondary-primary-264.workflow.json` | emr | Promote secondary region resources to primary role. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-sync-state-pre-failover-265.workflow.json` | emr | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-restart-failover-target-266.workflow.json` | emr | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-rewire-dependencies-267.workflow.json` | emr | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-verify-health-and-slo-268.workflow.json` | emr | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-stabilize-post-failover-269.workflow.json` | emr | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-emr-prepare-failback-plan-270.workflow.json` | emr | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverEmrCluster` |
| `subworkflow-awsregionfailover-kinesis-initiate-cross-region-failover-271.workflow.json` | kinesis | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-validate-dr-readiness-272.workflow.json` | kinesis | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-shift-read-traffic-273.workflow.json` | kinesis | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-promote-secondary-primary-274.workflow.json` | kinesis | Promote secondary region resources to primary role. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-sync-state-pre-failover-275.workflow.json` | kinesis | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-restart-failover-target-276.workflow.json` | kinesis | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-rewire-dependencies-277.workflow.json` | kinesis | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-verify-health-and-slo-278.workflow.json` | kinesis | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-stabilize-post-failover-279.workflow.json` | kinesis | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-kinesis-prepare-failback-plan-280.workflow.json` | kinesis | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverKinesisStream` |
| `subworkflow-awsregionfailover-redshift-initiate-cross-region-failover-281.workflow.json` | redshift | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-validate-dr-readiness-282.workflow.json` | redshift | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-shift-read-traffic-283.workflow.json` | redshift | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-promote-secondary-primary-284.workflow.json` | redshift | Promote secondary region resources to primary role. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-sync-state-pre-failover-285.workflow.json` | redshift | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-restart-failover-target-286.workflow.json` | redshift | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-rewire-dependencies-287.workflow.json` | redshift | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-verify-health-and-slo-288.workflow.json` | redshift | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-stabilize-post-failover-289.workflow.json` | redshift | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-redshift-prepare-failback-plan-290.workflow.json` | redshift | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverRedshiftCluster` |
| `subworkflow-awsregionfailover-batch-initiate-cross-region-failover-291.workflow.json` | batch | Initiate cross-region failover to secondary region. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-validate-dr-readiness-292.workflow.json` | batch | Validate disaster-recovery readiness before traffic shift. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-shift-read-traffic-293.workflow.json` | batch | Shift read traffic to secondary region endpoints. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-promote-secondary-primary-294.workflow.json` | batch | Promote secondary region resources to primary role. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-sync-state-pre-failover-295.workflow.json` | batch | Synchronize workload state before final failover cutover. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-restart-failover-target-296.workflow.json` | batch | Restart failover target resources to clear transient errors. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-rewire-dependencies-297.workflow.json` | batch | Rewire upstream/downstream dependencies to failover region. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-verify-health-and-slo-298.workflow.json` | batch | Verify health checks and SLO conditions after failover. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-stabilize-post-failover-299.workflow.json` | batch | Stabilize services after failover to avoid cascading outages. | `AWSSupport-FailoverBatchComputeEnvironment` |
| `subworkflow-awsregionfailover-batch-prepare-failback-plan-300.workflow.json` | batch | Prepare controlled failback plan once primary region recovers. | `AWSSupport-FailoverBatchComputeEnvironment` |

## ✅ Validation Checklist

- ✅ 300 main failover workflows generated
- ✅ 2 helper workflows generated
- ✅ No `id` fields in generated workflow JSON files
- ✅ Every main workflow includes explicit execute, wait, and check steps
- ✅ Emoji guides included
- ✅ All JSON files parse successfully
