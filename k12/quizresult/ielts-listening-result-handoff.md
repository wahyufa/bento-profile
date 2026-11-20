# Handoff: IELTS Listening result page (tutor view): layout tidy-up

**Page:** `onlinequizv2/tutor/quiz-result-ielts?tutor_id=…&attempt_id=…`
**Mockup:** `k12/quizresult/ielts-listening-result.html` (open it locally or on the bento Vercel deploy)

The mockup copies the live page's structure, fonts, colours and sizes. It opens at the tutor text size **Larger**, the same `zoom: 1.25` on `<html>` that `app.js` sets from `hh-text-size`. Add `?size=standard` or `?size=large` to the URL to compare the other text sizes.

**Scope:** layout and spacing only. No new features. The text-size zoom stays as it is. Every change below must also work at zoom 1.125 and 1.25.

Selectors are taken from the live DOM. Values are in CSS px, before zoom.

---

## 1. Sub bar (`.info-result`)

**Problem:** the CEFR and Band pills shrink to about 86px wide and break into 3 lines ("CEFR / Score: / A2"). The score pill does the same. At zoom 1.25 the whole row looks squeezed.

**Cause:**
- `.info-result` has uneven padding: `5px 70px 5px 150px`.
- The pills are flex items with the default `flex-shrink: 1`, so they shrink instead of wrapping.

**Change:**

```css
.info-result {
  padding: 14px 46px;              /* was 5px 70px 5px 150px */
  justify-content: space-between;  /* student info left, pills right (was center) */
  flex-wrap: wrap;
  gap: 12px 28px;
}

/* the d-flex that holds the .grar-legend pills */
.info-result .grar-legend .btn,
.info-result .btn-orange-line {
  flex-shrink: 0;
  white-space: nowrap;   /* "CEFR Score: A2" stays on one line */
}

/* when the pill group wraps under the student info, centre both rows */
.info-result.is-wrapped,
.info-result.is-wrapped .pills-container { justify-content: center; }
```

- Keep the **Student Name** label on two lines, as it is today. **Attempts** stays on one line.
- Group the student select and the attempts stepper in one container (left side). The pills go in a second container (right side).
- **Centre on wrap:** CSS can't detect when a flex row has wrapped, so use a small JS check:

```js
const bar = document.querySelector('.info-result');
const meta = bar.querySelector('.info-meta');   // student + attempts container
const pills = bar.querySelector('.pills');      // pills container
function updateWrap() {
  bar.classList.remove('is-wrapped');
  const wrapped = pills.getBoundingClientRect().top > meta.getBoundingClientRect().bottom - 1;
  bar.classList.toggle('is-wrapped', wrapped);
}
new ResizeObserver(updateWrap).observe(bar);
document.fonts.ready.then(updateWrap);
```

## 2. Answer blanks (`.fitb-answer-{id}`)

**Problems:**

1. The number shows twice: "1) 1) lkhlkhlkhwqe". The question content already has `<strong>1)</strong>`, and the renderer adds "1) " again inside `.fitb-answer-*`.
2. `.fitb-answer-*` is `d-inline-block`. When it doesn't fit on the line it jumps to the next one as a block, leaving "1)" alone at the end of the line above.
3. The marks dropdown button (`.dropdown-mark .btn`) is 40px tall: 8px padding plus 22.5px line height. The text line is 30px (`.ques-body` 18px / 30px), so every line with a dropdown gets taller and the rhythm becomes uneven.
4. An empty student answer is rendered as five `&nbsp;`, which reads as a random gap.

**Change:**

```css
/* 2. flow with the sentence instead of jumping as a block */
.ques-body [class*="fitb-answer-"] { display: inline !important; }  /* remove d-inline-block */

/* keep "(Marks Given: [x])" together */
.fitb-marks { white-space: nowrap; }

/* 3. dropdown fits inside one 30px line */
.dropdown-mark .btn {
  height: 28px;
  padding: 0 8px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  vertical-align: 1px;
}

/* 4. empty answer = short underline slot */
.fitb-blank {
  display: inline-block;
  width: 48px;
  border-bottom: 2px solid currentColor;
  vertical-align: -3px;
  margin: 0 2px;
}
```

**Renderer changes:**

- Drop the `"{n}) "` prefix inside `.fitb-answer-*`. The bold number from the question content stays.
- Wrap `(Marks Given: <dropdown>)` in `<span class="fitb-marks">`.
- When the student answer is empty, output `<span class="fitb-blank"></span>` instead of `&nbsp;` × 5.

Target markup (simplified):

```html
<strong>3)</strong>
<div class="fitb-answer-816793 fitb-wrong">
  <span class="fitb-blank"></span> (trees)
  <span class="fitb-marks">(Marks Given: <div class="dropdown dropdown-mark">…</div>)</span>
</div>
```

Colours stay as they are today: `.fitb-correct` #16d8a7, `.fitb-wrong` #ff1744, `.fitb-pending-marking` #616161. The AI icon stays inside the dropdown button.

## 3. Column split (`.question__content .row`)

The left column only holds "PART 1" and the audio player, but it takes half the width. That squeezes the questions.

- Change `.col-lg-6` / `.col-lg-6` to `.col-lg-4` / `.col-lg-8`.
- There is a stray `<br>` between the two columns in the markup. It can be removed.

Below `lg`, the columns stack as before.

## 4. Group Results button

No change. The live behaviour is kept:
- **lg and up:** the button sits at the right end of the tab bar.
- **Below lg:** it sits above the tab bar, right-aligned, with rounded top corners.

## 5. Header on scroll: compact bar

**Problem:** `.container-fluid.menu-pos-fix` (header + sub bar) is `position: sticky; top: 0`. It is about 165px tall, or about 206px on screen at zoom 1.25. With the section bar at the bottom, roughly 30% of a 900px-tall laptop screen is always taken. That leaves little room for the questions.

**Change:**

1. Make `.menu-pos-fix` **not** sticky (`position: static`). Header and sub bar scroll away normally.
2. Add a **fixed** slim bar, 54px tall, same amber background as the header. It slides in once `.info-result` has scrolled above the viewport, and slides out when scrolling back up. Because it is fixed and not sticky, showing or hiding it never shifts the content.
3. Content, left to right: quiz title (ellipsis), student name, CEFR, Band, score `8/40 (20%)`, Exit.
   - Below `lg`, hide CEFR and Band.
   - **Bind the student name and score to the same data as the sub bar pills**, so the score updates when a mark is changed. In the mockup they are static text.

```css
.compact-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 40;
  height: 54px; padding: 0 46px;
  display: flex; align-items: center; gap: 16px;
  background: #fec53c url(/images/bg-smartjen.png) repeat;
  box-shadow: 0 2px 12px rgba(18, 38, 63, .12);
  transform: translateY(-100%);
  transition: transform .2s ease;
}
.compact-bar.is-visible { transform: none; }
.compact-chip {
  height: 30px; padding: 0 12px; border-radius: 12px; background: #fff;
  font: 700 14px Montserrat, sans-serif; white-space: nowrap;
  display: inline-flex; align-items: center;
}
```

```js
new IntersectionObserver(([entry]) => {
  const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
  compactBar.classList.toggle('is-visible', scrolledPast);
}).observe(document.querySelector('.info-result'));
```

For comparison, the mockup also has `?header=simple`: only the yellow header stays sticky, and the sub bar scrolls away. **The compact bar is the chosen option.**

---

## Not layout, but please check

- **Status mismatch:** the sub bar says "All Questions Marked", but the card says "Marks obtained : Pending Marking".
- **Blank answers with marks:** on attempt 840087, Q2 and Q5–Q10 have no student answer but get 0.5 or 1 and show as correct (green). This may just be test data.
- **Secret in page source:** the config object that is printed inline in the page includes a `heyhi_secret_key` value. Every logged-in user can read it. Please move it server-side and rotate the key.

## How to check

Open the mockup and the live page at the same window width. Test at text size Standard, Large and Larger (zoom 1, 1.125, 1.25). At each size, check that:

- every pill stays on one line
- the sub bar centres itself when it wraps
- no answer number is shown twice
- lines with a marks dropdown are the same height as other lines
- the compact bar appears after scrolling past the sub bar
