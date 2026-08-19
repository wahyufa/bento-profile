// Renders the on-screen Quiz Result view from `quizResult` (quiz-data.js).

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function marksObtainedLine(obtained) {
  const value = obtained === null || obtained === undefined ? "No Answer" : `${obtained} Marks`;
  return `<p class="marks-obtained">Marks obtained : <span>${value}</span></p>`;
}

function fillblankTotal(q) {
  const values = Object.values(q.blanks);
  return values.reduce((sum, b) => sum + (b.marks || 0), 0);
}

// yellow = partial marks, green = full marks, red = zero / no answer
function questionMarkStatus(q) {
  const max = q.maxMarks;
  let obtained = q.marksObtained;
  if (obtained === null || obtained === undefined) {
    obtained = q.type === "fillblank" ? fillblankTotal(q) : 0;
  }
  if (!max || obtained <= 0) return "zero";
  if (obtained >= max) return "full";
  return "partial";
}

function renderShell() {
  document.getElementById("quizTitle").textContent = quizResult.title;
  document.getElementById("studentName").textContent = quizResult.studentName;
  document.getElementById("attempts").textContent = quizResult.attempts;
  document.getElementById("statusPill").childNodes[0].textContent = "";
  document.getElementById("statusPill").textContent = quizResult.statusLabel;
  document.getElementById("marksPill").innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" stroke-linecap="round" /></svg>
    ${quizResult.totalMarks}/${quizResult.maxMarks} Marks (${quizResult.percentage}%)
  `;
}

function renderRail() {
  const rail = document.getElementById("qrail");
  rail.innerHTML = quizResult.questions
    .map((q, i) => {
      const cls = ["qnode", `qnode--${questionMarkStatus(q)}`];
      if (i === 0) cls.push("qnode--active");
      return `<button class="${cls.join(" ")}" data-q="${q.number}">${q.number}</button>`;
    })
    .join("");
  rail.querySelectorAll(".qnode").forEach((btn) => {
    btn.addEventListener("click", () => {
      rail.querySelectorAll(".qnode").forEach((n) => n.classList.remove("qnode--active"));
      btn.classList.add("qnode--active");
      document.getElementById("qblock-" + btn.dataset.q)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function tabsMarkup(number) {
  return `
    <div class="tabs" role="tablist">
      <button class="tab tab--active" data-tab="question">Question ${number}</button>
      <button class="tab" data-tab="attachment">Attachment</button>
      <button class="tab" data-tab="notes">Notes</button>
      <button class="tab" data-tab="video">Video</button>
      <button class="tab" data-tab="correction">Correction</button>
    </div>
  `;
}

function statRow(showAnnotationsToggle) {
  return `
    <div class="stat-row">
      <div class="stat-links">
        <span class="stat-link">Group Results</span>
        <span class="stat-link">Question Statistics</span>
      </div>
      ${showAnnotationsToggle ? `<label class="show-annotations"><input type="checkbox" checked disabled /> Show Annotations</label>` : ""}
    </div>
  `;
}

function renderAnswerSegments(segments) {
  if (!segments || !segments.length) return `<span class="no-answer-text">No Answer</span>`;
  return segments
    .map((seg) => {
      if (!seg.type) return escapeHtml(seg.text);
      return `<span class="oe-annotation oe-annotation--${seg.type}" title="${escapeHtml(seg.note || "")}">${escapeHtml(seg.text)}</span>`;
    })
    .join(" ");
}

// Replaces each [[KEY]] marker in a fill-blank passage with the student's
// given answer for that blank, color-coded the same way as the OE inline
// annotations (green/correct vs red/incorrect), correct answer on hover.
function fillblankParagraphHtml(text, blanks) {
  return escapeHtml(text).replace(/\[\[(\w+)\]\]/g, (_, key) => {
    const b = blanks[key];
    if (!b) return key;
    const isCorrect = b.marks > 0;
    const cls = isCorrect ? "correct" : "incorrect";
    const note = `Correct answer: ${b.correct}`;
    return `<span class="blank-label">(${key})</span><span class="answer-annotation answer-annotation--${cls}" title="${escapeHtml(note)}">${escapeHtml(b.given || "—")}</span>`;
  });
}

function remarksMarkup(remark) {
  if (!remark) return "";
  return `
    <div class="remarks-block">
      <div class="remarks-block__head">
        Remarks
        <img src="https://elb-onlinequiz.smartjen.com/images/adaptive-learning/ai-icon.png" alt="" />
      </div>
      <div class="remark-box">${escapeHtml(remark)}</div>
    </div>`;
}

function imagesMarkup(images) {
  if (!images || !images.length) return "";
  return `
    <div class="question-images">
      ${images.map((src) => `<img src="${src}" alt="" loading="lazy" />`).join("")}
    </div>`;
}

function renderMcq(q) {
  return `
    ${statRow(false)}
    ${q.prompt ? `<p class="prompt-text" style="font-size:0.95em;color:var(--ink-soft);">${escapeHtml(q.prompt)}</p>` : ""}
    ${imagesMarkup(q.images)}
    <p class="prompt-text">${escapeHtml(q.question)}</p>
    <ul class="mcq-options">
      ${q.options
        .map((opt, idx) => {
          const isSelected = q.answered && q.selectedIndex === idx;
          const isWrongSelection = isSelected && !opt.correct;
          const cls = opt.correct ? " mcq-option--correct" : isWrongSelection ? " mcq-option--wrong" : "";
          const tag = opt.correct ? " (Correct Answer)" : isWrongSelection ? " (Your Answer)" : "";
          const icon = opt.correct
            ? `<span class="mcq-option__tick mcq-option__tick--correct">&#10003;</span>`
            : isWrongSelection
            ? `<span class="mcq-option__tick mcq-option__tick--wrong">&#10007;</span>`
            : "";
          return `
        <li class="mcq-option${cls}">
          ${icon}
          ${escapeHtml(opt.text)}${tag}
        </li>`;
        })
        .join("")}
    </ul>
    ${!q.answered ? `<div class="answer-block--empty">The Student has not answered this question</div>` : ""}
    ${marksObtainedLine(q.marksObtained)}
  `;
}

function renderOe(q) {
  const marksGivenText =
    q.marksGiven !== undefined && q.marksGiven !== null ? ` (Marks Given: ${q.marksGiven})` : "";
  return `
    ${statRow(true)}
    <p class="prompt-text">${escapeHtml(q.prompt)}</p>
    <p class="given-text">
      ${escapeHtml(q.given)}<br><br>
      ${escapeHtml(q.starter)} ${renderAnswerSegments(q.studentAnswerSegments)}${marksGivenText}.
    </p>
    <p class="model-answer-line">
      Model answer :<br>
      <span class="model-answer-value">${escapeHtml(q.starter)} ${escapeHtml(q.modelAnswer)}</span>
    </p>
    ${remarksMarkup(q.remark)}
    ${marksObtainedLine(q.marksObtained)}
  `;
}

function renderFillblank(q) {
  const passageHtml = q.passage
    .map((para) => `<p>${fillblankParagraphHtml(para, q.blanks)}</p>`)
    .join("");
  const keyHtml = Object.entries(q.blanks)
    .map(([key, b]) => `<li><b>${key})</b> ${escapeHtml(b.correct)}</li>`)
    .join("");
  return `
    ${statRow(true)}
    <p class="prompt-text">${escapeHtml(q.prompt)}</p>
    <div class="fb-passage">${passageHtml}</div>
    <p class="blank-key__label">Correct Answers</p>
    <ul class="blank-key">${keyHtml}</ul>
    ${remarksMarkup(q.remark)}
    ${marksObtainedLine(q.marksObtained)}
  `;
}

function renderQuestionBody(q) {
  if (q.type === "mcq") return renderMcq(q);
  if (q.type === "oe") return renderOe(q);
  if (q.type === "fillblank") return renderFillblank(q);
  return "";
}

function renderQuestions() {
  const main = document.getElementById("mainScroll");
  main.innerHTML = quizResult.questions
    .map(
      (q) => `
    <div class="qblock" id="qblock-${q.number}" data-q="${q.number}">
      ${tabsMarkup(q.number)}
      <div class="card">
        <div class="card__scroll" data-panel="question">
          ${renderQuestionBody(q)}
        </div>
        <div class="card__scroll" data-panel="attachment" hidden><div class="placeholder">No attachment for this question.</div></div>
        <div class="card__scroll" data-panel="notes" hidden><div class="placeholder">No notes added for this question yet.</div></div>
        <div class="card__scroll" data-panel="video" hidden><div class="placeholder">No walkthrough video available for this question.</div></div>
        <div class="card__scroll" data-panel="correction" hidden><div class="placeholder">Model correction will appear here.</div></div>
      </div>
    </div>`
    )
    .join("");

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
}

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  renderRail();
  renderQuestions();
});
