/* ════════════════════════════════════════════════════════════
   LUMIÈRE — Fine Dining
   cursor.js

   Custom dual-layer cursor: a small solid dot that tracks the
   mouse instantly, and a larger ring that trails behind it with
   eased interpolation. The ring also expands on hover over any
   interactive element (handled via the body.hov class, styled
   in style.css).

   This file is self-contained and has no dependencies on the
   other modules — it can be loaded independently of intro/scroll
   logic and will still function correctly.
   ════════════════════════════════════════════════════════════ */

let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;

/* Dot follows the raw mouse position every frame */
document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  gsap.set('#c-dot', { x: mx, y: my });
});

/* Ring eases toward the mouse position for a soft trailing feel */
gsap.ticker.add(() => {
  rx = gsap.utils.interpolate(rx, mx, 0.12);
  ry = gsap.utils.interpolate(ry, my, 0.12);
  gsap.set('#c-ring', { x: rx, y: ry });
});

/* Expand the ring and trigger the hover state on any interactive element */
document
  .querySelectorAll('a, button, .mc, .gl-card, .stat, .pill, .pr-logo')
  .forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });
