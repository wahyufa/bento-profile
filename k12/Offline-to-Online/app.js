/* HeyHi Figma-based prototype — Worksheet list → Generate Worksheet → Upload Result */

// Single source of truth: which worksheet the Upload Result flow is uploading results for.
const ACTIVE_WORKSHEET_NAME = "Fractions Practice";

const kebabBtn = document.getElementById("kebab-btn");
const generateDropdown = document.getElementById("generate-dropdown");
const openUploadResultBtn = document.getElementById("open-upload-result");
const uploadResultModal = document.getElementById("modal-upload-result");
const closeUploadResultBtn = document.getElementById("close-upload-result");
const closeUploadResultX = document.getElementById("close-upload-result-x");
const alreadyMarkedToggle = document.getElementById("already-marked-toggle");
const matchSubmissionsBtn = document.getElementById("match-submissions-btn");
const howItWorksLink = document.getElementById("how-it-works-link");
const howItWorksPopover = document.getElementById("how-it-works-popover");
const chooseFilesBtn = document.getElementById("choose-files-btn");
const filePickerCount = document.getElementById("file-picker-count");
const fileListEl = document.getElementById("file-list");

function toggleDropdown(open) {
  generateDropdown.classList.toggle("open", open);
}

kebabBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown(!generateDropdown.classList.contains("open"));
});

document.addEventListener("click", (e) => {
  if (!generateDropdown.contains(e.target) && e.target !== kebabBtn) {
    toggleDropdown(false);
  }
  if (!howItWorksPopover.contains(e.target) && e.target !== howItWorksLink) {
    howItWorksPopover.classList.remove("open");
  }
});

function openModal(modal) {
  modal.classList.add("open");
}

function closeModal(modal) {
  modal.classList.remove("open");
}

/* ---------- top-right toast notifications ---------- */

const toastContainer = document.getElementById("toast-container");

function showToast(variant, title, message) {
  const toast = document.createElement("div");
  toast.className = `toast toast--${variant}`;
  toast.innerHTML = `
    <span class="toast-icon">${variant === "success" ? CHECK_ICON_SVG : "!"}</span>
    <div class="toast-copy">
      <p class="toast-title">${title}</p>
      <p class="toast-message">${message}</p>
    </div>
  `;
  toastContainer.appendChild(toast);
  window.setTimeout(() => toast.classList.add("visible"), 10);
  window.setTimeout(() => {
    toast.classList.remove("visible");
    window.setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ---------- file picker: starts empty, "Choose Files" adds one at a time ---------- */

let files = [];

function renderFiles() {
  fileListEl.innerHTML = files
    .map((f) => `<div class="file-row"><span class="file-name">${f.name}</span><span class="file-size">${f.size}</span></div>`)
    .join("");
  filePickerCount.textContent = files.length === 0 ? "No files chosen" : `${files.length} file${files.length > 1 ? "s" : ""}`;
  matchSubmissionsBtn.disabled = files.length === 0;
}

function resetFiles() {
  files = [];
  renderFiles();
}

chooseFilesBtn.addEventListener("click", () => {
  const nextIndex = files.length + 1;
  files.push({ name: `Upload Answer ${nextIndex}.png`, size: "156.4 KB" });
  renderFiles();
});

openUploadResultBtn.addEventListener("click", () => {
  toggleDropdown(false);
  resetFiles();
  openModal(uploadResultModal);
});

closeUploadResultBtn.addEventListener("click", () => closeModal(uploadResultModal));
closeUploadResultX.addEventListener("click", () => closeModal(uploadResultModal));

uploadResultModal.addEventListener("click", (e) => {
  if (e.target === uploadResultModal) closeModal(uploadResultModal);
});

/* ---------- already marked toggle ---------- */

let alreadyMarked = true;

alreadyMarkedToggle.addEventListener("click", () => {
  alreadyMarked = !alreadyMarked;
  alreadyMarkedToggle.classList.toggle("active", alreadyMarked);
  alreadyMarkedToggle.setAttribute("aria-pressed", String(alreadyMarked));
});

/* ---------- how it works popover ---------- */

howItWorksLink.addEventListener("click", (e) => {
  e.preventDefault();
  howItWorksPopover.classList.toggle("open");
});

/* ---------- match submissions -> Check Student Matches (loading -> table) ---------- */

const checkMatchesModal = document.getElementById("modal-check-matches");
const checkMatchesWorksheetLine = document.getElementById("check-matches-worksheet-line");
const checkMatchesSubtitle = document.getElementById("check-matches-subtitle");
const checkMatchesLoading = document.getElementById("check-matches-loading");
const checkMatchesTable = document.getElementById("check-matches-table");
const checkMatchesFoot = document.getElementById("check-matches-foot");
const matchRowsEl = document.getElementById("match-rows");
const closeCheckMatchesX = document.getElementById("close-check-matches-x");
const checkMatchesBack = document.getElementById("check-matches-back");
const confirmProcessBtn = document.getElementById("confirm-process-btn");

let submissionRows = [];

function seedSubmissionRows() {
  submissionRows = [
    { file: "Upload Answer 1.png", student: "Amelia Tan", className: "Newton Class", status: "good" },
    { file: "Upload Answer 2.png", student: null, className: null, status: "needs-review" },
    { file: "Upload Answer 3.png", student: "Nadia Rahman", className: "Newton Class", status: "good" },
  ];
}

function renderMatchRows() {
  const needsReviewCount = submissionRows.filter((r) => r.status === "needs-review").length;
  checkMatchesWorksheetLine.hidden = false;
  checkMatchesSubtitle.textContent = `Student submission detected: ${submissionRows.length} Students${
    needsReviewCount > 0 ? ` (${needsReviewCount} Need Review)` : ""
  }`;

  matchRowsEl.innerHTML = submissionRows
    .map((row, idx) => {
      const isGood = row.status === "good";
      return `
        <div class="match-row match-row--body">
          <span class="match-file">${row.file}</span>
          <span class="match-student">${row.student || '<span class="match-muted">-</span>'}</span>
          <span class="match-student ${!row.className ? "match-muted" : ""}">${row.className || "-"}</span>
          <span class="match-status ${isGood ? "match-status--good" : "match-status--review"}">${isGood ? "Good" : "Needs Review"}</span>
          <button class="match-action-btn ${isGood ? "match-action-btn--preview" : "match-action-btn--resolve"}" data-row-idx="${idx}" data-action="${isGood ? "preview" : "resolve"}">
            ${isGood ? "Preview" : "Resolve"}
          </button>
        </div>
      `;
    })
    .join("");

  confirmProcessBtn.disabled = needsReviewCount > 0;
}

matchRowsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".match-action-btn");
  if (!btn) return;
  const idx = Number(btn.getAttribute("data-row-idx"));
  const action = btn.getAttribute("data-action");
  if (action === "preview") openReviewMatch(submissionRows[idx]);
  else openResolveStudent(idx);
});

matchSubmissionsBtn.addEventListener("click", () => {
  if (matchSubmissionsBtn.disabled) return;
  closeModal(uploadResultModal);
  seedSubmissionRows();

  checkMatchesWorksheetLine.hidden = true;
  checkMatchesSubtitle.textContent = "Detecting worksheet and matching students…";
  checkMatchesLoading.hidden = false;
  checkMatchesTable.hidden = true;
  checkMatchesFoot.hidden = true;
  openModal(checkMatchesModal);

  window.setTimeout(() => {
    checkMatchesLoading.hidden = true;
    checkMatchesTable.hidden = false;
    checkMatchesFoot.hidden = false;
    renderMatchRows();
  }, 1600);
});

closeCheckMatchesX.addEventListener("click", () => closeModal(checkMatchesModal));
checkMatchesModal.addEventListener("click", (e) => {
  if (e.target === checkMatchesModal) closeModal(checkMatchesModal);
});
checkMatchesBack.addEventListener("click", () => {
  closeModal(checkMatchesModal);
  openModal(uploadResultModal);
});

confirmProcessBtn.addEventListener("click", () => {
  if (confirmProcessBtn.disabled) return;
  closeModal(checkMatchesModal);
  startProcessing();
});

/* ---------- processing submission (screen 8/9): checklist + minimizable toast ---------- */

const processingModal = document.getElementById("modal-processing");
const closeProcessingX = document.getElementById("close-processing-x");
const processingStepsEl = document.getElementById("processing-steps");
const processingToast = document.getElementById("processing-toast");
const processingToastText = document.getElementById("processing-toast-text");
const processingToastView = document.getElementById("processing-toast-view");

const PROCESSING_STEP_LABELS = ["Pages separated and cleaned", "Answers matched to questions", "Marks and feedback generated", "Results prepared for review"];

const CHECK_ICON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let processingCompleted = 0;
let processingTimer = null;

function renderProcessingSteps() {
  processingStepsEl.innerHTML = PROCESSING_STEP_LABELS.map((label, idx) => {
    const stepNum = idx + 1;
    let state = "waiting";
    if (stepNum <= processingCompleted) state = "complete";
    else if (stepNum === processingCompleted + 1) state = "active";

    const icon = state === "complete" ? CHECK_ICON_SVG : String(stepNum);
    const statusLabel = state === "complete" ? "Complete" : state === "active" ? "In Progress" : "Waiting";

    return `
      <div class="processing-step">
        <span class="processing-step-icon processing-step-icon--${state}">${icon}</span>
        <span class="processing-step-label">${label}</span>
        <span class="processing-step-status processing-step-status--${state}">${statusLabel}</span>
      </div>
    `;
  }).join("");

  processingToastText.textContent = `${processingCompleted} of ${PROCESSING_STEP_LABELS.length} process complete`;
}

function startProcessing() {
  processingCompleted = 0;
  processingToast.hidden = true;
  renderProcessingSteps();
  openModal(processingModal);

  if (processingTimer) window.clearInterval(processingTimer);
  processingTimer = window.setInterval(() => {
    processingCompleted += 1;
    renderProcessingSteps();
    if (processingCompleted >= PROCESSING_STEP_LABELS.length) {
      window.clearInterval(processingTimer);
      processingTimer = null;
      window.setTimeout(finishProcessing, 800);
    }
  }, 3000);
}

function finishProcessing() {
  closeModal(processingModal);
  processingToast.hidden = true;
  seedReviewResultRows();
  openModal(reviewResultModal);
  renderReviewResultRows();
  updateFractionsWorksheetStatus();
}

closeProcessingX.addEventListener("click", () => {
  closeModal(processingModal);
  processingToast.hidden = false;
});

processingToastView.addEventListener("click", () => {
  processingToast.hidden = true;
  renderProcessingSteps();
  openModal(processingModal);
});

/* ---------- review result (screens 10/13): score + status per student ---------- */

const reviewResultModal = document.getElementById("modal-review-result");
const closeReviewResultX = document.getElementById("close-review-result-x");
const reviewResultBack = document.getElementById("review-result-back");
const reviewResultRowsEl = document.getElementById("review-result-rows");
const submitPublishBtn = document.getElementById("submit-publish-btn");

const DEMO_SCORES = [70, 100, 45];

let reviewResultRows = [];

function seedReviewResultRows() {
  reviewResultRows = submissionRows.map((row, idx) => ({
    file: row.file,
    student: row.student,
    className: row.className,
    score: DEMO_SCORES[idx] ?? 50,
    reviewStatus: "pending",
  }));
}

/* Keeps the "Fractions Practice" row on My Worksheet in sync with the Upload
   Result flow's reviewResultRows — the whole point of correlating the two.
   Status = students submitted / students assigned (not review progress). */
function updateFractionsWorksheetStatus() {
  const pill = document.getElementById("fractions-status-pill");
  const createdEl = document.getElementById("fractions-created-on");

  const assigned = CLASS_ROSTER.length;
  const submitted = reviewResultRows.length;

  pill.textContent = `${submitted}/${assigned}`;
  pill.className = `status-pill ${submitted === 0 ? "status-pill--neutral" : submitted < assigned ? "status-pill--warn" : "status-pill--ok"}`;

  if (submitted > 0 && createdEl.textContent === "—") {
    createdEl.textContent = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  }
}

function renderReviewResultRows() {
  const allReviewed = reviewResultRows.every((r) => r.reviewStatus === "reviewed");

  reviewResultRowsEl.innerHTML = reviewResultRows
    .map((row, idx) => {
      const isReviewed = row.reviewStatus === "reviewed";
      return `
        <div class="match-row match-row--result match-row--body">
          <span class="match-file">${row.file}</span>
          <span class="match-student">${row.student}</span>
          <span class="match-student">${row.className}</span>
          <span class="match-student">${row.score}%</span>
          <span class="match-status ${isReviewed ? "match-status--good" : "match-status--review"}">${isReviewed ? "Reviewed" : "Pending Review"}</span>
          <button class="match-action-btn match-action-btn--preview" data-row-idx="${idx}">View Result</button>
        </div>
      `;
    })
    .join("");

  submitPublishBtn.disabled = !allReviewed;
}

reviewResultRowsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".match-action-btn");
  if (!btn) return;
  openWorksheetReview(Number(btn.getAttribute("data-row-idx")), {
    rows: reviewResultRows,
    exitModal: reviewResultModal,
    onExit: () => {
      renderReviewResultRows();
      updateFractionsWorksheetStatus();
    },
    worksheetName: ACTIVE_WORKSHEET_NAME,
  });
});

closeReviewResultX.addEventListener("click", () => closeModal(reviewResultModal));
reviewResultBack.addEventListener("click", () => closeModal(reviewResultModal));
reviewResultModal.addEventListener("click", (e) => {
  if (e.target === reviewResultModal) closeModal(reviewResultModal);
});

/* ---------- worksheet reviewer (screens 11/12): full-page, single-question detail ---------- */

const wrScreen = document.getElementById("screen-worksheet-review");
const wrExitBtn = document.getElementById("wr-exit-btn");
const wrStatusPill = document.getElementById("wr-status-pill");
const wrScorePill = document.getElementById("wr-score-pill");
const wrApproveBtn = document.getElementById("wr-approve-btn");
const wrDotsEl = document.getElementById("wr-dots");
const wrScanPageEl = document.getElementById("wr-scan-page");
const wrDetailPanel = document.getElementById("wr-detail-panel");
const wrWorksheetTitle = document.getElementById("wr-worksheet-title");

const WORKSHEET_QUESTIONS = [
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

let wrRowIdx = null;
let wrActiveQid = 1;
let wrQuestions = [];
let wrContext = { rows: [], exitModal: null, onExit: null, worksheetName: "" };

function openWorksheetReview(rowIdx, context) {
  if (context) wrContext = context;
  wrRowIdx = rowIdx;
  wrActiveQid = 1;
  wrQuestions = WORKSHEET_QUESTIONS.map((q) => ({ ...q }));

  const row = wrContext.rows[rowIdx];
  wrWorksheetTitle.textContent = wrContext.worksheetName;

  closeModal(reviewResultModal);
  closeModal(worksheetDetailsModal);
  wrScreen.hidden = false;

  renderWrStatusBar(row.reviewStatus === "reviewed");
  renderWrSwitcher();
  renderWrDots();
  renderWrScanPage(row);
  selectWrQuestion(1, row);
}

function renderWrSwitcher() {
  const row = wrContext.rows[wrRowIdx];
  document.getElementById("wr-switch-label").textContent = `${row.student} (${wrRowIdx + 1} of ${wrContext.rows.length})`;
  document.getElementById("wr-prev-student").disabled = wrRowIdx === 0;
  document.getElementById("wr-next-student").disabled = wrRowIdx === wrContext.rows.length - 1;
}

document.getElementById("wr-prev-student").addEventListener("click", () => {
  if (wrRowIdx > 0) openWorksheetReview(wrRowIdx - 1);
});

document.getElementById("wr-next-student").addEventListener("click", () => {
  if (wrRowIdx < wrContext.rows.length - 1) openWorksheetReview(wrRowIdx + 1);
});

function computeWrScore() {
  const total = wrQuestions.reduce((sum, q) => sum + q.maxMarks, 0);
  const obtained = wrQuestions.reduce((sum, q) => sum + q.marksObtained, 0);
  return { total, obtained, percent: total ? Math.round((obtained / total) * 100) : 0 };
}

function renderWrStatusBar(reviewed) {
  const { total, obtained, percent } = computeWrScore();
  wrScorePill.textContent = `ⓘ ${obtained}/${total} Marks (${percent}%)`;

  wrStatusPill.textContent = reviewed ? "All Questions Marked" : "Pending Review";
  wrStatusPill.className = `wr-status-pill ${reviewed ? "wr-status-pill--marked" : "wr-status-pill--pending"}`;

  wrApproveBtn.textContent = reviewed ? "Reviewed" : "Approve to Publish";
  wrApproveBtn.className = `wr-approve-btn ${reviewed ? "wr-approve-btn--done" : ""}`;
}

function renderWrDots() {
  wrDotsEl.innerHTML = wrQuestions
    .map(
      (q, idx) => `
      <div class="wr-dot wr-dot--${q.status === "correct" ? "correct" : "incorrect"} ${q.id === wrActiveQid ? "active" : ""}" data-qid="${q.id}">${q.id}</div>
      ${idx < wrQuestions.length - 1 ? '<div class="wr-dot-connector"></div>' : ""}
    `
    )
    .join("");
}

function renderWrScanPage(row) {
  const questionsHtml = wrQuestions
    .map(
      (q) => `
      <div class="wr-question">
        <p class="wr-question-num">${q.id}. ${q.prompt}</p>
        <div class="wr-answer-box wr-answer-box--${q.status} ${q.id === wrActiveQid ? "active" : ""}" data-qid="${q.id}">
          <div class="wr-handwriting">${q.handwriting}</div>
        </div>
      </div>
    `
    )
    .join("");

  wrScanPageEl.innerHTML = `
    <div class="scan-page-head">
      <span class="scan-worksheet-name">WORKSHEET NAME</span>
      <span class="scan-student-meta">NAME: ${row.student.toUpperCase()}<br />CLASS: ${row.className.toUpperCase()}</span>
    </div>
    ${questionsHtml}
  `;
}

wrScanPageEl.addEventListener("click", (e) => {
  const box = e.target.closest(".wr-answer-box");
  if (!box) return;
  selectWrQuestion(Number(box.getAttribute("data-qid")), reviewResultRows[wrRowIdx]);
});

wrDotsEl.addEventListener("click", (e) => {
  const dot = e.target.closest(".wr-dot");
  if (!dot) return;
  selectWrQuestion(Number(dot.getAttribute("data-qid")), reviewResultRows[wrRowIdx]);
});

function selectWrQuestion(qid, row) {
  wrActiveQid = qid;
  renderWrDots();
  document.querySelectorAll(".wr-answer-box").forEach((box) => {
    box.classList.toggle("active", Number(box.getAttribute("data-qid")) === qid);
  });

  const q = wrQuestions.find((item) => item.id === qid);
  const isCorrect = q.status === "correct";
  const maxOptions = Array.from({ length: q.maxMarks + 1 }, (_, n) => n);

  wrDetailPanel.innerHTML = `
    <span class="wr-detail-qtab">Question ${q.id}</span>
    <p class="wr-detail-label">Correct Answer</p>
    <p class="wr-detail-value">${q.correctAnswer}</p>
    <p class="wr-detail-label">Remarks</p>
    <p class="wr-detail-remarks">${q.remarks}</p>
    <span class="wr-detail-pill wr-detail-pill--${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "Answered Correct" : "Answered Incorrect"}</span>
    <div class="wr-marks-row">
      <span class="wr-detail-label" style="margin:0;">Marks obtained:</span>
      <select class="wr-marks-select" id="wr-marks-select">
        ${maxOptions.map((n) => `<option value="${n}" ${n === q.marksObtained ? "selected" : ""}>${n}</option>`).join("")}
      </select>
    </div>
  `;

  document.getElementById("wr-marks-select").addEventListener("change", (e) => {
    const val = Number(e.target.value);
    q.marksObtained = val;
    q.status = val >= q.maxMarks ? "correct" : "incorrect";
    renderWrDots();
    renderWrScanPage(row);
    renderWrStatusBar(reviewResultRows[wrRowIdx].reviewStatus === "reviewed");
    selectWrQuestion(qid, row);
  });
}

wrApproveBtn.addEventListener("click", () => {
  if (wrRowIdx === null || wrContext.rows[wrRowIdx].reviewStatus === "reviewed") return;
  const row = wrContext.rows[wrRowIdx];
  row.reviewStatus = "reviewed";
  renderWrStatusBar(true);
  showToast("success", "Approved to publish", `${row.student}'s worksheet has been marked as reviewed.`);
  updateFractionsWorksheetStatus();
});

wrExitBtn.addEventListener("click", () => {
  wrScreen.hidden = true;
  if (wrContext.exitModal) openModal(wrContext.exitModal);
  if (wrContext.onExit) wrContext.onExit();
});

/* ---------- submit & publish -> upload result complete (screen 14) ---------- */

const uploadCompleteModal = document.getElementById("modal-upload-complete");
const uploadCompleteSubtitle = document.getElementById("upload-complete-subtitle");
const uploadCompleteRowsEl = document.getElementById("upload-complete-rows");
const uploadCompleteClose = document.getElementById("upload-complete-close");

submitPublishBtn.addEventListener("click", () => {
  if (submitPublishBtn.disabled) return;
  uploadCompleteSubtitle.textContent = `${reviewResultRows.length} Results published to ${ACTIVE_WORKSHEET_NAME}`;
  uploadCompleteRowsEl.innerHTML = reviewResultRows
    .map((row) => `<div class="upload-complete-row"><span>${row.student}</span><span>${row.score}%</span></div>`)
    .join("");
  closeModal(reviewResultModal);
  openModal(uploadCompleteModal);
  updateFractionsWorksheetStatus();
});

uploadCompleteClose.addEventListener("click", () => closeModal(uploadCompleteModal));
uploadCompleteModal.addEventListener("click", (e) => {
  if (e.target === uploadCompleteModal) closeModal(uploadCompleteModal);
});

/* ---------- review submission match (read-only preview) ---------- */

const reviewMatchModal = document.getElementById("modal-review-match");
const closeReviewMatchX = document.getElementById("close-review-match-x");

function openReviewMatch(row) {
  document.getElementById("review-student-name").textContent = row.student.toUpperCase();
  document.getElementById("review-student-class").textContent = row.className.toUpperCase();
  document.getElementById("review-matched-name").textContent = row.student;
  document.getElementById("review-matched-class").textContent = row.className;
  closeModal(checkMatchesModal);
  openModal(reviewMatchModal);
}

closeReviewMatchX.addEventListener("click", () => {
  closeModal(reviewMatchModal);
  openModal(checkMatchesModal);
});
reviewMatchModal.addEventListener("click", (e) => {
  if (e.target === reviewMatchModal) {
    closeModal(reviewMatchModal);
    openModal(checkMatchesModal);
  }
});

/* ---------- match pages to a student (resolve flow) ---------- */

const resolveStudentModal = document.getElementById("modal-resolve-student");
const resolveFileName = document.getElementById("resolve-file-name");
const resolveSelect = document.getElementById("resolve-student-select");
const resolveHint = document.getElementById("resolve-hint");
const confirmStudentBtn = document.getElementById("confirm-student-btn");
const closeResolveStudentX = document.getElementById("close-resolve-student-x");
const resolveBackBtn = document.getElementById("resolve-back");

const CLASS_ROSTER = [
  { name: "Amelia Tan", className: "Newton Class" },
  { name: "Daniel Wong", className: "Newton Class" },
  { name: "Nadia Rahman", className: "Newton Class" },
];

let resolvingRowIdx = null;

function openResolveStudent(idx) {
  resolvingRowIdx = idx;
  resolveFileName.textContent = submissionRows[idx].file;

  // Preventive: a student already matched to another file can't be picked again here.
  const takenNames = new Set(submissionRows.filter((r, i) => i !== idx && r.student).map((r) => r.student));
  const available = CLASS_ROSTER.filter((s) => !takenNames.has(s.name));

  resolveSelect.innerHTML =
    '<option value="">Select student</option>' +
    available.map((s) => `<option value="${s.name}|${s.className}">${s.name} — ${s.className}</option>`).join("");

  resolveHint.textContent =
    takenNames.size > 0 ? "Students already matched to another file aren't shown here." : "";

  resolveSelect.value = "";
  confirmStudentBtn.disabled = true;
  closeModal(checkMatchesModal);
  openModal(resolveStudentModal);
}

resolveSelect.addEventListener("change", () => {
  confirmStudentBtn.disabled = resolveSelect.value === "";
});

confirmStudentBtn.addEventListener("click", () => {
  if (confirmStudentBtn.disabled || resolvingRowIdx === null) return;
  const [student, className] = resolveSelect.value.split("|");
  submissionRows[resolvingRowIdx] = { ...submissionRows[resolvingRowIdx], student, className, status: "good" };
  closeModal(resolveStudentModal);
  openModal(checkMatchesModal);
  renderMatchRows();
});

closeResolveStudentX.addEventListener("click", () => {
  closeModal(resolveStudentModal);
  openModal(checkMatchesModal);
});
resolveBackBtn.addEventListener("click", () => {
  closeModal(resolveStudentModal);
  openModal(checkMatchesModal);
});
resolveStudentModal.addEventListener("click", (e) => {
  if (e.target === resolveStudentModal) {
    closeModal(resolveStudentModal);
    openModal(checkMatchesModal);
  }
});

/* ---------- worksheet details (entry point: click a worksheet row on My Worksheet) ---------- */

const worksheetDetailsModal = document.getElementById("modal-worksheet-details");
const closeWorksheetDetailsX = document.getElementById("close-worksheet-details-x");
const wsdRowsEl = document.getElementById("wsd-rows");

let wsdStudents = [];
let wsdExpandedIdx = null;

function seedWsdStudents() {
  wsdStudents = [
    { student: "Student B", className: "Rose Class", attempts: 0, score: null, reviewStatus: "no-attempt", assignedDate: "Apr 2, 2026 3:03 PM", attemptedDate: null },
    { student: "X5vx+03", className: "Rose Class", attempts: 0, score: null, reviewStatus: "no-attempt", assignedDate: "Apr 2, 2026 3:03 PM", attemptedDate: null },
    { student: "Zulika Citra", className: "Rose Class", attempts: 0, score: null, reviewStatus: "no-attempt", assignedDate: "Apr 2, 2026 3:03 PM", attemptedDate: null },
    { student: "Samantha Wardhana", className: "Rose Class", attempts: 1, score: 48, reviewStatus: "reviewed", assignedDate: "Apr 2, 2026 3:03 PM", attemptedDate: "Apr 2, 2026 3:06 PM" },
  ];
}

document.querySelectorAll("[data-open-worksheet]").forEach((el) => {
  el.addEventListener("click", () => {
    const isCorrelated = el.getAttribute("data-correlated") === "true";
    if (isCorrelated) {
      // Always show the full assigned roster — students who haven't submitted
      // yet show up as "No Attempt" instead of being left out entirely.
      wsdStudents = CLASS_ROSTER.map((rosterStudent) => {
        const submission = reviewResultRows.find((r) => r.student === rosterStudent.name);
        return submission || { student: rosterStudent.name, className: rosterStudent.className, attempts: 0, score: null, reviewStatus: "no-attempt" };
      });
    } else {
      seedWsdStudents();
    }
    wsdExpandedIdx = null;
    document.getElementById("wsd-title").textContent = el.getAttribute("data-open-worksheet");
    document.getElementById("wsd-category").textContent = el.getAttribute("data-open-category");
    document.getElementById("wsd-created-on").textContent = isCorrelated
      ? document.getElementById("fractions-created-on").textContent
      : el.getAttribute("data-open-created");

    const submittedCount = wsdStudents.filter((s) => (s.attempts ?? 1) > 0).length;
    const markedCount = wsdStudents.filter((s) => s.reviewStatus === "reviewed").length;
    document.getElementById("wsd-assigned-count").textContent = `${wsdStudents.length} Students`;
    document.getElementById("wsd-marked-count").textContent = `${markedCount}/${submittedCount}`;
    document.getElementById("wsd-marked-pill").textContent = `${markedCount}/${submittedCount}`;
    renderWsdRows();
    openModal(worksheetDetailsModal);
  });
});

function renderWsdRows() {
  wsdRowsEl.innerHTML = wsdStudents
    .map((s, idx) => {
      const attempts = s.attempts ?? 1;
      const hasAttempt = attempts > 0;
      const isReviewed = s.reviewStatus === "reviewed";
      const assignedDate = s.assignedDate ?? "—";
      const attemptedDate = s.attemptedDate ?? "—";
      const statusClass = !hasAttempt ? "status-pill--neutral" : isReviewed ? "match-status--good" : "match-status--review";
      const statusLabel = !hasAttempt ? "No Attempt" : isReviewed ? "Reviewed" : "Pending Review";

      const rowHtml = `
        <div class="wsd-row wsd-row--body">
          <span class="wsd-cell">${idx + 1}</span>
          <span class="wsd-student"><span class="wsd-avatar">🧑</span>${s.student}</span>
          <span class="wsd-cell">${s.className}</span>
          <span class="wsd-cell">${attempts} attempts</span>
          <span class="wsd-cell">${hasAttempt ? s.score + "%" : "0%"}</span>
          <span><span class="match-status ${statusClass}">${statusLabel}</span></span>
          <span class="wsd-cell">${assignedDate}</span>
          <button class="wsd-more-btn" data-wsd-idx="${idx}">More Details</button>
        </div>
      `;

      if (wsdExpandedIdx !== idx) return rowHtml;

      const expandHtml = hasAttempt
        ? `
          <div class="wsd-expand">
            <span class="wsd-expand-value">1st attempt</span>
            <span class="wsd-expand-value">${s.score}%</span>
            <span><span class="match-status ${isReviewed ? "match-status--good" : "match-status--review"}">${isReviewed ? "Reviewed" : "Pending Review"}</span></span>
            <span class="wsd-expand-value">${attemptedDate}</span>
            <button class="wsd-view-attempt" data-wsd-idx="${idx}">View attempt</button>
          </div>
        `
        : `<div class="wsd-expand"><span class="wsd-no-attempt-note">No attempt yet — nothing to review.</span></div>`;

      return rowHtml + expandHtml;
    })
    .join("");

  document.getElementById("wsd-record-count").textContent = `${wsdStudents.length} records`;
}

wsdRowsEl.addEventListener("click", (e) => {
  const viewBtn = e.target.closest(".wsd-view-attempt");
  if (viewBtn) {
    openWorksheetReview(Number(viewBtn.getAttribute("data-wsd-idx")), {
      rows: wsdStudents,
      exitModal: worksheetDetailsModal,
      onExit: () => {
        const submittedCount = wsdStudents.filter((s) => (s.attempts ?? 1) > 0).length;
        const markedCount = wsdStudents.filter((s) => s.reviewStatus === "reviewed").length;
        document.getElementById("wsd-marked-count").textContent = `${markedCount}/${submittedCount}`;
        document.getElementById("wsd-marked-pill").textContent = `${markedCount}/${submittedCount}`;
        renderWsdRows();
        updateFractionsWorksheetStatus();
      },
      worksheetName: document.getElementById("wsd-title").textContent,
    });
    return;
  }

  const moreBtn = e.target.closest(".wsd-more-btn");
  if (moreBtn) {
    const idx = Number(moreBtn.getAttribute("data-wsd-idx"));
    wsdExpandedIdx = wsdExpandedIdx === idx ? null : idx;
    renderWsdRows();
  }
});

closeWorksheetDetailsX.addEventListener("click", () => closeModal(worksheetDetailsModal));
worksheetDetailsModal.addEventListener("click", (e) => {
  if (e.target === worksheetDetailsModal) closeModal(worksheetDetailsModal);
});
