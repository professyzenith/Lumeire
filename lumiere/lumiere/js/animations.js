/* ════════════════════════════════════════════════════════════
   LUMIÈRE — Fine Dining
   animations.js

   The full animation choreography engine:
     1. Intro canvas    — ember field, waves, shooting stars
     2. Preloader        — the 0→100% progress line sequence
     3. Intro sequence   — letter reveal, gold sweep, film rip
     4. Scroll animations — GSAP ScrollTrigger reveals site-wide

   Depends on the global helpers ($, qs, qsa, sleep) and GSAP,
   both set up in main.js — but main.js loads AFTER this file,
   so the helpers below are declared with `var`/function hoisting
   semantics in mind. In practice, load order is:
     cursor.js → animations.js → main.js
   and the functions defined here (runPreloader, runIntro,
   initScrollAnims) are *called* from main.js's boot sequence,
   by which point everything is fully defined.
   ════════════════════════════════════════════════════════════ */

/* iRun / iFrame are read by both the canvas loop below and the
   intro sequence (to stop the canvas once the film-rip begins),
   so they're declared here at module scope. */
let iRun = true;
let iFrame = 0;

/* ════════════════════════════════════════════════════════════
   1. INTRO CANVAS
   Ember particles (3 colour families), layered wave motion,
   and randomly-spawning shooting stars — the atmospheric base
   for the whole intro sequence.
   ════════════════════════════════════════════════════════════ */
(function initIntroCanvas() {
  const cv = $('i-canvas');
  let W = (cv.width = window.innerWidth);
  let H = (cv.height = window.innerHeight);
  const ctx = cv.getContext('2d');

  window.addEventListener('resize', () => {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
  });

  /* 280 embers across 3 gold/champagne tonal families */
  const embers = Array.from({ length: 280 }, (_, i) => ({
    x: Math.random() * W,
    y: H + Math.random() * H * 1.2,
    vx: (Math.random() - 0.5) * 0.58,
    vy: -(0.65 + Math.random() * 2.6),
    r: 0.25 + Math.random() * 2.1,
    a: 0.04 + Math.random() * 0.48,
    fl: Math.random() * Math.PI * 2,
    col: i % 6 === 0 ? [200, 180, 140] : i % 4 === 0 ? [228, 200, 138] : [201, 169, 110],
  }));

  /* 4 wave layers rippling near the base of the screen */
  const waves = [
    { yf: 0.76, amp: 20, freq: 0.007, spd: 0.01, a: 0.07, w: 1 },
    { yf: 0.81, amp: 13, freq: 0.011, spd: 0.008, a: 0.045, w: 0.7 },
    { yf: 0.86, amp: 26, freq: 0.005, spd: 0.013, a: 0.028, w: 0.5 },
    { yf: 0.71, amp: 9, freq: 0.015, spd: 0.018, a: 0.02, w: 0.35 },
  ];

  /* Shooting stars — randomly spawn and arc across the upper screen */
  const shooters = Array.from({ length: 4 }, () => ({
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    len: 0,
    a: 0,
  }));
  let starTimer = 0;

  function spawnStar() {
    const s = shooters.find((s) => !s.active);
    if (!s) return;
    s.active = true;
    s.x = Math.random() * W * 0.42;
    s.y = Math.random() * H * 0.35;
    const speed = 9 + Math.random() * 13;
    const angle = 0.18 + Math.random() * 0.3;
    s.vx = Math.cos(angle) * speed;
    s.vy = Math.sin(angle) * speed;
    s.len = 85 + Math.random() * 145;
    s.a = 0.88;
  }

  function draw() {
    if (!iRun) return;
    iFrame++;
    starTimer++;
    if (starTimer > 82) {
      starTimer = 0;
      spawnStar();
    }
    ctx.clearRect(0, 0, W, H);

    /* Layered background — warm violet-black */
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.44, 0, W * 0.5, H * 0.44, Math.max(W, H) * 0.82);
    bg.addColorStop(0, '#1A1420');
    bg.addColorStop(0.3, '#0E0B14');
    bg.addColorStop(0.65, '#080610');
    bg.addColorStop(1, '#020108');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Warm centre glow */
    const cg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.35);
    cg.addColorStop(0, 'rgba(201,169,110,.025)');
    cg.addColorStop(1, 'rgba(201,169,110,0)');
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, W, H);

    /* Horizon glow bands */
    [0.3, 0.5, 0.7].forEach((yf, i) => {
      const gy = H * yf;
      const gg = ctx.createLinearGradient(0, gy - 90, 0, gy + 90);
      gg.addColorStop(0, 'rgba(201,169,110,0)');
      gg.addColorStop(0.5, `rgba(201,169,110,${0.02 - i * 0.004})`);
      gg.addColorStop(1, 'rgba(201,169,110,0)');
      ctx.fillStyle = gg;
      ctx.fillRect(0, gy - 90, W, 180);
    });

    /* Waves */
    waves.forEach((wv) => {
      const wy = H * wv.yf;
      ctx.beginPath();
      ctx.moveTo(0, wy);
      for (let x = 0; x <= W; x += 2) {
        ctx.lineTo(x, wy + Math.sin(x * wv.freq + iFrame * wv.spd) * wv.amp);
      }
      ctx.strokeStyle = `rgba(201,169,110,${wv.a})`;
      ctx.lineWidth = wv.w;
      ctx.stroke();
    });

    /* Shooting stars */
    shooters.forEach((s) => {
      if (!s.active) return;
      s.x += s.vx;
      s.y += s.vy;
      s.a -= 0.015;
      if (s.a <= 0) {
        s.active = false;
        return;
      }
      const mag = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      const sg = ctx.createLinearGradient(
        s.x - s.vx * (s.len / mag),
        s.y - s.vy * (s.len / mag),
        s.x,
        s.y
      );
      sg.addColorStop(0, 'rgba(201,169,110,0)');
      sg.addColorStop(1, `rgba(245,228,192,${s.a})`);
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx * (s.len / mag), s.y - s.vy * (s.len / mag));
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = sg;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,228,192,${s.a})`;
      ctx.fill();
    });

    /* Embers */
    embers.forEach((e) => {
      e.y += e.vy;
      e.x += e.vx + Math.sin(iFrame * 0.022 + e.fl) * 0.32;
      e.fl += 0.02;
      if (e.y < -12) {
        e.y = H + 12;
        e.x = Math.random() * W;
      }
      const flicker = 0.6 + Math.sin(e.fl) * 0.4;
      const gr = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5.5);
      gr.addColorStop(0, `rgba(${e.col.join(',')},${e.a * flicker * 0.42})`);
      gr.addColorStop(1, `rgba(${e.col.join(',')},0)`);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * 5.5, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${e.col.join(',')},${e.a * flicker})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════════════════════════════
   2. PRELOADER
   A clean, architectural 0→100% progress line — roughly 2
   seconds total — that hands off into the main intro sequence.
   ════════════════════════════════════════════════════════════ */
function runPreloader() {
  return new Promise((resolve) => {
    /* Phase 1 — corner brackets + brand wordmark (0ms) */
    gsap.to('.plc', { opacity: 1, stagger: 0.06, duration: 0.3, ease: 'power3.out' });
    gsap.to('#pl-brand', { opacity: 1, y: 0, duration: 0.55, delay: 0.1, ease: 'power3.out' });

    /* Phase 2 — percentage / status row appears (200ms) */
    setTimeout(() => {
      gsap.to('#pl-meta', { opacity: 1, duration: 0.35, ease: 'power2.out' });
    }, 200);

    /* Phase 3 — line fills 0→100% over 1.3s (starts at 250ms) */
    const fill = $('pl-fill');
    const pct = $('pl-pct');
    const txt = $('pl-txt');
    const labels = ['Preparing Experience', 'Loading Assets', 'Almost Ready'];
    let t0 = null;
    const DURATION = 1300;

    function frame(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / DURATION, 1);
      /* Ease-out: starts fast, settles smoothly into 100% */
      const eased = 1 - Math.pow(1 - p, 2.2);
      const pctVal = Math.round(eased * 100);

      fill.style.width = pctVal + '%';
      $('pl-tip').style.left = pctVal + '%';
      pct.textContent = pctVal + '%';

      /* Status label cycles as progress advances */
      const labelIdx = Math.min(Math.floor(p * labels.length), labels.length - 1);
      if (txt.textContent !== labels[labelIdx]) {
        gsap.to(txt, {
          opacity: 0,
          duration: 0.1,
          onComplete: () => {
            txt.textContent = labels[labelIdx];
            gsap.to(txt, { opacity: 1, duration: 0.15 });
          },
        });
      }

      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        fill.style.width = '100%';
        pct.textContent = '100%';
        setTimeout(exitPreloader, 180);
      }
    }
    setTimeout(() => requestAnimationFrame(frame), 250);

    /* Exit — content fades, then 12 vertical blades slice upward */
    function exitPreloader() {
      gsap.to(['#pl-brand', '#pl-track', '#pl-meta', '.plc'], {
        opacity: 0,
        duration: 0.25,
        stagger: 0.015,
        ease: 'power2.in',
      });

      setTimeout(() => {
        const BLADE_COUNT = 12;
        for (let i = 0; i < BLADE_COUNT; i++) {
          const blade = document.createElement('div');
          blade.className = 'pl-bl';
          blade.style.left = (i / BLADE_COUNT) * 100 + '%';
          blade.style.width = 100 / BLADE_COUNT + 0.12 + '%';
          $('pl').appendChild(blade);

          gsap.fromTo(
            blade,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.48,
              delay: i * 0.022,
              ease: 'power4.inOut',
              onComplete:
                i === BLADE_COUNT - 1
                  ? () => {
                      $('pl').style.display = 'none';
                      resolve();
                    }
                  : null,
            }
          );
        }
      }, 200);
    }
  });
}

/* ════════════════════════════════════════════════════════════
   3. INTRO SEQUENCE  (~4.2 seconds)
   Corner HUD → light streak → letter-by-letter gold sweep
   reveal with particle sparks → glow pulse → film-rip exit
   → hero reveal.
   ════════════════════════════════════════════════════════════ */
async function runIntro() {
  /* 1. Corner brackets + eyebrow label */
  gsap.to('.i-cor', { opacity: 1, stagger: 0.06, duration: 0.35, delay: 0.1, ease: 'power3.out' });
  gsap.to('#i-skip', { opacity: 1, duration: 0.4, delay: 0.8 });

  /* 2. Light streak fires across the screen */
  await sleep(250);
  const streak = $('i-streak');
  streak.style.opacity = '1';
  streak.style.transition = 'left .85s cubic-bezier(.76,0,.24,1)';
  streak.style.left = '150%';
  setTimeout(() => {
    streak.style.opacity = '0';
  }, 800);

  /* 3. Eyebrow label fades in */
  $('i-pre').style.color = 'rgba(201,169,110,0.58)';

  await sleep(380);

  /* 4. Letters reveal — gold sweep beam + particle sparks per letter */
  const letters = qsa('.i-l');
  const sweep = $('gold-sweep');
  const sparkCanvas = $('ltr-sparks');
  sparkCanvas.width = window.innerWidth;
  sparkCanvas.height = window.innerHeight;
  const sparkCtx = sparkCanvas.getContext('2d');

  const sparks = [];

  function spawnSparks(x, y) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        r: 0.5 + Math.random() * 1.8,
        a: 0.9,
        life: 1,
        col: Math.random() > 0.5 ? [245, 228, 192] : [201, 169, 110],
      });
    }
  }

  let sparkRaf;
  function drawSparks() {
    sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    let alive = false;
    sparks.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08;
      s.life -= 0.028;
      s.a = Math.max(0, s.life);
      if (s.a <= 0) return;
      alive = true;
      const gr = sparkCtx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      gr.addColorStop(0, `rgba(${s.col.join(',')},${s.a * 0.8})`);
      gr.addColorStop(1, `rgba(${s.col.join(',')},0)`);
      sparkCtx.beginPath();
      sparkCtx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      sparkCtx.fillStyle = gr;
      sparkCtx.fill();
      sparkCtx.beginPath();
      sparkCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sparkCtx.fillStyle = `rgba(${s.col.join(',')},${s.a})`;
      sparkCtx.fill();
    });
    sparkCanvas.style.opacity = '1';
    if (alive) sparkRaf = requestAnimationFrame(drawSparks);
    else sparkCanvas.style.opacity = '0';
  }

  function getLetterCenter(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  /* First sweep — 1.0s left to right across the wordmark */
  sweep.style.opacity = '1';
  sweep.style.transition = 'none';
  sweep.style.left = '-60%';
  await sleep(16);
  sweep.style.transition = 'left 1.0s cubic-bezier(.4,0,.2,1)';
  sweep.style.left = '120%';

  /* Letters flip in with a tight 75ms stagger, lighting up + sparking as the sweep passes */
  letters.forEach((ch, i) => {
    setTimeout(() => {
      ch.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1),opacity .42s ease';
      ch.style.transform = 'translateY(0)';
      ch.style.opacity = '1';
      ch.classList.add('lit');
      setTimeout(() => ch.classList.remove('lit'), 450);
      const pos = getLetterCenter(ch);
      spawnSparks(pos.x, pos.y);
      cancelAnimationFrame(sparkRaf);
      drawSparks();
    }, 60 + i * 75);
  });

  await sleep(700);
  sweep.style.opacity = '0';

  /* 5. Quick second sweep + full-word glow pulse */
  sweep.style.transition = 'none';
  sweep.style.left = '-60%';
  sweep.style.opacity = '.65';
  await sleep(16);
  sweep.style.transition = 'left .7s cubic-bezier(.76,0,.24,1)';
  sweep.style.left = '120%';
  letters.forEach((ch) => ch.classList.add('lit'));
  await sleep(180);
  letters.forEach((ch) => ch.classList.remove('lit'));
  await sleep(120);
  sweep.style.opacity = '0';

  /* 6. Rule line grows + tagline fades in */
  gsap.to('#i-rule', { width: '210px', duration: 0.7, ease: 'power3.out' });
  await sleep(200);
  $('i-sub').style.color = 'rgba(201,169,110,0.6)';

  /* 7. Final glow pulse — brief hold before exit */
  await sleep(420);
  letters.forEach((ch) => ch.classList.add('lit'));
  await sleep(380);
  letters.forEach((ch) => ch.classList.remove('lit'));

  await sleep(320);

  /* 8. Film-rip exit — 18 alternating vertical panels */
  iRun = false;
  for (let i = 0; i < 18; i++) {
    const panel = document.createElement('div');
    panel.className = 'f-rip';
    panel.style.cssText = `left:${(i / 18) * 100}%;width:${100 / 18 + 0.1}%;`;
    $('intro').appendChild(panel);
    setTimeout(() => {
      panel.style.transition = `transform ${0.44 + (i % 4) * 0.05}s ${i * 0.016}s cubic-bezier(.76,0,.24,1)`;
      panel.style.transform = i % 2 === 0 ? 'translateY(-106%)' : 'translateY(106%)';
    }, 18);
  }

  /* Fade remaining intro text/effects during the rip */
  letters.forEach((ch) => {
    ch.style.opacity = '0';
    ch.style.transition = 'opacity .14s';
  });
  gsap.to(['#i-rule', '#i-pre', '#i-sub', '#gold-sweep', '#ltr-sparks'], { opacity: 0, duration: 0.2 });

  await sleep(380);

  /* 9. Cinematic gold flash (warm, not a harsh white) */
  const flashTimeline = gsap.timeline();
  flashTimeline
    .to('#i-flash', { opacity: 0.9, duration: 0.07, ease: 'power4.in' })
    .to('#i-flash', { opacity: 0, duration: 0.65, ease: 'power4.out' });

  await sleep(200);

  /* 10. Reveal the site underneath */
  gsap.to('#intro', {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
    onComplete: () => {
      $('intro').style.display = 'none';
    },
  });
  gsap.to('#site', { opacity: 1, duration: 0.5, ease: 'power2.out' });
  document.body.classList.remove('locked');

  /* 11. Hero's own cinematic entrance timeline */
  const heroTimeline = gsap.timeline({ delay: 0.12 });
  heroTimeline
    .to('nav', { opacity: 1, duration: 0.7, ease: 'power3.out' })
    .to('.h-eye', { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=.4')
    .to('.h-h1', { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out' }, '-=.55')
    .to('.h-rule', { width: '180px', duration: 0.8, ease: 'power3.out' }, '-=.5')
    .to('.h-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=.45')
    .to('.h-ctas', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=.4')
    .to('.e-lbl', { opacity: 1, y: 0, stagger: 0.07, duration: 0.65, ease: 'power3.out' }, '-=.55')
    .to('.h-scroll', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=.3');

  setTimeout(() => {
    $('replay').classList.add('on');
    $('i-skip').style.display = 'none';
  }, 1800);

  ScrollTrigger.refresh();
  initScrollAnims();
}

/* ════════════════════════════════════════════════════════════
   4. SCROLL-TRIGGERED ANIMATIONS
   Site-wide reveal choreography, run once after the intro
   completes (or immediately if the intro is skipped).
   ════════════════════════════════════════════════════════════ */
function initScrollAnims() {
  /* Gold underline bars draw in */
  gsap.utils.toArray('.s-bar').forEach((el) => {
    gsap.to(el, {
      width: '55px',
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  /* Eyebrow labels — clip-path wipe reveal */
  gsap.utils.toArray('.s-ey').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      }
    );
  });

  /* — About — */
  gsap.fromTo(
    '.ab-img',
    { x: -90, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.25, ease: 'power3.out', scrollTrigger: { trigger: '#about', start: 'top 82%' } }
  );
  gsap.fromTo(
    '.ab-h2',
    { y: 55, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.05,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 82%' },
    }
  );
  gsap.fromTo(
    '.ab-p',
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.16,
      delay: 0.35,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 82%' },
    }
  );
  gsap.fromTo(
    '.pills',
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      delay: 0.55,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 82%' },
    }
  );

  /* — Philosophy — */
  gsap.fromTo(
    '.ph-quote',
    { y: 70, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.45, ease: 'power3.out', scrollTrigger: { trigger: '#phil', start: 'top 78%' } }
  );
  gsap.fromTo(
    '.ph-div',
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.85,
      delay: 0.35,
      transformOrigin: 'center',
      ease: 'power3.out',
      scrollTrigger: { trigger: '#phil', start: 'top 78%' },
    }
  );
  gsap.fromTo(
    '.ph-sub',
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0.45,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#phil', start: 'top 78%' },
    }
  );

  /* — Menu — */
  gsap.fromTo(
    '.mn-h2',
    { y: 65, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: '#menu', start: 'top 85%' } }
  );
  gsap.fromTo(
    '.mc',
    { y: 55, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.95,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.mn-grid', start: 'top 85%' },
    }
  );

  /* — Gallery — */
  gsap.fromTo(
    '.gl-h2',
    { y: 65, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: '#gal', start: 'top 85%' } }
  );
  gsap.fromTo(
    '.gl-card',
    { y: 65, opacity: 0, scale: 0.94 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.12,
      duration: 1.05,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.gl-strip', start: 'top 85%' },
    }
  );

  /* — Experience / Stats — */
  gsap.fromTo(
    '.ex-h2',
    { x: -65, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: '#exp', start: 'top 82%' } }
  );
  gsap.fromTo(
    '.ex-p',
    { y: 42, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.95,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#exp', start: 'top 82%' },
    }
  );
  gsap.fromTo(
    '.ex-list li',
    { x: -32, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.85,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#exp', start: 'top 82%' },
    }
  );
  gsap.fromTo(
    '.stat',
    { y: 55, opacity: 0, scale: 0.9 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.1,
      duration: 1.05,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.stats',
        start: 'top 85%',
        onEnter: () => {
          /* Animate each statistic's number counting up on first reveal */
          qsa('[data-count]').forEach((el) => {
            const target = parseInt(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            gsap.to(
              { v: 0 },
              {
                v: target,
                duration: 1.9,
                ease: 'power2.inOut',
                onUpdate: function () {
                  el.textContent = Math.round(this.targets()[0].v) + suffix;
                },
              }
            );
          });
        },
      },
    }
  );

  /* — Press & Testimonials — */
  gsap.fromTo(
    '.pr-h2',
    { y: 55, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: '#press', start: 'top 85%' } }
  );
  gsap.fromTo(
    '.pr-logo',
    { y: 32, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.08,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.pr-logos', start: 'top 88%' },
    }
  );
  gsap.fromTo(
    '.t-card',
    { y: 55, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.12,
      duration: 1.05,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.t-grid', start: 'top 85%' },
    }
  );

  /* — Reserve — */
  gsap.fromTo(
    '.rv-h2',
    { x: -55, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.05,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#reserve', start: 'top 85%' },
    }
  );
  gsap.fromTo(
    '.form',
    { x: 65, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.05,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#reserve', start: 'top 85%' },
    }
  );
  gsap.fromTo(
    '.rv-list',
    { y: 35, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.95,
      delay: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#reserve', start: 'top 85%' },
    }
  );

  /* — Footer — */
  gsap.fromTo(
    '.f-logo',
    { y: 85, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: '#footer', start: 'top 85%' } }
  );
  gsap.fromTo(
    ['.f-tag', '.f-div', '.f-links', '.f-cta', '.f-copy'],
    { y: 32, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.12,
      duration: 0.95,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#footer', start: 'top 85%' },
    }
  );

  /* — Image parallax scrub (gallery cards + about photo) — */
  gsap.utils.toArray('.gl-bg,.ab-bg').forEach((el) => {
    gsap.to(el, {
      yPercent: -9,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
    });
  });
}
