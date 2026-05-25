const icons = {
  grid: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  bars: '<path d="M4 19V5"></path><path d="M10 19V7"></path><path d="M16 19V9"></path><path d="M22 19V11"></path>',
  share: '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 13.5 6.8 4"></path><path d="m15.4 6.5-6.8 4"></path>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path><path d="M12 12v2"></path>',
  trophy: '<path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path><path d="M17 5h3a2 2 0 0 1-2 4h-1"></path><path d="M7 5H4a2 2 0 0 0 2 4h1"></path>',
  sliders: '<path d="M4 21v-7"></path><path d="M4 10V3"></path><path d="M12 21v-9"></path><path d="M12 8V3"></path><path d="M20 21v-5"></path><path d="M20 12V3"></path><path d="M2 14h4"></path><path d="M10 8h4"></path><path d="M18 16h4"></path>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>',
  clipboard: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M9 3h6v4H9z"></path><path d="m9 14 2 2 4-4"></path>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path><path d="M8 7h7"></path>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"></path><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"></path>',
  chart: '<path d="M3 3v18h18"></path><path d="M7 16V9"></path><path d="M12 16V5"></path><path d="M17 16v-4"></path>',
  chevron: '<path d="m18 15-6-6-6 6"></path>',
  sparkle: '<path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"></path><path d="M19 15l.7 2.3L22 18l-2.3.7L19 22l-.7-2.3L16 18l2.3-.7L19 15z"></path>',
  settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z"></path>',
  panel: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M10 4v16"></path>',
  help: '<circle cx="12" cy="12" r="10"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.4-2.2 1.7-2.7 3"></path><path d="M12 17h.01"></path>',
  clock: '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>',
  medal: '<path d="M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"></path><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"></path>',
  "check-circle": '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>',
  "book-open": '<path d="M2 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"></path><path d="M22 4h-7a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h8z"></path>',
  cap: '<path d="m22 10-10-5-10 5 10 5 10-5Z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path>',
  filter: '<path d="M22 3H2l8 9.5V20l4 2v-9.5L22 3Z"></path>',
  arrow: '<path d="m15 18-6-6 6-6"></path>',
  trend: '<path d="m3 17 6-6 4 4 8-8"></path><path d="M14 7h7v7"></path>'
};

const courseRows = [
  ["Digital Marketing Strategy", 6, 0, 0],
  ["Character Education: A Framework for Schools", 6, 0, 3],
  ["Build online audience and convert to sale", 1, 0, 0],
  ["Introduction to Sale", 0, 0, 0]
];

const palsRows = [
  ["Leadership Management", 3, 4, 0, 25],
  ["Advanced HR Management", 4, 4, 0, 0],
  ["Accountancy Specialist", 4, 1, 0, 25],
  ["Human Resource Specialist", 6, 1, 0, 67],
  ["Customer Service PALS Course", 8, 18, 12, 92],
  ["Sales Fundamentals", 5, 12, 7, 58],
  ["Finance for Non-Finance", 4, 9, 3, 41],
  ["Digital Collaboration", 6, 14, 8, 73]
];

const groups = [
  { id: "sales", name: "Sales Enablement", members: 32, completion: 72 },
  { id: "service", name: "Customer Service", members: 28, completion: 64 },
  { id: "marketing", name: "Marketing Team", members: 19, completion: 58 },
  { id: "operations", name: "Operations", members: 41, completion: 46 }
];

const learners = [
  { id: "datolow", name: "datolow_student", courses: 4, completion: 18 },
  { id: "rock01", name: "rockwills_student01", courses: 5, completion: 88 },
  { id: "rock02", name: "rockwills_student02", courses: 5, completion: 87 },
  { id: "rock03", name: "rockwills_student03", courses: 3, completion: 89 },
  { id: "amira", name: "amira_student", courses: 6, completion: 74 },
  { id: "ben", name: "benjamin_student", courses: 4, completion: 52 },
  { id: "cynthia", name: "cynthia_student", courses: 5, completion: 67 },
  { id: "darren", name: "darren_student", courses: 2, completion: 33 },
  { id: "elena", name: "elena_student", courses: 7, completion: 91 },
  { id: "faris", name: "faris_student", courses: 3, completion: 45 },
  { id: "grace", name: "grace_student", courses: 5, completion: 79 },
  { id: "han", name: "han_student", courses: 4, completion: 61 }
];

const proposalCourses = [
  { id: "communications", name: "Communications", progress: 68, enrolments: 42 },
  { id: "ai-literacy", name: "AI Literacy", progress: 54, enrolments: 35 },
  { id: "finance", name: "Finance", progress: 47, enrolments: 29 },
  { id: "leadership", name: "Leadership Essentials", progress: 61, enrolments: 31 }
];

const strands = [
  { name: "Foundations", progress: 82, sub: [["Concept recall", [["Define core terms", 92], ["Identify examples", 78]]], ["Learning orientation", [["Set learning goal", 83], ["Use course resources", 71]]]] },
  { name: "Application", progress: 66, sub: [["Scenario practice", [["Select approach", 70], ["Apply steps", 62]]], ["Workplace transfer", [["Adapt to role", 59], ["Choose tools", 73]]]] },
  { name: "Analysis", progress: 51, sub: [["Pattern recognition", [["Compare options", 57], ["Spot gaps", 49]]], ["Decision quality", [["Prioritise criteria", 52], ["Justify recommendation", 46]]]] },
  { name: "Collaboration", progress: 74, sub: [["Peer exchange", [["Give feedback", 77], ["Respond constructively", 69]]], ["Team routines", [["Share progress", 80], ["Resolve blockers", 71]]]] },
  { name: "Reflection", progress: 58, sub: [["Self review", [["Assess confidence", 64], ["Name next step", 60]]], ["Improvement planning", [["Use feedback", 55], ["Track progress", 51]]]] },
  { name: "Mastery", progress: 43, sub: [["Independent performance", [["Complete challenge", 45], ["Explain tradeoffs", 41]]], ["Retention", [["Review checkpoint", 47], ["Maintain accuracy", 39]]]] }
];

const skillTags = [
  { name: "Sales Communication", progress: 74, questions: 12 },
  { name: "Customer Relationship Management", label: "Customer Relation", progress: 81, questions: 15 },
  { name: "Negotiation", progress: 62, questions: 9 },
  { name: "Business Presentation", label: "Business Present.", progress: 69, questions: 11 },
  { name: "Service Excellence", progress: 77, questions: 14 },
  { name: "Problem Solving", progress: 58, questions: 8 },
  { name: "Data Interpretation", label: "Data Interpretation", progress: 66, questions: 10 },
  { name: "Digital Collaboration", label: "Digital Collab.", progress: 71, questions: 7 }
];

const state = {
  mainTab: "pals",
  adminView: "group",
  proposalLevel: "overview",
  dateRange: "all",
  entityFilter: "all",
  selectedEntity: null,
  selectedCourse: null
};

const appView = document.querySelector("#appView");
const breadcrumb = document.querySelector("#breadcrumb");

function svgIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = svgIcon(node.dataset.icon);
  });
}

function progress(value) {
  return `<div class="progress-wrap"><div class="progress"><span style="--value:${value}%"></span></div><b>${value}%</b></div>`;
}

function rangeAdjustedCompletion(value) {
  const offsets = { all: 0, "30": -4, "90": 3, ytd: 6 };
  return Math.max(0, Math.min(100, value + (offsets[state.dateRange] || 0)));
}

function renderTopTabs() {
  document.querySelectorAll("[data-main-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mainTab === state.mainTab);
  });
}

function renderCourseMastery() {
  return `
    <section class="panel chart-panel">
      <h2>KP Mastery by Course</h2>
      <div class="hbar-chart kp-chart">
        ${["Digital Marketing St...", "Character Education:...", "Build online audienc...", "Introduction to Sale"].map((label, index) => `
          <div class="hbar-label" style="grid-row:${index + 1}">${label}</div>
          <div class="hbar-track" style="grid-row:${index + 1}"><span style="--value:${index === 1 ? 3 : 0}%"></span></div>
        `).join("")}
        <div class="axis axis-0">0%</div><div class="axis axis-25">25%</div><div class="axis axis-50">50%</div><div class="axis axis-75">75%</div><div class="axis axis-100">100%</div>
      </div>
    </section>
    <section class="panel data-panel">
      <h2><span class="title-icon">${svgIcon("check-circle")}</span>Course KP Mastery</h2>
      <table>
        <thead><tr><th>Course</th><th>Enrollments</th><th>Completions</th><th>KP Mastery</th></tr></thead>
        <tbody>
          ${courseRows.map(([name, enrolments, completions, mastery]) => `
            <tr><td>${name}</td><td>${enrolments}</td><td>${completions}</td><td>${progress(mastery)}</td></tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderPalsExisting() {
  const palsSpiderItems = palsRows.map(([name,,,, completion]) => ({
    name,
    label: name
      .replace("Leadership Management", "Leadership")
      .replace("Advanced HR Management", "Adv. HR")
      .replace("Accountancy Specialist", "Accountancy")
      .replace("Human Resource Specialist", "HR Specialist")
      .replace("Customer Service PALS Course", "Customer Service")
      .replace("Finance for Non-Finance", "Finance")
      .replace("Digital Collaboration", "Digital Collab."),
    progress: completion
  }));

  return `
    <section class="panel data-panel pals-spider-card">
      <div class="pals-progress-head">
        <div>
          <h2>Completion Rate by PALS Course</h2>
          <p>Compare course completion across published PALS courses.</p>
        </div>
        <div class="pals-progress-count"><strong>${palsRows.length}</strong><span>courses</span></div>
      </div>
      <div class="pals-spider-layout">
        <div class="radar-wrap pals-spider-wrap">${renderRadarFor(palsSpiderItems)}</div>
        <div class="pals-spider-legend">
          ${palsRows.map(([name, kp, assigned, completed, completion]) => `
            <div class="pals-spider-row">
              <div>
                <strong>${name}</strong>
                <span>${kp} KP · ${assigned} assigned · ${completed} completed</span>
              </div>
              ${progress(completion)}
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="panel data-panel">
      <h2><span class="title-icon">${svgIcon("cap")}</span>Published PALS Courses</h2>
      <table>
        <thead><tr><th>Course</th><th>Knowledge Points</th><th>Assigned Learners</th><th>Completed</th><th>Completion Rate</th></tr></thead>
        <tbody>
          ${palsRows.map(([name, kp, assigned, completed, rate]) => `
            <tr><td>${name}</td><td>${kp}</td><td>${assigned}</td><td>${completed}</td><td>${progress(rate)}</td></tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function adjustedCourse(course, index) {
  const basis = state.selectedEntity ? state.selectedEntity.completion : 62;
  const variance = state.adminView === "group" ? [4, -7, 9, -3][index] : [-12, 4, 8, -2][index];
  return Math.max(8, Math.min(96, Math.round((course.progress + basis + variance) / 2)));
}

function renderAdminOverview() {
  const source = state.adminView === "group" ? groups : learners;
  const items = source
    .filter((item) => state.entityFilter === "all" || item.id === state.entityFilter)
    .map((item) => ({ ...item, completion: rangeAdjustedCompletion(item.completion) }));
  const meta = state.adminView === "group" ? "learners" : "enrolled courses";
  const entityLabel = state.adminView === "group" ? "Groups" : "Learners";
  return `
    <section class="panel proposal-panel">
      <div class="proposal-head">
        <div>
          <h2>Admin PALS Taxonomy</h2>
          <p>View completion by group or individual, then drill into PALS course taxonomy.</p>
        </div>
        <div class="tabs compact-tabs">
          <button class="tab ${state.adminView === "group" ? "active" : ""}" data-admin-view="group">${svgIcon("users")}Group</button>
          <button class="tab ${state.adminView === "individual" ? "active" : ""}" data-admin-view="individual">${svgIcon("user")}Individual</button>
        </div>
      </div>
      <div class="overview-layout">
        <aside class="filter-panel">
          <h2>Filters</h2>
          <label class="filter-control">${svgIcon("calendar")}
            <select data-filter="dateRange" aria-label="Date range">
              <option value="all" ${state.dateRange === "all" ? "selected" : ""}>All time</option>
              <option value="30" ${state.dateRange === "30" ? "selected" : ""}>Last 30 days</option>
              <option value="90" ${state.dateRange === "90" ? "selected" : ""}>Last 90 days</option>
              <option value="ytd" ${state.dateRange === "ytd" ? "selected" : ""}>Year to date</option>
            </select>
          </label>
          <label class="filter-control">${svgIcon("filter")}
            <select data-filter="entityFilter" aria-label="${entityLabel}">
              <option value="all" ${state.entityFilter === "all" ? "selected" : ""}>All ${entityLabel}</option>
              ${source.map((item) => `<option value="${item.id}" ${state.entityFilter === item.id ? "selected" : ""}>${item.name}</option>`).join("")}
            </select>
          </label>
        </aside>
        <section class="entity-list">
          <div class="entity-list-head">
            <span>${state.adminView === "group" ? "Group" : "Learner"}</span>
            <span>Completion Rate</span>
            <span>Report</span>
          </div>
          ${items.length ? items.map((item) => `
            <article class="entity-card">
              <div class="entity-avatar">${state.adminView === "group" ? svgIcon("users") : item.name.slice(0, 1).toUpperCase()}</div>
              <div class="entity-main"><strong>${item.name}</strong><span>${state.adminView === "group" ? item.members : item.courses} ${meta}</span></div>
              ${progress(item.completion)}
              <button class="view-button" data-entity="${item.id}">View Report</button>
            </article>
          `).join("") : `<div class="empty-list">No ${entityLabel.toLowerCase()} match the selected filters.</div>`}
        </section>
      </div>
    </section>
  `;
}

function renderAdminCourses() {
  return `
    <section class="panel proposal-panel">
      <div class="course-header">
        <div><h2 class="section-title">PALS Courses</h2><p>${state.selectedEntity.name} completion across enrolled PALS courses.</p></div>
        <button class="back-button" data-action="overview">${svgIcon("arrow")}Back</button>
      </div>
      <section class="course-grid">
        ${proposalCourses.map((course, index) => {
          const value = adjustedCourse(course, index);
          return `
            <article class="course-card" data-course="${course.id}">
              <div class="course-ring-wrap"><div class="ring" style="--value:${value}"><b>${value}%</b></div></div>
              <div class="course-copy"><h3>${course.name}</h3><p>${state.adminView === "group" ? course.enrolments + " enrolments" : "Last activity 3 days ago"}</p></div>
            </article>
          `;
        }).join("")}
      </section>
    </section>
  `;
}

function radarPoints(values, radius, center) {
  return values.map((value, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / values.length;
    const r = radius * (value / 100);
    return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
  }).join(" ");
}

function renderRadarFor(items) {
  const center = 200;
  const radius = 138;
  const rings = [25, 50, 75, 100].map((value) => `<polygon class="grid" points="${radarPoints(new Array(items.length).fill(value), radius, center)}"></polygon>`).join("");
  const axes = items.map((_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
    return `<line x1="${center}" y1="${center}" x2="${center + Math.cos(angle) * radius}" y2="${center + Math.sin(angle) * radius}"></line>`;
  }).join("");
  const labels = items.map((item, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
    const x = center + Math.cos(angle) * (radius + 32);
    const y = center + Math.sin(angle) * (radius + 30);
    const anchor = Math.abs(Math.cos(angle)) < 0.2 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
    return `<text x="${x}" y="${y}" text-anchor="${anchor}">${item.label || item.name}</text>`;
  }).join("");
  return `<svg class="radar" viewBox="0 0 400 400">${rings}${axes}<polygon class="value" points="${radarPoints(items.map((item) => item.progress), radius, center)}"></polygon>${labels}</svg>`;
}

function renderRadar() {
  return renderRadarFor(strands);
}

function renderAdminDetail() {
  return `
    <section class="panel proposal-panel">
      <div class="detail-header">
        <div><h2 class="section-title">${state.selectedCourse.name} Taxonomy</h2><p>Strand, sub-strand, and KP/topic completion.</p></div>
        <button class="back-button" data-action="courses">${svgIcon("arrow")}Back</button>
      </div>
      <div class="detail-grid">
        <section class="panel radar-card"><h2>Strands</h2><div class="radar-wrap">${renderRadar()}</div></section>
        <section class="panel"><h2>Sub-strands and Topics</h2><div class="breakdown">
          ${strands.map((strand) => `
            <article class="strand-card">
              <div class="strand-head"><div><strong>${strand.name}</strong><small>${strand.sub.length} sub-strands</small></div>${progress(strand.progress)}</div>
              <div class="topic-list">${strand.sub.map(([subName, topics]) => `<div><strong>${subName}</strong>${topics.map(([topic, value]) => `<div class="topic-row"><span>${topic}</span><div class="progress"><span style="--value:${value}%"></span></div><b>${value}%</b></div>`).join("")}</div>`).join("")}</div>
            </article>
          `).join("")}
        </div></section>
      </div>
    </section>
  `;
}

function renderPalsTab() {
  let proposal = "";
  if (state.proposalLevel === "overview") proposal = renderAdminOverview();
  if (state.proposalLevel === "courses") proposal = renderAdminCourses();
  if (state.proposalLevel === "detail") proposal = renderAdminDetail();
  return `${renderPalsExisting()}${proposal}`;
}

function renderSkillAnalytics() {
  return `
    <section class="panel skills-analytics">
      <div class="skills-analytics-head">
        <div>
          <h2>Skills Analytics</h2>
          <p>Skill tags are derived from practice and review test questions answered in PALS courses.</p>
        </div>
        <div class="skill-summary">
          <strong>${skillTags.length}</strong>
          <span>skills answered</span>
        </div>
      </div>
      <div class="skills-chart-layout">
        <div class="radar-wrap skill-radar-wrap">${renderRadarFor(skillTags)}</div>
        <div class="skill-tag-list">
          ${skillTags.map((skill) => `
            <div class="skill-tag-row">
              <div>
                <strong>${skill.name}</strong>
                <span>${skill.questions} tagged questions</span>
              </div>
              ${progress(skill.progress)}
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderPlaceholder(title) {
  return `<section class="panel empty-panel"><h2>${title}</h2><p>Analytics for this area will appear here.</p></section>`;
}

function render() {
  renderTopTabs();
  breadcrumb.innerHTML = "";
  if (state.mainTab === "courses") appView.innerHTML = renderCourseMastery();
  if (state.mainTab === "pals") appView.innerHTML = renderPalsTab();
  if (state.mainTab === "skills") appView.innerHTML = renderSkillAnalytics();
  if (state.mainTab === "assessments") appView.innerHTML = renderPlaceholder("Assessments");
  if (state.mainTab === "trends") appView.innerHTML = renderPlaceholder("Trends");
}

document.addEventListener("click", (event) => {
  const mainTab = event.target.closest("[data-main-tab]");
  if (mainTab) {
    state.mainTab = mainTab.dataset.mainTab;
    state.proposalLevel = "overview";
    state.entityFilter = "all";
    state.selectedEntity = null;
    state.selectedCourse = null;
    render();
    return;
  }

  const adminView = event.target.closest("[data-admin-view]");
  if (adminView) {
    state.adminView = adminView.dataset.adminView;
    state.proposalLevel = "overview";
    state.entityFilter = "all";
    state.selectedEntity = null;
    render();
    return;
  }

  const entityButton = event.target.closest("[data-entity]");
  if (entityButton) {
    const collection = state.adminView === "group" ? groups : learners;
    state.selectedEntity = collection.find((item) => item.id === entityButton.dataset.entity);
    state.proposalLevel = "courses";
    render();
    return;
  }

  const courseCard = event.target.closest("[data-course]");
  if (courseCard) {
    state.selectedCourse = proposalCourses.find((course) => course.id === courseCard.dataset.course);
    state.proposalLevel = "detail";
    render();
    return;
  }

  const action = event.target.closest("[data-action]");
  if (action) {
    state.proposalLevel = action.dataset.action === "overview" ? "overview" : "courses";
    if (state.proposalLevel === "overview") {
      state.selectedEntity = null;
      state.selectedCourse = null;
    }
    render();
  }
});

document.addEventListener("change", (event) => {
  const filter = event.target.closest("[data-filter]");
  if (!filter) return;

  state[filter.dataset.filter] = filter.value;
  state.proposalLevel = "overview";
  state.selectedEntity = null;
  render();
});

hydrateIcons();
render();
