/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   cards.js — Compact experience card (seasons.html, favourites.html)

   OTE_CARDS.card(experience, options) returns the HTML of a card:
     photo (640px thumbnail, lazy) · number · ♡ · world · name
     (links to its world page) · region · optional reason and
     "best in" seasons · View on map
   It reuses the data of js/experiences.js: no text is copied
   from the world pages (they keep the full description).
   OTE_CARDS.ready(scope) fades images in once loaded.
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const DATA = window.OTE_EXPERIENCES;
  if (!I18N || !DATA) return;

  I18N.extend({
    en: { 'card.best': 'Best in', 'card.region': 'Region', 'season.all': 'All year' },
    es: { 'card.best': 'Mejor en', 'card.region': 'Región', 'season.all': 'Todo el año' }
  });

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Seasons where the experience is at its best: the ones with affinity 3;
  // with no 3 and no season to avoid, it is an all-year plan (['all'])
  function bestSeasons(e) {
    const values = DATA.seasons.map((s) => e.seasons[s]);
    const top = Math.max(...values);
    if (top < 3 && Math.min(...values) >= 1) return ['all'];
    return DATA.seasons.filter((s) => e.seasons[s] === top && top >= 2);
  }

  /* options:
       why     i18n key of a short reason (seasons page)
       best    true → "Best in: Fall · Winter"
       mapFrom value for &from= on the map link
       remove  true → the ♡ acts as "remove" (favourites page)  */
  function card(e, opts) {
    opts = opts || {};
    const cat = DATA.categories[e.cat];
    const fav = window.OTE_FAV;
    const best = opts.best ? bestSeasons(e) : [];
    return `
      <article class="xcard" data-card="${e.id}" aria-labelledby="xcard-${e.id}">
        <figure class="xcard__media">
          <img src="${e.thumb}" width="640" height="427" alt="" loading="lazy" decoding="async">
          <span class="xcard__num" aria-hidden="true">${e.numLabel}</span>
        </figure>
        ${fav ? `<div class="xcard__fav">${fav.button(e, { variant: 'icon', extraClass: 'fav-btn--float' })}</div>` : ''}
        <div class="xcard__body">
          <p class="xcard__meta"><span class="cat-dot cat-dot--${e.cat}" aria-hidden="true"></span><span data-i18n="${cat.key}"></span><span aria-hidden="true">·</span><span data-i18n="${e.sub}"></span></p>
          <h3 class="xcard__name" id="xcard-${e.id}"><a href="${e.href}">${esc(e.name)}</a></h3>
          <p class="xcard__region" data-i18n="${DATA.regions[e.region].key}"></p>
          ${opts.why ? `<p class="xcard__why" data-i18n="${opts.why}"></p>` : ''}
          ${best[0] === 'all' ? '<p class="xcard__best"><b data-i18n="season.all"></b></p>' : ''}
          ${best.length && best[0] !== 'all' ? `<p class="xcard__best"><span data-i18n="card.best"></span> ${best.map((s) => `<b data-i18n="season.${s}"></b>`).join('<span aria-hidden="true">·</span>')}</p>` : ''}
          <div class="xcard__links">
            <a class="link-arrow" href="map.html?experience=${e.id}"><span data-i18n="exp.viewMap"></span><span class="map-pin-icon" aria-hidden="true"></span></a>
            <a class="link-arrow" href="${e.href}"><span data-i18n="exp.explore"></span><span class="arrow" aria-hidden="true"></span></a>
          </div>
        </div>
      </article>`;
  }

  function ready(scope) {
    scope.querySelectorAll('img').forEach((img) => {
      const done = () => img.classList.add('is-loaded');
      if (img.complete && img.naturalWidth) done();
      else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      }
    });
  }

  window.OTE_CARDS = { card, ready, bestSeasons };
})();
