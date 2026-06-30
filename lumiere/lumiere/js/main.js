/* ════════════════════════════════════════════════════════════
   LUMIÈRE — Fine Dining
   main.js

   Global utilities, GSAP setup, and the boot sequence that wires
   the preloader → intro → site reveal flow together. This file
   loads LAST (after cursor.js and animations.js) and contains
   the small pieces of glue logic that depend on functions
   defined in the other two modules.
   ════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   HERO CANVAS — floating particle field with proximity lines
   ════════════════════════════════════════════════════════════ */
(function initHeroCanvas() {
  const cv = $('h-cv');
  if (!cv) return;

  let W = (cv.width = cv.offsetWidth);
  let H = (cv.height = cv.offsetHeight);
  const ctx = cv.getContext('2d');

  window.addEventListener('resize', () => {
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  });

  const particles = Array.from({ length: 88 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -(0.13 + Math.random() * 0.48),
    r: 0.3 + Math.random() * 1.15,
    a: 0.04 + Math.random() * 0.19,
    life: Math.random(),
    decay: 0.0018 + Math.random() * 0.003,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -5) {
        p.y = H + 5;
        p.x = Math.random() * W;
        p.life = 0.6 + Math.random() * 0.4;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,169,110,${p.a * p.life})`;
      ctx.fill();

      /* Connect nearby particles with faint lines */
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 82) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(201,169,110,${0.026 * (1 - d / 82) * p.life * q.life})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Hero mouse-reactive spotlight + ghost-text parallax ── */
const heroEl = $('hero');
if (heroEl) {
  heroEl.addEventListener('mousemove', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;

    $('h-spot').style.background =
      `radial-gradient(circle 500px at ${x}% ${y}%,rgba(201,169,110,.07) 0%,transparent 65%)`;

    gsap.to('.h-ghost', {
      x: (e.clientX - r.width / 2) * -0.008,
      y: (e.clientY - r.height / 2) * -0.008,
      duration: 0.9,
      ease: 'power2.out',
    });
  });
}

/* ════════════════════════════════════════════════════════════
   FOOTER CANVAS — slow ambient ember drift
   ════════════════════════════════════════════════════════════ */
(function initFooterCanvas() {
  const cv = $('f-cv');
  if (!cv) return;

  const W = (cv.width = cv.offsetWidth);
  const H = (cv.height = cv.offsetHeight);
  const ctx = cv.getContext('2d');

  const embers = Array.from({ length: 72 }, () => ({
    x: Math.random() * W,
    y: H + Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: -(0.32 + Math.random() * 1.3),
    r: 0.3 + Math.random() * 1.4,
    a: 0.04 + Math.random() * 0.28,
    fl: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    embers.forEach((e) => {
      e.y += e.vy;
      e.x += e.vx + Math.sin(e.fl) * 0.18;
      e.fl += 0.018;
      if (e.y < -8) {
        e.y = H + 8;
        e.x = Math.random() * W;
      }
      const flicker = 0.6 + Math.sin(e.fl) * 0.4;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,169,110,${e.a * flicker})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR (top of viewport)
   ════════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const progress =
    window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  $('sp').style.width = progress * 100 + '%';
});

/* ── Hero ghost-text vertical parallax on scroll (rAF-throttled) ── */
let parallaxTick = false;
window.addEventListener('scroll', () => {
  if (parallaxTick) return;
  parallaxTick = true;
  requestAnimationFrame(() => {
    const sy = window.scrollY;
    const ghost = qs('.h-ghost');
    if (ghost) {
      ghost.style.transform = `translate(-50%,calc(-50% + ${sy * 0.18}px))`;
    }
    parallaxTick = false;
  });
});

/* ════════════════════════════════════════════════════════════
   MENU CARD SPOTLIGHT — radial glow follows the cursor per-card
   ════════════════════════════════════════════════════════════ */
qsa('.mc').forEach((card) => {
  const spotlight = card.querySelector('.mc-sp');
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    if (spotlight) {
      spotlight.style.background =
        `radial-gradient(circle 175px at ${e.clientX - r.left}px ${e.clientY - r.top}px,rgba(201,169,110,.09) 0%,transparent 70%)`;
    }
  });
});

/* ════════════════════════════════════════════════════════════
   MAGNETIC BUTTONS — primary CTAs gently follow the cursor
   ════════════════════════════════════════════════════════════ */
qsa('.mag').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.2,
      y: (e.clientY - r.top - r.height / 2) * 0.2,
      duration: 0.4,
      ease: 'power2.out',
    });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,.5)' });
  });
});

/* ════════════════════════════════════════════════════════════
   MENU TABS — simple active-state toggle (visual filter only)
   ════════════════════════════════════════════════════════════ */
qsa('.mn-tabs li').forEach((li) => {
  li.addEventListener('click', () => {
    qsa('.mn-tabs li').forEach((l) => l.classList.remove('on'));
    li.classList.add('on');
  });
});

/* ════════════════════════════════════════════════════════════
   SMOOTH ANCHOR NAVIGATION — offsets for the fixed nav bar
   ════════════════════════════════════════════════════════════ */
qsa('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = qs(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const yPos = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: yPos, behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════════════════════════
   BOOT SEQUENCE
   Skip / Replay controls + the preloader → intro chain.
   runPreloader() and runIntro() are defined in animations.js.
   ════════════════════════════════════════════════════════════ */
function doSkip() {
  iRun = false;
  gsap.to('#intro', {
    opacity: 0,
    duration: 0.42,
    onComplete: () => {
      $('intro').style.display = 'none';
    },
  });
  gsap.to('#site', { opacity: 1, duration: 0.5, delay: 0.2 });
  document.body.classList.remove('locked');

  setTimeout(() => {
    gsap.to('nav', { opacity: 1, duration: 0.6 });
    gsap.to(['.h-eye', '.h-h1', '.h-sub', '.h-ctas', '.e-lbl'], {
      opacity: 1,
      y: 0,
      stagger: 0.055,
      duration: 0.7,
      ease: 'power3.out',
    });
    gsap.to('.h-rule', { width: '180px', duration: 0.75, delay: 0.2 });
    gsap.to('.h-scroll', { opacity: 1, duration: 0.5, delay: 0.55 });
    $('replay').classList.add('on');
    $('i-skip').style.display = 'none';
    ScrollTrigger.refresh();
    initScrollAnims();
  }, 430);
}

$('i-skip').addEventListener('click', doSkip);

$('replay').addEventListener('click', () => {
  window.scrollTo(0, 0);
  location.reload();
});

/* Kick off the full experience once the page has loaded */
window.addEventListener('load', () => {
  setTimeout(async () => {
    await runPreloader();
    runIntro();
  }, 55);
});
