"use strict";

/* qt-speech.js: data and behavior for qt-speech.html.

   Prototype notes:
   - "Hear" uses the browser's speech synthesis instead of Jen's audio.
   - "Record" simulates a recording; it does not use the microphone.
   - The device lists are sample names and "Test Microphone" shows simulated
     sound waves; no audio device is touched.
   - Both "Start Quiz" buttons open the quiz, because sign-in is out of scope.
   - Confirming Exit or Submit returns to the start screen. */

// The six questions of the live "Speech for Teens" quiz
const QUIZ = {
  subject: "Primary English",
  title: "Speech for Teens",
  maxAttempts: "Unlimited",
  timeLimit: "Unlimited",
  timerLabel: "-",
  devices: {
    microphones: [
      "Microphone Array (AMD Audio Device)",
      "Headset Microphone (USB Audio Device)",
      "Default - Built-in Microphone",
    ],
    speakers: [
      "Communications - Speakers (Realtek(R) Audio)",
      "Speakers (Realtek(R) Audio)",
      "Headphones (USB Audio Device)",
    ],
  },
  questions: [
    { id: "1A", text: "Technology" },
    { id: "1B", text: "Environment" },
    { id: "1C", text: "Confident" },
    { id: "1D", text: "Responsible" },
    { id: "1E", text: "Six sleek swans swam swiftly south." },
    { id: "1F", text: "Brisk brave bears bring bright blue berries." },
  ],
};

// Text longer than this is a sentence and gets a smaller type size
const LONG_TEXT_LENGTH = 24;

const state = {
  current: 0,
  answered: new Set(),          // indexes of questions that have a recording
  recordingSeconds: new Map(),  // question index -> length of its recording
  recorder: null,               // { index, seconds, timerId } while recording
};

let activeUtterance = null;
let feedbackTouched = false;

const byId = (id) => document.getElementById(id);

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const formatDuration = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

function getProgress() {
  const total = QUIZ.questions.length;
  const done = state.answered.size;
  const percent = total ? (done / total) * 100 : 0;
  return { total, done, percent, label: `${done}/${total} (${percent.toFixed(2)}%)` };
}

// ---------- Rendering ----------

function renderStart() {
  document.title = `${QUIZ.title} \u2014 HeyHi Quiz`;
  byId("quizSubject").textContent = QUIZ.subject;
  byId("quizTitle").textContent = QUIZ.title;
  byId("metaAttempts").textContent = QUIZ.maxAttempts;
  byId("metaQuestions").textContent = String(QUIZ.questions.length);
  byId("metaTime").textContent = QUIZ.timeLimit;
  byId("barTitle").textContent = QUIZ.title;
  byId("timerValue").textContent = QUIZ.timerLabel;
  renderDevices();
}

function renderProgress() {
  const { total, done, percent, label } = getProgress();
  const track = byId("progressTrack");
  // The desktop strip spells the count out; CSS shows one of the two forms
  byId("progressText").innerHTML =
    `<span class="count-short">${label}</span>` +
    `<span class="count-long">${done}/${total} questions (${percent.toFixed(2)}%)</span>`;
  byId("progressFill").style.width = `${percent}%`;
  track.setAttribute("aria-valuenow", percent.toFixed(0));
  track.setAttribute("aria-valuetext", label);
}

function renderRecording() {
  const button = byId("recordBtn");
  const status = byId("recordStatus");
  const recorder = state.recorder;
  const savedSeconds = state.recordingSeconds.get(state.current);
  const isRecording = Boolean(recorder) && recorder.index === state.current;

  button.classList.toggle("is-recording", isRecording);
  // The running clock would be announced every second, so the live region
  // is switched off while it ticks
  status.setAttribute("aria-live", isRecording ? "off" : "polite");

  if (isRecording) {
    button.textContent = "Stop";
    status.textContent = `Recording\u2026 ${formatDuration(recorder.seconds)}`;
  } else if (savedSeconds !== undefined) {
    button.textContent = "Record again";
    status.textContent = `Recorded (${formatDuration(savedSeconds)})`;
  } else {
    button.textContent = "Record";
    status.textContent = "No record yet";
  }
}

function renderQuestion() {
  const question = QUIZ.questions[state.current];
  const word = byId("promptWord");

  byId("questionTitle").textContent = `Question ${question.id}`;
  word.textContent = question.text;
  word.dataset.length = question.text.length > LONG_TEXT_LENGTH ? "long" : "short";
  byId("nextBtn").disabled = state.current === QUIZ.questions.length - 1;
  renderRecording();
}

function renderQuestionList() {
  const { done, total, percent } = getProgress();

  byId("qlistTitle").textContent = QUIZ.title;
  byId("qlistTime").textContent = QUIZ.timerLabel;
  byId("qlistProgressText").textContent = `${done}/${total} questions (${percent.toFixed(2)}%)`;
  byId("qlistProgressFill").style.width = `${percent}%`;

  byId("qlist").innerHTML = QUIZ.questions
    .map((question, index) => {
      const isCurrent = index === state.current;
      const isAnswered = state.answered.has(index);
      return `
        <li class="qrow${isCurrent ? " is-current" : ""}${isAnswered ? " is-answered" : ""}">
          <button class="qrow__go" type="button" data-go="${index}"${isCurrent ? ' aria-current="true"' : ""}>
            <span class="qrow__circle">${question.id}</span>
            <span>Question ${question.id}${isAnswered ? '<span class="visually-hidden"> (answered)</span>' : ""}</span>
            <svg class="icon qrow__arrow" aria-hidden="true"><use href="#i-arrow" /></svg>
          </button>
        </li>`;
    })
    .join("");
}

// Numbered circles down the left edge of the desktop layout (hidden by CSS
// on phones, which use the question list sheet)
function renderRail() {
  const steps = QUIZ.questions
    .map((question, index) => {
      const isCurrent = index === state.current;
      const isAnswered = state.answered.has(index);
      return `
        <li class="qrail__item">
          <button class="qrail__step${isCurrent ? " is-current" : ""}${isAnswered ? " is-answered" : ""}" type="button" data-go="${index}" aria-label="Question ${question.id}"${isCurrent ? ' aria-current="true"' : ""}>${question.id}</button>
        </li>`;
    })
    .join("");

  byId("qrail").innerHTML = `<ol class="qrail__list">${steps}</ol>`;
}

function renderQuiz() {
  renderQuestion();
  renderProgress();
  renderQuestionList();
  renderRail();
}

function renderSubmitMessage() {
  const { done, total, label } = getProgress();
  byId("submitMessage").textContent =
    done < total
      ? `You have not answered all the questions. You have answered ${label}.`
      : `You have answered all ${total} questions.`;
}

// ---------- Hear and Record ----------

function speakCurrentQuestion() {
  if (!("speechSynthesis" in window)) return;

  const button = byId("hearBtn");
  const utterance = new SpeechSynthesisUtterance(QUIZ.questions[state.current].text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;

  // Cancelling the previous utterance fires its end event late; only the
  // newest one may clear the playing state
  const finish = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
      button.classList.remove("is-playing");
    }
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  window.speechSynthesis.cancel();
  activeUtterance = utterance;
  button.classList.add("is-playing");
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  activeUtterance = null;
  byId("hearBtn").classList.remove("is-playing");
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function startRecording() {
  const recorder = { index: state.current, seconds: 0, timerId: null };
  recorder.timerId = window.setInterval(() => {
    recorder.seconds += 1;
    renderRecording();
  }, 1000);
  state.recorder = recorder;
  renderRecording();
}

function stopRecording() {
  const recorder = state.recorder;
  if (!recorder) return;

  window.clearInterval(recorder.timerId);
  state.recorder = null;
  // A recording counts as an answer, however short
  state.recordingSeconds.set(recorder.index, Math.max(recorder.seconds, 1));
  state.answered.add(recorder.index);
  renderQuiz();
}

function toggleRecording() {
  if (state.recorder) stopRecording();
  else startRecording();
}

// ---------- Navigation ----------

function goToQuestion(index) {
  if (index < 0 || index >= QUIZ.questions.length) return;

  stopRecording();
  stopSpeaking();
  state.current = index;
  renderQuiz();
  byId("questionTitle").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

// Picking a question from the desktop rail or from the list sheet
function onQuestionPick(event) {
  const goButton = event.target.closest("[data-go]");
  if (!goButton) return;

  byId("questionListDialog").close();
  goToQuestion(Number(goButton.dataset.go));
}

// ---------- Views ----------

function showView(name) {
  const isQuiz = name === "quiz";
  byId("startView").hidden = isQuiz;
  byId("quizView").hidden = !isQuiz;
  document.querySelector('meta[name="theme-color"]').content = isQuiz ? "#fec53c" : "#0fb0f8";
  window.scrollTo(0, 0);
}

function resetQuiz() {
  stopRecording();
  stopSpeaking();
  state.current = 0;
  state.answered.clear();
  state.recordingSeconds.clear();
}

function startQuiz() {
  stopMicTest();
  resetQuiz();
  showView("quiz");
  renderQuiz();
  openDialog(byId("instructionDialog"));
}

function leaveQuiz() {
  document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
  resetQuiz();
  resetSetup();
  showView("start");
}

// ---------- Dialogs ----------

// Run just before a dialog opens, so its content is current
const dialogBeforeOpen = {
  submitDialog: renderSubmitMessage,
  questionListDialog: renderQuestionList,
  feedbackDialog: resetFeedbackForm,
};

function openDialog(dialog) {
  if (dialog.open) return;
  const beforeOpen = dialogBeforeOpen[dialog.id];
  if (beforeOpen) beforeOpen();

  dialog.showModal();

  // Bring the current question into view in a long list
  if (dialog.id === "questionListDialog") {
    const current = dialog.querySelector(".is-current");
    if (current) current.scrollIntoView({ block: "nearest" });
  }
}

function wireDialogs() {
  document.querySelectorAll("[data-dialog-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => openDialog(byId(trigger.dataset.dialogOpen)));
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    let pressStartedOnBackdrop = false;

    // A click on the dimmed backdrop targets the dialog element itself.
    // Requiring the press to start there too keeps a text selection that
    // ends outside the panel from closing it.
    dialog.addEventListener("pointerdown", (event) => {
      pressStartedOnBackdrop = event.target === dialog;
    });
    dialog.addEventListener("click", (event) => {
      if (pressStartedOnBackdrop && event.target === dialog && !dialog.hasAttribute("data-static")) {
        dialog.close();
      }
    });

    dialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });
  });
}

// ---------- Feedback form ----------

function updateFeedbackForm() {
  const description = byId("fbDescription");
  const isValid = countWords(description.value) >= 2;

  byId("fbSubmit").disabled = !isValid;
  // The error appears only after the field has been left, not before
  byId("fbDescriptionError").hidden = isValid || !feedbackTouched;
  description.setAttribute("aria-invalid", String(!isValid && feedbackTouched));
}

function resetFeedbackForm() {
  byId("feedbackForm").reset();
  feedbackTouched = false;
  updateFeedbackForm();
}

function wireFeedbackForm() {
  const description = byId("fbDescription");

  description.addEventListener("input", updateFeedbackForm);
  description.addEventListener("blur", () => {
    feedbackTouched = true;
    updateFeedbackForm();
  });

  byId("feedbackForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (countWords(description.value) < 2) return;

    byId("feedbackDialog").close();
    openDialog(byId("thanksDialog"));
  });
}

// ---------- Device setup (start screen) ----------

const MIC_TEST_MS = 5000;
const WAVE_BAR_COUNT = 32;
const WAVE_TICK_MS = 80;

const micTest = {
  active: false,
  levels: new Array(WAVE_BAR_COUNT).fill(0),  // 0..1, one per bar, newest last
  startedAt: 0,
  tickId: null,
  stopId: null,
};

function fillSelect(select, names) {
  select.replaceChildren(...names.map((name) => new Option(name, name)));
}

function renderDevices() {
  fillSelect(byId("micSelect"), QUIZ.devices.microphones);
  fillSelect(byId("speakerSelect"), QUIZ.devices.speakers);
  byId("waveBars").innerHTML = '<span class="wave__bar"></span>'.repeat(WAVE_BAR_COUNT);
}

function paintWave() {
  byId("waveBars").childNodes.forEach((bar, index) => {
    bar.style.setProperty("--level", micTest.levels[index].toFixed(2));
  });
}

// A simulated voice: bursts of speech with short pauses, scrolling left
function nextWaveLevel(elapsedMs) {
  const isSpeaking = Math.sin(elapsedMs / 450) > -0.35;
  const target = isSpeaking ? 0.25 + Math.random() * 0.75 : Math.random() * 0.1;
  const previous = micTest.levels[micTest.levels.length - 1];
  return previous * 0.55 + target * 0.45;
}

function startMicTest() {
  const button = byId("testMicBtn");
  micTest.active = true;
  micTest.startedAt = performance.now();
  micTest.levels.fill(0);

  button.textContent = "Stop Test";
  button.classList.add("is-testing");
  byId("wave").hidden = false;
  byId("waveStatus").textContent = "Listening… speak now.";

  micTest.tickId = window.setInterval(() => {
    micTest.levels.push(nextWaveLevel(performance.now() - micTest.startedAt));
    micTest.levels.shift();
    paintWave();
  }, prefersReducedMotion() ? WAVE_TICK_MS * 3 : WAVE_TICK_MS);

  micTest.stopId = window.setTimeout(() => stopMicTest("Test finished."), MIC_TEST_MS);
}

function stopMicTest(message = "") {
  window.clearInterval(micTest.tickId);
  window.clearTimeout(micTest.stopId);
  if (!micTest.active) return;

  const button = byId("testMicBtn");
  micTest.active = false;
  micTest.levels.fill(0);
  paintWave();

  button.textContent = "Test Microphone";
  button.classList.remove("is-testing");
  byId("waveStatus").textContent = message;
}

function toggleMicTest() {
  if (micTest.active) stopMicTest("Test stopped.");
  else startMicTest();
}

// The start buttons stay disabled until every item is confirmed
function updateStartGate() {
  const boxes = byId("confirmList").querySelectorAll('input[type="checkbox"]');
  const isConfirmed = [...boxes].every((box) => box.checked);
  byId("startGuest").disabled = !isConfirmed;
  byId("startAccount").disabled = !isConfirmed;
}

function resetSetup() {
  stopMicTest();
  byId("wave").hidden = true;
  byId("confirmList").querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.checked = false;
  });
  updateStartGate();
}

function wireSetup() {
  byId("testMicBtn").addEventListener("click", toggleMicTest);
  byId("confirmList").addEventListener("change", updateStartGate);
}

// ---------- Boot ----------

function init() {
  renderStart();
  wireDialogs();
  wireFeedbackForm();
  wireSetup();
  resetSetup();

  // Sign-in is out of scope for this prototype, so both buttons start the quiz
  byId("startGuest").addEventListener("click", startQuiz);
  byId("startAccount").addEventListener("click", startQuiz);

  byId("hearBtn").addEventListener("click", speakCurrentQuestion);
  byId("recordBtn").addEventListener("click", toggleRecording);
  byId("nextBtn").addEventListener("click", () => goToQuestion(state.current + 1));

  byId("exitConfirm").addEventListener("click", leaveQuiz);
  byId("submitConfirm").addEventListener("click", leaveQuiz);
  byId("qlist").addEventListener("click", onQuestionPick);
  byId("qrail").addEventListener("click", onQuestionPick);
}

init();
