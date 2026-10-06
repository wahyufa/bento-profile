# ATLAS course experience

## Student option C: Fieldnotes

Open `atlas-course-option-c.html` for an editorial alternative: a horizontal four-lesson path, large typography, interactive owned/paid/earned circles, a concept explorer, a worked-example sequence, inline practice, and reflection. The full outline opens in a modal side drawer. Jen remains available in a floating button. Original options A and B are preserved.

Source: `option-c.html`, `option-c.css`, and `option-c.js`, using the shared sample lesson interactions in `app.js`. Run `python package-options.py` to rebuild the standalone B/C files. This variant adapts the article's copy and structure for exploration; it is not a full content migration. Notes and answers remain in memory only. All four format paths, diagram selection, correct/incorrect practice feedback, drawer navigation, and mobile width were checked in the browser.

## Student option B

Open `atlas-course-option-b.html` for the higher-contrast student design. The original `atlas-course.html` remains unchanged. Option B uses a navy course outline, darker reading text, stronger headings and borders, a white reading panel, distinct comparison-column backgrounds, dark quote panels, and a more prominent blue Jen card. A View A link in the desktop header opens the original.

Editable source: `option-b.html`, shared `style.css` / `app.js`, and the additional `option-b.css`. The standalone HTML embeds its styles, logic, and logo. Guided reading, scenario presentation, and phone-width quiz layout were checked in the browser; no console errors or horizontal overflow were observed. This is a visual alternative with the same local sample interactions.

## Course studio companion

The article editor now uses a Notion-style document canvas (`document-editor.js` / `document-editor.css`). Edit text inline, type `/` to search and insert blocks, or use the visible 2-column / 3-column buttons. Each column or callout has an icon picker with PNG, JPG, WebP, and SVG upload (2 MB maximum, normalized to a 128px PNG before saving). Quotes, example callouts with sequences, takeaway callouts, reflections, and dividers are supported. Six-dot handles support drag reordering and an action menu; keyboard-accessible move controls are available in that menu. Draft migration preserves existing lessons and adds the demonstration quote to the original sample article once. Columns collapse on narrow screens.

Verified: inline edits update the preview, two/three-column switching, local image upload, slash-menu insertion, structural undo, save/reload, and review checks. The editor is a focused local prototype, not a complete rich-text editor; slash insertion adds a block after the current block. Uploaded icons and edits save in browser storage with Save draft. A JSON download remains available.

Open `admin.html` for the course creation prototype. It includes article blocks with reorder, duplicate, remove and undo; video URL/transcript/takeaway fields; scenario worksheet fields; quiz questions, answer keys and explanations; course settings; live learner previews; review checks; browser-local draft saving and JSON export. This is a proposed admin design, not a reproduction of the existing ATLAS admin. It does not publish or update the separate learner prototype. Video previews in the admin are placeholders.

Authoring interactions, live preview updates for all four formats, course review, and saving/reloading the sample draft were checked in the in-app browser. No browser console errors were observed.

Local HTML, CSS, and JavaScript design prototype based on the Digital Marketing Strategy course. No build tools or live ATLAS connection.

Open `atlas-course.html` directly, or serve the folder:

```powershell
python -m http.server 4174 --bind 127.0.0.1 --directory D:\Codex\atlas-course
```

Four interactive lessons are available in the outline:

- Article: comparison, full or step-by-step reading, definitions, knowledge check, and reflection.
- Video: original embedded course video, organized transcript, takeaways, and notes.
- Scenario: persona examples, four-field worksheet, completeness feedback, and text download.
- Quiz: four adapted practice questions, review, score, explanations, and retry.

Ask Jen uses clearly labeled sample responses. Notes, bookmarks, answers, and progress are kept in memory while the page is open; reloading resets them. Other course lessons are disabled placeholders. Fonts and YouTube playback require internet access. The live ATLAS course and dashboard are unchanged.

Edit `index.html`, `style.css`, and `app.js`; run `python package.py` to refresh the single-file version.

Verified in the in-app browser: desktop and 390px layouts, article reading modes and feedback, Jen responses, video playback and transcript, worksheet review, quiz answer review and scoring. JavaScript syntax checked with `node --check app.js`.

