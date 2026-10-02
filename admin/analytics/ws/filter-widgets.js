// Replicas of production's filter widgets: the custom subject/level checkbox tree,
// vue-multiselect (searchable single select) and vue2-datepicker (date range).
// Markup and class names follow the originals so production.css can style them 1:1.
// Depends on ui-helpers.js.

/* ---------- Subject & level checkbox tree ---------- */

// catalog: [{ subject, levels: [...] }]. The insight page reuses this tree for Branch → Class
// (production uses the same component there), with placeholder "All Class".
function createSubjectLevelFilter(root, { catalog, onChange, placeholder = "All Subject & Level" }) {
  root.classList.add("subject-level-filter");
  root.innerHTML = `
    <div class="form-control subject-level-filter-field" role="button" tabindex="0" aria-expanded="false">${escapeHtml(placeholder)}</div>
    <div class="accordion-container" hidden>
      ${catalog.map((entry, subjectIndex) => `
        <div class="subject-item" data-subject-index="${subjectIndex}">
          <label>
            ${escapeHtml(entry.subject)}
            <input type="checkbox" class="subject-level-checkbox" data-role="subject">
            <span class="subject-level-checkmark">${featherSvg(FEATHER_PATHS.check)}</span>
          </label>
          <span class="subject-item-toggle" role="button" tabindex="0" aria-expanded="false" aria-label="Show ${escapeHtml(entry.subject)} levels">${featherSvg(FEATHER_PATHS.chevronDown)}</span>
          <div class="level-list" hidden>
            ${entry.levels.map((level) => `
              <div class="level-item">
                <label>
                  ${escapeHtml(level)}
                  <input type="checkbox" class="subject-level-checkbox" data-role="level" data-level="${escapeHtml(level)}">
                  <span class="subject-level-checkmark">${featherSvg(FEATHER_PATHS.check)}</span>
                </label>
              </div>`).join("")}
          </div>
        </div>`).join("")}
    </div>
  `;

  const field = root.querySelector(".subject-level-filter-field");
  const container = root.querySelector(".accordion-container");

  function setOpen(open) {
    root.classList.toggle("is-open", open);
    container.hidden = !open;
    field.setAttribute("aria-expanded", String(open));
  }

  function getSelection() {
    return [...container.querySelectorAll('input[data-role="level"]:checked')].map((input) => ({
      subject: catalog[input.closest(".subject-item").dataset.subjectIndex].subject,
      level: input.dataset.level,
    }));
  }

  function emitChange() {
    const selection = getSelection();
    // Production counts ticked levels, e.g. ticking "Primary English" shows "6 selected".
    field.textContent = selection.length ? `${selection.length} selected` : placeholder;
    onChange(selection);
  }

  function toggleLevels(toggle) {
    const levelList = toggle.parentElement.querySelector(".level-list");
    const expand = levelList.hidden;
    levelList.hidden = !expand;
    toggle.setAttribute("aria-expanded", String(expand));
    toggle.innerHTML = featherSvg(expand ? FEATHER_PATHS.chevronUp : FEATHER_PATHS.chevronDown);
  }

  // Production only toggles this dropdown from its own field; clicking elsewhere leaves it open.
  field.addEventListener("click", () => setOpen(container.hidden));
  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(container.hidden);
    }
  });

  container.addEventListener("change", (event) => {
    const input = event.target;
    const item = input.closest(".subject-item");
    const levelInputs = [...item.querySelectorAll('input[data-role="level"]')];
    if (input.dataset.role === "subject") {
      levelInputs.forEach((levelInput) => { levelInput.checked = input.checked; });
    } else {
      item.querySelector('input[data-role="subject"]').checked = levelInputs.every((levelInput) => levelInput.checked);
    }
    emitChange();
  });

  container.addEventListener("click", (event) => {
    const toggle = event.target.closest(".subject-item-toggle");
    if (toggle) toggleLevels(toggle);
  });

  container.addEventListener("keydown", (event) => {
    const toggle = event.target.closest(".subject-item-toggle");
    if (toggle && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      toggleLevels(toggle);
    }
  });

  return { getSelection };
}

/* ---------- Searchable single select (vue-multiselect) ---------- */

// groups: [{ label: "Primary English" | null, options: [{ value: "1", label: "Worksheet name" }] }]
// Options may also carry meta (muted text after the label, e.g. a branch) and count (shown
// right-aligned). With searchGroupLabels, typing a group's name (e.g. "tutor") keeps that group.
// setGroups() swaps the options in place and reports whether the current selection survived.
function createSearchableSelect(root, { placeholder, groups: initialGroups, onChange, searchGroupLabels = false }) {
  root.classList.add("multiselect");
  root.tabIndex = -1;
  root.innerHTML = `
    <div class="multiselect__select"></div>
    <div class="multiselect__tags">
      <input class="multiselect__input" type="text" autocomplete="off" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(placeholder)}">
      <span class="multiselect__single" hidden></span>
      <span class="multiselect__placeholder">${escapeHtml(placeholder)}</span>
    </div>
    <div class="multiselect__content-wrapper" hidden>
      <ul class="multiselect__content" role="listbox"></ul>
    </div>
  `;

  const arrow = root.querySelector(".multiselect__select");
  const tags = root.querySelector(".multiselect__tags");
  const input = root.querySelector(".multiselect__input");
  const single = root.querySelector(".multiselect__single");
  const placeholderLabel = root.querySelector(".multiselect__placeholder");
  const wrapper = root.querySelector(".multiselect__content-wrapper");
  const list = root.querySelector(".multiselect__content");

  let groups = initialGroups;
  let allOptions = groups.flatMap((group) => group.options);
  let selectedValue = null;
  let highlightedValue = null;
  let isOpen = false;

  const optionText = (option) => (option.meta ? `${option.label} · ${option.meta}` : option.label);

  function matchingGroups() {
    const query = input.value.trim().toLowerCase();
    return groups
      .map((group) => {
        if (searchGroupLabels && group.label && group.label.toLowerCase().includes(query)) return group;
        return { ...group, options: group.options.filter((option) => optionText(option).toLowerCase().includes(query)) };
      })
      .filter((group) => group.options.length);
  }

  function optionContentHtml(option) {
    const meta = option.meta ? ` <span class="multiselect__option-meta">· ${escapeHtml(option.meta)}</span>` : "";
    const count = option.count === undefined ? "" : `<span class="multiselect__option-count">${option.count}</span>`;
    return `<span class="multiselect__option-label">${escapeHtml(option.label)}${meta}</span>${count}`;
  }

  function renderList() {
    const matches = matchingGroups();
    const selectable = matches.flatMap((group) => group.options);
    if (!selectable.some((option) => option.value === highlightedValue)) {
      highlightedValue = selectable.length ? selectable[0].value : null;
    }
    if (!selectable.length) {
      list.innerHTML = '<li class="multiselect__element"><span class="multiselect__option multiselect__option--empty">No elements found. Consider changing the search query.</span></li>';
      return;
    }
    list.innerHTML = matches.map((group) => {
      const header = group.label
        ? `<li class="multiselect__element"><span class="multiselect__option multiselect__option--group multiselect__option--disabled">${escapeHtml(group.label)}</span></li>`
        : "";
      const options = group.options.map((option) => {
        const classes = ["multiselect__option"];
        if (option.count !== undefined) classes.push("multiselect__option--with-count");
        if (option.value === highlightedValue) classes.push("multiselect__option--highlight");
        if (option.value === selectedValue) classes.push("multiselect__option--selected");
        const content = option.meta || option.count !== undefined ? optionContentHtml(option) : escapeHtml(option.label);
        return `<li class="multiselect__element"><span class="${classes.join(" ")}" role="option" aria-selected="${option.value === selectedValue}" data-value="${escapeHtml(option.value)}">${content}</span></li>`;
      }).join("");
      return header + options;
    }).join("");
  }

  function renderValue() {
    const option = allOptions.find((candidate) => candidate.value === selectedValue);
    single.hidden = !option;
    placeholderLabel.hidden = Boolean(option);
    if (option) single.textContent = optionText(option);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    root.classList.add("multiselect--active");
    single.hidden = true;
    placeholderLabel.hidden = true;
    wrapper.hidden = false;
    input.value = "";
    highlightedValue = null;
    renderList();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("multiselect--active");
    wrapper.hidden = true;
    input.value = "";
    renderValue();
  }

  // Like vue-multiselect's deactivate(): close explicitly instead of relying on the blur event,
  // which never fires if the input didn't actually have focus (e.g. the window was in the background).
  function deactivate() {
    input.blur();
    close();
  }

  function select(value) {
    // vue-multiselect deselects when the current option is chosen again.
    selectedValue = selectedValue === value ? null : value;
    deactivate();
    onChange(selectedValue);
  }

  // The input stays in the DOM (zero width while inactive, as in production) so it can take focus.
  input.addEventListener("focus", open);
  input.addEventListener("blur", close);
  input.addEventListener("input", renderList);

  input.addEventListener("keydown", (event) => {
    const selectable = matchingGroups().flatMap((group) => group.options);
    const index = selectable.findIndex((option) => option.value === highlightedValue);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = event.key === "ArrowDown" ? Math.min(index + 1, selectable.length - 1) : Math.max(index - 1, 0);
      highlightedValue = selectable[nextIndex] ? selectable[nextIndex].value : null;
      renderList();
      const highlighted = list.querySelector(".multiselect__option--highlight");
      if (highlighted) highlighted.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedValue !== null) select(highlightedValue);
    } else if (event.key === "Escape") {
      deactivate();
    }
  });

  tags.addEventListener("mousedown", (event) => {
    if (event.target === input) return;
    event.preventDefault();
    input.focus();
  });

  arrow.addEventListener("mousedown", (event) => {
    event.preventDefault();
    if (isOpen) deactivate();
    else input.focus();
  });

  // Keep focus in the input while picking, otherwise blur would close the list first.
  wrapper.addEventListener("mousedown", (event) => {
    if (event.target !== wrapper) event.preventDefault();
  });

  list.addEventListener("click", (event) => {
    const option = event.target.closest("[data-value]");
    if (option) select(option.dataset.value);
  });

  list.addEventListener("mouseover", (event) => {
    const option = event.target.closest("[data-value]");
    if (!option || option.dataset.value === highlightedValue) return;
    const current = list.querySelector(".multiselect__option--highlight");
    if (current) current.classList.remove("multiselect__option--highlight");
    option.classList.add("multiselect__option--highlight");
    highlightedValue = option.dataset.value;
  });

  function setGroups(nextGroups) {
    groups = nextGroups;
    allOptions = groups.flatMap((group) => group.options);
    const kept = selectedValue === null || allOptions.some((option) => option.value === selectedValue);
    if (!kept) selectedValue = null;
    if (isOpen) renderList();
    else renderValue();
    return kept;
  }

  return { getValue: () => selectedValue, setGroups };
}

/* ---------- Date range picker (vue2-datepicker) ---------- */

// Icons copied from vue2-datepicker@3 (MIT).
const DATEPICKER_CALENDAR_SVG = '<svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false"><path d="M940.218182 107.054545h-209.454546V46.545455h-65.163636v60.50909H363.054545V46.545455H297.890909v60.50909H83.781818c-18.618182 0-32.581818 13.963636-32.581818 32.581819v805.236363c0 18.618182 13.963636 32.581818 32.581818 32.581818h861.090909c18.618182 0 32.581818-13.963636 32.581818-32.581818V139.636364c-4.654545-18.618182-18.618182-32.581818-37.236363-32.581819zM297.890909 172.218182V232.727273h65.163636V172.218182h307.2V232.727273h65.163637V172.218182h176.872727v204.8H116.363636V172.218182h181.527273zM116.363636 912.290909V442.181818h795.927273v470.109091H116.363636z"></path></svg>';
const DATEPICKER_CLEAR_SVG = '<svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false"><path d="M810.005333 274.005333l-237.994667 237.994667 237.994667 237.994667-60.010667 60.010667-237.994667-237.994667-237.994667 237.994667-60.010667-60.010667 237.994667-237.994667-237.994667-237.994667 60.010667-60.010667 237.994667 237.994667 237.994667-237.994667z"></path></svg>';
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const RANGE_SEPARATOR = " ~ ";

function toIsoDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function fromIsoDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isValidIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && toIsoDate(fromIsoDate(value)) === value;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// Production's shortcut list (labels and order copied from demo-hq.heyhi.sg).
function dateRangeShortcuts(today) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const startOfWeek = addDays(today, -today.getDay());
  return [
    { label: "Today", range: [today, today] },
    { label: "Yesterday", range: [addDays(today, -1), addDays(today, -1)] },
    { label: "Last 7 Days", range: [addDays(today, -6), today] },
    { label: "Last 30 Days", range: [addDays(today, -29), today] },
    { label: "This Week", range: [startOfWeek, addDays(startOfWeek, 6)] },
    { label: "This Month", range: [new Date(year, month, 1), new Date(year, month + 1, 0)] },
    { label: "This Year", range: [new Date(year, 0, 1), new Date(year, 11, 31)] },
  ];
}

function createDateRangePicker(root, { placeholder, onChange, today = new Date() }) {
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayIso = toIsoDate(todayDate);
  const shortcuts = dateRangeShortcuts(todayDate);

  let range = null;          // [startIso, endIso]
  let pendingStart = null;   // first click while a range is being picked
  let hoverIso = null;
  let viewYear = todayDate.getFullYear();
  let viewMonth = todayDate.getMonth();

  root.classList.add("mx-datepicker", "mx-datepicker-range");
  root.innerHTML = `
    <div class="mx-input-wrapper">
      <input name="date" type="text" autocomplete="off" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(placeholder)}" class="mx-input">
      <i class="mx-icon-clear" role="button" aria-label="Clear date">${DATEPICKER_CLEAR_SVG}</i>
      <i class="mx-icon-calendar">${DATEPICKER_CALENDAR_SVG}</i>
    </div>
  `;
  const input = root.querySelector(".mx-input");
  const clearIcon = root.querySelector(".mx-icon-clear");

  const popup = document.createElement("div");
  popup.className = "mx-datepicker-main mx-datepicker-popup";
  popup.hidden = true;
  document.body.appendChild(popup);

  function cellClasses(date, iso, monthIndex) {
    const classes = ["cell"];
    if (date.getMonth() !== monthIndex) classes.push("not-current-month");
    if (iso === todayIso) classes.push("today");
    const [start, end] = pendingStart ? [pendingStart, null] : (range || [null, null]);
    if (iso === start || iso === end) {
      classes.push("active");
    } else if (start && end && iso > start && iso < end) {
      classes.push("in-range");
    } else if (pendingStart && hoverIso) {
      const [low, high] = [pendingStart, hoverIso].sort();
      if (iso > low && iso < high) classes.push("hover-in-range");
    }
    return classes.join(" ");
  }

  function calendarHtml(year, monthIndex) {
    const firstOfMonth = new Date(year, monthIndex, 1);
    const month = firstOfMonth.getMonth();
    const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
    const rows = [];
    for (let week = 0; week < 6; week += 1) {
      const cells = [];
      for (let weekday = 0; weekday < 7; weekday += 1) {
        const date = addDays(gridStart, week * 7 + weekday);
        const iso = toIsoDate(date);
        cells.push(`<td class="${cellClasses(date, iso, month)}" data-date="${iso}" title="${iso}"><div>${date.getDate()}</div></td>`);
      }
      rows.push(`<tr class="mx-date-row">${cells.join("")}</tr>`);
    }
    return `
      <div class="mx-calendar mx-calendar-panel-date">
        <div class="mx-calendar-header">
          <button type="button" class="mx-btn mx-btn-text mx-btn-icon-double-left" data-nav="-12" aria-label="Previous year"><i class="mx-icon-double-left"></i></button>
          <button type="button" class="mx-btn mx-btn-text mx-btn-icon-left" data-nav="-1" aria-label="Previous month"><i class="mx-icon-left"></i></button>
          <button type="button" class="mx-btn mx-btn-text mx-btn-icon-double-right" data-nav="12" aria-label="Next year"><i class="mx-icon-double-right"></i></button>
          <button type="button" class="mx-btn mx-btn-text mx-btn-icon-right" data-nav="1" aria-label="Next month"><i class="mx-icon-right"></i></button>
          <span class="mx-calendar-header-label"><button type="button" class="mx-btn mx-btn-text mx-btn-current-month"> ${MONTH_LABELS[month]} </button><button type="button" class="mx-btn mx-btn-text mx-btn-current-year"> ${firstOfMonth.getFullYear()} </button></span>
        </div>
        <div class="mx-calendar-content">
          <table class="mx-table mx-table-date">
            <thead><tr>${WEEKDAY_LABELS.map((label) => `<th>${label}</th>`).join("")}</tr></thead>
            <tbody>${rows.join("")}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderPopup() {
    popup.innerHTML = `
      <div class="mx-datepicker-sidebar">
        ${shortcuts.map((shortcut, index) => `<button type="button" class="mx-btn mx-btn-text mx-btn-shortcut" data-shortcut="${index}">${shortcut.label}</button>`).join("")}
      </div>
      <div class="mx-datepicker-content">
        <div class="mx-datepicker-body">
          <div class="mx-range-wrapper">
            ${calendarHtml(viewYear, viewMonth)}
            ${calendarHtml(viewYear, viewMonth + 1)}
          </div>
        </div>
      </div>
    `;
  }

  // vue2-datepicker opens below the input, left-aligned, and right-aligns when it would overflow.
  function positionPopup() {
    const rect = input.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    let left = rect.left;
    if (left + popup.offsetWidth > viewportWidth) left = Math.max(0, rect.right - popup.offsetWidth);
    popup.style.top = `${rect.bottom + window.scrollY}px`;
    popup.style.left = `${left + window.scrollX}px`;
  }

  function open() {
    if (!popup.hidden) return;
    if (range) {
      const start = fromIsoDate(range[0]);
      viewYear = start.getFullYear();
      viewMonth = start.getMonth();
    }
    pendingStart = null;
    hoverIso = null;
    renderPopup();
    popup.hidden = false;
    positionPopup();
  }

  function close() {
    popup.hidden = true;
    pendingStart = null;
    hoverIso = null;
  }

  function displayValue() {
    return range ? `${range[0]}${RANGE_SEPARATOR}${range[1]}` : "";
  }

  function commit(startIso, endIso) {
    range = [startIso, endIso].sort();
    input.value = displayValue();
    root.classList.add("has-value");
    close();
    onChange(range);
  }

  function clear() {
    range = null;
    input.value = "";
    root.classList.remove("has-value");
    close();
    onChange(null);
  }

  function shiftMonths(offset) {
    const shifted = new Date(viewYear, viewMonth + offset, 1);
    viewYear = shifted.getFullYear();
    viewMonth = shifted.getMonth();
    renderPopup();
  }

  function pickDate(iso) {
    if (!pendingStart) {
      pendingStart = iso;
      hoverIso = null;
      renderPopup();
      return;
    }
    commit(pendingStart, iso);
  }

  input.addEventListener("focus", open);
  input.addEventListener("click", open);
  input.addEventListener("blur", close);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") input.blur();
  });

  // Typing is allowed like vue2-datepicker: "YYYY-MM-DD ~ YYYY-MM-DD", applied on change.
  input.addEventListener("change", () => {
    const typed = input.value.trim();
    if (!typed) {
      clear();
      return;
    }
    const match = typed.match(/^(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})$/);
    if (match && isValidIsoDate(match[1]) && isValidIsoDate(match[2])) {
      commit(match[1], match[2]);
    } else {
      input.value = displayValue();
    }
  });

  clearIcon.addEventListener("mousedown", (event) => event.preventDefault());
  clearIcon.addEventListener("click", clear);

  // Keep focus in the input while using the popup, otherwise blur would close it.
  popup.addEventListener("mousedown", (event) => event.preventDefault());

  popup.addEventListener("click", (event) => {
    const shortcut = event.target.closest("[data-shortcut]");
    if (shortcut) {
      const [start, end] = shortcuts[Number(shortcut.dataset.shortcut)].range;
      commit(toIsoDate(start), toIsoDate(end));
      return;
    }
    const navButton = event.target.closest("[data-nav]");
    if (navButton) {
      shiftMonths(Number(navButton.dataset.nav));
      return;
    }
    const cell = event.target.closest("td[data-date]");
    if (cell) pickDate(cell.dataset.date);
  });

  popup.addEventListener("mouseover", (event) => {
    const cell = event.target.closest("td[data-date]");
    if (!pendingStart || !cell || cell.dataset.date === hoverIso) return;
    hoverIso = cell.dataset.date;
    renderPopup();
  });

  window.addEventListener("resize", () => {
    if (!popup.hidden) positionPopup();
  });

  return { getRange: () => range };
}
