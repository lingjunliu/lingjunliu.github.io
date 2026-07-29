/* Lingjun Liu — portfolio interactions */

(function () {
  'use strict';

  var root = document.documentElement;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------- theme ---------- */

  function effectiveTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function paintToggle() {
    var icon = document.querySelector('#theme-toggle i');
    if (!icon) return;
    var dark = effectiveTheme() === 'dark';
    icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    document.getElementById('theme-toggle')
      .setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) { /* private mode */ }

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      paintToggle();
    });
  }

  // Follow the system only while the user hasn't chosen explicitly.
  darkQuery.addEventListener('change', function () {
    if (!root.getAttribute('data-theme')) paintToggle();
  });

  paintToggle();

  /* ---------- mobile nav ---------- */

  var navBtn = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    navBtn.setAttribute('aria-expanded', 'false');
    navBtn.querySelector('i').className = 'fa-solid fa-bars';
  }

  if (navBtn && navLinks) {
    navBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navBtn.setAttribute('aria-expanded', String(open));
      navBtn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- publications toggle ---------- */

  var pubsBtn = document.getElementById('pubs-toggle');
  var pubsMore = document.getElementById('pubs-more');

  if (pubsBtn && pubsMore) {
    pubsBtn.addEventListener('click', function () {
      var open = pubsMore.classList.toggle('open');
      pubsBtn.setAttribute('aria-expanded', String(open));
      pubsBtn.textContent = open ? 'Show fewer publications' : 'Show all 12 publications';
    });
  }

  /* ---------- reveal on scroll ---------- */

  var revealables = document.querySelectorAll('.reveal');

  if (!window.IntersectionObserver ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- active nav link ---------- */

  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var linkFor = {};
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    linkFor[a.getAttribute('href').slice(1)] = a;
  });

  function markActive() {
    var pos = window.scrollY + 90;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    Object.keys(linkFor).forEach(function (id) {
      linkFor[id].classList.toggle('active', id === current);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      markActive();
      ticking = false;
    });
  }, { passive: true });

  markActive();
})();
