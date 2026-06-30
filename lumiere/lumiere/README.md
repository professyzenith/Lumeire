# Lumière — Fine Dining

A cinematic, fully animated one-page restaurant website built to portfolio standard. Features a custom two-stage intro (architectural preloader → particle-driven letter reveal), GSAP ScrollTrigger choreography across every section, a hand-built dual-layer cursor system, and a luxury violet-black / antique-gold visual identity.

This repository is structured the way a senior front-end developer would hand off a production build: HTML, CSS, and JavaScript fully separated, JavaScript split into logical modules, and an `assets/` directory ready for real photography, icons, and self-hosted fonts.

---

## Live Preview

Deploy this folder to GitHub Pages or Vercel (see **Deployment** below) and your site will be live at a URL like:

```
https://your-username.github.io/your-repo-name/
```
or
```
https://your-project.vercel.app
```

---

## Project Structure

```
lumiere/
├── index.html              Main page markup
├── css/
│   ├── style.css            Core stylesheet — layout, colour, typography, animation keyframes
│   └── responsive.css        Mobile / tablet breakpoint overrides
├── js/
│   ├── utils.js              Global helpers ($, qs, qsa, sleep) + GSAP plugin setup
│   ├── cursor.js              Custom dual-layer cursor system
│   ├── animations.js          Preloader, intro sequence, and all ScrollTrigger animations
│   └── main.js                 Hero/footer canvases, magnetic buttons, boot sequence
├── assets/
│   ├── images/                Real photography slots (see "Enabling Real Photography" below)
│   ├── icons/                 Favicon / app icon slot
│   └── fonts/                 Self-hosted font slot (optional — fonts load from Google by default)
└── README.md
```

### Why the JavaScript is split this way

Script load order matters for this project, since nothing is bundled or wrapped in ES modules:

1. **`utils.js`** — zero dependencies. Defines the `$` / `qs` / `qsa` / `sleep` shorthand helpers and registers the GSAP `ScrollTrigger` plugin. Must load first.
2. **`cursor.js`** — depends only on `utils.js`. Fully self-contained custom cursor logic.
3. **`animations.js`** — the largest module. Contains the intro canvas (ember particles, waves, shooting stars), the `runPreloader()` and `runIntro()` async sequences, and `initScrollAnims()` (every GSAP ScrollTrigger reveal on the page).
4. **`main.js`** — loads last. Contains the hero/footer particle canvases, magnetic button interactions, menu spotlight effects, smooth anchor navigation, and the boot sequence that calls `runPreloader()` → `runIntro()` on page load.

---

## Features

- **Two-stage cinematic intro** — a 2-second architectural preloader (animated progress line, no spinners or generic loading bars) followed by a ~4-second particle-driven sequence where the wordmark is revealed letter-by-letter by a sweeping beam of light, complete with particle sparks and a film-rip transition into the homepage.
- **GSAP ScrollTrigger** animations on every section — staggered entrances, clip-path text reveals, parallax image scrubbing, and animated count-up statistics.
- **Custom cursor** — a dot + trailing ring combination with magnetic attraction on all primary buttons.
- **Two ambient particle canvases** — one behind the hero section, one in the footer — both fully hand-coded with Canvas 2D (no external particle library).
- **Skip Intro / Replay Intro** controls, so the experience respects first-time visitors while remaining demo-able on request.
- Fully responsive layout with a dedicated breakpoint stylesheet.
- **Opt-in real photography layer** — see below.

---

## Enabling Real Photography

By default, the **About** section image and all four **Gallery** cards use the original CSS gradient placeholders — this guarantees the site looks and behaves exactly as designed out of the box, with no risk of broken image icons if photos haven't been added yet.

To switch on real photography:

1. Add your photo files into `assets/images/` using these exact filenames (see `assets/images/README.txt` for full specs):
   - `about-interior.jpg`
   - `gallery-grand-hall.jpg`
   - `gallery-garden-terrace.jpg`
   - `gallery-private-dining.jpg`
   - `gallery-wine-cellar.jpg`

2. Open `index.html` and add the `photo-mode` class to the `<body>` tag:

   ```html
   <body class="locked photo-mode">
   ```

That's it — the corresponding `<img>` tags (already wired into the markup, currently hidden) will display automatically, layered correctly behind the existing labels and hover effects, with zero other changes to the page.

> **Tip:** [unsplash.com](https://unsplash.com) and [pexels.com](https://pexels.com) both offer high-quality, commercially-free restaurant interior and fine dining photography if you don't yet have a real photo shoot for the client.

---

## Technology Stack

| Layer | Choice |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Plain CSS3 (no preprocessor, no build step) |
| Animation orchestration | [GSAP 3](https://gsap.com/) + ScrollTrigger (via CDN) |
| Particle effects | Hand-written Canvas 2D (no external library) |
| Typography | Cormorant Garamond + Montserrat (Google Fonts, via CDN) |
| Build tooling | **None required** — open `index.html` directly, or serve as static files |

No npm install, no bundler, no framework. This is intentional: the project is designed to be inspected, edited, and deployed by anyone, instantly.

---

## Running Locally

No installation needed. Either:

**Option A — open directly**
Double-click `index.html`. (Note: some browsers restrict `fetch`/module behaviour on `file://` URLs — this project doesn't use either, so direct opening works fine.)

**Option B — serve locally** (recommended for the most accurate preview)

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve .
```

Then visit `http://localhost:8000`.

---

## Deployment

### GitHub Pages

1. Push the contents of this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **Deploy from a branch**.
4. Choose your branch (e.g. `main`) and folder `/ (root)`, then **Save**.
5. Your site will be live within a minute at `https://your-username.github.io/your-repo-name/`.

### Vercel

1. Push this folder to a GitHub repository (or import it directly).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel will auto-detect this as a static site — no build command or output directory configuration is needed (leave both blank, or set Output Directory to `.`).
4. Click **Deploy**.

Both platforms serve static files directly, so no server-side configuration is required.

---

## Browser Support

Built and tested against current versions of Chrome, Edge, Firefox, and Safari. Uses standard Canvas 2D, CSS custom properties, `clip-path`, and `backdrop-filter` — all well-supported in modern evergreen browsers. No polyfills are included.

---

## Credits

- **Animation engine:** [GSAP](https://gsap.com/) by GreenSock
- **Typography:** [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) & [Montserrat](https://fonts.google.com/specimen/Montserrat), via Google Fonts

---

## License

This is a portfolio demonstration project. Feel free to fork, adapt, and use as a starting point for client work.
