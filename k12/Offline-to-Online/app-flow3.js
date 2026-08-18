"use strict";

/* ---------- data ---------- */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "Question 1",
    marks: 2,
    prompt: "Solve 3x + 5 = 20. Show your working and give the final value of x.",
    handwriting: "3x + 5 = 20\n3x = 20 - 5\n3x = 15\nx = 15 ÷ 3\nx = 5",
  },
  {
    id: 2,
    title: "Question 2",
    marks: 2,
    prompt: "Write 3 sentences about your favourite animal. Say what it looks like and why you like it.",
    handwriting:
      "My favourite animal is a cat because it is gentle, playful, and always makes me feel happy when it stays close to me. It has soft fur, bright round eyes, small pointed ears, long whiskers, and a fluffy tail that moves from side to side when it is excited. I like cats because they are curious and funny, but they can also be calm companions that sit quietly beside me when I am reading or resting.",
  },
  {
    id: 3,
    title: "Question 3",
    marks: 2,
    prompt: "Solve 2x - 4 = 10. Show your working and give the final value of x.",
    handwriting: "2x - 4 = 10\n2x = 10 + 4\n2x = 14\nx = 14 ÷ 2\nx = 6",
  },
  {
    id: 4,
    title: "Question 4",
    marks: 2,
    prompt: "Simplify 15/20 to its lowest terms.",
    handwriting: "15/20\nGCD of 15 and 20 is 5\n15 ÷ 5 = 3\n20 ÷ 5 = 4\nAnswer: 3/4",
  },
  {
    id: 5,
    title: "Question 5",
    marks: 2,
    prompt: "Describe your favourite school subject and explain why you enjoy it.",
    handwriting:
      "My favourite school subject is Art because I love drawing and using different colours. Every week I look forward to painting new pictures. It makes me feel happy and relaxed after a long day of lessons.",
  },
];

/* per-question marking recipe used on the result screen */
const QR_RESULTS = {
  1: { correct: true, marks: 2, max: 2 },
  2: { correct: true, marks: 2, max: 2 },
  3: { correct: false, marks: 0, max: 2 },
  4: { correct: true, marks: 2, max: 2 },
  5: { correct: false, marks: 0, max: 2 },
};

const QR_HIGHLIGHTS = {
  1: [
    { find: "3x + 5 = 20", cls: "qr-mark-blue", verdict: "info", remark: "Correctly restated the equation before solving." },
    { find: "x = 5", cls: "qr-mark-green", verdict: "correct", remark: "Correct final answer." },
  ],
  2: [
    { find: "My favourite animal is a cat", cls: "qr-mark-blue", verdict: "info", remark: "Clear topic sentence introducing the subject." },
    {
      find: "soft fur, bright round eyes, small pointed ears, long whiskers, and a fluffy tail",
      cls: "qr-mark-green",
      verdict: "correct",
      remark: "Strong descriptive detail using varied adjectives.",
    },
    { find: "but they can also be calm companions", cls: "qr-mark-amber", verdict: "improve", remark: "Slightly awkward phrasing — consider splitting into a new sentence." },
  ],
  3: [
    { find: "2x - 4 = 10", cls: "qr-mark-blue", verdict: "info", remark: "Correctly restated the equation." },
    { find: "x = 6", cls: "qr-mark-amber", verdict: "improve", remark: "Arithmetic error: 14 ÷ 2 = 7, not 6." },
  ],
  4: [
    { find: "15/20", cls: "qr-mark-blue", verdict: "info", remark: "Correct starting fraction identified." },
    { find: "Answer: 3/4", cls: "qr-mark-green", verdict: "correct", remark: "Correctly simplified to lowest terms." },
  ],
  5: [
    { find: "My favourite school subject is Art", cls: "qr-mark-blue", verdict: "info", remark: "Clear topic sentence." },
    { find: "It makes me feel happy and relaxed", cls: "qr-mark-amber", verdict: "improve", remark: "Good reasoning, but could be more specific — mention a lesson or activity." },
  ],
};

const QR_VERDICT_LABEL = {
  correct: "Correct",
  improve: "Needs Improvement",
  info: "Info",
};

const QR_CORRECTIONS = {
  1: "Working shown is correct — x = 5.",
  2: "Great descriptive detail. Consider splitting the last sentence into two for clarity.",
  3: "Arithmetic slip: 14 ÷ 2 = 7, not 6. Review the division step.",
  4: "Simplification steps and final fraction are correct.",
  5: "Good reasoning. Try adding a specific example of a lesson you enjoyed.",
};

/* ---------- state ---------- */
const answers = {}; // { [questionId]: { mode: 'typed'|'photo'|'text', text } }
let currentIndex = 0;
let paperTargetIndex = null;
let timerSeconds = 5 * 60;
let timerHandle = null;

/* ---------- toast (same pattern as flow-1&2) ---------- */
function showToast(title, message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-icon">✓</span>
    <div class="toast-copy">
      <p class="toast-title">${title}</p>
      <p class="toast-message">${message}</p>
    </div>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function openModal(modal) {
  modal.classList.add("open");
}
function closeModal(modal) {
  modal.classList.remove("open");
}

/* ---------- timer ---------- */
function formatTimer(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function startTimer() {
  document.getElementById("qz-timer-text").textContent = formatTimer(timerSeconds);
  timerHandle = setInterval(() => {
    if (timerSeconds <= 0) {
      clearInterval(timerHandle);
      return;
    }
    timerSeconds -= 1;
    document.getElementById("qz-timer-text").textContent = formatTimer(timerSeconds);
  }, 1000);
}

/* ---------- quiz-taking screen render ---------- */
function renderDots() {
  const wrap = document.getElementById("qz-dots");
  wrap.innerHTML = "";
  QUIZ_QUESTIONS.forEach((q, idx) => {
    if (idx > 0) {
      const connector = document.createElement("div");
      connector.className = "wr-dot-connector";
      wrap.appendChild(connector);
    }
    const ans = answers[q.id];
    const dot = document.createElement("div");
    dot.className = "qz-dot" + (ans ? " qz-dot--answered" : "") + (idx === currentIndex ? " active" : "");
    dot.textContent = q.id;
    dot.addEventListener("click", () => {
      currentIndex = idx;
      renderQuestion();
    });
    if (ans && ans.mode !== "typed") {
      const badge = document.createElement("span");
      badge.className = "qz-dot-badge";
      badge.innerHTML =
        '<svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M8 11V6a2 2 0 114 0v4M12 10V5a2 2 0 114 0v6M16 11V8a2 2 0 114 0v6a6 6 0 01-6 6H10a5 5 0 01-4-2l-2.5-3.5a1.5 1.5 0 012.3-1.9L8 14" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      dot.appendChild(badge);
    }
    wrap.appendChild(dot);
  });
}

function updateProgress() {
  const answeredCount = QUIZ_QUESTIONS.filter((q) => answers[q.id]).length;
  const pct = Math.round((answeredCount / QUIZ_QUESTIONS.length) * 100);
  document.getElementById("qz-progress-value").textContent = `${answeredCount}/${QUIZ_QUESTIONS.length} Questions (${pct}%)`;
  document.getElementById("qz-progress-fill").style.width = `${pct}%`;
}

function renderAnswerArea(question) {
  const area = document.getElementById("qz-answer-area");
  const ans = answers[question.id];

  if (!ans) {
    area.innerHTML = `
      <textarea class="qz-type-answer" id="qz-typed-input" placeholder="Type your answer here...">${""}</textarea>
      <div class="qz-answer-divider"><span>or</span></div>
      <button class="btn btn-outline" id="qz-answer-on-paper">Answer on Paper</button>
    `;
    const textarea = document.getElementById("qz-typed-input");
    textarea.addEventListener("change", () => {
      if (textarea.value.trim()) {
        answers[question.id] = { mode: "typed", text: textarea.value.trim() };
        renderDots();
        updateProgress();
      }
    });
    document.getElementById("qz-answer-on-paper").addEventListener("click", () => openAddPaperModal());
    return;
  }

  if (ans.mode === "typed") {
    area.innerHTML = `
      <textarea class="qz-type-answer" id="qz-typed-input">${escapeHtml(ans.text)}</textarea>
      <div class="qz-answer-divider"><span>or</span></div>
      <button class="btn btn-outline" id="qz-answer-on-paper">Answer on Paper</button>
    `;
    const textarea = document.getElementById("qz-typed-input");
    textarea.addEventListener("change", () => {
      answers[question.id].text = textarea.value.trim();
    });
    document.getElementById("qz-answer-on-paper").addEventListener("click", () => openAddPaperModal());
    return;
  }

  if (ans.mode === "photo") {
    area.innerHTML = `
      <div class="qz-paper-summary">
        <div class="qz-paper-thumb"><div class="wr-handwriting">${escapeHtml(ans.text)}</div></div>
        <div class="qz-paper-summary-body">
          <a class="link-text" id="qz-view-answer-link" href="#">View Your Answer</a>
          <span class="qz-answered-pill">Answered using paper answer</span>
        </div>
      </div>
    `;
    document.getElementById("qz-view-answer-link").addEventListener("click", (e) => {
      e.preventDefault();
      openViewAnswerModal(question);
    });
    return;
  }

  if (ans.mode === "text") {
    area.innerHTML = `
      <div class="qz-text-summary-box">${escapeHtml(ans.text)}</div>
      <button class="btn btn-outline" id="qz-answer-using-paper">Answer using Paper</button>
    `;
    document.getElementById("qz-answer-using-paper").addEventListener("click", () => openAddPaperModal());
  }
}

function renderQuestion() {
  const question = QUIZ_QUESTIONS[currentIndex];
  document.getElementById("qz-question-title").textContent = question.title;
  document.getElementById("qz-question-marks").textContent = `${question.marks} Mark${question.marks === 1 ? "" : "s"}`;
  document.getElementById("qz-question-prompt").textContent = question.prompt;
  document.getElementById("qz-prev-q").disabled = currentIndex === 0;
  document.getElementById("qz-next-q").disabled = currentIndex === QUIZ_QUESTIONS.length - 1;
  renderAnswerArea(question);
  renderDots();
  updateProgress();
}

/* ---------- paper-answer capture chain ---------- */
function openAddPaperModal() {
  paperTargetIndex = currentIndex;
  openModal(document.getElementById("modal-add-paper"));
}

function beginCheckAnswer() {
  closeModal(document.getElementById("modal-add-paper"));
  const question = QUIZ_QUESTIONS[paperTargetIndex];
  document.getElementById("qz-check-handwriting").textContent = question.handwriting;
  runCheckAnswerScan();
  openModal(document.getElementById("modal-check-answer"));
}

function runCheckAnswerScan() {
  const banner = document.getElementById("qz-check-banner");
  const title = document.getElementById("qz-check-banner-title");
  const desc = document.getElementById("qz-check-banner-desc");
  const icon = document.getElementById("qz-check-banner-icon");
  const submitBtn = document.getElementById("qz-submit-photo");

  banner.classList.remove("qz-check-banner--success");
  icon.classList.remove("qz-check-banner-icon--success");
  title.textContent = "Checking uploaded content.";
  desc.textContent = "Analyzing photo clarity and detecting your handwriting.";
  icon.innerHTML = '<span class="toast-spinner"></span>';
  submitBtn.disabled = true;

  setTimeout(() => {
    banner.classList.add("qz-check-banner--success");
    icon.classList.add("qz-check-banner-icon--success");
    title.textContent = "Photo looks clear!";
    desc.textContent = "We can see the full page and your handwriting.";
    icon.innerHTML = "✓";
    submitBtn.disabled = false;
  }, 1400);
}

function openConvertModal() {
  closeModal(document.getElementById("modal-check-answer"));
  const question = QUIZ_QUESTIONS[paperTargetIndex];
  document.getElementById("qz-convert-handwriting").textContent = question.handwriting;
  document.getElementById("qz-convert-textarea").value = question.handwriting.replace(/\n/g, " ");
  openModal(document.getElementById("modal-check-convert"));
}

function openViewAnswerModal(question) {
  document.getElementById("qz-view-handwriting").textContent = question.handwriting;
  openModal(document.getElementById("modal-view-answer"));
}

function wireModals() {
  document.getElementById("qz-take-photo").addEventListener("click", beginCheckAnswer);
  document.getElementById("qz-choose-device").addEventListener("click", beginCheckAnswer);

  document.getElementById("qz-retake-photo").addEventListener("click", runCheckAnswerScan);
  document.getElementById("qz-edit-as-text").addEventListener("click", openConvertModal);
  document.getElementById("qz-submit-photo").addEventListener("click", () => {
    const question = QUIZ_QUESTIONS[paperTargetIndex];
    answers[question.id] = { mode: "photo", text: question.handwriting };
    closeModal(document.getElementById("modal-check-answer"));
    if (paperTargetIndex === currentIndex) renderQuestion();
    else {
      renderDots();
      updateProgress();
    }
    showToast("Answer submitted", `Your paper answer for ${question.title} has been saved.`);
  });

  document.getElementById("qz-use-photo-instead").addEventListener("click", () => {
    closeModal(document.getElementById("modal-check-convert"));
    openModal(document.getElementById("modal-check-answer"));
  });
  document.getElementById("qz-submit-text").addEventListener("click", () => {
    const question = QUIZ_QUESTIONS[paperTargetIndex];
    const text = document.getElementById("qz-convert-textarea").value.trim();
    answers[question.id] = { mode: "text", text };
    closeModal(document.getElementById("modal-check-convert"));
    if (paperTargetIndex === currentIndex) renderQuestion();
    else {
      renderDots();
      updateProgress();
    }
    showToast("Answer submitted", `Your converted answer for ${question.title} has been saved.`);
  });

  document.getElementById("qz-view-edit-as-text").addEventListener("click", () => {
    closeModal(document.getElementById("modal-view-answer"));
    openConvertModal();
  });
  document.getElementById("close-view-answer-x").addEventListener("click", () => {
    closeModal(document.getElementById("modal-view-answer"));
  });

  [...document.querySelectorAll(".modal-overlay")].forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });
}

/* ---------- quiz result / marking screen ---------- */
function buildHighlightedHtml(question) {
  let html = escapeHtml(question.handwriting).replace(/\n/g, "<br>");
  const recipe = QR_HIGHLIGHTS[question.id] || [];
  recipe.forEach(({ find, cls, verdict, remark }) => {
    const escaped = escapeHtml(find);
    html = html.replace(
      escaped,
      `<mark class="${cls}" data-verdict="${verdict}" data-remark="${escapeHtml(remark)}">${escaped}</mark>`
    );
  });
  return html;
}

function buildQrPanelHtml(question) {
  const result = QR_RESULTS[question.id];
  return `
    <div class="qr-panel" id="qr-panel-${question.id}">
      <div class="qr-tabs">
        <button class="qr-tab active" data-tab="question">Question ${question.id}<span class="qr-tab-sub">Q${question.id}</span></button>
        <button class="qr-tab" data-tab="attachment">Attachment</button>
        <button class="qr-tab" data-tab="notes">Notes</button>
        <button class="qr-tab" data-tab="video">Video</button>
        <button class="qr-tab" data-tab="correction">Correction</button>
        <button class="qr-review-btn" data-review>Review Question</button>
      </div>

      <div class="qr-panel-body">
        <p class="qr-stat-line"><span>⚠</span> Question Statistics</p>
        <div class="qr-group-stats" data-group-stats>Class average: <strong>${(result.max * 0.7).toFixed(1)} / ${result.max}</strong> · ${60 + question.id * 3}% answered this question well.</div>

        <div class="qr-tab-content active" data-panel="question">
          <p class="qr-label">Question Text:</p>
          <p class="qr-question-text">${escapeHtml(question.prompt)}</p>

          <p class="qr-label" style="margin-top:20px;">Answers:</p>
          <div class="qr-ai-banner">This answer has been reviewed by AI! <span>✨</span></div>

          <div class="qz-photo-stage qr-photo-stage">
            <div class="qz-photo-page qz-photo-page--capture">
              <div class="wr-handwriting qz-handwriting-text qr-highlighted-text">${buildHighlightedHtml(question)}</div>
            </div>
          </div>

          <div class="qr-feedback-panel" data-feedback-panel hidden>
            <p class="qr-feedback-label">Selected Feedback</p>
            <p class="qr-feedback-quote" data-feedback-quote></p>
            <p class="qr-feedback-remark" data-feedback-remark></p>
            <span class="qr-feedback-pill" data-feedback-pill></span>
          </div>

          <p class="qr-plain-text">${escapeHtml(question.handwriting.replace(/\n/g, " "))}</p>
          <p class="qr-words-count">Words Count: ${question.handwriting.trim().split(/\s+/).length}</p>
          <p class="qr-marks-obtained">Marks obtained: <strong>${result.marks} / ${result.max} Marks</strong></p>
        </div>

        <div class="qr-tab-content" data-panel="attachment"><p class="page-sub">Original photo captured by the student for this question.</p></div>
        <div class="qr-tab-content" data-panel="notes"><p class="page-sub">No notes added for this question yet.</p></div>
        <div class="qr-tab-content" data-panel="video"><p class="page-sub">No video walkthrough available for this question.</p></div>
        <div class="qr-tab-content" data-panel="correction"><p class="page-sub">${escapeHtml(QR_CORRECTIONS[question.id] || "")}</p></div>

        <a class="send-feedback-link qr-send-feedback" href="#">Send Feedback</a>
      </div>
    </div>`;
}

function renderQrList() {
  const list = document.getElementById("qr-list");
  list.innerHTML = QUIZ_QUESTIONS.map(buildQrPanelHtml).join("");

  list.querySelectorAll(".qr-panel").forEach((panel) => {
    panel.querySelectorAll(".qr-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        panel.querySelectorAll(".qr-tab").forEach((t) => t.classList.remove("active"));
        panel.querySelectorAll(".qr-tab-content").forEach((c) => c.classList.remove("active"));
        tab.classList.add("active");
        panel.querySelector(`.qr-tab-content[data-panel="${tab.dataset.tab}"]`).classList.add("active");
      });
    });
    panel.querySelector("[data-review]").addEventListener("click", () => {
      panel.querySelector("[data-group-stats]").classList.toggle("open");
    });

    panel.querySelectorAll(".qr-highlighted-text mark").forEach((mark) => {
      mark.addEventListener("click", () => {
        panel.querySelectorAll(".qr-highlighted-text mark").forEach((m) => m.classList.remove("qr-mark-active"));
        mark.classList.add("qr-mark-active");

        const feedbackPanel = panel.querySelector("[data-feedback-panel]");
        const verdict = mark.dataset.verdict;
        feedbackPanel.querySelector("[data-feedback-quote]").textContent = `"${mark.textContent.trim()}"`;
        feedbackPanel.querySelector("[data-feedback-remark]").textContent = mark.dataset.remark;
        const pill = feedbackPanel.querySelector("[data-feedback-pill]");
        pill.textContent = QR_VERDICT_LABEL[verdict] || "Info";
        pill.className = "qr-feedback-pill qr-feedback-pill--" + verdict;
        feedbackPanel.hidden = false;
      });
    });
  });

  const totalMarks = QUIZ_QUESTIONS.reduce((sum, q) => sum + QR_RESULTS[q.id].marks, 0);
  const totalMax = QUIZ_QUESTIONS.reduce((sum, q) => sum + QR_RESULTS[q.id].max, 0);
  const pct = Math.round((totalMarks / totalMax) * 100);
  document.getElementById("qr-score-pill").textContent = `ⓘ ${totalMarks}/${totalMax} Marks (${pct}%)`;
}

function renderQrDots() {
  const wrap = document.getElementById("qr-dots");
  wrap.innerHTML = "";
  QUIZ_QUESTIONS.forEach((q, idx) => {
    if (idx > 0) {
      const connector = document.createElement("div");
      connector.className = "wr-dot-connector";
      wrap.appendChild(connector);
    }
    const result = QR_RESULTS[q.id];
    const dot = document.createElement("div");
    dot.className = "wr-dot " + (result.correct ? "wr-dot--correct" : "wr-dot--incorrect") + (idx === 0 ? " active" : "");
    dot.textContent = q.id;
    dot.addEventListener("click", () => {
      wrap.querySelectorAll(".wr-dot").forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");
      const panel = document.getElementById(`qr-panel-${q.id}`);
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    wrap.appendChild(dot);
  });
}

function wireQrExit() {
  document.getElementById("qr-exit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("screen-quiz-result").hidden = true;
    document.getElementById("screen-quiz").hidden = false;
  });
}

/* ---------- top-level wiring ---------- */
function wireQuizShell() {
  document.getElementById("qz-prev-q").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
    }
  });
  document.getElementById("qz-next-q").addEventListener("click", () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      currentIndex += 1;
      renderQuestion();
    }
  });
  document.getElementById("qz-save-exit").addEventListener("click", () => {
    showToast("Progress saved", "You can continue this quiz anytime before the deadline.");
  });
  document.getElementById("qz-submit-quiz").addEventListener("click", () => {
    document.getElementById("screen-quiz").hidden = true;
    document.getElementById("screen-quiz-result").hidden = false;
    renderQrList();
    renderQrDots();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuestion();
  wireQuizShell();
  wireModals();
  wireQrExit();
  startTimer();
});
