// Skill gap alert — variant A: reuse the existing single 70% mastery threshold,
// signal urgency with a colored left border + small text tag instead of a
// second competing badge (the row already carries an evidence-source badge).
// Default sort already puts the lowest-mastery skills first (v3SkillState.sort = "low").
function v3SkillRow(skill, sector) {
  const sourceType = v3SkillSourceType(skill);
  const evidenceState = skillEvidenceState(skill);
  const evidenceCount = skill.total + (skill.cbl?.scenarios || 0);
  const guidance = v3SkillGuidance(skill, sourceType);
  const needsAttention = skill.mastery == null || skill.mastery < 70;

  return `
    <article class="skills-v3-row ${needsAttention ? "is-attention" : ""}" data-v3-skill-name="${skill.name}">
      <header class="skills-v3-row-head">
        <div class="skills-v3-row-name">
          <strong>${skill.name}</strong>${needsAttention ? '<span class="skills-v3-attention-tag">Needs attention</span>' : ""}
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
        <span>${guidance} &middot; ${evidenceCount} evidence ${evidenceCount === 1 ? "item" : "items"}</span>
        <button class="evidence-button" type="button" data-skill-evidence="${sector.id}" data-skill-name="${skill.name}" ${skill.mastery == null ? "disabled" : ""}>View evidence</button>
      </footer>
    </article>`;
}

render();
