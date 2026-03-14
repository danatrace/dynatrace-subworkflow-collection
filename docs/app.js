const PAGE_SIZE = 36;

const DOWNLOAD_COUNTS_KEY = "coe_download_counts";

function getDownloadCounts() {
  try {
    return JSON.parse(localStorage.getItem(DOWNLOAD_COUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function incrementDownloadCount(path) {
  const counts = getDownloadCounts();
  counts[path] = (counts[path] || 0) + 1;
  localStorage.setItem(DOWNLOAD_COUNTS_KEY, JSON.stringify(counts));
  return counts[path];
}

function getDownloadCount(path) {
  return getDownloadCounts()[path] || 0;
}

const state = {
  all: [],
  activeSection: "tested",
  search: "",
  folder: "all",
  page: 1,
  selectedPaths: new Set(),
};

const summaryText = document.getElementById("summary-text");
const countTested = document.getElementById("count-tested");
const countUntested = document.getElementById("count-untested");
const resultCount = document.getElementById("result-count");
const pageInfo = document.getElementById("page-info");
const catalog = document.getElementById("catalog");
const folderFilter = document.getElementById("folder-filter");
const searchInput = document.getElementById("search-input");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const cardTemplate = document.getElementById("card-template");
const tabButtons = [...document.querySelectorAll(".tab")];
const selectedCount = document.getElementById("selected-count");
const selectAllButton = document.getElementById("select-all");
const generateTerraformButton = document.getElementById("generate-terraform");
const terraformModal = document.getElementById("terraform-modal");
const terraformContent = document.getElementById("terraform-content");

function sanitizeTfName(path) {
  return normalize(path)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64) || "workflow";
}

function buildTerraformScript(items) {
  const installLines = [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    "# =========================",
    "# User input values",
    "# =========================",
    "DT_ENV_URL=\"https://<tenant>.live.dynatrace.com\"",
    "DT_API_TOKEN=\"<replace-with-dynatrace-api-token>\"",
    "TF_PROJECT_DIR=\"dynatrace-workflow-deploy\"",
    "",
    "# Optional: pin provider version if needed",
    "DT_PROVIDER_VERSION=\">= 1.80.0\"",
    "",
    "if [[ \"$DT_ENV_URL\" == *\"<tenant>\"* || \"$DT_API_TOKEN\" == *\"<replace-\"* ]]; then",
    "  echo \"Please update DT_ENV_URL and DT_API_TOKEN at the top of this script before running.\"",
    "  exit 1",
    "fi",
    "",
    "# Full setup from scratch: install Terraform, configure Dynatrace provider, and upload selected workflows.",
    "",
    "if command -v terraform >/dev/null 2>&1; then",
    "  echo \"Terraform already installed: $(terraform version | head -n1)\"",
    "elif command -v apt-get >/dev/null 2>&1; then",
    "  sudo apt-get update",
    "  sudo apt-get install -y gnupg software-properties-common curl unzip",
    "  curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg",
    "  echo \"deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(. /etc/os-release && echo $VERSION_CODENAME) main\" | sudo tee /etc/apt/sources.list.d/hashicorp.list >/dev/null",
    "  sudo apt-get update",
    "  sudo apt-get install -y terraform",
    "elif command -v brew >/dev/null 2>&1; then",
    "  brew tap hashicorp/tap",
    "  brew install hashicorp/tap/terraform",
    "else",
    "  echo \"Please install Terraform manually: https://developer.hashicorp.com/terraform/install\"",
    "  exit 1",
    "fi",
    "",
    "if ! command -v curl >/dev/null 2>&1; then",
    "  echo \"curl is required to download workflow JSON files\"",
    "  exit 1",
    "fi",
  ];

  const resources = items
    .map((item) => {
      const resourceName = sanitizeTfName(item.path);
      const fileName = `${resourceName}.workflow.json`;
      return [
        `# Source: ${item.path}`,
        `resource \"dynatrace_automation_workflow\" \"${resourceName}\" {`,
        `  workflow_json = file(\"${"${path.module}"}/workflows/${fileName}\")`,
        "}",
      ].join("\n");
    })
    .join("\n\n");

  const downloads = items
    .map((item) => {
      const resourceName = sanitizeTfName(item.path);
      const fileName = `${resourceName}.workflow.json`;
      return [
        `echo \"Downloading ${item.path}\"`,
        `curl -fsSL -o workflows/${fileName} \"${item.downloadUrl}\"`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    ...installLines,
    "",
    "mkdir -p \"${TF_PROJECT_DIR}\"/workflows",
    "cd \"${TF_PROJECT_DIR}\"",
    "",
    "cat > versions.tf <<'EOF'",
    "terraform {",
    "  required_version = \">= 1.5.0\"",
    "  required_providers {",
    "    dynatrace = {",
    "      source  = \"dynatrace-oss/dynatrace\"",
    "      version = \"${DT_PROVIDER_VERSION}\"",
    "    }",
    "  }",
    "}",
    "EOF",
    "",
    "cat > provider.tf <<'EOF'",
    "provider \"dynatrace\" {",
    "  dt_env_url   = var.dt_env_url",
    "  dt_api_token = var.dt_api_token",
    "}",
    "",
    "variable \"dt_env_url\" {",
    "  type        = string",
    "  description = \"Dynatrace environment URL, for example https://abc123.live.dynatrace.com\"",
    "}",
    "",
    "variable \"dt_api_token\" {",
    "  type        = string",
    "  sensitive   = true",
    "  description = \"Dynatrace API token with workflow write permissions\"",
    "}",
    "EOF",
    "",
    "cat > workflows.tf <<'EOF'",
    resources,
    "EOF",
    "",
    "mkdir -p workflows",
    downloads,
    "",
    "terraform init",
    "terraform apply -auto-approve \\",
    "  -var=\"dt_env_url=${DT_ENV_URL}\" \\",
    "  -var=\"dt_api_token=${DT_API_TOKEN}\"",
    "",
    "echo \"Completed. Selected workflows were uploaded to your Dynatrace tenant.\"",
  ].join("\n");
}

function updateSelectionUi() {
  const count = state.selectedPaths.size;
  const filtered = filterWorkflows();
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((item) => state.selectedPaths.has(item.path));

  selectedCount.textContent = `${count} selected`;
  selectAllButton.textContent = allFilteredSelected ? "Clear All" : "Select All";
  selectAllButton.disabled = filtered.length === 0;
  generateTerraformButton.disabled = count === 0;
}

function normalize(value) {
  return (value || "").toString().toLowerCase();
}

function filterWorkflows() {
  const term = normalize(state.search);

  return state.all.filter((item) => {
    if (item.section !== state.activeSection) {
      return false;
    }

    if (state.folder !== "all" && item.folder !== state.folder) {
      return false;
    }

    if (!term) {
      return true;
    }

    const haystack = [
      item.title,
      item.path,
      item.guideText,
      item.guide,
      item.guideSummary,
      item.description,
      ...(item.tags || []),
    ]
      .join("\n")
      .toLowerCase();

    return haystack.includes(term);
  });
}

function getPage(items) {
  const start = (state.page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

function escapeHtml(value) {
  return (value || "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeMarkdownSource(value, fallback = "") {
  return (value || fallback)
    .toString()
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n");
}

function renderGuideMarkdown(markdownText) {
  const source = normalizeMarkdownSource(markdownText, "No guide available.");

  if (window.marked?.parse) {
    const rawHtml = window.marked.parse(source, {
      gfm: true,
      breaks: true,
    });

    if (window.DOMPurify?.sanitize) {
      return window.DOMPurify.sanitize(rawHtml);
    }

    return rawHtml;
  }

  return `<p>${escapeHtml(source).replace(/\n/g, "<br>")}</p>`;
}

function normalizeGuideLine(line) {
  return (line || "")
    .toString()
    .replace(/\s+$/g, "")
    .trim();
}

function getGuidePreviewMarkdown(item, maxLines = 5) {
  const normalizedSource = normalizeMarkdownSource(
    item.guide || item.guideText || item.description || "",
  );

  const lines = normalizedSource
    .split(/\r?\n/)
    .map(normalizeGuideLine)
    .filter((line) => !/^[-=]{3,}$/.test(line))
    .filter((line) => line.length > 0)
    .slice(0, maxLines);

  if (lines.length === 0) {
    return "No guide preview available. Click **View Guide** for full details.";
  }

  return lines.join("\n");
}

function renderCardPreviewMarkdown(markdownText) {
  const source = normalizeMarkdownSource(markdownText);

  if (window.marked?.parse) {
    const rawHtml = window.marked.parse(source, {
      gfm: true,
      breaks: true,
    });

    if (window.DOMPurify?.sanitize) {
      return window.DOMPurify.sanitize(rawHtml);
    }

    return rawHtml;
  }

  return `<p>${escapeHtml(source).replace(/\n/g, "<br>")}</p>`;
}

function drawCards(items) {
  const fragment = document.createDocumentFragment();

  for (const item of items) {
    const node = cardTemplate.content.firstElementChild.cloneNode(true);

    node.querySelector(".card-title").textContent = item.title || item.path;
    node.querySelector(".card-description").innerHTML = renderCardPreviewMarkdown(
      getGuidePreviewMarkdown(item, 5),
    );

    const sectionPill = node.querySelector(".section-pill");
    sectionPill.textContent = item.section === "tested" ? "Tested" : "Untested";
    sectionPill.dataset.section = item.section;

    const selectCheckbox = node.querySelector(".select-workflow");
    selectCheckbox.checked = state.selectedPaths.has(item.path);
    selectCheckbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        state.selectedPaths.add(item.path);
      } else {
        state.selectedPaths.delete(item.path);
      }
      updateSelectionUi();
    });

    // Guide button → open modal
    const guideBtn = node.querySelector(".guide-btn");
    guideBtn.addEventListener("click", () => {
      document.getElementById("modal-title").textContent = item.title || item.path;
      document.getElementById("modal-content").innerHTML = renderGuideMarkdown(
        item.guide || item.guideText || item.description || "No guide available.",
      );
      document.getElementById("guide-modal").hidden = false;
    });

    // Download button with blob fetch + count tracking
    const downloadLink = node.querySelector(".download-link");
    const countEl = node.querySelector(".download-count");
    const fileName = item.path.split("/").pop();

    const updateCountLabel = (n) => {
      countEl.textContent = n > 0 ? `Downloaded ${n} time${n === 1 ? "" : "s"} in this browser` : "";
    };
    updateCountLabel(getDownloadCount(item.path));

    downloadLink.addEventListener("click", async () => {
      try {
        const response = await fetch(item.downloadUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      } catch {
        window.open(item.downloadUrl, "_blank", "noopener");
      }
      updateCountLabel(incrementDownloadCount(item.path));
    });

    fragment.appendChild(node);
  }

  catalog.innerHTML = "";
  catalog.appendChild(fragment);
  updateSelectionUi();
}

function updateFolderFilter() {
  const folders = [...new Set(state.all.filter((item) => item.section === state.activeSection).map((item) => item.folder))].sort();
  const previous = state.folder;

  folderFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All folders";
  folderFilter.appendChild(allOption);

  for (const folder of folders) {
    const option = document.createElement("option");
    option.value = folder;
    option.textContent = folder;
    folderFilter.appendChild(option);
  }

  if (folders.includes(previous)) {
    state.folder = previous;
  } else {
    state.folder = "all";
  }

  folderFilter.value = state.folder;
}

function render() {
  const filtered = filterWorkflows();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  if (state.page > totalPages) {
    state.page = totalPages;
  }

  const pageItems = getPage(filtered);

  resultCount.textContent = `${filtered.length} workflows shown`;
  pageInfo.textContent = `Page ${state.page} / ${totalPages}`;

  prevPageButton.disabled = state.page <= 1;
  nextPageButton.disabled = state.page >= totalPages;

  drawCards(pageItems);
}

function setupEvents() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.section;
      if (!section || section === state.activeSection) {
        return;
      }

      state.activeSection = section;
      state.page = 1;

      tabButtons.forEach((tab) => {
        const active = tab.dataset.section === section;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });

      updateFolderFilter();
      render();
    });
  });

  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    state.page = 1;
    render();
  });

  folderFilter.addEventListener("change", (event) => {
    state.folder = event.target.value;
    state.page = 1;
    render();
  });

  prevPageButton.addEventListener("click", () => {
    if (state.page > 1) {
      state.page -= 1;
      render();
    }
  });

  nextPageButton.addEventListener("click", () => {
    state.page += 1;
    render();
  });

  selectAllButton.addEventListener("click", () => {
    const filtered = filterWorkflows();
    const allFilteredSelected =
      filtered.length > 0 && filtered.every((item) => state.selectedPaths.has(item.path));

    if (allFilteredSelected) {
      filtered.forEach((item) => state.selectedPaths.delete(item.path));
    } else {
      filtered.forEach((item) => state.selectedPaths.add(item.path));
    }

    render();
  });

  generateTerraformButton.addEventListener("click", () => {
    const selectedItems = state.all.filter((item) => state.selectedPaths.has(item.path));
    if (selectedItems.length === 0) {
      return;
    }

    terraformContent.textContent = buildTerraformScript(selectedItems);
    terraformModal.hidden = false;
  });
}

async function init() {
  const response = await fetch("./data/workflows.json", { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Failed to load catalog data: ${response.status}`);
  }

  const payload = await response.json();
  state.all = payload.workflows || [];

  countTested.textContent = payload.counts?.tested ?? "0";
  countUntested.textContent = payload.counts?.untested ?? "0";

  summaryText.textContent =
    `${payload.counts?.total ?? state.all.length} subworkflows available. ` +
    `${payload.counts?.tested ?? 0} Tested and ${payload.counts?.untested ?? 0} Untested. ` +
    "Click \"Download subworkflow\" on any card to save the JSON file.";

  updateFolderFilter();
  setupEvents();
  render();
}

init().catch((error) => {
  summaryText.textContent = `Catalog failed to load: ${error.message}`;
  catalog.innerHTML = "";
  resultCount.textContent = "0 workflows shown";
});
