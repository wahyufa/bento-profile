const icons = {
  grid: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  bars: '<path d="M5 20V10"></path><path d="M12 20V4"></path><path d="M19 20v-7"></path>',
  share: '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 13.5 6.8 4"></path><path d="m15.4 6.5-6.8 4"></path>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
  trophy: '<path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path><path d="M17 5h3a2 2 0 0 1-2 4h-1"></path><path d="M7 5H4a2 2 0 0 0 2 4h1"></path>',
  sliders: '<path d="M4 21v-7"></path><path d="M4 10V3"></path><path d="M12 21v-9"></path><path d="M12 8V3"></path><path d="M20 21v-5"></path><path d="M20 12V3"></path><path d="M2 14h4"></path><path d="M10 8h4"></path><path d="M18 16h4"></path>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"></rect><path d="M9 3h6v4H9z"></path><path d="m9 14 2 2 4-4"></path>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"></path><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"></path>',
  chart: '<path d="M3 3v18h18"></path><path d="M7 16V9"></path><path d="M12 16V5"></path><path d="M17 16v-4"></path>',
  chevron: '<path d="m18 15-6-6-6 6"></path>',
  sparkle: '<path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"></path><path d="M19 15l.7 2.3L22 18l-2.3.7L19 22l-.7-2.3L16 18l2.3-.7L19 15z"></path>',
  settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2.8-2.8.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.8-2.8.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z"></path>',
  panel: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M10 4v16"></path>',
  help: '<circle cx="12" cy="12" r="10"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.4-2.2 1.7-2.7 3"></path><path d="M12 17h.01"></path>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>',
  clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
  medal: '<circle cx="12" cy="8" r="5"></circle><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5"></path>',
  'check-circle': '<circle cx="12" cy="12" r="9"></circle><path d="m8.5 12 2.2 2.2 4.8-5"></path>',
  'book-open': '<path d="M2 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"></path><path d="M22 4h-7a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h8z"></path>',
  cap: '<path d="m22 10-10-5-10 5 10 5 10-5Z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path>',
  trend: '<path d="m3 17 6-6 4 4 8-8"></path><path d="M14 7h7v7"></path>',
  close: '<path d="m6 6 12 12"></path><path d="m18 6-12 12"></path>',
  arrow: '<path d="m9 18 6-6-6-6"></path>'
};

const courses = [
  { name: "Digital Marketing Strategy", enrollments: 12, completions: 0, mastery: 25 },
  { name: "Character Education: A Framework for Schools", enrollments: 11, completions: 0, mastery: 27 }
];

const palsCourses = [
  { id: "aml", name: "AML and CFL Course (10/6)", kp: 15, assigned: 15, completed: 2, completion: 13, score: 87 },
  { id: "hr", name: "Human Resource Specialist", kp: 6, assigned: 10, completed: 5, completion: 50, score: 87 },
  { id: "leadership", name: "Leadership Management", kp: 3, assigned: 8, completed: 5, completion: 63, score: 88 },
  { id: "accountancy", name: "Accountancy Specialist", kp: 4, assigned: 8, completed: 6, completion: 75, score: 88 },
  { id: "advanced-hr", name: "Advanced HR Management", kp: 4, assigned: 8, completed: 5, completion: 63, score: 86 }
];

const palsTopics = [
  { name: "Introduction to AML/CFT and Its Importance", passed: "2/15", score: 75, attempts: "2.0×" },
  { name: "The Stages of Money Laundering", passed: "2/15", score: 92, attempts: "2.0×" },
  { name: "Distinguishing Terrorism Financing from Money Laundering", passed: "3/15", score: 91, attempts: "1.7×" },
  { name: "The Broader Impact of AML/CFT in Combating Financial Crime", passed: "2/15", score: 85, attempts: "1.7×" },
  { name: "Customer Due Diligence (CDD)", passed: "2/15", score: 97, attempts: "2.0×" }
];

const palsLearnerScores = [
  { learner: "Bima Rindarto", overall: null, scores: [null, null, null, null, null] },
  { learner: "Gam Mai", overall: 78, scores: [null, null, 94, 61, null] },
  { learner: "Learner Chuen", overall: 86, scores: [94, 84, 80, 94, 94] },
  { learner: "vin", overall: 100, scores: [100, 100, 100, 100, 100] }
];

const taxonomyGroups = [
  { id: "demo-june", name: "Demo June", meta: "1 learner", completion: 100, score: 86 },
  { id: "heyhi-demo", name: "HeyHi Demo", meta: "8 learners", completion: 56, score: 88 }
];

const taxonomyLearners = [
  { id: "bima", name: "Bima Rindarto", meta: "5 enrolled courses", completion: 67, score: 89 },
  { id: "dzung", name: "Dzung", meta: "5 enrolled courses", completion: 38, score: 80 },
  { id: "dzung-cao", name: "Dzung Cao", meta: "5 enrolled courses", completion: 60, score: 85 },
  { id: "glenn", name: "Glenn", meta: "5 enrolled courses", completion: 63, score: 86 },
  { id: "learner-vin", name: "Learner Vin", meta: "5 enrolled courses", completion: 0, score: null },
  { id: "thanh", name: "Thanh", meta: "5 enrolled courses", completion: 83, score: 88 },
  { id: "zhi-learns", name: "Zhi Chuen Learns", meta: "5 enrolled courses", completion: 60, score: 91 },
  { id: "gam-mai", name: "Gam Mai", meta: "2 enrolled courses", completion: 53, score: 77 },
  { id: "learner", name: "learner", meta: "1 enrolled course", completion: 47, score: null },
  { id: "learner-chuen", name: "Learner Chuen", meta: "1 enrolled course", completion: 100, score: 86 },
  { id: "quyen", name: "Quyen", meta: "1 enrolled course", completion: 67, score: null },
  { id: "vin", name: "vin", meta: "1 enrolled course", completion: 40, score: 100 },
  { id: "zhi-email", name: "zhichuenf@gmail.com", meta: "1 enrolled course", completion: 0, score: 30 },
  { id: "admin-kuro", name: "Admin_Kuro", meta: "0 enrolled courses", completion: 0, score: null },
  { id: "bima-learner", name: "bima leraner", meta: "0 enrolled courses", completion: 0, score: null },
  { id: "demo-2", name: "Demo 2", meta: "0 enrolled courses", completion: 0, score: null },
  { id: "wahyu", name: "Wahyu", meta: "0 enrolled courses", completion: 0, score: null }
];

const palsRangeProfiles = {
  all: { label: "All time", completionFactor: 1, scoreDelta: 0 },
  30: { label: "Last 30 days", completionFactor: 0.58, scoreDelta: -4 },
  90: { label: "Last 90 days", completionFactor: 0.82, scoreDelta: -2 },
  ytd: { label: "Year To Date", completionFactor: 0.94, scoreDelta: -1 }
};

const skillsLearners = [
  { id: "bima-23", label: "Bima Rindarto · bima+23@heyhi.sg", hasData: true, groupId: "demo-june" },
  { id: "bima-learner", label: "bima leraner · bimalearner@heyhi.sg", hasData: false, groupId: "heyhi-demo" },
  { id: "gam-mai", label: "Gam Mai · maigam08092000@gmail.com", hasData: true, groupId: "heyhi-demo" },
  { id: "learner-chuen", label: "Learner Chuen · zhichuen+learner7@heyhi.sg", hasData: true, groupId: "heyhi-demo" },
  { id: "learner-vin", label: "Learner Vin · learnerdemo_vin@heyhi.sg", hasData: true, groupId: "heyhi-demo" }
];

const skillSectors = [
  {
    id: "accountancy",
    label: "Accountancy (4)",
    category: "Accountancy",
    skills: [
      { name: "Forensic Accounting", correct: 8, total: 10, mastery: 82, cbl: { score: 78, scenarios: 2 } },
      { name: "Financial Reporting", correct: 7, total: 10, mastery: 70, cbl: null },
      { name: "Audit and Assurance", correct: 0, total: 0, mastery: 74, cbl: { score: 74, scenarios: 3 } },
      { name: "Tax Compliance", correct: 6, total: 10, mastery: 68, cbl: { score: 62, scenarios: 1 } }
    ]
  },
  {
    id: "financial-services",
    label: "Financial Services (14)",
    category: "Business Development and Strategy Management",
    skills: [
      { name: "Strategy Planning", correct: 8, total: 10, mastery: 80, cbl: { score: 76, scenarios: 2 } },
      { name: "Continuous Improvement", correct: 6, total: 10, mastery: 67, cbl: null },
      { name: "Risk and Compliance", correct: 0, total: 0, mastery: 73, cbl: { score: 73, scenarios: 2 } },
      { name: "Client Advisory", correct: 0, total: 0, mastery: null, cbl: null }
    ]
  },
  {
    id: "healthcare",
    label: "Healthcare (10)",
    category: "Department Management",
    skills: [
      { name: "Billing Procedure", correct: 7, total: 10, mastery: 78, cbl: { score: 74, scenarios: 2 } },
      { name: "Patient Service Operations", correct: 9, total: 10, mastery: 86, cbl: { score: 82, scenarios: 3 } },
      { name: "Claims Processing", correct: 6, total: 10, mastery: 65, cbl: null },
      { name: "Healthcare Data Protection", correct: 0, total: 0, mastery: 79, cbl: { score: 79, scenarios: 2 } }
    ]
  },
  {
    id: "hotel",
    label: "Hotel and Accommodation Services (6)",
    category: "Housekeeping Operations",
    skills: [
      { name: "Asset and Inventory", correct: 9, total: 10, mastery: 88, cbl: { score: 84, scenarios: 2 } },
      { name: "Guest Service", correct: 8, total: 10, mastery: 82, cbl: { score: 80, scenarios: 3 } },
      { name: "Housekeeping Quality", correct: 7, total: 10, mastery: 74, cbl: null },
      { name: "Front Office Operations", correct: 0, total: 0, mastery: 77, cbl: { score: 77, scenarios: 2 } }
    ]
  },
  {
    id: "infocomm",
    label: "Infocomm Technology (3)",
    category: "Business Development",
    skills: [
      { name: "Data Analytics", correct: 8, total: 10, mastery: 81, cbl: { score: 78, scenarios: 2 } },
      { name: "Cybersecurity Awareness", correct: 7, total: 10, mastery: 73, cbl: { score: 69, scenarios: 2 } },
      { name: "Cloud Operations", correct: 6, total: 10, mastery: 66, cbl: null }
    ]
  },
  {
    id: "training",
    label: "Training and Adult Education (15)",
    category: "Business Finance",
    skills: [
      { name: "Financial Planning and Analysis", correct: 20, total: 20, mastery: 100, cbl: null },
      { name: "Learning Needs Analysis", correct: 8, total: 10, mastery: 84, cbl: { score: 80, scenarios: 2 } },
      { name: "Learning Facilitation", correct: 7, total: 10, mastery: 76, cbl: { score: 74, scenarios: 3 } },
      { name: "Assessment Design", correct: 0, total: 0, mastery: 71, cbl: { score: 71, scenarios: 1 } }
    ]
  }
];

const assessments = [
  { name: "Customer Service Standards and Privacy Assessment", attempts: 11, completed: 10, score: 66, pass: 30, completion: 91 },
  { name: "Customer Service Operations & Policy Assessment", attempts: 8, completed: 8, score: 67, pass: 63, completion: 100 },
  { name: "Treasury 101", attempts: 8, completed: 8, score: 38, pass: 38, completion: 100 },
  { name: "Customer Identity Verification Standards Assessment", attempts: 6, completed: 6, score: 64, pass: 33, completion: 100 },
  { name: "dzung test 1", attempts: 6, completed: 6, score: 59, pass: 33, completion: 100 },
  { name: "test bima", attempts: 5, completed: 5, score: 79, pass: 80, completion: 100 }
];

const trendSeries = {
  completions: [0, 3, 2, 5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  enrollments: [0, 1, 4, 2, 3, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

const state = {
  tab: "skills",
  palsMode: "group",
  palsRange: "all",
  palsEntity: "all",
  expandedPals: null,
  palsDetailTab: "org",
  skillsMode: "organization",
  skillsGroup: null,
  skillsLearner: null,
  skillsSector: null
};

const analyticsPanel = document.querySelector("#analytics-panel");
const reportDialog = document.querySelector("[data-report-dialog]");
const dialogContent = document.querySelector("[data-dialog-content]");

function svgIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = svgIcon(node.dataset.icon);
  });
}

function progress(value, tone = "is-purple", label = "Progress") {
  const bounded = Math.max(0, Math.min(100, Number(value) || 0));
  return `
    <span class="progress-cell">
      <span class="progress-track" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${bounded}">
        <span class="progress-fill ${tone}" style="width:${bounded}%"></span>
      </span>
      <strong>${bounded}%</strong>
    </span>`;
}

function progressBar(value, tone = "is-purple", label = "Progress") {
  const bounded = Math.max(0, Math.min(100, Number(value) || 0));
  return `
    <span class="progress-track" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${bounded}">
      <span class="progress-fill ${tone}" style="width:${bounded}%"></span>
    </span>`;
}

function toneFor(value) {
  if (value < 50) return "is-red";
  if (value < 76) return "is-amber";
  return "is-green";
}

function initials(name) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function radarChart(items, chartId, accessibleLabel) {
  const padded = items.length >= 3
    ? items
    : [...items, ...Array.from({ length: 3 - items.length }, () => ({ name: "", value: 0 }))];
  const width = 360;
  const height = 310;
  const cx = 180;
  const cy = 150;
  const radius = 100;
  const angleFor = (index) => -Math.PI / 2 + (Math.PI * 2 * index) / padded.length;
  const point = (index, scale = 1) => {
    const angle = angleFor(index);
    return [cx + Math.cos(angle) * radius * scale, cy + Math.sin(angle) * radius * scale];
  };
  const polygon = (scale) => padded.map((_, index) => point(index, scale).join(",")).join(" ");
  const valuePolygon = padded
    .map((item, index) => point(index, Math.max(0, Math.min(100, item.value)) / 100).join(","))
    .join(" ");

  return `
    <svg class="radar-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${chartId}-title ${chartId}-desc">
      <title id="${chartId}-title">${accessibleLabel}</title>
      <desc id="${chartId}-desc">Radar plot with values from zero to one hundred percent.</desc>
      ${[0.25, 0.5, 0.75, 1].map((scale) => `<polygon points="${polygon(scale)}" fill="none" stroke="#e4e7ec" stroke-width="1" />`).join("")}
      ${padded.map((_, index) => {
        const [x, y] = point(index);
        return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e4e7ec" stroke-width="1" />`;
      }).join("")}
      <polygon points="${valuePolygon}" fill="rgba(35,167,201,.22)" stroke="#23a7c9" stroke-width="2" />
      ${padded.map((item, index) => {
        if (!item.name) return "";
        const [x, y] = point(index, 1.18);
        const anchor = x < cx - 8 ? "end" : x > cx + 8 ? "start" : "middle";
        const cleanName = item.name.length > 23 ? `${item.name.slice(0, 21)}…` : item.name;
        return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle">${cleanName}</text>`;
      }).join("")}
    </svg>`;
}

function renderCourses() {
  return `
    <div class="stack">
      <section class="panel">
        <div class="panel-body">
          <div class="panel-heading"><div><h2>KP Mastery by Course</h2></div></div>
          <div class="chart-shell" role="img" aria-label="Course KP mastery: Digital Marketing Strategy 25 percent; Character Education 27 percent">
            <div class="course-bars">
              ${courses.map((course) => `
                <div class="course-bar-row">
                  <span title="${course.name}">${course.name}</span>
                  <span class="bar-track"><span class="bar-fill" style="width:${course.mastery}%"></span></span>
                  <strong>${course.mastery}%</strong>
                </div>`).join("")}
            </div>
            <div class="chart-axis"><span></span><div><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div><span></span></div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="table-title"><span data-icon="check-circle"></span><h3>Course KP Mastery</h3></div>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Course</th><th>Enrollments</th><th>Completions</th><th>KP Mastery</th></tr></thead>
            <tbody>
              ${courses.map((course) => `<tr><td>${course.name}</td><td>${course.enrollments}</td><td>${course.completions}</td><td>${progress(course.mastery, "is-purple", `${course.name} KP mastery`)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>`;
}

function renderPalsDetail(course) {
  const topics = course.id === "aml"
    ? palsTopics
    : [{ name: `${course.name} overview`, passed: `${course.completed}/${course.assigned}`, score: course.score, attempts: "1.8×" }];
  const learners = course.id === "aml"
    ? palsLearnerScores
    : palsLearnerScores.map((learner, index) => {
        const hasScore = index < Math.min(course.completed, palsLearnerScores.length);
        const score = hasScore ? Math.max(0, Math.min(100, course.score + [2, -3, 0, 4][index])) : null;
        return { learner: learner.learner, overall: score, scores: topics.map(() => score) };
      });
  return `
    <tr class="pals-detail-row">
      <td colspan="7">
        <div class="pals-detail">
          <div class="detail-tabs" role="group" aria-label="${course.name} detail views">
            <button class="segmented-button ${state.palsDetailTab === "org" ? "is-active" : ""}" type="button" aria-pressed="${state.palsDetailTab === "org"}" data-pals-detail-tab="org">Org Stats</button>
            <button class="segmented-button ${state.palsDetailTab === "learner" ? "is-active" : ""}" type="button" aria-pressed="${state.palsDetailTab === "learner"}" data-pals-detail-tab="learner">Learner Scores</button>
          </div>
          ${state.palsDetailTab === "org" ? `
            <div class="detail-summary"><strong>${course.score}%</strong><span>Avg. Score · ${course.kp} of ${course.kp} topics with passing activity</span></div>
            <div class="table-scroll" aria-label="${course.name} organization statistics">
              <table class="data-table">
                <thead><tr><th>Topic</th><th>Passed</th><th>Avg. Score</th><th>Avg. Attempts</th></tr></thead>
                <tbody>${topics.map((topic) => `<tr><td>${topic.name}</td><td>${topic.passed}</td><td>${topic.score}%</td><td>${topic.attempts}</td></tr>`).join("")}</tbody>
              </table>
            </div>` : `
            <div class="detail-summary"><strong>${course.assigned}</strong><span>Assigned learners · Select a topic score to inspect the attempt summary</span></div>
            <div class="table-scroll" aria-label="${course.name} learner scores">
              <table class="data-table learner-score-table">
                <thead><tr><th>Learner</th><th>Overall</th>${topics.map((topic) => `<th title="${topic.name}">${topic.name}</th>`).join("")}</tr></thead>
                <tbody>${learners.map((learner) => `<tr><td>${learner.learner}</td><td>${learner.overall == null ? "—" : `${learner.overall}%`}</td>${learner.scores.map((score, index) => `<td>${score == null ? "—" : `<button class="attempt-score-button" type="button" data-attempt-course="${course.name}" data-attempt-learner="${learner.learner}" data-attempt-topic="${topics[index].name}" data-attempt-score="${score}" aria-label="View ${learner.learner} attempts for ${topics[index].name}">${score}%</button>`}</td>`).join("")}</tr>`).join("")}</tbody>
              </table>
            </div>`}
        </div>
      </td>
    </tr>`;
}

function scopedTaxonomyItem(item) {
  const profile = palsRangeProfiles[state.palsRange] || palsRangeProfiles.all;
  return {
    ...item,
    completion: Math.round(item.completion * profile.completionFactor),
    score: item.score == null ? null : Math.max(0, Math.min(100, item.score + profile.scoreDelta))
  };
}

function taxonomyRows() {
  const source = state.palsMode === "group" ? taxonomyGroups : taxonomyLearners;
  const selected = state.palsEntity === "all" ? source : source.filter((item) => item.id === state.palsEntity);
  return selected.map(scopedTaxonomyItem);
}

function renderPals() {
  const radarItems = palsCourses.map((course) => ({ name: course.name, value: course.completion }));
  const rows = taxonomyRows();
  const rangeProfile = palsRangeProfiles[state.palsRange] || palsRangeProfiles.all;
  return `
    <div class="stack">
      <section class="panel">
        <div class="panel-body">
          <div class="panel-heading">
            <div><h2>Completion Rate by PALS Course</h2><p>Compare course completion across published PALS courses.</p></div>
            <div class="panel-count"><strong>5</strong><span>courses</span></div>
          </div>
          <div class="pals-overview-layout">
            ${radarChart(radarItems, "pals-course-radar", "Completion rate by PALS course")}
            <div class="pals-list">
              ${[...palsCourses].sort((a, b) => b.completion - a.completion).map((course) => `
                <div class="pals-progress-row">
                  <div><strong title="${course.name}">${course.name}</strong><small>${course.kp} KP · ${course.assigned} assigned · ${course.completed} completed</small></div>
                  ${progressBar(course.completion, toneFor(course.completion), `${course.name} completion rate`)}
                  <strong>${course.completion}%</strong>
                </div>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-body table-heading-body">
          <div class="panel-heading">
            <div><h2>Published PALS Courses</h2><p>All published PALS courses in this organization.</p></div>
            <div class="panel-count"><strong>5</strong><span>published</span></div>
          </div>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th aria-label="Course detail"></th><th>Course</th><th>Knowledge Points</th><th>Assigned Learners</th><th>Completed</th><th>Completion Rate</th><th>Avg. Score</th></tr></thead>
            <tbody>
              ${palsCourses.map((course) => `
                <tr>
                  <td><button class="expand-button" type="button" data-pals-expand="${course.id}" aria-expanded="${state.expandedPals === course.id}" aria-label="${state.expandedPals === course.id ? "Collapse" : "Expand"} ${course.name}"><span data-icon="chevron"></span></button></td>
                  <td>${course.name}</td><td>${course.kp}</td><td>${course.assigned}</td><td>${course.completed}</td>
                  <td>${progress(course.completion, toneFor(course.completion), `${course.name} completion rate`)}</td>
                  <td>${progress(course.score, "is-teal", `${course.name} average score`)}</td>
                </tr>
                ${state.expandedPals === course.id ? renderPalsDetail(course) : ""}`).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-body">
          <div class="panel-heading"><div><h2>PALS Taxonomy</h2><p>Completion and scoring breakdown by ${state.palsMode === "group" ? "group" : "individual learner"} · ${rangeProfile.label}.</p></div></div>
          <div class="taxonomy-toolbar">
            <div class="segmented-control" role="group" aria-label="PALS taxonomy level">
              <button class="segmented-button ${state.palsMode === "group" ? "is-active" : ""}" type="button" data-pals-mode="group" aria-pressed="${state.palsMode === "group"}">Group</button>
              <button class="segmented-button ${state.palsMode === "individual" ? "is-active" : ""}" type="button" data-pals-mode="individual" aria-pressed="${state.palsMode === "individual"}">Individual</button>
            </div>
            <div class="filter-fields">
              <div class="field"><label for="pals-range">Date range</label><select id="pals-range" data-pals-range><option value="all" ${state.palsRange === "all" ? "selected" : ""}>All time</option><option value="30" ${state.palsRange === "30" ? "selected" : ""}>Last 30 days</option><option value="90" ${state.palsRange === "90" ? "selected" : ""}>Last 90 days</option><option value="ytd" ${state.palsRange === "ytd" ? "selected" : ""}>Year To Date</option></select></div>
              <div class="field"><label for="pals-entity">${state.palsMode === "group" ? "Group" : "Learner"}</label><select id="pals-entity" data-pals-entity><option value="all">All ${state.palsMode === "group" ? "Groups" : "Learners"}</option>${(state.palsMode === "group" ? taxonomyGroups : taxonomyLearners).map((item) => `<option value="${item.id}" ${state.palsEntity === item.id ? "selected" : ""}>${item.name}</option>`).join("")}</select></div>
            </div>
          </div>
          <div class="taxonomy-head"><span>${state.palsMode === "group" ? "Group" : "Learner"}</span><span>Completion Rate</span><span>Avg. Score</span><span>Report</span></div>
          <div class="taxonomy-list">
            ${rows.map((item) => `
              <div class="taxonomy-row">
                <div class="taxonomy-person"><span class="avatar">${initials(item.name)}</span><div><strong>${item.name}</strong><small>${item.meta}</small></div></div>
                ${progress(item.completion, toneFor(item.completion), `${item.name} completion rate`)}
                ${item.score == null ? '<span aria-label="No average score">—</span>' : progress(item.score, "is-teal", `${item.name} average score`)}
                <button class="view-report-button" type="button" data-view-report="${item.id}">View Report</button>
              </div>`).join("")}
          </div>
        </div>
      </section>
    </div>`;
}

function palsSkillScore(skill) {
  return skill.total ? Math.round(skill.correct / skill.total * 100) : null;
}

function skillEvidenceState(skill) {
  const hasPals = palsSkillScore(skill) != null;
  const hasCbl = skill.cbl?.score != null;
  if (hasPals && hasCbl) return { label: "Both sources", className: "is-dual" };
  if (hasPals) return { label: "PALS only", className: "is-pals" };
  if (hasCbl) return { label: "CBL only", className: "is-cbl" };
  return { label: "No evidence yet", className: "is-empty" };
}

function skillSourceCard(type, score, meta) {
  const isPals = type === "pals";
  const title = isPals ? "PALS Knowledge" : "CBL Application";
  const icon = isPals ? "book-open" : "trophy";
  const sourceClass = isPals ? "is-pals" : "is-cbl";
  return `
    <article class="skill-source-card ${sourceClass}">
      <div class="skill-source-heading"><span class="skill-source-icon" data-icon="${icon}"></span><span>${title}</span><strong>${score == null ? "—" : `${score}%`}</strong></div>
      <p>${meta}</p>
      ${score == null ? '<span class="source-empty-track" aria-hidden="true"></span>' : progressBar(score, isPals ? "is-purple" : "is-teal", `${title} score`)}
    </article>`;
}

function renderSkillEvidenceCard(skill, sector) {
  const palsScore = palsSkillScore(skill);
  const cblScore = skill.cbl?.score ?? null;
  const mastery = skill.mastery;
  const evidenceState = skillEvidenceState(skill);
  const palsMeta = skill.total ? `${skill.correct}/${skill.total} questions correct` : "No question evidence";
  const scenarioCount = skill.cbl?.scenarios || 0;
  const cblMeta = scenarioCount ? `${scenarioCount} scored ${scenarioCount === 1 ? "scenario" : "scenarios"}` : "No scenario evidence";

  return `
    <article class="skill-evidence-card">
      <header class="skill-evidence-head">
        <div class="skill-name"><strong>${skill.name}</strong><small>${sector.category}</small></div>
        <span class="evidence-badge ${evidenceState.className}">${evidenceState.label}</span>
        <div class="skill-overall"><span>Overall mastery</span><strong>${mastery == null ? "—" : `${mastery}%`}</strong></div>
      </header>
      ${mastery == null ? '<span class="mastery-empty-track" aria-hidden="true"></span>' : progressBar(mastery, toneFor(mastery), `${skill.name} overall mastery`)}
      <div class="skill-source-grid">
        ${skillSourceCard("pals", palsScore, palsMeta)}
        ${skillSourceCard("cbl", cblScore, cblMeta)}
      </div>
      <footer class="skill-evidence-footer">
        <span>${mastery == null ? "Complete PALS or a tagged CBL to create evidence." : "Combined view across available learning evidence."}</span>
        <button class="evidence-button" type="button" data-skill-evidence="${sector.id}" data-skill-name="${skill.name}" ${mastery == null ? "disabled" : ""}>View evidence</button>
      </footer>
    </article>`;
}

function renderSkills() {
  const learner = skillsLearners.find((item) => item.id === state.skillsLearner) || skillsLearners[0];
  const sector = skillSectors.find((item) => item.id === state.skillsSector) || skillSectors[0];
  const sectorOptions = skillSectors.map((item) => `<option value="${item.id}" ${item.id === sector.id ? "selected" : ""}>${item.label}</option>`).join("");
  const trackedSkills = sector.skills.filter((skill) => skill.mastery != null);
  const sectorMastery = trackedSkills.length ? Math.round(trackedSkills.reduce((sum, skill) => sum + skill.mastery, 0) / trackedSkills.length) : null;
  const palsSkills = sector.skills.filter((skill) => palsSkillScore(skill) != null).length;
  const cblSkills = sector.skills.filter((skill) => skill.cbl?.score != null).length;
  const evidenceItems = sector.skills.reduce((sum, skill) => sum + skill.total + (skill.cbl?.scenarios || 0), 0);

  return `
    <div class="stack">
      <div class="skills-learner-field">
        <div class="field"><label for="skills-learner">Learner</label><select id="skills-learner" data-skills-learner>${skillsLearners.map((item) => `<option value="${item.id}" ${item.id === learner.id ? "selected" : ""}>${item.label}</option>`).join("")}</select></div>
      </div>
      <section class="panel">
        <div class="panel-body">
          <div class="panel-heading">
            <div><h2>Skills Analytics</h2><p>See knowledge demonstrated in PALS and applied performance demonstrated in CBL.</p></div>
            <div class="panel-count"><strong>${learner.hasData ? 6 : 0}</strong><span>sectors</span></div>
          </div>
          ${learner.hasData ? `
            <div class="field sector-field"><label for="skills-sector">Sector</label><select id="skills-sector" data-skills-sector>${sectorOptions}</select></div>
            <div class="skills-concept-note"><span data-icon="sparkle"></span><p><strong>Sample data</strong> · Overall mastery is illustrative until the scoring logic is finalised. The interface remains source-aware without exposing a fixed formula.</p></div>
            <section class="skills-summary-grid" aria-label="Selected sector skill summary">
              <article class="is-primary"><span>Overall mastery</span><strong>${sectorMastery == null ? "—" : `${sectorMastery}%`}</strong><small>${trackedSkills.length} of ${sector.skills.length} skills with evidence</small></article>
              <article><span>Evidence sources</span><strong>${palsSkills + cblSkills}</strong><small>${palsSkills} PALS · ${cblSkills} CBL</small></article>
              <article><span>Evidence items</span><strong>${evidenceItems}</strong><small>Questions and scored scenarios</small></article>
            </section>
            <div class="skills-layout">
              <div class="skills-profile-panel">
                <p class="skill-category-label">Sector profile</p>
                <h3 class="skill-category-title">${sector.category}</h3>
                ${radarChart(sector.skills.map((skill) => ({ name: skill.name, value: skill.mastery || 0 })), "skills-radar", `${sector.label} overall skill mastery`)}
                <div class="source-legend"><span><i class="is-pals"></i>PALS Knowledge</span><span><i class="is-cbl"></i>CBL Application</span></div>
              </div>
              <div class="skill-list skill-evidence-list">
                  ${sector.skills.map((skill) => renderSkillEvidenceCard(skill, sector)).join("")}
                </div>
            </div>` : `
            <div class="empty-state"><div><span class="empty-state-icon" data-icon="sparkle"></span><h3>No skills tracked yet</h3><p>Complete lessons and assessments to start building this learner's skill profile.</p></div></div>`}
        </div>
      </section>
    </div>`;
}

function renderCbl() {
  return `
    <div class="stack">
      <section class="panel">
        <div class="panel-body">
          <div class="panel-heading"><div><h2>CBL Analytics</h2><p>Review case-based learning practice and roleplay performance across your organization. Scores are averages from all attempts.</p></div></div>
          <section class="cbl-summary" aria-label="CBL summary">
            <article><span>Available cases</span><strong>0</strong></article>
            <article><span>Learners attempted</span><strong>0</strong></article>
            <article><span>Total attempts</span><strong>0</strong></article>
            <article><span>Average highest score</span><strong>0%</strong></article>
          </section>
        </div>
      </section>
      <section class="panel"><div class="panel-body"><div class="panel-heading"><div><h2>Practice and Roleplay Cases</h2></div></div><div class="empty-state"><div><span class="empty-state-icon" data-icon="trophy"></span><h3>No CBL scenarios available yet</h3><p>Published practice and roleplay cases will appear here when they become available.</p></div></div></div></section>
    </div>`;
}

function assessmentPassSummary() {
  const totalCompleted = assessments.reduce((sum, item) => sum + item.completed, 0);
  const totalPassed = assessments.reduce((sum, item) => sum + (item.pass / 100) * item.completed, 0);
  const passRate = totalCompleted ? Math.round((totalPassed / totalCompleted) * 100) : 0;
  return { passRate, failRate: 100 - passRate };
}

function renderAssessments() {
  const { passRate, failRate } = assessmentPassSummary();
  return `
    <div class="stack">
      <div class="two-column">
        <section class="panel"><div class="panel-body"><div class="panel-heading"><div><h2>Score vs Pass Rate</h2><p>Average score and pass rate for each assessment.</p></div></div><div class="assessment-chart" role="img" aria-label="Grouped bar chart comparing assessment scores and pass rates">${assessments.map((item) => `<div class="assessment-bar-group" title="${item.name}: score ${item.score}%, pass rate ${item.pass}%"><span class="assessment-bar is-score" style="height:${item.score}%"></span><span class="assessment-bar is-pass" style="height:${item.pass}%"></span><span class="assessment-bar-label">${item.name}</span></div>`).join("")}</div><div class="chart-legend"><span><i class="legend-swatch" style="background:var(--purple)"></i>Avg. Score</span><span><i class="legend-swatch" style="background:var(--teal)"></i>Pass Rate</span></div></div></section>
        <section class="panel"><div class="panel-body"><div class="panel-heading"><div><h2>Pass / Fail</h2><p>Outcome split across completed attempts.</p></div></div><div class="donut-wrap"><div class="donut" role="img" aria-label="${passRate} percent passed, ${failRate} percent failed" style="background:conic-gradient(var(--teal) 0 ${passRate}%, var(--red) ${passRate}% 100%)"><div class="donut-label" style="inset:61px 0 auto"><strong>${passRate}%</strong><span>passed</span></div></div><div class="chart-legend"><span><i class="legend-swatch" style="background:var(--teal)"></i>Passed ${passRate}%</span><span><i class="legend-swatch" style="background:var(--red)"></i>Failed ${failRate}%</span></div></div></div></section>
      </div>
      <section class="panel"><div class="table-title"><span data-icon="clipboard"></span><h3>Assessment Performance</h3></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Assessment</th><th>Attempts</th><th>Completed</th><th>Avg. Score</th><th>Pass Rate</th><th>Completion</th></tr></thead><tbody>${assessments.map((item) => `<tr><td>${item.name}</td><td>${item.attempts}</td><td>${item.completed}</td><td>${item.score}%</td><td>${item.pass}%</td><td>${progress(item.completion, "is-teal", `${item.name} completion`)}</td></tr>`).join("")}</tbody></table></div></section>
    </div>`;
}

function lineChart(values, chartId, title, color) {
  const width = 840;
  const height = 280;
  const left = 42;
  const right = 18;
  const top = 18;
  const bottom = 38;
  const max = Math.max(8, ...values);
  const x = (index) => left + (index / (values.length - 1)) * (width - left - right);
  const y = (value) => top + (1 - value / max) * (height - top - bottom);
  const points = values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const labels = [
    { index: 0, text: "23 Jun" },
    { index: 5, text: "28 Jun" },
    { index: 10, text: "03 Jul" },
    { index: 15, text: "08 Jul" },
    { index: 20, text: "13 Jul" },
    { index: 25, text: "18 Jul" }
  ];
  return `
    <svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${chartId}-title ${chartId}-desc">
      <title id="${chartId}-title">${title}</title>
      <desc id="${chartId}-desc">Daily values over the last thirty days. The highest value is ${Math.max(...values)}.</desc>
      ${[0, 2, 4, 6, 8].map((tick) => `<line x1="${left}" y1="${y(tick)}" x2="${width - right}" y2="${y(tick)}" stroke="#e9ecf0" /><text x="${left - 10}" y="${y(tick) + 3}" text-anchor="end">${tick}</text>`).join("")}
      <line x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}" stroke="#aeb5c0" />
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
      ${labels.map((label) => `<text x="${x(label.index)}" y="${height - 14}" text-anchor="middle">${label.text}</text>`).join("")}
    </svg>`;
}

function renderTrends() {
  return `
    <div class="stack">
      <section class="panel"><div class="panel-body"><div class="panel-heading"><div><h2>Lesson Completions (Last 30 Days)</h2><p>Daily lesson completions across the organization.</p></div></div>${lineChart(trendSeries.completions, "lesson-completions-chart", "Lesson completions during the last 30 days", "#7c3ff2")}</div></section>
      <section class="panel"><div class="panel-body"><div class="panel-heading"><div><h2>Enrollment Activity (Last 30 Days)</h2><p>Daily course enrollments across the organization.</p></div></div>${lineChart(trendSeries.enrollments, "enrollment-activity-chart", "Enrollment activity during the last 30 days", "#23a7c9")}</div></section>
    </div>`;
}

const tabRenderers = {
  courses: renderCourses,
  pals: renderPals,
  skills: renderSkills,
  cbl: renderCbl,
  assessments: renderAssessments,
  trends: renderTrends
};

function render() {
  document.querySelectorAll("[data-tab]").forEach((tab) => {
    const active = tab.dataset.tab === state.tab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  analyticsPanel.setAttribute("aria-labelledby", `tab-${state.tab}`);
  analyticsPanel.innerHTML = (tabRenderers[state.tab] || renderCourses)();
  hydrateIcons(analyticsPanel);
}

function renderAndFocus(selector) {
  render();
  analyticsPanel.querySelector(selector)?.focus();
}

function syncSidebarState() {
  const sidebar = document.querySelector("[data-sidebar]");
  const scrim = document.querySelector("[data-sidebar-scrim]");
  const toggle = document.querySelector("[data-sidebar-toggle]");
  const isMobile = window.matchMedia("(max-width: 860px)").matches;

  if (isMobile) {
    sidebar.classList.remove("is-collapsed");
    toggle.setAttribute("aria-expanded", String(sidebar.classList.contains("is-open")));
    return;
  }

  sidebar.classList.remove("is-open");
  scrim.hidden = true;
  toggle.setAttribute("aria-expanded", String(!sidebar.classList.contains("is-collapsed")));
}

function showReportDialog({ title, subtitle, summary, summaryLabel = "Report summary", body }) {
  dialogContent.innerHTML = `
    <header class="dialog-header">
      <div><h2 id="report-dialog-title">${title}</h2><p>${subtitle}</p></div>
      <button class="dialog-close" type="button" aria-label="Close report" data-dialog-close><span data-icon="close"></span></button>
    </header>
    <div class="dialog-body">
      <section class="report-summary" aria-label="${summaryLabel}">${summary}</section>
      ${body}
    </div>`;
  hydrateIcons(dialogContent);
  reportDialog.showModal();
}

function openReport(entityId) {
  const items = [...taxonomyGroups, ...taxonomyLearners];
  const sourceItem = items.find((candidate) => candidate.id === entityId);
  if (!sourceItem) return;
  const item = scopedTaxonomyItem(sourceItem);
  const rangeProfile = palsRangeProfiles[state.palsRange] || palsRangeProfiles.all;
  showReportDialog({
    title: item.name,
    subtitle: `PALS taxonomy report · ${rangeProfile.label}`,
    summary: `
      <article><span>Learning scope</span><strong>${item.meta}</strong></article>
      <article><span>Completion rate</span><strong>${item.completion}%</strong></article>
      <article><span>Average score</span><strong>${item.score == null ? "—" : `${item.score}%`}</strong></article>`,
    body: `
      <div class="panel-heading"><div><h3>Course activity</h3><p>This local replica uses the same visible production summary data.</p></div></div>
      ${palsCourses.slice(0, 3).map((course) => `<article class="question-card"><strong>${course.name}</strong><p>${course.completed} of ${course.assigned} learners completed · ${course.score}% average score</p></article>`).join("")}`
  });
}

function openAttemptReport(courseName, learner, topic, score) {
  showReportDialog({
    title: topic,
    subtitle: `${courseName} · ${learner}`,
    summaryLabel: "Attempt summary",
    summary: `
      <article><span>Attempts</span><strong>3</strong></article>
      <article><span>Latest score</span><strong>${score}%</strong></article>
      <article><span>Status</span><strong>${Number(score) >= 70 ? "Passed" : "Failed"}</strong></article>`,
    body: `
      <div class="panel-heading"><div><h3>Latest attempt</h3><p>Representative report content from the production interaction.</p></div></div>
      <article class="question-card"><strong>Q1. Which response best applies the concept in this scenario?</strong><p>Correct answer recorded. The production report expands each attempt into a question-by-question review.</p></article>
      <article class="question-card"><strong>Q2. What is the most appropriate next step?</strong><p>Correct answer recorded. Use this dialog to evaluate the density and hierarchy of the drill-down state.</p></article>
      <article class="question-card"><strong>Q3. Which control should be prioritized?</strong><p>Your answer and the correct answer are shown when a response is incorrect.</p></article>`
  });
}

function openSkillEvidence(sectorId, skillName) {
  const sector = skillSectors.find((item) => item.id === sectorId);
  const skill = sector?.skills.find((item) => item.name === skillName);
  if (!sector || !skill) return;

  const palsScore = palsSkillScore(skill);
  const cblScore = skill.cbl?.score ?? null;
  const mastery = skill.mastery;
  const evidenceState = skillEvidenceState(skill);
  const palsDescription = skill.total
    ? `${skill.correct} of ${skill.total} tagged questions were answered correctly.`
    : "No PALS question evidence has been recorded for this skill yet.";
  const scenarioCount = skill.cbl?.scenarios || 0;
  const cblDescription = scenarioCount
    ? `${scenarioCount} scored ${scenarioCount === 1 ? "scenario" : "scenarios"} mapped to this skill through CBL learning objectives.`
    : "No scored CBL scenario evidence has been recorded for this skill yet.";

  showReportDialog({
    title: skill.name,
    subtitle: `${sector.category} · ${evidenceState.label}`,
    summaryLabel: "Skill evidence summary",
    summary: `
      <article><span>Overall mastery</span><strong>${mastery == null ? "—" : `${mastery}%`}</strong></article>
      <article><span>PALS Knowledge</span><strong>${palsScore == null ? "—" : `${palsScore}%`}</strong></article>
      <article><span>CBL Application</span><strong>${cblScore == null ? "—" : `${cblScore}%`}</strong></article>`,
    body: `
      <div class="panel-heading"><div><h3>Evidence breakdown</h3><p>Review each source independently. Overall mastery remains illustrative until the scoring logic is finalised.</p></div></div>
      <article class="question-card"><strong>PALS Knowledge · ${palsScore == null ? "No evidence" : `${palsScore}%`}</strong><p>${palsDescription} This source represents knowledge checks from PALS questions tagged to the skill.</p></article>
      <article class="question-card"><strong>CBL Application · ${cblScore == null ? "No evidence" : `${cblScore}%`}</strong><p>${cblDescription} This source represents applied performance in case-based learning.</p></article>`
  });
}

document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href="#"]');
  if (anchor) event.preventDefault();

  const tab = event.target.closest("[data-tab]");
  if (tab) {
    state.tab = tab.dataset.tab;
    render();
    tab.focus();
    return;
  }

  const navToggle = event.target.closest("[data-analytics-nav]");
  if (navToggle) {
    const group = navToggle.closest(".nav-group");
    const open = group.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    return;
  }

  const sidebarToggle = event.target.closest("[data-sidebar-toggle]");
  if (sidebarToggle) {
    const sidebar = document.querySelector("[data-sidebar]");
    const scrim = document.querySelector("[data-sidebar-scrim]");
    const isMobile = window.matchMedia("(max-width: 860px)").matches;
    if (isMobile) {
      const open = sidebar.classList.toggle("is-open");
      scrim.hidden = !open;
      sidebarToggle.setAttribute("aria-expanded", String(open));
    } else {
      const collapsed = sidebar.classList.toggle("is-collapsed");
      sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    }
    return;
  }

  if (event.target.matches("[data-sidebar-scrim]")) {
    document.querySelector("[data-sidebar]").classList.remove("is-open");
    event.target.hidden = true;
    document.querySelector("[data-sidebar-toggle]").setAttribute("aria-expanded", "false");
    return;
  }

  const expand = event.target.closest("[data-pals-expand]");
  if (expand) {
    state.expandedPals = state.expandedPals === expand.dataset.palsExpand ? null : expand.dataset.palsExpand;
    state.palsDetailTab = "org";
    renderAndFocus(`[data-pals-expand="${expand.dataset.palsExpand}"]`);
    return;
  }

  const detailTab = event.target.closest("[data-pals-detail-tab]");
  if (detailTab) {
    state.palsDetailTab = detailTab.dataset.palsDetailTab;
    renderAndFocus(`[data-pals-detail-tab="${state.palsDetailTab}"]`);
    return;
  }

  const mode = event.target.closest("[data-pals-mode]");
  if (mode) {
    state.palsMode = mode.dataset.palsMode;
    state.palsEntity = "all";
    renderAndFocus(`[data-pals-mode="${state.palsMode}"]`);
    return;
  }

  const report = event.target.closest("[data-view-report]");
  if (report) {
    openReport(report.dataset.viewReport);
    return;
  }

  const skillEvidence = event.target.closest("[data-skill-evidence]");
  if (skillEvidence && !skillEvidence.disabled) {
    openSkillEvidence(skillEvidence.dataset.skillEvidence, skillEvidence.dataset.skillName);
    return;
  }

  const attempt = event.target.closest("[data-attempt-score]");
  if (attempt) {
    openAttemptReport(attempt.dataset.attemptCourse, attempt.dataset.attemptLearner, attempt.dataset.attemptTopic, attempt.dataset.attemptScore);
    return;
  }

  if (event.target.closest("[data-dialog-close]")) reportDialog.close();
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-pals-range]")) {
    state.palsRange = event.target.value;
    renderAndFocus("[data-pals-range]");
    return;
  }

  if (event.target.matches("[data-pals-entity]")) {
    state.palsEntity = event.target.value;
    renderAndFocus("[data-pals-entity]");
    return;
  }

  if (event.target.matches("[data-skills-learner]")) {
    state.skillsLearner = event.target.value;
    state.skillsSector = null;
    renderAndFocus("[data-skills-learner]");
    return;
  }

  if (event.target.matches("[data-skills-sector]")) {
    state.skillsSector = event.target.value;
    renderAndFocus("[data-skills-sector]");
  }
});

document.querySelector(".analytics-tabs").addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const tabs = [...document.querySelectorAll("[data-tab]")];
  const current = tabs.findIndex((tab) => tab.dataset.tab === state.tab);
  let next = current;
  if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
  if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = tabs.length - 1;
  event.preventDefault();
  tabs[next].click();
});

reportDialog.addEventListener("click", (event) => {
  if (event.target === reportDialog) reportDialog.close();
});

hydrateIcons();
render();
syncSidebarState();
window.addEventListener("resize", syncSidebarState);
