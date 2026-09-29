/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   quiz.js — Find Your Ontario (find-your-ontario.html)

   HOW THE RECOMMENDATION WORKS (no randomness)
   1. Every experience has a profile of traits (0–3) in
      js/experiences.js: nature, water, city, history, food,
      thrill, calm, family, winter…
   2. Every answer adds weights to some of those traits.
      After 7 answers we have the traveller's profile.
   3. Each experience gets a score = cosine similarity between
      the traveller's profile and its own profile (0–1), so an
      experience does not win just because it has many traits.
   4. Season: if the traveller picked a season the experience
      has no affinity with (a beach in winter), the score is
      multiplied by 0.8.
   5. The highest score is the recommendation. Ties are broken
      by the experience number (01–24), so the same answers
      always give the same result.
   6. Alternatives: the 2nd best, plus the best experience of a
      different world than the recommendation (if it is not
      already the 2nd), so the suggestions stay varied.
   7. "Why it fits": the three traits that contributed most to
      the score are turned into a sentence.
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const DATA = window.OTE_EXPERIENCES;
  if (!I18N || !DATA) return;

  const SEASON_TRAITS = ['summer', 'autumn', 'winter'];
  const SEASON_PENALTY = 0.8;

  /* ---------------------------------------------------------
     QUESTIONS — answer weights per trait
     --------------------------------------------------------- */
  const QUESTIONS = [
    { id: 'look', img: 'images/home/quiz-ragged-lake.webp', pos: 'center',
      options: [
        { id: 'nature',    w: { nature: 3, landscape: 2 } },
        { id: 'icons',     w: { iconic: 2, history: 2, city: 1 } },
        { id: 'art',       w: { art: 3, history: 1, indoor: 1 } },
        { id: 'flavours',  w: { food: 3 } },
        { id: 'thrill',    w: { thrill: 3, active: 1 } }
      ] },
    { id: 'setting', img: 'images/home/bridge-toronto-islands-ferry.webp', pos: 'center 70%',
      options: [
        { id: 'shore',   w: { water: 3, summer: 1 } },
        { id: 'forest',  w: { nature: 2, landscape: 2, escape: 1 } },
        { id: 'city',    w: { city: 3, social: 1 } },
        { id: 'country', w: { escape: 2, calm: 1, landscape: 1 } },
        { id: 'indoors', w: { indoor: 3 } }
      ] },
    { id: 'pace', img: 'images/nature/opener-algonquin-sunset.webp', pos: 'center 40%',
      options: [
        { id: 'slow',   w: { calm: 3 } },
        { id: 'easy',   w: { calm: 1, social: 1, city: 1 } },
        { id: 'active', w: { active: 3, nature: 1 } },
        { id: 'fast',   w: { thrill: 3, active: 1 } }
      ] },
    { id: 'interest', img: 'images/culture/opener-rom-dinosaurs.webp', pos: 'center',
      options: [
        { id: 'wildlife', w: { wildlife: 3, nature: 1 } },
        { id: 'history',  w: { history: 3, iconic: 1 } },
        { id: 'art',      w: { art: 3, street: 1 } },
        { id: 'sport',    w: { sport: 3, social: 1 } },
        { id: 'views',    w: { landscape: 2, iconic: 1, thrill: 1 } }
      ] },
    { id: 'food', img: 'images/home/flavours-kensington-market.webp', pos: 'center',
      options: [
        { id: 'market', w: { market: 3, food: 2, history: 1 } },
        { id: 'street', w: { street: 3, food: 2, social: 1 } },
        { id: 'wine',   w: { wine: 3, food: 1, landscape: 1 } },
        { id: 'sweet',  w: { sweet: 3, food: 1 } },
        { id: 'snack',  w: {} }
      ] },
    { id: 'company', img: 'images/nature/toronto-islands.webp', pos: 'center 60%',
      options: [
        { id: 'solo',    w: { calm: 1, art: 1, active: 1 } },
        { id: 'couple',  w: { calm: 1, wine: 1, landscape: 1 } },
        { id: 'family',  w: { family: 3 } },
        { id: 'friends', w: { social: 2, thrill: 1 } }
      ] },
    { id: 'season', img: 'images/home/hero-algonquin-autumn.webp', pos: 'center',
      options: [
        { id: 'summer', w: { summer: 3 } },
        { id: 'autumn', w: { autumn: 3 } },
        { id: 'winter', w: { winter: 3, indoor: 1 } },
        { id: 'any',    w: { city: 1, indoor: 1 } }
      ] }
  ];

  /* ---------------------------------------------------------
     SCORING (pure functions, exposed as window.OTE_QUIZ)
     --------------------------------------------------------- */
  function travellerProfile(answers) {
    const u = {};
    answers.forEach((optionId, qi) => {
      const option = optionId && QUESTIONS[qi].options.find((o) => o.id === optionId);
      if (!option) return;
      Object.entries(option.w).forEach(([t, v]) => { u[t] = (u[t] || 0) + v; });
    });
    return u;
  }

  const norm = (v) => Math.sqrt(Object.values(v).reduce((s, x) => s + x * x, 0));

  function rank(answers) {
    const u = travellerProfile(answers);
    const uNorm = norm(u) || 1;
    const season = SEASON_TRAITS.find((s) => answers[6] === s);

    return DATA.list.map((e) => {
      const p = e.traits;
      const contrib = {};
      let dot = 0;
      Object.keys(u).forEach((t) => {
        const c = u[t] * (p[t] || 0);
        if (c) { contrib[t] = c; dot += c; }
      });
      let score = dot / (uNorm * (norm(p) || 1));
      if (season && !p[season]) score *= SEASON_PENALTY;
      return { exp: e, score, contrib };
    }).sort((a, b) => (b.score - a.score) || (a.exp.num - b.exp.num));
  }

  // Display only: the cosine score (0–1) shown on a 40–97 % scale,
  // so a perfect profile never claims 100 % and weak ones stay visible.
  function matchPercent(score) {
    return Math.round(Math.max(40, Math.min(97, 40 + score * 60)));
  }

  function pickResults(ranking) {
    const main = ranking[0];
    const second = ranking[1];
    const different = ranking.slice(1).find((r) => r.exp.cat !== main.exp.cat);
    const third = (different && different !== second) ? different : ranking[2];
    return { main, alts: [second, third] };
  }

  function topTraits(contrib, n) {
    return Object.entries(contrib).sort((a, b) => b[1] - a[1]).slice(0, n).map(([t]) => t);
  }

  window.OTE_QUIZ = { QUESTIONS, travellerProfile, rank, pickResults, matchPercent, topTraits };

  /* ---------------------------------------------------------
     TEXTS (EN | ES)
     --------------------------------------------------------- */
  I18N.extend({
    en: {
      'title.quiz': 'Find Your Ontario — Ontario Tourism Experiences',
      'meta.quiz': 'Answer seven questions and discover which of our 24 Ontario experiences matches the way you like to travel.',
      'quiz.intro.eyebrow': 'Interactive experience',
      'quiz.intro.title': 'Find<br><em>your Ontario.</em>',
      'quiz.intro.lede': 'Seven questions about the way you like to travel. Your answers are compared with the 24 experiences of this guide to find the one that fits you best.',
      'quiz.intro.note': 'No sign-up and no personal data. It takes about a minute.',
      'quiz.intro.start': 'Start',
      'quiz.intro.photo': 'Ragged Lake, Algonquin Provincial Park',
      'quiz.progress': 'Question {n} of 7',
      'quiz.progressLabel': 'Quiz progress',
      'quiz.goTo': 'Go back to question {n}',
      'quiz.back': 'Back',
      'quiz.next': 'Continue',
      'quiz.seeResult': 'See my Ontario',
      'quiz.keys': 'Tip: press A–E on your keyboard to answer.',
      'quiz.selected': 'Selected',
      'quiz.calculating': 'Finding your Ontario…',

      'quiz.q.look.topic': 'The experience',
      'quiz.q.look.title': 'What are you looking for in Ontario?',
      'quiz.o.look.nature': 'Wild landscapes',
      'quiz.o.look.nature.hint': 'Forests, lakes, cliffs and waterfalls',
      'quiz.o.look.icons': 'Icons and their stories',
      'quiz.o.look.icons.hint': 'Famous landmarks and history',
      'quiz.o.look.art': 'Art and museums',
      'quiz.o.look.art.hint': 'Collections, galleries and design',
      'quiz.o.look.flavours': 'Local flavours',
      'quiz.o.look.flavours.hint': 'Markets, wine and food trails',
      'quiz.o.look.thrill': 'An adrenaline rush',
      'quiz.o.look.thrill.hint': 'Rides, heights and speed',

      'quiz.q.setting.topic': 'The setting',
      'quiz.q.setting.title': 'Where do you picture yourself?',
      'quiz.o.setting.shore': 'On a lakeshore',
      'quiz.o.setting.shore.hint': 'Sand, water and big skies',
      'quiz.o.setting.forest': 'Among forests and cliffs',
      'quiz.o.setting.forest.hint': 'Trails and wide views',
      'quiz.o.setting.city': 'In the city',
      'quiz.o.setting.city.hint': 'Streets, skyline and energy',
      'quiz.o.setting.country': 'In small towns and countryside',
      'quiz.o.setting.country.hint': 'Orchards, vineyards, main streets',
      'quiz.o.setting.indoors': 'Indoors, whatever the weather',
      'quiz.o.setting.indoors.hint': 'Rain or snow, the plan goes on',

      'quiz.q.pace.topic': 'The pace',
      'quiz.q.pace.title': 'What pace suits you best?',
      'quiz.o.pace.slow': 'Slow',
      'quiz.o.pace.slow.hint': 'Switch off and take it all in',
      'quiz.o.pace.easy': 'Easy-going',
      'quiz.o.pace.easy.hint': 'Stroll, stop, discover',
      'quiz.o.pace.active': 'Active',
      'quiz.o.pace.active.hint': 'Hike, paddle, climb',
      'quiz.o.pace.fast': 'Full speed',
      'quiz.o.pace.fast.hint': 'I want my heart racing',

      'quiz.q.interest.topic': 'Your interests',
      'quiz.q.interest.title': 'What sparks your curiosity?',
      'quiz.o.interest.wildlife': 'Animals and ecosystems',
      'quiz.o.interest.wildlife.hint': 'Wildlife from near and far',
      'quiz.o.interest.history': 'Architecture and history',
      'quiz.o.interest.history.hint': 'Castles, markets, old buildings',
      'quiz.o.interest.art': 'Art and street culture',
      'quiz.o.interest.art.hint': 'Galleries, murals, design',
      'quiz.o.interest.sport': 'Sport and games',
      'quiz.o.interest.sport.hint': 'Hockey, skiing, skating',
      'quiz.o.interest.views': 'Views from up high',
      'quiz.o.interest.views.hint': 'Lookouts, towers, escarpments',

      'quiz.q.food.topic': 'The table',
      'quiz.q.food.title': 'And when it is time to eat?',
      'quiz.o.food.market': 'Historic markets',
      'quiz.o.food.market.hint': 'Local classics and producers',
      'quiz.o.food.street': 'Street food from around the world',
      'quiz.o.food.street.hint': 'Many cultures, one street',
      'quiz.o.food.wine': 'Wine and vineyards',
      'quiz.o.food.wine.hint': 'Tastings among the vines',
      'quiz.o.food.sweet': 'Something sweet',
      'quiz.o.food.sweet.hint': 'Chocolate, candy and apple pie',
      'quiz.o.food.snack': 'A quick snack is enough',
      'quiz.o.food.snack.hint': 'Food is not the plan',

      'quiz.q.company.topic': 'Company',
      'quiz.q.company.title': 'Who is coming with you?',
      'quiz.o.company.solo': 'Just me',
      'quiz.o.company.solo.hint': 'My own route, my own time',
      'quiz.o.company.couple': 'My partner',
      'quiz.o.company.couple.hint': 'A getaway for two',
      'quiz.o.company.family': 'Family with kids',
      'quiz.o.company.family.hint': 'Something for every age',
      'quiz.o.company.friends': 'A group of friends',
      'quiz.o.company.friends.hint': 'Shared plans and laughs',

      'quiz.q.season.topic': 'The season',
      'quiz.q.season.title': 'When are you travelling?',
      'quiz.o.season.summer': 'Summer',
      'quiz.o.season.summer.hint': 'Long days and warm water',
      'quiz.o.season.autumn': 'Fall',
      'quiz.o.season.autumn.hint': 'Colours and harvest',
      'quiz.o.season.winter': 'Winter',
      'quiz.o.season.winter.hint': 'Snow, ice and cosy plans',
      'quiz.o.season.any': 'Spring, or not sure yet',
      'quiz.o.season.any.hint': 'Keep it flexible',

      'quiz.result.eyebrow': 'Your Ontario',
      'quiz.result.match': 'match',
      'quiz.result.matchLabel': '{n}% match with your answers',
      'quiz.result.why': 'Why it fits you: you are looking for {list}.',
      'quiz.result.and': 'and',
      'quiz.result.tip': 'Don’t miss',
      'quiz.result.explore': 'Explore this experience',
      'quiz.result.map': 'View on map',
      'quiz.result.retake': 'Retake the quiz',
      'quiz.result.alsoTitle': 'You may also like',
      'quiz.result.alsoText': 'Two more experiences close to your answers.',
      'quiz.result.more': 'Explore',
      'quiz.result.onMap': 'Map',

      'trait.nature': 'wild nature',
      'trait.water': 'water and shoreline',
      'trait.landscape': 'big landscapes',
      'trait.iconic': 'iconic places',
      'trait.family': 'a plan for the whole family',
      'trait.social': 'a lively atmosphere',
      'trait.thrill': 'adrenaline',
      'trait.calm': 'a slow, relaxed pace',
      'trait.active': 'an active day outdoors',
      'trait.city': 'city life',
      'trait.history': 'history and architecture',
      'trait.art': 'art and design',
      'trait.indoor': 'a plan for any weather',
      'trait.sport': 'sport',
      'trait.food': 'good food',
      'trait.market': 'historic markets',
      'trait.street': 'street food and street culture',
      'trait.wine': 'wine and vineyards',
      'trait.sweet': 'something sweet',
      'trait.wildlife': 'wildlife up close',
      'trait.summer': 'a summer plan',
      'trait.autumn': 'autumn colours',
      'trait.winter': 'a winter plan',
      'trait.escape': 'an escape from the city'
    },
    es: {
      'title.quiz': 'Descubre tu Ontario — Experiencias Turísticas de Ontario',
      'meta.quiz': 'Responde siete preguntas y descubre cuál de nuestras 24 experiencias de Ontario encaja con tu forma de viajar.',
      'quiz.intro.eyebrow': 'Experiencia interactiva',
      'quiz.intro.title': 'Descubre<br><em>tu Ontario.</em>',
      'quiz.intro.lede': 'Siete preguntas sobre tu forma de viajar. Tus respuestas se comparan con las 24 experiencias de esta guía para encontrar la que mejor encaja contigo.',
      'quiz.intro.note': 'Sin registro y sin datos personales. Te llevará un minuto.',
      'quiz.intro.start': 'Empezar',
      'quiz.intro.photo': 'Ragged Lake, Algonquin Provincial Park',
      'quiz.progress': 'Pregunta {n} de 7',
      'quiz.progressLabel': 'Progreso del cuestionario',
      'quiz.goTo': 'Volver a la pregunta {n}',
      'quiz.back': 'Atrás',
      'quiz.next': 'Continuar',
      'quiz.seeResult': 'Ver mi Ontario',
      'quiz.keys': 'Consejo: pulsa A–E en tu teclado para responder.',
      'quiz.selected': 'Seleccionada',
      'quiz.calculating': 'Buscando tu Ontario…',

      'quiz.q.look.topic': 'La experiencia',
      'quiz.q.look.title': '¿Qué buscas en Ontario?',
      'quiz.o.look.nature': 'Paisajes salvajes',
      'quiz.o.look.nature.hint': 'Bosques, lagos, acantilados y cataratas',
      'quiz.o.look.icons': 'Iconos y sus historias',
      'quiz.o.look.icons.hint': 'Lugares emblemáticos e historia',
      'quiz.o.look.art': 'Arte y museos',
      'quiz.o.look.art.hint': 'Colecciones, galerías y diseño',
      'quiz.o.look.flavours': 'Sabores locales',
      'quiz.o.look.flavours.hint': 'Mercados, vino y rutas gastronómicas',
      'quiz.o.look.thrill': 'Una dosis de adrenalina',
      'quiz.o.look.thrill.hint': 'Atracciones, alturas y velocidad',

      'quiz.q.setting.topic': 'El ambiente',
      'quiz.q.setting.title': '¿Dónde te imaginas?',
      'quiz.o.setting.shore': 'A orillas de un lago',
      'quiz.o.setting.shore.hint': 'Arena, agua y cielos abiertos',
      'quiz.o.setting.forest': 'Entre bosques y acantilados',
      'quiz.o.setting.forest.hint': 'Senderos y grandes vistas',
      'quiz.o.setting.city': 'En la ciudad',
      'quiz.o.setting.city.hint': 'Calles, skyline y energía',
      'quiz.o.setting.country': 'En pueblos y en el campo',
      'quiz.o.setting.country.hint': 'Huertos, viñedos, calles principales',
      'quiz.o.setting.indoors': 'Bajo techo, haga el tiempo que haga',
      'quiz.o.setting.indoors.hint': 'Llueva o nieve, el plan sigue',

      'quiz.q.pace.topic': 'El ritmo',
      'quiz.q.pace.title': '¿Qué ritmo va mejor contigo?',
      'quiz.o.pace.slow': 'Lento',
      'quiz.o.pace.slow.hint': 'Desconectar y disfrutarlo todo',
      'quiz.o.pace.easy': 'Tranquilo',
      'quiz.o.pace.easy.hint': 'Pasear, parar, descubrir',
      'quiz.o.pace.active': 'Activo',
      'quiz.o.pace.active.hint': 'Caminar, remar, escalar',
      'quiz.o.pace.fast': 'A toda velocidad',
      'quiz.o.pace.fast.hint': 'Quiero que se me acelere el pulso',

      'quiz.q.interest.topic': 'Tus intereses',
      'quiz.q.interest.title': '¿Qué despierta tu curiosidad?',
      'quiz.o.interest.wildlife': 'Animales y ecosistemas',
      'quiz.o.interest.wildlife.hint': 'Fauna de cerca y de lejos',
      'quiz.o.interest.history': 'Arquitectura e historia',
      'quiz.o.interest.history.hint': 'Castillos, mercados, edificios antiguos',
      'quiz.o.interest.art': 'Arte y cultura urbana',
      'quiz.o.interest.art.hint': 'Galerías, murales, diseño',
      'quiz.o.interest.sport': 'Deporte y juegos',
      'quiz.o.interest.sport.hint': 'Hockey, esquí, patinaje',
      'quiz.o.interest.views': 'Vistas desde las alturas',
      'quiz.o.interest.views.hint': 'Miradores, torres, escarpes',

      'quiz.q.food.topic': 'La mesa',
      'quiz.q.food.title': '¿Y a la hora de comer?',
      'quiz.o.food.market': 'Mercados históricos',
      'quiz.o.food.market.hint': 'Clásicos locales y productores',
      'quiz.o.food.street': 'Comida callejera del mundo',
      'quiz.o.food.street.hint': 'Muchas culturas, una sola calle',
      'quiz.o.food.wine': 'Vino y viñedos',
      'quiz.o.food.wine.hint': 'Catas entre las vides',
      'quiz.o.food.sweet': 'Algo dulce',
      'quiz.o.food.sweet.hint': 'Chocolate, caramelos y tarta de manzana',
      'quiz.o.food.snack': 'Con un tentempié me basta',
      'quiz.o.food.snack.hint': 'La comida no es el plan',

      'quiz.q.company.topic': 'La compañía',
      'quiz.q.company.title': '¿Quién viene contigo?',
      'quiz.o.company.solo': 'Viajo solo o sola',
      'quiz.o.company.solo.hint': 'Mi ruta, mi tiempo',
      'quiz.o.company.couple': 'Mi pareja',
      'quiz.o.company.couple.hint': 'Una escapada para dos',
      'quiz.o.company.family': 'Familia con niños',
      'quiz.o.company.family.hint': 'Algo para cada edad',
      'quiz.o.company.friends': 'Un grupo de amigos',
      'quiz.o.company.friends.hint': 'Planes compartidos y risas',

      'quiz.q.season.topic': 'La temporada',
      'quiz.q.season.title': '¿Cuándo viajas?',
      'quiz.o.season.summer': 'Verano',
      'quiz.o.season.summer.hint': 'Días largos y agua templada',
      'quiz.o.season.autumn': 'Otoño',
      'quiz.o.season.autumn.hint': 'Colores y cosecha',
      'quiz.o.season.winter': 'Invierno',
      'quiz.o.season.winter.hint': 'Nieve, hielo y planes acogedores',
      'quiz.o.season.any': 'Primavera, o aún no lo sé',
      'quiz.o.season.any.hint': 'Mejor algo flexible',

      'quiz.result.eyebrow': 'Tu Ontario',
      'quiz.result.match': 'de afinidad',
      'quiz.result.matchLabel': '{n}% de afinidad con tus respuestas',
      'quiz.result.why': 'Por qué encaja contigo: buscas {list}.',
      'quiz.result.and': 'y',
      'quiz.result.tip': 'No te lo pierdas',
      'quiz.result.explore': 'Conocer esta experiencia',
      'quiz.result.map': 'Ver en el mapa',
      'quiz.result.retake': 'Repetir el cuestionario',
      'quiz.result.alsoTitle': 'También te pueden gustar',
      'quiz.result.alsoText': 'Otras dos experiencias cercanas a tus respuestas.',
      'quiz.result.more': 'Explorar',
      'quiz.result.onMap': 'Mapa',

      'trait.nature': 'naturaleza salvaje',
      'trait.water': 'agua y orillas',
      'trait.landscape': 'grandes paisajes',
      'trait.iconic': 'lugares icónicos',
      'trait.family': 'un plan para toda la familia',
      'trait.social': 'un ambiente animado',
      'trait.thrill': 'adrenalina',
      'trait.calm': 'un ritmo lento y relajado',
      'trait.active': 'un día activo al aire libre',
      'trait.city': 'vida urbana',
      'trait.history': 'historia y arquitectura',
      'trait.art': 'arte y diseño',
      'trait.indoor': 'un plan para cualquier clima',
      'trait.sport': 'deporte',
      'trait.food': 'buena comida',
      'trait.market': 'mercados históricos',
      'trait.street': 'comida y cultura callejera',
      'trait.wine': 'vino y viñedos',
      'trait.sweet': 'algo dulce',
      'trait.wildlife': 'fauna de cerca',
      'trait.summer': 'un plan de verano',
      'trait.autumn': 'los colores del otoño',
      'trait.winter': 'un plan de invierno',
      'trait.escape': 'una escapada lejos de la ciudad'
    }
  });

  /* ---------------------------------------------------------
     INTERFACE
     --------------------------------------------------------- */
  const doc = document;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const KEYS = ['A', 'B', 'C', 'D', 'E'];
  const t = (k, v) => I18N.t(k, v);
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let root, stage, bgLayers, live;
  let step = -1;                       // -1 intro · 0–6 questions · 7 result
  let answers = new Array(QUESTIONS.length).fill(null);
  let busy = false;
  let lastResult = null;

  function init() {
    root = doc.querySelector('[data-quiz]');
    if (!root) return;
    stage = root.querySelector('.quiz__stage');
    bgLayers = Array.from(root.querySelectorAll('.quiz__bg img'));
    live = root.querySelector('.quiz__live');

    root.querySelector('[data-quiz-start]').addEventListener('click', () => go(0));
    root.addEventListener('click', onClick);
    doc.addEventListener('keydown', onKey);
    doc.addEventListener('languagechange', () => { if (step === QUESTIONS.length && lastResult) renderWhy(); });

    // Warm up the first question photo
    preload(QUESTIONS[0].img);
  }

  function preload(src) { if (src) { const i = new Image(); i.src = src; } }

  /* Background: cross-fade between two layers */
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

  /* Screen change with a short exit / enter animation */
  function go(target) {
    if (busy) return;
    busy = true;
    const leave = reduceMotion ? 0 : 380;
    root.classList.add('is-leaving');
    window.setTimeout(() => {
      step = target;
      root.dataset.step = target === QUESTIONS.length ? 'result' : target < 0 ? 'intro' : 'question';
      if (target < 0) showIntro();
      else if (target < QUESTIONS.length) renderQuestion();
      else renderResult();
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
    stage.querySelectorAll('.quiz-q, .quiz-result').forEach((el) => el.remove());
    root.querySelector('.quiz-intro').hidden = false;
    setBackground(QUESTIONS[0].img, QUESTIONS[0].pos);
  }

  /* ---------- Question ---------- */
  function renderQuestion() {
    const q = QUESTIONS[step];
    const n = step + 1;
    const last = step === QUESTIONS.length - 1;
    const chosen = answers[step];
    root.querySelector('.quiz-intro').hidden = true;
    setBackground(q.img, q.pos);
    preload(QUESTIONS[step + 1] && QUESTIONS[step + 1].img);

    const progress = QUESTIONS.map((_, i) => {
      const state = i < step ? 'is-done' : i === step ? 'is-current' : '';
      const canJump = i < step;
      return `<li class="${state}">${canJump
        ? `<button type="button" data-jump="${i}" data-i18n-attr="aria-label:quiz.goTo" data-i18n-vars='{"n":${i + 1}}'><span>${pad(i + 1)}</span></button>`
        : `<span aria-hidden="true"><span>${pad(i + 1)}</span></span>`}</li>`;
    }).join('');

    const options = q.options.map((o, i) => `
      <li style="--i:${i}">
        <button type="button" class="quiz-option" data-option="${o.id}" aria-pressed="${chosen === o.id}">
          <span class="quiz-option__key" aria-hidden="true">${KEYS[i]}</span>
          <span class="quiz-option__text">
            <span class="quiz-option__label" data-i18n="quiz.o.${q.id}.${o.id}"></span>
            <span class="quiz-option__hint" data-i18n="quiz.o.${q.id}.${o.id}.hint"></span>
          </span>
          <span class="quiz-option__check" aria-hidden="true"></span>
        </button>
      </li>`).join('');

    const html = `
      <section class="quiz-q" aria-labelledby="quiz-q-title">
        <div class="quiz-q__top">
          <ol class="quiz-progress" data-i18n-attr="aria-label:quiz.progressLabel">${progress}</ol>
          <p class="quiz-q__count"><span>${pad(n)}</span> / 07</p>
        </div>
        <span class="quiz-q__num" aria-hidden="true">${pad(n)}</span>
        <div class="quiz-q__head">
          <p class="eyebrow" data-i18n="quiz.q.${q.id}.topic"></p>
          <h1 class="quiz-q__title" id="quiz-q-title" tabindex="-1" data-focus>
            <span class="sr-only" data-i18n="quiz.progress" data-i18n-vars='{"n":${n}}'></span>
            <span data-i18n="quiz.q.${q.id}.title"></span>
          </h1>
          <p class="quiz-q__keys" data-i18n="quiz.keys"></p>
        </div>
        <ul class="quiz-q__options" role="list">${options}</ul>
        <div class="quiz-q__nav">
          <button type="button" class="quiz-back" data-back>
            <span class="arrow arrow--back" aria-hidden="true"></span><span data-i18n="quiz.back"></span>
          </button>
          <button type="button" class="btn quiz-next" data-next${chosen ? '' : ' disabled aria-disabled="true"'}>
            <span class="btn__label"><span data-i18n="${last ? 'quiz.seeResult' : 'quiz.next'}"></span></span>
            <span class="arrow" aria-hidden="true"></span>
          </button>
        </div>
      </section>`;

    stage.querySelectorAll('.quiz-q, .quiz-result').forEach((el) => el.remove());
    stage.insertAdjacentHTML('beforeend', html);
    I18N.apply(stage.querySelector('.quiz-q'));
    announce(t('quiz.progress', { n }));
  }

  // Selecting only marks and stores the answer (one per question) and
  // enables Continue. It never changes the question by itself.
  function choose(optionId) {
    if (busy || step < 0 || step >= QUESTIONS.length) return;
    answers[step] = optionId;
    stage.querySelectorAll('.quiz-option').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.option === optionId)));
    const next = stage.querySelector('[data-next]');
    if (next) { next.disabled = false; next.removeAttribute('aria-disabled'); }
  }

  // The only way forward: Continue (or Enter), and only with an answer.
  // The button is locked at once, so a double click moves one step.
  function advance() {
    if (busy || step < 0 || step >= QUESTIONS.length || !answers[step]) return;
    const next = stage.querySelector('[data-next]');
    if (next) { next.disabled = true; next.setAttribute('aria-disabled', 'true'); }
    go(step + 1);
  }

  /* ---------- Result ---------- */
  function renderResult() {
    const ranking = rank(answers);
    lastResult = pickResults(ranking);
    const { main, alts } = lastResult;
    const e = main.exp;
    const pct = matchPercent(main.score);
    const cat = DATA.categories[e.cat];
    const region = DATA.regions[e.region];
    const fav = window.OTE_FAV;         // ♡ Save (js/favourites.js)
    root.querySelector('.quiz-intro').hidden = true;
    setBackground(e.photo, 'center');

    const altCard = (r) => {
      const a = r.exp;
      return `
        <article class="quiz-alt">
          <figure class="quiz-alt__media"><img src="${a.thumb}" width="640" height="427" alt="" decoding="async"></figure>
          <div class="quiz-alt__body">
            <p class="quiz-alt__meta"><span class="cat-dot cat-dot--${a.cat}" aria-hidden="true"></span><span data-i18n="${DATA.categories[a.cat].key}"></span></p>
            <p class="quiz-alt__region" data-i18n="${DATA.regions[a.region].key}"></p>
            <h3 class="quiz-alt__name">${esc(a.name)}</h3>
            <p class="quiz-alt__pct"><strong>${matchPercent(r.score)}%</strong> <span data-i18n="quiz.result.match"></span></p>
            <div class="quiz-alt__links">
              <a class="link-arrow" href="${a.href}"><span data-i18n="quiz.result.more"></span><span class="arrow" aria-hidden="true"></span></a>
              <a class="link-arrow" href="map.html?experience=${a.id}"><span data-i18n="quiz.result.onMap"></span><span class="arrow" aria-hidden="true"></span></a>
              ${fav ? fav.button(a, { variant: 'icon', extraClass: 'fav-btn--dark' }) : ''}
            </div>
          </div>
        </article>`;
    };

    const html = `
      <section class="quiz-result" aria-labelledby="quiz-result-title">
        <figure class="quiz-result__media">
          <img src="${e.photo}" alt="" decoding="async">
          <figcaption class="photo-caption">${esc(e.name)} · ${esc(e.place)}</figcaption>
          <span class="quiz-result__num" aria-hidden="true">${e.numLabel}</span>
        </figure>
        <div class="quiz-result__body">
          <p class="eyebrow" data-i18n="quiz.result.eyebrow"></p>
          <p class="quiz-result__meta"><span class="cat-dot cat-dot--${e.cat}" aria-hidden="true"></span><span data-i18n="${cat.key}"></span><span class="quiz-result__sep" aria-hidden="true">·</span><span data-i18n="${e.sub}"></span><span class="quiz-result__sep" aria-hidden="true">·</span><span data-i18n="${region.key}"></span></p>
          <h1 class="quiz-result__name" id="quiz-result-title" tabindex="-1" data-focus>${esc(e.name)}</h1>
          <div class="quiz-meter" role="img" data-i18n-attr="aria-label:quiz.result.matchLabel" data-i18n-vars='{"n":${pct}}'>
            <p class="quiz-meter__value" aria-hidden="true"><strong>${pct}%</strong> <span data-i18n="quiz.result.match"></span></p>
            <span class="quiz-meter__bar" aria-hidden="true"><span style="--p:${pct / 100}"></span></span>
          </div>
          <p class="quiz-result__why" data-why></p>
          <p class="quiz-result__text" data-i18n="exp.${e.id}.text"></p>
          <p class="quiz-result__tip"><strong data-i18n="quiz.result.tip"></strong><span data-i18n="exp.${e.id}.why"></span></p>
          <div class="quiz-result__actions">
            <a class="btn" href="${e.href}"><span class="btn__label"><span data-i18n="quiz.result.explore"></span></span><span class="arrow" aria-hidden="true"></span></a>
            <a class="btn btn--ghost" href="map.html?experience=${e.id}&amp;from=quiz"><span class="btn__label"><span data-i18n="quiz.result.map"></span></span><span class="map-pin-icon" aria-hidden="true"></span></a>
            ${fav ? fav.button(e, { extraClass: 'fav-btn--dark' }) : ''}
          </div>
          <button type="button" class="link-arrow quiz-retake" data-retake><span data-i18n="quiz.result.retake"></span><span class="arrow" aria-hidden="true"></span></button>
        </div>
        <aside class="quiz-alts" aria-labelledby="quiz-alts-title">
          <div class="quiz-alts__head">
            <h2 class="quiz-alts__title" id="quiz-alts-title" data-i18n="quiz.result.alsoTitle"></h2>
            <p data-i18n="quiz.result.alsoText"></p>
          </div>
          ${alts.map(altCard).join('')}
        </aside>
      </section>`;

    stage.querySelectorAll('.quiz-q, .quiz-result').forEach((el) => el.remove());
    stage.insertAdjacentHTML('beforeend', html);
    I18N.apply(stage.querySelector('.quiz-result'));
    renderWhy();
    announce(`${t('quiz.result.eyebrow')}: ${e.name}`);
  }

  function renderWhy() {
    const el = stage.querySelector('[data-why]');
    if (!el || !lastResult) return;
    const traits = topTraits(lastResult.main.contrib, 3).map((tr) => t(`trait.${tr}`));
    const list = traits.length > 1
      ? `${traits.slice(0, -1).join(', ')} ${t('quiz.result.and')} ${traits[traits.length - 1]}`
      : traits.join('');
    el.textContent = t('quiz.result.why', { list });
  }

  function restart() {
    answers = new Array(QUESTIONS.length).fill(null);
    lastResult = null;
    go(0);
  }

  function announce(text) {
    if (!live) return;
    live.textContent = '';
    window.setTimeout(() => { live.textContent = text; }, 60);
  }

  /* ---------- Events ---------- */
  function onClick(event) {
    const option = event.target.closest('[data-option]');
    if (option) { choose(option.dataset.option); return; }
    if (event.target.closest('[data-back]')) { go(step - 1); return; }
    if (event.target.closest('[data-next]')) { advance(); return; }
    const jump = event.target.closest('[data-jump]');
    if (jump) { go(Number(jump.dataset.jump)); return; }
    if (event.target.closest('[data-retake]')) restart();
  }

  // A–E / 1–5 only select. Enter = Continue (when there is an answer):
  // on an option not yet chosen, Enter selects it (native button click);
  // on the chosen option, on the question or on the page, it continues.
  function onKey(event) {
    if (step < 0 || step >= QUESTIONS.length || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest && event.target.closest('input, textarea, select, [contenteditable]')) return;

    if (event.key === 'Enter') {
      const el = event.target.closest ? event.target : null;
      if (el && el.closest('[data-next], [data-back], [data-jump], a, .lang-switch, .site-header, .site-footer')) return;
      const option = el && el.closest('[data-option]');
      if (option && option.dataset.option !== answers[step]) return;
      if (!answers[step]) return;
      event.preventDefault();
      advance();
      return;
    }

    const k = event.key.toUpperCase();
    let index = KEYS.indexOf(k);
    if (index < 0 && /^[1-5]$/.test(k)) index = Number(k) - 1;
    const q = QUESTIONS[step];
    if (index >= 0 && index < q.options.length) {
      event.preventDefault();
      const btn = stage.querySelector(`[data-option="${q.options[index].id}"]`);
      if (btn) btn.focus({ preventScroll: true });
      choose(q.options[index].id);
    }
  }

  doc.addEventListener('DOMContentLoaded', init);
})();
