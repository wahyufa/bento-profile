const icons = {
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>',
  arrow: '<path d="m15 18-6-6 6-6"></path>',
  chevronDown: '<path d="m6 9 6 6 6-6"></path>'
};

const courses = [
  { id: "customer-service", name: "Customer Service PALS Course", progress: 96, activity: "Last activity 2 days ago" },
  { id: "exam-anxiety", name: "Exam Anxiety", progress: 22, activity: "Last activity 1 week ago" },
  { id: "communication", name: "Communication Essentials", progress: 84, activity: "Last activity yesterday" },
  { id: "workplace", name: "Workplace Readiness", progress: 17, activity: "Last activity 12 days ago" }
];

const strands = [
  { name: "Foundations", progress: 96, sub: [["Service mindset", [["Recognise learner needs", 98], ["Explain service standards", 94]]], ["Core concepts", [["Define key terms", 97], ["Identify good practice", 93]]]] },
  { name: "Application", progress: 88, sub: [["Scenario response", [["Choose a response", 91], ["Apply support steps", 86]]], ["Practice transfer", [["Use course resources", 84], ["Complete practice task", 90]]]] },
  { name: "Analysis", progress: 52, sub: [["Problem framing", [["Compare options", 56], ["Spot root cause", 48]]], ["Decision quality", [["Prioritise action", 55], ["Justify answer", 50]]]] },
  { name: "Communication", progress: 71, sub: [["Message clarity", [["Use plain language", 75], ["Ask follow-up questions", 70]]], ["Tone", [["Respond with empathy", 77], ["Manage concerns", 62]]]] },
  { name: "Reflection", progress: 58, sub: [["Self review", [["Check confidence", 60], ["Review feedback", 57]]], ["Next steps", [["Set improvement goal", 63], ["Track progress", 51]]]] },
  { name: "Mastery", progress: 44, sub: [["Independent task", [["Complete challenge", 46], ["Explain tradeoffs", 41]]], ["Retention", [["Review checkpoint", 47], ["Maintain accuracy", 42]]]] }
];

const skills = [
  { name: "Sales Communication", label: "Sales Communication", progress: 95, questions: 12 },
  { name: "Customer Relationship Management", label: "Customer Relation", progress: 89, questions: 15 },
  { name: "Negotiation", progress: 62, questions: 9 },
  { name: "Business Presentation", label: "Business Present.", progress: 69, questions: 11 },
  { name: "Service Excellence", progress: 77, questions: 14 },
  { name: "Problem Solving", progress: 58, questions: 8 },
  { name: "Data Interpretation", progress: 66, questions: 10 },
  { name: "Digital Collaboration", label: "Digital Collab.", progress: 71, questions: 7 }
];

const state = {
  tab: "knowledge",
  level: "overview",
  selectedCourse: null
};

const appView = document.querySelector("#appView");
const breadcrumb = document.querySelector("#breadcrumb");

function svgIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

function hydrateIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = svgIcon(node.dataset.icon);
  });
}

function progress(value) {
  return `<div class="progress-wrap"><div class="progress"><span style="--value:${value}%; --bar-color:${completionColor(value)}"></span></div><b>${value}%</b></div>`;
}

function completionColor(value) {
  const low = [114, 198, 231];
  const high = [18, 112, 78];
  const ratio = Math.max(0, Math.min(1, value / 100));
  const channel = (index) => Math.round(low[index] + (high[index] - low[index]) * ratio);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

function average(values) {
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function subStrandScore(topics) {
  return average(topics.map(([, value]) => value));
}

function renderBreadcrumb() {
  if (state.tab === "skills") {
    breadcrumb.innerHTML = "<strong>Skills Analytics</strong>";
    return;
  }

  if (state.level === "overview") {
    breadcrumb.innerHTML = "<strong>PALS Courses</strong>";
    return;
  }

  breadcrumb.innerHTML = `<button data-action="overview">PALS Courses</button><span>/</span><strong>${state.selectedCourse.name}</strong>`;
}

function renderOverview() {
  appView.innerHTML = `
    <section>
      <article class="panel course-overview-panel">
        <h2>Completion by PALS Course</h2>
        <div class="course-tile-grid">
          ${courses.map((course) => `
            <button class="course-tile" type="button" data-course="${course.id}">
              <div class="course-tile-ring">
                <div class="ring" style="--value:${course.progress}; --ring-color:${completionColor(course.progress)}"><b>${course.progress}%</b></div>
              </div>
              <div class="course-tile-copy">
                <strong>${course.name}</strong>
                <span>${course.activity}</span>
              </div>
              <div class="course-tile-footer">
                ${progress(course.progress)}
                <span>View details</span>
              </div>
            </button>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function radarPoints(items, radius, center, valueKey = "progress") {
  return items.map((item, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
    const r = radius * (item[valueKey] / 100);
    return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
  }).join(" ");
}

function renderRadar(items) {
  const center = 200;
  const radius = 138;
  const rings = [25, 50, 75, 100].map((value) => {
    const ringItems = items.map((item) => ({ ...item, progress: value }));
    return `<polygon class="grid" points="${radarPoints(ringItems, radius, center)}"></polygon>`;
  }).join("");
  const axes = items.map((_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
    return `<line x1="${center}" y1="${center}" x2="${center + Math.cos(angle) * radius}" y2="${center + Math.sin(angle) * radius}"></line>`;
  }).join("");
  const labels = items.map((item, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
    const x = center + Math.cos(angle) * (radius + 34);
    const y = center + Math.sin(angle) * (radius + 30);
    const anchor = Math.abs(Math.cos(angle)) < 0.2 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
    return `<text x="${x}" y="${y}" text-anchor="${anchor}">${item.label || item.name}</text>`;
  }).join("");
  return `<svg class="radar" viewBox="0 0 400 400">${rings}${axes}<polygon class="value" points="${radarPoints(items, radius, center)}"></polygon>${labels}</svg>`;
}

function renderCourseDetail() {
  appView.innerHTML = `
    <section class="panel">
      <div class="detail-head">
        <div>
          <h2>${state.selectedCourse.name}</h2>
          <p>Progress by strand, sub-strand, and knowledge point.</p>
        </div>
        <button class="back-button" type="button" data-action="overview"><i data-icon="arrow"></i> Back to PALS courses</button>
      </div>
      <div class="detail-grid">
        <section class="sticky-radar">
          <h2>Strands</h2>
          <div class="radar-wrap">${renderRadar(strands)}</div>
        </section>
        <section class="taxonomy-section">
          <h2>Sub-strands and Topics</h2>
          <div class="breakdown">
            ${strands.map((strand) => `
              <details class="strand-card">
                <summary class="strand-head">
                  <div><strong>${strand.name}</strong><small>${strand.sub.length} sub-strands</small></div>
                  ${progress(strand.progress)}
                  <span class="chevron">${svgIcon("chevronDown")}</span>
                </summary>
                <div class="topic-list">
                  ${strand.sub.map(([subName, topics]) => `
                    <details class="substrand-card">
                      <summary class="substrand-head"><strong>${subName}</strong>${progress(subStrandScore(topics))}<span class="chevron">${svgIcon("chevronDown")}</span></summary>
                      <div class="topic-rows">
                        ${topics.map(([topic, value]) => `<div class="topic-row"><span>${topic}</span><div class="progress"><span style="--value:${value}%"></span></div><b>${value}%</b></div>`).join("")}
                      </div>
                    </details>
                  `).join("")}
                </div>
              </details>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
  hydrateIcons();
}

function renderSkills() {
  appView.innerHTML = `
    <section class="panel">
      <div class="skills-head">
        <div>
          <h2>Skills Analytics</h2>
          <p>Skill tags are derived from practice and review test questions answered in PALS courses.</p>
        </div>
        <div class="skills-summary"><strong>${skills.length}</strong><span>skills answered</span></div>
      </div>
      <div class="skills-grid">
        <div class="radar-wrap">${renderRadar(skills)}</div>
        <div class="skill-list">
          ${skills.map((skill) => `
            <div class="skill-row">
              <div><strong>${skill.name}</strong><span>${skill.questions} tagged questions</span></div>
              ${progress(skill.progress)}
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function render() {
  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === state.tab);
  });
  renderBreadcrumb();

  if (state.tab === "skills") {
    renderSkills();
    return;
  }

  if (state.level === "detail") {
    renderCourseDetail();
  } else {
    renderOverview();
  }
}

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) {
    state.tab = tab.dataset.tab;
    state.level = "overview";
    state.selectedCourse = null;
    render();
    return;
  }

  const course = event.target.closest("[data-course]");
  if (course) {
    state.selectedCourse = courses.find((item) => item.id === course.dataset.course);
    state.level = "detail";
    render();
    return;
  }

  const action = event.target.closest("[data-action]");
  if (action) {
    state.level = "overview";
    state.selectedCourse = null;
    render();
  }
});

hydrateIcons();
render();
