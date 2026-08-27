# ATLAS Learner Dashboard — Redesign Options

Redesign of `demo.atlaslearn.ai/dashboard` using design systems from designmd.co.
Static HTML, desktop-first, self-contained, dummy data (returning-learner state).

## Options

- [x] 01 — Notion (`01-notion.html`)
- [x] 02 — Stripe (`02-stripe.html`)
- [x] 03 — Apple (`03-apple.html`)
- [x] 04 — Vercel (`04-vercel.html`)
- [x] 05 — OpenAI (`05-openai.html`)
- [x] 06 — Anthropic (`06-anthropic.html`)
- [x] 07 — ElevenLabs (`07-elevenlabs.html`)
- [x] 08 — Cohere (`08-cohere.html`)
- [x] Review index linking all eight (`index.html`)

## Decisions

- Scope: dashboard page only (not PALS/CBL/quiz screens)
- Each brand restructures the IA freely; content inventory stays identical
- PALS / CBL labels kept as-is; plain-language subtitle added underneath
- Agentic entry point out of scope for now (Jen AI shown as existing feature only)
- Desktop-first; responsive pass comes after an option is approved
- Source DESIGN.md pulled from designmd.co page payload (no MCP needed)

## Open

- [ ] Confirm populated (returning-learner) state vs the live empty state
- [ ] Get the previous design that the boss reviewed, to avoid repeating it
- [ ] Responsive pass on the approved option

## Notes per option

- Notion / Stripe / Vercel / Apple are curated DESIGN.md entries — full token sets, component specs, do's and don'ts.
- OpenAI and Anthropic are *measured extractions* on designmd.co, not curated systems. OpenAI gives 4 colours / 3 type roles / one 5px radius / no shadows. Anthropic gives 2 colours / one 58px display tier / 3 radii. Both options are built faithfully to that; the restraint is the source, not a shortcut.
- Anthropic deviation: extraction records body at 12px (its caption scale). Used 12px for labels, 16px for reading body.
- Fonts: Sohne, SF Pro, Notion Sans and Anthropic Sans are proprietary. Substitutes used are the ones each DESIGN.md names (Inter for Sohne/Notion Sans; system stack for SF Pro; Arial stack for Anthropic Sans). Geist + Geist Mono are open source and load directly.

## Icons

All 74 icons across the six options use [Phosphor](https://phosphoricons.com/), loaded from the
official web package on unpkg:

- Options 01, 03, 04, 05, 06, 08 -> `regular` weight
- Options 02 (Stripe) and 07 (ElevenLabs) -> `light` weight, because both render display type at 300

Icons are font glyphs, so they inherit `color` and are sized with `font-size`. Per-icon brand
colours in option 01 moved from hardcoded SVG strokes into CSS rules on the card modifiers.

The only remaining inline SVG is the decorative mesh in `01-notion.html` - that is artwork,
not an icon.

Tradeoff: icons now require a network connection (as the Google Fonts links already did). If an
offline build is needed, the Phosphor SVGs can be inlined instead.

## Logo

All eight options use the real ATLAS lockup from
`demo.atlaslearn.ai/assets/atlas-branch-logo-B7aM78TE.png`. It replaces both the placeholder
Phosphor mark and the text wordmark, since the file is a full lockup (mark + ATLAS + By HeyHi).

- Source is 1920x624 / 79KB, far larger than needed for a ~30px render. Downscaled to 295x96
  (14.6KB), which is 3x the largest rendered height, so it stays sharp on retina.
- Embedded as a base64 data URI in every file, not a relative path. Each option stays a single
  self-contained file that survives being emailed or moved on its own. Cost is ~19KB per file.
- `atlas-logo.png` is kept in this folder as the source asset.
- Option 03 (Apple) reverses the logo to white (`filter: brightness(0) invert(1)`) because its
  global nav is true black and the supplied wordmark is black. This flattens the mark's orange,
  amber and teal to white. Replace with an official reversed lockup when one exists.
