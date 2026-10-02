const ROWS_PER_PAGE = 5;
const IS_HQ = PAGE_CONFIG.scope === "hq";

const SCOPED_WORKSHEETS = IS_HQ
  ? WORKSHEETS
  : WORKSHEETS.filter((ws) => ws.branchId === PAGE_CONFIG.branchId);

const state = {
  search: "",
  subject: "",
  worksheet: "",
  branch: "",
  date: "",
  view: "list",
  page: 1,
  sort: { key: null, dir: "desc" },
};

const tableBody = document.getElementById("tableBody");
const tableBodyPlain = document.getElementById("tableBodyPlain");
const viewList = document.getElementById("viewList");
const viewTable = document.getElementById("viewTable");
const emptyState = document.getElementById("emptyState");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const worksheetFilter = document.getElementById("worksheetFilter");
const branchFilter = document.getElementById("branchFilter");
const dateFilter = document.getElementById("dateFilter");
const viewToggle = document.getElementById("viewToggle");
const legendBtn = document.getElementById("legendBtn");
const legendPopover = document.getElementById("legendPopover");
const summaryStats = document.getElementById("summaryStats");

function populateFilterOptions() {
  const subjects = [...new Set(SCOPED_WORKSHEETS.map((ws) => ws.subject))];
  subjects.forEach((subject) => {
    const opt = document.createElement("option");
    opt.value = subject;
    opt.textContent = subject;
    subjectFilter.appendChild(opt);
  });

  SCOPED_WORKSHEETS.forEach((ws) => {
    const opt = document.createElement("option");
    opt.value = ws.name;
    opt.textContent = ws.name;
    worksheetFilter.appendChild(opt);
  });

  if (IS_HQ && branchFilter) {
    BRANCHES.forEach((branch) => {
      const opt = document.createElement("option");
      opt.value = branch.id;
      opt.textContent = branch.name;
      branchFilter.appendChild(opt);
    });
  }
}

function getFilteredWorksheets() {
  return SCOPED_WORKSHEETS.filter((ws) => {
    const matchesSearch = ws.name.toLowerCase().includes(state.search.toLowerCase());
    const matchesSubject = !state.subject || ws.subject === state.subject;
    const matchesWorksheet = !state.worksheet || ws.name === state.worksheet;
    const matchesBranch = !state.branch || ws.branchId === state.branch;
    const matchesDate = !state.date || ws.date === state.date;
    return matchesSearch && matchesSubject && matchesWorksheet && matchesBranch && matchesDate;
  });
}

function applySorting(list) {
  if (!state.sort.key) return list;
  const valueOf = (ws) => (state.sort.key === "completion" ? completionPercent(ws) : ws.avgScore);
  const sorted = [...list].sort((a, b) => valueOf(a) - valueOf(b));
  if (state.sort.dir === "desc") sorted.reverse();
  return sorted;
}

function scoreTier(score) {
  if (score >= 80) return "green";
  if (score >= 50) return "amber";
  return "red";
}

function completionPercent(ws) {
  if (!ws.total) return 0;
  return Math.round((ws.completed / ws.total) * 100);
}

function pluralize(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}

function branchName(branchId) {
  return BRANCHES.find((b) => b.id === branchId)?.name ?? branchId;
}

function render() {
  const filtered = applySorting(getFilteredWorksheets());
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  state.page = Math.min(state.page, totalPages);

  const start = (state.page - 1) * ROWS_PER_PAGE;
  const pageRows = filtered.slice(start, start + ROWS_PER_PAGE);

  emptyState.classList.toggle("hidden", filtered.length !== 0);
  viewList.classList.toggle("hidden", state.view !== "list" || filtered.length === 0);
  viewTable.classList.toggle("hidden", state.view !== "table" || filtered.length === 0);

  renderSummaryStats(filtered);
  renderListRows(pageRows);
  renderPlainRows(pageRows);
  renderPagination(totalPages);
  updateSortIndicators();
}

function renderSummaryStats(filtered) {
  if (!summaryStats) return;

  const total = filtered.length;
  const avgCompletion = total ? Math.round(filtered.reduce((sum, ws) => sum + completionPercent(ws), 0) / total) : 0;
  const avgScore = total ? Math.round(filtered.reduce((sum, ws) => sum + ws.avgScore, 0) / total) : 0;
  const branchCount = new Set(filtered.map((ws) => ws.branchId)).size;

  const cards = [
    { label: "Total Worksheets", value: total },
    { label: "Avg. Completion", value: `${avgCompletion}%` },
    { label: "Avg. Score", value: `${avgScore}%` },
  ];
  if (IS_HQ) cards.push({ label: "Branches Covered", value: `${branchCount}/${BRANCHES.length}` });

  summaryStats.innerHTML = cards.map((c) => `
    <div class="stat-card">
      <p class="stat-value">${c.value}</p>
      <p class="stat-label">${c.label}</p>
    </div>
  `).join("");
}

function updateSortIndicators() {
  document.querySelectorAll("[data-sort]").forEach((el) => {
    const active = state.sort.key === el.dataset.sort;
    el.classList.toggle("sort-active", active);
    const arrow = el.querySelector(".sort-arrow");
    if (arrow) arrow.textContent = active ? (state.sort.dir === "desc" ? "↓" : "↑") : "↕";
  });
}

const CLOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const INSIGHT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;

function creatorCellHtml(ws) {
  return `
    <p class="creator-name">${ws.creator.name}</p>
    <span class="creator-role" data-role="${ws.creator.role.toLowerCase()}">${ws.creator.role}</span>
  `;
}

function assignedCellHtml(ws) {
  return `
    <p class="assigned-count">${pluralize(ws.assigned.students, "Student", "Students")}</p>
    <p class="assigned-detail">(${pluralize(ws.assigned.classes, "Class", "Classes")}, ${pluralize(ws.assigned.teachers, "Teacher", "Teachers")})</p>
  `;
}

function nameCellHtml(ws) {
  return `
    <div>
      <div class="ws-name-row">
        <p class="ws-name">${ws.name}</p>
        <span class="clock-badge">${CLOCK_ICON}</span>
      </div>
      <p class="ws-subject">${ws.subject}</p>
      ${PAGE_CONFIG.compact ? `
      <div class="ws-creator-inline">
        <span>${ws.creator.name}</span>
        <span class="creator-role" data-role="${ws.creator.role.toLowerCase()}">${ws.creator.role}</span>
      </div>` : ""}
    </div>
  `;
}

function renderListRows(rows) {
  tableBody.innerHTML = rows.map((ws) => `
    <div class="table-row">
      ${nameCellHtml(ws)}
      ${PAGE_CONFIG.compact ? "" : `<div>${creatorCellHtml(ws)}</div>`}
      ${IS_HQ ? `<div><span class="branch-tag">${branchName(ws.branchId)}</span></div>` : ""}
      <div class="completion">
        <div class="progress-track"><div class="progress-fill" data-tier="${scoreTier(completionPercent(ws))}" style="width:${completionPercent(ws)}%"></div></div>
        <span class="completion-label">${ws.completed}/${ws.total} (${completionPercent(ws)}%)</span>
      </div>
      <div>
        <span class="score-badge" data-tier="${scoreTier(ws.avgScore)}">${ws.avgScore}%</span>
      </div>
      <div>${assignedCellHtml(ws)}</div>
      <div>
        <button class="view-insight-btn" type="button" data-insight="${ws.id}">
          ${INSIGHT_ICON}
          View Insight
        </button>
      </div>
    </div>
  `).join("");
}

function renderPlainRows(rows) {
  tableBodyPlain.innerHTML = rows.map((ws) => `
    <tr>
      <td>${nameCellHtml(ws)}</td>
      ${PAGE_CONFIG.compact ? "" : `<td>${creatorCellHtml(ws)}</td>`}
      ${IS_HQ ? `<td><span class="branch-tag">${branchName(ws.branchId)}</span></td>` : ""}
      <td>${ws.completed}/${ws.total} (${completionPercent(ws)}%)</td>
      <td><span class="score-badge" data-tier="${scoreTier(ws.avgScore)}">${ws.avgScore}%</span></td>
      <td>${assignedCellHtml(ws)}</td>
      <td>
        <button class="view-insight-btn" type="button" data-insight="${ws.id}">View Insight</button>
      </td>
    </tr>
  `).join("");
}

const PAGE_ICONS = {
  first: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>`,
  prev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  next: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  last: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>`,
};

function renderPagination(totalPages) {
  const p = state.page;
  let html = "";
  html += `<button data-page="first" ${p === 1 ? "disabled" : ""}>${PAGE_ICONS.first}</button>`;
  html += `<button data-page="prev" ${p === 1 ? "disabled" : ""}>${PAGE_ICONS.prev}</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-num ${i === p ? "active" : ""}" data-page="${i}">${i}</button>`;
  }
  html += `<button data-page="next" ${p === totalPages ? "disabled" : ""}>${PAGE_ICONS.next}</button>`;
  html += `<button data-page="last" ${p === totalPages ? "disabled" : ""}>${PAGE_ICONS.last}</button>`;
  pagination.innerHTML = html;

  pagination.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      if (target === "first") state.page = 1;
      else if (target === "prev") state.page = Math.max(1, state.page - 1);
      else if (target === "next") state.page = Math.min(totalPages, state.page + 1);
      else if (target === "last") state.page = totalPages;
      else state.page = Number(target);
      render();
    });
  });
}

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  state.page = 1;
  render();
});

subjectFilter.addEventListener("change", (e) => {
  state.subject = e.target.value;
  state.page = 1;
  render();
});

worksheetFilter.addEventListener("change", (e) => {
  state.worksheet = e.target.value;
  state.page = 1;
  render();
});

if (branchFilter) {
  branchFilter.addEventListener("change", (e) => {
    state.branch = e.target.value;
    state.page = 1;
    render();
  });
}

dateFilter.addEventListener("change", (e) => {
  state.date = e.target.value;
  state.page = 1;
  render();
});

viewToggle.addEventListener("click", (e) => {
  const btn = e.target.closest(".toggle-btn");
  if (!btn) return;
  state.view = btn.dataset.view;
  viewToggle.querySelectorAll(".toggle-btn").forEach((b) => b.classList.toggle("active", b === btn));
  render();
});

legendBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  legendPopover.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  legendPopover.classList.remove("open");

  const insightBtn = e.target.closest(".view-insight-btn");
  if (insightBtn) {
    window.location.href = `insight-v2.html?id=${insightBtn.dataset.insight}`;
  }
});

const sidebar = document.getElementById("sidebar");
const collapseBtn = document.getElementById("collapseBtn");

collapseBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

document.querySelectorAll("[data-sort]").forEach((el) => {
  el.addEventListener("click", () => {
    const key = el.dataset.sort;
    if (state.sort.key === key) {
      state.sort.dir = state.sort.dir === "desc" ? "asc" : "desc";
    } else {
      state.sort.key = key;
      state.sort.dir = "desc";
    }
    render();
  });
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
  });
});

populateFilterOptions();
render();
