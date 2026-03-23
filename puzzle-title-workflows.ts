export const puzzleTitleWorkflows = [
  {
    "id": "ef7a64e0-5420-4cef-8500-893539cc9f0d",
    "title": "🧩subworkflow - aws close security group",
    "description": "Subworkflow: Close Traffic to and from an AWS Security Group\nThis subworkflow removes all ingress and egress rules from a specified AWS security group, effectively closing all traffic to and from it.\n\nParameters\nawssecuritygroupid (Required): The ID of the AWS security group to be modified.\nawsregion (Required): The AWS region where the security group resides.\ndynatraceawsconnection (Required): The name of the Dynatrace OIDC connection used to authenticate with AWS.\n\nSubworkflow will wait for ssm document execution and will fail if ssm document fails\n\nThis subworkflow uses the out of the box AWS SSM document/runbook AWS-CloseSecurityGroup\nhttps://us-east-1.console.aws.amazon.com/systems-manager/documents/AWS-CloseSecurityGroup/description?region=us-east-1\n\nThis subworkflow Needs subworkflow \"subworkflow - aws wait for systems manager document execution\"",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-ssm-execution-completed\") }}",
    "type": "STANDARD",
    "input": {
      "awsregion": "us-east-1",
      "awssecuritygroupid": "sg-010d8b10c89d61c2c",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🔐 **Subworkflow: Close Traffic to and from an AWS Security Group**\n\n🚫 This subworkflow removes **all ingress and egress rules** from a specified AWS security group, effectively blocking **all inbound and outbound traffic**.\n\n---\n\n### ⚙️ **Parameters**\n\n- **awssecuritygroupid** (Required): 🆔 The ID of the AWS security group to modify.  \n- **awsregion** (Required): 🌍 The AWS region where the security group is located.  \n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow waits for the AWS Systems Manager (SSM) document execution to complete.  \n❌ If the SSM document execution fails, this subworkflow will also fail.\n\n---\n\n### 📘 **AWS SSM Document Used**\n\nThis subworkflow uses the out-of-the-box AWS Systems Manager document/runbook:  \n🔗 https://us-east-1.console.aws.amazon.com/systems-manager/documents/AWS-CloseSecurityGroup/description?region=us-east-1\n\n---\n\n### 🔗 **Dependencies**\n\nThis subworkflow depends on the following subworkflow:\n\n- 🧩 [subworkflow - aws wait for systems manager document execution](/ui/apps/dynatrace.automations/workflows/20661ec0-29d5-471f-9973-29679d5fe908)",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ execution_id }) {\n  const configGet = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-ssm-execution-completed/result`);\n  const configBody = await configGet.json();\n  const status = configBody.AutomationExecutionStatus.toUpperCase()\n  console.log(status)\n  \n  if (status !=\"SUCCESS\") {\n        console.log(\"SSM Document Execution has Failed!\");\n        throw new Error(\"SSM Document Execution has Failed!\");\n  } \n\n  return configBody;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-ssm-execution-completed": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "wait-for-ssm-execution-completed"
        ]
      },
      "wait-for-ssm-execution-completed": {
        "name": "wait-for-ssm-execution-completed",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n\"AutomationExecutionId\":\"{{result(\"systems_manager_start_automation_execution_1\").AutomationExecutionId }}\",\n\"awsregion\": \"{{input()[\"awsregion\"] }}\",\n\"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "systems_manager_start_automation_execution_1": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "systems_manager_start_automation_execution_1"
        ]
      },
      "systems_manager_start_automation_execution_1": {
        "name": "systems_manager_start_automation_execution_1",
        "input": {
          "region": "{{ input()[\"awsregion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{ \n  \"SecurityGroupId\": [\"{{input()[\"awssecuritygroupid\"] }}\"]\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "DocumentName": "AWS-CloseSecurityGroup"
        },
        "retry": {
          "count": 5,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Initiates execution of an Automation runbook",
        "predecessors": []
      }
    }
  },
  {
    "id": "f305b9e3-06f9-457e-9741-7eb934fe1005",
    "title": "🧩subworkflow - aws create ami image",
    "description": "Subworkflow to create an AMI from an EC2 instance\n\nParameters:\n\ninstanceId: (Required) The instance ID to create AMI from\nimageName: (Required) Name for the AMI\nimageDescription: (Optional) Description for the AMI\nnoReboot: (Optional) Create AMI without rebooting instance\nawsregion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{ result(\"check-status\") }}",
    "type": "STANDARD",
    "input": {
      "noReboot": "true",
      "awsregion": "us-east-1",
      "imageName": "test-dynatrace-wf",
      "instanceId": "i-0141d0169e394a450",
      "imageDescription": "test-dynatrace-wf",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🖼️ **Subworkflow to Create an AMI Image**\n\n📸 This subworkflow **creates an Amazon Machine Image (AMI) from a running EC2 instance** via the **AWS-CreateImage** SSM automation document.\n\nUseful for backups, creating standardized images, and version control of instance configurations.\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceId** (Required): 🆔 The instance ID to create AMI from.  \n- **imageName** (Required): 📝 Name for the new AMI.  \n- **imageDescription** (Optional): 📋 Description for the AMI.  \n- **noReboot** (Optional): ⚡ Create AMI without rebooting (true/false). Default: false.  \n- **awsregion** (Required): 🌍 The AWS region.  \n- **dynatraceawsconnection** (Required): 🔑 Dynatrace AWS OIDC connection.\n\n---\n\n### 📘 **AWS SSM Document**\n\n**Document Name**: `AWS-CreateImage`\n\n🔗 https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-aws-createimage.html\n\n**What this runbook does:**\n- Creates an AMI from a running EC2 instance\n- Optionally reboots instance during creation\n- Captures the instance configuration and attached volumes\n- Produces a reusable image for launching new instances\n\n---\n\n🔗 Dependencies\nThis subworkflow depends on the following subworkflow:\n\n[🧩 subworkflow - aws wait for systems manager document execution](/ui/apps/dynatrace.automations/workflows/20661ec0-29d5-471f-9973-29679d5fe908)",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "import { execution } from '@dynatrace-sdk/automation-utils';\nexport default async function ({ execution_id }) {\n  const result = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-completion/result`).then(r => r.json());\n  if (result.AutomationExecutionStatus !== \"Success\") throw new Error(\"AMI creation failed!\");\n  return result;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "timeout": 30,
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-completion": "OK"
          }
        },
        "description": "fail subworkflow if SSM Execution was not successful",
        "predecessors": [
          "wait-for-completion"
        ]
      },
      "start-automation": {
        "name": "start-automation",
        "input": {
          "region": "{{ input()[\"awsregion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\n  \"InstanceId\": [\"{{ input()[\"instanceId\"] }}\"]\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "DocumentName": "AWS-CreateImage"
        },
        "retry": {
          "count": 5,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "trigger AWS-CreateImage SSM runbook",
        "predecessors": []
      },
      "wait-for-completion": {
        "name": "wait-for-completion",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n  \"AutomationExecutionId\": \"{{ result(\"start-automation\").AutomationExecutionId }}\",\n  \"awsregion\": \"{{ input()[\"awsregion\"] }}\",\n  \"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "start-automation": "OK"
          }
        },
        "description": "loop until SSM runbook execution has finished",
        "predecessors": [
          "start-automation"
        ]
      }
    }
  },
  {
    "id": "e85d9c9e-30a9-44db-a429-0b781bad389a",
    "title": "🧩subworkflow - aws create cloudformation stack",
    "description": "Subworkflow to Create an AWS CloudFormation Stack\n\nThis subworkflow provides an easy way to trigger the creation of an aws cloudformation stack\n\nparameters:\n\ncf_stackname: (Required) The name of the CloudFormation stack you want to create.\ncfyamls3url: (Required) The URL of the CloudFormation YAML file to run (must be stored in S3 and linked to using the following url syntax: https://s3bucket.s3.us-east-1.amazonaws.com/cf.yaml).\nawsregion: (Required) The AWS region in which you want to create the CloudFormation stack.\ndynatraceawsconnection: (Required) The connection name of the Dynatrace OIDC connection.\n\nThis subworkflow requires the custom SSM Document \"Dynwf-CreateCloudFormationStack\" to be available in the region specified by the awsregion parameter.\nPlease refer to the instructions below under \"Steps to Import AWS SSM Document/Runbook YAML\".\n\nSubworkflow will wait for ssm document execution and will fail if ssm document fails.\n\nWorkflow-Steps\n***************\n\nThe subworkflow sends the command to create a cloudformation stack to the\naws SSM document \"Dynwf-CreateCloudFormationStack\", then waits until\nthe SSM document has finished and then checks if the creation was \nsuccessful. If not, it will fail the subworkflow to provide a restart on error\nfunctionality to the Parent workflow\n\nThis subworkflow Needs subworkflow \"subworkflow - aws wait for systems manager document execution\"\n\nSteps to Import AWS SSM Document/Runbook Yaml:\n***********************************************\n1.) Open the Following link https://us-east-1.console.aws.amazon.com/systems-manager/documents/create-document?region=us-east-1#documentType=Automation\n    That will take you to the AWS Management Console (you need to be logged in) and open the Runbook builder to create a new Runbook.\n\n2.) If needed change the aws region of the Runbook in the console\n3.) In the upper left corner Change the Runbook name into \"Dynwf-CreateCloudFormationStack\"\n4.) Click on the {} Code button next to the runbook name this will take you to the yaml def. of the runbook\n5.) Paste the Yaml content below into the code field\n\n# yaml file start\nschemaVersion: '0.3'\ndescription: |-\n  *Replace this default text with instructions or other information about your runbook.*\n\n  ---\n  # What is Markdown?\n  Markdown is a lightweight markup language that converts your content with plain text formatting to structurally valid rich text.\n  ## You can add headings\n  You can add *italics* or make the font **bold**.\n  1. Create numbered lists\n  * Add bullet points\n  >Indent `code samples`\n\n  You can create a [link to another webpage](https://aws.amazon.com).\nparameters:\n  stackname:\n    type: String\n  cfyamls3url:\n    type: String\nmainSteps:\n  - name: CreateCloudFormationStack\n    action: aws:createStack\n    isEnd: true\n    inputs:\n      StackName: '{{ stackname }}'\n      Capabilities:\n        - CAPABILITY_NAMED_IAM\n      TimeoutInMinutes: 120\n      TemplateURL: '{{ cfyamls3url }}'\noutputs:\n  - CreateCloudFormationStack.StackId\n  - CreateCloudFormationStack.StackStatus\n  - CreateCloudFormationStack.StackStatusReason\n  - CreateCloudFormationStack.OutputPayload\n# yaml file end\n\n6.) Click on create runbook",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-ssm-execution-completed\") }}",
    "type": "STANDARD",
    "input": {
      "awsregion": "us-east-1",
      "cfyamls3url": "https://serverlessexamples.s3.us-east-1.amazonaws.com/serverless_demo_fail_us_east_2.yaml",
      "cf_stackname": "serverless-demo",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## ☁️ **Subworkflow: Create an AWS CloudFormation Stack**\n\n🚀 This subworkflow provides a simple and standardized way to trigger the creation of an **AWS CloudFormation stack** using AWS Systems Manager (SSM).\n\n---\n\n### ⚙️ **Parameters**\n\n- **cf_stackname** (Required): 🏷️ The name of the CloudFormation stack to create.  \n- **cfyamls3url** (Required): 📄 The S3 URL of the CloudFormation YAML template to deploy  \n  (must follow this format: `https://s3bucket.s3.us-east-1.amazonaws.com/cf.yaml`).  \n- **awsregion** (Required): 🌍 The AWS region where the CloudFormation stack will be created.  \n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace OIDC connection used to authenticate with AWS.\n\n---\n\n### 📘 **Prerequisites**\n\n✅ This subworkflow requires the custom AWS Systems Manager (SSM) document  \n**`Dynwf-CreateCloudFormationStack`** to be available in the AWS region specified by the `awsregion` parameter.\n\n📖 Refer to the **Steps to Import AWS SSM Document / Runbook YAML** section below for setup instructions.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow waits for the SSM document execution to complete.  \n❌ If the SSM document execution fails, this subworkflow will also fail.\n\n---\n\n### 🧩 **Workflow Steps**\n\n- 📤 The subworkflow sends a command to create a CloudFormation stack to the  \n  AWS SSM document **`Dynwf-CreateCloudFormationStack`**  \n- ⏳ It waits for the SSM document execution to complete  \n- ✅ The execution result is validated to confirm successful stack creation  \n- ❌ If the creation fails, the subworkflow fails to enable **restart-on-error** behavior in the parent workflow\n\n---\n\n### 🔗 **Dependencies**\n\nThis subworkflow requires the following subworkflow:\n\n- 🧩 `/ui/apps/dynatrace.automations/workflows/20661ec0-29d5-471f-9973-29679d5fe908`\n\n---\n\n## 🛠️ **Steps to Import AWS SSM Document / Runbook YAML**\n\n1. 🔗 Open the following link:  \n   https://us-east-1.console.aws.amazon.com/systems-manager/documents/create-document?region=us-east-1#documentType=Automation  \n   *(You must be logged in to the AWS Management Console.)*\n\n2. 🌍 If needed, change the AWS region in the console to match your target environment.\n\n3. ✏️ In the upper-left corner, set the runbook name to:  \n   **`Dynwf-CreateCloudFormationStack`**\n\n4. 🧾 Click the **`{}` Code** button next to the runbook name to open the YAML definition.\n\n5. 📋 Paste the following YAML content into the code editor:\n\n```yaml\nschemaVersion: '0.3'\n\nparameters:\n  stackname:\n    type: String\n  cfyamls3url:\n    type: String\n\nmainSteps:\n  - name: CreateCloudFormationStack\n    action: aws:createStack\n    isEnd: true\n    inputs:\n      StackName: '{{ stackname }}'\n      Capabilities:\n        - CAPABILITY_NAMED_IAM\n      TimeoutInMinutes: 120\n      TemplateURL: '{{ cfyamls3url }}'\n\noutputs:\n  - CreateCloudFormationStack.StackId\n  - CreateCloudFormationStack.StackStatus\n  - CreateCloudFormationStack.StackStatusReason\n  - CreateCloudFormationStack.OutputPayload",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ execution_id }) {\n  const configGet = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-ssm-execution-completed/result`);\n  const configBody = await configGet.json();\n  const status = configBody.AutomationExecutionStatus.toUpperCase()\n  console.log(status)\n  \n  if (status !=\"SUCCESS\") {\n        console.log(\"SSM Document Execution has Failed!\");\n        throw new Error(\"SSM Document Execution has Failed!\");\n  } \n\n  return configBody;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-ssm-execution-completed": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "wait-for-ssm-execution-completed"
        ]
      },
      "wait-for-ssm-execution-completed": {
        "name": "wait-for-ssm-execution-completed",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n\"AutomationExecutionId\":\"{{result(\"systems_manager_start_automation_execution_1\").AutomationExecutionId }}\",\n\"awsregion\": \"{{input()[\"awsregion\"] }}\",\n\"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "systems_manager_start_automation_execution_1": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "systems_manager_start_automation_execution_1"
        ]
      },
      "systems_manager_start_automation_execution_1": {
        "name": "systems_manager_start_automation_execution_1",
        "input": {
          "region": "{{ input()[\"awsregion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{ \n  \"stackname\": [\"{{input()[\"cf_stackname\"] }}\"],\n  \"cfyamls3url\": [\"{{input()[\"cfyamls3url\"] }}\"]\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "DocumentName": "Dynwf-CreateCloudFormationStack"
        },
        "retry": {
          "count": 5,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Initiates execution of an Automation runbook",
        "predecessors": []
      }
    }
  },
  {
    "id": "a13c2f6f-9e3d-478a-8399-1d17fecf6779",
    "title": "🧩subworkflow - aws davis forecast for aws volume usage",
    "description": "Subworkflow: Forecasting AWS Volume Disk Usage\nThis subworkflow provides a streamlined method for forecasting the disk usage of an AWS EBS volume.\n\nSince an AWS volume can only be extended once every 6 hours, this subworkflow estimates the maximum expected usage within that time window.\nThe forecasted value can then be passed to a workflow task responsible for extending the volume to the predicted size.\n\nParameters\nhost_entity_id (Required):\nThe Dynatrace Host entity ID associated with the AWS volume.\n\nforecast_method (Required):\npossible values are \"point\", \"upper\", \"lower\" depending on which of the prediction outcomes you would like to use\npoint = dt.davis.forecast:point\nupper = dt.davis.forecast:upper\nlower = dt.davis.forecast:lower\nYou can find more information about these methods in the documentation:\nhttps://docs.dynatrace.com/docs/discover-dynatrace/platform/davis-ai/ai-models/forecast-analysis\nhttps://www.dynatrace.com/news/blog/stay-ahead-of-the-game-forecast-it-capacity-with-dynatrace-grail-and-davis-ai/\n\non_forecast_failure_increase_by_percentage_of_total_diskspace (Required):\nA fallback percentage of the total volume size used to calculate an extension size if the forecast fails or returns a value smaller than the current volume size.\n\nWorkflow Logic\nWhen triggered, the subworkflow uses the host_entity_id to forecast the disk usage 6 hours into the future.\nIf the forecast failsdue to insufficient data or if the predicted usage is less than the current volume sizethe subworkflow performs an alternative calculation using the fallback parameter.\n\nAlternative Calculation\nIf forecasting is unsuccessful, the volume is extended using the following formula:\nNew Volume Size = Current Volume Size + (Current Volume Size  Fallback Percentage)\n\nFor example:\nIf the current volume size is 100 GB and the fallback percentage is 50%, the new volume size will be:\n100 GB + (100 GB  0.50) = 150 GB",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{result(\"get-prediction-result\")}}",
    "type": "STANDARD",
    "input": {
      "host_entity_id": "HOST-584C330971260086",
      "forecast_method": "point",
      "on_forecast_failure_increase_by_percentag_of_total_diskspace": 100
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 📈 **Subworkflow for Forecasting AWS Volume Disk Usage**\n\n🔮 This subworkflow provides a streamlined method for **forecasting disk usage of an AWS EBS volume** using Dynatrace Davis AI.\n\n---\n\n### 🕒 **Overview**\n\nSince an AWS volume can only be extended **once every 6 hours**, this subworkflow estimates the **maximum expected disk usage within that time window**.  \n📊 The forecasted value can then be passed to a workflow task responsible for extending the volume to the predicted size.\n\n---\n\n### ⚙️ **Parameters**\n\n- **host_entity_id** (Required): 🖥️ The Dynatrace Host entity ID associated with the AWS volume.\n\n- **forecast_method** (Required): 📐 Specifies which forecast prediction to use.  \n  Possible values:\n  - **point** → `dt.davis.forecast:point`\n  - **upper** → `dt.davis.forecast:upper`\n  - **lower** → `dt.davis.forecast:lower`\n\n  📚 More information about these methods:\n  - https://docs.dynatrace.com/docs/discover-dynatrace/platform/davis-ai/ai-models/forecast-analysis  \n  - https://www.dynatrace.com/news/blog/stay-ahead-of-the-game-forecast-it-capacity-with-dynatrace-grail-and-davis-ai/\n\n- **on_forecast_failure_increase_by_percentage_of_total_diskspace** (Required): 🛟  \n  A fallback percentage of the total volume size used to calculate an extension size if:\n  - forecasting fails due to insufficient data, or  \n  - the forecasted value is smaller than the current volume size.\n\n---\n\n### 🔗 **Workflow Requirement**\n\nWorkflow needs subworkflow  \n[subworkflow - aws get host data of ec2 instance](/ui/apps/dynatrace.automations/workflows/3e5454a4-50ad-4dab-914c-638b6df5b283?trigger=&view=live)\n\n---\n\n### 🧠 **Workflow Logic**\n\n- ▶️ When triggered, the subworkflow uses the **host_entity_id** to forecast disk usage **6 hours into the future**.\n- ⚠️ If the forecast fails due to insufficient data **or** the predicted usage is less than the current volume size, the subworkflow performs an alternative calculation using the fallback parameter.\n\n---\n\n### 🔁 **Alternative Calculation**\n\nIf forecasting is unsuccessful, the volume is extended using the following formula:",
    "tasks": {
      "get-disk-lifetime": {
        "name": "get-disk-lifetime",
        "input": {
          "workflowId": "3e5454a4-50ad-4dab-914c-638b6df5b283",
          "workflowInput": "{\n  \"host_entity_id\": \"{{input()[\"host_entity_id\"] }}\"\n}"
        },
        "action": "dynatrace.automations:run-workflow",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": []
      },
      "get-total-disk-size": {
        "name": "get-total-disk-size",
        "input": {
          "query": "fetch dt.entity.host\n| filter matchesPhrase(id, \"{{input()[\"host_entity_id\"]}}\")\n| lookup  [ timeseries max(dt.host.disk.used), by: { dt.entity.host }\n| fieldsAdd disksizex = arrayLast(`max(dt.host.disk.used)`)/1000000000\n| fields disksize=round(disksizex), dt.entity.host\n] , sourceField:id, lookupField:dt.entity.host, prefix:\"disk_\"\n| lookup  [ timeseries max(dt.host.disk.avail), by: { dt.entity.host }\n| fieldsAdd disksizex = arrayLast(`max(dt.host.disk.avail)`)/1000000000\n| fields disksize=round(disksizex), dt.entity.host\n] , sourceField:id, lookupField:dt.entity.host, prefix:\"disk_avail_\"\n| fields total_disk_size=disk_disksize + disk_avail_disksize"
        },
        "action": "dynatrace.automations:execute-dql-query",
        "active": true,
        "position": {
          "x": 0,
          "y": 6
        },
        "conditions": {
          "states": {
            "davis-ai-forecast-disk-size": "OK"
          }
        },
        "description": "Make use of Dynatrace Grail data in your workflow.",
        "predecessors": [
          "davis-ai-forecast-disk-size"
        ]
      },
      "get-prediction-result": {
        "name": "get-prediction-result",
        "input": {
          "script": "import { execution } from '@dynatrace-sdk/automation-utils';\n\n\nexport default async function ({ executionId }) {\n    const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n    const exe = await execution(executionId);\n    const predResult = await exe.result('davis-ai-forecast-disk-size');\n    const getTotaldisksizeReult = await exe.result('get-total-disk-size');\n    //console.log(getTotaldisksizeReult)\n    //console.log(getTotaldisksizeReult.records[0].total_disk_size)\n    const result = predResult['result'];\n    const predictionSummary = { violation: false, violations: new Array<Record<string, string>>() };\n    //console.log(\"Total number of predicted lines: \" + result.output.length);\n    // Check if prediction was successful.\n    if (result && result.executionStatus == 'COMPLETED' && result.output[0].analysisStatus == \"OK\") {\n        console.log('Prediction was successful.')\n            const lowerPredictions = result.output[0].timeSeriesDataWithPredictions.records[0]['dt.davis.forecast:lower'];\n            const upperPredictions = result.output[0].timeSeriesDataWithPredictions.records[0]['dt.davis.forecast:upper'];\n            const pointPredictions = result.output[0].timeSeriesDataWithPredictions.records[0]['dt.davis.forecast:point'];\n            const lowerPredictions_last = lowerPredictions[lowerPredictions.length - 1];\n            const upperPredictions_last = upperPredictions[upperPredictions.length - 1];\n            const pointPredictions_last = pointPredictions[pointPredictions.length - 1];\n            console.log(lowerPredictions_last/1000000000)\n            console.log(upperPredictions_last/1000000000)\n            console.log(pointPredictions_last/1000000000)\n            var predicted_disk_usage_in_gb=pointPredictions_last/1000000000;\n            var predicted_disk_usage_in_gb_round = Math.round(predicted_disk_usage_in_gb)\n            var lower_in_gb=lowerPredictions_last/1000000000;\n            var lower = Math.round(lower_in_gb)\n            var upper_in_gb=upperPredictions_last/1000000000;\n            var upper = Math.round(upper_in_gb)\n            let prediction_method = predicted_disk_usage_in_gb_round\n            if (input.forecast_method == \"upper\") {\n              prediction_method = upper\n            } else if (input.forecast_method == \"lower\") {\n              prediction_method = upper\n            } else {\n              prediction_method = predicted_disk_usage_in_gb_round\n            }\n            console.log(\"using prediction method \"+input.forecast_method )\n\n      \n            if (prediction_method > getTotaldisksizeReult.records[0].total_disk_size) {\n            return {\"predicted_disk_size\": prediction_method,\"dt.davis.forecast:lower\": lower,\"dt.davis.forecast:upper\": upper, \"dt.davis.forecast:point\": predicted_disk_usage_in_gb_round };\n            } else {\n              console.log('Prediction smaller than total disk size, increase by '+input.on_forecast_failure_increase_by_percentag_of_total_diskspace+\"% of total disksize instead\")\n              const total=(getTotaldisksizeReult.records[0].total_disk_size/100*input.on_forecast_failure_increase_by_percentag_of_total_diskspace) + getTotaldisksizeReult.records[0].total_disk_size\n              return {\"predicted_disk_size\": total,\"dt.davis.forecast:lower\": lower,\"dt.davis.forecast:upper\": upper, \"dt.davis.forecast:point\": predicted_disk_usage_in_gb_round };\n\n            }\n      \n\n    } else {\n        console.log('Prediction run failed!');\n        console.log('Increase by ' +input.on_forecast_failure_increase_by_percentag_of_total_diskspace+\"% of total disksize\");\n        const total=(getTotaldisksizeReult.records[0].total_disk_size/100*input.on_forecast_failure_increase_by_percentag_of_total_diskspace) + getTotaldisksizeReult.records[0].total_disk_size\n        return {\"predicted_disk_size\": total };\n\n    }\n }"
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "position": {
          "x": 0,
          "y": 7
        },
        "conditions": {
          "states": {
            "get-total-disk-size": "ANY"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "get-total-disk-size"
        ]
      },
      "calculate-lifetime-duration": {
        "name": "calculate-lifetime-duration",
        "input": {
          "script": "import { execution } from '@dynatrace-sdk/automation-utils';\nimport { queryExecutionClient } from \"@dynatrace-sdk/client-query\";\n\nexport default async function ({ executionId }) {\n  const exe = await execution(executionId);\n  const ebs = await exe.result('get-disk-lifetime');\n  const disk_starttime = new Date(ebs.ebs_lifetime.start)\n  const disk_endtime = new Date(ebs.ebs_lifetime.end)\n  const timestamp1 = disk_starttime.getTime(); // Milliseconds for date1\n  const timestamp2 = disk_endtime.getTime(); // Milliseconds for date2\n  const differenceInMilliseconds = timestamp2 - timestamp1;\n  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);\n  console.log(differenceInHours)\n  const roundeddiff = Math.floor(differenceInHours);\n  console.log(roundeddiff)\n  let difference = roundeddiff\n  \n  if (roundeddiff == 0) {\n    difference = 1\n  } else {\n    difference = roundeddiff\n  }\n    \n  return difference;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "get-disk-lifetime": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "get-disk-lifetime"
        ]
      },
      "davis-ai-forecast-disk-size": {
        "name": "davis-ai-forecast-disk-size",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { analyzersClient } from '@dynatrace-sdk/client-davis-analyzers';\n\n\nexport default async function ({ executionId }) {\n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n  const exe = await execution(executionId);\n  const duration = await exe.result('caculate-if-recent-or-constant-growth');\n  console.log(input.host_entity_id)\n  console.log(duration)\n\n\n  \n  const query = 'timeseries max(dt.host.disk.used), by: { dt.entity.host }, interval:1m | filter matchesPhrase(dt.entity.host, \"'+input.host_entity_id+'\")'\n  const analyzerName = 'dt.statistics.GenericForecastAnalyzer';\n  const response = await analyzersClient.executeAnalyzer({\n    analyzerName,\n    body: {\n      nPaths: 200,\n      useModelCache: true,\n      forecastOffset: 0,\n      forecastHorizon: 600,\n      coverageProbability: 0.9,\n      applyZeroLowerBoundHeuristic: true,\n      generalParameters: {\n         timeframe: {\n             endTime: \"now\",\n             startTime: \"now-\"+duration.key+\"\"   \n             //startTime: \"now-2h\" \n             },\n        logVerbosity: \"WARNING\",  \n        resolveDimensionalQueryData: false\n      },\n      timeSeriesData: {\n        expression: query,\n      },\n    },\n  });\n\n\n  return response;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "position": {
          "x": 0,
          "y": 5
        },
        "conditions": {
          "states": {
            "caculate-if-recent-or-constant-growth": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "caculate-if-recent-or-constant-growth"
        ]
      },
      "calculate-forecast-timeframes": {
        "name": "calculate-forecast-timeframes",
        "input": {
          "query": "timeseries full_time_of_existancex=max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-{{result(\"calculate-lifetime-duration\") }}h\n| fieldsadd full_time_of_existance=arrayRemoveNulls(full_time_of_existancex)\n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\")\n| fieldsadd result_full = (arraylast(full_time_of_existance) - arrayfirst(full_time_of_existance)) / arrayfirst(full_time_of_existance) * 100 / arraySize(full_time_of_existance)\n| append [timeseries hours1 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-1h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\")\n| fieldsadd result_hours1 = (arraylast(hours1)- arrayfirst(hours1)) / arrayfirst(hours1) * 100 / arraySize(hours1)] \n| append [timeseries hours2 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-2h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\") \n| fieldsadd result_hours2 = (arraylast(hours2) -arrayfirst(hours2)) / arrayfirst(hours2) * 100 / arraySize(hours2)] \n| append [timeseries hours3 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-3h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\")\n| fieldsadd result_hours3 = (arraylast(hours3) -arrayfirst(hours3)) / arrayfirst(hours3) * 100 / arraySize(hours3)]  \n| append [timeseries hours4 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-4h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\") \n| fieldsadd result_hours4 = (arraylast(hours4) -arrayfirst(hours4)) / arrayfirst(hours4) * 100 / arraySize(hours4)]  \n| append [timeseries hours5 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-5h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\") \n| fieldsadd result_hours5 = (arraylast(hours5) -arrayfirst(hours5)) / arrayfirst(hours5) * 100 / arraySize(hours5)]  \n| append [timeseries hours6 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-6h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\") \n| fieldsadd result_hours6 = (arraylast(hours6) -arrayfirst(hours6)) / arrayfirst(hours6) * 100 / arraySize(hours6)]  \n| append [timeseries hours7 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-7h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\") \n| fieldsadd result_hours7 = (arraylast(hours7) -arrayfirst(hours7)) / arrayfirst(hours7) * 100 / arraySize(hours7)]  \n| append [timeseries hours8 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-8h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\") \n| fieldsadd result_hours8 = (arraylast(hours8) -arrayfirst(hours8)) / arrayfirst(hours8) * 100 / arraySize(hours8)]  \n| append [timeseries hours9 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-9h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\") \n| fieldsadd result_hours9 = (arraylast(hours9) -arrayfirst(hours9)) / arrayfirst(hours9) * 100 / arraySize(hours9)]  \n| append [timeseries hours10 = max(dt.host.disk.used), by: { dt.entity.host }, interval:1m, from:now()-10h \n| filter matchesPhrase(dt.entity.host, \"{{input()[\"host_entity_id\"] }}\") \n| fieldsadd result_hours10 = (arraylast(hours10) -arrayfirst(hours10)) / arrayfirst(hours10) * 100 / arraySize(hours10)]  \n| summarize alltime=max(result_full), hours1=max(result_hours1), hours2=max(result_hours2), hours3=max(result_hours3), hours4=max(result_hours4), hours5=max(result_hours5), hours6=max(result_hours6), hours7=max(result_hours7), hours8=max(result_hours8), hours9=max(result_hours9), hours10=max(result_hours10)"
        },
        "action": "dynatrace.automations:execute-dql-query",
        "active": true,
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "custom": "",
          "states": {
            "calculate-lifetime-duration": "OK"
          }
        },
        "description": "Make use of Dynatrace Grail data in your workflow.",
        "predecessors": [
          "calculate-lifetime-duration"
        ]
      },
      "caculate-if-recent-or-constant-growth": {
        "name": "caculate-if-recent-or-constant-growth",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ executionId }) {\n\n  interface NumberDictionary {\n  [key: string]: number;\n  }\n  const growth: NumberDictionary = {};\n  const exe = await execution(executionId);\n  const lifetimeduration = await exe.result('calculate-lifetime-duration');\n  const gap1 = await exe.result('calculate-forecast-timeframes');\n  // e.g. get the current execution\n  console.log(gap1.records[0]);\n  growth[lifetimeduration+\"h\"] = gap1.records[0].alltime;\n  growth[\"1h\"] = gap1.records[0].hours1;\n  growth[\"2h\"] = gap1.records[0].hours2;\n  growth[\"3h\"] = gap1.records[0].hours3;\n  growth[\"4h\"] = gap1.records[0].hours4;\n  growth[\"5h\"] = gap1.records[0].hours5;\n  growth[\"6h\"] = gap1.records[0].hours6;\n  growth[\"7h\"] = gap1.records[0].hours7;\n  growth[\"8h\"] = gap1.records[0].hours8;\n  growth[\"9h\"] = gap1.records[0].hours9;\n  growth[\"10h\"] = gap1.records[0].hours10;\n\n  function getHighestKeyValue(obj: { [key: string]: number }): { key: string; value: number } | undefined {\n  let highestValue: number | undefined;\n  let highestKey: string | undefined;\n\n  for (const key in obj) {\n      if (obj.hasOwnProperty(key)) {\n        const value = obj[key];\n        if (typeof value === 'number') { // Ensure the value is a number for comparison\n          if (highestValue === undefined || value > highestValue) {\n            highestValue = value;\n            highestKey = key;\n          }\n        }\n      }\n    }\n  \n    if (highestKey !== undefined && highestValue !== undefined) {\n      return { key: highestKey, value: highestValue };\n    } else {\n      return undefined; // Handle case of empty object or no numeric values\n    }\n  }\n\n  const Result = getHighestKeyValue(growth)\n    \n  \n  return Result;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "position": {
          "x": 0,
          "y": 4
        },
        "conditions": {
          "states": {
            "calculate-forecast-timeframes": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "calculate-forecast-timeframes"
        ]
      }
    }
  },
  {
    "id": "d383240e-af68-4833-bd4b-d02615b1030d",
    "title": "🧩subworkflow - aws delete cloudformation stack",
    "description": "Subworkflow to Delete an AWS CloudFormation Stack\n\nThis subworkflow provides a simple way to trigger the deletion of an AWS CloudFormation stack \n\nParameters:\n\ncf_stackname: (Required) stackname of the cloudformation stack you want to delete\nawsregion: (Required) region in which you want to delete the cloudformation stack\ndynatraceawsconnection: (Required) Dynatrace aws oidc connection name\n\nThis subworkflow needs the custom SSM Document \n\"Dynwf-DeleteCloudFormationStack\" available in the\nregion that is handed over by the parameter \"awsregion\" \n\nThe subworkflow sends the command to delete a cloudformation stack to the\naws SSM document \"Dynwf-DeleteCloudFormationStack\", then waits until\nthe SSM document has finished and then checks if the deletion was \nsuccessful. If not, it will fail the subworkflow to provide a \nrestart on error functionality to the Parent workflow\n\nSteps to Import AWS SSM Document/Runbook Yaml:\n***********************************************\n1.) Open the Following link https://us-east-1.console.aws.amazon.com/systems-manager/documents/create-document?region=us-east-1#documentType=Automation\n    That will take you to the AWS Management Console (you need to be loggin it) and open the Runbook builder to create a new Runbook\n\n2.) If needed change the aws region of the Runbook in the console\n3.) In the upper left corner Change the Runbook name into \"Dynwf-DeleteCloudFormationStack\"\n4.) Click on the {} Code button next to the runbook name this will take you to the yaml def. of the runbook\n5.) Paste the Yaml content below into the code field\n\n# yaml file start\n\nschemaVersion: '0.3'\ndescription: |-\n  *Replace this default text with instructions or other information about your runbook.*\n\n  ---\n  # What is Markdown?\n  Markdown is a lightweight markup language that converts your content with plain text formatting to structurally valid rich text.\n  ## You can add headings\n  You can add *italics* or make the font **bold**.\n  1. Create numbered lists\n  * Add bullet points\n  >Indent `code samples`\n\n  You can create a [link to another webpage](https://aws.amazon.com).\nparameters:\n  stackname:\n    type: String\nmainSteps:\n  - name: DeleteCloudFormationStack\n    action: aws:deleteStack\n    isEnd: true\n    inputs:\n      StackName: '{{ stackname }}'\n# yaml file end\n      \n6.) Click on create runbook\n\nThis Subworkflow uses and needs the subworkflow \"subworkflow - aws wait for systems manager  document execution\"",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-ssm-execution-completed\") }}",
    "type": "STANDARD",
    "input": {
      "awsregion": "us-east-1",
      "cf_stackname": "serverless-demo",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🗑️ **Subworkflow to Delete an AWS CloudFormation Stack**\n\n🧹 This subworkflow provides a simple and reliable way to **trigger the deletion of an AWS CloudFormation stack** using AWS Systems Manager (SSM).\n\n---\n\n### ⚙️ **Parameters**\n\n- **cf_stackname** (Required): 🏷️ The name of the CloudFormation stack to delete.  \n- **awsregion** (Required): 🌍 The AWS region in which the CloudFormation stack will be deleted.  \n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace AWS OIDC connection used for authentication.\n\n---\n\n### 📘 **Prerequisites**\n\n✅ This subworkflow requires the custom AWS Systems Manager (SSM) document  \n**`Dynwf-DeleteCloudFormationStack`** to be available in the AWS region provided by the `awsregion` parameter.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 📤 The subworkflow sends a command to delete the CloudFormation stack to the  \n  AWS SSM document **`Dynwf-DeleteCloudFormationStack`**\n- ⏳ It waits for the SSM document execution to complete\n- ✅ The result is checked to verify that the deletion was successful\n- ❌ If the deletion fails, the subworkflow fails to enable **restart-on-error** behavior in the parent workflow\n\n---\n\n### 🔗 **Workflow Requirement**\n\nWorkflow needs subworkflow  \n[subworkflow - aws wait for systems manager document execution](/ui/apps/dynatrace.automations/workflows/20661ec0-29d5-471f-9973-29679d5fe908)\n\n---\n\n## 🛠️ **Steps to Import AWS SSM Document / Runbook YAML**\n\n1. 🔗 Open the following link:  \n   https://us-east-1.console.aws.amazon.com/systems-manager/documents/create-document?region=us-east-1#documentType=Automation  \n   *(You must be logged in to the AWS Management Console.)*\n\n2. 🌍 If needed, change the AWS region in the console.\n\n3. ✏️ In the upper-left corner, change the runbook name to:  \n   **`Dynwf-DeleteCloudFormationStack`**\n\n4. 🧾 Click the **`{}` Code** button next to the runbook name to open the YAML definition.\n\n5. 📋 Paste the following YAML content into the code editor:\n\n```yaml\nschemaVersion: '0.3'\n\nparameters:\n  stackname:\n    type: String\n\nmainSteps:\n  - name: DeleteCloudFormationStack\n    action: aws:deleteStack\n    isEnd: true\n    inputs:\n      StackName: '{{ stackname }}'",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ execution_id }) {\n  const configGet = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-ssm-execution-completed/result`);\n  const configBody = await configGet.json();\n  const status = configBody.AutomationExecutionStatus.toUpperCase()\n  console.log(status)\n  \n  if (status !=\"SUCCESS\") {\n        console.log(\"SSM Document Execution has Failed!\");\n        throw new Error(\"SSM Document Execution has Failed!\");\n  } \n\n  return configBody;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-ssm-execution-completed": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "wait-for-ssm-execution-completed"
        ]
      },
      "wait-for-ssm-execution-completed": {
        "name": "wait-for-ssm-execution-completed",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n\"AutomationExecutionId\":\"{{result(\"systems_manager_start_automation_execution_1\").AutomationExecutionId }}\",\n\"awsregion\": \"{{input()[\"awsregion\"] }}\",\n\"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "systems_manager_start_automation_execution_1": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "systems_manager_start_automation_execution_1"
        ]
      },
      "systems_manager_start_automation_execution_1": {
        "name": "systems_manager_start_automation_execution_1",
        "input": {
          "region": "{{ input()[\"awsregion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{ \n  \"stackname\": [\"{{input()[\"cf_stackname\"] }}\"]\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "DocumentName": "Dynwf-DeleteCloudFormationStack"
        },
        "retry": {
          "count": 5,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Initiates execution of an Automation runbook",
        "predecessors": []
      }
    }
  },
  {
    "id": "28b19bd4-d7e9-4d5d-9473-e7288c55bb2e",
    "title": "🧩subworkflow - aws delete unused security group",
    "description": "Subworkflow deletes a non-default security group that is not utilized by an elastic network interface.\n\nA non-default security group is defined as any security group whose name is not default. \nIf the security group ID passed to this automation document belongs to a default security group, \nthis document will not perform any changes.\n\nParameters:\n\nawssecuritygroupid: (Required) aws security group id to delete \nassumerolearn: (Required) aws role to assume that allows deletion of security groups\nawsregion: (Required) region in which the security group resides\ndynatraceawsconnection: (Required) the connection name of the Dynatrace OIDC Connection\n\nSubworkflow will wait for ssm document execution and will fail if ssm document execution fails\n\nThis subworkflow uses the out of the box AWS SSM document AWSConfigRemediation-DeleteUnusedSecurityGroup\nhttps://us-east-1.console.aws.amazon.com/systems-manager/documents/AWSConfigRemediation-DeleteUnusedSecurityGroup/description?region=us-east-1",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-ssm-execution-completed\") }}",
    "type": "STANDARD",
    "input": {
      "awsregion": "us-west-2",
      "assumerolearn": "arn:aws:iam::589650258462:role/ssm_assume_role",
      "awssecuritygroupid": "sg-067cafc968e87d398",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧹 **Subworkflow to Delete an Unused Non-Default AWS Security Group**\n\n🔐 This subworkflow deletes a **non-default AWS security group** that is **not associated with any elastic network interface (ENI)**.\n\nA **non-default security group** is defined as any security group whose name is **not** `default`.  \n⚠️ If the security group ID passed to this subworkflow belongs to a **default security group**, **no changes will be made**.\n\n---\n\n### ⚙️ **Parameters**\n\n- **awssecuritygroupid** (Required): 🆔 The AWS security group ID to delete.  \n- **assumerolearn** (Required): 🎭 The AWS IAM role ARN to assume, which must allow deletion of security groups.  \n- **awsregion** (Required): 🌍 The AWS region where the security group resides.  \n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow waits for the AWS Systems Manager (SSM) document execution to complete.  \n❌ If the SSM document execution fails, this subworkflow will also fail.\n\n---\n\n### 📘 **AWS SSM Document Used**\n\nThis subworkflow uses the out-of-the-box AWS Systems Manager document:\n\n🔗 https://us-east-1.console.aws.amazon.com/systems-manager/documents/AWSConfigRemediation-DeleteUnusedSecurityGroup/description?region=us-east-1\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 🔍 The subworkflow validates that the specified security group:\n  - is **not** a default security group, and  \n  - is **not attached** to any elastic network interface (ENI)\n- 📤 A delete command is sent to the AWS SSM document  \n  **`AWSConfigRemediation-DeleteUnusedSecurityGroup`**\n- ⏳ The subworkflow waits for execution to complete\n- ✅ If the deletion is successful, the workflow completes\n- ❌ If the deletion fails, the subworkflow fails to allow **restart-on-error** handling in the parent workflow\n\n---\n``",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ execution_id }) {\n  const configGet = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-ssm-execution-completed/result`);\n  const configBody = await configGet.json();\n  const status = configBody.AutomationExecutionStatus.toUpperCase()\n  console.log(status)\n  \n  if (status !=\"SUCCESS\") {\n        console.log(\"SSM Document Execution has Failed!\");\n        throw new Error(\"SSM Document Execution has Failed!\");\n  } \n\n  return configBody;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-ssm-execution-completed": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "wait-for-ssm-execution-completed"
        ]
      },
      "wait-for-ssm-execution-completed": {
        "name": "wait-for-ssm-execution-completed",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n\"AutomationExecutionId\":\"{{result(\"systems_manager_start_automation_execution_1\").AutomationExecutionId }}\",\n\"awsregion\": \"{{input()[\"awsregion\"] }}\",\n\"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "systems_manager_start_automation_execution_1": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "systems_manager_start_automation_execution_1"
        ]
      },
      "systems_manager_start_automation_execution_1": {
        "name": "systems_manager_start_automation_execution_1",
        "input": {
          "region": "{{ input()[\"awsregion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{ \n  \"GroupId\": [\"{{input()[\"awssecuritygroupid\"] }}\"],\n  \"AutomationAssumeRole\": [\"{{input()[\"assumerolearn\"] }}\"]\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "DocumentName": "AWSConfigRemediation-DeleteUnusedSecurityGroup"
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Initiates execution of an Automation runbook",
        "predecessors": []
      }
    }
  },
  {
    "id": "f8fdc88c-9a8c-4f3b-8198-9a021996515e",
    "title": "🧩subworkflow - aws disable public access for security group",
    "description": "Subworkflow to disable SSH and RDP ports opened to IP address specified, or open  to all addresses (0.0.0.0/0) if no address is specified.\n\nThe security group must have existing rules specifically on the SSH and RDP ports in order for ingress to be disabled.\n\nParameters:\n\nawssecuritygroupid: (Required) aws security group id to close traffic \nipaddresstoblock: (Optional) Additional Ipv4 or Ipv6 address to block access from (ex:1.2.3.4/32) (if not given all ip addresses will be taken into consideration)\nawsregion: (Required) region in which the security group resides\ndynatraceawsconnection: (Required) the connection name of the Dynatrace OIDC Connection\n\nThis subworkflow Needs subworkflow \"subworkflow - aws wait for systems manager document execution\"\nSubworkflow will wait for ssm document execution and will fail if ssm document fails\n\nThis subworkflow uses the out of the box AWS SSM document AWS-DisablePublicAccessForSecurityGroup\nhttps://us-east-1.console.aws.amazon.com/systems-manager/documents/AWS-DisablePublicAccessForSecurityGroup/description?region=us-east-1",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-ssm-execution-completed\") }}",
    "type": "STANDARD",
    "input": {
      "awsregion": "us-east-1",
      "ipaddresstoblock": "0.0.0.0/0",
      "awssecuritygroupid": "sg-010d8b10c89d61c2c",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🚫 **Subworkflow to Disable SSH and RDP Public Access on an AWS Security Group**\n\n🔐 This subworkflow disables **SSH (22)** and **RDP (3389)** ingress rules that are:\n- opened to a **specific IP address**, or  \n- opened to **all addresses (`0.0.0.0/0`)** if no IP address is specified.\n\n⚠️ *The security group must already have existing ingress rules on the SSH and/or RDP ports for traffic to be disabled.*\n\n---\n\n### ⚙️ **Parameters**\n\n- **awssecuritygroupid** (Required): 🆔 The AWS security group ID for which traffic should be restricted.  \n- **ipaddresstoblock** (Optional): 🌐 An IPv4 or IPv6 CIDR block to block access from  \n  *(example: `1.2.3.4/32`)*.  \n  If not provided, **all IP addresses** (including `0.0.0.0/0`) are considered.\n- **awsregion** (Required): 🌍 The AWS region where the security group resides.  \n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ This subworkflow waits for the AWS Systems Manager (SSM) document execution to complete.  \n❌ If the SSM document execution fails, this subworkflow will also fail.\n\n---\n\n### 📘 **AWS SSM Document Used**\n\nThis subworkflow uses the out-of-the-box AWS Systems Manager document:\n\n🔗 **AWS-DisablePublicAccessForSecurityGroup**\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 🔍 The subworkflow evaluates existing ingress rules on the specified security group\n- 🚫 SSH (22) and RDP (3389) rules matching the specified IP address (or all addresses) are disabled\n- 📤 The remediation is executed via the AWS SSM document\n- ⏳ The subworkflow waits for execution to complete\n- ✅ If successful, the workflow completes\n- ❌ If execution fails, the subworkflow fails to allow **restart-on-error** handling in the parent workflow\n\n---\n\n### 🔗 **Workflow Requirement**\n\nThis subworkflow Needs subworkflow  \n[subworkflow - aws wait for systems manager document execution](/ui/apps/dynatrace.automations/workflows/20661ec0-29d5-471f-9973-29679d5fe908)",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ execution_id }) {\n  const configGet = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-ssm-execution-completed/result`);\n  const configBody = await configGet.json();\n  const status = configBody.AutomationExecutionStatus.toUpperCase()\n  console.log(status)\n  \n  if (status !=\"SUCCESS\") {\n        console.log(\"SSM Document Execution has Failed!\");\n        throw new Error(\"SSM Document Execution has Failed!\");\n  } \n\n  return configBody;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-ssm-execution-completed": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "wait-for-ssm-execution-completed"
        ]
      },
      "wait-for-ssm-execution-completed": {
        "name": "wait-for-ssm-execution-completed",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n\"AutomationExecutionId\":\"{{result(\"systems_manager_start_automation_execution_1\").AutomationExecutionId }}\",\n\"awsregion\": \"{{input()[\"awsregion\"] }}\",\n\"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "systems_manager_start_automation_execution_1": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "systems_manager_start_automation_execution_1"
        ]
      },
      "systems_manager_start_automation_execution_1": {
        "name": "systems_manager_start_automation_execution_1",
        "input": {
          "region": "{{ input()[\"awsregion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{ \n  \"GroupId\": [\"{{input()[\"awssecuritygroupid\"] }}\"],\n  \"IpAddressToBlock\": [\"{{input()[\"ipaddresstoblock\"] }}\"]\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "DocumentName": "AWS-DisablePublicAccessForSecurityGroup"
        },
        "retry": {
          "count": 5,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Initiates execution of an Automation runbook",
        "predecessors": []
      }
    }
  },
  {
    "id": "34f84b95-96e2-4d29-a272-417853c42299",
    "title": "🧩subworkflow - aws ec2 create ebs snapshot",
    "description": "Subworkflow to create an EBS volume snapshot and poll until the snapshot reaches 'completed' state.\n\nParameters:\n\nvolumeId: (Required) EBS volume ID to snapshot\nsnapshotDescription: (Optional) Description for the snapshot\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{ result(\"create_snapshot\") }}",
    "type": "STANDARD",
    "input": {
      "volumeId": "vol-08521b61a82cefcc3",
      "awsRegion": "us-east-1",
      "snapshotDescription": "Automated snapshot before remediation",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 📸 **Subworkflow to Create an EBS Volume Snapshot**\n\n📸 This subworkflow provides a simple way to **initiate a point-in-time snapshot of an EBS volume** for data protection and backup purposes.\n\nIt is commonly used before risky operations such as resizing, migration, or patching where rollback capability is critical.\n\n---\n\n### ⚙️ **Parameters**\n\n- **volumeId** (Required): 🆔 EBS volume ID to snapshot.  \n- **snapshotDescription** (Optional): 📝 Human-readable description for the snapshot (e.g., `Backup before resize`, `Pre-patch snapshot`).  \n- **awsRegion** (Required): 🌍 AWS region where the EBS volume resides.  \n- **dynatraceawsconnection** (Required): 🔑 Name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow initiates EBS snapshot creation asynchronously.  \n❌ If the snapshot creation request fails, the subworkflow fails so parent workflows can handle errors appropriately.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Useful for **quick snapshot initiation before risky operations**\n- ✅ Lightweight approach for workflows that don't require completion confirmation\n- ✅ Provides rollback capability by maintaining point-in-time volume copies\n- ✅ Integrates securely through the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "create_snapshot": {
        "name": "create_snapshot",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "VolumeId": "{{ input()[\"volumeId\"] }}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "Description": "{{ input()[\"snapshotDescription\"] }}"
        },
        "retry": {
          "count": 3,
          "delay": 15,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-create-snapshot",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Initiate EBS snapshot creation.",
        "predecessors": []
      }
    }
  },
  {
    "id": "30a66e34-f116-4eb4-9d9f-d0098110a0dd",
    "title": "🧩subworkflow - aws ec2 start instance and verify running",
    "description": "Subworkflow to start a stopped EC2 instance and verify it reaches the 'running' state.\n\nParameters:\n\ninstanceIds: (Required) EC2 instance ID(s) to start\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{ result(\"ec2_wait_running\") }}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceIds": "i-0bf88cff011236fde",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## ▶️ **Subworkflow to Start an AWS EC2 Instance and Verify Running State**\n\n🚀 This subworkflow provides a simple and reliable way to **start one or more stopped AWS EC2 instances** and **wait until they are fully in the `running` state** before continuing.\n\nIt is commonly used in remediation, recovery, and scale-out workflows where downstream steps must only execute once the instance is available.\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceIds** (Required): 🆔 EC2 instance ID(s) to start.  \n- **awsRegion** (Required): 🌍 AWS region in which the EC2 instance(s) reside.  \n- **dynatraceawsconnection** (Required): 🔑 Name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow first triggers the EC2 start operation, then waits until all target instances report state **`running`**.  \n❌ If start or wait-state validation fails, the subworkflow fails so parent workflows can apply restart-on-error or alternate handling logic.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Useful for **auto-recovery and self-healing workflows**\n- ✅ Useful for **scheduled start windows** in cost-optimized environments\n- ✅ Ensures dependent tasks only run after instance availability is confirmed\n- ✅ Integrates securely through the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "ec2_start": {
        "name": "ec2_start",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceIds\"]}}"
        },
        "action": "dynatrace.aws.connector:ec2-start-instances",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Starts an Amazon EBS-backed instance that you've previously stopped.",
        "predecessors": []
      },
      "ec2_wait_running": {
        "name": "ec2_wait_running",
        "input": {
          "region": "{{ input()[\"awsRegion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{ input()[\"instanceIds\"] }}",
          "InstanceState": "running"
        },
        "retry": {
          "count": 10,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-wait-state",
        "timeout": 600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "ec2_start": "OK"
          }
        },
        "description": "Wait until the EC2 instance(s) are fully running.",
        "waitBefore": 10,
        "predecessors": [
          "ec2_start"
        ]
      }
    }
  },
  {
    "id": "49577ffb-03d8-47a5-916c-f9970d4f38a1",
    "title": "🧩subworkflow - aws ec2 stop instance and verify stopped",
    "description": "Subworkflow to stop an EC2 instance and verify it reaches the 'stopped' state before completing.\n\nParameters:\n\ninstanceIds: (Required) EC2 instance ID(s) to stop\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{ result(\"ec2_wait_stopped\") }}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceIds": "i-0bf88cff011236fde",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🛑 **Subworkflow to Stop AWS EC2 Instance(s) and Verify Stopped State**\n\n🧯 This subworkflow provides a controlled and reliable way to **stop one or more AWS EC2 instances** and **wait until they are fully in the `stopped` state** before completing.\n\nIt is commonly used in maintenance workflows, scheduled shutdown windows, and cost-optimization automations where instance shutdown must be confirmed.\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceIds** (Required): 🆔 EC2 instance ID(s) to stop.  \n- **awsRegion** (Required): 🌍 AWS region in which the EC2 instance(s) reside.  \n- **dynatraceawsconnection** (Required): 🔑 Name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow first triggers the EC2 stop operation, then waits until all target instances report state **`stopped`**.  \n❌ If stop or wait-state validation fails, the subworkflow fails so parent workflows can apply restart-on-error or alternate handling logic.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Useful for **scheduled shutdown and maintenance workflows**\n- ✅ Useful before **resize, snapshot, or controlled patching operations**\n- ✅ Ensures downstream tasks execute only after shutdown is confirmed\n- ✅ Integrates securely through the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "ec2_stop": {
        "name": "ec2_stop",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceIds\"]}}"
        },
        "retry": {
          "count": 3,
          "delay": 15,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-stop-instances",
        "timeout": 60,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Stop the EC2 instance(s).",
        "predecessors": []
      },
      "ec2_wait_stopped": {
        "name": "ec2_wait_stopped",
        "input": {
          "region": "{{ input()[\"awsRegion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{ input()[\"instanceIds\"] }}",
          "InstanceState": "stopped"
        },
        "retry": {
          "count": 10,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-wait-state",
        "timeout": 600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "ec2_stop": "OK"
          }
        },
        "description": "Wait until the EC2 instance(s) are fully stopped.",
        "waitBefore": 10,
        "predecessors": [
          "ec2_stop"
        ]
      }
    }
  },
  {
    "id": "8c4208d4-f3bd-4b3c-95fb-99effb589776",
    "title": "🧩subworkflow - aws ec2 tag resource",
    "description": "Subworkflow to apply tags to an EC2 resource (instance, volume, snapshot, etc.) and verify the tags are present.\n\nParameters:\n\nresourceId: (Required) AWS resource ID to tag\ntagKey: (Required) Tag key to apply\ntagValue: (Required) Tag value to apply\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{result(\"apply_tag\")}}",
    "type": "STANDARD",
    "input": {
      "tagKey": "Remediation",
      "tagValue": "In Progress",
      "awsRegion": "us-east-1",
      "resourceId": "i-09571811d6a7cdd74",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🏷️ **Subworkflow to Tag AWS EC2 Resources**\n\n🏷️ This subworkflow provides a simple way to **apply a tag to any AWS EC2 resource** (instances, volumes, AMIs, snapshots, security groups) and verify the tag is present.\n\nIt is commonly used for compliance marking, cost allocation, asset tracking, and audit trails across infrastructure.\n\n---\n\n### ⚙️ **Parameters**\n\n- **resourceId** (Required): 🆔 AWS EC2 resource ID to tag (e.g., `i-xxx` for instance, `vol-xxx` for volume, `sg-xxx` for security group).  \n- **tagKey** (Required): 📝 Tag key name to apply (e.g., `Environment`, `Owner`, `CostCenter`).  \n- **tagValue** (Required): 📝 Tag value to apply (e.g., `production`, `team-a`, `12345`).  \n- **awsRegion** (Required): 🌍 AWS region where the resource resides.  \n- **dynatraceawsconnection** (Required): 🔑 Name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow applies the specified tag key and value to the target resource.  \n❌ If the tag operation fails, the subworkflow fails so parent workflows can apply restart-on-error or alternate handling logic.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Useful for **compliance and governance workflows** requiring resource tagging\n- ✅ Useful for **cost allocation and chargeback automation**\n- ✅ Useful for **asset tracking and automated resource inventory**\n- ✅ Integrates securely through the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "apply_tag": {
        "name": "apply_tag",
        "input": {
          "Tags": [
            {
              "key": "Key",
              "value": "{{ input()[\"tagKey\"] }}"
            },
            {
              "key": "Value",
              "value": "{{ input()[\"tagValue\"] }}"
            }
          ],
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Resources": "{{ input()[\"resourceId\"] }}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}"
        },
        "retry": {
          "count": 3,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-create-tags",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Adds or overwrites only the specified tags for the specified Amazon EC2 resource or resources.",
        "predecessors": []
      }
    }
  },
  {
    "id": "fa2c4383-159a-427b-a5be-a150686b7263",
    "title": "🧩subworkflow - aws ec2 terminate instance and verify terminated",
    "description": "Subworkflow to terminate an EC2 instance and verify it reaches the 'terminated' state. Used for zombie instance cleanup and auto-healing.\n\nParameters:\n\ninstanceId: (Required) EC2 instance ID to terminate\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{ result(\"ec2_wait_terminated\") }}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceId": "i-08104be7602657784",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## ❌ **Subworkflow to Terminate an AWS EC2 Instance and Verify Terminated State**\n\n🧹 This subworkflow provides a controlled way to **terminate an AWS EC2 instance** and **wait until it is fully in the `terminated` state** before completing.\n\nIt is commonly used for decommissioning, zombie-instance cleanup, and automated remediation scenarios where safe teardown must be confirmed.\n\n⚠️ **Termination is irreversible.** Ensure the correct EC2 instance ID is passed before execution.\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceId** (Required): 🆔 EC2 instance ID to terminate.  \n- **awsRegion** (Required): 🌍 AWS region in which the EC2 instance resides.  \n- **dynatraceawsconnection** (Required): 🔑 Name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow triggers instance termination and then waits until the target instance reports state **`terminated`**.  \n❌ If the terminate action or state verification fails, the subworkflow fails so parent workflows can apply restart-on-error or alternate handling logic.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Useful for **instance lifecycle cleanup and decommissioning workflows**\n- ✅ Useful for **auto-remediation scenarios** where replacement resources are provisioned separately\n- ✅ Ensures downstream teardown steps only run after termination is confirmed\n- ✅ Integrates securely through the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "ec2_terminate": {
        "name": "ec2_terminate",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceId\"]}}"
        },
        "retry": {
          "count": 3,
          "delay": 10,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-terminate-instances",
        "timeout": 60,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Terminate the EC2 instance.",
        "predecessors": []
      },
      "ec2_wait_terminated": {
        "name": "ec2_wait_terminated",
        "input": {
          "region": "{{ input()[\"awsRegion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{ input()[\"instanceId\"] }}",
          "InstanceState": "terminated"
        },
        "retry": {
          "count": 15,
          "delay": 20,
          "failedLoopIterationsOnly": false
        },
        "action": "dynatrace.aws.connector:ec2-wait-state",
        "timeout": 600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "ec2_terminate": "OK"
          }
        },
        "description": "Wait until the EC2 instance is fully terminated.",
        "waitBefore": 10,
        "predecessors": [
          "ec2_terminate"
        ]
      }
    }
  },
  {
    "id": "5052e41e-caa3-4bc8-a818-5f7b3999dbdb",
    "title": "🧩subworkflow - aws extend ebs volume",
    "description": "Subworkflow to extend aws volumes (can only be done once every 6 hours).\n\nThis subworkflow provides an easy way to trigger\nthe extension of aws volumes attached to an ec2 instance\n\nParameters:\n\nosType: (Required) the Operating System type of the Ec2 istance (Windows or Linux)\nSizeGib: (Required) The target size to increase the volume to (in GiB).\nVolumeId: (Required) The volume to be extended\nawsregion: region of volume to extend\nInstanceId: (Required) The identifier of the instance requiring increase of volume\nMountPoint: (Optional) The mount point (such as \"/\", \"/data\", ...) of the partition which is to be increased(Required for Linux).\nDriveLetter: (Optional) The drive letter which is to be increased(Required for windows).\nkeepSnapShot: (Optional) A boolean flag to determine whether to remove the created snapshot after successful resizing of the volume and the file system(True by default).\ndynatraceawsconnection: (Required) dynatrace aws oidc connection\nAutomationAssumeRolearn: (Optional) The ARN of the role that allows Automation to perform the actions on your behalf\n\n\nThis subworkflow only works on ssm managed aws ec2 instances:\nPlease view this aws manual on how to make an ec2 instances ssm managed: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-ec2.html\n\nThis subworkflow needs 2 SSM Documents:\n\n1.) Out of the Box AWS Document \"aws-extendebsvolume\" https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/aws-extendebsvolume.html\n2.) A Custom Document for which you will find the instructions to import below\n\nThe Out of the Box Document \"aws-extendebsvolume\" provides the following functionality:\n .) create snapshot (Optional)\n .) Resize Ebs Volume on AWS\n .) Resize partitions on Operating systems",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-ssm-execution-completed\") }}",
    "type": "STANDARD",
    "input": {
      "osType": "",
      "SizeGib": "90",
      "VolumeId": "vol-034b884f20b26576c",
      "awsregion": "us-east-1",
      "InstanceId": "i-04ea0bc508917a220",
      "MountPoint": "/",
      "DriveLetter": "",
      "keepSnapShot": "false",
      "dynatraceawsconnection": "awssandbox",
      "AutomationAssumeRolearn": ""
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 📦 **Subworkflow to Extend AWS Volumes (Once Every 6 Hours)**\n\n📈 This subworkflow provides a simple and reliable way to **extend AWS EBS volumes** attached to an EC2 instance.  \n⏱️ Since AWS volumes can only be extended **once every 6 hours**, this workflow is designed to safely handle volume and file system resizing.\n\n---\n\n### ⚙️ **Parameters**\n\n- **osType** (Required): 🖥️ The operating system type of the EC2 instance  \n  *(Supported values: `Windows` or `Linux`)*\n\n- **SizeGib** (Required): 📏 The target size to extend the volume to (in **GiB**).\n\n- **VolumeId** (Required): 🆔 The ID of the EBS volume to be extended.\n\n- **awsregion** (Required): 🌍 The AWS region where the volume resides.\n\n- **InstanceId** (Required): 🧾 The EC2 instance ID that the volume is attached to.\n\n- **MountPoint** (Optional): 📂 The mount point of the partition to be extended  \n  *(Required for Linux, e.g. `/`, `/data`)*\n\n- **DriveLetter** (Optional): 💽 The drive letter to be extended  \n  *(Required for Windows, e.g. `C:`)*\n\n- **keepSnapShot** (Optional): 📸 Boolean flag indicating whether to retain the snapshot after a successful resize  \n  *(Defaults to `true`)*\n\n- **dynatraceawsconnection** (Required): 🔑 The Dynatrace AWS OIDC connection used for authentication.\n\n- **AutomationAssumeRolearn** (Optional): 🎭 The ARN of the IAM role that allows Automation to perform actions on your behalf.\n\n---\n\n### ✅ **Requirements**\n\n⚠️ This subworkflow **only works on SSM-managed AWS EC2 instances**.\n\n📖 Refer to the AWS documentation below to ensure your EC2 instances are managed by AWS Systems Manager:  \nhttps://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-ec2.html\n\n---\n\n### 📘 **AWS SSM Documents Used**\n\nThis subworkflow requires the following **out-of-the-box AWS Systems Manager document**:\n\n- **`aws-extendebsvolume`**  \n  🔗 https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/aws-extendebsvolume.html\n\n---\n\n### 🧠 **Provided Functionality**\n\nThe **`aws-extendebsvolume`** SSM document performs the following actions:\n\n- 📸 **Create a snapshot** of the volume *(optional)*  \n- 📦 **Resize the EBS volume** at the AWS level  \n- 🧩 **Resize partitions and file systems** on the operating system (Linux or Windows)\n\n---",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ execution_id }) {\n  const configGet = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-ssm-execution-completed/result`);\n  const configBody = await configGet.json();\n  const status = configBody.AutomationExecutionStatus.toUpperCase()\n  console.log(status)\n  \n  if (status !=\"SUCCESS\") {\n        console.log(\"SSM Document Execution has Failed!\");\n        throw new Error(\"SSM Document Execution has Failed!\");\n  } \n\n  return configBody;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-ssm-execution-completed": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "wait-for-ssm-execution-completed"
        ]
      },
      "wait-for-ssm-execution-completed": {
        "name": "wait-for-ssm-execution-completed",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n\"AutomationExecutionId\":\"{{result(\"systems_manager_start_automation_execution_1\").AutomationExecutionId }}\",\n\"awsregion\": \"{{input()[\"awsregion\"] }}\",\n\"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "systems_manager_start_automation_execution_1": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "systems_manager_start_automation_execution_1"
        ]
      },
      "systems_manager_start_automation_execution_1": {
        "name": "systems_manager_start_automation_execution_1",
        "input": {
          "region": "{{ input()[\"awsregion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\n  \"VolumeId\": [\"{{ input()[\"VolumeId\"] }}\"],\n  \"SizeGib\": [\"{{ input()[\"SizeGib\"] }}\"],\n  \"MountPoint\": [\"{{ input()[\"MountPoint\"] }}\"],\n  \"DriveLetter\": [\"{{ input()[\"DriveLetter\"] }}\"],\n  \"keepSnapShot\": [\"{{ input()[\"keepSnapShot\"] }}\"], \n  \"InstanceId\": [\"{{ input()[\"InstanceId\"] }}\"],\n  \"AutomationAssumeRole\": [\"{{ input()[\"AutomationAssumeRolearn\"] }}\"]\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "DocumentName": "AWS-ExtendEbsVolume"
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Initiates execution of an Automation runbook",
        "predecessors": []
      }
    }
  },
  {
    "id": "3e5454a4-50ad-4dab-914c-638b6df5b283",
    "title": "🧩subworkflow - aws get host data of ec2 instance (gen2 aws connector)",
    "description": "Subworkflow to get data of an aws ec2 instance without needing to know dql\n\nAn easy way to get additional data of an aws host\nsuch as instance id, volume id etc. which is needed\nto for example resize an aws volume.\n\nParameters:\n\nhost_entity_id: (Required) Dynatrace Host Entity Id",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"dql-get-host-info\").records[0] }}",
    "type": "STANDARD",
    "input": {
      "host_entity_id": "HOST-EA0E775A9C448B02"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧾 **Subworkflow to Get AWS EC2 Instance Data (No DQL Required)**\n\n🔍 This subworkflow provides an **easy and DQL‑free way** to retrieve additional metadata for an AWS EC2 instance from Dynatrace.\n\n☁️ The integration leverages the **Dynatrace AWS Gen2 connector**, ensuring secure, scalable, and modern access to AWS infrastructure metadata.\n\nIt is commonly used to collect information such as:\n- 🆔 EC2 instance ID  \n- 💽 Attached volume IDs  \n- 📦 Other host-level metadata  \n\n➡️ This data is typically required for follow-up automation steps, such as **resizing AWS EBS volumes** or performing infrastructure remediation.\n\n---\n\n### ⚙️ **Parameters**\n\n- **host_entity_id** (Required): 🖥️ The Dynatrace **Host Entity ID** representing the AWS EC2 instance.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Uses the **Dynatrace AWS Gen2 connector**\n- ✅ Eliminates the need to write **DQL queries**\n- ✅ Simplifies downstream automation logic\n- ✅ Designed as a **helper / data-enrichment subworkflow**\n- ✅ Commonly paired with volume extension, remediation, or validation workflows\n\n---",
    "tasks": {
      "dql-get-host-info": {
        "name": "dql-get-host-info",
        "input": {
          "query": "fetch dt.entity.host\n| filter matchesPhrase(id, \"{{input()[\"host_entity_id\"]}}\")\n| fieldsadd  additionalSystemInfo,belongs_to,ec2_id=runs_on[dt.entity.ec2_instance], entity.name, hostname=entity.detected_name, osArchitecture, osType, cpuCores, autoInjection, bitness, cloudType, clustered_by,  ebpfHasPublicTraffic,  state\n| lookup  [fetch dt.entity.ebs_volume\n| fieldsadd arn,instanceid=belongs_to[dt.entity.ec2_instance][0],deviceName,ebsType,entity.name,awsNameTag,tags,belongs_to,boshName,creationTimestamp, lifetime, ebsSnapshotId, entity.type, iops  ] , sourceField:ec2_id, lookupField:instanceid, prefix:\"ebs_\"\n| fieldsadd volumeid=ebs_entity.name\n| lookup  [fetch dt.entity.ec2_instance\n| fieldsadd awscredentials=accessible_by[dt.entity.aws_credentials], awsInstanceId,awsInstanceType,awsNameTag, awsSecurityGroup, awsVpcName, arn, tags, id, regionName, accessible_by,amiId,balanced_by,beanstalkEnvironmentName,belongs_to,boshName,contains,publicHostName,publicIp,localIp,virtualizedDiskType,entity.name,lifetime, entity.type  ] , sourceField:ec2_id, lookupField:id, prefix:\"ec2_\"\n| lookup  [ timeseries max(dt.host.disk.used), by: { dt.entity.host }\n| fieldsAdd disksizex = arrayLast(`max(dt.host.disk.used)`)/1000000000\n| fields disksize=round(disksizex), dt.entity.host\n] , sourceField:id, lookupField:dt.entity.host, prefix:\"disk_\"\n| lookup  [ timeseries max(dt.host.disk.avail), by: { dt.entity.host }\n| fieldsAdd disksizex = arrayLast(`max(dt.host.disk.avail)`)/1000000000\n| fields disksize=round(disksizex), dt.entity.host\n] , sourceField:id, lookupField:dt.entity.host, prefix:\"disk_avail_\"\n| fieldsadd total_disk_size=disk_disksize + disk_avail_disksize, disk_used=disk_disksize, disk_available=disk_avail_disksize\n| lookup  [ fetch dt.entity.aws_credentials | fields awsAccountId, aws_connection_name=entity.name, id ] , sourceField:ec2_awscredentials[0], lookupField:id, prefix:\"conn_\"\n| fieldsremove disk_avail_disksize,disk_disksize\n| fieldsadd conn_awsAccountId, conn_aws_connection_name",
          "failOnEmptyResult": true
        },
        "action": "dynatrace.automations:execute-dql-query",
        "active": true,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Executes DQL query",
        "predecessors": []
      }
    }
  },
  {
    "id": "938bbc7f-29dd-4874-830b-cba77abcb548",
    "title": "🧩subworkflow - aws get host data of ec2 instance (gen3 aws connector)",
    "description": "",
    "ownerType": "USER",
    "isPrivate": true,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"dql-get-host-info\").records[0] }}",
    "type": "STANDARD",
    "input": {
      "host_entity_id": "HOST-EA0E775A9C448B02"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧾 **Subworkflow to Get AWS EC2 Instance Data (No DQL Required)**\n\n🔍 This subworkflow provides an **easy and DQL‑free way** to retrieve additional metadata for an AWS EC2 instance from Dynatrace.\n\n☁️ The integration leverages the **Dynatrace AWS Gen3 connector**, ensuring secure, scalable, and modern access to AWS infrastructure metadata.\n\nIt is commonly used to collect information such as:\n- 🆔 EC2 instance ID  \n- 💽 Attached volume IDs  \n- 📦 Other host-level metadata  \n\n➡️ This data is typically required for follow-up automation steps, such as **resizing AWS EBS volumes** or performing infrastructure remediation.\n\n---\n\n### ⚙️ **Parameters**\n\n- **host_entity_id** (Required): 🖥️ The Dynatrace **Host Entity ID** representing the AWS EC2 instance.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Uses the **Dynatrace AWS Gen3 connector**\n- ✅ Eliminates the need to write **DQL queries**\n- ✅ Simplifies downstream automation logic\n- ✅ Designed as a **helper / data-enrichment subworkflow**\n- ✅ Commonly paired with volume extension, remediation, or validation workflows\n\n---",
    "tasks": {
      "dql-get-host-info": {
        "name": "dql-get-host-info",
        "input": {
          "query": "fetch dt.entity.host\n| filter matchesPhrase(id, \"{{input()[\"host_entity_id\"]}}\")\n| fieldsadd  additionalSystemInfo,belongs_to,ec2_id=runs_on[dt.entity.ec2_instance], entity.name, hostname=entity.detected_name, osArchitecture, osType, cpuCores, autoInjection, bitness, cloudType, clustered_by,  ebpfHasPublicTraffic,  state\n| lookup  [fetch dt.entity.ec2_instance\n| fieldsadd awscredentials=accessible_by[dt.entity.aws_credentials], awsInstanceId,awsInstanceType,awsNameTag, awsSecurityGroup, awsVpcName, arn, tags, id, regionName, accessible_by,amiId,balanced_by,beanstalkEnvironmentName,belongs_to,boshName,contains,publicHostName,publicIp,localIp,virtualizedDiskType,entity.name,lifetime, entity.type  ] , sourceField:ec2_id, lookupField:id, prefix:\"ec2_\"\n| lookup  [smartscapeNodes \"AWS_EC2_INSTANCE\"\n| parse aws.object,\"JSON:object\"\n| fieldsadd object\n| fieldsadd configuration=object[configuration] \n| fieldsadd instanceId=configuration[instanceId]\n| filter matchesPhrase(tags[Name],\"Dynatrace-SSM-Action-Demo_554872066791\")\n| filter matchesPhrase(configuration[state][name],\"running\")\n| fieldsadd blockDeviceMappings=configuration[blockDeviceMappings]\n| expand blockDeviceMappings\n| fieldsadd deviceName=blockDeviceMappings[deviceName], volumeid=blockDeviceMappings[ebs][volumeId], deleteOnTermination=blockDeviceMappings[ebs][deleteOnTermination] ] , sourceField:ec2_awsInstanceId, lookupField:instanceId, prefix:\"ebs_\"\n| fieldsadd volumeid=ebs_volumeid\n| lookup  [ timeseries max(dt.host.disk.used), by: { dt.entity.host, dt.entity.disk }\n| fieldsAdd disksizex = arrayLast(`max(dt.host.disk.used)`)/1000000000\n| fieldsadd disksize=round(disksizex), dt.entity.host, diskid=dt.entity.disk\n] , sourceField:id, lookupField:dt.entity.host, prefix:\"disk_\"\n| fieldsadd ebs_id=disk_diskid\n| lookup  [ timeseries max(dt.host.disk.avail), by: { dt.entity.host }\n| fieldsAdd disksizex = arrayLast(`max(dt.host.disk.avail)`)/1000000000\n| fields disksize=round(disksizex), dt.entity.host\n] , sourceField:id, lookupField:dt.entity.host, prefix:\"disk_avail_\"\n| fieldsadd total_disk_size=disk_disksize + disk_avail_disksize, disk_used=disk_disksize, disk_available=disk_avail_disksize\n| fieldsremove disk_avail_disksize,disk_disksize",
          "failOnEmptyResult": true
        },
        "action": "dynatrace.automations:execute-dql-query",
        "active": true,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Executes DQL query",
        "predecessors": []
      }
    }
  },
  {
    "id": "29bee926-17e3-4dfc-a529-b79f1c45a2e3",
    "title": "🧩subworkflow - aws get lambda data (gen 2 aws connector)",
    "description": "Subworkflow to get data of an aws lambda function without needing to know dql.\n\nAn easy way to get additional data of an aws lambda function\nsuch as region, arn, tags, lifetime, runtime, timeout etc.\nwhich is needed to for example to failover the lambda to a different region.\n\nParameters:\n\nlambda_entity_id: (Required) Dynatrace Lambda Entity Id",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"dql-get-lambda-info\").records[0] }}",
    "type": "STANDARD",
    "input": {
      "lambda_entity_id": "AWS_LAMBDA_FUNCTION-4A933904BF768A57"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧩 **Subworkflow to Get AWS Lambda Function Data (No DQL Required)**\n\n🔍 This subworkflow provides an **easy and DQL‑free way** to retrieve additional metadata for an **AWS Lambda function** from Dynatrace.\n\n☁️ The integration uses the **Dynatrace AWS Gen2 connector**, enabling secure, scalable, and modern access to AWS Lambda metadata without requiring direct AWS API calls or custom queries.\n\nIt is commonly used to collect information such as:\n- 🌍 AWS region  \n- 🧾 Lambda ARN  \n- 🏷️ Tags  \n- ⏱️ Function timeout  \n- 🧠 Runtime  \n- 📆 Lifetime and configuration metadata  \n\n➡️ This data is typically required for downstream automation use cases, such as **failing over a Lambda function to a different AWS region**, validating configuration, or driving remediation workflows.\n\n---\n\n### ⚙️ **Parameters**\n\n- **lambda_entity_id** (Required): 🧬 The Dynatrace **Lambda Entity ID** representing the AWS Lambda function.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Uses the **Dynatrace AWS Gen2 connector**\n- ✅ Eliminates the need to write **DQL queries**\n- ✅ Simplifies Lambda-aware automation and decision logic\n- ✅ Designed as a **helper / data‑enrichment subworkflow**\n- ✅ Commonly used for failover, validation, and configuration‑driven automation\n\n---",
    "tasks": {
      "dql-get-lambda-info": {
        "name": "dql-get-lambda-info",
        "input": {
          "query": "fetch dt.entity.aws_lambda_function, from: now()-10h\n| fieldsadd accessible_by, apiEndpointUrls, arn, awsCodeSize, awsMemorySize, awsNameTag, awsRuntime, awsTimeout, awsVersion, entity.type, lifetime, tags\n| filter id == \"{{input()[\"lambda_entity_id\"] }}\"\n|  lookup[ fetch dt.entity.aws_availability_zone| fields awsregion=entity.name, id ] , sourceField:belongs_to[dt.entity.aws_availability_zone], lookupField:id, prefix: \"lambda_data_\"\n",
          "failOnEmptyResult": true
        },
        "action": "dynatrace.automations:execute-dql-query",
        "active": true,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Executes DQL query",
        "predecessors": []
      }
    }
  },
  {
    "id": "47448866-dd9d-415c-90c7-51c74798cc79",
    "title": "🧩subworkflow - aws get process data of process running on ec2 instance",
    "description": "Subworkflow to get data of a process running on an aws ec2 instance without needing to know DQL or Javascript\n\nAn easy way to get additional data of a process running on an aws ec2 instance\nsuch as process name, ec2 region, ec2 instance id, ec2 volume id, tags etc.\nwhich is needed to for example to remediate a problem created by a process\nrunning on an ec2 instance.\n\nParameters:\n\nprocess_group_instance_id:  (Required) the dynatrace process group instance id",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"dql-get-process-info\").records[0] }}",
    "type": "STANDARD",
    "input": {
      "process_group_instance_id": "PROCESS_GROUP_INSTANCE-B70759A89E81BB09"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧬 **Subworkflow to Get Data of a Process Running on an AWS EC2 Instance (No DQL or JavaScript Required)**\n\n🔍 This subworkflow provides an **easy, DQL‑free and JavaScript‑free way** to retrieve detailed information about a **process running on an AWS EC2 instance** from Dynatrace.\n\n☁️ The integration leverages the **Dynatrace AWS Gen3 connector**, ensuring secure, scalable, and modern access to AWS and process-level metadata.\n\nIt is commonly used to collect information such as:\n- 🧾 Process name  \n- 🌍 AWS region  \n- 🆔 EC2 instance ID  \n- 💽 Associated volume IDs  \n- 🏷️ Tags and related metadata  \n\n➡️ This data is typically required for **process-driven remediation**, root cause analysis, or automation workflows that respond to problems caused by processes running on EC2 instances.\n\n---\n\n### ⚙️ **Parameters**\n\n- **process_group_instance_id** (Required): 🧬 The Dynatrace **Process Group Instance ID** representing the running process.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Uses the **Dynatrace AWS Gen3 connector**\n- ✅ Eliminates the need to write **DQL or JavaScript**\n- ✅ Enables process-aware automation and remediation\n- ✅ Designed as a **helper / data-enrichment subworkflow**\n- ✅ Commonly paired with process remediation, validation, or escalation workflows\n\n---",
    "tasks": {
      "dql-get-process-info": {
        "name": "dql-get-process-info",
        "input": {
          "query": "fetch dt.entity.process_group_instance, from:now()-120h\n| filter matchesphrase(id,\"{{input()[\"process_group_instance_id\"] }}\")\n| fieldsadd process_group_id=instance_of[dt.entity.process_group],host.id=belongs_to[dt.entity.host],  bitness, ebpfHasPublicTraffic, processType,metadata, entity.type, tags, lifetime, softwareTechnologies //process_called_by=called_by, calls\n| lookup[fetch dt.entity.host |fieldsadd  additionalSystemInfo,belongs_to,ec2_id=runs_on[dt.entity.ec2_instance], entity.name, hostname=entity.detected_name],sourceField:host.id, lookupField:id, prefix:\"hostdata_\"\n| lookup  [fetch dt.entity.ebs_volume\n| fieldsadd arn,instanceid=belongs_to[dt.entity.ec2_instance][0],deviceName,ebsType,entity.name,awsNameTag,tags,belongs_to,boshName,creationTimestamp, lifetime, ebsSnapshotId, entity.type ] , sourceField:hostdata_ec2_id, lookupField:instanceid, prefix:\"ebs_\"\n| fieldsadd volumeid=ebs_entity.name\n| lookup  [fetch dt.entity.ec2_instance\n| fieldsadd awsInstanceId,awsInstanceType,awsNameTag, awsSecurityGroup, awsVpcName, arn, tags, id, regionName, accessible_by,amiId,balanced_by,beanstalkEnvironmentName,belongs_to,boshName,contains,publicHostName,publicIp,localIp,virtualizedDiskType,entity.name,lifetime, entity.type  ] , sourceField:hostdata_ec2_id, lookupField:id, prefix:\"ec2_\"\n| lookup  [ timeseries max(dt.host.disk.used), by: { dt.entity.host }\n| fieldsAdd disksizex = arrayLast(`max(dt.host.disk.used)`)/1000000000\n| fields disksize=round(disksizex), dt.entity.host\n] , sourceField:id, lookupField:dt.entity.host, prefix:\"disk_\"",
          "failOnEmptyResult": true
        },
        "action": "dynatrace.automations:execute-dql-query",
        "active": true,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Executes DQL query",
        "predecessors": []
      }
    }
  },
  {
    "id": "b9de7879-6723-43a0-92ca-5bae8294da4b",
    "title": "🧩subworkflow - aws reboot ec2 instances",
    "description": "Subworkflow to reboot an EC2 Instance\n\nThis subworkflow provides an easy way to trigger\nthe reboot of an EC2 Instance and wait unitl the instance is back up\n\nParameters:\n\ninstanceIds: (Required) instance id to reboot\nawsRegion: (Required) region in which you want to reboot the ec2 instance\ndynatraceawsconnection: (Required) the connection name of the Dynatrace OIDC Connection",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"ec2_wait_for_state_1\") }}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceIds": "i-0565781a37710692f",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🔄 **Subworkflow to Reboot an AWS EC2 Instance**\n\n♻️ This subworkflow provides a simple and reliable way to **reboot an AWS EC2 instance** and **wait until the instance is back online** before continuing.\n\nIt is commonly used as a remediation or recovery step in automation workflows where a controlled restart is required.\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceIds** (Required): 🆔 The EC2 instance ID to reboot.  \n- **awsRegion** (Required): 🌍 The AWS region in which the EC2 instance resides.  \n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow triggers the EC2 reboot operation and **waits until the instance is fully back up and reachable**.  \n❌ If the reboot operation fails, the subworkflow will fail to allow **restart-on-error** handling in the parent workflow.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Commonly used for **self-healing and remediation workflows**\n- ✅ Ensures downstream steps only execute once the instance is available again\n- ✅ Suitable for automation triggered by problems, events, or maintenance workflows\n- ✅ Integrates securely using the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "ec2_wait_for_state_1": {
        "name": "ec2_wait_for_state_1",
        "input": {
          "region": "{{ input()[\"awsRegion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceIds\"]}}",
          "InstanceState": "running"
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-wait-state",
        "timeout": 9000,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "ec2_reboot_instances_1": "OK"
          }
        },
        "description": "Wait for EC2 instances in a specific region to be in a specific state",
        "waitBefore": 30,
        "predecessors": [
          "ec2_reboot_instances_1"
        ]
      },
      "ec2_reboot_instances_1": {
        "name": "ec2_reboot_instances_1",
        "input": {
          "region": "{{ input()[\"awsRegion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceIds\"]}}"
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-reboot-instances",
        "timeout": 9000,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Requests a reboot of the specified instances",
        "predecessors": []
      }
    }
  },
  {
    "id": "4286e7d3-18f9-4fce-8920-722bef0883b7",
    "title": "🧩subworkflow - aws ec2 resize instance type",
    "description": "Subworkflow to resize an EC2 instance by stopping it, changing the instance type, then starting it and verifying it returns to running state.\n\nParameters:\n\ninstanceId: (Required) EC2 instance ID to resize\nnewInstanceType: (Required) Target instance type (e.g. t3.large)\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": true,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{ result(\"ec2_wait_running\") }}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceId": "i-09571811d6a7cdd74",
      "newInstanceType": "t2.large",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 📐 **Subworkflow to Resize an AWS EC2 Instance Type**\n\n📐 This subworkflow provides a controlled way to **resize an AWS EC2 instance** by stopping it, changing the instance type, starting it again, and verifying it returns to **`running`** state.\n\nIt is commonly used for right-sizing, performance tuning, and cost optimization workflows when compute capacity must be adjusted safely.\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceId** (Required): 🆔 EC2 instance ID to resize.  \n- **newInstanceType** (Required): 🏷️ Target EC2 instance type (for example: `t3.large`, `m5.xlarge`).  \n- **awsRegion** (Required): 🌍 AWS region in which the EC2 instance resides.  \n- **dynatraceawsconnection** (Required): 🔑 Name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow follows a safe sequence: **stop instance -> wait for `stopped` -> modify instance type -> start instance -> wait for `running`**.  \n❌ If any step in the sequence fails, the subworkflow fails so parent workflows can apply restart-on-error or alternate handling logic.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Useful for **automated right-sizing based on CPU/memory saturation signals**\n- ✅ Useful for **planned performance upgrades or temporary scaling actions**\n- ✅ Ensures downstream tasks execute only after the resized instance is healthy again\n- ✅ Integrates securely through the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "ec2_stop": {
        "name": "ec2_stop",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceId\"]}}"
        },
        "retry": {
          "count": 3,
          "delay": 15,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-stop-instances",
        "active": true,
        "timeout": 60,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Stop the instance before resizing.",
        "predecessors": []
      },
      "ec2_start": {
        "name": "ec2_start",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceId\"]}}"
        },
        "retry": {
          "count": 3,
          "delay": 15,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-start-instances",
        "timeout": 60,
        "position": {
          "x": 0,
          "y": 4
        },
        "conditions": {
          "states": {
            "ec2_modify_type": "OK"
          }
        },
        "description": "Start the resized instance.",
        "predecessors": [
          "ec2_modify_type"
        ]
      },
      "ec2_modify_type": {
        "name": "ec2_modify_type",
        "input": {
          "Value": "{{ input()[\"newInstanceType\"] }}",
          "DryRun": false,
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Attribute": "instanceType",
          "InstanceId": "{{ input()[\"instanceId\"] }}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}"
        },
        "retry": {
          "count": 3,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-modify-instance-attribute",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "ec2_wait_stopped": "OK"
          }
        },
        "description": "Modifies the specified attribute of the specified instance.",
        "predecessors": [
          "ec2_wait_stopped"
        ]
      },
      "ec2_wait_running": {
        "name": "ec2_wait_running",
        "input": {
          "region": "{{ input()[\"awsRegion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{ input()[\"instanceId\"] }}",
          "InstanceState": "running"
        },
        "retry": {
          "count": 10,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-wait-state",
        "timeout": 600,
        "position": {
          "x": 0,
          "y": 5
        },
        "conditions": {
          "states": {
            "ec2_start": "OK"
          }
        },
        "description": "Wait until the resized instance is running.",
        "waitBefore": 15,
        "predecessors": [
          "ec2_start"
        ]
      },
      "ec2_wait_stopped": {
        "name": "ec2_wait_stopped",
        "input": {
          "region": "{{ input()[\"awsRegion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{ input()[\"instanceId\"] }}",
          "InstanceState": "stopped"
        },
        "retry": {
          "count": 10,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-wait-state",
        "active": true,
        "timeout": 600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "ec2_stop": "OK"
          }
        },
        "description": "Wait until the instance is fully stopped.",
        "waitBefore": 10,
        "predecessors": [
          "ec2_stop"
        ]
      }
    }
  },
  {
    "id": "57fa7bc0-b0ee-406d-b231-b16fe35e4c79",
    "title": "🧩subworkflow - aws run command on ec2 instance",
    "description": "Subworkflow to run a command running on an ec2 instance\n\nThis subworkflow provides an easy way to trigger\nthe execution of a command on a aws ec2 instance\nwithout needing to know how aws ssm works.\n\nThis subworkflow uses the out of the box AWS-RunShellScript\nSSM document to run scripts on ec2 instances.\nWaits until the command execution has finished and\nchecks if the execution was succesful and fails\nif it wasnt so the parent workflow is able to\nrestart the subworkflow on error.\n\nIn order for this subworkflow to execute successfully the ec2 instance must be a systems manager managed instance:\nhttps://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-ec2.html\n\nParameters \n\ncommands: (Required) command to run on the ec2 instance\nawsregion: (Required) region in which the ec2 instance to run the command on resides\ninstanceid: (Required) instance id on which the command will run\nexecutionTimeout: (Required) execution timeout of the command\nworkingDirectory: (Required) working directory of the command\ndynatraceawsconnection: (Required) dynatrace aws connection\n\nThis subworkflow Needs subworkflow \"subworkflow - aws wait for send command execution\"\n\nThis subworkflow uses the out of the box AWS SSM document AWS-RunShellScript\nhttps://us-east-1.console.aws.amazon.com/systems-manager/documents/AWS-RunShellScript/description?region=us-east-1",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-result\") }}",
    "type": "STANDARD",
    "input": {
      "commands": [
        "echo test",
        "sleep 100"
      ],
      "awsregion": "us-east-1",
      "instanceid": "i-0e831c54dc3f2f0c7",
      "executionTimeout": "3600",
      "workingDirectory": "/home/ubuntu",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## ▶️ **Subworkflow to Run a Command on an AWS EC2 Instance**\n\n🖥️ This subworkflow provides an **easy and abstracted way** to execute a command on an **AWS EC2 instance** without requiring any knowledge of how AWS Systems Manager (SSM) works.\n\nIt triggers the execution of a command via AWS SSM, **waits until the command execution has completed**, and **validates whether the execution was successful**.  \n❌ If the execution fails, the subworkflow will fail so the **parent workflow can restart on error**.\n\n---\n\n### ✅ **Requirements**\n\n⚠️ In order for this subworkflow to execute successfully, the EC2 instance **must be a Systems Manager (SSM) managed instance**.\n\n📖 AWS documentation:  \nhttps://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-ec2.html\n\n---\n\n### ⚙️ **Parameters**\n\n- **commands** (Required): 🧾 The command or script to run on the EC2 instance.  \n- **awsregion** (Required): 🌍 The AWS region where the EC2 instance resides.  \n- **instanceid** (Required): 🆔 The EC2 instance ID on which the command will run.  \n- **executionTimeout** (Required): ⏱️ The execution timeout for the command.  \n- **workingDirectory** (Required): 📂 The working directory in which the command is executed.  \n- **dynatraceawsconnection** (Required): 🔑 The Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### 📘 **AWS SSM Document Used**\n\nThis subworkflow uses the out-of-the-box AWS Systems Manager document:\n\n🔗 https://us-east-1.console.aws.amazon.com/systems-manager/documents/AWS-RunShellScript/description?region=us-east-1\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 📤 The subworkflow sends the command to the AWS SSM document **`AWS-RunShellScript`**\n- ⏳ It waits for the command execution to complete\n- ✅ The execution result is checked for success\n- ❌ If execution fails, the subworkflow fails to allow **restart-on-error** handling in the parent workflow\n\n---\n\nThis subworkflow Needs subworkflow  \n🧩[subworkflow - aws wait for run command execution](/ui/apps/dynatrace.automations/workflows/97218693-adf0-4c82-a295-e43d848b0b4d)\n\n---",
    "tasks": {
      "wait-for-result": {
        "name": "wait-for-result",
        "input": {
          "workflowId": "97218693-adf0-4c82-a295-e43d848b0b4d",
          "workflowInput": "{\n  \"CommandId\":\"{{result(\"systems_manager_send_command_1\")[\"Command\"].CommandId }}\",\n  \"awsregion\":\"{{input()[\"awsregion\"] }}\",\n  \"awsinstanceid\":\"{{input()[\"instanceid\"] }}\",\n  \"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "systems_manager_send_command_1": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "systems_manager_send_command_1"
        ]
      },
      "systems_manager_send_command_1": {
        "name": "systems_manager_send_command_1",
        "input": {
          "region": "{{ input()[\"awsregion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\n  \"commands\": {{ input()[\"commands\"] | replace(\"'\",'\"') }}\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{ input()[\"instanceid\"] }}",
          "DocumentName": "AWS-RunShellScript"
        },
        "retry": {
          "count": 5,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-send-command",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Runs commands on one or more managed nodes",
        "predecessors": []
      }
    }
  },
  {
    "id": "d04dac24-ddf0-4405-a91d-674d90cabd27",
    "title": "🧩subworkflow - aws s3 block public access for bucket",
    "description": "Subworkflow to Block Public Access to an S3 Bucket\n\nParameters:\n\nawsregion: (Required) region in which the security group resides\ndynatraceawsconnection: (Required) the connection name of the Dynatrace OIDC Connection\nBucketName: (Required) The bucket name (not the ARN)\nRestrictPublicBuckets: (Optional) Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to TRUE restricts access to this bucket to only AWS services and authorized users within this account if the bucket has a public policy\nBlockPublicAcls: (Optional) Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket\nIgnorePublicAcls: (Optional) Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to TRUE causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket\nBlockPublicPolicy: (Optional) Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to TRUE causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access\nAutomationAssumeRole: (Required) The ARN of the role that allows Automation to perform the actions on your behalf\nStabilizationPeriod: (Optional) Specifies a duration to wait for remediation stabilization in seconds. Must be between 1 and 604799",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-ssm-execution-completed\") }}",
    "type": "STANDARD",
    "input": {
      "awsregion": "us-east-1",
      "BucketName": "",
      "BlockPublicAcls": "true",
      "IgnorePublicAcls": "true",
      "BlockPublicPolicy": "true",
      "RestrictPublicBuckets": "true",
      "dynatraceawsconnection": "awssandbox"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🛡️ **Subworkflow to Block Public Access to an Amazon S3 Bucket**\n\n🔒 This subworkflow provides a simple and standardized way to **block public access to an Amazon S3 bucket** by configuring S3 public access block settings.\n\nIt is commonly used as part of **security remediation workflows** to prevent unintended public exposure of S3 buckets.\n\n---\n\n### ⚙️ **Parameters**\n\n- **awsregion** (Required): 🌍 The AWS region where the S3 bucket resides.  \n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace AWS OIDC connection used to authenticate with AWS.  \n- **BucketName** (Required): 🪣 The name of the S3 bucket *(not the ARN)*.\n\n- **RestrictPublicBuckets** (Optional): 🚫  \n  Specifies whether Amazon S3 should restrict public bucket policies.  \n  When set to `true`, access is limited to AWS services and authorized users within the same account if the bucket has a public policy.\n\n- **BlockPublicAcls** (Optional): 📵  \n  Specifies whether Amazon S3 should block public access control lists (ACLs) for the bucket and its objects.\n\n- **IgnorePublicAcls** (Optional): 🙈  \n  Specifies whether Amazon S3 should ignore all public ACLs on the bucket and its objects.  \n  When set to `true`, any existing public ACLs are ignored.\n\n- **BlockPublicPolicy** (Optional): 🧱  \n  Specifies whether Amazon S3 should block public bucket policies.  \n  When set to `true`, Amazon S3 rejects calls to `PUT Bucket policy` if the policy allows public access.\n\n- **AutomationAssumeRole** (Required): 🎭  \n  The ARN of the IAM role that allows Automation to perform actions on your behalf.\n\n- **StabilizationPeriod** (Optional): ⏱️  \n  The duration (in seconds) to wait for remediation stabilization.  \n  Must be between **1** and **604,799** seconds.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 🔍 The subworkflow evaluates the current public access configuration of the specified S3 bucket\n- 🛡️ Public access settings are applied based on the provided parameters\n- ✅ If successful, the bucket is protected against unintended public exposure\n- ❌ If execution fails, the subworkflow fails to allow **restart-on-error** handling in the parent workflow\n\n---",
    "tasks": {
      "s3_put_public_access_block_1": {
        "name": "s3_put_public_access_block_1",
        "input": {
          "Bucket": "{{ input()[\"BucketName\"] }}",
          "region": "{{ input()[\"awsregion\"]}}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.aws.connection', awsconnection) }}",
          "PublicAccessBlockConfiguration": "{ \n  \"RestrictPublicBuckets\": [\"{{ input()[\"RestrictPublicBuckets\"] | lower }}\"],\n  \"BlockPublicAcls\": [\"{{ input()[\"BlockPublicAcls\"] | lower }}\"],\n  \"IgnorePublicAcls\": [\"{{ input()[\"IgnorePublicAcls\"] | lower }}\"],\n  \"BlockPublicPolicy\": [\"{{ input()[\"BlockPublicPolicy\"] | lower }}\"]\n}"
        },
        "action": "dynatrace.aws.connector:s3-put-public-access-block",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "This operation is not supported for directory buckets.",
        "predecessors": []
      }
    }
  },
  {
    "id": "8bf7b3a8-7dad-4dfd-add4-12f94b5fa669",
    "title": "🧩subworkflow - aws scan for security groups with ports open to 0.0.0.0/0",
    "description": "This subworkflow scans for security groups Ingress entry defenitions with ports open to 0.0.0.0/0 (the entire internet) and raised a custom Alert!\nAs AWS Security Hub only scans every 12 - 24 hours, this subworkflow is an alternative way to catch these issues in a more frequent interval\n\nParameters:\ndynatraceawsconnection: (Required) the connection name of the Dynatrace OIDC Connection\nregions_to_search: (Reguired) Aws region to scan for security groups Ingress entry defenitions with ports open to 0.0.0.0/0",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"loop_though_result\") }}",
    "type": "STANDARD",
    "input": {
      "regions_to_search": [
        "us-east-1",
        "us-east-2",
        "us-west-1",
        "us-west-2",
        "ap-south-1",
        "ap-southeast-1",
        "ap-southeast-2",
        "ap-northeast-1",
        "ca-central-1",
        "eu-central-1",
        "eu-west-1",
        "eu-west-2",
        "eu-west-3"
      ],
      "dynatraceawsconnection": "awssandbox"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🔍 **Subworkflow to Scan for Publicly Exposed AWS Security Group Ingress Rules**\n\n🚨 This subworkflow scans AWS security groups for **ingress rule definitions with ports open to `0.0.0.0/0`**, exposing them to **the entire internet**, and **raises a custom Dynatrace alert** when such configurations are detected.\n\n---\n\n### ⏱️ **Why This Matters**\n\nAWS Security Hub typically scans for these misconfigurations only every **12–24 hours**.  \n⚡ This subworkflow provides a **more frequent and proactive alternative**, allowing you to detect and respond to insecure security group configurations much faster.\n\n---\n\n### ⚙️ **Parameters**\n\n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace OIDC connection used to authenticate with AWS.  \n- **regions_to_search** (Required): 🌍 One or more AWS regions to scan for security groups with ingress rules open to `0.0.0.0/0`.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 🔍 The subworkflow scans security groups across the specified AWS regions\n- 🚫 Ingress rules allowing access from `0.0.0.0/0` are identified\n- 🚨 A **custom Dynatrace alert** is raised when insecure configurations are detected\n- ✅ Enables downstream workflows to remediate or notify based on the alert\n\n---",
    "tasks": {
      "loop_though_result": {
        "name": "loop_though_result",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from \"@dynatrace-sdk/automation-utils\";\nimport { queryExecutionClient } from \"@dynatrace-sdk/client-query\";\n\nexport default async function () {\n  // loop through result of ec2_describe_security_groups_1'\n  const ex = await execution();\n  const result = await ex.result(\"ec2_describe_security_groups_1\");\n  const noncompliant_sg = [];\n  const dt_regions = [];\n  for (let results of result) {\n    for (let sg of results.SecurityGroups) {\n      console.log(\"Security Group Name: \" + sg.GroupName);\n      console.log(\"Security Group id: \" + sg.GroupId);\n      let endstring: number = sg.SecurityGroupArn.indexOf(\":\", 13);\n      let region = sg.SecurityGroupArn.substring(12, endstring);\n      sg[\"region\"] = region;\n\n      const res = await queryExecutionClient.queryExecute({\n        body: {\n          query:\n            'fetch dt.entity.aws_availability_zone | filter matchesPhrase(entity.name, \"' +\n            region +\n            '*\") |  fields id',\n          requestTimeoutMilliseconds: 45 * 1000,\n        },\n      });\n      for (let ids of res.result.records) {\n        console.log(ids.id);\n        dt_regions.push(ids.id);\n \n      }\n\n      const uniqueArray = [...new Set(dt_regions)];\n      \n      sg[\"dt_region_ids\"] = uniqueArray;\n      for (let ingress_permission of sg.IpPermissions) {\n        //console.log(ingress_permission.IpRanges)\n        for (let range of ingress_permission.IpRanges) {\n          //check if ip is open to the internet \"0.0.0.0/0\"\n          console.log(\"Ip Range: \" + range.CidrIp);\n          if (range.CidrIp == \"0.0.0.0/0\")\n            //sg.push(\"region\": \"\"+region+\"\")\n            noncompliant_sg.push(sg);\n        }\n      }\n    }\n  }\n\n  return noncompliant_sg;\n}\n"
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "timeout": 9999,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "ec2_describe_security_groups_1": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "ec2_describe_security_groups_1"
        ]
      },
      "ec2_describe_security_groups_1": {
        "name": "ec2_describe_security_groups_1",
        "input": {
          "region": "{{ _.item }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}"
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ec2-describe-security-groups",
        "active": true,
        "timeout": 9999,
        "position": {
          "x": 0,
          "y": 1
        },
        "withItems": "item in {{ input()[\"regions_to_search\"] }}",
        "concurrency": 1,
        "description": "Describes the specified security groups or all of your security groups",
        "predecessors": []
      }
    }
  },
  {
    "id": "253c72c9-38c1-436c-a27e-f015074b8e0f",
    "title": "🧩subworkflow - aws ssm clear disk space on linux ec2",
    "description": "Subworkflow to free disk space on a Linux EC2 instance by clearing old logs and temp files via SSM Run Command.\n\nParameters:\n\ninstanceId: (Required) EC2 instance ID\nlogRetentionDays: (Optional) Number of days to retain logs (default: 7)\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{result(\"wait-for-run-command-finish\")}}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceId": "i-0bf88cff011236fde",
      "logRetentionDays": "7",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧯 **Subworkflow to Clear Disk Space on Linux EC2 Instances**\n\n🧯 This subworkflow provides a simple way to **free up disk space on Linux EC2 instances** by removing old log files, temporary files, and journal entries based on a configurable retention period.\n\nIt is commonly used in response to disk saturation alerts or as part of automated maintenance workflows to reclaim storage capacity without manual intervention.\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceId** (Required): 🆔 EC2 instance ID to run cleanup on.  \n- **logRetentionDays** (Optional): 📅 Number of days to retain logs (default: 7). Logs and temp files older than this are deleted.  \n- **awsRegion** (Required): 🌍 AWS region where the EC2 instance resides.  \n- **dynatraceawsconnection** (Required): 🔑 Name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow executes an SSM Run Command that removes logs and temp files older than the retention period, then clears systemd journal.  \n❌ If the command execution fails, the subworkflow fails so parent workflows can handle the error and retry if needed.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Useful for **automated response to disk saturation alerts**\n- ✅ Useful for **scheduled maintenance workflows** to reclaim storage\n- ✅ Removes old logs (**/var/log**, **/tmp**, systemd journal) based on retention policy\n- ✅ Integrates securely through the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "send_command": {
        "name": "send_command",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\"commands\": [\"DAYS={{ input()[\"logRetentionDays\"] }}\", \"echo \\\"Clearing files older than $DAYS days...\\\"\", \"find /var/log -type f -name '*.log' -mtime +$DAYS -delete 2>/dev/null || true\", \"find /tmp -type f -mtime +$DAYS -delete 2>/dev/null || true\", \"journalctl --vacuum-time=${DAYS}d 2>/dev/null || true\", \"df -h / && echo 'Disk cleanup complete'\"]}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceId\"]}}",
          "DocumentName": "AWS-RunShellScript"
        },
        "retry": {
          "count": 3,
          "delay": 15,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-send-command",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Send SSM Run Command: AWS-RunShellScript.",
        "predecessors": []
      },
      "wait-for-run-command-finish": {
        "name": "wait-for-run-command-finish",
        "input": {
          "workflowId": "97218693-adf0-4c82-a295-e43d848b0b4d",
          "workflowInput": "{\n  \"CommandId\":\"{{result(\"send_command\")[\"Command\"].CommandId }}\",\n  \"awsregion\":\"{{input()[\"awsRegion\"] }}\",\n  \"awsinstanceid\":\"{{input()[\"instanceId\"] }}\",\n  \"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "send_command": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "send_command"
        ]
      }
    }
  },
  {
    "id": "6fe84906-9eb2-4b36-afea-0c3405ca3dc7",
    "title": "🧩subworkflow - aws ssm delete ami image",
    "description": "Subworkflow to delete AMI images and snapshots\\n\\nParameters:\\n\\nimageid: (Required) AMI ID to delete\\nimageids: (Optional) Additional AMI IDs (comma-separated)\\nsnapshotids: (Optional) Associated snapshot IDs to delete (comma-separated)\\nawsregion: (Required) AWS region\\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{ result(\"check-status\") }}",
    "type": "STANDARD",
    "input": {
      "imageId": "ami-03c8ebfbe5f050512",
      "imageIds": "",
      "awsregion": "us-east-1",
      "snapshotIds": "",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🗑️ **Subworkflow to Delete AMI Image**\n\n⚠️ This subworkflow **deletes AMI images and associated snapshots** via **AWS-DeleteImage** SSM automation.\n\n**WARNING: This action removes AMI images from your account. Ensure they are no longer needed before deletion.**\n\nUseful for cleaning up old AMI versions, managing image inventory, and reducing storage costs.\n\n---\n\n### ⚙️ **Parameters**\n\n- **imageId** (Required): 🆔 Primary AMI ID to delete.  \n- **imageIds** (Optional): 🆔 Additional AMI IDs (comma-separated).  \n- **snapshotIds** (Optional): 📸 Associated snapshot IDs to delete (comma-separated).  \n- **awsregion** (Required): 🌍 The AWS region.  \n- **dynatraceawsconnection** (Required): 🔑 The Dynatrace AWS OIDC connection.\n\n---\n\n### 📘 **AWS SSM Document**\n\n**Document Name**: `AWS-DeleteImage`\n\n🔗 https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-aws-deleteimage.html\n\n**What this runbook does:**\n- Deregisters AMI images from your account\n- Deletes associated EBS snapshots\n- Removes both public and private AMIs\n- Prevents accidental reuse of old images\n- Frees up storage space and reduces costs\n- Cleans up image inventory\n\n---\n\n### 🔄 **Workflow Logic**\n\n1. **Start Automation**: Triggers AWS-DeleteImage SSM document with image IDs and snapshot IDs\n2. **Wait for Completion**: Polls the SSM automation status until complete (99 retries, 60s intervals)\n3. **Check Status**: Validates the image deletion succeeded via JavaScript verification\n\n---\n\n### 💡 **Use Cases**\n\n- 🧹 **Cleanup**: Remove outdated AMI versions\n- 📊 **Inventory Management**: Clean up unused images\n- 💰 **Cost Reduction**: Remove associated EBS snapshots to reduce storage costs\n- 🔒 **Security**: Delete images no longer needed for security compliance\n- 🔄 **Image Rotation**: Manage AMI lifecycle and retention\n- 📈 **Space Management**: Reclaim storage from old images\n\n---\n\n### 🔗 Dependencies\n\nThis subworkflow depends on the following subworkflow:\n\n[🧩 subworkflow - aws wait for systems manager document execution](/ui/apps/dynatrace.automations/workflows/20661ec0-29d5-471f-9973-29679d5fe908)",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "export default async function ({ execution_id }) {\n  const r = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-completion/result`).then(d => d.json());\n  if (r.AutomationExecutionStatus !== \"Success\") throw new Error(\"AMI image deletion failed!\");\n  return r;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "timeout": 30,
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-completion": "OK"
          }
        },
        "description": "fail subworkflow if runbook execution was not successful",
        "predecessors": [
          "wait-for-completion"
        ]
      },
      "start-automation": {
        "name": "start-automation",
        "input": {
          "region": "{{ input()[\"awsregion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\n  \"ImageId\": [\"{{ input()[\"imageId\"] }}\"]\n}",
          "connection": "{% set aws = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', aws) }}",
          "DocumentName": "AWS-DeleteImage"
        },
        "retry": {
          "count": 5,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "run AWS-DeleteImage SSM runbook",
        "predecessors": []
      },
      "wait-for-completion": {
        "name": "wait-for-completion",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n  \"AutomationExecutionId\": \"{{ result(\"start-automation\").AutomationExecutionId }}\",\n  \"awsregion\": \"{{ input()[\"awsregion\"] }}\",\n  \"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "start-automation": "OK"
          }
        },
        "description": "wait for SSM Runbook completion",
        "predecessors": [
          "start-automation"
        ]
      }
    }
  },
  {
    "id": "53373c2f-3dd5-4d9d-86e4-5c998a15f30d",
    "title": "🧩subworkflow - aws ssm restart linux systemd service on ec2",
    "description": "Subworkflow to restart a systemd service on a Linux EC2 instance via SSM Run Command and verify it is active.\n\nParameters:\n\ninstanceId: (Required) EC2 instance ID\nserviceName: (Required) systemd service name (e.g. nginx, httpd, tomcat)\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{result(\"wait-for-send-command-finish\")}}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceId": "i-0bf88cff011236fde",
      "serviceName": "ssh",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🔄 **Subworkflow to Restart a Linux Systemd Service on EC2**\n\n🔄 This subworkflow provides a simple way to **restart a systemd service on a Linux EC2 instance** via SSM Run Command and **verify the service reaches `active` state** after restart.\n\nIt is commonly used for service recovery, troubleshooting crashed services, or applying configuration changes that require service restart (nginx, httpd, tomcat, etc.).\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceId** (Required): 🆔 EC2 instance ID where the service runs.  \n- **serviceName** (Required): 📋 systemd service name to restart (e.g., `nginx`, `httpd`, `tomcat`, `ssh`, `mysql`).  \n- **awsRegion** (Required): 🌍 AWS region where the EC2 instance resides.  \n- **dynatraceawsconnection** (Required): 🔑 Name of the Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow restarts the specified service and verifies it reaches **`active`** state.  \n❌ If the service fails to start or reach active state, the subworkflow fails so parent workflows can handle the error and retry if needed.\n\n---\n\n### 🧠 **Usage Context**\n\n- ✅ Useful for **service recovery workflows** triggered by service availability alerts\n- ✅ Useful for **configuration management** when services must be restarted\n- ✅ Ensures service health by verifying active state after restart\n- ✅ Integrates securely through the **Dynatrace AWS OIDC connection**\n\n---",
    "tasks": {
      "send_command": {
        "name": "send_command",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\"commands\": [\"systemctl restart {{ input()[\"serviceName\"] }} && sleep 3 && STATUS=$(systemctl is-active {{ input()[\"serviceName\"] }}) && echo \\\"Service {{ input()[\"serviceName\"] }} status: $STATUS\\\" && [ \\\"$STATUS\\\" = \\\"active\\\" ] || (echo \\\"Service failed to start\\\" && exit 1)\"]}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceId\"]}}",
          "DocumentName": "AWS-RunShellScript"
        },
        "retry": {
          "count": 3,
          "delay": 15,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-send-command",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Send SSM Run Command: AWS-RunShellScript.",
        "predecessors": []
      },
      "wait-for-send-command-finish": {
        "name": "wait-for-send-command-finish",
        "input": {
          "workflowId": "97218693-adf0-4c82-a295-e43d848b0b4d",
          "workflowInput": "{\n  \"CommandId\": \"{{ result(\"send_command\")[\"Command\"][\"CommandId\"] }}\",\n  \"awsregion\": \"{{input()[\"awsRegion\"]}}\",\n  \"awsinstanceid\": \"{{input()[\"instanceId\"]}}\",\n  \"dynatraceawsconnection\": \"{{input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "send_command": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "send_command"
        ]
      }
    }
  },
  {
    "id": "cb1629ca-cc46-4ac1-a23d-2c631adaf816",
    "title": "🧩subworkflow - aws ssm restart windows service on ec2",
    "description": "Subworkflow to restart a named Windows service on an EC2 instance via SSM Run Command and verify completion.\n\nParameters:\n\ninstanceId: (Required) EC2 instance ID\nserviceName: (Required) Windows service name to restart (e.g. wuauserv, W3SVC)\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{result(\"wait-for-send-command\")}}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceId": "i-01efff12bf0d4f5f2",
      "serviceName": "Server",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🔄 **Subworkflow to Restart a Windows Service on EC2**\n\n🔄 This subworkflow provides a simple way to **restart a Windows service on a Windows EC2 instance** via SSM Run Command and **verify the service is back in `Running` state** after restart.\n\nIt is commonly used for service recovery, troubleshooting failed services, or applying configuration changes that require service restart (IIS/W3SVC, Windows Update, app services, agents).\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceId** (Required): 🆔 EC2 instance ID that hosts the target Windows service.\n- **serviceName** (Required): 📋 Windows service name to restart (for example, `W3SVC`, `wuauserv`, `Spooler`).\n- **awsRegion** (Required): 🌍 AWS region where the EC2 instance is running.\n- **dynatraceawsconnection** (Required): 🔑 Dynatrace AWS OIDC connection name used to authenticate the AWS API calls.\n\n---\n\n### ▶️ **Execution Behavior**\n\nThe subworkflow executes an SSM Run Command using **AWS-RunPowerShellScript** that runs `Restart-Service` for the provided service, then checks the service status with `Get-Service`.\n\nIf the service does not return to `Running`, the command fails with a clear error, and the workflow reports the failure to downstream automation.\n\n---\n\n### 🧩 **Usage Context**\n\nUse this subworkflow when you need to:\n- Recover from service failures on Windows-based workloads.\n- Apply service-level configuration changes safely via automation.\n- Restart infrastructure services during incident remediation.\n- Validate service recovery before proceeding to dependent steps.",
    "tasks": {
      "send_command": {
        "name": "send_command",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\"commands\": [\"Restart-Service -Name '{{ input()[\"serviceName\"] }}' -Force; $svc = Get-Service -Name '{{ input()[\"serviceName\"] }}'; if ($svc.Status -ne 'Running') { throw \\\"Service {{ input()[\"serviceName\"] }} failed to start. Status: $($svc.Status)\\\" } else { Write-Output \\\"Service {{ input()[\"serviceName\"] }} restarted successfully. Status: $($svc.Status)\\\" }\"]}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceId\"]}}",
          "DocumentName": "AWS-RunPowerShellScript"
        },
        "retry": {
          "count": 3,
          "delay": 15,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-send-command",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Send SSM Run Command: AWS-RunPowerShellScript.",
        "predecessors": []
      },
      "wait-for-send-command": {
        "name": "wait-for-send-command",
        "input": {
          "workflowId": "97218693-adf0-4c82-a295-e43d848b0b4d",
          "workflowInput": "{\n  \"CommandId\": \"{{ result(\"send_command\")[\"Command\"][\"CommandId\"] }}\",\n  \"awsregion\": \"{{input()[\"awsRegion\"]}}\",\n  \"awsinstanceid\": \"{{input()[\"instanceId\"]}}\",\n  \"dynatraceawsconnection\": \"{{input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "send_command": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "send_command"
        ]
      }
    }
  },
  {
    "id": "59837f68-81ce-4964-80d8-81bd70b9b6e6",
    "title": "🧩subworkflow - aws ssm run powershell script on windows ec2 and wait",
    "description": "Subworkflow to execute a PowerShell script on a Windows EC2 instance via SSM Run Command and wait for completion.\n\nParameters:\n\ninstanceId: (Required) EC2 instance ID\npowershellScript: (Required) PowerShell script content to execute\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{result(\"wait-for-run-cmd-finish\")}}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceId": "i-01efff12bf0d4f5f2",
      "powershellScript": "Write-Output 'Running remediation' Get-Service | Where-Object {$_.Status -eq 'Stopped'}",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 💻 **Subworkflow to Run a PowerShell Script on Windows EC2 and Wait**\n\n💻 This subworkflow executes a **custom PowerShell script on a Windows EC2 instance** via SSM Run Command and then **waits for command completion** using a dedicated wait subworkflow.\n\nIt is useful for Windows remediation, diagnostics, service operations, and scripted maintenance tasks that must complete before downstream workflow steps continue.\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceId** (Required): 🆔 EC2 instance ID where the script will run.\n- **powershellScript** (Required): 📋 PowerShell script content to execute (single or multi-command script).\n- **awsRegion** (Required): 🌍 AWS region where the EC2 instance is running.\n- **dynatraceawsconnection** (Required): 🔑 Dynatrace AWS OIDC connection name used to authenticate AWS API calls.\n\n---\n\n### ▶️ **Execution Behavior**\n\nThe subworkflow first sends the script with **AWS-RunPowerShellScript** to the target instance, then calls a wait subworkflow to poll command execution until a terminal state is reached.\n\nIf command execution fails, times out, or returns a non-success state, this subworkflow returns a failure so downstream automation can stop or trigger fallback handling.\n\n---\n\n### 🧩 **Usage Context**\n\nUse this subworkflow when you need to:\n- Execute Windows remediation scripts during incident response.\n- Run diagnostics and collect output before taking next actions.\n- Perform scripted maintenance tasks on managed Windows EC2 hosts.\n- Gate downstream workflow steps on confirmed script completion.",
    "tasks": {
      "send_ps_command": {
        "name": "send_ps_command",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\"commands\": [\"{{ input()[\"powershellScript\"] }}\"]}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceId\"]}}",
          "DocumentName": "AWS-RunPowerShellScript"
        },
        "retry": {
          "count": 3,
          "delay": 10,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-send-command",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Send PowerShell script to Windows EC2 via SSM Run Command.",
        "predecessors": []
      },
      "wait-for-run-cmd-finish": {
        "name": "wait-for-run-cmd-finish",
        "input": {
          "workflowId": "97218693-adf0-4c82-a295-e43d848b0b4d",
          "workflowInput": "{\n  \"CommandId\": \"{{result(\"send_ps_command\")[\"Command\"].CommandId }}\",\n  \"awsregion\": \"{{input()[\"awsRegion\"] }}\",\n  \"awsinstanceid\": \"{{input()[\"instanceId\"] }}\",\n  \"dynatraceawsconnection\": \"{{input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "send_ps_command": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "send_ps_command"
        ]
      }
    }
  },
  {
    "id": "b91dbdf8-60f5-4867-9a06-d491daa65a44",
    "title": "🧩subworkflow - aws ssm run shell script on linux ec2 and wait",
    "description": "Subworkflow to run a custom shell script on a Linux EC2 instance via SSM Run Command and wait for completion.\n\nParameters:\n\ninstanceId: (Required) EC2 instance ID\nshellScript: (Required) The shell script content to execute\nawsRegion: (Required) AWS region\ndynatraceawsconnection: (Required) Dynatrace AWS OIDC connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 4,
    "trigger": {},
    "result": "{{result(\"wait-for-send-command-finish\")}}",
    "type": "STANDARD",
    "input": {
      "awsRegion": "us-east-1",
      "instanceId": "i-0bf88cff011236fde",
      "shellScript": "#!/bin/bash\\necho 'Running remediation script'\\ndf -h\\nfree -m",
      "dynatraceawsconnection": "554872066791"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🖥️ **Subworkflow to Run a Shell Script on Linux EC2 and Wait**\n\n🖥️ This subworkflow executes a **custom shell script on a Linux EC2 instance** via SSM Run Command and then **waits for command completion** using a dedicated wait subworkflow.\n\nIt is useful for Linux remediation, diagnostics, ad-hoc maintenance, and scripted operations that must complete before downstream workflow steps continue (clearing disk space, restarting services, flushing caches, etc.).\n\n---\n\n### ⚙️ **Parameters**\n\n- **instanceId** (Required): 🆔 EC2 instance ID where the script will run.\n- **shellScript** (Required): 📋 Shell script content to execute (single or multi-line bash script).\n- **awsRegion** (Required): 🌍 AWS region where the EC2 instance is running.\n- **dynatraceawsconnection** (Required): 🔑 Dynatrace AWS OIDC connection name used to authenticate AWS API calls.\n\n---\n\n### ▶️ **Execution Behavior**\n\nThe subworkflow first sends the script with **AWS-RunShellScript** to the target Linux instance, then calls a wait subworkflow to poll command execution until a terminal state is reached.\n\nIf command execution fails, times out, or returns a non-success state, this subworkflow returns a failure so downstream automation can stop or trigger fallback handling.\n\n---\n\n### 🧩 **Usage Context**\n\nUse this subworkflow when you need to:\n- Execute Linux remediation scripts during incident response.\n- Run diagnostics and collect output before taking next actions.\n- Perform scripted maintenance tasks on managed Linux EC2 hosts.\n- Gate downstream workflow steps on confirmed script completion.",
    "tasks": {
      "send_shell_command": {
        "name": "send_shell_command",
        "input": {
          "region": "{{input()[\"awsRegion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{\"commands\": [\"{{ input()[\"shellScript\"] }}\"]}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "InstanceIds": "{{input()[\"instanceId\"]}}",
          "DocumentName": "AWS-RunShellScript"
        },
        "retry": {
          "count": 3,
          "delay": 10,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-send-command",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Send shell script to EC2 instance via SSM Run Command.",
        "predecessors": []
      },
      "wait-for-send-command-finish": {
        "name": "wait-for-send-command-finish",
        "input": {
          "workflowId": "97218693-adf0-4c82-a295-e43d848b0b4d",
          "workflowInput": "{\n  \"CommandId\": \"{{result(\"send_shell_command\")[\"Command\"].CommandId }}\",\n  \"awsregion\": \"{{input()[\"awsRegion\"] }}\",\n  \"awsinstanceid\": \"{{input()[\"instanceId\"] }}\",\n  \"dynatraceawsconnection\": \"{{input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 3600,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "send_shell_command": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "send_shell_command"
        ]
      }
    }
  },
  {
    "id": "c1d81c97-c48d-400c-b980-0947cb2dda36",
    "title": "🧩subworkflow - aws update cloudformation stack",
    "description": "Subworkflow to update an aws cloudformation stack\n\nThis subworkflow provides an easy way to trigger\nan update of an existing aws cloudformation stack with\n\nParameters:\n\ncf_stackname: (Required) stackname of the cloudformation stack you want to create\ncfyamls3url: (Required) is the cloudformation yaml to run (needs to be stored on s3 and entered using the following url syntax https://s3bucket.s3.us-east-1.amazonaws.com/cf.yaml)\nawsregion: (Required) region in which you want to create the cloudformation stack\ndynatraceawsconnection: (Required) the connection name of the Dynatrace OIDC Connection\nassumerolearn: (Required) arn of a role that allows the update of the cloudformation stack\n\nThis subworkflow Needs subworkflow \"subworkflow - aws wait for systems manager document execution\"\n\nSubworkflow will wait for ssm document execution and will fail if ssm document fails\n\nThis subworkflow uses the out of the box AWS SSM Document: AWS-UpdateCloudFormationStack\nhttps://us-east-1.console.aws.amazon.com/systems-manager/documents/AWS-UpdateCloudFormationStack/description?region=us-east-1",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"wait-for-ssm-execution-completed\") }}",
    "type": "STANDARD",
    "input": {
      "awsregion": "us-east-1",
      "cfyamls3url": "https://serverlessexamples.s3.us-east-1.amazonaws.com/serverless_demo_fail_us_east_2.yaml",
      "cf_stackname": "serverless-demo",
      "assumerolearn": "arn:aws:iam::589650258462:role/ssm_assume_role",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🔄 **Subworkflow to Update an AWS CloudFormation Stack**\n\n📦 This subworkflow provides a simple and controlled way to **trigger an update of an existing AWS CloudFormation stack** using AWS Systems Manager (SSM).\n\nIt is commonly used to apply **infrastructure changes, configuration updates, or template enhancements** in a standardized and automated way.\n\n---\n\n### ⚙️ **Parameters**\n\n- **cf_stackname** (Required): 🏷️ The name of the CloudFormation stack to update.  \n- **cfyamls3url** (Required): 📄 The S3 URL of the CloudFormation YAML template to apply  \n  *(must follow this format: `https://s3bucket.s3.us-east-1.amazonaws.com/cf.yaml`)*  \n- **awsregion** (Required): 🌍 The AWS region where the CloudFormation stack resides.  \n- **dynatraceawsconnection** (Required): 🔑 The name of the Dynatrace AWS OIDC connection used to authenticate with AWS.  \n- **assumerolearn** (Required): 🎭 The ARN of an IAM role that allows updating the CloudFormation stack.\n\n---\n\n### ⏳ **Execution Behavior**\n\n⏱️ The subworkflow waits for the AWS Systems Manager (SSM) document execution to complete.  \n❌ If the SSM document execution fails, this subworkflow will also fail, enabling **restart-on-error** handling in the parent workflow.\n\n---\n\n### 📘 **AWS SSM Document Used**\n\nThis subworkflow uses the out-of-the-box AWS Systems Manager document:\n\n🔗 https://us-east-1.console.aws.amazon.com/systems-manager/documents/AWS-UpdateCloudFormationStack/description?region=us-east-1\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 📤 The subworkflow sends an update command to the AWS SSM document  \n  **`AWS-UpdateCloudFormationStack`**\n- ⏳ It waits for the SSM document execution to complete\n- ✅ The execution result is validated to confirm the stack update was successful\n- ❌ If the update fails, the subworkflow fails to allow **restart-on-error** behavior in the parent workflow\n\n---\n\nThis subworkflow Needs subworkflow  \n**subworkflow - aws wait for systems manager document execution**\n\n---",
    "tasks": {
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ execution_id }) {\n  const configGet = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/wait-for-ssm-execution-completed/result`);\n  const configBody = await configGet.json();\n  const status = configBody.AutomationExecutionStatus.toUpperCase()\n  console.log(status)\n  \n  if (status !=\"SUCCESS\") {\n        console.log(\"SSM Document Execution has Failed!\");\n        throw new Error(\"SSM Document Execution has Failed!\");\n  } \n\n  return configBody;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 3
        },
        "conditions": {
          "states": {
            "wait-for-ssm-execution-completed": "OK"
          }
        },
        "description": "Run custom JavaScript code.",
        "predecessors": [
          "wait-for-ssm-execution-completed"
        ]
      },
      "wait-for-ssm-execution-completed": {
        "name": "wait-for-ssm-execution-completed",
        "input": {
          "workflowId": "20661ec0-29d5-471f-9973-29679d5fe908",
          "workflowInput": "{\n\"AutomationExecutionId\":\"{{result(\"systems_manager_start_automation_execution_1\").AutomationExecutionId }}\",\n\"awsregion\": \"{{input()[\"awsregion\"] }}\",\n\"dynatraceawsconnection\": \"{{ input()[\"dynatraceawsconnection\"] }}\"\n}"
        },
        "retry": {
          "count": 99,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-workflow",
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "systems_manager_start_automation_execution_1": "OK"
          }
        },
        "description": "Modularize your workflows, run any existing workflow.",
        "predecessors": [
          "systems_manager_start_automation_execution_1"
        ]
      },
      "systems_manager_start_automation_execution_1": {
        "name": "systems_manager_start_automation_execution_1",
        "input": {
          "region": "{{ input()[\"awsregion\"]}}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "Parameters": "{ \n  \"StackNameOrId\": [\"{{input()[\"cf_stackname\"] }}\"],\n  \"TemplateUrl\": [\"{{input()[\"cfyamls3url\"] }}\"],\n  \"LambdaAssumeRole\": [\"{{input()[\"assumerolearn\"] }}\"]\n}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "DocumentName": "AWS-UpdateCloudFormationStack"
        },
        "retry": {
          "count": 5,
          "delay": 60,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.aws.connector:ssm-start-automation-execution",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Initiates execution of an Automation runbook",
        "predecessors": []
      }
    }
  },
  {
    "id": "97218693-adf0-4c82-a295-e43d848b0b4d",
    "title": "🧩subworkflow - aws wait for run command execution",
    "description": "Subworkflow to wait for aws ssm run command execution to finish\n\nThis subworkflow is used in the \"aws run command on ec2 instance\" subworkflow\nto wait for the execution to finish and check the status of the execution.\nIf the execution wasnt successful the subworklow will fail so that\nparent workflows can respond with rerun on error.\n\nParameters:\n\nawsregion: (Required) Region in which the SSM document runs\nawsinstanceid: (Required) Instance id on which the run command ssm document was executed\nCommandId: (Required) Command id of the run command execution (Returned by Run command actions)\ndynatraceawsconnection: (Required) Dynatrace oidc connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"get-status\").Commands }}",
    "type": "STANDARD",
    "input": {
      "CommandId": "2824c2b0-29aa-40b5-8924-c5169c07c2cc",
      "awsregion": "us-east-1",
      "awsinstanceid": "i-0e831c54dc3f2f0c7",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## ⏳ **Subworkflow to Wait for AWS SSM Run Command Execution to Finish**\n\n🧠 This subworkflow is used by the **“aws run command on EC2 instance”** subworkflow to **wait for an AWS SSM Run Command execution to complete** and **validate the execution status**.\n\n✅ If the command execution is successful, the subworkflow completes.  \n❌ If the execution fails, the subworkflow fails as well—allowing **parent workflows to react with restart-on-error or alternative handling**.\n\n---\n\n### ⚙️ **Parameters**\n\n- **awsregion** (Required): 🌍 The AWS region in which the SSM Run Command is executed.  \n- **awsinstanceid** (Required): 🆔 The EC2 instance ID on which the Run Command was executed.  \n- **CommandId** (Required): 🧾 The command ID of the Run Command execution  \n  *(returned by the AWS Run Command action)*.  \n- **dynatraceawsconnection** (Required): 🔑 The Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- ⏳ The subworkflow continuously checks the status of the specified Run Command execution\n- ✅ If the execution completes successfully, the subworkflow finishes\n- ❌ If the execution fails or returns an error state, the subworkflow fails\n- 🔁 This enables **restart-on-error** or compensating logic in the parent workflow\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed as a **helper / control-flow subworkflow**\n- ✅ Ensures downstream workflow steps only execute after command completion\n- ✅ Commonly paired with:\n  - Run command on EC2 instance\n  - Remediation scripts\n  - Validation and recovery workflows\n\n---",
    "tasks": {
      "get-status": {
        "name": "get-status",
        "input": {
          "region": "{{ input()[\"awsregion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "CommandId": "{{ input()[\"CommandId\"] }}",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}"
        },
        "action": "dynatrace.aws.connector:ssm-list-commands",
        "active": true,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Lists the commands requested by users of the Amazon Web Services account",
        "predecessors": []
      },
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { actionExecution } from \"@dynatrace-sdk/automation-utils\";\n\nexport default async function ({ execution_id, action_execution_id }) {\n  const actionEx = await actionExecution(action_execution_id);\n  console.log(actionEx.loopItem.item)\n  const status = actionEx.loopItem.item.Status.toUpperCase()\n  console.log(status)\n  \n  if (status ==\"INPROGRESS\") {\n        console.log(\"Send Command Execution is still running, restarting again!\");\n        throw new Error(\"Send Command Execution is still running, restarting again!\");\n  } \n\n  return status;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "get-status": "OK"
          }
        },
        "withItems": "item in {{ result(\"get-status\").Commands }}",
        "concurrency": 1,
        "description": "Build a custom task running js Code",
        "predecessors": [
          "get-status"
        ]
      }
    }
  },
  {
    "id": "20661ec0-29d5-471f-9973-29679d5fe908",
    "title": "🧩subworkflow - aws wait for systems manager  document execution",
    "description": "Subworkflow to wait for aws ssm document execution to finish\n\nThis subworkflow is used in subworkflows that execute ssm documents\nto wait for the execution to finish and check the status of the execution.\nIf the execution wasnt successful the subworklow will fail so that\nparent workflows can respond with rerun on error.\n\nParameters: \n\nawsregion: (Required) Region in which the SSM document runs\nAutomationExecutionId: (Required) Execution id of the SSM document (Returned by Start SSM actions)\ndynatraceawsconnection: (Required) Dynatrace oidc connection name",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"check-status\").AutomationExecution }}",
    "type": "STANDARD",
    "input": {
      "awsregion": "us-east-1",
      "AutomationExecutionId": "08093423-3443-4182-8397-12e802518f29",
      "dynatraceawsconnection": "awsplayground"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## ⏳ **Subworkflow to Wait for AWS SSM Document Execution to Finish**\n\n🧠 This subworkflow is used by other subworkflows that **execute AWS SSM documents** to **wait for the execution to complete** and **validate the execution status**.\n\n✅ If the SSM document execution completes successfully, the subworkflow finishes.  \n❌ If the execution fails, the subworkflow fails as well—allowing **parent workflows to respond with rerun-on-error or alternative handling logic**.\n\n---\n\n### ⚙️ **Parameters**\n\n- **awsregion** (Required): 🌍 The AWS region in which the SSM document is executed.  \n- **AutomationExecutionId** (Required): 🧾 The execution ID of the SSM document  \n  *(returned by the Start SSM Automation action)*.  \n- **dynatraceawsconnection** (Required): 🔑 The Dynatrace AWS OIDC connection used to authenticate with AWS.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- ⏳ The subworkflow continuously checks the status of the specified SSM document execution\n- ✅ If the execution completes successfully, the subworkflow finishes\n- ❌ If the execution fails or returns an error state, the subworkflow fails\n- 🔁 This enables **rerun-on-error or compensating logic** in the parent workflow\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed as a **helper / control-flow subworkflow**\n- ✅ Used by subworkflows that trigger AWS SSM Automation documents\n- ✅ Ensures downstream workflow steps only execute after SSM completion\n- ✅ Commonly paired with remediation, provisioning, and infrastructure workflows\n\n---",
    "tasks": {
      "get-status": {
        "name": "get-status",
        "input": {
          "region": "{{ input()[\"awsregion\"] }}",
          "schema": "builtin:hyperscaler-authentication.connections.aws",
          "connection": "{% set awsconnection = input()[\"dynatraceawsconnection\"] %}\n{{ connection('builtin:hyperscaler-authentication.connections.aws', awsconnection) }}",
          "AutomationExecutionId": "{{ input()[\"AutomationExecutionId\"] }}"
        },
        "action": "dynatrace.aws.connector:ssm-get-automation-execution",
        "active": true,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Get detailed information about a particular Automation execution",
        "predecessors": []
      },
      "check-status": {
        "name": "check-status",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function ({ execution_id }) {\n  const configGet = await fetch(`/platform/automation/v1/executions/${execution_id}/tasks/get-status/result`);\n  const configBody = await configGet.json();\n  const status = configBody.AutomationExecution.AutomationExecutionStatus.toUpperCase()\n  console.log(status)\n  \n  if (status ==\"INPROGRESS\" || status ==\"PENDING\" ) {\n        console.log(\"Automation still running, restarting again!\");\n        throw new Error(\"Automation still running, restarting again!\");\n  } \n\n  return configBody;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "position": {
          "x": 0,
          "y": 2
        },
        "conditions": {
          "states": {
            "get-status": "OK"
          }
        },
        "description": "Build a custom task running js Code",
        "predecessors": [
          "get-status"
        ]
      }
    }
  },
  {
    "id": "c5d3e84c-4318-4194-a0f4-1d45822bfc55",
    "title": "🧩subworkflow - dynatrace delete all workflows of owner",
    "description": "",
    "ownerType": "USER",
    "isPrivate": true,
    "schemaVersion": 3,
    "trigger": {},
    "result": null,
    "type": "STANDARD",
    "input": {},
    "hourlyExecutionLimit": 1000,
    "guide": "## 🗑️ **Subworkflow to Delete All Workflows of a Specific Owner**\n\n⚠️ This subworkflow provides a powerful way to **delete all workflows owned by a specific user**.\n\nWhen the subworkflow starts, it:\n- 👤 Determines the **owner of the running workflow**\n- 🔍 Searches for **all workflows owned by that user**\n- 🗑️ **Deletes every workflow it finds**\n\n---\n\n### 🚨 **Important Warning**\n\n⚠️ **This action is destructive and irreversible.**\n\nAll workflows owned by the identified user will be **permanently deleted**.\n\n✅ **Ensure workflows are backed up or exported before running this subworkflow.**\n\nThis subworkflow should only be used in **controlled governance, cleanup, or emergency scenarios**.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 🚫 Removing **unauthorized or non-compliant workflows**\n- 🧼 Performing **bulk cleanup** during governance enforcement\n- 🛡️ Responding to security or audit findings\n- 🔁 Resetting environments during testing or enablement activities\n\n---\n\n### ⚙️ **Parameters**\n\n🚫 This subworkflow **does not require any input parameters**.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 👤 Identify the owner of the executing workflow\n- 🔍 Locate all workflows owned by that user\n- 🗑️ Delete each workflow\n- ✅ Complete if successful\n- ❌ Fail if an error occurs, allowing the **parent workflow to respond appropriately**\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed for **workflow governance and lifecycle enforcement**\n- ✅ Intended for **advanced administrative automation**\n- ✅ Complements workflow create, export, and validation subworkflows\n- ✅ Should be protected by approvals or access controls\n\n---",
    "tasks": {
      "delete-workflows": {
        "name": "delete-workflows",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { workflowsClient } from \"@dynatrace-sdk/client-automation\";\n\nexport default async function ({ execution_id }) {\n  // your code goes here\n  // e.g. get the current execution\n  const ex = await execution(execution_id);\n  console.log(ex.workflow)\n\n\n  const getowner = await workflowsClient.getWorkflows({\n    adminAccess: true,\n    id: ex.workflow,\n  });\n  \n\n  const data = await workflowsClient.getWorkflows({\n    limit: 1000,\n    owner: getowner.results[0].owner,\n  });\n\n\n  let i = 0;\n  \n  while (i < data.results.length) {\n      console.log(data.results[i].id);\n      const datax = await workflowsClient.deleteWorkflow({\n      adminAccess: true,\n      id: \"\"+ data.results[i].id +\"\",\n      });\n      console.log(data.results[i].title ) \n      i++;\n  }\n\n\n  \n  return data.results.length;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "d31cdf5e-f1ca-4583-a850-67af54e3dde7",
    "title": "🧩subworkflow - dynatrace check if problem is solved or closed",
    "description": "Subworkflow to Check if a Davis Problem is Solved or Closed\n\nUse Case:\nWhen executing multiple remediation steps in a workflow, this subworkflow can be used to validate whether a specific \nstep has resolved the problem. If the problem is still open, the subworkflow will fail.\n\nYou can configure the \"retry on error\" setting in the parent workflow to retry this subworkflow for a specific duration—for example,\nrun for 10 minutes and check periodically if the problem has been resolved.\n\nIf the problem is not resolved within the defined time window, you can:\n\n* Add another remediation step.\n* Escalate the issue to a human operator.\n\nThis approach enables automated, iterative problem resolution while maintaining control over escalation and fallback strategies.\n\nParameters:\n\ndynatrace_problem_display_id: (Required) Davis Problem id (for example P-25051158)",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"check-if-problem-solved\") }}",
    "type": "STANDARD",
    "input": {
      "dynatrace_problem_display_id": "P-25051158"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## ✅ **Subworkflow to Check if a Problem Is Solved or Closed**\n\n🧠 This subworkflow is used to **validate whether a specific remediation step has resolved a problem**.\n\nIt is especially useful in workflows that execute **multiple remediation actions**, where you want to verify after each step whether the problem has been **solved or closed** before proceeding further.\n\n✅ If the problem is solved or closed, the subworkflow completes successfully.  \n❌ If the problem is still open, the subworkflow fails—allowing the **parent workflow to retry or take alternative action**.\n\n---\n\n### 🎯 **Use Case**\n\nWhen executing iterative remediation steps, this subworkflow enables **automated decision-making** based on the current state of a problem.\n\nYou can configure **retry-on-error** behavior in the parent workflow to:\n- 🔁 Retry this subworkflow for a defined duration (for example, every minute for 10 minutes)\n- ⏳ Periodically re-check whether the problem has been resolved\n\nIf the problem is **not resolved within the defined time window**, you can:\n\n- ➕ Trigger an additional remediation step  \n- 👤 Escalate the issue to a human operator  \n\nThis approach supports **automated, iterative problem resolution** while maintaining full control over escalation and fallback strategies.\n\n---\n\n### ⚙️ **Parameters**\n\n- **problem_display_id** (Required): 🆔 The problem display ID  \n  *(for example: `P-25051158`)*\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed as a **control and validation subworkflow**\n- ✅ Commonly used between remediation steps\n- ✅ Enables retry-based logic instead of hard-coded delays\n- ✅ Works seamlessly with **restart-on-error** patterns in parent workflows\n\n---",
    "tasks": {
      "check-if-problem-solved": {
        "name": "check-if-problem-solved",
        "input": {
          "query": "fetch events, from: now()-7d\n| filter matchesPhrase(display_id,\"{{input()[\"dynatrace_problem_display_id\"] }}\" ) and matchesValue(event.status_transition, \"RESOLVED\" ) or matchesPhrase(display_id,\"{{input()[\"dynatrace_problem_display_id\"] }}\" ) and matchesValue(event.status_transition, \"CLOSED\" )",
          "failOnEmptyResult": true
        },
        "action": "dynatrace.automations:execute-dql-query",
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "custom": "",
          "states": {}
        },
        "description": "Make use of Dynatrace Grail data in your workflow.",
        "predecessors": []
      }
    }
  },
  {
    "id": "4486e1fc-6862-4a42-a6e8-39f080f57ff1",
    "title": "🧩subworkflow - dynatrace close problem",
    "description": "Subworkflow to close a Davis Problem\n\nParameters:\n\nevent.id = Dyantrace event id of the Davis Problem",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"close-problem\") }}",
    "type": "STANDARD",
    "input": {
      "event.id": "2847618168410183866_1744904520000V2"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## ✅ **Subworkflow to Close a Problem**\n\n🔒 This subworkflow provides a simple and automated way to **close an existing problem** once remediation has been completed successfully.\n\nIt is typically used at the **end of remediation workflows** to explicitly mark a problem as resolved after validation steps have passed.\n\n✅ If the problem is closed successfully, the subworkflow completes.  \n❌ If closing the problem fails, the subworkflow fails—allowing the **parent workflow to retry or take alternative action**.\n\n---\n\n### ⚙️ **Parameters**\n\n- **event.id** (Required): 🆔 The Dynatrace event ID associated with the problem to be closed.\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Commonly used as a **final step** in remediation workflows\n- ✅ Helps ensure problems are only closed after successful remediation\n- ✅ Works well in combination with:\n  - Problem validation subworkflows  \n  - Retry-on-error logic  \n  - Escalation or fallback paths  \n\n---",
    "tasks": {
      "close-problem": {
        "name": "close-problem",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { problemsClient } from '@dynatrace-sdk/client-classic-environment-v2';\nimport { getEnvironmentUrl } from \"@dynatrace-sdk/app-environment\";\n\nexport default async function ({ executionId }) {\n  // your code goes here\n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n\n  \n  console.log(input)\n\n  \n\n  const data = await problemsClient.closeProblem({\n    problemId: \"\"+input['event.id']+\"\",\n    body: { message: \"solved\" }\n  });\n\n\n  \n\n  return data;\n}"
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "9bbe1c31-0649-4e91-b78f-0172a95af176",
    "title": "🧩subworkflow - dynatrace create dashboard",
    "description": "Subworkflow to create a dashboard.\n\nThis Subworkflow is used to create a dashboard\nUse Case example, create a Investigation Dashboard\nwhen Davis Raises a Problem, for Teams to easily\naccess the Data needed to solve the problem.\n\nParameters:\n\ndashboardname: (Required) name of dashboard to be created\ndashboardjson: (Required) Json def. of dashboard to be created",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"create-dashboard\") }}",
    "type": "STANDARD",
    "input": {
      "dashboardjson": {
        "tiles": {
          "1": {
            "type": "data",
            "davis": {
              "enabled": false,
              "davisVisualization": {
                "isAvailable": true
              }
            },
            "query": "fetch events\n| filter matchesValue(event.name, \"Process memory Saturation\") and  matchesPhrase(display_id, \"*P*\") and  matchesValue(event.status_transition, \"CREATED\") or matchesValue(event.name, \"Process CPU Saturation\") and  matchesPhrase(display_id, \"*P*\") and  matchesValue(event.status_transition, \"CREATED\") or matchesValue(event.name, \"Low Storage Warning\") and  matchesPhrase(display_id, \"*P*\") and  matchesValue(event.status_transition, \"CREATED\")  or matchesPhrase(event.name, \"*Remediation -*\") \n//| filter matchesPhrase(display_id, \"*P*\") \n//| filter matchesValue(event.status_transition, \"CREATED\")\n| fieldsadd Problemid=concat(\"🔥 \" ,display_id, \" \")\n//| filter dt.davis.is_duplicate==false\n| fieldsadd msg=if(matchesPhrase(event.name, \"*Remediation -*\") == true, concat(\"♻️ \", event.name), else:if(matchesPhrase(event.name, \"*Remediation Email*\") == true, concat(\"📨 \", event.name), else:concat(Problemid,event.name)))\n| fields  timestamp, msg, event.id, workflow, Url\n| fieldsadd url=if(matchesPhrase(msg, \"*Remediation -*\") == true, workflow, else:concat(\"https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.davis.problems/problem/\",event.id)), urlcl=concat(\"https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.classic.problems/#problems/problemdetails;gtf=-2h;gf=all;pid=\",event.id)\n| summarize time=takeFirst(timestamp), Message=collectDistinct(msg),url=takefirst(url),snowurl=takefirst(Url),by:{msg}\n| sort time desc\n|  fieldsRemove msg\n",
            "title": "Problem and Remediation Events",
            "timeframe": {
              "tileTimeframe": {
                "to": "now()",
                "from": "now()-1h"
              },
              "tileTimeframeEnabled": false
            },
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 10000,
              "maxResultMegaBytes": 1,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "table",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "showLabel": false
              },
              "table": {
                "rowDensity": "condensed",
                "columnOrder": [
                  "[\"time\"]",
                  "[\"Message\"]",
                  "[\"url\"]",
                  "[\"snowurl\"]"
                ],
                "lineWrapIds": [],
                "columnWidths": {
                  "[\"msg\"]": 297.34375,
                  "[\"time\"]": 181.17361450195312
                },
                "hiddenColumns": [
                  [
                    "event.id"
                  ]
                ],
                "linewrapEnabled": false,
                "enableSparklines": false,
                "columnTypeOverrides": [],
                "colorThresholdTarget": "value",
                "enableThresholdInRow": false,
                "monospacedFontColumns": [],
                "monospacedFontEnabled": false
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [],
                "displayedFields": [
                  "event.id",
                  "url"
                ]
              },
              "honeycomb": {
                "shape": "hexagon",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "categorical",
                "dataMappings": {
                  "value": "event.id"
                },
                "displayedFields": [
                  "event.id",
                  "url",
                  "urlcl"
                ]
              },
              "thresholds": [],
              "dataMapping": {},
              "singleValue": {
                "label": "time",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "alignment": "center",
                "autoscale": true,
                "showLabel": true,
                "prefixIcon": "",
                "recordField": "time",
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisLabel": "event.start",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "categoryOverrides": {},
                "leftYAxisSettings": {},
                "hiddenLegendFields": [
                  "lookup.latitude",
                  "lookup.longitude",
                  "lookup.HostCpuUsage"
                ],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "relative",
                  "groupingThresholdValue": 0
                },
                "valueRepresentation": "absolute",
                "xAxisIsLabelVisible": false,
                "categoricalBarChartSettings": {
                  "tooltipVariant": "single",
                  "valueAxisLabel": "",
                  "categoryAxisLabel": "event.id,time,Message,url,urlcl"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          },
          "3": {
            "type": "data",
            "davis": {},
            "query": "fetch  events\n| filter dt.davis.is_duplicate==false\n| filter matchesValue(event.name, \"Process memory Saturation\") or matchesValue(event.name, \"Process CPU Saturation\") or matchesValue(event.name, \"Low Storage Warning\")\n| filter matchesPhrase( entity_tags, \"remediation:on\")  \n| filter matchesValue(event.kind, \"DAVIS_PROBLEM\") and matchesValue(event.status, \"ACTIVE\") \n| summarize countDistinct(display_id), alias: Number_of_open_davis_problems\n//| fields concat( Number_of_open_davis_problems,\" 🧠 \")",
            "title": "",
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 100,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "Number_of_open_davis_problems",
                "showLabel": false
              },
              "table": {
                "lineWrapIds": [],
                "hiddenColumns": [],
                "enableLineWrap": true,
                "columnTypeOverrides": []
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "Number_of_open_davis_problems"
                  }
                ],
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "square",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "Number_of_open_davis_problems",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-themed-fireplace-color-01-default, #ae132d)"
                      },
                      "label": "",
                      "value": 1,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-themed-fireplace-color-01-default, #ae132d)"
                      },
                      "label": "",
                      "value": 2,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "Number_of_open_davis_problems"
              },
              "singleValue": {
                "label": "Detected Problems 🧠",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "autoscale": false,
                "showLabel": true,
                "prefixIcon": "DavisAiIcon",
                "recordField": "Number_of_open_davis_problems",
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "absolute",
                  "groupingThresholdValue": 0
                },
                "categoricalBarChartSettings": {
                  "valueAxis": [
                    "Number_of_open_davis_problems"
                  ],
                  "categoryAxis": [
                    "Number_of_open_davis_problems"
                  ],
                  "tooltipVariant": "single",
                  "valueAxisLabel": "Number_of_open_davis_problems",
                  "categoryAxisLabel": "Number_of_open_davis_problems"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          },
          "7": {
            "type": "data",
            "davis": {},
            "query": "fetch events\n| filter matchesValue(event.name, \"Process memory Saturation\") or matchesValue(event.name, \"Process CPU Saturation\") or matchesValue(event.name, \"Low Storage Warning\")\n| filter matchesValue(event.kind, \"DAVIS_PROBLEM\")  and matchesValue(event.status, \"CLOSED\") \n| filter matchesPhrase( entity_tags, \"remediation:on\")  \n| filter matchesPhrase(display_id, \"*P*\") \n| summarize average_open_time = avg(resolved_problem_duration)",
            "title": "",
            "timeframe": {
              "tileTimeframe": {
                "to": "now()",
                "from": "now()-7d"
              },
              "tileTimeframeEnabled": false
            },
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 100,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "average_open_time",
                "showLabel": false
              },
              "table": {
                "lineWrapIds": [],
                "hiddenColumns": [],
                "enableLineWrap": true,
                "columnTypeOverrides": []
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "average_open_time"
                  }
                ],
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "square",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "result",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-ideal-default, #2f6863)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "="
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-themed-fireplace-color-01-default, #ae132d)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": ">"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-critical-default, #c4233b)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": ">"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "average_open_time"
              },
              "singleValue": {
                "label": "Avg. Problem Duration",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "alignment": "center",
                "autoscale": false,
                "showLabel": true,
                "prefixIcon": "ClockIcon",
                "recordField": "average_open_time",
                "isIconVisible": true,
                "sparklineSettings": {
                  "isVisible": true,
                  "showTicks": false
                },
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "absolute",
                  "groupingThresholdValue": 0
                },
                "categoricalBarChartSettings": {
                  "tooltipVariant": "single",
                  "valueAxisLabel": "average_open_time",
                  "categoryAxisLabel": "average_open_time"
                }
              },
              "unitsOverrides": [],
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          },
          "9": {
            "type": "data",
            "davis": {},
            "query": "fetch  events\n| filter matchesValue(event.name, \"Process memory Saturation\") or matchesValue(event.name, \"Process CPU Saturation\") or matchesValue(event.name, \"Low Storage Warning\")\n| filter dt.davis.is_duplicate==false\n| filter matchesPhrase( entity_tags, \"remediation:on\")  \n| filter matchesValue(event.kind, \"DAVIS_PROBLEM\") and matchesValue(event.status, \"CLOSED\") \n| summarize countDistinct(display_id) , alias: Number_of_open_davis_problems\n//| fields concat( Number_of_open_davis_problems,\" 🧠 \")",
            "title": "",
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 100,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "Number_of_open_davis_problems",
                "showLabel": false
              },
              "table": {
                "lineWrapIds": [],
                "hiddenColumns": [],
                "enableLineWrap": true,
                "columnTypeOverrides": []
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "Number_of_open_davis_problems"
                  }
                ],
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "square",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "Number_of_open_davis_problems",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 1,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 2,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "Number_of_open_davis_problems"
              },
              "singleValue": {
                "label": "Solved Problems 🧠",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "autoscale": false,
                "showLabel": true,
                "prefixIcon": "DavisAiIcon",
                "recordField": "Number_of_open_davis_problems",
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "absolute",
                  "groupingThresholdValue": 0
                },
                "categoricalBarChartSettings": {
                  "tooltipVariant": "single",
                  "valueAxisLabel": "Number_of_open_davis_problems",
                  "categoryAxisLabel": "Number_of_open_davis_problems"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          },
          "12": {
            "type": "data",
            "davis": {},
            "query": "fetch dt.system.events\n| filter matchesPhrase(event.kind, \"workflow\")\n| filter matchesPhrase(dt.automation_engine.workflow.title, \"dyn.usecase-aprs-aws-ssm-remediate-cpu-memory-saturation-parent\") or matchesPhrase(dt.automation_engine.workflow.title, \"dyn.usecase-aprs-aws-ssm-remediate-low-storage-warning-parent\") or matchesPhrase(dt.automation_engine.workflow.title, \"dyn.usecase-aprs-aws-ssm-service-now-notification\")\n| filter matchesValue(event.type, \"WORKFLOW_EXECUTION\")\n| filter matchesValue(dt.automation_engine.state, \"RUNNING\")\n| sort start_time\n| summarize count()",
            "title": "",
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 100,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "nr_of_automations",
                "showLabel": false
              },
              "table": {
                "lineWrapIds": [],
                "hiddenColumns": [],
                "enableLineWrap": true,
                "columnTypeOverrides": []
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "nr_of_automations"
                  }
                ],
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "square",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "count()",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 1,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 2,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "nr_of_automations"
              },
              "singleValue": {
                "label": "Triggered Automation Workflows",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "autoscale": false,
                "showLabel": true,
                "prefixIcon": "AutomationsSignetIcon",
                "recordField": "count()",
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "hiddenLegendFields": [],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "absolute",
                  "groupingThresholdValue": 0
                },
                "categoricalBarChartSettings": {
                  "tooltipVariant": "single",
                  "valueAxisLabel": "nr_of_automations",
                  "categoryAxisLabel": "nr_of_automations"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          },
          "13": {
            "type": "data",
            "davis": {},
            "query": "fetch events\n| filter   matchesPhrase(event.name, \"*Closed Service Now Incident\")\n| summarize (countDistinct(event.id) * tolong($man_hr_per_incident)), alias: nr_of_automations\n",
            "title": "",
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 100,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "nr_of_automations",
                "showLabel": false
              },
              "table": {
                "lineWrapIds": [],
                "hiddenColumns": [],
                "enableLineWrap": true,
                "columnTypeOverrides": []
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "nr_of_automations"
                  }
                ],
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "square",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "nr_of_automations",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 1,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 2,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "nr_of_automations"
              },
              "singleValue": {
                "label": "man. Time Saved",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "autoscale": false,
                "showLabel": true,
                "prefixIcon": "ClockIcon",
                "recordField": "nr_of_automations",
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "hiddenLegendFields": [],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "absolute",
                  "groupingThresholdValue": 0
                },
                "categoricalBarChartSettings": {
                  "tooltipVariant": "single",
                  "valueAxisLabel": "nr_of_automations",
                  "categoryAxisLabel": "nr_of_automations"
                }
              },
              "unitsOverrides": [
                {
                  "added": 1747094057344,
                  "suffix": "",
                  "baseUnit": "hour",
                  "decimals": 0,
                  "delimiter": false,
                  "identifier": "nr_of_automations",
                  "displayUnit": null,
                  "unitCategory": "time"
                }
              ],
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          },
          "14": {
            "type": "data",
            "davis": {},
            "query": "fetch events\n| filter   matchesPhrase(event.name, \"*Closed Service Now Incident\")\n| summarize (countDistinct(event.id) * tolong($man_cost_per_incident)), alias: nr_of_automations\n",
            "title": "",
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 100,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "nr_of_automations",
                "showLabel": false
              },
              "table": {
                "lineWrapIds": [],
                "hiddenColumns": [],
                "enableLineWrap": true,
                "columnTypeOverrides": []
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "nr_of_automations"
                  }
                ],
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "square",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "nr_of_automations",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 1,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 2,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "nr_of_automations"
              },
              "singleValue": {
                "label": "Cost Avoidance",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "autoscale": false,
                "showLabel": true,
                "prefixIcon": "MoneyIcon",
                "recordField": "nr_of_automations",
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "hiddenLegendFields": [],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "absolute",
                  "groupingThresholdValue": 0
                },
                "categoricalBarChartSettings": {
                  "tooltipVariant": "single",
                  "valueAxisLabel": "nr_of_automations",
                  "categoryAxisLabel": "nr_of_automations"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          },
          "18": {
            "type": "data",
            "davis": {
              "enabled": false,
              "componentState": {
                "inputData": {
                  "dt.statistics.ui.ForecastAnalyzer": {
                    "query": "timeseries avg(dt.process.cpu.usage), by: { dt.entity.process_group_instance }, filter: { matchesValue(entityAttr(dt.entity.host, \"tags\"), \"[AWS]Name:Dynatrace-SSM-Action-Demo\") }\n| fieldsAdd dt.entity.process_group_instance.name = entityName(dt.entity.process_group_instance)\n| fieldsAdd value.A = arrayAvg(`avg(dt.process.cpu.usage)`)",
                    "forecastOffset": 1,
                    "forecastHorizon": 100,
                    "generalParameters": {
                      "timeframe": {
                        "endTime": "now()",
                        "startTime": "@d"
                      },
                      "logVerbosity": "INFO",
                      "resolveDimensionalQueryData": true
                    }
                  }
                },
                "analyzerHints": {
                  "dt.statistics.ui.ForecastAnalyzer": {
                    "unit": {
                      "baseUnit": "percent",
                      "unitCategory": "percentage"
                    }
                  }
                },
                "selectedAnalyzerName": "dt.statistics.ui.ForecastAnalyzer"
              }
            },
            "query": "timeseries { max(dt.process.cpu.usage), value.A = avg(dt.process.cpu.usage, scalar: true) }, by: { dt.entity.process_group_instance }, filter: { matchesValue(entityAttr(dt.entity.host, \"tags\"), \"*[AWS]Name:Dynatrace-SSM-Action-Demo*\") }\n| fieldsAdd dt.entity.process_group_instance.name = entityName(dt.entity.process_group_instance)",
            "title": "Process CPU Usage",
            "subType": "dql-builder-metrics",
            "queryConfig": {
              "version": "13.5.2",
              "subQueries": [
                {
                  "by": [
                    "dt.entity.process_group_instance"
                  ],
                  "id": "A",
                  "filter": "dt.entity.host.tags = \"*[AWS]Name:Dynatrace-SSM-Action-Demo*\"",
                  "metric": {
                    "key": "dt.process.cpu.usage",
                    "aggregation": "max"
                  },
                  "datatype": "metrics",
                  "isEnabled": true
                }
              ]
            },
            "querySettings": {
              "enableSampling": true,
              "maxResultRecords": 10000,
              "maxResultMegaBytes": 10,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 100
            },
            "visualization": "lineChart",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "value.A",
                "showLabel": false
              },
              "table": {
                "rowDensity": "condensed",
                "lineWrapIds": [],
                "columnWidths": {},
                "hiddenColumns": [],
                "linewrapEnabled": false,
                "enableSparklines": false,
                "columnTypeOverrides": [
                  {
                    "id": 1741651543112,
                    "value": "sparkline",
                    "fields": [
                      "max(dt.process.cpu.usage)"
                    ]
                  }
                ],
                "monospacedFontColumns": [],
                "monospacedFontEnabled": false
              },
              "histogram": {
                "yAxis": {
                  "label": "Frequency",
                  "scale": "linear"
                },
                "legend": "auto",
                "variant": "single",
                "colorPalette": "categorical",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "value.A"
                  },
                  {
                    "rangeAxis": "",
                    "valueAxis": "interval"
                  }
                ],
                "truncationMode": "middle",
                "displayedFields": [
                  "dt.entity.process_group_instance",
                  "dt.entity.process_group_instance.name"
                ]
              },
              "honeycomb": {
                "shape": "hexagon",
                "legend": {
                  "ratio": "auto",
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {
                  "value": "value.A"
                },
                "truncationMode": "middle",
                "displayedFields": [
                  "dt.entity.process_group_instance",
                  "dt.entity.process_group_instance.name"
                ]
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-ideal-default, #2f6863)"
                      },
                      "label": "Good",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-warning-default, #eca440)"
                      },
                      "label": "Warning",
                      "value": 60,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-critical-default, #c4233b)"
                      },
                      "label": "Problem",
                      "value": 90,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "value.A"
              },
              "singleValue": {
                "label": "value.A",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "alignment": "center",
                "autoscale": true,
                "showLabel": true,
                "prefixIcon": "",
                "recordField": "value.A",
                "sparklineSettings": {
                  "record": "max(dt.process.cpu.usage)"
                },
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "curve": "smooth",
                "legend": {
                  "hidden": true
                },
                "tooltip": {
                  "variant": "single",
                  "seriesDisplayMode": "multi-line"
                },
                "gapPolicy": "gap",
                "xAxisLabel": "timeframe",
                "colorPalette": "categorical",
                "fieldMapping": {
                  "timestamp": "timeframe",
                  "leftAxisValues": [
                    "max(dt.process.cpu.usage)"
                  ]
                },
                "xAxisScaling": "analyzedTimeframe",
                "pointsDisplay": "always",
                "truncationMode": "middle",
                "seriesOverrides": [],
                "categoryOverrides": {},
                "leftYAxisSettings": {
                  "max": 100,
                  "label": "Process CPU usage",
                  "isLabelVisible": false
                },
                "hiddenLegendFields": [
                  "dt.entity.process_group_instance",
                  "interval",
                  "value.A"
                ],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "relative",
                  "groupingThresholdValue": 0
                },
                "valueRepresentation": "absolute",
                "xAxisIsLabelVisible": false,
                "categoricalBarChartSettings": {
                  "scale": "absolute",
                  "layout": "horizontal",
                  "groupMode": "stacked",
                  "tooltipVariant": "single",
                  "valueAxisLabel": "value.A",
                  "colorPaletteMode": "multi-color",
                  "categoryAxisLabel": "dt.entity.process_group_instance,dt.entity.process_group_instance.name",
                  "categoryAxisTickLayout": "horizontal"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              },
              "autoSelectVisualization": false
            }
          },
          "19": {
            "type": "data",
            "davis": {},
            "query": "timeseries { max(dt.process.memory.usage), value.A = avg(dt.process.memory.usage, scalar: true) }, by: { dt.entity.process_group_instance }, filter: { matchesValue(entityAttr(dt.entity.host, \"tags\"), \"*[AWS]Name:Dynatrace-SSM-Action-Demo*\") }\n| fieldsAdd dt.entity.process_group_instance.name = entityName(dt.entity.process_group_instance)",
            "title": "Process memory Usage",
            "subType": "dql-builder-metrics",
            "queryConfig": {
              "version": "13.5.2",
              "subQueries": [
                {
                  "by": [
                    "dt.entity.process_group_instance"
                  ],
                  "id": "A",
                  "filter": "dt.entity.host.tags = \"*[AWS]Name:Dynatrace-SSM-Action-Demo*\"",
                  "metric": {
                    "key": "dt.process.memory.usage",
                    "aggregation": "max"
                  },
                  "datatype": "metrics",
                  "isEnabled": true
                }
              ]
            },
            "querySettings": {
              "enableSampling": true,
              "maxResultRecords": 10000,
              "maxResultMegaBytes": 10,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 100
            },
            "visualization": "lineChart",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "value.A",
                "showLabel": false
              },
              "table": {
                "rowDensity": "condensed",
                "lineWrapIds": [],
                "columnWidths": {},
                "hiddenColumns": [],
                "linewrapEnabled": false,
                "enableSparklines": false,
                "columnTypeOverrides": [
                  {
                    "id": 1741887293635,
                    "value": "sparkline",
                    "fields": [
                      "max(dt.process.memory.usage)"
                    ]
                  }
                ],
                "monospacedFontColumns": [],
                "monospacedFontEnabled": false
              },
              "histogram": {
                "yAxis": {
                  "label": "Frequency",
                  "scale": "linear"
                },
                "legend": "auto",
                "variant": "single",
                "colorPalette": "categorical",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "value.A"
                  },
                  {
                    "rangeAxis": "",
                    "valueAxis": "interval"
                  }
                ],
                "truncationMode": "middle",
                "displayedFields": [
                  "dt.entity.process_group_instance",
                  "dt.entity.process_group_instance.name"
                ]
              },
              "honeycomb": {
                "shape": "hexagon",
                "legend": {
                  "ratio": "auto",
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {
                  "value": "value.A"
                },
                "truncationMode": "middle",
                "displayedFields": [
                  "dt.entity.process_group_instance",
                  "dt.entity.process_group_instance.name"
                ]
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-ideal-default, #2f6863)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-warning-default, #eca440)"
                      },
                      "label": "",
                      "value": 60,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-critical-default, #c4233b)"
                      },
                      "label": "",
                      "value": 80,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "value.A"
              },
              "singleValue": {
                "label": "value.A",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "alignment": "center",
                "autoscale": true,
                "showLabel": true,
                "prefixIcon": "",
                "recordField": "value.A",
                "sparklineSettings": {
                  "record": "avg(dt.process.memory.usage)"
                },
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "curve": "linear",
                "legend": {
                  "hidden": true
                },
                "tooltip": {
                  "variant": "single",
                  "seriesDisplayMode": "multi-line"
                },
                "gapPolicy": "connect",
                "xAxisLabel": "timeframe",
                "colorPalette": "categorical",
                "fieldMapping": {
                  "timestamp": "timeframe",
                  "leftAxisValues": [
                    "max(dt.process.memory.usage)"
                  ]
                },
                "xAxisScaling": "auto",
                "pointsDisplay": "auto",
                "truncationMode": "middle",
                "seriesOverrides": [],
                "categoryOverrides": {},
                "leftYAxisSettings": {
                  "max": 100,
                  "label": "Process CPU usage",
                  "isLabelVisible": false
                },
                "hiddenLegendFields": [
                  "dt.entity.process_group_instance",
                  "interval",
                  "value.A"
                ],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "relative",
                  "groupingThresholdValue": 0
                },
                "valueRepresentation": "absolute",
                "xAxisIsLabelVisible": false,
                "categoricalBarChartSettings": {
                  "scale": "absolute",
                  "layout": "horizontal",
                  "groupMode": "stacked",
                  "tooltipVariant": "single",
                  "valueAxisLabel": "value.A",
                  "colorPaletteMode": "multi-color",
                  "categoryAxisLabel": "dt.entity.process_group_instance,dt.entity.process_group_instance.name",
                  "categoryAxisTickLayout": "horizontal"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              },
              "autoSelectVisualization": false
            }
          },
          "20": {
            "type": "markdown",
            "content": "#### Workflows\n[Launch Ec2 Instance](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/14274594-da45-407e-8f86-5503d9b96413)\n\n[Ini Problems](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/8fc0cff5-a056-4ce7-8604-ba557fa1d157)\n\n[Reboot all instances](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/7e9ea4d1-7b8f-439c-b9d7-0d506406d44f)\n\n[Service now](https://dev200562.service-now.com/now/nav/ui/classic/params/target/incident_list.do%3Fsysparm_query%3Dshort_descriptionLIKE\\(aws%255Eclose_notesISEMPTY%26sysparm_first_row%3D1%26sysparm_view%3Dess%26sysparm_choice_query_raw%3D%26sysparm_list_header_search%3Dtrue)\n\n[Service now Notification](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/e101d4a9-5871-4c2d-841b-0a5ac8df4cfe)\n\n[Run LLM training and All Problems on Ec2 Instances](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/e68145a7-3b48-4075-ab05-3c00a7270b69)\n\n[Run LLM training and Low Disk on Ec2 Instances](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/630d37e0-edd5-4a42-b036-962671b95259)\n\n[Run LLM training and Cpu saturation on Ec2 Instances](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/d23555d0-6471-472b-8e54-cc37e9a07a68?task=run-cpu-stress)\n\n[Run LLM training and memory saturation on Ec2 Instances](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/49914456-25b5-462f-bbd6-fb1a8cc57e66)\n\n[Terminate all instances](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/f38530a0-6afb-4fd8-9117-ce389419ad7d?task=ec2_terminate_instances_1)\n\n[Terminate disk instances](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/36b3623c-e2b9-47a9-8974-15e5795f93c1?task=get-instances-by-tag)\n\n[Create Cpu Saturation on multiple hosts](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/dcca93c2-d18b-4b11-8f92-1837fc01d5de)\n\n[Create Memory Saturation on multiple hosts](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/799965d4-c159-47f4-920c-3b97552119a1)\n\n[Create Low Storage Warning on multiple hosts](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/8de0f45e-6672-4d83-ade0-37a21b8b0b46)\n\n[Remediate Cpu and Memory Saturation](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/282dd9d3-f793-454c-9416-46adb433011b)\n\n[Remediate Low Storage Warning](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/4cc1d810-1646-4498-8953-871d11745678)\n\n\n\n\n\n\n\n"
          },
          "21": {
            "type": "data",
            "davis": {},
            "query": "timeseries { max(dt.host.disk.used.percent), value.A = avg(dt.host.disk.used.percent, scalar: true) }, by: { host.name, dt.source_entity, dt.entity.host, dt.entity.ec2_instance }, filter: { matchesValue(entityAttr(dt.entity.host, \"tags\"), \"*[AWS]Name:Dynatrace-SSM-Action-Demo*\") }\n| fieldsAdd dt.entity.host.name = entityName(dt.entity.host)\n| fieldsAdd dt.entity.ec2_instance.name = entityName(dt.entity.ec2_instance)",
            "title": "Disk Usage",
            "subType": "dql-builder-metrics",
            "queryConfig": {
              "version": "13.5.2",
              "subQueries": [
                {
                  "by": [
                    "host.name",
                    "dt.source_entity",
                    "dt.entity.host",
                    "dt.entity.ec2_instance"
                  ],
                  "id": "A",
                  "filter": "dt.entity.host.tags = \"*[AWS]Name:Dynatrace-SSM-Action-Demo*\"",
                  "metric": {
                    "key": "dt.host.disk.used.percent",
                    "aggregation": "max"
                  },
                  "datatype": "metrics",
                  "isEnabled": true
                }
              ]
            },
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 10000,
              "maxResultMegaBytes": 10,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 100
            },
            "visualization": "lineChart",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "value.A",
                "showLabel": false
              },
              "table": {
                "rowDensity": "condensed",
                "lineWrapIds": [],
                "columnWidths": {},
                "hiddenColumns": [],
                "linewrapEnabled": false,
                "enableSparklines": false,
                "columnTypeOverrides": [
                  {
                    "id": 1741637712622,
                    "value": "sparkline",
                    "fields": [
                      "max(dt.host.disk.used.percent)"
                    ]
                  }
                ],
                "monospacedFontColumns": [],
                "monospacedFontEnabled": false
              },
              "histogram": {
                "yAxis": {
                  "label": "Frequency",
                  "scale": "linear"
                },
                "legend": "auto",
                "variant": "single",
                "colorPalette": "categorical",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "value.A"
                  },
                  {
                    "rangeAxis": "",
                    "valueAxis": "interval"
                  }
                ],
                "truncationMode": "middle",
                "displayedFields": [
                  "host.name"
                ]
              },
              "honeycomb": {
                "max": 100,
                "shape": "hexagon",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "custom-colors",
                "colorPalette": "blue-moss",
                "customColors": [
                  {
                    "id": 0,
                    "color": {
                      "Default": "var(--dt-colors-charts-categorical-color-01-default, #134fc9)"
                    },
                    "value": 0,
                    "comparator": "≥"
                  }
                ],
                "dataMappings": {
                  "value": "value.A"
                },
                "truncationMode": "middle",
                "displayedFields": [
                  "host.name"
                ]
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-ideal-default, #2f6863)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-warning-default, #eca440)"
                      },
                      "label": "",
                      "value": 70,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-critical-default, #c4233b)"
                      },
                      "label": "",
                      "value": 90,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "value.A"
              },
              "singleValue": {
                "label": "value.A",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "alignment": "center",
                "autoscale": true,
                "showLabel": true,
                "prefixIcon": "",
                "recordField": "value.A",
                "sparklineSettings": {
                  "record": "max(dt.host.disk.used.percent)"
                },
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "curve": "linear",
                "legend": {
                  "hidden": true
                },
                "gapPolicy": "gap",
                "xAxisLabel": "timeframe",
                "colorPalette": "categorical",
                "fieldMapping": {
                  "timestamp": "timeframe",
                  "leftAxisValues": [
                    "max(dt.host.disk.used.percent)"
                  ]
                },
                "xAxisScaling": "auto",
                "pointsDisplay": "auto",
                "truncationMode": "middle",
                "seriesOverrides": [],
                "categoryOverrides": {},
                "leftYAxisSettings": {
                  "max": 100,
                  "label": "Disk used %",
                  "isLabelVisible": false
                },
                "hiddenLegendFields": [
                  "host",
                  "interval",
                  "value.A"
                ],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "relative",
                  "groupingThresholdValue": 0
                },
                "valueRepresentation": "absolute",
                "xAxisIsLabelVisible": false,
                "categoricalBarChartSettings": {
                  "scale": "absolute",
                  "layout": "horizontal",
                  "groupMode": "stacked",
                  "tooltipVariant": "single",
                  "valueAxisLabel": "value.A",
                  "colorPaletteMode": "multi-color",
                  "categoryAxisLabel": "host.name",
                  "categoryAxisTickLayout": "horizontal"
                }
              },
              "colorModeType": {
                "color": "#438FB1"
              },
              "unitsOverrides": [
                {
                  "added": 1741137751484,
                  "suffix": "",
                  "baseUnit": "percent",
                  "decimals": 0,
                  "delimiter": false,
                  "identifier": "avg(dt.host.disk.used.percent)",
                  "displayUnit": null,
                  "unitCategory": "percentage"
                }
              ],
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              },
              "autoSelectVisualization": false
            }
          },
          "40": {
            "type": "markdown",
            "content": " "
          },
          "43": {
            "type": "data",
            "davis": {
              "enabled": false,
              "davisVisualization": {
                "isAvailable": true
              }
            },
            "query": "fetch dt.entity.ec2_instance\n| filter matchesPhrase(tags,\"Dynatrace-SSM-Action-Demo\")\n| summarize instances=count()",
            "title": "",
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 1,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "label": {
                "label": "HostCpuUsage",
                "showLabel": false
              },
              "table": {
                "sortBy": {
                  "columnId": "[\"HostCpuUsage\"]",
                  "direction": "descending"
                },
                "rowDensity": "default",
                "lineWrapIds": [],
                "columnWidths": {
                  "[\"HostCpuUsage\"]": 156.2916717529297
                },
                "hiddenColumns": [],
                "linewrapEnabled": false,
                "enableSparklines": false,
                "columnTypeOverrides": [],
                "colorThresholdTarget": "background",
                "enableThresholdInRow": false,
                "monospacedFontColumns": [],
                "monospacedFontEnabled": false,
                "selectedColumnForRowThreshold": "HostDiskUsage"
              },
              "histogram": {
                "yAxis": {
                  "label": "Frequency",
                  "scale": "linear"
                },
                "legend": "auto",
                "variant": "single",
                "colorPalette": "categorical",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "instances"
                  }
                ],
                "truncationMode": "middle",
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "hexagon",
                "legend": {
                  "ratio": "auto",
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "truncationMode": "middle",
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 3,
                  "field": "instances",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": ">"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-status-critical-default, #c4233b)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "="
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "HostCpuUsage"
              },
              "singleValue": {
                "label": "🖧 Servers 🖧",
                "trend": {
                  "label": "",
                  "upward": {
                    "Default": "var(--dt-colors-charts-diverging-red-green-color-10-default, #2a7453)"
                  },
                  "neutral": {
                    "Default": "var(--dt-colors-charts-diverging-red-blue-color-10-default, #134fc9)"
                  },
                  "downward": {
                    "Default": "var(--dt-colors-charts-diverging-red-blue-color-02-default, #ae132d)"
                  },
                  "isVisible": true,
                  "trendType": "auto",
                  "isRelative": true,
                  "trendField": "instances",
                  "isLabelVisible": false
                },
                "alignment": "center",
                "autoscale": true,
                "showLabel": true,
                "prefixIcon": "",
                "recordField": "instances",
                "isIconVisible": true,
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "curve": "linear",
                "gapPolicy": "gap",
                "colorPalette": "categorical",
                "xAxisScaling": "analyzedTimeframe",
                "pointsDisplay": "auto",
                "truncationMode": "middle",
                "categoryOverrides": {},
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "relative",
                  "groupingThresholdValue": 0
                },
                "valueRepresentation": "absolute",
                "categoricalBarChartSettings": {
                  "scale": "absolute",
                  "layout": "horizontal",
                  "groupMode": "stacked",
                  "valueAxis": [
                    "instances"
                  ],
                  "categoryAxis": [
                    "instances"
                  ],
                  "tooltipVariant": "single",
                  "valueAxisLabel": "instances",
                  "colorPaletteMode": "multi-color",
                  "categoryAxisLabel": "instances",
                  "categoryAxisTickLayout": "horizontal"
                }
              },
              "unitsOverrides": [
                {
                  "added": 1741918504196,
                  "suffix": "",
                  "baseUnit": "none",
                  "decimals": 0,
                  "delimiter": false,
                  "identifier": "instances",
                  "displayUnit": null,
                  "unitCategory": "unspecified"
                }
              ],
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              },
              "autoSelectVisualization": false
            }
          },
          "55": {
            "type": "markdown",
            "content": " "
          },
          "56": {
            "type": "data",
            "davis": {
              "enabled": false,
              "davisVisualization": {
                "isAvailable": true
              }
            },
            "query": "fetch  events\n| filter dt.davis.is_duplicate==false\n| filter matchesValue(event.name, \"Process memory Saturation\") or matchesValue(event.name, \"Process CPU Saturation\") or matchesValue(event.name, \"Low Storage Warning\")\n| filter matchesPhrase( entity_tags, \"remediation:on\")  \n| filter matchesValue(event.kind, \"DAVIS_PROBLEM\") and matchesValue(event.status, \"ACTIVE\") \n| lookup [\nfetch dt.entity.ec2_instance\n| filter matchesPhrase(tags,\"Dynatrace-SSM-Action-Demo\")\n| fieldsadd cpuusage = lookup([ timeseries max = max(dt.host.cpu.usage), by:{dt.entity.host} \n| fieldsadd awsname=entityAttr(dt.entity.host, \"awsNameTag\"), cpumax = arrayLast(max)] , sourceField:entity.name, lookupField:awsname)\n| fieldsadd memusage = lookup([ timeseries max = max(dt.host.memory.avail.percent), by:{dt.entity.host} \n| fieldsadd awsname=entityAttr(dt.entity.host, \"awsNameTag\"), memmax = arrayLast(max)] , sourceField:entity.name, lookupField:awsname)\n| fieldsadd diskusage = lookup([ timeseries max = max(dt.host.disk.used.percent), by:{dt.entity.host} \n| fieldsadd awsname=entityAttr(dt.entity.host, \"awsNameTag\"), diskmax = arrayLast(max)] , sourceField:entity.name, lookupField:awsname)\n| fieldsadd entity.name,regionName,awsInstanceType, HostCpuUsage=cpuusage[cpumax], HostMemoryUsage=100 - memusage[memmax],HostDiskUsage=diskusage[diskmax],awsInstanceId,awsSecurityGroup, awsVpcName, arn, tags, id, amiId,virtualizedDiskType, awsBasicMonitoring, localHostName, publicHostName\n| fieldsadd  nr=0.1 + random() \n| fieldsadd latitude=if(regionName == \"us-east-1\", 42.600833 + nr, else:if(regionName == \"us-east-2\", 40.0946354 + nr)), longitude=if(regionName == \"us-east-1\", -111.456667 + nr, else:if(regionName == \"us-east-2\", -82.7541337 + nr))],sourceField:host.name[0], lookupField:localHostName\n|  fields display_id, host=lookup.entity.name, region=lookup.regionName, event.category, event.name, event.description, event.start, instance_id=lookup.awsInstanceId, ami=lookup.amiId, arn=lookup.arn, instance_type=lookup.awsInstanceType, VPC=lookup.awsVpcName, root_cause_entity_name, ip=lookup.localHostName, lat=lookup.latitude, long=lookup.longitude, HostCpuUsage=lookup.HostCpuUsage, HostMemoryUsage=lookup.HostMemoryUsage,HostDiskUsage=lookup.diskusage ,problem_link=concat(\"https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.davis.problems/problem/\",event.id), Classic_Problem_link=concat(\"https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.classic.problems/#problems/problemdetails;gtf=-2h;gf=all;pid=\",event.id),\nhost_link=concat(\"https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.infraops/hosts/\",dt.entity.host[0]), problem_id=concat(concat(display_id,\" - \"), event.name)",
            "title": "Problems Map",
            "timeframe": {
              "tileTimeframe": {
                "to": "now()",
                "from": "now()-15m"
              },
              "tileTimeframeEnabled": false
            },
            "querySettings": {
              "enableSampling": true,
              "maxResultRecords": 10000,
              "maxResultMegaBytes": 10,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 50
            },
            "visualization": "bubbleMap",
            "visualizationSettings": {
              "table": {
                "rowDensity": "condensed",
                "lineWrapIds": [],
                "columnWidths": {},
                "hiddenColumns": [],
                "linewrapEnabled": false,
                "enableSparklines": false,
                "columnTypeOverrides": [],
                "monospacedFontColumns": [],
                "monospacedFontEnabled": false
              },
              "legend": {
                "position": "right",
                "showLegend": true,
                "textTruncationMode": "end"
              },
              "mapView": {
                "zoom": 0.37294521206354503,
                "latitude": 50.73173766848333,
                "longitude": 0,
                "defaultZoom": "custom"
              },
              "tooltip": {
                "showCustomFields": true
              },
              "histogram": {
                "yAxis": {
                  "label": "Frequency",
                  "scale": "linear",
                  "isLabelVisible": true
                },
                "legend": {
                  "position": "auto"
                },
                "variant": "single",
                "colorPalette": "categorical",
                "dataMappings": [],
                "truncationMode": "middle"
              },
              "honeycomb": {
                "shape": "hexagon",
                "legend": {
                  "ratio": "auto",
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "categorical",
                "dataMappings": {},
                "truncationMode": "middle",
                "displayedFields": []
              },
              "mapRadius": {
                "scale": "linear",
                "radiusRange": [
                  1,
                  100
                ],
                "sizeInterpolation": "zoom"
              },
              "thresholds": [],
              "dataMapping": {
                "radius": "lat",
                "latitude": "lat",
                "dimension": "problem_id",
                "longitude": "long",
                "displayedFields": [
                  "display_id",
                  "host",
                  "region",
                  "event.category",
                  "event.name",
                  "event.description",
                  "event.start",
                  "instance_id",
                  "ami",
                  "arn",
                  "instance_type",
                  "VPC",
                  "root_cause_entity_name",
                  "ip",
                  "lat",
                  "long",
                  "HostCpuUsage",
                  "HostMemoryUsage",
                  "HostDiskUsage",
                  "problem_link",
                  "Classic_Problem_link",
                  "host_link"
                ]
              },
              "singleValue": {
                "label": "",
                "alignment": "center",
                "autoscale": true,
                "showLabel": true,
                "prefixIcon": "AnalyticsIcon",
                "isIconVisible": false,
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "curve": "linear",
                "gapPolicy": "gap",
                "xAxisLabel": "event.start",
                "colorPalette": "categorical",
                "fieldMapping": {
                  "timestamp": "event.start",
                  "leftAxisValues": [
                    "lat"
                  ]
                },
                "xAxisScaling": "auto",
                "pointsDisplay": "auto",
                "truncationMode": "middle",
                "categoryOverrides": {},
                "leftYAxisSettings": {},
                "hiddenLegendFields": [
                  "lookup.HostCpuUsage",
                  "lookup.HostMemoryUsage",
                  "lookup.HostDiskUsage",
                  "lookup.nr",
                  "lookup.latitude",
                  "lookup.longitude"
                ],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "relative",
                  "groupingThresholdValue": 0
                },
                "valueRepresentation": "absolute",
                "xAxisIsLabelVisible": false,
                "categoricalBarChartSettings": {
                  "scale": "absolute",
                  "layout": "horizontal",
                  "groupMode": "stacked",
                  "valueAxisScale": "linear",
                  "colorPaletteMode": "multi-color",
                  "categoryAxisTickLayout": "horizontal"
                }
              },
              "colorModeType": {
                "color": {
                  "Default": "var(--dt-colors-charts-security-risk-level-high-default, #cd3741)"
                },
                "colorMode": "color-palette",
                "colorPalette": "categorical",
                "numericColorPalette": "magenta"
              },
              "unitsOverrides": [
                {
                  "added": 1744252126944,
                  "suffix": "",
                  "baseUnit": "percent",
                  "decimals": 0,
                  "delimiter": false,
                  "identifier": "lookup.HostCpuUsage",
                  "displayUnit": null,
                  "unitCategory": "percentage"
                }
              ],
              "valueBoundaries": {
                "max": 100,
                "min": 0
              },
              "autoSelectVisualization": false
            }
          },
          "58": {
            "type": "markdown",
            "content": "[AWS Management Console](https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#Instances:instanceState=running;tag:Name=:Dynatrace-SSM;v=3;$case=tags:true%5C,client:false;$regex=tags:false%5C,client:false)\n[AWS Systems Manager Automations](https://us-east-1.console.aws.amazon.com/systems-manager/automation/executions?region=us-east-1#)\n[AWS Systems Manager Documents](https://us-east-1.console.aws.amazon.com/systems-manager/documents?region=us-east-1#) [Service now](https://dev231095.service-now.com/now/nav/ui/classic/params/target/incident_list.do%3Fsysparm_query%3Dshort_descriptionLIKE\\(aws%255Eclose_notesISEMPTY%26sysparm_first_row%3D1%26sysparm_view%3Dess%26sysparm_choice_query_raw%3D%26sysparm_list_header_search%3Dtrue)[Start Chaos Test](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.automations/workflows/e68145a7-3b48-4075-ab05-3c00a7270b69)[Problems/Anomalies](https://kyw96254.apps.dynatrace.com/ui/apps/dynatrace.davis.problems/)\n\n\n\n\n"
          },
          "59": {
            "type": "data",
            "davis": {},
            "query": "fetch events\n| filter matchesPhrase(event.name, \"Service Now Incident*\") and matchesPhrase(event.name, \"created*\")\n//| filter   matchesPhrase(event.name, \"Service Now Incident*\")\n| summarize countDistinct(event.name), alias: nr_of_automations\n",
            "title": "",
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 100,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "nr_of_automations",
                "showLabel": false
              },
              "table": {
                "lineWrapIds": [],
                "hiddenColumns": [],
                "enableLineWrap": true,
                "columnTypeOverrides": []
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "nr_of_automations"
                  }
                ],
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "square",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "nr_of_automations",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-loglevel-emergency-default, #ae132d)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-loglevel-emergency-default, #ae132d)"
                      },
                      "label": "",
                      "value": 1,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-loglevel-emergency-default, #ae132d)"
                      },
                      "label": "",
                      "value": 2,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "nr_of_automations"
              },
              "singleValue": {
                "label": "Created Service Now Incidents",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "autoscale": false,
                "showLabel": true,
                "prefixIcon": "DocumentStackIcon",
                "recordField": "nr_of_automations",
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "hiddenLegendFields": [],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "absolute",
                  "groupingThresholdValue": 0
                },
                "categoricalBarChartSettings": {
                  "tooltipVariant": "single",
                  "valueAxisLabel": "nr_of_automations",
                  "categoryAxisLabel": "nr_of_automations"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          },
          "60": {
            "type": "data",
            "davis": {},
            "query": "fetch events\n| filter   matchesPhrase(event.name, \"*Closed Service Now Incident\")\n| summarize countDistinct(event.id) , alias: nr_of_automations\n",
            "title": "",
            "querySettings": {
              "enableSampling": false,
              "maxResultRecords": 1000,
              "maxResultMegaBytes": 100,
              "defaultSamplingRatio": 10,
              "defaultScanLimitGbytes": 500
            },
            "visualization": "singleValue",
            "visualizationSettings": {
              "icon": {
                "icon": "",
                "showIcon": false
              },
              "label": {
                "label": "nr_of_automations",
                "showLabel": false
              },
              "table": {
                "lineWrapIds": [],
                "hiddenColumns": [],
                "enableLineWrap": true,
                "columnTypeOverrides": []
              },
              "histogram": {
                "variant": "single",
                "dataMappings": [
                  {
                    "rangeAxis": "",
                    "valueAxis": "nr_of_automations"
                  }
                ],
                "displayedFields": []
              },
              "honeycomb": {
                "shape": "square",
                "legend": {
                  "hidden": false,
                  "position": "auto"
                },
                "colorMode": "color-palette",
                "colorPalette": "blue",
                "dataMappings": {},
                "displayedFields": []
              },
              "thresholds": [
                {
                  "id": 1,
                  "field": "nr_of_automations",
                  "rules": [
                    {
                      "id": 0,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 0,
                      "comparator": "≥"
                    },
                    {
                      "id": 1,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 1,
                      "comparator": "≥"
                    },
                    {
                      "id": 2,
                      "color": {
                        "Default": "var(--dt-colors-charts-categorical-color-13-default, #1c520a)"
                      },
                      "label": "",
                      "value": 2,
                      "comparator": "≥"
                    }
                  ],
                  "title": "",
                  "isEnabled": true
                }
              ],
              "dataMapping": {
                "value": "nr_of_automations"
              },
              "singleValue": {
                "label": "Resolved Service Now Incidents",
                "trend": {
                  "isVisible": true,
                  "trendType": "auto"
                },
                "autoscale": false,
                "showLabel": true,
                "prefixIcon": "DocumentStackIcon",
                "recordField": "nr_of_automations",
                "sparklineSettings": {},
                "colorThresholdTarget": "value"
              },
              "chartSettings": {
                "gapPolicy": "connect",
                "xAxisScaling": "analyzedTimeframe",
                "truncationMode": "middle",
                "hiddenLegendFields": [],
                "circleChartSettings": {
                  "valueType": "relative",
                  "groupingThresholdType": "absolute",
                  "groupingThresholdValue": 0
                },
                "categoricalBarChartSettings": {
                  "tooltipVariant": "single",
                  "valueAxisLabel": "nr_of_automations",
                  "categoryAxisLabel": "nr_of_automations"
                }
              },
              "valueBoundaries": {
                "max": "auto",
                "min": "auto"
              }
            }
          }
        },
        "layouts": {
          "1": {
            "h": 8,
            "w": 9,
            "x": 15,
            "y": 7
          },
          "3": {
            "h": 5,
            "w": 3,
            "x": 0,
            "y": 5
          },
          "7": {
            "h": 3,
            "w": 3,
            "x": 21,
            "y": 1
          },
          "9": {
            "h": 5,
            "w": 3,
            "x": 0,
            "y": 10
          },
          "12": {
            "h": 3,
            "w": 3,
            "x": 15,
            "y": 4
          },
          "13": {
            "h": 3,
            "w": 3,
            "x": 21,
            "y": 4
          },
          "14": {
            "h": 3,
            "w": 3,
            "x": 18,
            "y": 4
          },
          "18": {
            "h": 4,
            "w": 4,
            "x": 3,
            "y": 1
          },
          "19": {
            "h": 4,
            "w": 4,
            "x": 7,
            "y": 1
          },
          "20": {
            "h": 10,
            "w": 6,
            "x": 0,
            "y": 22
          },
          "21": {
            "h": 4,
            "w": 4,
            "x": 11,
            "y": 1
          },
          "40": {
            "h": 7,
            "w": 24,
            "x": 0,
            "y": 15
          },
          "43": {
            "h": 4,
            "w": 3,
            "x": 0,
            "y": 1
          },
          "55": {
            "h": 3,
            "w": 15,
            "x": 0,
            "y": 32
          },
          "56": {
            "h": 10,
            "w": 12,
            "x": 3,
            "y": 5
          },
          "58": {
            "h": 1,
            "w": 24,
            "x": 0,
            "y": 0
          },
          "59": {
            "h": 3,
            "w": 3,
            "x": 15,
            "y": 1
          },
          "60": {
            "h": 3,
            "w": 3,
            "x": 18,
            "y": 1
          }
        },
        "version": 18,
        "settings": {},
        "variables": [
          {
            "key": "man_cost_per_incident",
            "type": "csv",
            "input": "500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000,9000,10000,20000,30000,40000,5000",
            "version": 1,
            "visible": true,
            "editable": true,
            "multiple": false
          },
          {
            "key": "man_hr_per_incident",
            "type": "csv",
            "input": "1,2,3,4,5,6,7,8,9,10,15,24,48,72,96,120,144,168,192,216,240,264",
            "version": 1,
            "visible": true,
            "editable": true,
            "multiple": false
          }
        ],
        "importedWithCode": false
      },
      "dashboardname": "Investigation dashbaord"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 📊 **Subworkflow to Create a Dashboard**\n\n🧩 This subworkflow provides a simple and automated way to **create a dashboard** using a predefined JSON definition.\n\nIt is commonly used to **dynamically create investigation or troubleshooting dashboards** as part of automation workflows.\n\n---\n\n### 🎯 **Use Case**\n\nA typical use case is to **automatically create an investigation dashboard when a problem is raised**, allowing teams to quickly access all relevant data needed to analyze and resolve the issue.\n\nThis helps:\n- 🔍 Centralize relevant metrics and data\n- ⚡ Reduce time to investigation\n- 👥 Enable teams to collaborate using a shared, ready-to-use dashboard\n\n---\n\n### ⚙️ **Parameters**\n\n- **dashboardname** (Required): 🏷️ The name of the dashboard to be created.  \n- **dashboardjson** (Required): 🧾 The JSON definition of the dashboard to be created.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 📤 The subworkflow submits the provided dashboard JSON definition\n- 📊 A new dashboard is created with the specified name\n- ✅ If creation is successful, the subworkflow completes\n- ❌ If creation fails, the subworkflow fails—allowing the **parent workflow to retry or take alternative action**\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Commonly used in **incident or problem response workflows**\n- ✅ Enables on-demand creation of investigation dashboards\n- ✅ Works well with automated remediation and validation steps\n- ✅ Reduces manual dashboard setup during critical situations\n\n---",
    "tasks": {
      "create-dashboard": {
        "name": "create-dashboard",
        "input": {
          "script": "import { documentsClient } from \"@dynatrace-sdk/client-document\";\nimport { getEnvironmentUrl } from '@dynatrace-sdk/app-environment';\n\n\nexport default async function({executionId}) {      \n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n\n  let content = input.dashboardjson\n  let content_blob = new Blob([JSON.stringify(content, null, 2)], {\n    type: 'application/json',\n  })\n  \n  let config = {\n    \"body\": {\n      \"name\": \"\"+input.dashboardname+\"\",\n      \"type\": \"dashboard\",\n      \"content\": content_blob\n      }\n  }\n\n  let create = await documentsClient.createDocument(config)\n\n\n\n  let env_url = getEnvironmentUrl()\n  let dashboard_url = env_url+\"/ui/apps/dynatrace.dashboards/dashboard/\"+ create.id\n\n  \n  \n  return {\n           \"dashboard_url\": dashboard_url,\n           \"dashboard_name\": input.dashboardname,\n           \"dashboard_content\": create \n          };\n}\n  "
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-javascript",
        "timeout": 9000,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "79d6c870-e7e9-4c16-9830-195b6c7b12e1",
    "title": "🧩subworkflow - dynatrace create workflow",
    "description": "Subworkflow to create a workflow.\n\nThis Subworkflow is used to create a workflow.\nCan be used to store workflows and one button\nworkflow import through a workflow, in addition\nto complex subworkflow dependencies. \n\nParameters:\n\n(Required) The entire workflow json",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"create-workflow\") }}",
    "type": "STANDARD",
    "input": {
      "type": "STANDARD",
      "input": {},
      "tasks": {
        "test": {
          "name": "test",
          "input": {
            "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\n\nexport default async function () {\n  // your code goes here\n  // e.g. get the current execution\n  const ex = await execution();\n  console.log('Automated script execution on behalf of', ex.trigger);\n\n  return { triggeredBy: ex.trigger };\n}"
          },
          "action": "dynatrace.automations:run-javascript",
          "position": {
            "x": 0,
            "y": 1
          },
          "description": "Run custom JavaScript code.",
          "predecessors": []
        }
      },
      "title": "test_xc",
      "result": null,
      "trigger": {},
      "isPrivate": true,
      "ownerType": "USER",
      "description": "",
      "schemaVersion": 3,
      "hourlyExecutionLimit": 1000
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧩 **Subworkflow to Create a Workflow**\n\n⚙️ This subworkflow provides a simple and automated way to **create a workflow from a JSON definition**.\n\nIt is commonly used to **store workflows as code** and enable **one‑button workflow imports** through automation—making it easier to manage workflows with **complex subworkflow dependencies**.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 📦 Storing workflows in version control and importing them on demand  \n- ▶️ Enabling **one‑click workflow deployment** through another workflow  \n- 🧱 Managing **complex workflow and subworkflow dependency chains**  \n- 🔁 Promoting workflows across environments in a standardized way  \n\nThis approach supports **workflow‑as‑code** and helps teams scale automation safely and consistently.\n\n---\n\n### ⚙️ **Parameters**\n\n- **workflowjson** (Required): 🧾 The **complete JSON definition** of the workflow to be created.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 📤 The subworkflow submits the provided workflow JSON definition\n- 🛠️ A new workflow is created based on the supplied configuration\n- ✅ If creation is successful, the subworkflow completes\n- ❌ If creation fails, the subworkflow fails—allowing the **parent workflow to retry or take alternative action**\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed for **workflow lifecycle automation**\n- ✅ Enables repeatable and controlled workflow creation\n- ✅ Ideal for enablement, templates, and automation catalogs\n- ✅ Works well with Git‑based workflow storage and CI/CD patterns\n\n---",
    "tasks": {
      "create-workflow": {
        "name": "create-workflow",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { workflowsClient } from \"@dynatrace-sdk/client-automation\";\n\nexport default async function ({ executionId , action_execution_id }) {\n  // your code goes here\n  // e.g. get the current execution\n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n  \n  const data = await workflowsClient.createWorkflow({\n    body: input,\n  });\n  return data;\n}"
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-javascript",
        "timeout": 9000,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "81f63f98-d0a8-4c28-abfc-badaede707cf",
    "title": "🧩subworkflow - dynatrace delete user",
    "description": "",
    "ownerType": "USER",
    "isPrivate": true,
    "schemaVersion": 4,
    "trigger": {},
    "result": null,
    "type": "STANDARD",
    "input": {
      "email": "daniel.braaf@gmail.com",
      "dynatrace_account_id": "2270dc8a-c48b-4588-9c0f-bc98622ed777",
      "credential_vault_dynatrace_client_id": "dt-client-id",
      "credential_vault_dynatrace_client_secret": "dt-client-secret"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧩 **Subworkflow to Delete a Dynatrace User**\n\n⚙️ This subworkflow provides a simple and automated way to **delete a Dynatrace user**.\n\nIt is commonly used to **off-board users** from a Dynatrace account and can be used in onboarding/offboarding requests,\nfor example from ServiceNow, Jira, or Zendesk.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 🛑 Off-board users from a Dynatrace account\n\n---\n\n### ⚙️ **Parameters**\n\n- **email** (Required): 📧 The **email address** of the user to be off-boarded.\n- **dynatrace_account_id** (Required): 📧 The **account ID** of the account you would like to off-board the user from.\n- **credential_vault_dynatrace_client_id** (Required): 🔒 The **Credential Vault name** of the credential vault entry that contains the Dynatrace OAuth client ID.\n- **credential_vault_dynatrace_client_secret** (Required): 🔒 The **Credential Vault name** of the credential vault entry that contains the Dynatrace OAuth client secret.\n\n---\n\n### 🛠️ **Prerequisites**\n\nBefore running this workflow, Dynatrace OAuth credentials must be created with the following permissions:\n\n- account-idm-read\n- account-idm-write\n\nThe client ID and client secret must be stored in **separate Dynatrace Credential Vault entries**.\n\nOnce created, the names of the credential vault entries must be provided as input parameters to the workflow.",
    "tasks": {
      "delete-dynatrace-user": {
        "name": "delete-dynatrace-user",
        "input": {
          "script": "import { execution } from '@dynatrace-sdk/automation-utils';\nimport { credentialVaultClient } from '@dynatrace-sdk/client-classic-environment-v2';\n\n\n\nexport default async function ({ execution_id }) {\n\n  const ex = await execution(execution_id);\n  const { input } = await fetch(`/platform/automation/v1/executions/${execution_id}`).then((res) => res.json());\n\n  const  dt_client_id_vault = await credentialVaultClient.listCredentials({ name: \"\"+input.credential_vault_dynatrace_client_id+\"\", });\n  const  clientId_vault_id  = await credentialVaultClient.getCredentialsDetails({ id: dt_client_id_vault.credentials[0].id, });\n  const  clientId  = await clientId_vault_id.token;\n\n\n  const dt_client_secret_vault = await credentialVaultClient.listCredentials({ name: \"\"+input.credential_vault_dynatrace_client_secret+\"\", });\n  const clientSecret_vault_id  = await credentialVaultClient.getCredentialsDetails({ id: dt_client_secret_vault.credentials[0].id, });\n  const clientSecret  = await clientSecret_vault_id.token;\n\n\n  \n  const accountUuid = input.dynatrace_account_id;\n  \n\n  const scope = \"account-idm-read account-idm-write\";\n\n  // Get SSO token\n  const token = await fetch('https://sso.dynatrace.com/sso/oauth2/token', {\n      method: 'POST',\n      headers:{\n        'Content-Type': 'application/x-www-form-urlencoded'\n      },    \n      body: new URLSearchParams({\n          'grant_type': 'client_credentials',\n          'client_id': clientId,\n          'client_secret': clientSecret,\n          'scope': scope\n      })\n  }).then(response=>response.json())\n    .then(data=>{ return data.access_token; })\n\n  // Uncomment for testing purposes, outputs token in clear text \n  //console.log(\"Bearer token\" + token);\n\n  \n\n        \n  const deleteUser= await fetch('https://api.dynatrace.com/iam/v1/accounts/' + accountUuid + '/users/' + input.email, {\n    method: 'DELETE',\n    headers: { 'Content-Type': 'application/json',\n          'Authorization': 'Bearer ' + token}\n  })            \n            \n\n\n  \n  return;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "8a774787-e7b7-471a-b918-4e30298b5107",
    "title": "🧩subworkflow - dynatrace delete workflow",
    "description": "Subworkflow to delete a workflow.\n\nThis Subworkflow is used to delete a workflow.\nUse Case, can be used to Automatically delete\nun-authorized workflows.\n\nParameters:\n\nworkflowid: (Required) the workflow id of the workflow to be deleted",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"delete-workflow\") }}",
    "type": "STANDARD",
    "input": {
      "workflowid": "0cbff654-deb9-44c6-8f59-a888086f1714"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🗑️ **Subworkflow to Delete a Workflow**\n\n🧹 This subworkflow provides a simple and automated way to **delete an existing workflow**.\n\nIt is commonly used for **governance and cleanup scenarios**, such as automatically removing **unauthorized, deprecated, or non-compliant workflows** from an environment.\n\n✅ If the workflow is deleted successfully, the subworkflow completes.  \n❌ If the deletion fails, the subworkflow fails—allowing the **parent workflow to retry or take alternative action**.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 🚫 Automatically deleting **unauthorized workflows**\n- 🧼 Cleaning up obsolete or deprecated workflows\n- 🛡️ Enforcing automation governance and compliance\n- 🔁 Maintaining a controlled and standardized workflow environment\n\n---\n\n### ⚙️ **Parameters**\n\n- **workflowid** (Required): 🆔 The ID of the workflow to be deleted.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 📤 The subworkflow submits a delete request for the specified workflow ID\n- 🗑️ The workflow is removed from the environment\n- ✅ If deletion is successful, the subworkflow completes\n- ❌ If deletion fails, the subworkflow fails to enable **restart-on-error** handling in the parent workflow\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed for **workflow lifecycle management**\n- ✅ Useful in governance, compliance, and cleanup workflows\n- ✅ Complements workflow creation and export subworkflows\n- ✅ Supports automation-at-scale best practices\n\n---",
    "tasks": {
      "delete-workflow": {
        "name": "delete-workflow",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { workflowsClient } from \"@dynatrace-sdk/client-automation\";\n\nexport default async function ({ executionId , action_execution_id }) {\n  // your code goes here\n  // e.g. get the current execution\n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n  \n  const data = await workflowsClient.deleteWorkflow({\n    id: input.workflowid,\n  });\n  return data;\n}"
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-javascript",
        "timeout": 9000,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "15508756-7ee1-4c03-ad1b-d3d95aca478f",
    "title": "🧩subworkflow - dynatrace export one or all workflows to existing github repo",
    "description": "Subworkflow to export one or all workflows to a github repository\n\n7 parameters:\n\nworkflowId: (Optional) id of the workflow to export for example \"15508756-7ee1-4c03-ad1b-d3d95aca478f\" (if left empty \"\" all workflows will be exported)\nsearchLimit: (Required) maximum number of workflow to export\ngithubRepoName: (Required) Existing Repository name of Github Repo to export to \ngithubOwnerName: (Required) Github Onwer Name  \ngithubRepoBranchName: (Required) Github Branche name of repo to export to\ndynatraceGithubConnection: (Required) dynatrace github connection name\nadminAccess: (Required) true/false if false only workflows that the user has permissions to will be exported, if true and the user has workflow-admin rights then all workflows will be exported",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": null,
    "type": "STANDARD",
    "input": {
      "workflowId": "15508756-7ee1-4c03-ad1b-d3d95aca478f",
      "adminAccess": false,
      "searchLimit": "10",
      "githubRepoName": "playground_export",
      "githubOwnerName": "danatrace",
      "githubRepoBranchName": "demo_export",
      "dynatraceGithubConnection": "danatrace"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 📤 **Subworkflow to Export One or More Workflows to a GitHub Repository**\n\n📦 This subworkflow provides an automated way to **export one or all workflows to a GitHub repository**.\n\nIt supports **workflow-as-code** practices by enabling version control, backup, governance, and promotion of workflows across environments.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 🗂️ Backing up workflows to GitHub for safekeeping\n- 🔁 Promoting workflows between environments (dev → test → prod)\n- 🛡️ Supporting governance, audit, and compliance requirements\n- 📦 Managing workflows as code using Git-based processes\n\nThis subworkflow can export:\n- ✅ A **single workflow**, or  \n- ✅ **all workflows**, depending on configuration and permissions\n\n---\n\n### ⚙️ **Parameters**\n\n- **workflowId** (Optional): 🆔 The ID of a specific workflow to export  \n  *(for example: `15508756-7ee1-4c03-ad1b-d3d95aca478f`)*  \n  If left empty (`\"\"`), **all workflows** will be exported.\n\n- **searchLimit** (Required): 🔢 The maximum number of workflows to export.\n\n- **githubRepoName** (Required): 📁 The name of the **existing GitHub repository** to export workflows to.\n\n- **githubOwnerName** (Required): 👤 The GitHub **owner or organization name**.\n\n- **githubRepoBranchName** (Required): 🌿 The GitHub **branch name** to export to.\n\n- **dynatraceGithubConnection** (Required): 🔑 The Dynatrace GitHub connection name used for authentication.\n\n- **adminAccess** (Required): 🛡️ Boolean flag (`true` / `false`) controlling export scope:\n  - `false`: Only workflows the user has permission to access will be exported  \n  - `true`: If the user has **workflow-admin** rights, **all workflows** will be exported\n\n---\n\n### 🔗 **GitHub Connection Setup**\n\nBefore using this subworkflow, ensure that a **GitHub Connector** is configured in Dynatrace.\n\n📖 Official Dynatrace documentation:  \nhttps://docs.dynatrace.com/docs/analyze-explore-automate/workflows/actions/github/github-workflows-setup [1](https://docs.dynatrace.com/docs/analyze-explore-automate/workflows/actions/github/github-workflows-setup)\n\nThis guide explains how to:\n- Configure outbound access to GitHub\n- Create and authorize a GitHub connection\n- Generate and scope a GitHub personal access token\n- Make the connection available to workflows\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 🔍 Identify workflows based on `workflowId`, permissions, and `adminAccess`\n- 📤 Export workflow definitions to the specified GitHub repository and branch\n- ✅ Complete if export succeeds\n- ❌ Fail if export encounters an error, allowing the **parent workflow to retry or react**\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed for **workflow lifecycle and governance automation**\n- ✅ Enables Git-based workflow management\n- ✅ Complements workflow create, delete, and validation subworkflows\n- ✅ Supports automation-at-scale and CI/CD patterns\n\n---",
    "tasks": {
      "get-workflows": {
        "name": "get-workflows",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { workflowsClient} from \"@dynatrace-sdk/client-automation\";\n\nexport default async function({executionId}) {     \n  // get input\n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n  // set variables\n  var finalworkflowlist = []\n  // get all workflows\n  const result_getworkflows = await workflowsClient.getWorkflows({\n    adminAccess: input.adminAccess,\n    limit: input.searchLimit\n  });\n  // Transform to Object\n  const result_getworkflows_mod= result_getworkflows;\n  const result_getworkflows_json = JSON.stringify(result_getworkflows_mod);\n  var result_getworkflows_parse = await JSON.parse(result_getworkflows_json);\n  var workflowlist = await result_getworkflows_parse.results;\n  // removeing non ascii charachters\n  Object.entries(workflowlist).forEach(([key, value]) => {\n  finalworkflowlist.push({title:\"\"+value.title+\"__\"+value.id.replace(/[^\\x20-\\x7E]/g, '')+\"\", content: JSON.stringify(value).replace(/[^\\x20-\\x7E]/g, '')})\n  });\n  \n  console.log(\"Nr. of workflows found to export\" + finalworkflowlist.length)\n  return finalworkflowlist;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": -1,
          "y": 1
        },
        "conditions": {
          "else": "STOP",
          "custom": "{{input()[\"workflowId\"] == \"\"}}",
          "states": {}
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      },
      "get-one-workflow": {
        "name": "get-one-workflow",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { workflowsClient} from \"@dynatrace-sdk/client-automation\";\n\nexport default async function({executionId}) {     \n  // get input\n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n  // set variables\n  var finalworkflowlist = []\n  // get all workflows\n  const result_getworkflows = await workflowsClient.getWorkflows({\n    adminAccess: input.adminAccess,\n    limit: 1,\n    id: input.workflowId\n  });\n  // Transform to Object\n  const result_getworkflows_mod= result_getworkflows;\n  const result_getworkflows_json = JSON.stringify(result_getworkflows_mod);\n  var result_getworkflows_parse = await JSON.parse(result_getworkflows_json);\n  var workflowlist = await result_getworkflows_parse.results;\n  // removeing non ascii charachters\n  Object.entries(workflowlist).forEach(([key, value]) => {\n  finalworkflowlist.push({title:\"\"+value.title+\"__\"+value.id.replace(/[^\\x20-\\x7E]/g, '')+\"\", content: JSON.stringify(value).replace(/[^\\x20-\\x7E]/g, '')})\n  });\n  \n  console.log(\"Nr. of workflows found to export\" + finalworkflowlist.length)\n  return finalworkflowlist;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 1,
          "y": 1
        },
        "conditions": {
          "else": "STOP",
          "custom": "{{input()[\"workflowId\"] != \"\"}}",
          "states": {}
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      },
      "export-one-workflow-to-repo": {
        "name": "export-one-workflow-to-repo",
        "input": {
          "branch": "{{ input()[\"githubRepoBranchName\"] }}",
          "filePath": "{{_.item.title | replace(\" \", \"_\")}}.json",
          "repository": "{{ input()[\"githubRepoName\"] }}",
          "fileContent": "{{_.item.content}}",
          "connectionId": "{{ connection('app:dynatrace.github.connector:connection', input()[\"dynatraceGithubConnection\"]) }}",
          "commitMessage": "export_{{environment().id}}",
          "createNewBranch": false
        },
        "action": "dynatrace.github.connector:create-or-replace-file",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": 1,
          "y": 2
        },
        "conditions": {
          "states": {
            "get-one-workflow": "OK"
          }
        },
        "withItems": "item in {{ result(\"get-one-workflow\") }}",
        "concurrency": 1,
        "description": "Creates or replaces a file",
        "predecessors": [
          "get-one-workflow"
        ]
      },
      "export-all-workflows-to-repo": {
        "name": "export-all-workflows-to-repo",
        "input": {
          "branch": "{{ input()[\"githubRepoBranchName\"] }}",
          "filePath": "{{_.item.title | replace(\" \", \"_\")}}.json",
          "repository": "{{ input()[\"githubRepoName\"] }}",
          "fileContent": "{{_.item.content}}",
          "connectionId": "{{ connection('app:dynatrace.github.connector:connection', input()[\"dynatraceGithubConnection\"]) }}",
          "commitMessage": "export_{{environment().id}}",
          "createNewBranch": false
        },
        "action": "dynatrace.github.connector:create-or-replace-file",
        "active": true,
        "timeout": 604800,
        "position": {
          "x": -1,
          "y": 2
        },
        "conditions": {
          "custom": "{{input()[\"workflowId\"] == \"\"}}",
          "states": {
            "get-workflows": "OK"
          }
        },
        "withItems": "item in {{result(\"get-workflows\")}}",
        "concurrency": 1,
        "description": "Creates or replaces a file",
        "predecessors": [
          "get-workflows"
        ]
      }
    }
  },
  {
    "id": "67df876f-6e4a-4942-b565-7f40c502daec",
    "title": "🧩subworkflow - dynatrace get all problem data",
    "description": "Subworkflow to get all data of a Davis Problem.\n\nThe Davis Problem trigger does not contain all necessary information\nfrom a Problem card, for example the Impact field and affected users\nwhich is important to determine the Priority of a Problem, to then\nset a Priority in tracking tools like Jira and Service now. \nThis Sub Workflow makes it easy to get that addtional information\nwithout needing to know Javascript.\n\nThe Subworkflow also contains setting the priority for a Jira\nissue from the Data of the Problem card. This might not\nbe the same for every customer, but easy adjustable in the \nsection \"// calculate jira impact level\" in the get-problem-info\ntask.\n\nParameters:\n\nevent.id: (Required) Dyantrace event id",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"get-problem-info\") }}",
    "type": "STANDARD",
    "input": {
      "event.id": "2847618168410183866_1744904520000V2"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧠 **Subworkflow to Get All Data of a Problem**\n\n🔎 This subworkflow provides an easy way to **retrieve complete problem details** that are **not included in the standard problem trigger**.\n\nImportant information—such as **impact**, **affected users**, and other contextual fields—is often required to correctly determine the **priority of a problem** and to synchronize that priority with external tracking systems like **Jira** or **ServiceNow**.\n\nThis subworkflow makes it simple to access that additional data **without requiring JavaScript knowledge**.\n\n---\n\n### 🎯 **Use Case**\n\nA common use case is **enriching problem data before creating or updating tickets** in tracking tools.\n\nIn addition, this subworkflow includes logic to **set the priority of a Jira issue** based on the data retrieved from the problem card.\n\n⚙️ This logic may vary between environments, but it can be easily adjusted in the  \n`// calculate jira impact level` section of the **get‑problem‑info** task.\n\n---\n\n### ⚙️ **Parameters**\n\n- **event.id** (Required): 🆔 The Dynatrace event ID associated with the problem.\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed as a **data‑enrichment subworkflow**\n- ✅ Provides access to full problem context beyond trigger payloads\n- ✅ Enables accurate prioritization in Jira, ServiceNow, and other tools\n- ✅ Commonly used early in remediation or escalation workflows\n\n---",
    "tasks": {
      "get-problem-info": {
        "name": "get-problem-info",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { problemsClient } from '@dynatrace-sdk/client-classic-environment-v2';\nimport { getEnvironmentUrl } from \"@dynatrace-sdk/app-environment\";\n\nexport default async function ({ executionId }) {\n  // your code goes here\n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n\n  \n  console.log(input)\n  console.log(input.display_id)\n  \n\n  const data = await problemsClient.getProblem({\n    problemId: \"\"+input['event.id']+\"\"\n  });\n  //console.log(data)\n  // Leave comment\n\n\n  // calculate jira impact level\n  let impact = \"Lowest\"; // possible jira impact values Lowest, Low, Medium, High, Highest\n  let affected_users: number = 0;\n\n    // calculate amount of impacted users\n  for (let impacts of data.impactAnalysis.impacts) {\n      \n  affected_users = affected_users + impacts.estimatedAffectedUsers\n  console.log(affected_users);\n    \n    \n  }\n  \n  // if impactLevel equals APPLICATION and severityLevel equals AVAILABILITY and no affected users set priority to high\n  if (data.impactLevel == \"APPLICATION\" && data.severityLevel == \"AVAILABILITY\" && affected_users == 0) {\n  impact = \"High\";    \n  }\n  // if impactLevel equals APPLICATION and severityLevel equals AVAILABILITY and affected users set priority to highest\n  if (data.impactLevel == \"APPLICATION\" && data.severityLevel == \"AVAILABILITY\" &&  affected_users > 0) {\n  impact = \"Highest\";     \n  }\n\n  if (data.impactLevel == \"APPLICATION\" && data.severityLevel == \"RESOURCE_CONTENTION\" &&  affected_users > 0) {\n  impact = \"Highest\";     \n  }\n\n  if (data.impactLevel == \"APPLICATION\" && data.severityLevel == \"RESOURCE_CONTENTION\" && affected_users == 0) {\n  impact = \"High\";     \n  }\n  \n  \n  \n  \n  // with a focus on Business Resilience we always chose the highest priority if end users are affected\n  if (affected_users > 0) {\n  impact = \"Highest\";     \n  }\n\n  // add jira impact to problem details\n  data[\"jira_impact\"] = impact;\n  \n  console.log(\"Problem Impact Level: \"+data.impactLevel);\n  console.log(\"Problem Severity Level: \"+data.severityLevel);\n  console.log(\"Number of affected users: \"+affected_users);\n  console.log(\"Setting Jira Impact to: \"+impact);\n  \n\n  return data;\n}"
        },
        "retry": {
          "count": 5,
          "delay": 30,
          "failedLoopIterationsOnly": true
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "0a90e267-33ba-49e7-90a7-7b37fb87d24a",
    "title": "🧩subworkflow - dynatrace get event data",
    "description": "Subworkflow to get data of an event\n\nAn easy way to get data of an event by id.\n\n\nParameters:\nevent_id: (Required) Dyantrace Event id",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"dql-get-event\").records[0] }}",
    "type": "STANDARD",
    "input": {
      "event_id": ""
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧾 **Subworkflow to Get Data of an Event**\n\n🔍 This subworkflow provides a simple and standardized way to **retrieve detailed information for an event using its ID**.\n\nIt is commonly used to **enrich workflows with event context**, enabling better decision‑making, correlation, or downstream automation without needing custom scripting.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 📌 Enriching workflows with full event details\n- 🔗 Correlating events with problems, entities, or remediation steps\n- 🧠 Driving conditional logic based on event metadata\n- 🧩 Supporting investigation, escalation, or audit workflows\n\nThis subworkflow removes the need to manually query or parse event data.\n\n---\n\n### ⚙️ **Parameters**\n\n- **event_id** (Required): 🆔 The event ID to retrieve data for.\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed as a **helper / data‑enrichment subworkflow**\n- ✅ Works well as an early step in investigation or remediation workflows\n- ✅ Enables cleaner and more readable parent workflows\n- ✅ Complements problem, entity, and validation subworkflows\n\n---",
    "tasks": {
      "dql-get-event": {
        "name": "dql-get-event",
        "input": {
          "query": "fetch events, from:now()-8d \n| filter matchesphrase(event.id, \"{{input()[\"event_id\"] }}\")\n| sort timestamp desc\n| limit 1",
          "failOnEmptyResult": true
        },
        "action": "dynatrace.automations:execute-dql-query",
        "active": true,
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "states": {}
        },
        "description": "Executes DQL query",
        "predecessors": []
      }
    }
  },
  {
    "id": "9a868582-bf92-4d2c-aea5-90898f7e86b8",
    "title": "🧩subworkflow - dynatrace ingest custom alert",
    "description": "Subworkflow to ingest/create a custom alert into dynatrace without needed to know javascript\n\nParameters:\nCustom Alert Json",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"ingest-event\") }}",
    "type": "STANDARD",
    "input": {
      "title": "Security group 5.2 EC2 security groups should not allow ingress from 0.0.0.0/0 to remote server administration ports",
      "properties": {
        "region": "us-east-1",
        "source": "aws.securityhub",
        "account": "589650258462",
        "version": "0",
        "object.id": "arn:aws:ec2:us-east-1:589650258462:security-group/sg-067c64eafd2851f4c",
        "aws.region": "us-east-1",
        "event.kind": "SECURITY_EVENT",
        "event.name": "Compliance finding event",
        "finding.id": "arn:aws:securityhub:us-east-1:589650258462:subscription/cis-aws-foundations-benchmark/v/3.0.0/5.2/finding/325d0d40-09a2-4211-883a-b1952df68dba",
        "detail-type": "Security Hub Findings - Imported",
        "object.name": "arn:aws:ec2:us-east-1:589650258462:security-group/sg-067c64eafd2851f4c",
        "object.type": "AwsEc2SecurityGroup",
        "product.name": "Security Hub",
        "connection_id": "vu9U3hXa3q0AAAABAClhcHA6ZHluYXRyYWNlLmF3cy5zZWN1cml0eWh1Yjpjb25uZWN0aW9ucwAGdGVuYW50AAZ0ZW5hbnQAJGMzZjY1YTUwLTA2YTktM2NkNC1hODJhLTA0OTNhM2Y1NzJjOb7vVN4V2t6t",
        "event.version": "1.308",
        "finding.score": "0",
        "finding.title": "5.2 EC2 security groups should not allow ingress from 0.0.0.0/0 to remote server administration ports",
        "aws.account.id": "589650258462",
        "event.category": "COMPLIANCE",
        "event.provider": "AWS Security Hub",
        "finding.status": "FAILED",
        "product.vendor": "AWS",
        "aws.account.name": "AWS Sandbox Environments",
        "finding.severity": "INFORMATIONAL",
        "event.description": "A compliance control EC2.53 on an AwsEc2SecurityGroup object arn:aws:ec2:us-east-1:589650258462:security-group/sg-067c64eafd2851f4c had FAILED status.",
        "security_group_id": "sg-067c64eafd2851f4c",
        "compliance.control": "EC2.53",
        "affected_entity_ids": "https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#SecurityGroup:groupId=sg-067c64eafd2851f4c",
        "finding.description": "Public access to remote server administration ports, such as 22 and 3389, increases resource attack surface and unnecessarily raises the risk of resource compromise.",
        "finding.time.created": "2025-07-09T09:46:54.123000000Z",
        "affected_entity_types": "AWS Security Group",
        "dt.openpipeline.source": "/platform/ingest/v1/events.security",
        "dt.security.risk.level": "NONE",
        "dt.security.risk.score": 0,
        "aws.link.to.security.group": "https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#SecurityGroup:groupId=sg-067c64eafd2851f4c"
      }
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🚨 **Subworkflow to Ingest / Create a Custom Alert**\n\n🧩 This subworkflow provides a simple and standardized way to **ingest or create a custom alert** using a JSON definition—**without requiring JavaScript knowledge**.\n\nIt is commonly used to **raise custom alerts from automation workflows**, enabling visibility, correlation, and downstream actions based on conditions detected outside of built‑in alerting.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 🚦 Raising custom alerts from automation logic or validations  \n- 🔗 Integrating external signals or conditions into the alerting pipeline  \n- 🧠 Driving conditional workflows based on custom alert states  \n- 📣 Providing visibility for non-native or derived conditions  \n\nThis approach allows teams to extend alerting in a **controlled and repeatable** way.\n\n---\n\n### ⚙️ **Parameters**\n\n- **Custom Alert Json** (Required): 🧾 The full JSON definition of the custom alert to be ingested or created.\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed as a **helper / ingestion subworkflow**\n- ✅ Eliminates the need to write JavaScript for custom alert creation\n- ✅ Enables alert-driven automation patterns\n- ✅ Works well with remediation, escalation, and notification workflows\n\n---",
    "tasks": {
      "ingest-event": {
        "name": "ingest-event",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { EventIngest, EventIngestEventType, eventsClient } from '@dynatrace-sdk/client-classic-environment-v2';\nimport { getEnvironmentUrl } from \"@dynatrace-sdk/app-environment\";\n\nexport default async function ({ executionId }) {\n\n  \n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n\n  //console.log(input)\n\n  const xevent: EventIngest = {\n    eventType: EventIngestEventType.CustomAlert,\n    title: input.title,\n    properties: input.properties,\n  };\n  //console.log(xevent)\n  const result = await eventsClient.createEvent({ body: xevent })\n  console.log(result.eventIngestResults[0].correlationId)\n  let final: string | undefined | null;\n  while (final  === undefined  || final  === null || final  === \"\") {\n      const data = await eventsClient.getEvents({\n        eventSelector: \"correlationId(\\\"\"+result.eventIngestResults[0].correlationId+\"\\\")\"\n      });\n      final = data.events[0]\n  }\n  //console.log(data)\n  //console.log(data.events[0])\n  console.log(final)\n  return final;\n\n   \n\n  \n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "conditions": {
          "custom": "",
          "states": {}
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "74a063e4-576a-4955-b477-1c531bcf7ad1",
    "title": "🧩subworkflow - dynatrace ingest custom info event",
    "description": "Subworkflow to ingest a custom event into dynatrace without needed to know javascript\n\nParameters:\n(Required) Custom Event Json",
    "ownerType": "USER",
    "isPrivate": false,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"ingest-event\") }}",
    "type": "STANDARD",
    "input": {
      "title": "start disk cleanup on host",
      "properties": {
        "workflow": "test",
        "remediation_step": "start disk cleanup",
        "remediation_host_name": "test",
        "remediation_entity_name": "test"
      },
      "entitySelector": ""
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 📣 **Subworkflow to Ingest / Create a Custom Event**\n\n🧩 This subworkflow provides a simple and standardized way to **ingest or create a custom event** using a JSON definition—**without requiring JavaScript knowledge**.\n\nIt is commonly used to **emit custom events from automation workflows**, enabling correlation, visibility, and downstream actions based on conditions detected outside of built‑in event sources.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 🧠 Creating custom events from automation logic or validations  \n- 🔗 Enriching observability with events derived from external systems  \n- 🚦 Driving conditional workflows based on custom event signals  \n- 📊 Improving visibility for non-native or synthesized conditions  \n\nThis approach allows teams to extend event ingestion in a **controlled, repeatable, and automation-friendly way**.\n\n---\n\n### ⚙️ **Parameters**\n\n- **Custom Event Json** (Required): 🧾 The complete JSON definition of the custom event to be ingested.\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed as a **helper / ingestion subworkflow**\n- ✅ Eliminates the need to write JavaScript for custom event creation\n- ✅ Enables event-driven automation patterns\n- ✅ Works well with alerting, remediation, and escalation workflows\n\n---",
    "tasks": {
      "ingest-event": {
        "name": "ingest-event",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { EventIngest, EventIngestEventType, eventsClient } from '@dynatrace-sdk/client-classic-environment-v2';\nimport { getEnvironmentUrl } from \"@dynatrace-sdk/app-environment\";\n\nexport default async function ({ executionId }) {\n\n  \n  const { input } = await fetch(`/platform/automation/v1/executions/${executionId}`).then((res) => res.json());\n\n  console.log(input.entitySelector)\n\n\n  let final: string | undefined | null;\n  if (input.entitySelector == \"\") {\n      const xevent: EventIngest = {\n        eventType: EventIngestEventType.CustomInfo,\n        title: input.title,\n        properties: input.properties, \n      };\n      console.log(xevent)\n      const result = await eventsClient.createEvent({ body: xevent })\n      while (final  === undefined  || final  === null || final  === \"\") {\n          const data = await eventsClient.getEvents({\n            eventSelector: \"correlationId(\\\"\"+result.eventIngestResults[0].correlationId+\"\\\")\"\n          });\n          final = data.events[0]\n      }\n\n    \n      return final;\n   \n  } else {\n      const xevent: EventIngest = {\n            eventType: EventIngestEventType.CustomInfo,\n            title: input.title,\n            entitySelector: input.entitySelector,\n            properties: input.properties,\n      };\n      console.log(xevent)\n      const result = await eventsClient.createEvent({ body: xevent })\n      while (final  === undefined  || final  === null || final  === \"\") {\n          const data = await eventsClient.getEvents({\n            eventSelector: \"correlationId(\\\"\"+result.eventIngestResults[0].correlationId+\"\\\")\"\n          });\n          final = data.events[0]\n      }\n\n    \n      return final;\n  }\n    \n\n  \n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "4bc6daa1-b0a5-466d-9896-36f8c35fea3c",
    "title": "🧩subworkflow - dynatrace invite user",
    "description": "",
    "ownerType": "USER",
    "isPrivate": true,
    "schemaVersion": 4,
    "trigger": {},
    "result": null,
    "type": "STANDARD",
    "input": {
      "email": "test@gmail.com",
      "dynatrace_account_id": "2270dc8a-c48b-4588-9c0f-bc98622ed767",
      "credential_vault_dynatrace_client_id": "dt-client-id",
      "credential_vault_dynatrace_client_secret": "dt-client-secret"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧩 **Subworkflow to Invite a Dynatrace User**\n\n⚙️ This subworkflow provides a simple and automated way to **Invite a Dynatrace user**.\n\nIt is commonly used to **on-board users** to a Dynatrace account and can be used in onboarding/offboarding requests,\nfor example from ServiceNow, Jira, or Zendesk.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 🟢 On-board users to a Dynatrace account\n\n---\n\n### ⚙️ **Parameters**\n\n- **email** (Required): 📧 The **email address** of the user to be on-boarded.\n- **dynatrace_account_id** (Required): 📧 The **account ID** of the account you would like to on-board the user to.\n- **credential_vault_dynatrace_client_id** (Required): 🔒 The **Credential Vault name** of the credential vault entry that contains the Dynatrace OAuth client ID.\n- **credential_vault_dynatrace_client_secret** (Required): 🔒 The **Credential Vault name** of the credential vault entry that contains the Dynatrace OAuth client secret.\n\n---\n\n### 🛠️ **Prerequisites**\n\nBefore running this workflow, Dynatrace OAuth credentials must be created with the following permissions:\n\n- account-idm-read\n- account-idm-write\n\nThe client ID and client secret must be stored in **separate Dynatrace Credential Vault entries**.\n\nOnce created, the names of the credential vault entries must be provided as input parameters to the workflow.",
    "tasks": {
      "invite-dynatrace-user": {
        "name": "invite-dynatrace-user",
        "input": {
          "script": "import { execution } from '@dynatrace-sdk/automation-utils';\nimport { credentialVaultClient } from '@dynatrace-sdk/client-classic-environment-v2';\n\n\n\nexport default async function ({ execution_id }) {\n\n  const ex = await execution(execution_id);\n  const { input } = await fetch(`/platform/automation/v1/executions/${execution_id}`).then((res) => res.json());\n\n  const  dt_client_id_vault = await credentialVaultClient.listCredentials({ name: \"\"+input.credential_vault_dynatrace_client_id+\"\", });\n  const  clientId_vault_id  = await credentialVaultClient.getCredentialsDetails({ id: dt_client_id_vault.credentials[0].id, });\n  const  clientId  = await clientId_vault_id.token;\n\n\n  const dt_client_secret_vault = await credentialVaultClient.listCredentials({ name: \"\"+input.credential_vault_dynatrace_client_secret+\"\", });\n  const clientSecret_vault_id  = await credentialVaultClient.getCredentialsDetails({ id: dt_client_secret_vault.credentials[0].id, });\n  const clientSecret  = await clientSecret_vault_id.token;\n\n\n  \n  const accountUuid = input.dynatrace_account_id;\n  \n\n  const scope = \"account-idm-read account-idm-write\";\n  const body = { email: input.email }\n\n  // Get SSO token\n  const token = await fetch('https://sso.dynatrace.com/sso/oauth2/token', {\n      method: 'POST',\n      headers:{\n        'Content-Type': 'application/x-www-form-urlencoded'\n      },    \n      body: new URLSearchParams({\n          'grant_type': 'client_credentials',\n          'client_id': clientId,\n          'client_secret': clientSecret,\n          'scope': scope\n      })\n  }).then(response=>response.json())\n    .then(data=>{ return data.access_token; })\n\n  // Uncomment for testing purposes, outputs token in clear text \n  //console.log(\"Bearer token\" + token);\n\n  \n\n        \n  const createUser= await fetch('https://api.dynatrace.com/iam/v1/accounts/' + accountUuid + '/users', {\n    method: 'POST',\n    headers: { 'Accept': 'application/json', \n          'Content-Type': 'application/json',\n          'Authorization': 'Bearer ' + token},\n    body: JSON.stringify(body)\n  })            \n            \n  console.log(createUser)\n\n  \n  return createUser;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "c15fcbc9-9f7d-4d7d-a273-ed62073d19b6",
    "title": "🧩subworkflow - openai Text and Prompting",
    "description": "This is a Subworkflow to Text and prompt open ai\n\nUse Case, write a Business Letter to a group of\nusers that where affected by problems detected\nthrough Dynatrace\n\nTo get this subworkflow running you will have to create a credential vault entry with the open-ai token\nand set it in the ask-open-ai task under authentication!\n\n\n\nParameters:\ninput: (Required) Prompt to send to open ai\nmodel: (Required) Ai model to be used for example (gpt-4.1)",
    "ownerType": "USER",
    "isPrivate": true,
    "schemaVersion": 3,
    "trigger": {},
    "result": "{{ result(\"ask-open-ai\") }}",
    "type": "STANDARD",
    "input": {
      "input": "can you convert this splunk spl into dynatrace dql 'host=p*wcs* \"*Agile Parcel Express \" + serviceName + \" service is disabled.*\"' please return only the dql query",
      "model": "gpt-4.1"
    },
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧠 **Subworkflow to Text and Prompt OpenAI**\n\n✍️ This subworkflow provides a simple and automated way to **send text prompts to OpenAI** and use the generated output directly within a workflow.\n\nIt is commonly used for **communication, content generation, and response automation** based on operational events or workflow context.\n\n---\n\n### 🎯 **Use Case**\n\nA typical use case is to **generate a business letter or customer communication** for a group of users who were affected by detected problems.\n\nThis enables:\n- 📣 Automated customer or stakeholder communication  \n- 🧾 Consistent, professional messaging  \n- ⚡ Faster response without manual drafting  \n\n---\n\n### 🔐 **Authentication Requirement**\n\n⚠️ To use this subworkflow, you must create a **Credential Vault entry** containing your **OpenAI API token**.\n\nThe credential must then be referenced in the **`ask-open-ai`** task under the **authentication** settings.\n\n---\n\n### ⚙️ **Parameters**\n\n- **input** (Required): 🧾 The prompt text to send to OpenAI.  \n- **model** (Required): 🧠 The AI model to use  \n  *(for example: `gpt-4.1`)*\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed for **AI-assisted automation**\n- ✅ Enables natural-language output from workflows\n- ✅ Useful for notifications, summaries, and business communications\n- ✅ Can be combined with problem, event, or data-enrichment subworkflows\n\n---",
    "tasks": {
      "ask-open-ai": {
        "name": "ask-open-ai",
        "input": {
          "url": "https://api.openai.com/v1/responses",
          "method": "POST",
          "headers": {
            "Content-Type": "Application/json"
          },
          "payload": "{{ input() }}",
          "credential": {
            "type": "token",
            "tokenPrefix": "Bearer",
            "credentialId": "CREDENTIALS_VAULT-3D2695F22071F6D9"
          },
          "failOnResponseCodes": "400-599"
        },
        "action": "dynatrace.automations:http-function",
        "active": true,
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Issue an HTTP request to any API.",
        "predecessors": []
      }
    }
  },
  {
    "id": "5615f430-6a12-4a4e-85da-bad59967934e",
    "title": "🧩subworkflow - dynatrace set all workflows of owner to draft",
    "description": "subworkflow that sets all workflows of the owner of the \"subworkflow - set all workflows of owner to draft\" workflow to draft\n\nWhen workflow is started it takes the owner of this workflow, searches for all workflows of that owner and turns them into drafts.\n\nThis workflow does not need input parameters",
    "ownerType": "USER",
    "isPrivate": true,
    "schemaVersion": 3,
    "trigger": {},
    "result": null,
    "type": "STANDARD",
    "input": {},
    "hourlyExecutionLimit": 1000,
    "guide": "## 🧩 **Subworkflow to Set All Workflows of the Owner to Draft**\n\n🛠️ This subworkflow provides an automated way to **set all workflows owned by the current workflow owner to draft**.\n\nWhen the subworkflow is started, it:\n- 👤 Identifies the **owner of the running workflow**\n- 🔍 Searches for **all workflows owned by that user**\n- 📝 Transitions each workflow into **draft state**\n\nThis is especially useful for **governance, bulk control, or emergency rollback scenarios**.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- 🚫 Temporarily disabling all workflows owned by a specific user\n- 🧼 Bulk workflow control during governance or audit activities\n- 🛡️ Preventing execution of workflows during incidents or investigations\n- 🔁 Pausing automation before making bulk changes or cleanups\n\n---\n\n### ⚙️ **Parameters**\n\n🚫 This subworkflow **does not require any input parameters**.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 👤 Determine the owner of the executing workflow\n- 🔍 Locate all workflows owned by that user\n- 📝 Set each workflow to **draft**\n- ✅ Complete if successful\n- ❌ Fail if an error occurs, allowing the **parent workflow to retry or take alternative action**\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed for **workflow governance and lifecycle control**\n- ✅ Enables centralized bulk actions\n- ✅ Complements workflow create, delete, and export subworkflows\n- ✅ Supports automation-at-scale best practices\n\n---",
    "tasks": {
      "set-workflows-to-draft": {
        "name": "set-workflows-to-draft",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { workflowsClient } from \"@dynatrace-sdk/client-automation\";\n\nexport default async function ({ execution_id }) {\n  // your code goes here\n  // e.g. get the current execution\n  const ex = await execution(execution_id);\n  console.log(ex.workflow)\n\n\n  const getowner = await workflowsClient.getWorkflows({\n    adminAccess: true,\n    id: ex.workflow,\n  });\n  \n\n  const data = await workflowsClient.getWorkflows({\n    limit: 1000,\n    adminAccess: true,\n    owner: getowner.results[0].owner,\n  });\n\n\n  let i = 0;\n  \n  while (i < data.results.length) {\n\n      if (data.results[i].isDeployed === true){\n         console.log(data.results[i].isDeployed);\n         console.log(data.results[i].id);\n         //console.log(data.results[i]);  \n        \n      const dataxx = await workflowsClient.updateWorkflow({\n      adminAccess: true,\n      id: \"\"+ data.results[i].id +\"\",\n      body: { isDeployed: false },  \n      });\n      console.log(data.results[i].title ) \n      }\n      i++;\n  }\n\n\n  \n  return data.results.length;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  },
  {
    "id": "9dfec335-3f95-422c-b950-946ffc352182",
    "title": "🧩subworkflow - dynatrace set all workflows of owner to live (deployed)",
    "description": "subworkflow that sets all workflows of the owner of the \"subworkflow - set all workflows of owner to draft\" workflow to live (Deployed)\n\nWhen workflow is started it takes the owner of this workflow, searches for all workflows of that owner and deploys them to live.\n\nThis workflow does not need input parameters",
    "ownerType": "USER",
    "isPrivate": true,
    "schemaVersion": 3,
    "trigger": {},
    "result": null,
    "type": "STANDARD",
    "input": {},
    "hourlyExecutionLimit": 1000,
    "guide": "## 🚀 **Subworkflow to Set All Workflows of the Owner to Live (Deployed)**\n\n✅ This subworkflow provides an automated way to **deploy all workflows owned by the current workflow owner to Live**.\n\nWhen the subworkflow is started, it:\n- 👤 Identifies the **owner of the running workflow**\n- 🔍 Searches for **all workflows owned by that user**\n- 🚀 Deploys each workflow to **Live (Deployed)** state\n\nThis is especially useful for **bulk activation, controlled rollouts, or recovery scenarios** after maintenance or governance actions.\n\n---\n\n### 🎯 **Use Case**\n\nTypical use cases include:\n\n- ▶️ Re‑enabling all workflows owned by a user after maintenance\n- 🔁 Bulk deployment following workflow updates or imports\n- 🧪 Promoting workflows from draft to live in enablement or test scenarios\n- ⚡ Rapid recovery after workflows were temporarily set to draft\n\n---\n\n### ⚙️ **Parameters**\n\n🚫 This subworkflow **does not require any input parameters**.\n\n---\n\n### 🧠 **Workflow Logic**\n\n- 👤 Determine the owner of the executing workflow\n- 🔍 Locate all workflows owned by that user\n- 🚀 Set each workflow to **Live (Deployed)**\n- ✅ Complete if successful\n- ❌ Fail if an error occurs, allowing the **parent workflow to retry or take alternative action**\n\n---\n\n### 🧩 **Usage Context**\n\n- ✅ Designed for **workflow lifecycle and governance control**\n- ✅ Enables centralized bulk deployment actions\n- ✅ Complements:\n  - Set workflows to draft  \n  - Create / delete workflows  \n  - Export and import workflows  \n- ✅ Supports automation-at-scale and controlled rollout strategies\n\n---\n``",
    "tasks": {
      "set-workflows-to-draft": {
        "name": "set-workflows-to-draft",
        "input": {
          "script": "// optional import of sdk modules\nimport { execution } from '@dynatrace-sdk/automation-utils';\nimport { workflowsClient } from \"@dynatrace-sdk/client-automation\";\n\nexport default async function ({ execution_id }) {\n  // your code goes here\n  // e.g. get the current execution\n  const ex = await execution(execution_id);\n  console.log(ex.workflow)\n\n\n  const getowner = await workflowsClient.getWorkflows({\n    adminAccess: true,\n    id: ex.workflow,\n  });\n  \n\n  const data = await workflowsClient.getWorkflows({\n    limit: 1000,\n    adminAccess: true,\n    owner: getowner.results[0].owner,\n  });\n\n\n  let i = 0;\n  \n  while (i < data.results.length) {\n\n      if (data.results[i].isDeployed === false){\n         console.log(data.results[i].isDeployed);\n         console.log(data.results[i].id);\n         //console.log(data.results[i]);  \n        \n      const dataxx = await workflowsClient.updateWorkflow({\n      adminAccess: true,\n      id: \"\"+ data.results[i].id +\"\",\n      body: { isDeployed: true},  \n      });\n      console.log(data.results[i].title ) \n      }\n      i++;\n  }\n\n\n  \n  return data.results.length;\n}"
        },
        "action": "dynatrace.automations:run-javascript",
        "position": {
          "x": 0,
          "y": 1
        },
        "description": "Run custom JavaScript code.",
        "predecessors": []
      }
    }
  }
] as const;
