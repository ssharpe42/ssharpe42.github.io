/* sharpestats — site behaviour (no dependencies) */
(function () {
  'use strict';
  var root = document.documentElement;
  var WIDE = '(min-width: 1240px)';
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('themeBtn');
  function isDark() {
    var cur = root.getAttribute('data-theme');
    if (cur) return cur === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function labelThemeBtn() {
    if (themeBtn) themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  }
  if (themeBtn) {
    labelThemeBtn();
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('theme', next);
      labelThemeBtn();
    });
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { labelThemeBtn(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ---------- Writing filters ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.filters'), function (group) {
    var head = group.closest('.block-head');
    var table = head && head.parentNode.querySelector('[data-log]');
    if (!table) return;
    var buttons = group.querySelectorAll('[data-filter]');
    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        Array.prototype.forEach.call(buttons, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        Array.prototype.forEach.call(table.querySelectorAll('tr[data-cat]'), function (tr) {
          tr.hidden = f !== 'all' && tr.getAttribute('data-cat') !== f;
        });
      });
    });
  });

  /* ---------- Copy link ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    var original = btn.textContent;
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-copy');
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = original; }, 1600); };
      var fail = function () { window.prompt('Copy this link:', url); };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, fail);
        else fail();
      } catch (e) { fail(); }
    });
  });

  var article = document.getElementById('article');
  if (!article) return;

  /* ---------- Wide tables scroll in their own box ---------- */
  Array.prototype.forEach.call(article.querySelectorAll('table'), function (t) {
    if (t.classList.contains('dt') || (t.parentNode && t.parentNode.classList && t.parentNode.classList.contains('table-wrap'))) return;
    var w = document.createElement('div');
    w.className = 'table-wrap';
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });

  /* ---------- Sidenotes from kramdown footnotes ---------- */
  var footnotes = article.querySelector('.footnotes');
  if (footnotes) {
    var refs = article.querySelectorAll('sup[role="doc-noteref"], sup[id^="fnref"]');
    var seen = {}, allPlaced = refs.length > 0;
    Array.prototype.forEach.call(refs, function (sup) {
      var a = sup.querySelector('a[href^="#fn"]');
      if (!a) return;
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      if (seen[id]) return;
      var li = document.getElementById(id);
      var host = sup.closest('p, li, blockquote');
      if (!li || !host || sup.closest('table, h1, h2, h3, h4, h5, h6, .footnotes')) { allPlaced = false; return; }
      seen[id] = true;
      var note = document.createElement('span');
      note.className = 'sidenote';
      note.setAttribute('role', 'note');
      var n = document.createElement('span');
      n.className = 'n';
      n.textContent = a.textContent.trim();
      note.appendChild(n);
      var blocks = li.children.length ? li.children : [li];
      Array.prototype.forEach.call(blocks, function (block, i) {
        if (i > 0) note.appendChild(document.createTextNode(' '));
        Array.prototype.forEach.call(block.childNodes, function (node) {
          if (node.nodeType === 1 && node.classList.contains('reversefootnote')) return;
          note.appendChild(node.cloneNode(true));
        });
      });
      sup.parentNode.insertBefore(note, sup.nextSibling);
    });
    if (allPlaced) {
      article.classList.add('has-sidenotes');
      var prev = footnotes.previousElementSibling;
      if (prev && /^H[2-6]$/.test(prev.tagName)) prev.classList.add('fn-heading');
    }
  }

  /* ---------- Table of contents ---------- */
  var toc = document.getElementById('toc');
  if (toc && article.getAttribute('data-toc') !== 'false') {
    var heads = Array.prototype.filter.call(article.querySelectorAll('h2, h3, h4, h5, h6'), function (h) {
      if (h.closest('.footnotes, blockquote, table, figure')) return false;
      var next = h.nextElementSibling;
      if (next && next.classList.contains('footnotes')) { h.classList.add('fn-heading'); return false; }
      return h.textContent.trim() !== '';
    });
    var levels = [];
    heads.forEach(function (h) { var l = +h.tagName[1]; if (levels.indexOf(l) < 0) levels.push(l); });
    levels.sort();
    var top = levels[0], sub = levels[1];
    heads = heads.filter(function (h) { var l = +h.tagName[1]; return l === top || l === sub; });

    if (heads.length >= 3) {
      var used = {};
      Array.prototype.forEach.call(document.querySelectorAll('[id]'), function (el) { used[el.id] = true; });
      var nav = toc.querySelector('nav');
      var links = heads.map(function (h) {
        if (!h.id) {
          var base = h.textContent.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60) || 'section';
          var slug = base, i = 2;
          while (used[slug]) slug = base + '-' + i++;
          used[slug] = true;
          h.id = slug;
        }
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent.trim();
        if (+h.tagName[1] !== top) a.className = 'sub';
        nav.appendChild(a);
        return a;
      });
      var details = toc.querySelector('details');
      var wide = window.matchMedia ? matchMedia(WIDE) : { matches: true };
      var syncOpen = function () { details.open = !!wide.matches; };
      syncOpen();
      if (wide.addEventListener) wide.addEventListener('change', syncOpen); else if (wide.addListener) wide.addListener(syncOpen);
      toc.hidden = false;

      nav.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (!a) return;
        var target = document.getElementById(a.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
        if (!wide.matches) details.open = false;
      });

      var ticking = false;
      var update = function () {
        ticking = false;
        var idx = 0;
        for (var i = 0; i < heads.length; i++) {
          if (heads[i].getBoundingClientRect().top < 140) idx = i; else break;
        }
        links.forEach(function (a, i) {
          var on = i === idx;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      update();
    }
  }

  /* ---------- Lightbox ---------- */
  var lastFocus = null;
  function closeLightbox() {
    var box = document.querySelector('.lightbox');
    if (!box) return;
    box.parentNode.removeChild(box);
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function openLightbox(img) {
    closeLightbox();
    lastFocus = img;
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Enlarged image (press Escape to close)');
    box.tabIndex = -1;
    var big = document.createElement('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || '';
    box.appendChild(big);
    box.addEventListener('click', closeLightbox);
    document.body.appendChild(box);
    document.body.style.overflow = 'hidden';
    box.focus();
  }
  Array.prototype.forEach.call(article.querySelectorAll('img'), function (img) {
    if (img.closest('a')) return;
    img.classList.add('js-zoom');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge image' + (img.alt ? ': ' + img.alt : ''));
  });
  article.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('img.js-zoom');
    if (img) openLightbox(img);
  });
  article.addEventListener('keydown', function (e) {
    var img = e.target.closest && e.target.closest('img.js-zoom');
    if (img && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLightbox(img); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') closeLightbox();
  });
})();
