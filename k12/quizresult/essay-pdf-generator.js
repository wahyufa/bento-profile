// Builds the "Download PDF" worksheet for an essay / composition result,
// following the same printed-worksheet template as the MCQ/OE quiz PDF:
// minimal header with the HeyHi logo, "Powered by HeyHi © 2026" footer,
// "1 )" numbered questions with indented body text, and a right-aligned
// "( ... )" marks line.
//
// The hard part of an essay result is that the on-screen version is
// interactive — every highlighted phrase hides its AI feedback behind a
// hover or a click, and the rubric detail sits behind an accordion. Paper
// has no hover, so this generator flattens all of it:
//
//   1. Every annotated phrase in the essay is highlighted AND given a
//      superscript reference number, in reading order.
//   2. Below the essay, "Writing Feedback" lists those same numbers with
//      the quoted phrase, its category as a text label, and the full AI
//      explanation — so the reader can walk 1, 2, 3 down the page.
//   3. Rubrics print fully expanded: score, every criterion's band
//      descriptors, and its AI remark. No accordion to open.
//
// Three export levels (chosen from the header dropdown):
//   "results"     - essay + word count + rubric scores only
//   "withAnswers" - adds each criterion's band descriptors
//   "full"        - adds inline writing feedback, AI remarks and good points
//
// Like the quiz PDF, correctness/category is never carried by color: the
// page is one ink tone throughout, and categories are named in text.

(function () {
  const PAGE = { width: 210, height: 297 }; // A4 mm
  const MARGIN = { top: 28, bottom: 24, left: 18, right: 18 };
  const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
  const INDENT = 9; // number gutter width, matches "1 )" + indented body text
  const LINE_HEIGHT = 5.2;
  const HEADER_RULE_Y = 20; // pages 2+: title + logo only
  const HEADER_RULE_Y_DETAILS = 30; // page 1: adds subject/level/student line
  const FOOTER_RULE_Y = PAGE.height - 18;

  // Single ink tone throughout — categories and marks are conveyed by text
  // labels and layout, never by hue, so the PDF prints identically in
  // black-and-white. `highlight` is the only non-ink fill: a light gray
  // wash marking an annotated phrase inside the essay body.
  const COLOR = {
    ink: [35, 35, 38],
    line: [222, 226, 232],
    highlight: [234, 234, 236],
    rule: [180, 184, 190],
  };

  const CATEGORY_LABEL = {
    grammar: "Grammar",
    writing_clarity: "Writing Clarity",
    spelling: "Spelling",
    general_feedback: "General Feedback",
  };

  function categoryLabel(key) {
    return CATEGORY_LABEL[key] || key;
  }

  function buildPdf(data, level) {
    const showDescriptors = level === "withAnswers" || level === "full";
    const showFeedback = level === "full";

    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
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

    // ---------- the essay body ----------

    // Breaks the answer into drawable pieces: one per run of non-space
    // characters that share an annotation state. A piece carries `glue`
    // when no whitespace separated it from the previous piece, so a comma
    // that follows a highlighted phrase ("plastic bag," ) stays tight
    // against it instead of drifting off as its own word.
    //
    // The superscript reference number rides on the last piece of each
    // annotation, and matches that annotation's entry in the Writing
    // Feedback list below.
    function essayWords(q, annotations) {
      const text = q.answer;

      // Character -> 1-based annotation number (0 = not annotated).
      const refAt = new Array(text.length).fill(0);
      annotations.forEach((ann, idx) => {
        for (let i = ann.start; i < ann.end && i < text.length; i++) refAt[i] = idx + 1;
      });

      const pieces = [];
      let i = 0;
      let hadSpace = true; // start of text behaves like "after a space"
      while (i < text.length) {
        if (/\s/.test(text[i])) {
          hadSpace = true;
          i++;
          continue;
        }
        const ref = refAt[i];
        const start = i;
        // Consume while non-space AND still inside the same annotation.
        while (i < text.length && !/\s/.test(text[i]) && refAt[i] === ref) i++;
        pieces.push({
          text: text.slice(start, i),
          highlight: ref > 0,
          annRef: ref,
          glue: !hadSpace,
          ref: null,
        });
        hadSpace = false;
      }

      annotations.forEach((_, idx) => {
        const num = idx + 1;
        let last = -1;
        pieces.forEach((p, k) => {
          if (p.annRef === num) last = k;
        });
        if (last >= 0) pieces[last].ref = num;
      });

      return pieces;
    }

    function drawEssayBody(words, opts = {}) {
      const { size = 10, gap = 4, x = contentX, width = contentWidth, lineHeight = 5.6 } = opts;
      const refSize = size * 0.62;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      const spaceWidth = doc.getTextWidth(" ");

      let cx = x;
      ensureSpace(lineHeight + gap);

      words.forEach((w) => {
        doc.setFont("helvetica", w.highlight ? "bold" : "normal");
        doc.setFontSize(size);
        const wWidth = doc.getTextWidth(w.text);

        let refWidth = 0;
        if (w.ref !== null && w.ref !== undefined) {
          doc.setFontSize(refSize);
          refWidth = doc.getTextWidth(String(w.ref));
          doc.setFontSize(size);
        }

        // Lead space belongs before the piece, not trailing the previous
        // one, so a glued piece (punctuation) can sit flush against it.
        let lead = !w.glue && cx > x ? spaceWidth : 0;

        if (cx + lead + wWidth + refWidth > x + width) {
          cx = x;
          lead = 0;
          ensureSpace(lineHeight);
          y += lineHeight;
          // A page break inside the paragraph resets the font — restore it.
          doc.setFont("helvetica", w.highlight ? "bold" : "normal");
          doc.setFontSize(size);
        }
        cx += lead;

        if (w.highlight) {
          doc.setFillColor(...COLOR.highlight);
          doc.rect(cx - 0.4, y - 3.5, wWidth + 0.8, 4.6, "F");
        }

        doc.setTextColor(...COLOR.ink);
        doc.text(w.text, cx, y);

        if (w.highlight) {
          // Underline doubles the highlight cue, so an annotated phrase is
          // still obvious if the gray wash washes out on a cheap printer.
          doc.setDrawColor(...COLOR.rule);
          doc.setLineWidth(0.3);
          doc.line(cx, y + 1.1, cx + wWidth, y + 1.1);
        }

        if (w.ref !== null && w.ref !== undefined) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(refSize);
          doc.text(String(w.ref), cx + wWidth + 0.3, y - 1.6);
          doc.setFontSize(size);
        }

        cx += wWidth + refWidth;
      });

      y += lineHeight + gap;
    }

    // ---------- writing feedback list ----------

    // One boxed entry per annotation, numbered to match the superscript in
    // the essay above. Each box gets its own page-break check so a long
    // list splits cleanly instead of overflowing a precomputed height.
    function drawFeedbackItem(num, ann) {
      const padding = 3;
      const numGutter = 7;
      const textX = contentX + padding + numGutter;
      const textWidth = contentWidth - padding * 2 - numGutter;

      const quoteLines = wrapText(`"${ann.text}"  —  ${categoryLabel(ann.category)}`, textWidth, 9.5, "bold");
      const bodyLines = wrapText(ann.feedback, textWidth, 9, "normal");
      const boxHeight = quoteLines.length * 4.6 + bodyLines.length * 4.3 + padding * 2 + 1.5;

      ensureSpace(boxHeight + 2.5);
      doc.setDrawColor(...COLOR.line);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(contentX, y, contentWidth, boxHeight, 1.5, 1.5, "FD");

      // Reference number in its own gutter, so the eye can scan 1, 2, 3.
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...COLOR.ink);
      doc.text(String(num), contentX + padding + 1, y + padding + 3.4);

      let ty = y + padding + 3.4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      quoteLines.forEach((line) => {
        doc.text(line, textX, ty);
        ty += 4.6;
      });

      ty += 1.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      bodyLines.forEach((line) => {
        doc.text(line, textX, ty);
        ty += 4.3;
      });

      y += boxHeight + 2.5;
    }

    function drawWritingFeedback(q, annotations) {
      if (!showFeedback || !annotations.length) return;

      // Counts per category, so a teacher sees the shape of the errors
      // before reading them one by one — the paper equivalent of the
      // filter chips at the top of the on-screen panel.
      const counts = Object.keys(CATEGORY_LABEL)
        .map((key) => ({ key, n: annotations.filter((a) => a.category === key).length }))
        .filter((c) => c.n > 0)
        .map((c) => `${categoryLabel(c.key)}: ${c.n}`)
        .join("   ·   ");

      drawSectionLabel(`Writing Feedback  (${annotations.length} items)`);
      drawParagraph(counts, { size: 9, gap: 2.5 });

      annotations.forEach((ann, idx) => drawFeedbackItem(idx + 1, ann));
      y += 1.5;
    }

    // ---------- rubrics ----------

    // A horizontal bar per criterion, printed as an outlined track with a
    // filled portion — readable as a proportion without needing color.
    function drawCriterionBar(name, obtained, max) {
      const labelWidth = 58;
      const scoreWidth = 16;
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
      doc.text(`${obtained}/${max}`, PAGE.width - MARGIN.right, y, { align: "right" });
      y += LINE_HEIGHT + 2.6;
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

    // Total height of one criterion block, mirroring exactly what the
    // draw code below emits — separator, heading, bullets, remark, trailer.
    // Kept next to the drawing code so the two stay in step.
    function measureCriterion(c) {
      const bulletWidth = contentWidth - 2 - 3.6;
      let h = 5.6 + 6; // separator + gap, then heading
      c.descriptors.forEach((d) => {
        h += wrapText(d, bulletWidth, 9).length * 4.7 + 2.2;
      });
      if (showFeedback && c.remark) {
        const remarkWidth = contentWidth - 2 - 3.4 - 4 * 2;
        const lines = wrapText(c.remark, remarkWidth, 9, "italic").length;
        h += 1.5 + (4.4 + lines * 4.7 + 4 * 2) + 2.5;
      }
      return h + 5; // trailing gap before the next criterion
    }

    function drawRubrics(q) {
      const r = q.rubrics;
      if (!r) return;

      y += 4;
      drawSectionLabel("Rubrics");
      drawParagraph(`${r.name}   ·   Score: ${r.obtained}/${r.max} Marks`, { size: 9.5, gap: 1.5 });
      // The "COMPONENT 1" label is an internal grouping from the rubric
      // builder and means nothing on paper — print only what it describes.
      drawParagraph(r.componentNote, { size: 9, style: "bold", gap: 5.5 });

      r.criteria.forEach((c) => drawCriterionBar(c.name, c.obtained, c.max));
      y += 3.5;

      if (!showDescriptors) return;

      const pageBodyHeight = PAGE.height - MARGIN.bottom - MARGIN.top;

      r.criteria.forEach((c) => {
        // A criterion reads as one unit — heading, its band descriptors and
        // the AI's remark on them. Measure the whole block up front and, if
        // it fits on a fresh page, move it there wholesale rather than
        // letting the remark strand itself overleaf from its descriptors.
        const blockHeight = measureCriterion(c);
        if (blockHeight <= pageBodyHeight) ensureSpace(blockHeight);
        // Too tall to ever fit one page: fall back to keeping the heading
        // with at least its first two descriptor lines.
        else ensureSpace(12 + 4.7 * 2);

        // A hairline above each criterion turns the detail list into
        // discrete blocks instead of one continuous wall of text.
        doc.setDrawColor(...COLOR.line);
        doc.setLineWidth(0.2);
        doc.line(contentX, y, PAGE.width - MARGIN.right, y);
        y += 5.6;

        // Criterion name left, score right — the score column lines up
        // with the bars above, so the eye can trace one criterion down.
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR.ink);
        doc.text(c.name, contentX, y);
        doc.text(`${c.obtained}/${c.max} Marks`, PAGE.width - MARGIN.right, y, { align: "right" });
        y += 6;

        c.descriptors.forEach((d) => drawBullet(d));

        if (showFeedback && c.remark) {
          y += 1.5;
          drawRemarkBox(c.remark);
        }
        y += 5;
      });
    }

    // Indented, ruled box holding a criterion's AI remark, captioned so
    // it's unmistakably the AI's own note rather than another band
    // descriptor — the two read very differently and shouldn't blur.
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
      // Left accent rule marks this as the AI's own remark.
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

    // ---------- good points ----------

    function drawGoodPoints(q) {
      if (!showFeedback) return;
      drawSectionLabel("Good Points");
      if (!q.goodPoints || !q.goodPoints.length) {
        drawParagraph("No good points recorded for this answer.", { size: 9, style: "italic", gap: 3 });
        return;
      }
      q.goodPoints.forEach((g) => drawBullet(g));
      y += 2;
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

      drawSectionLabel("Question Text:");
      // Sub-prompts print unnumbered — the student answers them as one
      // continuous piece of writing, so numbering them would imply
      // separately-marked parts that don't exist.
      q.prompts.forEach((p) => drawParagraph(p, { size: 10, gap: 2.5 }));
      y += 1.5;

      // Annotations in reading order — the superscript numbers in the essay
      // and the numbered feedback list below must agree, so both derive
      // from this one sorted array.
      const annotations = [...(q.annotations || [])].sort((a, b) => a.start - b.start);

      drawSectionLabel("Student Answer:");
      drawEssayBody(essayWords(q, showFeedback ? annotations : []), { size: 10, gap: 3 });
      drawParagraph(`Words count: ${q.wordCount}`, { size: 9, style: "italic", gap: 4 });

      drawWritingFeedback(q, annotations);
      drawRubrics(q);
      drawGoodPoints(q);

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
        const doc = buildPdf(essayResult, level);
        const suffix =
          level === "results" ? "Results" : level === "withAnswers" ? "With-Rubrics" : "Full-Feedback";
        const worksheet = (essayResult.worksheetTitle || essayResult.title).replace(/[^\w]+/g, "-");
        doc.save(`${essayResult.studentName.replace(/\s+/g, "-")}-${worksheet}-${suffix}.pdf`);
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
