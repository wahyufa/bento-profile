# ATLAS course UI/UX improvement — tasks

Scope: UI/UX improvement as HTML prototypes for stakeholder preview. No access to production code.
Reference: https://demo.atlaslearn.ai (Digital Marketing Strategy course).

## Done
- [x] Audit production flow (course page, overview, Article / Video / Scenario lessons, review gate)
- [x] Prototype 1: lesson content block layout — `atlas-lesson-blocks-prototype.html`
  - 3 lessons rebuilt with blocks (Article, Video, Scenario), Current vs Enhanced toggle
  - Blocks: lead, cards, checklist, callout, panel, video + transcript, funnel, stepper, persona, task form

- [x] Prototype 2 (same file): lesson review gate + in-lesson outline
  - Outline: left panel on desktop (>=1200px), drawer on smaller screens; 13 lessons, status, overall progress, "on this page" sections under the current lesson
  - Review: always visible at end of lesson, Next button states its requirement, one question at a time with instant feedback, result screen with missed questions, Try again
  - "Current" mode keeps the production gate for side-by-side comparison

- [x] Prototype 3: course page — `atlas-course-page-prototype.html`
  - Merges today's two pages (course page + "Continue Learning" overview) into one; CTA links straight into the lesson player prototype
  - Hero with short summary, facts, state-aware CTA ("Start course" / "Continue course" / "Review course") and progress
  - Learning objectives pulled out of the description paragraph into a checklist; syllabus open by default with status per lesson
  - Side card (sticky): progress ring, level, time, content mix, how the review works; sticky CTA bar after the hero scrolls away
  - Prototype controls: Current vs Enhanced, and Not started / In progress / Completed

- [x] Prototype 3 update: Path view kept and improved, "Adaptive" explained, real hero image
  - List / Path switch inside "Course content"; Path is a curved zig-zag trail, green up to "You are here", optional lessons dashed, finish line at the end, responsive (narrow layout under ~560px)
  - Adaptive = personalised adaptive learning (each learner's path can differ): tag is a button that opens an explanation with "See my path"; path intro, side card and optional markers repeat the idea
  - Hero uses the real production cover (saved in `assets/course-cover.png`, 800px JPEG embedded in the HTML so the file is self-contained)

- [x] Path view redesigned from a reference (gamified mobile course map)
  - Module card with progress ring, coin-style 3D nodes with labels underneath, gentle zig-zag with no connector line, "YOU ARE HERE" bubble, tip cards beside nodes, soft background shapes; narrow screens put tips inline
- [x] Prototype 4 (in `atlas-lesson-blocks-prototype.html`, "13 · Quiz"): course quiz
  - Production: 4 scenario questions on one page, persona as a table, Submit Answers, then only "Score: x/4 (y%)" and Retry; Finish Course always visible
  - Enhanced: intro with rules, one question per screen with a scenario card and persona card, question navigator, review-before-submit, result with per-question explanation, Finish course unlocks on pass, course-complete screen

- [x] Index page — `index.html`: entry point for stakeholders
  - Five-step walkthrough with deep links (`?lesson=1|2|3|13`, `?prog=some|done`, `?syl=path`, `?mode=old|new`), today-vs-proposal table, six decisions with recommendations, real vs sample content, how to share
  - Deep-link parameters added to both prototype files

- [x] All courses page — `atlas-courses-prototype.html`
  - Production: decorative banner, My/Available tabs, search + two selects, "Continue Learning" and "Completed" sections with small cards; a not-started course sits under "Continue Learning"; card says 180m while the course page says 1h 5m; cards show no level or lesson count
  - Enhanced: stats banner, "Up next" / "Continue where you left off" feature card (or "all caught up"), tabs with counts, working search, status chips with counts and level filter, one grid sorted by what needs attention, empty states, real covers
  - Linked: courses -> course page -> lesson player -> back, state carried in `?prog=`; index has a new first step

## Next (not started)
- [ ] Report to content team: Digital Marketing card shows 180m, course page shows 1h 5m (13 lessons x 5 min = 65m)
- [ ] Share the folder with stakeholders (index.html + the two prototype files; cover image is embedded)
- [ ] Report to content team: production quiz scores A, A, A, A as 4/4. Q1 option A ("tennis shoes ... high bounce rate") contradicts the scenario, so the stored answer key looks wrong. Verified on the demo account; option order does not change on Retry.
- [ ] Stakeholder feedback on prototypes 1, 2, 3 and 4
- [ ] Confirm what adaptivity actually changes in production (lesson skipped/optional, extra lessons, different order?) so the path markers match reality
- [ ] Decide pass mark: 80% of 3 questions means all 3 correct (2/3 = 67% fails). Prototype keeps 80% and states it plainly.
- [ ] Quiz lesson type (not yet reviewed)
- [ ] Extend blocks to remaining 10 lessons

## Open questions
- All courses: what should "Available courses" contain (self-enrol catalogue, assigned-but-not-started, both)? Production shows 0 and an empty tab; the prototype only designs the empty state.
- All courses: the Time Management cover is loaded from the public ATLAS storage, not embedded. Embed a local copy if the file must work fully offline.
- Quiz: pass mark (prototype uses 75% = 3 of 4), whether Finish Course should require passing, and whether a retake reuses the same questions. Production shows only a score and Retry.
- Quiz: question stems and explanations in the prototype are written samples; the answer key follows lesson content (C, A, D, A), not production (A, A, A, A).
- Course page: "Optional for you" on lesson 7 in the "In progress" state is an invented sample of personalisation, not production behaviour.
- Course page: "Each lesson ends with a short review" is based on lessons 1-2 in production; confirm it holds for every lesson, including exercises and the quiz.
- Production overview page: the first lesson node in Path view shows a play icon although it is an Article (icon mismatch).
- Where will scenario task answers be stored in production (backend vs session)?
- Is the AI review gate a fixed product decision?
- Prototype is light mode only (production has no dark mode).
- Review questions: lesson 1 copied from production; lessons 2 and 3 are samples written from the lesson text.
- Are lessons meant to be freely navigable from the outline (as in prototype), or sequential/locked?
- Does a failed review generate new questions in production, or repeat them? Prototype repeats them.
