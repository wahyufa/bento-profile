// Builds the "Download PDF" worksheet for a speech / speaking-practice
// result, following the same printed-worksheet template as the quiz and
// essay PDFs: minimal header with the HeyHi logo, "Powered by HeyHi © 2026"
// footer, "1 )" numbered questions, right-aligned "( ... )" marks line.
//
// V1 — parity with what production ships today. There is no transcript and
// no pronunciation notes here; those belong to the proposed V2
// (speech-pdf-generator-v2.js), which reads the `transcript` field this
// version ignores.
//
// A speech result is the hardest of the three to put on paper, because the
// thing being assessed — the recording — can't be printed at all. So this
// generator prints what the recording produced instead:
//
//   1. The recordings are listed as takes with their durations, so the
//      reader knows what was assessed even though they can't hear it.
//   2. The Speech Practice Score prints as labelled bars (Accuracy,
//      Pronunciation, Articulation, Fluency, Prosody, each /100).
//   3. Rubrics print fully expanded — no accordion to open.
//
// Three export levels (chosen from the header dropdown):
//   "results"     - recordings, speech scores and rubric scores only
//   "withAnswers" - adds each criterion's band descriptors
//   "full"        - adds the AI remark on each criterion
//
// Like the other PDFs, the page is one ink tone throughout: meaning is
// conveyed by labels and layout, never by hue.

(function () {
  const PAGE = { width: 210, height: 297 }; // A4 mm
  const MARGIN = { top: 28, bottom: 24, left: 18, right: 18 };
  const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
  const INDENT = 9; // number gutter width, matches "1 )" + indented body text
  const LINE_HEIGHT = 5.2;
  const HEADER_RULE_Y = 20; // pages 2+: title + logo only
  const HEADER_RULE_Y_DETAILS = 30; // page 1: adds subject/level/student line
  const FOOTER_RULE_Y = PAGE.height - 18;

  const COLOR = {
    ink: [35, 35, 38],
    line: [222, 226, 232],
    rule: [180, 184, 190],
  };

  // jsPDF's built-in Helvetica is WinAnsi-encoded, so anything outside
  // Latin-1 renders as garbage and throws the line metrics off — an easy
  // trap on a speech worksheet, where feedback about sounds invites IPA
  // symbols. Transliterate the ones likely to turn up and drop the rest,
  // so a stray glyph can never break the layout.
  const ASCII_FALLBACK = {
    "ə": "uh", // ə  schwa
    "ʒ": "zh", // ʒ  ezh
    "ʃ": "sh", // ʃ  esh
    "ʤ": "dzh", // ʤ
    "ʧ": "tsh", // ʧ
    "ŋ": "ng", // ŋ
    "θ": "th", // θ
    "ð": "dh", // ð
    "ˈ": "'", // ˈ primary stress
    "ˌ": "", // ˌ secondary stress
    "ː": ":", // ː length mark
  };

  // Codepoints above U+00FF that WinAnsi *does* carry — em/en dashes, curly
  // quotes, ellipsis, bullet and friends. These must survive untouched;
  // stripping them would quietly eat the dashes in "word — Category".
  const CP1252_EXTRA = new Set([
    0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030,
    0x0160, 0x2039, 0x0152, 0x017d, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022,
    0x2013, 0x2014, 0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178,
  ]);

  function pdfSafe(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(/[^\x00-\xFF]/g, (ch) => {
      if (CP1252_EXTRA.has(ch.codePointAt(0))) return ch;
      return Object.prototype.hasOwnProperty.call(ASCII_FALLBACK, ch) ? ASCII_FALLBACK[ch] : "";
    });
  }

  function buildPdf(data, level) {
    const showDescriptors = level === "withAnswers" || level === "full";
    const showRemarks = level === "full";

    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });

    // Sanitise at the two doors every string passes through — measuring and
    // drawing — so no call site has to remember to do it, and wrapping is
    // measured against the same text that actually gets drawn.
    const rawText = doc.text.bind(doc);
    doc.text = (txt, x, yy, opts) =>
      rawText(Array.isArray(txt) ? txt.map(pdfSafe) : pdfSafe(txt), x, yy, opts);
    const rawSplit = doc.splitTextToSize.bind(doc);
    doc.splitTextToSize = (txt, width, opts) => rawSplit(pdfSafe(txt), width, opts);

    let y = MARGIN.top;
    const contentX = MARGIN.left + INDENT;
    const contentWidth = CONTENT_WIDTH - INDENT;

    // ---------- page furniture ----------

    function drawHeader(withDetails) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...COLOR.ink);
      doc.text(data.worksheetTitle || data.title, MARGIN.left, 14);

      const logoDataUri = typeof HEYHI_LOGO_DATA_URI !== "undefined" ? HEYHI_LOGO_DATA_URI : null;
      if (logoDataUri) {
        const logoWidth = 24;
        const logoHeight = (logoWidth * 80) / 268;
        doc.addImage(
          logoDataUri,
          "PNG",
          PAGE.width - MARGIN.right - logoWidth,
          14 - logoHeight / 2 - 1.5,
          logoWidth,
          logoHeight
        );
      }

      let ruleY = HEADER_RULE_Y;
      if (withDetails) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR.ink);
        doc.text(`Subject: ${data.subject}   ·   Level: ${data.level}`, MARGIN.left, 20.5);
        doc.text(
          `${data.studentName}  ·  Attempt ${data.attempts}  ·  ${data.statusLabel}  ·  Score: ${data.totalMarks}/${data.maxMarks} Marks (${data.percentage}%)`,
          MARGIN.left,
          26.5
        );
        ruleY = HEADER_RULE_Y_DETAILS;
      }

      doc.setDrawColor(...COLOR.line);
      doc.line(MARGIN.left, ruleY, PAGE.width - MARGIN.right, ruleY);
      return ruleY;
    }

    function drawFooter(pageNum, totalPages) {
      doc.setDrawColor(...COLOR.line);
      doc.line(MARGIN.left, FOOTER_RULE_Y, PAGE.width - MARGIN.right, FOOTER_RULE_Y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR.ink);
      doc.text("Powered by HeyHi © 2026", MARGIN.left, PAGE.height - 12);
      doc.text(`Page ${pageNum}/${totalPages}`, PAGE.width - MARGIN.right, PAGE.height - 12, { align: "right" });
    }

    function newPage() {
      doc.addPage();
      y = MARGIN.top;
      drawHeader(false);
    }
    function ensureSpace(h) {
      if (y + h > PAGE.height - MARGIN.bottom) newPage();
    }
    function wrapText(text, width, size, style = "normal") {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      return doc.splitTextToSize(text, width);
    }

    function drawParagraph(text, opts = {}) {
      const {
        size = 10, style = "normal", gap = 3,
        x = contentX, width = contentWidth, lineHeight = LINE_HEIGHT,
      } = opts;
      const lines = wrapText(text, width, size, style);
      ensureSpace(lines.length * lineHeight + gap);
      // ensureSpace may have paged and redrawn the (bold, larger) header —
      // re-assert the body font before drawing, or these lines render bold.
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(...COLOR.ink);
      lines.forEach((line) => {
        doc.text(line, x, y);
        y += lineHeight;
      });
      y += gap;
    }

    function drawRightNote(text, opts = {}) {
      const { size = 9.5, style = "italic", gap = 5 } = opts;
      ensureSpace(LINE_HEIGHT + gap);
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(...COLOR.ink);
      doc.text(text, PAGE.width - MARGIN.right, y, { align: "right" });
      y += LINE_HEIGHT + gap;
    }

    function drawSectionLabel(text) {
      ensureSpace(7);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...COLOR.ink);
      doc.text(text, contentX, y);
      y += 5.4;
    }

    // Bullet with a hanging indent: the dash sits in its own narrow gutter
    // and wrapped lines align under the text, not back under the dash.
    function drawBullet(text, opts = {}) {
      const {
        size = 9, gap = 2.2, x = contentX + 2,
        width = contentWidth - 2, lineHeight = 4.7, gutter = 3.6,
      } = opts;
      const lines = wrapText(text, width - gutter, size);
      ensureSpace(lines.length * lineHeight + gap);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(...COLOR.ink);
      doc.text("-", x, y);
      lines.forEach((line) => {
        doc.text(line, x + gutter, y);
        y += lineHeight;
      });
      y += gap;
    }

    // ---------- scores ----------

    // Shared bar row: an outlined track with a filled portion, readable as
    // a proportion without needing colour.
    function drawScoreBar(name, obtained, max, opts = {}) {
      const { labelWidth = 58, scoreText = `${obtained}/${max}` } = opts;
      const scoreWidth = 18;
      const barX = contentX + labelWidth + 3;
      const barWidth = contentWidth - labelWidth - scoreWidth - 6;

      ensureSpace(LINE_HEIGHT + 3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR.ink);
      doc.text(doc.splitTextToSize(name, labelWidth)[0], contentX, y);

      const barY = y - 2.6;
      doc.setDrawColor(...COLOR.rule);
      doc.setLineWidth(0.25);
      doc.roundedRect(barX, barY, barWidth, 3.2, 1.6, 1.6, "S");
      const fill = max > 0 ? Math.max(0, Math.min(1, obtained / max)) : 0;
      if (fill > 0) {
        doc.setFillColor(...COLOR.ink);
        doc.roundedRect(barX, barY, Math.max(barWidth * fill, 1.6), 3.2, 1.6, 1.6, "F");
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(scoreText, PAGE.width - MARGIN.right, y, { align: "right" });
      y += LINE_HEIGHT + 2.6;
    }

    function drawSpeechScore(q) {
      const s = q.speechScore;
      if (!s) return;

      y += 2.5;
      drawSectionLabel("Speech Practice Score");
      drawParagraph(`Overall Score: ${s.overall} / 100`, { size: 10, style: "bold", gap: 4.5 });

      const metrics = typeof SPEECH_METRICS !== "undefined" ? SPEECH_METRICS : [];
      metrics.forEach((m) => drawScoreBar(m.label, s[m.key], 100, { scoreText: `${s[m.key]}/100` }));
      y += 3.5;
    }

    // ---------- rubrics ----------

    // Total height of one criterion block, mirroring exactly what the draw
    // code below emits — separator, heading, bullets, remark, trailer.
    function measureCriterion(c) {
      const bulletWidth = contentWidth - 2 - 3.6;
      let h = 5.6 + 6; // separator + gap, then heading
      c.descriptors.forEach((d) => {
        h += wrapText(d, bulletWidth, 9).length * 4.7 + 2.2;
      });
      if (showRemarks && c.remark) {
        const remarkWidth = contentWidth - 2 - 3.4 - 4 * 2;
        const lines = wrapText(c.remark, remarkWidth, 9, "italic").length;
        h += 1.5 + (4.4 + lines * 4.7 + 4 * 2) + 2.5;
      }
      return h + 5; // trailing gap before the next criterion
    }

    function drawRubrics(q) {
      const r = q.rubrics;
      if (!r) return;

      y += 2.5;
      drawSectionLabel("Rubrics");
      drawParagraph(`${r.name}   ·   Score: ${r.obtained}/${r.max} Marks`, { size: 9.5, gap: 1.5 });
      drawParagraph(r.componentNote, { size: 9, style: "bold", gap: 5.5 });

      r.criteria.forEach((c) => drawScoreBar(c.name, c.obtained, c.max));
      y += 3.5;

      if (!showDescriptors) return;

      const pageBodyHeight = PAGE.height - MARGIN.bottom - MARGIN.top;

      r.criteria.forEach((c) => {
        // A criterion reads as one unit — heading, band descriptors and the
        // AI's remark on them. Measure the block up front and, if it fits on
        // a fresh page, move it there wholesale rather than letting the
        // remark strand itself overleaf from its descriptors.
        const blockHeight = measureCriterion(c);
        if (blockHeight <= pageBodyHeight) ensureSpace(blockHeight);
        else ensureSpace(12 + 4.7 * 2);

        // A hairline above each criterion turns the detail list into
        // discrete blocks instead of one continuous wall of text.
        doc.setDrawColor(...COLOR.line);
        doc.setLineWidth(0.2);
        doc.line(contentX, y, PAGE.width - MARGIN.right, y);
        y += 5.6;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR.ink);
        doc.text(c.name, contentX, y);
        doc.text(`${c.obtained}/${c.max} Marks`, PAGE.width - MARGIN.right, y, { align: "right" });
        y += 6;

        c.descriptors.forEach((d) => drawBullet(d));

        if (showRemarks && c.remark) {
          y += 1.5;
          drawRemarkBox(c.remark);
        }
        y += 5;
      });
    }

    // Indented, ruled box holding a criterion's AI remark, captioned so it's
    // unmistakably the AI's own note rather than another band descriptor.
    function drawRemarkBox(text) {
      const padding = 4;
      const accentGutter = 3.4;
      const x = contentX + 2;
      const boxWidth = contentWidth - 2;
      const textX = x + accentGutter + padding;
      const textWidth = boxWidth - accentGutter - padding * 2;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(text, textWidth);
      const captionHeight = 4.4;
      const boxHeight = captionHeight + lines.length * 4.7 + padding * 2;

      ensureSpace(boxHeight + 2.5);
      doc.setDrawColor(...COLOR.line);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, boxWidth, boxHeight, 1.5, 1.5, "FD");
      doc.setDrawColor(...COLOR.ink);
      doc.setLineWidth(0.7);
      doc.line(x + 0.35, y + 0.9, x + 0.35, y + boxHeight - 0.9);

      let ty = y + padding + 2.6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...COLOR.ink);
      doc.text("AI REMARK", textX, ty);
      ty += captionHeight;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      lines.forEach((line) => {
        doc.text(line, textX, ty);
        ty += 4.7;
      });

      y += boxHeight + 2.5;
    }

    // ---------- one question ----------

    function drawQuestion(q) {
      // Keep the question number and its "Question Text:" label with the
      // first couple of prompt lines, so a question never opens with just
      // its heading at the foot of a page.
      ensureSpace(9 + 5.4 + LINE_HEIGHT * 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...COLOR.ink);
      doc.text(`${q.number} )`, MARGIN.left, y);

      drawSectionLabel(q.interactive ? "Question Text:   (Interactive)" : "Question Text:");
      // Sub-prompts print unnumbered — the student answers them as one
      // continuous spoken response, not as separately-marked parts.
      q.prompts.forEach((p) => drawParagraph(p, { size: 10, gap: 2.5 }));
      y += 1.5;

      // The recording itself can't be printed, so name the takes and their
      // lengths — that's what tells the reader what was actually assessed.
      if (q.recordings && q.recordings.length) {
        const takes = q.recordings.map((r, i) => `${i + 1}. ${r.label} (${r.duration})`).join("      ");
        drawSectionLabel("Recordings:");
        drawParagraph(takes, { size: 9.5, gap: 4 });
      }

      drawSpeechScore(q);
      drawRubrics(q);

      drawRightNote(`( Marks obtained : ${q.rubrics.obtained} / ${q.rubrics.max} Marks )`);
    }

    // ---------- assemble ----------

    const firstRuleY = drawHeader(true);
    y = firstRuleY + 8;

    data.questions.forEach((q, idx) => {
      drawQuestion(q);
      if (idx < data.questions.length - 1) {
        y += 2;
        doc.setDrawColor(...COLOR.line);
        doc.line(MARGIN.left, y, PAGE.width - MARGIN.right, y);
        y += 7;
      }
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawFooter(i, totalPages);
    }

    return doc;
  }

  function download(level) {
    const btn = document.getElementById("downloadPdfBtn");
    const label = document.getElementById("downloadPdfLabel");
    const original = label.textContent;
    btn.disabled = true;
    label.textContent = "Generating…";
    setTimeout(() => {
      try {
        const doc = buildPdf(speechResult, level);
        const suffix =
          level === "results" ? "Results" : level === "withAnswers" ? "With-Rubrics" : "Full-Feedback";
        const worksheet = (speechResult.worksheetTitle || speechResult.title).replace(/[^\w]+/g, "-");
        doc.save(`${speechResult.studentName.replace(/\s+/g, "-")}-${worksheet}-${suffix}.pdf`);
      } finally {
        btn.disabled = false;
        label.textContent = original;
      }
    }, 30);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("downloadMenu");
    const btn = document.getElementById("downloadPdfBtn");
    const list = document.getElementById("downloadMenuList");
    if (!menu || !btn || !list) return;

    function closeMenu() {
      menu.classList.remove("download-menu--open");
      btn.setAttribute("aria-expanded", "false");
      list.hidden = true;
    }
    function openMenu() {
      // list is position:fixed and lives outside .topbar (which clips
      // overflow for its background pattern), so position it in JS
      // relative to the button's current on-screen location.
      const rect = btn.getBoundingClientRect();
      list.style.top = `${rect.bottom + 8}px`;
      list.style.right = `${window.innerWidth - rect.right}px`;
      menu.classList.add("download-menu--open");
      btn.setAttribute("aria-expanded", "true");
      list.hidden = false;
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (list.hidden) openMenu();
      else closeMenu();
    });
    list.querySelectorAll("button[data-level]").forEach((item) => {
      item.addEventListener("click", () => {
        closeMenu();
        download(item.dataset.level);
      });
    });
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !list.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  });
})();
