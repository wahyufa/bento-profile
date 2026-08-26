// Speech (interactive speaking practice) result data.
//
// Shared by BOTH versions of the speech result page:
//
//   v1 (speech-result-v1.html) — parity with what production ships today:
//        prompts, recordings, Speech Practice Score, IELTS Speaking rubric.
//   v2 (speech-result-v2.html) — v1 plus a proposed transcript feature:
//        `transcript` is rendered word by word with pronunciation notes.
//
// `transcript` is therefore v2-only; v1 simply ignores it. Everything else
// is used by both, so the two versions show the same attempt scored the
// same way, and the only difference between them is the new feature.
//
// The TEMPLATE is taken from the live app —
// demo.heyhi.sg/onlinequizv2/quiz-result-speech-interactive?attempt_id=990922
// — which defines: an "Interactive" question with several sub-prompts, one
// or more audio recordings per question, a "Speech Practice Score" panel
// (an overall score plus Accuracy / Pronunciation / Articulation / Fluency
// / Prosody, each out of 100), and an IELTS Speaking rubric scored out of
// 36 across four criteria.
//
// The CONTENT is dummy: that production attempt was submitted without a
// real spoken answer, so every score there is 0 and there is no transcript
// to copy. The values below are invented but internally consistent — a
// mid-band student (~50%) whose transcript exercises all three word states
// the live stylesheet defines, so every visual state is exercised.

// Per-word states, matching the live app's `.highlight-box .word` classes:
//   normal          - said clearly
//   phoneme-mistake - said, but one sound inside the word is wrong
//                     (`errorPart` marks the offending letters)
//   deletion        - expected but swallowed / not picked up
const SPEECH_WORD_STATES = {
  normal: { label: "Clear", accent: "#16d8a7" },
  "phoneme-mistake": { label: "Mispronounced sound", accent: "#16d8a7", errorAccent: "#ff1744" },
  deletion: { label: "Not picked up", accent: "#ff1744" },
};

// The five sub-scores the Speech Practice Score panel reports, each /100.
const SPEECH_METRICS = [
  { key: "accuracy", label: "Accuracy" },
  { key: "pronunciation", label: "Pronunciation" },
  { key: "articulation", label: "Articulation" },
  { key: "fluency", label: "Fluency" },
  { key: "prosody", label: "Prosody" },
];

const speechResult = {
  // `title` mirrors the internal name the attempt carries in production and
  // is what the on-screen topbar shows; `worksheetTitle` is the presentable
  // name printed on the PDF. Same split as the essay result.
  title: "Speech Practice 4.2",
  worksheetTitle: "Tourism & Travel Speaking Practice",
  subject: "English Language",
  level: "Secondary 3",
  studentName: "Samantha Wardhana",
  attempts: "1/1",
  statusLabel: "All Questions Marked",
  // Sum of the two questions' rubric scores below (19 + 17 = 36 / 72).
  totalMarks: 36,
  maxMarks: 72,
  percentage: 50,

  questions: [
    {
      number: "1",
      // "Interactive" is the live app's badge for an open-ended speaking
      // task, as opposed to its read-aloud mode.
      interactive: true,
      prompts: [
        "How can tourism benefit local communities?",
        "In your opinion, how does tourism affect the environment?",
        "What should tourists do to travel responsibly?",
      ],
      // The student records more than once; the app keeps every take.
      recordings: [
        { label: "Take 1", duration: "00:07" },
        { label: "Take 2", duration: "00:21" },
      ],
      aiReviewed: true,

      // Plain strings are clean words; objects carry a flagged state.
      transcript: [
        "Tourism", "can", "help", "local", "people", "because", "they", "can", "sell",
        "food", "and",
        {
          t: "souvenir",
          state: "phoneme-mistake",
          errorPart: "sou",
          note: "The first syllable came out as 'saw' rather than 'soo'. Say 'soo-vuh-neer', keeping the vowel long.",
        },
        "to", "the", "visitor.", "It", "also", "make", "new", "job", "for", "the", "young",
        "people", "in", "my", "village.", "But", "when", "too", "many",
        {
          t: "tourist",
          state: "deletion",
          note: "This word was swallowed and the recogniser did not pick it up. Slow down slightly and finish the final 't'.",
        },
        "come,", "they", "leave",
        {
          t: "rubbish",
          state: "phoneme-mistake",
          errorPart: "bb",
          note: "The double 'b' was voiced too softly, so it sounded closer to 'rubish'. Give the /b/ a firmer stop.",
        },
        "and", "the", "beach", "become", "dirty.", "So", "tourist", "should",
        {
          t: "respect",
          state: "phoneme-mistake",
          errorPart: "res",
          note: "Stress landed on the first syllable ('RES-pect'). In this verb the stress belongs on the second: 're-SPECT'.",
        },
        "the", "local", "culture", "and", "not",
        {
          t: "waste",
          state: "deletion",
          note: "Not picked up — it ran into the following word. Leave a small pause between 'not' and 'waste'.",
        },
        "the", "water.",
      ],

      speechScore: {
        overall: 68,
        accuracy: 72,
        pronunciation: 65,
        articulation: 70,
        fluency: 61,
        prosody: 66,
      },

      rubrics: {
        name: "IELTS Speaking Band Descriptors",
        componentNote: "Scoring criteria for Academic and General Training tests",
        obtained: 19,
        max: 36,
        criteria: [
          {
            name: "Fluency and coherence",
            obtained: 5,
            max: 9,
            descriptors: [
              "Usually maintains flow of speech but uses repetition, self-correction and/or slow speech to keep going.",
              "May over-use certain connectives and discourse markers.",
              "Produces simple speech fluently, but more complex communication causes fluency problems.",
            ],
            remark:
              "You kept going for the whole answer, which is good. The ideas jump between the three questions though — answer them one at a time and use markers like 'First of all' and 'On the other hand' to signal the change.",
          },
          {
            name: "Lexical resource",
            obtained: 5,
            max: 9,
            descriptors: [
              "Manages to talk about familiar and unfamiliar topics but uses vocabulary with limited flexibility.",
              "Attempts to use paraphrase but with mixed success.",
            ],
            remark:
              "Your word choice covers the basics but stays general. Reach for topic words such as 'local economy', 'livelihood', 'over-tourism' and 'carbon footprint' instead of repeating 'people' and 'thing'.",
          },
          {
            name: "Grammatical range and accuracy",
            obtained: 4,
            max: 9,
            descriptors: [
              "Produces basic sentence forms and some correct simple sentences but subordinate structures are rare.",
              "Errors are frequent and may lead to misunderstanding.",
            ],
            remark:
              "Watch subject-verb agreement and plurals: 'It also make new job' should be 'It also makes new jobs', and 'the beach become dirty' should be 'the beaches become dirty'. Fixing these two patterns alone would lift this band.",
          },
          {
            name: "Pronunciation",
            obtained: 5,
            max: 9,
            descriptors: [
              "Shows all the positive features of Band 4 and some, but not all, of the positive features of Band 6.",
              "Uses a range of pronunciation features with mixed control.",
              "Can generally be understood throughout, though mispronunciation of individual words or sounds reduces clarity at times.",
            ],
            remark:
              "You are clear most of the time. The two things costing you marks are word stress ('re-SPECT', not 'RES-pect') and endings that disappear — finish the final consonant so words like 'tourist' and 'waste' are picked up.",
          },
        ],
      },
    },

    {
      number: "2",
      interactive: true,
      prompts: [
        "Describe a place you have visited that made a strong impression on you.",
        "Explain why it impressed you, and whether you would recommend it to others.",
      ],
      recordings: [{ label: "Take 1", duration: "00:24" }],
      aiReviewed: true,

      transcript: [
        "Last", "year", "I", "go", "to", "Bali", "with", "my", "family", "and", "I", "really",
        {
          t: "enjoy",
          state: "phoneme-mistake",
          errorPart: "j",
          note: "The 'j' was produced as a soft 'y', giving 'en-yoy'. It needs the harder 'j' sound, as in 'jam'.",
        },
        "the", "beach", "there.", "The", "water", "is", "very", "clear", "and", "we", "can",
        "see", "the", "fish",
        {
          t: "swimming",
          state: "deletion",
          note: "Trailed off and was not picked up. Keep the volume steady to the end of the phrase.",
        },
        "near", "the", "sand.", "The", "local", "people", "is", "very", "friendly", "and",
        "they", "teach", "us", "how", "to", "make",
        {
          t: "traditional",
          state: "phoneme-mistake",
          errorPart: "tradi",
          note: "Came out as 'tra-di-tional' with four flat syllables. Stress the third: 'tra-di-TION-al'.",
        },
        "food.", "I", "will",
        {
          t: "recommend",
          state: "phoneme-mistake",
          errorPart: "rec",
          note: "The first syllable was over-stressed. Say 're-co-MMEND', with the weight on the last syllable.",
        },
        "this", "place", "to", "my", "friend", "because", "it", "is", "beautiful", "and", "not",
        "too", "expensive.",
      ],

      speechScore: {
        overall: 61,
        accuracy: 64,
        pronunciation: 58,
        articulation: 63,
        fluency: 57,
        prosody: 60,
      },

      rubrics: {
        name: "IELTS Speaking Band Descriptors",
        componentNote: "Scoring criteria for Academic and General Training tests",
        obtained: 17,
        max: 36,
        criteria: [
          {
            name: "Fluency and coherence",
            obtained: 4,
            max: 9,
            descriptors: [
              "Cannot respond without noticeable pauses and may speak slowly, with frequent repetition and self-correction.",
              "Links basic sentences but with repetitious use of simple connectives and some breakdowns in coherence.",
            ],
            remark:
              "You describe the place clearly but rely on 'and' to join almost every sentence. Try 'because', 'even though' and 'what struck me most was...' to connect ideas with more variety.",
          },
          {
            name: "Lexical resource",
            obtained: 5,
            max: 9,
            descriptors: [
              "Manages to talk about familiar and unfamiliar topics but uses vocabulary with limited flexibility.",
              "Attempts to use paraphrase but with mixed success.",
            ],
            remark:
              "'Beautiful' and 'very clear' do a lot of work here. Stronger alternatives — 'crystal-clear', 'unspoilt', 'welcoming' — would show a wider range without being harder to say.",
          },
          {
            name: "Grammatical range and accuracy",
            obtained: 4,
            max: 9,
            descriptors: [
              "Produces basic sentence forms and some correct simple sentences but subordinate structures are rare.",
              "Errors are frequent and may lead to misunderstanding.",
            ],
            remark:
              "The answer is about last year, so it needs past tense: 'I went to Bali', 'we could see', 'they taught us'. Also 'The local people is' should be 'The local people are'.",
          },
          {
            name: "Pronunciation",
            obtained: 4,
            max: 9,
            descriptors: [
              "Uses a limited range of pronunciation features.",
              "Attempts to control features but lapses are frequent.",
              "Mispronunciations are frequent and cause some difficulty for the listener.",
            ],
            remark:
              "Multi-syllable words are where this slips — 'traditional' and 'recommend' both lost their stress pattern. Practise saying them with the beat on the right syllable before recording again.",
          },
        ],
      },
    },
  ],
};
