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

// ---------------------------------------------------------------------------
// Curriculum data: { [curriculumId]: { [tier]: { [subjectFamily]: [levelLabel, ...] } } }
// Pulled directly from demo.heyhi.sg's Question Creator (Select Subject step) by
// clicking through every curriculum and every subject inside it — this is the
// production subject/level list, not fabricated sample data. Only Singapore groups
// subjects under real school tiers (Primary/Secondary/Junior College) in that UI;
// every other curriculum shows a flat subject list, so those use the single
// generic "Subjects" tier (skipped in display labels — see GENERIC_TIERS).
// Cambridge has ~20 subjects total; the grade ranges for subjects beyond
// Mathematics are extrapolated from the verified per-tier pattern (Cambridge
// Primary = Grade 1-6, Lower Secondary = Grade 6-9, IGCSE = Grade 7-11, AS and A
// Level = Grade 10-12), since checking all of them individually wasn't practical.
// ---------------------------------------------------------------------------

const GENERIC_TIERS = new Set(["Subjects"]);

const CAMBRIDGE_PRIMARY = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
const CAMBRIDGE_LOWER_SECONDARY = ["Grade 6", "Grade 7", "Grade 8", "Grade 9"];
const CAMBRIDGE_IGCSE = ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"];
const CAMBRIDGE_A_LEVEL = ["Grade 10", "Grade 11", "Grade 12"];

const CURRICULA = {
  "1": {
    // Singapore
    Primary: {
      English: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"],
      Maths: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"],
      Science: ["Primary 3", "Primary 4", "Primary 5", "Primary 6"],
      Chinese: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"]
    },
    Secondary: {
      "Pure Chemistry": ["Secondary 3", "Secondary 4"],
      "Pure Biology": ["Secondary 3", "Secondary 4"]
    },
    "Junior College": {
      "H2 Biology": ["JC1", "JC2"]
    }
  },
  "2": {
    // Indonesia
    Subjects: {
      "Matematika SMP K13": ["Kelas 7", "Kelas 8", "Kelas 9"],
      "Matematika SMA Kurikulum Merdeka": ["Kelas 10", "Kelas 11", "Kelas 12"],
      "IPA SMP K13": ["Kelas 7", "Kelas 8", "Kelas 9"],
      "Bahasa Inggris SMP K13": ["Kelas 7", "Kelas 8", "Kelas 9"]
    }
  },
  "15": {
    // Cambridge (Cambridge International)
    Subjects: {
      "Cambridge Primary Mathematics": CAMBRIDGE_PRIMARY,
      "Cambridge Primary English (ESL)": CAMBRIDGE_PRIMARY,
      "Cambridge Primary English (First Language)": CAMBRIDGE_PRIMARY,
      "Cambridge Primary Science": CAMBRIDGE_PRIMARY,
      "Cambridge Lower Secondary Mathematics": CAMBRIDGE_LOWER_SECONDARY,
      "Cambridge Lower Secondary English (First Language)": CAMBRIDGE_LOWER_SECONDARY,
      "Cambridge Lower Secondary English (ESL)": CAMBRIDGE_LOWER_SECONDARY,
      "Cambridge Lower Secondary Science": CAMBRIDGE_LOWER_SECONDARY,
      "IGCSE Mathematics": CAMBRIDGE_IGCSE,
      "IGCSE English (First Language)": CAMBRIDGE_IGCSE,
      "IGCSE English (ESL)": CAMBRIDGE_IGCSE,
      "IGCSE Biology": CAMBRIDGE_IGCSE,
      "IGCSE Chemistry": CAMBRIDGE_IGCSE,
      "IGCSE Physics": CAMBRIDGE_IGCSE,
      "IGCSE Business Studies": CAMBRIDGE_IGCSE,
      "IGCSE Economics": CAMBRIDGE_IGCSE,
      "AS and A Level Mathematics": CAMBRIDGE_A_LEVEL,
      "AS and A Level English Language": CAMBRIDGE_A_LEVEL,
      "AS and A Level Biology": CAMBRIDGE_A_LEVEL,
      "AS and A Level Chemistry": CAMBRIDGE_A_LEVEL,
      "AS and A Level Economics": CAMBRIDGE_A_LEVEL
    }
  },
  "16": {
    // IELTS
    Subjects: {
      IELTS: ["Mastery"]
    }
  },
  "19": {
    // Hong Kong
    Subjects: {
      "Secondary English Language": ["Secondary 1", "Secondary 2", "Secondary 3", "Secondary 4", "Secondary 5", "Secondary 6", "DSE Level"]
    }
  },
  "29": {
    // Malaysia
    Subjects: {
      "Bahasa Melayu Sekolah Menengah Rendah": ["Tingkatan 1", "Tingkatan 2", "Tingkatan 3"],
      "Bahasa Melayu Sekolah Menengah Atas": ["Tingkatan 4", "Tingkatan 5"]
    }
  },
  "59": {
    // TOEIC
    Subjects: {
      TOEIC: ["Mastery"]
    }
  },
  "67": {
    // Digital SAT
    Subjects: {
      "Digital SAT": ["Mastery"]
    }
  },
  "109": {
    // General English — production shows no subjects under this curriculum yet.
  },
  "121": {
    // Cambridge English
    Subjects: {
      KET: ["Mastery"]
    }
  },
  "105": {
    // Demo — mirrors the (fairly ad-hoc) subject list on the live demo account.
    Subjects: {
      "Holistic Development": ["Mastery"],
      "AI Literacy": ["Mastery"],
      Literature: ["Mastery"],
      "UDT-ENG": ["Mastery"],
      "Environmental engineering": ["Mastery"],
      "Fire Safety": ["Mastery"],
      "TEST IMPORT UDTID": ["Mastery"],
      Physics: ["Middle School Physics", "High School Physics", "University Physics"],
      "Artificial Intelligence (AI) Literacy": ["Mastery"],
      "Artificial Intelligence (AI) for Beginner": ["Mastery"],
      "Reading Comprehension and Values Education": ["Mastery"]
    }
  }
};

/* ---------- Helpers for working with (possibly multiple) curricula ---------- */
/* Every Subject & Level row carries its own Curriculum choice now (a worksheet can
   mix subjects from different curricula), so options are computed per-row on demand
   from CURRICULA rather than cached against one globally "selected" curriculum. */

function tierShort(tier) {
  return tier === "Junior College" ? "JC" : tier;
}

function familyDisplayLabel(family, tier) {
  return GENERIC_TIERS.has(tier) ? family : `${tierShort(tier)} ${family}`;
}

function curriculumLabel(curriculumId) {
  return QUESTION_BANKS.find((c) => c.value === curriculumId)?.label || curriculumId;
}

function familyOptionsForCurriculum(curriculumId) {
  const tiers = CURRICULA[curriculumId] || {};
  const options = [];
  Object.entries(tiers).forEach(([tier, subjects]) => {
    Object.keys(subjects).forEach((family) => {
      options.push({ value: family, label: familyDisplayLabel(family, tier) });
    });
  });
  return options;
}

function familyLabelInCurriculum(curriculumId, family) {
  return familyOptionsForCurriculum(curriculumId).find((f) => f.value === family)?.label || family;
}

function levelsForCurriculumFamily(curriculumId, family) {
  const tiers = CURRICULA[curriculumId] || {};
  for (const subjects of Object.values(tiers)) {
    if (subjects[family]) return subjects[family];
  }
  return [];
}

// A level value must stay unique across curricula and subjects, so it encodes all
// three parts. "::" is safe as a separator since none of the source labels use it.
function encodeLevelValue(curriculumId, family, level) {
  return `${curriculumId}::${family}::${level}`;
}

function decodeLevelValue(value) {
  const [curriculumId, family, level] = value.split("::");
  return { curriculumId, family, level };
}

function subjectFamily(value) {
  return decodeLevelValue(value).family;
}

// e.g. "Cambridge · IGCSE Mathematics (Grade 8)" — the curriculum name is included
// since one worksheet can now mix subjects from different curricula.
function levelDisplayLabel(curriculumId, family, level) {
  return `${curriculumLabel(curriculumId)} · ${familyLabelInCurriculum(curriculumId, family)} (${level})`;
}

const ICON_TRASH = '<path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M10 11v6M14 11v6"></path>';

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
// outside click" behavior shared by the Topic and Tag accordion fields. `onClose`
// (if given) fires once per genuine close, so callers can collapse whichever
// subject group was left expanded — reopening should always start fresh.
function bindClickToOpenAccordion(searchSelector, accordionSelector, containerSelector, onClose) {
  const searchEl = $(searchSelector);
  const open = () => {
    $(accordionSelector).hidden = false;
  };
  searchEl.addEventListener("focus", open);
  searchEl.addEventListener("click", open);
  document.addEventListener("click", (e) => {
    if (!clickIsInside(e, containerSelector)) {
      const wasOpen = !$(accordionSelector).hidden;
      $(accordionSelector).hidden = true;
      if (wasOpen && onClose) onClose();
    }
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

/* ---------- Shared "Curriculum → Subject → Level" row editor ---------- */
/* Used by both the intake form and the builder topbar picker: each row picks its
   own Curriculum, which scopes its Subject options, which scopes its Level options.
   That lets one worksheet mix subjects from different curricula. */

function rowsToFlatSubjects(rows) {
  return rows
    .filter((r) => r.curriculum && r.family && r.levels.length)
    .flatMap((r) =>
      r.levels.map((lvl) => ({
        value: encodeLevelValue(r.curriculum, r.family, lvl),
        label: levelDisplayLabel(r.curriculum, r.family, lvl)
      }))
    );
}

function subjectsToRows(subjects) {
  const groups = new Map();
  subjects.forEach((s) => {
    const { curriculumId, family, level } = decodeLevelValue(s.value);
    const key = `${curriculumId}::${family}`;
    if (!groups.has(key)) {
      groups.set(key, { id: "row" + Date.now() + Math.floor(Math.random() * 1000), curriculum: curriculumId, family, levels: [] });
    }
    groups.get(key).levels.push(level);
  });
  return [...groups.values()];
}

function createSubjectRowsEditor({ containerEl, addBtnEl, onChange, initialRows }) {
  const newRow = () => ({ id: "row" + Date.now() + Math.floor(Math.random() * 1000), curriculum: "", family: "", levels: [] });
  let rows = initialRows && initialRows.length ? initialRows : [newRow()];

  function commit() {
    render();
    onChange(rows);
  }

  function addRow() {
    rows = [...rows, newRow()];
    commit();
  }

  function removeRow(rowId) {
    if (rows.length <= 1) return; // always keep at least one row to configure
    rows = rows.filter((r) => r.id !== rowId);
    commit();
  }

  function setRowCurriculum(rowId, curriculumId) {
    rows = rows.map((r) => (r.id === rowId ? { ...r, curriculum: curriculumId, family: "", levels: [] } : r));
    commit();
  }

  function setRowFamily(rowId, family) {
    rows = rows.map((r) => (r.id === rowId ? { ...r, family, levels: [] } : r));
    commit();
  }

  function toggleRowLevel(rowId, level, checked) {
    rows = rows.map((r) => {
      if (r.id !== rowId) return r;
      const levels = checked ? [...r.levels, level] : r.levels.filter((v) => v !== level);
      return { ...r, levels };
    });
    render();
    onChange(rows);
    // render() rebuilds every row's panel as hidden — reopen this one so picking
    // several levels in a row doesn't require re-clicking.
    const panel = containerEl.querySelector(`[data-row-levels-panel="${rowId}"]`);
    if (panel) panel.hidden = false;
  }

  function render() {
    if (addBtnEl) addBtnEl.hidden = false;

    containerEl.innerHTML = rows
      .map((row) => {
        const familyOptions = row.curriculum ? familyOptionsForCurriculum(row.curriculum) : [];
        const levelOptions = row.curriculum && row.family ? levelsForCurriculumFamily(row.curriculum, row.family) : [];
        const chips = row.levels
          .map((lvl) => `<span class="ms-chip">${escapeHtml(lvl)}<button type="button" data-row-remove-level="${row.id}" data-level="${escapeHtml(lvl)}">&times;</button></span>`)
          .join("");
        const usedByOtherRows = rows.filter((r) => r.id !== row.id && r.curriculum === row.curriculum).map((r) => r.family);
        const levelsHint = row.family
          ? '<span class="hint-note">Click to pick a level</span>'
          : row.curriculum
            ? '<span class="hint-note">Select a subject first</span>'
            : '<span class="hint-note">Select a curriculum first</span>';
        return `
          <div class="subject-row" data-row-id="${row.id}">
            <div class="subject-row-controls">
              <select class="wc-select" data-row-curriculum-select="${row.id}">
                <option value="">Select Curriculum</option>
                ${QUESTION_BANKS.map((c) => `<option value="${c.value}" ${row.curriculum === c.value ? "selected" : ""}>${escapeHtml(c.label)}</option>`).join("")}
              </select>
              <select class="wc-select" data-row-family-select="${row.id}" ${row.curriculum ? "" : "disabled"}>
                <option value="">Select Subject</option>
                ${familyOptions.map((f) => `<option value="${f.value}" ${row.family === f.value ? "selected" : ""} ${usedByOtherRows.includes(f.value) ? "disabled" : ""}>${f.label}${usedByOtherRows.includes(f.value) ? " (already added)" : ""}</option>`).join("")}
              </select>
              ${rows.length > 1 ? `<button type="button" class="del-row-btn" data-row-delete="${row.id}" title="Remove">${svg(ICON_TRASH)}</button>` : ""}
            </div>
            <div class="subject-row-levels ${row.family ? "" : "is-disabled"}" data-row-levels-toggle="${row.id}">
              <div class="ms-chips">${chips || levelsHint}</div>
            </div>
            <div class="dropdown-panel multiselect" data-row-levels-panel="${row.id}" hidden>
              <div class="ms-list">
                ${levelOptions.map((lvl) => `<label class="ms-item"><input type="checkbox" data-row-level-cb="${row.id}" value="${escapeHtml(lvl)}" ${row.levels.includes(lvl) ? "checked" : ""} /> ${escapeHtml(lvl)}</label>`).join("")}
              </div>
            </div>
          </div>`;
      })
      .join("");

    containerEl.querySelectorAll("[data-row-curriculum-select]").forEach((sel) => {
      sel.addEventListener("change", (e) => setRowCurriculum(sel.dataset.rowCurriculumSelect, e.target.value));
    });
    containerEl.querySelectorAll("[data-row-family-select]").forEach((sel) => {
      sel.addEventListener("change", (e) => setRowFamily(sel.dataset.rowFamilySelect, e.target.value));
    });
    containerEl.querySelectorAll("[data-row-delete]").forEach((btn) => {
      btn.addEventListener("click", () => removeRow(btn.dataset.rowDelete));
    });
    containerEl.querySelectorAll("[data-row-remove-level]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleRowLevel(btn.dataset.rowRemoveLevel, btn.dataset.level, false);
      });
    });
    containerEl.querySelectorAll("[data-row-levels-toggle]").forEach((box) => {
      box.addEventListener("click", () => {
        const rowId = box.dataset.rowLevelsToggle;
        const row = rows.find((r) => r.id === rowId);
        if (!row.family) return;
        const panel = containerEl.querySelector(`[data-row-levels-panel="${rowId}"]`);
        const wasHidden = panel.hidden;
        containerEl.querySelectorAll("[data-row-levels-panel]").forEach((p) => (p.hidden = true));
        panel.hidden = !wasHidden;
      });
    });
    containerEl.querySelectorAll("[data-row-level-cb]").forEach((cb) => {
      cb.addEventListener("change", () => toggleRowLevel(cb.dataset.rowLevelCb, cb.value, cb.checked));
    });
  }

  if (addBtnEl) addBtnEl.addEventListener("click", addRow);
  render();

  return {
    getRows: () => rows,
    setRows: (newRows) => {
      rows = newRows.length ? newRows : [newRow()];
      commit();
    }
  };
}

// Any row-levels popover, from either editor, closes on an outside click.
document.addEventListener("click", (e) => {
  if (!clickIsInside(e, ".subject-row")) {
    document.querySelectorAll("[data-row-levels-panel]").forEach((p) => (p.hidden = true));
  }
});

/* =====================================================================
   VIEW 1 — INTAKE
   ===================================================================== */

const nameInput = document.getElementById("wsc-name");
const submitBtn = document.getElementById("wsc-submit");
const cancelBtn = document.getElementById("wsc-cancel");
const intakeForm = document.getElementById("wsc-form");
const intakeSubjectChips = document.getElementById("wsc-subject-chips");

let intakeSubjects = []; // flattened {value,label} across all rows, kept in sync via the editor's onChange

const intakeRowsEditor = createSubjectRowsEditor({
  containerEl: document.getElementById("wsc-subject-rows"),
  addBtnEl: document.getElementById("wsc-add-subject-row"),
  onChange: (rows) => {
    intakeSubjects = rowsToFlatSubjects(rows);
    renderIntakeChips();
    validateIntake();
  }
});

function renderIntakeChips() {
  renderMsChips(intakeSubjectChips, intakeSubjects, intakeSubjects.map((s) => s.value), (value) => {
    const rows = intakeRowsEditor.getRows();
    const { curriculumId, family, level } = decodeLevelValue(value);
    const row = rows.find((r) => r.curriculum === curriculumId && r.family === family && r.levels.includes(level));
    if (row) {
      const updated = rows.map((r) => (r.id === row.id ? { ...r, levels: r.levels.filter((v) => v !== level) } : r));
      intakeRowsEditor.setRows(updated);
    }
  });
}

function validateIntake() {
  submitBtn.disabled = !(nameInput.value.trim() && intakeSubjects.length > 0);
}

nameInput.addEventListener("input", validateIntake);

cancelBtn.addEventListener("click", () => {
  intakeForm.reset();
  intakeRowsEditor.setRows([]);
  validateIntake();
});

intakeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (submitBtn.disabled) return;

  openBuilder(nameInput.value.trim(), intakeSubjects);
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
  ],

  // Indonesia
  "Matematika SMP K13": ["Bilangan > Bilangan Bulat", "Bilangan > Pecahan", "Aljabar > Persamaan Linear", "Geometri > Bangun Datar", "Statistika > Rata-rata dan Modus"],
  "Matematika SMA Kurikulum Merdeka": ["Aljabar > Fungsi Kuadrat", "Trigonometri > Identitas Trigonometri", "Kalkulus > Limit Fungsi", "Statistika > Peluang", "Geometri > Vektor"],
  "IPA SMP K13": ["Zat dan Perubahannya > Sifat Zat", "Energi > Usaha dan Energi", "Makhluk Hidup > Sistem Pencernaan", "Bumi dan Alam Semesta > Tata Surya"],
  "Bahasa Inggris SMP K13": ["Grammar > Simple Present Tense", "Grammar > Simple Past Tense", "Vocabulary > Daily Activities", "Reading > Recount Text", "Writing > Descriptive Text"],

  // Cambridge
  "Cambridge Primary Mathematics": ["Number > Place Value", "Number > Addition and Subtraction", "Geometry > 2D and 3D Shapes", "Measure > Length and Mass", "Statistics > Bar Charts"],
  "Cambridge Primary English (ESL)": ["Grammar > Present Simple", "Vocabulary > Everyday Objects", "Reading > Short Stories", "Speaking > Describing Pictures"],
  "Cambridge Primary English (First Language)": ["Grammar > Sentence Structure", "Reading > Comprehension", "Writing > Narrative Writing", "Vocabulary > Synonyms and Antonyms"],
  "Cambridge Primary Science": ["Biology > Living Things", "Chemistry > Materials", "Physics > Forces and Motion", "Earth Science > Weather and Seasons"],
  "Cambridge Lower Secondary Mathematics": ["Number > Fractions and Percentages", "Algebra > Linear Equations", "Geometry > Angles and Symmetry", "Statistics > Averages"],
  "Cambridge Lower Secondary English (First Language)": ["Grammar > Tenses Review", "Reading > Non-fiction Texts", "Writing > Persuasive Writing"],
  "Cambridge Lower Secondary English (ESL)": ["Grammar > Modal Verbs", "Vocabulary > School Life", "Speaking > Giving Opinions"],
  "Cambridge Lower Secondary Science": ["Biology > Cells and Organisms", "Chemistry > States of Matter", "Physics > Energy Sources"],
  "IGCSE Mathematics": ["Number > Indices and Surds", "Algebra > Quadratic Equations", "Geometry > Circle Theorems", "Statistics > Probability"],
  "IGCSE English (First Language)": ["Reading > Unseen Texts", "Writing > Argumentative Essays", "Language > Figurative Devices"],
  "IGCSE English (ESL)": ["Grammar > Conditionals", "Reading > Informational Texts", "Writing > Formal Letters"],
  "IGCSE Biology": ["Cell Biology > Cell Structure", "Human Biology > Nervous System", "Genetics > Inheritance Patterns", "Ecology > Ecosystems"],
  "IGCSE Chemistry": ["Atomic Structure > Periodic Table", "Chemical Reactions > Rates of Reaction", "Organic Chemistry > Hydrocarbons", "Acids and Bases > pH Scale"],
  "IGCSE Physics": ["Forces > Motion and Momentum", "Energy > Work and Power", "Waves > Sound and Light", "Electricity > Circuits"],
  "IGCSE Business Studies": ["Business Activity > Types of Business", "Marketing > Market Research", "Finance > Cash Flow", "People in Business > Motivation"],
  "IGCSE Economics": ["Basic Concepts > Scarcity and Choice", "Markets > Demand and Supply", "Government > Fiscal Policy", "International Trade > Exchange Rates"],
  "AS and A Level Mathematics": ["Pure Maths > Differentiation", "Pure Maths > Integration", "Statistics > Hypothesis Testing", "Mechanics > Kinematics"],
  "AS and A Level English Language": ["Language Analysis > Discourse Features", "Language Analysis > Child Language Acquisition", "Writing > Directed Writing"],
  "AS and A Level Biology": ["Molecules > Biological Molecules", "Cells > Cell Membranes and Transport", "Genetics > Gene Technology", "Ecology > Population Dynamics"],
  "AS and A Level Chemistry": ["Atomic Structure > Electron Configuration", "Bonding > Intermolecular Forces", "Organic Chemistry > Reaction Mechanisms", "Equilibria > Le Chatelier's Principle"],
  "AS and A Level Economics": ["Microeconomics > Elasticity", "Macroeconomics > National Income", "Markets > Market Failure", "International Economics > Trade Policies"],

  // Hong Kong
  "Secondary English Language": ["Reading > Exam-style Comprehension", "Writing > Practical Writing", "Listening > Note-taking Skills", "Speaking > Group Interaction"],

  // Malaysia
  "Bahasa Melayu Sekolah Menengah Rendah": ["Tatabahasa > Kata Kerja", "Kefahaman > Petikan Prosa", "Penulisan > Karangan Naratif"],
  "Bahasa Melayu Sekolah Menengah Atas": ["Tatabahasa > Ayat Majmuk", "Kesusasteraan > Analisis Sajak", "Penulisan > Rencana"],

  // IELTS / TOEIC / Digital SAT / Cambridge English
  IELTS: ["Listening > Section 1-4 Practice", "Reading > Academic Passages", "Writing > Task 1 Report", "Writing > Task 2 Essay", "Speaking > Part 2 Cue Card"],
  TOEIC: ["Listening > Photographs", "Listening > Conversations", "Reading > Incomplete Sentences", "Reading > Text Completion"],
  "Digital SAT": ["Reading and Writing > Craft and Structure", "Reading and Writing > Standard English Conventions", "Math > Algebra", "Math > Problem-Solving and Data Analysis"],
  KET: ["Reading and Writing > Multiple Choice Cloze", "Listening > Short Conversations", "Speaking > Interview"],

  // Demo
  "Holistic Development": ["Self-awareness > Identifying Emotions", "Collaboration > Teamwork Skills"],
  "AI Literacy": ["Foundations > What is AI", "Ethics > Responsible AI Use"],
  Literature: ["Poetry > Analysing Imagery", "Prose > Character Study"],
  "UDT-ENG": ["Grammar > Sentence Basics", "Vocabulary > Core Word List"],
  "Environmental engineering": ["Water Systems > Treatment Processes", "Sustainability > Renewable Resources"],
  "Fire Safety": ["Prevention > Fire Hazards", "Response > Evacuation Procedures"],
  "TEST IMPORT UDTID": ["Sample Topic > Placeholder Entry"],
  Physics: ["Mechanics > Newton's Laws", "Waves > Wave Properties", "Electricity > Circuits Basics"],
  "Artificial Intelligence (AI) Literacy": ["Concepts > Machine Learning Basics", "Applications > AI in Daily Life"],
  "Artificial Intelligence (AI) for Beginner": ["Introduction > What Computers Can Do", "Hands-on > Simple AI Tools"],
  "Reading Comprehension and Values Education": ["Comprehension > Main Idea and Details", "Values > Respect and Empathy"]
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
    difficultyBySubject: {}, // { [subjectValue]: string } — one difficulty level per subject & level
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

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || "").trim();
}

// Checked by "Finish and Save" — the required fields every question needs before
// the worksheet can be considered complete.
function validateWorksheet() {
  const issues = [];

  if (!builderState.wsName || !builderState.wsName.trim()) {
    issues.push({ qId: null, message: "Enter a Worksheet Name." });
  }
  if (builderState.subjects.length === 0) {
    issues.push({ qId: null, message: "Add at least one Subject & Level (top bar)." });
  }

  builderState.items.forEach((item) => {
    const label = getLabel(item);
    if (!item.type) issues.push({ qId: item.id, message: `${label}: Select a Question Type.` });
    if (!item.answerType) issues.push({ qId: item.id, message: `${label}: Select an Answer Type.` });
    if (!stripHtml(item.contentHtml)) issues.push({ qId: item.id, message: `${label}: Add question content.` });
  });

  return issues;
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
  initTopbarSubjectsEditor();
  topbarSubjectsEditor.setRows(subjectsToRows(builderState.subjects));

  renderSidebar();
  renderConfigPanel();
  renderContentPanel(getItem(builderState.activeId));

  if (!builderBound) {
    bindBuilderEvents();
    builderBound = true;
  }
}

/* ---------- Worksheet-level subjects (topbar) ---------- */
/* Reuses the same Curriculum → Subject → Level row editor as intake, so adding or
   changing subjects after intake — including from a curriculum not originally
   chosen — works the same way everywhere. */

let topbarSubjectsEditor = null;

function initTopbarSubjectsEditor() {
  if (topbarSubjectsEditor) return;
  topbarSubjectsEditor = createSubjectRowsEditor({
    containerEl: $("#wc-subject-rows"),
    addBtnEl: $("#wc-add-subject-row"),
    onChange: (rows) => {
      const oldValues = builderState.subjects.map((s) => s.value);
      builderState.subjects = rowsToFlatSubjects(rows);
      const newValues = builderState.subjects.map((s) => s.value);
      const removed = oldValues.filter((v) => !newValues.includes(v));

      // Drop each removed subject's chosen topics/tags/difficulty (and expanded
      // state) from every question.
      removed.forEach((value) => {
        builderState.items.forEach((item) => {
          delete item.topicsBySubject[value];
          item.expandedTopics = item.expandedTopics.filter((v) => v !== value);
          delete item.tagsBySubject[value];
          item.expandedTags = item.expandedTags.filter((v) => v !== value);
          delete item.difficultyBySubject[value];
          item.expandedDifficulty = item.expandedDifficulty.filter((v) => v !== value);
        });
      });

      updateTopbarSubjectsLabel();
      renderConfigPanel();
    }
  });
}

function updateTopbarSubjectsLabel() {
  $("#wc-subjects-toggle-label").textContent =
    builderState.subjects.length === 0
      ? "Select Subject & Level"
      : builderState.subjects.length === 1
        ? builderState.subjects[0].label
        : `${builderState.subjects.length} subjects selected`;
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

  difficultyField.render(item);
  topicField.render(item);
  tagField.render(item);

  $("#wc-marks").innerHTML = MARKS_VALUES.map(
    (v) => `<option value="${v}" ${item.marks === v ? "selected" : ""}>${v}</option>`
  ).join("");
}

/* ---------- Generic "pick from a pool, grouped by subject" field ---------- */
/* Used for Topic and Tag - Sub Strategy (pick any number, checkboxes) and for the
   per-subject Difficulty Level (pick exactly one per subject, radios: `single: true`). */

function makeAccordionField({ fieldName, expandedField, chipsElId, searchElId, accordionElId, poolFn, single = false }) {
  function renderChips(item) {
    const chipsEl = $(chipsElId);
    const pairs = [];
    Object.entries(item[fieldName]).forEach(([subjVal, stored]) => {
      if (single) {
        if (stored) pairs.push({ subjVal, value: stored });
      } else {
        stored.forEach((value) => pairs.push({ subjVal, value }));
      }
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
    if (single) {
      if (checked) item[fieldName][subjectValue] = value;
      else delete item[fieldName][subjectValue];
    } else {
      const list = item[fieldName][subjectValue] || [];
      item[fieldName][subjectValue] = checked ? [...list, value] : list.filter((v) => v !== value);
      if (item[fieldName][subjectValue].length === 0) delete item[fieldName][subjectValue];
    }
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
        const selected = item[fieldName][subj.value] || (single ? "" : []);
        const count = single ? (selected ? 1 : 0) : selected.length;
        const pool = poolFn(subj.value);
        const filtered = term ? pool.filter((v) => v.toLowerCase().includes(term)) : pool;
        const expanded = term ? filtered.length > 0 : item[expandedField].includes(subj.value);

        const rows =
          filtered
            .map((v) => {
              const isChecked = single ? selected === v : selected.includes(v);
              const inputType = single ? "radio" : "checkbox";
              const nameAttr = single ? ` name="rg-${escapeHtml(subj.value)}"` : "";
              return `<label class="ms-item"><input type="${inputType}"${nameAttr} data-subject="${escapeHtml(subj.value)}" value="${escapeHtml(v)}" ${isChecked ? "checked" : ""} /> ${escapeHtml(v)}</label>`;
            })
            .join("") || `<p class="hint-note">No matches.</p>`;

        return `
          <div class="ms-group ${expanded ? "is-expanded" : ""}">
            <button type="button" class="ms-group-head" data-toggle-group="${escapeHtml(subj.value)}">
              <svg class="ms-group-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>
              <span>${escapeHtml(subj.label)}</span>
              ${count ? `<span class="ms-group-count">${count}</span>` : ""}
            </button>
            <div class="ms-group-body" ${expanded ? "" : "hidden"}>${rows}</div>
          </div>`;
      })
      .join("");

    container.querySelectorAll("[data-toggle-group]").forEach((btn) => {
      btn.addEventListener("click", () => toggleGroup(item, btn.dataset.toggleGroup));
    });
    container.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((cb) => {
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
  poolFn: () => DIFFICULTY_LEVELS,
  single: true // only one difficulty level per subject & level
});

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
  bindClickToOpenAccordion("#wc-q-topics-search", "#wc-q-topics-accordion", "#wc-q-topics-ms", () => {
    const item = getItem(builderState.activeId);
    item.expandedTopics = [];
    topicField.renderAccordion(item);
  });
  bindClickToOpenAccordion("#wc-q-tag-search", "#wc-q-tag-accordion", "#wc-q-tag-ms", () => {
    const item = getItem(builderState.activeId);
    item.expandedTags = [];
    tagField.renderAccordion(item);
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
      const firstQuestionIssue = issues.find((i) => i.qId);
      if (firstQuestionIssue) switchQuestion(firstQuestionIssue.qId);
      alert("Please complete the following before finishing:\n\n" + issues.map((i) => "• " + i.message).join("\n"));
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
    Object.entries(item.difficultyBySubject)
      .map(([v, level]) => `${builderState.subjects.find((s) => s.value === v)?.label || v}: ${level}`)
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
