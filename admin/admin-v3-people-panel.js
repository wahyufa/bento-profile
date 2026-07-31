/* ---------- shared shell utilities (icons, sidebar, hydration) ---------- */

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
  cap: '<path d="m22 10-10-5-10 5 10 5 10-5Z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path>',
  'book-open': '<path d="M2 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"></path><path d="M22 4h-7a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h8z"></path>',
  trend: '<path d="m3 17 6-6 4 4 8-8"></path><path d="M14 7h7v7"></path>',
  arrow: '<path d="m9 18 6-6-6-6"></path>',
  brain: '<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.5 3.5 0 0 0 1 6 3 3 0 0 0 3 3.5V4.2A3 3 0 0 0 9 3Z"></path><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3.5 3.5 0 0 1-1 6 3 3 0 0 1-3 3.5V4.2A3 3 0 0 1 15 3Z"></path>',
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>'
};

function svgIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = svgIcon(node.dataset.icon);
  });
}

function initials(name) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function progressBar(value, tone = "is-teal", label = "Progress") {
  const bounded = Math.max(0, Math.min(100, Number(value) || 0));
  return `
    <span class="progress-track" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${bounded}">
      <span class="progress-fill ${tone}" style="width:${bounded}%"></span>
    </span>`;
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

document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href="#"]');
  if (anchor) event.preventDefault();

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
  }
});

window.addEventListener("resize", syncSidebarState);

/* ---------- People Insights data ---------- */

const piGroups = [
  { id: "demo-learners", name: "Demo Learners" },
  { id: "heyhi-demo", name: "HeyHi Demo" },
  { id: "product-growth", name: "Product & Growth Pod" }
];

const piMembers = [
  { name: "learner", courses: 2, completed: 0, progress: 84, groupId: "heyhi-demo", profiled: true },
  { name: "Learner Chuen", courses: 1, completed: 0, progress: 0, groupId: "product-growth", profiled: true },
  { name: "bima leraner", courses: 0, completed: 0, progress: 0, groupId: "demo-learners" },
  { name: "Dzung Cao", role: "IT Chief", courses: 2, completed: 0, progress: 0, groupId: "heyhi-demo", profiled: true },
  { name: "Hiep Org", courses: 0, completed: 0, progress: 0, groupId: "demo-learners" },
  { name: "Dzung", courses: 2, completed: 0, progress: 0, groupId: "heyhi-demo" },
  { name: "dungcaond+content@gmail.com", courses: 0, completed: 0, progress: 0, groupId: "heyhi-demo" },
  { name: "Demo 2", courses: 0, completed: 0, progress: 0, groupId: "demo-learners" },
  { name: "vin", courses: 0, completed: 0, progress: 0, groupId: "heyhi-demo", profiled: true },
  { name: "bima@heyhi.sg", courses: 1, completed: 0, progress: 0, groupId: "heyhi-demo", profiled: true },
  { name: "wahyu@heyhi.sg", courses: 0, completed: 0, progress: 0, groupId: "heyhi-demo" },
  { name: "Quyen", courses: 2, completed: 0, progress: 72, groupId: "product-growth", profiled: true },
  { name: "Thanh", courses: 2, completed: 0, progress: 76, groupId: "product-growth", profiled: true },
  { name: "dungcaond+manager@gmail.com", courses: 0, completed: 0, progress: 0, groupId: "heyhi-demo" },
  { name: "zhichuenf@gmail.com", courses: 2, completed: 0, progress: 0, groupId: "heyhi-demo", profiled: true },
  { name: "Zhi Chuen Admin D", courses: 0, completed: 0, progress: 0, groupId: "heyhi-demo" },
  { name: "Gam Mai", courses: 2, completed: 0, progress: 68, groupId: "product-growth", profiled: true },
  { name: "Wahyu", courses: 0, completed: 0, progress: 0, groupId: "heyhi-demo", profiled: true },
  { name: "daffa+learner", courses: 0, completed: 0, progress: 0, groupId: "demo-learners" },
  { name: "Zhi Chuen Learns", courses: 2, completed: 0, progress: 8, groupId: "product-growth", profiled: true },
  { name: "Admin_Kuro", groupId: "heyhi-demo" },
  { name: "thuylinhhhlt.317+admin@gmail.com", groupId: "heyhi-demo" },
  { name: "Bima Rindarto", groupId: "heyhi-demo" },
  { name: "dzung@optimimed.sg", groupId: "product-growth" },
  { name: "Instructor Glenn", groupId: "product-growth", profiled: true },
  { name: "Zhi Chuen", groupId: "product-growth" },
  { name: "Tuan Admin", groupId: "product-growth" },
  { name: "Learner Vin", groupId: "product-growth" },
  { name: "Vin", groupId: "product-growth" },
  { name: "Glenn", groupId: "product-growth" }
];

const piCompatPairs = [
  ["ESTJ", "ENTP"],
  ["ESTJ", "ENTJ"],
  ["ESTJ", "ENFP"],
  ["ENTP", "ENTJ"],
  ["ENTP", "ENFP"],
  ["ENTJ", "ENFP"]
];

const piMbtiTone = { ESTJ: "is-red", ENTP: "is-teal", ENTJ: "is-purple", ENFP: "is-amber" };

const piRecommendations = [
  {
    priority: "high",
    icon: "brain",
    title: "Increase Profile Coverage",
    body: "Only 40% of team members have completed personality assessments. Encourage more participation for better team insights."
  },
  {
    priority: "medium",
    icon: "sparkle",
    title: "Strengthen Emotional Intelligence",
    body: "Your team is heavily logic-driven. Consider workshops on empathetic leadership and conflict resolution to balance decision-making."
  },
  {
    priority: "high",
    icon: "cap",
    title: "Boost Training Engagement",
    body: "Average course progress is 21%. Consider shorter, more focused modules and gamification to increase completion rates."
  }
];

// Full narrative drill-down data only exists for the one profiled member captured from production.
const piPersonalityResult = {
  name: "Learner Chuen",
  interestCode: "ISE",
  interests: [
    { name: "Investigative", value: 85 },
    { name: "Social", value: 75 },
    { name: "Enterprising", value: 72 },
    { name: "Conventional", value: 72 },
    { name: "Realistic", value: 60 },
    { name: "Artistic", value: 38 }
  ],
  interestHighlights: [
    { label: "Top Interest", name: "Investigative", value: 85, body: "You may enjoy exploring ideas, asking why things happen, and solving problems through research or analysis." },
    { label: "Interest 2", name: "Social", value: 75, body: "You may enjoy helping others learn, grow, solve problems, or feel supported." },
    { label: "Interest 3", name: "Enterprising", value: 72, body: "You may enjoy leading, presenting ideas, making decisions, and moving people toward a goal." }
  ],
  interestNote: "Interest Profile uses the RIASEC model: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional. Your highest areas can guide career exploration, project choices, and learning activities.",
  mbtiType: "ISTJ",
  mbtiSummary: "People whose preferred functions are Sensing and Thinking develop their natural skill sets by practical acquisition of facts and experience. They usually organize or seek out activities, are involved in the local community, and are interested in nature. These skills and preferences will evolve in jobs that require a high attention to facts and situations that require immediate action. For example: within construction, business management, people management, administration, applied sciences, accountancy and auditing, law and other occupations where they can apply their experience and attention to reach their targets.",
  traits: [
    { letter: "I", name: "Introvert", body: "Persistent, determined, thorough" },
    { letter: "S", name: "Sensing", body: "Sturdy, sensible, practical" },
    { letter: "T", name: "Thinking", body: "Logical, fair, critical" },
    { letter: "J", name: "Judging", body: "Hardworking, efficient, goal-oriented" }
  ],
  dimensions: [
    {
      title: "Energy",
      key: "EI",
      left: { letter: "E", name: "Extravert", value: 48 },
      right: { letter: "I", name: "Introvert", value: 52 },
      points: [
        "Builds energy through focused, independent work and quiet reflection",
        "Thinks things through internally before sharing conclusions",
        "Prefers depth over breadth and sustained attention on one topic at a time",
        "Communicates most effectively in writing or one-to-one conversations",
        "Tends to be measured and deliberate before committing to action",
        "Depth of expertise and careful analysis is a key professional strength",
        "Works best when given uninterrupted time to concentrate and prepare"
      ]
    },
    {
      title: "Perception",
      key: "SN",
      left: { letter: "S", name: "Sensing", value: 52 },
      right: { letter: "N", name: "Intuitive", value: 48 },
      points: [
        "Focuses on facts, details, and what is concrete and verifiable",
        "Learns most effectively through hands-on practice and real examples",
        "Thinks pragmatically and prefers proven, step-by-step approaches",
        "Prefers working with clear specifications and tangible deliverables",
        "Brings accuracy and attention to detail to complex tasks",
        "Works best with defined processes and realistic, near-term goals",
        "Energised by seeing practical results and steady progress"
      ]
    },
    {
      title: "Judgement",
      key: "TF",
      left: { letter: "T", name: "Thinking", value: 52 },
      right: { letter: "F", name: "Feeling", value: 48 },
      points: [
        "Makes decisions based on logic, evidence, and objective analysis",
        "Values consistency, fairness, and clear reasoning over personal preference",
        "Comfortable giving and receiving direct, task-focused feedback",
        "Prefers structured debate and evaluating trade-offs openly",
        "Brings clarity and rigour to problem-solving and prioritisation",
        "Works best when goals and success criteria are clearly defined",
        "Energised by solving complex problems and improving how things work"
      ]
    },
    {
      title: "Lifestyle",
      key: "JP",
      left: { letter: "J", name: "Judging", value: 52 },
      right: { letter: "P", name: "Perceiving", value: 48 },
      points: [
        "Prefers structure, planning, and clear decisions over open-ended exploration",
        "Works best with defined milestones, deadlines, and predictable routines",
        "Likes to close out tasks and move to completion rather than leave things open",
        "Brings discipline, follow-through, and reliability to commitments",
        "Prefers to settle direction early and adjust from a stable plan",
        "Comfortable driving projects forward and holding others to timelines",
        "Energised by ticking things off, meeting targets, and delivering results"
      ]
    }
  ]
};

/* ---------- random (seeded) trait/interest generator for the other profiled members ---------- */

const PI_DIMENSIONS = [
  { key: "EI", left: "E", right: "I", leftName: "Extravert", rightName: "Introvert" },
  { key: "SN", left: "S", right: "N", leftName: "Sensing", rightName: "iNtuitive" },
  { key: "TF", left: "T", right: "F", leftName: "Thinking", rightName: "Feeling" },
  { key: "JP", left: "J", right: "P", leftName: "Judging", rightName: "Perceiving" }
];

// Matches the color theme used in the existing psychometric report: Energy = pink,
// Perception = orange, Judgement = blue, Lifestyle = green.
const PI_DIM_THEME = {
  EI: { color: "#e91e8c", colorSoft: "#fbe0f0" },
  SN: { color: "#e65100", colorSoft: "#fde3cc" },
  TF: { color: "#1565c0", colorSoft: "#d6e9fa" },
  JP: { color: "#558b2f", colorSoft: "#e3f0d9" }
};

const PI_RIASEC_KEYS = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"];

function piHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}

function piSeededRange(seed, min, max) {
  const frac = Math.abs(Math.sin(seed)) % 1;
  return Math.round(min + frac * (max - min));
}

function piGenerateProfile(name) {
  const base = piHash(name);
  const dims = {};
  PI_DIMENSIONS.forEach((d, i) => {
    dims[d.key] = piSeededRange(base + i * 137.31, 18, 84);
  });
  const riasec = {};
  PI_RIASEC_KEYS.forEach((key, i) => {
    riasec[key] = piSeededRange(base + i * 251.7 + 900, 32, 92);
  });
  const mbtiType = PI_DIMENSIONS.map((d) => (dims[d.key] >= 50 ? d.left : d.right)).join("");
  return { mbtiType, dims, riasec };
}

const piChuenProfile = {
  mbtiType: "ISTJ",
  dims: { EI: 48, SN: 52, TF: 52, JP: 52 },
  riasec: { Investigative: 85, Social: 75, Enterprising: 72, Conventional: 72, Realistic: 60, Artistic: 38 }
};

function piProfileFor(member) {
  if (member.name === "Learner Chuen") return piChuenProfile;
  if (!member._profile) member._profile = piGenerateProfile(member.name);
  return member._profile;
}

const PI_TRAIT_BLURB = {
  E: "Draws energy from people and external activity",
  I: "Draws energy from focused, independent work",
  S: "Focuses on concrete facts and present realities",
  N: "Focuses on patterns, possibilities, and the big picture",
  T: "Decides based on logic and objective analysis",
  F: "Decides based on values and impact on people",
  J: "Prefers structure, plans, and closure",
  P: "Prefers flexibility and staying open to options"
};

const PI_STRENGTH_BLURB = {
  T: "logic and analysis, goal-oriented execution",
  F: "empathy-driven decisions, strong rapport-building",
  J: "reliable follow-through, structured planning",
  P: "adaptability, comfort with ambiguity",
  S: "attention to detail, practical execution",
  N: "big-picture thinking, spotting new opportunities",
  I: "deep focus, thoughtful independent analysis",
  E: "energetic collaboration, confident communication"
};

const PI_BLINDSPOT_BLURB = {
  T: "showing appreciation and recognising others' feelings",
  F: "making tough calls quickly without over-consulting",
  J: "staying open when plans need to change",
  P: "following through on loose ends and deadlines",
  S: "stepping back to see the bigger strategic picture",
  N: "sweating the practical, day-to-day details",
  I: "speaking up quickly in fast-moving discussions",
  E: "giving quieter voices space to contribute"
};

const PI_DEMOTIVATOR_BLURB = {
  T: "incompetence or sloppy reasoning around them",
  F: "conflict, tension, or a lack of appreciation",
  J: "ambiguity, lack of structure, last-minute changes",
  P: "rigid processes and micromanagement",
  S: "vague goals without a concrete plan",
  N: "repetitive work with no room for new ideas",
  I: "constant interruptions and shallow small talk",
  E: "isolation and a lack of momentum or feedback"
};

/* ---------- state ---------- */

const piState = {
  tab: "personality",
  scope: "organization",
  group: null,
  view: "list",
  selectedMember: null,
  search: "",
  groupFilter: "all",
  statusFilter: "all",
  snapshot: "summary"
};

const piPanel = document.querySelector("#pi-panel");

/* ---------- aggregate helpers ---------- */

function piMembersInGroup(groupId) {
  return piMembers.filter((m) => m.groupId === groupId);
}

function piAggregate(members) {
  const profiles = members.map(piProfileFor);
  const dims = PI_DIMENSIONS.map((d) => {
    const values = profiles.map((p) => p.dims[d.key]);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const spread = max - min;
    const lean = Math.abs(avg - 50);
    return { ...d, leftPct: avg, rightPct: 100 - avg, spread, min, max, lean, flagged: spread < 20 && lean > 12 };
  });
  const riasec = PI_RIASEC_KEYS.map((key) => ({
    name: key,
    value: Math.round(profiles.reduce((sum, p) => sum + p.riasec[key], 0) / profiles.length)
  })).sort((a, b) => b.value - a.value);

  const diversityScore = Math.round(dims.reduce((sum, d) => sum + d.spread, 0) / dims.length);
  const balanceFlags = dims.filter((d) => d.flagged).length;
  const dominant = [...dims]
    .sort((a, b) => b.lean - a.lean)
    .slice(0, 2)
    .map((d) => (d.leftPct >= 50 ? d.left : d.right))
    .join(" &middot; ");

  return { dims, riasec, diversityScore, balanceFlags, dominant, topInterest: riasec[0] };
}

function piInsightsFor(agg) {
  const letters = {};
  agg.dims.forEach((d) => { letters[d.key] = d.leftPct >= 50 ? d.left : d.right; });
  const tf = letters.TF;
  const jp = letters.JP;
  return {
    strengths: `${PI_STRENGTH_BLURB[tf]}, ${PI_STRENGTH_BLURB[jp]}`,
    blindspots: `${PI_BLINDSPOT_BLURB[tf]}, ${PI_BLINDSPOT_BLURB[jp]}`,
    demotivators: `${PI_DEMOTIVATOR_BLURB[jp]}, ${PI_DEMOTIVATOR_BLURB[tf]}`
  };
}

function piOrgNorm() {
  const agg = piAggregate(piMembers.filter((m) => m.profiled));
  const norm = {};
  agg.riasec.forEach((r) => { norm[r.name] = r.value; });
  return norm;
}

/* ---------- render: personality scope control ---------- */

function renderScopeControl() {
  const group = piGroups.find((g) => g.id === piState.group);
  return `
    <div class="pi-scope-bar">
      <div class="segmented-control" role="group" aria-label="Personality analytics scope">
        <button class="segmented-button ${piState.scope === "organization" ? "is-active" : ""}" type="button" data-pi-scope="organization" aria-pressed="${piState.scope === "organization"}">Organization</button>
        <button class="segmented-button ${piState.scope === "group" ? "is-active" : ""}" type="button" data-pi-scope="group" aria-pressed="${piState.scope === "group"}">Group</button>
        <button class="segmented-button ${piState.scope === "individual" ? "is-active" : ""}" type="button" data-pi-scope="individual" aria-pressed="${piState.scope === "individual"}">Individual</button>
      </div>
      ${piState.scope === "group" ? `
        <div class="pi-inline-field">
          <label for="pi-group-select">Group</label>
          <select id="pi-group-select" data-pi-group>
            <option value="" ${!group ? "selected" : ""}>Select a group</option>
            ${piGroups.map((g) => `<option value="${g.id}" ${piState.group === g.id ? "selected" : ""}>${g.name} (${piMembersInGroup(g.id).length} members)</option>`).join("")}
          </select>
        </div>` : ""}
    </div>`;
}

/* ---------- render: team dynamics card ---------- */

function renderTeamDimBar(d) {
  const spreadLabel = d.spread < 18 ? "narrow spread" : d.spread < 35 ? "moderate spread" : "wide spread";
  const spreadTail = d.spread < 18 ? (d.flagged ? " &mdash; homogeneous, watch balance" : " &mdash; aligned") : d.spread < 35 ? "" : " &mdash; genuinely mixed";
  const leadName = d.leftPct >= 50 ? d.leftName : d.rightName;
  const leadPct = Math.max(d.leftPct, d.rightPct);
  return `
    <div class="pi-dim-block">
      <div class="pi-dim-labels"><span class="is-left">${d.leftName}</span><span class="is-right">${d.rightName}</span></div>
      <div class="pi-dim-bar"><span class="is-left" style="width:${d.leftPct}%"></span><span class="is-right" style="width:${d.rightPct}%"></span></div>
      <p class="pi-td-dim-caption ${d.flagged ? "is-flag" : ""}">${d.flagged ? "&#9888; " : ""}Leans ${leadName} &middot; ${leadPct}% &middot; ${spreadLabel} (${d.min}&ndash;${d.max}%)${spreadTail}</p>
    </div>`;
}

function renderTeamRiasec(riasec, orgNorm) {
  return `
    <div class="pi-bar-list">
      ${riasec
        .map((r) => {
          const normVal = orgNorm ? orgNorm[r.name] : null;
          const below = normVal != null && r.value < normVal;
          return `
        <div class="pi-bar-row">
          <span>${r.name}</span>
          <span class="progress-track pi-td-riasec-track">
            <span class="progress-fill ${below ? "is-red" : "is-blue"}" style="width:${r.value}%"></span>
            ${normVal != null ? `<span class="pi-td-norm-tick" style="left:${normVal}%"></span>` : ""}
          </span>
          <strong>${r.value}%</strong>
        </div>`;
        })
        .join("")}
    </div>
    ${orgNorm ? `<p class="pi-section-note">Bar = team average &middot; tick = org norm &middot; <span class="is-red-text">red = below org</span></p>` : ""}`;
}

function renderTeamDynamicsCard(title, members, opts = {}) {
  const profiled = members.filter((m) => m.profiled);
  if (profiled.length < 3) {
    return `
      <div class="panel">
        <div class="panel-body">
          <div class="pi-td-empty"><span data-icon="brain"></span><p>Not enough completed personality assessments in <strong>${title}</strong> yet (${profiled.length} of ${members.length}).</p></div>
        </div>
      </div>`;
  }

  const agg = piAggregate(profiled);
  const diversityLabel = agg.diversityScore <= 22 ? "Low" : agg.diversityScore <= 42 ? "Moderate" : "High";
  const insights = piInsightsFor(agg);

  return `
    <div class="panel">
      <div class="panel-body">
        <div class="pi-td-head">
          <div>
            <p class="pi-eyebrow">Team Dynamics</p>
            <h3>${title}</h3>
            <small>${profiled.length} of ${members.length} members profiled &middot; aggregate view only</small>
          </div>
        </div>

        <section class="metric-grid pi-stat-grid-4">
          <article class="metric-card"><div><strong>${agg.diversityScore}<small>/100</small></strong><span>Cognitive diversity</span><small>${diversityLabel}</small></div></article>
          <article class="metric-card"><div><strong>${agg.topInterest.name}</strong><span>Top interest theme</span><small>${agg.topInterest.value}% team avg</small></div></article>
          <article class="metric-card"><div><strong>${agg.dominant}</strong><span>Dominant pattern</span><small>trait-lean</small></div></article>
          <article class="metric-card"><div><strong class="${agg.balanceFlags ? "is-warn" : ""}">${agg.balanceFlags}</strong><span>Balance flags</span><small>needs attention</small></div></article>
        </section>

        <h4 class="pi-panel-subhead">Preference composition</h4>
        <p class="pi-section-note" style="margin-top:0">Team average on each axis. Bar = where the team's centre of gravity sits; caption = spread across members.</p>
        <div class="pi-dim-grid">${agg.dims.map(renderTeamDimBar).join("")}</div>

        <h4 class="pi-panel-subhead">Interest profile${opts.orgNorm ? " vs org norm" : ""}</h4>
        ${renderTeamRiasec(agg.riasec, opts.orgNorm)}

        <h4 class="pi-panel-subhead">Insights</h4>
        <div class="pi-highlight-grid">
          <div class="pi-highlight-card is-strength"><span>Collective strengths</span><p>${insights.strengths}</p></div>
          <div class="pi-highlight-card is-blindspot"><span>Shared blind spots</span><p>${insights.blindspots}</p></div>
          <div class="pi-highlight-card is-demotivator"><span>Collective demotivators</span><p>${insights.demotivators}</p></div>
        </div>
      </div>
    </div>`;
}

/* ---------- render: individual scope (member grid + drill-down) ---------- */

function piFilteredMembers() {
  const q = piState.search.trim().toLowerCase();
  return piMembers.filter((member) => {
    if (piState.groupFilter !== "all" && member.groupId !== piState.groupFilter) return false;
    if (piState.statusFilter === "profiled" && !member.profiled) return false;
    if (piState.statusFilter === "unprofiled" && member.profiled) return false;
    if (!q) return true;
    return member.name.toLowerCase().includes(q) || (member.role || "").toLowerCase().includes(q);
  });
}

function renderMemberRow(member) {
  const group = piGroups.find((g) => g.id === member.groupId);
  const roleLine = member.role ? `<small>${member.role}</small>` : "";
  const statusBadge = member.profiled
    ? `<span class="pi-status-badge is-profiled">Profiled</span>`
    : `<span class="pi-status-badge">Not profiled</span>`;
  const action = member.profiled
    ? `<button class="pi-view-result" type="button" data-pi-view-result data-pi-member="${member.name}">View Result</button>`
    : `<span class="pi-table-dash">&mdash;</span>`;
  return `
    <tr>
      <td>
        <div class="pi-table-member">
          <span class="avatar">${initials(member.name)}</span>
          <div class="pi-member-info"><strong>${member.name}</strong>${roleLine}</div>
        </div>
      </td>
      <td>${group ? group.name : "&mdash;"}</td>
      <td>${statusBadge}</td>
      <td>${action}</td>
    </tr>`;
}

function renderPersonalityList() {
  const filtered = piFilteredMembers();
  return `
    <div class="panel">
      <div class="panel-body">
        <div class="pi-team-head">
          <h2 class="pi-section-title"><span data-icon="users"></span>Team Members</h2>
          <div class="pi-team-filters">
            <div class="pi-inline-field">
              <label for="pi-filter-group">Group</label>
              <select id="pi-filter-group" data-pi-filter-group>
                <option value="all" ${piState.groupFilter === "all" ? "selected" : ""}>All groups</option>
                ${piGroups.map((g) => `<option value="${g.id}" ${piState.groupFilter === g.id ? "selected" : ""}>${g.name}</option>`).join("")}
              </select>
            </div>
            <div class="pi-inline-field">
              <label for="pi-filter-status">Status</label>
              <select id="pi-filter-status" data-pi-filter-status>
                <option value="all" ${piState.statusFilter === "all" ? "selected" : ""}>All statuses</option>
                <option value="profiled" ${piState.statusFilter === "profiled" ? "selected" : ""}>Profiled</option>
                <option value="unprofiled" ${piState.statusFilter === "unprofiled" ? "selected" : ""}>Not profiled</option>
              </select>
            </div>
            <label class="pi-search">
              <span data-icon="search" aria-hidden="true"></span>
              <input type="search" placeholder="Search by name, type, role&hellip;" value="${piState.search}" data-pi-search aria-label="Search team members" />
            </label>
          </div>
        </div>
        <div class="table-scroll">
          <table class="data-table pi-member-table">
            <thead><tr><th>Member</th><th>Group</th><th>Status</th><th></th></tr></thead>
            <tbody>
              ${filtered.length ? filtered.map(renderMemberRow).join("") : `<tr><td colspan="4" class="pi-empty-note">No team members match your filters.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

function renderDimensionBlock(dim) {
  const theme = PI_DIM_THEME[dim.key];
  return `
    <div class="pi-dim-block" style="--dim-color:${theme.color};--dim-color-soft:${theme.colorSoft}">
      <h4 class="pi-dim-title">${dim.title}</h4>
      <div class="pi-dim-labels">
        <span class="is-left">${dim.left.letter} &middot; ${dim.left.name}</span>
        <span class="is-right">${dim.right.name} &middot; ${dim.right.letter}</span>
      </div>
      <div class="pi-dim-bar">
        <span class="is-left" style="width:${dim.left.value}%">${dim.left.value}%</span>
        <span class="is-right" style="width:${dim.right.value}%">${dim.right.value}%</span>
      </div>
      <ul class="pi-dim-list">${dim.points.map((p) => `<li>${p}</li>`).join("")}</ul>
    </div>`;
}

function renderPersonalityDetail() {
  const r = piPersonalityResult;
  const snapshotOn = piState.snapshot === "summary";
  return `
    <button class="pi-back-link" type="button" data-pi-back><span data-icon="arrow"></span>Go Back</button>

    <div class="pi-detail-heading">
      <span class="pi-hero-icon" data-icon="brain"></span>
      <h2>${r.name}&rsquo;s Personality Result</h2>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="pi-panel-head">
          <div>
            <p class="pi-eyebrow">Interest Result</p>
            <h3>Interest Profile</h3>
            <p>Your RIASEC interest pattern highlights activities and work areas that may feel more natural, motivating, or enjoyable for you.</p>
          </div>
          <span class="pi-code-chip">${r.interestCode}</span>
        </div>

        <div class="pi-interest-layout">
          <div class="pi-interest-highlight">
            <span>Your Strongest Interest</span>
            <strong>${r.interests[0].name}</strong>
            <p>Curious, analytical, and problem-focused. Your score for this area is ${r.interests[0].value}%.</p>
          </div>
          <div class="pi-bar-list">
            ${r.interests
              .map(
                (i) => `
              <div class="pi-bar-row">
                <span>${i.name}</span>
                ${progressBar(i.value, "is-blue", `${i.name} interest score`)}
                <strong>${i.value}%</strong>
              </div>`
              )
              .join("")}
          </div>
        </div>

        <div class="pi-highlight-grid">
          ${r.interestHighlights
            .map(
              (h) => `
            <div class="pi-highlight-card">
              <span>${h.label}</span>
              <strong>${h.name} ${h.value}%</strong>
              <p>${h.body}</p>
            </div>`
            )
            .join("")}
        </div>

        <p class="pi-section-note">${r.interestNote}</p>
      </div>
    </div>

    <div class="pi-type-banner pi-section">
      <div>
        <p class="pi-eyebrow">Personality Test Result</p>
        <strong>${r.mbtiType} Preference Profile</strong>
        <button type="button" data-pi-noop>Click to view details</button>
      </div>
      <span class="pi-type-chip">${r.mbtiType} <span data-icon="chevron"></span></span>
    </div>

    <div class="panel pi-section">
      <div class="panel-body">
        <div class="pi-panel-head">
          <div>
            <p class="pi-eyebrow">Preference Overview</p>
            <h3>Preference Profile</h3>
            <p>Your preference profile shows how you may prefer to use energy, take in information, make decisions, and organise your work.</p>
          </div>
          <span class="pi-code-chip">${r.mbtiType}</span>
        </div>

        <div class="pi-type-card">
          <div class="pi-type-primary">
            <span>Your Preference Type</span>
            <strong>${r.mbtiType}</strong>
            <p>${r.mbtiSummary}</p>
          </div>
          ${r.traits
            .map(
              (t) => `
            <div class="pi-trait-card">
              <strong>${t.letter}</strong>
              <em>${t.name}</em>
              <p>The ${t.name} type is often characterised as: ${t.body}</p>
            </div>`
            )
            .join("")}
        </div>

        <div class="pi-snapshot-toggle">
          <button type="button" class="${snapshotOn ? "is-active" : ""}" data-pi-snapshot="summary">Learning &amp; Work Snapshot</button>
          <button type="button" class="${snapshotOn ? "" : "is-active"}" data-pi-snapshot="full">Full ${r.mbtiType} detail</button>
        </div>
        <p class="pi-snapshot-note">A dimension-by-dimension look at how your ${r.mbtiType} result may show up day to day.</p>

        <div class="pi-dim-grid">${r.dimensions.map(renderDimensionBlock).join("")}</div>
      </div>
    </div>

    <div class="pi-detail-actions">
      <button class="pi-btn" type="button" data-pi-noop>Review Questions</button>
      <button class="pi-btn is-primary" type="button" data-pi-back>Go Back</button>
    </div>`;
}

function renderGenericDimBlock(d, dims) {
  const leftPct = dims[d.key];
  const rightPct = 100 - leftPct;
  const dominant = leftPct >= 50 ? d.left : d.right;
  const theme = PI_DIM_THEME[d.key];
  return `
    <div class="pi-dim-block" style="--dim-color:${theme.color};--dim-color-soft:${theme.colorSoft}">
      <div class="pi-dim-labels"><span class="is-left">${d.leftName}</span><span class="is-right">${d.rightName}</span></div>
      <div class="pi-dim-bar">
        <span class="is-left" style="width:${leftPct}%">${leftPct}%</span>
        <span class="is-right" style="width:${rightPct}%">${rightPct}%</span>
      </div>
      <p class="pi-td-dim-caption">${PI_TRAIT_BLURB[dominant]}</p>
    </div>`;
}

function renderGenericPersonalityDetail(member) {
  const profile = piProfileFor(member);
  const riasecSorted = PI_RIASEC_KEYS.map((k) => ({ name: k, value: profile.riasec[k] })).sort((a, b) => b.value - a.value);
  return `
    <button class="pi-back-link" type="button" data-pi-back><span data-icon="arrow"></span>Go Back</button>

    <div class="pi-detail-heading">
      <span class="pi-hero-icon" data-icon="brain"></span>
      <h2>${member.name}&rsquo;s Personality Result</h2>
    </div>

    <div class="panel pi-section">
      <div class="panel-body">
        <div class="pi-panel-head">
          <div><p class="pi-eyebrow">Preference Overview</p><h3>Preference Profile</h3></div>
          <span class="pi-code-chip">${profile.mbtiType}</span>
        </div>
        <div class="pi-dim-grid">${PI_DIMENSIONS.map((d) => renderGenericDimBlock(d, profile.dims)).join("")}</div>
      </div>
    </div>

    <div class="panel pi-section">
      <div class="panel-body">
        <h3 class="pi-section-title"><span data-icon="sparkle"></span>Interest Profile</h3>
        <div class="pi-bar-list pi-section">
          ${riasecSorted
            .map(
              (i) => `
            <div class="pi-bar-row">
              <span>${i.name}</span>
              ${progressBar(i.value, "is-blue", `${i.name} interest score`)}
              <strong>${i.value}%</strong>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </div>

    <div class="pi-detail-actions">
      <button class="pi-btn is-primary" type="button" data-pi-back>Go Back</button>
    </div>`;
}

function renderIndividualDetail() {
  const member = piMembers.find((m) => m.name === piState.selectedMember) || piMembers.find((m) => m.profiled);
  if (!member) return renderPersonalityList();
  return member.name === "Learner Chuen" ? renderPersonalityDetail() : renderGenericPersonalityDetail(member);
}

/* ---------- render: personality tab dispatch ---------- */

function renderCompatPanel() {
  return `
    <div class="panel pi-section">
      <div class="panel-body">
        <h2 class="pi-section-title"><span data-icon="brain"></span>Personality Compatibility Insights</h2>
        <div class="pi-compat-grid">${piCompatPairs
          .map(
            ([a, b]) => `
          <div class="pi-compat-pair">
            <span class="pi-mbti-badge ${piMbtiTone[a]}">${a}</span>
            <span class="pi-x">&times;</span>
            <span class="pi-mbti-badge ${piMbtiTone[b]}">${b}</span>
          </div>`
          )
          .join("")}</div>
        <p class="pi-section-note">Synergy pairs tend to complement each other's strengths. Consider pairing them for cross-functional projects.</p>
      </div>
    </div>`;
}

function renderPersonality() {
  const scopeControl = renderScopeControl();

  if (piState.scope === "individual") {
    return scopeControl + (piState.view === "detail" ? renderIndividualDetail() : renderPersonalityList());
  }

  if (piState.scope === "group") {
    const group = piGroups.find((g) => g.id === piState.group);
    if (!group) {
      return (
        scopeControl +
        `<div class="panel"><div class="panel-body"><div class="pi-td-empty"><span data-icon="users"></span><p>Select a group above to see its team dynamics.</p></div></div></div>`
      );
    }
    return (
      scopeControl +
      renderTeamDynamicsCard(group.name, piMembersInGroup(group.id), {
        orgNorm: piOrgNorm()
      })
    );
  }

  return scopeControl + renderTeamDynamicsCard("All Members", piMembers, {}) + renderCompatPanel();
}

/* ---------- render: training ---------- */

function renderTraining() {
  const withTraining = piMembers.filter((m) => m.courses !== undefined).slice(0, 20);

  return `
    <section class="metric-grid pi-stat-grid-3">
      <article class="metric-card">
        <span class="metric-icon" data-icon="users"></span>
        <div><strong>15 / 30</strong><span>Active Learners</span><small>enrolled in at least one course</small></div>
      </article>
      <article class="metric-card">
        <span class="metric-icon" data-icon="check-circle"></span>
        <div><strong>0%</strong><span>Completion Rate</span><small>0 of 29 enrollments</small></div>
      </article>
      <article class="metric-card">
        <span class="metric-icon" data-icon="trend"></span>
        <div><strong>21%</strong><span>Avg. Progress</span><small>across all active courses</small></div>
      </article>
    </section>

    <div class="panel pi-section">
      <div class="panel-body">
        <h2 class="pi-section-title"><span data-icon="medal"></span>Assessment Performance</h2>
        <section class="metric-grid pi-stat-grid-3" style="margin-top:14px">
          <article class="metric-card"><div><strong>61%</strong><span>Average Score</span></div></article>
          <article class="metric-card"><div><strong>46%</strong><span>Pass Rate</span></div></article>
          <article class="metric-card"><div><strong>35</strong><span>Total Attempts</span></div></article>
        </section>
      </div>
    </div>

    <div class="panel pi-section">
      <div class="panel-body">
        <h2 class="pi-section-title"><span data-icon="book-open"></span>Learner Progress</h2>
        <div class="pi-learner-list">
          ${withTraining
            .map(
              (m) => `
            <div class="pi-learner-row">
              <span class="avatar">${initials(m.name)}</span>
              <div class="pi-learner-info">
                <strong>${m.name}</strong>
                <small>${m.courses} course${m.courses === 1 ? "" : "s"} &middot; ${m.completed} completed</small>
              </div>
              <div class="pi-learner-progress">
                ${progressBar(m.progress, "is-teal", `${m.name} course progress`)}
                <strong>${m.progress}%</strong>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </div>`;
}

/* ---------- render: recommendations ---------- */

function renderRecommendations() {
  return `
    <div class="panel">
      <div class="panel-body">
        <div class="pi-panel-head">
          <h3 class="pi-section-title"><span data-icon="brain"></span>Skill Gaps</h3>
          <span class="pi-code-chip">Last 10 attempts &middot; Below 70%</span>
        </div>
        <div class="pi-empty-box"></div>
      </div>
    </div>

    <div class="pi-reco-list">
      ${piRecommendations
        .map(
          (r) => `
        <article class="pi-reco-card is-${r.priority}">
          <span class="pi-reco-icon" data-icon="${r.icon}"></span>
          <div>
            <div class="pi-reco-title">${r.title}<span class="pi-priority is-${r.priority}">${r.priority}</span></div>
            <p>${r.body}</p>
          </div>
        </article>`
        )
        .join("")}
    </div>`;
}

/* ---------- tab wiring ---------- */

const piRenderers = {
  personality: renderPersonality,
  training: renderTraining,
  recommendations: renderRecommendations
};

function piRender() {
  document.querySelectorAll("[data-pi-tab]").forEach((tab) => {
    const active = tab.dataset.piTab === piState.tab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  piPanel.setAttribute("aria-labelledby", `pi-tab-${piState.tab}`);
  piPanel.innerHTML = (piRenderers[piState.tab] || renderPersonality)();
  hydrateIcons(piPanel);
}

document.querySelectorAll("[data-pi-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    piState.tab = tab.dataset.piTab;
    piState.view = "list";
    piRender();
  });
});

piPanel.addEventListener("click", (event) => {
  const scopeBtn = event.target.closest("[data-pi-scope]");
  if (scopeBtn) {
    piState.scope = scopeBtn.dataset.piScope;
    piState.view = "list";
    piRender();
    return;
  }

  if (event.target.closest("[data-pi-view-result]")) {
    piState.view = "detail";
    piState.snapshot = "summary";
    piState.selectedMember = event.target.closest("[data-pi-view-result]").dataset.piMember;
    piRender();
    return;
  }
  if (event.target.closest("[data-pi-back]")) {
    piState.view = "list";
    piRender();
    return;
  }
  const snapshotBtn = event.target.closest("[data-pi-snapshot]");
  if (snapshotBtn) {
    piState.snapshot = snapshotBtn.dataset.piSnapshot;
    piRender();
  }
});

piPanel.addEventListener("change", (event) => {
  if (event.target.matches("[data-pi-group]")) {
    piState.group = event.target.value || null;
    piRender();
    return;
  }
  if (event.target.matches("[data-pi-filter-group]")) {
    piState.groupFilter = event.target.value;
    piRender();
    return;
  }
  if (event.target.matches("[data-pi-filter-status]")) {
    piState.statusFilter = event.target.value;
    piRender();
  }
});

piPanel.addEventListener("input", (event) => {
  if (event.target.matches("[data-pi-search]")) {
    piState.search = event.target.value;
    piRender();
    const input = piPanel.querySelector("[data-pi-search]");
    if (input) {
      input.focus();
      input.setSelectionRange(piState.search.length, piState.search.length);
    }
  }
});

hydrateIcons();
piRender();
syncSidebarState();
