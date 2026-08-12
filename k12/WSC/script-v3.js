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
const subjectSelect = document.getElementById("wsc-subject");
const submitBtn = document.getElementById("wsc-submit");
const cancelBtn = document.getElementById("wsc-cancel");
const intakeForm = document.getElementById("wsc-form");

function populateSelect(select, items) {
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });
}

populateSelect(bankSelect, QUESTION_BANKS);
populateSelect(subjectSelect, SUBJECT_LEVELS);
bankSelect.value = "1";

function validateIntake() {
  submitBtn.disabled = !(nameInput.value.trim() && subjectSelect.value);
}

nameInput.addEventListener("input", validateIntake);
subjectSelect.addEventListener("change", validateIntake);

cancelBtn.addEventListener("click", () => {
  intakeForm.reset();
  bankSelect.value = "1";
  validateIntake();
});

intakeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (submitBtn.disabled) return;
  openBuilder(nameInput.value.trim(), subjectSelect.value);
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

// Every family in our sample data sits at exactly one tier, so the tier can be baked
// into the family's display label (matches how the reference UI labels its dropdown).
const SUBJECT_FAMILY_OPTIONS = [
  { value: "English", label: "Primary English" },
  { value: "Maths", label: "Primary Maths" },
  { value: "Science", label: "Primary Science" },
  { value: "Chinese", label: "Primary Chinese" },
  { value: "Pure Chemistry", label: "Secondary Pure Chemistry" },
  { value: "Pure Biology", label: "Secondary Pure Biology" },
  { value: "H2 Biology", label: "JC H2 Biology" }
];

function familyLabel(family) {
  return SUBJECT_FAMILY_OPTIONS.find((f) => f.value === family)?.label || family;
}

// { [family]: [{ value, label }] } — level label with the family/tier stripped off,
// e.g. "Primary 4 Maths" -> { value: "2-4", label: "Primary 4" }.
const LEVELS_BY_FAMILY = {};
SUBJECT_LEVELS.forEach((s) => {
  const fam = subjectFamily(s.value);
  const label = s.label.replace(fam, "").replace("Junior College", "").trim();
  (LEVELS_BY_FAMILY[fam] || (LEVELS_BY_FAMILY[fam] = [])).push({ value: s.value, label });
});

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

function questionSubjectValues(item) {
  return item.subjectRows.filter((r) => r.family && r.levels.length).flatMap((r) => r.levels);
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

function createItem(id, parentId, defaultSubjectValue) {
  const seedRow = { id: "row" + Math.random().toString(36).slice(2), family: "", levels: [] };
  if (defaultSubjectValue) {
    seedRow.family = subjectFamily(defaultSubjectValue);
    seedRow.levels = [defaultSubjectValue];
  }
  return {
    id,
    parentId,
    // Subject & Level is picked per question now: one row per subject family,
    // each row carrying whichever levels of that family apply to this question.
    // Row 1 is pre-seeded from whatever subject was chosen at intake.
    subjectRows: [seedRow],
    // Difficulty/Topic/Tag are tagged per specific level (e.g. "Primary 1 Maths" and
    // "Primary 2 Maths" under the same row are independent), not per subject row.
    difficultyByLevel: {}, // { [levelValue]: string } — single choice per level
    topicByLevel: {}, // { [levelValue]: string[] }
    tagByLevel: {}, // { [levelValue]: string[] }
    type: null,
    fitbMode: "without",
    answerType: "",
    marksMode: MARKS_MODES[0],
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

function openBuilder(wsName, subjectValue) {
  if (!builderState) {
    builderState = {
      wsName,
      defaultSubjectValue: subjectValue, // what was picked at intake — auto-seeds each new question's row 1
      subjects: subjectValue ? [SUBJECT_LEVELS.find((s) => s.value === subjectValue)] : [], // top bar picker (independent of per-question rows)
      items: [createItem("q1", null, subjectValue)],
      activeId: "q1",
      counter: 1,
      reorderMode: false
    };
  } else {
    builderState.wsName = wsName;
    builderState.defaultSubjectValue = subjectValue;
    builderState.subjects = subjectValue ? [SUBJECT_LEVELS.find((s) => s.value === subjectValue)] : [];
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

// NOTE (v3): Subject & Level now lives per-question (step 1's rows below), so this
// worksheet-level top bar picker no longer feeds any per-question state — it's kept
// as-is only because the reference layout didn't address the top bar.
function toggleWorksheetSubject(value, checked) {
  if (checked) {
    if (!builderState.subjects.some((s) => s.value === value)) {
      builderState.subjects.push(SUBJECT_LEVELS.find((s) => s.value === value));
    }
  } else {
    builderState.subjects = builderState.subjects.filter((s) => s.value !== value);
  }
  renderTopbarSubjects();
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
  builderState.items.push(createItem(id, null, builderState.defaultSubjectValue));
  switchQuestion(id);
}

function addSub(parentId) {
  const subs = getSubs(parentId);
  const id = parentId + String.fromCharCode(97 + subs.length);
  builderState.items.push(createItem(id, parentId, builderState.defaultSubjectValue));
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

  renderSubjectRows(item);
  renderDifficultyRows(item);
  renderTopicTagRows(item);

  $("#wc-marks").innerHTML = MARKS_VALUES.map(
    (v) => `<option value="${v}" ${item.marks === v ? "selected" : ""}>${v}</option>`
  ).join("");
}

const ICON_TRASH = '<path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M10 11v6M14 11v6"></path>';

/* ---------- Step 1: Subject & Level (one row per subject family) ---------- */

function addSubjectRow(item) {
  item.subjectRows.push({ id: "row" + Date.now() + Math.floor(Math.random() * 1000), family: "", levels: [] });
  renderSubjectRows(item);
}

function forgetLevel(item, levelValue) {
  delete item.difficultyByLevel[levelValue];
  delete item.topicByLevel[levelValue];
  delete item.tagByLevel[levelValue];
}

function removeSubjectRow(item, rowId) {
  if (item.subjectRows.length <= 1) return; // always keep at least one row to configure
  const row = item.subjectRows.find((r) => r.id === rowId);
  row.levels.forEach((lv) => forgetLevel(item, lv));
  item.subjectRows = item.subjectRows.filter((r) => r.id !== rowId);
  renderSubjectRows(item);
  renderDifficultyRows(item);
  renderTopicTagRows(item);
}

function setRowFamily(item, rowId, family) {
  const row = item.subjectRows.find((r) => r.id === rowId);
  row.levels.forEach((lv) => forgetLevel(item, lv));
  row.family = family;
  row.levels = [];
  renderSubjectRows(item);
  renderDifficultyRows(item);
  renderTopicTagRows(item);
}

function toggleRowLevel(item, rowId, levelValue, checked) {
  const row = item.subjectRows.find((r) => r.id === rowId);
  row.levels = checked ? [...row.levels, levelValue] : row.levels.filter((v) => v !== levelValue);
  if (!checked) forgetLevel(item, levelValue);
  renderSubjectRows(item);
  renderDifficultyRows(item); // both show one group per level, so they need to stay in sync
  renderTopicTagRows(item);
  // renderSubjectRows rebuilds every row's panel as hidden — reopen this one so
  // picking several levels in a row doesn't require re-clicking each time.
  const panel = $("#wc-subject-rows").querySelector(`[data-row-levels-panel="${rowId}"]`);
  if (panel) panel.hidden = false;
}

function renderSubjectRows(item) {
  const container = $("#wc-subject-rows");
  container.innerHTML = item.subjectRows
    .map((row) => {
      const levelOptions = row.family ? LEVELS_BY_FAMILY[row.family] || [] : [];
      const chips = row.levels
        .map((lv) => {
          const opt = levelOptions.find((o) => o.value === lv);
          return `<span class="ms-chip">${escapeHtml(opt ? opt.label : lv)}<button type="button" data-row-remove-level="${row.id}" data-level="${escapeHtml(lv)}">&times;</button></span>`;
        })
        .join("");
      const usedByOtherRows = item.subjectRows.filter((r) => r.id !== row.id).map((r) => r.family);
      return `
        <div class="subject-row" data-row-id="${row.id}">
          <div class="subject-row-controls">
            <select class="wc-select" data-row-family-select="${row.id}">
              <option value="">Select Subject</option>
              ${SUBJECT_FAMILY_OPTIONS.map(
                (f) =>
                  `<option value="${f.value}" ${row.family === f.value ? "selected" : ""} ${usedByOtherRows.includes(f.value) ? "disabled" : ""}>${f.label}${usedByOtherRows.includes(f.value) ? " (already added)" : ""}</option>`
              ).join("")}
            </select>
            ${item.subjectRows.length > 1 ? `<button type="button" class="del-row-btn" data-row-delete="${row.id}" title="Remove">${svg(ICON_TRASH)}</button>` : ""}
          </div>
          <div class="subject-row-levels ${row.family ? "" : "is-disabled"}" data-row-levels-toggle="${row.id}">
            <div class="ms-chips">${chips || (row.family ? '<span class="hint-note">Click to pick a level</span>' : '<span class="hint-note">Select a subject first</span>')}</div>
          </div>
          <div class="dropdown-panel multiselect" data-row-levels-panel="${row.id}" hidden>
            <div class="ms-list">
              ${levelOptions.map((o) => `<label class="ms-item"><input type="checkbox" data-row-level-cb="${row.id}" value="${escapeHtml(o.value)}" ${row.levels.includes(o.value) ? "checked" : ""} /> ${escapeHtml(o.label)}</label>`).join("")}
            </div>
          </div>
        </div>`;
    })
    .join("");

  container.querySelectorAll("[data-row-family-select]").forEach((sel) => {
    sel.addEventListener("change", (e) => setRowFamily(item, sel.dataset.rowFamilySelect, e.target.value));
  });
  container.querySelectorAll("[data-row-delete]").forEach((btn) => {
    btn.addEventListener("click", () => removeSubjectRow(item, btn.dataset.rowDelete));
  });
  container.querySelectorAll("[data-row-remove-level]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleRowLevel(item, btn.dataset.rowRemoveLevel, btn.dataset.level, false);
    });
  });
  container.querySelectorAll("[data-row-levels-toggle]").forEach((box) => {
    box.addEventListener("click", () => {
      const rowId = box.dataset.rowLevelsToggle;
      const row = item.subjectRows.find((r) => r.id === rowId);
      if (!row.family) return;
      const panel = container.querySelector(`[data-row-levels-panel="${rowId}"]`);
      const wasHidden = panel.hidden;
      container.querySelectorAll("[data-row-levels-panel]").forEach((p) => (p.hidden = true));
      panel.hidden = !wasHidden;
    });
  });
  container.querySelectorAll("[data-row-level-cb]").forEach((cb) => {
    cb.addEventListener("change", () => toggleRowLevel(item, cb.dataset.rowLevelCb, cb.value, cb.checked));
  });
}

/* ---------- Shared: flatten subject rows into individual levels ---------- */
/* Difficulty/Topic/Tag are all tagged per specific level, not per subject row —
   "Primary 1 Maths" and "Primary 2 Maths" under one row are independent. */

// Subject (family) and Level are separate ids in the data model, so a level's display
// label is built as "{family label} ({level label})" — e.g. "Primary Science (Primary 2)" —
// rather than reusing SUBJECT_LEVELS' flat "Primary 2 Science" string, which conflates them.
function levelDisplayLabel(family, levelValue) {
  const levelOnly = (LEVELS_BY_FAMILY[family] || []).find((o) => o.value === levelValue)?.label || levelValue;
  return `${familyLabel(family)} (${levelOnly})`;
}

function activeLevelEntries(item) {
  const entries = [];
  item.subjectRows
    .filter((r) => r.family)
    .forEach((row) => {
      row.levels.forEach((lv) => {
        entries.push({ levelValue: lv, family: row.family, label: levelDisplayLabel(row.family, lv) });
      });
    });
  return entries;
}

/* ---------- Step 2: Difficulty Level — one Easy/Normal/Hard choice per level ---------- */

function renderDifficultyRows(item) {
  const container = $("#wc-difficulty-rows");
  const entries = activeLevelEntries(item);
  if (entries.length === 0) {
    container.innerHTML = `<p class="hint-note">Pick a subject &amp; level in step 1 first.</p>`;
    return;
  }
  container.innerHTML = entries
    .map(({ levelValue, label }) => {
      const selected = item.difficultyByLevel[levelValue] || "";
      return `
        <div class="difficulty-row-group">
          <strong>${escapeHtml(label)}</strong>
          <div class="wc-difficulty">
            ${DIFFICULTY_LEVELS.map(
              (lvl) =>
                `<label class="opt-label"><input type="radio" name="diff-${escapeHtml(levelValue)}" data-diff-level="${escapeHtml(levelValue)}" value="${lvl}" ${selected === lvl ? "checked" : ""} /> ${lvl}</label>`
            ).join("")}
          </div>
        </div>`;
    })
    .join("");

  container.querySelectorAll("[data-diff-level]").forEach((radio) => {
    radio.addEventListener("change", () => {
      item.difficultyByLevel[radio.dataset.diffLevel] = radio.value;
    });
  });
}

/* ---------- Step 5: Topic & Strategy — one Topic + Tag select per level ---------- */

function toggleLevelField(item, fieldName, levelValue, value, checked) {
  const list = item[fieldName][levelValue] || [];
  item[fieldName][levelValue] = checked ? [...list, value] : list.filter((v) => v !== value);
  if (item[fieldName][levelValue].length === 0) delete item[fieldName][levelValue];
}

function summarizeSelection(values) {
  if (!values || values.length === 0) return null;
  return values.length === 1 ? values[0] : `${values.length} selected`;
}

function renderTopicTagRows(item) {
  const container = $("#wc-topic-tag-rows");
  const entries = activeLevelEntries(item);
  if (entries.length === 0) {
    container.innerHTML = `<p class="hint-note">Pick a subject &amp; level in step 1 first.</p>`;
    return;
  }

  container.innerHTML = entries
    .map(({ levelValue, family, label }) => {
      const topics = item.topicByLevel[levelValue] || [];
      const tags = item.tagByLevel[levelValue] || [];
      const topicPool = TOPIC_POOLS[family] || [];
      const topicSummary = summarizeSelection(topics);
      const tagSummary = summarizeSelection(tags);
      return `
        <div class="topic-tag-row">
          <label class="field-label">${escapeHtml(label)} | Topic</label>
          <button type="button" class="wc-select-btn ${topicSummary ? "" : "is-placeholder"}" data-row-topic-toggle="${escapeHtml(levelValue)}">
            <span>${topicSummary ? escapeHtml(topicSummary) : "Select Topic"}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
          </button>
          <div class="dropdown-panel multiselect" data-row-topic-panel="${escapeHtml(levelValue)}" hidden>
            <div class="ms-list">
              ${topicPool.map((t) => `<label class="ms-item"><input type="checkbox" data-row-topic-cb="${escapeHtml(levelValue)}" value="${escapeHtml(t)}" ${topics.includes(t) ? "checked" : ""} /> ${escapeHtml(t)}</label>`).join("")}
            </div>
          </div>

          <label class="field-label" style="margin-top:12px">${escapeHtml(label)} | Tag - Sub Strategy</label>
          <button type="button" class="wc-select-btn ${tagSummary ? "" : "is-placeholder"}" data-row-tag-toggle="${escapeHtml(levelValue)}">
            <span>${tagSummary ? escapeHtml(tagSummary) : "Select Strategy"}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
          </button>
          <div class="dropdown-panel multiselect" data-row-tag-panel="${escapeHtml(levelValue)}" hidden>
            <div class="ms-list">
              ${TAG_OPTIONS.map((t) => `<label class="ms-item"><input type="checkbox" data-row-tag-cb="${escapeHtml(levelValue)}" value="${escapeHtml(t)}" ${tags.includes(t) ? "checked" : ""} /> ${escapeHtml(t)}</label>`).join("")}
            </div>
          </div>
        </div>`;
    })
    .join("");

  function openOnly(panel) {
    container.querySelectorAll("[data-row-topic-panel], [data-row-tag-panel]").forEach((p) => (p.hidden = true));
    panel.hidden = false;
  }

  container.querySelectorAll("[data-row-topic-toggle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = container.querySelector(`[data-row-topic-panel="${btn.dataset.rowTopicToggle}"]`);
      panel.hidden ? openOnly(panel) : (panel.hidden = true);
    });
  });
  container.querySelectorAll("[data-row-tag-toggle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = container.querySelector(`[data-row-tag-panel="${btn.dataset.rowTagToggle}"]`);
      panel.hidden ? openOnly(panel) : (panel.hidden = true);
    });
  });
  container.querySelectorAll("[data-row-topic-cb]").forEach((cb) => {
    cb.addEventListener("change", () => {
      toggleLevelField(item, "topicByLevel", cb.dataset.rowTopicCb, cb.value, cb.checked);
      renderTopicTagRows(item);
      container.querySelector(`[data-row-topic-panel="${cb.dataset.rowTopicCb}"]`).hidden = false;
    });
  });
  container.querySelectorAll("[data-row-tag-cb]").forEach((cb) => {
    cb.addEventListener("change", () => {
      toggleLevelField(item, "tagByLevel", cb.dataset.rowTagCb, cb.value, cb.checked);
      renderTopicTagRows(item);
      container.querySelector(`[data-row-tag-panel="${cb.dataset.rowTagCb}"]`).hidden = false;
    });
  });
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
    wrap.innerHTML = `<h4 class="step-h"><span class="step-no">8</span>Answer</h4><p class="hint-note">Choose a question type above to configure answers.</p>`;
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
    <h4 class="step-h"><span class="step-no">8</span>Answer</h4>
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
    return `<h4 class="step-h"><span class="step-no">8</span>Answer</h4>
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
    <h4 class="step-h"><span class="step-no">8</span>Answer</h4>
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
    <h4 class="step-h"><span class="step-no">8</span>Answer</h4>
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
    <h4 class="step-h"><span class="step-no">8</span>Essay Example</h4>
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
    if (!clickIsInside(e, ".subject-row")) {
      document.querySelectorAll("[data-row-levels-panel]").forEach((p) => (p.hidden = true));
    }
    if (!clickIsInside(e, ".topic-tag-row")) {
      document.querySelectorAll("[data-row-topic-panel], [data-row-tag-panel]").forEach((p) => (p.hidden = true));
    }
  });

  $("#wc-add-subject-row").addEventListener("click", () => {
    addSubjectRow(getItem(builderState.activeId));
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
    const issues = validateWorksheet();
    if (issues.length > 0) {
      alert(`Please complete the following before finishing:\n\n${issues.map((i) => `• ${i}`).join("\n")}`);
      return;
    }
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

/* ---------- Validation ---------- */

function validateWorksheet() {
  const issues = [];

  if (!builderState.wsName || !builderState.wsName.trim()) {
    issues.push("Worksheet Name is empty.");
  }

  builderState.items.forEach((item) => {
    const label = getLabel(item);

    if (activeLevelEntries(item).length === 0) {
      issues.push(`${label}: no Subject & Level selected.`);
    }

    if (!item.type) {
      issues.push(`${label}: no Question Type selected.`);
      return; // the checks below depend on knowing the type
    }

    if (!item.contentHtml || !item.contentHtml.trim()) {
      issues.push(`${label}: Question Content is empty.`);
    }

    if (item.type === "mcq") {
      if (item.answers.length === 0) issues.push(`${label}: add at least one answer option.`);
      else if (!item.answers.some((a) => a.correct)) issues.push(`${label}: mark a correct answer.`);
    } else if (item.type === "open") {
      const mediaTypes = ["Audio", "Video", "Image", "Free Response"];
      if (!mediaTypes.includes(item.answerType) && item.answers.length === 0) {
        issues.push(`${label}: add at least one acceptable answer.`);
      }
    } else if (item.type === "fitb" || item.type === "dnd") {
      if (item.answers.length === 0) issues.push(`${label}: mark at least one blank in the question content.`);
    } else if (item.type === "annotated") {
      if (!item.rubric) issues.push(`${label}: select a rubric.`);
    }
  });

  return issues;
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

  const entries = activeLevelEntries(item);
  const subjectLabels = entries.map((e) => e.label).join(", ");
  const allTopics = Object.values(item.topicByLevel).flat();
  const allTags = Object.values(item.tagByLevel).flat();
  const difficultyLabel =
    entries
      .filter((e) => item.difficultyByLevel[e.levelValue])
      .map((e) => `${e.label}: ${item.difficultyByLevel[e.levelValue]}`)
      .join(", ") || "none";

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
