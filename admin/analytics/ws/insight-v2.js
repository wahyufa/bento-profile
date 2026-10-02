// Worksheet Insight page, mirroring production's /adminv2/worksheet-analytics/:id/insight.
// Depends on data.js, ui-helpers.js, shell.js, filter-widgets.js and Chart.js 2.9.
// PAGE_CONFIG (set inline from the URL) says who is looking: HQ sees every branch the worksheet
// is assigned to; a sub-branch sees only its own students, even on a worksheet HQ shared.
// Every figure is derived from the student results, so charts, tables and panels agree.

const WORKSHEET_ID = Number(new URLSearchParams(window.location.search).get("id"));
const IS_HQ = PAGE_CONFIG.scope === "hq";
const SCOPE_BRANCH_ID = IS_HQ ? null : PAGE_CONFIG.branchId;
const LIST_PAGE = adminAccount(PAGE_CONFIG).homePage;

// A sub-branch can't open worksheets that aren't assigned to it.
const WORKSHEET = WORKSHEETS.find((worksheet) => worksheet.id === WORKSHEET_ID
  && (IS_HQ || worksheetBranchIds(worksheet).includes(SCOPE_BRANCH_ID)));

// All students keep their original position: it drives the deterministic per-question answers.
const ALL_STUDENTS = WORKSHEET ? STUDENT_RESULTS[WORKSHEET.id] || [] : [];
const SCOPED_STUDENTS = WORKSHEET ? studentsInScope(WORKSHEET, SCOPE_BRANCH_ID) : [];
const QUESTIONS = WORKSHEET ? QUESTION_RESULTS[WORKSHEET.id] || [] : [];
const TOPICS = [...new Set(QUESTIONS.map((question) => question.topic))];

const PAGE_SIZES = [5, 10, 25, 50, 100];
const PIVOTS = [
  { key: "branch", label: "Branch" },
  { key: "class", label: "Class" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
];
const CARD_TITLES = {
  completion: { overview: "Overview", detail: "Detail" },
  question: { overview: "Question Response Overview", detail: "Question Detail" },
  topic: { overview: "Topics in This Worksheet Overview", detail: "Topics Detail" },
};
const PROFICIENCY_TIERS = [
  { key: "strong", label: "Strong" },
  { key: "improving", label: "Improving" },
  { key: "to-improve", label: "To Improve" },
];
// Colours from production's Chart.js configs.
const CHART_COLORS = {
  completed: "#1ec5f1",
  inProgress: "#145876",
  notStarted: "#d9d9d9",
  correct: "#17b890",
  incorrect: "#eb6363",
  pending: "#ffb300",
  notAttempted: "#d9d9d9",
};
const NO_DATA_IMAGE_URL = "https://elb-onlinequiz.smartjen.com/images/no-data.png";

const state = {
  tab: "completion",
  view: "overview",
  pivot: "branch",
  classKeys: [],
  dateRange: null,
  pageSize: 10,
  page: 1,
  search: "",
  questionNumber: "",
  hideQuestion: false,
  expandedAnswerGroup: null,
  expandedTopics: new Set(),
};

const content = document.getElementById("insightContent");
let activeChart = null;

// Chart.js comes from a CDN; without it (e.g. offline) the rest of the page still works.
function createChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (typeof Chart === "undefined") {
    canvas.parentElement.innerHTML = '<p class="chart-unavailable">Chart unavailable — Chart.js could not be loaded.</p>';
    return null;
  }
  return new Chart(canvas, config);
}

/* ---------- Students, scores and time ---------- */

const studentBranch = (student) => studentBranchId(WORKSHEET, student);
const classKey = (student) => `${studentBranch(student)}|${student.class}`;
const isCompleted = (student) => student.status === "Completed";

const percentOf = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);
const average = (values) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

function filteredStudents() {
  return SCOPED_STUDENTS.filter((student) => {
    const matchesClass = !state.classKeys.length || state.classKeys.includes(classKey(student));
    const matchesDate = !state.dateRange
      || (student.date && student.date >= state.dateRange[0] && student.date <= state.dateRange[1]);
    return matchesClass && matchesDate;
  });
}

function answeredCorrectly(student, question) {
  return studentAnsweredCorrectly(ALL_STUDENTS.indexOf(student), QUESTIONS.indexOf(question), student.score);
}

// Averages count submitted attempts only, like production (e.g. time = mean of completed attempts).
function groupStats(students) {
  const completed = students.filter(isCompleted);
  return {
    total: students.length,
    completed: completed.length,
    percent: percentOf(completed.length, students.length),
    avgScore: Math.round(average(completed.map((student) => student.score))),
    avgSeconds: Math.round(average(completed.map((student) => student.timeSpentSeconds))),
  };
}

function questionScore(students, question) {
  const completed = students.filter(isCompleted);
  return percentOf(completed.filter((student) => answeredCorrectly(student, question)).length, completed.length);
}

function studentTopicScore(student, topic) {
  const topicQuestions = QUESTIONS.filter((question) => question.topic === topic);
  return percentOf(topicQuestions.filter((question) => answeredCorrectly(student, question)).length, topicQuestions.length);
}

function topicScore(students, topic) {
  return Math.round(average(students.filter(isCompleted).map((student) => studentTopicScore(student, topic))));
}

// Same thresholds as the table legend: To Improve < 50%, Improving 50–74%, Strong ≥ 75%.
function proficiencyTier(score) {
  if (score >= 75) return "strong";
  if (score >= 50) return "improving";
  return "to-improve";
}

const pad2 = (value) => String(value).padStart(2, "0");

function timeParts(totalSeconds) {
  return [Math.floor(totalSeconds / 3600), Math.floor((totalSeconds % 3600) / 60), totalSeconds % 60].map(pad2);
}

const clockTime = (seconds) => timeParts(seconds).join(":");

function longTime(seconds) {
  const [hours, minutes, secs] = timeParts(seconds);
  return `${hours} hr : ${minutes} min : ${secs} sec`;
}

/* ---------- Header ---------- */

// Production shows "name (role)". HQ also gets the creator's branch here: a sub-branch admin's
// role reads "Admin" just like HQ's own admins, so the role alone doesn't say where it came from.
function creatorText() {
  const { name, role } = WORKSHEET.creator;
  return IS_HQ && role !== "HQ" ? `${name} (${role} · ${branchName(WORKSHEET.branchId)})` : `${name} (${role})`;
}

// Production writes this line in lower case and always plural: "20 students (3 branches, …)".
function assignedText() {
  const classes = new Set(SCOPED_STUDENTS.map(classKey)).size;
  const teachers = new Set(SCOPED_STUDENTS.map((student) => classTeacher(studentBranch(student), student.class)).filter(Boolean)).size;
  const branches = IS_HQ ? worksheetBranchIds(WORKSHEET).length : 1;
  return `${SCOPED_STUDENTS.length} students (${branches} branches, ${classes} classes, ${teachers} teachers)`;
}

function renderHeader() {
  document.getElementById("worksheetName").textContent = WORKSHEET.name;
  document.getElementById("creatorIcon").innerHTML = featherSvg(FEATHER_PATHS.edit);
  document.getElementById("assignedIcon").innerHTML = featherSvg(FEATHER_PATHS.users);
  document.getElementById("creatorMeta").textContent = creatorText();
  document.getElementById("assignedMeta").textContent = assignedText();
}

// Production's Class filter is its subject/level tree reused as Branch → Class.
function initHeaderFilters() {
  const branchIds = worksheetBranchIds(WORKSHEET).filter((id) => IS_HQ || id === SCOPE_BRANCH_ID);
  const catalog = branchIds.map((branchId) => ({
    subject: branchName(branchId),
    levels: [...new Set(SCOPED_STUDENTS.filter((student) => studentBranch(student) === branchId).map((student) => student.class))],
  })).filter((entry) => entry.levels.length);
  const branchIdByName = Object.fromEntries(branchIds.map((branchId) => [branchName(branchId), branchId]));

  createSubjectLevelFilter(document.getElementById("classFilter"), {
    catalog,
    placeholder: "All Class",
    onChange: (selection) => {
      state.classKeys = selection.map(({ subject, level }) => `${branchIdByName[subject]}|${level}`);
      resetDetailPaging();
      renderContent();
    },
  });

  createDateRangePicker(document.getElementById("dateFilter"), {
    placeholder: "Select Date",
    onChange: (range) => {
      state.dateRange = range;
      resetDetailPaging();
      renderContent();
    },
  });
}

/* ---------- Detail rows ("View by") ---------- */

function groupBy(students, keyOf) {
  const groups = new Map();
  students.forEach((student) => {
    const key = keyOf(student);
    if (key === null) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(student);
  });
  return groups;
}

// Each row: { name, sub, students, student? } — sub is the grey second line under the name.
function pivotRows(pivot, students) {
  if (pivot === "branch") {
    const groups = groupBy(students, studentBranch);
    return worksheetBranchIds(WORKSHEET).filter((branchId) => groups.has(branchId)).map((branchId) => {
      const branchStudents = groups.get(branchId);
      return {
        name: branchName(branchId),
        sub: `${new Set(branchStudents.map((student) => student.class)).size} Class (Worksheet)`,
        students: branchStudents,
      };
    });
  }
  if (pivot === "class" || pivot === "teacher") {
    const keyOf = pivot === "class" ? classKey : (student) => classTeacher(studentBranch(student), student.class);
    return [...groupBy(students, keyOf).values()].map((groupStudents) => ({
      name: pivot === "class" ? groupStudents[0].class : keyOf(groupStudents[0]),
      sub: `${branchName(studentBranch(groupStudents[0]))} (${groupStudents.length} Students)`,
      students: groupStudents,
    }));
  }
  return students.map((student) => ({ name: student.name, sub: student.class, students: [student], student }));
}

const badgeHtml = (percent) => `<span class="badge ${tierClass(percent)}">${percent}%</span>`;
const nameCellHtml = (row, width) => `<td style="width: ${width}%"><span><strong>${escapeHtml(row.name)}</strong><br>${escapeHtml(row.sub)}</span></td>`;

function completionCellHtml(stats) {
  return `
    <div class="completion-rate">
      <div class="completion-rate-bar"><div class="completion-rate-progress ${tierClass(stats.percent)}" style="width: ${stats.percent}%"></div></div>
      <span class="completion-rate-percentage"><strong>${stats.completed}/${stats.total} (${stats.percent}%)</strong></span>
    </div>`;
}

// Column widths follow production's per-view td widths.
const DETAIL_TABLES = {
  completion: {
    head: (pivot) => (pivot === "student"
      ? ["Name", "Completion Status", "Score", "Time Spent"]
      : ["Name", "Completion Rate", "Avg. Score", "Average Time Spent"]),
    row: (row, pivot) => {
      if (row.student) {
        const done = isCompleted(row.student);
        return `${nameCellHtml(row, 30)}
          <td style="width: 30%">${escapeHtml(row.student.status)}</td>
          <td style="width: 20%">${done ? badgeHtml(row.student.score) : "-"}</td>
          <td style="width: 20%">${done ? clockTime(row.student.timeSpentSeconds) : "-"}</td>`;
      }
      const stats = groupStats(row.students);
      const widths = pivot === "class" ? [25, 25, 15, 20] : [30, 30, 20, 20];
      return `${nameCellHtml(row, widths[0])}
        <td style="width: ${widths[1]}%">${completionCellHtml(stats)}</td>
        <td style="width: ${widths[2]}%">${badgeHtml(stats.avgScore)}</td>
        <td style="width: ${widths[3]}%">${clockTime(stats.avgSeconds)}</td>`;
    },
  },
  question: {
    head: () => ["Name", "Avg. Score", ...QUESTIONS.map((question) => `Q${question.number}`)],
    centered: true,
    row: (row) => {
      if (row.student && !isCompleted(row.student)) {
        return `${nameCellHtml(row, 30)}${'<td class="text-center">-</td>'.repeat(QUESTIONS.length + 1)}`;
      }
      const cells = row.student
        ? [row.student.score, ...QUESTIONS.map((question) => (answeredCorrectly(row.student, question) ? 100 : 0))]
        : [groupStats(row.students).avgScore, ...QUESTIONS.map((question) => questionScore(row.students, question))];
      return `${nameCellHtml(row, 30)}${cells.map((percent) => `<td class="text-center">${badgeHtml(percent)}</td>`).join("")}`;
    },
  },
  topic: {
    head: () => ["Name", ...TOPICS],
    row: (row) => {
      if (row.student && !isCompleted(row.student)) return `${nameCellHtml(row, 30)}${"<td>-</td>".repeat(TOPICS.length)}`;
      const scores = TOPICS.map((topic) => (row.student ? studentTopicScore(row.student, topic) : topicScore(row.students, topic)));
      return `${nameCellHtml(row, 30)}${scores.map((percent) => `<td>${badgeHtml(percent)}</td>`).join("")}`;
    },
  },
};

function emptyRowHtml(columnCount) {
  return `
    <tr class="insight-empty-row">
      <td colspan="${columnCount}">
        <div class="insight-empty">
          <img src="${NO_DATA_IMAGE_URL}" alt="">
          <p><b>No Data Available</b></p>
        </div>
      </td>
    </tr>`;
}

function detailTableHtml(students) {
  const table = DETAIL_TABLES[state.tab];
  const head = table.head(state.pivot);
  const query = state.search.trim().toLowerCase();
  const rows = pivotRows(state.pivot, students).filter((row) => row.name.toLowerCase().includes(query));
  const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const pageRows = rows.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
  const tableClasses = `worksheet-table insight-table${state.tab === "topic" ? " is-topic-detail" : ""}`;

  return `
    <div class="table-responsive">
      <table class="${tableClasses}">
        <thead>
          <tr>${head.map((label, index) => `<th${table.centered && index ? ' class="text-center"' : ""}><div>${escapeHtml(label)}</div></th>`).join("")}</tr>
        </thead>
        <tbody>
          ${pageRows.length ? pageRows.map((row) => `<tr>${table.row(row, state.pivot)}</tr>`).join("") : emptyRowHtml(head.length)}
        </tbody>
      </table>
    </div>
    ${pageRows.length ? `<ul class="pagination" aria-label="Pagination">${paginationHtml(state.page, totalPages)}</ul>` : ""}`;
}

function detailHtml(students) {
  const pivot = PIVOTS.find((candidate) => candidate.key === state.pivot);
  return `
    ${cardHeaderHtml(CARD_TITLES[state.tab].detail, "Back to Overview", "overview")}
    <div class="detail-filter">
      <div class="detail-filter-title">View by:</div>
      <div class="detail-filter-list" role="tablist" aria-label="View by">
        ${PIVOTS.map((candidate) => `<button type="button" role="tab" class="detail-filter-item${candidate.key === state.pivot ? " is-active" : ""}" aria-selected="${candidate.key === state.pivot}" data-pivot="${candidate.key}"> ${candidate.label} (${pivotRows(candidate.key, students).length}) </button>`).join("")}
      </div>
    </div>
    <div class="detail-controls">
      <div class="detail-controls-col detail-display">
        <span>Display</span>
        <select class="form-control detail-page-size" id="pageSize" aria-label="Rows per page">
          ${PAGE_SIZES.map((size) => `<option value="${size}"${size === state.pageSize ? " selected" : ""}>${size}</option>`).join("")}
        </select>
      </div>
      <div class="detail-controls-col">
        <div class="search-field">
          <input type="text" class="form-control" id="detailSearch" placeholder="Search ${pivot.label.toLowerCase()}" value="${escapeHtml(state.search)}" aria-label="Search ${pivot.label.toLowerCase()}">
          <span class="search-icon">${featherSvg(FEATHER_PATHS.search)}</span>
        </div>
      </div>
    </div>
    <div id="detailTableRegion">${detailTableHtml(students)}</div>`;
}

/* ---------- Overviews ---------- */

function cardHeaderHtml(title, linkLabel, targetView) {
  return `
    <div class="insight-card-header">
      <h2 class="insight-card-title">${title}</h2>
      <a href="#" class="insight-link" data-view="${targetView}">
        <strong class="insight-link-text">${linkLabel}</strong>
        <span class="insight-link-icon is-forward">${featherSvg(FEATHER_PATHS.chevronRight)}</span>
      </a>
    </div>`;
}

function completionOverviewHtml(students) {
  const stats = groupStats(students);
  const segments = [
    { key: "completed", label: "Completed", count: stats.completed },
    { key: "in-progress", label: "In Progress", count: students.filter((student) => student.status === "In Progress").length },
    { key: "not-started", label: "Not Started", count: students.filter((student) => student.status === "Not Started").length },
  ];
  return `
    ${cardHeaderHtml(CARD_TITLES.completion.overview, "View Detail", "detail")}
    <div class="insight-card-spacer"></div>
    <div class="completion-overview">
      <div class="completion-chart"><div class="chart-canvas"><canvas id="pieChart" aria-label="Completion status" role="img"></canvas></div></div>
      <div class="completion-legend">
        ${segments.map((segment) => `
          <div class="chart-label">
            <div class="chart-label-color ${segment.key}"></div>
            <div><p><strong>${segment.label} (${percentOf(segment.count, stats.total)}%)</strong><br> ${segment.count} out of ${stats.total} Students </p></div>
          </div>`).join("")}
      </div>
      <div class="completion-stats">
        <div class="completion-stat">
          <p class="completion-stat-label">Average Score <span>${featherSvg(FEATHER_PATHS.info)}</span></p>
          <h2 class="completion-stat-value is-score">${stats.avgScore}%</h2>
        </div>
        <div class="completion-stat">
          <p class="completion-stat-label">Average Time Spent <span>${featherSvg(FEATHER_PATHS.info)}</span></p>
          <h2 class="completion-stat-value">${longTime(stats.avgSeconds)}</h2>
        </div>
      </div>
    </div>`;
}

function drawPieChart(students) {
  const total = students.length;
  const count = (status) => students.filter((student) => student.status === status).length;
  activeChart = createChart("pieChart", {
    type: "pie",
    data: {
      labels: ["Completed", "In Progress", "Not Started"],
      datasets: [{
        label: "Volume",
        data: [percentOf(count("Completed"), total), percentOf(count("In Progress"), total), percentOf(count("Not Started"), total)],
        backgroundColor: [CHART_COLORS.completed, CHART_COLORS.inProgress, CHART_COLORS.notStarted],
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      tooltips: {
        callbacks: {
          title: () => "",
          label: (item, data) => `${data.labels[item.index]}: ${data.datasets[0].data[item.index]}%`,
        },
      },
    },
  });
}

function questionOverviewHtml() {
  return `
    ${cardHeaderHtml(CARD_TITLES.question.overview, "View Detail", "detail")}
    <div class="insight-card-spacer"></div>
    <div class="question-chart"><div class="chart-canvas"><canvas id="barChart" aria-label="Question responses" role="img"></canvas></div></div>
    <div class="question-select-row">
      <div class="question-select-col">
        <select class="form-control" id="questionSelect" aria-label="Question Detail">
          <option value="">Question Detail</option>
          ${QUESTIONS.map((question) => `<option value="${question.number}"${String(question.number) === state.questionNumber ? " selected" : ""}>Q${question.number}</option>`).join("")}
        </select>
      </div>
    </div>`;
}

// Stacked percentages of all students in view, as in production: correct, incorrect, pending
// marking and not attempted add up to 100 per question.
function drawBarChart(students) {
  const total = students.length;
  const completed = students.filter(isCompleted);
  const correctCounts = QUESTIONS.map((question) => completed.filter((student) => answeredCorrectly(student, question)).length);
  const notAttempted = percentOf(total - completed.length, total);
  activeChart = createChart("barChart", {
    type: "bar",
    data: {
      labels: QUESTIONS.map((question) => `Q${question.number}`),
      datasets: [
        { label: "Answered Correctly", data: correctCounts.map((correct) => percentOf(correct, total)), backgroundColor: CHART_COLORS.correct },
        { label: "Answered Incorrectly", data: correctCounts.map((correct) => percentOf(completed.length - correct, total)), backgroundColor: CHART_COLORS.incorrect },
        { label: "Pending Marking", data: QUESTIONS.map(() => 0), backgroundColor: CHART_COLORS.pending },
        { label: "Not Attempted", data: QUESTIONS.map(() => notAttempted), backgroundColor: CHART_COLORS.notAttempted },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: true, position: "right" },
      scales: {
        xAxes: [{ stacked: true, barPercentage: 0.2, gridLines: { color: "rgba(0, 0, 0, 0)" } }],
        yAxes: [{ stacked: true, ticks: { beginAtZero: true }, gridLines: { color: "rgba(0, 0, 0, 0)" } }],
      },
      tooltips: {
        callbacks: { label: (item, data) => `${data.datasets[item.datasetIndex].label}: ${item.value}%` },
      },
    },
  });
}

function questionContentHtml(question) {
  const instruction = question.instruction ? `<p class="quiz-instruction">${escapeHtml(question.instruction)}</p>` : "";
  let answer = "";
  if (question.options) {
    answer = `<ol class="quiz-options">${question.options.map((option, index) => {
      const text = escapeHtml(option);
      return `<li>(${index + 1}) ${option === question.answer ? `<span class="fitb-correct">${text}</span>` : text}</li>`;
    }).join("")}</ol>`;
  } else if (question.answer) {
    answer = `<p class="quiz-answer">Answer: <span class="fitb-correct">${escapeHtml(question.answer)}</span></p>`;
  }
  return `<div class="qbox-content">${instruction}<div class="quiz-question">${escapeHtml(question.text)}</div>${answer}</div>`;
}

function answerGroupDetailHtml(students) {
  return [...groupBy(students, (student) => student.class)].map(([className, classStudents]) => `
    <div class="qi-statistic-item qi-statistic-detail">
      <div class="qi-title qi-class"><span>${escapeHtml(className)}</span></div>
      <div class="qi-students">${escapeHtml(classStudents.map((student) => student.name).join(", "))}</div>
    </div>`).join("");
}

function questionPanelHtml(students) {
  const question = QUESTIONS.find((candidate) => String(candidate.number) === state.questionNumber);
  if (!question) return "";
  const completed = students.filter(isCompleted);
  const groups = [
    { key: "correct", title: "Answered correctly", bar: "correct", students: completed.filter((student) => answeredCorrectly(student, question)) },
    { key: "incorrect", title: "Answered incorrectly", bar: "incorrect", students: completed.filter((student) => !answeredCorrectly(student, question)) },
    { key: "pending", title: "Pending marking", bar: "pending", students: [] },
    // Production draws "Didn't answer" with the incorrect colour as well.
    { key: "unanswered", title: "Didn't answer", bar: "incorrect", students: students.filter((student) => !isCompleted(student)) },
  ];
  const labels = [question.type, question.marks ? `${question.marks} Marks` : null].filter(Boolean);

  return `
    <div class="question-analytic">
      <div class="qbox-head">
        <div class="qbox-head-main">
          <div class="qbox-head-left">
            <div class="qnum">Q${question.number}.</div>
            <div class="qlabel">${labels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}</div>
          </div>
          <div class="form-switch">
            <input type="checkbox" id="hideQuestion"${state.hideQuestion ? " checked" : ""}>
            <label for="hideQuestion">Hide Question</label>
          </div>
        </div>
        <div class="qbox-sub-head"><div class="qlabel"><span>${escapeHtml(question.topic)}</span></div></div>
      </div>
      <div class="qbox-body">
        ${state.hideQuestion ? "" : questionContentHtml(question)}
        <div class="qi-statistic">
          ${groups.map((group) => {
            const expanded = state.expandedAnswerGroup === group.key;
            const percent = percentOf(group.students.length, students.length);
            return `
              <div class="qi-statistic-item">
                <div class="qi-title">${group.title}</div>
                <div class="qi-bar"><div class="qi-progress-bar ${group.bar}" style="width: ${percent}%"></div></div>
                <div class="qi-progress"> ${group.students.length}/${students.length} students (${percent}%)
                  <button type="button" class="qi-arrow" data-answer-group="${group.key}" aria-expanded="${expanded}" aria-label="${expanded ? "Hide" : "Show"} students: ${group.title}">${featherSvg(expanded ? FEATHER_PATHS.chevronUp : FEATHER_PATHS.chevronDown)}</button>
                </div>
              </div>
              ${expanded ? answerGroupDetailHtml(group.students) : ""}`;
          }).join("")}
        </div>
      </div>
    </div>`;
}

function topicDetailHtml(students, topic) {
  const completed = students.filter(isCompleted);
  return `
    <div class="proficiency-detail-row">
      <div class="proficiency-detail-container">
        ${PROFICIENCY_TIERS.map((tier) => {
          const tierStudents = completed.filter((student) => proficiencyTier(studentTopicScore(student, topic)) === tier.key);
          const classes = [...groupBy(tierStudents, (student) => student.class)]
            .map(([className, classStudents]) => `<div class="proficiency-class"> ${escapeHtml(className)} (${classStudents.length}) </div>`).join("");
          const names = tierStudents.map((student) => `<div class="proficiency-student"> ${escapeHtml(student.name)} </div>`).join("");
          return `
            <div class="proficiency-detail-item">
              <div class="proficiency-detail-label"><div class="proficiency-label ${tier.key}">${tier.label} (${tierStudents.length})</div></div>
              <div class="proficiency-detail-class">${classes || "-"}</div>
              <div class="proficiency-detail-student">${names || "-"}</div>
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

function topicOverviewHtml(students) {
  const completed = students.filter(isCompleted);
  return `
    ${cardHeaderHtml(CARD_TITLES.topic.overview, "View Detail", "detail")}
    <div class="topic-legend">
      ${PROFICIENCY_TIERS.map((tier) => `<div class="topic-legend-item"><div class="topic-label-color ${tier.key}"></div><span>${tier.label}</span></div>`).join("")}
    </div>
    <div class="topic-row"><div><strong>Topics</strong></div><div><strong>Average Proficiency</strong></div></div>
    ${TOPICS.map((topic, index) => {
      const expanded = state.expandedTopics.has(index);
      const segments = PROFICIENCY_TIERS.map((tier) => ({
        tier,
        share: percentOf(completed.filter((student) => proficiencyTier(studentTopicScore(student, topic)) === tier.key).length, completed.length),
      })).filter((segment) => segment.share > 0);
      return `
        <div class="topic-list">
          <div class="topic-row">
            <div>${escapeHtml(topic)}</div>
            <div class="topic-bar-col">
              <div class="proficiency-bar">${segments.map((segment) => `<div class="proficiency-item ${segment.tier.key}" style="width: ${segment.share}%"></div>`).join("")}</div>
              <button type="button" class="btn-proficiency-detail" data-topic-index="${index}" aria-expanded="${expanded}" aria-label="${expanded ? "Hide" : "Show"} ${escapeHtml(topic)} proficiency">${featherSvg(expanded ? FEATHER_PATHS.chevronUp : FEATHER_PATHS.chevronDown)}</button>
            </div>
          </div>
          ${expanded ? topicDetailHtml(students, topic) : ""}
        </div>`;
    }).join("")}`;
}

/* ---------- Rendering ---------- */

function cardHtml(body, spaced = false) {
  return `<div class="insight-card${spaced ? " is-spaced" : ""}"><div class="insight-card-body">${body}</div></div>`;
}

function renderContent() {
  if (activeChart) {
    activeChart.destroy();
    activeChart = null;
  }
  const students = filteredStudents();

  if (state.view === "detail") {
    content.innerHTML = cardHtml(detailHtml(students));
  } else if (state.tab === "completion") {
    content.innerHTML = cardHtml(completionOverviewHtml(students));
    drawPieChart(students);
  } else if (state.tab === "question") {
    content.innerHTML = `${cardHtml(questionOverviewHtml(), true)}<div id="questionPanelRegion">${questionPanelHtml(students)}</div>`;
    drawBarChart(students);
  } else {
    content.innerHTML = cardHtml(topicOverviewHtml(students));
  }

  document.querySelectorAll(".insight-tab").forEach((tab) => {
    const active = tab.dataset.tab === state.tab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
}

// Search and paging only redraw the table, so the search box keeps focus while typing.
function renderDetailTable() {
  document.getElementById("detailTableRegion").innerHTML = detailTableHtml(filteredStudents());
}

function renderQuestionPanel() {
  document.getElementById("questionPanelRegion").innerHTML = questionPanelHtml(filteredStudents());
}

function resetDetailPaging() {
  state.page = 1;
  state.search = "";
}

/* ---------- Events ---------- */

function initTabs() {
  document.querySelectorAll(".insight-tab").forEach((tab) => {
    tab.querySelector(".insight-tab-icon").innerHTML = featherSvg(FEATHER_PATHS.chevronRight);
    tab.addEventListener("click", () => {
      if (tab.dataset.tab === state.tab && state.view === "overview") return;
      Object.assign(state, { tab: tab.dataset.tab, view: "overview", questionNumber: "", expandedAnswerGroup: null, hideQuestion: false });
      state.expandedTopics.clear();
      resetDetailPaging();
      renderContent();
    });
  });
}

function initContentEvents() {
  content.addEventListener("click", (event) => {
    const viewLink = event.target.closest("[data-view]");
    const pivotButton = event.target.closest("[data-pivot]");
    const pageButton = event.target.closest("[data-page]");
    const answerToggle = event.target.closest("[data-answer-group]");
    const topicToggle = event.target.closest("[data-topic-index]");

    if (viewLink) {
      event.preventDefault();
      state.view = viewLink.dataset.view;
      resetDetailPaging();
      renderContent();
    } else if (pivotButton) {
      state.pivot = pivotButton.dataset.pivot;
      resetDetailPaging();
      renderContent();
    } else if (pageButton) {
      state.page = Number(pageButton.dataset.page);
      renderDetailTable();
    } else if (answerToggle) {
      const group = answerToggle.dataset.answerGroup;
      state.expandedAnswerGroup = state.expandedAnswerGroup === group ? null : group;
      renderQuestionPanel();
    } else if (topicToggle) {
      const index = Number(topicToggle.dataset.topicIndex);
      if (!state.expandedTopics.delete(index)) state.expandedTopics.add(index);
      renderContent();
    }
  });

  content.addEventListener("change", (event) => {
    if (event.target.id === "pageSize") {
      state.pageSize = Number(event.target.value);
      state.page = 1;
      renderDetailTable();
    } else if (event.target.id === "questionSelect") {
      Object.assign(state, { questionNumber: event.target.value, expandedAnswerGroup: null, hideQuestion: false });
      renderQuestionPanel();
    } else if (event.target.id === "hideQuestion") {
      state.hideQuestion = event.target.checked;
      renderQuestionPanel();
    }
  });

  content.addEventListener("input", (event) => {
    if (event.target.id !== "detailSearch") return;
    state.search = event.target.value;
    state.page = 1;
    renderDetailTable();
  });
}

function initTopline() {
  const backLink = document.getElementById("backLink");
  backLink.href = LIST_PAGE;
  document.getElementById("backIcon").innerHTML = featherSvg(FEATHER_PATHS.chevronLeft);
  // Return to whichever list page opened this one (hq.html, hq-2.html, …) as it was left;
  // opened from elsewhere, fall back to the account's list.
  backLink.addEventListener("click", (event) => {
    const cameFromThisSite = document.referrer && new URL(document.referrer).origin === window.location.origin;
    if (cameFromThisSite && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });

  // The legend opens while its label is hovered, like production.
  const legendTrigger = document.getElementById("legendTrigger");
  const legendPopover = document.getElementById("legendPopover");
  document.getElementById("legendIcon").innerHTML = featherSvg(FEATHER_PATHS.info);
  legendTrigger.addEventListener("mouseenter", () => { legendPopover.hidden = false; });
  legendTrigger.addEventListener("mouseleave", () => { legendPopover.hidden = true; });
}

initTopline();

if (WORKSHEET) {
  renderHeader();
  initHeaderFilters();
  initTabs();
  initContentEvents();
  renderContent();
} else {
  document.getElementById("insightHeader").hidden = true;
  document.getElementById("insightBody").hidden = true;
  document.getElementById("notFound").hidden = false;
  document.getElementById("notFoundLink").href = LIST_PAGE;
}
