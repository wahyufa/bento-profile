# essay-result.html — Mobile & Responsive Check

- **Date:** 14 Sep 2026
- **Scope:** Responsive/mobile behaviour only. No visual redesign — every fix below keeps the current look.
- **How:** Loaded the page in Chromium at 9 viewport sizes and measured the layout with `getBoundingClientRect()`. Fixes 1–4 were injected in the browser and re-measured. Your files were not modified.
- **Note:** Real phones will be slightly worse than these numbers. The page never scrolls today, so Safari/Chrome keep their address bar expanded.
- *Compact* = your existing ≤900px layout (question strip on top, feedback as a bottom sheet, bottom tab bar).

## Status — fixes applied in v2 (14 Sep 2026)

**New files:** `essay-result-v2.html`, `essay-render-v2.js`, `essay-pdf-generator-v2.js`. The original files are unchanged; `essay-data.js` and `heyhi-logo.js` are shared by both versions. The desktop layout (≥1280px) looks and behaves the same as before.

| # | Status |
|---|---|
| 1–4 | ✅ Applied and verified (numbers below) |
| 5 | ✅ Applied. The label is visually hidden instead of using `aria-label`, so "Generating…" is announced too. Button size is unchanged. |
| 6, 15 | ✅ Applied and verified in headless Chrome: scrolling to Question 2 moves the strip, and Rubrics opens Question 2. "Summary" no longer looks active while the sheet is closed. |
| 7 | ✅ Applied: tap outside closes the sheet, Esc closes it (after first closing the download menu if it's open), and `dvh` is used. The invisible grab handle has been removed, so the sheet now starts straight at the slate header. |
| 8 | ✅ Applied at every size: tapping or clicking a highlight opens its card, expanded and scrolled into view. |
| 9 | ✅ Applied: question cards are capped at 680px on tablets. |
| 10 | ✅ Applied and verified: CSS keeps the sheet hidden until it's opened; going from 1100px to 390px closes it, and going back docks the panel again. |
| 11 | ✅ Applied to Download, Exit, the question dots and ×. Filter chips were left alone (they sit 5px apart, so bigger hit areas would overlap), and "Question Statistics" has no action yet. |
| 12, 14 | ⏸ Not applied — visual changes, your call. |
| 13 | ✅ Applied. At 360px the sheet title now truncates ("Question 1 - Good Po…") instead of touching the ×. |
| 16, 17 | ✅ Applied. #17 (notch / home indicator) still needs a check on a real iPhone — it can't be emulated. |

**Before → v2 (measured):**

| Viewport | Before | v2 |
|---|---|---|
| 1440 × 900 | Essay text 692px | Unchanged |
| 1100 × 800 | Essay text ~352px *(calc)* | 464px |
| 1024 × 768 | Essay text 276px + sideways scroll | 648px, no sideways scroll |
| 768 × 1024 | Lines 712px long | 648px |
| 390 × 844 | Reading area 582px | 734px |
| 844 × 390 | Reading area 136px | 273px |
| 360 × 800 | Download menu starts at −12px | Starts at 12px |

No console errors at any size.

### Update — student bar and question list (14 Sep 2026)

These changes were requested after the first v2 pass, and only affect `essay-result-v2.html`.

- **Question list (≤1024px):** the horizontal question strip is gone. A blue "Show question list" link at the top of the essay column opens a numbered column on the left, which stays pinned while you scroll. The question cards narrow to make room (at 375px: card 351px → 295px). Desktop keeps the always-visible rail.
- **Student bar:** the name is a dropdown for switching students, and Attempts has ‹ › chevrons for switching attempts (disabled at the first and last attempt). Both work at every screen size.
- **Pills (≤1024px):** they now read "Marked" and "Score: 33%", so they share one row. Desktop keeps the full labels.
- **Sample data:** `essay-students-data.js` adds 4 sample students, and Samantha now has 2 attempts. All of them reuse Samantha's essay and feedback; only the name, attempt, status and score change. The PDF follows whichever student and attempt is selected.
- **Measured at 375px:** the student bar went from 135px to 100px, and the first question card now starts at 194px (was 248px). There's no horizontal overflow at 360, 375, 768 or 1440px, and no console errors. Question tracking still works after switching student or attempt (checked in headless Chrome).

## Summary (original essay-result.html)

- ❌ **Tablet & small laptop (901–1279px)** — broken. Essay text is 276px wide at 1024px, 172px at 920px, and the column scrolls sideways.
- ❌ **Landscape phones & iPhone SE** — fixed bars take 65% / 45% of the screen height.
- ❌ **360px Android** — the Download PDF menu is cut off past the left edge.
- ⚠️ **Phones 390px+** — usable, but fixed bars take 31% of the height, tap targets are small, and the feedback sheet has a few bugs.
- ✅ **1280px and up** — fine.

## Test results

| Viewport | Device | Layout | Measured | Result |
|---|---|---|---|---|
| 1440 × 900 | Laptop | Desktop | Essay text 692px wide *(calc)* | ✅ |
| 1280 × 800 | Laptop | Desktop | Essay text 532px wide *(calc)* | ✅ |
| 1024 × 768 | iPad landscape | Desktop | Essay text **276px** wide · tabs cut off · column scrolls sideways | ❌ |
| 920 × 800 | Small window | Desktop | Essay text **172px** wide · 4 of 5 tabs cut off | ❌ |
| 768 × 1024 | iPad portrait | Compact | Lines 712px long (~80+ characters) · fixed bars 25% | ⚠️ |
| 390 × 844 | iPhone 12–15 | Compact | Reading area 582px · fixed bars **31%** | ⚠️ |
| 375 × 667 | iPhone SE | Compact | Reading area 369px · fixed bars **45%** (student bar wraps to 135px) | ❌ |
| 360 × 800 | Android | Compact | Download menu starts at **−12px** | ❌ |
| 844 × 390 | Phone landscape | Compact | Reading area **136px** · fixed bars **65%** | ❌ |

*calc* — desktop essay width = viewport − 748px (question rail 72 + panel 456 + view rail 88 + margins 16 + paddings 116). This matches the 1024px and 920px measurements exactly.

---

## High

### 1. Essay column collapses between 901px and 1279px

**Evidence:** At 1024px the essay text is 276px wide — narrower than on a 390px phone (334px). At 920px it is 172px. The desktop layout keeps 632px for the two rails and the panel at every width.

**Fix:**

```css
/* a) Use the compact layout up to 1024px (covers iPad landscape) */
@media (max-width: 1024px) { /* was: max-width: 900px */ }

/* b) Slimmer side columns for 1025–1279px */
@media (min-width: 1025px) and (max-width: 1279px) {
  .panel-slot { flex-basis: 360px; }
  .panel-rail { flex-basis: 72px; }
  .rnav { width: 72px; }
}
```

Also change `isCompactLayout()` in `essay-render.js` to `(max-width: 1024px)` so JS matches the CSS.

**Verified:** essay text 389px at 1025px (was ~277px) and 464px at 1100px (was ~352px). Rail labels still fit.

**Where:** `essay-result.html:236` (`.panel-slot`), `:373` (`.panel-rail`), `:399` (breakpoint) · `essay-render.js:228`

### 2. Tab row overflows and the essay column scrolls sideways (above 900px)

**Evidence:** At 1024px the 5 tabs need 593px but get 344px. Notes, Video and Correction are cut off, and `.main` scrolls horizontally (617px of content in 392px) with its scrollbar hidden.

**Fix:** Move the phone-only rule out of the media query so it applies at every width:

```css
.tabs { overflow-x: auto; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab { flex: 0 0 auto; }
```

**Verified:** no sideways scroll at 1025px or 1100px; the tabs scroll inside their own row.

**Where:** `essay-result.html:166–175` · phone-only version at `:425–427`

### 3. Fixed bars leave too little room to read on phones

**Evidence:** The top bar, student bar, question strip and bottom bar never leave the screen:

| Viewport | Fixed bars | Reading area |
|---|---|---|
| 390 × 844 | 262px (31%) | 582px |
| 375 × 667 | 298px (45%) | 369px |
| 844 × 390 | 254px (65%) | 136px (~4 lines of essay) |

**Cause:** `html, body { height: 100% }` + `body { overflow: hidden }` — only the inner `.main` pane scrolls. Nothing can scroll out of the way, and mobile browsers only hide their address bar when the page itself scrolls.

**Fix (same look — only the scrolling changes):** On the compact layout, let the page scroll. The top bar stays sticky, the student bar and question strip scroll away, and the bottom bar stays fixed.

```css
@media (max-width: 1024px) {
  html, body { height: auto; }
  body { display: block; overflow: visible; }
  .topbar { position: sticky; top: 0; z-index: 100; }
  .stage { display: block; }
  .main { overflow: visible; }
  /* Question-strip jumps land below the sticky top bar */
  .qblock { scroll-margin-top: 60px; }
}
```

**Verified:**
- 390×844: reading area 734px, fixed bars 13%.
- 844×390: reading area 273px, fixed bars 30%.
- Jumping to Question 2 lands below the top bar, and the feedback sheet still opens correctly. No sideways scroll.

**Where:** `essay-result.html:53–61`, `:399–478`

### 4. Download PDF menu is cut off on 360px phones

**Evidence:** The 290px menu is right-aligned to the button (right edge at 278px), so it starts at −12px.

**Fix:** In `openMenu()`, replace the positioning lines so the menu is clamped inside the screen:

```js
list.hidden = false; // show first so its width can be measured
const rect = btn.getBoundingClientRect();
list.style.top = `${rect.bottom + 8}px`;
list.style.left = `${Math.max(12, rect.right - list.offsetWidth)}px`;
list.style.right = "auto";
```

**Verified:** at 360px the menu now spans 12px → 302px.

**Where:** `essay-pdf-generator.js:633–638`

---

## Medium

### 5. Download button has no accessible name on phones

At ≤600px the label is `display: none` and the button has no `aria-label`, so screen readers announce just "button". The measured accessible name was empty.

**Fix:** Add `aria-label="Download PDF"` to `#downloadPdfBtn`.

**Where:** `essay-result.html:498`, `:527`

### 6. Bottom bar opens the wrong question

The Summary / Rubrics / Good Points bar always opens `activeQuestion`, which only changes when you tap "See Result" and starts at Question 1. So if you scroll to Question 2 and tap Rubrics, you get Question 1's rubrics. "Summary" also looks active on load while the sheet is closed.

**Fix:** Update `activeQuestion` from the question on screen (`IntersectionObserver` on `.qblock`). Only show the active state while the sheet is open.

**Where:** `essay-render.js:222`, `:242–244`, `:343–355`

### 7. Feedback sheet is hard to dismiss

Only the 30×30px × closes it — tapping outside or pressing Esc does nothing. The grab handle can't be dragged, and it's actually invisible: it's drawn in 45% white on the white panel, above the slate header, so all you see is a thin white strip. The height uses `72vh` / `78vh`, which ignores the mobile address bar, so on small phones the sheet can reach the top edge.

**Fix:**
- Close the sheet on tap outside and on Esc.
- Add a `dvh` line after each `vh` line: `height: 72vh; height: 72dvh;`
- Handle: make it visible and drag-to-close, or remove it (your call).

**Where:** `essay-result.html:436–456`, `:516` · `essay-render.js:357–359`

### 8. Tapping a highlight does nothing on touch

Each highlight's feedback is in a `title` tooltip, and phones never show those. Users have to open the sheet and match the numbers by hand.

**Fix (behaviour only):** Tapping a highlight opens the sheet on Summary, then expands and scrolls to the card with the same `data-anno`.

**Where:** `essay-render.js:33–35`, `:112`

### 9. Very long lines on tablets

At 768px the essay stretches to 712px (~80+ characters per line; ~45–75 reads best). After fix 1, 1024px would reach ~968px.

**Fix:**

```css
@media (min-width: 601px) and (max-width: 1024px) {
  .qblock { width: 100%; max-width: 680px; margin-inline: auto; }
}
```

**Where:** `essay-result.html:399`

### 10. Sheet can flash open on load, and rotation isn't handled

*(Found by reading the code, not seen in testing.)* The panel is open in the HTML and only gets closed by JS after every script loads, including jsPDF from a CDN. On slow connections, phones can briefly show an empty sheet. The compact check also runs only once, so rotating a tablet across the breakpoint can leave the sheet open over the essay.

**Fix:**
- Start with the sheet closed in the markup on compact screens, so it's closed before the first paint.
- Listen for `matchMedia("(max-width: 1024px)").addEventListener("change", …)`.

**Where:** `essay-result.html:583` · `essay-render.js:228`, `:345`

---

## Low

| # | Issue | Evidence | Fix | Where |
|---|---|---|---|---|
| 11 | Tap targets under 44×44px | Download 54×29 · Exit 62×30 · question dots 32×32 · sheet × 30×30 · filter chips 30px tall · "Question Statistics" 21px tall (a `<span>`, not focusable) | Invisible hit area, same visual size (snippet below) | `:492–495`, `:415–419`, `:457`, `:518` · `essay-render.js:56` |
| 12 | Hidden tabs have no hint | At 390px "Correction" is off-screen and the scrollbar is hidden | Optional edge fade: `mask-image: linear-gradient(to right, #000 85%, transparent)` | `:425` |
| 13 | Sheet title touches the × | At 360px "Question 1 - Good Points" ends 1px before the ×; longer titles will overlap | `.panel__head { padding-right: 48px }` + ellipsis on `.panel__context` | `:243–257` |
| 14 | Rubric labels cramped | At 360px "Grammatical Range & Accuracy" wraps to 3 lines (108px column) | ≤600px: put the label on its own line above the bar | `:347–351`, `:519` |
| 15 | Question strip ignores scrolling | The active dot changes only on click (all sizes) | Same `IntersectionObserver` as #6 | `essay-render.js:304–310` |
| 16 | Hover sticks after a tap | `.qnode:hover` scale, `.btn-download:hover` lift | Wrap in `@media (hover: hover)` | `:90`, `:156` |
| 17 | No safe-area padding | Once the page scrolls (fix 3), the fixed bottom bar can sit on the iPhone home indicator | `viewport-fit=cover` + `padding-bottom: env(safe-area-inset-bottom)` on `.panel-rail`; confirm on a real iPhone | `:5`, `:461–474` |

Snippet for #11:

```css
/* Bigger touch area without changing how the buttons look */
@media (pointer: coarse) {
  .btn-download, .qnode { position: relative; } /* .btn-exit and .panel__close are already positioned */
  .btn-download::after, .btn-exit::after { content: ""; position: absolute; inset: -8px -4px; }
  .qnode::after { content: ""; position: absolute; inset: -6px; }
  .panel__close::after { content: ""; position: absolute; inset: -7px; }
}
```

---

## Not changed — your design call

Some text is small on phones:
- highlight numbers: 9.3px
- student-bar labels: 10px
- bottom-bar labels: 10px
- score pill: 11.5px
- filter chips: 11.5px
- feedback text: 13px

These are flagged only. 11–12px is a common minimum for labels on mobile.

## Outside responsive scope (noted only)

jsPDF (from CDN), the PDF generator and the 24KB logo script all load before the page draws its content, because rendering waits for `DOMContentLoaded`. On mobile data this delays the first view. They could load on the first Download tap instead.

## Suggested fix order

1. **Quick fixes (CSS/JS, no layout change):** 2, 4, 5, 11, 13, 16, plus the `dvh` part of 7
2. **Breakpoints:** 1, 9
3. **Phone scrolling:** 3, 17
4. **Behaviour:** 6, 7, 8, 10, 15
5. **Optional:** 12, 14

Files touched: `essay-result.html`, `essay-render.js`, and `essay-pdf-generator.js` (only for #4).
