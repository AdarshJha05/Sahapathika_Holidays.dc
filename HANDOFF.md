> **How to use this file:** paste it into Claude Code as the build prompt, in the same
> session as `Sahapathika Holidays.dc.html`. Read that file first — it is the approved
> design. This document tells you how to port it, what is real content, and what must not
> be invented. Build order is in §14.

# Sahapathika Holidays — Claude Code Handover

Paste this whole file into Claude Code as the build prompt, together with the two design files
listed under **Source of truth**.

---

## 0. What exists today

An approved, interactive HTML design prototype of five pages. It is a **single-file React
design component** — not the production stack. Your job is to port it to Next.js faithfully.

**Source of truth (read these first, in this order):**

| File | What it is |
|---|---|
| `Sahapathika Holidays.dc.html` | The entire approved design: markup (inline styles) + a logic class holding all state, data and interaction behaviour. Both live in this one file. |
| `image-slot.js` | Runtime helper for the design's drag-and-drop photo placeholders. **Do not port this** — replace every `<image-slot>` with `next/image`. |
| `HANDOFF.md` | This file. |

Read `Sahapathika Holidays.dc.html` top to bottom before writing code. Everything below is a
map of it, not a substitute for it.

---

## 1. Target stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 with a custom theme (tokens in §3) — no default palette
- Framer Motion for all UI motion; GSAP + ScrollTrigger only for the SVG line-draw strokes
- shadcn/ui primitives (Dialog, Accordion, Tabs, Sheet, Calendar) restyled to the tokens
- Embla Carousel for the featured-package rail and testimonials
- `react-day-picker` for the date pickers
- `lucide-react` for UI icons; keep the design's hand-drawn SVGs as components (§6)
- Deploy: Vercel. `next/image` everywhere, `<video>` with poster fallback,
  `prefers-reduced-motion` respected globally.

---

## 2. Routes to build

| Route | Ported from | Status in prototype |
|---|---|---|
| `/` | `isHome` branch | Complete — all 14 sections |
| `/my-packages` | `isPackages` branch | Complete — filters, sort, empty state |
| `/packages/[slug]` | `isDetail` branch | Complete; Ayurveda Retreat fully populated, others fall back to a TBC block |
| `/about-us` | `isAbout` branch | Complete |
| `/contact-us` | `isContact` branch | Complete |
| `/customize-package` | — | **Not designed yet.** Multi-step: destinations → dates → group size → budget → interests |
| `/destinations/[region]` | Destinations mega-menu | Menu is grouped Kerala / Rest of India / International; only Kerala items link to real inventory — the rest route to the enquiry form |
| `/royal-life` + `/royal-life/[slug]` | Home teaser only | Blog template not designed |
| `/offers` | — | Not designed; seed 1–2 offers flagged "Sample" |
| `/faq` | FAQ accordion on detail page | Reuse that accordion as a standalone page |
| `/404` | Empty-state illustration in `isPackages` | Reuse the line-art elephant SVG |

In the prototype these are branches of one `page` state. Split them into real routes; the
header, footer, WhatsApp FAB and lightbox belong in `app/layout.tsx`.

---

## 3. Design tokens — copy verbatim

Every colour in the prototype is one of these literals. Grep for the hex before inventing anything.

```css
@theme {
  /* Primary — coral red. The one dominant accent: every CTA, price, active nav
     state and badge. Do not reinterpret it. */
  --color-primary:       #E5483D;
  --color-primary-dark:  #C4362C;  /* hover */
  --color-primary-light: #FDE8E4;  /* tint chips, soft panels */

  /* Base — warm cream. The page is LIGHT. */
  --color-bg:      #FAF6EF;
  --color-surface: #FFFFFF;        /* cards: white, 20–24px radius, soft shadow */

  /* Dark — ONLY the header bar, the hero overlay, and the footer. Nowhere else. */
  --color-ink:      #16211D;
  --color-ink-soft: #3A4A44;       /* body copy */

  /* Secondary panels — soft mint. Mega-menu promos, refund/trust block,
     newsletter band, offer banners. */
  --color-mint:      #DCEEE7;
  --color-mint-deep: #5FA98C;
  --color-mint-ink:  #2F7A63;

  /* Gold — TINY accent only (a ribbon, a rating badge). Never dominant. */
  --color-gold:      #D9A441;
  --color-gold-deep: #B5822A;
  --color-gold-text: #8A6316;      /* TBC-flag text */

  --color-text:       #1B1A17;
  --color-text-muted: #6B655C;
  --color-on-dark:    #FAF6EF;
  --color-on-dark-hi: #FF8B80;     /* coral tint for labels on the dark header/footer */

  --color-teal:    #2E6E6A;        /* Ayurveda & Wellness category chip */
  --color-coastal: #3C6F63;        /* Beach & Coastal category chip */

  --radius-lg: 24px;
  --radius-md: 16px;
  --shadow-card:       0 12px 32px -12px rgba(22,33,29,.18);
  --shadow-card-hover: 0 28px 54px -20px rgba(22,33,29,.34);
}
```

**Palette rules that must survive the port:** the page background is cream, not dark. Dark
lives in exactly three places (header, hero overlay, footer). Coral is the single dominant
accent. Mint is for secondary panels. Gold is decoration at small sizes only. There is no
"dark green + gold" theme.

**Category → colour map** (drives every chip and dot; in the prototype it is `this.catColor`):

```ts
export const CATEGORY_COLOR = {
  'Ayurveda & Wellness': '#2E6E6A',
  'Heritage & Temple':   '#B5822A',
  'Heritage':            '#B5822A',
  'Beach & Coastal':     '#3C6F63',
  'Hill & Backwater':    '#4E6B48',
  'Signature':           '#C4432B',
  'Honeymoon':           '#9C331F',
} as const;
```

---

## 4. Typography

- **Display:** `Fraunces` (variable; weight 300–500, `font-style: italic` for the accented
  phrase inside every H1/H2). Loaded via `next/font/google`.
- **Body / UI:** `Plus Jakarta Sans` (300–800).
- Scale as used: hero H1 `clamp(42px,5.6vw,82px)` · section H2 `clamp(32px,4vw,50px)` ·
  detail H2 `32px` · body `16.5px/1.75–1.8` · small-caps kickers `11px`, letter-spacing `.24em`,
  weight 800, colour `--color-gold-deep`.
- Every section heading follows the same pattern: plain serif text with **one italic phrase in
  `--color-primary`**. Keep it — it is the strongest signature in the design.

---

## 5. Layout & responsive approach

The prototype has **no media queries** — it is responsive purely through
`grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr))` and two `flex-wrap` shells
(packages sidebar + content, detail sidebar + content). The `minmax` values are deliberate
breakpoints. In Next.js you may convert these to Tailwind `md:`/`lg:` classes, but **preserve
the wrap order and the minimum widths** — read them off each container.

Two things depend on a live measurement, not a constant:
- Both mega-menu panels use `top: 100%` so they track the header's real height.
- Both sticky sidebars read the header height from a `ResizeObserver` (`state.hdr + 24`).
  Keep this, or use a CSS variable set once on `<body>`.

Content max width is `1280px` (`1328px` for the full-bleed carousel and detail gallery),
side padding `24px`.

---

## 5b. Scope: Kerala flagship, India-wide reach

The brand is **"Kerala specialists, with tour packages across India and abroad"** — its own
About-page claim. The design signals the wider ambition without inventing inventory:

- Hero: *"Discover Incredible India & everywhere beyond"*; kicker *KERALA SPECIALISTS · INDIA & ABROAD*.
- Destinations mega-menu has three groups: **Kerala** (6 photo thumbnails, badge *BOOKABLE NOW*,
  each filters the real package grid by region), **Rest of India** (Rajasthan, Golden Triangle,
  Goa, Himachal, Northeast, Ladakh) and **International** (Middle East, South-East Asia, Europe,
  Sri Lanka, Maldives, Far East) — both badged *ON ENQUIRY* and routed to the enquiry form.
- Search widget destination list uses the same three grouped headings.
- `/my-packages` shows the 10 real Kerala packages, then two honest cards below the grid:
  **Pan-India packages** (*COMING SOON* — "ask us to plan one") and **International holidays**
  (*EXPLORE MORE* — waitlist).
- The "Pan-India & Abroad" category card routes to the enquiry form, not to a fake filter.

**Hard rule: never fabricate a non-Kerala package, price, itinerary or departure date.**
The 10 Kerala packages are the only bookable inventory until the client supplies more.

---

## 6. Illustration & icon system (all original, keep as components)

The prototype contains hand-authored single-stroke SVGs. Extract each into
`components/art/`, stroke `1.6`, `currentColor` where possible:

- **8 category icons** — gopuram, heart, Ayurveda leaf + drop (has a `sway` loop), temple
  tower, kettuvallam houseboat, tea hills with switchback, sun + cliff + waves, India globe.
- **3 trust-strip icons** — shield + check, clock, route + pin. Each animates via
  `stroke-dasharray:1400 → dashoffset:0` (`@keyframes draw`). Port to GSAP ScrollTrigger,
  fired once on scroll-into-view.
- **Refund illustration** — traveller figure + flat vermilion shield with a drawing checkmark
  and a coin. In the `isHome` refund block.
- **Backwater horizon strip** — houseboat, two coconut palms, gopuram, Chinese fishing net,
  wave line. Sits under the social gallery at 32% opacity.
- **404 / empty state** — elephant looking at a map. In the `isPackages` no-results block.
- **Map placeholders** — two abstract line-art panels standing in for Google Maps embeds
  (package detail, contact offices). Replace with real embeds; keep the panel proportions.

Still to produce: favicon system (`favicon.svg` + 32×32 + 180×180 PNG + Safari mask icon)
from the palm-leaf negative-space "S".

---

## 7. Motion spec

Motion is a first-class part of this design, not decoration. Everything below is built in the
prototype with CSS keyframes + React state; port each to Framer Motion / GSAP.

**Load & navigation**

| Where | Motion |
|---|---|
| Preloader | Full-screen `--color-ink` panel: logo rises in, a 210px coral progress bar fills over 1.5s, caption *PREPARING YOUR JOURNEY* fades in, then the whole panel wipes upward (`clip-path: inset(0 0 100% 0)`) to reveal the hero. In production drive it off real asset readiness, not a timer. |
| Route change | 260ms coral full-screen wipe + a 3px coral progress bar across the top, then the new route fades/rises in. Port to `template.tsx` with `AnimatePresence`. |
| Shared element | A package card image should morph into the detail-page hero image. The prototype only approximates this with the wipe — **implement it properly** with Framer `layoutId` on the card image and the detail hero. |

**Hero**

| Where | Motion |
|---|---|
| H1 | Per-word `blurin` (opacity + 26px rise + 10px blur), 90ms stagger |
| Ambient depth | Two large blurred radial blobs (coral, mint) behind the headline, slow independent drift loops (18s / 22s) |
| Floating badges | *IATA Approved* and *10+ Years of trust* cards on a 6s idle bob, offset 0.9s from each other |
| Rating badge | `★ 4.9` pill pops in on each package card, delayed ~0.3s after the card |
| Search card | Rise entrance at 0.35s; `will-change: transform` is set for the scroll parallax lift |

**Sections & cards**

| Where | Motion |
|---|---|
| Section reveals | `rise` 0.7s, children staggered 0.08s → `whileInView`, `viewport={{ once:true, margin:'-80px' }}` |
| Cards | `whileHover={{ y:-6 }}`, spring `stiffness:300 damping:24`, shadow → `--shadow-card-hover` |
| Card image | Inner wrapper scales to 1.09 over 0.7s inside an `overflow:hidden` frame — the frame never breaks |
| Marquee | Full-width strip of real service claims (IATA APPROVED · AIR TICKETS · HOTEL BOOKINGS · MICE & EVENTS · CORPORATE TRAVEL · KERALA SPECIALISTS · PAN-INDIA · INTERNATIONAL · SINCE 2015), 34s infinite scroll, pauses on hover. **These are claims, not partner logos — do not substitute invented logos.** |
| Counters | `useSpring` 0 → target, `IntersectionObserver` threshold 0.3, once |
| Line-art SVGs | `stroke-dasharray:1400 → dashoffset:0`; port to GSAP ScrollTrigger, once on enter |
| Testimonials | 6s auto-advance, crossfade + 16px slide; active dot widens 10px → 34px |

**Micro-interactions**

| Where | Motion |
|---|---|
| Header | Condenses on scroll past 40px: min-height 78px → 62px, logo 46px → 36px, 0.32s ease |
| Mega-menu | Fade + rise on open, `top:100%` so it tracks the condensed header; needs height auto-animate in production |
| Buttons | Hover `scale(1.02–1.05)` + coral shadow bloom |
| Inputs | Focus glow: coral border + `0 0 0 4px rgba(229,72,61,.14)` |
| WhatsApp FAB | Pops in at 1.4s, then a 4s infinite pulse ring |
| Accordions | `max-height` 0.4s `cubic-bezier(.2,.7,.3,1)`; chevron rotates 0° → 90° |
| Reduced motion | Global `*{animation:none;transition:none}` — keep this guarantee, and pause the hero video |

---

## 8. Data model

Port `this.packages` (10 real packages) verbatim into a CMS collection or
`data/packages.ts`:

```ts
type Package = {
  slug: string;
  title: string;
  regions: string;      // display string, "·"-separated
  region: 'South Kerala'|'Central Kerala'|'North Kerala'|'Multi-region';
  duration: string;     // may be "TBC" — see §9
  cat: keyof typeof CATEGORY_COLOR;
  photo: string;
  hint: string;         // art-direction note for the photographer
};
```

The Ayurveda Retreat additionally has: `overview`, `highlights[]`, `days[]` (6, each
`{title, body}`), `includes[]`, `excludes[]`, `notes[]`, `lodging`, `tourType`. See
`this.itineraries` and `detailFor()`. Model these as CMS fields on every package; the other
nine currently render a "TBC" fallback block.

Also port: `faqData` (4 Q&A), `testis` (the 3 **real** testimonials — do not add more),
`galleryItems` (6, with grid spans and captions), `whyUs` (6 About cards), `offices` (2).

---

## 9. TBC discipline — carry this through

The client has not confirmed several facts. The design **shows** that rather than inventing
data. Preserve every one of these as a CMS-driven flag, not hardcoded text:

- **Stats**: Happy Travellers and Destinations render `—` with an *AWAITING CLIENT DATA* pill.
  Holiday Packages (10) and Years of Experience (10+, verifiable from 2015) render normally
  with a *VERIFIED* pill.
- **Pricing**: every card and the booking sidebar say **"On enquiry"**. There is no price
  field yet and no payment gateway. Card checkout is v2.
- **Cancellation**: "Free cancellation up to **X hours**" with a dashed gold underline.
- **Durations** marked `TBC` on 4 of 10 packages — pull the real text from each live package page.
- **Reviews**: package detail shows an explicit "no reviews yet" panel. Do not seed fabricated
  reviews.
- **Journal**: template only, tagged *TEMPLATE — ARTICLES TBC*.
- **Footer**: payment badges are a dashed "pending gateway" placeholder; the social links
  point nowhere until the client confirms targets.

A `showTbcFlags` boolean exists in the prototype's props for hiding these once resolved.

---

## 10. Interactions already specified and working

Port behaviour, not just appearance:

1. **Hero search widget** — three popover fields (destination / experience / date) + Search.
   Search navigates to `/my-packages` with the experience applied as a category filter.
2. **Date picker** — 42-cell month grid, past dates disabled, `‹ ›` month nav. Appears in the
   hero widget *and* the booking sidebar, sharing one state. Replace with `react-day-picker`.
3. **Package filters** — category and region lists with live counts, a Reset, and three sorts
   (Featured / Shortest / A–Z). Empty state is designed.
4. **Mega-menus** — two panels on hover (Destinations grid; Packages = categories + signature
   journeys + a "Customise" promo card). Must be keyboard-navigable in production.
5. **Itinerary accordion** — Day 01–06, one open at a time, on the timeline.
6. **Booking sidebar** — date + adults/children steppers → **"Book Now"** navigates to
   `/contact-us` with the enquiry form pre-filled (package name, dates, party size).
   WhatsApp (`+91-9072769547`) is the secondary CTA.
7. **Lightbox** — gallery grid and the detail page's "25+ Photos" button both open it;
   `‹ › ×`, click-out to close, caption per image.
8. **Testimonial carousel** — auto-advance + dot control.
9. **Enquiry form** — 6 fields incl. a package dropdown (auto-filled from a package page),
   success state with a drawing checkmark, "Send another" reset. Wire to email + WhatsApp.
10. **Newsletter** — inline success state with the same checkmark motion.

---

## 11. Assets

- **Logo**: `https://sahapathika.com/wp-content/uploads/2026/07/Site-logo1.svg`. In the
  prototype it is reversed to white on the dark header and footer via
  `filter: brightness(0) invert(1)`. **Ask the client for a proper reversed/mono lockup** and
  drop the filter.
- **Photography**: currently 13 client-supplied reference images, hotlinked from Pinterest CDN
  purely to communicate art direction. **These must not ship.** Replace with commissioned or
  fully-licensed originals, warm/golden-hour graded — never cold-blue brochure grading. Each
  `<image-slot>` carries a `placeholder` string describing the intended shot; use it as the
  photo brief.
- **Hero video**: the design supports a looping muted landscape `<video>` behind the hero
  (poster = the hero still, `prefers-reduced-motion` pauses it, static poster below `md`).
  A `heroVideoUrl` prop switches it on. **A direct `.mp4`/`.webm` URL is still needed** — the
  Pinterest link supplied cannot be resolved to a file, and Pinterest media may not be
  redistributed. Source licence-free 4K Kerala backwater footage (Pexels/Pixabay) or commission it.
- **Do not** reuse any Atlastrip / Egenslab demo asset. It was a structural reference only.

---

## 12. Non-negotiables

- WCAG AA contrast — check vermilion `#C4432B` on cream `#FBF7EE` specifically; it passes for
  large text and button fills, not for small body copy.
- Keyboard-navigable mega-menu, date picker, accordions, lightbox.
- Semantic landmarks; alt text on every photo and illustration — describe religious and
  cultural sites respectfully and accurately.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, mobile and desktop. Hero video must not
  own LCP — poster first, video swaps in after paint.
- Mobile hit targets ≥ 44px.

---

---

## 13b. Footer — build to this spec exactly

The footer is **universal**: one component in `app/layout.tsx`, rendered on every route.
The design file contains a simplified version of it — inline styles cannot express the five
media-query breakpoints below, so **this section, not the prototype, is the source of truth
for the footer.** Content and colours come from the prototype; layout and motion come from here.

### Assets (verbatim, do not download or substitute)

```
video  https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260901_122529_931c22c8-8d2d-47c0-ad51-b97f56a91e42.mp4
poster https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4f690bd1-881a-4192-82f2-d714d34c8fb9.png
```

A 10s 1080p 16:9 loop: hand-drawn teal-ink landscape — misty layered mountains, a still
lake, pine outcrops both edges, two cranes gliding across a cream paper sky. Static camera.
It is the footer's only imagery.

### Tokens (footer-scoped, harmonised with the site palette)

```css
.site-footer {
  --ink: #16211D;        /* text, icons, borders */
  --ink-soft: #3A4A44;   /* placeholder at .85 opacity, secondary copy */
  --cream: #F1EAE1;      /* footer background — set on .site-footer */
  --accent: #E5483D;     /* contact icons + subscribe button fill */
  --accent-dark: #C4362C;/* subscribe hover */
  --max: 1440px;
  --fs-nav: clamp(.9rem, .55vw + .75rem, 1.02rem);
}
```

Two deliberate deviations from the original spec, because this is Sahapathika and not the
reference brand: `--ink` is the site's charcoal rather than teal `#175A67`, and the
subscribe button is **coral** (the site's single dominant accent) rather than ink. The
cream `#F1EAE1` sits between the page cream `#FAF6EF` and the clip's paper sky so the
seam disappears. Everything else below is unchanged.

### DOM

```html
<footer class="site-footer">
  <div class="footer-media" aria-hidden="true">
    <video class="footer-bg" autoplay muted loop playsinline preload="auto" poster="[POSTER]">
      <source src="[VIDEO]" type="video/mp4">
    </video>
  </div>
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="brand">…</div>
      <nav class="col" aria-label="Explore">…</nav>
      <nav class="col" aria-label="Popular">…</nav>
      <nav class="col" aria-label="Care and service">…</nav>
      <div class="newsletter">…</div>
    </div>
    <div class="footer-bottom">
      <div class="socials">…</div>
      <nav class="legal" aria-label="Legal">…</nav>
    </div>
  </div>
</footer>
```

### Copy — real content, use verbatim

- **Brand lockup:** the Sahapathika logo
  (`https://sahapathika.com/wp-content/uploads/2026/07/Site-logo1.svg`) at
  `width:clamp(52px,4.4vw,74px)` — it replaces the spec's oval-and-sprig brand mark and the
  Cormorant wordmark. Ask the client for a mono/reversed lockup; do not add a text wordmark
  next to it.
- **Blurb:** "Kerala specialists, with tour packages across India and abroad — crafting
  journeys that connect, delight and leave a lasting imprint."
- **Contacts** (icon + text rows, in order): envelope → `care` address
  `sahapathika@gmail.com` (`mailto:`) · phone → `+91 90727 69547` (`tel:+919072769547`) ·
  map-pin → plain `<span>`, not a link: "Kochi · New Delhi / Trivandrum · Vasco-Goa ·
  Bangalore · Kolkata".
- **Col 1 "Explore":** Home / My Packages / About Us / Contact Us / Royal Life — Journal
- **Col 2 "Popular":** Ayurveda &amp; Wellness / Backwater Cruises / Hill Stations /
  Temple Tours / Honeymoon
- **Col 3 "Care &amp; Service":** FAQs / Booking &amp; Payment / Cancellation Policy / Talk To Us
- **Col 4 "The Letter":** paragraph "Sign up for early notice on new itineraries, travel
  stories &amp; members-only offers." Then a form with a visually-hidden
  `<label for="nl-email">Email address</label>`, `<input id="nl-email" type="email"
  name="email" placeholder="Leave your email" autocomplete="email" required>`, and a submit
  button `aria-label="Subscribe"` containing the right-arrow SVG.
- **Bottom left:** Facebook, Instagram, LinkedIn, WhatsApp (`aria-label` each; the first
  three `href="#"` until the client confirms targets — the current site's "X/Twitter" icon
  points nowhere, so it is dropped; WhatsApp → `https://wa.me/919072769547`).
- **Bottom right:** © 2026 Sahapathika Holidays · IATA approved / Privacy Notice /
  Terms &amp; Policies / Cookie Notice
- All headings are title case in the HTML, uppercased via `text-transform`.

### Icons — inline SVG only, no icon fonts, no images

24×24 viewBox, `fill="currentColor"`. The arrow is
`fill="none" stroke="currentColor" stroke-width="1.8"`, round caps and joins,
path `M4 12h15M13 6l6 6-6 6`. Contact icons take `--accent`; social and arrow icons
inherit `currentColor`.

### Desktop layout (>1100px)

- `.site-footer` — `position:relative; isolation:isolate; display:flex;
  flex-direction:column; min-height:100vh` then `min-height:100svh; overflow:hidden;
  overflow-wrap:break-word;` background `var(--cream)`; padding
  `clamp(2.25rem,4.5vh,4rem) max(clamp(1.25rem,4vw,4.5rem),env(safe-area-inset-right))
  max(clamp(1.5rem,3vh,2.75rem),env(safe-area-inset-bottom))
  max(clamp(1.25rem,4vw,4.5rem),env(safe-area-inset-left))`
- `.footer-media` — `position:absolute; inset:0; z-index:-2; pointer-events:none`
- `.footer-bg` — `position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  object-position:center bottom; pointer-events:none`.
  **Full-bleed: no scrim, veil, tint, blur or gradient over the video on desktop.** The copy
  sits directly on the artwork. This is deliberate — do not "improve" it.
- `.footer-inner` — `position:relative; width:100%; max-width:var(--max); margin:0 auto;
  flex:1; display:flex; flex-direction:column`
- `.footer-grid` — `display:grid; align-items:start; gap:clamp(1.5rem,3vw,3.25rem);
  grid-template-columns:minmax(240px,1.45fr) repeat(3,minmax(130px,.85fr)) minmax(260px,1.25fr)`
- `.brand-lockup` — flex, `align-items:center`, `gap:clamp(.65rem,1vw,1rem)`
- `.brand-blurb` — `margin-top:clamp(1.15rem,2.4vh,1.9rem); max-width:24ch; line-height:1.62`
- `.contact-list` — `list-style:none; margin-top:clamp(1.15rem,2.4vh,1.9rem)`; column flex,
  `gap:clamp(.6rem,1.2vh,.95rem)`; each `li` flex/center with `.85rem` gap; icons 19×19;
  links no underline, underline on hover with `text-underline-offset:3px`
- `.col-title` — `margin:0 0 clamp(1.15rem,2.4vh,1.85rem);
  font-size:clamp(.95rem,.5vw + .8rem,1.12rem); font-weight:600; letter-spacing:.055em;
  text-transform:uppercase`
- `.link-list` — column flex, `gap:clamp(.62rem,1.35vh,1.05rem)`; links `inline-block`, no
  underline, `transition:opacity .2s ease, transform .2s ease`; hover → `opacity:.62` and
  `translateX(2px)`
- `.newsletter p` — `margin:0 0 clamp(1rem,2.2vh,1.6rem); max-width:32ch; line-height:1.62`
- `.subscribe` — flex row; `width:100%; max-width:380px; border:1px solid var(--ink);
  background:rgba(255,255,255,.4)`
- `.subscribe input` — `flex:1; min-width:0; border:0; outline:0; background:transparent;
  padding:.95rem 1.05rem; font-family:inherit; font-size:var(--fs-nav)`; placeholder
  `var(--ink-soft)` at `.85` opacity; `:focus-visible` →
  `box-shadow:inset 0 0 0 2px rgba(229,72,61,.25)`
- `.subscribe button` — `width:clamp(56px,4vw,66px); border:0; background:var(--accent);
  color:var(--cream); display:grid; place-items:center; transition:background .2s ease`;
  hover `var(--accent-dark)`; svg 22×22
- `.footer-bottom` — `margin-top:auto; padding-top:clamp(2.5rem,6vh,4.5rem)`; flex row,
  center, `space-between`, `gap:1.25rem 2rem`, `flex-wrap:wrap`
- `.socials` — flex row, `gap:clamp(.9rem,1.5vw,1.5rem)`; svg 26×26; hover → `opacity:.65`
  and `translateY(-2px)`
- `.legal` — flex row, `gap:clamp(1.15rem,2.6vw,3rem)`, `flex-wrap:wrap`; underline on hover
- `.sr-only` — absolute 1px/1px clip-rect helper
- Plus `*,*::before,*::after{box-sizing:border-box}` and `html{-webkit-text-size-adjust:100%}`

### Responsive — five breakpoints, in this order

**`@media (max-width:1100px)`**
`.footer-grid` → `1fr 1fr 1fr`, `row-gap:clamp(2rem,4vh,2.75rem)`;
`.brand` and `.newsletter` → `grid-column:1 / -1`; `.brand-blurb` → `max-width:42ch`.

**`@media (max-width:720px)`** — phones. *Key change:* the video stops being an absolute
background and becomes a real flex item **after** the copy, so nothing overlaps and nothing
is zoom-cropped.
`.site-footer` → `height:auto; min-height:100svh; padding-right/bottom/left:0;
overflow-x:hidden; overflow-y:visible`.
`.footer-inner` → `order:0`; horizontal padding
`max(clamp(1.25rem,4vw,4.5rem),env(safe-area-inset-*))`; `padding-bottom:clamp(1.25rem,3vh,2rem)`.
`.footer-media` → `position:relative; inset:auto; order:1; flex-shrink:0; width:100%;
height:auto; margin-top:auto; z-index:0`.
`.footer-bg` → `position:relative; inset:auto; width:100%; height:auto; max-width:100%;
object-fit:contain; object-position:center bottom; transform:none; display:block`.
`.footer-grid` → `1fr 1fr`, `gap:clamp(1.75rem,5vw,2.25rem)`; `.brand-blurb` → `max-width:34ch`.
`.footer-bottom` → column, `align-items:flex-start`, `gap:1.5rem`,
`padding-top:clamp(2rem,7vh,3rem)`, `padding-bottom:clamp(1.25rem,3vh,2rem)`;
`.legal` → `gap:1.1rem 1.5rem`.
Touch ergonomics — trade list gap for tap padding, ~40px targets:
`.link-list{gap:.2rem}` `.link-list a{padding:.55rem 0}` `.contact-list{gap:.25rem}`
`.contact-list a,.contact-list span{padding:.4rem 0}` `.legal a{padding:.45rem 0}`
`.socials a{padding:.3rem;margin:-.3rem}` `.socials svg{width:28px;height:28px}`
`.subscribe input{font-size:16px;padding:1rem 1.05rem}` — 16px stops iOS focus-zoom.

**`@media (max-width:440px)`**
`--fs-nav:.92rem`; `.footer-grid{gap:1.35rem 1.25rem}`; `.col-title{margin-bottom:.85rem}`;
`.brand-blurb,.newsletter p{max-width:none}`; `.subscribe{max-width:none}`.

**`@media (max-width:359px)`** — `.footer-grid` → single column.

**`@media (min-width:721px) and (max-width:1100px)`** — tablets. Repeat the phone block's
`.site-footer` / `.footer-inner` / `.footer-media` / `.footer-bg` rules verbatim (video at
the bottom of the flow, its own aspect ratio) while keeping the 3-column grid and the
desktop touch/spacing rules.

**`@media (max-width:1100px)`** — soft seam, mobile and tablet only, never desktop.
`.footer-media::after` → `content:""; position:absolute; left/right/top:0;
height:clamp(52px,16vw,120px); pointer-events:none; z-index:1;
background:linear-gradient(to bottom,#F1EAE1 0%,rgba(241,234,225,.65) 38%,rgba(241,234,225,0) 100%)`.
This blends only the clip's top edge into the page — it is **not** a scrim over the art.

**Requirement: zero horizontal overflow at every width from 320px to 1440px.**

### Entrance animations — CSS only, opacity + transform, no layout shift

```css
@keyframes rise-in { from{opacity:0;transform:translate3d(0,14px,0)} to{opacity:1;transform:translate3d(0,0,0)} }
@keyframes fade-in { from{opacity:0} to{opacity:1} }
```

`.footer-bg` → `animation:fade-in 1.35s ease both`.
These all get `animation:rise-in .72s cubic-bezier(.22,1,.36,1) both`: `.brand-lockup`,
`.brand-blurb`, `.contact-list li`, `.col .col-title`, `.col .link-list li`,
`.newsletter .col-title`, `.newsletter p`, `.subscribe`, `.socials a`, `.legal a`.

Delays, exact: `.brand-lockup` .04s · `.brand-blurb` .12s · `.contact-list li` 1/2/3 →
.2s / .28s / .36s. Per-column stagger token:
`.footer-grid > .col:nth-child(2){--col-stagger:.16s}`, `nth-child(3){--col-stagger:.24s}`,
`nth-child(4){--col-stagger:.32s}`; `.col .col-title` → `var(--col-stagger,.2s)`;
`.col .link-list li:nth-child(1..6)` → `calc(var(--col-stagger,.2s) + .08s)` … `+ .48s` in
.08s steps. `.newsletter .col-title` .4s · `.newsletter p` .48s · `.subscribe` .56s ·
`.socials a` 1–4 → .64s / .7s / .76s / .82s · `.legal a` 1–3 → .7s / .78s / .86s.

### Reduced motion — `@media (prefers-reduced-motion:reduce)`

`.footer-bg` → `display:none; animation:none`. `.site-footer` → `background-color:#F1EAE1`
plus `background-image:url([POSTER]); background-position:center bottom;
background-size:cover; background-repeat:no-repeat`; nested
`@media (max-width:1100px)` inside it → `.site-footer{background-size:100% auto}`.
`.footer-media::after` → `content:none`. All rise-in elements → `animation:none`;
`.link-list a:hover, .socials a:hover` → `transform:none`.

### Design intent — do not "improve" these

1. No overlay of any kind on the video on desktop — no gradient veil, tint, blur or
   darkening. The copy sits directly on the artwork.
2. Desktop is full-bleed `cover`. Portrait viewports (≤1100px) must **not** use `cover` —
   the 16:9 clip would zoom ~2.5× and drag the cranes up through the link columns. It
   becomes a flow item under the copy at its own aspect ratio instead.
3. The video is the only motion in the footer besides the CSS keyframes above. No JS.

---

## 14. Suggested order of work

1. Scaffold + tokens + fonts + `layout.tsx` (header, mega-menus, footer, WhatsApp FAB).
2. Package data model and `/my-packages` with filters.
3. `/packages/[slug]` including the Ayurveda Retreat content in full.
4. Homepage, section by section, in the prototype's order.
5. `/about-us`, `/contact-us`, form wiring.
6. Art components + GSAP line-draw + Framer scroll reveals.
7. `/customize-package`, `/royal-life`, `/offers`, `/faq`, `/404` — **these are undesigned;
   come back for design before building.**
8. Favicon system, real maps, real photography, hero video.
