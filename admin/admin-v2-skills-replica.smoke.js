const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "admin-v2-skills.html"), "utf8");
const css = [
  "admin-v2-skills-replica.css",
  "admin-v2-skills-replica-analytics.css"
].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
const source = fs.readFileSync(path.join(root, "admin-v2-skills-replica.js"), "utf8");

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
  addEventListener(type, handler) { listeners[`dialog:${type}`] = handler; },
  close() { this.open = false; },
  showModal() { this.open = true; }
};
const classNames = new Set();
const eventTarget = {
  hidden: true,
  classList: {
    contains(name) { return classNames.has(name); },
    remove(name) { classNames.delete(name); },
    toggle(name) { return classNames.has(name) ? (classNames.delete(name), false) : (classNames.add(name), true); }
  },
  setAttribute() {},
  addEventListener(type, handler) { listeners[`tabs:${type}`] = handler; }
};

const documentStub = {
  addEventListener(type, handler) { listeners[type] = handler; },
  querySelector(selector) {
    if (selector === "#analytics-panel") return analyticsPanel;
    if (selector === "[data-report-dialog]") return reportDialog;
    if (selector === "[data-dialog-content]") return dialogContent;
    if (selector === ".analytics-tabs") return eventTarget;
    return eventTarget;
  },
  querySelectorAll() { return []; }
};

const windowStub = {
  addEventListener(type, handler) { listeners[`window:${type}`] = handler; },
  matchMedia() { return { matches: false }; }
};

const context = vm.createContext({ console, document: documentStub, window: windowStub });
vm.runInContext(source, context, { filename: "admin-v2-skills-replica.js" });

function renderState(expression) {
  vm.runInContext(`${expression}; render();`, context);
  return analyticsPanel.innerHTML;
}

function dispatchClick(selector, dataset = {}) {
  const attributes = {};
  const element = {
    dataset,
    attributes,
    focus() {},
    setAttribute(name, value) { attributes[name] = value; }
  };
  const target = {
    closest(candidate) { return candidate === selector ? element : null; },
    matches() { return false; }
  };
  listeners.click({ target, preventDefault() {} });
  return element;
}

function dispatchChange(selector, value) {
  const target = { value, matches(candidate) { return candidate === selector; } };
  listeners.change({ target });
}

assert.equal((html.match(/data-tab="/g) || []).length, 6, "renders all six production tabs");
assert.match(analyticsPanel.innerHTML, /Skills Analytics/, "opens the Skills prototype by default");
assert.match(analyticsPanel.innerHTML, /Forensic Accounting/, "shows populated sample data immediately");
assert.equal(
  vm.runInContext("skillSectors.every((sector) => sector.skills.every((skill) => skill.mastery == null || skill.mastery > 0))", context),
  true,
  "sample mastery values never render as a misleading zero"
);
assert.equal(
  vm.runInContext("skillSectors.every((sector) => sector.skills.every((skill) => skill.correct <= skill.total && (skill.cbl?.score == null || (skill.cbl.score > 0 && skill.cbl.score <= 100))))", context),
  true,
  "sample evidence values stay internally valid"
);

let sidebarButton = dispatchClick("[data-sidebar-toggle]");
assert.equal(sidebarButton.attributes["aria-expanded"], "false", "desktop sidebar can collapse");
sidebarButton = dispatchClick("[data-sidebar-toggle]");
assert.equal(sidebarButton.attributes["aria-expanded"], "true", "desktop sidebar can reopen");

let output = renderState('state.tab = "pals"');
assert.match(output, /Completion Rate by PALS Course/);
assert.match(output, /PALS Taxonomy/);
assert.match(output, /AML and CFL Course \(10\/6\)/);

output = renderState('state.expandedPals = "aml"; state.palsDetailTab = "learner"');
assert.match(output, /Learner Chuen/);
assert.match(output, /attempts for Introduction to AML\/CFT/);

dispatchClick("[data-pals-expand]", { palsExpand: "hr" });
dispatchClick("[data-pals-detail-tab]", { palsDetailTab: "learner" });
output = analyticsPanel.innerHTML;
assert.match(output, /Human Resource Specialist overview/, "non-AML drill-down uses its own topic");
assert.doesNotMatch(output, /The Stages of Money Laundering/, "non-AML drill-down does not leak AML topics");

dispatchChange("[data-pals-range]", "30");
output = analyticsPanel.innerHTML;
assert.match(output, /Last 30 days/);
assert.match(output, /58%/, "date range updates the taxonomy values");

dispatchClick("[data-pals-mode]", { palsMode: "individual" });
assert.match(analyticsPanel.innerHTML, /individual learner/);

dispatchClick("[data-view-report]", { viewReport: "bima" });
assert.equal(reportDialog.open, true, "report buttons open the report dialog");
assert.match(dialogContent.innerHTML, /Bima Rindarto/);

output = renderState('state.tab = "skills"; state.skillsLearner = "bima-23"; state.skillsSector = "accountancy"');
assert.match(output, /Bima Rindarto · bima\+23@heyhi\.sg/);
assert.match(output, /Forensic Accounting/);
assert.match(output, /8\/10 questions correct/);
assert.match(output, /Audit and Assurance/);
assert.match(output, /Both sources/);
assert.match(output, /PALS only/);
assert.match(output, /CBL only/);

output = renderState('state.skillsSector = "training"');
assert.match(output, /Financial Planning and Analysis/);
assert.match(output, /20\/20 questions correct/);
assert.match(output, /PALS Knowledge/);
assert.match(output, /CBL Application/);
assert.match(output, /PALS only/);

output = renderState('state.skillsSector = "healthcare"');
assert.match(output, /Both sources/);
assert.match(output, /2 scored scenarios/);
assert.match(output, /Sample data<\/strong> · Overall mastery is illustrative/);

dispatchClick("[data-skill-evidence]", { skillEvidence: "healthcare", skillName: "Billing Procedure" });
assert.match(dialogContent.innerHTML, /Billing Procedure/);
assert.match(dialogContent.innerHTML, /PALS Knowledge/);
assert.match(dialogContent.innerHTML, /CBL Application/);
assert.match(dialogContent.innerHTML, /mapped to this skill through CBL learning objectives/);

output = renderState('state.skillsSector = "financial-services"');
assert.match(output, /No evidence yet/);
assert.match(output, /data-skill-evidence="financial-services"[^>]*disabled/);

dispatchChange("[data-skills-learner]", "bima-learner");
output = analyticsPanel.innerHTML;
assert.match(output, /No skills tracked yet/);

dispatchChange("[data-skills-learner]", "gam-mai");
assert.match(analyticsPanel.innerHTML, /Forensic Accounting/, "additional sample learners also show populated skills");

output = renderState('state.tab = "cbl"');
assert.match(output, /No CBL scenarios available yet/);

output = renderState('state.tab = "assessments"');
assert.match(output, /Score vs Pass Rate/);
assert.match(output, /Assessment Performance/);

output = renderState('state.tab = "trends"');
assert.match(output, /Lesson Completions \(Last 30 Days\)/);
assert.match(output, /Enrollment Activity \(Last 30 Days\)/);

assert.match(css, /\.analytics-tabs-scroll[\s\S]*overflow-x:\s*auto/, "tabs own their horizontal overflow");
assert.match(css, /@media \(max-width: 860px\)/, "has tablet navigation breakpoint");
assert.match(css, /@media \(max-width: 620px\)/, "has mobile layout breakpoint");

console.log("admin-v2 Skills replica smoke tests passed");
