"use strict";

/* same fractions-worksheet dataset used in the teacher-side reviewer (app.js), so both
   flows show identical, consistent results for "Worksheet Name" */
const F4_QUESTIONS = [
  {
    id: 1,
    prompt: "Simplify 12/16 to its lowest terms and show your working.",
    handwriting: "12/16 = 6/8\n= 3/4",
    correctAnswer: "3/4",
    remarks: "Correct! You simplified the fraction fully and showed clear working.",
    status: "correct",
    marksObtained: 1,
    maxMarks: 1,
  },
  {
    id: 2,
    prompt: "Simplify 8/12 to its lowest terms and show your working.",
    handwriting: "8/12 = 4/6",
    correctAnswer: "2/3",
    remarks: "You divided by 2 correctly but stopped before fully simplifying. 4/6 can still be reduced to 2/3.",
    status: "incorrect",
    marksObtained: 0,
    maxMarks: 1,
  },
  {
    id: 3,
    prompt: "Add 1/4 + 1/2. Give your answer as a single fraction.",
    handwriting: "1/4 + 2/4 = 3/4",
    correctAnswer: "3/4",
    remarks: "Nice work — the common denominator and addition are both correct.",
    status: "correct",
    marksObtained: 1,
    maxMarks: 1,
  },
  {
    id: 4,
    prompt: "Convert 11/4 into a mixed number.",
    handwriting: "11/4 = 2 r3\n= 2 3/4",
    correctAnswer: "2 3/4",
    remarks: "Correct conversion from improper fraction to mixed number.",
    status: "correct",
    marksObtained: 1,
    maxMarks: 1,
  },
  {
    id: 5,
    prompt: "Explain why 2/3 and 8/12 are equivalent fractions.",
    handwriting: "2/3 x 4/4 = 8/12",
    correctAnswer: "2/3 x 4/4 = 8/12, so they are equal",
    remarks: "Good calculation, but explain WHY using multiplication, not just showing the equation.",
    status: "incorrect",
    marksObtained: 0,
    maxMarks: 1,
  },
];

let f4ActiveQid = 1;

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

function openModal(modal) {
  modal.classList.add("open");
}
function closeModal(modal) {
  modal.classList.remove("open");
}

/* ---------- upload chain ---------- */
function wireUploadChain() {
  const reviewModal = document.getElementById("modal-review-upload");
  const processingModal = document.getElementById("modal-f4-processing");
  const completeModal = document.getElementById("modal-f4-complete");

  document.getElementById("f4-upload-btn").addEventListener("click", () => {
    document.getElementById("f4-confirm-checkbox").checked = true;
    openModal(reviewModal);
  });

  document.getElementById("f4-download-link").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Downloading worksheet", "Worksheet Name.pdf will be saved to your device.");
  });

  document.getElementById("f4-reupload-btn").addEventListener("click", () => {
    showToast("Choose a new file", "Select a photo or scan to replace the current upload.");
  });

  document.getElementById("f4-submit-worksheet-btn").addEventListener("click", () => {
    closeModal(reviewModal);
    openModal(processingModal);
    setTimeout(() => {
      closeModal(processingModal);
      openModal(completeModal);
    }, 1800);
  });

  document.getElementById("f4-back-dashboard-btn").addEventListener("click", () => {
    closeModal(completeModal);
    document.getElementById("f4-action-area").hidden = true;
    document.getElementById("f4-result-area").hidden = false;
  });

  document.getElementById("f4-view-result-btn").addEventListener("click", () => {
    document.getElementById("screen-challenge").hidden = true;
    document.getElementById("screen-f4-result").hidden = false;
    renderF4Result();
  });

  document.getElementById("f4-result-exit-btn").addEventListener("click", () => {
    document.getElementById("screen-f4-result").hidden = true;
    document.getElementById("screen-challenge").hidden = false;
  });

  [...document.querySelectorAll(".modal-overlay")].forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });
}

/* ---------- worksheet reviewer result ---------- */
function computeF4Score() {
  const total = F4_QUESTIONS.reduce((sum, q) => sum + q.maxMarks, 0);
  const obtained = F4_QUESTIONS.reduce((sum, q) => sum + q.marksObtained, 0);
  return { total, obtained, percent: total ? Math.round((obtained / total) * 100) : 0 };
}

function renderF4ScorePill() {
  const { total, obtained, percent } = computeF4Score();
  document.getElementById("f4-score-pill").textContent = `ⓘ ${obtained}/${total} Marks (${percent}%)`;
}

function renderF4Dots() {
  const wrap = document.getElementById("f4-dots");
  wrap.innerHTML = F4_QUESTIONS.map(
    (q, idx) => `
      <div class="wr-dot wr-dot--${q.status === "correct" ? "correct" : "incorrect"} ${q.id === f4ActiveQid ? "active" : ""}" data-qid="${q.id}">${q.id}</div>
      ${idx < F4_QUESTIONS.length - 1 ? '<div class="wr-dot-connector"></div>' : ""}
    `
  ).join("");
}

function renderF4ScanPage() {
  const questionsHtml = F4_QUESTIONS.map(
    (q) => `
      <div class="wr-question">
        <p class="wr-question-num">${q.id}. ${q.prompt}</p>
        <div class="wr-answer-box wr-answer-box--${q.status} ${q.id === f4ActiveQid ? "active" : ""}" data-qid="${q.id}">
          <div class="wr-handwriting">${q.handwriting}</div>
        </div>
      </div>
    `
  ).join("");

  document.getElementById("f4-scan-page").innerHTML = `
    <div class="scan-page-head">
      <span class="scan-worksheet-name">WORKSHEET NAME</span>
      <span class="scan-student-meta">NAME: AMELIA TAN<br />CLASS: NEWTON CLASS</span>
    </div>
    ${questionsHtml}
  `;
}

function selectF4Question(qid) {
  f4ActiveQid = qid;
  renderF4Dots();
  document.querySelectorAll("#f4-scan-page .wr-answer-box").forEach((box) => {
    box.classList.toggle("active", Number(box.getAttribute("data-qid")) === qid);
  });

  const q = F4_QUESTIONS.find((item) => item.id === qid);
  const isCorrect = q.status === "correct";

  document.getElementById("f4-detail-panel").innerHTML = `
    <span class="wr-detail-qtab">Question ${q.id}</span>
    <p class="wr-detail-label">Correct Answer</p>
    <p class="wr-detail-value">${q.correctAnswer}</p>
    <p class="wr-detail-label">Remarks</p>
    <p class="wr-detail-remarks">${q.remarks}</p>
    <span class="wr-detail-pill wr-detail-pill--${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "Answered Correct" : "Answered Incorrect"}</span>
    <div class="wr-marks-row">
      <span class="wr-detail-label" style="margin:0;">Marks obtained:</span>
      <span class="wr-marks-select">${q.marksObtained} ✨</span>
    </div>
  `;
}

function renderF4Result() {
  f4ActiveQid = 1;
  renderF4ScorePill();
  renderF4Dots();
  renderF4ScanPage();
  selectF4Question(1);
}

function wireF4ResultInteractions() {
  document.getElementById("f4-dots").addEventListener("click", (e) => {
    const dot = e.target.closest(".wr-dot");
    if (!dot) return;
    selectF4Question(Number(dot.getAttribute("data-qid")));
  });

  document.getElementById("f4-scan-page").addEventListener("click", (e) => {
    const box = e.target.closest(".wr-answer-box");
    if (!box) return;
    selectF4Question(Number(box.getAttribute("data-qid")));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireUploadChain();
  wireF4ResultInteractions();
});
