# AWS Bedrock Remediation and Orchestration Subworkflows

⚠️ This folder contains Bedrock-aware AWS remediation/orchestration templates for common enterprise outage scenarios.

All workflows enforce strict non-fire-and-forget behavior with explicit wait and success checks.

## 📦 Inventory

- Total subworkflows: **100**
- Helper workflows: **1**
- Bedrock advisory integration: **100/100 workflows**

## 🧠 Bedrock Collaboration Pattern

1. Run Bedrock advisory command through SSM Run Command on orchestrator EC2 instance
2. Poll command status and verify command success
3. Start AWS SSM Automation remediation/orchestration runbook
4. Wait for automation completion using helper subworkflow
5. Validate final automation status is `SUCCESS`

## 🚀 Setup Steps

1. Import and deploy `subworkflow-aws-bedrock-wait-for-systems-manager-document-execution.workflow.json`.
2. Replace helper workflow ID placeholder in all remediation workflows:

```bash
WAIT_ID="<deployed-helper-workflow-id>"
for f in bedrock/subworkflow-aws-bedrock-*.workflow.json; do
  sed -i "s/f0000000-0000-4000-f000-000000000000/$WAIT_ID/g" "$f"
done
```

3. Ensure the orchestrator `instanceId` has IAM permission for `bedrock:InvokeModel` and `ssm:SendCommand`.
4. Optionally override `runbookDocumentNameOverride` for account-specific runbooks.

## 📚 Catalog (100 Subworkflows)

| File | Service | Purpose | Default Runbook |
|---|---|---|---|
| `subworkflow-aws-bedrock-ec2-restart-unhealthy-instance-001.workflow.json` | ec2 | Restart unhealthy EC2 instance after outage detection | `AWS-RestartEC2Instance` |
| `subworkflow-aws-bedrock-ec2-recover-status-check-failure-002.workflow.json` | ec2 | Recover EC2 status-check failures before broad impact | `AWSSupport-TroubleshootEC2Instance` |
| `subworkflow-aws-bedrock-ec2-quarantine-compromised-instance-003.workflow.json` | ec2 | Quarantine compromised EC2 instance as containment action | `AWSSupport-RestrictEC2InstanceTraffic` |
| `subworkflow-aws-bedrock-ec2-replace-degraded-instance-004.workflow.json` | ec2 | Replace degraded EC2 node through automation orchestration | `AWSSupport-ReplaceEC2Instance` |
| `subworkflow-aws-bedrock-ec2-patch-critical-ec2-host-005.workflow.json` | ec2 | Patch critical EC2 host during controlled maintenance window | `AWS-RunPatchBaseline` |
| `subworkflow-aws-bedrock-ebs-extend-ebs-volume-006.workflow.json` | ebs | Extend EBS volume to prevent disk exhaustion outage | `AWS-ExtendEbsVolume` |
| `subworkflow-aws-bedrock-ebs-recover-impaired-volume-007.workflow.json` | ebs | Recover impaired EBS volume to restore storage continuity | `AWSSupport-RecoverImpairedEbsVolume` |
| `subworkflow-aws-bedrock-ebs-reattach-ebs-volume-008.workflow.json` | ebs | Reattach EBS volume after attachment state drift | `AWSSupport-ReattachEbsVolume` |
| `subworkflow-aws-bedrock-ebs-restore-ebs-from-snapshot-009.workflow.json` | ebs | Restore EBS volume from snapshot for fast recovery | `AWSSupport-RestoreEbsVolumeFromSnapshot` |
| `subworkflow-aws-bedrock-ebs-optimize-ebs-performance-010.workflow.json` | ebs | Tune EBS performance settings to reduce latency incidents | `AWS-ModifyEbsVolume` |
| `subworkflow-aws-bedrock-rds-restart-rds-instance-011.workflow.json` | rds | Restart unhealthy RDS instance for service restoration | `AWSSupport-RestartRdsInstance` |
| `subworkflow-aws-bedrock-rds-increase-rds-storage-012.workflow.json` | rds | Increase RDS storage to avoid capacity outage | `AWSSupport-ModifyRdsStorage` |
| `subworkflow-aws-bedrock-rds-recover-rds-connectivity-013.workflow.json` | rds | Recover RDS connectivity degradation with automated checks | `AWSSupport-TroubleshootRDSConnectivity` |
| `subworkflow-aws-bedrock-rds-rotate-rds-credentials-014.workflow.json` | rds | Rotate compromised RDS credentials during incident response | `AWSSupport-RotateRdsCredentials` |
| `subworkflow-aws-bedrock-rds-force-rds-failover-015.workflow.json` | rds | Trigger controlled RDS failover for availability restoration | `AWSSupport-FailoverRdsInstance` |
| `subworkflow-aws-bedrock-aurora-failover-aurora-cluster-016.workflow.json` | aurora | Fail over Aurora cluster to healthy writer node | `AWSSupport-FailoverAuroraCluster` |
| `subworkflow-aws-bedrock-aurora-restart-aurora-reader-017.workflow.json` | aurora | Restart degraded Aurora reader for read path recovery | `AWSSupport-RestartAuroraReader` |
| `subworkflow-aws-bedrock-aurora-scale-aurora-capacity-018.workflow.json` | aurora | Scale Aurora capacity during forecasted demand spikes | `AWSSupport-ScaleAuroraCluster` |
| `subworkflow-aws-bedrock-aurora-repair-aurora-replication-019.workflow.json` | aurora | Repair Aurora replication lag before outage escalation | `AWSSupport-TroubleshootAuroraReplication` |
| `subworkflow-aws-bedrock-aurora-backup-aurora-cluster-020.workflow.json` | aurora | Execute Aurora backup orchestration for resilience | `AWSSupport-BackupAuroraCluster` |
| `subworkflow-aws-bedrock-dynamodb-increase-read-capacity-021.workflow.json` | dynamodb | Increase DynamoDB read capacity for throttling remediation | `AWSSupport-UpdateDynamoDbReadCapacity` |
| `subworkflow-aws-bedrock-dynamodb-increase-write-capacity-022.workflow.json` | dynamodb | Increase DynamoDB write capacity for ingestion stability | `AWSSupport-UpdateDynamoDbWriteCapacity` |
| `subworkflow-aws-bedrock-dynamodb-enable-point-in-time-recovery-023.workflow.json` | dynamodb | Enable DynamoDB PITR to improve recovery posture | `AWSSupport-EnableDynamoDbPitr` |
| `subworkflow-aws-bedrock-dynamodb-recover-dynamodb-throttling-024.workflow.json` | dynamodb | Mitigate DynamoDB throttling through orchestration controls | `AWSSupport-TroubleshootDynamoDbThrottling` |
| `subworkflow-aws-bedrock-dynamodb-rebalance-dynamodb-partitions-025.workflow.json` | dynamodb | Rebalance hot DynamoDB partitions via maintenance flow | `AWSSupport-RebalanceDynamoDbPartitions` |
| `subworkflow-aws-bedrock-sqs-purge-poison-messages-026.workflow.json` | sqs | Purge poison messages to recover blocked consumers | `AWSSupport-PurgeSqsQueue` |
| `subworkflow-aws-bedrock-sqs-increase-visibility-timeout-027.workflow.json` | sqs | Increase SQS visibility timeout to reduce duplicate failures | `AWSSupport-UpdateSqsVisibilityTimeout` |
| `subworkflow-aws-bedrock-sqs-enable-dead-letter-queue-028.workflow.json` | sqs | Enable DLQ to isolate failing SQS messages | `AWSSupport-ConfigureSqsDlq` |
| `subworkflow-aws-bedrock-sqs-recover-sqs-throughput-029.workflow.json` | sqs | Recover SQS throughput during backlog surge | `AWSSupport-ScaleSqsConsumers` |
| `subworkflow-aws-bedrock-sqs-reconcile-sqs-permissions-030.workflow.json` | sqs | Reconcile SQS access policy misconfiguration | `AWSSupport-RepairSqsPolicy` |
| `subworkflow-aws-bedrock-sns-repair-sns-delivery-policy-031.workflow.json` | sns | Repair SNS delivery policy causing notification loss | `AWSSupport-RepairSnsDeliveryPolicy` |
| `subworkflow-aws-bedrock-sns-enable-sns-dlq-032.workflow.json` | sns | Enable SNS DLQ for failed notification resilience | `AWSSupport-ConfigureSnsDlq` |
| `subworkflow-aws-bedrock-sns-recover-sns-subscriptions-033.workflow.json` | sns | Recover broken SNS subscriptions after drift | `AWSSupport-RecoverSnsSubscriptions` |
| `subworkflow-aws-bedrock-sns-replay-sns-failed-deliveries-034.workflow.json` | sns | Replay failed SNS deliveries for incident closure | `AWSSupport-ReplaySnsFailures` |
| `subworkflow-aws-bedrock-sns-harden-sns-topic-security-035.workflow.json` | sns | Harden SNS topic policy during security remediation | `AWSSupport-HardenSnsTopicPolicy` |
| `subworkflow-aws-bedrock-lambda-redeploy-lambda-function-036.workflow.json` | lambda | Redeploy Lambda function after failed release | `AWSSupport-RedeployLambdaFunction` |
| `subworkflow-aws-bedrock-lambda-reset-lambda-concurrency-037.workflow.json` | lambda | Reset Lambda concurrency limits during outage mitigation | `AWSSupport-ResetLambdaConcurrency` |
| `subworkflow-aws-bedrock-lambda-rollback-lambda-alias-038.workflow.json` | lambda | Rollback Lambda alias to known-good version | `AWSSupport-RollbackLambdaAlias` |
| `subworkflow-aws-bedrock-lambda-recover-lambda-timeouts-039.workflow.json` | lambda | Recover Lambda timeout failures through tuning actions | `AWSSupport-TroubleshootLambdaTimeouts` |
| `subworkflow-aws-bedrock-lambda-repair-lambda-vpc-config-040.workflow.json` | lambda | Repair Lambda VPC networking misconfiguration | `AWSSupport-RepairLambdaVpcConfig` |
| `subworkflow-aws-bedrock-api-gateway-redeploy-api-stage-041.workflow.json` | api-gateway | Redeploy API Gateway stage to restore endpoint behavior | `AWSSupport-RedeployApiGatewayStage` |
| `subworkflow-aws-bedrock-api-gateway-rollback-api-release-042.workflow.json` | api-gateway | Rollback API Gateway release after regression | `AWSSupport-RollbackApiGatewayDeployment` |
| `subworkflow-aws-bedrock-api-gateway-repair-api-throttling-policy-043.workflow.json` | api-gateway | Repair API throttling policy during traffic surges | `AWSSupport-RepairApiGatewayThrottling` |
| `subworkflow-aws-bedrock-api-gateway-recover-api-authorizer-044.workflow.json` | api-gateway | Recover API authorizer outage path | `AWSSupport-RecoverApiGatewayAuthorizer` |
| `subworkflow-aws-bedrock-api-gateway-enable-api-caching-045.workflow.json` | api-gateway | Enable API caching to stabilize downstream latency | `AWSSupport-EnableApiGatewayCaching` |
| `subworkflow-aws-bedrock-cloudfront-invalidate-cloudfront-cache-046.workflow.json` | cloudfront | Invalidate stale CloudFront cache after bad deploy | `AWSSupport-InvalidateCloudFrontCache` |
| `subworkflow-aws-bedrock-cloudfront-repair-cloudfront-origin-047.workflow.json` | cloudfront | Repair CloudFront origin connectivity failures | `AWSSupport-RepairCloudFrontOrigin` |
| `subworkflow-aws-bedrock-cloudfront-recover-cloudfront-tls-048.workflow.json` | cloudfront | Recover CloudFront TLS certificate issues | `AWSSupport-RecoverCloudFrontTls` |
| `subworkflow-aws-bedrock-cloudfront-tighten-cloudfront-waf-049.workflow.json` | cloudfront | Tighten CloudFront WAF controls during active incident | `AWSSupport-UpdateCloudFrontWafPolicy` |
| `subworkflow-aws-bedrock-cloudfront-failover-cloudfront-origin-group-050.workflow.json` | cloudfront | Fail over CloudFront origin group for continuity | `AWSSupport-FailoverCloudFrontOriginGroup` |
| `subworkflow-aws-bedrock-eks-restart-eks-deployment-051.workflow.json` | eks | Restart EKS deployment to recover unhealthy pods | `AWSSupport-RestartEksDeployment` |
| `subworkflow-aws-bedrock-eks-cordon-drain-eks-node-052.workflow.json` | eks | Cordon and drain failing EKS node | `AWSSupport-CordonDrainEksNode` |
| `subworkflow-aws-bedrock-eks-repair-eks-csi-driver-053.workflow.json` | eks | Repair EKS CSI driver storage failures | `AWSSupport-TroubleshootEbsCsiDriversForEks` |
| `subworkflow-aws-bedrock-eks-recreate-eks-nodegroup-054.workflow.json` | eks | Recreate degraded EKS nodegroup | `AWSSupport-RecreateEksNodegroup` |
| `subworkflow-aws-bedrock-eks-recover-eks-control-plane-055.workflow.json` | eks | Recover EKS control-plane degradation | `AWSSupport-RecoverEksControlPlane` |
| `subworkflow-aws-bedrock-ecs-restart-ecs-service-056.workflow.json` | ecs | Restart ECS service tasks after unhealthy rollout | `AWSSupport-RestartEcsService` |
| `subworkflow-aws-bedrock-ecs-scale-ecs-service-057.workflow.json` | ecs | Scale ECS service capacity during surge events | `AWSSupport-ScaleEcsService` |
| `subworkflow-aws-bedrock-ecs-recover-ecs-task-failures-058.workflow.json` | ecs | Recover failing ECS tasks with orchestrated remediation | `AWSSupport-TroubleshootEcsTaskFailures` |
| `subworkflow-aws-bedrock-ecs-repair-ecs-cluster-capacity-059.workflow.json` | ecs | Repair ECS cluster capacity bottlenecks | `AWSSupport-RecoverEcsClusterCapacity` |
| `subworkflow-aws-bedrock-ecs-rollback-ecs-deployment-060.workflow.json` | ecs | Rollback ECS deployment to previous stable revision | `AWSSupport-RollbackEcsDeployment` |
| `subworkflow-aws-bedrock-elb-recycle-unhealthy-targets-061.workflow.json` | elb | Recycle unhealthy ELB targets for service recovery | `AWSSupport-RecycleElbTargets` |
| `subworkflow-aws-bedrock-elb-repair-elb-health-checks-062.workflow.json` | elb | Repair ELB health-check configuration drift | `AWSSupport-RepairElbHealthChecks` |
| `subworkflow-aws-bedrock-elb-restore-elb-listeners-063.workflow.json` | elb | Restore ELB listener policy after incident | `AWSSupport-RestoreElbListeners` |
| `subworkflow-aws-bedrock-elb-failover-elb-zones-064.workflow.json` | elb | Fail over ELB traffic away from impaired AZ | `AWSSupport-FailoverElbAvailabilityZone` |
| `subworkflow-aws-bedrock-elb-scale-elb-capacity-065.workflow.json` | elb | Scale ELB capacity for abrupt load increase | `AWSSupport-ScaleElbCapacity` |
| `subworkflow-aws-bedrock-vpc-enable-vpc-flow-logs-066.workflow.json` | vpc | Enable VPC flow logs for rapid outage diagnostics | `AWSSupport-EnableVpcFlowLogs` |
| `subworkflow-aws-bedrock-vpc-repair-route-table-067.workflow.json` | vpc | Repair VPC route-table misconfiguration | `AWSSupport-RepairVpcRouteTable` |
| `subworkflow-aws-bedrock-vpc-recover-vpc-endpoint-068.workflow.json` | vpc | Recover failed VPC endpoint path | `AWSSupport-RecoverVpcEndpoint` |
| `subworkflow-aws-bedrock-vpc-reconcile-network-acl-069.workflow.json` | vpc | Reconcile network ACL drift causing packet drops | `AWSSupport-ReconcileVpcNetworkAcl` |
| `subworkflow-aws-bedrock-vpc-restore-vpc-dns-settings-070.workflow.json` | vpc | Restore VPC DNS settings for service discovery | `AWSSupport-RestoreVpcDnsSettings` |
| `subworkflow-aws-bedrock-vpn-recreate-vpn-tunnel-071.workflow.json` | vpn | Recreate failed VPN tunnel to restore hybrid connectivity | `AWSSupport-RecreateVpnTunnel` |
| `subworkflow-aws-bedrock-vpn-repair-vpn-routing-072.workflow.json` | vpn | Repair VPN routing policy after outage event | `AWSSupport-RepairVpnRouting` |
| `subworkflow-aws-bedrock-vpn-failover-vpn-gateway-073.workflow.json` | vpn | Fail over VPN gateway to secondary path | `AWSSupport-FailoverVpnGateway` |
| `subworkflow-aws-bedrock-vpn-recover-vpn-bgp-session-074.workflow.json` | vpn | Recover VPN BGP session instability | `AWSSupport-RecoverVpnBgpSession` |
| `subworkflow-aws-bedrock-vpn-harden-vpn-crypto-policy-075.workflow.json` | vpn | Harden VPN crypto policy during security hardening | `AWSSupport-HardenVpnCryptoPolicy` |
| `subworkflow-aws-bedrock-nat-gateway-recreate-nat-route-076.workflow.json` | nat-gateway | Recreate NAT route path for private subnet egress | `AWSSupport-RecreateNatGatewayRoute` |
| `subworkflow-aws-bedrock-nat-gateway-failover-nat-gateway-077.workflow.json` | nat-gateway | Fail over NAT gateway during AZ impairment | `AWSSupport-FailoverNatGateway` |
| `subworkflow-aws-bedrock-nat-gateway-repair-nat-egress-078.workflow.json` | nat-gateway | Repair NAT egress failures with automated checks | `AWSSupport-RepairNatEgress` |
| `subworkflow-aws-bedrock-nat-gateway-optimize-nat-capacity-079.workflow.json` | nat-gateway | Optimize NAT capacity under sustained load | `AWSSupport-OptimizeNatGatewayCapacity` |
| `subworkflow-aws-bedrock-nat-gateway-recover-nat-connection-drain-080.workflow.json` | nat-gateway | Recover NAT connection drain issue | `AWSSupport-RecoverNatConnectionDrain` |
| `subworkflow-aws-bedrock-route53-restore-health-checks-081.workflow.json` | route53 | Restore Route53 health-check behavior | `AWSSupport-RestoreRoute53HealthChecks` |
| `subworkflow-aws-bedrock-route53-repair-dns-failover-082.workflow.json` | route53 | Repair Route53 DNS failover policy | `AWSSupport-RepairRoute53FailoverPolicy` |
| `subworkflow-aws-bedrock-route53-rollback-dns-change-083.workflow.json` | route53 | Rollback problematic Route53 DNS change | `AWSSupport-RollbackRoute53Change` |
| `subworkflow-aws-bedrock-route53-recover-private-hosted-zone-084.workflow.json` | route53 | Recover private hosted-zone resolution outage | `AWSSupport-RecoverPrivateHostedZone` |
| `subworkflow-aws-bedrock-route53-harden-route53-record-policy-085.workflow.json` | route53 | Harden Route53 record policy for resilience | `AWSSupport-HardenRoute53RecordPolicy` |
| `subworkflow-aws-bedrock-cloudformation-continue-rollback-086.workflow.json` | cloudformation | Continue CloudFormation rollback after dependency fix | `AWSSupport-ContinueCloudFormationRollback` |
| `subworkflow-aws-bedrock-cloudformation-rollback-failed-stack-087.workflow.json` | cloudformation | Rollback failed CloudFormation stack deployment | `AWSSupport-RollbackCloudFormationStack` |
| `subworkflow-aws-bedrock-cloudformation-repair-stack-policy-088.workflow.json` | cloudformation | Repair CloudFormation stack policy lockout | `AWSSupport-RepairCloudFormationStackPolicy` |
| `subworkflow-aws-bedrock-cloudformation-recover-drifted-stack-089.workflow.json` | cloudformation | Recover drifted CloudFormation stack resources | `AWSSupport-RecoverCloudFormationDrift` |
| `subworkflow-aws-bedrock-cloudformation-reapply-stack-change-set-090.workflow.json` | cloudformation | Reapply validated CloudFormation change set | `AWSSupport-ExecuteCloudFormationChangeSet` |
| `subworkflow-aws-bedrock-opensearch-restart-opensearch-node-091.workflow.json` | opensearch | Restart degraded OpenSearch node to restore query path | `AWSSupport-RestartOpenSearchNode` |
| `subworkflow-aws-bedrock-opensearch-repair-opensearch-cluster-red-092.workflow.json` | opensearch | Repair OpenSearch cluster red status | `AWSSupport-RecoverOpenSearchClusterRed` |
| `subworkflow-aws-bedrock-opensearch-rebalance-opensearch-shards-093.workflow.json` | opensearch | Rebalance OpenSearch shards after node failures | `AWSSupport-RebalanceOpenSearchShards` |
| `subworkflow-aws-bedrock-opensearch-recover-opensearch-disk-pressure-094.workflow.json` | opensearch | Recover OpenSearch disk pressure conditions | `AWSSupport-RecoverOpenSearchDiskPressure` |
| `subworkflow-aws-bedrock-opensearch-rotate-opensearch-master-095.workflow.json` | opensearch | Rotate OpenSearch master for control-plane stability | `AWSSupport-RotateOpenSearchMaster` |
| `subworkflow-aws-bedrock-elasticache-restart-elasticache-cluster-096.workflow.json` | elasticache | Restart ElastiCache cluster after instability | `AWSSupport-RestartElastiCacheCluster` |
| `subworkflow-aws-bedrock-elasticache-failover-elasticache-primary-097.workflow.json` | elasticache | Fail over ElastiCache primary node | `AWSSupport-FailoverElastiCacheReplicationGroup` |
| `subworkflow-aws-bedrock-elasticache-recover-elasticache-latency-098.workflow.json` | elasticache | Recover ElastiCache latency spikes with orchestration | `AWSSupport-TroubleshootElastiCacheLatency` |
| `subworkflow-aws-bedrock-elasticache-scale-elasticache-capacity-099.workflow.json` | elasticache | Scale ElastiCache capacity to prevent saturation | `AWSSupport-ScaleElastiCacheCluster` |
| `subworkflow-aws-bedrock-elasticache-repair-elasticache-parameter-group-100.workflow.json` | elasticache | Repair ElastiCache parameter-group drift | `AWSSupport-RepairElastiCacheParameterGroup` |

## 📊 Runbook Distribution

| Runbook | Count |
|---|---:|
| `AWS-ExtendEbsVolume` | 1 |
| `AWS-ModifyEbsVolume` | 1 |
| `AWS-RestartEC2Instance` | 1 |
| `AWS-RunPatchBaseline` | 1 |
| `AWSSupport-BackupAuroraCluster` | 1 |
| `AWSSupport-ConfigureSnsDlq` | 1 |
| `AWSSupport-ConfigureSqsDlq` | 1 |
| `AWSSupport-ContinueCloudFormationRollback` | 1 |
| `AWSSupport-CordonDrainEksNode` | 1 |
| `AWSSupport-EnableApiGatewayCaching` | 1 |
| `AWSSupport-EnableDynamoDbPitr` | 1 |
| `AWSSupport-EnableVpcFlowLogs` | 1 |
| `AWSSupport-ExecuteCloudFormationChangeSet` | 1 |
| `AWSSupport-FailoverAuroraCluster` | 1 |
| `AWSSupport-FailoverCloudFrontOriginGroup` | 1 |
| `AWSSupport-FailoverElastiCacheReplicationGroup` | 1 |
| `AWSSupport-FailoverElbAvailabilityZone` | 1 |
| `AWSSupport-FailoverNatGateway` | 1 |
| `AWSSupport-FailoverRdsInstance` | 1 |
| `AWSSupport-FailoverVpnGateway` | 1 |
| `AWSSupport-HardenRoute53RecordPolicy` | 1 |
| `AWSSupport-HardenSnsTopicPolicy` | 1 |
| `AWSSupport-HardenVpnCryptoPolicy` | 1 |
| `AWSSupport-InvalidateCloudFrontCache` | 1 |
| `AWSSupport-ModifyRdsStorage` | 1 |
| `AWSSupport-OptimizeNatGatewayCapacity` | 1 |
| `AWSSupport-PurgeSqsQueue` | 1 |
| `AWSSupport-ReattachEbsVolume` | 1 |
| `AWSSupport-RebalanceDynamoDbPartitions` | 1 |
| `AWSSupport-RebalanceOpenSearchShards` | 1 |
| `AWSSupport-ReconcileVpcNetworkAcl` | 1 |
| `AWSSupport-RecoverApiGatewayAuthorizer` | 1 |
| `AWSSupport-RecoverCloudFormationDrift` | 1 |
| `AWSSupport-RecoverCloudFrontTls` | 1 |
| `AWSSupport-RecoverEcsClusterCapacity` | 1 |
| `AWSSupport-RecoverEksControlPlane` | 1 |
| `AWSSupport-RecoverImpairedEbsVolume` | 1 |
| `AWSSupport-RecoverNatConnectionDrain` | 1 |
| `AWSSupport-RecoverOpenSearchClusterRed` | 1 |
| `AWSSupport-RecoverOpenSearchDiskPressure` | 1 |
| `AWSSupport-RecoverPrivateHostedZone` | 1 |
| `AWSSupport-RecoverSnsSubscriptions` | 1 |
| `AWSSupport-RecoverVpcEndpoint` | 1 |
| `AWSSupport-RecoverVpnBgpSession` | 1 |
| `AWSSupport-RecreateEksNodegroup` | 1 |
| `AWSSupport-RecreateNatGatewayRoute` | 1 |
| `AWSSupport-RecreateVpnTunnel` | 1 |
| `AWSSupport-RecycleElbTargets` | 1 |
| `AWSSupport-RedeployApiGatewayStage` | 1 |
| `AWSSupport-RedeployLambdaFunction` | 1 |
| `AWSSupport-RepairApiGatewayThrottling` | 1 |
| `AWSSupport-RepairCloudFormationStackPolicy` | 1 |
| `AWSSupport-RepairCloudFrontOrigin` | 1 |
| `AWSSupport-RepairElastiCacheParameterGroup` | 1 |
| `AWSSupport-RepairElbHealthChecks` | 1 |
| `AWSSupport-RepairLambdaVpcConfig` | 1 |
| `AWSSupport-RepairNatEgress` | 1 |
| `AWSSupport-RepairRoute53FailoverPolicy` | 1 |
| `AWSSupport-RepairSnsDeliveryPolicy` | 1 |
| `AWSSupport-RepairSqsPolicy` | 1 |
| `AWSSupport-RepairVpcRouteTable` | 1 |
| `AWSSupport-RepairVpnRouting` | 1 |
| `AWSSupport-ReplaceEC2Instance` | 1 |
| `AWSSupport-ReplaySnsFailures` | 1 |
| `AWSSupport-ResetLambdaConcurrency` | 1 |
| `AWSSupport-RestartAuroraReader` | 1 |
| `AWSSupport-RestartEcsService` | 1 |
| `AWSSupport-RestartEksDeployment` | 1 |
| `AWSSupport-RestartElastiCacheCluster` | 1 |
| `AWSSupport-RestartOpenSearchNode` | 1 |
| `AWSSupport-RestartRdsInstance` | 1 |
| `AWSSupport-RestoreEbsVolumeFromSnapshot` | 1 |
| `AWSSupport-RestoreElbListeners` | 1 |
| `AWSSupport-RestoreRoute53HealthChecks` | 1 |
| `AWSSupport-RestoreVpcDnsSettings` | 1 |
| `AWSSupport-RestrictEC2InstanceTraffic` | 1 |
| `AWSSupport-RollbackApiGatewayDeployment` | 1 |
| `AWSSupport-RollbackCloudFormationStack` | 1 |
| `AWSSupport-RollbackEcsDeployment` | 1 |
| `AWSSupport-RollbackLambdaAlias` | 1 |
| `AWSSupport-RollbackRoute53Change` | 1 |
| `AWSSupport-RotateOpenSearchMaster` | 1 |
| `AWSSupport-RotateRdsCredentials` | 1 |
| `AWSSupport-ScaleAuroraCluster` | 1 |
| `AWSSupport-ScaleEcsService` | 1 |
| `AWSSupport-ScaleElastiCacheCluster` | 1 |
| `AWSSupport-ScaleElbCapacity` | 1 |
| `AWSSupport-ScaleSqsConsumers` | 1 |
| `AWSSupport-TroubleshootAuroraReplication` | 1 |
| `AWSSupport-TroubleshootDynamoDbThrottling` | 1 |
| `AWSSupport-TroubleshootEC2Instance` | 1 |
| `AWSSupport-TroubleshootEbsCsiDriversForEks` | 1 |
| `AWSSupport-TroubleshootEcsTaskFailures` | 1 |
| `AWSSupport-TroubleshootElastiCacheLatency` | 1 |
| `AWSSupport-TroubleshootLambdaTimeouts` | 1 |
| `AWSSupport-TroubleshootRDSConnectivity` | 1 |
| `AWSSupport-UpdateCloudFrontWafPolicy` | 1 |
| `AWSSupport-UpdateDynamoDbReadCapacity` | 1 |
| `AWSSupport-UpdateDynamoDbWriteCapacity` | 1 |
| `AWSSupport-UpdateSqsVisibilityTimeout` | 1 |

## ✅ Validation Checklist

- ✅ 100 workflows generated
- ✅ No `id` fields in generated workflow JSON files
- ✅ Explicit wait and check tasks included in every workflow
- ✅ Emoji guides included
- ✅ JSON parse validation passes
