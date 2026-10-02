const WORKSHEETS = [
  {
    id: 1,
    name: "JH2 Mathematics HQ Test 1",
    subject: "Secondary 2 Maths",
    completed: 0,
    total: 0,
    avgScore: 0,
    studentLabel: "0 Student",
    detailLabel: "(0 Branch, 0 Class, 0 Teacher)",
    date: "2026-08-24",
  },
  {
    id: 2,
    name: "P3 English Hq test 1",
    subject: "Primary 3 English",
    completed: 0,
    total: 2,
    avgScore: 0,
    studentLabel: "2 Students",
    detailLabel: "(1 Branches, 0 Class, 1 Teachers)",
    date: "2026-08-23",
  },
  {
    id: 3,
    name: "JH1 science Admin WS Test 1",
    subject: "Secondary 1 Science",
    completed: 0,
    total: 0,
    avgScore: 0,
    studentLabel: "0 Student",
    detailLabel: "(1 Branches, 0 Class, 1 Teachers)",
    date: "2026-08-22",
  },
  {
    id: 4,
    name: "P2 Math Admin WS Test 1",
    subject: "Primary 2 Maths",
    completed: 0,
    total: 0,
    avgScore: 0,
    studentLabel: "0 Student",
    detailLabel: "(1 Branches, 0 Class, 1 Teachers)",
    date: "2026-08-21",
  },
  {
    id: 5,
    name: "P1 English Admin WS Test 1",
    subject: "Primary 1 English",
    completed: 0,
    total: 0,
    avgScore: 0,
    studentLabel: "0 Student",
    detailLabel: "(1 Branches, 0 Class, 1 Teachers)",
    date: "2026-08-20",
  },
];

const ROWS_PER_PAGE = 3;

const state = {
  search: "",
  subject: "",
  worksheet: "",
  date: "",
  view: "list",
  page: 1,
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
const dateFilter = document.getElementById("dateFilter");
const viewToggle = document.getElementById("viewToggle");
const legendBtn = document.getElementById("legendBtn");
const legendPopover = document.getElementById("legendPopover");

function populateWorksheetOptions() {
  WORKSHEETS.forEach((ws) => {
    const opt = document.createElement("option");
    opt.value = ws.name;
    opt.textContent = ws.name;
    worksheetFilter.appendChild(opt);
  });
}

function getFilteredWorksheets() {
  return WORKSHEETS.filter((ws) => {
    const matchesSearch = ws.name.toLowerCase().includes(state.search.toLowerCase());
    const matchesSubject = !state.subject || ws.subject === state.subject;
    const matchesWorksheet = !state.worksheet || ws.name === state.worksheet;
    const matchesDate = !state.date || ws.date === state.date;
    return matchesSearch && matchesSubject && matchesWorksheet && matchesDate;
  });
}

function scoreTier(score) {
  if (score >= 80) return "green";
  if (score >= 50) return "amber";
  return "red";
}

function render() {
  const filtered = getFilteredWorksheets();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  state.page = Math.min(state.page, totalPages);

  const start = (state.page - 1) * ROWS_PER_PAGE;
  const pageRows = filtered.slice(start, start + ROWS_PER_PAGE);

  emptyState.classList.toggle("hidden", filtered.length !== 0);
  viewList.classList.toggle("hidden", state.view !== "list" || filtered.length === 0);
  viewTable.classList.toggle("hidden", state.view !== "table" || filtered.length === 0);

  renderListRows(pageRows);
  renderPlainRows(pageRows);
  renderPagination(totalPages);
}

const CLOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const INSIGHT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;

function renderListRows(rows) {
  tableBody.innerHTML = rows.map((ws) => `
    <div class="table-row">
      <div>
        <div class="ws-name-row">
          <p class="ws-name">${ws.name}</p>
          <span class="clock-badge">${CLOCK_ICON}</span>
        </div>
        <p class="ws-subject">${ws.subject}</p>
      </div>
      <div class="completion">
        <div class="progress-track"><div class="progress-fill" data-tier="${scoreTier(completionPercent(ws))}" style="width:${completionPercent(ws)}%"></div></div>
        <span class="completion-label">${ws.completed}/${ws.total} (${completionPercent(ws)}%)</span>
      </div>
      <div>
        <span class="score-badge" data-tier="${scoreTier(ws.avgScore)}">${ws.avgScore}%</span>
      </div>
      <div>
        <p class="assigned-count">${ws.studentLabel}</p>
        <p class="assigned-detail">${ws.detailLabel}</p>
      </div>
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
      <td>
        <div class="ws-name-row">
          <p class="ws-name">${ws.name}</p>
          <span class="clock-badge">${CLOCK_ICON}</span>
        </div>
        <p class="ws-subject">${ws.subject}</p>
      </td>
      <td>${ws.completed}/${ws.total} (${completionPercent(ws)}%)</td>
      <td><span class="score-badge" data-tier="${scoreTier(ws.avgScore)}">${ws.avgScore}%</span></td>
      <td>
        <p class="assigned-count">${ws.studentLabel}</p>
        <p class="assigned-detail">${ws.detailLabel}</p>
      </td>
      <td>
        <button class="view-insight-btn" type="button" data-insight="${ws.id}">View Insight</button>
      </td>
    </tr>
  `).join("");
}

function completionPercent(ws) {
  if (!ws.total) return 0;
  return Math.round((ws.completed / ws.total) * 100);
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

document.addEventListener("click", () => {
  legendPopover.classList.remove("open");
});

const sidebar = document.getElementById("sidebar");
const collapseBtn = document.getElementById("collapseBtn");

collapseBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
  });
});

populateWorksheetOptions();
render();
