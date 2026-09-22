// photography.js — unified photo + video archive: gallery, lightbox, place chips,
// map with clusters + drill-down, and GPS from EXIF where the JPEG carries it.

(function () {
  'use strict';

  var grid = document.getElementById('photo-grid');
  var emptyMsg = document.getElementById('photo-empty');
  var chipsBox = document.getElementById('place-chips');
  var mapBox = document.getElementById('photo-map-box');
  var mapEl = document.getElementById('photo-map');
  var lightbox = document.getElementById('lightbox');
  if (!grid || !window.SITE_DATA) return;

  var D = window.SITE_DATA;
  var photos = D.photos;
  var activePlace = null;   // null = all places
  var view = 'gallery';

  var map = null, mapInit = false, indivLayers = {}, placeMarkers = {};

  function visibleList() {
    return activePlace ? photos.filter(function (p) { return p.place === activePlace; }) : photos;
  }

  /* ---------- place chips ---------- */

  function buildChips() {
    if (!chipsBox) return;
    var places = Object.keys(D.places);
    var html = '<button type="button" class="place-chip" data-place="" aria-pressed="true">Everywhere</button>';
    places.forEach(function (k) {
      var n = photos.filter(function (p) { return p.place === k; }).length;
      html += '<button type="button" class="place-chip" data-place="' + k + '" aria-pressed="false">' +
        D.places[k].name + ' <span class="p-count">' + n + '</span></button>';
    });
    chipsBox.innerHTML = html;
    Array.prototype.slice.call(chipsBox.querySelectorAll('.place-chip')).forEach(function (chip) {
      chip.addEventListener('click', function () { selectPlace(chip.dataset.place || null); });
    });
  }

  function selectPlace(place) {
    activePlace = place;
    Array.prototype.slice.call(chipsBox.querySelectorAll('.place-chip')).forEach(function (c) {
      c.setAttribute('aria-pressed', c.dataset.place === (activePlace || '') ? 'true' : 'false');
    });
    renderGallery();
    if (mapInit) mapFocus();
  }

  /* ---------- gallery ---------- */

  function renderGallery() {
    var list = visibleList();
    grid.innerHTML = list.map(function (p, i) { return photoItem(activeIdx(i), p); }).join('');
    emptyMsg.hidden = list.length !== 0;

    Array.prototype.slice.call(grid.querySelectorAll('.photo-item')).forEach(function (fig) {
      fig.addEventListener('click', function () { openLightbox(Number(fig.dataset.idx)); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(Number(fig.dataset.idx)); }
      });
    });
  }

  function activeIdx(i) {
    var list = visibleList();
    return list[i];
  }

  function photoItem(photo, p) {
    var src = p.src || p.poster || '';
    var isVid = p.type === 'video';
    var badge = isVid ? '<span class="photo-badge">video</span>' : '';
    var where = D.places[p.place] ? D.places[p.place].name : p.place;
    var meta = where + ' · ' + (p.date || '') + ' · ' + (p.cam || '') + (p.lens ? ' · ' + p.lens : '');
    return '' +
      '<figure class="photo-item" data-idx="' + photos.indexOf(p) + '" tabindex="0" role="button" ' +
        'aria-label="' + p.title + ' — ' + meta + '">' +
        badge +
        '<img loading="lazy" decoding="async" src="' + src + '" alt="' + p.title + '">' +
        '<figcaption class="photo-cap"><span class="p-title">' + p.title + '</span>' +
        '<span class="p-meta">' + where + ' · ' + (p.date || '—') + '</span></figcaption>' +
      '</figure>';
  }

  /* ---------- view switch (gallery / map) ---------- */

  Array.prototype.slice.call(document.querySelectorAll('.view-switch button')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      view = btn.dataset.view;
      Array.prototype.slice.call(document.querySelectorAll('.view-switch button')).forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      grid.hidden = view !== 'gallery';
      emptyMsg.hidden = view !== 'gallery' || visibleList().length !== 0;
      if (view === 'map') {
        mapBox.hidden = false;
        if (!mapInit) initializeMap();
        else { map.invalidateSize(); mapFocus(); }
      } else {
        mapBox.hidden = true;
      }
    });
  });

  /* ---------- lightbox ---------- */

  var lbState = { idx: 0 };
  function openLightbox(i) {
    var list = visibleList();
    if (!list.length) return;
    lbState.idx = list.indexOf(photos[i] || list[0]);
    lbState.idx = Math.max(0, lbState.idx);
    showLb(list);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function showLb(list) {
    if (!list.length) return;
    var p = list[lbState.idx];
    var stage = document.getElementById('lb-stage');
    var src = p.src || p.poster || '';
    var html = '';
    if (p.type === 'video') {
      html = p.src
        ? '<video controls playsinline preload="none"><source src="' + p.src + '"></video>'
        : '<img src="' + src + '" alt="' + p.title + ' — no clip added yet">';
    } else {
      html = '<img src="' + src + '" alt="' + p.title + '">';
    }
    stage.innerHTML = html;
    var where = D.places[p.place] ? D.places[p.place].name : p.place;
    document.getElementById('lb-title').textContent = p.title;
    document.getElementById('lb-meta').textContent =
      where + ' · ' + (p.date || '') + (p.cam ? ' · ' + p.cam : '') + (p.lens ? ' · ' + p.lens : '') + (p.ex ? ' · ' + p.ex : '');
  }

  function step(d) {
    var list = visibleList();
    if (!list.length) return;
    lbState.idx = (lbState.idx + d + list.length) % list.length;
    showLb(list);
  }

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  Array.prototype.forEach.call(document.querySelectorAll('.lb-close, .lb-next, .lb-prev'), function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('lb-close')) closeLb();
      else step(btn.classList.contains('lb-next') ? 1 : -1);
    });
  });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });

  window.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  // touch swipe
  var tStart = null;
  lightbox.addEventListener('touchstart', function (e) {
    tStart = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (tStart === null) return;
    var dx = e.changedTouches[0].clientX - tStart;
    if (Math.abs(dx) > 44) step(dx < 0 ? 1 : -1);
    tStart = null;
  }, { passive: true });

  /* ---------- map ---------- */

  function coordsFor(p) {
    return { lat: p.lat, lng: p.lng };
  }

  function initializeMap() {
    if (mapInit) return;
    if (typeof window.L === 'undefined') {
      mapBox.innerHTML = '<p class="photo-empty">Map tiles unavailable right now (offline?) — the gallery below still works fine.</p>';
      mapInit = true;
      return;
    }
    var L = window.L;
    var dark = document.documentElement.dataset.side === 'blacklight';
    var tileUrl = dark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    map = L.map(mapEl, { zoomControl: true, attributionControl: true });
    L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    map.setView([14.40, 75.60], 6);

    // city cluster markers
    Object.keys(D.places).forEach(function (k) {
      var pt = D.places[k];
      var n = photos.filter(function (p) { return p.place === k; }).length;
      if (!n) return;
      var icon = L.divIcon({
        className: '',
        html: '<span class="place-marker">' + pt.name + ' <span class="m-count">' + n + '</span></span>',
        iconSize: null,
        iconAnchor: [36, 20]
      });
      placeMarkers[k] = L.marker([pt.lat, pt.lng], { icon: icon })
        .on('click', function () { selectPlace(k); })
        .addTo(map);
    });

    // individual photo markers (one set per place, shown on drill-down)
    Object.keys(D.places).forEach(function (k) {
      var layer = L.layerGroup();
      photos.filter(function (p) { return p.place === k; }).forEach(function (p) {
        var c = coordsFor(p);
        if (c.lat == null || c.lng == null) return;
        var icon = L.divIcon({ className: '', html: '<span class="photo-marker"></span>', iconSize: [14, 14], iconAnchor: [7, 7] });
        var m = L.marker([c.lat, c.lng], { icon: icon }).bindTooltip(p.title + (p.date ? ' · ' + p.date : ''), { offset: [0, -10] });
        m.on('click', function () { openLightbox(photos.indexOf(p)); });
        layer.addLayer(m);
      });
      indivLayers[k] = layer;
    });

    if (activePlace) mapFocus();
    mapInit = true;
    setTimeout(function () { map.invalidateSize(); }, 260);
  }

  function mapFocus() {
    if (!map) return;
    Object.keys(indivLayers).forEach(function (k) {
      if (k === activePlace) indivLayers[k].addTo(map); else map.removeLayer(indivLayers[k]);
    });
    if (activePlace) {
      var pt = D.places[activePlace];
      map.flyTo([pt.lat, pt.lng], 11, { duration: 1.1 });
    } else {
      map.flyTo([14.40, 75.60], 6, { duration: 1.1 });
    }
  }

  /* ---------- EXIF GPS (real JPEGs) ---------- */

  function exifGeo(url) {
    return fetch(url)
      .then(function (r) { return r.arrayBuffer(); })
      .then(function (buf) { return parseExifGps(buf); })
      .catch(function () { return null; });
  }

  function parseExifGps(buf) {
    var view = new DataView(buf);
    if (view.byteLength < 4 || view.getUint16(0, false) !== 0xFFD8) return null;
    var off = 2;
    while (off + 4 <= view.byteLength) {
      var marker = view.getUint16(off, false);
      if (marker === 0xFFD8) { off += 2; continue; }
      if ((marker & 0xFF00) !== 0xFF00) break;
      var size = view.getUint16(off + 2, false);
      if (marker === 0xFFE1) {
        var t = off + 4;
        if (t + 6 <= view.byteLength &&
            buf[t] === 0x45 && buf[t + 1] === 0x78 && buf[t + 2] === 0x69 && buf[t + 3] === 0x66 &&
            buf[t + 4] === 0 && buf[t + 5] === 0) {
          return parseTIFF(view, t + 6);
        }
      }
      off += 2 + size;
    }
    return null;
  }

  function parseTIFF(view, base) {
    if (base + 8 > view.byteLength) return null;
    var little = view.getUint16(base, false) === 0x4949;
    var ifd0 = base + view.getUint32(base + 4, little);
    if (ifd0 + 2 > view.byteLength) return null;
    var gpsOff = null;
    var n = view.getUint16(ifd0, little);
    for (var i = 0; i < n; i++) {
      var e = ifd0 + 2 + i * 12;
      if (e + 12 > view.byteLength) break;
      if (view.getUint16(e, little) === 0x8825) { gpsOff = base + view.getUint32(e + 8, little); break; }
    }
    if (gpsOff === null || gpsOff + 2 > view.byteLength) return null;

    function rat(off) {
      var d = 0;
      for (var k = 0; k < 3; k++) {
        var num = view.getUint32(off + 8 * k, little);
        var den = view.getUint32(off + 8 * k + 4, little);
        d += (den ? num / den : 0) / (k === 0 ? 1 : (k === 1 ? 60 : 3600));
      }
      return d;
    }

    var lat = null, lng = null, latRef = 'N', lngRef = 'E';
    var gn = view.getUint16(gpsOff, little);
    for (var i2 = 0; i2 < gn; i2++) {
      var ge = gpsOff + 2 + i2 * 12;
      if (ge + 12 > view.byteLength) break;
      var tag = view.getUint16(ge, little);
      var val = view.getUint32(ge + 8, little);
      if (tag === 1) { var b = base + val; if (b < view.byteLength) latRef = String.fromCharCode(view.getUint8(b)); }
      else if (tag === 2) { lat = rat(base + val); }
      else if (tag === 3) { var b2 = base + val; if (b2 < view.byteLength) lngRef = String.fromCharCode(view.getUint8(b2)); }
      else if (tag === 4) { lng = rat(base + val); }
    }
    if (lat === null || lng === null) return null;
    if (latRef === 'S') lat = -lat;
    if (lngRef === 'W') lng = -lng;
    return { lat: lat, lng: lng };
  }

  // enrich real JPEGs from their EXIF GPS before the map first renders
  function enrichInPlace() {
    var jobs = [];
    photos.forEach(function (p) {
      if (/\.jpe?g$/i.test(p.src || '')) {
        jobs.push(exifGeo(p.src).then(function (geo) {
          if (geo && geo.lat != null) { p.lat = geo.lat; p.lng = geo.lng; }
        }).catch(function () {}));
      }
    });
    return Promise.all(jobs);
  }

  /* ---------- boots ---------- */

  buildChips();
  renderGallery();
  enrichInPlace().then(function () {
    if (mapInit) mapFocus();   // refresh pins with real coordinates
  });
})();