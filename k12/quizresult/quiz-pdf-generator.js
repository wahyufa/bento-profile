// Builds the "Download PDF" worksheet, styled to match HeyHi's own printed
// worksheet PDFs (see TTB.pdf reference): minimal header with the HeyHi
// logo, "Powered by HeyHi © 2026" footer, "1 )" numbered questions with
// indented body text, and marks shown as a right-aligned "( ... )" line —
// not the colored badges/boxes of a typical web UI.
//
// Supports three export levels (chosen from the header dropdown):
//   "results"     - student's answers + marks only, no answer key, no remarks
//   "withAnswers" - adds the correct/model answer for each question
//   "full"        - adds AI remarks too (everything)
//
// Correctness is never shown by color: every annotation carries a small
// vector check/x/tilde icon (drawn with jsPDF's line/circle primitives, not
// a font glyph — the base Helvetica font can't render ✓/✗ Unicode
// characters) plus an explicit text label ("Correct Answer"/"Your Answer"/
// "Student Answer"). All body text uses one ink tone throughout, so the
// PDF is legible and consistent printed in plain black-and-white.

(function () {
  const PAGE = { width: 210, height: 297 }; // A4 mm
  const MARGIN = { top: 28, bottom: 24, left: 18, right: 18 };
  const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
  const INDENT = 9; // number gutter width, matches "1 )" + indented body text
  const LINE_HEIGHT = 5.2;
  const HEADER_RULE_Y = 20; // pages 2+: title + logo only
  const HEADER_RULE_Y_DETAILS = 30; // page 1: title + logo + subject/level/student line
  const FOOTER_RULE_Y = PAGE.height - 18;

  // PDF-only palette: a single ink tone for all text — no color-coding and
  // no light/dark tiers. Correctness is conveyed only by icon shape
  // (check/x/tilde) and explicit labels ("Correct Answer"/"Your Answer"/
  // "Student Answer"), never by color, so the PDF prints identically in
  // black-and-white as it does on screen.
  const COLOR = {
    ink: [35, 35, 38],
    inkSoft: [35, 35, 38],
    muted: [35, 35, 38],
    line: [222, 226, 232],
    green: [35, 35, 38], // name kept for call-site compatibility; no longer a color cue
    red: [35, 35, 38], // name kept for call-site compatibility; no longer a color cue
    annotationGreen: [35, 35, 38],
    annotationRed: [35, 35, 38],
    partialText: [35, 35, 38],
    partialLine: [35, 35, 38],
    correctBg: [234, 234, 236],
    incorrectBg: [234, 234, 236],
  };

  const LEVEL_LABEL = {
    results: "Results Only",
    withAnswers: "Results + Correct Answers",
    full: "Full Feedback",
  };

  function fillblankTotal(q) {
    return Object.values(q.blanks).reduce((sum, b) => sum + (b.marks || 0), 0);
  }

  function marksObtainedText(obtained) {
    return `( Marks obtained : ${obtained === null || obtained === undefined ? "No Answer" : obtained + " Marks"} )`;
  }

  function buildPdf(data, level) {
    const showAnswers = level === "withAnswers" || level === "full";
    const showRemarks = level === "full";

    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
    let y = MARGIN.top;
    const contentX = MARGIN.left + INDENT;
    const contentWidth = CONTENT_WIDTH - INDENT;
    const ICON_DIAMETER = 3.4; // mm — vector check/x/tilde badge, no font glyph needed

    // Small filled circle + check/x/tilde mark, drawn with vector paths
    // (not a font glyph) so it's 100% reliable regardless of font support —
    // jsPDF's base Helvetica can't render ✓/✗ Unicode characters.
    function drawIcon(x, y, type) {
      const r = ICON_DIAMETER / 2;
      const cx = x + r;
      const cy = y - r + 0.2;
      const bg = type === "correct" ? COLOR.annotationGreen : type === "incorrect" ? COLOR.annotationRed : COLOR.partialLine;
      doc.setFillColor(...bg);
      doc.circle(cx, cy, r, "F");
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.45);
      if (type === "correct") {
        doc.line(cx - r * 0.5, cy, cx - r * 0.1, cy + r * 0.4);
        doc.line(cx - r * 0.1, cy + r * 0.4, cx + r * 0.55, cy - r * 0.45);
      } else if (type === "incorrect") {
        doc.line(cx - r * 0.5, cy - r * 0.5, cx + r * 0.5, cy + r * 0.5);
        doc.line(cx - r * 0.5, cy + r * 0.5, cx + r * 0.5, cy - r * 0.5);
      } else {
        doc.line(cx - r * 0.5, cy, cx + r * 0.5, cy);
      }
      return ICON_DIAMETER;
    }

    function drawHeader(withDetails) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...COLOR.ink);
      doc.text(data.title, MARGIN.left, 14);

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
        doc.setTextColor(...COLOR.inkSoft);
        doc.text(`Subject: ${data.subject}   ·   Level: ${data.level}`, MARGIN.left, 20.5);
        doc.text(
          `${data.studentName}  ·  Attempt ${data.attempts}  ·  ${data.statusLabel}  ·  ${data.totalMarks}/${data.maxMarks} Marks (${data.percentage}%)`,
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
      doc.setTextColor(...COLOR.muted);
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
      const { size = 10, style = "normal", color = COLOR.ink, gap = 3, x = contentX, width = contentWidth } = opts;
      const lines = wrapText(text, width, size, style);
      ensureSpace(lines.length * LINE_HEIGHT + gap);
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      lines.forEach((line) => {
        doc.text(line, x, y);
        y += LINE_HEIGHT;
      });
      y += gap;
    }
    function drawRightNote(text, opts = {}) {
      const { size = 9.5, style = "italic", color = COLOR.inkSoft, gap = 5 } = opts;
      ensureSpace(LINE_HEIGHT + gap);
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.text(text, PAGE.width - MARGIN.right, y, { align: "right" });
      y += LINE_HEIGHT + gap;
    }

    // Splits a fill-blank paragraph around its [[KEY]] markers into the
    // same {text,color,bold,bg} segment shape drawRichWords expects, with
    // the student's given answer for each blank underlined and tagged with
    // a check/x icon — correctness is shown by icon shape only, never color.
    function fillblankSegments(text, blanks) {
      const segments = [];
      const regex = /\[\[(\w+)\]\]/g;
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          segments.push({ text: text.slice(lastIndex, match.index), color: COLOR.ink });
        }
        const b = blanks[match[1]];
        if (b) {
          const correct = b.marks > 0;
          const color = correct ? COLOR.annotationGreen : COLOR.annotationRed;
          segments.push({ text: `(${match[1]})`, color: COLOR.muted, bold: false });
          segments.push({
            text: b.given || "—",
            bold: true,
            color,
            underline: true,
            underlineColor: color,
          });
          segments.push({ icon: correct ? "correct" : "incorrect" });
        }
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), color: COLOR.ink });
      }
      return segments;
    }

    // Wraps a run of differently-styled "words" — plain text plus inline
    // colored/bold/underlined annotation spans — the same way the live
    // page flows annotated text inside one paragraph.
    function drawRichWords(segments, opts = {}) {
      const { size = 10, gap = 3, x = contentX, width = contentWidth } = opts;
      doc.setFontSize(size);
      const spaceWidth = doc.getTextWidth(" ");
      const words = [];
      segments.forEach((seg) => {
        if (seg.icon) {
          words.push({ icon: seg.icon });
          return;
        }
        seg.text.split(" ").forEach((w) => {
          if (w) {
            words.push({
              text: w,
              color: seg.color || COLOR.ink,
              bold: !!seg.bold,
              bg: seg.bg,
              underline: !!seg.underline,
              underlineColor: seg.underlineColor || seg.color || COLOR.ink,
            });
          }
        });
      });

      let cx = x;
      ensureSpace(LINE_HEIGHT + gap);
      words.forEach((w) => {
        if (w.icon) {
          if (cx + ICON_DIAMETER > x + width) {
            cx = x;
            ensureSpace(LINE_HEIGHT);
            y += LINE_HEIGHT;
          }
          drawIcon(cx, y, w.icon);
          cx += ICON_DIAMETER + spaceWidth;
          return;
        }
        doc.setFont("helvetica", w.bold ? "bold" : "normal");
        doc.setFontSize(size);
        const wWidth = doc.getTextWidth(w.text);
        if (cx + wWidth > x + width) {
          cx = x;
          ensureSpace(LINE_HEIGHT);
          y += LINE_HEIGHT;
        }
        if (w.bg) {
          doc.setFillColor(...w.bg);
          doc.rect(cx - 0.5, y - 3.7, wWidth + 1, 4.6, "F");
        }
        doc.setTextColor(...w.color);
        doc.text(w.text, cx, y);
        if (w.underline) {
          doc.setDrawColor(...w.underlineColor);
          doc.setLineWidth(0.35);
          doc.line(cx, y + 1, cx + wWidth, y + 1);
        }
        cx += wWidth + spaceWidth;
      });
      y += LINE_HEIGHT + gap;
    }

    // Each remark "part" (a single paragraph, or one "For blank N: ..."
    // line for fill-blank questions) gets its own page-break-safe box, so
    // a long multi-part remark can split cleanly across pages instead of
    // one giant box whose precomputed height goes stale after a mid-draw
    // page break.
    function drawRemarkPart(text) {
      const padding = 3;
      const textWidth = contentWidth - padding * 2;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const wrapped = doc.splitTextToSize(text, textWidth);
      const boxHeight = wrapped.length * 4.6 + padding * 2;
      ensureSpace(boxHeight + 2.5);
      doc.setDrawColor(...COLOR.line);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(contentX, y, contentWidth, boxHeight, 1.5, 1.5, "FD");
      // ensureSpace() above may have paged and redrawn the (bold, larger)
      // header — restore the body font before actually drawing the text,
      // otherwise these lines render bold/oversized and overflow the box.
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...COLOR.ink);
      let ty = y + padding + 2;
      wrapped.forEach((line) => {
        doc.text(line, contentX + padding, ty);
        ty += 4.6;
      });
      y += boxHeight + 2.5;
    }

    function drawRemarksBox(remark) {
      if (!showRemarks || !remark) return;
      ensureSpace(6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...COLOR.ink);
      doc.text("Remarks", contentX, y);
      y += 5;

      remark.split("\n").forEach(drawRemarkPart);
      y += 1.5;
    }

    function drawQuestionNumber(number) {
      ensureSpace(9);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...COLOR.ink);
      doc.text(`${number} )`, MARGIN.left, y);
    }

    // "results" tier: mark only the student's own selection right/wrong —
    // never reveal which option was actually correct if they got it wrong.
    // "withAnswers"/"full": always reveal the correct option too.
    // Leading icon (like the on-screen .mcq-option__tick) instead of a
    // trailing text symbol — matches the app's visual language and stays
    // grayscale-safe alongside the "Correct Answer"/"Your Answer" label.
    function drawOptions(options, selectedIndex, answered) {
      const iconGutter = ICON_DIAMETER + 3;
      const textX = contentX + iconGutter;
      const textWidth = contentWidth - iconGutter;

      options.forEach((opt, idx) => {
        const isSelected = answered && selectedIndex === idx;
        const revealCorrect = showAnswers && opt.correct;

        let tag = "";
        let bold = false;
        let color = COLOR.ink;
        let icon = null;
        if (revealCorrect) {
          tag = "  —  Correct Answer";
          bold = true;
          color = COLOR.green;
          icon = "correct";
        } else if (isSelected) {
          tag = "  —  Your Answer";
          bold = true;
          color = opt.correct ? COLOR.green : COLOR.red;
          icon = opt.correct ? "correct" : "incorrect";
        }

        const label = `${idx + 1}) ${opt.text}${tag}`;
        const lines = wrapText(label, textWidth, 10, bold ? "bold" : "normal");
        ensureSpace(lines.length * LINE_HEIGHT);
        if (icon) drawIcon(contentX, y, icon);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(10);
        doc.setTextColor(...color);
        lines.forEach((line) => {
          doc.text(line, textX, y);
          y += LINE_HEIGHT;
        });
      });
      y += 2;
    }

    // The live app embeds this question's source images inline; jsPDF
    // dedupes repeated addImage calls on identical data, so reusing the
    // same asset across all 2A-2H questions doesn't bloat the file per use.
    function drawQuestionImages(images) {
      if (!images || !images.length) return;
      const assets = typeof LEAFLET_IMAGES !== "undefined" ? LEAFLET_IMAGES : [];
      if (!assets.length) return;
      const gap = 6;
      const maxSingleWidth = 75;
      const w = Math.min((contentWidth - gap * (assets.length - 1)) / assets.length, maxSingleWidth);
      const heights = assets.map((a) => (w * a.height) / a.width);
      const rowHeight = Math.max(...heights);
      ensureSpace(rowHeight + 6);
      let cx = contentX;
      assets.forEach((a) => {
        const h = (w * a.height) / a.width;
        doc.addImage(a.dataUri, "PNG", cx, y, w, h);
        cx += w + gap;
      });
      y += rowHeight + 6;
    }

    function drawMcq(q) {
      drawQuestionNumber(q.number);
      if (q.prompt) drawParagraph(q.prompt, { size: 9, color: COLOR.inkSoft, style: "italic", gap: 2.5 });
      drawQuestionImages(q.images);
      drawParagraph(q.question, { size: 10.5, style: "bold", gap: 3 });
      drawOptions(q.options, q.selectedIndex, q.answered);
      if (!q.answered) {
        drawParagraph("The Student has not answered this question", { size: 9.5, color: COLOR.muted, style: "italic", gap: 2 });
      }
      drawRightNote(marksObtainedText(q.marksObtained));
    }

    function drawOe(q) {
      drawQuestionNumber(q.number);
      drawParagraph(q.prompt, { size: 9.5, color: COLOR.inkSoft, gap: 2.5 });
      drawParagraph(q.given, { size: 10, gap: 3 });

      const marksGivenText =
        q.marksGiven !== undefined && q.marksGiven !== null ? ` (Marks Given: ${q.marksGiven}).` : ".";
      const answerSegments = [{ text: q.starter, color: COLOR.ink, bold: false }];
      if (q.studentAnswerSegments && q.studentAnswerSegments.length) {
        q.studentAnswerSegments.forEach((seg) => {
          if (seg.type === "partial") {
            answerSegments.push({ text: seg.text, bold: true, color: COLOR.partialText, bg: COLOR.incorrectBg });
            answerSegments.push({ icon: "partial" });
          } else if (seg.type === "incorrect") {
            answerSegments.push({ text: seg.text, bold: true, color: COLOR.ink, bg: COLOR.incorrectBg });
            answerSegments.push({ icon: "incorrect" });
          } else if (seg.type === "correct") {
            answerSegments.push({ text: seg.text, bold: true, color: COLOR.ink, bg: COLOR.correctBg });
            answerSegments.push({ icon: "correct" });
          } else {
            answerSegments.push({ text: seg.text, color: COLOR.ink });
          }
        });
      } else {
        answerSegments.push({ text: "No Answer", color: COLOR.muted });
      }
      answerSegments.push({ text: marksGivenText, color: COLOR.ink });
      drawParagraph("Student Answer :", { size: 10, color: COLOR.ink, gap: 0.5 });
      drawRichWords(answerSegments, { size: 10, gap: 4 });

      if (showAnswers) {
        drawParagraph("Model answer :", { size: 10, color: COLOR.ink, gap: 0.5 });
        drawParagraph(`${q.starter} ${q.modelAnswer}`, { size: 10, style: "bold", color: COLOR.ink, gap: 4 });
      }

      drawRemarksBox(q.remark);
      drawRightNote(marksObtainedText(q.marksObtained));
    }

    function drawFillblank(q) {
      drawQuestionNumber(q.number);
      drawParagraph(q.prompt, { size: 9.5, color: COLOR.inkSoft, gap: 2.5 });
      q.passage.forEach((para) => {
        drawRichWords(fillblankSegments(para, q.blanks), { size: 9.5, gap: 3 });
      });

      if (showAnswers) {
        drawParagraph("Correct Answers", { size: 9, style: "bold", color: COLOR.inkSoft, gap: 1 });
        const keyLine = Object.entries(q.blanks)
          .map(([k, b]) => `${k}) ${b.correct}`)
          .join("   ·   ");
        drawParagraph(keyLine, { size: 9, color: COLOR.inkSoft, gap: 4 });
      }

      drawRemarksBox(q.remark);
      const total = fillblankTotal(q);
      drawRightNote(marksObtainedText(q.marksObtained !== undefined ? q.marksObtained : total));
    }

    function drawDivider() {
      y += 2;
      doc.setDrawColor(...COLOR.line);
      doc.line(MARGIN.left, y, PAGE.width - MARGIN.right, y);
      y += 7;
    }

    // ---- Page 1: header (title + logo + subject/level/student details) ----
    const firstRuleY = drawHeader(true);
    y = firstRuleY + 8;

    data.questions.forEach((q, idx) => {
      if (q.type === "mcq") drawMcq(q);
      else if (q.type === "oe") drawOe(q);
      else if (q.type === "fillblank") drawFillblank(q);
      if (idx < data.questions.length - 1) drawDivider();
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
        const doc = buildPdf(quizResult, level);
        const suffix = level === "results" ? "Results" : level === "withAnswers" ? "With-Answers" : "Full-Feedback";
        doc.save(`${quizResult.studentName.replace(/\s+/g, "-")}-${suffix}.pdf`);
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
