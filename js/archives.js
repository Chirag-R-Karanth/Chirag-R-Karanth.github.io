// archives.js — the personal library: media archive filtering + tiles.
// Runs only on pages that include #media-grid.

(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var grid = $('#media-grid');
  var filters = $('#media-filters');
  var count = $('#media-count');
  if (!grid || !window.SITE_DATA) return;

  var D = window.SITE_DATA;
  var stateLabel = { done: '✓ done', in: '▸ currently', backlog: '◇ backlog', wish: '✦ wishlist' };

  var activeType = null;      // null = all
  var favOnly = false;

  function tileHTML(m) {
    var t = D.mediaTypes[m.type] || m.type;
    var cls = 'media-tile mt-' + m.type;
    var fav = m.fav ? '<span class="mt-fav" aria-hidden="true">★</span>' : '';
    var note = m.note ? '<span class="mt-note">' + m.note + '</span>' : '';
    var meta = (stateLabel[m.state] || m.state) + ' · ' + (m.creator || '');
    return '' +
      '<button type="button" class="' + cls + '" aria-expanded="false" data-idx="">' +
        fav +
        '<span class="mt-type">' + t + '</span>' +
        '<span class="mt-title">' + m.title + '</span>' +
        '<span class="mt-meta">' + meta + '</span>' +
        note +
      '</button>';
  }

  function render() {
    var items = D.media.filter(function (m) {
      var okType = !activeType || m.type === activeType;
      var okFav = !favOnly || m.fav;
      return okType && okFav;
    });

    grid.innerHTML = items.map(tileHTML).join('');

    $$('.media-tile', grid).forEach(function (tile, i) {
      tile.dataset.idx = i;
      tile.addEventListener('click', function () {
        var open = tile.getAttribute('aria-expanded') === 'true';
        tile.setAttribute('aria-expanded', open ? 'false' : 'true');
        tile.classList.toggle('open', !open);
      });
    });

    count.textContent = items.length === D.media.length
      ? 'the whole shelf — ' + items.length + ' items'
      : 'showing ' + items.length + ' of ' + D.media.length + ' — the shop is open late tonight';
  }

  function buildFilters() {
    if (!filters) return;
    var order = ['book', 'game', 'anime', 'film', 'series'];
    var html = '<button type="button" class="mf-chip" data-type="" aria-pressed="true">All</button>';
    order.forEach(function (t) {
      html += '<button type="button" class="mf-chip" data-type="' + t + '" aria-pressed="false">' + (D.mediaTypes[t] || t) + '</button>';
    });
    html += '<button type="button" class="mf-chip" data-fav="1" aria-pressed="false">★ favourites</button>';
    filters.innerHTML = html;

    $('.mf-chip', filters).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var onType = chip.hasAttribute('data-type');
        var onFav = chip.hasAttribute('data-fav');
        $$('.mf-chip', filters).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });

        if (onType) {
          activeType = chip.dataset.type || null;
          if (onType && !activeType) favOnly = false;   // "All" resets favourites too
          chip.setAttribute('aria-pressed', 'true');
          if (favOnly) { var fc = $('.mf-chip[data-fav]', filters); if (fc) fc.setAttribute('aria-pressed', 'true'); }
        } else if (onFav) {
          favOnly = !favOnly;
          chip.setAttribute('aria-pressed', favOnly ? 'true' : 'false');
          if (activeType) { var tc = $('.mf-chip[data-type="' + activeType + '"]', filters); if (tc) tc.setAttribute('aria-pressed', 'true'); }
          else if (!favOnly) { var ac = $('.mf-chip[data-type=""]', filters); if (ac) ac.setAttribute('aria-pressed', 'true'); }
        }
        render();
      });
    });
  }

  buildFilters();
  render();
})();