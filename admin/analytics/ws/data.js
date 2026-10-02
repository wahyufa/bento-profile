const BRANCHES = [
  { id: "tampines", name: "Tampines" },
  { id: "jurong", name: "Jurong East" },
  { id: "bishan", name: "Bishan" },
];

// Class teacher per branch. Class names repeat across branches (e.g. TOEIC-1), so the branch is
// part of the key. A tutor's own class lists that tutor as its teacher.
const CLASS_TEACHERS = {
  tampines: { "S2Math-A": "Lim Hui Min", "P3A": "Nurul Aini", "TOEIC-1": "Siti Rahman", "TOEIC-2": "Minh Hieu", "P4Math-A": "Kelvin Tay" },
  jurong: { "S1Sci-A": "Farah Ismail", "P2Math-A": "Joshua Lee", "TOEIC-2": "Wei Ling Tan", "TOEIC-3": "Wei Ling Tan", "S1Sci-B": "Farah Ismail", "P4Sci-A": "Priya Nair", "P4Math-B": "Ong Bee Lian" },
  bishan: { "P1Eng-A": "Grace Tan", "TOEIC-1": "Siti Rahman", "P1Eng-B": "Grace Tan" },
};

// Subject → level tree shown in the "Subject" filter, copied from production (demo-hq.heyhi.sg).
// "TOEIC" isn't in the HQ org's list; it's added because the dummy tutor worksheets use it
// (same "Mastery" level convention as IELTS).
const SUBJECT_CATALOG = [
  { subject: "Primary English", levels: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"] },
  { subject: "Primary Maths", levels: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"] },
  { subject: "Primary Science", levels: ["Primary 3", "Primary 4", "Primary 5", "Primary 6"] },
  { subject: "Secondary English", levels: ["Secondary 1", "Secondary 2", "Secondary 3", "Secondary 4", "Secondary 5"] },
  { subject: "Secondary Maths", levels: ["Secondary 1", "Secondary 2", "Secondary 4", "Secondary 5"] },
  { subject: "Secondary Additional Mathematics", levels: ["Secondary 3", "Secondary 4"] },
  { subject: "Secondary Science", levels: ["Secondary 1", "Secondary 2"] },
  { subject: "Secondary Pure Physics", levels: ["Secondary 3", "Secondary 4"] },
  { subject: "Secondary Pure Chemistry", levels: ["Secondary 3", "Secondary 4"] },
  { subject: "Secondary Pure Biology", levels: ["Secondary 3", "Secondary 4"] },
  { subject: "Secondary Combined Physics", levels: ["Secondary 3", "Secondary 4"] },
  { subject: "Secondary Combined Chemistry", levels: ["Secondary 3", "Secondary 4"] },
  { subject: "Junior College H2 Maths", levels: ["JC1", "JC2"] },
  { subject: "Junior College H2 Physics", levels: ["JC1", "JC2"] },
  { subject: "Junior College H2 Chemistry", levels: ["JC1", "JC2"] },
  { subject: "Junior College H2 Biology", levels: ["JC1", "JC2"] },
  { subject: "Secondary Chinese", levels: ["Secondary 3", "Secondary 2", "Secondary 1", "Secondary 4"] },
  { subject: "Cambridge Primary Mathematics", levels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"] },
  { subject: "Cambridge Primary English (ESL)", levels: ["Grade 5", "Grade 1", "Grade 6", "Grade 3", "Grade 4", "Grade 2"] },
  { subject: "Cambridge Primary Science", levels: ["Grade 3", "Grade 6", "Grade 5", "Grade 1", "Grade 2", "Grade 4"] },
  { subject: "Cambridge Lower Secondary Mathematics", levels: ["Grade 7", "Grade 8", "Grade 9", "Grade 6"] },
  { subject: "Cambridge Lower Secondary English (ESL)", levels: ["Grade 9", "Grade 7", "Grade 8", "Grade 6"] },
  { subject: "Cambridge Lower Secondary Science", levels: ["Grade 8", "Grade 9", "Grade 7", "Grade 6"] },
  { subject: "IGCSE Mathematics", levels: ["Grade 10", "Grade 9", "Grade 7", "Grade 8", "Grade 11"] },
  { subject: "AS and A Level Mathematics", levels: ["Grade 11", "Grade 12", "Grade 10"] },
  { subject: "AS and A Level Biology", levels: ["Grade 11", "Grade 12", "Grade 10"] },
  { subject: "AS and A Level Chemistry", levels: ["Grade 12", "Grade 11", "Grade 10"] },
  { subject: "IELTS", levels: ["Mastery"] },
  { subject: "TOEIC", levels: ["Mastery"] },
  { subject: "Cambridge Primary English (First Language)", levels: ["Grade 6", "Grade 3", "Grade 4", "Grade 2", "Grade 5", "Grade 1"] },
  { subject: "Cambridge Lower Secondary English (First Language)", levels: ["Grade 8", "Grade 9", "Grade 7", "Grade 6"] },
  { subject: "TEST TID", levels: ["LEVEL TEST TID 1", "LEVEL TEST TID 2"] },
];

// Splits a worksheet's display subject ("Primary 4 Maths", "Mastery TOEIC") into the
// catalog's subject + level ("Primary Maths" / "Primary 4", "TOEIC" / "Mastery").
function parseSubject(displaySubject) {
  const match = displaySubject.match(/^(Primary \d|Secondary \d|JC\d|Grade \d+|Mastery) (.+)$/);
  if (!match) return { subject: displaySubject, level: null };
  const [, level, subjectName] = match;
  const stage = level.split(" ")[0];
  const subject = stage === "Primary" || stage === "Secondary" ? `${stage} ${subjectName}` : subjectName;
  return { subject, level };
}

const WORKSHEETS = [
  {
    id: 1,
    name: "JH2 Mathematics HQ Test 1",
    subject: "Secondary 2 Maths",
    branchId: "tampines",
    creator: { name: "Admin Office", role: "Admin" },
    isExam: true,
    completed: 4,
    total: 6,
    avgScore: 79,
    assigned: { students: 6, classes: 1, teachers: 1 },
    date: "2026-08-24",
  },
  {
    id: 2,
    name: "P3 English Hq test 1",
    subject: "Primary 3 English",
    branchId: "tampines",
    creator: { name: "Admin Office", role: "Admin" },
    completed: 1,
    total: 2,
    avgScore: 82,
    assigned: { students: 2, classes: 1, teachers: 1 },
    date: "2026-08-23",
  },
  {
    id: 3,
    name: "JH1 science Admin WS Test 1",
    subject: "Secondary 1 Science",
    branchId: "jurong",
    creator: { name: "Admin Office", role: "Admin" },
    completed: 3,
    total: 5,
    avgScore: 77,
    assigned: { students: 5, classes: 1, teachers: 1 },
    date: "2026-08-22",
  },
  {
    id: 4,
    name: "P2 Math Admin WS Test 1",
    subject: "Primary 2 Maths",
    branchId: "jurong",
    creator: { name: "Admin Office", role: "Admin" },
    completed: 2,
    total: 4,
    avgScore: 74,
    assigned: { students: 4, classes: 1, teachers: 1 },
    date: "2026-08-21",
  },
  {
    id: 5,
    name: "P1 English Admin WS Test 1",
    subject: "Primary 1 English",
    branchId: "bishan",
    creator: { name: "Admin Office", role: "Admin" },
    completed: 2,
    total: 3,
    avgScore: 88,
    assigned: { students: 3, classes: 1, teachers: 1 },
    date: "2026-08-20",
  },
  {
    id: 6,
    name: "TRIAL_TOEIC Speaking Set 10",
    subject: "Mastery TOEIC",
    branchId: "tampines",
    creator: { name: "Siti Rahman", role: "Tutor" },
    completed: 1,
    total: 3,
    avgScore: 78,
    assigned: { students: 3, classes: 1, teachers: 1 },
    date: "2026-08-19",
  },
  {
    id: 7,
    name: "TRIAL_TOEIC Speaking Set 9",
    subject: "Mastery TOEIC",
    branchId: "jurong",
    creator: { name: "Wei Ling Tan", role: "Tutor" },
    completed: 2,
    total: 4,
    avgScore: 72,
    assigned: { students: 4, classes: 2, teachers: 1 },
    date: "2026-08-18",
  },
  {
    id: 8,
    name: "TRIAL_TOEIC Speaking Set 8",
    subject: "Mastery TOEIC",
    branchId: "bishan",
    creator: { name: "Siti Rahman", role: "Tutor" },
    completed: 1,
    total: 1,
    avgScore: 91,
    assigned: { students: 1, classes: 1, teachers: 1 },
    date: "2026-08-17",
  },
  {
    id: 9,
    name: "hiep 002 vvv",
    subject: "Mastery TOEIC",
    branchId: "tampines",
    creator: { name: "Minh Hieu", role: "Tutor" },
    completed: 1,
    total: 1,
    avgScore: 78,
    assigned: { students: 1, classes: 1, teachers: 1 },
    date: "2026-08-16",
  },
  {
    // HQ-created and assigned to two sub-branches. branchId stays the first assigned branch
    // for older pages; branchIds lists every branch the worksheet is assigned to.
    id: 10,
    name: "SGS Quarterly Assessment - P4 Maths",
    subject: "Primary 4 Maths",
    branchId: "tampines",
    branchIds: ["tampines", "jurong"],
    creator: { name: "HQ Curriculum Team", role: "HQ" },
    isExam: true,
    completed: 5,
    total: 9,
    avgScore: 76,
    assigned: { students: 9, classes: 2, teachers: 2 },
    date: "2026-08-15",
  },
  {
    id: 11,
    name: "SGS Quarterly Assessment - S1 Science",
    subject: "Secondary 1 Science",
    branchId: "jurong",
    creator: { name: "HQ Curriculum Team", role: "HQ" },
    isExam: true,
    completed: 2,
    total: 4,
    avgScore: 82,
    assigned: { students: 4, classes: 1, teachers: 1 },
    date: "2026-08-14",
  },
  {
    id: 12,
    name: "SGS Quarterly Assessment - P1 English",
    subject: "Primary 1 English",
    branchId: "bishan",
    creator: { name: "HQ Curriculum Team", role: "HQ" },
    isExam: true,
    completed: 2,
    total: 3,
    avgScore: 88,
    assigned: { students: 3, classes: 1, teachers: 1 },
    date: "2026-08-13",
  },
  {
    id: 13,
    name: "P4 Science Revision Test 1",
    subject: "Primary 4 Science",
    branchId: "jurong",
    creator: { name: "Admin Office", role: "Admin" },
    completed: 2,
    total: 4,
    avgScore: 67,
    assigned: { students: 4, classes: 1, teachers: 1 },
    date: "2026-08-12",
  },
  {
    id: 14,
    name: "TRIAL_TOEIC Writing Set 3",
    subject: "Mastery TOEIC",
    branchId: "bishan",
    creator: { name: "Siti Rahman", role: "Tutor" },
    completed: 1,
    total: 2,
    avgScore: 66,
    assigned: { students: 2, classes: 1, teachers: 1 },
    date: "2026-08-11",
  },
  {
    id: 15,
    name: "TRIAL_TOEIC Listening Set 5",
    subject: "Mastery TOEIC",
    branchId: "tampines",
    creator: { name: "Minh Hieu", role: "Tutor" },
    completed: 2,
    total: 3,
    avgScore: 71,
    assigned: { students: 3, classes: 1, teachers: 1 },
    date: "2026-08-10",
  },
];

// Per-student results for the Worksheet Insight page, keyed by worksheet id.
// Kept in sync with each worksheet's completed/total/avgScore above.
// score is null until a student has actually submitted (status "Completed").
const STUDENT_RESULTS = {
  1: [
    { name: "Javier Koh", class: "S2Math-A", status: "Completed", score: 88, timeSpent: "31 min", timeSpentSeconds: 1860, date: "2026-08-24" },
    { name: "Sarah Lim", class: "S2Math-A", status: "Completed", score: 72, timeSpent: "27 min", timeSpentSeconds: 1620, date: "2026-08-24" },
    { name: "Muhammad Danish", class: "S2Math-A", status: "Completed", score: 65, timeSpent: "35 min", timeSpentSeconds: 2100, date: "2026-08-25" },
    { name: "Wong Xin Yi", class: "S2Math-A", status: "Completed", score: 90, timeSpent: "22 min", timeSpentSeconds: 1320, date: "2026-08-25" },
    { name: "Kavya Nair", class: "S2Math-A", status: "In Progress", score: null, timeSpent: "14 min", timeSpentSeconds: 840, date: null },
    { name: "Bryan Teo", class: "S2Math-A", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  2: [
    { name: "Tan Wei Jie", class: "P3A", status: "Completed", score: 82, timeSpent: "24 min", timeSpentSeconds: 1440, date: "2026-08-23" },
    { name: "Nur Aisyah", class: "P3A", status: "In Progress", score: null, timeSpent: "9 min", timeSpentSeconds: 540, date: null },
  ],
  3: [
    { name: "Aiden Chua", class: "S1Sci-A", status: "Completed", score: 75, timeSpent: "29 min", timeSpentSeconds: 1740, date: "2026-08-22" },
    { name: "Nurul Huda", class: "S1Sci-A", status: "Completed", score: 60, timeSpent: "33 min", timeSpentSeconds: 1980, date: "2026-08-23" },
    { name: "Ryan Tan", class: "S1Sci-A", status: "Completed", score: 95, timeSpent: "20 min", timeSpentSeconds: 1200, date: "2026-08-23" },
    { name: "Meera Pillai", class: "S1Sci-A", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
    { name: "Zachary Ong", class: "S1Sci-A", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  4: [
    { name: "Isabelle Ng", class: "P2Math-A", status: "Completed", score: 68, timeSpent: "19 min", timeSpentSeconds: 1140, date: "2026-08-21" },
    { name: "Haziq Rahman", class: "P2Math-A", status: "Completed", score: 80, timeSpent: "16 min", timeSpentSeconds: 960, date: "2026-08-22" },
    { name: "Timothy Goh", class: "P2Math-A", status: "In Progress", score: null, timeSpent: "8 min", timeSpentSeconds: 480, date: null },
    { name: "Anya Kumar", class: "P2Math-A", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  5: [
    { name: "Sophia Tan", class: "P1Eng-A", status: "Completed", score: 90, timeSpent: "15 min", timeSpentSeconds: 900, date: "2026-08-20" },
    { name: "Arjun Menon", class: "P1Eng-A", status: "Completed", score: 85, timeSpent: "18 min", timeSpentSeconds: 1080, date: "2026-08-21" },
    { name: "Nur Fatimah", class: "P1Eng-A", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  6: [
    { name: "Chloe Lim", class: "TOEIC-1", status: "Completed", score: 78, timeSpent: "18 min", timeSpentSeconds: 1080, date: "2026-08-19" },
    { name: "Rachel Ng", class: "TOEIC-1", status: "In Progress", score: null, timeSpent: "6 min", timeSpentSeconds: 360, date: null },
    { name: "Faris Rahman", class: "TOEIC-1", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  7: [
    { name: "Marcus Goh", class: "TOEIC-2", status: "Completed", score: 55, timeSpent: "20 min", timeSpentSeconds: 1200, date: "2026-08-18" },
    { name: "Priya Sharma", class: "TOEIC-2", status: "Completed", score: 88, timeSpent: "17 min", timeSpentSeconds: 1020, date: "2026-08-19" },
    { name: "Ethan Koh", class: "TOEIC-3", status: "In Progress", score: null, timeSpent: "5 min", timeSpentSeconds: 300, date: null },
    { name: "Amirah Yusof", class: "TOEIC-3", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  8: [
    { name: "Daniel Ong", class: "TOEIC-1", status: "Completed", score: 91, timeSpent: "21 min", timeSpentSeconds: 1260, date: "2026-08-17" },
  ],
  9: [
    { name: "Hieu Nguyen", class: "TOEIC-2", status: "Completed", score: 78, timeSpent: "22 min", timeSpentSeconds: 1320, date: "2026-08-16" },
  ],
  10: [
    { name: "Wong Jia Hui", class: "P4Math-A", status: "Completed", score: 85, timeSpent: "28 min", timeSpentSeconds: 1680, date: "2026-08-15" },
    { name: "Rashid Iskandar", class: "P4Math-A", status: "Completed", score: 70, timeSpent: "33 min", timeSpentSeconds: 1980, date: "2026-08-15" },
    { name: "Chen Mei Ling", class: "P4Math-A", status: "Completed", score: 92, timeSpent: "24 min", timeSpentSeconds: 1440, date: "2026-08-16" },
    { name: "Aditya Kumar", class: "P4Math-A", status: "In Progress", score: null, timeSpent: "11 min", timeSpentSeconds: 660, date: null },
    { name: "Nur Insyirah", class: "P4Math-A", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
    // Students without branchId belong to the worksheet's branchId; these four are in Jurong East.
    { name: "Tan Kai Xuan", class: "P4Math-B", branchId: "jurong", status: "Completed", score: 76, timeSpent: "31 min", timeSpentSeconds: 1860, date: "2026-08-16" },
    { name: "Nur Aqilah", class: "P4Math-B", branchId: "jurong", status: "Completed", score: 58, timeSpent: "36 min", timeSpentSeconds: 2160, date: "2026-08-17" },
    { name: "Lucas Wong", class: "P4Math-B", branchId: "jurong", status: "In Progress", score: null, timeSpent: "12 min", timeSpentSeconds: 720, date: null },
    { name: "Shreya Iyer", class: "P4Math-B", branchId: "jurong", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  11: [
    { name: "Farhan Hakim", class: "S1Sci-B", status: "Completed", score: 88, timeSpent: "26 min", timeSpentSeconds: 1560, date: "2026-08-14" },
    { name: "Michelle Tan", class: "S1Sci-B", status: "Completed", score: 76, timeSpent: "30 min", timeSpentSeconds: 1800, date: "2026-08-15" },
    { name: "Dhruv Malhotra", class: "S1Sci-B", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
    { name: "Siti Nurhaliza", class: "S1Sci-B", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  12: [
    { name: "Ethan Wong", class: "P1Eng-B", status: "Completed", score: 95, timeSpent: "13 min", timeSpentSeconds: 780, date: "2026-08-13" },
    { name: "Aaliyah Bte Rosli", class: "P1Eng-B", status: "Completed", score: 80, timeSpent: "17 min", timeSpentSeconds: 1020, date: "2026-08-14" },
    { name: "Marcus Lee", class: "P1Eng-B", status: "In Progress", score: null, timeSpent: "6 min", timeSpentSeconds: 360, date: null },
  ],
  13: [
    { name: "Kai Zhi Wei", class: "P4Sci-A", status: "Completed", score: 60, timeSpent: "22 min", timeSpentSeconds: 1320, date: "2026-08-12" },
    { name: "Bella Ng", class: "P4Sci-A", status: "Completed", score: 73, timeSpent: "19 min", timeSpentSeconds: 1140, date: "2026-08-13" },
    { name: "Omar Faruq", class: "P4Sci-A", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
    { name: "Divya Krishnan", class: "P4Sci-A", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  14: [
    { name: "Farah Adlina", class: "TOEIC-1", status: "Completed", score: 66, timeSpent: "19 min", timeSpentSeconds: 1140, date: "2026-08-11" },
    { name: "Jayden Ho", class: "TOEIC-1", status: "Not Started", score: null, timeSpent: null, timeSpentSeconds: 0, date: null },
  ],
  15: [
    { name: "Wei Xuan", class: "TOEIC-2", status: "Completed", score: 84, timeSpent: "16 min", timeSpentSeconds: 960, date: "2026-08-10" },
    { name: "Nabila Yasmin", class: "TOEIC-2", status: "Completed", score: 58, timeSpent: "21 min", timeSpentSeconds: 1260, date: "2026-08-11" },
    { name: "Ryan Fernandez", class: "TOEIC-2", status: "In Progress", score: null, timeSpent: "7 min", timeSpentSeconds: 420, date: null },
  ],
};

// Per-question breakdown for the Worksheet Insight page, keyed by worksheet id.
// Only worksheets with at least one Completed/In Progress student have data here —
// total = students who reached that question, correct = how many got it right.
const QUESTION_RESULTS = {
  1: [
    { number: 1, text: "Solve for x: 2x + 5 = 17", correct: 4, total: 5, topic: "Algebra" },
    { number: 2, text: "Find the area of a triangle with base 8cm and height 5cm.", correct: 3, total: 5, topic: "Geometry" },
    { number: 3, text: "Simplify: 3(2x - 4) + 5x", correct: 3, total: 4, topic: "Algebra" },
    { number: 4, text: "Solve the simultaneous equations: x + y = 10, x - y = 2", correct: 2, total: 4, topic: "Word Problems" },
  ],
  2: [
    { number: 1, text: "Choose the correct word: The cat ___ (is/are) sleeping.", correct: 1, total: 1, topic: "Grammar" },
    { number: 2, text: "Write a sentence using the word 'happy'.", correct: 1, total: 1, topic: "Vocabulary" },
    { number: 3, text: "Circle the noun in the sentence: The dog ran fast.", correct: 0, total: 1, topic: "Grammar" },
  ],
  // Worksheets 3, 10 and 15 are the insight samples (sub-branch admin, HQ, tutor), so their
  // questions also carry what the insight's question panel shows: type, marks, options, answer.
  3: [
    { number: 1, type: "MCQ", marks: 1, text: "What is the chemical symbol for Sodium?", options: ["S", "So", "Na", "Sd"], answer: "Na", correct: 3, total: 3, topic: "Matter & Materials" },
    { number: 2, type: "Open-Ended", marks: 2, text: "Explain the process of photosynthesis in one sentence.", answer: "Plants use light energy to make glucose from carbon dioxide and water, releasing oxygen.", correct: 2, total: 3, topic: "Living Things" },
    { number: 3, type: "Short Answer", marks: 1, text: "Name the three states of matter.", answer: "Solid, liquid and gas", correct: 3, total: 3, topic: "Matter & Materials" },
    { number: 4, type: "Open-Ended", marks: 2, text: "Describe Newton's First Law of Motion.", answer: "An object stays at rest or keeps moving at a constant velocity unless an unbalanced force acts on it.", correct: 1, total: 3, topic: "Forces & Energy" },
  ],
  4: [
    { number: 1, text: "What is 45 + 27?", correct: 3, total: 3, topic: "Number & Arithmetic" },
    { number: 2, text: "If you have 5 groups of 4 apples, how many apples in total?", correct: 1, total: 2, topic: "Word Problems" },
    { number: 3, text: "What shape has 3 sides?", correct: 2, total: 2, topic: "Geometry" },
  ],
  5: [
    { number: 1, text: "Circle the correct spelling: 'cat' or 'kat'.", correct: 2, total: 2, topic: "Grammar" },
    { number: 2, text: "Fill in the blank: The sun is ___ (hot/cold).", correct: 2, total: 2, topic: "Vocabulary" },
    { number: 3, text: "Write one sentence about your favourite animal.", correct: 1, total: 2, topic: "Reading Comprehension" },
  ],
  6: [
    { number: 1, text: "Describe your daily morning routine.", correct: 2, total: 2, topic: "Read a text aloud" },
    { number: 2, text: "What are the benefits of learning a second language?", correct: 1, total: 2, topic: "Describe a picture" },
    { number: 3, text: "Talk about a memorable trip you took.", correct: 1, total: 2, topic: "Respond to questions" },
    { number: 4, text: "Explain how to make your favorite dish.", correct: 0, total: 1, topic: "Respond to questions using information provided" },
    { number: 5, text: "Discuss the impact of technology on education.", correct: 1, total: 1, topic: "Express an opinion" },
  ],
  7: [
    { number: 1, text: "Describe a challenge you overcame at school.", correct: 2, total: 3, topic: "Read a text aloud" },
    { number: 2, text: "What is your opinion on online learning?", correct: 2, total: 3, topic: "Describe a picture" },
    { number: 3, text: "Talk about a skill you'd like to learn.", correct: 1, total: 2, topic: "Respond to questions" },
    { number: 4, text: "Describe your ideal weekend.", correct: 1, total: 2, topic: "Express an opinion" },
  ],
  8: [
    { number: 1, text: "Introduce your favorite hobby.", correct: 1, total: 1, topic: "Read a text aloud" },
    { number: 2, text: "Describe a place you'd like to visit.", correct: 1, total: 1, topic: "Describe a picture" },
    { number: 3, text: "What are your strengths and weaknesses?", correct: 0, total: 1, topic: "Respond to questions" },
  ],
  9: [
    { number: 1, text: "Introduce yourself in 30 seconds.", correct: 1, total: 1, topic: "Read a text aloud" },
    { number: 2, text: "Describe your hometown.", correct: 1, total: 1, topic: "Describe a picture" },
    { number: 3, text: "What do you want to achieve this year?", correct: 0, total: 1, topic: "Respond to questions" },
  ],
  10: [
    { number: 1, type: "MCQ", marks: 1, text: "Express 3/4 as a decimal.", options: ["0.34", "0.43", "0.75", "3.4"], answer: "0.75", correct: 5, total: 7, topic: "Number & Arithmetic" },
    { number: 2, type: "Short Answer", marks: 2, instruction: "Show your working clearly.", text: "Find the perimeter of a rectangle 12 cm long and 7 cm wide.", answer: "38 cm", correct: 4, total: 6, topic: "Geometry" },
    { number: 3, type: "Short Answer", marks: 1, text: "Round 4,872 to the nearest hundred.", answer: "4,900", correct: 6, total: 6, topic: "Number & Arithmetic" },
    { number: 4, type: "Open-Ended", marks: 4, instruction: "Show your working clearly.", text: "A baker made 1,250 muffins. He sold 3/5 of them in the morning and 175 in the afternoon. How many muffins were left?", answer: "325", correct: 3, total: 6, topic: "Word Problems" },
  ],
  11: [
    { number: 1, text: "What is the boiling point of water at sea level?", correct: 2, total: 2, topic: "Matter & Materials" },
    { number: 2, text: "Describe the function of red blood cells.", correct: 1, total: 2, topic: "Living Things" },
    { number: 3, text: "State the unit used to measure electric current.", correct: 2, total: 2, topic: "Forces & Energy" },
  ],
  12: [
    { number: 1, text: "Choose the correct pronoun: ___ is my sister.", correct: 2, total: 3, topic: "Grammar" },
    { number: 2, text: "Match the word to its opposite: 'big'.", correct: 2, total: 2, topic: "Vocabulary" },
    { number: 3, text: "Read the passage and answer: where did the boy go?", correct: 1, total: 2, topic: "Reading Comprehension" },
  ],
  13: [
    { number: 1, text: "Name the gas plants absorb during photosynthesis.", correct: 1, total: 2, topic: "Living Things" },
    { number: 2, text: "Is sugar dissolving in water a physical or chemical change?", correct: 2, total: 2, topic: "Matter & Materials" },
    { number: 3, text: "What force pulls objects toward the Earth?", correct: 1, total: 2, topic: "Forces & Energy" },
  ],
  14: [
    { number: 1, text: "Write a short email requesting a meeting reschedule.", correct: 1, total: 1, topic: "Respond to questions using information provided" },
    { number: 2, text: "Write a paragraph describing your workplace.", correct: 0, total: 1, topic: "Describe a picture" },
    { number: 3, text: "Express your opinion on remote work in writing.", correct: 1, total: 1, topic: "Express an opinion" },
  ],
  15: [
    { number: 1, type: "MCQ", marks: 1, text: "Listen and identify the main topic of the conversation.", options: ["A delayed shipment", "A job interview", "A team lunch", "A software update"], answer: "A job interview", correct: 2, total: 3, topic: "Respond to questions" },
    { number: 2, type: "MCQ", marks: 1, text: "Listen and select the correct response to the question.", options: ["Yes, I did.", "At 3 o'clock.", "It's on the third floor.", "Twice a week."], answer: "It's on the third floor.", correct: 1, total: 3, topic: "Respond to questions using information provided" },
    { number: 3, type: "MCQ", marks: 1, text: "Listen to the announcement and answer the question.", options: ["The flight is delayed by 30 minutes.", "The gate has changed.", "Boarding has started.", "The flight is cancelled."], answer: "The flight is delayed by 30 minutes.", correct: 2, total: 2, topic: "Read a text aloud" },
    { number: 4, type: "Open-Ended", marks: 2, text: "Listen and summarise the speaker's opinion.", answer: "Remote work improves productivity, but only with clear communication.", correct: 1, total: 2, topic: "Express an opinion" },
  ],
};

const TOEIC_TOPICS = ["Read a text aloud", "Describe a picture", "Respond to questions", "Respond to questions using information provided", "Express an opinion"];
const MATH_TOPICS = ["Number & Arithmetic", "Algebra", "Geometry", "Word Problems"];
const SCIENCE_TOPICS = ["Matter & Materials", "Living Things", "Forces & Energy"];
const ENGLISH_TOPICS = ["Grammar", "Vocabulary", "Reading Comprehension"];

function getTopicsForSubject(subject) {
  if (subject.includes("TOEIC")) return TOEIC_TOPICS;
  if (subject.includes("Math") || subject.includes("Maths")) return MATH_TOPICS;
  if (subject.includes("Science")) return SCIENCE_TOPICS;
  if (subject.includes("English")) return ENGLISH_TOPICS;
  return [];
}

// Deterministic (not random) per-student, per-question correctness — stable across reloads.
// Used only for the Question/Topic Detail drill-down tables, where individual per-student,
// per-question data isn't hand-authored (only worksheet-level aggregates in QUESTION_RESULTS are).
function studentAnsweredCorrectly(studentIndex, questionIndex, targetScorePercent) {
  const pseudo = (studentIndex * 37 + questionIndex * 53 + 11) % 100;
  return pseudo < targetScorePercent;
}

/* ---------- Scope helpers (list and insight pages) ---------- */

function branchName(branchId) {
  const branch = BRANCHES.find((candidate) => candidate.id === branchId);
  return branch ? branch.name : branchId;
}

// Every branch a worksheet is assigned to — HQ worksheets can span several.
function worksheetBranchIds(worksheet) {
  return worksheet.branchIds || [worksheet.branchId];
}

function studentBranchId(worksheet, student) {
  return student.branchId || worksheet.branchId;
}

function classTeacher(branchId, className) {
  return (CLASS_TEACHERS[branchId] || {})[className] || null;
}

// A worksheet's students as one account sees them: HQ (no branchId) sees every student,
// a sub-branch only the students in its own branch.
function studentsInScope(worksheet, branchId = null) {
  const students = STUDENT_RESULTS[worksheet.id] || [];
  return branchId ? students.filter((student) => studentBranchId(worksheet, student) === branchId) : students;
}

// List-row figures derived from the student results, so a sub-branch sees the numbers for its
// own students even on a worksheet HQ assigned to several branches.
function worksheetStats(worksheet, branchId = null) {
  const students = studentsInScope(worksheet, branchId);
  const completed = students.filter((student) => student.status === "Completed");
  const classKeys = new Set(students.map((student) => `${studentBranchId(worksheet, student)}|${student.class}`));
  const teachers = new Set(students
    .map((student) => classTeacher(studentBranchId(worksheet, student), student.class))
    .filter(Boolean));
  const scoreSum = completed.reduce((sum, student) => sum + student.score, 0);
  return {
    total: students.length,
    completed: completed.length,
    avgScore: completed.length ? Math.round(scoreSum / completed.length) : 0,
    branches: branchId ? 1 : worksheetBranchIds(worksheet).length,
    classes: classKeys.size,
    teachers: teachers.size,
  };
}
