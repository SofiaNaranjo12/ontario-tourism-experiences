/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   favourites-page.js — My Favourites (favourites.html)

   Shows the experiences saved with ♡ anywhere on the site
   (js/favourites.js → localStorage "ote-favourites"):
   counter, saved regions and worlds, one card per experience,
   "Plan with my favourites" (plan-your-trip.html?favs=1) and
   "View on map" (map.html?experiences=…&from=favourites).
   With nothing saved, an invitation replaces the list.
   Removing a card (♥ → ♡) offers "Undo" in the notification.
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const DATA = window.OTE_EXPERIENCES;
  const FAV = window.OTE_FAV;
  const CARDS = window.OTE_CARDS;
  if (!I18N || !DATA || !FAV || !CARDS) return;

  I18N.extend({
    en: {
      'title.favourites': 'My Favourites — Ontario Tourism Experiences',
      'meta.favourites': 'The Ontario experiences you saved while exploring this guide, ready to plan a trip or see on the map.',
      'favs.eyebrow': 'My Favourites',
      'favs.title': 'The places<br><em>you want to remember.</em>',
      'favs.lede': 'Everything you save with ♡ on the world pages, the map, the quiz, the seasons or the planner. Stored only in this browser: no account needed.',
      'favs.s1': 'Saved',
      'favs.s2': 'Regions',
      'favs.s3': 'Worlds',
      'favs.plan': 'Plan with my favourites',
      'favs.map': 'View on map',
      'favs.listTitle': 'Your saved experiences',
      'favs.hint': 'Click ♥ on a card to remove it.',
      'favs.empty.title': 'You haven’t saved<br><em>any experiences yet.</em>',
      'favs.empty.text': 'Explore Ontario and save the places you want to remember. They will wait for you here, even if you close the browser.',
      'favs.empty.cta': 'Explore Ontario',
      'favs.empty.or': 'Or start from',
      'favs.empty.photo': 'Toronto skyline from the Ward’s Island ferry',
      'favs.next.title': 'Before you go,<br><em>read the travel guide.</em>',
      'favs.storage': 'Your favourites are saved in this browser (localStorage). Clearing your browsing data deletes them.'
    },
    es: {
      'title.favourites': 'Mis favoritos — Experiencias Turísticas de Ontario',
      'meta.favourites': 'Las experiencias de Ontario que guardaste mientras explorabas esta guía, listas para planificar un viaje o verlas en el mapa.',
      'favs.eyebrow': 'Mis favoritos',
      'favs.title': 'Los lugares<br><em>que quieres recordar.</em>',
      'favs.lede': 'Todo lo que guardas con ♡ en las páginas de los mundos, el mapa, el cuestionario, las temporadas o el planificador. Se guarda solo en este navegador: no necesitas cuenta.',
      'favs.s1': 'Guardadas',
      'favs.s2': 'Regiones',
      'favs.s3': 'Mundos',
      'favs.plan': 'Planificar con mis favoritos',
      'favs.map': 'Ver en el mapa',
      'favs.listTitle': 'Tus experiencias guardadas',
      'favs.hint': 'Pulsa ♥ en una tarjeta para quitarla.',
      'favs.empty.title': 'Todavía no has guardado<br><em>experiencias.</em>',
      'favs.empty.text': 'Explora Ontario y guarda los lugares que quieras recordar. Te esperarán aquí, aunque cierres el navegador.',
      'favs.empty.cta': 'Explorar Ontario',
      'favs.empty.or': 'O empieza por',
      'favs.empty.photo': 'El skyline de Toronto desde el ferry de Ward’s Island',
      'favs.next.title': 'Antes de viajar,<br><em>lee la guía para tu viaje.</em>',
      'favs.storage': 'Tus favoritos se guardan en este navegador (localStorage). Si borras los datos de navegación, se eliminan.'
    }
  });

  const doc = document;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  let els = {};

  function render() {
    const ids = FAV.list();
    const list = ids.map((id) => DATA.find(id)).filter(Boolean);
    const regions = new Set(list.map((e) => e.region));
    const worlds = new Set(list.map((e) => e.cat));

    els.count.textContent = pad(list.length);
    els.regions.textContent = pad(regions.size);
    els.worlds.textContent = pad(worlds.size);

    els.full.hidden = !list.length;
    els.empty.hidden = !!list.length;
    if (!list.length) return;

    els.plan.href = 'plan-your-trip.html?favs=1';
    els.map.href = `map.html?experiences=${list.map((e) => e.id).join(',')}&from=favourites`;
    els.grid.innerHTML = list.map((e) => CARDS.card(e, { best: true })).join('');
    I18N.apply(els.grid);
    CARDS.ready(els.grid);
  }

  // A card removed here leaves softly; everything else re-renders
  function onChange(ev) {
    const d = ev.detail || {};
    const card = d.id && d.saved === false ? els.grid.querySelector(`[data-card="${d.id}"]`) : null;
    if (card && !reduceMotion) {
      card.classList.add('is-leaving');
      setTimeout(render, 420);
    } else {
      render();
    }
  }

  function init() {
    const root = doc.querySelector('[data-favourites]');
    if (!root) return;
    els = {
      count: doc.querySelector('[data-fav-total]'),
      regions: doc.querySelector('[data-fav-regions]'),
      worlds: doc.querySelector('[data-fav-worlds]'),
      full: root.querySelector('[data-fav-full]'),
      empty: root.querySelector('[data-fav-empty]'),
      grid: root.querySelector('[data-fav-grid]'),
      plan: root.querySelector('[data-fav-plan]'),
      map: root.querySelector('[data-fav-map]')
    };
    render();
    doc.addEventListener('favouriteschange', onChange);
  }

  doc.addEventListener('DOMContentLoaded', init);
})();
