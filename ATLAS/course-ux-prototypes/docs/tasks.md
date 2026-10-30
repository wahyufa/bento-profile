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

## Authoring (admin) prototype: `atlas-authoring-prototype.html`
Done
- [x] Read-only review of production admin (Digital Marketing): Details, Content, Learning Objectives, Knowledge Mapping, quiz editor. Nothing saved, generated, unpublished or archived.
- [x] Prototype with Current (replica of production editor) vs Enhanced toggle
- [x] Block-based lesson editor for all 12 learner blocks, with live learner preview (desktop/phone), reorder (buttons + drag), duplicate, delete
- [x] AI generator flow (source, options, outline review, insert as "AI draft" that must be approved). Rule-based sample: restructures, never rewrites
- [x] "Convert remaining lessons" bulk flow, lessons 1-3 pre-converted
- [x] Pre-publish checks per lesson (blockers vs suggestions, with one-click fixes)
- [x] Quiz editor: explicit "Correct" marking, "Answer not confirmed" state, answer check vs scenario, explanations
- [x] Duration estimated from content; course duration can be calculated from lessons (fixes 180 vs 65)
- [x] Jen settings (chips, terms), discussion starter, check-yourself mode (AI / authored / off)

Findings from production admin
- Quiz: radio group preselects option A for every question; nothing shows whether it was chosen on purpose. Likely cause of the A,A,A,A key.
- One rich-text blob per lesson; "Generate Learning Materials" only on some lessons; Knowledge Mapping is "No mappings" for all 13 lessons.
- Learning Objectives lists hundreds of duplicate custom competencies (many repeated titles).
- Course description holds the learning objectives as plain text.

Next / open
- [ ] Stakeholder feedback on authoring prototype
- [ ] Decide whether generated blocks are stored as structured JSON (needed for the learner blocks) or rendered back to HTML
- [ ] Knowledge Mapping and Learning Objectives tabs are not redesigned
- [ ] Link the authoring prototype from index.html (not done, not requested)
- [ ] Save/Publish are simulated; state is kept in localStorage only

Update (authoring prototype, round 2)
- [x] Removed the permanent preview column; one "Preview as learner" button in the header opens it in a dialog (desktop/phone)
- [x] Learning Objectives redesigned: search, All/Skills Framework/Custom filter, repeated custom names grouped with a count, selected panel, suggestions from lesson text (with the lessons they come from), target job roles
- [x] Knowledge Mapping redesigned: lessons list with coverage, per-lesson attached sources, suggestions (single lesson or all, nothing attached until added), browse and search
- [ ] Knowledge Base sources in the prototype are invented samples; production Knowledge Base picker was not opened
- [ ] Custom competency list is a sample of production; Learning Objectives starts empty (production selection state not verified)

Update (authoring prototype, round 3: production parity)
- [x] Editor uses the full width (right column removed)
- [x] Resources per lesson ("Upload Resource" in production): upload, rename, remove; shown in the learner preview. Files are not stored in the prototype; only .txt is readable
- [x] "Generate learning materials" is one dialog with three kinds: Lesson blocks, Quiz questions, Flashcards. Sources: lesson text, uploaded .txt, whole course, pasted text, video transcript
- [x] Generated quiz questions are never confirmed: suggested answer only, correct position spread over A-D, must be confirmed by the author
- [x] New Flashcards block in the editor and in the learner prototype (lesson 2: flip, "Still learning" / "I know this", review the missed ones)
- [x] Learner prototype lesson 3 has a Resources section (sample files); clean build regenerated
- [ ] Generators are rule-based samples (no language model), so question and card quality is only indicative
- [ ] Production's "Generate Learning Materials" options were described by the user, not opened; confirm the real flashcards/quiz flow
- [ ] Sample files, flashcards and resource names are invented, not from production

Update (authoring prototype, round 4: Details tab)
- [x] Details tab redesigned: About (title, summary with counter, description, learner-facing objectives as a list), Cover image (change, reposition with sliders, AI generate with 3 options), Level/duration/industry, Linked assessments (link/unlink, relevance check against lesson content)
- [x] Right column: live course card and course-page crop, plus "Before publishing" checks (summary length, industry, duration vs lessons, competencies, assessment relevance)
- [x] Removed the "Adaptive" toggle I had added earlier; it is not a field in production
- [ ] Assessment titles are samples; the two linked ones are chosen to show the relevance check (production titles not copied, and production showed two unrelated published assessments)
- [ ] AI cover generation is simulated with colour covers
- [ ] Industry list is a sample; production list not inspected. Summary field is new (production has description only)

Update (authoring prototype, round 5: Module > Lesson)
- [x] Structure is now Module > Lesson, like production: add / delete / reorder modules (delete asks to confirm and removes its lessons), add lesson per module (goes before the module's quiz)
- [x] Lessons can be deleted (confirm), moved up/down inside a module, and moved to another module from the lesson header
- [x] Knowledge Mapping groups lessons by module; Current replica shows one card per module; progress counts only non-quiz lessons
- [ ] Not in the prototype: drag-and-drop of lessons between modules (buttons and the module select do it instead)
- [ ] The learner prototypes still show a single module; multi-module outline/path is not designed

Update (authoring prototype, round 6: course list and empty course)
- [x] Course list page (/admin/courses): title, Import SCORM, Create Course, All/Published/Draft tabs with counts, Trash, search, level filter, ownership chips, cards. Current = production layout; Enhanced adds summary, modules/lessons count and a "Ready / N to look at" chip
- [x] Create Course dialog (title + start empty or generate an outline), creates a draft that opens on the Content tab
- [x] Empty course: guided empty state in Content, empty states in Knowledge Mapping and Details checks, Publish blocked until there is a lesson
- [x] Outline generator (topic or pasted notes): proposes modules and lessons, rename/untick, creates empty lessons; the Quiz lesson is created with zero questions and flagged
- [x] Publishing a draft changes its status to Published in the list; the app starts on the course list; ?screen=new opens an empty course directly
- [ ] Production's Create Course screen and Import SCORM were not opened (could create records); both are designed, not copied
- [ ] Prototype holds one new course at a time; Time Management Essentials is shown in the list but not editable
- [ ] The outline generator is rule-based (a standard 3-module structure or the pasted headings), not a language model

Update (authoring prototype, round 7: status tooltips)
- [x] Tooltips (hover and keyboard focus) on every status chip: lesson status (Empty, Rich text, AI draft, N to fix, N to confirm, Ready), Blocked/Ready on the lesson checks, Draft/Published/Version/Unsaved in the header, "Before publishing", and the course list chips. "Fix 1" is now "1 to fix" and the tooltip lists what to fix
- [x] Fixed: empty lessons were counted as "built from blocks" (and "All lessons are built from blocks" showed). They now show "Empty" and are counted as still empty
- [ ] Tooltips need a hover or focus, so they are not shown on touch screens

## Learner dashboard: `atlas-dashboard-prototype.html` (new file; other files unchanged)
Findings from production (`/dashboard`, account "Vin", read only; the welcome modal was not dismissed)
- Shows the brand-new-learner page ("Your learning journey starts here", "Start your first course") although Time Management Essentials is 100% complete and Digital Marketing Strategy is enrolled
- "Your progress: 0 / 0 knowledge points" although PALS shows Hospitality 101 with 19 knowledge points and "Up next: Market Trend Analysis"
- No "continue" on the dashboard; the next lesson and the PALS next step live on other pages
- Duplicate links: Courses, Psychometric and Performance each twice; "Evaluate My Skills" and "View All" both go to /performance
- Performance says "No PALS courses assigned yet" while PALS has Hospitality 101
- A "Welcome to ATLAS" modal opens after signing in; content is the same as the August dashboard explorations

Done
- [x] Current (production replica incl. welcome modal and the findings) vs Enhanced; states New learner / Learning / All done; `?prog=none|some|done&mode=old|new`
- [x] Learning: greeting with a one-line status, small streak; Continue card (Digital Marketing lesson 5, matches the course page "in progress" sample) with PALS "Market Trend Analysis" as the second option; "For today" (refresher from the lesson loop, daily practice that runs inline, a facilitator reply); Your courses (in progress first); This week (days, minutes, lessons; XP and badges as a small line); From your lessons (note, highlight, bookmark); Learning Hub without duplicates, Performance and Leaderboard as links
- [x] New learner: one first step (start the assigned course), "How learning works here" (lessons + refreshers, adaptive path, CBL), psychometric as an optional dashed card, empty states that say what will appear
- [x] All done: completion banner, PALS as the way to keep going, today and courses still available
- [x] Links: Courses -> courses prototype, Continue / Start -> course page, refresher -> loop lesson, reply -> lesson 2, note -> lesson 3; PALS, CBL, Assessments, Performance show "not part of the prototype"

Next / open
- [ ] Link the dashboard from the other prototypes' "Dashboard" menu and from index.html (left out so existing files stay untouched)
- [ ] Samples, not production: week chart, minutes, streak length, XP/badge numbers, the facilitator reply, the note, the daily-practice questions
- [ ] Decide how much of streak / XP / badges / leaderboard to show (prototype: small streak, the rest secondary)
- [ ] "Continue lesson" goes to the course page because lessons 4-12 are not built
- [ ] PALS, CBL and Assessments pages are not prototyped; the dashboard only links to them

## New-learner welcome: `atlas-welcome-prototype.html` (new file; replaces the "New learner" dashboard state as a concept)
Why: feedback that the new-learner dashboard was not appealing or motivating and looked like generic AI output.
- [x] Warm editorial look from the design-inspiration references (off-white, greige surfaces, black pill buttons, large light headline, organic gradient cards with grain); gradient colours taken from the ATLAS logo
- [x] Headline is a sentence the learner completes ("I run [a small bakery] and I want to [find more customers online]"); real selects styled as words, sized to the chosen word; everything below adapts (promise, demo question, role-play, Jen, plan)
- [x] Try-it stage with three tabs instead of feature cards: Learn (a 30-second funnel guess from lesson 2), Practise (CBL-style reply on a gradient), Your plan (the plan the learner ends up with; trying the other tabs fills lines)
- [x] Jen as a conversation in progress; "Your first week" (five 5-minute days) with a reminder choice; closing call to action; "Skip to dashboard"
- [x] Start lesson 1 -> lesson prototype lesson 1; Skip / Look around -> dashboard prototype (New learner)
- [x] Checked at 1280px and 375px (no overflow for any business/goal combination; headline scales on phones because a select cannot wrap)

Open
- [ ] Type change: Inter Tight / Inter instead of ATLAS's Montserrat, to match the references. Confirm with brand, or switch back
- [ ] Business types, goals, customer/where/rival lines, the role-play and the plan slots are samples; the "plan" idea assumes learners run a business (true for the 10,000 Women course, not for every ATLAS course)
- [ ] Reminder choice is not stored anywhere real; there is no settings page
- [ ] Decide whether this replaces the New learner dashboard or runs once before it (first visit only)

## New-learner onboarding (cinematic) — `atlas-onboarding-prototype.html`
Replaces the direction of `atlas-welcome-prototype.html`, which felt worse: too busy, generic SaaS styling, not ATLAS.
- [x] Four full-screen moments, one action each: Hello → one question (goal) → try it (drag a customer into the funnel, from lesson 2) → the path (13 production lessons as 4 stops) → straight into lesson 1. No dashboard in between.
- [x] ATLAS brand back: Montserrat, navy/teal, real logo; the three logo colours are the motion motif (rising lines, funnel, path).
- [x] Skip to dashboard, Back, Enter/arrow keys, reduced-motion support, `?step=1..4` deep links, Restart in the prototype bar.
- [x] Current mode = the production "Welcome to ATLAS" modal.
- [x] Tested at 1280px and 375px (path becomes a vertical list on phones); no console errors.
- [ ] Decide: show once on first sign-in, then the dashboard (recommended), or keep it re-openable.
- [ ] Goal options, personas (Sari/Budi/Dewi) and lesson pointers are sample copy, to check with the content team.
- [ ] Decide whether to keep or retire `atlas-welcome-prototype.html` (left untouched).

## Learner home (dashboard redesign) — `atlas-home-prototype.html`
Same visual language as the onboarding. `atlas-dashboard-prototype.html` is left untouched; its Current mode is linked from the toggle.
- [x] Navy hero with one next step (big lesson title + Continue) and the course path: 13 lesson dots on the curve, grouped into the onboarding's four stops, "You are here" marker.
- [x] Goal picked in onboarding is read back ("Your campaign plan to … · 31% there"); PALS "also in progress" in one line.
- [x] Below the hero only three blocks: For today (2 items), Your courses (each with a mini path), Explore ATLAS (Learning Hub without duplicates).
- [x] States: Just started / Learning / All done (`?prog=start|some|done`). Onboarding "Skip to dashboard" now opens this page.
- [x] Tested at 1280px and 375px, no overflow or console errors.
- [ ] Removed vs the old dashboard: This week chart, From your lessons, inline daily practice, streak/XP. Confirm none of these is a must-have.
- [ ] Facilitator name (Aisha), reply text and goal copy are samples.

## Dashboard, light touch — `atlas-dashboard-lite-prototype.html`
Requested after the home redesign felt like too much change: keep production's sections, order and styling; fix only the content. Built from `atlas-dashboard-prototype.html` (its Current mode is unchanged).
- [x] Greeting subtitle per state ("You are 4 of 13 lessons into …").
- [x] "Get started" stays for new learners (button now starts the course directly); becomes "Continue learning" (lesson 5 + PALS next, with progress bars) once started.
- [x] "What happens next" keeps its three rows; locked rows say when they unlock, unlocked rows ("Ready for you") get actions: Open review, inline daily practice, See badges.
- [x] Your progress shows real numbers (lessons completed, 0/19 PALS knowledge points, streak); badges + leaderboard in one line.
- [x] Learning Hub: 6 → 5 cards ("Evaluate My Skills" duplicate removed), each with a status line.
- [x] Welcome modal only for new learners, one action ("Start the course").
- [x] Tested at 1280px and 375px, no overflow or console errors.
- [x] Illustrations: 6 images generated with gpt-image-2 on Replicate (quality medium, 3:2, ATLAS palette) into `assets/illustrations/` (courses, pals, assessments, cbl, psychometric, welcome). Used on the Learning Hub cards and the new-learner welcome modal. Token lives in `D:\Claude\bento-profile\.env` (git-ignored).`n- [ ] Illustrations are referenced by relative path, so the `assets/` folder must travel with the HTML when shared.
- [ ] Decide which dashboard direction goes to stakeholders: light touch (this), the earlier enhanced dashboard, or the home redesign.
- [x] Feedback round: "Evaluate My Skills" restored as its own Learning Hub card (6 cards again, own illustration `evaluate.webp`). Removing it was my call, not a confirmed duplicate.
- [x] Feedback round: the empty right side of the greeting band now holds the progress panel (course ring, last-7-days streak strip, lessons / knowledge points / badges, links to Performance and Leaderboard). The separate "Your progress" section below was removed so the numbers are not shown twice.
- [ ] Check with product what "Evaluate My Skills" opens in production vs "Assessments", to write distinct descriptions.

Update (authoring prototype, round 8: Learning Objectives, two panels)
- [x] Learning Objectives redesigned as two panels: Library (search, All/Skills Framework/Custom, tickable rows instead of a chip wall) and "In this course" (each pick expands to choose the lessons that build it, "Suggest lessons", coverage bar, lessons not linked yet)
- [x] Suggestions add the competency and link the lessons it was found in; target job roles kept
- [x] Note at the top explains learner-facing objectives (Details) vs competencies (reporting and role matching), with a link to Details
- [x] Panels redraw in place (search, scroll and focus are kept)
- [ ] The competency-to-lesson link is new; production has no such field (Knowledge Mapping is per lesson, objectives are per course). Confirm it can be stored and reported on
- [ ] "Suggest lessons" is keyword matching on a small sample list, not a model; keyword hits are broad (Digital Marketing matched 11 of 13 lessons)

Update (authoring prototype, round 9: Knowledge Mapping matrix)
- [x] Knowledge Mapping redesigned as a matrix: sources in rows, lessons in columns (grouped by module). Click a cell to attach or remove; suggested cells are dashed with a star; per-lesson totals in the footer (0 shown in red); per-source "Unused" and lesson counts; "Add N suggested" per source; "Add all suggested"; search
- [x] "Why this match" panel for the selected cell: which of the source's topics the lesson uses, with the sentence from the lesson highlighted; or why it probably does not fit
- [x] "What Jen uses in lesson N" and "What this tab does" explain the effect (lesson text plus attached sources)
- [x] Matrix redraws in place (scroll, search and focus are kept). Removed the old per-lesson list and Save mappings button (changes were already kept)
- [ ] Production Knowledge Base list and how sources are attached were not inspected; sources and topic keywords are invented samples
- [ ] Suggestions are keyword matches: 49 of 130 cells get a suggestion on the sample course because lessons 5-12 share vocabulary. A real matcher should rank and cap them
- [ ] "Jen answers from attached sources" is the intended behaviour as described to the prototype, not confirmed against production

Update (authoring prototype, round 10: right column in Content)
- [x] Lesson checks and settings (publish checks, Resources, Check yourself, Jen, Discussion) moved from below the blocks to a sticky right column; blocks get the middle column. Checks come first because they show whether the lesson can be published
- [x] Quiz lessons: checks and Discussion in the right column; unconverted lessons: banner in the middle, checks and settings on the right
- [ ] Under 1360px wide the right column drops below the editor instead of beside it

Update (authoring prototype, round 11: add lesson / module below the editor)
- [x] "+ Add lesson to <module>" and "+ Add module" below the lesson editor (all lesson types), so the course grows without going back to the left panel

Update (authoring prototype, round 12: Summary removed)
- [x] Removed the Summary field I had added; production only has Description. The course card, course list and checks use Description. Removed the "summary length" check, added "Description is set"

Update (authoring prototype, round 13: objectives list removed from Details)
- [x] Removed the separate "What learners will be able to do" list (not in production). The objectives text is back inside Description, as in production. Removed its check; the Learning Objectives tab banner now only says competencies are separate from the Description
- [ ] The learner course page prototype still shows objectives as a checklist from sample data; how production builds it from the Description was not checked
- [x] Removed the "Open this lesson in the learner prototype" link from the learner preview dialog

## Lesson 1: remove "Before you start" and 10,000 Women registration (team feedback, 30 Oct 2026)
- [x] Removed both sections from lesson 1 (Enhanced) in `atlas-lesson-blocks-prototype.html`; rebuilt `clean/lesson.html`. Lesson 1 now: Welcome → What you will learn → Lesson review.
- [x] The Current (production) layout of lesson 1 is unchanged. The Fundamentals dialog and registration scripts stay in the file but do nothing without these sections, so they can be restored from git.
- [x] Authoring prototype: removed the "Before you start" and "Community invitation" block types (definitions, add-block list, lesson 1 sample, learner-preview renderers and styles). Older saved copies in localStorage drop those blocks on load (`dropRemovedBlocks`). Tested: no console errors, lesson 1 preview shows intro + What you will learn.
- [ ] If the "gather your documentation" advice is still wanted, it may fit the course page ("What you need") rather than inside a lesson.

## Authoring: full-screen learner preview + quiz "Correct" marker (30 Oct 2026)
- [x] "Preview as learner" is now full screen and covers the whole course: course outline on the left (modules, lessons, type, minutes, "not converted yet"), the lesson as learners see it, Previous / Next at the bottom, "Lesson n of 13" in the bar. Opens at the lesson being edited; "Edit this lesson" jumps the editor to the lesson on screen; "Back to editor" closes. Desktop / Phone toggle kept (Phone hides the outline). Funnel stage buttons work in any previewed lesson.
- [x] Quiz editor: the "Correct" marker no longer overflows its 32px column; it is a pill next to each option and turns green when chosen.
- [x] Tested in the browser at 1440px: lesson 1 → 2 via Next, jump to the quiz via the outline, Phone mode, Edit this lesson; no console errors.
- [ ] Long option texts are cut off in the single-line option fields (already the case before); consider multi-line fields if authors need to see full options.

## Lessons 4 to 12 in the learner prototype + authoring sync (started 30 Oct 2026)
Real text read from demo.atlaslearn.ai (lessons 4 to 12).
- [x] Batch 1: lessons 4 (Promoting your content), 5 (Using owned media), 6 (Using paid media) built in `atlas-lesson-blocks-prototype.html`, Enhanced + Current. Each has a 3-question lesson review, Jen section explanations and lesson answers. Lesson 4 has a "Your turn" task (owned / paid / earned, saves as you type) with "Share in the discussion" and sample discussion posts.
- [x] New block styles: flow (numbered steps), search-term pill, self-check list, think-then-reveal, number tiles, calculator, journey-plan cards (the last three are for batches 2 and 3).
- [x] Lesson switcher in the prototype bar shows all 13 lessons (scrolls on phones) and goes through the same "not available" check.
- [x] Lesson 1 review question 3 and Jen's lesson 1 answers no longer refer to the removed "gather your documentation" section.
- [x] Batch 2: lessons 7 (earned media: WOM stats, influencer rewards, Ad vs Sponsorship with a quick check, nano vs mega), 8 (viral marketing: four traits, pros and risks, task with "compare with the lesson" reveal), 9 (KPIs for owned and paid media, bounce-rate guide, live calculator for cost / conversion ratio / cost per purchase, KPIs by goal).
- [x] Batch 3: lessons 10 (social listening), 11 (customer journey plan: media, content and KPI per funnel stage, saves as you type, plus the Word resource), 12 (the four considerations, each showing what the learner wrote in lessons 3, 4 and 11, with links back).
- [x] Lesson 6 now has a transcript (the production text) so the video passes the authoring transcript check.
- [x] Every lesson opens from the outline, Next/Previous and the switcher; the "not available in this preview" toast no longer appears. `clean/lesson.html` rebuilt.
- [x] Authoring prototype synced: lessons 4 to 12 seeded as converted lessons with matching blocks, review questions, Jen chips and discussion starters; video lessons get the sample video link; lesson 11 has the Customer Journey Plan resource. Learner-only blocks are approximated: calculator → worked-example callout, journey plan → practice task, lesson 12 recap → numbered cards.
- [x] Tested: lessons 4 to 12 at 1280px and 375px (no horizontal scroll, no console errors), calculator, saving, recap, clean build, authoring preview of all 13 lessons.
- [x] Authoring: lesson 10 (Using social listening) stays as rich text in the seed (`AI_DEMO_IDX`), so "Convert remaining 1 with AI" can still be demonstrated on Digital Marketing. Tested: the bulk conversion drafts it without errors. In the learner prototype lesson 10 is already converted (the intended result).
- [x] AI dialog copy: "Convert 1 lesson with AI" and "1 block drafted" now use the singular for one.
- [ ] People who already used the authoring prototype keep their saved copy; "Reset demo" loads the new seed.
- [ ] Content team: lesson 9 says $0.83 × 2,101 = $1,742 (correct: $1,743.83). Lesson 12 says "the personas you created in lesson 1" (they are created in lesson 3).
- [ ] Samples, not production: review questions, Jen answers, discussion posts, the "quick check" and "compare" reveals, the cost-per-purchase figure in the calculator.
- [x] Authoring: the estimated lesson time is no longer a warning in the quality checklist. The author sets Minutes in the lesson header; next to it an optional hint shows the estimate from the content with "Use n min".
- [x] Authoring: "Nothing for the learner to do" now names all four interactive blocks and offers two buttons: "Add an activity" (block picker limited to practice task, stage explorer, persona cards, flashcards; added at the end of the lesson) and "Reading only is fine" (turns the suggestion into a green "Reading only, as you chose" with Undo, saved per lesson). Tested in the browser.

## In-context authoring — `atlas-authoring-incontext-prototype.html` (30 Oct 2026)
From Zhi: move the admin side to in-context editing instead of form fields + a separate preview. Scope agreed: lesson content only; block cards with toolbars (Rise-like). The current authoring prototype is unchanged.
- [x] The canvas is the learner lesson page. Every text (titles, paragraphs, card items, persona fields, transcript, captions…) is edited in place; paste arrives as plain text; single-line fields end on Enter.
- [x] Each block: hover toolbar (type, style options such as callout style / numbered cards / "you are here" step / replace image, move up/down, duplicate, delete with Undo). Items inside blocks: × to remove, "+ Add card / point / step / answer box / stage / persona" in place.
- [x] "+" line between blocks opens the block menu inline (12 types, including a new Image block: drop or choose a file, caption editable).
- [x] Video: paste the link on the player itself; transcript editable underneath.
- [x] Edit / Preview switch in the top bar; Preview hides every control, makes funnel and flashcards interactive, Desktop / Phone width.
- [x] Lesson settings panel (opens on demand): quality checks with "Add an activity" / "Reading only is fine", minutes with the optional estimate, review count, Jen and discussion toggles.
- [x] Rich-text lesson 10: "Convert with AI" banner on the page; AI draft blocks get an inline "AI draft · Approve" bar and "Approve all".
- [x] Same seed as the current authoring prototype (generated from it). Autosaves in the browser; "Reset demo" in the prototype bar.
- [x] Tested in the browser: editing and saving, insert, duplicate, move, delete + undo, add/remove items, numbered cards, video link, Preview (no editable fields, funnel), Phone width, settings + add activity, AI convert + approve all, quiz lesson message; no console errors.
- [ ] Out of scope for now: quiz editing, course details / cover / outline structure (add, reorder, delete lessons), resources, review-question editing. They link to the current authoring prototype.
- [x] Linked: index.html walkthrough has a 7th step "Course authoring (admin)" (in-context editor + form-based authoring); the current authoring prototype's yellow bar has "Try in-context editing →".
- [x] Switching views keeps the lesson: "✎ Edit on page" in the form-based lesson header (Digital Marketing only) opens the in-context editor at the same lesson (`?lesson=N`); "Form view" in the in-context top bar goes back to the same lesson in the form view. Tested both ways. The two prototypes still save their edits separately.

## Authoring v2: in-context as the default — `atlas-authoring-v2-prototype.html` (30 Oct 2026)
Zhi: in-context editing should be the default way of authoring. Built in a separate file from v1 (v1 and the form-based prototype are unchanged).
- [x] Starts on a course list: Digital Marketing (from production) and "+ Create a course" (title only, then straight into the course).
- [x] Empty course, on the page: "✦ Generate an outline with AI" (what the course is about, optional pasted material whose headings become lessons, 2–4 modules) or "Start with an empty module".
- [x] Editable outline: course and module titles edited in place; per module "+ Add lesson"; "+ Add module"; move lessons within a module and modules up/down; delete lesson or module with Undo; AI-outlined lessons marked "AI outline · empty".
- [x] Empty lesson, on the page: "✦ Draft it with AI" (from the title, or from pasted text kept word for word) or "+ Write it yourself" (opens the block menu in place). Drafted blocks arrive as AI drafts to approve.
- [x] Everything from v1 (editing in place, block toolbars, insert line, Preview, settings, convert rich text) works for every course. "Form view" shows only for Digital Marketing; `?lesson=N` opens a Digital Marketing lesson directly.
- [x] index.html: the authoring step now opens v2, with links to v1 and the form-based view.
- [x] Tested: create course, generate outline from pasted headings, draft lesson with AI, add lesson + first block, rename module, move, delete + undo, add module, autosave, Digital Marketing editing + Preview, deep link; no console errors.
- [ ] Generators are rule-based samples (structure from the title or pasted text), not a language model. "Draft with AI" without pasted text gives an empty structure to fill in.
- [ ] Still in the form view only: quiz, review questions, resources, Jen terms, course details and cover.
- [ ] "Edit on page" in the form-based prototype still opens v1. Decide whether it should open v2.

## Authoring v3: the existing authoring, lessons edited on the page — `atlas-authoring-v3-prototype.html` (30 Oct 2026)
Feedback on v2: "sangat mengubah dari existing". v3 starts from the form-based authoring prototype and changes only the lesson editor in the middle of the Content tab.
- [x] Unchanged: admin sidebar, course list and Create Course, course header and tabs (Details, Content, Learning Objectives, Knowledge Mapping), Course content panel (modules, lessons, add/move/delete, AI outline, bulk convert), right panel (quality, resources, review, Jen, discussion), quiz editor, full-screen Preview as learner, all AI flows.
- [x] Changed: the block forms are replaced by the lesson page in learner layout. Lesson title and every block text are edited in place; hover a block for its toolbar (style options, ↑ ↓, duplicate, delete); remove items with ✕ and add them with "+ Add card / point / step / answer box / stage / starting point / persona"; video link and transcript edited on the player; "+ Add block" between blocks opens the existing picker. AI drafts show their approve bar on the block, "Approve all" at the top.
- [x] Type and minutes stay in the lesson header card; the title moves onto the page (quiz lessons keep the title field).
- [x] Uses the same saved data as the form-based prototype (same storage), so both always show the same course.
- [x] index.html authoring step now opens v3, with links to the form-based view and v2.
- [x] Tested: edit title and block text (outline and save update), callout style, add/remove card, move, duplicate, delete, insert + focus, rich-text lesson → Generate learning materials → drafts on the page, quiz lesson, new empty lesson; no console errors.
- [ ] The middle column stays as narrow as before (about 470px at 1440px wide), so the page is close to tablet width. Consider letting the right panel collapse.
- [x] "On page / Form" switch in the lesson header card (lessons built from blocks only). On page is the default; the choice is remembered in the browser; both views edit the same data. Tested, including the choice surviving a reload.
- [x] v3: the right panel collapses with "Hide ›" to a slim rail that keeps the must-fix and suggestion counts visible; the choice is remembered in the browser. At 1600px the lesson area grows from 627px to 939px. At 1360px and below the panel already sits under the editor, so it collapses to a bar there.
- [x] v3: a new course opens on Details first, with a "Step 1" bar and a button at the top and bottom of the page: "Continue to Content", or "Continue to the outline" if AI outline was chosen. Nothing in Details is required to continue. The AI outline dialog opens on the way to Content, with the description prefilled as material. Existing courses still open on Content. Tested both start options and an existing course.
- [x] v3: tidier module header in the Course content panel: "MODULE 1" on one line with the lesson count under it, smaller move/delete buttons on the right.
- [x] v3: self-playing AI demo (`?demo=ai`, or "▶ Watch the AI demo" in the yellow bar). 13 steps on the real interface: create course → Details → AI outline → review → generate a lesson from sample notes → review → AI drafts on the page → edit in place → approve → Preview. Plays by itself, with Pause, Next and Restart. Saves nothing, so other data is untouched. Tested start to end; the sample notes and the rule-based "AI" are not real model output.
- [x] AI demo fixes after a report of it stopping at step 4: countdown on the Next button ("Next in 5s"), "Working…" while a step runs, countdown restarts when a background tab returns, highlighted targets stay clear of the player. Autoplay tested start to end (13 steps, about 75 seconds). The reported stop itself could not be reproduced over the local server; `file://` not tested.
