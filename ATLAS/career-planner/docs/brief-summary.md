# Career Planner: brief summary

Sources (not copied into this repo):
- *ATLAS Career Planner — Feature Design Brief*, Zhi Chuen, 7 Oct 2026 (product design brief)
- *ATLAS Career Planner — Tech Team Scoping Brief*, Zhi Chuen, 16 Nov 2026

## The feature in one line
A staff member's job role decides what they learn. The organisation defines its own departments, roles and skills; each role carries learning paths that ATLAS assigns and sequences automatically; completions update the person's skill profile against their role.

## The loop
Skill framework → Role profiles (department, level, required skills with target bands) → Learning paths (Foundation, Role, Growth) → Staff auto-enrolled, next stage unlocks on completion → Completions update skill bands → Gap vs current and next role → back to role targets.

## Why (blockers at Tunas Muda, 29 Sep)
| Blocker | Cause in ATLAS today |
|---|---|
| Job Roles unusable | Sectors and categories are fixed SkillsFuture (SFw) dropdowns; "Education" cannot be added |
| Role, content and skills don't link | Content is assigned in Groups, which has no link to Job Roles |
| No sequenced journey | Drip feed works inside one PALS course only |
| Skills don't fit | Auto-tagging only, no manual tagging; SFw skills too granular |
| Unclear categorisation | Domain is an admin-only folder; no flexible course field |

## Users
- **HR / L&D admin**: builds framework, roles and paths; assigns people; nominates growth-path staff; sees all reports.
- **Department head / line manager**: team progress and skill gaps; can recommend staff for a growth path.
- **Staff (learner)**: their role, current path, next stage, skill profile, next role.
- **HeyHi superadmin**: seeds templates (SFw import), supports setup.

Pilot: Tunas Muda non-academic staff (about 20 on ATLAS), departments Admissions, Administration, HR. Must extend to teachers later without redesign.

## Capabilities (design brief)
1. Custom framework: org's own sector, categories, skills; add, rename, merge, archive. SFw is an import template (deep copy).
2. Departments: first-class field on staff profiles.
3. Role profiles: role sits in a department, lists skills with target bands; level optional.
4. Learning paths: ordered stages across Courses, PALS, CBL, Assessments; learner sees only the active stage.
5. Stage types: Required (complete everything) or Choose-from (pick from a category pool).
6. Path types: Foundation (everyone), Role (auto from role), Growth (nominated).
7. Role-based assignment: role enrols people in its paths; Groups stay for extras; one assignment view shows both.
8. Skill tagging: AI tags on upload plus manual tagging and override.
9. Renewal cycles: compliance items expire (3–5 years) and return to the path; HR sees who is due.
10. Career pathways (HeyHi proposal): roles linked into progression routes.
11. Gap analysis (HeyHi proposal): skills vs current and next role, with suggested content.
Plus: PALS custom tags (reusing Knowledge Spaces tags), a tag filter, and an admin option for a **combined learning page** vs per-feature view.

## Reporting
Skill bands: Novice, Developing, Competent, Proficient, Advanced (from Skills Analytics).
- Individual career profile (learner, manager, HR): home vs auxiliary skills, bands vs target, path progress, skill → content behind it.
- Learning record (learner, HR): every completion over the tenure, online and offline, renewal due dates.
- Department heatmap (manager, HR), path progress (HR), role readiness (HR), CSV/Excel export.
- All filterable by department, role, date range.

## Phases — the two briefs differ
| | Design brief (7 Oct) | Scoping brief (16 Nov) |
|---|---|---|
| Phase 1 | Framework, departments and roles, paths and sequencing, auto-assignment by role, tags and manual tagging, path progress report | Org-owned framework, path engine, **learning record with compliance expiry and re-enrolment**, skills and reporting (**career profile**, path progress, CSV), AI tagging against the org's list |
| Phase 2 | Pathways, gap analysis, heatmap, role readiness, manager team view, **compliance renewal cycles** | Pathways, gap analysis with recommendations, department heatmap |
| Phase 3 | Offline-Online Tracker | Offline-Online Tracker |

The design follows the scoping brief (newer). Raise the difference with Zhi Chuen.

## Design timeline (scoping brief)
Weeks 1–3: wireframes and clickable flows for framework setup, role and path builder, learner career profile, reporting. Reviewed with Tunas Muda before build starts (from week 4).
