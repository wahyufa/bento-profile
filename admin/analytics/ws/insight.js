const params = new URLSearchParams(window.location.search);
const worksheetId = Number(params.get("id"));
const worksheet = WORKSHEETS.find((ws) => ws.id === worksheetId);
const students = worksheet ? (STUDENT_RESULTS[worksheetId] || []) : [];
const questions = worksheet ? (QUESTION_RESULTS[worksheetId] || []) : [];

const state = { search: "", class: "", status: "", sort: { key: null, dir: "asc" } };
const questionState = { sort: { key: null, dir: "asc" } };

const STATUS_RANK = { "Not Started": 0, "In Progress": 1, "Completed": 2 };

document.getElementById("backLink").addEventListener("click", (e) => {
  e.preventDefault();
  if (window.history.length > 1) history.back();
  else window.location.href = "sub-branch.html";
});

const sidebar = document.getElementById("sidebar");
const collapseBtn = document.getElementById("collapseBtn");
collapseBtn.addEventListener("click", () => sidebar.classList.toggle("collapsed"));

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
  });
});

function branchName(branchId) {
  return BRANCHES.find((b) => b.id === branchId)?.name ?? branchId;
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

function correctPercent(q) {
  if (!q.total) return 0;
  return Math.round((q.correct / q.total) * 100);
}

function statusKey(status) {
  return status.toLowerCase().replace(" ", "-");
}

function wireSortableHeaders(containerSelector, sortState, onSort) {
  document.querySelectorAll(`${containerSelector} [data-sort]`).forEach((el) => {
    el.addEventListener("click", () => {
      const key = el.dataset.sort;
      if (sortState.key === key) {
        sortState.dir = sortState.dir === "asc" ? "desc" : "asc";
      } else {
        sortState.key = key;
        sortState.dir = "asc";
      }
      onSort();
    });
  });
}

function updateSortIndicators(containerSelector, sortState) {
  document.querySelectorAll(`${containerSelector} [data-sort]`).forEach((el) => {
    const active = sortState.key === el.dataset.sort;
    el.classList.toggle("sort-active", active);
    const arrow = el.querySelector(".sort-arrow");
    if (arrow) arrow.textContent = active ? (sortState.dir === "desc" ? "↓" : "↑") : "↕";
  });
}

if (!worksheet) {
  document.getElementById("wsName").textContent = "Worksheet not found";
  document.getElementById("insightContent").classList.add("hidden");
  document.getElementById("notFound").classList.remove("hidden");
} else {
  initInsight();
}

function initInsight() {
  document.title = `${worksheet.name} — Worksheet Insight`;
  document.getElementById("wsName").textContent = worksheet.name;
  document.getElementById("wsMeta").innerHTML = `
    ${worksheet.subject} · ${branchName(worksheet.branchId)} · Created by ${worksheet.creator.name}
    <span class="creator-role" data-role="${worksheet.creator.role.toLowerCase()}">${worksheet.creator.role}</span>
  `;

  renderSummaryStats();
  renderStatusBreakdown();

  if (!students.length) {
    document.querySelector(".status-card").classList.add("hidden");
    document.getElementById("questionTableCard").classList.add("hidden");
    document.getElementById("studentTableCard").classList.add("hidden");
    document.getElementById("noStudents").classList.remove("hidden");
    return;
  }

  if (questions.length) {
    wireSortableHeaders("#questionTableCard", questionState.sort, renderQuestionBreakdown);
    renderQuestionBreakdown();
  } else {
    document.getElementById("questionTableCard").classList.add("hidden");
    document.getElementById("noQuestions").classList.remove("hidden");
  }

  populateStudentFilterOptions();

  const searchInput = document.getElementById("studentSearch");
  searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderStudentTable();
  });

  const classFilter = document.getElementById("classFilter");
  classFilter.addEventListener("change", (e) => {
    state.class = e.target.value;
    renderStudentTable();
  });

  const statusFilter = document.getElementById("statusFilter");
  statusFilter.addEventListener("change", (e) => {
    state.status = e.target.value;
    renderStudentTable();
  });

  wireSortableHeaders("#studentTableCard", state.sort, renderStudentTable);
  renderStudentTable();
}

function populateStudentFilterOptions() {
  const classFilter = document.getElementById("classFilter");
  [...new Set(students.map((s) => s.class))].forEach((className) => {
    const opt = document.createElement("option");
    opt.value = className;
    opt.textContent = className;
    classFilter.appendChild(opt);
  });
}

function renderSummaryStats() {
  const cards = [
    { label: "Assigned Students", value: worksheet.assigned.students },
    { label: "Completed", value: `${worksheet.completed}/${worksheet.total}` },
    { label: "Completion Rate", value: `${completionPercent(worksheet)}%` },
    { label: "Average Score", value: `${worksheet.avgScore}%` },
  ];
  document.getElementById("summaryStats").innerHTML = cards.map((c) => `
    <div class="stat-card">
      <p class="stat-value">${c.value}</p>
      <p class="stat-label">${c.label}</p>
    </div>
  `).join("");
}

function renderStatusBreakdown() {
  const counts = { "Completed": 0, "In Progress": 0, "Not Started": 0 };
  students.forEach((s) => { counts[s.status] = (counts[s.status] || 0) + 1; });
  const total = students.length;

  document.getElementById("statusBar").innerHTML = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `<div class="status-bar-segment" data-status="${statusKey(status)}" style="width:${(count / total) * 100}%"></div>`)
    .join("");

  document.getElementById("statusLegend").innerHTML = Object.entries(counts)
    .map(([status, count]) => `
      <div class="status-legend-item">
        <span class="status-badge" data-status="${statusKey(status)}">${status}</span>
        ${count}
      </div>
    `).join("");
}

function applyQuestionSorting(list) {
  if (!questionState.sort.key) return list;
  const sorted = [...list].sort((a, b) => correctPercent(a) - correctPercent(b));
  if (questionState.sort.dir === "desc") sorted.reverse();
  return sorted;
}

function renderQuestionBreakdown() {
  const sorted = applyQuestionSorting(questions);

  document.getElementById("questionTableBody").innerHTML = sorted.map((q) => `
    <tr>
      <td>${q.number}</td>
      <td>${q.text}</td>
      <td>
        <div class="completion">
          <div class="progress-track"><div class="progress-fill" data-tier="${scoreTier(correctPercent(q))}" style="width:${correctPercent(q)}%"></div></div>
          <span class="completion-label">${correctPercent(q)}%</span>
        </div>
      </td>
      <td>${q.correct}/${q.total} correct</td>
    </tr>
  `).join("");

  updateSortIndicators("#questionTableCard", questionState.sort);
}

function getFilteredStudents() {
  return students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(state.search.toLowerCase());
    const matchesClass = !state.class || s.class === state.class;
    const matchesStatus = !state.status || s.status === state.status;
    return matchesSearch && matchesClass && matchesStatus;
  });
}

function applySorting(list) {
  if (!state.sort.key) return list;
  const valueOf = (s) => {
    if (state.sort.key === "name") return s.name.toLowerCase();
    if (state.sort.key === "status") return STATUS_RANK[s.status];
    if (state.sort.key === "score") return s.score ?? -1;
    return 0;
  };
  const sorted = [...list].sort((a, b) => {
    const va = valueOf(a);
    const vb = valueOf(b);
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
  if (state.sort.dir === "desc") sorted.reverse();
  return sorted;
}

function renderStudentTable() {
  const filtered = applySorting(getFilteredStudents());

  document.getElementById("studentTable").classList.toggle("hidden", filtered.length === 0);
  document.getElementById("noMatches").classList.toggle("hidden", filtered.length !== 0);

  document.getElementById("studentTableBody").innerHTML = filtered.map((s) => `
    <tr>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td><span class="status-badge" data-status="${statusKey(s.status)}">${s.status}</span></td>
      <td>${s.score === null ? "—" : `<span class="score-badge" data-tier="${scoreTier(s.score)}">${s.score}%</span>`}</td>
      <td>${s.timeSpent ?? "—"}</td>
      <td>${s.date ?? "—"}</td>
    </tr>
  `).join("");

  updateSortIndicators("#studentTableCard", state.sort);
}
