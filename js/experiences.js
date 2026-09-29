/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   experiences.js — The 24 experiences as data (single source)
   Used by find-your-ontario.html (quiz) and map.html (map).

   Each experience:
     id       short id used in links: map.html?experience=algonquin
     num      01–24, same order as the Home marquee
     cat      nature | culture | flavours | adventure
     sub      i18n key of its collection (sub.water…)
     region   toronto | niagara | bruce | blue-mountains | algonquin | stratford
              (same slugs as the Home links map.html?region=…)
     anchor   id of its <article> on the world page
     lat/lng  approximate location (main entrance or centre)
     photo    large photo (same as the world page) · thumb: 640px copy
     traits   0–3 affinity per trait, used by the quiz (see quiz.js)
   Added below the list, in SEASONS / TIME (seasons.html and
   plan-your-trip.html; the quiz keeps using traits only):
     seasons  0–3 affinity per season (spring, summer, autumn,
              winter). 0 = not recommended in that season.
     why      reason shown for the seasons with affinity ≥ 2
              (key season.why.<code> in js/seasons.js)
     time     suggested time in day blocks: 1 = a morning or an
              afternoon, 2 = half a day, 3 = the whole day.
              A planning estimate, not an official duration.
   Texts (description, why go) come from js/worlds-i18n.js:
     exp.<id>.text · exp.<id>.why
   ========================================================= */

(function () {
  'use strict';

  const CATEGORIES = {
    nature:    { key: 'cat.nature',    page: 'nature.html' },
    culture:   { key: 'cat.culture',   page: 'culture.html' },
    flavours:  { key: 'cat.flavours',  page: 'food.html' },
    adventure: { key: 'cat.adventure', page: 'entertainment.html' }
  };

  const REGIONS = {
    'toronto':        { key: 'region.torontoShort' },
    'niagara':        { key: 'region.niagara' },
    'bruce':          { key: 'region.bruce' },
    'blue-mountains': { key: 'region.blue' },
    'algonquin':      { key: 'region.algonquin' },
    'stratford':      { key: 'region.stratford' }
  };

  const EXPERIENCES = [
    /* ---------- NATURE ---------- */
    { id: 'niagara', num: 1, name: 'Niagara Falls', cat: 'nature', sub: 'sub.water', region: 'niagara',
      anchor: 'niagara-falls', place: 'Niagara Falls, Ontario', lat: 43.0799, lng: -79.0747,
      photo: 'images/home/nature-niagara-falls.webp',
      traits: { nature: 3, water: 3, landscape: 3, iconic: 3, family: 2, social: 2, thrill: 1, summer: 2, autumn: 1, winter: 1, escape: 1 } },
    { id: 'sauble', num: 2, name: 'Sauble Beach', cat: 'nature', sub: 'sub.water', region: 'bruce',
      anchor: 'sauble-beach', place: 'South Bruce Peninsula, Ontario', lat: 44.6326, lng: -81.2699,
      photo: 'images/home/nature-sauble-beach.webp',
      traits: { water: 3, calm: 3, summer: 3, nature: 2, family: 2, escape: 2, landscape: 1, social: 1 } },
    { id: 'islands', num: 3, name: 'Toronto Islands', cat: 'nature', sub: 'sub.water', region: 'toronto',
      anchor: 'toronto-islands', place: 'Toronto, Ontario', lat: 43.6205, lng: -79.3787,
      photo: 'images/nature/toronto-islands.webp',
      traits: { summer: 3, nature: 2, water: 2, calm: 2, family: 2, landscape: 2, active: 1, city: 1, iconic: 1 } },
    { id: 'algonquin', num: 4, name: 'Algonquin Provincial Park', cat: 'nature', sub: 'sub.parks', region: 'algonquin',
      anchor: 'algonquin-provincial-park', place: 'Highway 60, Ontario', lat: 45.5838, lng: -78.3571,
      photo: 'images/nature/algonquin-autumn-lake.webp',
      traits: { nature: 3, landscape: 3, calm: 3, autumn: 3, escape: 3, active: 2, water: 2, summer: 1, winter: 1 } },
    { id: 'bruce', num: 5, name: 'Bruce Peninsula National Park', cat: 'nature', sub: 'sub.parks', region: 'bruce',
      anchor: 'bruce-peninsula-national-park', place: 'Tobermory, Ontario', lat: 45.2413, lng: -81.5236,
      photo: 'images/nature/bruce-peninsula-cliffs.webp',
      traits: { nature: 3, water: 3, landscape: 3, active: 3, escape: 3, summer: 2, calm: 1, thrill: 1 } },
    { id: 'caves', num: 6, name: 'Scenic Caves Nature Adventures', cat: 'nature', sub: 'sub.parks', region: 'blue-mountains',
      anchor: 'scenic-caves', place: 'The Blue Mountains, Ontario', lat: 44.4947, lng: -80.2688,
      photo: 'images/home/nature-scenic-caves.webp',
      traits: { nature: 3, landscape: 2, active: 2, family: 2, autumn: 2, escape: 2, thrill: 1, summer: 1 } },

    /* ---------- CULTURE ---------- */
    { id: 'cntower', num: 7, name: 'CN Tower', cat: 'culture', sub: 'sub.landmarks', region: 'toronto',
      anchor: 'cn-tower', place: 'Toronto, Ontario', lat: 43.6426, lng: -79.3871,
      photo: 'images/culture/cn-tower.webp',
      traits: { city: 3, iconic: 3, thrill: 2, indoor: 2, social: 2, landscape: 1, family: 1, winter: 1 } },
    { id: 'casaloma', num: 8, name: 'Casa Loma', cat: 'culture', sub: 'sub.landmarks', region: 'toronto',
      anchor: 'casa-loma', place: 'Toronto, Ontario', lat: 43.6780, lng: -79.4094,
      photo: 'images/home/culture-casa-loma.webp',
      traits: { history: 3, city: 2, iconic: 2, indoor: 2, art: 1, family: 1, calm: 1, autumn: 1, winter: 1 } },
    { id: 'nathan', num: 9, name: 'Nathan Phillips Square', cat: 'culture', sub: 'sub.landmarks', region: 'toronto',
      anchor: 'nathan-phillips-square', place: 'Toronto, Ontario', lat: 43.6525, lng: -79.3839,
      photo: 'images/culture/nathan-phillips-square-panorama.webp',
      traits: { city: 3, social: 3, iconic: 2, winter: 2, history: 1, art: 1, sport: 1 } },
    { id: 'rom', num: 10, name: 'Royal Ontario Museum', cat: 'culture', sub: 'sub.museums', region: 'toronto',
      anchor: 'royal-ontario-museum', place: 'Toronto, Ontario', lat: 43.6677, lng: -79.3948,
      photo: 'images/home/culture-royal-ontario-museum.webp',
      traits: { history: 3, indoor: 3, art: 2, family: 2, city: 2, winter: 2, calm: 1, nature: 1 } },
    { id: 'ago', num: 11, name: 'Art Gallery of Ontario', cat: 'culture', sub: 'sub.museums', region: 'toronto',
      anchor: 'art-gallery-of-ontario', place: 'Toronto, Ontario', lat: 43.6536, lng: -79.3925,
      photo: 'images/culture/art-gallery-of-ontario.webp',
      traits: { art: 3, indoor: 3, calm: 2, city: 2, history: 1, winter: 1 } },
    { id: 'hhof', num: 12, name: 'Hockey Hall of Fame', cat: 'culture', sub: 'sub.museums', region: 'toronto',
      anchor: 'hockey-hall-of-fame', place: 'Toronto, Ontario', lat: 43.6473, lng: -79.3772,
      photo: 'images/culture/hockey-hall-of-fame.webp',
      traits: { sport: 3, indoor: 3, history: 2, family: 2, city: 2, winter: 2, social: 1, iconic: 1 } },

    /* ---------- FLAVOURS ---------- */
    { id: 'stlawrence', num: 13, name: 'St. Lawrence Market', cat: 'flavours', sub: 'sub.markets', region: 'toronto',
      anchor: 'st-lawrence-market', place: 'Toronto, Ontario', lat: 43.6487, lng: -79.3716,
      photo: 'images/home/flavours-st-lawrence-market.webp',
      traits: { food: 3, market: 3, history: 2, city: 2, social: 2, indoor: 2, winter: 1 } },
    { id: 'kensington', num: 14, name: 'Kensington Market', cat: 'flavours', sub: 'sub.markets', region: 'toronto',
      anchor: 'kensington-market', place: 'Toronto, Ontario', lat: 43.6547, lng: -79.4005,
      photo: 'images/flavours/kensington-market-street.webp',
      traits: { food: 3, city: 3, social: 3, street: 3, art: 2, market: 2, summer: 1 } },
    { id: 'distillery', num: 15, name: 'Distillery Historic District', cat: 'flavours', sub: 'sub.markets', region: 'toronto',
      anchor: 'distillery-historic-district', place: 'Toronto, Ontario', lat: 43.6503, lng: -79.3596,
      photo: 'images/flavours/distillery-district-wide.webp',
      traits: { history: 2, food: 2, art: 2, city: 2, social: 2, winter: 2, wine: 1, calm: 1 } },
    { id: 'wine', num: 16, name: 'Niagara Wine Country', cat: 'flavours', sub: 'sub.flavours', region: 'niagara',
      anchor: 'niagara-wine-country', place: 'Niagara-on-the-Lake, Ontario', lat: 43.2386, lng: -79.1134,
      photo: 'images/flavours/niagara-vineyard.webp',
      traits: { wine: 3, food: 3, calm: 3, autumn: 3, landscape: 2, escape: 2, nature: 1, summer: 1 } },
    { id: 'chocolate', num: 17, name: 'Stratford Chocolate Trail', cat: 'flavours', sub: 'sub.flavours', region: 'stratford',
      anchor: 'stratford-chocolate-trail', place: 'Stratford, Ontario', lat: 43.3705, lng: -80.9822,
      photo: 'images/flavours/stratford-chocolate-trail.webp',
      traits: { sweet: 3, food: 3, calm: 2, escape: 2, history: 1, art: 1, indoor: 1, winter: 1 } },
    { id: 'applepie', num: 18, name: 'Apple Pie Trail', cat: 'flavours', sub: 'sub.flavours', region: 'blue-mountains',
      anchor: 'apple-pie-trail', place: 'The Blue Mountains, Ontario', lat: 44.5603, lng: -80.4632,
      photo: 'images/flavours/apple-pie-trail.webp',
      traits: { sweet: 3, autumn: 3, food: 2, landscape: 2, calm: 2, nature: 2, escape: 2, wine: 1, active: 1 } },

    /* ---------- ADVENTURE ---------- */
    { id: 'wonderland', num: 19, name: 'Canada’s Wonderland', cat: 'adventure', sub: 'sub.family', region: 'toronto',
      anchor: 'canadas-wonderland', place: 'Vaughan, Ontario', lat: 43.8430, lng: -79.5395,
      photo: 'images/adventure/opener-leviathan-riders.webp',
      traits: { thrill: 3, family: 3, social: 3, summer: 3, active: 1 } },
    { id: 'ripleys', num: 20, name: 'Ripley’s Aquarium of Canada', cat: 'adventure', sub: 'sub.family', region: 'toronto',
      anchor: 'ripleys-aquarium', place: 'Toronto, Ontario', lat: 43.6424, lng: -79.3860,
      photo: 'images/home/adventure-ripleys-aquarium.webp',
      traits: { family: 3, indoor: 3, water: 2, city: 2, winter: 2, calm: 1, nature: 1 } },
    { id: 'zoo', num: 21, name: 'Toronto Zoo', cat: 'adventure', sub: 'sub.family', region: 'toronto',
      anchor: 'toronto-zoo', place: 'Toronto (Scarborough), Ontario', lat: 43.8177, lng: -79.1859,
      photo: 'images/adventure/toronto-zoo.webp',
      traits: { family: 3, wildlife: 3, nature: 2, summer: 2, active: 1, social: 1 } },
    { id: 'bluemountain', num: 22, name: 'Blue Mountain Resort', cat: 'adventure', sub: 'sub.seasonal', region: 'blue-mountains',
      anchor: 'blue-mountain-resort', place: 'The Blue Mountains, Ontario', lat: 44.5015, lng: -80.3105,
      photo: 'images/adventure/blue-mountain-night.webp',
      traits: { active: 3, winter: 3, thrill: 2, landscape: 2, escape: 2, sport: 2, social: 2, nature: 1, summer: 1 } },
    { id: 'butterfly', num: 23, name: 'Niagara Parks Butterfly Conservatory', cat: 'adventure', sub: 'sub.seasonal', region: 'niagara',
      anchor: 'butterfly-conservatory', place: 'Niagara Falls, Ontario', lat: 43.1597, lng: -79.0543,
      photo: 'images/home/adventure-butterfly-conservatory.webp',
      traits: { calm: 3, indoor: 3, wildlife: 2, nature: 2, family: 2, winter: 1 } },
    { id: 'treetop', num: 24, name: 'Treetop Trekking at Horseshoe Resort', cat: 'adventure', sub: 'sub.seasonal', region: 'blue-mountains',
      anchor: 'treetop-trekking', place: 'Oro-Medonte, Ontario', lat: 44.5536, lng: -79.6689,
      photo: 'images/adventure/horseshoe-resort-hill.webp',
      traits: { active: 3, thrill: 3, nature: 2, escape: 2, summer: 2, autumn: 1, family: 1, sport: 1 } }
  ];

  /* Seasonal affinity [spring, summer, autumn, winter] + reason per
     recommended season, and suggested time in day blocks. These are
     editorial recommendations based on the character of each place;
     verified seasonal facts are cited on seasons.html. */
  const SEASONS = {
    niagara:      { s: [2, 3, 1, 2], why: { spring: 'green', summer: 'water', winter: 'lights' }, time: 2 },
    sauble:       { s: [1, 3, 1, 0], why: { summer: 'beach' }, time: 2 },
    islands:      { s: [2, 3, 1, 1], why: { spring: 'green', summer: 'water' }, time: 2 },
    algonquin:    { s: [2, 3, 3, 1], why: { spring: 'green', summer: 'water', autumn: 'colours' }, time: 3 },
    bruce:        { s: [1, 3, 2, 1], why: { summer: 'water', autumn: 'trails' }, time: 3 },
    caves:        { s: [1, 2, 3, 2], why: { summer: 'green', autumn: 'colours', winter: 'nordic' }, time: 1 },
    cntower:      { s: [1, 1, 1, 2], why: { winter: 'indoor' }, time: 1 },
    casaloma:     { s: [1, 1, 1, 2], why: { winter: 'indoor' }, time: 1 },
    nathan:       { s: [2, 2, 1, 3], why: { spring: 'city', summer: 'city', winter: 'skating' }, time: 1 },
    rom:          { s: [1, 1, 1, 2], why: { winter: 'indoor' }, time: 2 },
    ago:          { s: [1, 1, 1, 2], why: { winter: 'indoor' }, time: 1 },
    hhof:         { s: [1, 1, 1, 2], why: { winter: 'indoor' }, time: 1 },
    stlawrence:   { s: [1, 1, 1, 2], why: { winter: 'indoor' }, time: 1 },
    kensington:   { s: [2, 3, 1, 1], why: { spring: 'city', summer: 'city' }, time: 1 },
    distillery:   { s: [2, 2, 1, 3], why: { spring: 'city', summer: 'city', winter: 'festive' }, time: 1 },
    wine:         { s: [1, 2, 3, 2], why: { summer: 'green', autumn: 'harvest', winter: 'icewine' }, time: 2 },
    chocolate:    { s: [1, 1, 1, 2], why: { winter: 'sweet' }, time: 1 },
    applepie:     { s: [1, 1, 3, 1], why: { autumn: 'colours' }, time: 2 },
    wonderland:   { s: [1, 3, 2, 0], why: { summer: 'thrill', autumn: 'haunt' }, time: 3, alt: { winter: 'winterfest' } },
    ripleys:      { s: [1, 1, 1, 2], why: { winter: 'indoor' }, time: 1 },
    zoo:          { s: [2, 2, 2, 1], why: { spring: 'wildlife', summer: 'wildlife', autumn: 'wildlife' }, time: 2 },
    bluemountain: { s: [1, 2, 2, 3], why: { summer: 'hike', autumn: 'colours', winter: 'snow' }, time: 2 },
    butterfly:    { s: [1, 1, 1, 3], why: { winter: 'tropical' }, time: 1 },
    treetop:      { s: [1, 3, 2, 0], why: { summer: 'canopy', autumn: 'colours' }, time: 2, alt: { winter: 'resort' } }
  };
  /* alt = seasons where the usual experience is closed or different but
     the place offers something else (verified on the official sites,
     texts seasons.alt.<code> in js/seasons.js). Display only: the matrix
     of seasons.html shows them as "Possible*" with a note, while the
     affinity above stays 0, so the planner still leaves them out. */
  const SEASON_KEYS = ['spring', 'summer', 'autumn', 'winter'];

  EXPERIENCES.forEach((e) => {
    const s = SEASONS[e.id];
    e.seasons = {};
    SEASON_KEYS.forEach((k, i) => { e.seasons[k] = s.s[i]; });
    e.why = s.why;
    e.seasonAlt = s.alt || {};
    e.time = s.time;
    e.thumb = `images/thumbs/${e.id}.webp`;
    e.page = CATEGORIES[e.cat].page;
    e.href = `${e.page}#${e.anchor}`;
    e.numLabel = String(e.num).padStart(2, '0');
  });

  // Accepts the short id (algonquin) or the page anchor (algonquin-provincial-park)
  function find(id) {
    if (!id) return null;
    id = String(id).toLowerCase();
    return EXPERIENCES.find((e) => e.id === id || e.anchor === id) || null;
  }

  // Straight-line (great-circle) distance in km between two points
  function km(a, b) {
    const R = 6371;
    const rad = (d) => d * Math.PI / 180;
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Centre of each region = average position of its experiences
  Object.keys(REGIONS).forEach((r) => {
    const inRegion = EXPERIENCES.filter((e) => e.region === r);
    REGIONS[r].lat = inRegion.reduce((s, e) => s + e.lat, 0) / inRegion.length;
    REGIONS[r].lng = inRegion.reduce((s, e) => s + e.lng, 0) / inRegion.length;
    REGIONS[r].count = inRegion.length;
  });

  window.OTE_EXPERIENCES = { list: EXPERIENCES, categories: CATEGORIES, regions: REGIONS, seasons: SEASON_KEYS, find, km };

  // Strings shared by the quiz, the map, the planner, seasons and favourites
  if (window.OTE_I18N) {
    window.OTE_I18N.extend({
      en: {
        'credits.results': 'Experience photos: same authors as on the four world pages.',
        'season.spring': 'Spring',
        'season.summer': 'Summer',
        'season.autumn': 'Fall',
        'season.winter': 'Winter',
        'season.months.spring': 'March – May',
        'season.months.summer': 'June – August',
        'season.months.autumn': 'September – November',
        'season.months.winter': 'December – February',
        'exp.viewMap': 'View on map',
        'exp.explore': 'Explore'
      },
      es: {
        'credits.results': 'Fotos de las experiencias: mismos autores que en las cuatro páginas de mundos.',
        'season.spring': 'Primavera',
        'season.summer': 'Verano',
        'season.autumn': 'Otoño',
        'season.winter': 'Invierno',
        'season.months.spring': 'Marzo – mayo',
        'season.months.summer': 'Junio – agosto',
        'season.months.autumn': 'Septiembre – noviembre',
        'season.months.winter': 'Diciembre – febrero',
        'exp.viewMap': 'Ver en el mapa',
        'exp.explore': 'Explorar'
      }
    });
  }
})();
