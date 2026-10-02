// Shared helpers for the production-styled pages.

// Feather icon paths (feather-icons@4.29.2, MIT) — the same glyphs production renders
// through its Feather icon font. Only icons that scripts render are listed here; static
// icons live inline in the HTML.
const FEATHER_PATHS = {
  barChart2: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  chevronDown: '<polyline points="6 9 12 15 18 9"></polyline>',
  chevronLeft: '<polyline points="15 18 9 12 15 6"></polyline>',
  chevronRight: '<polyline points="9 18 15 12 9 6"></polyline>',
  chevronUp: '<polyline points="18 15 12 9 6 15"></polyline>',
  clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
  info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
  search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
};

function featherSvg(paths, className = "") {
  const classes = className ? `feather-icon ${className}` : "feather-icon";
  return `<svg class="${classes}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function escapeHtml(value) {
  const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (character) => replacements[character]);
}

// Thresholds from production's table legend: To Improve < 50%, Improving 50–74%, Improved ≥ 75%.
function tierClass(percent) {
  if (percent >= 75) return "bg-success";
  if (percent >= 50) return "bg-warning";
  return "bg-danger";
}

/* ---------- Pagination (BootstrapVue b-pagination markup) ---------- */

const PAGINATION_LIMIT = 5;

// Same page window as b-pagination with limit 5: "1 2 3 4 …", "… 3 4 5 …", "… 45 46 47 48".
function visiblePages(current, total) {
  const pages = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
  if (total <= PAGINATION_LIMIT) return pages(1, total);
  if (current <= PAGINATION_LIMIT - 2) return [...pages(1, PAGINATION_LIMIT - 1), "ellipsis"];
  if (current > total - (PAGINATION_LIMIT - 2)) return ["ellipsis", ...pages(total - PAGINATION_LIMIT + 2, total)];
  return ["ellipsis", current - 1, current, current + 1, "ellipsis"];
}

// <li> items for a .pagination list; buttons carry data-page for the page's click handler.
function paginationHtml(current, totalPages) {
  const control = (label, target, ariaLabel, disabled) => (disabled
    ? `<li class="page-item disabled" aria-hidden="true"><span class="page-link" aria-label="${ariaLabel}">${label}</span></li>`
    : `<li class="page-item"><button type="button" class="page-link" data-page="${target}" aria-label="${ariaLabel}">${label}</button></li>`);

  const pageItems = visiblePages(current, totalPages).map((page) => (page === "ellipsis"
    ? '<li class="page-item disabled" role="separator"><span class="page-link">…</span></li>'
    : `<li class="page-item${page === current ? " active" : ""}"><button type="button" class="page-link" data-page="${page}" aria-label="Go to page ${page}"${page === current ? ' aria-current="page"' : ""}>${page}</button></li>`));

  return [
    control("«", 1, "Go to first page", current === 1),
    control("‹", current - 1, "Go to previous page", current === 1),
    ...pageItems,
    control("›", current + 1, "Go to next page", current === totalPages),
    control("»", totalPages, "Go to last page", current === totalPages),
  ].join("");
}
