// main.js — shared behaviour for both sides: nav, reveals, portraits,
// ink/doodles, the Light ↔ Blacklight transform, and the expand-everything dialog.

(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var isDark = document.documentElement.dataset.side === 'blacklight';

  // without an IntersectionObserver the scroll-reveal must never hide content
  if (!('IntersectionObserver' in window)) document.documentElement.classList.add('no-io');

  function ready(fn) {
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ---------- footer year ---------- */
  ready(function () {
    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  });

  /* ---------- scroll reveal + ink/doodle drawing ---------- */

  function inkify(ink) {
    ink.forEach(function (m) {
      var path = m.querySelector('path, line');
      if (path) {
        try { var len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len; }
        catch (e) { /* leave CSS defaults */ }
      }
    });
  }
  function doodleify(d) {
    d.forEach(function (el) {
      $$('path', el).forEach(function (p) {
        try { var len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; }
        catch (e) { /* ignore */ }
      });
    });
  }

  ready(function () {
    inkify($$('.ink'));
    doodleify($$('.doodle'));
    if (isDark || document.documentElement.classList.contains('arriving')) {
      // Blacklight: ink is part of the visual identity — draw it in soon after load.
      setTimeout(function () {
        $$('.ink').forEach(function (m) { m.classList.add('drawn'); });
      }, 350);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        if (el.classList.contains('rv') || el.matches('section')) el.classList.add('is-visible');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    $$('.rv, .rv-fade, section[id], .marginnote').forEach(function (el) { io.observe(el); });

    // doodles draw themselves once their section appears
    var doio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('drawn');
        doio.unobserve(en.target);
      });
    }, { threshold: 0.3 });
    $$('.doodle').forEach(function (d) { doio.observe(d); });
  });

  /* ---------- nav scroll spy ---------- */
  ready(function () {
    var links = $$('.head-nav a[href^="#"]');
    if (!links.length) return;
    var ids = links.map(function (a) { return a.getAttribute('href').slice(1); });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + id;
          a.setAttribute('aria-current', on ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-38% 0px -55% 0px' });
    ids.forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  });

  /* ---------- portrait (scroll-shrink corner toggle) ---------- */
  ready(function () {
    var tracker = $('#side-tracker');
    if (!tracker) return;

    function setP(p) {
      document.documentElement.style.setProperty('--tracker-p', p.toFixed(2));
    }

    if (!reduced.matches && fine) {
      tracker.classList.add('is-fixed');
      function onScroll() {
        var p = clamp(window.scrollY / (window.innerHeight * 0.95), 0, 1);
        setP(p);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      setP(0);
    } else {
      // touch / reduced motion: static portrait, tracker caption stays put
      setP(0);
    }
  });

  /* ---------- Light ↔ Blacklight transition (Star Wars Hyperdrive) ---------- */

  function runTransition(href) {
    if (reduced.matches || typeof window.hyperspaceJump !== 'function') {
      window.location.href = href;
      return;
    }
    window.hyperspaceJump(href);
  }

  function bindSideSwitch() {
    $$('[data-switch], #side-tracker, .foot-note a[href$="blacklight.html"], .foot-note a[href$="index.html"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var href = el.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        runTransition(href);
      });
    });
  }

  /* ---------- arrival (the destination half of the transform) ---------- */
  ready(function () {
    if (document.documentElement.classList.contains('arriving')) {
      var wash = $('#side-wash');
      if (wash) {
        // start fully covered, then let the wash retract and reveal us
        var toDark = isDark;
        wash.style.setProperty('--swash', toDark ? '#f6f1e8' : '#16151b');
        wash.style.setProperty('--ox', '50%');
        wash.style.setProperty('--oy', '50%');
        wash.style.clipPath = 'circle(160% at 50% 50%)';
        wash.style.transition = 'none';
        void wash.offsetHeight;
        requestAnimationFrame(function () {
          wash.style.transition = 'clip-path .55s var(--ease)';
          wash.style.clipPath = 'circle(0% at 50% 50%)';
        });
        setTimeout(function () { document.documentElement.classList.remove('arriving'); }, 700);
      } else {
        document.documentElement.classList.remove('arriving');
      }
    }
  });

  /* ---------- project dialog (expand-everything) ---------- */
  ready(function () {
    var dialog = $('#project-dialog');
    var body = $('#pd-body');
    var title = $('#pd-title');
    if (!dialog || !body) return;

    function openProject(card) {
      var detail = $('.project-detail', card);
      if (!detail) return;
      var h = $('h3', card);
      var clone = detail.cloneNode(true);
      clone.hidden = false;
      body.innerHTML = '';
      body.appendChild(clone);
      var t = h ? h.cloneNode(true) : document.createElement('span');
      var num = $('.proj-num', t);
      if (num) t.removeChild(num);
      title.textContent = t.textContent.replace(/\s+/g, ' ').trim();
      dialog.showModal();
      body.scrollTop = 0;
    }

    $$('.project-open').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.project');
        if (card) openProject(card);
      });
    });

    $$('.head-nav a[href="#projects"]').forEach(function (nav) {
      nav.addEventListener('click', function (e) {
        // reveal is handled by scroll spy; nothing extra needed
        void e;
      });
    });

    var close = $('.dialog-close');
    if (close) close.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });

    // handwritten field notes inside dialogs
    body.addEventListener('click', function (e) {
      var b = e.target.closest('.pd-notes-btn');
      if (!b) return;
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      var nb = b.nextElementSibling;
      if (nb) nb.classList.toggle('open', open);
    });

    // keyboard shortcut handled natively by <dialog> (Esc). Focus the panel for a11y.
    dialog.addEventListener('close', function () {
      title.textContent = '';
      body.innerHTML = '';
    });
  });

  /* ---------- skill → evidence ---------- */
  ready(function () {
    var panel = $('#skill-evidence');
    var chips = $$('.skill-chip');
    if (!chips.length) return;
    if (!panel || !$$('.project').length) {
      // skills and projects live on separate pages now — send visitors over
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () { window.location.href = 'projects.html'; });
      });
      return;
    }
    var list = $('#ev-list');
    var h4 = $('#ev-title');

    function projectsFor(skill) {
      return $$('.project').filter(function (p) {
        var tech = (p.dataset.tech || '').split(',');
        return tech.indexOf(skill) !== -1;
      });
    }

    function evidencePill(proj) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ev-pill';
      b.textContent = proj.querySelector('h3').textContent.replace(/\s+/g, ' ').trim();
      b.addEventListener('click', function () {
        var open = $('.project-open', proj);
        if (open) open.click();
      });
      return b;
    }

    $$('.skill-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var skill = chip.dataset.skill;
        var hit = projectsFor(skill);
        var pressed = chip.getAttribute('aria-pressed') === 'true';

        $$('.skill-chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });

        if (pressed || !hit.length) {       // re-click closes
          panel.hidden = true;
          return;
        }
        chip.setAttribute('aria-pressed', 'true');
        panel.hidden = false;
        h4.textContent = hit.length + ' place(s) ' + skill + ' actually shows up:';
        list.innerHTML = '';
        hit.forEach(function (p) { list.appendChild(evidencePill(p)); });
        panel.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'nearest' });
      });
    });
  });

  bindSideSwitch();
})();