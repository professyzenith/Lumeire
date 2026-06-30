/* ════════════════════════════════════════════════════════════
   LUMIÈRE — Fine Dining
   utils.js

   Global setup and tiny DOM helper shortcuts shared by every
   other script on the page. This file has ZERO dependencies and
   must be the very first script loaded — cursor.js, animations.js
   and main.js all rely on $, qs, qsa, sleep, and the registered
   ScrollTrigger plugin being available immediately.
   ════════════════════════════════════════════════════════════ */

/* Register the GSAP ScrollTrigger plugin once, globally */
gsap.registerPlugin(ScrollTrigger);

/* Shorthand DOM helpers used throughout every module */
const $ = (id) => document.getElementById(id);
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

/* Promise-based delay, used heavily by the async intro sequence
   in animations.js (e.g. `await sleep(250)`) */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
