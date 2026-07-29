// Skill gap alert — variant C: ranked rows styled after skills-overview.html
// (colored left border by tier, dimmed "on track" rows, low-coverage warning,
// a 4-band competency distribution bar, click-to-expand PALS/CBL make-up).
// Band coverage is derived from the same 4 sample individual learners used
// elsewhere in v3 (bima-23, gam-mai, learner-chuen, learner-vin) — real
// per-learner evidence, not fabricated counts.
const V3_GAPC_BAND_LEARNERS = ["bima-23", "gam-mai", "learner-chuen", "learner-vin"];
const V3_GAPC_BAND_NAMES = ["Novice", "Developing", "Competent", "Proficient"];
const V3_GAPC_BAND_CLASSES = ["seg1", "seg2", "seg3", "seg4"];
const V3_GAPC_LOW_COVERAGE = 2;

function v3GapCTier(mastery) {
  if (mastery == null) return "";
  if (mastery < 50) return "crit";
  if (mastery < 65) return "watch";
  if (mastery >= 75) return "strong";
  return "";
}

const V3_GAPC_BADGE = {
  crit: '<span class="gapc-badge attn"><span class="bdot"></span>Needs attention</span>',
  watch: '<span class="gapc-badge watch"><span class="bdot"></span>Watch</span>',
  strong: '<span class="gapc-badge ok"><span class="bdot"></span>On track</span>'
};

function v3GapCBands(sectorId, skillName) {
  const rawSkill = v3RawSkill(sectorId, skillName);
  const dist = [0, 0, 0, 0];
  let cover = 0;
  if (!rawSkill) return { dist, cover };
  V3_GAPC_BAND_LEARNERS.forEach((learnerId) => {
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
  const guidance = v3SkillGuidance(skill, v3SkillSourceType(skill));
  const evidenceCount = skill.total + (skill.cbl?.scenarios || 0);
  const tier = v3GapCTier(skill.mastery);
  // The band breakdown is sourced from seeded per-learner sample data, which is
  // independent of this skill's org-wide evidence. Only show it when the
  // org-wide mastery actually has evidence behind it, so the two numbers on
  // this row never contradict each other (band data with no combined score).
  const hasOrgEvidence = skill.mastery != null;
  const { dist, cover } = hasOrgEvidence ? v3GapCBands(sector.id, skill.name) : { dist: [0, 0, 0, 0], cover: 0 };
  const bandTotal = dist.reduce((sum, count) => sum + count, 0) || 1;
  const segs = dist.map((count, i) => `<span class="${V3_GAPC_BAND_CLASSES[i]}" style="width:${(count / bandTotal * 100).toFixed(1)}%"></span>`).join("");
  const bandDetail = dist.map((count, i) => `<div class="gapc-bd"><span class="dot ${V3_GAPC_BAND_CLASSES[i]}"></span><span class="gapc-bn">${count}</span><span class="gapc-bl">${V3_GAPC_BAND_NAMES[i]}</span></div>`).join("");
  const lowCoverage = hasOrgEvidence && cover < V3_GAPC_LOW_COVERAGE;
  const palsPts = skill.palsPoints || 0;
  const cblPts = skill.cbl?.points || 0;
  const openGap = Math.max(0, 100 - palsPts - cblPts);

  return `
    <article class="gapc-row ${tier}" data-v3-skill-name="${skill.name}">
      <div class="gapc-row-top">
        <span class="gapc-name">${skill.name}${tier ? V3_GAPC_BADGE[tier] : ""}<span class="gapc-cat">${v3SectorName(sector)}</span></span>
        <span class="gapc-cover ${lowCoverage ? "low" : ""}">${hasOrgEvidence ? `${cover} of ${V3_GAPC_BAND_LEARNERS.length} learners${lowCoverage ? '<span class="gapc-flag" title="Few sample learners have data for this skill — read with caution">&#9888;&#65038;</span>' : ""}` : "No evidence yet"}</span>
        <span class="gapc-val">${skill.mastery == null ? "—" : `${skill.mastery}%`}</span>
      </div>
      <div class="gapc-bar">${hasOrgEvidence ? segs : '<span class="gapc-bar-empty"></span>'}</div>
      <div class="gapc-detail">
        <div class="gapc-detail-label">Score composition</div>
        <div class="gapc-comp">
          <div class="gapc-track">
            <span class="pals" style="width:${palsPts}%">${palsPts > 10 ? "PALS " + palsPts : ""}</span>
            <span class="cbl" style="width:${cblPts}%">${cblPts > 10 ? "CBL " + cblPts : ""}</span>
            <span class="cap" style="width:${openGap}%"></span>
          </div>
        </div>
        <div class="gapc-kv"><b>${skill.mastery == null ? "—" : `${skill.mastery}%`}</b> combined = <b class="is-pals-text">${palsPts} pts PALS</b> (questions answered correctly) + <b class="is-cbl-text">${cblPts} pts CBL</b> (scored scenarios). ${guidance}.</div>
        ${hasOrgEvidence ? `
        <div class="gapc-detail-label" style="margin-top:16px">Learners per band (sample of ${V3_GAPC_BAND_LEARNERS.length})</div>
        <div class="gapc-banddist">${bandDetail}</div>` : `
        <div class="gapc-band-empty-note">No organization-wide evidence yet, so no learner band breakdown is shown for this skill.</div>`}
        <div class="gapc-evidence-note">${evidenceCount} evidence ${evidenceCount === 1 ? "item" : "items"} tracked for this skill.</div>
      </div>
    </article>`;
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
          <button class="skills-v3-method-trigger" type="button" data-v3-method-info aria-haspopup="dialog"><span data-icon="help"></span>How mastery works</button>
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
              <option value="high" ${v3SkillState.sort === "high" ? "selected" : ""}>Mastery: high first</option>
              <option value="name" ${v3SkillState.sort === "name" ? "selected" : ""}>Skill name</option>
            </select>
          </div>
        </div>
      </header>

      <div class="skills-v3-detail-body">
        <aside class="skills-v3-profile" aria-label="Selected sector profile">
          <p class="skill-category-label">Sector profile</p>
          <h3 class="gapc-profile-title">${v3SectorName(sector)}</h3>
          <p class="gapc-profile-note">Average mastery by skill within this sector, combining PALS and CBL evidence.</p>
          ${radarChart(sector.skills.map((skill) => ({ name: skill.name, value: skill.mastery || 0 })), "skills-v3-radar", `${v3SectorName(sector)} skill mastery`)}
          <div class="skills-v3-profile-summary">
            <article><span>Sector mastery</span><strong>${sectorStats.mastery == null ? "—" : `${sectorStats.mastery}%`}</strong></article>
            <article><span>Both sources</span><strong>${sectorStats.both}/${sector.skills.length}</strong></article>
          </div>
        </aside>
        <div>
          <h3 class="gapc-list-title">Skills across the organisation</h3>
          <p class="gapc-list-count">${sector.skills.length} skill${sector.skills.length === 1 ? "" : "s"} &middot; ${v3SectorName(sector)}${attentionCount ? ` &middot; <b class="gapc-attn-count">${attentionCount} need${attentionCount === 1 ? "s" : ""} attention</b>` : ""}</p>
          <p class="gapc-summary-note">Skills needing attention are pulled to the top and flagged red; strong skills are dimmed. Each bar shows how learners spread across the four competency bands — click a skill for its PALS / CBL make-up.</p>
          <div class="gapc-rowlist">
            ${visibleSkills.length
              ? visibleSkills.map((skill) => v3SkillRow(skill, sector)).join("")
              : `<div class="skills-v3-empty-filter"><strong>No matching skills</strong>Try another evidence filter for this sector.</div>`}
          </div>
          <div class="gapc-legend">
            <span class="lg"><span class="dot seg1"></span>Novice</span>
            <span class="lg"><span class="dot seg2"></span>Developing</span>
            <span class="lg"><span class="dot seg3"></span>Competent</span>
            <span class="lg"><span class="dot seg4"></span>Proficient</span>
          </div>
        </div>
      </div>
    </section>`;
}

document.addEventListener("click", (event) => {
  const row = event.target.closest(".gapc-row");
  if (row) row.classList.toggle("open");
});

render();
