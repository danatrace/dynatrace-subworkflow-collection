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

function drawCards(items) {
  const fragment = document.createDocumentFragment();

  for (const item of items) {
    const node = cardTemplate.content.firstElementChild.cloneNode(true);

    node.querySelector(".card-title").textContent = item.title || item.path;
    node.querySelector(".card-path").textContent = item.path;
    node.querySelector(".card-folder").textContent = `Folder: ${item.folder}`;

    const summary = item.guideSummary || item.description || "No guide text available.";
    node.querySelector(".card-description").textContent = summary;

    const guideText = item.guideText || item.guide || item.description || "No guide text available.";
    node.querySelector(".guide-text").textContent = guideText;

    const sectionPill = node.querySelector(".section-pill");
    sectionPill.textContent = item.section === "tested" ? "Tested" : "Untested";
    sectionPill.dataset.section = item.section;

    const tagsContainer = node.querySelector(".tag-list");
    if (Array.isArray(item.tags) && item.tags.length > 0) {
      item.tags.slice(0, 8).forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    } else {
      const tagElement = document.createElement("span");
      tagElement.className = "tag";
      tagElement.textContent = "no-tags";
      tagsContainer.appendChild(tagElement);
    }

    // Guide button → open modal
    const guideBtn = node.querySelector(".guide-btn");
    guideBtn.addEventListener("click", () => {
      document.getElementById("modal-title").textContent = item.title || item.path;
      document.getElementById("modal-content").textContent =
        item.guideText || item.guide || item.description || "No guide available.";
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

    const sourceLink = node.querySelector(".source-link");
    sourceLink.href = item.sourceUrl;

    fragment.appendChild(node);
  }

  catalog.innerHTML = "";
  catalog.appendChild(fragment);
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
    `${payload.counts?.total ?? state.all.length} subworkflows available — ` +
    `${payload.counts?.tested ?? 0} Tested (top-level) and ${payload.counts?.untested ?? 0} Untested (folder-based). ` +
    "Click \"Download subworkflow\" on any card to save the JSON file directly to your computer.";  

  updateFolderFilter();
  setupEvents();
  render();
}

init().catch((error) => {
  summaryText.textContent = `Catalog failed to load: ${error.message}`;
  catalog.innerHTML = "";
  resultCount.textContent = "0 workflows shown";
});
