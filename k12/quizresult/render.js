// Renders the on-screen Quiz Result view from `quizResult` (data.js).

function marksClass(obtained, max) {
  if (obtained === null || obtained === undefined) return "marks--none";
  if (obtained === 0) return "marks--zero";
  if (obtained === max) return "marks--full";
  return "marks--partial";
}

function marksLabel(obtained, max) {
  if (obtained === null || obtained === undefined) return "No Answer";
  return `${obtained}/${max} Marks`;
}

function renderTopbar() {
  document.getElementById("marksBadge").textContent =
    `${quizResult.totalMarks}/${quizResult.maxMarks} Marks (${quizResult.percentage}%)`;
  document.getElementById("studentName").textContent = quizResult.studentName;
  document.getElementById("attempt").textContent = quizResult.attempt;
}

function renderNav() {
  const nav = document.getElementById("qnav");
  nav.innerHTML = quizResult.questions
    .map((q) => `<div class="qnav__item">${q.number}</div>`)
    .join("");
}

function renderQuestions() {
  const container = document.getElementById("questions");
  container.innerHTML = quizResult.questions.map(renderQuestionCard).join("");
}

function renderQuestionCard(q) {
  const parts = [];
  parts.push(`
    <div class="question-card">
      <div class="question-card__header">
        <span class="question-card__number">Question ${q.number}</span>
        <span class="question-card__marks ${marksClass(q.marksObtained, q.maxMarks)}">
          ${marksLabel(q.marksObtained, q.maxMarks)}
        </span>
      </div>
  `);

  if (q.prompt) {
    parts.push(`<p class="question-card__prompt">${q.prompt}</p>`);
  }

  if (q.type === "rewrite") {
    parts.push(`<p class="question-card__passage">${q.passage}</p>`);
    parts.push(
      q.studentAnswer
        ? `<div class="answer-block">${q.studentAnswer}</div>`
        : `<div class="answer-block answer-block--empty">No Answer</div>`
    );
    parts.push(`
      <div class="model-answer">
        <strong>Model Answer</strong>
        ${q.modelAnswer}
      </div>
    `);
    if (q.aiFeedback) {
      parts.push(`
        <div class="ai-feedback">
          <strong>AI Feedback &middot; ${q.aiFeedback.style}</strong>
          ${q.aiFeedback.text}
        </div>
      `);
    }
  } else if (q.type === "mcq") {
    if (q.question) {
      parts.push(`<p class="question-card__question">${q.question}</p>`);
    }
    parts.push(`
      <ul class="options">
        ${q.options
          .map((opt) => `<li class="${opt.correct ? "correct" : ""}">${opt.text}</li>`)
          .join("")}
      </ul>
    `);
    if (!q.studentAnswer) {
      parts.push(`<div class="answer-block answer-block--empty">The student has not answered this question</div>`);
    }
  }

  parts.push(`</div>`);
  return parts.join("");
}

function init() {
  renderTopbar();
  renderNav();
  renderQuestions();
}

document.addEventListener("DOMContentLoaded", init);
