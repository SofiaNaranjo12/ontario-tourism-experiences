/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   seasons.js — Ontario by Season (seasons.html)

   Answers "what to do in Ontario at this time of year?":
   - four seasons, each with its own photo, colours and mood
     (data-season on <body> switches the palette in CSS);
   - the experiences with affinity ≥ 2 for the chosen season
     (js/experiences.js → seasons / why), as compact cards;
   - "Good to know": verified seasonal facts, each with its
     official source (dates are the ones published for the
     season in course when this page was written);
   - "The year at a glance": the 24 × 4 affinity matrix.
   URL: seasons.html?season=winter (also: spring, summer,
   autumn / fall). Without it, the current season is shown.
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const DATA = window.OTE_EXPERIENCES;
  const CARDS = window.OTE_CARDS;
  const REFS = window.OTE_REFS;
  if (!I18N || !DATA || !CARDS || !REFS) return;

  const SEASONS = DATA.seasons;

  const SCENES = {
    spring: { img: 'images/home/nature-algonquin-canoe-lake.webp', pos: 'center 40%', photo: 'Canoe Lake, Algonquin Provincial Park' },
    summer: { img: 'images/home/nature-sauble-beach.webp', pos: '70% center', photo: 'Sauble Beach, Lake Huron', photoEs: 'Sauble Beach, lago Hurón' },
    autumn: { img: 'images/nature/algonquin-autumn-lake.webp', pos: '45% center', photo: 'Centennial Ridges Trail, Algonquin Provincial Park' },
    winter: { img: 'images/adventure/blue-mountain-night.webp', pos: 'center 60%', photo: 'Blue Mountain Village' }
  };

  /* Verified facts (source fetched on 2026-09-28). */
  /* Verified facts: each one points to js/references.js (consulted 2026-09-28) */
  const FACTS = {
    spring: [
      { key: 'cruise', ref: 'np-cruise' },
      { key: 'ferry', ref: 'to-ferry' },
      { key: 'treetop', ref: 'treetop' },
      { key: 'wonderland', ref: 'cw-opening' }
    ],
    summer: [
      { key: 'grotto', ref: 'pc-grotto' },
      { key: 'sauble', ref: 'sbp-sauble' },
      { key: 'caves', ref: 'caves-warm' },
      { key: 'bluemountain', ref: 'bm-home' }
    ],
    autumn: [
      { key: 'colours', ref: 'op-blog-colours' },
      { key: 'report', ref: 'op-fallcolour' },
      { key: 'harvest', ref: 'wco-harvest' },
      { key: 'haunt', ref: 'cw-haunt' }
    ],
    winter: [
      { key: 'lights', ref: 'nft-wfol' },
      { key: 'village', ref: 'distillery-wv' },
      { key: 'icewine', ref: 'wco-icewine' },
      { key: 'icewineFest', ref: 'ngwf-icewine' },
      { key: 'nordic', ref: 'caves-nordic' },
      { key: 'butterfly', ref: 'np-butterfly' }
    ]
  };

  I18N.extend({
    en: {
      'title.seasons': 'Ontario by Season — Ontario Tourism Experiences',
      'meta.seasons': 'What to do in Ontario in spring, summer, fall and winter: the experiences of this guide that suit each season, with verified seasonal information.',
      'seasons.eyebrow': 'Ontario by Season',
      'seasons.tabs': 'Choose a season',
      'seasons.photo': 'Photo',

      'seasons.spring.title': 'Ontario<br><em>wakes up.</em>',
      'seasons.spring.lede': 'Forests turn green, days grow longer and the city steps back outside. A season for easy walks, waterfalls and the first trips of the year.',
      'seasons.summer.title': 'Lakes, beaches<br><em>and long days.</em>',
      'seasons.summer.lede': 'The season of the Great Lakes shoreline: beaches, islands, boat trips and outdoor adventures until the last light of the day.',
      'seasons.autumn.title': 'Forests<br><em>on fire.</em>',
      'seasons.autumn.lede': 'Red maples, golden hills and harvest time in wine country. A season to enjoy on trails, lookouts and country roads.',
      'seasons.winter.title': 'Snow outside,<br><em>warmth inside.</em>',
      'seasons.winter.lede': 'Ski slopes and snowy trails, skating and winter lights in the city — and, when it gets cold, museums, markets and warm indoor worlds.',

      'seasons.panel.title': 'What to do in Ontario in {season}',
      'seasons.panel.lede': 'The experiences of this guide that suit this season best, and why. Their full story is on each world page.',
      'seasons.plan': 'Plan a trip in {season}',
      'seasons.map': 'See them on the map',
      'seasons.facts': 'Good to know',
      'seasons.factsNote': 'Dates change every year. Check the official website before you travel.',
      'seasons.source': 'Source',

      'seasons.year.eyebrow': 'The year at a glance',
      'seasons.year.title': 'When to go,<br><em>experience by experience.</em>',
      'seasons.year.lede': 'An editorial recommendation based on the character of each place: the bigger the dot, the better the season. It is not an opening calendar.',
      'seasons.year.caption': 'Seasonal recommendation for the 24 experiences',
      'seasons.year.experience': 'Experience',
      'seasons.level.3': 'Best season',
      'seasons.level.2': 'Good season',
      'seasons.level.1': 'Possible',
      'seasons.level.0': 'Not recommended',
      'seasons.level.alt': 'Possible, with a different offer (see note)',
      'seasons.alt.winterfest': 'In winter the park opens on select nights for WinterFest (November 21 – January 3): light displays, live entertainment, family activities, holiday food and select attractions. It is not the usual experience of the main season.',
      'seasons.alt.resort': 'The treetop courses close for the season (main season: April 16 – November). Horseshoe Valley Resort offers other winter activities: alpine ski and snowboard runs, snow tubing, groomed Nordic trails, fat biking and snowshoeing.',
      'seasons.cell': '{name} — {season}: {level}',

      'seasons.next.title': 'Know the season.<br><em>Now plan the trip.</em>',
      'seasons.next.guide': 'Weather & what to pack',

      'season.why.green': 'Fresh green landscapes and mild days to be outdoors.',
      'season.why.water': 'Warm days for the water and the shoreline.',
      'season.why.beach': 'Beach season: sand, lake and long evenings.',
      'season.why.trails': 'Cooler days for trails and lookouts.',
      'season.why.colours': 'Forests and hills turn red, orange and gold.',
      'season.why.harvest': 'Harvest season in the vineyards.',
      'season.why.snow': 'Snow on the slopes: the ski and snowboard season.',
      'season.why.skating': 'Skating and winter lights in the heart of the city.',
      'season.why.indoor': 'Indoors: a plan that does not depend on the weather.',
      'season.why.city': 'Good weather to walk the streets and sit on a patio.',
      'season.why.festive': 'The Winter Village fills the district with lights.',
      'season.why.thrill': 'The full outdoor season for rides and roller coasters.',
      'season.why.haunt': 'Halloween Haunt takes over the park on select fall nights.',
      'season.why.hike': 'Long days for hiking and biking on the escarpment.',
      'season.why.nordic': 'Cross-country ski and snowshoe trails at the Nordic Centre.',
      'season.why.lights': 'The Winter Festival of Lights brightens the parks by the Falls.',
      'season.why.wildlife': 'Mild days for a long walk among the animals.',
      'season.why.tropical': 'A warm, tropical garden when it is cold outside.',
      'season.why.sweet': 'A sweet plan to warm up on a cold day.',
      'season.why.icewine': 'Icewine country: grapes picked frozen on the vine.',
      'season.why.canopy': 'Treetop courses in full leaf.',

      'fact.spring.cruise': 'Niagara City Cruises, the boat tour to the foot of the Falls, is seasonal: April to November.',
      'fact.spring.ferry': 'Toronto Island ferries run all year; the Centre Island and Hanlan’s Point routes operate from mid-April to mid-October (in winter, only Ward’s Island).',
      'fact.spring.treetop': 'Treetop Trekking at Horseshoe Resort opens in spring: April 16 to November, according to the operator.',
      'fact.spring.wonderland': 'Canada’s Wonderland opens for the season in spring (in 2026, on May 3).',
      'fact.summer.grotto': 'Parking for the Grotto, in Bruce Peninsula National Park, requires a reservation from May 1 to October 31.',
      'fact.summer.sauble': 'Paid parking at Sauble Beach is in effect from June 1 to Labour Day.',
      'fact.summer.caves': 'The warm season at Scenic Caves runs from May through October.',
      'fact.summer.bluemountain': 'Blue Mountain presents itself as a winter and summer destination, with hiking and biking in the warm months.',
      'fact.autumn.colours': 'In Algonquin, fall colours are traditionally on display from mid-September until mid-October; the exact timing differs from year to year.',
      'fact.autumn.report': 'Ontario Parks publishes a Fall Colour Report with the colour change in each park.',
      'fact.autumn.harvest': 'Wine Country Ontario invites visitors to discover Niagara’s grape harvest in September.',
      'fact.autumn.haunt': 'Halloween Haunt at Canada’s Wonderland: select nights, September 25 – November 1 (2026).',
      'fact.winter.lights': 'Winter Festival of Lights, Niagara Falls: November 14, 2026 – January 10, 2027.',
      'fact.winter.village': 'The Distillery Winter Village, an outdoor holiday market: November 12, 2026 – January 3, 2027.',
      'fact.winter.icewine': 'Icewine grapes must freeze naturally on the vine and be harvested and pressed at −8 °C or colder.',
      'fact.winter.icewineFest': 'The Niagara Icewine Festival takes place in January (January 8–30, 2027).',
      'fact.winter.nordic': 'In winter, Scenic Caves becomes a Nordic Centre for cross-country skiing and snowshoeing.',
      'fact.winter.butterfly': 'The Niagara Parks Butterfly Conservatory is open year-round.'
    },
    es: {
      'title.seasons': 'Ontario por temporada — Experiencias Turísticas de Ontario',
      'meta.seasons': 'Qué hacer en Ontario en primavera, verano, otoño e invierno: las experiencias de esta guía que mejor encajan con cada temporada, con información de temporada verificada.',
      'seasons.eyebrow': 'Ontario por temporada',
      'seasons.tabs': 'Elige una temporada',
      'seasons.photo': 'Foto',

      'seasons.spring.title': 'Ontario<br><em>despierta.</em>',
      'seasons.spring.lede': 'Los bosques reverdecen, los días se alargan y la ciudad vuelve a salir a la calle. Una temporada para paseos tranquilos, cataratas y los primeros viajes del año.',
      'seasons.summer.title': 'Lagos, playas<br><em>y días largos.</em>',
      'seasons.summer.lede': 'La temporada de las orillas de los Grandes Lagos: playas, islas, paseos en barco y aventuras al aire libre hasta la última luz del día.',
      'seasons.autumn.title': 'Bosques<br><em>en llamas.</em>',
      'seasons.autumn.lede': 'Arces rojos, colinas doradas y tiempo de vendimia en la región vinícola. Una temporada para disfrutar en senderos, miradores y carreteras rurales.',
      'seasons.winter.title': 'Nieve fuera,<br><em>calidez dentro.</em>',
      'seasons.winter.lede': 'Pistas de esquí y senderos nevados, patinaje y luces de invierno en la ciudad y, cuando aprieta el frío, museos, mercados y cálidos mundos interiores.',

      'seasons.panel.title': 'Qué hacer en Ontario en {season}',
      'seasons.panel.lede': 'Las experiencias de esta guía que mejor encajan con esta temporada, y por qué. Su historia completa está en la página de cada mundo.',
      'seasons.plan': 'Planificar un viaje en {season}',
      'seasons.map': 'Verlas en el mapa',
      'seasons.facts': 'Conviene saber',
      'seasons.factsNote': 'Las fechas cambian cada año. Consulta la web oficial antes de viajar.',
      'seasons.source': 'Fuente',

      'seasons.year.eyebrow': 'El año de un vistazo',
      'seasons.year.title': 'Cuándo ir,<br><em>experiencia por experiencia.</em>',
      'seasons.year.lede': 'Una recomendación editorial basada en el carácter de cada lugar: cuanto mayor es el punto, mejor es la temporada. No es un calendario de apertura.',
      'seasons.year.caption': 'Recomendación de temporada para las 24 experiencias',
      'seasons.year.experience': 'Experiencia',
      'seasons.level.3': 'Mejor temporada',
      'seasons.level.2': 'Buena temporada',
      'seasons.level.1': 'Posible',
      'seasons.level.0': 'No recomendada',
      'seasons.level.alt': 'Posible, con una oferta diferente (ver nota)',
      'seasons.alt.winterfest': 'En invierno el parque abre algunas noches para WinterFest (del 21 de noviembre al 3 de enero): espectáculos de luces, entretenimiento en vivo, actividades familiares, comida navideña y algunas atracciones. No es la experiencia habitual de la temporada principal.',
      'seasons.alt.resort': 'Los circuitos en los árboles cierran por temporada (temporada principal: del 16 de abril a noviembre). Horseshoe Valley Resort ofrece otras actividades de invierno: pistas de esquí alpino y snowboard, snow tubing, pistas de esquí de fondo, fat bike y raquetas de nieve.',
      'seasons.cell': '{name} — {season}: {level}',

      'seasons.next.title': 'Ya conoces la temporada.<br><em>Ahora planifica el viaje.</em>',
      'seasons.next.guide': 'Clima y qué llevar',

      'season.why.green': 'Paisajes verdes y días templados para estar al aire libre.',
      'season.why.water': 'Días cálidos para el agua y la orilla.',
      'season.why.beach': 'Temporada de playa: arena, lago y atardeceres largos.',
      'season.why.trails': 'Días más frescos para senderos y miradores.',
      'season.why.colours': 'Bosques y colinas se tiñen de rojo, naranja y oro.',
      'season.why.harvest': 'Temporada de vendimia en los viñedos.',
      'season.why.snow': 'Nieve en las pistas: la temporada de esquí y snowboard.',
      'season.why.skating': 'Patinaje y luces de invierno en pleno centro.',
      'season.why.indoor': 'Bajo techo: un plan que no depende del tiempo.',
      'season.why.city': 'Buen tiempo para recorrer las calles y sentarse en una terraza.',
      'season.why.festive': 'El Winter Village llena el distrito de luces.',
      'season.why.thrill': 'La temporada completa de atracciones y montañas rusas al aire libre.',
      'season.why.haunt': 'Halloween Haunt se apodera del parque en noches seleccionadas de otoño.',
      'season.why.hike': 'Días largos para caminar y pedalear por el escarpe.',
      'season.why.nordic': 'Pistas de esquí de fondo y raquetas en el Nordic Centre.',
      'season.why.lights': 'El Winter Festival of Lights ilumina los parques junto a las cataratas.',
      'season.why.wildlife': 'Días templados para un largo paseo entre los animales.',
      'season.why.tropical': 'Un jardín tropical y cálido cuando fuera hace frío.',
      'season.why.sweet': 'Un plan dulce para entrar en calor un día frío.',
      'season.why.icewine': 'Tierra de icewine: uvas cosechadas congeladas en la vid.',
      'season.why.canopy': 'Circuitos entre los árboles en plena frondosidad.',

      'fact.spring.cruise': 'Niagara City Cruises, el paseo en barco hasta el pie de las cataratas, es de temporada: de abril a noviembre.',
      'fact.spring.ferry': 'Los ferris a Toronto Island funcionan todo el año; las rutas a Centre Island y Hanlan’s Point operan de mediados de abril a mediados de octubre (en invierno, solo Ward’s Island).',
      'fact.spring.treetop': 'Treetop Trekking en Horseshoe Resort abre en primavera: del 16 de abril a noviembre, según el operador.',
      'fact.spring.wonderland': 'Canada’s Wonderland abre su temporada en primavera (en 2026, el 3 de mayo).',
      'fact.summer.grotto': 'El aparcamiento para The Grotto, en Bruce Peninsula National Park, requiere reserva del 1 de mayo al 31 de octubre.',
      'fact.summer.sauble': 'El aparcamiento de pago en Sauble Beach rige del 1 de junio al Labour Day.',
      'fact.summer.caves': 'La temporada cálida de Scenic Caves va de mayo a octubre.',
      'fact.summer.bluemountain': 'Blue Mountain se presenta como destino de invierno y de verano, con senderismo y bicicleta en los meses cálidos.',
      'fact.autumn.colours': 'En Algonquin, los colores de otoño se ven tradicionalmente de mediados de septiembre a mediados de octubre; el momento exacto cambia cada año.',
      'fact.autumn.report': 'Ontario Parks publica un Fall Colour Report con el cambio de color en cada parque.',
      'fact.autumn.harvest': 'Wine Country Ontario invita a descubrir la vendimia de Niagara en septiembre.',
      'fact.autumn.haunt': 'Halloween Haunt en Canada’s Wonderland: noches seleccionadas, del 25 de septiembre al 1 de noviembre (2026).',
      'fact.winter.lights': 'Winter Festival of Lights, Niagara Falls: del 14 de noviembre de 2026 al 10 de enero de 2027.',
      'fact.winter.village': 'El Distillery Winter Village, mercado navideño al aire libre: del 12 de noviembre de 2026 al 3 de enero de 2027.',
      'fact.winter.icewine': 'Las uvas del icewine deben congelarse de forma natural en la vid y cosecharse y prensarse a −8 °C o menos.',
      'fact.winter.icewineFest': 'El Niagara Icewine Festival se celebra en enero (del 8 al 30 de enero de 2027).',
      'fact.winter.nordic': 'En invierno, Scenic Caves se convierte en un Nordic Centre de esquí de fondo y raquetas de nieve.',
      'fact.winter.butterfly': 'El Niagara Parks Butterfly Conservatory abre todo el año.'
    }
  });

  const doc = document;
  const t = (k, v) => I18N.t(k, v);
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let els = {};
  let current = null;

  // Meteorological seasons: Mar–May, Jun–Aug, Sep–Nov, Dec–Feb
  function seasonOfToday() {
    const m = new Date().getMonth();
    return SEASONS[Math.floor(((m + 10) % 12) / 3)];
  }

  function readUrl() {
    const v = (new URLSearchParams(window.location.search).get('season') || '').toLowerCase();
    const s = v === 'fall' ? 'autumn' : v;
    return SEASONS.includes(s) ? s : null;
  }

  function picks(season) {
    return DATA.list
      .filter((e) => e.seasons[season] >= 2)
      .sort((a, b) => (b.seasons[season] - a.seasons[season]) || (a.num - b.num));
  }

  /* ---------- Hero ---------- */
  function setBackground(src, pos) {
    const layers = els.bg;
    const cur = layers.find((img) => img.classList.contains('is-active'));
    if (cur && cur.getAttribute('src') === src) return;
    const next = layers.find((img) => img !== cur);
    const show = () => {
      next.style.objectPosition = pos;
      next.classList.add('is-active');
      if (cur) cur.classList.remove('is-active');
    };
    next.onload = show;
    next.src = src;
    if (next.complete && next.naturalWidth) { next.onload = null; show(); }
  }

  function renderHero(s) {
    const scene = SCENES[s];
    setBackground(scene.img, scene.pos);
    els.name.dataset.i18n = `season.${s}`;
    els.months.dataset.i18n = `season.months.${s}`;
    els.title.dataset.i18nHtml = `seasons.${s}.title`;
    els.lede.dataset.i18n = `seasons.${s}.lede`;
    els.photo.textContent = (I18N.getLang() === 'es' && scene.photoEs) || scene.photo;
    els.tabs.forEach((tab) => {
      const on = tab.dataset.season === s;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    els.panel.setAttribute('aria-labelledby', `tab-${s}`);
    I18N.apply(els.hero);
    // Replay the entrance of the season name
    els.name.style.animation = 'none';
    void els.name.offsetWidth;
    els.name.style.animation = '';
  }

  /* ---------- Panel ---------- */
  function renderPanel(s) {
    const list = picks(s);
    const seasonLower = t(`season.${s}`).toLowerCase();
    const facts = FACTS[s].map((f) => `
      <li>
        <p>${esc(t(`fact.${s}.${f.key}`))}</p>
        <p class="season-facts__src">${esc(t('seasons.source'))}: ${REFS.cite(f.ref)}</p>
      </li>`).join('');

    els.panelBody.innerHTML = `
      <header class="season-panel__head">
        <span class="season-panel__count" aria-hidden="true">${pad(list.length)}</span>
        <div>
          <h2 class="display-md season-panel__title">${esc(t('seasons.panel.title', { season: seasonLower }))}</h2>
          <p class="season-panel__lede">${esc(t('seasons.panel.lede'))}</p>
        </div>
        <div class="season-panel__actions">
          <a class="btn" href="plan-your-trip.html?season=${s}"><span class="btn__label"><span>${esc(t('seasons.plan', { season: seasonLower }))}</span></span><span class="arrow" aria-hidden="true"></span></a>
          <a class="link-arrow" href="map.html?experiences=${list.map((e) => e.id).join(',')}&amp;from=season"><span>${esc(t('seasons.map'))}</span><span class="map-pin-icon" aria-hidden="true"></span></a>
        </div>
      </header>
      <div class="season-grid">
        ${list.map((e) => CARDS.card(e, { why: `season.why.${e.why[s]}`, best: true })).join('')}
      </div>
      <aside class="season-facts" aria-labelledby="season-facts-title">
        <div class="season-facts__head">
          <h3 class="season-facts__title" id="season-facts-title">${esc(t('seasons.facts'))}</h3>
          <p>${esc(t('seasons.factsNote'))}</p>
        </div>
        <ul>${facts}</ul>
      </aside>`;
    I18N.apply(els.panelBody);
    if (window.OTE_FAV) window.OTE_FAV.sync(els.panelBody);
    CARDS.ready(els.panelBody);
  }

  /* ---------- Year at a glance ---------- */
  function renderYear() {
    const head = SEASONS.map((s) => `<th scope="col" data-col="${s}"><span data-i18n="season.${s}"></span></th>`).join('');
    const groups = Object.keys(DATA.categories).map((c) => {
      const rows = DATA.list.filter((e) => e.cat === c).map((e) => {
        const cells = SEASONS.map((s) => {
          // "Possible*": the usual experience is closed or different in this
          // season but the place offers something else (display only)
          const alt = e.seasonAlt[s];
          const lvl = alt ? 1 : e.seasons[s];
          const level = alt ? t('seasons.level.alt') : t(`seasons.level.${lvl}`);
          const label = t('seasons.cell', { name: e.name, season: t(`season.${s}`), level });
          return `<td data-col="${s}" title="${esc(label)}"><span class="year-dot year-dot--${lvl}" aria-hidden="true"></span>${alt ? '<span class="year-mark" aria-hidden="true">*</span>' : ''}<span class="sr-only">${esc(level)}</span></td>`;
        }).join('');
        return `<tr><th scope="row"><a href="${e.href}"><span class="year-num">${e.numLabel}</span>${esc(e.name)}</a></th>${cells}</tr>`;
      }).join('');
      return `<tbody><tr class="year-group"><th scope="rowgroup" colspan="5"><span class="cat-dot cat-dot--${c}" aria-hidden="true"></span><span data-i18n="${DATA.categories[c].key}"></span></th></tr>${rows}</tbody>`;
    }).join('');

    els.year.innerHTML = `
      <table class="year-table">
        <caption class="sr-only">${esc(t('seasons.year.caption'))}</caption>
        <thead><tr><th scope="col" class="year-table__exp">${esc(t('seasons.year.experience'))}</th>${head}</tr></thead>
        ${groups}
      </table>`;
    I18N.apply(els.year);
  }

  function renderLegend() {
    els.legend.innerHTML = [3, 2, 1, 0].map((l) => `<li><span class="year-dot year-dot--${l}" aria-hidden="true"></span><span>${esc(t(`seasons.level.${l}`))}</span></li>`).join('')
      + `<li><span class="year-legend__alt" aria-hidden="true"><span class="year-dot year-dot--1"></span><span class="year-mark">*</span></span><span>${esc(t('seasons.level.alt'))}</span></li>`;
    // Notes for the "Possible*" cells, with their official sources
    if (!els.notes) return;
    const notes = [];
    DATA.list.forEach((e) => Object.keys(e.seasonAlt).forEach((s) => {
      const code = e.seasonAlt[s];
      notes.push(`<p class="year-note"><span class="year-mark" aria-hidden="true">*</span>
        <span><strong>${esc(e.name)} · ${esc(t(`season.${s}`))}</strong> ${esc(t(`seasons.alt.${code}`))}
        <span class="year-note__src">${esc(t('seasons.source'))}: ${ALT_REFS[code].map((r) => REFS.cite(r)).join(' · ')}</span></span></p>`);
    }));
    els.notes.innerHTML = notes.join('');
  }
  const ALT_REFS = { winterfest: ['cw-winterfest'], resort: ['treetop', 'horseshoe-home'] };

  /* ---------- Switch ---------- */
  function show(s, opts) {
    opts = opts || {};
    current = s;
    doc.body.dataset.season = s;
    renderHero(s);
    renderPanel(s);
    els.year.dataset.active = s;
    if (opts.writeUrl !== false) {
      const p = new URLSearchParams(window.location.search);
      p.set('season', s);
      window.history.replaceState(null, '', `${window.location.pathname}?${p.toString()}`);
    }
  }

  function bind() {
    els.tablist.addEventListener('click', (ev) => {
      const tab = ev.target.closest('[role="tab"]');
      if (tab && tab.dataset.season !== current) show(tab.dataset.season);
    });
    // Arrow keys move between tabs (automatic activation), Home / End jump
    els.tablist.addEventListener('keydown', (ev) => {
      const i = SEASONS.indexOf(current);
      let n = null;
      if (ev.key === 'ArrowRight') n = (i + 1) % 4;
      if (ev.key === 'ArrowLeft') n = (i + 3) % 4;
      if (ev.key === 'Home') n = 0;
      if (ev.key === 'End') n = 3;
      if (n === null) return;
      ev.preventDefault();
      show(SEASONS[n]);
      els.tabs[n].focus();
    });
    doc.addEventListener('languagechange', () => {
      if (current) els.photo.textContent = (I18N.getLang() === 'es' && SCENES[current].photoEs) || SCENES[current].photo;
      renderPanel(current);
      renderYear();
      renderLegend();
    });
  }

  function init() {
    const hero = doc.querySelector('[data-seasons]');
    if (!hero) return;
    els = {
      hero,
      bg: Array.from(hero.querySelectorAll('.season-hero__bg img')),
      name: hero.querySelector('[data-season-name]'),
      months: hero.querySelector('[data-season-months]'),
      title: hero.querySelector('[data-season-title]'),
      lede: hero.querySelector('[data-season-lede]'),
      photo: hero.querySelector('[data-season-photo]'),
      tablist: hero.querySelector('[role="tablist"]'),
      tabs: Array.from(hero.querySelectorAll('[role="tab"]')),
      panel: doc.getElementById('season-panel'),
      panelBody: doc.querySelector('[data-season-panel]'),
      year: doc.querySelector('[data-year]'),
      legend: doc.querySelector('[data-year-legend]'),
      notes: doc.querySelector('[data-year-notes]')
    };
    const fromUrl = readUrl();
    renderYear();
    renderLegend();
    bind();
    show(fromUrl || seasonOfToday(), { writeUrl: !!fromUrl });
  }

  doc.addEventListener('DOMContentLoaded', init);
})();
