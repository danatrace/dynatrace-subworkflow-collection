# 🚀 Top-Level Subworkflow Catalog

This README catalogs tested Dynatrace subworkflow JSON files in the repository.

> ⚠️ **Disclaimer:** Usage is at your own risk. All workflow and subworkflow templates should be tested thoroughly according to workflow automation standards before applying them to production environments.

## 📊 Inventory Summary

- 🧮 Total top-level subworkflows: **46**
- ☁️ AWS: **29**
- 🧭 Dynatrace: **13**
- 🤖 OpenAI: **1**
- 🛠️ Ownership Utilities: **3**
- 📦 Other: **0**

## ☁️ AWS

| File | Use Case | Example Use Case |
|---|---|---|
| [subworkflow-aws-close-security-group.workflow.json](subworkflow-aws-close-security-group.workflow.json) | aws close security group | Close a risky security group during incident containment. |
| [subworkflow-aws-create-ami-image.workflow.json](subworkflow-aws-create-ami-image.workflow.json) | aws create ami image | Create an AMI backup before risky maintenance or patching. |
| [subworkflow-aws-create-cloudformation-stack.workflow.json](subworkflow-aws-create-cloudformation-stack.workflow.json) | aws create cloudformation stack | Provision emergency infrastructure from a predefined stack. |
| [subworkflow-aws-ec2-create-ebs-snapshot.json](subworkflow-aws-ec2-create-ebs-snapshot.json) | aws ec2 create ebs snapshot | Create a point-in-time EBS volume snapshot for data protection and rollback capability. |
| [subworkflow-aws-davis-forecast-for-aws-volume-usage.workflow.json](subworkflow-aws-davis-forecast-for-aws-volume-usage.workflow.json) | aws davis forecast for aws volume usage | Forecast storage growth and trigger proactive capacity actions. |
| [subworkflow-aws-ec2-start-instance-and-verify-running.workflow.json](subworkflow-aws-ec2-start-instance-and-verify-running.workflow.json) | aws ec2 start instance and verify running | Start stopped EC2 instances and confirm running state before continuation. |
| [subworkflow-aws-ec2-stop-instance-and-verify-stopped.workflow.json](subworkflow-aws-ec2-stop-instance-and-verify-stopped.workflow.json) | aws ec2 stop instance and verify stopped | Stop EC2 instances and confirm stopped state before downstream actions. |
| [subworkflow-aws-ec2-terminate-instance-and-verify-terminated.workflow.json](subworkflow-aws-ec2-terminate-instance-and-verify-terminated.workflow.json) | aws ec2 terminate instance and verify terminated | Terminate an EC2 instance and confirm terminated state before teardown continues. |
| [subworkflow-aws-ec2-tag-resource.workflow.json](subworkflow-aws-ec2-tag-resource.workflow.json) | aws ec2 tag resource | Apply tags to EC2 resources for compliance, cost allocation, and asset tracking. |
| [subworkflow-aws-delete-cloudformation-stack.workflow.json](subworkflow-aws-delete-cloudformation-stack.workflow.json) | aws delete cloudformation stack | Tear down failed temporary infrastructure after recovery. |
| [subworkflow-aws-delete-unused-security-group.workflow.json](subworkflow-aws-delete-unused-security-group.workflow.json) | aws delete unused security group | Remove unused security groups to reduce attack surface. |
| [subworkflow-aws-disable-public-access-for-security-group.workflow.json](subworkflow-aws-disable-public-access-for-security-group.workflow.json) | aws disable public access for security group | Disable internet-open rules on sensitive workloads. |
| [subworkflow-aws-extend-ebs-volume.workflow.json](subworkflow-aws-extend-ebs-volume.workflow.json) | aws extend ebs volume | Increase volume size when disk saturation risk is detected. |
| [subworkflow-aws-get-host-data-of-ec2-instance-gen2-aws-connector.workflow.json](subworkflow-aws-get-host-data-of-ec2-instance-gen2-aws-connector.workflow.json) | aws get host data of ec2 instance gen2 aws connector | Fetch host telemetry for decision-driven remediation. |
| [subworkflow-aws-get-host-data-of-ec2-instance-gen3-aws-connector.workflow.json](subworkflow-aws-get-host-data-of-ec2-instance-gen3-aws-connector.workflow.json) | aws get host data of ec2 instance gen3 aws connector | Fetch host telemetry for decision-driven remediation. |
| [subworkflow-aws-get-lambda-data-gen-2-aws-connector.workflow.json](subworkflow-aws-get-lambda-data-gen-2-aws-connector.workflow.json) | aws get lambda data gen 2 aws connector | Collect Lambda runtime data during serverless incidents. |
| [subworkflow-aws-get-process-data-of-process-running-on-ec2-instance.workflow.json](subworkflow-aws-get-process-data-of-process-running-on-ec2-instance.workflow.json) | aws get process data of process running on ec2 instance | Inspect process-level data for root-cause triage. |
| [subworkflow-aws-reboot-ec2-instances.workflow.json](subworkflow-aws-reboot-ec2-instances.workflow.json) | aws reboot ec2 instances | Reboot impacted instances when service health degrades. |
| [subworkflow-aws-resize-ec2-instance.workflow.json](subworkflow-aws-resize-ec2-instance.workflow.json) | aws resize ec2 instance | Right-size compute resources after sustained load increase. |
| [subworkflow-aws-run-command-on-ec2-instance.workflow.json](subworkflow-aws-run-command-on-ec2-instance.workflow.json) | aws run command on ec2 instance | Execute diagnostics or remediation scripts on target hosts. |
| [subworkflow-aws-s3-block-public-access-for-bucket.workflow.json](subworkflow-aws-s3-block-public-access-for-bucket.workflow.json) | aws s3 block public access for bucket | Block public S3 access after an exposure alert. |
| [subworkflow-aws-scan-for-security-groups-with-ports-open-to-0-0-0-0-0.workflow.json](subworkflow-aws-scan-for-security-groups-with-ports-open-to-0-0-0-0-0.workflow.json) | aws scan for security groups with ports open to 0 0 0 0 0 | Scan for publicly exposed security groups and flag risk. |
| [subworkflow-aws-ssm-clear-disk-space-on-linux-ec2.workflow.json](subworkflow-aws-ssm-clear-disk-space-on-linux-ec2.workflow.json) | aws ssm clear disk space on linux ec2 | Clear old logs and temp files to free disk space during saturation incidents. |
| [subworkflow-aws-ssm-restart-linux-systemd-service-on-ec2.workflow.json](subworkflow-aws-ssm-restart-linux-systemd-service-on-ec2.workflow.json) | aws ssm restart linux systemd service on ec2 | Restart a systemd service on EC2 and verify it reaches active state for recovery. |
| [subworkflow-aws-ssm-restart-windows-service-on-ec2.workflow.json](subworkflow-aws-ssm-restart-windows-service-on-ec2.workflow.json) | aws ssm restart windows service on ec2 | Restart a Windows service on EC2 and verify it returns to Running state for recovery. |
| [subworkflow-aws-ssm-delete-ami-image.workflow.json](subworkflow-aws-ssm-delete-ami-image.workflow.json) | aws ssm delete ami image | Remove outdated AMIs and snapshots to reduce storage cost. |
| [subworkflow-aws-update-cloudformation-stack.workflow.json](subworkflow-aws-update-cloudformation-stack.workflow.json) | aws update cloudformation stack | Apply safe stack updates during a controlled change window. |
| [subworkflow-aws-wait-for-run-command-execution.workflow.json](subworkflow-aws-wait-for-run-command-execution.workflow.json) | aws wait for run command execution | Wait for SSM Run Command completion before next automation step. |
| [subworkflow-aws-wait-for-systems-manager-document-execution.workflow.json](subworkflow-aws-wait-for-systems-manager-document-execution.workflow.json) | aws wait for systems manager document execution | Wait for SSM Automation document completion and verify status. |

## 🧭 Dynatrace

| File | Use Case | Example Use Case |
|---|---|---|
| [dynatrace-create-coe-subworkflows.workflow.json](dynatrace-create-coe-subworkflows.workflow.json) | dynatrace create coe subworkflows | Bootstrap a core set of CoE subworkflows for automation onboarding. |
| [subworkflow-dynatrace-check-if-problem-is-solved-or-closed.workflow.json](subworkflow-dynatrace-check-if-problem-is-solved-or-closed.workflow.json) | dynatrace check if problem is solved or closed | Gate downstream actions until the problem is solved. |
| [subworkflow-dynatrace-close-problem.workflow.json](subworkflow-dynatrace-close-problem.workflow.json) | dynatrace close problem | Auto-close resolved Dynatrace problems after validation. |
| [subworkflow-dynatrace-create-dashboard.workflow.json](subworkflow-dynatrace-create-dashboard.workflow.json) | dynatrace create dashboard | Create a focused dashboard for incident monitoring. |
| [subworkflow-dynatrace-create-workflow.workflow.json](subworkflow-dynatrace-create-workflow.workflow.json) | dynatrace create workflow | Bootstrap a new workflow from automation templates. |
| [subworkflow-dynatrace-delete-user.workflow.json](subworkflow-dynatrace-delete-user.workflow.json) | dynatrace delete user | Remove a user account as part of access revocation workflows. |
| [subworkflow-dynatrace-delete-workflow.workflow.json](subworkflow-dynatrace-delete-workflow.workflow.json) | dynatrace delete workflow | Retire obsolete workflows after governance review. |
| [subworkflow-dynatrace-export-one-or-all-workflows-to-existing-github-repo.workflow.json](subworkflow-dynatrace-export-one-or-all-workflows-to-existing-github-repo.workflow.json) | dynatrace export one or all workflows to existing github repo | Back up workflows to GitHub for version control. |
| [subworkflow-dynatrace-get-all-problem-data.workflow.json](subworkflow-dynatrace-get-all-problem-data.workflow.json) | dynatrace get all problem data | Collect full problem context before orchestration steps. |
| [subworkflow-dynatrace-get-event-data.workflow.json](subworkflow-dynatrace-get-event-data.workflow.json) | dynatrace get event data | Fetch event details to enrich remediation decisions. |
| [subworkflow-dynatrace-ingest-custom-alert.workflow.json](subworkflow-dynatrace-ingest-custom-alert.workflow.json) | dynatrace ingest custom alert | Push custom alert payloads into Dynatrace pipelines. |
| [subworkflow-dynatrace-ingest-custom-info-event.workflow.json](subworkflow-dynatrace-ingest-custom-info-event.workflow.json) | dynatrace ingest custom info event | Ingest informational automation events for audit history. |
| [subworkflow-dynatrace-invite-user.workflow.json](subworkflow-dynatrace-invite-user.workflow.json) | dynatrace invite user | Invite a new user during onboarding automation flows. |

## 🤖 OpenAI

| File | Use Case | Example Use Case |
|---|---|---|
| [subworkflow-open-ai-text-and-prompting.workflow.json](subworkflow-open-ai-text-and-prompting.workflow.json) | open ai text and prompting | Generate response text for AI-assisted operations workflows. |

## 🛠️ Ownership Utilities

| File | Use Case | Example Use Case |
|---|---|---|
| [subworkflow-delete-all-workflows-of-owner.workflow.json](subworkflow-delete-all-workflows-of-owner.workflow.json) | delete all workflows of owner | Bulk-delete owner workflows during tenant cleanup. |
| [subworkflow-set-all-workflows-of-owner-to-draft.workflow.json](subworkflow-set-all-workflows-of-owner-to-draft.workflow.json) | set all workflows of owner to draft | Move workflows to draft mode before maintenance. |
| [subworkflow-set-all-workflows-of-owner-to-live-deployed.workflow.json](subworkflow-set-all-workflows-of-owner-to-live-deployed.workflow.json) | set all workflows of owner to live deployed | Promote owner workflows back to live after validation. |

