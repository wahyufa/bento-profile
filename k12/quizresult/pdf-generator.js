// Builds a print-quality worksheet PDF straight from the live DOM of
// composition-writing-result.html — no separate data model to keep in sync.
// Uses jsPDF's vector text API (not html2canvas) so the PDF has crisp,
// selectable text and controlled page breaks, like a real printed worksheet.
//
// AI feedback for the PDF is read from the inline annotations already in
// the essay text (<mark class="annotate annotate--*" title="...">), since
// the right-hand feedback panel (.summary-slot) is hidden for this case.

(function () {
  const PAGE = { width: 210, height: 297 }; // A4 mm
  const MARGIN = { top: 22, bottom: 18, left: 16, right: 16 };
  const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
  const LINE_HEIGHT = 5.2;

  const COLOR = {
    ink: [48, 59, 73],
    inkSoft: [92, 102, 114],
    muted: [152, 162, 173],
    line: [231, 235, 239],
    amber: [217, 160, 15],
    amberBg: [255, 247, 238],
    blue: [10, 147, 212],
    blueBg: [234, 248, 255],
    red: [214, 30, 66],
    redBg: [255, 235, 238],
    purple: [110, 116, 150],
    purpleBg: [240, 241, 246],
    green: [16, 150, 118],
    greenBg: [232, 253, 246],
    neutralBg: [243, 244, 246],
  };

  const CATEGORY = {
    grammar: { label: "Grammar", fg: COLOR.amber, bg: COLOR.amberBg },
    clarity: { label: "Writing Clarity", fg: COLOR.blue, bg: COLOR.blueBg },
    spelling: { label: "Spelling", fg: COLOR.red, bg: COLOR.redBg },
    general: { label: "General Feedback", fg: COLOR.purple, bg: COLOR.purpleBg },
  };

  function normalize(text) {
    return (text || "")
      .replace(/\s+/g, " ")
      // jsPDF's base Helvetica font (WinAnsi encoding) has no glyph for →
      .replace(/→/g, "->")
      .trim();
  }

  function extractQuestion(qblock) {
    const number = qblock.dataset.q;
    const node = document.querySelector(`.qnode[data-q="${number}"]`);
    const flagged = !!(node && node.classList.contains("qnode--wrong"));

    const task = normalize(qblock.querySelector(".task-text")?.textContent);
    const wordcount = normalize(qblock.querySelector(".wordcount")?.textContent);

    const paragraphs = Array.from(qblock.querySelectorAll(".essay p")).map((p) =>
      normalize(p.textContent)
    );

    const feedback = Array.from(qblock.querySelectorAll(".essay mark.annotate")).map((mark) => {
      const catMatch = Array.from(mark.classList)
        .map((c) => c.match(/^annotate--(\w+)$/))
        .find(Boolean);
      const key = catMatch ? catMatch[1] : "general";
      return {
        key,
        quote: normalize(mark.textContent),
        comment: normalize(mark.getAttribute("title")),
      };
    });

    return { number, flagged, task, wordcount, paragraphs, feedback };
  }

  function collectData() {
    const title = normalize(document.querySelector(".topbar__title")?.textContent) || "Quiz Result";
    const statusPill = normalize(
      document.querySelector(".subbar .pill:not(.pill--info)")?.textContent
    );
    const marksPill = normalize(document.querySelector(".subbar .pill--info")?.textContent);
    const questions = Array.from(document.querySelectorAll(".qblock")).map(extractQuestion);
    return { title, statusPill, marksPill, questions };
  }

  function buildPdf(data) {
    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
    let y = MARGIN.top;

    function newPage() {
      doc.addPage();
      y = MARGIN.top;
      drawRunningHeader();
    }

    function ensureSpace(height) {
      if (y + height > PAGE.height - MARGIN.bottom) newPage();
    }

    function drawRunningHeader() {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR.muted);
      doc.text(data.title.toUpperCase(), MARGIN.left, 12);
      doc.setDrawColor(...COLOR.line);
      doc.line(MARGIN.left, 15, PAGE.width - MARGIN.right, 15);
    }

    function drawFooters() {
      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...COLOR.muted);
        doc.text(`Page ${i} of ${total}`, PAGE.width / 2, PAGE.height - 10, { align: "center" });
      }
    }

    function wrapText(text, width, size, style = "normal") {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      return doc.splitTextToSize(text, width);
    }

    function drawParagraph(text, opts = {}) {
      const { size = 10, style = "normal", color = COLOR.ink, indent = 0, gap = 3 } = opts;
      const lines = wrapText(text, CONTENT_WIDTH - indent, size, style);
      ensureSpace(lines.length * LINE_HEIGHT + gap);
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      lines.forEach((line) => {
        doc.text(line, MARGIN.left + indent, y);
        y += LINE_HEIGHT;
      });
      y += gap;
    }

    function drawBox({ lines, fill, border, textColor, label, labelColor, padding = 3.2 }) {
      const textWidth = CONTENT_WIDTH - padding * 2;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const wrapped = lines.flatMap((l) => doc.splitTextToSize(l, textWidth));
      const labelHeight = label ? 5 : 0;
      const boxHeight = labelHeight + wrapped.length * 4.6 + padding * 2;

      ensureSpace(boxHeight + 3);
      if (fill) {
        doc.setFillColor(...fill);
        doc.roundedRect(MARGIN.left, y, CONTENT_WIDTH, boxHeight, 1.5, 1.5, "F");
      }
      if (border) {
        doc.setDrawColor(...border);
        doc.roundedRect(MARGIN.left, y, CONTENT_WIDTH, boxHeight, 1.5, 1.5, "S");
      }

      let ty = y + padding + 2;
      if (label) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...(labelColor || textColor));
        doc.text(label.toUpperCase(), MARGIN.left + padding, ty);
        ty += 4.6;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...textColor);
      wrapped.forEach((line) => {
        doc.text(line, MARGIN.left + padding, ty);
        ty += 4.6;
      });

      y += boxHeight + 3;
    }

    function drawFeedbackItem(item) {
      const cat = CATEGORY[item.key] || CATEGORY.general;
      const text = `"${item.quote}" — ${item.comment}`;
      const textWidth = CONTENT_WIDTH - 10;
      const lines = wrapText(text, textWidth, 9);
      const rowHeight = lines.length * 4.4 + 4;

      ensureSpace(rowHeight);
      doc.setFillColor(...cat.fg);
      doc.circle(MARGIN.left + 2, y - 1, 1.3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...cat.fg);
      doc.text(cat.label.toUpperCase(), MARGIN.left + 6, y - 2.2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR.inkSoft);
      let ly = y + 2.2;
      lines.forEach((line) => {
        doc.text(line, MARGIN.left + 6, ly);
        ly += 4.4;
      });

      y += rowHeight + 2;
    }

    function drawQuestionHeader(q) {
      ensureSpace(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...COLOR.ink);
      doc.text(`Question ${q.number}`, MARGIN.left, y);

      const badge = q.flagged
        ? { label: "Needs Review", fg: COLOR.red, bg: COLOR.redBg }
        : { label: "Reviewed", fg: COLOR.green, bg: COLOR.greenBg };
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      const badgeTextWidth = doc.getTextWidth(badge.label);
      const badgeWidth = badgeTextWidth + 6;
      const badgeX = PAGE.width - MARGIN.right - badgeWidth;
      doc.setFillColor(...badge.bg);
      doc.roundedRect(badgeX, y - 4.6, badgeWidth, 6.4, 3, 3, "F");
      doc.setTextColor(...badge.fg);
      doc.text(badge.label, badgeX + badgeWidth / 2, y, { align: "center" });

      y += 7.5;
    }

    function drawQuestion(q) {
      drawQuestionHeader(q);

      drawBox({
        lines: [q.task],
        fill: COLOR.amberBg,
        textColor: COLOR.ink,
        label: "Writing Task",
        labelColor: COLOR.amber,
      });

      if (q.wordcount) {
        drawParagraph(`Answer  ·  ${q.wordcount}`, {
          size: 9,
          style: "bold",
          color: COLOR.inkSoft,
          gap: 2,
        });
      }

      q.paragraphs.forEach((p) => {
        drawParagraph(p, { size: 10, color: COLOR.ink, gap: 2.5 });
      });

      if (q.feedback.length) {
        y += 1;
        ensureSpace(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR.inkSoft);
        doc.text(`AI FEEDBACK (${q.feedback.length})`, MARGIN.left, y);
        y += 5;
        q.feedback.forEach(drawFeedbackItem);
      }

      y += 4;
      doc.setDrawColor(...COLOR.line);
      doc.line(MARGIN.left, y - 2, PAGE.width - MARGIN.right, y - 2);
    }

    // ---- Title block ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...COLOR.ink);
    doc.text(data.title, MARGIN.left, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR.green);
    if (data.statusPill) doc.text(data.statusPill, MARGIN.left, y);
    if (data.marksPill) doc.text(data.marksPill, PAGE.width - MARGIN.right, y, { align: "right" });
    y += 8;

    doc.setDrawColor(...COLOR.line);
    doc.line(MARGIN.left, y, PAGE.width - MARGIN.right, y);
    y += 8;

    data.questions.forEach((q) => drawQuestion(q));

    drawFooters();
    return doc;
  }

  function download() {
    const btn = document.getElementById("downloadPdfBtn");
    const label = document.getElementById("downloadPdfLabel");
    const originalLabel = label.textContent;
    btn.disabled = true;
    label.textContent = "Generating…";

    setTimeout(() => {
      try {
        const data = collectData();
        const doc = buildPdf(data);
        const fileName = `${data.title.replace(/\s+/g, "-")}-Quiz-Result.pdf`;
        doc.save(fileName);
      } finally {
        btn.disabled = false;
        label.textContent = originalLabel;
      }
    }, 30);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("downloadPdfBtn");
    if (btn) btn.addEventListener("click", download);
  });
})();
