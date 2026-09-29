/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   plan.js — Plan Your Trip (plan-your-trip.html)

   Five choices (duration, company, interests, region, season)
   → a day-by-day itinerary built only from the 24 experiences
   of js/experiences.js. Deterministic: the same choices always
   give the same trip. Everything runs in the browser.

   HOW THE ITINERARY IS BUILT
   1. Score every experience:
        interests match ........ +6  (no interest chosen = all match)
        season affinity ........ 1 → +0 · 2 → +3 · 3 → +6 (0 = not recommended → left out)
        company fit ............ +0–2.4 (best of the traits that suit
                                  solo / couple / friends / family)
        saved as favourite ..... +8  (only with "plan with favourites")
      Families: wine-tasting experiences are left out.
      "Core" = matches the interests or is a favourite; the others
      are only used to fill free time next to a core experience.
   2. Regions (geography first):
        max regions by duration: 1 day → 1 · 2–3 days → 2 ·
        5 days → 3 · 7 days → 4; max days in one region:
        3 (5-day trip) · 4 (7-day trip), so long trips see more
        start with the chosen region (or the one with the best core
        experiences), then add a region only if more content is
        needed AND it is within 230 km in a straight line of a
        region already in the trip (150 km for 2 days).
        Algonquin + Niagara (≈ 280 km) can never share a trip.
        The regions are then ordered to make the shortest route.
   3. Days: each day stays in ONE region. Every change of base
      takes the morning of that day (shown as a travel block with
      the straight-line distance, never an invented travel time).
   4. Day blocks: morning · midday · afternoon. Each experience
      uses 1–3 blocks (experiences.js → time). Inside a day the
      experiences are grouped by distance (≤ 15 km first, then
      ≤ 35 km), so a day never jumps across a region. A market or
      food stop is placed at midday when possible.
   Try it from the console: OTE_PLAN.plan({ days: 3, company:
   'couple', interests: ['nature'], region: 'all', season: 'autumn' })
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const DATA = window.OTE_EXPERIENCES;
  if (!I18N || !DATA) return;

  const DURATIONS = [1, 2, 3, 5, 7];
  const COMPANY = ['solo', 'couple', 'friends', 'family'];
  const INTERESTS = Object.keys(DATA.categories);          // nature, culture, flavours, adventure
  const REGION_KEYS = Object.keys(DATA.regions);
  const SEASONS = DATA.seasons;                            // spring, summer, autumn, winter
  const MAX_REGIONS = { 1: 1, 2: 2, 3: 2, 5: 3, 7: 4 };
  const MAX_DAYS_IN_REGION = { 1: 1, 2: 2, 3: 3, 5: 3, 7: 4 };
  const MAX_HOP_KM = 230;
  const TWO_DAY_HOP_KM = 150;
  const NEAR_KM = [15, 35];
  const BLOCKS = 3;
  const COMPANY_TRAITS = {
    solo: ['calm', 'art', 'active'],
    couple: ['calm', 'landscape', 'wine'],
    friends: ['social', 'thrill'],
    family: ['family']
  };

  /* ---------------------------------------------------------
     ENGINE (pure functions)
     --------------------------------------------------------- */
  const dist = (a, b) => DATA.km(DATA.regions[a], DATA.regions[b]);

  function scoreAll(o) {
    return DATA.list.map((e) => {
      const fav = o.favs.includes(e.id);
      const aff = e.seasons[o.season] || 0;
      if (!aff) return { e, s: 0, fav, out: 'season' };
      if (o.company === 'family' && (e.traits.wine || 0) >= 3) return { e, s: 0, fav, out: 'family' };
      const interest = !o.interests.length || o.interests.includes(e.cat);
      const fit = Math.max(0, ...COMPANY_TRAITS[o.company].map((t) => e.traits[t] || 0));
      const s = (interest ? 6 : 0) + (aff - 1) * 3 + fit * 0.8 + (fav ? 8 : 0);
      return { e, s, fav, core: interest || fav, interest };
    });
  }

  const byScore = (a, b) => (b.core - a.core) || (b.s - a.s) || (a.e.num - b.e.num);

  // Shortest order of the regions; every hop must stay under the limit
  function orderRoute(regions, limit, start) {
    if (regions.length === 1) return regions.slice();
    let best = null;
    let bestKm = Infinity;
    const permute = (done, rest) => {
      if (!rest.length) {
        let total = 0;
        for (let i = 1; i < done.length; i++) {
          const d = dist(done[i - 1], done[i]);
          if (d > limit) return;
          total += d;
        }
        // Tie-break: start in the chosen / first region
        if (done[0] === start) total -= 0.5;
        if (total < bestKm) { bestKm = total; best = done; }
        return;
      }
      rest.forEach((r, i) => permute(done.concat(r), rest.filter((_, j) => j !== i)));
    };
    permute([], regions);
    return best;
  }

  function chooseRegions(o, pool) {
    const limit = o.days === 2 ? TWO_DAY_HOP_KM : MAX_HOP_KM;
    const core = (r) => pool.filter((x) => x.s > 0 && x.core && x.e.region === r).sort(byScore);
    const value = (r) => core(r).slice(0, 3).reduce((s, x) => s + x.s, 0);
    const cap = regionCap(o) * BLOCKS;
    const coreBlocks = (r) => Math.min(cap, core(r).reduce((s, x) => s + x.e.time, 0));
    const favCount = (r) => pool.filter((x) => x.s > 0 && x.fav && x.e.region === r).length;
    const byFavsThenValue = (a, b) => (favCount(b) - favCount(a)) || (value(b) - value(a)) || (REGION_KEYS.indexOf(a) - REGION_KEYS.indexOf(b));

    const chosen = [];
    if (o.region !== 'all') chosen.push(o.region);
    else chosen.push(REGION_KEYS.slice().sort(byFavsThenValue)[0]);

    // Favourites first: add the regions of the other favourites while
    // the route stays realistic (a favourite too far away is reported)
    if (o.region === 'all') {
      REGION_KEYS.filter((r) => favCount(r) && !chosen.includes(r)).sort(byFavsThenValue).forEach((r) => {
        if (chosen.length < MAX_REGIONS[o.days] && orderRoute(chosen.concat(r), limit, chosen[0])) chosen.push(r);
      });
    }

    const need = o.days * BLOCKS * 0.75;
    let extended = false;
    while (chosen.length < MAX_REGIONS[o.days]) {
      const have = chosen.reduce((s, r) => s + coreBlocks(r), 0);
      if (have >= need) break;
      const candidates = REGION_KEYS
        .filter((r) => !chosen.includes(r) && core(r).length)
        .map((r) => ({ r, d: Math.min(...chosen.map((c) => dist(r, c))), v: value(r) }))
        .filter((c) => c.d <= limit && orderRoute(chosen.concat(c.r), limit, chosen[0]))
        .sort((a, b) => ((b.v - b.d * 0.03) - (a.v - a.d * 0.03)) || (REGION_KEYS.indexOf(a.r) - REGION_KEYS.indexOf(b.r)));
      if (!candidates.length) break;
      chosen.push(candidates[0].r);
      if (o.region !== 'all') extended = true;
    }
    return { route: orderRoute(chosen, limit, chosen[0]), extended };
  }

  // A region chosen by the traveller can fill the whole trip
  const regionCap = (o) => (o.region === 'all' ? MAX_DAYS_IN_REGION[o.days] : o.days);

  function allocateDays(route, pool, o) {
    const days = o.days;
    const capDays = regionCap(o);
    const blocksIn = (r, onlyCore) => pool
      .filter((x) => x.s > 0 && x.e.region === r && (!onlyCore || x.core))
      .reduce((s, x) => s + x.e.time, 0);
    const need = (r, i, onlyCore) => Math.min(capDays, Math.max(1, Math.ceil((blocksIn(r, onlyCore) + (i > 0 ? 1 : 0)) / BLOCKS)));
    const alloc = route.map(() => 1);
    let left = days - route.length;
    [true, false].forEach((onlyCore) => {
      while (left > 0) {
        let best = -1;
        let gap = 0;
        route.forEach((r, i) => {
          const g = need(r, i, onlyCore) - alloc[i];
          if (g > gap) { gap = g; best = i; }
        });
        if (best < 0) break;
        alloc[best] += 1;
        left -= 1;
      }
    });
    // More days than content: the extra days go to the richest region
    // that still has room (or the richest one, if all are full)
    while (left > 0) {
      const open = route.map((r, i) => i).filter((i) => alloc[i] < capDays);
      const choices = open.length ? open : route.map((r, i) => i);
      let best = choices[0];
      choices.forEach((i) => { if (DATA.regions[route[i]].count > DATA.regions[route[best]].count) best = i; });
      alloc[best] += 1;
      left -= 1;
    }
    return alloc;
  }

  const isFoodStop = (e) => e.cat === 'flavours' && e.time === 1;

  // Market / food stop at midday when the day allows it
  function arrange(picked, start) {
    const food = picked.findIndex((p) => isFoodStop(p.x.e));
    if (food < 0 || picked.length < 2) return picked;
    const perms = [];
    const permute = (done, rest) => {
      if (!rest.length) { perms.push(done); return; }
      rest.forEach((p, i) => permute(done.concat(p), rest.filter((_, j) => j !== i)));
    };
    permute([], picked);
    return perms.find((order) => {
      let b = start;
      for (const p of order) {
        if (p === picked[food]) return b === 1;
        b += p.len;
      }
      return false;
    }) || picked;
  }

  function packRegion(region, nDays, travelFrom, pool, used) {
    const items = pool.filter((x) => x.s > 0 && x.e.region === region).sort(byScore);
    const remaining = (core) => items.filter((x) => !used.has(x.e.id) && (core === undefined || x.core === core));
    const out = [];

    for (let d = 0; d < nDays; d++) {
      const travel = d === 0 && travelFrom ? { from: travelFrom, to: region, km: Math.round(dist(travelFrom, region)) } : null;
      const start = travel ? 1 : 0;
      let cap = BLOCKS - start;
      const picked = [];

      // Anchor: best core experience that fits, else the best one (it takes the rest of the day)
      const pickAnchor = (core) => remaining(core).find((x) => x.e.time <= cap) || remaining(core)[0];
      const anchor = pickAnchor(true) || pickAnchor(false);
      if (anchor) {
        const len = Math.min(anchor.e.time, cap);
        picked.push({ x: anchor, len });
        used.add(anchor.e.id);
        cap -= len;
        // Then nearby experiences: core first, closest ring first
        [true, false].forEach((core) => NEAR_KM.forEach((radius) => {
          remaining(core).forEach((x) => {
            if (x.e.time <= cap && DATA.km(x.e, anchor.e) <= radius) {
              picked.push({ x, len: x.e.time });
              used.add(x.e.id);
              cap -= x.e.time;
            }
          });
        }));
      }

      const slots = [];
      if (travel) slots.push({ type: 'travel', start: 0, len: 1, travel });
      let b = start;
      arrange(picked, start).forEach((p) => {
        slots.push({ type: 'exp', start: b, len: p.len, e: p.x.e, core: p.x.core, fav: p.x.fav });
        b += p.len;
      });
      if (b < BLOCKS) slots.push({ type: 'free', start: b, len: BLOCKS - b });
      out.push({ region, slots });
    }
    return out;
  }

  function plan(input) {
    const o = normalise(input);
    if (!o) return null;
    const pool = scoreAll(o);
    const { route, extended } = chooseRegions(o, pool);
    const alloc = allocateDays(route, pool, o);
    const used = new Set();
    const days = [];
    route.forEach((r, i) => {
      packRegion(r, alloc[i], i > 0 ? route[i - 1] : null, pool, used).forEach((d) => days.push(d));
    });
    days.forEach((d, i) => { d.n = i + 1; });

    const ids = [];
    days.forEach((d) => d.slots.forEach((s) => { if (s.type === 'exp') ids.push(s.e.id); }));

    // Favourites that did not make it, with the reason
    const left = o.favs.map((id) => pool.find((x) => x.e.id === id)).filter((x) => x && !used.has(x.e.id))
      .map((x) => ({ e: x.e, why: x.out || (route.includes(x.e.region) ? 'time' : 'route') }));

    const notes = [];
    if (extended) notes.push('extended');
    if (o.region !== 'all' && !pool.some((x) => x.s > 0 && x.core && x.e.region === o.region)) notes.push('noCore');
    if (days.some((d) => !d.slots.some((s) => s.type === 'exp'))) notes.push('freeDays');

    return { o, route, days, ids, left, notes };
  }

  function normalise(input) {
    if (!input) return null;
    const o = {
      days: Number(input.days),
      company: input.company,
      interests: (input.interests || []).filter((i) => INTERESTS.includes(i)),
      region: input.region || 'all',
      season: input.season,
      favs: (input.favs || []).map((id) => DATA.find(id)).filter(Boolean).map((e) => e.id)
    };
    if (!DURATIONS.includes(o.days) || !COMPANY.includes(o.company) || !SEASONS.includes(o.season)) return null;
    if (o.region !== 'all' && !DATA.regions[o.region]) return null;
    return o;
  }

  window.OTE_PLAN = { plan };

  /* ---------------------------------------------------------
     TEXTS (EN | ES)
     --------------------------------------------------------- */
  I18N.extend({
    en: {
      'title.plan': 'Plan Your Trip — Ontario Tourism Experiences',
      'meta.plan': 'Choose how many days, who you travel with, your interests, a region and a season: get a realistic day-by-day itinerary with the 24 experiences of this guide.',
      'plan.intro.eyebrow': 'Interactive planner',
      'plan.intro.title': 'Plan<br><em>your trip.</em>',
      'plan.intro.lede': 'Five quick choices and the 24 experiences of this guide become a day-by-day itinerary, grouped by region so you spend your time exploring, not driving back and forth.',
      'plan.intro.m1': 'Choices',
      'plan.intro.m2': 'Experiences',
      'plan.intro.m3': 'Regions',
      'plan.intro.start': 'Start planning',
      'plan.intro.note': 'Calculated in your browser. No sign-up and no personal data.',
      'plan.intro.photo': 'View from Blue Mountain',
      'plan.intro.favs': 'Plan with my favourites ({n})',
      'plan.intro.favsHint': 'Your saved experiences get priority when the route allows it.',

      'plan.step': 'Step {n} of 5',
      'plan.progressLabel': 'Planner progress',
      'plan.goTo': 'Go back to step {n}',
      'plan.back': 'Back',
      'plan.next': 'Continue',
      'plan.create': 'Create my trip',
      'plan.multi': 'Choose one or more.',

      'plan.q.days.topic': 'Duration',
      'plan.q.days.title': 'How many days do you have?',
      'plan.o.days.1': '1 day',
      'plan.o.days.1.hint': 'One region, at an easy pace',
      'plan.o.days.2': '2 days',
      'plan.o.days.2.hint': 'A weekend, up to two nearby regions',
      'plan.o.days.3': '3 days',
      'plan.o.days.3.hint': 'Up to two regions',
      'plan.o.days.5': '5 days',
      'plan.o.days.5.hint': 'Up to three regions',
      'plan.o.days.7': '7 days',
      'plan.o.days.7.hint': 'A full week, up to four regions',

      'plan.q.company.topic': 'Company',
      'plan.q.company.title': 'Who are you travelling with?',
      'plan.o.company.solo': 'Solo',
      'plan.o.company.solo.hint': 'My own route, my own time',
      'plan.o.company.couple': 'As a couple',
      'plan.o.company.couple.hint': 'A getaway for two',
      'plan.o.company.friends': 'With friends',
      'plan.o.company.friends.hint': 'Shared plans and a lively pace',
      'plan.o.company.family': 'With family',
      'plan.o.company.family.hint': 'Something for every age',

      'plan.q.interests.topic': 'Interests',
      'plan.q.interests.title': 'What do you want to experience?',

      'plan.q.region.topic': 'Region',
      'plan.q.region.title': 'Where would you like to go?',
      'plan.o.region.all': 'All of Ontario',
      'plan.o.region.all.hint': 'Let the planner choose the best area',

      'plan.q.season.topic': 'Season',
      'plan.q.season.title': 'When are you travelling?',

      'plan.days': '{n} days',
      'plan.days.one': '{n} day',

      'trip.eyebrow': 'Your Ontario trip',
      'trip.title': '{n} days<br><em>in Ontario.</em>',
      'trip.title.one': 'One day<br><em>in Ontario.</em>',
      'trip.duration': 'Duration',
      'trip.season': 'Season',
      'trip.company': 'Travelling',
      'trip.interests': 'Interests',
      'trip.allInterests': 'All four worlds',
      'trip.regions': 'Route',
      'trip.straight': 'Straight-line distance',
      'trip.map': 'View trip on map',
      'trip.restart': 'Start again',
      'trip.edit': 'Change my choices',
      'trip.day': 'Day',
      'trip.dayLabel': 'Day {n}',
      'trip.stops': '{n} experiences',
      'trip.stops.one': '{n} experience',
      'trip.morning': 'Morning',
      'trip.midday': 'Midday',
      'trip.afternoon': 'Afternoon',
      'trip.allDay': 'All day',
      'trip.restOfDay': 'Rest of the day',
      'trip.travel': 'Change of base',
      'trip.travelText': '{from} → {to} · about {km} km in a straight line. Road distance is longer: check the route before you leave.',
      'trip.free': 'Free time',
      'trip.freeText': 'Time to rest, eat or explore the surroundings at your own pace.',
      'trip.freeDay': 'A free day in {region}: slow down, repeat a favourite or explore on your own.',
      'trip.bonus': 'Also nearby',
      'trip.favBadge': 'Favourite',
      'trip.how': 'How this trip was built',
      'trip.how1': 'Each day stays in one region.',
      'trip.how2': 'Regions are joined only when they are close enough (up to about 230 km in a straight line).',
      'trip.how3': 'A change of base takes the morning of that day.',
      'trip.how4': 'Time blocks are suggestions, not schedules: check opening hours on each official website.',
      'trip.note.extended': 'Your region did not have enough experiences for every day, so the trip continues in the closest region with experiences that match your choices.',
      'trip.note.noCore': 'This region has no experiences of the worlds you chose, so the plan shows what it does offer.',
      'trip.note.freeDays': 'There are more days than suitable experiences for these choices: some days are left free.',
      'trip.left': 'Favourites not included',
      'trip.left.season': 'not recommended in this season',
      'trip.left.family': 'wine tastings are left out of family trips',
      'trip.left.route': 'too far from this route',
      'trip.left.time': 'no time left in this plan',
      'trip.explore': 'Explore',
      'trip.onMap': 'Map'
    },
    es: {
      'title.plan': 'Planifica tu viaje — Experiencias Turísticas de Ontario',
      'meta.plan': 'Elige cuántos días, con quién viajas, tus intereses, una región y una temporada: obtén un itinerario realista día a día con las 24 experiencias de esta guía.',
      'plan.intro.eyebrow': 'Planificador interactivo',
      'plan.intro.title': 'Planifica<br><em>tu viaje.</em>',
      'plan.intro.lede': 'Cinco elecciones rápidas y las 24 experiencias de esta guía se convierten en un itinerario día a día, agrupado por regiones para que pases el tiempo explorando y no yendo y viniendo por carretera.',
      'plan.intro.m1': 'Elecciones',
      'plan.intro.m2': 'Experiencias',
      'plan.intro.m3': 'Regiones',
      'plan.intro.start': 'Empezar a planificar',
      'plan.intro.note': 'Se calcula en tu navegador. Sin registro y sin datos personales.',
      'plan.intro.photo': 'Vista desde Blue Mountain',
      'plan.intro.favs': 'Planificar con mis favoritos ({n})',
      'plan.intro.favsHint': 'Tus experiencias guardadas tienen prioridad cuando la ruta lo permite.',

      'plan.step': 'Paso {n} de 5',
      'plan.progressLabel': 'Progreso del planificador',
      'plan.goTo': 'Volver al paso {n}',
      'plan.back': 'Atrás',
      'plan.next': 'Continuar',
      'plan.create': 'Crear mi viaje',
      'plan.multi': 'Elige una o varias.',

      'plan.q.days.topic': 'Duración',
      'plan.q.days.title': '¿Cuántos días tienes?',
      'plan.o.days.1': '1 día',
      'plan.o.days.1.hint': 'Una región, con calma',
      'plan.o.days.2': '2 días',
      'plan.o.days.2.hint': 'Un fin de semana, hasta dos regiones cercanas',
      'plan.o.days.3': '3 días',
      'plan.o.days.3.hint': 'Hasta dos regiones',
      'plan.o.days.5': '5 días',
      'plan.o.days.5.hint': 'Hasta tres regiones',
      'plan.o.days.7': '7 días',
      'plan.o.days.7.hint': 'Una semana completa, hasta cuatro regiones',

      'plan.q.company.topic': 'Compañía',
      'plan.q.company.title': '¿Con quién viajas?',
      'plan.o.company.solo': 'Solo o sola',
      'plan.o.company.solo.hint': 'Mi ruta, mi tiempo',
      'plan.o.company.couple': 'En pareja',
      'plan.o.company.couple.hint': 'Una escapada para dos',
      'plan.o.company.friends': 'Con amigos',
      'plan.o.company.friends.hint': 'Planes compartidos y un ritmo animado',
      'plan.o.company.family': 'En familia',
      'plan.o.company.family.hint': 'Algo para cada edad',

      'plan.q.interests.topic': 'Intereses',
      'plan.q.interests.title': '¿Qué quieres vivir?',

      'plan.q.region.topic': 'Región',
      'plan.q.region.title': '¿A dónde te gustaría ir?',
      'plan.o.region.all': 'Todo Ontario',
      'plan.o.region.all.hint': 'Deja que el planificador elija la mejor zona',

      'plan.q.season.topic': 'Temporada',
      'plan.q.season.title': '¿Cuándo viajas?',

      'plan.days': '{n} días',
      'plan.days.one': '{n} día',

      'trip.eyebrow': 'Tu viaje por Ontario',
      'trip.title': '{n} días<br><em>en Ontario.</em>',
      'trip.title.one': 'Un día<br><em>en Ontario.</em>',
      'trip.duration': 'Duración',
      'trip.season': 'Temporada',
      'trip.company': 'Viajas',
      'trip.interests': 'Intereses',
      'trip.allInterests': 'Los cuatro mundos',
      'trip.regions': 'Ruta',
      'trip.straight': 'Distancia en línea recta',
      'trip.map': 'Ver viaje en el mapa',
      'trip.restart': 'Reiniciar plan',
      'trip.edit': 'Cambiar mis elecciones',
      'trip.day': 'Día',
      'trip.dayLabel': 'Día {n}',
      'trip.stops': '{n} experiencias',
      'trip.stops.one': '{n} experiencia',
      'trip.morning': 'Mañana',
      'trip.midday': 'Mediodía',
      'trip.afternoon': 'Tarde',
      'trip.allDay': 'Todo el día',
      'trip.restOfDay': 'Resto del día',
      'trip.travel': 'Cambio de base',
      'trip.travelText': '{from} → {to} · unos {km} km en línea recta. La distancia por carretera es mayor: consulta la ruta antes de salir.',
      'trip.free': 'Tiempo libre',
      'trip.freeText': 'Para descansar, comer o recorrer los alrededores a tu ritmo.',
      'trip.freeDay': 'Un día libre en {region}: baja el ritmo, repite un favorito o explora por tu cuenta.',
      'trip.bonus': 'También cerca',
      'trip.favBadge': 'Favorito',
      'trip.how': 'Cómo se construyó este viaje',
      'trip.how1': 'Cada día transcurre en una sola región.',
      'trip.how2': 'Solo se unen regiones suficientemente cercanas (hasta unos 230 km en línea recta).',
      'trip.how3': 'Un cambio de base ocupa la mañana de ese día.',
      'trip.how4': 'Los bloques horarios son sugerencias, no horarios: consulta el horario de apertura en la web oficial de cada lugar.',
      'trip.note.extended': 'Tu región no tenía experiencias suficientes para todos los días, así que el viaje continúa en la región más cercana con experiencias acordes a tus elecciones.',
      'trip.note.noCore': 'Esta región no tiene experiencias de los mundos que elegiste; el plan muestra lo que sí ofrece.',
      'trip.note.freeDays': 'Hay más días que experiencias adecuadas para estas elecciones: algunos días quedan libres.',
      'trip.left': 'Favoritos no incluidos',
      'trip.left.season': 'no recomendado en esta temporada',
      'trip.left.family': 'las catas de vino no se incluyen en viajes en familia',
      'trip.left.route': 'demasiado lejos de esta ruta',
      'trip.left.time': 'no queda tiempo en este plan',
      'trip.explore': 'Explorar',
      'trip.onMap': 'Mapa'
    }
  });

  /* ---------------------------------------------------------
     INTERFACE — five scenes (same language as the quiz)
     --------------------------------------------------------- */
  const doc = document;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t = (k, v) => I18N.t(k, v);
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const favApi = () => window.OTE_FAV;

  const STEPS = [
    { id: 'days', img: 'images/culture/opener-toronto-skyline.webp', pos: 'center',
      options: DURATIONS.map((d) => ({ id: String(d), key: pad(d), label: `plan.o.days.${d}`, hint: `plan.o.days.${d}.hint` })) },
    { id: 'company', img: 'images/nature/toronto-islands.webp', pos: 'center 60%',
      options: COMPANY.map((c, i) => ({ id: c, key: 'ABCD'[i], label: `plan.o.company.${c}`, hint: `plan.o.company.${c}.hint` })) },
    { id: 'interests', multi: true, img: 'images/flavours/opener-niagara-grapes.webp', pos: 'center',
      options: INTERESTS.map((c) => ({ id: c, dot: c, label: DATA.categories[c].key, hint: { nature: 'section.nature', culture: 'section.culture', flavours: 'section.food', adventure: 'section.adventure' }[c] })) },
    { id: 'region', grid: true, img: 'images/home/map-bruce-peninsula.webp', pos: 'center 60%',
      options: [{ id: 'all', key: '06', label: 'plan.o.region.all', hint: 'plan.o.region.all.hint' }]
        .concat(REGION_KEYS.map((r) => ({ id: r, key: pad(DATA.regions[r].count), label: DATA.regions[r].key, hintCount: DATA.regions[r].count }))) },
    { id: 'season', img: 'images/home/hero-algonquin-autumn.webp', pos: 'center',
      options: SEASONS.map((s, i) => ({ id: s, key: 'ABCD'[i], label: `season.${s}`, hint: `season.months.${s}` })) }
  ];

  let root, stage, bgLayers, live, tripEl;
  let step = -1;
  const answers = { days: null, company: null, interests: [], region: null, season: null };
  let useFavs = false;
  let busy = false;
  let lastPlan = null;

  const answered = (s) => (s.multi ? answers[s.id].length > 0 : !!answers[s.id]);

  function init() {
    root = doc.querySelector('[data-planner]');
    if (!root) return;
    stage = root.querySelector('.quiz__stage');
    bgLayers = Array.from(root.querySelectorAll('.quiz__bg img'));
    live = root.querySelector('.quiz__live');
    tripEl = doc.querySelector('[data-trip]');

    const complete = readUrl();
    renderFavToggle();

    root.addEventListener('click', onClick);
    tripEl.addEventListener('click', onTripClick);
    doc.addEventListener('languagechange', () => {
      if (lastPlan && !tripEl.hidden) renderTrip(lastPlan, false);
      if (step >= 0 && step < STEPS.length) updateSummary();
      renderFavToggle();
    });
    doc.addEventListener('favouriteschange', renderFavToggle);

    if (complete) showTrip(false);
    else preload(STEPS[0].img);
  }

  /* ---------- URL: shareable and reloadable ---------- */
  function readUrl() {
    const p = new URLSearchParams(window.location.search);
    const days = Number(p.get('days'));
    if (DURATIONS.includes(days)) answers.days = String(days);
    if (COMPANY.includes(p.get('with'))) answers.company = p.get('with');
    answers.interests = (p.get('interests') || '').split(',').filter((i) => INTERESTS.includes(i));
    const region = p.get('region');
    if (region === 'all' || DATA.regions[region]) answers.region = region;
    const season = { fall: 'autumn' }[p.get('season')] || p.get('season');
    if (SEASONS.includes(season)) answers.season = season;
    useFavs = p.get('favs') === '1' && !!favApi() && favApi().count() > 0;
    return STEPS.every(answered);
  }

  function writeUrl() {
    const p = new URLSearchParams();
    p.set('days', answers.days);
    p.set('with', answers.company);
    p.set('interests', answers.interests.join(','));
    p.set('region', answers.region);
    p.set('season', answers.season);
    if (useFavs) p.set('favs', '1');
    window.history.replaceState(null, '', `${window.location.pathname}?${p.toString()}`);
  }

  function clearUrl() {
    window.history.replaceState(null, '', window.location.pathname);
  }

  /* ---------- Background (same cross-fade as the quiz) ---------- */
  function preload(src) { if (src) { const i = new Image(); i.src = src; } }

  function setBackground(src, pos) {
    const current = bgLayers.find((img) => img.classList.contains('is-active'));
    if (current && current.getAttribute('src') === src) return;
    const next = bgLayers.find((img) => img !== current);
    const show = () => {
      next.style.objectPosition = pos || 'center';
      next.classList.add('is-active');
      if (current) current.classList.remove('is-active');
    };
    next.onload = show;
    next.src = src;
    if (next.complete && next.naturalWidth) { next.onload = null; show(); }
  }

  /* ---------- Favourites toggle on the intro ---------- */
  function renderFavToggle() {
    const box = root && root.querySelector('[data-plan-favs]');
    if (!box) return;
    const n = favApi() ? favApi().count() : 0;
    box.hidden = n === 0;
    if (!n) { useFavs = false; return; }
    box.innerHTML = `
      <button type="button" class="plan-favs" data-use-favs aria-pressed="${useFavs}">
        <span class="plan-favs__box" aria-hidden="true"></span>
        <span class="plan-favs__text">
          <span class="plan-favs__label">${esc(t('plan.intro.favs', { n }))}</span>
          <span class="plan-favs__hint">${esc(t('plan.intro.favsHint'))}</span>
        </span>
      </button>`;
  }

  /* ---------- Scenes ---------- */
  function go(target) {
    if (busy) return;
    busy = true;
    const leave = reduceMotion ? 0 : 380;
    root.classList.add('is-leaving');
    window.setTimeout(() => {
      step = target;
      root.dataset.step = target < 0 ? 'intro' : 'question';
      if (target < 0) showIntro();
      else renderStep();
      root.classList.remove('is-leaving');
      root.classList.add('is-entering');
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => root.classList.remove('is-entering')));
      busy = false;
      const focusEl = stage.querySelector('[data-focus]');
      if (focusEl) focusEl.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    }, leave);
  }

  function showIntro() {
    stage.querySelectorAll('.quiz-q').forEach((el) => el.remove());
    root.querySelector('.quiz-intro').hidden = false;
    setBackground('images/adventure/opener-blue-mountain-view.webp', 'center');
  }

  function isChosen(s, id) {
    return s.multi ? answers[s.id].includes(id) : answers[s.id] === id;
  }

  function renderStep() {
    const s = STEPS[step];
    const n = step + 1;
    const last = step === STEPS.length - 1;
    root.querySelector('.quiz-intro').hidden = true;
    setBackground(s.img, s.pos);
    preload(STEPS[step + 1] && STEPS[step + 1].img);

    const progress = STEPS.map((_, i) => {
      const state = i < step ? 'is-done' : i === step ? 'is-current' : '';
      return `<li class="${state}">${i < step
        ? `<button type="button" data-jump="${i}" data-i18n-attr="aria-label:plan.goTo" data-i18n-vars='{"n":${i + 1}}'><span>${pad(i + 1)}</span></button>`
        : `<span aria-hidden="true"><span>${pad(i + 1)}</span></span>`}</li>`;
    }).join('');

    const options = s.options.map((o, i) => {
      const hint = o.hintCount !== undefined
        ? `<span class="quiz-option__hint" data-i18n="common.expCount" data-i18n-vars='{"n":${o.hintCount}}'></span>`
        : `<span class="quiz-option__hint" data-i18n="${o.hint}"></span>`;
      const key = o.dot
        ? `<span class="quiz-option__key quiz-option__key--dot" aria-hidden="true"><span class="cat-dot cat-dot--${o.dot}"></span></span>`
        : `<span class="quiz-option__key" aria-hidden="true">${o.key}</span>`;
      return `
        <li style="--i:${i}">
          <button type="button" class="quiz-option${s.multi ? ' quiz-option--multi' : ''}" data-option="${o.id}" aria-pressed="${isChosen(s, o.id)}">
            ${key}
            <span class="quiz-option__text">
              <span class="quiz-option__label" data-i18n="${o.label}"></span>
              ${hint}
            </span>
            <span class="quiz-option__check" aria-hidden="true"></span>
          </button>
        </li>`;
    }).join('');

    const html = `
      <section class="quiz-q planner-q" aria-labelledby="plan-q-title">
        <div class="quiz-q__top">
          <ol class="quiz-progress" data-i18n-attr="aria-label:plan.progressLabel">${progress}</ol>
          <p class="quiz-q__count"><span>${pad(n)}</span> / 05</p>
        </div>
        <span class="quiz-q__num" aria-hidden="true">${pad(n)}</span>
        <div class="quiz-q__head">
          <p class="eyebrow" data-i18n="plan.q.${s.id}.topic"></p>
          <h1 class="quiz-q__title" id="plan-q-title" tabindex="-1" data-focus>
            <span class="sr-only" data-i18n="plan.step" data-i18n-vars='{"n":${n}}'></span>
            <span data-i18n="plan.q.${s.id}.title"></span>
          </h1>
          ${s.multi ? '<p class="quiz-q__keys" data-i18n="plan.multi"></p>' : ''}
        </div>
        <ul class="quiz-q__options${s.grid ? ' quiz-q__options--grid' : ''}" role="list" ${s.multi ? '' : ''}>${options}</ul>
        <div class="quiz-q__nav">
          <button type="button" class="quiz-back" data-back>
            <span class="arrow arrow--back" aria-hidden="true"></span><span data-i18n="plan.back"></span>
          </button>
          <p class="planner-summary" data-summary aria-hidden="true"></p>
          <button type="button" class="btn quiz-next" data-next${answered(s) ? '' : ' disabled aria-disabled="true"'}>
            <span class="btn__label"><span data-i18n="${last ? 'plan.create' : 'plan.next'}"></span></span>
            <span class="arrow" aria-hidden="true"></span>
          </button>
        </div>
      </section>`;

    stage.querySelectorAll('.quiz-q').forEach((el) => el.remove());
    stage.insertAdjacentHTML('beforeend', html);
    I18N.apply(stage.querySelector('.quiz-q'));
    updateSummary();
    announce(t('plan.step', { n }));
  }

  // "3 days · As a couple · Nature, Flavours · All Ontario · Fall"
  function summaryParts() {
    const parts = [];
    if (answers.days) parts.push(t('plan.days', { n: Number(answers.days) }));
    if (answers.company) parts.push(t(`plan.o.company.${answers.company}`));
    if (answers.interests.length) parts.push(answers.interests.map((i) => t(DATA.categories[i].key)).join(', '));
    if (answers.region) parts.push(answers.region === 'all' ? t('plan.o.region.all') : t(DATA.regions[answers.region].key));
    if (answers.season) parts.push(t(`season.${answers.season}`));
    return parts;
  }

  function updateSummary() {
    const el = stage && stage.querySelector('[data-summary]');
    if (el) el.textContent = summaryParts().join('  ·  ');
  }

  function choose(id) {
    if (busy || step < 0 || step >= STEPS.length) return;
    const s = STEPS[step];
    if (s.multi) {
      const list = answers[s.id];
      answers[s.id] = list.includes(id) ? list.filter((x) => x !== id) : INTERESTS.filter((x) => list.includes(x) || x === id);
    } else {
      answers[s.id] = id;
    }
    stage.querySelectorAll('.quiz-option').forEach((b) => b.setAttribute('aria-pressed', String(isChosen(s, b.dataset.option))));
    const next = stage.querySelector('[data-next]');
    if (next) {
      next.disabled = !answered(s);
      if (answered(s)) next.removeAttribute('aria-disabled');
      else next.setAttribute('aria-disabled', 'true');
    }
    updateSummary();
  }

  function advance() {
    if (busy || step < 0 || !answered(STEPS[step])) return;
    if (step === STEPS.length - 1) { showTrip(true); return; }
    go(step + 1);
  }

  function announce(text) {
    if (!live) return;
    live.textContent = '';
    window.setTimeout(() => { live.textContent = text; }, 60);
  }

  function onClick(event) {
    if (event.target.closest('[data-plan-start]')) { go(0); return; }
    const favToggle = event.target.closest('[data-use-favs]');
    if (favToggle) { useFavs = !useFavs; favToggle.setAttribute('aria-pressed', String(useFavs)); return; }
    const option = event.target.closest('[data-option]');
    if (option) { choose(option.dataset.option); return; }
    if (event.target.closest('[data-back]')) { go(step - 1); return; }
    if (event.target.closest('[data-next]')) { advance(); return; }
    const jump = event.target.closest('[data-jump]');
    if (jump) go(Number(jump.dataset.jump));
  }

  /* ---------------------------------------------------------
     RESULT — the trip
     --------------------------------------------------------- */
  function currentInput() {
    return {
      days: Number(answers.days),
      company: answers.company,
      interests: answers.interests,
      region: answers.region,
      season: answers.season,
      favs: useFavs && favApi() ? favApi().list() : []
    };
  }

  function showTrip(animate) {
    lastPlan = plan(currentInput());
    if (!lastPlan) return;
    writeUrl();
    root.hidden = true;
    tripEl.hidden = false;
    renderTrip(lastPlan, animate);
    window.scrollTo({ top: 0, behavior: 'auto' });
    const title = tripEl.querySelector('[data-focus]');
    if (title) title.focus({ preventScroll: true });
  }

  function restart(keepAnswers) {
    tripEl.hidden = true;
    tripEl.innerHTML = '';
    lastPlan = null;
    if (!keepAnswers) {
      answers.days = null; answers.company = null; answers.interests = []; answers.region = null; answers.season = null;
      clearUrl();
    }
    root.hidden = false;
    step = -1;
    stage.querySelectorAll('.quiz-q').forEach((el) => el.remove());
    root.dataset.step = 'intro';
    if (keepAnswers) go(0);
    else { showIntro(); const start = root.querySelector('[data-plan-start]'); if (start) start.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function onTripClick(event) {
    if (event.target.closest('[data-restart]')) { restart(false); return; }
    if (event.target.closest('[data-edit]')) restart(true);
  }

  const regionName = (r) => t(DATA.regions[r].key);

  function slotTime(s) {
    const names = ['trip.morning', 'trip.midday', 'trip.afternoon'];
    if (s.len >= 3) return t('trip.allDay');
    if (s.type === 'exp' && s.len < s.e.time) return t('trip.restOfDay');
    if (s.len === 1) return t(names[s.start]);
    return `${t(names[s.start])} – ${t(names[s.start + s.len - 1])}`;
  }

  function stopTemplate(s, dayN, i) {
    const e = s.e;
    const cat = DATA.categories[e.cat];
    const fav = favApi();
    return `
      <li class="trip-stop" style="--i:${i}">
        <p class="trip-stop__time">${esc(slotTime(s))}</p>
        <figure class="trip-stop__media">
          <img src="${e.thumb}" width="640" height="427" alt="" loading="lazy" decoding="async">
          <span class="trip-stop__num" aria-hidden="true">${e.numLabel}</span>
        </figure>
        <div class="trip-stop__body">
          <p class="trip-stop__meta">
            <span class="cat-dot cat-dot--${e.cat}" aria-hidden="true"></span><span>${esc(t(cat.key))}</span>
            ${s.fav ? `<span class="trip-stop__tag trip-stop__tag--fav">♥ ${esc(t('trip.favBadge'))}</span>` : ''}
            ${!s.core ? `<span class="trip-stop__tag">${esc(t('trip.bonus'))}</span>` : ''}
          </p>
          <h3 class="trip-stop__name">${esc(e.name)}</h3>
          <p class="trip-stop__place">${esc(e.place)}</p>
          <p class="trip-stop__why">${esc(t(`exp.${e.id}.why`))}</p>
          <div class="trip-stop__actions">
            <a class="link-arrow" href="${e.href}"><span>${esc(t('trip.explore'))}</span><span class="arrow" aria-hidden="true"></span></a>
            <a class="link-arrow" href="map.html?experience=${e.id}"><span>${esc(t('exp.viewMap'))}</span><span class="map-pin-icon" aria-hidden="true"></span></a>
            ${fav ? fav.button(e) : ''}
          </div>
        </div>
      </li>`;
  }

  function dayTemplate(d) {
    const exps = d.slots.filter((s) => s.type === 'exp');
    const rows = d.slots.map((s, i) => {
      if (s.type === 'exp') return stopTemplate(s, d.n, i);
      if (s.type === 'travel') {
        return `
          <li class="trip-move" style="--i:${i}">
            <p class="trip-stop__time">${esc(t('trip.morning'))}</p>
            <span class="trip-move__icon" aria-hidden="true"></span>
            <div>
              <p class="trip-move__title">${esc(t('trip.travel'))}</p>
              <p class="trip-move__text">${esc(t('trip.travelText', { from: regionName(s.travel.from), to: regionName(s.travel.to), km: s.travel.km }))}</p>
            </div>
          </li>`;
      }
      return `
        <li class="trip-free" style="--i:${i}">
          <p class="trip-stop__time">${esc(slotTime(s))}</p>
          <span class="trip-free__icon" aria-hidden="true"></span>
          <div>
            <p class="trip-move__title">${esc(t('trip.free'))}</p>
            <p class="trip-move__text">${esc(exps.length ? t('trip.freeText') : t('trip.freeDay', { region: regionName(d.region) }))}</p>
          </div>
        </li>`;
    }).join('');

    return `
      <li class="trip-day" aria-labelledby="trip-day-${d.n}">
        <header class="trip-day__head">
          <span class="trip-day__num" aria-hidden="true">${pad(d.n)}</span>
          <div>
            <h2 class="trip-day__title" id="trip-day-${d.n}"><span class="sr-only">${esc(t('trip.dayLabel', { n: d.n }))} — </span><span class="trip-day__label" aria-hidden="true">${esc(t('trip.day'))} ${pad(d.n)}</span>${esc(regionName(d.region))}</h2>
            <p class="trip-day__meta">${esc(t('trip.stops', { n: exps.length }))}</p>
          </div>
        </header>
        <ol class="trip-day__list">${rows}</ol>
      </li>`;
  }

  function renderTrip(p, animate) {
    const o = p.o;
    // Header photo: the experience of the trip that suits the season best
    const stops = [];
    p.days.forEach((d) => d.slots.forEach((s) => { if (s.type === 'exp') stops.push(s.e); }));
    const photo = stops.slice().sort((a, b) => b.seasons[o.season] - a.seasons[o.season])[0] || DATA.list[0];
    const interests = o.interests.length === INTERESTS.length || !o.interests.length
      ? t('trip.allInterests')
      : o.interests.map((i) => t(DATA.categories[i].key)).join(' · ');

    const route = p.route.map((r, i) => `
      <li><span class="trip-route__dot" aria-hidden="true"></span><span class="trip-route__name">${esc(regionName(r))}</span>${i > 0 ? `<span class="trip-route__km" title="${esc(t('trip.straight'))}">≈ ${Math.round(dist(p.route[i - 1], r))} km</span>` : ''}</li>`).join('');

    const notes = p.notes.map((n) => `<p class="trip-note">${esc(t(`trip.note.${n}`))}</p>`).join('');
    const left = p.left.length ? `
      <div class="trip-left">
        <p class="trip-aside__title">${esc(t('trip.left'))}</p>
        <ul>${p.left.map((l) => `<li><strong>${esc(l.e.name)}</strong> — ${esc(t(`trip.left.${l.why}`))}</li>`).join('')}</ul>
      </div>` : '';

    const mapHref = `map.html?experiences=${p.ids.join(',')}&amp;from=trip`;

    tripEl.innerHTML = `
      <header class="trip-head${animate ? ' is-new' : ''}">
        <figure class="trip-head__media" aria-hidden="true">
          <img src="${photo.photo}" alt="" decoding="async">
        </figure>
        <div class="trip-head__text">
          <p class="eyebrow eyebrow--accent"><span class="pulse-dot" aria-hidden="true"></span><span>${esc(t('trip.eyebrow'))}</span></p>
          <h1 class="display-xl trip-head__title" id="trip-title" tabindex="-1" data-focus>${t('trip.title', { n: o.days })}</h1>
        </div>
        <dl class="trip-summary">
          <div><dt>${esc(t('trip.duration'))}</dt><dd>${esc(t('plan.days', { n: o.days }))}</dd></div>
          <div><dt>${esc(t('trip.season'))}</dt><dd>${esc(t(`season.${o.season}`))}</dd></div>
          <div><dt>${esc(t('trip.company'))}</dt><dd>${esc(t(`plan.o.company.${o.company}`))}</dd></div>
          <div><dt>${esc(t('trip.interests'))}</dt><dd>${esc(interests)}</dd></div>
        </dl>
        <div class="trip-head__actions">
          ${p.ids.length ? `<a class="btn" href="${mapHref}"><span class="btn__label"><span>${esc(t('trip.map'))}</span></span><span class="map-pin-icon" aria-hidden="true"></span></a>` : ''}
          <button type="button" class="btn btn--ghost" data-edit><span class="btn__label"><span>${esc(t('trip.edit'))}</span></span><span class="arrow" aria-hidden="true"></span></button>
          <button type="button" class="link-arrow trip-restart" data-restart><span>${esc(t('trip.restart'))}</span><span class="arrow" aria-hidden="true"></span></button>
        </div>
        <p class="photo-caption trip-head__caption">${esc(t('common.photo'))} — ${esc(photo.name)}</p>
      </header>

      <div class="trip-body">
        <aside class="trip-aside">
          <p class="trip-aside__title">${esc(t('trip.regions'))}</p>
          <ol class="trip-route">${route}</ol>
          ${notes}
          ${left}
          <div class="trip-how">
            <p class="trip-aside__title">${esc(t('trip.how'))}</p>
            <ul>
              <li>${esc(t('trip.how1'))}</li>
              <li>${esc(t('trip.how2'))}</li>
              <li>${esc(t('trip.how3'))}</li>
              <li>${esc(t('trip.how4'))}</li>
            </ul>
          </div>
        </aside>
        <ol class="trip-days">${p.days.map(dayTemplate).join('')}</ol>
      </div>`;

    I18N.apply(tripEl);
    if (favApi()) favApi().sync(tripEl);
    tripEl.querySelectorAll('img').forEach((img) => {
      const done = () => img.classList.add('is-loaded');
      if (img.complete && img.naturalWidth) done();
      else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    });
    announce(`${t('trip.eyebrow')}: ${t('plan.days', { n: o.days })}`);
  }

  doc.addEventListener('DOMContentLoaded', init);
})();
