# Career Planner: flows and screens (for review)

Status: draft for review, 20 Nov 2026. Clickable prototype is built after this is agreed.
Base: the existing ATLAS admin and learner UI, extended rather than replaced. What the admin has today is in `existing-admin.md`.

## Where it sits in the admin navigation
Today: Dashboard · Users · Courses · Content Sharing · Job Roles · CBL · PALS Course · Groups · Assessments · Question Bank · Knowledge Base · Analytics · Settings.
Proposed: a **Career Planner** section replacing the single "Job Roles" item:
- **Skills framework** (new, A1)
- **Departments & roles** (Job Roles extended, A2)
- **Learning paths** (new, A3)
- **Staff assignments** (A4; also a Department column in Users)
Groups stay where they are. Skill tagging (A5) sits on the content lists (Courses, PALS) where "Run AI mapping" already lives. Reports (R1) go under Analytics as "Career & skills".

## Sample data (Tunas Muda, illustrative until they send their real lists)
- **Departments**: Admissions, Administration, HR.
- **Categories → skills** (short on purpose, about 8 skills):
  - Compliance → Child safeguarding, Data protection, Workplace safety
  - Communication → Written communication, Difficult conversations
  - Customer Experience → Parent and student enquiries
  - Leadership → Leading a team
  - Well-being → Personal well-being
- **Roles** (one per department to start; level optional): Admissions Officer, Administration Executive, HR Executive. Phase 2 concept adds Senior Admissions Officer and Admissions Manager.
- **Paths**:
  - Foundation: "New staff compliance" (everyone): Stage 1 Required (safeguarding, data protection, workplace safety; renew every 3 years).
  - Role: "Admissions Officer" path: Stage 1 Required (Customer Experience basics: Customer Service Essentials course, a CBL enquiry role-play), Stage 2 Choose-from (pick 3 of 12 Communication modules), Stage 3 Required (assessment).
  - Growth: "Emerging leaders" (nominated): Stage 1 Choose-from Leadership pool, Stage 2 Required (CBL: leading a team meeting).
- **Staff**: about 20 people across the three departments, at different points (new joiner, mid-path, compliance due soon, one nominated for Growth).

## Admin flows (HR / L&D)

### A1 Skill framework
Entry: Admin → Career Planner → Skills framework (extends Jobs).
1. Empty state offers two starts: "Start from scratch" or "Import from SkillsFuture".
2. Import: pick SFw sector(s) → preview categories and skills → import as a **copy** (each skill keeps a "from SFw" marker).
3. Work in a two-level list: categories with their skills. Add, rename, archive. **Merge**: select several skills → choose the name to keep → shows what moves (roles, content tags) → done, with an alias note.
4. Each skill shows where it is used: roles, number of tagged content items.

### A2 Departments and roles
1. Departments list (name, head, number of staff, roles).
2. Role profile: department, optional level, description, **required skills with target band** (Novice → Advanced), paths attached (Role path; Foundation shown as inherited).
3. Empty role → prompt "Add the skills this role needs" → pick from framework.

### A3 Path builder (critical path)
1. Paths list grouped by type: Foundation, Role, Growth. Each shows who it applies to (everyone / role / nominated), stages, enrolled count.
2. Builder: ordered stages. Each stage: name, type **Required** or **Choose-from**, items.
   - Add item: one picker across Courses, PALS, CBL, Assessments (type filter, search, skill filter).
   - Choose-from: pool (fixed list, or "all content tagged with category X") + rule "complete N" (open question: N items vs cover skills).
   - Optional per item: renewal period (compliance).
3. Unlock rule shown in plain words: "Stage 2 opens when Stage 1 is complete". Paths: "Role path opens after Foundation".
4. **Preview as learner**: what a learner on this path sees.

### A4 Assign staff
1. Staff list with department, role, paths, progress; filters.
2. Assign one person (set department + role) or bulk upload CSV (template, preview, errors) → summary of enrolments that will happen.
3. Nominate for Growth (single or bulk).
4. Person's **assignments** view: everything they are enrolled in, with source (Role, Foundation, Growth, Group). Groups unchanged.

### A5 Skill tagging
1. Content list with skill tags; tag source (AI with confidence, Manual).
2. Edit tags on an item; manual override is marked and kept on re-tagging.
3. PALS custom tags and tag filter (reusing Knowledge Spaces tags).

## Learner flows (staff)

### L1 My Career
Entry: learner dashboard → "My Career" (new card in Learning Hub, or nav item).
1. Header: role, department.
2. Current path and **active stage only**; later stages shown locked with what unlocks them.
3. Required stage: list of items with status. Choose-from stage: "Pick 3 of 12" pool, picked items move into "My picks".
4. Completing the last item → stage complete → next stage opens (moment of feedback).
5. Foundation done → Role path opens (new joiner example).

### L2 Skill profile and learning record
1. Home skills (from role) with band vs target; auxiliary skills (from other content). Click a skill → content behind it.
2. Learning record: every completion, date, type, online/offline label, renewal due date; "Due soon" highlighted.
3. Phase 2 concept: next role on the pathway and its skills.

## Reporting (HR)

### R1 Path progress and compliance
1. Per path and stage: enrolled, in progress, completed, overdue. Filter by department, role, date range.
2. Compliance due: who expires in the next 30/60/90 days; expired items already re-enrolled.
3. Export CSV.
4. Department head view: same report limited to their department (RBAC; open question).

## Phase 2 concepts (1–2 screens, not fully interactive)
- Career pathway: roles linked into a route, with readiness per person.
- Department heatmap: skills × people coloured by band, gaps vs target.

## Screen list
| ID | Screen | Phase | State(s) to design |
|---|---|---|---|
| A1 | Skill framework | 1 | empty, SFw import, list, merge |
| A2 | Departments and role profile | 1 | list, role detail, empty role |
| A3 | Path list and path builder | 1 | list, builder, add item, Choose-from setup, preview |
| A4 | Staff and assignment | 1 | list, assign one, bulk upload, nominate, person's assignments |
| A5 | Skill tagging | 1 | content list, edit tags |
| L1 | My Career | 1 | new joiner (Foundation), mid Role path, Choose-from pick, stage complete |
| L2 | Skill profile and learning record | 1 | profile, skill detail, record with due soon |
| R1 | Path progress and compliance | 1 | overview, due list, export, department head scope |
| C1 | Career pathway concept | 2 | static |
| C2 | Department heatmap concept | 2 | static |
