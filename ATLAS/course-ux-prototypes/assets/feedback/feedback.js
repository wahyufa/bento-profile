/* ==========================================================================
   Course feedback form, shared by the feedback page and the lesson player pop-up
   --------------------------------------------------------------------------
   Answers go to Supabase (project "atlas-proto", table course_feedback).
   The publishable key is public by design: the table's rules allow only sending
   and reading feedback (no edits or deletes), and the database checks every value.

   window.AtlasFeedback
     AREAS, OPEN            rated areas and open questions ([column, label, hint])
     mount(form, options)   fills an empty <form> with the questions and sends it
                            options.onSent(): called after a successful send
     list()                 Promise of every response for the sample course, newest first
     sentBefore()           true if this device already sent feedback
   ========================================================================== */
(function () {
  'use strict';
  var API = 'https://ehievrlutfxbvizcdjgs.supabase.co/rest/v1/course_feedback';
  var KEY = 'sb_publishable_lUhXBTpOJmKziFaiD0bovg_N-Qqa-2H';
  var HEADERS = { apikey: KEY, 'Content-Type': 'application/json' };
  var SENT_KEY = 'atlas-feedback-sent';
  var COURSE = 'cs';

  // Keys are the table's column names
  var AREAS = [
    ['impression', 'First impression', 'The course list and course page: did you know what the course is and how to start?'],
    ['wayfinding', 'Finding your way', 'Outline, next and previous, knowing where you are and what is left.'],
    ['reading', 'Reading a lesson', 'Layout, length and how easy the content was to take in.'],
    ['activities', 'Activities', 'Journey stages, flashcards, exercises, Jen and the discussion.'],
    ['assessment', 'Reviews and quiz', 'The short review after each lesson and the final quiz.'],
    ['mobile', 'On a phone', 'Skip this if you did not try it on a phone.']
  ];
  var OPEN = [
    ['worked_well', 'What worked well?', 'e.g. The short review after each lesson felt quick and fair'],
    ['confusing', 'What was confusing or slowed you down?', ''],
    ['change_first', 'If we could change one thing first, what should it be?', '']
  ];
  var LABELS = ['Poor', 'Weak', 'OK', 'Good', 'Great'];

  function getLocal(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function setLocal(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* not essential */ } }

  // Styles for the form, scoped to .fbf so they work on any page
  var CSS = [
    '.fbf{display:grid;gap:0;font-family:"Montserrat","Segoe UI",system-ui,sans-serif}',
    '.fbf .fbq{display:grid;gap:6px;padding-block:14px;border-top:1px solid #DCE4EC}',
    '.fbf .fbq:first-child{border-top:0;padding-top:0}',
    '.fbf fieldset{border:0;margin:0;padding-inline:0;min-width:0}',
    '.fbf legend,.fbf .fbl{font-weight:700;font-size:15px;color:#1E2A3B;padding:0}',
    '.fbf .fbq small{color:#5B6B80;font-size:13.5px;font-weight:500}',
    '.fbf .fbscale{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-top:8px}',
    '.fbf .fbscale label{position:relative}',
    '.fbf .fbscale input{position:absolute;opacity:0;inset:0}',
    '.fbf .fbscale span{display:grid;place-items:center;height:52px;border:1.5px solid #DCE4EC;border-radius:10px;cursor:pointer;font-weight:800;font-size:17px;color:#31425D;background:#fff;line-height:1.1}',
    '.fbf .fbscale span small{font-weight:500;font-size:10.5px;color:#5B6B80}',
    '.fbf .fbscale input:checked+span{background:#0D719A;border-color:#0D719A;color:#fff}',
    '.fbf .fbscale input:checked+span small{color:#fff}',
    '.fbf .fbscale input:focus-visible+span,.fbf input[type=text]:focus-visible,.fbf textarea:focus-visible,.fbf button:focus-visible{outline:3px solid #F5A623;outline-offset:2px}',
    '.fbf .fbclear{justify-self:start;background:none;border:0;padding:0;color:#0D719A;font-family:inherit;font-weight:600;font-size:13px;cursor:pointer}',
    '.fbf input[type=text],.fbf textarea{width:100%;box-sizing:border-box;font-family:inherit;font-weight:500;font-size:15px;color:#1E2A3B;background:#F4F7FA;border:1.5px solid #DCE4EC;border-radius:10px;padding:10px 12px}',
    '.fbf textarea{min-height:80px;resize:vertical}',
    '.fbf .fbactions{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding-top:14px}',
    '.fbf .fbsend{font-family:inherit;font-weight:700;font-size:14.5px;border:0;border-radius:10px;padding:12px 20px;background:#0D719A;color:#fff;cursor:pointer}',
    '.fbf .fbsend:disabled{opacity:.5;cursor:not-allowed}',
    '.fbf .fbstatus{font-size:14px;color:#5B6B80}',
    '.fbf .fbstatus.err{color:#B42318}',
    '@media (prefers-reduced-motion:no-preference){.fbf .fbscale span{transition:background .15s,border-color .15s}}'
  ].join('');
  function addStyles() {
    if (document.getElementById('fbfStyles')) return;
    var s = document.createElement('style'); s.id = 'fbfStyles'; s.textContent = CSS; document.head.appendChild(s);
  }

  function formHtml(p) {
    return '<div class="fbq"><label class="fbl" for="' + p + 'name">Your name or team <small>(optional)</small></label><input type="text" id="' + p + 'name" name="name" maxlength="80" autocomplete="name"></div>' +
      AREAS.map(function (a) {
        return '<fieldset class="fbq"><legend>' + a[1] + '</legend><small>' + a[2] + '</small><div class="fbscale">' +
          [1, 2, 3, 4, 5].map(function (n) {
            return '<label><input type="radio" name="' + a[0] + '" value="' + n + '"><span>' + n + '<small>' + LABELS[n - 1] + '</small></span></label>';
          }).join('') + '</div><button class="fbclear" type="button" data-fb-clear="' + a[0] + '" hidden>Clear</button></fieldset>';
      }).join('') +
      OPEN.map(function (o) {
        return '<div class="fbq"><label class="fbl" for="' + p + o[0] + '">' + o[1] + '</label><textarea id="' + p + o[0] + '" name="' + o[0] + '" maxlength="2000"' + (o[2] ? ' placeholder="' + o[2] + '"' : '') + '></textarea></div>';
      }).join('') +
      '<div class="fbactions"><button class="fbsend" type="submit">Send feedback</button><span class="fbstatus" role="status" aria-live="polite"></span></div>';
  }

  function mount(form, options) {
    options = options || {};
    addStyles();
    form.classList.add('fbf');
    form.noValidate = true;
    form.innerHTML = formHtml(options.idPrefix || 'fb-');

    // A chosen rating can be taken back (radio buttons cannot be unticked otherwise)
    form.addEventListener('change', function (e) {
      if (e.target.type === 'radio') form.querySelector('[data-fb-clear="' + e.target.name + '"]').hidden = false;
    });
    form.addEventListener('click', function (e) {
      var c = e.target.closest('[data-fb-clear]'); if (!c) return;
      Array.prototype.forEach.call(form.querySelectorAll('input[name="' + c.dataset.fbClear + '"]'), function (r) { r.checked = false; });
      c.hidden = true;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var row = { course: COURSE, name: form.elements.name.value.trim().slice(0, 80) || null };
      AREAS.forEach(function (a) { var c = form.querySelector('input[name="' + a[0] + '"]:checked'); row[a[0]] = c ? +c.value : null; });
      OPEN.forEach(function (o) { row[o[0]] = form.elements[o[0]].value.trim().slice(0, 2000) || null; });
      var status = form.querySelector('.fbstatus'), btn = form.querySelector('.fbsend');
      var any = AREAS.some(function (a) { return row[a[0]]; }) || OPEN.some(function (o) { return row[o[0]]; });
      if (!any) { status.textContent = 'Add at least one rating or comment first.'; status.className = 'fbstatus err'; return; }
      btn.disabled = true; status.textContent = 'Sending…'; status.className = 'fbstatus';
      fetch(API, { method: 'POST', headers: Object.assign({ Prefer: 'return=minimal' }, HEADERS), body: JSON.stringify(row) })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); })
        .then(function () {
          setLocal(SENT_KEY, new Date().toISOString());
          btn.disabled = false; status.textContent = '';
          form.reset();
          Array.prototype.forEach.call(form.querySelectorAll('[data-fb-clear]'), function (c) { c.hidden = true; });
          if (options.onSent) options.onSent();
        })
        .catch(function () {
          btn.disabled = false;
          status.textContent = 'Could not send. Check your connection and try again. Your answers are still here.';
          status.className = 'fbstatus err';
        });
    });
  }

  function list() {
    var ctrl = new AbortController(), t = setTimeout(function () { ctrl.abort(); }, 10000);
    return fetch(API + '?select=*&course=eq.' + COURSE + '&order=created_at.desc&limit=1000', { headers: HEADERS, signal: ctrl.signal })
      .then(function (r) { clearTimeout(t); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); },
        function (e) { clearTimeout(t); throw e; });
  }

  window.AtlasFeedback = {
    AREAS: AREAS, OPEN: OPEN, mount: mount, list: list,
    sentBefore: function () { return !!getLocal(SENT_KEY); }
  };
})();
