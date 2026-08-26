// Real content transcribed from demo.heyhi.sg/onlinequizv2/quiz-result
// (attempt_id=990289 — "Composition Writing 20.7", an AI-marked essay quiz).
//
// The inline annotations come verbatim from that attempt's
// /api/quiz/get-annotation/990289 payload, including their character
// offsets into the student's answer — `start`/`end` index into `answer`
// exactly as the live app uses them to place each highlight. Rubric band
// descriptors and per-criterion AI remarks are copied from the Rubrics
// tab of the same attempt.
//
// The student's answers are deliberately wrong/nonsensical (it's a demo
// account seeded with a bad essay), which is why every rubric band is low.

// Feedback categories, matching the live app's annotation_tag values and
// the swatches its stylesheet defines for each (data-v-aef70a00 block).
const FEEDBACK_CATEGORIES = {
  grammar: { label: "Grammar", accent: "#f6920a", tint: "#fff7ee" },
  writing_clarity: { label: "Writing Clarity", accent: "#0ea5e9", tint: "#edf9ff" },
  spelling: { label: "Spelling", accent: "#ff5660", tint: "#ffedee" },
  general_feedback: { label: "General Feedback", accent: "#7884b9", tint: "#dce4f0" },
};

const essayResult = {
  // `title` is the internal name the attempt carries in production and is
  // what the on-screen topbar shows. `worksheetTitle` is the presentable
  // name printed on the PDF — a worksheet a student takes home shouldn't
  // be headed by an internal build label like "20.7".
  title: "Composition Writing 20.7",
  worksheetTitle: "Ocean & Environment Essay Practice",
  subject: "English Language",
  level: "Secondary 2",
  studentName: "Samantha Wardhana",
  attempts: "1/1",
  statusLabel: "All Questions Marked",
  // Sum of the two questions' rubric scores below (12 + 12 = 24 / 72).
  totalMarks: 24,
  maxMarks: 72,
  percentage: 33,

  questions: [
    {
      number: "1",
      // Essay prompts are a list of sub-prompts the student answers in one
      // continuous piece of writing, not separate numbered questions.
      prompts: [
        "How does the ocean influence the climate and weather in different parts of the world?",
        "Why is the ocean important for human life and the environment?",
        "What are some major problems facing the world's oceans today, and how can we solve them?",
      ],
      answer:
        "The ocean is very big hot desert that make the wind blowing fast to the mountain. Ocean climate is not important because weather always come from the moon and sun rotation only. People need ocean because fish is can fly in the sky and give us milk everyday like cow. For human life, water in ocean is very sweet like sugar juice so we can drink it directly when we thirsty without boiling. To solve ocean problem today, we must put more hot oil and factory garbage into the water so the fish can become warm and happy every single day.",
      wordCount: 101,
      aiReviewed: true,

      // start/end are character offsets into `answer` above.
      annotations: [
        {
          start: 38,
          end: 59,
          text: "make the wind blowing",
          category: "grammar",
          feedback:
            "This phrase is grammatically incorrect because it has wrong verb form and awkward phrasing. Use 'makes the wind blow' (for example: 'that makes the wind blow toward the mountain'). The change fixes subject-verb agreement and uses the correct infinitive structure for natural English.",
        },
        {
          start: 121,
          end: 140,
          text: "weather always come",
          category: "grammar",
          feedback:
            "This phrase is grammatically incorrect due to subject-verb disagreement. Change it to 'weather always comes' (for example: 'weather always comes from several sources'). This corrects the verb agreement and makes the sentence grammatically standard.",
        },
        {
          start: 204,
          end: 219,
          text: "fish is can fly",
          category: "grammar",
          feedback:
            "This phrase is grammatically incorrect because it mixes auxiliary and copula verbs improperly. Use 'fish can fly' if referring to flying fish (for example: 'Some fish can fly short distances above the water'). The correction removes the redundant verb and produces an acceptable English structure.",
        },
        {
          start: 248,
          end: 256,
          text: "everyday",
          category: "spelling",
          feedback:
            "This word is misused because 'everyday' (one word) is an adjective meaning ordinary, while the intended meaning is 'each day'. Replace it with 'every day' (for example: 'give us milk every day like cows'). Using 'every day' fixes the word-class error and conveys the intended frequency.",
        },
        {
          start: 312,
          end: 328,
          text: "like sugar juice",
          category: "writing_clarity",
          feedback:
            "This simile is awkward and misleading because it suggests an incorrect taste comparison for ocean water. Replace it with a clearer phrase such as 'like sugar water' or remove it and state the fact (for example: 'not like sugar water, but rather salty'). The revision improves clarity by avoiding an unclear or inappropriate analogy.",
        },
        {
          start: 357,
          end: 372,
          text: "when we thirsty",
          category: "grammar",
          feedback:
            "This phrase is ungrammatical because it omits the linking verb 'are' needed for a correct clause. Change it to 'when we are thirsty' (for example: 'when we are thirsty, we should not drink seawater'). Adding 'are' completes the grammatical structure and clarifies the condition being described.",
        },
        {
          start: 399,
          end: 412,
          text: "ocean problem",
          category: "grammar",
          feedback:
            "This phrase is grammatically incomplete because it should be plural when referring to multiple issues. Change it to 'ocean problems' (for example: 'To solve ocean problems today, we must act'). Making it plural improves grammatical agreement and better reflects the plurality of issues affecting the ocean.",
        },
      ],

      rubrics: {
        name: "IELTS Writing Task 1 Band Descriptors",
        componentLabel: "COMPONENT 1",
        componentNote: "Scoring criteria for Academic and General Training tests",
        obtained: 12,
        max: 36,
        criteria: [
          {
            name: "Task Achievement",
            obtained: 3,
            max: 9,
            descriptors: [
              "The response does not address the requirements of the task (possibly because of misunderstanding of the data/diagram/situation).",
              "Key features/bullet points which are presented may be largely irrelevant.",
              "Limited information is presented, and this may be used repetitively.",
            ],
            remark:
              "You try to answer the question, but most ideas are inaccurate or confusing. You should explain real ocean effects, its importance, and real solutions like reducing pollution and protecting sea life.",
          },
          {
            name: "Coherence & Cohesion",
            obtained: 3,
            max: 9,
            descriptors: [
              "There is no apparent logical organisation. Ideas are discernible but difficult to relate to each other.",
              "Minimal use of sequencers or cohesive devices. Those used do not necessarily indicate a logical relationship between ideas.",
              "There is difficulty in identifying referencing.",
            ],
            remark:
              'Your ideas are present, but they are not linked well or organized clearly. You should group the answers by question and use linking words like "First" and "Finally" to make the flow easier to follow.',
          },
          {
            // "Resouce" is spelled that way in the production rubric — kept
            // verbatim so this mirrors what a teacher actually sees.
            name: "Lexical Resouce",
            obtained: 3,
            max: 9,
            descriptors: [
              "The resource is inadequate (which may be due to the response being significantly underlength).",
              "Possible over-dependence on input material or memorised language.",
              "Control of word choice and/or spelling is very limited, and errors predominate. These errors may severely impede meaning.",
            ],
            remark:
              'Your word choice is very limited and often incorrect for this topic. You should use accurate ocean-related words like "currents," "marine life," and "pollution" instead of unclear phrases such as "sweet like sugar juice".',
          },
          {
            name: "Grammatical Range & Accuracy",
            obtained: 3,
            max: 9,
            descriptors: [
              "Sentence forms are attempted, but errors in grammar and punctuation predominate (except in memorised phrases or those taken from the input material). This prevents most meaning from coming through.",
              "Length may be insufficient to provide evidence of control of sentence forms.",
            ],
            remark:
              'Your grammar is frequently inaccurate, and some sentences are hard to understand. You should use short correct sentences first, such as "The ocean helps control climate" and "It provides food for people."',
          },
        ],
      },

      // The live attempt records no good points for either question (the
      // essay is deliberately poor), so this is the real empty state.
      goodPoints: [],
    },

    {
      number: "2",
      prompts: ["How does plastic pollution affect marine animals and ecosystems?"],
      answer:
        "Plastic pollution is make the sea animals very happy because plastic is a good food for shark and whale to make they grow fat and healthy. When fish eat plastic bag, they can swim faster like rocket airplane in space. Ecosystem in ocean become more beautiful when garbage and oil spill are floating because it look like colorful flower garden. Therefore, we do not need to clean the ocean, we must throw more plastic trash every day so the fish can play with it happily without any problem.",
      wordCount: 88,
      aiReviewed: true,

      annotations: [
        {
          start: 18,
          end: 25,
          text: "is make",
          category: "grammar",
          feedback:
            "This phrase is grammatically incorrect because the verb form doesn't agree with the singular subject; use 'makes' for present simple third-person singular. Corrected: 'Plastic pollution makes'. This change fixes subject-verb agreement and produces a grammatically correct clause.",
        },
        {
          start: 72,
          end: 83,
          text: "a good food",
          category: "grammar",
          feedback:
            "Using 'a' before 'food' is incorrect because 'food' is uncountable in this context and does not take the indefinite article. Corrected: 'good food'. Removing 'a' matches the uncountable noun usage and produces a natural English phrase.",
        },
        {
          start: 88,
          end: 103,
          text: "shark and whale",
          category: "grammar",
          feedback:
            "These nouns should be plural when referring to the species in general; singular forms imply individual animals rather than the groups. Corrected: 'sharks and whales'. Pluralizing clarifies that the sentence refers to those animals as species rather than single individuals.",
        },
        {
          start: 104,
          end: 121,
          text: "to make they grow",
          category: "grammar",
          feedback:
            "The pronoun 'they' is incorrect as an object here; the object pronoun 'them' is required after 'make'. Corrected: 'to make them grow'. Using 'them' provides correct object pronoun form and preserves clear sentence structure.",
        },
        {
          start: 153,
          end: 164,
          text: "plastic bag",
          category: "grammar",
          feedback:
            "The singular 'plastic bag' is inconsistent with the general claim that fish eat such items; the plural is more appropriate. Corrected: 'plastic bags'. Using the plural matches the general statement and improves grammatical agreement with the idea of multiple items.",
        },
        {
          start: 187,
          end: 207,
          text: "like rocket airplane",
          category: "writing_clarity",
          feedback:
            "This simile is awkward and unclear because 'rocket airplane' is not a natural or precise image in English and confuses the intended comparison. Corrected: 'like a rocket' (or remove the simile). Choosing 'like a rocket' or removing the comparison produces a clearer, more natural image and avoids confusing metaphors.",
        },
        {
          start: 218,
          end: 236,
          text: "Ecosystem in ocean",
          category: "grammar",
          feedback:
            "This phrase lacks the proper article and number agreement; it should include 'the' before 'ocean' and use singular/plural consistently. Corrected: 'The ecosystem in the ocean' or 'Ecosystems in the ocean'. Adding 'the' and matching singular/plural makes the phrase grammatically correct and clearer in meaning.",
        },
        {
          start: 237,
          end: 258,
          text: "become more beautiful",
          category: "grammar",
          feedback:
            "The verb form must agree with the chosen subject number; with a singular subject use 'becomes' and with plural use 'become'. Corrected: 'becomes more beautiful' (if singular 'Ecosystem') or 'become more beautiful' (if plural 'Ecosystems'). Adjusting the verb for subject-verb agreement makes the sentence grammatically correct and consistent.",
        },
        {
          start: 276,
          end: 298,
          text: "oil spill are floating",
          category: "grammar",
          feedback:
            "This phrase mixes singular/plural forms and verb agreement incorrectly; either pluralize the noun or use the singular verb. Corrected: 'oil spills are floating' or 'an oil spill is floating'. Matching noun number and verb form resolves the agreement error and clarifies the subject.",
        },
        {
          start: 307,
          end: 342,
          text: "it look like colorful flower garden",
          category: "grammar",
          feedback:
            "The pronoun and verb do not agree with the referenced plural subjects and the noun phrase lacks an article; use 'they' for plural and add 'a' before the garden phrase. Corrected: 'they look like a colorful flower garden'. This revision fixes pronoun-verb agreement and provides the necessary article for the noun phrase, making the imagery grammatically correct.",
        },
      ],

      rubrics: {
        name: "IELTS Writing Task 1 Band Descriptors",
        componentLabel: "COMPONENT 1",
        componentNote: "Scoring criteria for Academic and General Training tests",
        obtained: 12,
        max: 36,
        criteria: [
          {
            name: "Task Achievement",
            obtained: 2,
            max: 9,
            descriptors: ["The content barely relates to the task."],
            remark:
              'You mention the topic, but your ideas are mostly incorrect and go against the question. Instead of explaining harm, you say things like "sea animals very happy" and "we do not need to clean the ocean," so you need to write about the real negative effects of plastic pollution.',
          },
          {
            name: "Coherence & Cohesion",
            obtained: 4,
            max: 9,
            descriptors: [
              "Information and ideas are evident but not arranged coherently, and there is no clear progression within the response.",
              "Relationships between ideas can be unclear and/or inadequately marked. There is some use of basic cohesive devices, which may be inaccurate or repetitive.",
              "There is inaccurate use or a lack of substitution or referencing.",
            ],
            remark:
              'Your sentences can be followed, but the ideas do not build a clear logical answer. You use links like "Therefore," but the result is still confusing because the points are not organised around the real effects of plastic pollution.',
          },
          {
            name: "Lexical Resouce",
            obtained: 3,
            max: 9,
            descriptors: [
              "The resource is inadequate (which may be due to the response being significantly underlength).",
              "Possible over-dependence on input material or memorised language.",
              "Control of word choice and/or spelling is very limited, and errors predominate. These errors may severely impede meaning.",
            ],
            remark:
              'You do use a few topic words, but much of your vocabulary is inaccurate or unnatural, such as "is make" and "good food for shark and whale." Try using clearer and more precise words like "harm," "entangled," "pollution," and "habitat."',
          },
          {
            name: "Grammatical Range & Accuracy",
            obtained: 3,
            max: 9,
            descriptors: [
              "Sentence forms are attempted, but errors in grammar and punctuation predominate (except in memorised phrases or those taken from the input material). This prevents most meaning from coming through.",
              "Length may be insufficient to provide evidence of control of sentence forms.",
            ],
            remark:
              'Your grammar has many errors, such as "is make the sea animals" and "When fish eat plastic bag," which makes the writing hard to trust. You should focus on correct sentence structure, verb forms, articles, and plural nouns, then build up to clearer sentences like "Plastic pollution harms marine animals because they may eat plastic bags and become sick."',
          },
        ],
      },

      goodPoints: [],
    },
  ],
};
