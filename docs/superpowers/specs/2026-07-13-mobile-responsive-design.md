# Mobile-Responsive Damage Calculator — Design

**Date:** 2026-07-13
**Status:** Approved (design), pending implementation plan
**Destination:** Upstream PR to `smogon/damage-calc` — favor minimal, additive, low-risk changes that match existing patterns and cannot regress desktop.

## Goal

Make the damage calculator usable and comfortable on phones and tablets, with full
feature parity, down to ~360px width — across all five pages (`index`, `randoms`,
`oms`, `champions`, `honkalculate`).

## Problem

The calculator body is hard-coded desktop-only:

- `html, body { min-width: 100em; }` (`src/css/main.css:316`). Root `font-size: 10pt`
  (~13.3px), so this is a **~1333px minimum width** → mobile browsers zoom out or
  scroll horizontally.
- The body is a three-column float layout with fixed `em` widths:
  **Pokémon 1 (`.poke-info`, 32em) | Field + Import (`.field-info`, 27.5em) | Pokémon 2
  (`.poke-info`, 32em)**, all `float: left`.
- `.move-result-group { min-width: 50rem }` (`src/css/main.css:508`) and dozens of
  fixed-`em` control widths (selects `14em`/`11.5em`, stat inputs, buttons).
- Only the **header nav** is currently responsive (`src/css/main.css:118-170`, using
  `max-width` breakpoints at 700/554/419/359px). The calculator body has no media queries.

This is fundamentally a layout-reflow problem: at narrow widths the three columns must
stack and the fixed widths must become fluid, without disturbing the jQuery controls
(which key off classes/IDs, not layout).

## Architecture / build facts that constrain the change

- The `<head>` — including the viewport meta and CSS `<link>`s — lives in
  **`src/shared.template.html`**. The build (`build` script → `makeCachebuster`) injects
  it into every page and **regenerates each page's `<head>` from the template**. Therefore
  the viewport meta must be edited in `src/shared.template.html` (editing individual pages'
  heads would be overwritten on the next build).
- All layout CSS is in **`src/css/main.css`**, shared by all five pages.
- Net effect: the feature is essentially a **two-file change** (`main.css` +
  `shared.template.html`), plus targeted extra rules for `honkalculate.html`.

## Chosen approach: additive mobile breakpoint layer

Append a single `/* Responsive */` section to the end of `src/css/main.css` containing
only `@media` rules. **No existing desktop CSS rule is modified; no HTML structure or JS
changes** (except the one viewport-meta line). Desktop rendering is therefore unchanged by
construction. This mirrors the pattern the header nav already uses and is the easiest form
for upstream to review and accept.

Rejected alternatives:
- **Fluid-first refactor** (flexbox + fluid base widths): cleaner long-term, but edits
  desktop rendering directly → larger diff, real regression risk, harder upstream review.
- **Mobile-first markup + CSS rewrite:** huge diff, unlikely to be accepted upstream.

## Detailed design

### 1. Viewport meta
`src/shared.template.html:6`:
`content="width=device-width"` → `content="width=device-width, initial-scale=1"`.
Required so the browser stops zooming out to fit the (now-removed) ~1333px min-width.

### 2. Breakpoints
Reuse the codebase's existing `max-width` media-query idiom. Two breakpoints:

- **`max-width: 1080px` — "stack" breakpoint.** Below the width where three columns fit:
  - Neutralize `html, body { min-width: 100em }` → `min-width: 0`.
  - Neutralize `.move-result-group { min-width: 50rem }` → `min-width: 0`.
  - Un-float and stack the three panels: `.panel { float: none; }` and the
    `.poke-info` / `.field-info` / `.poke-import` blocks become
    `width: 100%; max-width: 34em; margin: 0 auto;`. Natural DOM order already yields
    P1 → Field → Import → P2.
  - Bump undersized tap targets (`.crit-btn`, `.z-btn`, `.max-btn`, `.stellar-btn`,
    currently `height: 1em`) to a comfortable touch size (min-height/padding).

- **`max-width: 480px` — "phone" breakpoint.** Fluidize the fixed-`em` widths that would
  overflow ~360px:
  - Selects: `.info-selectors select` (14em), `.move-selector` (11.5em), and related →
    fluid (`width: 100%` / `max-width`), including the select2 containers via our own
    scoped selectors (select2 honors parent width when set to 100%).
  - Stat-table inputs and cell padding tightened so the `HP | Base | IVs | EVs | total`
    row fits ~360px without horizontal scroll.
  - `.move-result-subgroup { width: 50% }` → stack (`width: 100%`).
  - Import textareas `.import-team-text` (`min-width: 27rem`) and `.import-name-text`
    (`min-width: 26.3rem`) → fluid (`min-width: 0; width: 100%`).

The exact breakpoint pixel values may be nudged slightly during implementation based on
where the layout actually breaks; 1080/480 are the starting targets.

### 3. Stat table (tightest spot at 360px)
The `.poke-info` table (`label | Base | IVs | EVs | total`) is the densest element. At the
phone breakpoint, reduce input widths and cell padding so the row fits within ~360px. No
markup change — tighten widths only. This is the primary spot to verify pixel-by-pixel.

### 4. honkalculate.html (structural outlier)
Unlike the other four near-identical pages, `honkalculate.html` is a multi-Pokémon grid:
~11 panels inside a `.flex-parent` (`display: flex`). It gets its own media-query rules to
allow the flex row to wrap (`flex-wrap: wrap`) and stack panels at narrow widths. Handled
as a distinct implementation sub-task.

### 5. Vendor CSS (select2, Bootstrap)
Not edited. Fixed widths coming from vendor components are overridden via our own scoped
selectors inside the media queries. Keeping vendor files untouched keeps the diff clean and
review-friendly.

### 6. Dark theme
`dark-theme.css` is color-only and layout-agnostic; no responsive changes expected. Verify
both themes at mobile widths, but do not anticipate edits.

## Verification

Manual check at **360 / 414 / 768 / 1080px and full desktop**, on **each of the five
pages**, for:

1. No horizontal scroll / overflow.
2. Panels stacked, readable, and in a sensible order.
3. Controls (selects, buttons, tiny toggles) are tappable.
4. **Desktop is visually identical** to before (regression guard).
5. Calc still updates on input (functional guard — JS keys off classes/IDs, so this should
   be unaffected, but confirm).
6. Both light and dark themes.

Run `npm run build` (or `npm run build-ui`) to confirm the template/build still succeeds and
`npm run lint` for the eslint pass.

## Out of scope (YAGNI)

- Hamburger menus or any JS-driven responsive behavior.
- Redesign, restyling, or new visual language.
- Collapsing/accordion sections.
- Any change to calc logic or the `@smogon/calc` package.
- Editing vendor CSS files.
