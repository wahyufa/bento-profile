const QUESTION_BANKS = [
  { value: "1", label: "Singapore" },
  { value: "2", label: "Indonesia" },
  { value: "15", label: "Cambridge" },
  { value: "16", label: "IELTS" },
  { value: "19", label: "Hong Kong" },
  { value: "29", label: "Malaysia" },
  { value: "59", label: "TOEIC" },
  { value: "67", label: "Digital SAT" },
  { value: "109", label: "General English" },
  { value: "121", label: "Cambridge English" },
  { value: "105", label: "Demo" }
];

const SUBJECT_LEVELS = [
  { value: "1-1", label: "Primary 1 English" },
  { value: "1-2", label: "Primary 2 English" },
  { value: "1-3", label: "Primary 3 English" },
  { value: "1-4", label: "Primary 4 English" },
  { value: "1-5", label: "Primary 5 English" },
  { value: "1-6", label: "Primary 6 English" },
  { value: "2-1", label: "Primary 1 Maths" },
  { value: "2-2", label: "Primary 2 Maths" },
  { value: "2-3", label: "Primary 3 Maths" },
  { value: "2-4", label: "Primary 4 Maths" },
  { value: "2-5", label: "Primary 5 Maths" },
  { value: "2-6", label: "Primary 6 Maths" },
  { value: "3-3", label: "Primary 3 Science" },
  { value: "3-4", label: "Primary 4 Science" },
  { value: "3-5", label: "Primary 5 Science" },
  { value: "3-6", label: "Primary 6 Science" },
  { value: "9-1", label: "Primary 1 Chinese" },
  { value: "9-2", label: "Primary 2 Chinese" },
  { value: "9-3", label: "Primary 3 Chinese" },
  { value: "9-4", label: "Primary 4 Chinese" },
  { value: "9-5", label: "Primary 5 Chinese" },
  { value: "9-6", label: "Primary 6 Chinese" },
  { value: "10-11", label: "Secondary 3 Pure Chemistry" },
  { value: "10-12", label: "Secondary 4 Pure Chemistry" },
  { value: "14-11", label: "Secondary 3 Pure Biology" },
  { value: "14-12", label: "Secondary 4 Pure Biology" },
  { value: "17-31", label: "JC1 Junior College H2 Biology" },
  { value: "17-32", label: "JC2 Junior College H2 Biology" }
];

const $ = (sel, root = document) => root.querySelector(sel);
const escapeHtml = (str = "") =>
  str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Click targets inside these panels often re-render and detach themselves mid-click
// (e.g. a checkbox toggle rebuilds the list it's in). By the time an "outside click"
// listener on `document` runs, `e.target` may already be detached, so `.closest()`
// on it wrongly returns null. `composedPath()` is captured before any DOM mutation,
// so it stays accurate regardless of what handlers do to the DOM in between.
function clickIsInside(e, selector) {
  return e.composedPath().some((el) => el.nodeType === 1 && el.matches(selector));
}

// Wires the "closed until clicked, stays open while interacting, closes on
// outside click" behavior shared by the Topic and Tag accordion fields.
function bindClickToOpenAccordion(searchSelector, accordionSelector, containerSelector) {
  const searchEl = $(searchSelector);
  const open = () => {
    $(accordionSelector).hidden = false;
  };
  searchEl.addEventListener("focus", open);
  searchEl.addEventListener("click", open);
  document.addEventListener("click", (e) => {
    if (!clickIsInside(e, containerSelector)) $(accordionSelector).hidden = true;
  });
}

/* ---------- Shared multiselect (chips + optional search + checkbox list) ---------- */

function renderMsChips(chipsEl, options, selectedValues, onRemove) {
  chipsEl.innerHTML = selectedValues
    .map((v) => {
      const opt = options.find((o) => o.value === v);
      return `<span class="ms-chip">${escapeHtml(opt ? opt.label : v)}<button type="button" data-ms-remove="${escapeHtml(v)}">&times;</button></span>`;
    })
    .join("");
  chipsEl.querySelectorAll("[data-ms-remove]").forEach((btn) => {
    btn.addEventListener("click", () => onRemove(btn.dataset.msRemove));
  });
}

function renderMsList(listEl, options, selectedValues, searchTerm, onToggle) {
  const term = (searchTerm || "").toLowerCase();
  const visible = options.filter((o) => o.label.toLowerCase().includes(term));
  listEl.innerHTML =
    visible
      .map(
        (o) =>
          `<label class="ms-item"><input type="checkbox" value="${escapeHtml(o.value)}" ${selectedValues.includes(o.value) ? "checked" : ""} /> ${escapeHtml(o.label)}</label>`
      )
      .join("") || `<p class="hint-note">No matches.</p>`;
  listEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", () => onToggle(cb.value, cb.checked));
  });
}

/* =====================================================================
   VIEW 1 — INTAKE
   ===================================================================== */

const nameInput = document.getElementById("wsc-name");
const bankSelect = document.getElementById("wsc-bank");
const submitBtn = document.getElementById("wsc-submit");
const cancelBtn = document.getElementById("wsc-cancel");
const intakeForm = document.getElementById("wsc-form");
const intakeSubjectChips = document.getElementById("wsc-subject-chips");
const intakeSubjectSearch = document.getElementById("wsc-subject-search");
const intakeSubjectList = document.getElementById("wsc-subject-list");

let intakeSubjects = [];

function populateSelect(select, items) {
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });
}

populateSelect(bankSelect, QUESTION_BANKS);
bankSelect.value = "1";

function renderIntakeSubjects() {
  renderMsChips(intakeSubjectChips, SUBJECT_LEVELS, intakeSubjects, (value) => {
    intakeSubjects = intakeSubjects.filter((v) => v !== value);
    renderIntakeSubjects();
    validateIntake();
  });
  renderMsList(intakeSubjectList, SUBJECT_LEVELS, intakeSubjects, intakeSubjectSearch.value, (value, checked) => {
    intakeSubjects = checked ? [...intakeSubjects, value] : intakeSubjects.filter((v) => v !== value);
    renderIntakeSubjects();
    validateIntake();
  });
}

intakeSubjectSearch.addEventListener("input", renderIntakeSubjects);
renderIntakeSubjects();

// The checklist only appears once the user interacts with the field, and
// stays open while picking multiple items — it closes on an outside click.
intakeSubjectList.hidden = true;
intakeSubjectSearch.addEventListener("focus", () => {
  intakeSubjectList.hidden = false;
});
intakeSubjectSearch.addEventListener("click", () => {
  intakeSubjectList.hidden = false;
});
document.addEventListener("click", (e) => {
  if (!clickIsInside(e, "#wsc-subject-multiselect")) intakeSubjectList.hidden = true;
});

function validateIntake() {
  submitBtn.disabled = !(nameInput.value.trim() && intakeSubjects.length > 0);
}

nameInput.addEventListener("input", validateIntake);

cancelBtn.addEventListener("click", () => {
  intakeForm.reset();
  bankSelect.value = "1";
  intakeSubjects = [];
  renderIntakeSubjects();
  validateIntake();
});

intakeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (submitBtn.disabled) return;

  const subjects = intakeSubjects.map((v) => SUBJECT_LEVELS.find((s) => s.value === v));
  openBuilder(nameInput.value.trim(), subjects);
});

/* =====================================================================
   VIEW 2 — BUILDER
   ===================================================================== */

const ICON_TOGGLE = '<rect x="1" y="6" width="22" height="12" rx="6"></rect><circle cx="8" cy="12" r="3" fill="currentColor" stroke="none"></circle>';
const ICON_BOOK_OPEN =
  '<path d="M2 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"></path><path d="M22 4h-7a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h8z"></path>';
const ICON_X_SQUARE =
  '<rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="m9 9 6 6M15 9l-6 6"></path>';

function svg(paths, cls = "") {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" class="${cls}">${paths}</svg>`;
}

function removeIcon(dataAttr, extraClass = "") {
  return `<span class="remove-x ${extraClass}" ${dataAttr}>${svg(ICON_X_SQUARE)}</span>`;
}

const QUESTION_TYPES = [
  { id: "mcq", label: "MCQ", icon: ICON_TOGGLE },
  { id: "open", label: "Open Ended", icon: ICON_BOOK_OPEN },
  { id: "fitb", label: "FITB", icon: ICON_BOOK_OPEN },
  { id: "dnd", label: "Drag and Drop", icon: ICON_TOGGLE },
  { id: "annotated", label: "Annotated Writing", icon: ICON_TOGGLE }
];

const ANSWER_TYPES = {
  mcq: ["Single Answer", "Multiple Choice", "Dynamic Score"],
  open: [
    "Numbers", "Numbers With Units", "Words (Exact Match)", "Numbers With Words",
    "Long Sentences", "Algebraic", "Free Response", "Audio", "Video", "Image", "Range Of Number"
  ],
  fitb: ["Words (Exact Match)", "Numbers", "Case Insensitive Match"],
  dnd: ["Words to Sentence", "Items to Category", "Items to Image"],
  annotated: ["Annotated Writing", "Voice Recording", "Image", "Video"]
};

const FITB_MODES = [
  { id: "without", label: "Without Option" },
  { id: "with", label: "With Option" },
  { id: "unique", label: "With Unique Option" }
];

const MARKS_MODES = [
  "Marks per Blank",
  "Marks per Question (Admit Partial Marks)",
  "Marks per Question (Zero or Full Marks)",
  "Advanced Marking"
];

const MARKS_VALUES = Array.from({ length: 30 }, (_, i) => String((i + 1) * 0.5).replace(/\.0$/, ""));

// Subject id (prefix of a Subject & Level value, e.g. "2-4" -> "2") to subject family name.
const SUBJECT_FAMILIES = {
  1: "English",
  2: "Maths",
  3: "Science",
  9: "Chinese",
  10: "Pure Chemistry",
  14: "Pure Biology",
  17: "H2 Biology"
};

function subjectFamily(value) {
  return SUBJECT_FAMILIES[value.split("-")[0]] || "General";
}

// Representative sample per subject family (the live product has 300+ curriculum entries per subject).
const TOPIC_POOLS = {
  English: [
    "Word - Level Grammar > Verb > Modal Verb (can/could/must/should/will/would)",
    "Word - Level Grammar > Tenses > Mixed Tenses (Present, Past and Future)",
    "Word - Level Grammar > Pronouns > Possessive Pronouns (my, yours, his, hers, our)",
    "Word - Level Grammar > Nouns > Collective Nouns (flock/team/crew/family)",
    "Word - Level Grammar > Adjectives > Comparative and Superlative Adjectives",
    "Vocabulary > Vocabulary Types > Vocabulary (Synonyms)",
    "Sentence - Level Grammar > Grammar Concepts > Subject Verb Agreement",
    "Sentence - Level Grammar > Synthesis and Transformation Concepts > Active and Passive Voice",
    "Comprehension > Comprehension MCQ and Open-Ended > Comprehension",
    "Cloze Passage > Grammar Cloze > Grammar Cloze",
    "Essay Writing > Composition > Composition",
    "Essay Writing > Situational Writing > Situational Writing"
  ],
  Maths: [
    "Number > Fractions",
    "Number > Decimals",
    "Number > Percentage",
    "Number > Ratio",
    "Measurement > Area and Perimeter",
    "Measurement > Volume",
    "Geometry > Angles",
    "Geometry > Properties of Shapes",
    "Statistics > Average",
    "Statistics > Data Representation",
    "Algebra > Simple Equations",
    "Word Problems > Multi-step Word Problems"
  ],
  Science: [
    "Diversity > Living and Non-living Things",
    "Diversity > Classification of Animals",
    "Cycles > Life Cycles",
    "Cycles > Water Cycle",
    "Systems > Human Digestive System",
    "Systems > Electrical Systems",
    "Interactions > Magnets and Forces",
    "Energy > Light and Shadow",
    "Energy > Heat",
    "Scientific Investigation > Fair Testing"
  ],
  Chinese: [
    "词语 > 近义词",
    "词语 > 反义词",
    "语法 > 句子结构",
    "语法 > 标点符号",
    "阅读理解 > 记叙文",
    "阅读理解 > 说明文",
    "写作 > 看图作文",
    "写作 > 应用文"
  ],
  "Pure Chemistry": [
    "Atomic Structure",
    "Chemical Bonding",
    "Stoichiometry",
    "Acids, Bases and Salts",
    "Redox Reactions",
    "Rate of Reaction",
    "Periodic Table Trends"
  ],
  "Pure Biology": [
    "Cell Structure and Organisation",
    "Nutrition and Digestion",
    "Transport Systems",
    "Reproduction",
    "Genetics and Inheritance",
    "Respiration",
    "Homeostasis"
  ],
  "H2 Biology": [
    "Cell Biology",
    "Biological Molecules",
    "Genetics and Inheritance",
    "Ecology and Conservation",
    "Physiology, Growth and Development",
    "Infectious Disease",
    "Evolution"
  ]
};

function nonEmptyKeys(map) {
  return Object.keys(map).filter((k) => map[k] && map[k].length > 0);
}

function questionSubjectValues(item) {
  return [
    ...new Set([...nonEmptyKeys(item.topicsBySubject), ...nonEmptyKeys(item.tagsBySubject), ...nonEmptyKeys(item.difficultyBySubject)])
  ];
}

function topicPoolForSubjects(subjectValues) {
  const families = [...new Set(subjectValues.map(subjectFamily))];
  const seen = new Set();
  const pool = [];
  families.forEach((fam) => {
    (TOPIC_POOLS[fam] || []).forEach((t) => {
      if (!seen.has(t)) {
        seen.add(t);
        pool.push(t);
      }
    });
  });
  return pool;
}

const TAG_OPTIONS = [
  "Remembering > Recall",
  "Remembering > Recognize",
  "Understanding > Explain",
  "Understanding > Summarize",
  "Applying > Execute",
  "Applying > Implement",
  "Analyzing > Differentiate",
  "Analyzing > Organize",
  "Evaluating > Check",
  "Evaluating > Critique",
  "Creating > Design",
  "Creating > Compose",
  "Creating > Plan"
];

const RUBRIC_OPTIONS = ["PSLE Composition Rubric", "Situational Writing Rubric", "General Writing Rubric"];

const DIFFICULTY_LEVELS = ["Easy", "Normal", "Hard"];

let builderState = null;
let builderBound = false;

function createItem(id, parentId) {
  return {
    id,
    parentId,
    difficultyMode: "shared", // "shared" | "perSubject"
    difficultyShared: ["Easy"], // string[] — used when difficultyMode === "shared"
    difficultyBySubject: {}, // { [subjectValue]: string[] } — used when difficultyMode === "perSubject"
    expandedDifficulty: [], // subject values currently expanded in the per-subject Difficulty accordion
    type: null,
    fitbMode: "without",
    answerType: "",
    marksMode: MARKS_MODES[0],
    topicsBySubject: {}, // { [subjectValue]: string[] of selected topics }
    expandedTopics: [], // subject values currently expanded in the Topic accordion
    tagsBySubject: {}, // { [subjectValue]: string[] of selected strategy tags }
    expandedTags: [], // subject values currently expanded in the Tag accordion
    marks: "1",
    instructionOn: false,
    instructionText: "",
    articleOn: false,
    articleText: "",
    contentHtml: "",
    blocks: [],
    answers: [],
    optionBank: [],
    rubric: "",
    essayExamples: [],
    solutionOn: false,
    solutionText: ""
  };
}

function getItem(id) {
  return builderState.items.find((i) => i.id === id);
}

function getTopLevel() {
  return builderState.items.filter((i) => !i.parentId);
}

function getSubs(parentId) {
  return builderState.items.filter((i) => i.parentId === parentId);
}

function getLabel(item) {
  if (!item.parentId) return "Q" + (getTopLevel().indexOf(item) + 1);
  const parent = getItem(item.parentId);
  const idx = getSubs(item.parentId).indexOf(item);
  return getLabel(parent) + String.fromCharCode(97 + idx);
}

function openBuilder(wsName, subjects) {
  if (!builderState) {
    builderState = {
      wsName,
      subjects, // [{value,label}, ...] — the worksheet's subjects
      items: [createItem("q1", null)],
      activeId: "q1",
      counter: 1,
      reorderMode: false
    };
  } else {
    builderState.wsName = wsName;
    builderState.subjects = subjects;
  }

  document.body.classList.remove("has-view-intake");
  document.body.classList.add("has-view-builder");
  $("#view-intake").hidden = true;
  $("#view-builder").hidden = false;

  $("#wc-ws-name").value = wsName;
  renderTopbarSubjects();

  renderSidebar();
  renderConfigPanel();
  renderContentPanel(getItem(builderState.activeId));

  if (!builderBound) {
    bindBuilderEvents();
    builderBound = true;
  }
}

/* ---------- Worksheet-level subjects (topbar) ---------- */

function renderTopbarSubjects() {
  const values = builderState.subjects.map((s) => s.value);
  $("#wc-subjects-toggle-label").textContent =
    builderState.subjects.length === 0
      ? "Select Subject & Level"
      : builderState.subjects.length === 1
        ? builderState.subjects[0].label
        : `${builderState.subjects.length} subjects selected`;

  renderMsChips($("#wc-subject-chips"), SUBJECT_LEVELS, values, (value) => toggleWorksheetSubject(value, false));
  renderMsList($("#wc-subject-list"), SUBJECT_LEVELS, values, $("#wc-subject-search").value, toggleWorksheetSubject);
}

function toggleWorksheetSubject(value, checked) {
  if (checked) {
    if (!builderState.subjects.some((s) => s.value === value)) {
      builderState.subjects.push(SUBJECT_LEVELS.find((s) => s.value === value));
    }
  } else {
    builderState.subjects = builderState.subjects.filter((s) => s.value !== value);
    // Drop this subject's chosen topics/tags/difficulty (and expanded state) from every question.
    builderState.items.forEach((item) => {
      delete item.topicsBySubject[value];
      item.expandedTopics = item.expandedTopics.filter((v) => v !== value);
      delete item.tagsBySubject[value];
      item.expandedTags = item.expandedTags.filter((v) => v !== value);
      delete item.difficultyBySubject[value];
      item.expandedDifficulty = item.expandedDifficulty.filter((v) => v !== value);
    });
  }
  renderTopbarSubjects();
  renderConfigPanel();
}

/* ---------- Sidebar ---------- */

function renderSidebar() {
  const top = getTopLevel();
  $("#wc-question-list").innerHTML = top
    .map((q) => {
      const subs = getSubs(q.id);
      const arrows = builderState.reorderMode
        ? `<div class="wc-reorder-arrows">
             <button type="button" data-move="up" data-qid="${q.id}">&#9650;</button>
             <button type="button" data-move="down" data-qid="${q.id}">&#9660;</button>
           </div>`
        : "";
      const subList = subs.length
        ? `<div class="wc-sub-list">${subs
            .map(
              (s) =>
                `<div class="wc-sub-card ${s.id === builderState.activeId ? "is-active" : ""}" data-qid="${s.id}">
                   ${getLabel(s)}
                   ${removeIcon(`data-remove-question="${s.id}"`)}
                 </div>`
            )
            .join("")}</div>`
        : "";
      const canDelete = top.length > 1;
      return `
        <div class="wc-question-card ${q.id === builderState.activeId ? "is-active" : ""}" data-qid="${q.id}">
          ${canDelete ? removeIcon(`data-remove-question="${q.id}"`) : ""}
          <div class="wc-question-card-head">
            <h3>${getLabel(q)}</h3>
            ${arrows}
          </div>
          <button type="button" class="wc-add-sub" data-add-sub="${q.id}">${svg('<path d="M12 5v14M5 12h14"></path>')} Add Sub</button>
          ${subList}
        </div>`;
    })
    .join("");
}

function deleteQuestion(qid) {
  const item = getItem(qid);
  if (!item) return;
  const isTop = !item.parentId;
  if (isTop && getTopLevel().length <= 1) return;
  if (!confirm(`Delete ${getLabel(item)}? This cannot be undone.`)) return;

  const idsToRemove = [qid, ...getSubs(qid).map((s) => s.id)];
  builderState.items = builderState.items.filter((i) => !idsToRemove.includes(i.id));

  if (idsToRemove.includes(builderState.activeId)) {
    builderState.activeId = builderState.items.find((i) => !i.parentId).id;
  }
  renderSidebar();
  renderConfigPanel();
  renderContentPanel(getItem(builderState.activeId));
}

function switchQuestion(qid) {
  if (qid === builderState.activeId) return;
  builderState.activeId = qid;
  renderSidebar();
  renderConfigPanel();
  renderContentPanel(getItem(qid));
}

function addQuestion() {
  builderState.counter += 1;
  const id = "q" + builderState.counter;
  builderState.items.push(createItem(id, null));
  switchQuestion(id);
}

function addSub(parentId) {
  const subs = getSubs(parentId);
  const id = parentId + String.fromCharCode(97 + subs.length);
  builderState.items.push(createItem(id, parentId));
  switchQuestion(id);
}

function moveQuestion(qid, dir) {
  const top = getTopLevel();
  const idx = top.indexOf(getItem(qid));
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= top.length) return;
  const a = builderState.items.indexOf(top[idx]);
  const b = builderState.items.indexOf(top[swapIdx]);
  [builderState.items[a], builderState.items[b]] = [builderState.items[b], builderState.items[a]];
  renderSidebar();
}

/* ---------- Config panel (steps 1-5) ---------- */

function renderConfigPanel() {
  const item = getItem(builderState.activeId);
  $("#wc-q-heading").textContent = "Question " + getLabel(item).slice(1);

  $("#wc-qtype-grid").innerHTML = QUESTION_TYPES.map(
    (t) => `<button type="button" class="qtype-btn ${item.type === t.id ? "is-active" : ""}" data-qtype="${t.id}">${svg(t.icon)} ${t.label}</button>`
  ).join("");

  const fitbWrap = $("#wc-fitb-mode");
  if (item.type === "fitb") {
    fitbWrap.hidden = false;
    fitbWrap.innerHTML = FITB_MODES.map(
      (m) => `<button type="button" class="fitb-mode-btn ${item.fitbMode === m.id ? "is-active" : ""}" data-fitb-mode="${m.id}">${m.label}</button>`
    ).join("");
  } else {
    fitbWrap.hidden = true;
    fitbWrap.innerHTML = "";
  }

  const answerSel = $("#wc-answer-type");
  const opts = item.type ? ANSWER_TYPES[item.type] : [];
  answerSel.innerHTML =
    `<option value="" disabled ${item.answerType ? "" : "selected"}>${item.type ? "Select Answer Type" : "Select a Question Type first"}</option>` +
    opts.map((o) => `<option value="${o}" ${item.answerType === o ? "selected" : ""}>${o}</option>`).join("");
  answerSel.disabled = !item.type;

  const marksModeSel = $("#wc-marks-mode");
  if (item.type === "fitb") {
    marksModeSel.hidden = false;
    marksModeSel.innerHTML = MARKS_MODES.map(
      (m) => `<option value="${m}" ${item.marksMode === m ? "selected" : ""}>${m}</option>`
    ).join("");
  } else {
    marksModeSel.hidden = true;
  }

  renderDifficulty(item);
  topicField.render(item);
  tagField.render(item);

  $("#wc-marks").innerHTML = MARKS_VALUES.map(
    (v) => `<option value="${v}" ${item.marks === v ? "selected" : ""}>${v}</option>`
  ).join("");
}

/* ---------- Generic "pick one or more, grouped by subject" field ---------- */
/* Used for Topic, Tag - Sub Strategy, and per-subject Difficulty Level. */

function makeAccordionField({ fieldName, expandedField, chipsElId, searchElId, accordionElId, poolFn }) {
  function renderChips(item) {
    const chipsEl = $(chipsElId);
    const pairs = [];
    Object.entries(item[fieldName]).forEach(([subjVal, values]) => {
      values.forEach((value) => pairs.push({ subjVal, value }));
    });
    chipsEl.innerHTML = pairs
      .map(
        (p) =>
          `<span class="ms-chip">${escapeHtml(p.value)}<button type="button" data-rs="${escapeHtml(p.subjVal)}" data-rv="${escapeHtml(p.value)}">&times;</button></span>`
      )
      .join("");
    chipsEl.querySelectorAll("[data-rv]").forEach((btn) => {
      btn.addEventListener("click", () => toggleValue(item, btn.dataset.rs, btn.dataset.rv, false));
    });
  }

  function toggleValue(item, subjectValue, value, checked) {
    const list = item[fieldName][subjectValue] || [];
    item[fieldName][subjectValue] = checked ? [...list, value] : list.filter((v) => v !== value);
    if (item[fieldName][subjectValue].length === 0) delete item[fieldName][subjectValue];
    renderChips(item);
    renderAccordion(item);
  }

  function toggleGroup(item, subjectValue) {
    item[expandedField] = item[expandedField].includes(subjectValue)
      ? item[expandedField].filter((v) => v !== subjectValue)
      : [...item[expandedField], subjectValue];
    renderAccordion(item);
  }

  function renderAccordion(item) {
    const container = $(accordionElId);
    if (builderState.subjects.length === 0) {
      container.innerHTML = `<p class="hint-note">Add subjects to the worksheet first (top bar).</p>`;
      return;
    }

    const term = searchElId ? $(searchElId).value.trim().toLowerCase() : "";

    container.innerHTML = builderState.subjects
      .map((subj) => {
        const selected = item[fieldName][subj.value] || [];
        const pool = poolFn(subj.value);
        const filtered = term ? pool.filter((v) => v.toLowerCase().includes(term)) : pool;
        const expanded = term ? filtered.length > 0 : item[expandedField].includes(subj.value);

        const rows =
          filtered
            .map(
              (v) =>
                `<label class="ms-item"><input type="checkbox" data-subject="${escapeHtml(subj.value)}" value="${escapeHtml(v)}" ${selected.includes(v) ? "checked" : ""} /> ${escapeHtml(v)}</label>`
            )
            .join("") || `<p class="hint-note">No matches.</p>`;

        return `
          <div class="ms-group ${expanded ? "is-expanded" : ""}">
            <button type="button" class="ms-group-head" data-toggle-group="${escapeHtml(subj.value)}">
              <svg class="ms-group-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>
              <span>${escapeHtml(subj.label)}</span>
              ${selected.length ? `<span class="ms-group-count">${selected.length}</span>` : ""}
            </button>
            <div class="ms-group-body" ${expanded ? "" : "hidden"}>${rows}</div>
          </div>`;
      })
      .join("");

    container.querySelectorAll("[data-toggle-group]").forEach((btn) => {
      btn.addEventListener("click", () => toggleGroup(item, btn.dataset.toggleGroup));
    });
    container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => toggleValue(item, cb.dataset.subject, cb.value, cb.checked));
    });
  }

  function render(item) {
    renderChips(item);
    renderAccordion(item);
  }

  return { render, renderAccordion };
}

const topicField = makeAccordionField({
  fieldName: "topicsBySubject",
  expandedField: "expandedTopics",
  chipsElId: "#wc-q-topics-chips",
  searchElId: "#wc-q-topics-search",
  accordionElId: "#wc-q-topics-accordion",
  poolFn: (subjectValue) => topicPoolForSubjects([subjectValue])
});

const tagField = makeAccordionField({
  fieldName: "tagsBySubject",
  expandedField: "expandedTags",
  chipsElId: "#wc-q-tag-chips",
  searchElId: "#wc-q-tag-search",
  accordionElId: "#wc-q-tag-accordion",
  poolFn: () => TAG_OPTIONS // strategy tags aren't subject-specific, same list under every group
});

const difficultyField = makeAccordionField({
  fieldName: "difficultyBySubject",
  expandedField: "expandedDifficulty",
  chipsElId: "#wc-difficulty-chips",
  searchElId: null,
  accordionElId: "#wc-difficulty-accordion",
  poolFn: () => DIFFICULTY_LEVELS
});

/* ---------- Difficulty Level (Whole Question vs. Per Subject) ---------- */

function renderDifficulty(item) {
  $("#wc-difficulty-mode").querySelectorAll("[data-difficulty-mode]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.difficultyMode === item.difficultyMode);
  });

  const sharedWrap = $("#wc-difficulty-shared");
  const perSubjectWrap = $("#wc-difficulty-persubject-ms");

  if (item.difficultyMode === "perSubject") {
    sharedWrap.hidden = true;
    perSubjectWrap.hidden = false;
    difficultyField.render(item);
  } else {
    sharedWrap.hidden = false;
    perSubjectWrap.hidden = true;
    sharedWrap.querySelectorAll('input[name="difficulty"]').forEach((cb) => {
      cb.checked = item.difficultyShared.includes(cb.value);
    });
  }
}

/* ---------- Content panel (steps 6-8) ---------- */

function renderContentPanel(item) {
  $("#wc-add-instruction").checked = item.instructionOn;
  $("#wc-instruction-wrap").hidden = !item.instructionOn;
  $("#wc-instruction-text").value = item.instructionText;

  $("#wc-add-article").checked = item.articleOn;
  $("#wc-article-wrap").hidden = !item.articleOn;
  $("#wc-article-text").value = item.articleText;

  $("#wc-editor").innerHTML = item.contentHtml || "";
  $("#wc-add-answer-btn").hidden = !(item.type === "fitb" || item.type === "dnd");

  renderBlocks(item);
  renderAnswerSection(item);

  $("#wc-add-solution").checked = item.solutionOn;
  $("#wc-solution-wrap").hidden = !item.solutionOn;
  $("#wc-solution-text").value = item.solutionText;
}

function renderBlocks(item) {
  $("#wc-blocks").innerHTML = item.blocks
    .map(
      (b) =>
        `<div class="wc-block-item" data-bid="${b.id}">
           <textarea data-field="text" placeholder="Additional text block">${escapeHtml(b.text)}</textarea>
           <button type="button" class="del-btn" data-del-block="${b.id}">&times;</button>
         </div>`
    )
    .join("");
}

function renderAnswerSection(item) {
  const wrap = $("#wc-answer-section");
  if (!item.type) {
    wrap.innerHTML = `<h4 class="step-h"><span class="step-no">7</span>Answer</h4><p class="hint-note">Choose a question type above to configure answers.</p>`;
    $("#wc-add-answer-btn").hidden = true;
    return;
  }
  if (item.type === "mcq") {
    wrap.innerHTML = mcqAnswerHtml(item);
    $("#wc-add-answer-btn").hidden = true;
  } else if (item.type === "open") {
    wrap.innerHTML = openAnswerHtml(item);
    $("#wc-add-answer-btn").hidden = true;
  } else if (item.type === "fitb" || item.type === "dnd") {
    wrap.innerHTML = blankAnswerHtml(item);
    $("#wc-add-answer-btn").hidden = false;
  } else if (item.type === "annotated") {
    wrap.innerHTML = essayHtml(item);
    $("#wc-add-answer-btn").hidden = true;
  }
}

function mcqAnswerHtml(item) {
  const multi = item.answerType === "Multiple Choice" || item.answerType === "Dynamic Score";
  const rows = item.answers
    .map(
      (a) => `
      <div class="answer-row" data-aid="${a.id}">
        <div class="answer-input-wrap">
          <input type="text" value="${escapeHtml(a.text)}" placeholder="Please input answer" data-field="text" />
          ${removeIcon(`data-del-answer="${a.id}"`, "in-input")}
        </div>
        <label class="correct-label">
          <input type="${multi ? "checkbox" : "radio"}" name="mcq-correct-${item.id}" ${a.correct ? "checked" : ""} data-field="correct" />
          Correct Answer
        </label>
      </div>`
    )
    .join("");
  return `
    <h4 class="step-h"><span class="step-no">7</span>Answer</h4>
    <div class="answer-type-tabs">
      <button type="button" class="answer-type-tab is-active">Text</button>
      <button type="button" class="answer-type-tab is-soon" data-soon="Math Text answers">Math Text</button>
      <button type="button" class="answer-type-tab is-soon" data-soon="Image answers">Image</button>
    </div>
    <div class="answer-list">${rows || '<p class="hint-note">No answer options yet.</p>'}</div>
    <button type="button" class="answer-add-btn" style="margin-top:12px" id="wc-answer-add">+ Add Answer</button>`;
}

function openAnswerHtml(item) {
  const mediaTypes = ["Audio", "Video", "Image", "Free Response"];
  if (mediaTypes.includes(item.answerType)) {
    return `<h4 class="step-h"><span class="step-no">7</span>Answer</h4>
      <p class="wc-media-note">Learners will submit a ${item.answerType.toLowerCase()} response for this question — no fixed answer needed.</p>`;
  }
  const rows = item.answers
    .map(
      (a) => `
      <div class="answer-row" data-aid="${a.id}">
        <div class="answer-input-wrap">
          <input type="text" value="${escapeHtml(a.text)}" placeholder="Acceptable answer" data-field="text" />
          ${removeIcon(`data-del-answer="${a.id}"`, "in-input")}
        </div>
      </div>`
    )
    .join("");
  return `
    <h4 class="step-h"><span class="step-no">7</span>Answer</h4>
    <p class="hint-note">List every response that should be marked correct${item.answerType ? ` (matched as ${item.answerType})` : ""}.</p>
    <div class="answer-list">${rows || '<p class="hint-note">No acceptable answers yet.</p>'}</div>
    <button type="button" class="answer-add-btn" style="margin-top:12px" id="wc-answer-add">+ Add Answer</button>`;
}

function blankAnswerHtml(item) {
  const rows = item.answers
    .map(
      (a, i) => `
      <div class="answer-row" data-aid="${a.id}">
        <span class="correct-label">${i + 1}.</span>
        <div class="answer-input-wrap">
          <input type="text" value="${escapeHtml(a.text)}" placeholder="Blank answer" data-field="text" />
          ${removeIcon(`data-del-answer="${a.id}"`, "in-input")}
        </div>
      </div>`
    )
    .join("");

  let optionBankHtml = "";
  if (item.fitbMode !== "without") {
    const chips = item.optionBank
      .map((o) => `<span class="option-chip">${escapeHtml(o.text)}<button type="button" data-del-option="${o.id}">&times;</button></span>`)
      .join("");
    optionBankHtml = `
      <div class="option-bank">
        <h5>Option Bank ${item.fitbMode === "unique" ? "(each option used once)" : "(distractor words shown to learners)"}</h5>
        <div class="option-chips">${chips || '<span class="hint-note">No extra options yet.</span>'}</div>
        <div class="answer-row">
          <input type="text" id="wc-option-input" placeholder="Add a distractor option" />
          <button type="button" class="answer-add-btn" id="wc-option-add">+ Add</button>
        </div>
      </div>`;
  }

  return `
    <h4 class="step-h"><span class="step-no">7</span>Answer</h4>
    <p class="hint-note">Type the full sentence above, select the answer text, then click "+ Add Answer" in the toolbar to mark it as a blank.</p>
    <div class="answer-list">${rows || '<p class="hint-note">No blanks marked yet.</p>'}</div>
    ${optionBankHtml}`;
}

function essayHtml(item) {
  const examples = item.essayExamples
    .map(
      (e) => `
      <div class="essay-example" data-eid="${e.id}">
        <input type="text" value="${escapeHtml(e.title)}" placeholder="Example title" data-field="title" />
        <textarea data-field="text" placeholder="Example essay text">${escapeHtml(e.text)}</textarea>
        <button type="button" class="del-btn" data-del-example="${e.id}">&times;</button>
      </div>`
    )
    .join("");
  return `
    <h4 class="step-h"><span class="step-no">7</span>Essay Example</h4>
    <label class="field-label">Select Rubric</label>
    <select id="wc-rubric-select" class="wc-select">
      <option value="" ${item.rubric ? "" : "selected"} disabled>&mdash; Select Rubric &mdash;</option>
      ${RUBRIC_OPTIONS.map((r) => `<option value="${r}" ${item.rubric === r ? "selected" : ""}>${r}</option>`).join("")}
    </select>
    <p class="essay-count" style="margin-top:14px">${item.essayExamples.length} example${item.essayExamples.length === 1 ? "" : "s"} added</p>
    <div class="essay-examples">${examples || '<p class="hint-note">No examples yet</p>'}</div>
    <button type="button" class="answer-add-btn" id="wc-essay-add" style="margin-top:12px" ${item.rubric ? "" : "disabled"}>+ Add Example</button>
    ${item.rubric ? "" : '<p class="rubric-note">*Select rubric first</p>'}`;
}

/* ---------- Events ---------- */

function bindBuilderEvents() {
  $("#wc-add-question-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    $("#wc-add-question-menu").hidden = !$("#wc-add-question-menu").hidden;
  });
  $("#wc-add-question-menu").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-action]");
    if (!btn) return;
    $("#wc-add-question-menu").hidden = true;
    const action = btn.dataset.addAction;
    if (action === "new") addQuestion();
    else showToast(`${btn.textContent.trim()} — coming soon.`);
  });

  $("#wc-subjects-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    $("#wc-subjects-panel").hidden = !$("#wc-subjects-panel").hidden;
  });
  $("#wc-subject-search").addEventListener("input", renderTopbarSubjects);

  document.addEventListener("click", (e) => {
    if (!clickIsInside(e, ".dropdown-wrap")) {
      $("#wc-add-question-menu").hidden = true;
      $("#wc-subjects-panel").hidden = true;
    }
  });

  $("#wc-question-list").addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove-question]");
    if (removeBtn) return deleteQuestion(removeBtn.dataset.removeQuestion);
    const addSubBtn = e.target.closest("[data-add-sub]");
    if (addSubBtn) return addSub(addSubBtn.dataset.addSub);
    const moveBtn = e.target.closest("[data-move]");
    if (moveBtn) return moveQuestion(moveBtn.dataset.qid, moveBtn.dataset.move);
    const card = e.target.closest("[data-qid]");
    if (card) switchQuestion(card.dataset.qid);
  });

  $("#wc-reorder-toggle").addEventListener("click", () => {
    builderState.reorderMode = !builderState.reorderMode;
    renderSidebar();
  });

  $("#wc-difficulty-mode").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-difficulty-mode]");
    if (!btn) return;
    const item = getItem(builderState.activeId);
    item.difficultyMode = btn.dataset.difficultyMode;
    renderDifficulty(item);
  });

  $("#wc-difficulty-shared").addEventListener("change", (e) => {
    if (e.target.name !== "difficulty") return;
    const item = getItem(builderState.activeId);
    item.difficultyShared = e.target.checked
      ? [...item.difficultyShared, e.target.value]
      : item.difficultyShared.filter((v) => v !== e.target.value);
  });

  $("#wc-qtype-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qtype]");
    if (!btn) return;
    const item = getItem(builderState.activeId);
    const newType = btn.dataset.qtype;
    if (newType === item.type) return;
    const hasContent = (item.contentHtml && item.contentHtml.trim()) || item.answers.length || item.essayExamples.length;
    if (hasContent && !confirm("Switching question type will clear this question's content. Continue?")) return;
    item.type = newType;
    item.answerType = "";
    item.fitbMode = "without";
    item.contentHtml = "";
    item.answers = [];
    item.optionBank = [];
    item.blocks = [];
    item.essayExamples = [];
    item.rubric = "";
    renderConfigPanel();
    renderContentPanel(item);
  });

  $("#wc-fitb-mode").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fitb-mode]");
    if (!btn) return;
    const item = getItem(builderState.activeId);
    item.fitbMode = btn.dataset.fitbMode;
    renderConfigPanel();
    renderAnswerSection(item);
  });

  $("#wc-answer-type").addEventListener("change", (e) => {
    const item = getItem(builderState.activeId);
    item.answerType = e.target.value;
    renderAnswerSection(item);
  });

  $("#wc-marks-mode").addEventListener("change", (e) => {
    getItem(builderState.activeId).marksMode = e.target.value;
  });

  $("#wc-q-topics-search").addEventListener("input", () => {
    topicField.renderAccordion(getItem(builderState.activeId));
  });
  $("#wc-q-tag-search").addEventListener("input", () => {
    tagField.renderAccordion(getItem(builderState.activeId));
  });

  // Each accordion only appears once the user interacts with its field, and
  // stays open while picking values — it closes on an outside click.
  bindClickToOpenAccordion("#wc-q-topics-search", "#wc-q-topics-accordion", "#wc-q-topics-ms");
  bindClickToOpenAccordion("#wc-q-tag-search", "#wc-q-tag-accordion", "#wc-q-tag-ms");

  $("#wc-marks").addEventListener("change", (e) => {
    getItem(builderState.activeId).marks = e.target.value;
  });

  $("#wc-add-instruction").addEventListener("change", (e) => {
    const item = getItem(builderState.activeId);
    item.instructionOn = e.target.checked;
    $("#wc-instruction-wrap").hidden = !item.instructionOn;
  });
  $("#wc-instruction-text").addEventListener("input", (e) => {
    getItem(builderState.activeId).instructionText = e.target.value;
  });
  $("#wc-add-article").addEventListener("change", (e) => {
    const item = getItem(builderState.activeId);
    item.articleOn = e.target.checked;
    $("#wc-article-wrap").hidden = !item.articleOn;
  });
  $("#wc-article-text").addEventListener("input", (e) => {
    getItem(builderState.activeId).articleText = e.target.value;
  });

  $("#wc-rte-toolbar").addEventListener("click", (e) => {
    const soonBtn = e.target.closest("[data-soon]");
    if (soonBtn) return showToast(`${soonBtn.dataset.soon} — coming soon.`);
    const cmdBtn = e.target.closest("[data-cmd]");
    if (cmdBtn) {
      const editor = $("#wc-editor");
      editor.focus();
      document.execCommand(cmdBtn.dataset.cmd, false, null);
      getItem(builderState.activeId).contentHtml = editor.innerHTML;
    }
  });

  $("#wc-editor").addEventListener("input", () => {
    getItem(builderState.activeId).contentHtml = $("#wc-editor").innerHTML;
  });

  $("#wc-add-answer-btn").addEventListener("click", onAddBlankAnswer);

  $("#wc-add-block").addEventListener("click", () => {
    const item = getItem(builderState.activeId);
    item.blocks.push({ id: "b" + Date.now(), text: "" });
    renderBlocks(item);
  });
  $("#wc-blocks").addEventListener("click", (e) => {
    const del = e.target.closest("[data-del-block]");
    if (!del) return;
    const item = getItem(builderState.activeId);
    item.blocks = item.blocks.filter((b) => b.id !== del.dataset.delBlock);
    renderBlocks(item);
  });
  $("#wc-blocks").addEventListener("input", (e) => {
    const wrap = e.target.closest("[data-bid]");
    if (!wrap) return;
    const item = getItem(builderState.activeId);
    const b = item.blocks.find((x) => x.id === wrap.dataset.bid);
    if (b) b.text = e.target.value;
  });

  $("#wc-answer-section").addEventListener("click", onAnswerSectionClick);
  $("#wc-answer-section").addEventListener("change", onAnswerSectionChange);
  $("#wc-answer-section").addEventListener("input", onAnswerSectionInput);

  $("#wc-add-solution").addEventListener("change", (e) => {
    const item = getItem(builderState.activeId);
    item.solutionOn = e.target.checked;
    $("#wc-solution-wrap").hidden = !item.solutionOn;
  });
  $("#wc-solution-text").addEventListener("input", (e) => {
    getItem(builderState.activeId).solutionText = e.target.value;
  });

  $("#wc-ws-name").addEventListener("input", (e) => {
    builderState.wsName = e.target.value;
  });

  $("#wc-preview").addEventListener("click", openPreview);
  $("#wc-preview-close").addEventListener("click", closePreview);
  $("#wc-preview-modal").addEventListener("click", (e) => {
    if (e.target.id === "wc-preview-modal") closePreview();
  });

  $("#wc-save-draft").addEventListener("click", () => showToast("Worksheet saved as draft."));
  $("#wc-draft-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    const menu = $("#wc-draft-menu");
    menu.hidden = !menu.hidden;
  });
  $("#wc-draft-menu").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-draft-action]");
    if (!btn) return;
    $("#wc-draft-menu").hidden = true;
    showToast(btn.dataset.draftAction === "worksheet" ? "Worksheet saved as draft." : "Question saved as draft.");
  });
  document.addEventListener("click", (e) => {
    if (!clickIsInside(e, ".btn-split")) $("#wc-draft-menu").hidden = true;
  });

  $("#wc-finish").addEventListener("click", () => {
    showToast(`Worksheet finished — ${getTopLevel().length} question(s) saved.`);
  });

  $("[data-builder-back]").addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.add("has-view-intake");
    document.body.classList.remove("has-view-builder");
    $("#view-builder").hidden = true;
    $("#view-intake").hidden = false;
  });
}

function onAddBlankAnswer() {
  const item = getItem(builderState.activeId);
  const editor = $("#wc-editor");
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) {
    alert("Select the answer text inside the question first.");
    return;
  }
  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) {
    alert("Select text inside the question content box.");
    return;
  }
  const text = range.toString().trim();
  if (!text) return;

  const blankId = "b" + Date.now() + Math.floor(Math.random() * 1000);
  const span = document.createElement("span");
  span.className = "blank-chip";
  span.setAttribute("contenteditable", "false");
  span.dataset.blankId = blankId;
  span.textContent = text;

  range.deleteContents();
  range.insertNode(span);

  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);

  item.contentHtml = editor.innerHTML;
  item.answers.push({ id: blankId, text });
  renderAnswerSection(item);
}

function onAnswerSectionClick(e) {
  const item = getItem(builderState.activeId);

  if (e.target.closest("#wc-answer-add")) {
    item.answers.push({ id: "a" + Date.now(), text: "", correct: false });
    return renderAnswerSection(item);
  }

  const delAnswer = e.target.closest("[data-del-answer]");
  if (delAnswer) {
    const aid = delAnswer.dataset.delAnswer;
    if (item.type === "fitb" || item.type === "dnd") {
      const chip = $("#wc-editor").querySelector(`[data-blank-id="${aid}"]`);
      if (chip) {
        chip.replaceWith(document.createTextNode(chip.textContent));
        item.contentHtml = $("#wc-editor").innerHTML;
      }
    }
    item.answers = item.answers.filter((a) => a.id !== aid);
    return renderAnswerSection(item);
  }

  const soonTab = e.target.closest(".answer-type-tab.is-soon");
  if (soonTab) return showToast(`${soonTab.dataset.soon} — coming soon.`);

  if (e.target.closest("#wc-option-add")) {
    const input = $("#wc-option-input");
    const val = input.value.trim();
    if (val) {
      item.optionBank.push({ id: "o" + Date.now(), text: val });
      renderAnswerSection(item);
    }
    return;
  }

  const delOpt = e.target.closest("[data-del-option]");
  if (delOpt) {
    item.optionBank = item.optionBank.filter((o) => o.id !== delOpt.dataset.delOption);
    return renderAnswerSection(item);
  }

  const essayAdd = e.target.closest("#wc-essay-add");
  if (essayAdd && !essayAdd.disabled) {
    item.essayExamples.push({ id: "e" + Date.now(), title: `Example ${item.essayExamples.length + 1}`, text: "" });
    return renderAnswerSection(item);
  }

  const delExample = e.target.closest("[data-del-example]");
  if (delExample) {
    item.essayExamples = item.essayExamples.filter((x) => x.id !== delExample.dataset.delExample);
    return renderAnswerSection(item);
  }
}

function onAnswerSectionChange(e) {
  const item = getItem(builderState.activeId);

  if (e.target.id === "wc-rubric-select") {
    item.rubric = e.target.value;
    return renderAnswerSection(item);
  }

  const row = e.target.closest("[data-aid]");
  if (row && e.target.dataset.field === "correct") {
    const multi = item.answerType === "Multiple Choice" || item.answerType === "Dynamic Score";
    if (!multi) item.answers.forEach((a) => (a.correct = a.id === row.dataset.aid ? e.target.checked : false));
    else {
      const a = item.answers.find((x) => x.id === row.dataset.aid);
      if (a) a.correct = e.target.checked;
    }
  }
}

function onAnswerSectionInput(e) {
  const item = getItem(builderState.activeId);

  const row = e.target.closest("[data-aid]");
  if (row) {
    const a = item.answers.find((x) => x.id === row.dataset.aid);
    if (a && e.target.dataset.field === "text") a.text = e.target.value;
    return;
  }

  const ex = e.target.closest("[data-eid]");
  if (ex) {
    const example = item.essayExamples.find((x) => x.id === ex.dataset.eid);
    if (example) {
      if (e.target.dataset.field === "title") example.title = e.target.value;
      else if (e.target.dataset.field === "text") example.text = e.target.value;
    }
  }
}

/* ---------- Preview ---------- */

function openPreview() {
  const item = getItem(builderState.activeId);
  const typeLabel = QUESTION_TYPES.find((t) => t.id === item.type)?.label || "No type selected";
  let answerHtml = "";

  if (item.type === "mcq") {
    answerHtml = `<ul>${item.answers.map((a) => `<li class="${a.correct ? "is-correct" : ""}">${escapeHtml(a.text || "(empty)")}</li>`).join("")}</ul>`;
  } else if (item.type === "open") {
    answerHtml = item.answers.length
      ? `<ul>${item.answers.map((a) => `<li>${escapeHtml(a.text || "(empty)")}</li>`).join("")}</ul>`
      : `<p class="hint-note">${item.answerType ? "Free-form response — no fixed answer." : "No answers configured."}</p>`;
  } else if (item.type === "fitb" || item.type === "dnd") {
    answerHtml = `<ul>${item.answers.map((a, i) => `<li class="is-correct">Blank ${i + 1}: ${escapeHtml(a.text)}</li>`).join("")}</ul>`;
  } else if (item.type === "annotated") {
    answerHtml = `<p class="hint-note">Rubric: ${item.rubric || "not selected"} &middot; ${item.essayExamples.length} example(s)</p>`;
  }

  const subjectLabels = questionSubjectValues(item)
    .map((v) => builderState.subjects.find((s) => s.value === v)?.label || v)
    .join(", ");
  const allTopics = Object.values(item.topicsBySubject).flat();
  const allTags = Object.values(item.tagsBySubject).flat();
  const difficultyLabel =
    item.difficultyMode === "perSubject"
      ? Object.entries(item.difficultyBySubject)
          .map(([v, levels]) => `${builderState.subjects.find((s) => s.value === v)?.label || v}: ${levels.join("/")}`)
          .join(", ") || "none"
      : item.difficultyShared.join(", ") || "none";

  $("#wc-preview-body").innerHTML = `
    <div class="preview-meta">
      <span>${getLabel(item)}</span>
      <span>${typeLabel}</span>
      <span>Difficulty: ${escapeHtml(difficultyLabel)}</span>
      <span>Marks: ${item.marks}</span>
    </div>
    <p class="hint-note">Subjects: ${subjectLabels || "none"} &middot; Topics: ${allTopics.length ? escapeHtml(allTopics.join(", ")) : "none"} &middot; Tags: ${allTags.length ? escapeHtml(allTags.join(", ")) : "none"}</p>
    ${item.instructionOn && item.instructionText ? `<h4>Instruction</h4><div class="preview-content">${escapeHtml(item.instructionText)}</div>` : ""}
    ${item.articleOn && item.articleText ? `<h4>Article</h4><div class="preview-content">${escapeHtml(item.articleText)}</div>` : ""}
    <h4>Question</h4>
    <div class="preview-content">${item.contentHtml || '<em style="color:#b0b0b0">(empty)</em>'}</div>
    <h4>Answer</h4>
    ${answerHtml || '<p class="hint-note">Not configured yet.</p>'}
    ${item.solutionOn && item.solutionText ? `<h4>Solution</h4><div class="preview-content">${escapeHtml(item.solutionText)}</div>` : ""}
  `;
  $("#wc-preview-modal").hidden = false;
}

function closePreview() {
  $("#wc-preview-modal").hidden = true;
}

/* ---------- Toast ---------- */

let toastTimer = null;
function showToast(message) {
  const toast = $("#wc-toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}
