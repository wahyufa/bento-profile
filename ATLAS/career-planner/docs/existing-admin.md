# What the ATLAS admin has today (demo.atlaslearn.ai, checked 20 Nov 2026)

Read-only look with an Org Admin account. Nothing was saved or changed.

## Navigation
Dashboard · Users · Courses · Content Sharing · **Job Roles** · CBL · PALS Course · **Groups** · Assessments · Question Bank · Knowledge Base · Analytics (Learning Analytics, Data Overview, People Insights) · Settings.

There is no Departments screen and no Skills (framework) screen. Skills only live inside Job Roles.

## Job Roles (`/admin/job-roles`)
- List of role cards: title, "Sector: …", "Category: …", skill count, user count; edit (pencil) and delete.
- Expanding a role lists its skills (name + sector), then "Unmapped knowledge points · N KPs · Run AI mapping", then "Add Skill Requirements".
- **Edit** opens a dialog with only Title and Description.
- **Create job role** (`/new`) is a two-panel page:
  - Left: "SkillsFuture Framework": Sector → Category → Job role dropdowns (fixed SFw lists, 41 sectors; no "Education"), then "Skills — from framework" checkboxes.
  - Right: "Role details": title and description prefilled from the framework, "Required skills" list, and **"Add a custom skill"** (a free-text skill not covered by SkillsFuture).
- No target level per skill, no department, no level.
- So custom skills exist per role, but the sector and category cannot be the org's own, and skills are not shared across roles as one framework.

## Users (`/admin/users`)
- Seats used, Bulk import, Invite User.
- "Users by Job Role" summary (counts per role, plus Unassigned).
- Table: User, Email, Username, **Job Title**, **Job Role**, Role (learner / org admin), Status, Actions.
- No department field.

## Groups (`/admin/groups`)
- Table: Name, Description, Join Code, Members, Courses, PALS, Assessments, CBL, Auto-enroll.
- Group detail: Auto-enroll badge, Edit, **Sync Enrollments**, Delete; tabs Members, Courses, PALS Course, Assessment, CBL.
- This is the only place content gets assigned. There is no order or sequence across items.

## CBL (`/admin/competency-learning`)
- Scenarios (Manage Scenarios, Rubrics, Practice & Role-Play). "Scenarios are personalised based on your assigned job role": each scenario shows "Role: …". So CBL already links to Job Roles by tag.

## PALS Course (`/admin/pals-course`)
- List of PALS courses: status, knowledge point count, created date, Assign. Some show a job role tag (e.g. "Guest Services Executive").

## Analytics
- Learning Analytics, Data Overview, People Insights (team dynamics from psychometrics). No skills-by-role or department report.

## What this means for the design
- Extend **Job Roles** rather than add a parallel screen: same card list, plus department, level, target band per skill, and attached paths.
- Add **Skills framework** as a new admin page next to Job Roles (the org's own categories and skills; SFw becomes an import into it). The existing "Add a custom skill" is the seed of this.
- Add **Departments** (Users get a Department column next to Job Role).
- Add **Learning Paths** as a new admin page; Groups stay as they are. The person's assignment view shows both.
- Keep the "Run AI mapping" pattern for tagging, and add manual tags.
