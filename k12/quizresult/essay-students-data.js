// Sample students and attempts for the student dropdown and attempt
// switcher in essay-result-v2.html. Prototype data only.
//
// essay-data.js holds one real attempt (Samantha's). The other attempts
// and students below are samples that reuse its essay, annotations and
// rubric content; only the header details change (name, attempt, status
// and score), which is enough to try the switchers.

const ESSAY_STUDENTS = [
  {
    name: essayResult.studentName,
    // Oldest first; the page opens on each student's latest attempt.
    attempts: [
      { statusLabel: "All Questions Marked", totalMarks: 17 },
      // The real attempt from essay-data.js
      { statusLabel: essayResult.statusLabel, totalMarks: essayResult.totalMarks },
    ],
  },
  {
    name: "Rizky Pratama",
    attempts: [{ statusLabel: "All Questions Marked", totalMarks: 41 }],
  },
  {
    name: "Aisyah Rahman",
    attempts: [
      { statusLabel: "All Questions Marked", totalMarks: 30 },
      { statusLabel: "All Questions Marked", totalMarks: 39 },
      { statusLabel: "All Questions Marked", totalMarks: 52 },
    ],
  },
  {
    name: "Daniel Tan",
    attempts: [{ statusLabel: "All Questions Marked", totalMarks: 58 }],
  },
];
