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
- [x] 01b — Notion, existing IA (`01b-notion-same-ia.html`)
- [x] 02b — Stripe, existing IA (`02b-stripe-same-ia.html`)
- [x] 03b — Apple, existing IA (`03b-apple-same-ia.html`)
- [x] 05b — OpenAI, existing IA (`05b-openai-same-ia.html`)
- [x] 04b — Vercel, existing IA (`04b-vercel-same-ia.html`)
- [x] 06b — Anthropic, existing IA (`06b-anthropic-same-ia.html`)
- [x] 07b — ElevenLabs, existing IA (`07b-elevenlabs-same-ia.html`)
- [x] 08b — Cohere, existing IA (`08b-cohere-same-ia.html`)
- [x] Review index linking all options (`index.html`)

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

## Same-IA reskins (all eight)

A stricter comparison requested after the Discord thread: keep the live dashboard's information
architecture exactly, change only the design tokens.

Held constant across all eight files (verified programmatically — identical element skeleton and
identical visible copy, 1590 chars):

- Section order: hero band → Get started → What happens next + Your progress (2-col) → Learning Hub
- Nav order matches live: Dashboard, Courses, Assessments, CBL, Performance, PALS
- Copy is the live page verbatim, including the empty-state numbers (0/0, 1 Day, 0/1) and the
  italic unlock notes
- Learning Hub stays a 2-column grid of six cards with Explore
- Floating Jen bar retained

Only deviation: the live hero has a stock photograph on the right. Each option fills that slot
with its own system's decoration instead (Notion sticky-note dots, Stripe gradient mesh, Apple
nothing at all). Confirmed acceptable — the photo is not needed.

03b through 08b were all generated from the 02b body so structure and copy could not drift.
Parity re-verified after every generation run: all eight share the same 25-block skeleton and
the same 1,590-character copy. Static validation passes on all eight (CSS variables resolve,
tags balance, one style block, logo data URI and Phosphor icons present).

### Visual verification status

All eight rendered and checked at 1440px. Confirmed per file:

| File | Confirmed |
|---|---|
| 01b Notion    | pastel tints, navy band, sticky-note dots |
| 02b Stripe    | gradient mesh, weight 300, tabular figures |
| 03b Apple     | near-black tile, hairline cards, no shadow |
| 04b Vercel    | Geist + Geist Mono live, mesh gradient, mono notes |
| 05b OpenAI    | 5px radius, box-shadow: none, quiet grey band |
| 06b Anthropic | cream #faf9f5 canvas, #141413 hero, hard rules |
| 07b ElevenLabs| serif at weight 300, 4 pastel orbs |
| 08b Cohere    | mono h1 / grotesque h2 split, #003c33 hero |

Every file: 24 Phosphor icons, zero unresolved glyphs, logo data URI loads.

### Resolved

- Help treatment aligned across all eight (plain nav text link). 01b previously used a ghost
  button with an icon, left over from being hand-written before the generator existed.
- The design the boss reviewed is the live dashboard itself, not a separate file. No missing
  reference to chase.
- The hero stock photograph is not required. Each option fills that slot with its own system's
  decoration, and that is accepted.
