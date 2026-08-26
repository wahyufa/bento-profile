// Renders the on-screen Speech result view — V1, matching what production
// ships today: prompts, the student's recordings, a Speech Practice Score
// panel and the IELTS Speaking rubric.
//
// There is deliberately no transcript and no pronunciation notes here;
// those belong to the proposed V2 (speech-render-v2.js), which reads the
// `transcript` field this version ignores.
//
// Data comes from `speechResult` (speech-data.js), shared with V2.

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// ---------- question card ----------

// A non-functional stand-in for the live audio player: this mockup has no
// recording files, so it shows the take and its length without pretending
// there is audio to play.
function recordingsHtml(q) {
  return `
    <div class="recordings">
      ${q.recordings
        .map(
          (r, i) => `
        <div class="recording">
          <span class="recording__num">${i + 1}</span>
          <span class="recording__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 5v14l11-7z" stroke-linejoin="round" /></svg>
          </span>
          <span class="recording__track"><span class="recording__wave"></span></span>
          <span class="recording__time">00:00 / ${escapeHtml(r.duration)}</span>
        </div>`
        )
        .join("")}
    </div>`;
}

function questionCardHtml(q) {
  return `
    <section class="qblock" id="qblock-${q.number}" data-q="${q.number}">
      <div class="tabs" role="tablist">
        <button class="tab tab--active" data-tab="question">Question ${q.number}</button>
        <button class="tab" data-tab="rubrics">Rubrics</button>
      </div>
      <div class="card">
        <div class="card__scroll" data-panel="question">
          <p class="eyebrow">Question Text:</p>
          ${q.interactive ? `<span class="badge-interactive">Interactive</span>` : ""}
          <ul class="prompt-list">
            ${q.prompts.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
          </ul>

          <p class="eyebrow">Answers:</p>
          ${q.aiReviewed
            ? `<div class="ai-banner">
                 <span class="ai-banner__note">This answer has been reviewed by AI!</span>
                 <button class="btn-see-result" data-see-result="${q.number}">See result</button>
               </div>`
            : ""}

          ${recordingsHtml(q)}
        </div>
        <div class="card__scroll" data-panel="rubrics" hidden>
          ${rubricsViewHtml(q)}
        </div>
      </div>
    </section>`;
}

// ---------- panel: Score Summary ----------

function scoreSummaryHtml(q) {
  const s = q.speechScore;
  return `
    <div class="score-block">
      <p class="score-block__label">Speech Practice Score</p>
      <div class="overall">
        <span class="overall__label">Overall Score</span>
        <span class="overall__value">${s.overall}</span>
      </div>
      <div class="metrics">
        ${SPEECH_METRICS.map(
          (m) => `
          <div class="metric">
            <span class="metric__label">${escapeHtml(m.label)}</span>
            <span class="metric__bar"><span class="metric__fill" style="width:${s[m.key]}%"></span></span>
            <span class="metric__value">${s[m.key]}/100</span>
          </div>`
        ).join("")}
      </div>
    </div>

    <div class="score-block">
      <p class="score-block__label">Rubric Score</p>
      <div class="score-bar">Score : ${q.rubrics.obtained} / ${q.rubrics.max} Marks</div>
      ${q.rubrics.criteria
        .map(
          (c) => `
        <div class="rb-row">
          <span class="rb-row__label">${escapeHtml(c.name)}</span>
          <span class="rb-bar"><span class="rb-bar__fill" style="width:${(c.obtained / c.max) * 100}%"></span></span>
          <span class="rb-row__score">${c.obtained}/${c.max}</span>
        </div>`
        )
        .join("")}
    </div>`;
}

// ---------- panel: Rubric Score ----------

function rubricsViewHtml(q) {
  const r = q.rubrics;
  const overview = `
    <div class="rb-view" data-rb-view="overview">
      <p class="rb-meta__label">Rubrics Name</p>
      <p class="rb-meta__value">${escapeHtml(r.name)}</p>
      <div class="score-bar">Score : ${r.obtained} / ${r.max} Marks</div>
      <div class="rb-card">
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

// ---------- panel shell ----------

const PANEL_VIEWS = [
  { key: "summary", label: "Score Summary", build: scoreSummaryHtml },
  { key: "rubrics", label: "Rubric Score", build: rubricsViewHtml },
];

let activeQuestion = null;
let activeView = "summary";

// Below this width the panel is a bottom sheet rather than a docked column
// (see the @media block in speech-result-v1.html), so it starts closed —
// otherwise it would cover the question the moment the page loads.
const isCompactLayout = () => window.matchMedia("(max-width: 900px)").matches;

function openPanel() {
  document.getElementById("panelSlot").classList.remove("panel-slot--closed");
}

function renderPanel() {
  const q = speechResult.questions.find((x) => x.number === activeQuestion);
  if (!q) return;
  const view = PANEL_VIEWS.find((v) => v.key === activeView);

  document.getElementById("panelContext").textContent = `Q${q.number} · ${view.label}`;
  document.getElementById("panelScroll").innerHTML = view.build(q);

  document.querySelectorAll("#panelRail .rnav").forEach((btn) => {
    btn.classList.toggle("rnav--active", btn.dataset.view === activeView);
  });

  wirePanelInteractions(document.getElementById("panelScroll"));
}

// Shared by the panel and the in-card Rubrics tab — both render the same
// Overview/Details markup, so both need the same handlers.
function wirePanelInteractions(scope) {
  scope.querySelectorAll(".rb-switch__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      scope.querySelectorAll(".rb-switch__btn").forEach((b) => b.classList.remove("rb-switch__btn--active"));
      btn.classList.add("rb-switch__btn--active");
      scope.querySelectorAll(".rb-view").forEach((v) => {
        v.hidden = v.dataset.rbView !== btn.dataset.rb;
      });
    });
  });

  scope.querySelectorAll(".rb-acc__head").forEach((head) => {
    head.addEventListener("click", () => head.closest(".rb-acc").classList.toggle("rb-acc--open"));
  });
}

// ---------- boot ----------

function renderShell() {
  document.getElementById("quizTitle").textContent = speechResult.title;
  document.getElementById("studentName").textContent = speechResult.studentName;
  document.getElementById("attempts").textContent = speechResult.attempts;
  document.getElementById("statusPill").textContent = speechResult.statusLabel;
  document.getElementById("marksPill").innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" stroke-linecap="round" /></svg>
    Score: ${speechResult.totalMarks}/${speechResult.maxMarks} Marks (${speechResult.percentage}%)
  `;
}

function renderRail() {
  const rail = document.getElementById("qrail");
  rail.innerHTML = speechResult.questions
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
  main.innerHTML = speechResult.questions.map(questionCardHtml).join("");

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

  // The in-card Rubrics tab renders the same Overview/Details markup as
  // the panel, so wire each card's copy up too.
  main.querySelectorAll('[data-panel="rubrics"]').forEach(wirePanelInteractions);

  main.querySelectorAll("[data-see-result]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeQuestion = btn.dataset.seeResult;
      activeView = "summary";
      openPanel();
      renderPanel();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  renderRail();
  renderQuestions();

  activeQuestion = speechResult.questions[0].number;
  renderPanel();
  if (isCompactLayout()) document.getElementById("panelSlot").classList.add("panel-slot--closed");

  document.querySelectorAll("#panelRail .rnav").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeView = btn.dataset.view;
      openPanel();
      renderPanel();
    });
  });

  document.getElementById("panelClose").addEventListener("click", () => {
    document.getElementById("panelSlot").classList.add("panel-slot--closed");
  });
});
