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

- [x] Project moved to `D:\Claude\bento-profile\ATLAS\course-ux-prototypes` (the old `D:\Claude\ATLAS` copy is untouched). `ATLAS\` there already held `dashboard/`, `explorationv2/` and an older `index.html`, so the prototypes live in this subfolder instead of overwriting anything.
- [x] Real ATLAS logo from production (`assets/atlas-logo.png`, 480px copy embedded) replaces the placeholder mark on the courses page, course page and index (index header is now white to suit the logo)

- [x] Lesson prototype: wider lesson card + hideable outline (feedback: outline sometimes distracts)
  - Lesson column 760px -> 880px with the outline open, 980px when it is hidden (focus mode); paragraphs keep a 62ch line length so only visuals use the extra width
  - "Hide outline" / "Show outline" in the top bar and an X in the panel; choice remembered (`atlas-proto-outline-hidden`); under 1200px it stays a drawer
  - `OUTLINE_HIDDEN_BY_DEFAULT` in the script flips the first-visit default

- [x] Lesson loop prototype — `atlas-lesson-loop-prototype.html` (new file; the existing prototypes are unchanged)
  - Why: learner feedback that learning feels boring/passive, like an exam, with no momentum, and cold. Hypothesis: change the rhythm from read -> gated test to understand -> try -> feel progress
  - Lesson 2 (video) as the reference: Jen welcome -> watch -> "quick guess" before the answer -> funnel where the learner picks the stage first -> "Check yourself" (no pass mark, refresher cards for missed topics, "added to your path") -> completion moment (animated check, recap, progress, mini path with the refresher node, Up next)
  - Prototype bar: jump to any step (menu), reset, link to the current version of the lesson
  - Feedback: "too little content". Deepened from 6 to 10 steps: the four planning questions each get their own step (objectives per stage with a matching activity, audience with the two real personas and a sorting activity, promote + measure with a stage explorer), a "Your turn" mini plan for the learner's own business, and a 5-question check. Stated lesson time is now about 10 minutes (production says 5).
  - Content split: video, definition, four questions, funnel stages and personas are from production. Guesses, objectives per stage, channel and measure examples, activities, check questions and Jen's lines are sample text for the content team to review.

- [x] Clean version — `clean/` (open `clean/index.html`): only the new UI/UX, no notes about what changed
  - Pages: `index.html` (all courses) -> `course.html` -> `lesson.html` (lessons 1-3 and the quiz); lesson design is the blocks version, the loop prototype is not part of it
  - Top bar keeps only the Current / Enhanced switch; the choice follows the learner between pages; progress state comes from the flow (or `?prog=none|some|done`), lessons deep-link with `?lesson=1|2|3|13`
  - Removed: progress / lesson switches, reset, "current layout" labels, the red notes on the Current pages, toasts that talk about the prototype, "in the prototype" wording
  - Lesson progress is kept per browser session, so each new session starts fresh
  - Generated from the working files: re-run `powershell -ExecutionPolicy Bypass -File tools\build-clean.ps1` after editing any `atlas-*.html` so the two versions never drift apart

- [x] Outline open/close is now animated: the lesson column widens while the outline column shrinks (grid-template-columns transition, 450ms), the panel fades and slides out and fades back in after the column opens; reduced-motion users get no animation
- [x] Lesson 1 "Before you start" redesigned: the checkbox card and the green reassurance are one card, the amber callout became a link card ("Optional first step"), one accent colour, same border/radius, 14px between elements (the amber box used to be a separate section 44px away). Both versions rebuilt.

- [x] Learn with Jen — lesson prototype (`atlas-lesson-blocks-prototype.html`, also in `clean/lesson.html`)
  - Opens from the "Learn with Jen" pill under the lesson, the gradient Jen icon on the side rail, or a floating button on narrow screens; docked panel on the right (the lesson makes room at 1280px+, overlay below that, bottom sheet under 860px); Esc closes
  - Knows the lesson: context line, suggestion chips per lesson (summary, explain simply, example, focus, "help me start my persona" on the exercise), free-text questions, definitions of the course terms, typing indicator, new chat
  - "Ask Jen" bubble appears when text in the lesson is selected and explains the selection using its section
  - Quiz: Jen steps aside while questions are open ("Quiz answers should be your own"), returns after submit
  - All replies are scripted from the lesson text (no live AI); Current mode keeps the original non-functional button
  - I could not open the real Jen in production (the browser pane was signed out and I will not enter credentials), so behaviour is designed from the button and the product's "Jen" name only

- [x] "Optional first step" prototype (lesson 1, `atlas-lesson-blocks-prototype.html` and `clean/lesson.html`): clicking the card no longer leaves the page
  - Opens a dialog (bottom sheet on phones) that helps the learner decide: three yes / not yet statements -> a recommendation ("We suggest starting with Fundamentals" listing what they marked, or "You look ready") -> two clear choices; "Skip" is always available
  - Choosing Fundamentals saves the place: the card becomes "In your plan", the outline shows the step above lesson 1 (dashed marker), reopening shows "Fundamentals is in your plan" with Open / Take it out of my plan
  - Choice is remembered (`atlas-proto-fund`); "Open Fundamentals" is a placeholder because that course does not exist in the demo account
  - Only the course name and the card sentence are from production; the three statements and the result wording are samples

- [x] Community registration prototype (lesson 1 "Register with 10,000 Women", `atlas-lesson-blocks-prototype.html` and `clean/lesson.html`)
  - "Register now" opens a dialog (bottom sheet on phones): 1) what you get + the eligibility statement ("I identify as a woman") confirmed before any form, with "Not now" as a way out; 2) short form (name, email, optional business name, explicit unticked consent to newsletters and webinar invitations) with inline errors and focus on the first problem; 3) confirmation
  - After registering the panel swaps the call to action for "You are registered, {first name}" with Open the forums / See webinars; remembered (`atlas-proto-community`, first name only)
  - Production only says "Register now by completing this simple form", so the fields, consent wording and the confirmation email are samples; forums and webinars are placeholders

- [x] Notes, highlights, bookmark and share (lesson prototype and `clean/lesson.html`)
  - Side panel is now tabbed: **Jen** and **Notes**. Rail icons work: share copies the lesson link, bookmark toggles (outline shows "Bookmarked"), notes opens the Notes tab (count badge). Under 860px the rail becomes a row above the lesson so these stay reachable
  - Selecting text shows **Ask Jen / Highlight / Add note** (Alt+J / Alt+H / Alt+N from the keyboard). Highlights are saved per lesson with their section and character range plus the quoted text, re-applied on every visit; overlapping highlights merge; a note is a small editor next to the text (Ctrl+Enter saves, Esc cancels, click elsewhere keeps what was typed). A highlight whose text has changed is shown as "This passage has changed" rather than guessed
  - Notes tab: list in reading order with section, jump (with pulse), edit, delete
- [x] Pick up where you left off: the section and how far into it the learner read are saved while scrolling; coming back shows "Pick up where you left off · {section}" with Continue / dismiss. Not shown near the top, after the lesson is done, or in the quiz
- [x] Failed, slow and offline states
  - Review: slow (after 3.5s: explains and offers Cancel), failed ("We could not prepare your questions", Try again, Do the review later) and offline ("You are offline", Try again disabled until the connection returns). "Do the review later" does not mark the lesson done but unlocks Next; outline shows "Review pending"; the review card says so
  - Jen: a failed reply becomes an inline error with Try again (does not repeat the question); offline has its own wording
  - Offline banner (real `online`/`offline` events); highlights and notes keep working offline because they are local
  - Demo conditions through the URL: `?sim=fail-once`, `fail`, `slow`, `offline`, `jen` (comma-separated); nothing visible in the UI
- Fixed on the way: entrance animations replaced the `translateX(-50%)` that centres the selection bar and the offline banner, so they jumped and could sit off screen on phones

- [x] Discussion (the rail's "comments" icon in production is a discussion feature, confirmed): restored as its own icon with a count, and a third panel tab **Discussion** next to Jen and Notes (`atlas-lesson-blocks-prototype.html` and `clean/lesson.html`)
  - Per lesson: comments and questions (a "Question" tag), replies one level deep with draft kept if the list redraws, "Helpful" (toggle, count), sort Newest / Most helpful, delete your own, facilitator badge
  - Offline: a comment is kept as "Waiting for a connection" and posts by itself when the connection returns; a failed post has Try again (`?sim=comment` makes the first one fail)
  - Quiz: discussion pauses while questions are open, opens after submit
  - The people and comments shown for lessons 1-3 are invented sample content written from the lesson text (names, facilitator replies); posts are stored in the browser only

## Next (not started)
- [ ] Discussion: how it relates to the 10,000 Women community forums (same place, or separate?), who moderates, whether facilitators are notified of questions, and whether replies can go deeper than one level. Production behaviour of the original "comments" feature was not seen
- [ ] Notes: notes are per lesson, so a "my notes across the course" view is missing
- [ ] Notes and resume are stored in the browser only; production needs them on the account (and shared across devices)
- [ ] Quiz submit when offline is not designed (answers should be kept and sent when the connection returns)
- [ ] Community registration: replace the sample form with the real fields, and confirm the eligibility wording with the 10,000 Women team (self-declaration only, or verified another way?); decide whether the registration should be remembered on the account and visible on the all-courses page
- [ ] Optional first step: carry the "In your plan" state to the course page (Path detour node) and the all-courses page (Fundamentals under My courses); decide whether the answers should feed the adaptive path
- [ ] Optional first step: check the real Fundamentals of Sales and Marketing course (not in the demo account's catalog) for duration, level and outcomes, then replace the generic dialog copy
- [ ] Lesson text width: paragraphs (`p.lead`, prose) are capped at 62ch while cards use the full 880px/980px column; confirm that is the look wanted (or widen the cap)
- [ ] Check what the real "Learn with Jen" does in production (open it while signed in) and align the prototype: what it can answer, whether it is lesson-aware, how it is opened
- [ ] Jen during the quiz is a design choice (hidden until submit); confirm with stakeholders
- [ ] Clean version: show the loop lesson (lesson 2) as Enhanced there too, if wanted
- [ ] Clean version: progress after finishing lessons is coarse ("4 of 13" after the first lesson), because the course pages use a fixed in-progress sample; derive it from real completions if the clean version is shown to people
- [ ] Try the lesson loop with 3-5 real learners (this is a hypothesis, not evidence), then decide whether to apply it to all lessons and the Path
- [ ] Decide: may a learner continue after an imperfect Check yourself? (the prototype says yes; production blocks until the review is passed). Needs stakeholder agreement.
- [ ] Add a link to the loop prototype from `index.html` (left out on purpose so the current set stays untouched)
- [ ] Decide the outline default for first-time learners (open for orientation vs hidden for focus)
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
