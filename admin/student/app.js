const icons = {
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>',
  arrow: '<path d="m15 18-6-6 6-6"></path>',
  chevronDown: '<path d="m6 9 6 6 6-6"></path>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><path d="M12 19v3"></path>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"></path>',
  repeat: '<path d="m17 1 4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="m7 23-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>'
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

const cblChallenges = [
  {
    id: "corporate-client",
    name: "Banking Client Review Session - Understanding Client's Mismatched Business Model",
    role: "Financial Services Specialist",
    aiRole: "Banking Client",
    score: 80,
    points: "16/20",
    attempts: 12,
    duration: "42m",
    activity: "Last attempt yesterday",
    description: "A client, Mr. Chen, is invited to do a review of his banking transactions. During a routine annual account review, you notice that all incoming wire transfers over the past year originate exclusively from companies registered as tech consulting firms, with no transactions resembling typical bakery income. Your job is to ask about the transactions professionally without tipping him off, gather a credible explanation, request supporting documents, and escalate internally if something does not add up.",
    criteria: [
      ["Gather a credible explanation about the transactions", 10, true],
      ["Obtain Supporting Documents", 10, true]
    ],
    history: [
      ["Attempt 12", "Yesterday", 80, "Live"], ["Attempt 11", "3 days ago", 78, "Turn-based"], ["Attempt 10", "5 days ago", 76, "Live"],
      ["Attempt 9", "1 week ago", 74, "Turn-based"], ["Attempt 8", "9 days ago", 73, "Live"], ["Attempt 7", "2 weeks ago", 72, "Turn-based"],
      ["Attempt 6", "3 weeks ago", 69, "Live"], ["Attempt 5", "1 month ago", 67, "Turn-based"], ["Attempt 4", "5 weeks ago", 63, "Live"],
      ["Attempt 3", "6 weeks ago", 60, "Turn-based"], ["Attempt 2", "2 months ago", 57, "Live"], ["Attempt 1", "3 months ago", 54, "Turn-based"]
    ],
    feedbackSummary: "You handled the client conversation professionally and gathered the key supporting documents. Your next practice should focus on recognising when an unusual explanation needs to be escalated for internal review.",
    strengths: "Professional tone and clear evidence gathering.",
    nextFocus: "State the need for internal due diligence when the explanation does not add up.",
    feedback: [["Information Gathering", 80], ["Compliance and Escalation", 80]],
    breakdown: [
      ["Information Gathering", 8, 10, "You maintained a generally professional and helpful tone throughout the conversation and asked relevant questions about the transactions and the business model.", "You asked about the purpose of the transactions and requested details about the vendor and payment flow.", "Use more open-ended questions so the client can explain the transaction pattern in their own words."],
      ["Compliance and Escalation", 8, 10, "You clearly requested specific supporting documents linked to the transactions, including invoices and remittance details.", "You gathered evidence firmly and explained why the supporting documents were needed.", "State that the unusual business model mismatch requires internal due diligence or escalation."]
    ]
  },
  {
    id: "renewal-risk",
    name: "Responding to a Renewal Risk",
    role: "Customer Success Manager",
    aiRole: "Concerned Client",
    score: 64,
    points: "16/25",
    attempts: 2,
    duration: "28m",
    activity: "Last attempt 3 days ago",
    description: "A long-term client reports low adoption in two departments and is considering reducing their subscription. Clarify the issues, rebuild confidence, and propose a practical recovery plan.",
    criteria: [
      ["Identify the client's underlying adoption barriers", 10, true],
      ["Propose a measurable recovery plan", 10, false],
      ["Respond to concerns with empathy and clarity", 10, true]
    ],
    history: [["Attempt 2", "3 days ago", 64, "Turn-based"], ["Attempt 1", "1 week ago", 51, "Live"]],
    feedbackSummary: "You identified the client's concerns and responded with empathy. The recovery plan will be stronger when it includes clearer ownership, milestones, and measurable outcomes.",
    strengths: "Relevant follow-up questions and a calm client-facing response.",
    nextFocus: "Propose a measurable recovery plan with owners and milestones.",
    feedback: [["Information Gathering", 68], ["Recovery Planning", 58], ["Client Communication", 74]],
    breakdown: [
      ["Information Gathering", 7, 10, "You identified several adoption barriers and asked relevant follow-up questions.", "You clarified which departments had low adoption and explored the client's concerns.", "Ask for specific usage patterns and the business impact before proposing a solution."],
      ["Recovery Planning", 6, 10, "The proposed plan would benefit from clearer owners, milestones, and measurable outcomes.", "You proposed follow-up support and a recovery discussion.", "Define owners, a review date, and measurable adoption targets."]
    ]
  },
  {
    id: "project-delay",
    name: "Managing a Project Delay",
    role: "Project Lead",
    aiRole: "Project Sponsor",
    score: 43,
    points: "13/30",
    attempts: 1,
    duration: "16m",
    activity: "Last attempt 1 week ago",
    description: "A key implementation milestone has slipped by two weeks. Explain the impact, reset expectations, and align stakeholders on the recovery plan.",
    criteria: [
      ["Explain the delay and its impact transparently", 10, true],
      ["Present a realistic recovery timeline", 10, false],
      ["Align stakeholders on clear next steps", 10, false]
    ],
    history: [["Attempt 1", "1 week ago", 43, "Live"]],
    feedbackSummary: "You acknowledged the project delay, but the impact and recovery plan were not yet clear enough for stakeholders. Practise presenting a realistic timeline and confirming the next steps.",
    strengths: "Transparent acknowledgement of the issue.",
    nextFocus: "Explain the impact, dependencies, and recovery timeline more precisely.",
    feedback: [["Stakeholder Communication", 49], ["Recovery Planning", 38], ["Decision Quality", 36]],
    breakdown: [
      ["Stakeholder Communication", 5, 10, "You explained the issue, but the impact and next steps need to be more precise.", "You acknowledged the delay and kept the conversation transparent.", "Explain the consequences for the client and confirm alignment on the revised plan."],
      ["Recovery Planning", 4, 10, "Provide a concrete recovery timeline and clearly identify dependencies.", "You mentioned several corrective actions.", "Present dates, dependencies, accountable owners, and the next checkpoint."]
    ]
  },
  {
    id: "complaint-escalation",
    name: "Handling an Escalated Customer Complaint",
    role: "Customer Experience Specialist",
    aiRole: "Dissatisfied Customer",
    score: null,
    points: null,
    attempts: 0,
    duration: "0m",
    activity: "Not attempted yet",
    description: "A customer is frustrated after receiving inconsistent information from several support channels. Listen carefully, clarify the issue, and propose a practical resolution while rebuilding trust.",
    criteria: [
      ["Clarify the customer's main concern", 10, false],
      ["Respond with empathy and professionalism", 10, false],
      ["Propose a clear resolution and next steps", 10, false]
    ],
    history: [],
    feedback: [],
    breakdown: []
  }
];

const state = {
  tab: "knowledge",
  level: "overview",
  selectedCourse: null,
  selectedCase: null
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
  if (value < 50) return "#EF4444";
  if (value <= 75) return "#F5B83D";
  return "#5EC26A";
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

  if (state.tab === "cbl") {
    if (state.selectedCase) {
      breadcrumb.innerHTML = `<button data-cbl-action="overview">Content-Based Learning</button><span>/</span><strong>${state.selectedCase.name}</strong>`;
    } else {
      breadcrumb.innerHTML = "<strong>Content-Based Learning</strong>";
    }
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
                <span>Completion Progress</span>
              </div>
              <div class="course-tile-copy">
                <strong>${course.name}</strong>
                <span>${course.activity}</span>
              </div>
              <div class="course-tile-footer">
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
                        ${topics.map(([topic, value]) => `<div class="topic-row"><span>${topic}</span><div class="progress"><span style="--value:${value}%; --bar-color:${completionColor(value)}"></span></div><b>${value}%</b></div>`).join("")}
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

function renderCBL() {
  const attemptedCases = cblChallenges.filter((challenge) => challenge.attempts > 0);
  const highestScores = attemptedCases.map((challenge) => Math.max(...challenge.history.map(([, , score]) => score)));
  const averageHighestScore = average(highestScores);
  const totalAttempts = cblChallenges.reduce((total, challenge) => total + challenge.attempts, 0);
  return `
    <section class="cbl-page">
      <div class="cbl-summary">
        <article class="cbl-stat"><span>Cases practised</span><strong>${attemptedCases.length}</strong></article>
        <article class="cbl-stat"><span>Total attempts</span><strong>${totalAttempts}</strong></article>
        <article class="cbl-stat"><span>Average highest score</span><strong>${averageHighestScore}%</strong></article>
        <article class="cbl-stat"><span>Practice time</span><strong>1h 26m</strong></article>
      </div>
      <section class="panel cbl-panel">
        <div class="cbl-panel-head">
          <div>
            <h2>Practice & Roleplay Cases</h2>
            <p>Track your highest score and review feedback from each case.</p>
          </div>
          <span>${cblChallenges.length} available cases</span>
        </div>
        <div class="cbl-tile-grid">
          ${cblChallenges.map((challenge) => {
            const highestScore = challenge.attempts ? Math.max(...challenge.history.map(([, , score]) => score)) : null;
            return `
            <article class="cbl-tile">
              <div class="cbl-tile-ring">
                ${challenge.attempts ? `<div class="ring" style="--value:${highestScore}; --ring-color:${completionColor(highestScore)}"><b>${highestScore}%</b></div>` : `<div class="ring empty-ring"><b>--</b></div>`}
              </div>
              <span class="cbl-score-caption">${challenge.attempts ? "Highest score" : "No score yet"}</span>
              <div class="cbl-title">
                <strong>${challenge.name}</strong>
                <span>Role: ${challenge.role}</span>
              </div>
              <div class="cbl-tile-meta"><span>${challenge.attempts ? challenge.activity : "Not attempted yet"}</span><strong>${challenge.attempts} total attempts</strong></div>
              <div class="cbl-action">
                ${challenge.history[0]?.[3] ? `<span class="mode-pill">${challenge.history[0][3] === "Live" ? svgIcon("mic") : svgIcon("message")} Last attempt: ${challenge.history[0][3]}</span>` : ""}
                <button type="button" ${challenge.attempts ? `data-case="${challenge.id}"` : "data-practice-again"}>${challenge.attempts ? "View details" : "Start practice"}</button>
              </div>
            </article>
          `}).join("")}
        </div>
      </section>
      ${renderPracticeModal("Start a new case-based learning practice session.")}
    </section>
  `;
}

function renderPracticeModal(description) {
  return `
    <dialog class="practice-modal" id="practiceModal">
      <form method="dialog">
        <div class="practice-modal-head">
          <div>
            <h3>Choose practice mode</h3>
            <p>${description}</p>
          </div>
          <button class="modal-close" type="submit" aria-label="Close">x</button>
        </div>
        <div class="practice-mode-grid">
          <button class="practice-mode-card" type="submit" value="turn-based">
            <strong>${svgIcon("message")} Turn-based</strong>
            <span>Exchange messages one turn at a time. Great when you want to think through each response.</span>
          </button>
          <button class="practice-mode-card" type="submit" value="live">
            <strong>${svgIcon("mic")} Live</strong>
            <span>Speak naturally in real time. The AI listens and replies as you talk, like a phone call.</span>
          </button>
        </div>
      </form>
    </dialog>
  `;
}

function renderCBLDetail() {
  const item = state.selectedCase;
  const latestMode = item.history[0]?.[3];
  const itemHighestScore = Math.max(...item.history.map(([, , score]) => score));
  const historyAscending = [...item.history].reverse();
  return `
    <section class="panel cbl-detail">
      <div class="detail-head">
        <div>
          <h2>${item.name}</h2>
          <p>Your role: ${item.role} - AI role: ${item.aiRole}</p>
        </div>
        <button class="back-button" type="button" data-cbl-action="overview">${svgIcon("arrow")} Back to CBL analytics</button>
      </div>
      <div class="cbl-detail-summary">
        <article><span>Highest score</span><strong>${itemHighestScore}%</strong></article>
        <article><span>Latest attempt marks</span><strong>${item.points || Math.round(item.score / 10) + "/10"}</strong></article>
        <article><span>Total attempts</span><strong>${item.attempts}</strong></article>
        <article><span>Total practice time</span><strong>${item.duration}</strong></article>
        <article><span>Last attempt mode</span><strong class="mode-label">${latestMode === "Live" ? svgIcon("mic") : svgIcon("message")} ${latestMode}</strong></article>
      </div>
      <details class="case-context">
        <summary>
          <span>Case scenario and roles</span>
          ${svgIcon("chevronDown")}
        </summary>
        <div class="case-context-body">
          <p>${item.description}</p>
          <div class="role-grid">
            <article><span>Your Role</span><strong>${item.role}</strong></article>
            <article><span>AI Role</span><strong>${item.aiRole}</strong></article>
          </div>
          <h3>Success Criteria</h3>
          <div class="criteria-list">
            ${item.criteria.map(([criterion, points, demonstrated], index) => `
              <article class="criteria-row ${demonstrated ? "demonstrated" : ""}">
                <span class="criteria-number">${index + 1}</span>
                <div>
                  <strong>${criterion}</strong>
                  <div class="criteria-meta">
                    <span>${points} points</span>
                    <b>${demonstrated ? "Demonstrated" : "Not demonstrated"}</b>
                  </div>
                </div>
              </article>
            `).join("")}
          </div>
        </div>
      </details>
      <section class="feedback-summary">
        <div>
          <h3>Summary Feedback</h3>
          <span class="feedback-period">Based on your latest attempt</span>
          <p>${item.feedbackSummary}</p>
        </div>
        <div class="feedback-summary-grid">
          <article>
            <span>What went well</span>
            <strong>${item.strengths}</strong>
          </article>
          <article>
            <span>Focus next</span>
            <strong>${item.nextFocus}</strong>
          </article>
        </div>
      </section>
      <div class="cbl-detail-grid">
        <section>
          <h3>Detailed Feedback</h3>
          <p class="section-note">Category scores and feedback from your latest attempt.</p>
          <div class="criteria-breakdown detail-column-feedback">
            ${item.breakdown.map(([name, score, total, feedback, observed, nextStep]) => `
              <article class="breakdown-card">
                <div class="breakdown-card-head">
                  <div>
                    <strong>${name}</strong>
                    <span>${Math.round((score / total) * 100)}% category score</span>
                  </div>
                  <b>${score}/${total}</b>
                </div>
                <div class="breakdown-feedback">
                  <span>Feedback</span>
                  <p>${feedback}</p>
                </div>
                <div class="breakdown-insights">
                  <div>
                    <span>What you demonstrated</span>
                    <p>${observed}</p>
                  </div>
                  <div>
                    <span>Try in your next attempt</span>
                    <p>${nextStep}</p>
                  </div>
                </div>
              </article>
            `).join("")}
          </div>
        </section>
        <section>
          <h3>Attempt Score Trend</h3>
          <div class="trend-chart">
            <div class="trend-chart-inner">
              ${historyAscending.map(([attempt,, score]) => `
                <div class="trend-column">
                  <b>${score}%</b>
                  <span style="--trend-value:${score}%; --trend-color:${completionColor(score)}"></span>
                  <small>${attempt.replace("Attempt ", "#")}</small>
                </div>
              `).join("")}
            </div>
          </div>
          <h3>Attempt History</h3>
          <div class="attempt-list compact">
            ${item.history.map(([attempt, date, score, mode]) => `
              <article class="attempt-row">
                <div>
                  <strong>${attempt}</strong>
                  <span>${date}</span>
                  <small class="attempt-mode">${mode === "Live" ? svgIcon("mic") : svgIcon("message")} ${mode}</small>
                </div>
                <div class="attempt-row-action">
                  <b>${score}%</b>
                  <button type="button">View record</button>
                </div>
              </article>
            `).join("")}
          </div>
        </section>
      </div>
      ${renderPracticeModal(`Start a new attempt for ${item.name}.`)}
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

  if (state.tab === "cbl") {
    if (state.selectedCase) {
      appView.innerHTML = renderCBLDetail();
    } else {
      appView.innerHTML = renderCBL();
    }
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
    state.selectedCase = null;
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

  const caseButton = event.target.closest("[data-case]");
  if (caseButton) {
    state.selectedCase = cblChallenges.find((item) => item.id === caseButton.dataset.case);
    render();
    return;
  }

  const cblAction = event.target.closest("[data-cbl-action]");
  if (cblAction) {
    state.selectedCase = null;
    render();
  }

  const practiceAgain = event.target.closest("[data-practice-again]");
  if (practiceAgain) {
    document.querySelector("#practiceModal")?.showModal();
  }
});

hydrateIcons();
render();
