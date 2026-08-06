const v3SkillState = {
  sourceFilter: "all",
  sort: "low",
  compareExpanded: true,
  expandedRow: null,
  compareSort: { key: "gap", dir: "desc" }
};

const v3SkillEvidenceState = {
  sectorId: null,
  skillName: null,
  showBreakdown: false
};

const v3CblSummary = {
  learnersAttempted: 31,
  totalAttempts: 42,
  averageHighestScore: 72
};

const v3CblState = {
  caseId: null,
  groupId: null
};

const v3CblCases = [
  {
    id: "handling-angry-parent",
    score: 60,
    name: "Handling An Angry Parent",
    role: "Training & Adult Education Specialist",
    learners: 11,
    detailLearners: 3,
    attempts: 9,
    live: 0,
    turnBased: 9,
    skills: ["Learning Facilitation"],
    groups: [
      { id: "heyhi-demo", name: "HeyHi Demo", learners: 8, attempts: 7, score: 33 },
      { id: "demo-june", name: "Demo June", learners: 1, attempts: 0, score: 0 },
      {
        id: "not-in-group",
        name: "Not in any group",
        learners: 2,
        attempts: 2,
        score: 74,
        live: 0,
        turnBased: 2,
        people: [
          { name: "Unknown learner", attempts: 1, version: "V1", score: 75 },
          { name: "Gam Mai", attempts: 1, version: "V1", score: 72 }
        ]
      }
    ]
  },
  { id: "motivating-disengaged-student", score: 82, name: "Motivating a Disengaged Student", role: "Online Tutor", learners: 3, skills: ["Learning Facilitation", "Learning Needs Analysis"] },
  { id: "upset-parent-performance", score: 81, name: "Handling an upset parent due to child's poor performance", role: "Training & Adult Education Specialist", learners: 3, skills: ["Learning Needs Analysis"] },
  { id: "banking-review-mandarin", score: 83, name: "Banking Client review session - Understanding Client's mismatched business model (Mandarin)", role: "Financial Services Specialist", learners: 26, skills: ["Forensic Accounting", "Risk and Compliance"] },
  { id: "rapid-pass-through", score: 78, name: "Rapid Pass-through", role: "Financial Services Specialist", learners: 25, skills: ["Strategy Planning"] },
  { id: "explaining-learning-gaps", score: 75, name: "Explaining Learning Gaps to Parents", role: "Education Consultant", learners: 4, skills: ["Learning Needs Analysis"] },
  { id: "technical-support-escalation", score: 82, name: "Resolving a Technical Support Escalation", role: "Technical Support Lead", learners: 5, skills: ["Cybersecurity Awareness", "Cloud Operations"] },
  { id: "onboarding-corporate-client", score: 0, name: "Onboarding a New Corporate Client", role: "Business Development Manager", learners: 1, skills: ["Client Advisory", "Financial Planning and Analysis"] },
  { id: "pitching-adaptive-learning", score: 67, name: "Pitching Adaptive Learning to Educators", role: "Product Specialist", learners: 2, skills: ["Data Analytics"] },
  { id: "rapid-pass-through-cantonese", score: 72, name: "Rapid Pass-Through (Cantonese)", role: "Financial Services Specialist", learners: 25, skills: ["Strategy Planning"] },
  { id: "banking-review-cantonese", score: 56, name: "Banking Client review session - Understanding Client's mismatched business model (Cantonese)", role: "Financial Services Specialist", learners: 25, skills: ["Forensic Accounting", "Risk and Compliance"] },
  { id: "banking-review", score: 0, name: "Banking Client review session - Understanding Client's mismatched business model", role: "Financial Services Specialist", learners: 23, skills: ["Risk and Compliance", "Client Advisory"] },
  { id: "rapid-pass-through-mandarin", score: 61, name: "Rapid Pass-Through (Mandarin)", role: "Financial Services Specialist", learners: 26, skills: ["Strategy Planning", "Tax Compliance"] },
  { id: "handling-angry-parent-v2", score: 71, name: "Handling an Angry parent v2", role: "Learning Manager", learners: 4, skills: ["Learning Facilitation"] },
  { id: "banking-review-test", score: 81, name: "Banking Client review session - Test 12/6", role: "Financial Services Specialist", learners: 4, skills: ["Client Advisory", "Audit and Assurance"] }
];

const PALS_MASTERY_CAP = 70;
const CBL_MASTERY_CAP = 60;
const CBL_CASE_SKILL_WEIGHT = 30;

function v3CasesForSkill(skillName) {
  return v3CblCases.filter((item) => (item.skills || []).includes(skillName));
}

function v3SkillCblEvidence(skillName) {
  const cases = v3CasesForSkill(skillName);
  if (!cases.length) return { score: null, scenarios: 0, points: 0 };
  const score = Math.round(cases.reduce((sum, item) => sum + item.score, 0) / cases.length);
  const points = Math.min(
    CBL_MASTERY_CAP,
    Math.round(cases.reduce((sum, item) => sum + (item.score / 100) * (CBL_CASE_SKILL_WEIGHT / item.skills.length), 0))
  );
  return { score, scenarios: cases.length, points };
}

function v3SkillPalsPoints(skill) {
  const score = palsSkillScore(skill);
  return score == null ? 0 : Math.min(PALS_MASTERY_CAP, Math.round(score * PALS_MASTERY_CAP / 100));
}

function v3RecomputeSkillMastery() {
  skillSectors.forEach((sector) => {
    sector.skills.forEach((skill) => {
      const cbl = v3SkillCblEvidence(skill.name);
      const palsScore = palsSkillScore(skill);
      const palsPoints = v3SkillPalsPoints(skill);
      const hasEvidence = palsScore != null || cbl.scenarios > 0;
      skill.cbl = cbl.scenarios > 0 ? { score: cbl.score, scenarios: cbl.scenarios, points: cbl.points } : null;
      skill.palsPoints = palsPoints;
      skill.mastery = hasEvidence ? Math.min(100, palsPoints + cbl.points) : null;
    });
  });
}

v3RecomputeSkillMastery();

// Deterministic per-learner evidence: no per-learner PALS/CBL history exists yet,
// so this seeds plausible correct/total and CBL scores from the learner id and
// skill name. Same inputs always produce the same output (stable across renders).
function v3LearnerSkillSeed(learnerId, skillName) {
  const combined = `${learnerId}::${skillName}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function v3LearnerSkillEvidence(learnerId, skillName) {
  const seed = v3LearnerSkillSeed(learnerId, skillName);
  const hasPals = seed % 5 !== 0;
  const hasCbl = Math.floor(seed / 3) % 3 === 0;
  const total = hasPals ? 10 : 0;
  const correct = hasPals ? Math.max(1, Math.min(10, Math.round(((seed * 13) % 90) / 10))) : 0;
  const cblScore = hasCbl ? Math.max(35, Math.min(97, 35 + ((seed * 17) % 60))) : null;
  const scenarios = hasCbl ? 1 + (seed % 3) : 0;
  return { correct, total, cbl: hasCbl ? { score: cblScore, scenarios } : null };
}

// Pools each member's seeded evidence for a skill: PALS correct/total add up
// (more members answering = more combined evidence), CBL score is the average
// across contributing members weighted by their scenario count.
function v3GroupSkillEvidence(memberIds, skillName) {
  let correct = 0;
  let total = 0;
  let cblScoreWeighted = 0;
  let cblScenarios = 0;
  memberIds.forEach((learnerId) => {
    const evidence = v3LearnerSkillEvidence(learnerId, skillName);
    correct += evidence.correct;
    total += evidence.total;
    if (evidence.cbl) {
      cblScoreWeighted += evidence.cbl.score * evidence.cbl.scenarios;
      cblScenarios += evidence.cbl.scenarios;
    }
  });
  return {
    correct,
    total,
    cbl: cblScenarios ? { score: Math.round(cblScoreWeighted / cblScenarios), scenarios: cblScenarios } : null
  };
}

function v3SkillFromEvidence(skill, evidence) {
  const palsScore = evidence.total ? Math.round((evidence.correct / evidence.total) * 100) : null;
  const palsPoints = palsScore == null ? 0 : Math.min(PALS_MASTERY_CAP, Math.round(palsScore * PALS_MASTERY_CAP / 100));
  const cblPoints = evidence.cbl ? Math.min(CBL_MASTERY_CAP, Math.round((evidence.cbl.score / 100) * CBL_MASTERY_CAP)) : 0;
  const hasEvidence = palsScore != null || evidence.cbl != null;
  return {
    ...skill,
    correct: evidence.correct,
    total: evidence.total,
    cbl: evidence.cbl ? { ...evidence.cbl, points: cblPoints } : null,
    palsPoints,
    mastery: hasEvidence ? Math.min(100, palsPoints + cblPoints) : null
  };
}

function v3SkillForLearner(skill, learnerId) {
  return v3SkillFromEvidence(skill, v3LearnerSkillEvidence(learnerId, skill.name));
}

function v3SkillForGroup(skill, memberIds) {
  return v3SkillFromEvidence(skill, v3GroupSkillEvidence(memberIds, skill.name));
}

function v3SectorsForLearner(learnerId) {
  return skillSectors.map((sector) => ({
    ...sector,
    skills: sector.skills.map((skill) => v3SkillForLearner(skill, learnerId))
  }));
}

function v3SectorsForGroup(memberIds) {
  return skillSectors.map((sector) => ({
    ...sector,
    skills: sector.skills.map((skill) => v3SkillForGroup(skill, memberIds))
  }));
}

function v3Average(values) {
  const available = values.filter((value) => value != null);
  return available.length
    ? Math.round(available.reduce((sum, value) => sum + value, 0) / available.length)
    : null;
}

function v3SkillSourceType(skill) {
  const hasPals = palsSkillScore(skill) != null;
  const hasCbl = skill.cbl?.score != null;
  if (hasPals && hasCbl) return "both";
  if (hasPals) return "pals-only";
  if (hasCbl) return "cbl-only";
  return "none";
}

function v3SectorStats(sector) {
  const tracked = sector.skills.filter((skill) => skill.mastery != null);
  const pals = sector.skills.filter((skill) => palsSkillScore(skill) != null);
  const cbl = sector.skills.filter((skill) => skill.cbl?.score != null);
  const both = sector.skills.filter((skill) => v3SkillSourceType(skill) === "both");
  const needsAttention = sector.skills.filter((skill) => skill.mastery == null || skill.mastery < 70);

  return {
    mastery: v3Average(tracked.map((skill) => skill.mastery)),
    tracked: tracked.length,
    pals: pals.length,
    cbl: cbl.length,
    both: both.length,
    needsAttention: needsAttention.length,
    questions: sector.skills.reduce((sum, skill) => sum + skill.total, 0),
    scenarios: sector.skills.reduce((sum, skill) => sum + (skill.cbl?.scenarios || 0), 0)
  };
}

function v3AllSkillStats(sectors) {
  const skills = sectors.flatMap((sector) => sector.skills);
  const tracked = skills.filter((skill) => skill.mastery != null);
  const both = skills.filter((skill) => v3SkillSourceType(skill) === "both");
  const needsAttention = skills.filter((skill) => skill.mastery == null || skill.mastery < 70);

  return {
    mastery: v3Average(tracked.map((skill) => skill.mastery)),
    tracked: tracked.length,
    total: skills.length,
    coverage: skills.length ? Math.round(tracked.length / skills.length * 100) : 0,
    both: both.length,
    needsAttention: needsAttention.length
  };
}

function v3SourceFilterLabel(value) {
  return {
    all: "All evidence",
    both: "Both sources",
    "pals-only": "PALS only",
    "cbl-only": "CBL only",
    none: "No evidence"
  }[value] || "All evidence";
}

function v3SortSkills(skills) {
  return [...skills].sort((first, second) => {
    if (v3SkillState.sort === "high") return (second.mastery ?? -1) - (first.mastery ?? -1);
    if (v3SkillState.sort === "name") return first.name.localeCompare(second.name);
    return (first.mastery ?? -1) - (second.mastery ?? -1);
  });
}

function v3FilteredSkills(sector) {
  const filtered = v3SkillState.sourceFilter === "all"
    ? sector.skills
    : sector.skills.filter((skill) => v3SkillSourceType(skill) === v3SkillState.sourceFilter);
  return v3SortSkills(filtered);
}

function v3SkillGuidance(skill, sourceType) {
  if (skill.mastery == null) return "Waiting for tagged learning evidence";
  if (skill.mastery < 70) return "Review this skill next";
  if (sourceType === "both") return "Knowledge and application evidence available";
  return "Add the complementary source to strengthen confidence";
}

const V3_BAND_LEARNERS = ["bima-23", "gam-mai", "learner-chuen", "learner-vin"];
const V3_BAND_DEFS = [
  { key: "novice", label: "Novice" },
  { key: "developing", label: "Developing" },
  { key: "competent", label: "Competent" },
  { key: "proficient", label: "Proficient" }
];
const V3_LOW_BAND_COVERAGE = 2;

function v3SkillTier(mastery) {
  if (mastery == null) return "";
  if (mastery < 50) return "is-attention";
  if (mastery < 65) return "is-watch";
  if (mastery >= 75) return "is-track";
  return "";
}

const V3_TIER_BADGE = {
  "is-attention": '<span class="skills-v3-tier-badge is-attention"><i></i>Needs attention</span>',
  "is-watch": '<span class="skills-v3-tier-badge is-watch"><i></i>Watch</span>',
  "is-track": '<span class="skills-v3-tier-badge is-track"><i></i>On track</span>'
};

// Bands are derived from the same seeded sample learners used by the
// Individual/Group scopes, independent of this skill's org-wide evidence.
// Only meaningful once the skill has real org-wide evidence (see v3SkillRow).
function v3SkillBands(sectorId, skillName) {
  const rawSkill = v3RawSkill(sectorId, skillName);
  const dist = [0, 0, 0, 0];
  let cover = 0;
  if (!rawSkill) return { dist, cover };
  V3_BAND_LEARNERS.forEach((learnerId) => {
    const memberSkill = v3SkillForLearner(rawSkill, learnerId);
    if (memberSkill.mastery == null) return;
    cover++;
    if (memberSkill.mastery < 50) dist[0]++;
    else if (memberSkill.mastery < 70) dist[1]++;
    else if (memberSkill.mastery < 85) dist[2]++;
    else dist[3]++;
  });
  return { dist, cover };
}

function v3SkillRow(skill, sector) {
  const sourceType = v3SkillSourceType(skill);
  const guidance = v3SkillGuidance(skill, sourceType);
  const evidenceCount = skill.total + (skill.cbl?.scenarios || 0);
  const tier = v3SkillTier(skill.mastery);
  const hasEvidence = skill.mastery != null;
  const { dist, cover } = hasEvidence ? v3SkillBands(sector.id, skill.name) : { dist: [0, 0, 0, 0], cover: 0 };
  const bandTotal = dist.reduce((sum, count) => sum + count, 0) || 1;
  const bandBar = dist.map((count, i) => `<span class="skills-v3-band-seg is-${V3_BAND_DEFS[i].key}" style="width:${(count / bandTotal * 100).toFixed(1)}%"></span>`).join("");
  const bandDetail = dist.map((count, i) => `<div class="skills-v3-band-detail-item"><span class="skills-v3-band-dot is-${V3_BAND_DEFS[i].key}"></span><strong>${count}</strong><span>${V3_BAND_DEFS[i].label}</span></div>`).join("");
  const lowCoverage = hasEvidence && cover < V3_LOW_BAND_COVERAGE;
  const palsPoints = skill.palsPoints || 0;
  const cblPoints = skill.cbl?.points || 0;
  const openGap = Math.max(0, 100 - palsPoints - cblPoints);
  const isOpen = v3SkillState.expandedRow === skill.name;

  return `
    <article class="skills-v3-row ${tier}" data-v3-skill-name="${skill.name}">
      <div class="skills-v3-row-top">
        <div class="skills-v3-row-name">
          <div class="skills-v3-row-name-top">
            <strong>${skill.name}</strong>${tier ? V3_TIER_BADGE[tier] : ""}
          </div>
          <small>${v3SectorName(sector)}</small>
        </div>
        <span class="skills-v3-row-coverage ${lowCoverage ? "is-low" : ""}">${hasEvidence ? `${cover} of ${V3_BAND_LEARNERS.length} learners${lowCoverage ? '<span class="skills-v3-row-coverage-flag" title="Few sample learners have data for this skill — read with caution">&#9888;&#65038;</span>' : ""}` : "No evidence yet"}</span>
        <span class="skills-v3-row-value">${skill.mastery == null ? "—" : `${skill.mastery}%`}</span>
        <button class="expand-button" type="button" data-v3-skill-toggle="${skill.name}" aria-expanded="${isOpen}" aria-label="${isOpen ? "Collapse" : "Expand"} ${skill.name} details"><span data-icon="chevron"></span></button>
      </div>
      <div class="skills-v3-band-bar">${hasEvidence ? bandBar : '<span class="skills-v3-band-bar-empty"></span>'}</div>
      ${isOpen ? `
      <div class="skills-v3-row-detail">
        <div class="skills-v3-detail-label">Score composition</div>
        <div class="skills-v3-composition">
          <div class="skills-v3-composition-track">
            <span class="is-pals" style="width:${palsPoints}%">${palsPoints > 10 ? "PALS " + palsPoints : ""}</span>
            <span class="is-cbl" style="width:${cblPoints}%">${cblPoints > 10 ? "CBL " + cblPoints : ""}</span>
            <span class="is-open-gap" style="width:${openGap}%"></span>
          </div>
        </div>
        <p class="skills-v3-composition-note"><strong>${skill.mastery == null ? "—" : `${skill.mastery}%`}</strong> combined = <strong class="is-pals-text">${palsPoints} pts PALS</strong> (questions answered correctly) + <strong class="is-cbl-text">${cblPoints} pts CBL</strong> (scored scenarios). ${guidance}.</p>
        ${hasEvidence ? `
        <div class="skills-v3-detail-label" style="margin-top:14px">Learners per band (sample of ${V3_BAND_LEARNERS.length})</div>
        <div class="skills-v3-band-detail">${bandDetail}</div>` : `
        <p class="skills-v3-band-empty-note">No organization-wide evidence yet, so no learner band breakdown is shown for this skill.</p>`}
        <div class="skills-v3-row-evidence-note">
          <span>${evidenceCount} evidence ${evidenceCount === 1 ? "item" : "items"} tracked for this skill.</span>
          <button class="evidence-button" type="button" data-skill-evidence="${sector.id}" data-skill-name="${skill.name}" ${skill.mastery == null ? "disabled" : ""}>View evidence</button>
        </div>
      </div>` : ""}
    </article>`;
}

function v3SectorName(sector) {
  return sector.label.replace(/\s*\(\d+\)$/, "");
}

function v3LearnerName(learner) {
  return learner.label.split(" · ")[0];
}

function v3ScopeSubtitle(scope) {
  if (scope.group) {
    const names = scope.group.memberIds
      .map((id) => v3LearnerName(skillsLearners.find((item) => item.id === id)))
      .join(", ");
    return `Combines evidence from ${v3CountLabel(scope.group.memberIds.length, "student")} in ${scope.group.name}: ${names}.`;
  }
  return "Bird’s-eye view across every sector before drilling into individual skills.";
}

// Continuous red -> amber -> green gradient (same anchor colors as the v2
// skill heatmap) so cell color alone is scannable without reading numbers.
function v3HeatColor(v) {
  let r, g, b;
  if (v < 50) { const t = v / 50; r = 231 + (245 - 231) * t; g = 54 + (184 - 54) * t; b = 54 + (61 - 54) * t; }
  else { const t = (v - 50) / 50; r = 245 + (12 - 245) * t; g = 184 + (173 - 184) * t; b = 61 + (96 - 61) * t; }
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function v3HeatTextColor(v) { return (v >= 40 && v < 68) ? "#5a4008" : "#ffffff"; }

function v3SkillGroupComparisonTable() {
  const groups = v3SkillGroups().filter((group) => group.memberIds.length);
  if (groups.length < 2) return "";

  const expanded = v3SkillState.compareExpanded;
  const sort = v3SkillState.compareSort || { key: "gap", dir: "desc" };
  const sortGroupIndex = groups.findIndex((group) => group.id === sort.key);

  const table = !expanded ? "" : (() => {
    const rows = skillSectors.flatMap((sector) => sector.skills.map((skill) => {
      const scores = groups.map((group) => v3SkillForGroup(skill, group.memberIds).mastery);
      const available = scores.filter((score) => score != null);
      const gap = available.length >= 2 ? Math.max(...available) - Math.min(...available) : -1;
      return { sector, skill, scores, gap };
    }));

    const sorted = [...rows].sort((a, b) => {
      if (sortGroupIndex === -1) return sort.dir === "asc" ? a.gap - b.gap : b.gap - a.gap;
      const scoreA = a.scores[sortGroupIndex];
      const scoreB = b.scores[sortGroupIndex];
      if (scoreA == null && scoreB == null) return 0;
      if (scoreA == null) return 1;
      if (scoreB == null) return -1;
      return sort.dir === "asc" ? scoreA - scoreB : scoreB - scoreA;
    });

    return `
      <div class="table-scroll">
        <table class="data-table skills-v3-heat-table">
          <thead><tr>
            <th>Skill</th>
            ${groups.map((group) => {
              const active = sort.key === group.id;
              const iconName = active ? (sort.dir === "asc" ? "chevron" : "chevron-down") : "chevrons-updown";
              return `<th><button type="button" class="skills-v3-heat-sort-btn ${active ? "is-active" : ""}" data-v3-compare-sort="${group.id}" aria-label="Sort by ${group.name}, ${active && sort.dir === "desc" ? "currently highest first" : active ? "currently lowest first" : "not sorted"}">${group.name}<span class="skills-v3-heat-sort-icon" data-icon="${iconName}" aria-hidden="true"></span></button></th>`;
            }).join("")}
          </tr></thead>
          <tbody>
            ${sorted.map((row) => `
              <tr>
                <td>
                  <strong>${row.skill.name}</strong><br><small>${v3SectorName(row.sector)}</small>
                </td>
                ${row.scores.map((score, i) => `
                  <td class="skills-v3-heat-td">${score == null
                    ? `<span class="skills-v3-heat-empty">—</span>`
                    : `<button type="button" class="skills-v3-heat-cell" style="background:${v3HeatColor(score)};color:${v3HeatTextColor(score)}" data-v3-heat-cell data-v3-heat-sector="${row.sector.id}" data-v3-heat-skill="${row.skill.name}" data-v3-heat-group="${groups[i].id}" title="${row.skill.name} · ${groups[i].name}: ${score}%">${score}%</button>`}</td>`).join("")}
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  })();

  return `
    <section class="panel skills-v3-compare" aria-label="Skill proficiency by group">
      <button class="skills-v3-compare-head" type="button" data-v3-compare-toggle aria-expanded="${expanded}">
        <div>
          <div class="table-title"><span data-icon="sparkle"></span><h3>Where the gaps sit</h3></div>
          <p class="skills-v3-compare-note">Cell color shows proficiency at a glance — red is weakest, green is strongest. Click a group name to sort that column high→low, click again to reverse. Default view leads with the widest gap between groups.</p>
        </div>
        <span class="skills-v3-compare-chevron" aria-hidden="true"><span data-icon="chevron"></span></span>
      </button>
      ${table}
    </section>`;
}

function v3SectorStrip(sectors, selectedSectorId) {
  return sectors.map((sector) => {
    const stats = v3SectorStats(sector);
    const active = sector.id === selectedSectorId;
    return `
      <button class="skills-v3-sector ${active ? "is-active" : ""}" type="button" data-v3-sector="${sector.id}" aria-pressed="${active}">
        <span>${v3SectorName(sector)}</span>
        <strong>${stats.mastery == null ? "—" : `${stats.mastery}%`}</strong>
      </button>`;
  }).join("");
}

function v3SkillGroups() {
  return taxonomyGroups.map((group) => ({
    id: group.id,
    name: group.name,
    memberIds: skillsLearners.filter((item) => item.groupId === group.id && item.hasData).map((item) => item.id)
  }));
}

function v3SkillsScope() {
  const mode = state.skillsMode;
  return `
    <header class="skills-v3-scope">
      <div class="skills-v3-scope-copy">
        <h2>Skills analytics</h2>
        <p>Start with capability outcomes, then inspect the learning evidence behind each result.</p>
      </div>
      <div class="skills-v3-scope-controls">
        <div class="segmented-control" role="group" aria-label="Skills analytics scope">
          <button class="segmented-button ${mode === "organization" ? "is-active" : ""}" type="button" data-skills-mode="organization" aria-pressed="${mode === "organization"}">Organization</button>
          <button class="segmented-button ${mode === "group" ? "is-active" : ""}" type="button" data-skills-mode="group" aria-pressed="${mode === "group"}">Group</button>
          <button class="segmented-button ${mode === "individual" ? "is-active" : ""}" type="button" data-skills-mode="individual" aria-pressed="${mode === "individual"}">Individual</button>
        </div>
        ${mode === "group" ? `
          <div class="field">
            <label for="skills-group">Group</label>
            <select id="skills-group" data-skills-group>
              <option value="" ${!state.skillsGroup ? "selected" : ""}>Select a group</option>
              ${v3SkillGroups().map((group) => `<option value="${group.id}" ${state.skillsGroup === group.id ? "selected" : ""}>${group.name} (${v3CountLabel(group.memberIds.length, "student")})</option>`).join("")}
            </select>
          </div>` : ""}
        ${mode === "individual" ? `
          <div class="field">
            <label for="skills-learner">Learner</label>
            <select id="skills-learner" data-skills-learner>
              <option value="" ${!state.skillsLearner ? "selected" : ""}>Select a learner</option>
              ${skillsLearners.map((item) => `<option value="${item.id}" ${state.skillsLearner === item.id ? "selected" : ""}>${v3LearnerName(item)}</option>`).join("")}
            </select>
          </div>` : ""}
      </div>
    </header>`;
}

function v3SectorPicker(sectors, selectedSectorId, promptText) {
  return `
    <div class="skills-v3-sectors">
      <div class="skills-v3-section-label"><strong>Across sectors</strong><span>${promptText}</span></div>
      <div class="skills-v3-sector-strip">${v3SectorStrip(sectors, selectedSectorId)}</div>
    </div>`;
}

function v3SkillsDetailSection(sector, sectors) {
  const sectorStats = v3SectorStats(sector);
  const visibleSkills = v3FilteredSkills(sector);
  const attentionCount = sector.skills.filter((skill) => skill.mastery != null && skill.mastery < 50).length;

  return `
    <section class="skills-v3-detail" aria-labelledby="skills-v3-detail-title">
      ${v3SectorPicker(sectors, sector.id, "Switch sectors to inspect different skill evidence.")}
      <header class="skills-v3-detail-head">
        <div class="skills-v3-detail-heading">
          <p class="skill-category-label">Selected sector</p>
          <h2 id="skills-v3-detail-title">${v3SectorName(sector)}</h2>
          <p>${sectorStats.tracked} of ${sector.skills.length} skills tracked &middot; ${sectorStats.questions} PALS questions &middot; ${sectorStats.scenarios} CBL scenarios</p>
        </div>
        <div class="skills-v3-controls">
          <button class="skills-v3-method-trigger" type="button" data-v3-method-info aria-haspopup="dialog"><span data-icon="help"></span>How proficiency works</button>
          <div class="field">
            <label for="v3-source-filter">Evidence</label>
            <select id="v3-source-filter" data-v3-source-filter>
              ${["all", "both", "pals-only", "cbl-only", "none"].map((value) => `<option value="${value}" ${v3SkillState.sourceFilter === value ? "selected" : ""}>${v3SourceFilterLabel(value)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="v3-skill-sort">Sort by</label>
            <select id="v3-skill-sort" data-v3-skill-sort>
              <option value="low" ${v3SkillState.sort === "low" ? "selected" : ""}>Needs attention first</option>
              <option value="high" ${v3SkillState.sort === "high" ? "selected" : ""}>Proficiency: high first</option>
              <option value="name" ${v3SkillState.sort === "name" ? "selected" : ""}>Skill name</option>
            </select>
          </div>
        </div>
      </header>

      <div class="skills-v3-detail-body">
        <aside class="skills-v3-profile" aria-label="Selected sector profile">
          <p class="skill-category-label">Sector profile</p>
          <h3 class="skills-v3-profile-title">${v3SectorName(sector)}</h3>
          <p class="skills-v3-profile-note">Average proficiency by skill within this sector, combining PALS and CBL evidence.</p>
          ${radarChart(sector.skills.map((skill) => ({ name: skill.name, value: skill.mastery || 0 })), "skills-v3-radar", `${v3SectorName(sector)} skill proficiency`)}
          <div class="skills-v3-profile-summary">
            <article><span>Sector proficiency</span><strong>${sectorStats.mastery == null ? "—" : `${sectorStats.mastery}%`}</strong></article>
            <article><span>Both sources</span><strong>${sectorStats.both}/${sector.skills.length}</strong></article>
          </div>
        </aside>
        <div>
          <h3 class="skills-v3-list-title">Skills across the organisation</h3>
          <p class="skills-v3-list-count">${sector.skills.length} skill${sector.skills.length === 1 ? "" : "s"} &middot; ${v3SectorName(sector)}${attentionCount ? ` &middot; <b class="skills-v3-attn-count">${attentionCount} need${attentionCount === 1 ? "s" : ""} attention</b>` : ""}</p>
          <p class="skills-v3-list-note">Skills needing attention are pulled to the top and flagged red; strong skills are dimmed. Each bar shows how sample learners spread across the four competency bands — expand a skill for its PALS / CBL make-up.</p>
          <div class="skills-v3-list">
            ${visibleSkills.length
              ? visibleSkills.map((skill) => v3SkillRow(skill, sector)).join("")
              : `<div class="skills-v3-empty-filter"><strong>No matching skills</strong>Try another evidence filter for this sector.</div>`}
          </div>
          <div class="skills-v3-band-legend">
            ${V3_BAND_DEFS.map((band) => `<span><span class="skills-v3-band-dot is-${band.key}"></span>${band.label}</span>`).join("")}
          </div>
        </div>
      </div>
    </section>`;
}

function v3ResolveSkillsScope() {
  if (state.skillsMode === "group") {
    const group = state.skillsGroup ? v3SkillGroups().find((item) => item.id === state.skillsGroup) : null;
    if (!group) {
      return { sectors: null, emptyTitle: "Select a group to begin", emptyBody: "Choose a group above to inspect its combined skill evidence." };
    }
    if (!group.memberIds.length) {
      return { sectors: null, emptyTitle: "No skill evidence yet", emptyBody: "No learners with tracked skill evidence are assigned to this group." };
    }
    return { sectors: v3SectorsForGroup(group.memberIds), group };
  }

  if (state.skillsMode === "individual") {
    const learner = state.skillsLearner ? skillsLearners.find((item) => item.id === state.skillsLearner) : null;
    if (!learner) {
      return { sectors: null, emptyTitle: "Select a learner to begin", emptyBody: "Choose a learner above to inspect their skill-level PALS and CBL evidence." };
    }
    if (!learner.hasData) {
      return { sectors: null, emptyTitle: "No skill evidence yet", emptyBody: "This learner has no PALS answers or scored CBL scenarios mapped to a canonical skill." };
    }
    return { sectors: v3SectorsForLearner(learner.id) };
  }

  return { sectors: skillSectors };
}

function renderSkillsV3() {
  const scope = v3ResolveSkillsScope();
  const comparisonEnabled = state.skillsMode === "group" || state.skillsMode === "organization";

  if (!scope.sectors) {
    return `
      <div class="skills-v3">
        ${v3SkillsScope()}
        <section class="skills-v3-overview">
          <div class="empty-state">
            <div><h3>${scope.emptyTitle}</h3><p>${scope.emptyBody}</p></div>
          </div>
        </section>
      </div>`;
  }

  const sectors = scope.sectors;
  const overall = v3AllSkillStats(sectors);
  const sector = state.skillsSector ? sectors.find((item) => item.id === state.skillsSector) : null;
  const detailSection = sector ? v3SkillsDetailSection(sector, sectors) : `
      <section class="skills-v3-detail skills-v3-detail-empty" aria-label="No sector selected">
        <div class="empty-state">
          <div>
            <h3>Select a sector to begin</h3>
            <p>Choose a sector below to inspect its skill-level PALS and CBL evidence.</p>
            <div class="skills-v3-sector-strip">${v3SectorStrip(sectors, null)}</div>
          </div>
        </div>
      </section>`;

  return `
    <div class="skills-v3">
      ${v3SkillsScope()}

      <section class="skills-v3-overview" aria-labelledby="skills-v3-overview-title">
        <div class="skills-v3-overview-head">
          <div class="skills-v3-overview-heading">
            <h2 id="skills-v3-overview-title">Skills overview</h2>
            <p>${v3ScopeSubtitle(scope)}</p>
          </div>
        </div>

        <div class="skills-v3-summary">
          <article class="is-primary">
            <span class="skills-v3-summary-icon" data-icon="sparkle"></span>
            <span class="skills-v3-summary-label">Combined proficiency</span>
            <strong>${overall.mastery}%</strong>
            <small>Average across ${overall.tracked} tracked skills</small>
          </article>
          <article>
            <span class="skills-v3-summary-icon" data-icon="check-circle"></span>
            <span class="skills-v3-summary-label">Evidence coverage</span>
            <strong>${overall.coverage}%</strong>
            <small>${overall.tracked} of ${overall.total} skills have evidence</small>
          </article>
          <article>
            <span class="skills-v3-summary-icon" data-icon="book-open"></span>
            <span class="skills-v3-summary-label">Dual-source confidence</span>
            <strong>${overall.both}</strong>
            <small>Skills supported by both PALS and CBL</small>
          </article>
          <article>
            <span class="skills-v3-summary-icon" data-icon="trend"></span>
            <span class="skills-v3-summary-label">Needs attention</span>
            <strong>${overall.needsAttention}</strong>
            <small>Below 70% or still missing evidence</small>
          </article>
        </div>
      </section>

      ${detailSection}
      ${comparisonEnabled && sector ? v3SkillGroupComparisonTable() : ""}
    </div>`;
}

function v3CblGroups(item) {
  if (item.groups) return item.groups;
  const primaryLearners = Math.max(1, Math.round(item.learners * 0.75));
  const remainingLearners = Math.max(0, item.learners - primaryLearners);
  const totalAttempts = item.attempts ?? Math.max(1, Math.round(item.learners * 0.6));
  const primaryAttempts = Math.max(1, Math.round(totalAttempts * 0.8));

  return [
    { id: "heyhi-demo", name: "HeyHi Demo", learners: primaryLearners, attempts: primaryAttempts, score: item.score },
    remainingLearners
      ? { id: "not-in-group", name: "Not in any group", learners: remainingLearners, attempts: Math.max(0, totalAttempts - primaryAttempts), score: Math.max(0, item.score - 5) }
      : null
  ].filter(Boolean);
}

function v3CblLearners(group) {
  if (group.people) return group.people;
  const names = ["Bima 23", "Siti Rahma", "Daniel Wong", "Nadia Putri", "Alex Tan", "Maya Chen"];
  const scoreOffsets = [4, 1, -2, -5, 2, -1];
  return Array.from({ length: group.learners }, (_, index) => ({
    name: names[index] || `Learner ${index + 1}`,
    attempts: group.attempts ? Math.max(1, Math.round(group.attempts / group.learners)) : 0,
    version: "V1",
    score: Math.max(0, Math.min(100, group.score + scoreOffsets[index % scoreOffsets.length]))
  }));
}

function v3CountLabel(count, singular) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function v3CblCaseCard(item) {
  return `
    <article class="cbl-v3-case">
      <div class="cbl-v3-score-ring" style="--cbl-score-angle:${item.score * 3.6}deg" role="img" aria-label="${item.score}% average highest score"><strong>${item.score}%</strong></div>
      <div class="cbl-v3-case-copy"><h3>${item.name}</h3><p>Role: ${item.role}</p></div>
      <div class="cbl-v3-case-meta"><span>Average highest score</span><strong>${v3CountLabel(item.learners, "learner")}</strong></div>
      <button class="view-report-button" type="button" data-v3-cbl-case="${item.id}" aria-label="View details for ${item.name}">View Details</button>
    </article>`;
}

function renderCblV3() {
  return `
    <div class="stack cbl-v3">
      <section class="panel">
        <div class="panel-body">
          <div class="panel-heading"><div><h2>CBL Analytics</h2><p>Review case-based learning practice and roleplay performance across your organization. Scores are averages from all attempts.</p></div></div>
          <section class="cbl-summary" aria-label="CBL summary">
            <article><span>Available cases</span><strong>${v3CblCases.length}</strong></article>
            <article><span>Learners attempted</span><strong>${v3CblSummary.learnersAttempted}</strong></article>
            <article><span>Total attempts</span><strong>${v3CblSummary.totalAttempts}</strong></article>
            <article><span>Average highest score</span><strong>${v3CblSummary.averageHighestScore}%</strong></article>
          </section>
        </div>
      </section>
      <section class="panel">
        <div class="panel-body">
          <div class="panel-heading"><div><h2>Practice and Roleplay Cases</h2><p>Select a case to compare group performance, then drill down to individual learners.</p></div><div class="panel-count"><strong>${v3CblCases.length}</strong><span>cases</span></div></div>
          <div class="cbl-v3-case-grid">${v3CblCases.map(v3CblCaseCard).join("")}</div>
        </div>
      </section>
    </div>`;
}

function v3CblLearnerBreakdown(group) {
  return `
    <button class="cbl-v3-back" type="button" data-v3-cbl-back><span aria-hidden="true">&larr;</span> Back to groups</button>
    <div class="panel-heading"><div><h3>Learner Performance</h3><p>Highest score and attempt count for each learner in ${group.name}.</p></div></div>
    <div class="cbl-v3-learner-list">
      ${v3CblLearners(group).map((learner) => `
        <article><div><strong>${learner.name}</strong><span>${v3CountLabel(learner.attempts, "attempt")} &middot; ${learner.version}</span></div><div><span>Highest score</span><strong>${learner.score}%</strong></div></article>`).join("")}
    </div>`;
}

function v3CblGroupBreakdown(groups) {
  return `
    <div class="panel-heading"><div><h3>Group Performance</h3><p>Compare participation and average highest score across learner groups.</p></div></div>
    <div class="cbl-v3-group-list">
      ${groups.map((group) => `
        <article><div><strong>${group.name}</strong><span>${v3CountLabel(group.learners, "learner")} &middot; ${v3CountLabel(group.attempts, "attempt")}</span></div><div><span>Average highest score</span><strong>${group.score}%</strong></div><button type="button" data-v3-cbl-group="${group.id}" aria-label="View learners in ${group.name}">View learners</button></article>`).join("")}
    </div>`;
}

function renderCblDialogV3() {
  const item = v3CblCases.find((candidate) => candidate.id === v3CblState.caseId);
  if (!item) return;
  const groups = v3CblGroups(item);
  const group = groups.find((candidate) => candidate.id === v3CblState.groupId);
  const attempts = group ? group.attempts : item.attempts ?? Math.max(1, Math.round(item.learners * 0.6));
  const learners = group ? group.learners : item.detailLearners ?? item.learners;
  const score = group ? group.score : item.score;
  const live = group ? group.live ?? 0 : item.live ?? 0;
  const turnBased = group ? group.turnBased ?? group.attempts : item.turnBased ?? attempts;

  if (reportDialog.open) reportDialog.close();
  showReportDialog({
    title: item.name,
    subtitle: group
      ? `${group.name} learner breakdown. Scores represent highest scores.`
      : `Role: ${item.role}. Scores represent highest scores.`,
    summaryLabel: "CBL case summary",
    summary: `
      <article><span>Average highest score</span><strong>${score}%</strong></article>
      <article><span>Total attempts</span><strong>${attempts}</strong></article>
      <article><span>Learners attempted</span><strong>${learners}</strong></article>`,
    body: `
      <div class="cbl-v3-mode-chips"><span>${live} Live</span><span>${turnBased} Turn-based</span></div>
      ${group ? v3CblLearnerBreakdown(group) : v3CblGroupBreakdown(groups)}`
  });
}

function openCblCaseV3(caseId) {
  v3CblState.caseId = caseId;
  v3CblState.groupId = null;
  renderCblDialogV3();
}

function v3FeatureCard({ tab, icon, title, status, statusTone = "", metric, metricLabel, description, priority = false }) {
  return `
    <article class="overview-v3-card ${priority ? "is-priority" : ""}">
      <header class="overview-v3-card-head">
        <span class="overview-v3-card-title"><span class="overview-v3-card-icon" data-icon="${icon}"></span>${title}</span>
        <span class="overview-v3-card-status ${statusTone}">${status}</span>
      </header>
      <div class="overview-v3-card-metric"><strong>${metric}</strong><span>${metricLabel}</span></div>
      <p>${description}</p>
      <button class="overview-v3-link" type="button" data-v3-overview-tab="${tab}">Open ${title}<span data-icon="arrow"></span></button>
    </article>`;
}

function renderOverviewV3() {
  const skills = v3AllSkillStats(skillSectors);
  const palsCompletion = v3Average(palsCourses.map((course) => course.completion));
  const palsScore = v3Average(palsCourses.map((course) => course.score));
  const assessmentScore = v3Average(assessments.map((assessment) => assessment.score));
  const enrollments = courses.reduce((sum, course) => sum + course.enrollments, 0);
  const completions = courses.reduce((sum, course) => sum + course.completions, 0);
  const recentCompletions = trendSeries.completions.reduce((sum, value) => sum + value, 0);
  const recentEnrollments = trendSeries.enrollments.reduce((sum, value) => sum + value, 0);

  const cards = [
    {
      tab: "pals", icon: "cap", title: "PALS Courses", status: "Primary", statusTone: "is-good",
      metric: `${palsCompletion}%`, metricLabel: `average completion · ${palsScore}% average score`,
      description: `${palsCourses.length} published PALS courses generate knowledge-check evidence for Skills.`, priority: true
    },
    {
      tab: "cbl", icon: "trophy", title: "CBL", status: "Active", statusTone: "is-good",
      metric: v3CblCases.length, metricLabel: `${v3CblSummary.learnersAttempted} learners &middot; ${v3CblSummary.totalAttempts} attempts`,
      description: `Case-based practice is active with a ${v3CblSummary.averageHighestScore}% average highest score across the catalogue.`, priority: true
    },
    {
      tab: "skills", icon: "sparkle", title: "Skills", status: "Outcome", statusTone: "is-good",
      metric: `${skills.mastery}%`, metricLabel: `combined proficiency · ${skills.coverage}% evidence coverage`,
      description: "Skills consolidates PALS knowledge and CBL application without hiding the source breakdown.", priority: true
    },
    {
      tab: "assessments", icon: "clipboard", title: "Assessments", status: "Validation",
      metric: `${assessmentScore}%`, metricLabel: `average score across ${assessments.length} assessments`,
      description: "Assessments validate broader learning performance and provide a formal checkpoint after practice."
    },
    {
      tab: "courses", icon: "book-open", title: "Courses", status: "Delivery",
      metric: enrollments, metricLabel: `enrollments · ${completions} course completions`,
      description: "Courses provide participation context around the learning activities and evidence shown elsewhere."
    },
    {
      tab: "trends", icon: "trend", title: "Trends", status: "Exploratory",
      metric: recentCompletions, metricLabel: `lesson completions · ${recentEnrollments} enrollments in 30 days`,
      description: "Trends is reserved for change over time. Its final product questions still need to be defined."
    }
  ];

  return `
    <div class="overview-v3">
      <section class="overview-v3-section" aria-labelledby="overview-v3-feature-title">
        <header class="overview-v3-section-head">
          <div><h2 id="overview-v3-feature-title">Feature pulse</h2><p>Each summary links to the tab that owns the detailed data.</p></div>
        </header>
        <div class="overview-v3-grid">${cards.map(v3FeatureCard).join("")}</div>
      </section>
    </div>`;
}

function openSkillsMethodV3() {
  showReportDialog({
    title: "How skill proficiency works",
    subtitle: "Skills analytics",
    summaryLabel: "Proficiency evidence sources",
    summary: `
      <article><span>PALS knowledge</span><strong>Knowledge checks</strong></article>
      <article><span>CBL application</span><strong>Applied performance</strong></article>
      <article><span>Combined proficiency</span><strong>Unified result</strong></article>`,
    body: `
      <div class="panel-heading"><div><h3>Evidence composition</h3><p>Source-level results remain visible so administrators can understand what contributes to each skill result.</p></div></div>
      <div class="skills-v3-method-explainer">
        <article><span data-icon="book-open"></span><div><strong>PALS knowledge</strong><p>Uses performance from correctly answered PALS questions tagged to the skill. PALS alone can contribute up to ${PALS_MASTERY_CAP} of the 100 proficiency points.</p></div></article>
        <article class="is-cbl"><span data-icon="trophy"></span><div><strong>CBL application</strong><p>Uses scored CBL cases mapped to the skill through Learning Objectives, worth up to ${CBL_MASTERY_CAP} of the 100 proficiency points. A case mapped to more than one skill splits its weight evenly across every mapped skill.</p></div></article>
        <article><span data-icon="chart"></span><div><strong>Combined proficiency</strong><p>Adds the PALS and CBL points together, so a skill needs evidence from both sources to reach 100% proficiency.</p></div></article>
      </div>
      <p class="skills-v3-evidence-note"><strong>Source transparency:</strong> PALS and CBL scores remain available independently alongside combined proficiency.</p>`
  });
}

function v3RawSkill(sectorId, skillName) {
  const sector = skillSectors.find((item) => item.id === sectorId);
  return sector?.skills.find((item) => item.name === skillName);
}

function v3SkillBreakdownRows(sectorId, skillName, memberIds) {
  const rawSkill = v3RawSkill(sectorId, skillName);
  if (!rawSkill) return "";
  return memberIds.map((learnerId) => {
    const learner = skillsLearners.find((item) => item.id === learnerId);
    const memberSkill = v3SkillForLearner(rawSkill, learnerId);
    const memberPalsScore = palsSkillScore(memberSkill);
    const memberCblScore = memberSkill.cbl?.score ?? null;
    return `
      <article class="skills-v3-breakdown-row">
        <div class="skills-v3-breakdown-name">${v3LearnerName(learner)}</div>
        <div><span>PALS</span><strong>${memberPalsScore == null ? "—" : `${memberPalsScore}%`}</strong><small>${memberSkill.total ? `${memberSkill.correct}/${memberSkill.total}` : "No evidence"}</small></div>
        <div><span>CBL</span><strong>${memberCblScore == null ? "—" : `${memberCblScore}%`}</strong><small>${memberSkill.cbl?.scenarios ? v3CountLabel(memberSkill.cbl.scenarios, "scenario") : "No evidence"}</small></div>
        <div><span>Combined</span><strong>${memberSkill.mastery == null ? "—" : `${memberSkill.mastery}%`}</strong></div>
      </article>`;
  }).join("");
}

function openHeatCellDetailV3(sectorId, skillName, groupId) {
  const rawSkill = v3RawSkill(sectorId, skillName);
  const sector = skillSectors.find((item) => item.id === sectorId);
  const group = v3SkillGroups().find((item) => item.id === groupId);
  if (!rawSkill || !sector || !group) return;

  const skill = v3SkillForGroup(rawSkill, group.memberIds);
  const palsScore = palsSkillScore(skill);
  const cblScore = skill.cbl?.score ?? null;
  const scenarioCount = skill.cbl?.scenarios || 0;

  showReportDialog({
    title: skill.name,
    subtitle: `${group.name} · ${v3SectorName(sector)}`,
    summaryLabel: "Group skill summary",
    summary: `
      <article><span>Combined proficiency</span><strong>${skill.mastery == null ? "—" : `${skill.mastery}%`}</strong></article>
      <article><span>PALS</span><strong>${palsScore == null ? "—" : `${palsScore}%`}</strong></article>
      <article><span>CBL</span><strong>${cblScore == null ? "—" : `${cblScore}%`}</strong></article>`,
    body: `
      <div class="skills-v3-detail-label">Learners in ${group.name} (${v3CountLabel(group.memberIds.length, "student")})</div>
      <div class="skills-v3-breakdown-list">${v3SkillBreakdownRows(sectorId, skillName, group.memberIds)}</div>
      ${scenarioCount ? "" : `<p class="skills-v3-band-empty-note">No CBL cases have been mapped to this skill through Learning Objectives yet.</p>`}`
  });
}

function openSkillEvidenceV3(sectorId, skillName) {
  v3SkillEvidenceState.sectorId = sectorId;
  v3SkillEvidenceState.skillName = skillName;
  v3SkillEvidenceState.showBreakdown = false;
  renderSkillEvidenceDialogV3();
}

function renderSkillEvidenceDialogV3() {
  const { sectorId, skillName } = v3SkillEvidenceState;
  const scope = v3ResolveSkillsScope();
  if (!scope.sectors) return;
  const isOrgWide = state.skillsMode === "organization";
  const isGroupMode = state.skillsMode === "group";
  const sector = scope.sectors.find((item) => item.id === sectorId);
  const skill = sector?.skills.find((item) => item.name === skillName);
  if (!sector || !skill) return;

  const palsScore = palsSkillScore(skill);
  const cblScore = skill.cbl?.score ?? null;
  const scenarioCount = skill.cbl?.scenarios || 0;
  const palsPoints = skill.palsPoints || 0;
  const cblPoints = skill.cbl?.points || 0;
  const evidenceState = skillEvidenceState(skill);
  const mappedCases = isOrgWide ? v3CasesForSkill(skill.name) : [];
  const cblMappingNote = scenarioCount
    ? `${scenarioCount} CBL ${scenarioCount === 1 ? "case" : "cases"} mapped to ${skill.name} through Learning Objectives${mappedCases.length ? ` (${mappedCases.map((item) => item.name).join("; ")})` : ""} contribute ${cblPoints} of the ${CBL_MASTERY_CAP} available CBL points; each case's weight is split evenly across every skill it is mapped to.`
    : "No CBL cases have been mapped to this skill through Learning Objectives yet.";

  const breakdownSection = isGroupMode ? `
      <div class="skills-v3-breakdown">
        <button class="skills-v3-breakdown-toggle" type="button" data-v3-skill-breakdown-toggle aria-expanded="${v3SkillEvidenceState.showBreakdown}">
          ${v3SkillEvidenceState.showBreakdown ? "Hide" : "View"} student breakdown (${v3CountLabel(scope.group.memberIds.length, "student")})
        </button>
        ${v3SkillEvidenceState.showBreakdown ? `<div class="skills-v3-breakdown-list">${v3SkillBreakdownRows(sectorId, skillName, scope.group.memberIds)}</div>` : ""}
      </div>` : "";

  showReportDialog({
    title: skill.name,
    subtitle: `${v3SectorName(sector)} · ${evidenceState.label}`,
    summaryLabel: "Skill evidence summary",
    summary: `
      <article><span>Combined proficiency</span><strong>${skill.mastery == null ? "—" : `${skill.mastery}%`}</strong></article>
      <article><span>PALS knowledge</span><strong>${palsScore == null ? "—" : `${palsScore}%`}</strong></article>
      <article><span>CBL application</span><strong>${cblScore == null ? "—" : `${cblScore}%`}</strong></article>`,
    body: `
      <div class="panel-heading"><div><h3>Evidence composition</h3><p>Each source stays visible so an administrator can understand why this proficiency result exists.</p></div></div>
      <div class="skills-v3-evidence-flow">
        <article><span>PALS knowledge</span><strong>${palsScore == null ? "—" : `${palsScore}%`}</strong><small>${skill.total ? `${skill.correct} of ${skill.total} tagged questions correct` : "No question evidence"}</small></article>
        <span class="skills-v3-flow-plus">+</span>
        <article><span>CBL application</span><strong>${cblScore == null ? "—" : `${cblScore}%`}</strong><small>${scenarioCount ? `${scenarioCount} scored ${scenarioCount === 1 ? "scenario" : "scenarios"}` : "No scenario evidence"}</small></article>
        <span class="skills-v3-flow-plus">→</span>
        <article><span>Combined proficiency</span><strong>${skill.mastery == null ? "—" : `${skill.mastery}%`}</strong><small>${skill.mastery == null ? "Knowledge and application evidence combined" : `${palsPoints} PALS pt${palsPoints === 1 ? "" : "s"} + ${cblPoints} CBL pt${cblPoints === 1 ? "" : "s"} (capped at ${PALS_MASTERY_CAP}/${CBL_MASTERY_CAP})`}</small></article>
      </div>
      <p class="skills-v3-evidence-note"><strong>Learning objective mapping:</strong> ${cblMappingNote} PALS questions use the same canonical skill taxonomy, preventing duplicate or fragmented skill names.</p>
      <article class="question-card"><strong>PALS question evidence</strong><p>${skill.total ? `${skill.correct} correct answers from ${skill.total} questions tagged to ${skill.name}.` : "No PALS question evidence has been recorded for this skill yet."}</p></article>
      <article class="question-card"><strong>CBL scenario evidence</strong><p>${scenarioCount ? `${scenarioCount} scored ${scenarioCount === 1 ? "scenario was" : "scenarios were"} mapped to ${skill.name} through Learning Objectives.` : "No scored CBL scenario evidence has been recorded for this skill yet."}</p></article>
      ${breakdownSection}`
  });
}

tabRenderers.overview = renderOverviewV3;
tabRenderers.cbl = renderCblV3;
tabRenderers.skills = renderSkillsV3;
openSkillEvidence = openSkillEvidenceV3;

document.addEventListener("click", (event) => {
  const cblCase = event.target.closest("[data-v3-cbl-case]");
  if (cblCase) {
    openCblCaseV3(cblCase.dataset.v3CblCase);
    return;
  }

  const cblGroup = event.target.closest("[data-v3-cbl-group]");
  if (cblGroup) {
    v3CblState.groupId = cblGroup.dataset.v3CblGroup;
    renderCblDialogV3();
    return;
  }

  if (event.target.closest("[data-v3-cbl-back]")) {
    v3CblState.groupId = null;
    renderCblDialogV3();
    return;
  }

  if (event.target.closest("[data-v3-method-info]")) {
    openSkillsMethodV3();
    return;
  }

  if (event.target.closest("[data-v3-skill-breakdown-toggle]")) {
    v3SkillEvidenceState.showBreakdown = !v3SkillEvidenceState.showBreakdown;
    renderSkillEvidenceDialogV3();
    return;
  }

  if (event.target.closest("[data-v3-compare-toggle]")) {
    v3SkillState.compareExpanded = !v3SkillState.compareExpanded;
    renderAndFocus("[data-v3-compare-toggle]");
    return;
  }

  const heatCell = event.target.closest("[data-v3-heat-cell]");
  if (heatCell) {
    openHeatCellDetailV3(heatCell.dataset.v3HeatSector, heatCell.dataset.v3HeatSkill, heatCell.dataset.v3HeatGroup);
    return;
  }

  const compareSort = event.target.closest("[data-v3-compare-sort]");
  if (compareSort) {
    // Cycle per group column: 1st click highest first, 2nd click lowest
    // first, 3rd click back to the default widest-gap-first view.
    const key = compareSort.dataset.v3CompareSort;
    const current = v3SkillState.compareSort || { key: "gap", dir: "desc" };
    if (current.key !== key) {
      v3SkillState.compareSort = { key, dir: "desc" };
    } else if (current.dir === "desc") {
      v3SkillState.compareSort = { key, dir: "asc" };
    } else {
      v3SkillState.compareSort = { key: "gap", dir: "desc" };
    }
    renderAndFocus(`[data-v3-compare-sort="${key}"]`);
    return;
  }

  const skillToggle = event.target.closest("[data-v3-skill-toggle]");
  if (skillToggle) {
    const name = skillToggle.dataset.v3SkillToggle;
    v3SkillState.expandedRow = v3SkillState.expandedRow === name ? null : name;
    renderAndFocus(`[data-v3-skill-toggle="${name}"]`);
    return;
  }

  const overviewLink = event.target.closest("[data-v3-overview-tab]");
  if (overviewLink) {
    state.tab = overviewLink.dataset.v3OverviewTab;
    render();
    document.querySelector(`[data-tab="${state.tab}"]`)?.focus();
    return;
  }

  const skillsModeButton = event.target.closest("[data-skills-mode]");
  if (skillsModeButton) {
    state.skillsMode = skillsModeButton.dataset.skillsMode;
    state.skillsGroup = null;
    state.skillsLearner = null;
    state.skillsSector = null;
    v3SkillState.sourceFilter = "all";
    v3SkillState.sort = "low";
    v3SkillState.compareSort = { key: "gap", dir: "desc" };
    renderAndFocus(`[data-skills-mode="${state.skillsMode}"]`);
    return;
  }

  const sectorButton = event.target.closest("[data-v3-sector]");
  if (!sectorButton) return;
  state.skillsSector = sectorButton.dataset.v3Sector;
  v3SkillState.sourceFilter = "all";
  v3SkillState.expandedRow = null;
  v3SkillState.compareSort = { key: "gap", dir: "desc" };
  renderAndFocus(`[data-v3-sector="${state.skillsSector}"]`);
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-skills-learner]")) {
    state.skillsLearner = event.target.value || null;
    state.skillsSector = null;
    v3SkillState.sourceFilter = "all";
    v3SkillState.sort = "low";
    renderAndFocus("[data-skills-learner]");
    return;
  }

  if (event.target.matches("[data-skills-group]")) {
    state.skillsGroup = event.target.value || null;
    state.skillsSector = null;
    v3SkillState.sourceFilter = "all";
    v3SkillState.sort = "low";
    renderAndFocus("[data-skills-group]");
    return;
  }

  if (event.target.matches("[data-v3-source-filter]")) {
    v3SkillState.sourceFilter = event.target.value;
    renderAndFocus("[data-v3-source-filter]");
    return;
  }

  if (event.target.matches("[data-v3-skill-sort]")) {
    v3SkillState.sort = event.target.value;
    renderAndFocus("[data-v3-skill-sort]");
  }
});

state.tab = "overview";
render();
