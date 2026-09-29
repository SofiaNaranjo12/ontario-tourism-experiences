/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   language.js — Centralised bilingual system (EN | ES)

   HOW IT WORKS
   - Every translatable element carries a key:
       data-i18n="key"              -> replaces textContent
       data-i18n-html="key"         -> replaces innerHTML (only for
                                       trusted strings with <br>/<em>)
       data-i18n-attr="attr:key|…"  -> replaces attributes
                                       (aria-label, alt, content…)
       data-i18n-vars='{"n":3}'     -> values for {placeholders}.
                                       If n === 1, "key.one" is used
                                       when it exists (singular).
   - <body data-page-title="key"> sets the browser <title>.
   - The choice is stored in localStorage and reused on every page.
   - Other scripts (map, quiz) can listen to the "languagechange"
     event and use window.OTE_I18N.t(key).
   - New pages can add their own strings with
     window.OTE_I18N.extend({ en: {...}, es: {...} }).
     The four world pages do it in js/worlds-i18n.js.

   To correct a translation: edit the strings below.
   Official proper names (CN Tower, Casa Loma…) stay untranslated.
   ========================================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'ote-lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'es'];

  const TRANSLATIONS = {
    /* ------------------------------------------------------ */
    en: {
      /* Site */
      'site.name': 'Ontario Tourism Experiences',
      'site.concept': 'One province, many worlds',

      /* Navigation */
      'nav.label': 'Main navigation',
      'nav.skip': 'Skip to content',
      'nav.homeLabel': 'Ontario Tourism Experiences — Home',
      'nav.home': 'Home',
      'nav.nature': 'Nature',
      'nav.culture': 'Culture',
      'nav.flavours': 'Flavours',
      'nav.adventure': 'Adventure',
      'nav.map': 'Explore Map',
      'nav.mapShort': 'Map',
      'nav.quiz': 'Find Your Ontario',
      'nav.credits': 'Credits & References',
      'nav.creditsShort': 'Credits',
      'nav.exploreMenu': 'Explore',
      'nav.groupWorlds': 'The four worlds',
      'nav.groupMap': 'On the map',
      'nav.natureHint': 'Water, beaches, parks and landscapes',
      'nav.cultureHint': 'Landmarks, museums and art',
      'nav.flavoursHint': 'Markets and local flavours',
      'nav.adventureHint': 'Family attractions and seasonal adventure',
      'nav.mapHint': 'All the experiences on one map',
      'nav.planMenu': 'Plan',
      'nav.groupDiscover': 'Discover',
      'nav.groupPlan': 'Plan',
      'nav.seasons': 'Ontario by Season',
      'nav.seasonsHint': 'When to go',
      'nav.plan': 'Plan Your Trip',
      'nav.planHint': 'Build a day-by-day itinerary',
      'nav.favourites': 'My Favourites',
      'nav.favouritesHint': 'The places you saved',
      'nav.guide': 'Travel Guide',
      'nav.guideHint': 'What to know before you go',

      /* Language selector */
      'lang.label': 'Select language',
      'lang.es': 'Spanish',
      'lang.en': 'English',

      /* Categories & subsections (shared by every page) */
      'cat.nature': 'Nature',
      'cat.culture': 'Culture',
      'cat.flavours': 'Flavours',
      'cat.adventure': 'Adventure',
      'section.nature': 'Nature & Outdoor Experiences',
      'section.culture': 'Culture & Iconic Places',
      'section.food': 'Food & Local Experiences',
      'section.adventure': 'Entertainment & Adventure',
      'sub.water': 'Water & Beaches',
      'sub.parks': 'Parks & Landscapes',
      'sub.landmarks': 'Landmarks',
      'sub.museums': 'Museums & Art',
      'sub.markets': 'Markets',
      'sub.flavours': 'Local Flavours',
      'sub.family': 'Family Attractions',
      'sub.seasonal': 'Seasonal & Outdoor Adventure',

      /* Regions */
      'region.toronto': 'Toronto & Greater Toronto Area',
      'region.torontoShort': 'Toronto & GTA',
      'region.niagara': 'Niagara Region',
      'region.bruce': 'Bruce Peninsula & Lake Huron',
      'region.blue': 'Blue Mountains & Simcoe County',
      'region.algonquin': 'Algonquin area',
      'region.stratford': 'Stratford',

      /* Common */
      'common.expCount': '{n} experiences',
      'common.expCount.one': '{n} experience',
      'common.photo': 'Photo',
      'common.explore': 'Explore',

      /* Pages still in production */
      'soon.label': 'Coming soon',
      'soon.tooltip': 'Coming soon',
      'soon.page': '{page} is being prepared and will be available soon.',
      'soon.map': 'Interactive map coming soon.',
      'soon.quiz': 'Find Your Ontario is coming soon. The questionnaire is being prepared.',
      'soon.close': 'Close notification',

      /* Footer */
      'footer.motto': 'Explore Ontario.<br>One province.<br>Many worlds.',
      'footer.navigation': 'Navigation',
      'footer.explore': 'Explore',
      'footer.plan': 'Plan',
      'footer.info': 'Info',
      'footer.discover': 'Discover',
      'footer.language': 'Language',
      'footer.top': 'Back to top',
      'footer.photos': 'Photography on this page',
      'footer.photosNote': 'Images from Wikimedia Commons, resized for the web. Full attribution in',
      'footer.disclaimer': 'Independent multimedia project. Not affiliated with Destination Ontario or the Government of Ontario.',
      'footer.copyright': '© {year} Ontario Tourism Experiences',
      'footer.noscript': 'This experience needs JavaScript enabled to display navigation and languages.',

      /* ---------- HOME ---------- */
      'title.home': 'Ontario Tourism Experiences — One Province, Many Worlds',
      'meta.home': 'Explore 24 curated tourism experiences across Ontario, Canada: nature, culture, flavours and adventure. Interactive map and personalised recommendations.',

      'home.hero.eyebrow': 'Ontario, Canada · 24 curated experiences',
      'home.hero.line1': 'Not just a destination.',
      'home.hero.line2': 'A world to explore.',
      'home.hero.pillars': 'Nature · Culture · Flavours · Adventure',
      'home.hero.cta': 'Discover',
      'home.hero.scroll': 'Scroll',
      'home.hero.alt': 'Autumn forest in red and orange tones on the shore of Lake of Two Rivers, Algonquin Provincial Park',

      'home.intro.eyebrow': 'The concept',
      'home.intro.title': 'One province,<br><em>many worlds.</em>',
      'home.intro.text': 'Ontario is not a single postcard. It is roaring waterfalls and quiet lakes, a skyline that glows at dusk, historic markets, wine country and forests that change colour every autumn. This guide brings together 24 experiences to help you discover it, one world at a time.',
      'home.intro.text2': 'It does not try to cover the whole province. It is a curated selection, chosen for its tourist relevance, its diversity and the regions it represents.',
      'home.intro.regionsTitle': 'Six regions, one journey',
      'home.intro.alt': 'Snow-covered limestone cliffs and open water near the Grotto, Bruce Peninsula National Park',

      'home.worlds.eyebrow': 'Four worlds to discover',
      'home.worlds.title': 'Choose the Ontario<br><em>you want to experience.</em>',
      'home.worlds.lede': 'Four themes, eight routes and twenty-four real experiences. Each world reveals a different side of the province.',

      'home.worlds.nature.text': 'Thundering waterfalls, Great Lakes beaches, vast forests and limestone cliffs. The wild side of Ontario, from Niagara to Algonquin.',
      'home.worlds.nature.cta': 'Explore Nature',
      'home.worlds.nature.alt': 'Aerial view of the Horseshoe Falls with a tour boat approaching the mist',
      'home.worlds.nature.caption': 'Horseshoe Falls, Niagara Falls',

      'home.worlds.culture.text': 'Skyline icons, a castle in the heart of Toronto, renowned museums and the home of hockey. The stories that shape the province.',
      'home.worlds.culture.cta': 'Explore Culture',
      'home.worlds.culture.alt': 'Toronto skyline at dusk with the illuminated CN Tower reflected on the lake',
      'home.worlds.culture.caption': 'Toronto skyline from the Toronto Islands',

      'home.worlds.flavours.text': 'Historic food markets, lively neighbourhoods, Niagara wine country and sweet trails through Stratford and the Blue Mountains countryside.',
      'home.worlds.flavours.cta': 'Explore Flavours',
      'home.worlds.flavours.alt': 'Market stall with carrots, garlic, potatoes and asparagus at St. Lawrence Market',
      'home.worlds.flavours.caption': 'St. Lawrence Market, Toronto',

      'home.worlds.adventure.text': 'Roller coasters, sharks swimming overhead, wildlife from around the world, ski slopes and treetop courses. Ontario at full speed.',
      'home.worlds.adventure.cta': 'Explore Adventure',
      'home.worlds.adventure.alt': 'Illuminated ski slopes and village lights reflected on a pond at Blue Mountain at night',
      'home.worlds.adventure.caption': 'Blue Mountain Village at night',

      /* Four Worlds — secondary photos (alt text) */
      'home.worlds.nature.shot1': 'Waves rolling onto the long sandy shore of Sauble Beach, Lake Huron',
      'home.worlds.nature.shot2': 'Mossy limestone crevice among the trees at Scenic Caves Nature Adventures',
      'home.worlds.nature.shot3': 'Forest reflected on the calm water of Canoe Lake, Algonquin Provincial Park',
      'home.worlds.culture.shot1': 'The illuminated TORONTO sign reflected on the pool of Nathan Phillips Square at night',
      'home.worlds.culture.shot2': 'Stone towers and main entrance of Casa Loma, Toronto',
      'home.worlds.culture.shot3': 'The historic facade and the glass Michael Lee-Chin Crystal of the Royal Ontario Museum',
      'home.worlds.flavours.shot1': 'Brick buildings and the Gooderham & Worts clock in the Distillery Historic District',
      'home.worlds.flavours.shot2': 'Colourful fruit and vegetable stalls on a street corner in Kensington Market',
      'home.worlds.flavours.shot3': 'Bunches of dark grapes on the vine in Niagara-on-the-Lake wine country',
      'home.worlds.adventure.shot1': 'A shark swimming over the Dangerous Lagoon at Ripley’s Aquarium of Canada',
      'home.worlds.adventure.shot2': 'A common morpho butterfly with folded wings resting on a leaf at the Niagara Parks Butterfly Conservatory',
      'home.worlds.adventure.shot3': 'The Leviathan roller coaster plunging down a drop at Canada’s Wonderland',
      'home.worlds.culture.shot4': 'The CN Tower rising above the Toronto harbour on a clear day',
      'home.worlds.flavours.shot4': 'Historic yellow-brick building of Chocolate Barr’s Candies on a street corner in Stratford',
      'home.worlds.flavours.shot5': 'Orchard workers with a tractor and a crate full of apples during the 1983 harvest in Clarksburg',

      /* Concept diptych */
      'home.intro.altNature': 'Turquoise water and a rocky limestone shore at Indian Head Cove, Bruce Peninsula National Park',
      'home.intro.altCity': 'Toronto skyline at night with the illuminated CN Tower, seen across the harbour',

      /* Photo bridge between Flavours and Adventure */
      'home.bridge3.eyebrow': 'After the feast',
      'home.bridge3.title': 'Now, hold on<br><em>tight.</em>',
      'home.bridge3.alt': 'The Leviathan roller coaster train climbing its first hill against the sky at Canada’s Wonderland',
      'home.worlds.nature.shot3b': 'Small lake with autumn colours along the Centennial Ridges Trail, Algonquin Provincial Park',
      'home.worlds.adventure.shot4': 'A young orangutan holding a twig at the Toronto Zoo',
      'home.worlds.flavours.shot6': 'A peameal bacon sandwich from Carousel Bakery, St. Lawrence Market',

      /* Photo bridge between Culture and Flavours */
      'home.bridge2.eyebrow': 'A province you can taste',
      'home.bridge2.title': 'From historic markets<br><em>to wine country.</em>',
      'home.bridge2.alt': 'Bunches of dark grapes hanging from the vines in Niagara-on-the-Lake in September',

      /* Photo bridge between Nature and Culture */
      'home.bridge.eyebrow': 'From the islands to the city',
      'home.bridge.title': 'A short ferry ride,<br><em>two different worlds.</em>',
      'home.bridge.caption': 'Toronto skyline from the Ward’s Island ferry',
      'home.bridge.alt': 'Silhouette of the Toronto skyline and the CN Tower at sunset, seen from the ferry across Lake Ontario',

      'home.marquee.label': 'The 24 experiences of this guide',

      'home.fyo.eyebrow': 'Interactive experience',
      'home.fyo.title': 'Not sure<br><em>where to go?</em>',
      'home.fyo.text': 'Find the Ontario experience that matches you.',
      'home.fyo.text2': 'Answer seven quick questions about the way you like to travel. Your answers are compared with our 24 experiences to suggest your ideal match — no sign-up and no personal data.',
      'home.fyo.m1': 'Questions',
      'home.fyo.m2': 'Experiences',
      'home.fyo.m3': 'Personal match',
      'home.fyo.cta': 'Find Your Ontario',
      'home.fyo.preview': 'Preview',
      'home.fyo.previewLabel': 'Preview of the Find Your Ontario questionnaire',
      'home.fyo.question': 'What would your perfect day look like?',
      'home.fyo.opt1': 'Surrounded by nature',
      'home.fyo.opt2': 'Exploring a city',
      'home.fyo.opt3': 'Discovering culture',
      'home.fyo.opt4': 'Trying local flavours',
      'home.fyo.opt5': 'Looking for adventure',
      'home.fyo.hint': 'Great choice. Continue in the full experience',
      'home.fyo.nextQuestion': 'Who are you travelling with?',
      'home.fyo.q4': 'What pace do you prefer?',
      'home.fyo.q5': 'Which landscape calls you?',
      'home.fyo.q6': 'How much adventure are you looking for?',
      'home.fyo.q7': 'What would you love to taste?',
      'home.fyo.alt': 'Forest reflected on the still water of Ragged Lake, Algonquin Provincial Park',

      'home.map.eyebrow': 'Explore Ontario',
      'home.map.title': 'Where will<br><em>you go next?</em>',
      'home.map.text': 'Follow the experiences across the province on an interactive map. Every location is one click away from its story.',
      'home.map.s1': 'Experiences',
      'home.map.s2': 'Regions',
      'home.map.s3': 'Province',
      'home.map.caption': 'Selected Ontario destinations',
      'home.map.cta': 'Explore Map',
      'home.map.schematic': 'Schematic view · not to scale',
      'home.map.panelLabel': 'Schematic map of the six regions included in the guide',
      'home.plan.eyebrow': 'Ready to go?',
      'home.plan.title': 'Turn ideas<br><em>into a trip.</em>',
      'home.plan.text': 'Build a day-by-day itinerary with the experiences you like, see when to go and read the practical guide before you travel.',
      'lake.huron': 'Lake Huron',
      'lake.georgian': 'Georgian Bay',
      'lake.ontario': 'Lake Ontario',
      'lake.erie': 'Lake Erie'
    },

    /* ------------------------------------------------------ */
    es: {
      /* Sitio */
      'site.name': 'Experiencias Turísticas de Ontario',
      'site.concept': 'Una provincia, muchos mundos',

      /* Navegación */
      'nav.label': 'Navegación principal',
      'nav.skip': 'Saltar al contenido',
      'nav.homeLabel': 'Experiencias Turísticas de Ontario — Inicio',
      'nav.home': 'Inicio',
      'nav.nature': 'Naturaleza',
      'nav.culture': 'Cultura',
      'nav.flavours': 'Sabores',
      'nav.adventure': 'Aventura',
      'nav.map': 'Explorar mapa',
      'nav.mapShort': 'Mapa',
      'nav.quiz': 'Descubre tu Ontario',
      'nav.credits': 'Créditos y referencias',
      'nav.creditsShort': 'Créditos',
      'nav.exploreMenu': 'Explorar',
      'nav.groupWorlds': 'Los cuatro mundos',
      'nav.groupMap': 'En el mapa',
      'nav.natureHint': 'Agua, playas, parques y paisajes',
      'nav.cultureHint': 'Lugares emblemáticos, museos y arte',
      'nav.flavoursHint': 'Mercados y sabores locales',
      'nav.adventureHint': 'Atracciones familiares y aventura de temporada',
      'nav.mapHint': 'Todas las experiencias en un solo mapa',
      'nav.planMenu': 'Planifica',
      'nav.groupDiscover': 'Descubre',
      'nav.groupPlan': 'Planifica',
      'nav.seasons': 'Ontario por temporada',
      'nav.seasonsHint': 'Cuándo ir',
      'nav.plan': 'Planifica tu viaje',
      'nav.planHint': 'Crea un itinerario día a día',
      'nav.favourites': 'Mis favoritos',
      'nav.favouritesHint': 'Los lugares que guardaste',
      'nav.guide': 'Guía para tu viaje',
      'nav.guideHint': 'Lo que conviene saber antes de viajar',

      /* Selector de idioma */
      'lang.label': 'Seleccionar idioma',
      'lang.es': 'Español',
      'lang.en': 'Inglés',

      /* Categorías y subsecciones */
      'cat.nature': 'Naturaleza',
      'cat.culture': 'Cultura',
      'cat.flavours': 'Sabores',
      'cat.adventure': 'Aventura',
      'section.nature': 'Naturaleza y experiencias al aire libre',
      'section.culture': 'Cultura y lugares icónicos',
      'section.food': 'Gastronomía y experiencias locales',
      'section.adventure': 'Entretenimiento y aventura',
      'sub.water': 'Agua y playas',
      'sub.parks': 'Parques y paisajes',
      'sub.landmarks': 'Lugares emblemáticos',
      'sub.museums': 'Museos y arte',
      'sub.markets': 'Mercados',
      'sub.flavours': 'Sabores locales',
      'sub.family': 'Atracciones familiares',
      'sub.seasonal': 'Aventura al aire libre y de temporada',

      /* Regiones */
      'region.toronto': 'Toronto y el área del Gran Toronto',
      'region.torontoShort': 'Toronto y GTA',
      'region.niagara': 'Región de Niagara',
      'region.bruce': 'Bruce Peninsula y lago Hurón',
      'region.blue': 'Blue Mountains y Simcoe County',
      'region.algonquin': 'Zona de Algonquin',
      'region.stratford': 'Stratford',

      /* Común */
      'common.expCount': '{n} experiencias',
      'common.expCount.one': '{n} experiencia',
      'common.photo': 'Foto',
      'common.explore': 'Explorar',

      /* Páginas en preparación */
      'soon.label': 'Próximamente',
      'soon.tooltip': 'Próximamente',
      'soon.page': '{page}: estamos preparando esta página y estará disponible próximamente.',
      'soon.map': 'Mapa interactivo próximamente.',
      'soon.quiz': 'Descubre tu Ontario llegará próximamente. Estamos preparando el cuestionario.',
      'soon.close': 'Cerrar aviso',

      /* Footer */
      'footer.motto': 'Explora Ontario.<br>Una provincia.<br>Muchos mundos.',
      'footer.navigation': 'Navegación',
      'footer.explore': 'Explora',
      'footer.plan': 'Planifica',
      'footer.info': 'Información',
      'footer.discover': 'Descubre',
      'footer.language': 'Idioma',
      'footer.top': 'Volver arriba',
      'footer.photos': 'Fotografías de esta página',
      'footer.photosNote': 'Imágenes de Wikimedia Commons, redimensionadas para la web. Atribución completa en',
      'footer.disclaimer': 'Proyecto multimedia independiente. Sin afiliación con Destination Ontario ni con el Gobierno de Ontario.',
      'footer.copyright': '© {year} Experiencias Turísticas de Ontario',
      'footer.noscript': 'Esta experiencia necesita JavaScript activado para mostrar la navegación y los idiomas.',

      /* ---------- INICIO ---------- */
      'title.home': 'Experiencias Turísticas de Ontario — Una provincia, muchos mundos',
      'meta.home': 'Explora 24 experiencias turísticas seleccionadas de Ontario, Canadá: naturaleza, cultura, sabores y aventura. Mapa interactivo y recomendaciones personalizadas.',

      'home.hero.eyebrow': 'Ontario, Canadá · 24 experiencias seleccionadas',
      'home.hero.line1': 'No es solo un destino.',
      'home.hero.line2': 'Es un mundo por explorar.',
      'home.hero.pillars': 'Naturaleza · Cultura · Sabores · Aventura',
      'home.hero.cta': 'Descubrir',
      'home.hero.scroll': 'Desliza',
      'home.hero.alt': 'Bosque otoñal en tonos rojos y naranjas a orillas del Lake of Two Rivers, Algonquin Provincial Park',

      'home.intro.eyebrow': 'El concepto',
      'home.intro.title': 'Una provincia,<br><em>muchos mundos.</em>',
      'home.intro.text': 'Ontario no es una sola postal. Son cataratas imponentes y lagos en calma, un skyline que brilla al atardecer, mercados históricos, viñedos y bosques que cambian de color cada otoño. Esta guía reúne 24 experiencias para ayudarte a descubrirla, un mundo a la vez.',
      'home.intro.text2': 'No pretende cubrir toda la provincia. Es una selección cuidada, elegida por su relevancia turística, su diversidad y las regiones que representa.',
      'home.intro.regionsTitle': 'Seis regiones, un solo viaje',
      'home.intro.alt': 'Acantilados de piedra caliza cubiertos de nieve junto al agua, cerca de The Grotto, Bruce Peninsula National Park',

      'home.worlds.eyebrow': 'Cuatro mundos por descubrir',
      'home.worlds.title': 'Elige el Ontario<br><em>que quieres vivir.</em>',
      'home.worlds.lede': 'Cuatro temáticas, ocho rutas y veinticuatro experiencias reales. Cada mundo revela una faceta distinta de la provincia.',

      'home.worlds.nature.text': 'Cataratas imponentes, playas de los Grandes Lagos, bosques inmensos y acantilados de piedra caliza. El lado más salvaje de Ontario, de Niagara a Algonquin.',
      'home.worlds.nature.cta': 'Explorar Naturaleza',
      'home.worlds.nature.alt': 'Vista aérea de las Horseshoe Falls con un barco turístico acercándose a la bruma',
      'home.worlds.nature.caption': 'Horseshoe Falls, Niagara Falls',

      'home.worlds.culture.text': 'Iconos del skyline, un castillo en pleno Toronto, museos reconocidos y la casa del hockey. Las historias que dan forma a la provincia.',
      'home.worlds.culture.cta': 'Explorar Cultura',
      'home.worlds.culture.alt': 'Skyline de Toronto al atardecer con la CN Tower iluminada reflejada en el lago',
      'home.worlds.culture.caption': 'El skyline de Toronto desde las Toronto Islands',

      'home.worlds.flavours.text': 'Mercados gastronómicos históricos, barrios llenos de vida, la región vinícola de Niagara y rutas dulces por Stratford y la campiña de Blue Mountains.',
      'home.worlds.flavours.cta': 'Explorar Sabores',
      'home.worlds.flavours.alt': 'Puesto de mercado con zanahorias, ajos, papas y espárragos en St. Lawrence Market',
      'home.worlds.flavours.caption': 'St. Lawrence Market, Toronto',

      'home.worlds.adventure.text': 'Montañas rusas, tiburones nadando sobre tu cabeza, fauna de todo el mundo, pistas de esquí y circuitos entre los árboles. Ontario a toda velocidad.',
      'home.worlds.adventure.cta': 'Explorar Aventura',
      'home.worlds.adventure.alt': 'Pistas de esquí iluminadas y luces del pueblo reflejadas en un estanque en Blue Mountain de noche',
      'home.worlds.adventure.caption': 'Blue Mountain Village de noche',

      /* Cuatro mundos — fotografías secundarias (texto alternativo) */
      'home.worlds.nature.shot1': 'Olas llegando a la larga orilla de arena de Sauble Beach, en el lago Hurón',
      'home.worlds.nature.shot2': 'Grieta de piedra caliza cubierta de musgo entre los árboles en Scenic Caves Nature Adventures',
      'home.worlds.nature.shot3': 'Bosque reflejado en el agua en calma de Canoe Lake, Algonquin Provincial Park',
      'home.worlds.culture.shot1': 'El letrero iluminado de TORONTO reflejado en el estanque de Nathan Phillips Square de noche',
      'home.worlds.culture.shot2': 'Torres de piedra y entrada principal de Casa Loma, Toronto',
      'home.worlds.culture.shot3': 'La fachada histórica y el Michael Lee-Chin Crystal de vidrio del Royal Ontario Museum',
      'home.worlds.flavours.shot1': 'Edificios de ladrillo y el reloj de Gooderham & Worts en el Distillery Historic District',
      'home.worlds.flavours.shot2': 'Coloridos puestos de frutas y verduras en una esquina de Kensington Market',
      'home.worlds.flavours.shot3': 'Racimos de uvas oscuras en la vid, en la región vinícola de Niagara-on-the-Lake',
      'home.worlds.adventure.shot1': 'Un tiburón nadando sobre la Dangerous Lagoon de Ripley’s Aquarium of Canada',
      'home.worlds.adventure.shot2': 'Una mariposa morfo con las alas plegadas posada sobre una hoja en el Niagara Parks Butterfly Conservatory',
      'home.worlds.adventure.shot3': 'La montaña rusa Leviathan en plena caída en Canada’s Wonderland',
      'home.worlds.culture.shot4': 'La CN Tower elevándose sobre el puerto de Toronto en un día despejado',
      'home.worlds.flavours.shot4': 'Edificio histórico de ladrillo amarillo de Chocolate Barr’s Candies en una esquina de Stratford',
      'home.worlds.flavours.shot5': 'Trabajadores de un huerto con un tractor y un cajón lleno de manzanas durante la cosecha de 1983 en Clarksburg',

      /* Díptico del concepto */
      'home.intro.altNature': 'Agua turquesa y costa rocosa de piedra caliza en Indian Head Cove, Bruce Peninsula National Park',
      'home.intro.altCity': 'Skyline de Toronto de noche con la CN Tower iluminada, visto al otro lado del puerto',

      /* Puente fotográfico entre Sabores y Aventura */
      'home.bridge3.eyebrow': 'Después del festín',
      'home.bridge3.title': 'Ahora, agárrate<br><em>fuerte.</em>',
      'home.bridge3.alt': 'El tren de la montaña rusa Leviathan subiendo su primera cuesta contra el cielo en Canada’s Wonderland',
      'home.worlds.nature.shot3b': 'Pequeño lago con colores de otoño junto al sendero Centennial Ridges, Algonquin Provincial Park',
      'home.worlds.adventure.shot4': 'Un orangután joven sosteniendo una ramita en el Toronto Zoo',
      'home.worlds.flavours.shot6': 'Un sándwich de peameal bacon de Carousel Bakery, St. Lawrence Market',

      /* Puente fotográfico entre Cultura y Sabores */
      'home.bridge2.eyebrow': 'Una provincia para saborear',
      'home.bridge2.title': 'De los mercados históricos<br><em>a la región vinícola.</em>',
      'home.bridge2.alt': 'Racimos de uvas oscuras colgando de las vides en Niagara-on-the-Lake en septiembre',

      /* Puente fotográfico entre Naturaleza y Cultura */
      'home.bridge.eyebrow': 'De las islas a la ciudad',
      'home.bridge.title': 'Un corto trayecto en ferry,<br><em>dos mundos distintos.</em>',
      'home.bridge.caption': 'El skyline de Toronto desde el ferry de Ward’s Island',
      'home.bridge.alt': 'Silueta del skyline de Toronto y la CN Tower al atardecer, vista desde el ferry sobre el lago Ontario',

      'home.marquee.label': 'Las 24 experiencias de esta guía',

      'home.fyo.eyebrow': 'Experiencia interactiva',
      'home.fyo.title': '¿No sabes<br><em>a dónde ir?</em>',
      'home.fyo.text': 'Descubre qué experiencia de Ontario va mejor contigo.',
      'home.fyo.text2': 'Responde siete preguntas rápidas sobre tu forma de viajar. Tus respuestas se comparan con nuestras 24 experiencias para sugerirte tu combinación ideal, sin registro y sin datos personales.',
      'home.fyo.m1': 'Preguntas',
      'home.fyo.m2': 'Experiencias',
      'home.fyo.m3': 'Recomendación personal',
      'home.fyo.cta': 'Descubre tu Ontario',
      'home.fyo.preview': 'Vista previa',
      'home.fyo.previewLabel': 'Vista previa del cuestionario Descubre tu Ontario',
      'home.fyo.question': '¿Cómo sería tu día ideal?',
      'home.fyo.opt1': 'Rodeado de naturaleza',
      'home.fyo.opt2': 'Explorando una ciudad',
      'home.fyo.opt3': 'Descubriendo cultura',
      'home.fyo.opt4': 'Probando sabores locales',
      'home.fyo.opt5': 'Buscando aventura',
      'home.fyo.hint': 'Buena elección. Continúa en la experiencia completa',
      'home.fyo.nextQuestion': '¿Con quién viajas?',
      'home.fyo.q4': '¿Qué ritmo de viaje prefieres?',
      'home.fyo.q5': '¿Qué paisaje te llama?',
      'home.fyo.q6': '¿Cuánta aventura buscas?',
      'home.fyo.q7': '¿Qué te gustaría probar?',
      'home.fyo.alt': 'Bosque reflejado en el agua en calma de Ragged Lake, Algonquin Provincial Park',

      'home.map.eyebrow': 'Explorar Ontario',
      'home.map.title': '¿A dónde<br><em>irás ahora?</em>',
      'home.map.text': 'Recorre las experiencias por toda la provincia en un mapa interactivo. Cada ubicación está a un clic de su historia.',
      'home.map.s1': 'Experiencias',
      'home.map.s2': 'Regiones',
      'home.map.s3': 'Provincia',
      'home.map.caption': 'Destinos seleccionados de Ontario',
      'home.map.cta': 'Explorar mapa',
      'home.map.schematic': 'Vista esquemática · sin escala',
      'home.map.panelLabel': 'Mapa esquemático de las seis regiones incluidas en la guía',
      'home.plan.eyebrow': '¿Todo listo?',
      'home.plan.title': 'Convierte las ideas<br><em>en un viaje.</em>',
      'home.plan.text': 'Crea un itinerario día a día con las experiencias que te gustan, descubre cuándo ir y lee la guía práctica antes de viajar.',
      'lake.huron': 'Lago Hurón',
      'lake.georgian': 'Bahía Georgiana',
      'lake.ontario': 'Lago Ontario',
      'lake.erie': 'Lago Erie'
    }
  };

  let currentLang = DEFAULT_LANG;

  /* ---------- Storage (fails silently in private modes) ---------- */
  function readStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(stored) ? stored : null;
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* storage unavailable: language still changes for this page */ }
  }

  /* ---------- Lookup ---------- */
  function lookup(key, lang) {
    const dict = TRANSLATIONS[lang] || {};
    if (key in dict) return dict[key];
    if (key in TRANSLATIONS[DEFAULT_LANG]) return TRANSLATIONS[DEFAULT_LANG][key];
    return null;
  }

  function t(key, vars, lang) {
    lang = lang || currentLang;
    let finalKey = key;
    if (vars && Number(vars.n) === 1 && lookup(key + '.one', lang) !== null) {
      finalKey = key + '.one';
    }
    let str = lookup(finalKey, lang);
    if (str === null) {
      console.warn('[i18n] Missing key:', key);
      return key;
    }
    if (vars) {
      str = str.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
    }
    return str;
  }

  function readVars(el) {
    if (!el.dataset.i18nVars) return null;
    try {
      return JSON.parse(el.dataset.i18nVars);
    } catch (e) {
      return null;
    }
  }

  /* ---------- Apply translations to the DOM ---------- */
  function apply(scope) {
    const root = scope || document;

    root.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n, readVars(el));
    });

    root.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml, readVars(el));
    });

    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split('|').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key, readVars(el)));
      });
    });

    // Only update global document state when translating the whole page
    if (!scope) {
      document.documentElement.lang = currentLang;
      const titleKey = document.body.dataset.pageTitle;
      if (titleKey) document.title = t(titleKey);

      document.querySelectorAll('[data-lang]').forEach((btn) => {
        const active = btn.dataset.lang === currentLang;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    }
  }

  /* ---------- Change language ---------- */
  function setLang(lang, options) {
    if (!SUPPORTED.includes(lang)) return;
    const animate = !(options && options.animate === false);
    const html = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    currentLang = lang;
    storeLang(lang);

    const swap = () => {
      apply();
      html.classList.remove('is-switching');
      document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    };

    if (animate && !reduceMotion) {
      html.classList.add('is-switching');
      window.setTimeout(swap, 200);
    } else {
      swap();
    }
  }

  /* ---------- Init ---------- */
  // Optional ?lang=es / ?lang=en in the URL (shareable links)
  function readUrlLang() {
    const lang = new URLSearchParams(window.location.search).get('lang');
    return SUPPORTED.includes(lang) ? lang : null;
  }

  function init() {
    const urlLang = readUrlLang();
    if (urlLang) storeLang(urlLang);
    currentLang = urlLang || readStoredLang() || DEFAULT_LANG;
    apply();
    document.documentElement.classList.remove('i18n-pending');

    // Delegated: works for selectors rendered later (header, footer…)
    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-lang]');
      if (!btn) return;
      if (btn.dataset.lang !== currentLang) setLang(btn.dataset.lang);
    });
  }

  /* ---------- Public API ---------- */
  window.OTE_I18N = {
    t,
    apply,
    setLang,
    getLang: () => currentLang,
    extend(extra) {
      SUPPORTED.forEach((lang) => {
        if (extra[lang]) Object.assign(TRANSLATIONS[lang], extra[lang]);
      });
    }
  };

  // Deferred scripts run before DOMContentLoaded, so main.js has
  // already rendered the shared header/footer when this fires.
  document.addEventListener('DOMContentLoaded', init);
})();
