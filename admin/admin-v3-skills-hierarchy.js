// Skills hierarchy prototype — response to the "45,000 skills in the
// SkillsFuture framework" scaling concern. Layers a Sector > Category > Job
// Role drill-down on top of the real sector data, and simulates the taxonomy
// scale with a large deterministic synthetic skill pool per job role.
//
// The real sector.skills (4 per sector, from admin-v2-skills-replica.js) are
// distributed into this hierarchy and rendered with the real v3SkillRow
// component whenever they have evidence — nothing about how a tagged skill
// looks or behaves changes. Untagged skills (real ones with no evidence, plus
// the whole synthetic pool) share the exact same collapsed "No evidence yet"
// + search pattern already shipped in admin-v3.js, reusing its CSS classes
// and event handlers as-is.

function hierHashSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}

function hierSeededInt(seedStr, min, max) {
  return min + (hierHashSeed(seedStr) % (max - min + 1));
}

const HIER_WORD_A = ["Regulatory", "Client", "Data", "Risk", "Process", "Digital", "Operational", "Compliance", "Service", "Strategic", "Technical", "Quality", "Analytical", "Communication", "Systems", "Workflow", "Vendor", "Financial", "Clinical", "Infrastructure"];
const HIER_WORD_B = ["Reporting", "Analysis", "Handling", "Management", "Assessment", "Documentation", "Monitoring", "Planning", "Coordination", "Auditing", "Advisory", "Governance", "Optimization", "Facilitation", "Integration", "Evaluation", "Execution", "Review", "Design", "Escalation"];
const HIER_WORD_C = ["Fundamentals", "Level 2", "Level 3", "Advanced", "Intermediate", "Specialist Track", "Practitioner", "Foundation", "Applied", "Core"];

function hierSkillName(roleName, index) {
  const seed = `${roleName}::${index}`;
  const a = HIER_WORD_A[hierSeededInt(seed + "a", 0, HIER_WORD_A.length - 1)];
  const b = HIER_WORD_B[hierSeededInt(seed + "b", 0, HIER_WORD_B.length - 1)];
  const c = HIER_WORD_C[hierSeededInt(seed + "c", 0, HIER_WORD_C.length - 1)];
  const code = String(hierSeededInt(seed + "code", 10000, 99999));
  return `${a} ${b} — ${c} · TSC-${code}`;
}

const HIER_CATEGORY_TEMPLATES = ["Client & Advisory", "Risk & Compliance", "Operations & Delivery"];
const HIER_ROLE_TEMPLATES = ["Associate", "Analyst", "Senior Specialist"];

const v3HierState = { categoryIndex: null, roleIndex: null };
const v3HierCache = new Map();

function hierBuildSector(sector) {
  if (v3HierCache.has(sector.id)) return v3HierCache.get(sector.id);

  const categories = HIER_CATEGORY_TEMPLATES.map((catName, catIndex) => ({
    name: catName,
    roles: HIER_ROLE_TEMPLATES.map((roleTemplate, roleIndex) => {
      const roleName = `${catName} ${roleTemplate}`;
      const poolSize = hierSeededInt(`${sector.id}::${catIndex}::${roleIndex}::pool`, 60, 260);
      const syntheticPool = Array.from({ length: poolSize }, (_, i) => ({ name: hierSkillName(roleName, i) }));
      return { name: roleName, realSkills: [], syntheticPool };
    })
  }));

  sector.skills.forEach((skill) => {
    const seed = `${sector.id}::${skill.name}`;
    const catIndex = hierSeededInt(seed + "::cat", 0, HIER_CATEGORY_TEMPLATES.length - 1);
    const roleIndex = hierSeededInt(seed + "::role", 0, HIER_ROLE_TEMPLATES.length - 1);
    categories[catIndex].roles[roleIndex].realSkills.push(skill);
  });

  v3HierCache.set(sector.id, categories);
  return categories;
}

function hierRoleStats(role) {
  const taggedReal = role.realSkills.filter((skill) => skill.mastery != null);
  const total = role.realSkills.length + role.syntheticPool.length;
  const proficiency = taggedReal.length ? Math.round(taggedReal.reduce((sum, skill) => sum + skill.mastery, 0) / taggedReal.length) : null;
  return { tagged: taggedReal.length, total, proficiency };
}

function hierCategoryStats(category) {
  return category.roles.reduce((acc, role) => {
    const stats = hierRoleStats(role);
    const taggedVals = role.realSkills.filter((skill) => skill.mastery != null).map((skill) => skill.mastery);
    acc.tagged += stats.tagged;
    acc.total += stats.total;
    acc.taggedVals.push(...taggedVals);
    return acc;
  }, { tagged: 0, total: 0, taggedVals: [] });
}

function hierSectorTotals(sector) {
  const categories = hierBuildSector(sector);
  return categories.reduce((acc, category) => {
    const stats = hierCategoryStats(category);
    acc.tagged += stats.tagged;
    acc.total += stats.total;
    return acc;
  }, { tagged: 0, total: 0 });
}

function hierCard({ title, meta, tagged, total, proficiency, attr }) {
  const metricHtml = tagged
    ? `<span class="skills-v3-hier-card-metric" style="color:${v3HeatColor(proficiency)}">${proficiency}%</span>`
    : `<span class="skills-v3-hier-card-metric is-empty">No evidence yet</span>`;
  const coveragePct = total ? Math.min(100, (tagged / total) * 100) : 0;
  return `
    <button type="button" class="skills-v3-hier-card" ${attr}>
      <div class="skills-v3-hier-card-top"><strong>${title}</strong>${metricHtml}</div>
      <div class="skills-v3-hier-card-meta">${meta}</div>
      <div class="skills-v3-hier-card-meta">${tagged.toLocaleString()} of ${total.toLocaleString()} skills tagged</div>
      <div class="skills-v3-hier-card-coverage"><span style="width:${coveragePct}%"></span></div>
    </button>`;
}

function hierBreadcrumb(sector) {
  const categories = hierBuildSector(sector);
  const parts = [{ label: v3SectorName(sector), crumb: "sector" }];
  if (v3HierState.categoryIndex != null) {
    parts.push({ label: categories[v3HierState.categoryIndex].name, crumb: "category" });
  }
  if (v3HierState.roleIndex != null) {
    parts.push({ label: categories[v3HierState.categoryIndex].roles[v3HierState.roleIndex].name, crumb: null });
  }

  return `
    <nav class="skills-v3-hier-crumbs" aria-label="Skills taxonomy breadcrumb">
      ${parts.map((part, i) => `${i > 0 ? '<span class="skills-v3-hier-crumb-sep">/</span>' : ""}${
        part.crumb && i < parts.length - 1
          ? `<button type="button" class="skills-v3-hier-crumb" data-v3-hier-crumb="${part.crumb}">${part.label}</button>`
          : `<span class="skills-v3-hier-crumb is-current">${part.label}</span>`
      }`).join("")}
    </nav>`;
}

function hierCategoryGrid(sector) {
  const categories = hierBuildSector(sector);
  return `
    <div class="skills-v3-hier-head"><h3>Categories</h3><p>Pick a category to see its job roles.</p></div>
    <div class="skills-v3-hier-grid">
      ${categories.map((category, i) => {
        const stats = hierCategoryStats(category);
        const proficiency = stats.taggedVals.length ? Math.round(stats.taggedVals.reduce((a, b) => a + b, 0) / stats.taggedVals.length) : null;
        return hierCard({
          title: category.name,
          meta: `${category.roles.length} job roles`,
          tagged: stats.tagged,
          total: stats.total,
          proficiency,
          attr: `data-v3-hier-category="${i}"`
        });
      }).join("")}
    </div>`;
}

function hierRoleGrid(sector, categoryIndex) {
  const category = hierBuildSector(sector)[categoryIndex];
  return `
    <div class="skills-v3-hier-head"><h3>${category.name}</h3><p>Pick a job role to see its individual skills.</p></div>
    <div class="skills-v3-hier-grid">
      ${category.roles.map((role, i) => {
        const stats = hierRoleStats(role);
        return hierCard({
          title: role.name,
          meta: `${stats.total.toLocaleString()} mapped skills`,
          tagged: stats.tagged,
          total: stats.total,
          proficiency: stats.proficiency,
          attr: `data-v3-hier-role="${i}"`
        });
      }).join("")}
    </div>`;
}

const V3_HIER_SEARCH_CAP = 30;

function hierUntaggedSection(untaggedSkills) {
  if (!untaggedSkills.length) return "";
  const open = v3SkillState.untaggedOpen;
  const query = v3SkillState.untaggedQuery.trim().toLowerCase();
  const matches = query ? untaggedSkills.filter((skill) => skill.name.toLowerCase().includes(query)) : untaggedSkills;
  const shown = matches.slice(0, V3_HIER_SEARCH_CAP);

  return `
    <div class="skills-v3-untagged">
      <button class="skills-v3-untagged-toggle" type="button" data-v3-untagged-toggle aria-expanded="${open}">
        <span><strong>No evidence yet (${untaggedSkills.length.toLocaleString()})</strong><small>Not rendered by default — search to find one, or map PALS/CBL evidence to bring it into the list above.</small></span>
        <span class="skills-v3-untagged-chevron" data-icon="chevron" aria-hidden="true"></span>
      </button>
      ${open ? `
      <div class="skills-v3-untagged-body">
        <input type="search" class="skills-v3-untagged-search" data-v3-untagged-search placeholder="Search ${untaggedSkills.length.toLocaleString()} untagged skills by name&hellip;" value="${v3SkillState.untaggedQuery}" />
        <div class="skills-v3-untagged-list">
          ${shown.length
            ? shown.map((skill) => `<div class="skills-v3-untagged-item"><span>${skill.name}</span><span>not tagged</span></div>`).join("")
            : `<p class="skills-v3-untagged-empty">No untagged skills match that search.</p>`}
        </div>
        ${matches.length > V3_HIER_SEARCH_CAP
          ? `<p class="skills-v3-untagged-more">+${(matches.length - V3_HIER_SEARCH_CAP).toLocaleString()} more match &mdash; refine your search to narrow it down.</p>`
          : ""}
      </div>` : ""}
    </div>`;
}

function hierSkillList(sector, categoryIndex, roleIndex) {
  const category = hierBuildSector(sector)[categoryIndex];
  const role = category.roles[roleIndex];
  const taggedReal = role.realSkills.filter((skill) => skill.mastery != null).sort((a, b) => b.mastery - a.mastery);
  const untaggedReal = role.realSkills.filter((skill) => skill.mastery == null);
  const untaggedAll = [...untaggedReal, ...role.syntheticPool];

  return `
    <div class="skills-v3-hier-head"><h3>${role.name}</h3><p>${v3SectorName(sector)} &middot; ${category.name}</p></div>
    <div class="skills-v3-list">
      ${taggedReal.length
        ? taggedReal.map((skill) => v3SkillRow(skill, sector)).join("")
        : `<div class="skills-v3-empty-filter"><strong>No tagged skills in this job role yet</strong>Map PALS or CBL evidence to a skill here to see it above.</div>`}
    </div>
    ${hierUntaggedSection(untaggedAll)}`;
}

function v3SkillsDetailSection(sector, sectors) {
  const sectorStats = v3SectorStats(sector);
  const totals = hierSectorTotals(sector);

  const bodyContent = v3HierState.categoryIndex == null
    ? hierCategoryGrid(sector)
    : v3HierState.roleIndex == null
      ? hierRoleGrid(sector, v3HierState.categoryIndex)
      : hierSkillList(sector, v3HierState.categoryIndex, v3HierState.roleIndex);

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
          <div class="skills-v3-hier-scale-note"><strong>${totals.total.toLocaleString()} skills</strong>&nbsp;mapped to ${v3SectorName(sector)} in the taxonomy (a scaled illustration of the real ~45,000). Only ${totals.tagged} have PALS/CBL evidence today.</div>
          ${hierBreadcrumb(sector)}
          ${bodyContent}
        </div>
      </div>
    </section>`;
}

// Capture phase so this runs before admin-v3.js's own bubble-phase sector
// click handler — the hierarchy state needs to reset before that handler's
// render() call, or the new sector would render with the old category/role
// still selected.
document.addEventListener("click", (event) => {
  if (event.target.closest("[data-v3-sector]") || event.target.closest("[data-skills-mode]")) {
    v3HierState.categoryIndex = null;
    v3HierState.roleIndex = null;
    return;
  }

  const catCard = event.target.closest("[data-v3-hier-category]");
  if (catCard) {
    v3HierState.categoryIndex = Number(catCard.dataset.v3HierCategory);
    v3HierState.roleIndex = null;
    v3SkillState.untaggedOpen = false;
    v3SkillState.untaggedQuery = "";
    renderAndFocus(`[data-v3-hier-category="${v3HierState.categoryIndex}"]`);
    return;
  }

  const roleCard = event.target.closest("[data-v3-hier-role]");
  if (roleCard) {
    v3HierState.roleIndex = Number(roleCard.dataset.v3HierRole);
    v3SkillState.untaggedOpen = false;
    v3SkillState.untaggedQuery = "";
    renderAndFocus(`[data-v3-hier-role="${v3HierState.roleIndex}"]`);
    return;
  }

  const crumb = event.target.closest("[data-v3-hier-crumb]");
  if (crumb) {
    if (crumb.dataset.v3HierCrumb === "sector") { v3HierState.categoryIndex = null; v3HierState.roleIndex = null; }
    if (crumb.dataset.v3HierCrumb === "category") { v3HierState.roleIndex = null; }
    v3SkillState.untaggedOpen = false;
    v3SkillState.untaggedQuery = "";
    render();
  }
}, true);

render();
