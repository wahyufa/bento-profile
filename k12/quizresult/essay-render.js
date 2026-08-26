// Renders the on-screen Essay (Composition Writing) result view from
// `essayResult` (essay-data.js).
//
// Layout mirrors the live app: a scrolling column of question cards on the
// left, and a docked "Writing Feedback" panel on the right with three
// views — Summary (inline annotations grouped by category), Rubrics
// (band descriptors + AI remark per criterion), and Good Points.

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function categoryOf(key) {
  return FEEDBACK_CATEGORIES[key] || { label: key, accent: "#98a2ad", tint: "#f3f4f6" };
}

// ---------- Answer body with inline highlights ----------

// Splices the annotation highlights into the raw answer using each
// annotation's character offsets. Annotations are numbered in reading
// order; the same number labels the matching card in the feedback panel,
// so a reader can jump between the passage and the explanation.
function annotatedAnswerHtml(q) {
  const sorted = [...q.annotations].sort((a, b) => a.start - b.start);
  let html = "";
  let cursor = 0;

  sorted.forEach((ann, idx) => {
    if (ann.start > cursor) html += escapeHtml(q.answer.slice(cursor, ann.start));
    const cat = categoryOf(ann.category);
    html += `<span class="anno anno--${ann.category}" data-anno="${q.number}-${idx + 1}" tabindex="0"
        title="${escapeHtml(cat.label)}: ${escapeHtml(ann.feedback)}"
      >${escapeHtml(q.answer.slice(ann.start, ann.end))}<sup class="anno__ref">${idx + 1}</sup></span>`;
    cursor = ann.end;
  });

  if (cursor < q.answer.length) html += escapeHtml(q.answer.slice(cursor));
  return html;
}

function questionCardHtml(q) {
  return `
    <section class="qblock" id="qblock-${q.number}" data-q="${q.number}">
      <div class="tabs" role="tablist">
        <button class="tab tab--active" data-tab="question">Question ${q.number}</button>
        <button class="tab" data-tab="attachment">Attachment</button>
        <button class="tab" data-tab="notes">Notes</button>
        <button class="tab" data-tab="video">Video</button>
        <button class="tab" data-tab="correction">Correction</button>
      </div>
      <div class="card">
        <div class="card__scroll" data-panel="question">
          <div class="stat-row">
            <span class="stat-link">Question Statistics</span>
          </div>

          <p class="eyebrow">Question Text:</p>
          <ol class="prompt-list">
            ${q.prompts.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
          </ol>

          <p class="eyebrow">Answers:</p>
          ${q.aiReviewed
            ? `<div class="ai-banner">
                 <span class="ai-banner__note">This answer has been reviewed by AI!</span>
                 <button class="btn-see-result" data-see-result="${q.number}">See Result</button>
               </div>`
            : ""}

          <p class="essay-body">${annotatedAnswerHtml(q)}</p>
          <p class="wordcount">Words count: ${q.wordCount}</p>
        </div>
        <div class="card__scroll" data-panel="attachment" hidden><div class="placeholder">Not supported for this question.</div></div>
        <div class="card__scroll" data-panel="notes" hidden><div class="placeholder">No notes added for this question yet.</div></div>
        <div class="card__scroll" data-panel="video" hidden><div class="placeholder">No walkthrough video available for this question.</div></div>
        <div class="card__scroll" data-panel="correction" hidden><div class="placeholder">Model correction will appear here.</div></div>
      </div>
    </section>`;
}

// ---------- Feedback panel: Summary ----------

function summaryViewHtml(q) {
  const sorted = [...q.annotations].sort((a, b) => a.start - b.start);
  // Preserve the panel's fixed category order rather than order of first
  // appearance, so the filter row and the groups below always line up.
  const order = Object.keys(FEEDBACK_CATEGORIES);
  const counts = order.map((key) => ({
    key,
    label: categoryOf(key).label,
    count: sorted.filter((a) => a.category === key).length,
  }));

  const filters = `
    <div class="anno-filter">
      <button class="filter-item filter-item--active" data-filter="all">All <b>${sorted.length}</b></button>
      ${counts.map((c) => `<button class="filter-item filter-item--${c.key}" data-filter="${c.key}">${c.label} <b>${c.count}</b></button>`).join("")}
    </div>`;

  const groups = order
    .map((key) => {
      const items = sorted
        .map((ann, idx) => ({ ann, num: idx + 1 }))
        .filter(({ ann }) => ann.category === key);
      const cat = categoryOf(key);
      const body = items.length
        ? items
            .map(
              ({ ann, num }) => `
          <article class="fb-card fb-card--${key}" data-anno="${q.number}-${num}">
            <button class="fb-card__head" type="button">
              <span class="fb-num">${num}</span>
              <span class="fb-quote">&ldquo;${escapeHtml(ann.text)}&rdquo;</span>
              <svg class="fb-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <div class="fb-body">
              <p>${escapeHtml(ann.feedback)}</p>
              <span class="ai-tag">AI Generated</span>
            </div>
          </article>`
            )
            .join("")
        : `<p class="fb-empty">No feedback</p>`;
      return `
        <div class="fb-group" data-group="${key}">
          <h4 class="fb-group__title"><i class="fb-dot fb-dot--${key}"></i>${escapeHtml(cat.label)}</h4>
          ${body}
        </div>`;
    })
    .join("");

  return `${filters}<div class="fb-groups">${groups}</div>`;
}

// ---------- Feedback panel: Rubrics ----------

function rubricsViewHtml(q) {
  const r = q.rubrics;
  const overview = `
    <div class="rb-view" data-rb-view="overview">
      <p class="rb-meta__label">Rubrics Name</p>
      <p class="rb-meta__value">${escapeHtml(r.name)}</p>
      <div class="score-bar">Score : ${r.obtained} / ${r.max} Marks</div>
      <div class="rb-card">
        <p class="rb-eyebrow">${escapeHtml(r.componentLabel)}</p>
        <p class="rb-title">${escapeHtml(r.componentNote)}</p>
        ${r.criteria
          .map(
            (c) => `
          <div class="rb-row">
            <span class="rb-row__label">${escapeHtml(c.name)}</span>
            <span class="rb-bar"><span class="rb-bar__fill" style="width:${(c.obtained / c.max) * 100}%"></span></span>
            <span class="rb-row__score">${c.obtained}/${c.max}</span>
          </div>`
          )
          .join("")}
      </div>
    </div>`;

  const details = `
    <div class="rb-view" data-rb-view="detail" hidden>
      ${r.criteria
        .map(
          (c) => `
        <div class="rb-acc">
          <button class="rb-acc__head" type="button">
            <span>${escapeHtml(c.name)}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <div class="rb-acc__body">
            <p class="rb-acc__obtained">Obtained: <b>${c.obtained} Marks</b></p>
            <ul class="rb-acc__desc">
              ${c.descriptors.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}
            </ul>
            <div class="rb-feedback">${escapeHtml(c.remark)}</div>
          </div>
        </div>`
        )
        .join("")}
    </div>`;

  return `
    <div class="rb-switch">
      <button class="rb-switch__btn rb-switch__btn--active" data-rb="overview">Overview</button>
      <button class="rb-switch__btn" data-rb="detail">Details</button>
    </div>
    ${overview}${details}`;
}

// ---------- Feedback panel: Good Points ----------

function goodPointsViewHtml(q) {
  if (!q.goodPoints || !q.goodPoints.length) {
    return `<div class="fb-group"><h4 class="fb-group__title"><i class="fb-dot fb-dot--good"></i>Good Points</h4><p class="fb-empty">No feedback</p></div>`;
  }
  return `
    <div class="fb-group">
      <h4 class="fb-group__title"><i class="fb-dot fb-dot--good"></i>Good Points</h4>
      ${q.goodPoints
        .map(
          (g) => `
        <article class="fb-card fb-card--good">
          <div class="fb-card__head fb-card__head--static">
            <span class="fb-quote">${escapeHtml(g)}</span>
          </div>
        </article>`
        )
        .join("")}
    </div>`;
}

// ---------- Panel shell ----------

const PANEL_VIEWS = [
  { key: "summary", label: "Summary", build: summaryViewHtml },
  { key: "rubrics", label: "Rubrics", build: rubricsViewHtml },
  { key: "good", label: "Good Points", build: goodPointsViewHtml },
];

let activeQuestion = null;
let activeView = "summary";

// Below this width the feedback panel is a bottom sheet rather than a
// docked column (see the @media block in essay-result.html), so it starts
// closed — otherwise it would cover the essay the moment the page loads.
const isCompactLayout = () => window.matchMedia("(max-width: 900px)").matches;

function openPanel() {
  document.getElementById("panelSlot").classList.remove("panel-slot--closed");
}

function renderPanel() {
  const q = essayResult.questions.find((x) => x.number === activeQuestion);
  if (!q) return;
  const view = PANEL_VIEWS.find((v) => v.key === activeView);

  document.getElementById("panelContext").textContent = `Question ${q.number} - ${view.label}`;
  document.getElementById("panelScroll").innerHTML = view.build(q);

  document.querySelectorAll("#panelRail .rnav").forEach((btn) => {
    btn.classList.toggle("rnav--active", btn.dataset.view === activeView);
  });

  wirePanelInteractions();
}

function wirePanelInteractions() {
  const scroll = document.getElementById("panelScroll");

  // Summary: expand/collapse a feedback card
  scroll.querySelectorAll(".fb-card__head:not(.fb-card__head--static)").forEach((head) => {
    head.addEventListener("click", () => head.closest(".fb-card").classList.toggle("fb-card--open"));
  });

  // Summary: category filter chips
  scroll.querySelectorAll(".filter-item").forEach((chip) => {
    chip.addEventListener("click", () => {
      scroll.querySelectorAll(".filter-item").forEach((c) => c.classList.remove("filter-item--active"));
      chip.classList.add("filter-item--active");
      const want = chip.dataset.filter;
      scroll.querySelectorAll(".fb-group").forEach((g) => {
        g.hidden = want !== "all" && g.dataset.group !== want;
      });
    });
  });

  // Rubrics: Overview / Details switch
  scroll.querySelectorAll(".rb-switch__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      scroll.querySelectorAll(".rb-switch__btn").forEach((b) => b.classList.remove("rb-switch__btn--active"));
      btn.classList.add("rb-switch__btn--active");
      scroll.querySelectorAll(".rb-view").forEach((v) => {
        v.hidden = v.dataset.rbView !== btn.dataset.rb;
      });
    });
  });

  // Rubrics: per-criterion accordion
  scroll.querySelectorAll(".rb-acc__head").forEach((head) => {
    head.addEventListener("click", () => head.closest(".rb-acc").classList.toggle("rb-acc--open"));
  });
}

// ---------- Boot ----------

function renderShell() {
  document.getElementById("quizTitle").textContent = essayResult.title;
  document.getElementById("studentName").textContent = essayResult.studentName;
  document.getElementById("attempts").textContent = essayResult.attempts;
  document.getElementById("statusPill").textContent = essayResult.statusLabel;
  document.getElementById("marksPill").innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" stroke-linecap="round" /></svg>
    Score: ${essayResult.totalMarks}/${essayResult.maxMarks} Marks (${essayResult.percentage}%)
  `;
}

function renderRail() {
  const rail = document.getElementById("qrail");
  rail.innerHTML = essayResult.questions
    .map((q, i) => `<button class="qnode${i === 0 ? " qnode--active" : ""}" data-q="${q.number}">${q.number}</button>`)
    .join("");
  rail.querySelectorAll(".qnode").forEach((btn) => {
    btn.addEventListener("click", () => {
      rail.querySelectorAll(".qnode").forEach((n) => n.classList.remove("qnode--active"));
      btn.classList.add("qnode--active");
      document.getElementById("qblock-" + btn.dataset.q)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderQuestions() {
  const main = document.getElementById("mainScroll");
  main.innerHTML = essayResult.questions.map(questionCardHtml).join("");

  main.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const block = tab.closest(".qblock");
      block.querySelectorAll(".tab").forEach((t) => t.classList.remove("tab--active"));
      tab.classList.add("tab--active");
      block.querySelectorAll("[data-panel]").forEach((p) => {
        p.hidden = p.dataset.panel !== tab.dataset.tab;
      });
    });
  });

  // "See Result" points the feedback panel at that question and opens it.
  main.querySelectorAll("[data-see-result]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeQuestion = btn.dataset.seeResult;
      openPanel();
      renderPanel();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  renderRail();
  renderQuestions();

  activeQuestion = essayResult.questions[0].number;
  renderPanel();
  if (isCompactLayout()) document.getElementById("panelSlot").classList.add("panel-slot--closed");

  document.querySelectorAll("#panelRail .rnav").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeView = btn.dataset.view;
      // On compact layouts the rail doubles as the sheet's opener, so a
      // tap both switches view and brings the sheet back up if dismissed.
      openPanel();
      renderPanel();
    });
  });

  document.getElementById("panelClose").addEventListener("click", () => {
    document.getElementById("panelSlot").classList.add("panel-slot--closed");
  });
});
