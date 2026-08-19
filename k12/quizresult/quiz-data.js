// Real content transcribed from demo.heyhi.sg/onlinequizv2/tutor/quiz-result
// (tutor_id=11987, attempt_id=869716 — student: Samantha Wardhana).
// Question text, options, model answers, marks and AI remarks are copied
// verbatim from that live attempt, including the student's original
// spelling/typing errors in their answers.

// The "visual text" leaflet referenced by questions 2A-2H — same two
// source images the live app embeds in each of those questions.
const LEAFLET_IMAGE_URLS = [
  "https://static-contents-smartjen.s3.ap-southeast-1.amazonaws.com/img/articleImage/2021-08-09-16284481703859.png",
  "https://static-contents-smartjen.s3.ap-southeast-1.amazonaws.com/img/articleImage/2021-08-09-16284481703883.png",
];

const quizResult = {
  title: "Grammar & Comprehension Practice",
  subject: "Primary English",
  level: "Primary 6",
  studentName: "Samantha Wardhana",
  attempts: "6/6",
  statusLabel: "All Questions Marked",
  // Sum of every question's marksObtained/maxMarks below (20.5/34 = 60%) —
  // kept in sync so the header total matches the per-question breakdown.
  totalMarks: 20.5,
  maxMarks: 34,
  percentage: 60,

  questions: [
    {
      number: "1",
      type: "oe",
      prompt:
        "Rewrite the given sentence using the words provided. Your answer must be in one sentence. The meaning of your sentence must be the same as the meaning of the given sentence.",
      given: "The two pupils quarrelled once Mrs Ong left the classroom.",
      starter: "No sooner",
      studentAnswerSegments: [
        {
          text: "had mrs ong left the classroom than the two pupils quarreleld",
          type: "partial",
          note:
            "This part shows you understand the correct sentence structure and meaning, but 'mrs ong' should be capitalized to 'Mrs Ong' and 'quarreleld' is a misspelling of 'quarrelled.' These small errors affect the quality but not the meaning.",
        },
        {
          text: "reqrite the given sentence",
          type: "incorrect",
          note:
            "This phrase is unrelated to the sentence transformation task and should not be included in your answer. Including irrelevant words can confuse the meaning and reduce your score.",
        },
      ],
      modelAnswer: "had Mrs Ong left the classroom than the two pupils quarrelled",
      marksGiven: 1.5,
      marksObtained: 1.5,
      maxMarks: 2,
      remark:
        "You used the right sentence structure, but be sure to capitalize names, spell words correctly, and avoid extra unrelated words in your answer.",
    },
    {
      number: "2A",
      type: "mcq",
      prompt: "Look at the visual text and answer the following questions.",
      images: LEAFLET_IMAGE_URLS,
      question: "Which of the following is the main target group of this leaflet?",
      options: [
        { text: "Children and youth", correct: true },
        { text: "Young working adults", correct: false },
        { text: "Authors and illustrators", correct: false },
        { text: "All members of the public", correct: false },
      ],
      answered: true,
      selectedIndex: 0,
      marksObtained: 1,
      maxMarks: 1,
    },
    {
      number: "2B",
      type: "mcq",
      prompt: "Look at the visual text and answer the following questions.",
      question: "Which statement best describes the main purpose of the Festival of Books?",
      options: [
        { text: "For authors to autograph books", correct: false },
        { text: "For young people to be excited about books", correct: true },
        { text: "For members of the public to purchase books at a good price", correct: false },
        { text: "For book publishers to showcase the new books they have published", correct: false },
      ],
      answered: true,
      selectedIndex: 0,
      marksObtained: 0,
      maxMarks: 1,
    },
    {
      number: "2C",
      type: "mcq",
      prompt: "Look at the visual text and answer the following questions.",
      question: "If someone has a question about the Festival of Books, he should _________.",
      options: [
        { text: "buy a festival pass", correct: false },
        { text: "contact Ms Donna Leng", correct: true },
        { text: "wait for the start of the Festival of Books", correct: false },
        { text: "visit the Chancery Community Field website", correct: false },
      ],
      answered: true,
      selectedIndex: 1,
      marksObtained: 1,
      maxMarks: 1,
    },
    {
      number: "2D",
      type: "mcq",
      prompt: "Look at the visual text and answer the following questions.",
      question:
        "Mary is a budding writer and dreams of publishing her work. She ought to purchase a festival pass for the ____________ Booth.",
      options: [
        { text: "Read Aloud to Me", correct: false },
        { text: "Discover an Author", correct: true },
        { text: "Tickle my Taste buds", correct: false },
        { text: "Create your own Superhero", correct: false },
      ],
      answered: true,
      selectedIndex: 3,
      marksObtained: 0,
      maxMarks: 1,
    },
    {
      number: "2E",
      type: "mcq",
      prompt: "Look at the visual text and answer the following questions.",
      question: "Based on the information given in the brochure which of the following statements is false?",
      options: [
        { text: "Everyone visiting the festival must pre-register prior the event", correct: true },
        { text: "You may visit the Festival of Books on any of the published dates", correct: false },
        { text: "The Bookshop will be open daily throughout the entire Festival of Books", correct: false },
        { text: "The Festival of Books is being organised by the Singapore Book Council", correct: false },
      ],
      answered: true,
      selectedIndex: 0,
      marksObtained: 1,
      maxMarks: 1,
    },
    {
      number: "2F",
      type: "mcq",
      prompt: "Look at the visual text and answer the following questions.",
      question: "Which statement best describes the past attendees of the festival?",
      options: [
        { text: "They participated in the cooking demonstration", correct: false },
        { text: "They were barely satisfied with the program offered", correct: false },
        { text: "They had many different experiences that left lasting memories", correct: true },
        { text: "They were pleased to receive a free book for being an early visitor to the festival.", correct: false },
      ],
      answered: true,
      selectedIndex: 0,
      marksObtained: 0,
      maxMarks: 1,
    },
    {
      number: "2G",
      type: "mcq",
      prompt: "Look at the visual text and answer the following questions.",
      question: "What is the main purpose of the leaflet?",
      options: [
        { text: "to promote awareness of the Festival of Books", correct: true },
        { text: "to aid in distributing tickets to the Festival of Books", correct: false },
        { text: "to advertise the content for all the special booths for the Festival of Books", correct: false },
        { text: "to attract book shops sellers to promote their books at the Festival of Books", correct: false },
      ],
      answered: true,
      selectedIndex: 0,
      marksObtained: 1,
      maxMarks: 1,
    },
    {
      number: "2H",
      type: "mcq",
      prompt: "Look at the visual text and answer the following questions.",
      question: "Why are the titles of the specialist booths printed in bold?",
      options: [
        { text: "to beautify the leaflet", correct: false },
        { text: "to advertise the festival", correct: false },
        { text: "to promote visits to the specialist booths", correct: true },
        { text: "to raise awareness of the special guests at the festival", correct: false },
      ],
      answered: true,
      selectedIndex: 1,
      marksObtained: 0,
      maxMarks: 1,
    },
    {
      number: "3",
      type: "oe",
      prompt:
        "Rewrite the given sentences using the words provided. Your answer must be in one sentence. The meaning of your sentence must be the same as the meaning of the given sentences.",
      given: "John shouted at Mary. He did not consider her feelings.",
      starter: "Without any",
      studentAnswerSegments: [
        {
          text: "consideration to her feeling john shouted at mary",
          type: "partial",
          note:
            "Good sentence structure and meaning, but 'to' should be 'for' ('consideration for her feelings'), 'feeling' should be plural 'feelings', and 'john' and 'mary' need to be capitalized to 'John' and 'Mary'.",
        },
      ],
      modelAnswer: "consideration for her feelings, John shouted at Mary",
      marksGiven: 1,
      marksObtained: 1,
      maxMarks: 2,
      remark:
        "Good job keeping the meaning and structure correct. Watch three things next time: use 'for' instead of 'to', keep 'feelings' plural, and capitalize proper nouns like 'John' and 'Mary'.",
    },
    {
      number: "4",
      type: "mcq",
      question: '"If the salesperson calls again, I _____ him a piece of my mind!" Mrs Tang exclaimed.',
      options: [
        { text: "will give", correct: true },
        { text: "would give", correct: false },
        { text: "will have given", correct: false },
        { text: "would have given", correct: false },
      ],
      answered: true,
      selectedIndex: 1,
      marksObtained: 0,
      maxMarks: 1,
    },
    {
      number: "5",
      type: "fillblank",
      prompt: "Fill in each blank with a suitable word.",
      passage: [
        "Do you recall when you last sat through an entire meal without checking your mobile phone? You probably cannot [[A]] because we are living in a world full of smartphone addicts. We are [[B]] to spend more than a few minutes away from social media.",
        "[[C]] of the most significant relationships between smartphones and food is the need to take endless photographs of food, post them on social [[D]] and await comments from friends in the digital world. Observe your surroundings at any restaurant and you will see a new ritual: [[E]] any food passes one's lips, a photograph is taken first. Now, few meals seem to go by [[F]] some kind of photographic evidence.",
        "While the experience of eating has become more sociable in the digital world, it is at the [[G]] of human interaction. In the past, sharing stories with one another during meals [[H]] a common sight in restaurants. Now, expect to be frequently interrupted by your phone [[I]] if it is on silent mode. A restaurant owner in New York admitted that it has become a norm for us to constantly fiddle [[J]] our phones instead of enjoying the [[K]] of others.",
        "We are checking our phones over 150 times a day, according [[L]] a 2013 Internet Trends report. We are driven by an addiction [[M]] than a habit when it comes to using mobile phones.",
        "The question before us is whether we can do something to stop it, The solution is very [[N]]. Just stop. No one will miss you for a [[O]] of hours. However, someone will be very happy to have you back that lovely person sitting opposite you at dinner.",
      ],
      blanks: {
        A: { correct: "remember, recall", given: "remember", marks: 1 },
        B: { correct: "unable", given: "unable", marks: 1 },
        C: { correct: "One", given: "A", marks: 0 },
        D: { correct: "media", given: "media", marks: 1 },
        E: { correct: "before", given: "before", marks: 1 },
        F: { correct: "without", given: "with", marks: 0 },
        G: { correct: "expense, cost", given: "cost", marks: 1 },
        H: { correct: "was", given: "was", marks: 1 },
        I: { correct: "even", given: "still", marks: 0 },
        J: { correct: "with", given: "with", marks: 1 },
        K: { correct: "company", given: "company", marks: 1 },
        L: { correct: "to", given: "to", marks: 1 },
        M: { correct: "rather", given: "more", marks: 0 },
        N: { correct: "easy, simple, straightforward, effortless, uncomplicated", given: "simple", marks: 1 },
        O: { correct: "couple", given: "few", marks: 0 },
      },
      marksObtained: 10,
      maxMarks: 15,
      remark:
        "Good work — 10 out of 15 correct. A few to review:\nBlank C: You wrote 'A', but 'One' fits better here to introduce the main point.\nBlank F: You wrote 'with', but the sentence needs 'without' to show something is missing ('few meals seem to go by without...').\nBlank I: You wrote 'still', but 'even' fits better to show interruptions happen often, even on silent mode.\nBlank M: You wrote 'more', but 'rather' is the correct word to show contrast ('an addiction rather than a habit').\nBlank O: You wrote 'few', but 'couple' is the more natural word here ('a couple of hours').",
    },
    {
      number: "6",
      type: "mcq",
      question:
        "Siti was suspicious of the ___________ of the fifty-dollar note the stranger had thrust into her hands.",
      options: [
        { text: "reality", correct: false },
        { text: "validity", correct: false },
        { text: "sensibility", correct: false },
        { text: "authenticity", correct: true },
      ],
      answered: true,
      selectedIndex: 3,
      marksObtained: 1,
      maxMarks: 1,
    },
    {
      number: "7",
      type: "fillblank",
      prompt: "Fill in the blank with the given adjectives, write in the correct order.",
      passage: [
        "(jade, green, bracelet, delicate)",
        "Mother gave Sarah a [[A]] for her birthday.",
      ],
      blanks: {
        A: { correct: "delicate green jade bracelet", given: "delicate green jade bracelet", marks: 2 },
      },
      marksObtained: 2,
      maxMarks: 2,
      remark: "Great job! You put the adjectives in the correct order: delicate, green, jade, bracelet.",
    },
    {
      number: "8",
      type: "mcq",
      question:
        "This rude customer who was yelling at the cashier was oblivious __________ the crowd gathering around her.",
      options: [
        { text: "to", correct: true },
        { text: "at", correct: false },
        { text: "by", correct: false },
        { text: "with", correct: false },
      ],
      answered: true,
      selectedIndex: 2,
      marksObtained: 0,
      maxMarks: 1,
    },
    {
      number: "9",
      type: "mcq",
      question: "Zachary ____ on the patch of grass to admire the night sky, didn't he?",
      options: [
        { text: "lay", correct: true },
        { text: "lies", correct: false },
        { text: "laid", correct: false },
        { text: "lain", correct: false },
      ],
      answered: true,
      selectedIndex: 2,
      marksObtained: 0,
      maxMarks: 1,
    },
    {
      number: "10",
      type: "mcq",
      question: "None of Mdm Sofia's neighbours know anything about her because she ___ talks to them.",
      options: [
        { text: "hardly", correct: true },
        { text: "always", correct: false },
        { text: "usually", correct: false },
        { text: "frequently", correct: false },
      ],
      answered: true,
      selectedIndex: 0,
      marksObtained: 1,
      maxMarks: 1,
    },
  ],
};
