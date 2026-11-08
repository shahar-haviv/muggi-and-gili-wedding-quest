# Muggi & Gili — A Wedding Quest

A mobile-first wedding invitation, timeline, venue guide, and dietary RSVP
wrapped in a hand-built 8-bit / 16-bit wedding diorama. The landing scene is a
real-time Three.js world rendered at a deliberately tiny resolution, then
upscaled with nearest-neighbour filtering so every edge stays crunchy.

> **Placeholder details:** the date, venue, address, contact email, and map are
> editable placeholders. Replace them in
> [`src/data/weddingDetails.js`](src/data/weddingDetails.js) before sharing the
> site with guests.

## What is in the box

- **Interactive pixel diorama** — drag to orbit, tap for confetti hearts, and
  watch a floating garden island with a chuppah, dance floor, tables, voxel
  trees, string lights, pixel guests, stars, and a moon.
- **Title screen** — couple names, wedding date, venue, and a `PRESS START`
  journey into the page.
- **Live countdown** — days, hours, minutes, and seconds until the ceremony.
- **Quest log timeline** — Gathering, Ceremony, and Feast with scroll-driven
  progress, previous/next controls, and keyboard arrow support.
- **Venue guide** — illustrated pixel map, practical arrival/parking/access
  notes, Google Maps and Google Calendar links, and an accessible FAQ accordion.
- **Dietary RSVP** — attendance, party size, guest names, vegetarian, vegan,
  gluten-free, allergy details, accessibility notes, a song request, or a
  graceful decline note. Answers persist in `localStorage` and can be updated.
- **Optional chiptune sound** — WebAudio square/triangle-wave music and effects,
  off by default and remembered per device.
- **Reduced-motion and no-WebGL fallbacks** so the invitation remains readable
  on older phones, in private browsing, and with JavaScript disabled.

## Tech stack

| Layer      | Choice                                      |
| ---------- | ------------------------------------------- |
| Build tool | Vite 8                                      |
| Language   | Vanilla JavaScript ES modules               |
| 3D         | Three.js 0.187                              |
| Styling    | Hand-written CSS with custom pixel tokens   |
| Fonts      | Press Start 2P + Silkscreen (Google Fonts)  |
| Storage    | `localStorage`, optional JSON `POST` mirror |

## Quick start

Requires Node.js 20.19+ or 22.12+.

```bash
cd wedding-rsvp
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Scripts

```bash
npm run dev       # local development server with hot reload
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Customize the wedding

Most copy and dates are centralised:

| File                                | What to edit                                      |
| ----------------------------------- | ------------------------------------------------- |
| `src/data/weddingDetails.js`        | Names, date, venue, address, contact, calendar     |
| `src/data/weddingTimeline.js`       | Gathering / Ceremony / Feast times and descriptions |
| `src/data/venueFaq.js`              | FAQ questions and answers                         |
| `src/data/dietaryOptions.js`        | Party sizes, dietary labels, storage key/version  |
| `src/styles/tokens.css`             | Palette, spacing, typography, pixel shadows       |
| `index.html`                        | Page metadata, hero copy, static section shells    |
| `src/three/`                        | Diorama objects, shaders, and scene composition    |

If you change the wedding date, update `weddingDateIso` and
`rsvpDeadlineIso` together. The hero date, countdown, calendar link, and footer
are driven from that data.

## RSVP storage and optional endpoint

Every submission is written to `localStorage` under:

```text
shahar-liza-rsvp-v1
```

That makes the RSVP work on a plain static host with no backend. A guest can
reopen the page and update their answer on the same device.

To mirror submissions to a serverless function, form service, or Google Apps
Script, copy `.env.example` to `.env` and set:

```bash
VITE_RSVP_ENDPOINT=https://your-endpoint.example/rsvp
```

The site sends a `POST` with `Content-Type: application/json` and this shape:

```json
{
  "version": 1,
  "attendance": "attending",
  "guestName": "Ada Lovelace",
  "guestEmail": "ada@example.com",
  "partySize": 2,
  "guestNames": "Ada & Charles",
  "dietaryPreferences": ["vegetarian", "allergies"],
  "allergyNotes": "Severe sesame allergy.",
  "accessibilityNotes": "Step-free access please.",
  "songRequest": "Daft Punk — One More Time",
  "declineMessage": "",
  "submittedAt": "2026-11-04T12:00:00.000Z"
}
```

The local copy is the source of truth for edits; a failed cloud sync never
blocks the guest's save. The confirmation dialog reports whether the cloud
mirror succeeded. No secrets belong in `VITE_*` variables because Vite exposes
them to the browser.

## Deployment

```bash
npm run build
```

The static output lives in `dist/`. `vite.config.js` uses `base: './'`, so the
build works on:

- GitHub Pages project sites
- Netlify / Vercel / Cloudflare Pages
- Any static file server

Upload the contents of `dist/`, or point the host at `npm run build`.

## Accessibility and performance notes

- Semantic landmarks, a skip link, visible focus states, and labelled form
  sections.
- Native `<dialog>` confirmation with a fallback for older browsers.
- `prefers-reduced-motion` disables CSS motion and the idle camera float.
- The Three.js scene pauses its animation loop when the hero is off-screen and
  falls back to a CSS starfield if WebGL cannot start.
- The canvas is decorative (`role="img"` with a description); every essential
  wedding detail also exists as text.
- Sound is opt-in, and the UI uses an `aria-pressed` toggle.

## Project structure

```text
wedding-rsvp/
├─ index.html                 # semantic page shell
├─ public/pixel-heart.svg     # favicon
├─ src/
│  ├─ main.js                 # entry point and feature wiring
│  ├─ audio/                  # WebAudio chiptune engine
│  ├─ components/             # timeline, venue, RSVP, countdown
│  ├─ data/                   # editable wedding content
│  ├─ services/               # localStorage + optional endpoint store
│  ├─ styles/                 # tokens, base, layout, feature CSS
│  └─ three/                  # pixel-art diorama and pixelation shader
├─ .env.example
└─ vite.config.js
```

## Push this repository to GitHub

Create a new empty repository on GitHub (no README, no `.gitignore`), then from
the project folder:

```bash
git remote add origin https://github.com/<your-username>/wedding-rsvp.git
git branch -M main
git push -u origin main
```

If a remote already exists, update it first:

```bash
git remote set-url origin https://github.com/<your-username>/wedding-rsvp.git
git push origin main
```

## Credits

Built with love, Three.js, and far too many pixels. Replace the placeholder
venue and contact details with the real ones before the RSVP deadline.
