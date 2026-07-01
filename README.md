<div align="center">

<!-- Animated SVG Title Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Cormorant+Garamond&size=52&duration=3000&pause=1000&color=C9A96E&center=true&vCenter=true&width=700&height=100&lines=LUMI%C3%88RE;Fine+Dining+Experience;Where+Cuisine+Becomes+Art" alt="Lumière" />

<br/>

<!-- Live badge -->
<a href="https://professyzenith.github.io/Lumiere/">
  <img src="https://img.shields.io/badge/LIVE%20DEMO-%E2%86%92-C9A96E?style=for-the-badge&labelColor=08070A&color=C9A96E" alt="Live Demo"/>
</a>
&nbsp;
<img src="https://img.shields.io/badge/HTML5-08070A?style=for-the-badge&logo=html5&logoColor=C9A96E" alt="HTML5"/>
&nbsp;
<img src="https://img.shields.io/badge/CSS3-08070A?style=for-the-badge&logo=css3&logoColor=C9A96E" alt="CSS3"/>
&nbsp;
<img src="https://img.shields.io/badge/JavaScript-08070A?style=for-the-badge&logo=javascript&logoColor=C9A96E" alt="JavaScript"/>
&nbsp;
<img src="https://img.shields.io/badge/GSAP-08070A?style=for-the-badge&logo=greensock&logoColor=C9A96E" alt="GSAP"/>

<br/><br/>

<!-- Divider -->
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>

</div>

<br/>

<div align="center">

> *"Luxury is not served. It is experienced."*

</div>

<br/>

<!-- Preview Image slot — replace this URL with a real screenshot or GIF of your site -->
<div align="center">
<img src="https://professyzenith.github.io/Lumiere/assets/images/preview.gif" alt="Lumière Preview" width="100%" style="border-radius:4px"/>
</div>

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;What Is This

**Lumière** is a cinematic, fully animated one-page restaurant website — built as a **portfolio centrepiece** to demonstrate world-class front-end animation, interaction design, and technical craft to prospective clients.

This is not a template. Every transition, every timing curve, every interaction was deliberately choreographed — from the 6-second cinematic intro sequence down to the elastic snap-back on the CTA buttons. The goal: make anyone who opens it immediately think **"How was this built?"**

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;The Intro Sequence

<table>
<tr>
<td width="50%">

**Stage 1 — Preloader** `~2s`
- Dark panther background
- Gold progress line fills 0 → 100%
- Shimmering light tip rides the edge
- Corner brackets snap in
- 12-blade curtain wipe exit

</td>
<td width="50%">

**Stage 2 — Main Intro** `~4.2s`
- 280 ember particles + wave layers
- Shooting stars arc across the void
- Gold sweep beam reveals each letter
- Particle sparks burst per character
- 18-panel film-rip into homepage

</td>
</tr>
</table>

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;Features

<table>
<tr><td>🎬</td><td><strong>Cinematic Two-Stage Intro</strong> — Custom preloader + LUMIÈRE letter reveal via a sweeping gold beam with particle sparks and film-rip exit</td></tr>
<tr><td>✦</td><td><strong>GSAP ScrollTrigger</strong> — Staggered entrances, clip-path text reveals, parallax scrub, and count-up statistics across every section</td></tr>
<tr><td>🖱️</td><td><strong>Custom Cursor</strong> — Dual-layer dot + trailing ring with magnetic elastic snap-back on all primary buttons</td></tr>
<tr><td>🌟</td><td><strong>Canvas Particle Systems</strong> — Two fully hand-coded Canvas 2D fields (hero + footer), zero external particle libraries</td></tr>
<tr><td>🖼️</td><td><strong>Mouse-Reactive Hero</strong> — Radial spotlight tracks cursor, ghost-text parallaxes with mouse movement</td></tr>
<tr><td>💡</td><td><strong>Menu Card Spotlight</strong> — Radial glow follows the cursor independently per card</td></tr>
<tr><td>📱</td><td><strong>Fully Responsive</strong> — Mobile breakpoints in a dedicated <code>responsive.css</code></td></tr>
<tr><td>🖼️</td><td><strong>Photo-Mode Ready</strong> — Real photography slots wired in, toggled with a single CSS class</td></tr>
<tr><td>⚡</td><td><strong>Zero Build Step</strong> — Pure HTML/CSS/JS, no npm, no bundler, open directly or deploy instantly</td></tr>
</table>

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;Project Structure

```
lumiere/
├── index.html                ← Semantic HTML markup
├── css/
│   ├── style.css              ← Core styles — layout, colour, typography, keyframes
│   └── responsive.css          ← Mobile/tablet breakpoints (single clean block)
├── js/
│   ├── utils.js                ← Global helpers + GSAP plugin registration (loads first)
│   ├── cursor.js                ← Custom cursor — self-contained, zero deps
│   ├── animations.js             ← Preloader · intro sequence · all ScrollTrigger logic
│   └── main.js                    ← Canvases · magnetic buttons · boot sequence
├── assets/
│   ├── images/                 ← Drop real photos here (see Enabling Real Photography)
│   ├── icons/                  ← Favicon slot
│   └── fonts/                  ← Self-hosted font slot (optional)
└── README.md
```

> **Script load order matters** — `utils.js` → `cursor.js` → `animations.js` → `main.js`
> Each module depends on the previous. No bundler needed; the HTML loads them in the correct order.

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| Markup | Semantic HTML5 |
| Styling | Plain CSS3 — no preprocessor, no build step |
| Animation | [GSAP 3](https://gsap.com/) + ScrollTrigger via CDN |
| Particles | Hand-written Canvas 2D — no library |
| Typography | Cormorant Garamond + Montserrat via Google Fonts |
| Build | **None** — open `index.html`, it works |

</div>

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;Live Demo

<div align="center">

### 👉 &nbsp;[professyzenith.github.io/Lumiere](https://professyzenith.github.io/Lumiere/)

</div>

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;Run Locally

No installation needed — just open the file or serve it:

```bash
# Option A — Python
python3 -m http.server 8000

# Option B — Node
npx serve .
```

Then visit → `http://localhost:8000`

Or simply double-click `index.html` — this project uses no `fetch`, no ES modules, so `file://` works fine.

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;Deploy

### GitHub Pages
1. Push this folder's contents to a repo
2. **Settings → Pages → Source:** `main` branch, `/ (root)` → **Save**
3. Live in ~60 seconds at `https://username.github.io/repo-name/`

### Vercel
1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Leave build command + output directory blank (auto-detected as static)
3. Click **Deploy** — done

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;Enabling Real Photography

The site ships with CSS gradient placeholders so it looks great immediately with zero setup. To add real photos:

1. Drop these files into `assets/images/`:
   - `about-interior.jpg`
   - `gallery-grand-hall.jpg`
   - `gallery-garden-terrace.jpg`
   - `gallery-private-dining.jpg`
   - `gallery-wine-cellar.jpg`

2. Add `photo-mode` to `<body>` in `index.html`:
```html
<body class="locked photo-mode">
```

That's it — images appear automatically. No other changes needed.

> Free high-quality restaurant photography: [unsplash.com](https://unsplash.com) · [pexels.com](https://pexels.com)

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

## ✦ &nbsp;Browser Support

Tested on current Chrome, Edge, Firefox, and Safari.
Uses: `Canvas 2D` · `CSS custom properties` · `clip-path` · `backdrop-filter` · `GSAP 3`

No polyfills required.

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
</div>

<br/>

<div align="center">

**Built with intent. Animated with craft. Deployed with pride.**

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Cormorant+Garamond&size=28&duration=4000&pause=2000&color=C9A96E&center=true&vCenter=true&width=500&height=60&lines=Lumi%C3%A8re+%E2%80%94+Fine+Dining;Where+Cuisine+Becomes+Art" alt="footer" />

<br/><br/>

![GitHub last commit](https://img.shields.io/github/last-commit/professyzenith/Lumiere?style=flat-square&color=C9A96E&labelColor=08070A)
![GitHub repo size](https://img.shields.io/github/repo-size/professyzenith/Lumiere?style=flat-square&color=C9A96E&labelColor=08070A)
![GitHub stars](https://img.shields.io/github/stars/professyzenith/Lumiere?style=flat-square&color=C9A96E&labelColor=08070A)

</div>
