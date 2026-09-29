/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   map.js — Explore Map (map.html)

   - Leaflet (loaded from unpkg) + Canada Basemap – Transportation
     tiles from Natural Resources Canada (Open Government Licence –
     Canada; no key, no backend: works on GitHub Pages and from disk).
   - List + map are one interface: hovering a row highlights its
     marker, selecting a row or a marker opens the same card.
   - Filters: world (category) × region, combined. No reload.
   - URL state (shareable, also used by the Home and the quiz):
       map.html?region=niagara
       map.html?category=nature        (also food / entertainment)
       map.html?experience=algonquin   (short id or page anchor)
       map.html?experiences=cntower,rom,stlawrence&from=trip
                                       (a selection: trip, favourites,
                                       season; filters work inside it)
   - Nearby markers are grouped into a numbered circle when
     they would overlap (simple pixel clustering, no plugin).
     The selected experience is never grouped.
   If Leaflet cannot load (offline), the list, filters and card
   still work and a short notice replaces the map.
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const DATA = window.OTE_EXPERIENCES;
  if (!I18N || !DATA) return;

  I18N.extend({
    en: {
      'title.map': 'Explore Map — Ontario Tourism Experiences',
      'meta.map': 'Interactive map of the 24 Ontario experiences of this guide, filterable by world and region.',
      'map.eyebrow': 'Explore Ontario',
      'map.title': 'Where will<br><em>you go next?</em>',
      'map.lede': 'The 24 experiences of this guide on a real map of Ontario. Filter by world or region, pick a place from the list or the map and see what is nearby.',
      'map.s1': 'Experiences',
      'map.s2': 'Regions',
      'map.s3': 'Worlds',
      'map.filters': 'Filter the experiences',
      'map.world': 'World',
      'map.region': 'Region',
      'map.all': 'All',
      'map.allRegions': 'All regions',
      'map.results': 'Experiences on the map',
      'map.empty': 'No experience matches this combination.',
      'map.reset': 'Show all',
      'map.clear': 'Clear filters',
      'map.close': 'Close',
      'map.explore': 'Explore this experience',
      'map.nearby': 'Nearby · straight-line distance',
      'map.km': '{n} km',
      'map.attribution': 'Base map © <a href="https://natural-resources.canada.ca/" target="_blank" rel="noopener">Natural Resources Canada</a> · Contains information licensed under the <a href="https://open.canada.ca/en/open-government-licence-canada" target="_blank" rel="noopener">Open Government Licence – Canada</a> · <a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>',
      'map.attrFooter': 'Map: Canada Base Map – Transportation © <a href="https://natural-resources.canada.ca/" target="_blank" rel="noopener">Natural Resources Canada</a>. Contains information licensed under the <a href="https://open.canada.ca/en/open-government-licence-canada" target="_blank" rel="noopener">Open Government Licence – Canada</a> · <a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>',
      'map.group': '{n} experiences here — zoom in',
      'map.mapLabel': 'Interactive map of Ontario with the 24 experiences',
      'map.listLabel': 'List of experiences',
      'map.cardLabel': 'Selected experience',
      'map.offline': 'The map could not be loaded (no connection). The list and filters still work.',
      'map.keyboard': 'Use the list to move between experiences; the map can be panned with the arrow keys.',
      'map.fromQuiz': 'Your Ontario',
      'map.tiles': 'Map data',
      'map.set.trip': 'Your trip',
      'map.set.favourites': 'Your favourites',
      'map.set.season': 'Seasonal selection',
      'map.set.custom': 'Selection',
      'map.set.showAll': 'Show all 24'
    },
    es: {
      'title.map': 'Explorar mapa — Experiencias Turísticas de Ontario',
      'meta.map': 'Mapa interactivo de las 24 experiencias de Ontario de esta guía, con filtros por mundo y región.',
      'map.eyebrow': 'Explorar Ontario',
      'map.title': '¿A dónde<br><em>irás ahora?</em>',
      'map.lede': 'Las 24 experiencias de esta guía sobre un mapa real de Ontario. Filtra por mundo o región, elige un lugar en la lista o en el mapa y descubre qué hay cerca.',
      'map.s1': 'Experiencias',
      'map.s2': 'Regiones',
      'map.s3': 'Mundos',
      'map.filters': 'Filtrar las experiencias',
      'map.world': 'Mundo',
      'map.region': 'Región',
      'map.all': 'Todos',
      'map.allRegions': 'Todas las regiones',
      'map.results': 'Experiencias en el mapa',
      'map.empty': 'Ninguna experiencia coincide con esta combinación.',
      'map.reset': 'Ver todas',
      'map.clear': 'Quitar filtros',
      'map.close': 'Cerrar',
      'map.explore': 'Conocer esta experiencia',
      'map.nearby': 'Cerca · distancia en línea recta',
      'map.km': '{n} km',
      'map.attribution': 'Mapa base © <a href="https://natural-resources.canada.ca/" target="_blank" rel="noopener">Natural Resources Canada</a> · Contiene información con licencia de la <a href="https://open.canada.ca/en/open-government-licence-canada" target="_blank" rel="noopener">Open Government Licence – Canada</a> · <a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>',
      'map.attrFooter': 'Mapa: Canada Base Map – Transportation © <a href="https://natural-resources.canada.ca/" target="_blank" rel="noopener">Natural Resources Canada</a>. Contiene información con licencia de la <a href="https://open.canada.ca/en/open-government-licence-canada" target="_blank" rel="noopener">Open Government Licence – Canada</a> · <a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>',
      'map.group': '{n} experiencias aquí — acerca el mapa',
      'map.mapLabel': 'Mapa interactivo de Ontario con las 24 experiencias',
      'map.listLabel': 'Lista de experiencias',
      'map.cardLabel': 'Experiencia seleccionada',
      'map.offline': 'No se pudo cargar el mapa (sin conexión). La lista y los filtros siguen funcionando.',
      'map.keyboard': 'Usa la lista para moverte entre experiencias; el mapa se puede desplazar con las flechas del teclado.',
      'map.fromQuiz': 'Tu Ontario',
      'map.tiles': 'Datos del mapa',
      'map.set.trip': 'Tu viaje',
      'map.set.favourites': 'Tus favoritos',
      'map.set.season': 'Selección de temporada',
      'map.set.custom': 'Selección',
      'map.set.showAll': 'Ver las 24'
    }
  });

  const doc = document;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CAT_ALIASES = { food: 'flavours', entertainment: 'adventure', flavors: 'flavours' };
  const REGION_ALIASES = { blue: 'blue-mountains', 'blue-mountain': 'blue-mountains', gta: 'toronto' };
  const CLUSTER_PX = 44;

  const SET_SOURCES = ['trip', 'favourites', 'season'];

  const state = { cat: 'all', region: 'all', selected: null, fromQuiz: false, set: null, setFrom: null };
  let map = null;
  let layer = null;
  const markerOf = {};                 // experience id → marker that shows it (own or group)
  let els = {};

  const t = (k, v) => I18N.t(k, v);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------------------------------------------------
     STATE ⇄ URL
     --------------------------------------------------------- */
  function readUrl() {
    const p = new URLSearchParams(window.location.search);
    let cat = (p.get('category') || '').toLowerCase();
    cat = CAT_ALIASES[cat] || cat;
    let region = (p.get('region') || '').toLowerCase();
    region = REGION_ALIASES[region] || region;
    if (DATA.categories[cat]) state.cat = cat;
    if (DATA.regions[region]) state.region = region;
    // A selection of experiences (from the planner, favourites or seasons)
    const set = [];
    (p.get('experiences') || '').split(',').forEach((v) => {
      const e = DATA.find(v.trim());
      if (e && !set.includes(e.id)) set.push(e.id);
    });
    if (set.length) {
      state.set = set;
      state.setFrom = SET_SOURCES.includes(p.get('from')) ? p.get('from') : null;
    }
    const exp = DATA.find(p.get('experience'));
    if (exp && state.set && !state.set.includes(exp.id)) state.set.push(exp.id);
    if (exp) {
      state.selected = exp.id;
      state.fromQuiz = p.get('from') === 'quiz' || /find-your-ontario/.test(doc.referrer);
      // A shared experience must be visible: drop filters that hide it
      if (!matches(exp)) { state.cat = 'all'; state.region = 'all'; }
    }
    return !!(cat || region || exp || set.length);
  }

  function writeUrl() {
    const p = new URLSearchParams(window.location.search);
    const set = (k, v) => (v ? p.set(k, v) : p.delete(k));
    set('category', state.cat !== 'all' ? state.cat : '');
    set('region', state.region !== 'all' ? state.region : '');
    set('experience', state.selected || '');
    set('experiences', state.set ? state.set.join(',') : '');
    set('from', state.set && state.setFrom ? state.setFrom : '');
    const q = p.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${q ? `?${q}` : ''}`);
  }

  const inSet = (e) => !state.set || state.set.includes(e.id);
  const base = () => DATA.list.filter(inSet);
  const matches = (e) => inSet(e) && (state.cat === 'all' || e.cat === state.cat) && (state.region === 'all' || e.region === state.region);
  const visible = () => DATA.list.filter(matches);

  /* ---------------------------------------------------------
     FILTERS + LIST
     --------------------------------------------------------- */
  function buildFilters() {
    const catCount = (c) => base().filter((e) => e.cat === c).length;
    const regionCount = (r) => base().filter((e) => e.region === r).length;

    els.cats.innerHTML = [`<li><button type="button" class="atlas-chip" data-cat="all"><span data-i18n="map.all"></span><span class="atlas-chip__n">${base().length}</span></button></li>`]
      .concat(Object.keys(DATA.categories).map((c) => `
        <li><button type="button" class="atlas-chip" data-cat="${c}">
          <span class="cat-dot cat-dot--${c}" aria-hidden="true"></span><span data-i18n="${DATA.categories[c].key}"></span><span class="atlas-chip__n">${catCount(c)}</span>
        </button></li>`)).join('');

    els.regions.innerHTML = [`<li><button type="button" class="atlas-chip atlas-chip--line" data-region="all"><span data-i18n="map.allRegions"></span></button></li>`]
      .concat(Object.keys(DATA.regions).map((r) => `
        <li><button type="button" class="atlas-chip atlas-chip--line" data-region="${r}">
          <span data-i18n="${DATA.regions[r].key}"></span><span class="atlas-chip__n">${regionCount(r)}</span>
        </button></li>`)).join('');
  }

  function buildList() {
    els.list.innerHTML = DATA.list.map((e) => `
      <li data-row="${e.id}">
        <button type="button" class="atlas-row" data-select="${e.id}" aria-pressed="false">
          <span class="atlas-row__num">${e.numLabel}</span>
          <span class="atlas-row__main">
            <span class="atlas-row__name">${esc(e.name)}</span>
            <span class="atlas-row__region" data-i18n="${DATA.regions[e.region].key}"></span>
          </span>
          <span class="atlas-row__cat"><span class="cat-dot cat-dot--${e.cat}" aria-hidden="true"></span><span data-i18n="${DATA.categories[e.cat].key}"></span></span>
        </button>
      </li>`).join('');
  }

  function syncUi() {
    els.cats.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === state.cat)));
    els.regions.querySelectorAll('[data-region]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.region === state.region)));

    const shown = visible();
    const ids = new Set(shown.map((e) => e.id));
    els.list.querySelectorAll('[data-row]').forEach((li) => {
      const on = ids.has(li.dataset.row);
      li.hidden = !on;
      li.classList.toggle('is-selected', li.dataset.row === state.selected);
      li.querySelector('button').setAttribute('aria-pressed', String(li.dataset.row === state.selected));
    });

    els.count.textContent = String(shown.length).padStart(2, '0');
    els.countLabel.dataset.i18nVars = JSON.stringify({ n: shown.length });
    els.countLabel.textContent = t('common.expCount', { n: shown.length }).replace(/^\d+\s*/, '');
    els.empty.hidden = shown.length > 0;
    els.clear.hidden = state.cat === 'all' && state.region === 'all';

    // Selection banner (trip, favourites, season)
    if (els.set) {
      els.set.hidden = !state.set;
      if (state.set) {
        els.setLabel.textContent = t(`map.set.${state.setFrom || 'custom'}`);
        els.setCount.textContent = t('common.expCount', { n: state.set.length });
      }
    }
  }

  function clearSet() {
    state.set = null;
    state.setFrom = null;
    buildFilters();
    I18N.apply(els.cats.parentElement);
    setFilter('cat', 'all');
  }

  function setFilter(kind, value) {
    state[kind] = value;
    if (state.selected && !matches(DATA.find(state.selected))) closeCard(false);
    syncUi();
    renderMarkers();
    fitVisible();
    writeUrl();
    // Restart the list entrance so the change is felt
    els.list.classList.remove('is-filtering');
    void els.list.offsetWidth;
    els.list.classList.add('is-filtering');
  }

  /* ---------------------------------------------------------
     MAP
     --------------------------------------------------------- */
  function initMap() {
    if (!window.L) {
      els.map.classList.add('is-offline');
      els.map.insertAdjacentHTML('beforeend', `<p class="atlas-map__offline" data-i18n="map.offline"></p>`);
      I18N.apply(els.map);
      return;
    }
    const L = window.L;
    map = L.map(els.canvas, {
      zoomControl: false,
      scrollWheelZoom: true,
      minZoom: 5,
      maxZoom: 18,
      zoomSnap: 0.25,
      keyboardPanDelta: 120,
      maxBounds: [[40.5, -91], [52.5, -72]],
      attributionControl: false
    });
    L.control.zoom({ position: 'topright' }).addTo(map);
    const attribution = L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);
    let attributionText = t('map.attribution');
    attribution.addAttribution(attributionText);
    doc.addEventListener('languagechange', () => {
      attribution.removeAttribution(attributionText);
      attributionText = t('map.attribution');
      attribution.addAttribution(attributionText);
    });
    // Canada Basemap – Transportation (CBMT), Natural Resources Canada:
    // official cached tiles in Web Mercator, free, no key, published under
    // the Open Government Licence – Canada. Two layers: geometry (JPEG)
    // + English place names (transparent PNG). Colours softened in CSS.
    const NRCAN = 'https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps';
    L.tileLayer(`${NRCAN}/CBMT_CBCT_GEOM_3857/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 18 }).addTo(map);
    L.tileLayer(`${NRCAN}/CBMT_TXT_3857/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 18, className: 'atlas-labels' }).addTo(map);
    layer = L.layerGroup().addTo(map);

    map.getContainer().setAttribute('aria-label', t('map.mapLabel'));
    fitVisible(false);
    map.on('zoomend', renderMarkers);
  }

  function pinIcon(e, extra) {
    return window.L.divIcon({
      className: `atlas-pin atlas-pin--${e.cat}${extra || ''}`,
      html: `<span>${e.numLabel}</span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
  }

  // Greedy pixel clustering: markers closer than CLUSTER_PX share a circle
  function renderMarkers() {
    if (!map) return;
    const L = window.L;
    layer.clearLayers();
    Object.keys(markerOf).forEach((k) => delete markerOf[k]);

    const zoom = map.getZoom();
    const pts = visible().map((e) => ({ e, p: map.project([e.lat, e.lng], zoom) }));
    const used = new Set();

    pts.forEach((a) => {
      if (used.has(a.e.id)) return;
      if (a.e.id === state.selected) return;             // drawn on its own below
      const group = pts.filter((b) => !used.has(b.e.id) && b.e.id !== state.selected && a.p.distanceTo(b.p) < CLUSTER_PX);
      group.forEach((g) => used.add(g.e.id));

      if (group.length === 1) {
        const e = a.e;
        const m = L.marker([e.lat, e.lng], { icon: pinIcon(e), title: e.name, keyboard: true, riseOnHover: true }).addTo(layer);
        m.on('click', () => select(e.id, { from: 'map' }));
        m.on('mouseover', () => hoverRow(e.id, true));
        m.on('mouseout', () => hoverRow(e.id, false));
        labelMarker(m, e.name);
        markerOf[e.id] = m;
      } else {
        const bounds = L.latLngBounds(group.map((g) => [g.e.lat, g.e.lng]));
        const c = bounds.getCenter();
        const icon = L.divIcon({
          className: 'atlas-group',
          html: `<span>${group.length}</span>`,
          iconSize: [42, 42],
          iconAnchor: [21, 21]
        });
        const m = L.marker(c, { icon, keyboard: true, title: t('map.group', { n: group.length }) }).addTo(layer);
        m.on('click', () => map.flyToBounds(bounds.pad(0.4), { maxZoom: 16, duration: reduceMotion ? 0 : 0.8 }));
        labelMarker(m, t('map.group', { n: group.length }));
        group.forEach((g) => { markerOf[g.e.id] = m; });
      }
    });

    const sel = state.selected && DATA.find(state.selected);
    if (sel && matches(sel)) {
      const m = L.marker([sel.lat, sel.lng], { icon: pinIcon(sel, ' is-selected'), title: sel.name, keyboard: true, zIndexOffset: 1000 }).addTo(layer);
      m.on('click', () => select(sel.id, { from: 'map' }));
      labelMarker(m, sel.name);
      markerOf[sel.id] = m;
    }
    if (hovered) hoverMarker(hovered, true);
  }

  function labelMarker(m, label) {
    const el = m.getElement();
    if (el) { el.setAttribute('aria-label', label); el.setAttribute('role', 'button'); }
  }

  function fitVisible(animate) {
    if (!map) return;
    const shown = visible();
    if (!shown.length) return;
    const bounds = window.L.latLngBounds(shown.map((e) => [e.lat, e.lng]));
    const opts = { paddingTopLeft: [60, 60], paddingBottomRight: [60, 60], maxZoom: shown.length === 1 ? 13 : 12 };
    if (animate === false || reduceMotion) map.fitBounds(bounds, opts);
    else map.flyToBounds(bounds, Object.assign({ duration: 0.9 }, opts));
  }

  // Centre the experience in the part of the map not covered by the card
  function flyTo(e) {
    if (!map) return;
    const zoom = Math.max(map.getZoom(), e.region === 'toronto' ? 13 : 10.5);
    const cardW = els.card.offsetWidth || 0;
    const point = map.project([e.lat, e.lng], zoom).subtract([cardW / 2, 0]);
    const target = map.unproject(point, zoom);
    if (reduceMotion) map.setView(target, zoom);
    else map.flyTo(target, zoom, { duration: 1 });
  }

  function hoverRow(id, on) {
    const li = els.list.querySelector(`[data-row="${id}"]`);
    if (li) li.classList.toggle('is-hover', on);
  }

  // Remembered, so the highlight survives the redraw after a zoom
  let hovered = null;
  function hoverMarker(id, on) {
    hovered = on ? id : (hovered === id ? null : hovered);
    const m = markerOf[id];
    const el = m && m.getElement();
    if (el) el.classList.toggle('is-hover', on);
  }

  /* ---------------------------------------------------------
     SELECTION + CARD
     --------------------------------------------------------- */
  function select(id, opts) {
    const e = DATA.find(id);
    if (!e) return;
    opts = opts || {};
    if (!matches(e)) { state.cat = 'all'; state.region = 'all'; }
    state.selected = e.id;
    syncUi();
    renderCard(e);
    renderMarkers();
    flyTo(e);
    writeUrl();
    const li = els.list.querySelector(`[data-row="${e.id}"]`);
    if (li && opts.from !== 'list') li.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function nearby(e, n) {
    const R = 6371;
    const rad = (d) => d * Math.PI / 180;
    return DATA.list.filter((o) => o.id !== e.id).map((o) => {
      const dLat = rad(o.lat - e.lat);
      const dLng = rad(o.lng - e.lng);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(e.lat)) * Math.cos(rad(o.lat)) * Math.sin(dLng / 2) ** 2;
      return { o, km: 2 * R * Math.asin(Math.sqrt(a)) };
    }).sort((a, b) => a.km - b.km).slice(0, n);
  }

  function renderCard(e) {
    const cat = DATA.categories[e.cat];
    const near = nearby(e, 3).map(({ o, km }) => `
      <li><button type="button" class="atlas-near" data-select="${o.id}">
        <span class="cat-dot cat-dot--${o.cat}" aria-hidden="true"></span>
        <span class="atlas-near__name">${esc(o.name)}</span>
        <span class="atlas-near__km" data-i18n="map.km" data-i18n-vars='{"n":"${km < 10 ? km.toFixed(1).replace('.', I18N.getLang() === 'es' ? ',' : '.') : Math.round(km)}"}'></span>
      </button></li>`).join('');

    els.card.innerHTML = `
      <button type="button" class="atlas-card__close" data-close data-i18n-attr="aria-label:map.close"><span aria-hidden="true">×</span></button>
      <figure class="atlas-card__media">
        <img src="${e.thumb}" width="640" height="427" alt="" decoding="async">
        ${state.fromQuiz && state.selected === e.id ? `<span class="atlas-card__badge"><span class="pulse-dot" aria-hidden="true"></span><span data-i18n="map.fromQuiz"></span></span>` : ''}
        <span class="atlas-card__num" aria-hidden="true">${e.numLabel}</span>
      </figure>
      <div class="atlas-card__body">
        <p class="atlas-card__meta"><span class="cat-dot cat-dot--${e.cat}" aria-hidden="true"></span><span data-i18n="${cat.key}"></span> · <span data-i18n="${e.sub}"></span></p>
        <h2 class="atlas-card__name" id="atlas-card-title" tabindex="-1">${esc(e.name)}</h2>
        <p class="atlas-card__place"><span data-i18n="${DATA.regions[e.region].key}"></span> — ${esc(e.place)}</p>
        <p class="atlas-card__text" data-i18n="exp.${e.id}.text"></p>
        <div class="atlas-card__actions">
          <a class="btn atlas-card__cta" href="${e.href}"><span class="btn__label"><span data-i18n="map.explore"></span></span><span class="arrow" aria-hidden="true"></span></a>
          ${window.OTE_FAV ? window.OTE_FAV.button(e) : ''}
        </div>
        <div class="atlas-card__near">
          <p class="atlas-card__near-title" data-i18n="map.nearby"></p>
          <ul>${near}</ul>
        </div>
      </div>`;
    I18N.apply(els.card);
    els.card.hidden = false;
    els.card.classList.remove('is-open');
    void els.card.offsetWidth;
    els.card.classList.add('is-open');
  }

  function closeCard(write) {
    state.selected = null;
    state.fromQuiz = false;
    els.card.classList.remove('is-open');
    els.card.hidden = true;
    syncUi();
    renderMarkers();
    if (write !== false) writeUrl();
  }

  /* ---------------------------------------------------------
     EVENTS + BOOT
     --------------------------------------------------------- */
  function bind() {
    els.panel.addEventListener('click', (ev) => {
      const c = ev.target.closest('[data-cat]');
      if (c) { setFilter('cat', c.dataset.cat); return; }
      const r = ev.target.closest('[data-region]');
      if (r) { setFilter('region', r.dataset.region); return; }
      const s = ev.target.closest('[data-select]');
      if (s) { select(s.dataset.select, { from: 'list' }); return; }
      if (ev.target.closest('[data-clear-set]')) { clearSet(); return; }
      if (ev.target.closest('[data-reset]')) { state.cat = 'all'; state.region = 'all'; setFilter('cat', 'all'); }
    });

    els.list.addEventListener('mouseover', (ev) => {
      const row = ev.target.closest('[data-row]');
      if (row) hoverMarker(row.dataset.row, true);
    });
    els.list.addEventListener('mouseout', (ev) => {
      const row = ev.target.closest('[data-row]');
      if (row) hoverMarker(row.dataset.row, false);
    });
    els.list.addEventListener('focusin', (ev) => {
      const row = ev.target.closest('[data-row]');
      if (row) hoverMarker(row.dataset.row, true);
    });
    els.list.addEventListener('focusout', (ev) => {
      const row = ev.target.closest('[data-row]');
      if (row) hoverMarker(row.dataset.row, false);
    });

    els.card.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-close]')) {
        const id = state.selected;
        closeCard();
        const btn = id && els.list.querySelector(`[data-select="${id}"]`);
        if (btn) btn.focus({ preventScroll: true });
        return;
      }
      const s = ev.target.closest('[data-select]');
      if (s) select(s.dataset.select);
    });

    doc.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && state.selected && !els.card.hidden) closeCard();
    });

    doc.addEventListener('languagechange', () => {
      syncUi();
      if (map) {
        map.getContainer().setAttribute('aria-label', t('map.mapLabel'));
        renderMarkers();
      }
    });
  }

  function init() {
    const root = doc.querySelector('[data-atlas]');
    if (!root) return;
    els = {
      root,
      panel: root.querySelector('.atlas-panel'),
      cats: root.querySelector('[data-filter-cats]'),
      regions: root.querySelector('[data-filter-regions]'),
      list: root.querySelector('.atlas-list'),
      count: root.querySelector('[data-count-n]'),
      countLabel: root.querySelector('[data-count-label]'),
      empty: root.querySelector('.atlas-empty'),
      clear: root.querySelector('[data-reset].atlas-clear'),
      map: root.querySelector('.atlas-map'),
      canvas: root.querySelector('.atlas-map__canvas'),
      card: root.querySelector('.atlas-card'),
      set: root.querySelector('[data-set]'),
      setLabel: root.querySelector('[data-set-label]'),
      setCount: root.querySelector('[data-set-count]')
    };

    const fromLink = readUrl();
    buildFilters();
    buildList();
    I18N.apply(els.panel);
    syncUi();
    bind();
    initMap();
    renderMarkers();

    if (state.selected) {
      const e = DATA.find(state.selected);
      renderCard(e);
      if (map) {
        const zoom = e.region === 'toronto' ? 13 : 10.5;
        map.setView([e.lat, e.lng], zoom);
        flyTo(e);
      }
      const li = els.list.querySelector(`[data-row="${e.id}"]`);
      if (li) li.scrollIntoView({ block: 'nearest' });
    }
    // Arriving from a link (Home, quiz): go straight to the map
    if (fromLink) {
      writeUrl();                      // keep only the state really shown
      window.requestAnimationFrame(() => root.scrollIntoView({ behavior: 'auto', block: 'start' }));
    }
  }

  doc.addEventListener('DOMContentLoaded', init);
})();
