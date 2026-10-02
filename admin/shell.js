// Admin shell shared by every page: the top navbar and the sidebar, as in production's admin
// portal (demo-hq.heyhi.sg). Sub-branch accounts get the same shell minus the HQ-only entries.
// Depends on ui-helpers.js. Renders on load from the page's PAGE_CONFIG:
//   { scope: "hq" } or { scope: "branch", branchId: "tampines" }, plus page: "insight" on the
//   Worksheet Insight page, and homePage to point the logo/Worksheet link at a comparison build
//   (e.g. hq-2.html). The page provides the empty <nav id="topbar"> and <nav id="adminv3menu">.

const ADMIN_ACCOUNTS = {
  hq: { brandName: "DEMO HQ", username: "smartjen_admin", homePage: "hq.html" },
  tampines: { brandName: "DEMO TAMPINES", username: "tampines_admin", homePage: "sub-branch.html" },
};

const HEYHI_LOGO_URL = "https://static-contents-smartjen.s3.ap-southeast-1.amazonaws.com/img/heyhi.png";
const ADMIN_AVATAR_URL = "https://elb-onlinequiz.smartjen.com/images/animal.png";

// Icon markup copied verbatim from production's menus: Feather icons 4.29.2 (MIT) and, where the
// svg class is "fa-icon", Font Awesome Free 6.2.1 (https://fontawesome.com/license/free, CC BY 4.0).
const SHELL_ICONS = {
  home: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  pieChart: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>',
  layout: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
  fileText: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  flag: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>',
  barChart2: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
  trophy: '<svg class="fa-icon" viewBox="0 0 576 512" aria-hidden="true" focusable="false"><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"></path></svg>',
  calendar: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  users: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  list: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
  settings: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  box: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
  grid: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  youtube: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
  book: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
  clipboard: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
  tag: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
  share2: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
  mail: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  zap: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  power: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>',
  faUser: '<svg class="fa-icon" viewBox="0 0 448 512" aria-hidden="true" focusable="false"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>',
  refreshCcw: '<svg class="feather-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>',
  faSignOut: '<svg class="fa-icon" viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path></svg>',
  caretDown: '<svg class="feather-icon topbar-caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="6 9 12 15 18 9"></polyline></svg>',
};

// Sidebar groups in production order, separated by dividers. hqOnly entries exist only in the
// HQ portal. The Worksheet analytics entry is the section every page of this prototype lives in.
const SIDEBAR_GROUPS = [
  [{ label: "Dashboard", icon: "home" }],
  [{
    label: "Analytic",
    icon: "pieChart",
    submenuId: "analyticsMenu",
    children: [
      { label: "Lesson", icon: "layout" },
      { label: "Worksheet", icon: "fileText", isCurrentSection: true },
      { label: "Topic", icon: "flag" },
      { label: "Report", icon: "flag" },
      { label: "Performance Report", icon: "barChart2" },
      { label: "Advanced Report", icon: "flag" },
      { label: "Leaderboard", icon: "trophy" },
    ],
  }],
  [
    { label: "Class", icon: "calendar" },
    { label: "Users", icon: "users" },
    { label: "Roles", icon: "list" },
    { label: "UDTID Data", icon: "list" },
    { label: "PALS Setting", icon: "settings" },
    { label: "UDSID Data", icon: "list" },
  ],
  [
    { label: "Questions", icon: "list" },
    { label: "Question Issue", icon: "box" },
    { label: "Worksheet", icon: "fileText" },
    { label: "Evaluation", icon: "fileText" },
    { label: "Catalogue", icon: "grid" },
    { label: "Video & Audio", icon: "youtube" },
    { label: "Document", icon: "book" },
    { label: "Lesson", icon: "layout" },
    { label: "Worksheet Set", icon: "clipboard" },
    { label: "Ticket", icon: "tag" },
    { label: "Content Sharing", icon: "share2" },
  ],
  [
    { label: "Email Notification", icon: "mail" },
    { label: "Sub Branch", icon: "list", hqOnly: true },
    { label: "Setting", icon: "settings" },
    { label: "GenAI", icon: "zap" },
    { label: "Logout", icon: "power" },
  ],
];

// "Branch switching" is HQ-only: a sub-branch account only has access to its own branch.
const USER_MENU_ITEMS = [
  { label: "Account", icon: "faUser" },
  { label: "Branch switching", icon: "refreshCcw", hqOnly: true },
  { label: "Logout", icon: "faSignOut" },
];

function adminAccount(pageConfig) {
  return pageConfig.scope === "hq" ? ADMIN_ACCOUNTS.hq : ADMIN_ACCOUNTS[pageConfig.branchId];
}

function sidebarLinkHtml(item, { homePage, pageConfig }) {
  const label = escapeHtml(item.label);
  const attributes = [`href="${item.isCurrentSection ? homePage : "#"}"`];
  attributes.push(`class="sidebar-link${item.isCurrentSection ? " active" : ""}"`);
  attributes.push(`aria-label="${label}"`);
  if (item.submenuId) attributes.push(`aria-controls="${item.submenuId}" aria-expanded="true"`);
  // The list page is the section's own page; the insight page only sits inside that section.
  if (item.isCurrentSection && pageConfig.page !== "insight") attributes.push('aria-current="page"');
  return `<a ${attributes.join(" ")}><span class="sidebar-icon">${SHELL_ICONS[item.icon]}</span><span class="sidebar-label">${label}</span></a>`;
}

function sidebarHtml(context) {
  const isVisible = (item) => context.isHq || !item.hqOnly;
  const groups = SIDEBAR_GROUPS.map((group) => {
    const items = group.filter(isVisible).map((item) => {
      if (!item.children) return `      <li>${sidebarLinkHtml(item, context)}</li>`;
      const children = item.children.filter(isVisible)
        .map((child) => `          <li>${sidebarLinkHtml(child, context)}</li>`).join("\n");
      return `      <li>${sidebarLinkHtml(item, context)}</li>
      <li>
        <ul class="sidebar-subnav" id="${item.submenuId}">
${children}
        </ul>
      </li>`;
    }).join("\n");
    return `    <ul class="sidebar-nav">\n${items}\n    </ul>`;
  });
  return `\n  <div class="sidebar-menu">\n${groups.join('\n    <hr class="sidebar-divider">\n')}\n  </div>\n`;
}

function topbarHtml({ account, homePage, isHq }) {
  const menuItems = USER_MENU_ITEMS.filter((item) => isHq || !item.hqOnly)
    .map((item) => `      <a href="#" class="dropdown-item">${SHELL_ICONS[item.icon]} ${escapeHtml(item.label)}</a>`)
    .join('\n      <div class="dropdown-divider"></div>\n');
  return `
  <a class="topbar-brand" href="${homePage}">
    <img src="${HEYHI_LOGO_URL}" alt="HeyHi">
    <h3 class="topbar-brand-name">${escapeHtml(account.brandName)}</h3>
  </a>
  <div class="topbar-user">
    <a href="#" class="topbar-user-toggle" id="userMenuToggle" role="button" aria-haspopup="true" aria-expanded="false"><span class="topbar-avatar"><img src="${ADMIN_AVATAR_URL}" alt=""></span> ${escapeHtml(account.username)} ${SHELL_ICONS.caretDown}</a>
    <div class="dropdown-menu" id="userMenu" hidden>
${menuItems}
    </div>
  </div>
`;
}

/* ---------- Behaviour ---------- */

function initSidebar(sidebar) {
  // Production expands the icon-only sidebar to 240px while hovered (1s transition in CSS).
  sidebar.addEventListener("mouseenter", () => sidebar.classList.add("is-open"));
  sidebar.addEventListener("mouseleave", () => sidebar.classList.remove("is-open"));

  sidebar.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    if (link.getAttribute("href") === "#") event.preventDefault();
    const submenuId = link.getAttribute("aria-controls");
    if (submenuId) {
      const submenu = document.getElementById(submenuId);
      submenu.hidden = !submenu.hidden;
      link.setAttribute("aria-expanded", String(!submenu.hidden));
    }
  });
}

function initUserMenu() {
  const toggle = document.getElementById("userMenuToggle");
  const menu = document.getElementById("userMenu");

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(menu.hidden);
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest('a[href="#"]')) event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    if (!menu.hidden && !menu.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) setOpen(false);
  });
}

// Only branches with a portal page in this prototype can be viewed as a sub-branch; anything
// else (e.g. a hand-edited insight URL) falls back to the HQ view so later scripts agree.
function normalizePageConfig(pageConfig) {
  if (pageConfig.scope === "branch" && !ADMIN_ACCOUNTS[pageConfig.branchId]) {
    pageConfig.scope = "hq";
    delete pageConfig.branchId;
  }
}

function renderAdminShell(pageConfig) {
  normalizePageConfig(pageConfig);
  const account = adminAccount(pageConfig);
  const context = { account, homePage: pageConfig.homePage || account.homePage, isHq: pageConfig.scope === "hq", pageConfig };
  const sidebar = document.getElementById("adminv3menu");
  document.getElementById("topbar").innerHTML = topbarHtml(context);
  sidebar.innerHTML = sidebarHtml(context);
  initSidebar(sidebar);
  initUserMenu();
}

renderAdminShell(PAGE_CONFIG);
