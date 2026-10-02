// Worksheet Analytics page, styled and behaving like production (demo-hq.heyhi.sg).
// Depends on data.js, ui-helpers.js, shell.js and filter-widgets.js. The page sets PAGE_CONFIG:
// { scope: "hq" } for the HQ view, or { scope: "branch", branchId } for a sub-branch view.

const ROWS_PER_PAGE = 10;
const IS_HQ = PAGE_CONFIG.scope === "hq";
// Branch whose students the figures cover: null for HQ (every branch).
const SCOPE_BRANCH_ID = IS_HQ ? null : PAGE_CONFIG.branchId;

// A sub-branch sees every worksheet assigned to it, including HQ worksheets shared with others.
const SCOPED_WORKSHEETS = IS_HQ
  ? WORKSHEETS
  : WORKSHEETS.filter((worksheet) => worksheetBranchIds(worksheet).includes(SCOPE_BRANCH_ID));

const INSIGHT_SCOPE_QUERY = IS_HQ ? "scope=hq" : `scope=branch&branch=${encodeURIComponent(SCOPE_BRANCH_ID)}`;

const state = {
  subjectLevels: [],
  worksheetId: null,
  branchId: null,
  creator: null, // "role:Tutor" or "person:<creatorKey>" — only on pages with the Created By filter
  search: "",
  dateRange: null,
  page: 1,
};

const rowsBody = document.getElementById("worksheetRows");
const paginationList = document.getElementById("pagination");
const columnCount = document.querySelectorAll(".worksheet-table thead th").length;

/* ---------- Formatting ---------- */

function completionPercent(stats) {
  return stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
}

// Production always pluralises Students/Branches/Classes but only pluralises Teacher above 1,
// e.g. "1 Students (1 Branches, 1 Classes, 0 Teacher)". Mirrored as-is.
function assignedHtml(stats) {
  const teacherLabel = stats.teachers > 1 ? "Teachers" : "Teacher";
  return `<strong>${stats.total} Students</strong><br> (${stats.branches} Branches, ${stats.classes} Classes, ${stats.teachers} ${teacherLabel})`;
}

// HQ worksheets can be assigned to several branches: show the count, then the branch names.
function branchCellHtml(worksheet) {
  const branchIds = worksheetBranchIds(worksheet);
  if (branchIds.length === 1) return `<strong>${escapeHtml(branchName(branchIds[0]))}</strong>`;
  return `<strong>${branchIds.length} Branches</strong><br>${escapeHtml(branchIds.map(branchName).join(", "))}`;
}

function examIconHtml() {
  return `
    <span class="exam-ws-wrap">
      <span class="exam-ws-icon" tabindex="0" role="img" aria-label="Exam Worksheet">${featherSvg(FEATHER_PATHS.clock)}</span>
      <span class="popper">Exam Worksheet</span>
    </span>`;
}

function rowHtml(worksheet) {
  const stats = worksheetStats(worksheet, SCOPE_BRANCH_ID);
  const percent = completionPercent(stats);
  const branchCell = IS_HQ ? `<td>${branchCellHtml(worksheet)}</td>` : "";
  return `
    <tr>
      <td><div><strong>${escapeHtml(worksheet.name)}</strong>${worksheet.isExam ? examIconHtml() : ""}<br>${escapeHtml(worksheet.subject)}</div></td>
      <td><strong>${escapeHtml(worksheet.creator.name)}</strong><br>${escapeHtml(worksheet.creator.role)}</td>
      ${branchCell}
      <td>
        <div class="completion-rate">
          <div class="completion-rate-bar"><div class="completion-rate-progress ${tierClass(percent)}" style="width: ${percent}%"></div></div>
          <span class="completion-rate-percentage"><strong>${stats.completed}/${stats.total} (${percent}%)</strong></span>
        </div>
      </td>
      <td><span class="badge ${tierClass(stats.avgScore)}">${stats.avgScore}%</span></td>
      <td>${assignedHtml(stats)}</td>
      <td><button type="button" class="btn-primary" data-insight="${worksheet.id}">${featherSvg(FEATHER_PATHS.barChart2)} View Insight</button></td>
    </tr>`;
}

/* ---------- Filtering & rendering ---------- */

function getFilteredWorksheets() {
  const query = state.search.trim().toLowerCase();
  return SCOPED_WORKSHEETS.filter((worksheet) => {
    const { subject, level } = parseSubject(worksheet.subject);
    const matchesSubject = !state.subjectLevels.length
      || state.subjectLevels.some((selection) => selection.subject === subject && selection.level === level);
    const matchesWorksheet = !state.worksheetId || String(worksheet.id) === state.worksheetId;
    const matchesBranch = !state.branchId || worksheetBranchIds(worksheet).includes(state.branchId);
    const matchesSearch = worksheet.name.toLowerCase().includes(query);
    const matchesDate = !state.dateRange
      || (worksheet.date >= state.dateRange[0] && worksheet.date <= state.dateRange[1]);
    return matchesSubject && matchesWorksheet && matchesBranch && matchesCreator(worksheet)
      && matchesSearch && matchesDate;
  });
}

function render() {
  const filtered = getFilteredWorksheets();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  state.page = Math.min(state.page, totalPages);
  const start = (state.page - 1) * ROWS_PER_PAGE;
  const pageRows = filtered.slice(start, start + ROWS_PER_PAGE);

  rowsBody.innerHTML = pageRows.length
    ? pageRows.map(rowHtml).join("")
    : `<tr class="table-empty"><td colspan="${columnCount}">There are no records to show</td></tr>`;
  paginationList.innerHTML = paginationHtml(state.page, totalPages);
}

function applyFilter(changes) {
  Object.assign(state, changes, { page: 1 });
  render();
}

/* ---------- Filters ---------- */

function worksheetGroups() {
  const bySubject = new Map();
  SCOPED_WORKSHEETS.forEach((worksheet) => {
    const { subject } = parseSubject(worksheet.subject);
    if (!bySubject.has(subject)) bySubject.set(subject, []);
    bySubject.get(subject).push({ value: String(worksheet.id), label: worksheet.name });
  });
  // Groups follow production's subject order; anything outside the catalog goes last.
  const catalogOrder = SUBJECT_CATALOG.map((entry) => entry.subject).filter((subject) => bySubject.has(subject));
  const others = [...bySubject.keys()].filter((subject) => !catalogOrder.includes(subject));
  return [...catalogOrder, ...others].map((subject) => ({ label: subject, options: bySubject.get(subject) }));
}

createSubjectLevelFilter(document.getElementById("subjectFilter"), {
  catalog: SUBJECT_CATALOG,
  onChange: (selection) => applyFilter({ subjectLevels: selection }),
});

createSearchableSelect(document.getElementById("worksheetFilter"), {
  placeholder: "Select Worksheet",
  groups: worksheetGroups(),
  onChange: (value) => applyFilter({ worksheetId: value }),
});

/* Created By (hq-2.html): HQ / Admin / Tutor groups, each opening with an "All …" option, then
   every creator with their branch and how many worksheets they made within the chosen Branch. */

const CREATOR_ROLES = [
  { role: "HQ", allLabel: "All HQ" },
  { role: "Admin", allLabel: "All Admins" },
  { role: "Tutor", allLabel: "All Tutors" },
];

// One account per person and branch: "Admin Office" exists in every branch. HQ accounts have no branch.
function creatorKey(worksheet) {
  const { name, role } = worksheet.creator;
  return role === "HQ" ? `${role}|${name}` : `${role}|${name}|${worksheet.branchId}`;
}

function matchesCreator(worksheet) {
  if (!state.creator) return true;
  const separator = state.creator.indexOf(":");
  const kind = state.creator.slice(0, separator);
  const value = state.creator.slice(separator + 1);
  return kind === "role" ? worksheet.creator.role === value : creatorKey(worksheet) === value;
}

function creatorGroups() {
  const inBranch = SCOPED_WORKSHEETS.filter((worksheet) => !state.branchId
    || worksheetBranchIds(worksheet).includes(state.branchId));
  return CREATOR_ROLES.map(({ role, allLabel }) => {
    const worksheets = inBranch.filter((worksheet) => worksheet.creator.role === role);
    const people = new Map();
    worksheets.forEach((worksheet) => {
      const key = creatorKey(worksheet);
      if (!people.has(key)) {
        people.set(key, {
          value: `person:${key}`,
          label: worksheet.creator.name,
          meta: role === "HQ" ? undefined : branchName(worksheet.branchId),
          count: 0,
        });
      }
      people.get(key).count += 1;
    });
    // Most active first, then alphabetical.
    const sortedPeople = [...people.values()].sort((a, b) => b.count - a.count
      || a.label.localeCompare(b.label) || (a.meta || "").localeCompare(b.meta || ""));
    const allOption = { value: `role:${role}`, label: allLabel, count: worksheets.length };
    return { label: role, options: worksheets.length ? [allOption, ...sortedPeople] : [] };
  }).filter((group) => group.options.length);
}

const creatorFilterRoot = document.getElementById("creatorFilter");
const creatorSelect = creatorFilterRoot
  ? createSearchableSelect(creatorFilterRoot, {
    placeholder: "Select Creator",
    groups: creatorGroups(),
    searchGroupLabels: true,
    onChange: (value) => applyFilter({ creator: value }),
  })
  : null;

const branchFilterRoot = document.getElementById("branchFilter");
if (IS_HQ && branchFilterRoot) {
  createSearchableSelect(branchFilterRoot, {
    placeholder: "Select Branch",
    groups: [{ label: null, options: BRANCHES.map((branch) => ({ value: branch.id, label: branch.name })) }],
    onChange: (value) => {
      state.branchId = value;
      // The creator list follows the branch; a creator with nothing in the new branch is dropped.
      if (creatorSelect && !creatorSelect.setGroups(creatorGroups())) state.creator = null;
      applyFilter({});
    },
  });
}

createDateRangePicker(document.getElementById("dateFilter"), {
  placeholder: "Select date",
  onChange: (range) => applyFilter({ dateRange: range }),
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  applyFilter({ search: event.target.value });
});

/* ---------- Table & pagination events ---------- */

rowsBody.addEventListener("click", (event) => {
  const insightButton = event.target.closest("[data-insight]");
  if (insightButton) window.location.href = `insight-v2.html?id=${insightButton.dataset.insight}&${INSIGHT_SCOPE_QUERY}`;
});

paginationList.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-page]");
  if (!pageButton) return;
  state.page = Number(pageButton.dataset.page);
  render();
});

/* ---------- Table legend ---------- */

// The legend opens while its label is hovered, like production. (Top navbar and sidebar
// behaviour lives in shell.js.)
const legendTrigger = document.getElementById("legendTrigger");
const legendPopover = document.getElementById("legendPopover");
legendTrigger.addEventListener("mouseenter", () => { legendPopover.hidden = false; });
legendTrigger.addEventListener("mouseleave", () => { legendPopover.hidden = true; });

render();
