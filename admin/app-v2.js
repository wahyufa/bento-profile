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
  trend: '<path d="m3 17 6-6 4 4 8-8"></path><path d="M14 7h7v7"></path>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><path d="M12 19v3"></path>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"></path>',
  warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>'
};

const courseRows = [
  ["Digital Marketing Strategy", 6, 0, 0],
  ["Character Education: A Framework for Schools", 6, 0, 3],
  ["Build online audience and convert to sale", 1, 0, 0],
  ["Introduction to Sale", 0, 0, 0]
];

// ─── Single source of truth for PALS data ───────────────────────────────────
// All course-level stats (completionRate, avgScore) are DERIVED from topic data.
//
// Logic:
//   completed     = min(topic.passed) — learner must pass ALL topics to complete
//   completionRate = round(completed / assigned * 100)
//   avgScore      = mean of topic.avgScore where avgScore is not null
//                   (only topics that have been attempted have a score)
//
// Topic field meanings:
//   passed      — how many of the assigned learners passed this topic's review test
//   avgScore    — average review test score among learners who attempted (null = no attempts)
//   avgAttempts — average number of test attempts per learner who attempted (0 = not started)
// ────────────────────────────────────────────────────────────────────────────
const palsCoursesData = [
  {
    name: "Leadership Management",
    kp: 3,
    assigned: 4,
    topics: [
      { name: "Strategic Leadership Principles", passed: 1, avgScore: 70, avgAttempts: 2.0 },
      { name: "Team Dynamics & Motivation",       passed: 0, avgScore: 54, avgAttempts: 1.0 },
      { name: "Communication for Leaders",        passed: 0, avgScore: null, avgAttempts: 0 }
    ]
  },
  {
    name: "Advanced HR Management",
    kp: 4,
    assigned: 4,
    topics: [
      { name: "HR Strategy & Planning",           passed: 0, avgScore: null, avgAttempts: 0 },
      { name: "Talent Acquisition Frameworks",    passed: 0, avgScore: null, avgAttempts: 0 },
      { name: "Performance Management",           passed: 0, avgScore: null, avgAttempts: 0 }
    ]
  },
  {
    name: "Accountancy Specialist",
    kp: 4,
    assigned: 4,
    topics: [
      { name: "Financial Statements Analysis",    passed: 1, avgScore: 58, avgAttempts: 2.0 },
      { name: "Tax Compliance Basics",            passed: 0, avgScore: null, avgAttempts: 0 }
    ]
  },
  {
    name: "Human Resource Specialist",
    kp: 6,
    assigned: 4,
    topics: [
      { name: "Recruitment & Selection",          passed: 3, avgScore: 78, avgAttempts: 1.0 },
      { name: "Employee Relations",               passed: 1, avgScore: 64, avgAttempts: 1.5 },
      { name: "Learning & Development",           passed: 0, avgScore: null, avgAttempts: 0 }
    ]
  },
  {
    name: "Customer Service PALS Course",
    kp: 8,
    assigned: 18,
    topics: [
      { name: "Service Excellence Fundamentals",  passed: 16, avgScore: 88, avgAttempts: 1.1 },
      { name: "Handling Difficult Customers",     passed: 14, avgScore: 73, avgAttempts: 2.8 },
      { name: "Service Recovery Strategies",      passed: 13, avgScore: 82, avgAttempts: 1.4 }
    ]
  },
  {
    name: "Sales Fundamentals",
    kp: 5,
    assigned: 12,
    topics: [
      { name: "Prospecting & Lead Generation",    passed: 10, avgScore: 75, avgAttempts: 1.3 },
      { name: "Sales Pitch & Presentation",       passed: 8,  avgScore: 63, avgAttempts: 2.2 },
      { name: "Closing Techniques",               passed: 7,  avgScore: 58, avgAttempts: 1.8 }
    ]
  },
  {
    name: "Finance for Non-Finance",
    kp: 4,
    assigned: 9,
    topics: [
      { name: "Reading Financial Reports",        passed: 6,  avgScore: 68, avgAttempts: 2.1 },
      { name: "Budgeting Basics",                 passed: 3,  avgScore: 55, avgAttempts: 3.2 },
      { name: "Cost-Benefit Analysis",            passed: 3,  avgScore: 44, avgAttempts: 1.6 }
    ]
  },
  {
    name: "Digital Collaboration",
    kp: 6,
    assigned: 14,
    topics: [
      { name: "Remote Work Tools & Practices",    passed: 13, avgScore: 82, avgAttempts: 1.1 },
      { name: "Virtual Meeting Facilitation",     passed: 11, avgScore: 76, avgAttempts: 1.9 },
      { name: "Digital Communication Etiquette",  passed: 10, avgScore: 68, avgAttempts: 2.1 }
    ]
  },
  {
    name: "Professional Skills Accelerator",
    kp: 12,
    assigned: 16,
    topics: [
      { name: "Strategic Thinking & Problem Solving", passed: 12, avgScore: 78, avgAttempts: 1.4 },
      { name: "Stakeholder Communication",            passed: 11, avgScore: 72, avgAttempts: 1.8 },
      { name: "Data-Driven Decision Making",          passed: 10, avgScore: 69, avgAttempts: 2.2 },
      { name: "Financial Acumen for Managers",        passed: 8,  avgScore: 62, avgAttempts: 2.6 },
      { name: "Change Leadership & Adaptability",     passed: 7,  avgScore: 58, avgAttempts: 3.0 },
      { name: "Cross-functional Collaboration",       passed: 6,  avgScore: 74, avgAttempts: 1.6 },
      { name: "Risk Assessment & Mitigation",         passed: 5,  avgScore: 55, avgAttempts: 2.9 },
      { name: "Digital Transformation Basics",        passed: 4,  avgScore: 61, avgAttempts: 2.1 }
    ]
  }
];

// Derive course-level stats from topic data — single derivation used everywhere
function deriveCourseStats(course) {
  const topicsWithScore = course.topics.filter(t => t.avgScore !== null);
  const completed = Math.min(...course.topics.map(t => t.passed));
  const completionRate = Math.round((completed / course.assigned) * 100);
  const avgScore = topicsWithScore.length
    ? Math.round(topicsWithScore.reduce((s, t) => s + t.avgScore, 0) / topicsWithScore.length)
    : null;
  return { ...course, completed, completionRate, avgScore };
}

// palsCourses is the derived list used in all render functions
const palsCourses = palsCoursesData.map(deriveCourseStats);

// Courses shown in "View Report" drill-down (representative subset)
const REPORT_COURSE_NAMES = [
  "Customer Service PALS Course",
  "Sales Fundamentals",
  "Digital Collaboration",
  "Leadership Management",
  "Professional Skills Accelerator"
];

const groups = [
  { id: "sales",      name: "Sales Enablement",  members: 32, completion: 72, score: 68 },
  { id: "service",    name: "Customer Service",   members: 28, completion: 64, score: 71 },
  { id: "marketing",  name: "Marketing Team",     members: 19, completion: 58, score: 55 },
  { id: "operations", name: "Operations",         members: 41, completion: 46, score: 49 }
];

const learners = [
  { id: "datolow", name: "datolow_student",      courses: 4, completion: 18, score: 22 },
  { id: "rock01",  name: "rockwills_student01",  courses: 5, completion: 88, score: 82 },
  { id: "rock02",  name: "rockwills_student02",  courses: 5, completion: 87, score: 79 },
  { id: "rock03",  name: "rockwills_student03",  courses: 3, completion: 89, score: 84 },
  { id: "amira",   name: "amira_student",        courses: 6, completion: 74, score: 70 },
  { id: "ben",     name: "benjamin_student",     courses: 4, completion: 52, score: 58 },
  { id: "cynthia", name: "cynthia_student",      courses: 5, completion: 67, score: 63 },
  { id: "darren",  name: "darren_student",       courses: 2, completion: 33, score: 38 },
  { id: "elena",   name: "elena_student",        courses: 7, completion: 91, score: 86 },
  { id: "faris",   name: "faris_student",        courses: 3, completion: 45, score: 51 },
  { id: "grace",   name: "grace_student",        courses: 5, completion: 79, score: 74 },
  { id: "han",     name: "han_student",          courses: 4, completion: 61, score: 57 }
];

const strands = [
  { name: "Foundations",   progress: 82, sub: [["Concept recall",      [["Define core terms", 92],        ["Identify examples", 78]]],   ["Learning orientation",  [["Set learning goal", 83],      ["Use course resources", 71]]]] },
  { name: "Application",   progress: 66, sub: [["Scenario practice",   [["Select approach", 70],          ["Apply steps", 62]]],          ["Workplace transfer",    [["Adapt to role", 59],          ["Choose tools", 73]]]] },
  { name: "Analysis",      progress: 51, sub: [["Pattern recognition", [["Compare options", 57],          ["Spot gaps", 49]]],            ["Decision quality",      [["Prioritise criteria", 52],    ["Justify recommendation", 46]]]] },
  { name: "Collaboration", progress: 74, sub: [["Peer exchange",       [["Give feedback", 77],            ["Respond constructively", 69]]],["Team routines",         [["Share progress", 80],         ["Resolve blockers", 71]]]] },
  { name: "Reflection",    progress: 58, sub: [["Self review",         [["Assess confidence", 64],        ["Name next step", 60]]],       ["Improvement planning",  [["Use feedback", 55],           ["Track progress", 51]]]] },
  { name: "Mastery",       progress: 43, sub: [["Independent performance",[["Complete challenge", 45],    ["Explain tradeoffs", 41]]],    ["Retention",             [["Review checkpoint", 47],      ["Maintain accuracy", 39]]]] }
];

// Skill categories + per-skill analytics (avg mastery, learner coverage, competency-band
// distribution, PALS/CBL score composition, and per-group averages). Powers the Skills tab.
const skillTags = [
  { name: "Sales Communication",               cat: "Sales & Service",               avg: 74, cover: 22, dist: [1, 4, 8, 9],  pals: 46, cbl: 28, byGroup: { "Sales Enablement": 84, "Customer Service": 68, "Marketing Team": 66, "Operations": 58 } },
  { name: "Service Excellence",                 cat: "Sales & Service",               avg: 79, cover: 24, dist: [0, 3, 8, 13], pals: 49, cbl: 30, byGroup: { "Sales Enablement": 72, "Customer Service": 88, "Marketing Team": 70, "Operations": 62 } },
  { name: "Negotiation",                        cat: "Sales & Service",               avg: 58, cover: 14, dist: [3, 5, 4, 2],  pals: 38, cbl: 20, byGroup: { "Sales Enablement": 68, "Customer Service": 54, "Marketing Team": 56, "Operations": 44 } },
  { name: "Customer Relationship Management",   cat: "Communication & Collaboration", avg: 81, cover: 26, dist: [0, 3, 8, 15], pals: 50, cbl: 31, byGroup: { "Sales Enablement": 78, "Customer Service": 90, "Marketing Team": 74, "Operations": 66 } },
  { name: "Business Presentation",              cat: "Communication & Collaboration", avg: 66, cover: 18, dist: [2, 5, 6, 5],  pals: 42, cbl: 24, byGroup: { "Sales Enablement": 62, "Customer Service": 60, "Marketing Team": 78, "Operations": 54 } },
  { name: "Digital Collaboration",              cat: "Communication & Collaboration", avg: 71, cover: 20, dist: [1, 4, 7, 8],  pals: 44, cbl: 27, byGroup: { "Sales Enablement": 66, "Customer Service": 68, "Marketing Team": 74, "Operations": 72 } },
  { name: "Problem Solving",                    cat: "Analytical & Digital",          avg: 55, cover: 15, dist: [3, 5, 4, 3],  pals: 37, cbl: 18, byGroup: { "Sales Enablement": 52, "Customer Service": 50, "Marketing Team": 58, "Operations": 60 } },
  { name: "Data Interpretation",                cat: "Analytical & Digital",          avg: 63, cover: 16, dist: [2, 5, 6, 3],  pals: 41, cbl: 22, byGroup: { "Sales Enablement": 56, "Customer Service": 54, "Marketing Team": 70, "Operations": 66 } },
  { name: "Digital Tools Fluency",              cat: "Analytical & Digital",          avg: 44, cover: 9,  dist: [4, 3, 1, 1],  pals: 30, cbl: 14, byGroup: { "Sales Enablement": 40, "Customer Service": 38, "Marketing Team": 52, "Operations": 46 } }
];

const SKILL_BANDS = [
  { key: "Novice",     cls: "band-novice" },
  { key: "Developing", cls: "band-developing" },
  { key: "Competent",  cls: "band-competent" },
  { key: "Proficient", cls: "band-proficient" }
];

const SKILL_GROUP_NAMES = groups.map(g => g.name);
const SKILL_LOW_COVERAGE = 10;
const SKILL_TIER_LABEL = { risk: "Needs attention", mid: "Watch", good: "On track" };

// Shortened labels for the radar axes only (the narrow right rail can't fit the
// full category names without text spilling past the panel edge).
const SKILL_CATEGORY_SHORT = {
  "Sales & Service": "Sales & Service",
  "Communication & Collaboration": "Communication & Collab.",
  "Analytical & Digital": "Analytical & Digital"
};

const cblEntities = {
  group: [
    { id: "sales",     name: "Sales Enablement", learners: 32, practised: 24, attempts: 67, score: 78, time: "6h 42m" },
    { id: "service",   name: "Customer Service",  learners: 28, practised: 21, attempts: 52, score: 72, time: "5h 18m" },
    { id: "marketing", name: "Marketing Team",    learners: 19, practised: 11, attempts: 24, score: 61, time: "2h 46m" },
    { id: "operations",name: "Operations",        learners: 41, practised: 17, attempts: 36, score: 54, time: "4h 11m" }
  ],
  individual: [
    { id: "rock01",  name: "rockwills_student01", learners: 1, practised: 4, attempts: 12, score: 80, time: "1h 26m" },
    { id: "amira",   name: "amira_student",       learners: 1, practised: 3, attempts: 7,  score: 74, time: "54m" },
    { id: "elena",   name: "elena_student",       learners: 1, practised: 4, attempts: 9,  score: 69, time: "1h 08m" },
    { id: "ben",     name: "benjamin_student",    learners: 1, practised: 2, attempts: 4,  score: 58, time: "37m" },
    { id: "darren",  name: "darren_student",      learners: 1, practised: 1, attempts: 2,  score: 42, time: "19m" },
    { id: "datolow", name: "datolow_student",     learners: 1, practised: 0, attempts: 0,  score: null, time: "0m" }
  ]
};

const cblCases = [
  { name: "Banking Client Review Session",            role: "Financial Services Specialist", attempted: 18, attempts: 42, score: 76, live: 26, turn: 16 },
  { name: "Responding to a Renewal Risk",             role: "Customer Success Manager",      attempted: 15, attempts: 31, score: 68, live: 12, turn: 19 },
  { name: "Managing a Project Delay",                 role: "Project Lead",                  attempted: 12, attempts: 22, score: 57, live: 14, turn: 8 },
  { name: "Handling an Escalated Customer Complaint", role: "Customer Experience Specialist", attempted: 7, attempts: 11, score: 48, live: 4,  turn: 7 }
];

const state = {
  mainTab: "pals",
  adminView: "group",
  proposalLevel: "overview",
  dateRange: "all",
  entityFilter: "all",
  expandedPalsRows: new Set(),
  selectedEntity: null,
  selectedCourse: null,
  selectedCblCase: null,
  selectedCblGroup: null,
  palsExpandTabs: {},
  testReportTarget: null,
  skillSort: "gap",
  skillGapOnly: false,
  skillView: "org",
  skillCategory: "all",
  skillModalLearner: null,
  skillModalContext: null
};

const appView   = document.querySelector("#appView");
const breadcrumb = document.querySelector("#breadcrumb");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function svgIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach(node => {
    node.innerHTML = svgIcon(node.dataset.icon);
  });
}

function completionColor(value) {
  if (value < 50) return "#E73636";
  if (value <= 75) return "#F5B83D";
  return "#0CAD60";
}

// ─── Skills analytics helpers ─────────────────────────────────────────────────

// Continuous red -> amber -> green gradient, interpolated between the same
// three anchor colors used by completionColor() so the heatmap reads consistently.
function skillHeatColor(v) {
  let r, g, b;
  if (v < 50) { const t = v / 50; r = 231 + (245 - 231) * t; g = 54 + (184 - 54) * t; b = 54 + (61 - 54) * t; }
  else { const t = (v - 50) / 50; r = 245 + (12 - 245) * t; g = 184 + (173 - 184) * t; b = 61 + (96 - 61) * t; }
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function skillHeatTextColor(v) { return (v >= 40 && v < 68) ? "#5a4008" : "#ffffff"; }

function skillTierOf(v) { return v < 50 ? "risk" : (v < 65 ? "mid" : (v >= 75 ? "good" : "")); }

function skillCategoryAverages(filterFn) {
  const cats = [...new Set(skillTags.map(s => s.cat))];
  return cats.map(cat => {
    const items = skillTags.filter(s => s.cat === cat);
    const vals = items.map(s => (filterFn ? filterFn(s) : s.avg));
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return { name: cat, label: SKILL_CATEGORY_SHORT[cat] || cat, progress: avg };
  });
}

function skillGroupAverages() {
  return groups.map(g => {
    const vals = skillTags.map(s => s.byGroup[g.name]);
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return { name: g.name, label: g.name, progress: avg };
  });
}

// Deterministic per-learner, per-skill mastery: splits the score into PALS
// (questions answered correctly) and CBL (challenges completed) contribution.
function learnerSkillMastery(learner, skill) {
  const seed = learner.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) + skill.name.length * 7;
  const delta = ((seed * 13) % 30) - 15;
  const avg = Math.max(6, Math.min(100, skill.avg + delta));
  const orgShare = skill.pals / (skill.pals + skill.cbl);
  const shareDelta = (((seed * 7) % 30) - 15) / 100;
  const palsShare = Math.max(0.15, Math.min(0.9, orgShare + shareDelta));
  const pals = Math.round(avg * palsShare);
  const cbl = Math.max(0, avg - pals);
  return { avg, pals, cbl };
}

// ─── Review test helpers ──────────────────────────────────────────────────────

function topicReviewQuestions(topicName) {
  return [
    { text: `Which statement best describes the core objective of "${topicName}"?`, correct: 1,
      choices: ["Minimising team dependencies", "Building systematic understanding and practical application", "Delegating all related responsibilities", "Documenting outcomes only"] },
    { text: `When applying "${topicName}" concepts in a real situation, you should:`, correct: 2,
      choices: ["Act quickly without consulting others", "Follow only established processes", "Adapt key principles to the specific context", "Seek approval for every action"] },
    { text: `The most common barrier to effective "${topicName}" is:`, correct: 0,
      choices: ["Lack of clear communication and shared understanding", "Having too many experienced team members", "Excessive management support", "Over-documentation of processes"] },
    { text: `What best demonstrates mastery of "${topicName}"?`, correct: 3,
      choices: ["Completing all assigned readings", "Attending every training session", "Scoring above average on assessments", "Consistently applying skills with measurable outcomes"] },
    { text: `Which approach most effectively reinforces learning in "${topicName}"?`, correct: 1,
      choices: ["One-time training with no follow-up", "Regular practice combined with structured feedback", "Self-directed study only", "Peer discussion without a facilitator"] }
  ];
}

function generateAnswers(score, seed) {
  const correctCount = Math.min(5, Math.round(score / 20));
  const correctIndices = [1, 2, 0, 3, 1];
  return correctIndices.map((correctIdx, i) => {
    if (i < correctCount) return correctIdx;
    return (correctIdx + 1 + (seed % 2)) % 4;
  });
}

function mockLearnerTopicAttempts(learnerId, orgAvgScore) {
  const seed = learnerId.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const variance = ((seed * 7 + 13) % 29) - 14;
  const finalScore = Math.max(28, Math.min(98, Math.round((orgAvgScore || 55) + variance)));
  const passed = finalScore >= 70;
  const attempts = [];
  if (!passed && finalScore >= 42) {
    const firstScore = Math.max(22, finalScore - 16);
    attempts.push({ score: firstScore, passed: false, answers: generateAnswers(firstScore, seed) });
  }
  attempts.push({ score: finalScore, passed, answers: generateAnswers(finalScore, seed + 5) });
  return attempts;
}

function progress(value) {
  return `<div class="progress-wrap"><div class="progress"><span style="--value:${value}%; --bar-color:${completionColor(value)}"></span></div><b>${value}%</b></div>`;
}

function rangeAdjustedCompletion(value) {
  const offsets = { all: 0, "30": -4, "90": 3, ytd: 6 };
  return Math.max(0, Math.min(100, value + (offsets[state.dateRange] || 0)));
}

function rangeAdjustedScore(value) {
  const offsets = { all: 0, "30": -2, "90": 2, ytd: 3 };
  return Math.max(0, Math.min(100, value + (offsets[state.dateRange] || 0)));
}

function weightedAverage(items) {
  const total = items.reduce((s, i) => s + i.attempts, 0);
  if (!total) return 0;
  return Math.round(items.reduce((s, i) => s + i.score * i.attempts, 0) / total);
}

// For View Report: approximate entity-specific course completion and score.
// The entity's overall level biases the course-level org average.
function entityCourseCompletion(courseRate, idx) {
  const base = state.selectedEntity ? state.selectedEntity.completion : 60;
  const offsets = [8, -6, 4, -10];
  return Math.max(0, Math.min(100, Math.round((courseRate + base + (offsets[idx] || 0)) / 2)));
}

function entityCourseScore(courseAvg, idx) {
  if (courseAvg === null) return null;
  const base = state.selectedEntity ? state.selectedEntity.score : 60;
  const offsets = [5, -4, 3, -8];
  return Math.max(0, Math.min(100, Math.round((courseAvg + base + (offsets[idx] || 0)) / 2)));
}

// ─── Render: top tabs ────────────────────────────────────────────────────────

function renderTopTabs() {
  document.querySelectorAll("[data-main-tab]").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.mainTab === state.mainTab);
  });
}

// ─── Render: Courses tab ─────────────────────────────────────────────────────

function renderCourseMastery() {
  return `
    <section class="panel chart-panel">
      <h2>KP Mastery by Course</h2>
      <div class="hbar-chart kp-chart">
        ${["Digital Marketing St...", "Character Education:...", "Build online audienc...", "Introduction to Sale"].map((label, i) => `
          <div class="hbar-label" style="grid-row:${i + 1}">${label}</div>
          <div class="hbar-track" style="grid-row:${i + 1}"><span style="--value:${i === 1 ? 3 : 0}%; --bar-color:${completionColor(i === 1 ? 3 : 0)}"></span></div>
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

// ─── Build PALS expand row (shared by renderPalsExisting + targeted DOM update) ─

function buildOrgStatsContent(course) {
  const passedTopics = course.topics.filter(t => t.passed > 0).length;
  const tws = course.topics.filter(t => t.avgScore !== null);
  const scoreFormula = tws.length > 0
    ? `(${tws.map(t => t.avgScore).join(' + ')}) ÷ ${tws.length} = <b>${course.avgScore}%</b>`
    : 'No topics attempted yet';
  return `
    <div class="pals-score-summary">
      ${course.avgScore !== null
        ? `<div class="ring" style="--value:${course.avgScore}; --ring-color:${completionColor(course.avgScore)}; --size:120px"><b>${course.avgScore}%</b></div>`
        : `<div class="ring ring-empty" style="--size:120px"><b>—</b></div>`
      }
      <div class="pals-score-summary-text">
        <div class="pals-score-label-row">
          <strong>Avg. Score</strong>
          <button class="calc-info-btn" type="button" aria-label="How is Avg Score calculated?">
            ${svgIcon("help")}
            <div class="calc-tooltip">
              <p><b>Avg. Score</b><br>Mean of topic avg. scores (topics with at least 1 attempt)</p>
              <div class="calc-formula">${scoreFormula}</div>
            </div>
          </button>
        </div>
        <span>${passedTopics} of ${course.topics.length} topics passed</span>
      </div>
    </div>
    <div class="pals-score-topics">
      <div class="pals-score-topics-head">
        <span>Topic</span>
        <span>Passed</span>
        <span class="topic-head-info">Avg Score
          <button class="calc-info-btn" type="button" aria-label="How is Avg Score calculated?">
            ${svgIcon("help")}
            <div class="calc-tooltip">
              <p><b>Avg. Score</b><br>Mean of topic avg. scores (topics with at least 1 attempt)</p>
              <div class="calc-formula">${scoreFormula}</div>
            </div>
          </button>
        </span>
        <span class="topic-head-info">Avg Attempts
          <button class="calc-info-btn" type="button" aria-label="How is Avg Attempts calculated?">
            ${svgIcon("help")}
            <div class="calc-tooltip calc-tooltip-end">
              <p><b>Avg. Attempts</b> (per topic)<br>Total test attempts ÷ learners who attempted that topic</p>
              <div class="calc-formula">e.g. 3 learners attempt 2×, 3×, 1× → (2+3+1) ÷ 3 = 2.0×</div>
            </div>
          </button>
        </span>
      </div>
      ${course.topics.map(topic => {
        const notStarted = topic.avgAttempts === 0;
        const isHard = topic.avgAttempts >= 2.5;
        const passedLabel   = notStarted ? "—" : `${topic.passed}/${course.assigned}`;
        const scoreLabel    = notStarted ? "—" : `${topic.avgScore ?? "—"}%`;
        const attemptsLabel = notStarted
          ? `<span class="topic-not-started">Not started</span>`
          : `${topic.avgAttempts.toFixed(1)}×${isHard ? ` <span class="topic-hard-flag">${svgIcon("warning")} High difficulty</span>` : ""}`;
        return `
          <div class="pals-score-topic-row">
            <span>${topic.name}</span>
            <span class="topic-stat ${notStarted ? "stat-muted" : ""}">${passedLabel}</span>
            <span class="topic-stat ${notStarted ? "stat-muted" : ""}">${scoreLabel}</span>
            <span class="topic-stat">${attemptsLabel}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function buildLearnerScoresContent(course) {
  const sampleLearners = learners.slice(0, Math.min(8, course.assigned));
  const headerCells = course.topics
    .map(t => `<th class="topic-col-head" title="${t.name}"><div class="th-label">${t.name}</div></th>`)
    .join("");
  const rows = sampleLearners.map(learner => {
    const topicResults = course.topics.map(topic => {
      if (topic.avgAttempts === 0) return null;
      return mockLearnerTopicAttempts(learner.id, topic.avgScore);
    });
    const cells = course.topics.map((topic, i) => {
      if (!topicResults[i]) return `<td><span class="score-cell not-started">—</span></td>`;
      const last = topicResults[i][topicResults[i].length - 1];
      const cls = last.passed ? "passed" : "failed";
      return `<td><span class="score-cell ${cls}" data-test-report="${learner.id}|${course.name}|${topic.name}" title="View test report">${last.score}% ${last.passed ? "✓" : "✗"}</span></td>`;
    }).join("");
    const attempted = topicResults.filter(Boolean);
    let overallCell;
    if (attempted.length === 0) {
      overallCell = `<td class="overall-col"><span class="score-cell not-started">—</span></td>`;
    } else {
      const avg = Math.round(attempted.reduce((s, r) => s + r[r.length - 1].score, 0) / attempted.length);
      const cls = avg >= 70 ? "passed" : "failed";
      overallCell = `<td class="overall-col"><span class="score-cell ${cls} score-cell-overall">${avg}%</span></td>`;
    }
    return `
      <tr>
        <td class="learner-name-cell">
          <div class="learner-name-row">
            <span class="learner-avatar-small">${learner.name.charAt(0).toUpperCase()}</span>
            <span>${learner.name}</span>
          </div>
        </td>
        ${overallCell}
        ${cells}
      </tr>
    `;
  }).join("");
  return `
    <div class="learner-scores-wrap">
      <table class="learner-scores-table">
        <thead><tr><th>Learner</th><th class="overall-col-head">Overall</th>${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="learner-scores-note">Click a topic score to view the learner's detailed test report.</p>
    </div>
  `;
}

function buildTestReportContent({ learnerId, courseName, topicName }) {
  const learner = learners.find(l => l.id === learnerId);
  const course  = palsCourses.find(c => c.name === courseName);
  const topic   = course?.topics.find(t => t.name === topicName);
  if (!learner || !topic) return "<p style='padding:20px'>Data not found.</p>";
  const attempts  = mockLearnerTopicAttempts(learnerId, topic.avgScore);
  const questions = topicReviewQuestions(topicName);
  const last = attempts[attempts.length - 1];
  const attemptsHtml = attempts.map((attempt, ai) => {
    const qRows = questions.map((q, qi) => {
      const ans = attempt.answers[qi];
      const ok  = ans === q.correct;
      return `
        <div class="test-question ${ok ? "correct" : "wrong"}">
          <div class="test-q-indicator">${ok ? svgIcon("check-circle") : svgIcon("warning")}</div>
          <div class="test-q-body">
            <p class="test-q-text"><b>Q${qi + 1}.</b> ${q.text}</p>
            <p class="test-q-answer ${ok ? "correct-answer" : "learner-answer"}">
              <span class="answer-label">${ok ? "Correct:" : "Your answer:"}</span> "${q.choices[ans]}"
            </p>
            ${!ok ? `<p class="test-q-answer correct-answer"><span class="answer-label">Correct answer:</span> "${q.choices[q.correct]}"</p>` : ""}
          </div>
        </div>`;
    }).join("");
    const passTag = attempt.passed
      ? `<span class="attempt-pass-tag passed">Passed ✓</span>`
      : `<span class="attempt-pass-tag failed">Failed ✗</span>`;
    return `
      <div class="test-attempt">
        <div class="test-attempt-head">
          <strong>Attempt ${ai + 1}</strong><span>${attempt.score}%</span>${passTag}
        </div>
        <div class="test-questions">${qRows}</div>
      </div>`;
  }).join("");
  return `
    <div class="test-report-head">
      <div>
        <h2>${topicName}</h2>
        <p>${courseName}<br><strong>${learner.name}</strong></p>
      </div>
      <button class="test-report-close" data-action="close-test-report" aria-label="Close">✕</button>
    </div>
    <div class="test-report-body">
      <div class="test-report-stats">
        <article><span>Attempts</span><strong>${attempts.length}</strong></article>
        <article><span>Latest Score</span><strong>${last.score}%</strong></article>
        <article><span>Status</span><strong style="color:${last.passed ? "#0CAD60" : "#E73636"}">${last.passed ? "Passed" : "In Progress"}</strong></article>
      </div>
      ${attemptsHtml}
    </div>
  `;
}

function buildCourseTestReportContent(course) {
  const entity = state.selectedEntity;
  return `
    <div class="test-report-head">
      <div>
        <h2>${course.name}</h2>
        <p>${entity ? entity.name + " · " : ""}Learner scores by topic</p>
      </div>
      <button class="test-report-close" data-action="close-test-report" aria-label="Close">✕</button>
    </div>
    <div class="test-report-body" style="padding:0">
      ${buildLearnerScoresContent(course)}
    </div>
  `;
}

function buildPalsExpandRow(course) {
  const activeTab = state.palsExpandTabs[course.name] || "org";
  return `
    <tr class="pals-score-expand-row" data-expand-for="${course.name}">
      <td colspan="6">
        <div class="pals-expand-tabs">
          <button class="pals-expand-tab-btn${activeTab === "org" ? " active" : ""}" data-expand-tab="${course.name}" data-tab="org">Org Stats</button>
          <button class="pals-expand-tab-btn${activeTab === "learner" ? " active" : ""}" data-expand-tab="${course.name}" data-tab="learner">Learner Scores</button>
        </div>
        <div class="pals-score-expand${activeTab === "learner" ? " pals-score-expand--full" : ""}">
          ${activeTab === "org" ? buildOrgStatsContent(course) : buildLearnerScoresContent(course)}
        </div>
      </td>
    </tr>
  `;
}

// ─── Render: PALS Courses tab ─────────────────────────────────────────────────

function renderPalsExisting() {
  // Spider chart labels (shortened)
  const labelMap = {
    "Leadership Management":       "Leadership",
    "Advanced HR Management":      "Adv. HR",
    "Accountancy Specialist":      "Accountancy",
    "Human Resource Specialist":   "HR Specialist",
    "Customer Service PALS Course":"Customer Service",
    "Finance for Non-Finance":     "Finance",
    "Digital Collaboration":       "Digital Collab.",
    "Sales Fundamentals":          "Sales"
  };

  const spiderItems = palsCourses.map(c => ({
    name: c.name,
    label: labelMap[c.name] || c.name,
    progress: c.completionRate
  }));

  return `
    <section class="panel data-panel pals-spider-card">
      <div class="pals-progress-head">
        <div>
          <h2>Completion Rate by PALS Course</h2>
          <p>Compare course completion across published PALS courses.</p>
        </div>
        <div class="pals-progress-count"><strong>${palsCourses.length}</strong><span>courses</span></div>
      </div>
      <div class="pals-spider-layout">
        <div class="radar-wrap pals-spider-wrap">${renderRadarFor(spiderItems)}</div>
        <div class="pals-spider-legend">
          ${palsCourses.map(c => `
            <div class="pals-spider-row">
              <div>
                <strong>${c.name}</strong>
                <span>${c.kp} KP · ${c.assigned} assigned · ${c.completed} completed</span>
              </div>
              ${progress(c.completionRate)}
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="panel data-panel">
      <h2><span class="title-icon">${svgIcon("cap")}</span>Published PALS Courses</h2>
      <table class="pals-dual-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Knowledge Points</th>
            <th>Assigned Learners</th>
            <th>Completed</th>
            <th>Completion Rate</th>
            <th>Avg. Score</th>
          </tr>
        </thead>
        <tbody>
          ${palsCourses.map(course => {
            const isExpanded = state.expandedPalsRows.has(course.name);
            const expandedRow = isExpanded ? buildPalsExpandRow(course) : "";

            return `
              <tr>
                <td>
                  <div class="course-name-cell">
                    <button class="expand-btn${isExpanded ? " expanded" : ""}" data-expand-pals="${course.name}" aria-label="${isExpanded ? "Collapse" : "Expand"} ${course.name}">${svgIcon("chevron")}</button>
                    ${course.name}
                  </div>
                </td>
                <td>${course.kp}</td>
                <td>${course.assigned}</td>
                <td>${course.completed}</td>
                <td>${progress(course.completionRate)}</td>
                <td>${course.avgScore !== null ? progress(course.avgScore) : '<span class="stat-muted">—</span>'}</td>
              </tr>
              ${expandedRow}
            `;
          }).join("")}
        </tbody>
      </table>
    </section>
  `;
}

// ─── Render: Admin PALS Taxonomy overview ────────────────────────────────────

function renderAdminOverview() {
  const source = state.adminView === "group" ? groups : learners;
  const items  = source
    .filter(item => state.entityFilter === "all" || item.id === state.entityFilter)
    .map(item => ({
      ...item,
      completion: rangeAdjustedCompletion(item.completion),
      score:      rangeAdjustedScore(item.score)
    }));
  const meta        = state.adminView === "group" ? "learners" : "enrolled courses";
  const entityLabel = state.adminView === "group" ? "Groups" : "Learners";

  return `
    <section class="panel proposal-panel">
      <div class="proposal-head">
        <div>
          <h2>PALS Taxonomy</h2>
          <p>Completion and scoring breakdown by ${state.adminView === "group" ? "group" : "individual learner"}.</p>
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
              <option value="30"  ${state.dateRange === "30"  ? "selected" : ""}>Last 30 days</option>
              <option value="90"  ${state.dateRange === "90"  ? "selected" : ""}>Last 90 days</option>
              <option value="ytd" ${state.dateRange === "ytd" ? "selected" : ""}>Year to date</option>
            </select>
          </label>
          <label class="filter-control">${svgIcon("filter")}
            <select data-filter="entityFilter" aria-label="${entityLabel}">
              <option value="all" ${state.entityFilter === "all" ? "selected" : ""}>All ${entityLabel}</option>
              ${source.map(item => `<option value="${item.id}" ${state.entityFilter === item.id ? "selected" : ""}>${item.name}</option>`).join("")}
            </select>
          </label>
        </aside>

        <section class="entity-list">
          <div class="entity-list-head-v2">
            <span>${state.adminView === "group" ? "Group" : "Learner"}</span>
            <span>Completion Rate</span>
            <span>Avg. Score</span>
            <span>Report</span>
          </div>
          ${items.length ? items.map(item => `
            <article class="entity-card-v2">
              <div class="entity-avatar">${state.adminView === "group" ? svgIcon("users") : item.name.slice(0, 1).toUpperCase()}</div>
              <div class="entity-main">
                <strong>${item.name}</strong>
                <span>${state.adminView === "group" ? item.members : item.courses} ${meta}</span>
              </div>
              ${progress(item.completion)}
              <div class="entity-score-cell">
                <strong>${item.score > 0 ? item.score + "%" : "—"}</strong>
              </div>
              <button class="view-button" data-entity="${item.id}">View Report</button>
            </article>
          `).join("") : `<div class="empty-list">No ${entityLabel.toLowerCase()} match the selected filters.</div>`}
        </section>
      </div>
    </section>
  `;
}

// ─── Render: View Report (entity → PALS course breakdown) ─────────────────────

function renderAdminCourses() {
  const entity       = state.selectedEntity;
  const entityComp   = rangeAdjustedCompletion(entity.completion);
  const entityScore  = rangeAdjustedScore(entity.score);
  const meta         = state.adminView === "group" ? `${entity.members} learners` : `${entity.courses} enrolled courses`;
  const reportCourses = REPORT_COURSE_NAMES.map(n => palsCourses.find(c => c.name === n));

  return `
    <section class="panel proposal-panel">
      <div class="course-header">
        <div>
          <h2>${entity.name}<span class="entity-type-tag">${state.adminView === "group" ? "Group" : "Individual"}</span></h2>
          <p>${meta} · PALS course performance</p>
        </div>
        <button class="back-button" data-action="overview">${svgIcon("arrow")}Back</button>
      </div>

      <div class="entity-report-summary">
        <article class="report-metric">
          <div class="report-metric-icon">${svgIcon("check-circle")}</div>
          <div>
            <strong>${entityComp}%</strong>
            <span>Overall Completion
              <button class="calc-info-btn" type="button" aria-label="How is Overall Completion calculated?">
                ${svgIcon("help")}
                <div class="calc-tooltip">
                  <p><b>Overall Completion</b><br>% of assigned PALS courses where all required topics have been completed.</p>
                  <div class="calc-formula">Completed courses ÷ Assigned courses × 100</div>
                </div>
              </button>
            </span>
          </div>
        </article>
        <article class="report-metric">
          <div class="report-metric-icon">${svgIcon("chart")}</div>
          <div>
            <strong>${entityScore > 0 ? entityScore + "%" : "—"}</strong>
            <span>Avg. Score (all PALS)
              <button class="calc-info-btn" type="button" aria-label="How is Avg Score calculated?">
                ${svgIcon("help")}
                <div class="calc-tooltip">
                  <p><b>Avg. Score</b><br>Average of scores from topics the learner has passed (≥70%). Each score reflects their most recent attempt.</p>
                </div>
              </button>
            </span>
          </div>
        </article>
        <article class="report-metric">
          <div class="report-metric-icon">${svgIcon("cap")}</div>
          <div>
            <strong>${reportCourses.length}</strong>
            <span>Courses in Report</span>
          </div>
        </article>
      </div>

      <h3 class="report-courses-title">Course Breakdown</h3>
      <section class="course-grid">
        ${reportCourses.map((course, idx) => {
          const comp  = entityCourseCompletion(course.completionRate, idx);
          const score = entityCourseScore(course.avgScore, idx);
          return `
            <article class="course-card" data-course="${course.name}">
              <div class="course-ring-wrap">
                <div class="ring" style="--value:${comp}; --ring-color:${completionColor(comp)}"><b>${comp}%</b></div>
              </div>
              <div class="course-score-row">
                <span>Avg. Score</span>
                <strong style="color:${score !== null ? completionColor(score) : "var(--muted)"}">${score !== null ? score + "%" : "—"}</strong>
              </div>
              <div class="course-copy">
                <h3>${course.name}</h3>
                <p>${course.assigned} org-wide assigned · ${course.topics.length} topics</p>
              </div>
              <button class="test-report-btn" data-open-test-report="${course.name}">View Review Test Report</button>
            </article>
          `;
        }).join("")}
      </section>
    </section>
  `;
}

// ─── Render: Taxonomy detail (strand/topic breakdown) ─────────────────────────

function renderAdminDetail() {
  return `
    <section class="panel proposal-panel">
      <div class="detail-header">
        <div>
          <h2 class="section-title">${state.selectedCourse.name} Taxonomy</h2>
          <p>Strand, sub-strand, and KP/topic completion.</p>
        </div>
        <button class="back-button" data-action="courses">${svgIcon("arrow")}Back</button>
      </div>
      <div class="detail-grid">
        <section class="panel radar-card"><h2>Strands</h2><div class="radar-wrap">${renderRadar()}</div></section>
        <section class="panel"><h2>Sub-strands and Topics</h2><div class="breakdown">
          ${strands.map(strand => `
            <article class="strand-card">
              <div class="strand-head">
                <div><strong>${strand.name}</strong><small>${strand.sub.length} sub-strands</small></div>
                ${progress(strand.progress)}
              </div>
              <div class="topic-list">
                ${strand.sub.map(([subName, topics]) => `
                  <div><strong>${subName}</strong>
                    ${topics.map(([topic, value]) => `
                      <div class="topic-row"><span>${topic}</span><div class="progress"><span style="--value:${value}%; --bar-color:${completionColor(value)}"></span></div><b>${value}%</b></div>
                    `).join("")}
                  </div>
                `).join("")}
              </div>
            </article>
          `).join("")}
        </div></section>
      </div>
    </section>
  `;
}

// ─── Render: Radar / spider chart ─────────────────────────────────────────────

function radarPoints(values, radius, center) {
  return values.map((v, i) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / values.length;
    const r = radius * (v / 100);
    return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
  }).join(" ");
}

function renderRadarFor(items) {
  const center = 200, radius = 138;
  const rings = [25, 50, 75, 100].map(v =>
    `<polygon class="grid" points="${radarPoints(new Array(items.length).fill(v), radius, center)}"></polygon>`
  ).join("");
  const axes = items.map((_, i) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / items.length;
    return `<line x1="${center}" y1="${center}" x2="${center + Math.cos(angle) * radius}" y2="${center + Math.sin(angle) * radius}"></line>`;
  }).join("");
  const labels = items.map((item, i) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / items.length;
    const x = center + Math.cos(angle) * (radius + 32);
    const y = center + Math.sin(angle) * (radius + 30);
    const anchor = Math.abs(Math.cos(angle)) < 0.2 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
    return `<text x="${x}" y="${y}" text-anchor="${anchor}">${item.label || item.name}</text>`;
  }).join("");
  return `<svg class="radar" viewBox="0 0 400 400">${rings}${axes}<polygon class="value" points="${radarPoints(items.map(i => i.progress), radius, center)}"></polygon>${labels}</svg>`;
}

function renderRadar() {
  return renderRadarFor(strands);
}

// ─── Render: PALS tab (combines all sections) ─────────────────────────────────

function renderPalsTab() {
  let proposal = "";
  if (state.proposalLevel === "overview") proposal = renderAdminOverview();
  if (state.proposalLevel === "courses")  proposal = renderAdminCourses();
  if (state.proposalLevel === "detail")   proposal = renderAdminDetail();
  return `${renderPalsExisting()}${proposal}`;
}

// ─── Render: Skills tab ───────────────────────────────────────────────────────

function renderSkillAnalytics() {
  const categories = [...new Set(skillTags.map(s => s.cat))];

  let items = skillTags.slice();
  if (state.skillCategory !== "all") items = items.filter(s => s.cat === state.skillCategory);
  if (state.skillGapOnly) items = items.filter(s => s.avg < 60);
  items.sort((a, b) => {
    if (state.skillSort === "asc" || state.skillSort === "gap") return a.avg - b.avg;
    if (state.skillSort === "cover") return b.cover - a.cover;
    return b.avg - a.avg;
  });

  const heatRows = skillTags
    .filter(s => state.skillCategory === "all" || s.cat === state.skillCategory)
    .slice()
    .sort((a, b) => b.avg - a.avg);

  const orgAvg = Math.round(skillTags.reduce((s, i) => s + i.avg, 0) / skillTags.length);
  const attentionCount = skillTags.filter(s => s.avg < 50).length;
  const maxCover = skillTags.reduce((m, s) => Math.max(m, s.cover), 0);
  const catCount = categories.length;
  const railData = state.skillView === "group" ? skillGroupAverages() : skillCategoryAverages();
  const railTitle = state.skillView === "group" ? "Group profile" : "Category profile";
  const railSub = state.skillView === "group" ? "Average skill mastery by group." : "Organisation average by skill category.";

  return `
    <section class="metrics" aria-label="Skills summary">
      <article class="metric-card">
        <div class="metric-icon">${svgIcon("sparkle")}</div>
        <div><strong>${skillTags.length}</strong><span>Skills Tracked</span><small>Across ${catCount} categories</small></div>
      </article>
      <article class="metric-card">
        <div class="metric-icon">${svgIcon("warning")}</div>
        <div><strong>${attentionCount}</strong><span>Needing Attention</span><small>Org. average below 50%</small></div>
      </article>
      <article class="metric-card">
        <div class="metric-icon">${svgIcon("chart")}</div>
        <div><strong>${orgAvg}%</strong><span>Org. Avg. Mastery</span><small>Mean across tracked skills</small></div>
      </article>
      <article class="metric-card">
        <div class="metric-icon">${svgIcon("users")}</div>
        <div><strong>${maxCover}</strong><span>Learners Covered</span><small>Most-covered skill's learner count</small></div>
      </article>
    </section>

    <section class="panel skills-analytics">
      <div class="skills-analytics-head">
        <div>
          <h2>Skills across the organisation</h2>
          <p>Skill mastery is derived from PALS review-test questions and CBL challenge performance, grouped into four competency bands.</p>
        </div>
        <div class="skill-summary"><strong>${skillTags.length}</strong><span>skills tracked</span></div>
      </div>

      <div class="skills-toolbar">
        <div class="field">
          <span>View</span>
          <div class="tabs compact-tabs">
            <button class="tab${state.skillView === "org" ? " active" : ""}" type="button" data-skill-view="org">${svgIcon("grid")}Organisation</button>
            <button class="tab${state.skillView === "group" ? " active" : ""}" type="button" data-skill-view="group">${svgIcon("users")}By group</button>
            <button class="tab${state.skillView === "learner" ? " active" : ""}" type="button" data-skill-view="learner">${svgIcon("user")}Learner</button>
          </div>
        </div>
        <label class="field">
          <span>Category</span>
          <select data-skill-category>
            <option value="all" ${state.skillCategory === "all" ? "selected" : ""}>All categories</option>
            ${categories.map(c => `<option value="${c}" ${state.skillCategory === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Sort by</span>
          <select data-skill-sort>
            <option value="gap" ${state.skillSort === "gap" ? "selected" : ""}>Needs attention first</option>
            <option value="desc" ${state.skillSort === "desc" ? "selected" : ""}>Mastery — high to low</option>
            <option value="asc" ${state.skillSort === "asc" ? "selected" : ""}>Mastery — low to high</option>
            <option value="cover" ${state.skillSort === "cover" ? "selected" : ""}>Coverage — most learners</option>
          </select>
        </label>
        <label class="skills-toggle${state.skillGapOnly ? " on" : ""}" data-skill-gap-toggle tabindex="0" role="switch" aria-checked="${state.skillGapOnly}">
          <span class="skills-switch"></span> Only gaps below 60%
        </label>
        <div class="grow"></div>
      </div>

      <div class="skills-split-layout">
        <div>
          <div class="skill-list-note">Showing ${items.length} of ${skillTags.length} skills${state.skillCategory !== "all" ? " in " + state.skillCategory : ""}${state.skillGapOnly ? " · gaps only" : ""}</div>
          <div class="skill-rank-list">
            ${items.length ? items.map((s, i) => {
              const total = s.dist.reduce((a, b) => a + b, 0) || 1;
              const segs = s.dist.map((c, bi) => `<span class="${SKILL_BANDS[bi].cls}" style="width:${(c / total * 100).toFixed(1)}%"></span>`).join("");
              const tier = skillTierOf(s.avg);
              const low = s.cover < SKILL_LOW_COVERAGE;
              const badge = tier ? `<span class="entity-status-badge status-${tier}">${SKILL_TIER_LABEL[tier]}</span>` : "";
              const bandDetail = s.dist.map((c, bi) => `
                <div class="skill-detail-band"><span class="dot ${SKILL_BANDS[bi].cls}"></span><b>${c}</b><span>${SKILL_BANDS[bi].key}</span></div>
              `).join("");
              return `
                <article class="skill-rank-row" data-skill-row="${s.name}">
                  <div class="skill-rank-top">
                    <span class="skill-rank-num">${i + 1}</span>
                    <span class="skill-rank-name">${s.name} ${badge}<small>${s.cat}</small></span>
                    <span class="skill-rank-cover">${s.cover} learners${low ? " ⚠" : ""}</span>
                    <span class="skill-rank-val">${s.avg}%</span>
                  </div>
                  <div class="skill-band-bar">${segs}</div>
                  <div class="skill-rank-detail">
                    <div class="skill-detail-comp">
                      <div class="ring" style="--value:${s.avg};--ring-color:${completionColor(s.avg)}"><b>${s.avg}%</b></div>
                      <div class="skill-comp-bars">
                        <div class="skill-comp-line"><span class="dot" style="background:var(--blue)"></span>PALS (questions answered correctly)<b>${s.pals} pts</b></div>
                        <div class="skill-comp-line"><span class="dot" style="background:var(--purple)"></span>CBL (challenges completed)<b>${s.cbl} pts</b></div>
                      </div>
                    </div>
                    <div class="skill-detail-bands">${bandDetail}</div>
                  </div>
                </article>
              `;
            }).join("") : `<div class="empty-list">No skills sit below 60% right now. Toggle the filter off to see all skills.</div>`}
          </div>
          <div class="skill-band-legend">
            <span><span class="dot band-novice"></span>Novice</span>
            <span><span class="dot band-developing"></span>Developing</span>
            <span><span class="dot band-competent"></span>Competent</span>
            <span><span class="dot band-proficient"></span>Proficient</span>
          </div>
        </div>

        <div>
          <h2 style="font-size:15px;margin:0 0 4px">${railTitle}</h2>
          <p style="margin:0 0 4px;color:var(--muted);font-size:12px">${railSub}</p>
          <div class="radar-wrap pals-spider-wrap">${renderRadarFor(railData)}</div>
          <div class="pals-spider-legend">
            ${railData.map(c => `
              <div class="pals-spider-row"><div><strong>${c.name}</strong></div>${progress(c.progress)}</div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="panel skill-heatmap-panel">
      <div class="skill-heatmap-head">
        <h2>Where the gaps sit — skill × group</h2>
        <p>Average mastery per group${state.skillCategory !== "all" ? " for " + state.skillCategory : ""}. Cells covering fewer than ${SKILL_LOW_COVERAGE} learners are dimmed — read with caution. Click a cell to drill into that group's learners.</p>
      </div>
      <div class="skill-heatmap-scroll">
        <table class="skill-heatmap">
          <thead><tr><th class="corner">Skill</th>${SKILL_GROUP_NAMES.map(g => `<th>${g}</th>`).join("")}</tr></thead>
          <tbody>
            ${heatRows.map(s => `
              <tr>
                <td class="skill-heatmap-rowlbl">${s.name}</td>
                ${SKILL_GROUP_NAMES.map(g => {
                  const v = s.byGroup[g];
                  const dim = s.cover < SKILL_LOW_COVERAGE ? " dim" : "";
                  return `<td><div class="skill-heatmap-cell${dim}" style="background:${skillHeatColor(v)};color:${skillHeatTextColor(v)}" data-skill-heat-cell data-skill="${s.name}" data-group="${g}" title="${s.name} · ${g}: ${v}%">${v}</div></td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>

    ${renderSkillModal()}
  `;
}

function renderSkillModal() {
  if (!state.skillModalLearner) return "";
  const learner = learners.find(l => l.id === state.skillModalLearner) || learners[0];
  const ctx = state.skillModalContext;
  const catAvgs = skillCategoryAverages(s => learnerSkillMastery(learner, s).avg);
  const rows = skillTags.map(s => ({ name: s.name, ...learnerSkillMastery(learner, s) })).sort((a, b) => b.avg - a.avg);

  return `
    <dialog class="skill-modal" id="skillModal">
      <form method="dialog">
        <div class="skill-modal-head">
          <div>
            <h2>${learner.name}</h2>
            <p>${ctx ? `Opened from <b>${ctx.skill} · ${ctx.group}</b>. ` : ""}Skill mastery broken down by category and by PALS / CBL contribution.</p>
          </div>
          <button class="skill-modal-close" value="close" aria-label="Close">✕</button>
        </div>
        <label class="field skill-modal-picker">
          <span>Learner</span>
          <select data-skill-modal-learner>
            ${learners.map(l => `<option value="${l.id}" ${l.id === learner.id ? "selected" : ""}>${l.name}</option>`).join("")}
          </select>
        </label>
        <div class="radar-wrap pals-spider-wrap">${renderRadarFor(catAvgs)}</div>
        <div class="pals-spider-legend">
          ${catAvgs.map(c => `<div class="pals-spider-row"><div><strong>${c.name}</strong></div>${progress(c.progress)}</div>`).join("")}
        </div>
        <div class="skill-modal-comp-list">
          ${rows.map(r => `
            <div class="skill-modal-comp-row">
              <span class="nm">${r.name}</span>
              <span class="bar" title="PALS ${r.pals} pts · CBL ${r.cbl} pts"><span class="p" style="width:${r.pals}%"></span><span class="c" style="width:${r.cbl}%"></span></span>
              <span class="tot">${r.avg}%</span>
            </div>
          `).join("")}
        </div>
      </form>
    </dialog>
  `;
}

// ─── Render: CBL tab ──────────────────────────────────────────────────────────

function renderAdminCBLOverview() {
  const totalAttempts    = cblCases.reduce((s, i) => s + i.attempts, 0);
  const avgHighestScore  = weightedAverage(cblCases);
  const learnersAttempted = cblCases.reduce((max, i) => Math.max(max, i.attempted), 0);

  return `
    <section class="panel cbl-overview-panel">
      <div class="cbl-admin-head">
        <div><h2>CBL Analytics</h2><p>Review case-based learning practice and roleplay performance across your organization.</p></div>
      </div>
      <section class="cbl-admin-summary">
        <article><span>Available cases</span><strong>${cblCases.length}</strong></article>
        <article><span>Learners attempted</span><strong>${learnersAttempted}</strong></article>
        <article><span>Total attempts</span><strong>${totalAttempts}</strong></article>
        <article><span>Average highest score</span><strong>${avgHighestScore}%</strong></article>
      </section>
    </section>
    <section class="panel cbl-admin-panel">
      <div class="cbl-admin-list-head">
        <div><h2><span class="title-icon">${svgIcon("trophy")}</span>Practice and Roleplay Cases</h2></div>
      </div>
      <div class="cbl-admin-tile-grid">
        ${cblCases.map((item, idx) => `
          <article class="cbl-admin-tile">
            <div class="cbl-admin-tile-ring">
              <div class="ring" style="--value:${item.score}; --ring-color:${completionColor(item.score)}"><b>${item.score}%</b></div>
            </div>
            <div class="cbl-admin-name"><strong>${item.name}</strong><span>Role: ${item.role}</span></div>
            <div class="cbl-admin-tile-meta"><span>Average highest score</span><strong>${item.attempted} learners</strong></div>
            <button class="view-button" data-cbl-case="${idx}">View Details</button>
          </article>
        `).join("")}
      </div>
    </section>
    ${renderAdminCBLModal()}
  `;
}

function renderAdminCBLModal() {
  const item = state.selectedCblCase;
  if (!item) return "";
  const selectedGroup  = state.selectedCblGroup;
  const groupBreakdown = cblEntities.group.map((g, i) => ({
    id: g.id, name: g.name, learners: g.learners,
    attempts: Math.max(1, Math.round(item.attempts * [.35, .28, .2, .17][i])),
    score: Math.max(22, Math.min(96, item.score + [7, 2, -5, -10][i]))
  }));
  const learnerBreakdown = cblEntities.individual.slice(0, 5).map((l, i) => ({
    name: l.name,
    attempts: Math.max(1, Math.round((selectedGroup ? selectedGroup.attempts : item.attempts) / 12) + (i % 3)),
    score: Math.max(18, Math.min(96, item.score + [9, 4, -2, -7, 1][i]))
  }));

  return `
    <dialog class="cbl-report-modal" id="cblReportModal">
      <form method="dialog">
        <div class="cbl-modal-head">
          <div>
            <h2>${item.name}</h2>
            <p>${selectedGroup ? `${selectedGroup.name} learner breakdown` : `Role: ${item.role}`}. Scores represent highest scores.</p>
          </div>
          <button class="cbl-modal-close" value="close" aria-label="Close">x</button>
        </div>
        <section class="cbl-modal-summary">
          <article><span>Average highest score</span><strong>${selectedGroup ? selectedGroup.score : item.score}%</strong></article>
          <article><span>Total attempts</span><strong>${selectedGroup ? selectedGroup.attempts : item.attempts}</strong></article>
          <article><span>Learners attempted</span><strong>${selectedGroup ? selectedGroup.learners : item.attempted}</strong></article>
        </section>
        <div class="cbl-modal-modes">
          <span>${svgIcon("mic")} ${item.live} Live</span>
          <span>${svgIcon("message")} ${item.turn} Turn-based</span>
        </div>
        ${selectedGroup ? `
          <section class="cbl-modal-section">
            <button class="cbl-modal-back" type="button" data-cbl-group-back>${svgIcon("arrow")}Back to groups</button>
            <h3>Learner Performance</h3>
            <div class="cbl-modal-list learner-breakdown">
              ${learnerBreakdown.map(e => `
                <article>
                  <div><strong>${e.name}</strong><span>${e.attempts} attempts</span></div>
                  <div><span>Highest score</span>${progress(e.score)}</div>
                </article>
              `).join("")}
            </div>
          </section>
        ` : `
          <section class="cbl-modal-section">
            <h3>Group Performance</h3>
            <div class="cbl-modal-list group-breakdown">
              ${groupBreakdown.map(e => `
                <article>
                  <div><strong>${e.name}</strong><span>${e.learners} learners · ${e.attempts} attempts</span></div>
                  <div><span>Average highest score</span>${progress(e.score)}</div>
                  <button class="view-button" type="button" data-cbl-group="${e.id}">View learners</button>
                </article>
              `).join("")}
            </div>
          </section>
        `}
      </form>
    </dialog>
  `;
}

function renderAdminCBL() { return renderAdminCBLOverview(); }

function renderPlaceholder(title) {
  return `<section class="panel empty-panel"><h2>${title}</h2><p>Analytics for this area will appear here.</p></section>`;
}

// ─── Partial render — replaces only .proposal-panel, leaves spider/table intact ─

function renderProposalInPlace() {
  if (state.mainTab !== "pals") { render(); return; }
  const el = appView.querySelector(".proposal-panel");
  if (!el) { render(); return; }
  let html = "";
  if (state.proposalLevel === "overview") html = renderAdminOverview();
  else if (state.proposalLevel === "courses") html = renderAdminCourses();
  else if (state.proposalLevel === "detail") html = renderAdminDetail();
  el.outerHTML = html;
}

// ─── Root render ──────────────────────────────────────────────────────────────

function render() {
  renderTopTabs();
  breadcrumb.innerHTML = "";
  if (state.mainTab === "courses")     appView.innerHTML = renderCourseMastery();
  if (state.mainTab === "pals")        appView.innerHTML = renderPalsTab();
  if (state.mainTab === "skills")      appView.innerHTML = renderSkillAnalytics();
  if (state.mainTab === "cbl")         appView.innerHTML = renderAdminCBL();
  if (state.mainTab === "assessments") appView.innerHTML = renderPlaceholder("Assessments");
  if (state.mainTab === "trends")      appView.innerHTML = renderPlaceholder("Trends");
}

// ─── Event delegation ─────────────────────────────────────────────────────────

document.addEventListener("click", e => {
  const mainTab = e.target.closest("[data-main-tab]");
  if (mainTab) {
    state.mainTab = mainTab.dataset.mainTab;
    state.proposalLevel = "overview";
    state.entityFilter = "all";
    state.selectedEntity = state.selectedCourse = state.selectedCblCase = state.selectedCblGroup = null;
    render(); return;
  }

  const adminView = e.target.closest("[data-admin-view]");
  if (adminView) {
    state.adminView = adminView.dataset.adminView;
    state.proposalLevel = "overview";
    state.entityFilter = "all";
    state.selectedEntity = state.selectedCblCase = state.selectedCblGroup = null;
    renderProposalInPlace(); return;
  }

  const expandPals = e.target.closest("[data-expand-pals]");
  if (expandPals) {
    const name = expandPals.dataset.expandPals;
    const wasExpanded = state.expandedPalsRows.has(name);
    wasExpanded ? state.expandedPalsRows.delete(name) : state.expandedPalsRows.add(name);
    const tr = expandPals.closest("tr");
    if (wasExpanded) {
      if (tr.nextElementSibling?.classList.contains("pals-score-expand-row")) tr.nextElementSibling.remove();
      delete state.palsExpandTabs[name];
      expandPals.classList.remove("expanded");
      expandPals.setAttribute("aria-label", `Expand ${name}`);
    } else {
      const course = palsCourses.find(c => c.name === name);
      if (course) tr.insertAdjacentHTML("afterend", buildPalsExpandRow(course));
      expandPals.classList.add("expanded");
      expandPals.setAttribute("aria-label", `Collapse ${name}`);
    }
    return;
  }

  const expandTab = e.target.closest("[data-expand-tab]");
  if (expandTab) {
    const courseName = expandTab.dataset.expandTab;
    state.palsExpandTabs[courseName] = expandTab.dataset.tab;
    const expandRow = appView.querySelector(`tr[data-expand-for="${CSS.escape(courseName)}"]`);
    if (expandRow) {
      const course = palsCourses.find(c => c.name === courseName);
      if (course) expandRow.outerHTML = buildPalsExpandRow(course);
    }
    return;
  }

  const testReportCell = e.target.closest("[data-test-report]");
  if (testReportCell) {
    const [learnerId, courseName, topicName] = testReportCell.dataset.testReport.split("|");
    state.testReportTarget = { learnerId, courseName, topicName };
    const modal = document.querySelector("#testReportModal");
    if (modal) {
      modal.className = "";
      modal.innerHTML = buildTestReportContent(state.testReportTarget);
      if (!modal.open) modal.showModal();
    }
    return;
  }

  const openTestReport = e.target.closest("[data-open-test-report]");
  if (openTestReport) {
    const courseName = openTestReport.dataset.openTestReport;
    const course = palsCourses.find(c => c.name === courseName);
    if (course) {
      const modal = document.querySelector("#testReportModal");
      if (modal) {
        modal.className = "test-report-wide";
        modal.innerHTML = buildCourseTestReportContent(course);
        if (!modal.open) modal.showModal();
      }
    }
    return;
  }

  const cblCase = e.target.closest("[data-cbl-case]");
  if (cblCase) {
    state.selectedCblCase  = cblCases[Number(cblCase.dataset.cblCase)];
    state.selectedCblGroup = null;
    render(); document.querySelector("#cblReportModal")?.showModal(); return;
  }

  const cblGroup = e.target.closest("[data-cbl-group]");
  if (cblGroup) {
    const idx = cblEntities.group.findIndex(g => g.id === cblGroup.dataset.cblGroup);
    state.selectedCblGroup = {
      ...cblEntities.group[idx],
      attempts: Math.max(1, Math.round(state.selectedCblCase.attempts * [.35, .28, .2, .17][idx])),
      score: Math.max(22, Math.min(96, state.selectedCblCase.score + [7, 2, -5, -10][idx]))
    };
    render(); document.querySelector("#cblReportModal")?.showModal(); return;
  }

  const cblGroupBack = e.target.closest("[data-cbl-group-back]");
  if (cblGroupBack) {
    state.selectedCblGroup = null;
    render(); document.querySelector("#cblReportModal")?.showModal(); return;
  }

  const entityBtn = e.target.closest("[data-entity]");
  if (entityBtn) {
    const pool = state.adminView === "group" ? groups : learners;
    state.selectedEntity = pool.find(i => i.id === entityBtn.dataset.entity);
    state.proposalLevel  = "courses";
    renderProposalInPlace(); return;
  }

  const courseCard = e.target.closest("[data-course]");
  if (courseCard) {
    state.selectedCourse  = { name: courseCard.dataset.course };
    state.proposalLevel   = "detail";
    renderProposalInPlace(); return;
  }

  const skillRow = e.target.closest("[data-skill-row]");
  if (skillRow) { skillRow.classList.toggle("open"); return; }

  const skillGapToggle = e.target.closest("[data-skill-gap-toggle]");
  if (skillGapToggle) {
    state.skillGapOnly = !state.skillGapOnly;
    render();
    return;
  }

  const skillViewBtn = e.target.closest("[data-skill-view]");
  if (skillViewBtn) {
    state.skillView = skillViewBtn.dataset.skillView;
    if (state.skillView === "learner") {
      state.skillModalLearner = state.skillModalLearner || learners[0].id;
      state.skillModalContext = null;
      render();
      document.querySelector("#skillModal")?.showModal();
    } else {
      render();
    }
    return;
  }

  const skillHeatCell = e.target.closest("[data-skill-heat-cell]");
  if (skillHeatCell) {
    state.skillModalLearner = learners[0].id;
    state.skillModalContext = { group: skillHeatCell.dataset.group, skill: skillHeatCell.dataset.skill };
    render();
    document.querySelector("#skillModal")?.showModal();
    return;
  }

  const action = e.target.closest("[data-action]");
  if (action) {
    if (action.dataset.action === "close-test-report") {
      document.querySelector("#testReportModal")?.close();
      return;
    }
    state.proposalLevel = action.dataset.action === "overview" ? "overview" : "courses";
    if (state.proposalLevel === "overview") { state.selectedEntity = state.selectedCourse = null; }
    renderProposalInPlace();
  }
});

document.addEventListener("change", e => {
  const filter = e.target.closest("[data-filter]");
  if (filter) {
    state[filter.dataset.filter] = filter.value;
    state.proposalLevel = "overview";
    state.selectedEntity = null;
    renderProposalInPlace();
    return;
  }

  const skillSort = e.target.closest("[data-skill-sort]");
  if (skillSort) { state.skillSort = skillSort.value; render(); return; }

  const skillCategorySel = e.target.closest("[data-skill-category]");
  if (skillCategorySel) { state.skillCategory = skillCategorySel.value; render(); return; }

  const skillModalLearnerSel = e.target.closest("[data-skill-modal-learner]");
  if (skillModalLearnerSel) {
    state.skillModalLearner = skillModalLearnerSel.value;
    render();
    document.querySelector("#skillModal")?.showModal();
    return;
  }
});

document.addEventListener("keydown", e => {
  if (e.key !== " " && e.key !== "Enter") return;
  const toggle = e.target.closest("[data-skill-gap-toggle]");
  if (toggle) { e.preventDefault(); toggle.click(); }
});

hydrateIcons();
render();

// Test report dialog lives outside re-render cycle
const testReportModal = document.createElement("dialog");
testReportModal.id = "testReportModal";
document.body.appendChild(testReportModal);
testReportModal.addEventListener("click", e => {
  if (e.target === testReportModal) testReportModal.close();
});
