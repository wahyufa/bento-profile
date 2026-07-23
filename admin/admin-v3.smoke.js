const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "admin-v3.html"), "utf8");
const css = fs.readFileSync(path.join(root, "admin-v3.css"), "utf8");
const baseSource = fs.readFileSync(path.join(root, "admin-v2-skills-replica.js"), "utf8");
const v3Source = fs.readFileSync(path.join(root, "admin-v3.js"), "utf8");
const unapprovedScoringLanguage = /sample|illustrative|pending|approval/i;

const analyticsPanel = {
  innerHTML: "",
  attributes: {},
  setAttribute(name, value) { this.attributes[name] = value; },
  querySelector() { return null; },
  querySelectorAll() { return []; }
};

const dialogContent = { innerHTML: "", querySelectorAll() { return []; } };
const listeners = {};
const reportDialog = {
  open: false,
  addEventListener() {},
  close() { this.open = false; },
  showModal() { this.open = true; }
};
const eventTarget = {
  hidden: true,
  dataset: {},
  classList: { contains() { return false; }, remove() {}, toggle() { return false; } },
  setAttribute() {},
  addEventListener() {},
  focus() {}
};

const documentStub = {
  addEventListener(type, handler) {
    listeners[type] ||= [];
    listeners[type].push(handler);
  },
  querySelector(selector) {
    if (selector === "#analytics-panel") return analyticsPanel;
    if (selector === "[data-report-dialog]") return reportDialog;
    if (selector === "[data-dialog-content]") return dialogContent;
    return eventTarget;
  },
  querySelectorAll() { return []; }
};

const windowStub = {
  addEventListener() {},
  matchMedia() { return { matches: false }; }
};

const context = vm.createContext({ console, document: documentStub, window: windowStub });
vm.runInContext(baseSource, context, { filename: "admin-v2-skills-replica.js" });
vm.runInContext(v3Source, context, { filename: "admin-v3.js" });

function run(expression) {
  vm.runInContext(`${expression}; render();`, context);
  return analyticsPanel.innerHTML;
}

function emit(type, selector, dataset = {}, value = "") {
  const element = {
    dataset,
    value,
    disabled: false,
    focus() {},
    matches(candidate) { return candidate === selector; },
    closest(candidate) { return candidate === selector ? this : null; }
  };
  const event = { target: element, preventDefault() {}, stopImmediatePropagation() {} };
  (listeners[type] || []).forEach((handler) => handler(event));
}

const tabOrder = [...html.matchAll(/data-tab="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(
  tabOrder,
  ["overview", "pals", "cbl", "skills", "assessments", "courses", "trends"],
  "keeps Overview above the agreed product-priority hierarchy"
);
assert.match(html, /data-tab="trends"[^>]*>[\s\S]*?Trends<\/button>/);
assert.match(html, /admin-v3\.css/);
assert.match(html, /admin-v3\.js/);
assert.match(html, /<title>ATLAS Learning Analytics<\/title>/);
assert.doesNotMatch(html, /local replica|Skills V3/i);

let output = analyticsPanel.innerHTML;
assert.doesNotMatch(output, /Organization learning health|Learning analytics overview|A navigation layer across the analytics suite/);
assert.doesNotMatch(output, /Ordered by product priority|Role of Overview|Overview does not create a seventh analytics source/);
assert.doesNotMatch(output, /overview-v3-journey|From learning activity to capability outcomes/);
assert.match(output, /Feature pulse/);
assert.match(output, /Case-based practice is active with a 72% average highest score/);
assert.doesNotMatch(output, /CBL catalogue is empty|Publish the first CBL catalogue item/);
assert.equal((output.match(/<article class="overview-v3-card/g) || []).length, 6, "Overview summarizes every feature tab");
for (const tab of ["pals", "cbl", "skills", "assessments", "courses", "trends"]) {
  assert.match(output, new RegExp(`data-v3-overview-tab="${tab}"`), `Overview links to ${tab}`);
}

const destinationMarkers = {
  pals: "Completion Rate by PALS Course",
  cbl: "CBL Analytics",
  skills: "Skills overview",
  assessments: "Score vs Pass Rate",
  courses: "KP Mastery by Course",
  trends: "Lesson Completions (Last 30 Days)"
};
for (const [tab, marker] of Object.entries(destinationMarkers)) {
  run('state.tab = "overview"');
  emit("click", "[data-v3-overview-tab]", { v3OverviewTab: tab });
  assert.equal(vm.runInContext("state.tab", context), tab);
  assert.match(analyticsPanel.innerHTML, new RegExp(marker.replace(/[()]/g, "\\$&")), `Overview opens ${tab}`);
}

output = run('state.tab = "cbl"');
assert.match(output, /Available cases<\/span><strong>15<\/strong>/);
assert.match(output, /Learners attempted<\/span><strong>31<\/strong>/);
assert.match(output, /Total attempts<\/span><strong>42<\/strong>/);
assert.match(output, /Average highest score<\/span><strong>72%<\/strong>/);
assert.equal((output.match(/<article class="cbl-v3-case"/g) || []).length, 15, "CBL shows the production case catalogue");
assert.match(output, /Handling An Angry Parent/);
assert.match(output, /Banking Client review session - Understanding Client's mismatched business model \(Mandarin\)/);

emit("click", "[data-v3-cbl-case]", { v3CblCase: "handling-angry-parent" });
assert.equal(reportDialog.open, true);
assert.match(dialogContent.innerHTML, /Role: Training & Adult Education Specialist/);
assert.match(dialogContent.innerHTML, /Group Performance/);
assert.match(dialogContent.innerHTML, /HeyHi Demo/);
assert.match(dialogContent.innerHTML, /Not in any group/);

emit("click", "[data-v3-cbl-group]", { v3CblGroup: "not-in-group" });
assert.match(dialogContent.innerHTML, /Not in any group learner breakdown/);
assert.match(dialogContent.innerHTML, /Learner Performance/);
assert.match(dialogContent.innerHTML, /Unknown learner/);
assert.match(dialogContent.innerHTML, /Gam Mai/);

emit("click", "[data-v3-cbl-back]");
assert.match(dialogContent.innerHTML, /Group Performance/);

run('state.tab = "overview"');
emit("click", "[data-v3-overview-tab]", { v3OverviewTab: "skills" });
assert.equal(vm.runInContext("state.tab", context), "skills");
output = analyticsPanel.innerHTML;
assert.match(output, /Skills overview/);
assert.doesNotMatch(output, /skills-v3-path|Organization<\/span><i>|<strong>Accountancy<\/strong>/);
assert.match(output, /Across sectors/);
assert.match(output, /Evidence coverage/);
assert.match(output, /data-v3-method-info/);
assert.match(output, /How mastery works/);
assert.doesNotMatch(output, /Sample scoring model|Illustrative|pending product approval/i);
assert.doesNotMatch(output, /class="skills-v3-method"/);
assert.match(output, /Forensic Accounting/);
assert.match(output, /8 of 10 correct/);
assert.match(output, /2 scored scenarios/);

reportDialog.close();
emit("click", "[data-v3-method-info]");
assert.equal(reportDialog.open, true);
assert.match(dialogContent.innerHTML, /How skill mastery works/);
assert.match(dialogContent.innerHTML, /PALS knowledge/);
assert.match(dialogContent.innerHTML, /CBL application/);
assert.match(dialogContent.innerHTML, /Combined mastery/);
assert.doesNotMatch(dialogContent.innerHTML, unapprovedScoringLanguage);

output = run('v3SkillState.sourceFilter = "both"');
assert.match(output, /data-v3-skill-name="Forensic Accounting"/);
assert.doesNotMatch(output, /data-v3-skill-name="Financial Reporting"/);
assert.doesNotMatch(output, /data-v3-skill-name="Audit and Assurance"/);

output = run('v3SkillState.sourceFilter = "cbl-only"');
assert.match(output, /data-v3-skill-name="Audit and Assurance"/);
assert.doesNotMatch(output, /data-v3-skill-name="Forensic Accounting"/);

output = run('v3SkillState.sourceFilter = "all"; v3SkillState.sort = "low"');
assert.ok(
  output.indexOf('data-v3-skill-name="Tax Compliance"') < output.indexOf('data-v3-skill-name="Forensic Accounting"'),
  "low-mastery sorting is actionable"
);

emit("click", "[data-v3-sector]", { v3Sector: "healthcare" });
assert.equal(vm.runInContext("state.skillsSector", context), "healthcare");
assert.match(analyticsPanel.innerHTML, /Patient Service Operations/);

emit("change", "[data-v3-source-filter]", {}, "pals-only");
assert.match(analyticsPanel.innerHTML, /data-v3-skill-name="Claims Processing"/);
assert.doesNotMatch(analyticsPanel.innerHTML, /data-v3-skill-name="Healthcare Data Protection"/);

emit("change", "[data-skills-learner]", {}, "bima-learner");
assert.equal(vm.runInContext("v3SkillState.sourceFilter", context), "all", "changing learner resets stale evidence filters");
assert.match(analyticsPanel.innerHTML, /No skill evidence yet/);

run('state.skillsLearner = "bima-23"; state.skillsSector = "accountancy"');
vm.runInContext('openSkillEvidence("accountancy", "Forensic Accounting")', context);
assert.equal(reportDialog.open, true);
assert.match(dialogContent.innerHTML, /Combined mastery/);
assert.match(dialogContent.innerHTML, /Learning objective/);
assert.doesNotMatch(dialogContent.innerHTML, unapprovedScoringLanguage);

output = run('state.tab = "trends"');
assert.doesNotMatch(output, /Organization overview/);
assert.match(output, /Lesson Completions \(Last 30 Days\)/);

assert.match(css, /\.skills-v3-overview/);
assert.match(css, /\.skills-v3-sector-strip/);
assert.match(css, /\.cbl-v3-case-grid/);
assert.match(css, /\.cbl-v3-group-list/);
assert.match(css, /@media \(max-width: 760px\)/);

const overviewCss = css.slice(css.indexOf(".overview-v3"), css.indexOf(".skills-v3"));
const skillsCss = css.slice(css.indexOf(".skills-v3"), css.indexOf(".cbl-v3"));

function assertNoSubTwelveTypography(cssBlock, label) {
  const undersized = [...cssBlock.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)]
    .map((match) => Number(match[1]))
    .filter((size) => size < 12);

  assert.deepEqual(undersized, [], `${label} must not use font sizes below 12px`);
}

assert.doesNotMatch(overviewCss, /\.overview-v3-hero|\.overview-v3-definition/);
assert.doesNotMatch(overviewCss, /\.overview-v3-journey/);
assert.match(overviewCss, /\.overview-v3-section\s*\{[\s\S]*?box-shadow: var\(--shadow\)/);
assert.doesNotMatch(overviewCss, /linear-gradient|rgba\(124, 63, 242|\.overview-v3-card\.is-priority|\.overview-v3-card-status\.is-good/);
assertNoSubTwelveTypography(overviewCss, "Overview");
assertNoSubTwelveTypography(skillsCss, "Skills");
assert.match(skillsCss, /\.skills-v3 \.field label,[\s\S]*?\.skills-v3 \.radar-chart text\s*\{[\s\S]*?font-size: 12px/);
assert.match(skillsCss, /\.skills-v3-method-trigger\s*\{[\s\S]*?color: #14738b/);
assert.doesNotMatch(skillsCss, /var\(--purple\)|#(?:7c3ff2|654ab7|6b3fd0|8b67e6|6d47cb)/i);

console.log("admin-v3 analytics smoke tests passed");
