# 🔷 Azure Remediation Subworkflows — Staging Area

> ⚠️ **These subworkflows have not yet been tested in a live Dynatrace environment.**
> Once validated, add the 🧩 prefix to each title and move the files to the root of the repository.

This folder contains **50 Azure remediation subworkflows** plus **1 supporting wait-for helper** built for the Dynatrace Automation Engine. Each subworkflow targets a high-frequency enterprise Azure outage scenario, executing remediation via **Azure Automation runbooks**. Every subworkflow follows the **wait-and-verify** pattern — none are fire-and-forget.

---

## 🏗️ How Every Subworkflow Works

Each subworkflow follows an identical 3-task execution chain:

```
[1] azure_automation_start_runbook_job_1
        ↓  Starts the Azure Automation runbook job
[2] wait-for-azure-runbook-job-completed
        ↓  Polls until the job finishes (up to 7 days, retry × 99, delay 60s)
[3] check-status
        ✅ Verifies jobStatus === Completed, throws on failure
```

### ⚙️ Common Input Parameters

| Parameter | Required | Description |
|---|---|---|
| `primaryResourceId` | ✅ Yes | The Azure resource name / ID to remediate |
| `azuresubscriptionid` | ✅ Yes | Azure Subscription ID |
| `azureresourcegroup` | ✅ Yes | Resource group of the target resource |
| `automationresourcegroup` | ✅ Yes | Resource group of the Automation Account |
| `automationaccountname` | ✅ Yes | Azure Automation Account that hosts the runbooks |
| `dynatraceazureconnection` | ✅ Yes | Dynatrace Azure OIDC connection name |

### 🔗 Required Dependency

All 50 subworkflows depend on:
> **`subworkflow - azure wait for automation runbook job`**
> File: [subworkflow-azure-wait-for-automation-runbook-job.workflow.json](subworkflow-azure-wait-for-automation-runbook-job.workflow.json)

---

## 🚀 Setup & Deployment Steps

Before these subworkflows can run, complete the following one-time setup:

### Step 1 — Deploy the Wait-For Helper

1. Import `subworkflow-azure-wait-for-automation-runbook-job.workflow.json` into Dynatrace
2. Deploy the workflow to get a live version
3. Copy the workflow ID from the Dynatrace UI (Settings → API access or URL)

### Step 2 — Update the Wait-For Workflow ID

All 50 remediation files currently reference the placeholder workflow ID `a0000000-0000-4000-a000-000000000000`.  
Replace it with the real deployed ID using this command:

```bash
REAL_ID="your-deployed-workflow-id-here"
cd azure/
for f in subworkflow-azure-remediate-*.workflow.json; do
  sed -i "s/a0000000-0000-4000-a000-000000000000/$REAL_ID/g" "$f"
done
echo "Updated $(ls subworkflow-azure-remediate-*.workflow.json | wc -l) files"
```

### Step 3 — Create Azure Automation Runbooks

The runbook names referenced in each subworkflow (e.g. `Invoke-AzVMRestart`) are **conventions** — they must be created in your Azure Automation Account.  
Each runbook should accept these standard parameters:
- `PrimaryResourceId` — the resource to remediate
- `ResourceGroup` — resource group of the target
- `SubscriptionId` — Azure subscription

### Step 4 — Configure Dynatrace Azure Connection

Ensure a Dynatrace Azure OIDC connection named `azureplayground` (or your preferred name) is configured under **Settings → Connections → Azure** in Dynatrace.

---

## 📋 Subworkflow Catalogue

### 🖥️ Virtual Machines (Azure VM)

| # | File | Use Case |
|---|---|---|
| 1 | [subworkflow-azure-remediate-restart-vm.workflow.json](subworkflow-azure-remediate-restart-vm.workflow.json) | Restart Azure VM to recover from compute availability issues |
| 2 | [subworkflow-azure-remediate-restart-vm-by-tag.workflow.json](subworkflow-azure-remediate-restart-vm-by-tag.workflow.json) | Restart Azure VMs selected by resource tag during zonal incidents |
| 3 | [subworkflow-azure-remediate-deallocate-and-start-vm.workflow.json](subworkflow-azure-remediate-deallocate-and-start-vm.workflow.json) | Deallocate and restart Azure VM to force a new hardware allocation |
| 4 | [subworkflow-azure-remediate-recover-vm-from-failed-state.workflow.json](subworkflow-azure-remediate-recover-vm-from-failed-state.workflow.json) | Recover Azure VM stuck in a failed provisioning state via reapply |
| 5 | [subworkflow-azure-remediate-stop-runaway-process-on-vm.workflow.json](subworkflow-azure-remediate-stop-runaway-process-on-vm.workflow.json) | Stop a runaway process on an Azure VM via automation runbook |
| 6 | [subworkflow-azure-remediate-quarantine-vm-nsg.workflow.json](subworkflow-azure-remediate-quarantine-vm-nsg.workflow.json) | Isolate a compromised Azure VM by tightening NSG rules |
| 7 | [subworkflow-azure-remediate-detach-public-ip-from-vm.workflow.json](subworkflow-azure-remediate-detach-public-ip-from-vm.workflow.json) | Remove public IP from an Azure VM during a security incident |

---

### 💾 Managed Disks & Storage

| # | File | Use Case |
|---|---|---|
| 8 | [subworkflow-azure-remediate-resize-managed-disk.workflow.json](subworkflow-azure-remediate-resize-managed-disk.workflow.json) | Expand an Azure managed disk to resolve disk saturation outages |
| 9 | [subworkflow-azure-remediate-recover-managed-disk-from-snapshot.workflow.json](subworkflow-azure-remediate-recover-managed-disk-from-snapshot.workflow.json) | Restore an Azure managed disk from its latest snapshot during impairment |
| 10 | [subworkflow-azure-remediate-enable-disk-encryption.workflow.json](subworkflow-azure-remediate-enable-disk-encryption.workflow.json) | Enable Azure managed disk encryption as a security compliance remediation |
| 11 | [subworkflow-azure-remediate-block-storage-account-public-access.workflow.json](subworkflow-azure-remediate-block-storage-account-public-access.workflow.json) | Block public network access on an Azure Storage Account during a security incident |
| 12 | [subworkflow-azure-remediate-restore-blob-soft-deleted.workflow.json](subworkflow-azure-remediate-restore-blob-soft-deleted.workflow.json) | Restore soft-deleted Azure Blob containers after accidental deletion |

---

### ☸️ AKS & Kubernetes

| # | File | Use Case |
|---|---|---|
| 13 | [subworkflow-azure-remediate-restart-aks-deployment.workflow.json](subworkflow-azure-remediate-restart-aks-deployment.workflow.json) | Restart an AKS deployment rollout to recover unhealthy pods |
| 14 | [subworkflow-azure-remediate-cordon-drain-aks-node.workflow.json](subworkflow-azure-remediate-cordon-drain-aks-node.workflow.json) | Cordon and drain an unhealthy AKS node to stabilize workloads |
| 15 | [subworkflow-azure-remediate-recreate-aks-nodepool.workflow.json](subworkflow-azure-remediate-recreate-aks-nodepool.workflow.json) | Recreate a degraded AKS node pool during cluster degradation |

---

### 🐳 Container Instances & Container Apps

| # | File | Use Case |
|---|---|---|
| 16 | [subworkflow-azure-remediate-restart-container-instance.workflow.json](subworkflow-azure-remediate-restart-container-instance.workflow.json) | Restart an Azure Container Instance group to recover from runtime failures |
| 17 | [subworkflow-azure-remediate-restart-container-app.workflow.json](subworkflow-azure-remediate-restart-container-app.workflow.json) | Restart an Azure Container App revision to recover from runtime failures |
| 18 | [subworkflow-azure-remediate-scale-out-container-app.workflow.json](subworkflow-azure-remediate-scale-out-container-app.workflow.json) | Scale out an Azure Container App to recover from under-provisioning outages |

---

### 🌐 App Service & Functions

| # | File | Use Case |
|---|---|---|
| 19 | [subworkflow-azure-remediate-restart-app-service.workflow.json](subworkflow-azure-remediate-restart-app-service.workflow.json) | Restart an Azure App Service web app to recover from runtime outages |
| 20 | [subworkflow-azure-remediate-swap-app-service-slots.workflow.json](subworkflow-azure-remediate-swap-app-service-slots.workflow.json) | Swap App Service deployment slots to roll back a bad release |
| 21 | [subworkflow-azure-remediate-restart-function-app.workflow.json](subworkflow-azure-remediate-restart-function-app.workflow.json) | Restart an Azure Function App to clear runtime issues and recover execution |
| 22 | [subworkflow-azure-remediate-swap-function-app-slots.workflow.json](subworkflow-azure-remediate-swap-function-app-slots.workflow.json) | Swap Function App deployment slots to roll back a bad serverless release |
| 23 | [subworkflow-azure-remediate-scale-function-app-plan.workflow.json](subworkflow-azure-remediate-scale-function-app-plan.workflow.json) | Scale out the Azure Function App premium plan to resolve capacity exhaustion |

---

### 🗄️ Azure SQL, PostgreSQL & MySQL

| # | File | Use Case |
|---|---|---|
| 24 | [subworkflow-azure-remediate-restart-azure-sql.workflow.json](subworkflow-azure-remediate-restart-azure-sql.workflow.json) | Restart an Azure SQL Database server to recover its availability |
| 25 | [subworkflow-azure-remediate-failover-sql-managed-instance.workflow.json](subworkflow-azure-remediate-failover-sql-managed-instance.workflow.json) | Failover Azure SQL Managed Instance to its secondary replica |
| 26 | [subworkflow-azure-remediate-restart-azure-postgresql.workflow.json](subworkflow-azure-remediate-restart-azure-postgresql.workflow.json) | Restart Azure Database for PostgreSQL to recover service availability |
| 27 | [subworkflow-azure-remediate-restart-azure-mysql.workflow.json](subworkflow-azure-remediate-restart-azure-mysql.workflow.json) | Restart Azure Database for MySQL to recover service availability |
| 28 | [subworkflow-azure-remediate-rotate-azure-sql-admin-password.workflow.json](subworkflow-azure-remediate-rotate-azure-sql-admin-password.workflow.json) | Rotate the Azure SQL administrator password during a credential security incident |

---

### 🌍 Cosmos DB

| # | File | Use Case |
|---|---|---|
| 29 | [subworkflow-azure-remediate-failover-cosmos-db.workflow.json](subworkflow-azure-remediate-failover-cosmos-db.workflow.json) | Trigger an Azure Cosmos DB account regional failover to recover database availability |
| 30 | [subworkflow-azure-remediate-scale-cosmos-db-throughput.workflow.json](subworkflow-azure-remediate-scale-cosmos-db-throughput.workflow.json) | Scale Azure Cosmos DB manual throughput to resolve RU throttling incidents |

---

### 📨 Service Bus & Event Hubs

| # | File | Use Case |
|---|---|---|
| 31 | [subworkflow-azure-remediate-purge-service-bus-queue.workflow.json](subworkflow-azure-remediate-purge-service-bus-queue.workflow.json) | Purge a poison-message backlog from an Azure Service Bus Queue during an incident |
| 32 | [subworkflow-azure-remediate-update-service-bus-lock-duration.workflow.json](subworkflow-azure-remediate-update-service-bus-lock-duration.workflow.json) | Increase Azure Service Bus Queue message lock duration to reduce duplicate processing |
| 33 | [subworkflow-azure-remediate-enable-service-bus-dlq.workflow.json](subworkflow-azure-remediate-enable-service-bus-dlq.workflow.json) | Enable dead-letter queue forwarding for failed Azure Service Bus deliveries |
| 34 | [subworkflow-azure-remediate-restart-event-hubs-namespace.workflow.json](subworkflow-azure-remediate-restart-event-hubs-namespace.workflow.json) | Restart an Azure Event Hubs namespace to recover broker and partition availability |
| 35 | [subworkflow-azure-remediate-reset-event-hub-consumer-group.workflow.json](subworkflow-azure-remediate-reset-event-hub-consumer-group.workflow.json) | Reset an Event Hub consumer group checkpoint to recover from consumer lag incidents |

---

### 🌐 Networking & VPN

| # | File | Use Case |
|---|---|---|
| 36 | [subworkflow-azure-remediate-enable-nsg-flow-logs.workflow.json](subworkflow-azure-remediate-enable-nsg-flow-logs.workflow.json) | Enable NSG flow logs via Azure Network Watcher during network outage investigation |
| 37 | [subworkflow-azure-remediate-reset-vpn-gateway-connection.workflow.json](subworkflow-azure-remediate-reset-vpn-gateway-connection.workflow.json) | Reset an Azure VPN Gateway connection to restore hybrid network connectivity |
| 38 | [subworkflow-azure-remediate-reattach-vnet-gateway.workflow.json](subworkflow-azure-remediate-reattach-vnet-gateway.workflow.json) | Restore a VNet gateway attachment after a routing disruption incident |
| 39 | [subworkflow-azure-remediate-fix-route-table-next-hop.workflow.json](subworkflow-azure-remediate-fix-route-table-next-hop.workflow.json) | Fix an Azure route table next-hop entry to restore broken egress traffic routing |
| 40 | [subworkflow-azure-remediate-detach-stale-nic.workflow.json](subworkflow-azure-remediate-detach-stale-nic.workflow.json) | Detach a stale Azure NIC that is blocking VM lifecycle operations |

---

### 🔴 Cache & Search

| # | File | Use Case |
|---|---|---|
| 41 | [subworkflow-azure-remediate-restart-redis-cache.workflow.json](subworkflow-azure-remediate-restart-redis-cache.workflow.json) | Restart an Azure Cache for Redis instance to recover from availability issues |
| 42 | [subworkflow-azure-remediate-failover-redis-geo-replication.workflow.json](subworkflow-azure-remediate-failover-redis-geo-replication.workflow.json) | Trigger Azure Redis Cache geo-replication failover when the primary node fails |
| 43 | [subworkflow-azure-remediate-restart-cognitive-search.workflow.json](subworkflow-azure-remediate-restart-cognitive-search.workflow.json) | Restart Azure AI Search (Cognitive Search) service to recover degraded availability |

---

### 🌍 CDN, Front Door & Traffic Manager

| # | File | Use Case |
|---|---|---|
| 44 | [subworkflow-azure-remediate-purge-cdn-cache.workflow.json](subworkflow-azure-remediate-purge-cdn-cache.workflow.json) | Purge stale Azure CDN endpoint cache after a faulty content deployment |
| 45 | [subworkflow-azure-remediate-purge-front-door-cache.workflow.json](subworkflow-azure-remediate-purge-front-door-cache.workflow.json) | Purge stale Azure Front Door cache after a bad edge content rollout |
| 46 | [subworkflow-azure-remediate-enable-traffic-manager-endpoint.workflow.json](subworkflow-azure-remediate-enable-traffic-manager-endpoint.workflow.json) | Re-enable a disabled Azure Traffic Manager endpoint to restore DNS-based routing |

---

### 🏗️ ARM Deployments (Infrastructure as Code)

| # | File | Use Case |
|---|---|---|
| 47 | [subworkflow-azure-remediate-cancel-arm-deployment.workflow.json](subworkflow-azure-remediate-cancel-arm-deployment.workflow.json) | Cancel a stuck Azure Resource Manager deployment to unblock further provisioning |
| 48 | [subworkflow-azure-remediate-redeploy-arm-template.workflow.json](subworkflow-azure-remediate-redeploy-arm-template.workflow.json) | Redeploy an ARM template stack to recover from a failed infrastructure deployment |

---

### 🔐 Security & Identity (Microsoft Entra)

| # | File | Use Case |
|---|---|---|
| 49 | [subworkflow-azure-remediate-disable-entra-user.workflow.json](subworkflow-azure-remediate-disable-entra-user.workflow.json) | Disable a compromised Microsoft Entra (Azure AD) user account as immediate containment |
| 50 | [subworkflow-azure-remediate-rotate-service-principal-secret.workflow.json](subworkflow-azure-remediate-rotate-service-principal-secret.workflow.json) | Rotate an Azure Service Principal client secret during a credential security incident |

---

## 🔧 Supporting Files

| File | Purpose |
|---|---|
| [subworkflow-azure-wait-for-automation-runbook-job.workflow.json](subworkflow-azure-wait-for-automation-runbook-job.workflow.json) | ⏳ Wait-for helper — polls Azure Automation job status until complete. **Deploy this first.** |

---

## 🔵 Dynatrace Azure Connector Actions Used

| Action | Description |
|---|---|
| `dynatrace.azure.connector:azure-automation-start-runbook-job` | Starts an Azure Automation runbook job and returns a `jobId` |
| `dynatrace.azure.connector:azure-automation-get-job` | Gets the current status of an Azure Automation runbook job |
| `dynatrace.automations:run-workflow` | Invokes the wait-for helper subworkflow |
| `dynatrace.automations:run-javascript` | Validates job status and throws on failure |

> 💡 Ensure the `dynatrace.azure.connector` app is installed and updated in your Dynatrace environment before importing these subworkflows.

---

## ✅ Testing Checklist

Before promoting a subworkflow to the root repository:

- [ ] Deploy `subworkflow-azure-wait-for-automation-runbook-job.workflow.json` and get its live workflow ID
- [ ] Run the `sed` command above to replace `a0000000-0000-4000-a000-000000000000` with the real ID
- [ ] Create the corresponding Azure Automation runbook in your Automation Account
- [ ] Set `dynatraceazureconnection` to your actual Dynatrace Azure OIDC connection name
- [ ] Run the subworkflow manually with a test `primaryResourceId`
- [ ] Confirm `jobStatus === Completed` in the check-status result
- [ ] After passing: add `🧩` to the title and move the file to the repo root

---

## 📁 Repository Convention

Once tested and confirmed working, files should be:
- **Updated** with `🧩` at the start of the `title` field inside the JSON
- **Moved** from `azure/` to the repository root
- Following the naming pattern: `subworkflow-azure-<action>.workflow.json`
