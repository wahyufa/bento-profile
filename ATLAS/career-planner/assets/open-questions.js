/* ==========================================================================
   Open questions widget, shared by the admin and learner prototypes
   --------------------------------------------------------------------------
   A floating button lists every open question with where it shows on screen.
   "Show me" opens that screen (in either prototype), scrolls to the marker and
   makes it pulse. Reviewers can tick questions off as discussed (this browser only).

   Page API:
     OQ.init({ app: 'admin' | 'learner', go: function (q) { ...open q.hash, run q.prep... } })
     OQ.tag(id)   HTML for the inline marker; clicking it opens the panel at that question
   ========================================================================== */
(function () {
  'use strict';
  var ADMIN = 'atlas-career-admin-prototype.html', LEARNER = 'atlas-career-learner-prototype.html';
  var Q = [
    { id: 'phase', q: 'Phase 1 scope: the scoping brief puts the learning record with compliance expiry in Phase 1, the design brief puts renewal cycles in Phase 2. Which one?', where: 'My Career › Learning record', app: 'learner', hash: '#record' },
    { id: 'choose', q: 'Choose-from stages: do learners complete N items, or cover a set of skills? Is the pool a fixed list or everything in a category?', where: 'Learning paths › Admissions Officer path, stage 2', app: 'admin', hash: '#path/pr1' },
    { id: 'bands', q: 'Role targets: use proficiency bands (Novice to Advanced), or completion only for now?', where: 'Departments & roles › Admissions Officer', app: 'admin', hash: '#role/r1' },
    { id: 'scoring', q: 'How is a skill band worked out: from completions only, or weighted by assessment scores? Depends on Skills Analytics.', where: 'My Career › My skills', app: 'learner', hash: '#skills' },
    { id: 'rolechange', q: 'When someone changes role, does their old role path stay open, or is it archived?', where: 'Staff assignments › a person', app: 'admin', hash: '#person/u1' },
    { id: 'nominate', q: 'Who counts as high-potential, and who nominates them for a Growth path: HR only, or managers too?', where: 'Staff assignments › a nominated person', app: 'admin', hash: '#person/u2' },
    { id: 'deptview', q: 'What can department heads see about their team, and what stays with HR only?', where: 'Analytics › Career & skills, department head view', app: 'admin', hash: '#reports', prep: 'head' },
    { id: 'renewver', q: 'When a compliance item renews, do people redo the same version of the content or the latest one?', where: 'Learning paths › New staff compliance', app: 'admin', hash: '#path/pf' },
    { id: 'combined', q: 'One combined learning page across Courses, PALS, CBL and Assessments, or each feature on its own? Phase 1 or 2?', where: 'My Career › My path', app: 'learner', hash: '#path' },
    { id: 'bahasa', q: 'Bahasa Indonesia for learner-facing labels: what is in place today?', where: 'No single screen: every learner label', app: '', hash: '' }
  ];
  var KEY = 'atlas-career-oq-done', APP = '', GO = null, OPEN = false, FOCUS = '';
  function done() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function setDone(id, v) { var d = done(); if (v) d[id] = true; else delete d[id]; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* fine */ } }
  function byId(id) { for (var i = 0; i < Q.length; i++) if (Q[i].id === id) return Q[i]; return null; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var CSS = [
    '.oq{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-weight:700;font-size:12px;line-height:1.4;color:#6B4400;background:#FFE9B8;border:1.5px solid #F5A623;border-radius:999px;padding:2px 10px 2px 3px;cursor:pointer;vertical-align:middle;white-space:nowrap}',
    '.oq::before{content:"?";display:grid;place-items:center;width:18px;height:18px;border-radius:50%;background:#F5A623;color:#fff;font-weight:800;font-size:11.5px}',
    '.oq:hover{background:#FFDD94}',
    '.oq.hit{animation:oqPulse 1.1s ease-out 3}',
    '@keyframes oqPulse{0%{box-shadow:0 0 0 0 rgba(245,166,35,.75)}100%{box-shadow:0 0 0 14px rgba(245,166,35,0)}}',
    '.oq-fab{position:fixed;right:20px;bottom:20px;z-index:160;display:inline-flex;align-items:center;gap:10px;border:0;border-radius:999px;padding:10px 18px 10px 10px;background:#31425D;color:#fff;font-family:inherit;font-weight:700;font-size:14px;line-height:1;box-shadow:0 10px 30px rgba(23,26,38,.3);cursor:pointer}',
    '.oq-fab i{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#F5A623;color:#fff;font-style:normal;font-weight:800}',
    '.oq-fab b{background:#F5A623;color:#31425D;border-radius:999px;padding:2px 8px;font-size:12.5px}',
    '.oq-fab.all b{background:#3CCB8A}',
    '.oq-panel{position:fixed;right:20px;bottom:76px;z-index:161;width:min(400px,calc(100vw - 24px));max-height:min(70vh,640px);display:flex;flex-direction:column;background:#fff;color:#171A26;border:1px solid #E1E5EB;border-radius:18px;box-shadow:0 24px 60px rgba(23,26,38,.3);font-family:inherit}',
    '.oq-panel[hidden]{display:none}',
    '.oq-ph{display:flex;align-items:flex-start;gap:10px;padding:16px 18px 10px;border-bottom:1px solid #E1E5EB}',
    '.oq-ph h2{font-size:16px;font-weight:700;margin:0;color:#31425D}',
    '.oq-ph p{font-size:12.5px;color:#5B6475;margin:2px 0 0}',
    '.oq-ph button{margin-left:auto;border:0;background:none;font-size:22px;line-height:1;color:#5B6475;width:32px;height:32px;border-radius:8px;cursor:pointer}',
    '.oq-ph button:hover{background:#F6F7F9}',
    '.oq-fab[hidden]{display:none}',
    '.oq-list{overflow:auto;padding:4px 10px 12px;margin:0}',
    '.oq-ol{list-style:none;margin:0;padding:0}',
    '.oq-sec{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5B6475;margin:10px 8px 2px}',
    '.oq-more{margin-top:6px;border-top:1px solid #E1E5EB}',
    '.oq-more summary{cursor:pointer;padding:8px 0 2px;list-style-position:inside}',
    '.oq-it{display:grid;grid-template-columns:24px minmax(0,1fr);gap:4px 10px;padding:10px 8px;border-radius:12px}',
    '.oq-it.focus{background:#FFF6E2}',
    '.oq-it .n{width:24px;height:24px;border-radius:50%;background:#FFE9B8;color:#6B4400;display:grid;place-items:center;font-size:12px;font-weight:800}',
    '.oq-it.done .n{background:#E3F4EC;color:#1E8A5A}',
    '.oq-it.done .q{color:#5B6475;text-decoration:line-through;text-decoration-color:rgba(91,100,117,.5)}',
    '.oq-it .q{font-size:13.5px;line-height:1.45;font-weight:600}',
    '.oq-it .w{grid-column:2;display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;font-size:12px;color:#5B6475}',
    '.oq-it .w a{font-weight:700;color:#0A5A7B;text-decoration:none}',
    '.oq-it .w a:hover{text-decoration:underline}',
    '.oq-it .w label{display:inline-flex;align-items:center;gap:5px;cursor:pointer;margin-left:auto}',
    '.oq-it .w input{accent-color:#1E8A5A}',
    '@media (max-width:560px){.oq-fab{right:12px;bottom:12px;padding:8px 14px 8px 8px}.oq-fab span{display:none}.oq-panel{right:12px;bottom:64px}}',
    '@media (prefers-reduced-motion:reduce){.oq.hit{animation:none;outline:3px solid #F5A623}}'
  ].join('');

  function remaining() { var d = done(); return Q.filter(function (q) { return !d[q.id]; }).length; }
  function renderFab() {
    // Count the questions on this screen; the button only shows where there are some
    var ids = pageIds(), d = done(), n = ids.filter(function (id) { return !d[id]; }).length, f = document.getElementById('oqFab');
    f.hidden = !ids.length;
    f.className = 'oq-fab' + (n ? '' : ' all');
    f.innerHTML = '<i aria-hidden="true">?</i><span>' + (ids.length === 1 ? 'Open question on this page' : ids.length + ' open questions on this page') + '</span><b>' + (n ? n + ' to discuss' : 'Discussed') + '</b>';
    f.setAttribute('aria-expanded', String(OPEN));
  }
  // Questions whose marker is on screen now (dialogs included, the panel itself excluded)
  function pageIds() {
    var seen = {}, out = [];
    Array.prototype.forEach.call(document.querySelectorAll('.oq[data-oq]'), function (el) { if (!el.closest('#oqPanel') && !seen[el.dataset.oq]) { seen[el.dataset.oq] = 1; out.push(el.dataset.oq); } });
    return out;
  }
  function item(q, d) {
    var other = q.app && q.app !== APP, here = pageIds().indexOf(q.id) !== -1;
    return '<li class="oq-it' + (d[q.id] ? ' done' : '') + (FOCUS === q.id ? ' focus' : '') + '" id="oqi-' + q.id + '"><span class="n" aria-hidden="true">' + (d[q.id] ? '✓' : Q.indexOf(q) + 1) + '</span><span class="q">' + esc(q.q) + '</span>' +
      '<span class="w"><span>' + esc(q.where) + '</span>' + (q.app ? '<a href="' + (other ? (q.app === 'admin' ? ADMIN : LEARNER) + '?oq=' + q.id + q.hash : '#') + '" data-oq-show="' + q.id + '">' + (here ? 'Show on page ›' : 'Show me ›') + '</a>' : '') +
      '<label><input type="checkbox" data-oq-done="' + q.id + '"' + (d[q.id] ? ' checked' : '') + '>Discussed</label></span></li>';
  }
  function renderPanel() {
    var d = done(), p = document.getElementById('oqPanel'), ids = pageIds();
    var here = Q.filter(function (q) { return ids.indexOf(q.id) !== -1; }), rest = Q.filter(function (q) { return ids.indexOf(q.id) === -1; });
    p.innerHTML = '<div class="oq-ph"><div><h2 id="oqTitle">Open questions</h2><p>Decisions this design needs from the scoping session. ' + remaining() + ' of ' + Q.length + ' still to discuss.</p></div><button type="button" data-oq-close aria-label="Close">×</button></div>' +
      '<div class="oq-list">' + (here.length ? '<h3 class="oq-sec">On this page</h3><ol class="oq-ol">' + here.map(function (q) { return item(q, d); }).join('') + '</ol>' : '') +
      '<details class="oq-more"' + (here.length ? '' : ' open') + '><summary class="oq-sec">Other screens (' + rest.length + ')</summary><ol class="oq-ol">' + rest.map(function (q) { return item(q, d); }).join('') + '</ol></details></div>';
    p.hidden = !OPEN;
    if (OPEN && FOCUS) { var el = document.getElementById('oqi-' + FOCUS); if (el) el.scrollIntoView({ block: 'nearest' }); }
  }
  function toggle(open, focus) { OPEN = open; FOCUS = focus || ''; renderFab(); renderPanel(); if (open) { var h = document.querySelector('#oqPanel [data-oq-close]'); if (h && !focus) h.focus(); } }

  // Scroll to a marker and make it pulse; retries while the page renders
  function highlight(id, tries) {
    var el = document.querySelector('.oq[data-oq="' + id + '"]');
    if (!el) { if ((tries || 0) < 15) setTimeout(function () { highlight(id, (tries || 0) + 1); }, 120); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit');
    el.focus({ preventScroll: true });
  }
  function show(id) {
    var q = byId(id); if (!q) return;
    if (q.app !== APP) return;   // the link itself opens the other prototype
    OPEN = false; renderFab(); renderPanel();
    if (GO) GO(q);
    setTimeout(function () { highlight(id); }, 80);
  }

  window.OQ = {
    tag: function (id, label) { return '<button type="button" class="oq" data-oq="' + id + '" title="' + esc((byId(id) || {}).q || 'Open question') + '">' + (label || 'Open question') + '</button>'; },
    init: function (opts) {
      APP = opts.app; GO = opts.go;
      var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
      var fab = document.createElement('button'); fab.type = 'button'; fab.id = 'oqFab'; fab.setAttribute('aria-controls', 'oqPanel');
      var panel = document.createElement('section'); panel.id = 'oqPanel'; panel.className = 'oq-panel'; panel.setAttribute('aria-labelledby', 'oqTitle'); panel.hidden = true;
      document.body.appendChild(panel); document.body.appendChild(fab);
      renderFab(); renderPanel();
      // The page re-renders on navigation: refresh the button when the set of markers changes
      var last = '';
      new MutationObserver(function () {
        var key = pageIds().join(',');
        if (key === last) return;
        last = key;
        if (!key && OPEN) OPEN = false;
        renderFab(); if (OPEN) renderPanel(); else document.getElementById('oqPanel').hidden = true;
      }).observe(document.body, { childList: true, subtree: true });
      fab.addEventListener('click', function () { toggle(!OPEN); });
      document.addEventListener('click', function (e) {
        var m = e.target.closest('.oq[data-oq]'); if (m && !e.target.closest('#oqPanel')) { e.preventDefault(); toggle(true, m.dataset.oq); return; }
        if (e.target.closest('[data-oq-close]')) { toggle(false); fab.focus(); return; }
        var sh = e.target.closest('[data-oq-show]');
        if (sh) { var q = byId(sh.dataset.oqShow); if (q && q.app === APP) { e.preventDefault(); show(q.id); } }
      });
      document.addEventListener('change', function (e) { var c = e.target.closest('[data-oq-done]'); if (c) { setDone(c.dataset.oqDone, c.checked); renderFab(); renderPanel(); } });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && OPEN && !document.querySelector('dialog[open]')) { toggle(false); fab.focus(); } });
      // Arriving from the other prototype: ?oq=<id>#screen
      try { var id = new URLSearchParams(location.search).get('oq'); if (id && byId(id)) { var q = byId(id); if (GO) GO(q); setTimeout(function () { highlight(id); }, 200); } } catch (e) { /* no deep link */ }
    }
  };
})();
