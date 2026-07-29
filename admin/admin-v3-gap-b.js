// Skill gap alert — variant B: reintroduces the 3-tier badge system from the
// 1st iteration (Needs attention / Watch / On track) plus a low-evidence
// coverage warning, alongside the existing evidence-source badge.
const V3_GAP_TIER_LABEL = { risk: "Needs attention", mid: "Watch", good: "On track" };
const V3_GAP_LOW_COVERAGE = 5;

function v3GapTierOf(mastery) {
  if (mastery == null) return null;
  if (mastery < 50) return "risk";
  if (mastery < 65) return "mid";
  if (mastery >= 75) return "good";
  return null;
}

function v3SkillRow(skill, sector) {
  const sourceType = v3SkillSourceType(skill);
  const evidenceState = skillEvidenceState(skill);
  const evidenceCount = skill.total + (skill.cbl?.scenarios || 0);
  const guidance = v3SkillGuidance(skill, sourceType);
  const tier = v3GapTierOf(skill.mastery);
  const tierBadge = tier ? `<span class="skills-v3-tier-badge is-${tier}">${V3_GAP_TIER_LABEL[tier]}</span>` : "";
  const lowCoverage = evidenceCount > 0 && evidenceCount < V3_GAP_LOW_COVERAGE;

  return `
    <article class="skills-v3-row" data-v3-skill-name="${skill.name}">
      <header class="skills-v3-row-head">
        <div class="skills-v3-row-name">
          <strong>${skill.name}</strong>${tierBadge}
          <small>${v3SectorName(sector)}</small>
        </div>
        <span class="evidence-badge ${evidenceState.className}">${evidenceState.label}</span>
        <div class="skills-v3-score">
          <span>Combined mastery</span>
          <strong>${skill.mastery == null ? "—" : `${skill.mastery}%`}</strong>
        </div>
      </header>
      <div class="skills-v3-overall-track">
        ${skill.mastery == null
          ? '<span class="mastery-empty-track" aria-hidden="true"></span>'
          : progressBar(skill.mastery, toneFor(skill.mastery), `${skill.name} combined mastery`)}
      </div>
      <div class="skills-v3-source-grid">
        ${v3SourcePanel("pals", skill)}
        ${v3SourcePanel("cbl", skill)}
      </div>
      <footer class="skills-v3-row-foot">
        <span>${guidance} &middot; ${evidenceCount} evidence ${evidenceCount === 1 ? "item" : "items"}${lowCoverage ? ' <span class="skills-v3-coverage-warning" title="Based on limited evidence — treat with caution">&#9888; low coverage</span>' : ""}</span>
        <button class="evidence-button" type="button" data-skill-evidence="${sector.id}" data-skill-name="${skill.name}" ${skill.mastery == null ? "disabled" : ""}>View evidence</button>
      </footer>
    </article>`;
}

render();
