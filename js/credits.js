/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   credits.js — Credits & References (credits.html)

   1. Photography: every image of the project (66 files, plus
      their 640px copies in images/thumbs/) with subject, author,
      licence and source, following the TASL practice (Title,
      Author, Source, Licence) recommended by Creative Commons.
      Same data as the README.
   2. Information sources: js/references.js in APA 7 style.
   3. Map, software and typography.
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const REFS = window.OTE_REFS;
  if (!I18N || !REFS) return;

  /* [file, subject, author, licence, source] — all from Wikimedia Commons */
  const PHOTOS = [
    ['home/hero-algonquin-autumn.webp', 'Algonquin Provincial Park (Lake of Two Rivers)', 'Tony Webster', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Fall_Colors_at_Algonquin_Provincial_Park,_Canada_-_Autumn_on_Lake_of_Two_Rivers_(29648245373).jpg'],
    ['home/map-bruce-peninsula.webp', 'Bruce Peninsula National Park', 'The Cosmonaut', 'CC BY-SA 2.5 CA', 'https://commons.wikimedia.org/wiki/File:Bruce_Peninsula_National_Park_cliffs.jpg'],
    ['home/nature-niagara-falls.webp', 'Niagara Falls (Horseshoe Falls)', 'Thomaswm', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_Canadian_Falls_(Horseshoe_Falls)_and_the_Hornblower_Niagara_Cruises_boat;_Niagara_Falls.JPG'],
    ['home/culture-toronto-skyline.webp', 'Toronto skyline', 'Jchmrt', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg'],
    ['home/flavours-st-lawrence-market.webp', 'St. Lawrence Market', 'Alexandre Moreau', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:St_Lawrence_Market_Toronto_2010.jpg'],
    ['home/adventure-blue-mountain.webp', 'Blue Mountain Village', 'Makeworldpedia', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Blue_Mountain_Ontario_at_night_(landscape).jpg'],
    ['home/quiz-ragged-lake.webp', 'Ragged Lake, Algonquin Provincial Park', 'Wllewis', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Ragged_Lake_mirror.jpg'],
    ['home/nature-sauble-beach.webp', 'Sauble Beach', 'Peter K Burian', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Sauble_Beach,_Ontario_(Lake_Huron).jpg'],
    ['home/nature-scenic-caves.webp', 'Scenic Caves Nature Adventures', 'Jasonrocca1', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Scenic_caves_Collingwood.jpg'],
    ['home/nature-algonquin-canoe-lake.webp', 'Algonquin Provincial Park', 'Sarthkr', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Algonquin_Canoe_Lake.jpg'],
    ['home/culture-nathan-phillips-square.webp', 'Nathan Phillips Square', 'Kevin Mullarkey', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Nathan_Philips_Square_Toronto.jpg'],
    ['home/culture-casa-loma.webp', 'Casa Loma', 'Bintyamin20248', 'CC0', 'https://commons.wikimedia.org/wiki/File:Casa_Loma_Toronto,_Canada.jpg'],
    ['home/culture-royal-ontario-museum.webp', 'Royal Ontario Museum', 'Maksim Sokolov (Maxergon)', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Royal_Ontario_Museum_in_Fall_2021.jpg'],
    ['home/flavours-distillery-district.webp', 'Distillery Historic District', 'Chicken4War', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Distillery_District,_looking_northeast_2026.jpg'],
    ['home/flavours-kensington-market.webp', 'Kensington Market', 'Arild Vågen', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Kensington_Market_Toronto_August_2017_04.jpg'],
    ['home/flavours-niagara-wine-country.webp', 'Niagara Wine Country', 'Hannah Clover', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Grapevines_in_Niagara-on-the-Lake.jpg'],
    ['home/adventure-ripleys-aquarium.webp', 'Ripley’s Aquarium of Canada', 'RipleysAquaCA', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Dangerous_Lagoon_-_Sharks-9.jpg'],
    ['home/adventure-butterfly-conservatory.webp', 'Niagara Parks Butterfly Conservatory', 'The Cosmonaut', 'CC BY-SA 2.5 CA', 'https://commons.wikimedia.org/wiki/File:Morpho_peleides_Niagara_Parks_Butterfly_Conservatory.jpg'],
    ['home/adventure-canadas-wonderland.webp', 'Canada’s Wonderland', 'Jeremy Thompson', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Leviathan_descending_hill.jpg'],
    ['nature/hero-indian-head-cove.webp', 'Bruce Peninsula National Park (Indian Head Cove)', 'Jaimie Snelgrove', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Indian_Head_Cove,_Bruce_National_Park,_May_2018.jpg'],
    ['nature/toronto-islands.webp', 'Toronto Islands', 'Josh Evnin', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Centre_Island_Beach_Toronto_2010.jpg'],
    ['culture/hero-toronto-skyline-night.webp', 'Toronto skyline from Polson Pier', 'Allen McGregor', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Toronto_Skyline_from_Polson_Pier_(5461949752).jpg'],
    ['culture/cn-tower.webp', 'CN Tower', 'Scott Webb', 'CC0', 'https://commons.wikimedia.org/wiki/File:CN_Tower,_Toronto,_Canada_(Unsplash_DJ_kOgH5u0o).jpg'],
    ['culture/art-gallery-of-ontario.webp', 'Art Gallery of Ontario', 'Jeff Hitchcock', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Art_Gallery_of_Ontario_(38661357472).jpg'],
    ['culture/hockey-hall-of-fame.webp', 'Hockey Hall of Fame', 'Adam Bishop', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Hockey_Hall_of_Fame_summer_2022.jpg'],
    ['flavours/hero-st-lawrence-market.webp', 'St. Lawrence Market', 'stu_spivack', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:St._Lawrence_Market_interior.jpg'],
    ['flavours/stratford-chocolate-trail.webp', 'Stratford Chocolate Trail (Chocolate Barr’s Candies)', 'Chris Woodrich', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Chocolate_Barr%27s_Candies,_Stratford,_Ontario,_2025-08-04_03.jpg'],
    ['flavours/apple-pie-trail.webp', 'Apple Pie Trail (apple harvest, Clarksburg, 1983)', 'Archives of Ontario, I0004608', 'Open Government Licence – Ontario', 'https://commons.wikimedia.org/wiki/File:Men_picking_apples,_Georgian_triangle_apples,_Clarksburg_(I0004608).jpg'],
    ['adventure/hero-blue-mountain-village.webp', 'Blue Mountain', 'Andrew Skujins', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Blue_Mountain_Resort_-_Summer_view.jpg'],
    ['adventure/toronto-zoo.webp', 'Toronto Zoo', 'ImagePerson', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Orangutan_Toronto_Zoo_2292.jpg'],
    ['adventure/treetop-trekking-horseshoe.webp', 'Treetop Trekking (Horseshoe Resort entrance)', 'P199', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Horseshoe_Resort_2.JPG'],
    ['home/bridge-toronto-islands-ferry.webp', 'Toronto Islands ferry', 'Lord of the Wings', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Toronto_Skyline_from_Ward%27s_Island_Ferry_(19745155876).jpg'],
    ['home/culture-cn-tower-vertical.webp', 'CN Tower', 'Wladyslaw', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Toronto_-_ON_-_Toronto_Harbourfront7.jpg'],
    ['nature/opener-niagara-panorama.webp', 'Niagara Falls', 'Robert F. Tobler', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Niagara_Falls_USA_Canada_from_Skylon_Tower_on_2002-05-28,_full_size.jpg'],
    ['nature/opener-algonquin-sunset.webp', 'Algonquin Provincial Park (Whitefish Lake)', 'Maksim Sokolov', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Sunset_in_Algolquin_Provincial_Park.jpg'],
    ['nature/algonquin-autumn-lake.webp', 'Algonquin Provincial Park', 'Maksim Sokolov', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:A_small_lake_in_Algonquin_Provincial_Park.jpg'],
    ['nature/bruce-peninsula-cliffs.webp', 'Bruce Peninsula National Park', 'The Cosmonaut', 'CC BY-SA 2.5 CA', 'https://commons.wikimedia.org/wiki/File:Bruce_Peninsula_National_Park_cliffs.jpg'],
    ['nature/scenic-caves-bridge.webp', 'Scenic Caves (suspension bridge)', 'Niels Elgaard Larsen', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:ScenicCaveBridgeOn.jpg'],
    ['culture/opener-toronto-skyline.webp', 'Toronto skyline', 'Benson Kua', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Toronto_on_a_summer_day.jpg'],
    ['culture/nathan-phillips-square-panorama.webp', 'Nathan Phillips Square', 'Paolo Costa Baldi', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Nathan_Phillips_square_-_Toronto.jpg'],
    ['culture/casa-loma-great-hall.webp', 'Casa Loma (Great Hall)', 'Dillan Payne', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Great_Hall_of_Casa_Loma,_September_27_2025_(02).jpg'],
    ['culture/opener-rom-dinosaurs.webp', 'Royal Ontario Museum (Barosaurus)', 'KristyVan', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Barosaurus,_Royal_Ontario_Museum,_side.jpg'],
    ['culture/rom-crystal-staircase.webp', 'Royal Ontario Museum (Crystal staircase)', 'Maksim Sokolov', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Staircase_of_the_Michael_Lee-Chin_Crystal.jpg'],
    ['flavours/opener-st-lawrence-south-market.webp', 'St. Lawrence Market', 'Canmenwalker', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:St._Lawrence_Market_South_Interior_2021.jpg'],
    ['flavours/peameal-bacon-sandwich.webp', 'St. Lawrence Market (Carousel Bakery)', 'Leventio', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Peameal_bacon_sandwich.jpg'],
    ['flavours/distillery-district-wide.webp', 'Distillery Historic District', 'Chicken4War', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Distillery_District,_looking_northeast_2026.jpg'],
    ['flavours/opener-niagara-grapes.webp', 'Niagara-on-the-Lake', 'Graham', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Wikivoyage_banner_wines_of_ontario_3.jpg'],
    ['flavours/niagara-vineyard.webp', 'Niagara Wine Country', 'M Readey', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Wine_Grapes_in_the_Niagara_Peninsula.jpg'],
    ['flavours/icewine-grapes-inniskillin.webp', 'Niagara Wine Country (Inniskillin)', 'James G. Milles', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Icewine_grapes,_Inniskillin_Winery,_Niagara_on_the_Lake_(2772415951).jpg'],
    ['flavours/rheo-thompson-candies.webp', 'Stratford Chocolate Trail', 'Chris Woodrich', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Rheo_Thompson_Candies,_Stratford,_Ontario,_2025-08-04.jpg'],
    ['adventure/opener-leviathan-riders.webp', 'Canada’s Wonderland', 'GolhaMedia', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Canada_Wonderland_rollercoaster_2015.jpg'],
    ['adventure/ripleys-jellyfish.webp', 'Ripley’s Aquarium of Canada', 'Gzzz', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Chrysaora_fuscescens_Ripley%27s_Aquarium_of_Canada_1.JPG'],
    ['adventure/toronto-zoo-entrance.webp', 'Toronto Zoo', 'JasonParis', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Toronto_Zoo_(Scarborough_-_Rouge)_(5530655023).jpg'],
    ['adventure/opener-blue-mountain-view.webp', 'Blue Mountain', 'XeresNelro', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:View_From_Blue_Mountain_4.jpg'],
    ['adventure/blue-mountain-night.webp', 'Blue Mountain Resort', 'Makeworldpedia', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Blue_Mountain_Ontario_at_night_(landscape).jpg'],
    ['adventure/blue-mountain-ridge-runner.webp', 'Blue Mountain Resort (Ridge Runner)', 'Chicken4War', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Blue_Mountain_Ridge_Runner,_2026.jpg'],
    ['home/region-stratford-avon.webp', 'Stratford, Avon River', 'Ken Lund', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Bridge,_Avon_River,_Stratford,_Ontario_(21651644568).jpg'],
    ['flavours/intro-st-lawrence-peameal.webp', 'St. Lawrence Market', 'Mack Male', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:St._Lawrence_Market_(6037463892).jpg'],
    ['adventure/intro-ripleys-kelp.webp', 'Ripley’s Aquarium', 'Ken Lund', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Ripley%27s_Aquarium_of_Canada,_Toronto,_Ontario_(29709376480).jpg'],
    ['home/bridge-leviathan-climb.webp', 'Leviathan, Canada’s Wonderland', 'Jason Zhang', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Leviathan_ascending_(2).jpg'],
    ['nature/niagara-horseshoe-canadian-side.webp', 'Niagara Falls (Ontario side)', 'Yinan Chen', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Gfp-canada-niagara-falls-fury-of-the-falls.jpg'],
    ['culture/cn-tower-pod.webp', 'CN Tower (main pod)', 'Wladyslaw', 'CC BY 3.0', 'https://commons.wikimedia.org/wiki/File:Toronto_-_ON_-_CN_Tower_Turmkorb.jpg'],
    ['flavours/kensington-market-street.webp', 'Kensington Market (street panorama)', 'Arild Vågen', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Kensington_Market_Toronto_August_2017_01.jpg'],
    ['adventure/wonderland-drop-tower.webp', 'Canada’s Wonderland (Drop Tower)', 'K2HWY', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Drop_Tower_in_Canada%27s_Wonderland.jpg'],
    ['adventure/horseshoe-resort-hill.webp', 'Treetop Trekking (Horseshoe Resort hill)', 'Misskatewiki', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Horseshoe_Resort_Hill.jpg'],
    ['adventure/butterfly-hamadryas.webp', 'Niagara Parks Butterfly Conservatory', 'The Cosmonaut', 'CC BY-SA 2.5 CA', 'https://commons.wikimedia.org/wiki/File:Hamadryas_februa_Niagara_Parks_Butterfly_Conservatory.jpg']
  ];

  /* Spanish version of the descriptive part of some subjects
     (official place names stay as they are) */
  const SUBJECT_ES = {
    'Toronto skyline': 'Skyline de Toronto',
    'Toronto skyline from Polson Pier': 'Skyline de Toronto desde Polson Pier',
    'Apple Pie Trail (apple harvest, Clarksburg, 1983)': 'Apple Pie Trail (cosecha de manzanas, Clarksburg, 1983)',
    'Treetop Trekking (Horseshoe Resort entrance)': 'Treetop Trekking (entrada de Horseshoe Resort)',
    'Toronto Islands ferry': 'Ferry de las Toronto Islands',
    'Scenic Caves (suspension bridge)': 'Scenic Caves (puente colgante)',
    'Casa Loma (Great Hall)': 'Casa Loma (Gran Salón)',
    'Royal Ontario Museum (Crystal staircase)': 'Royal Ontario Museum (escalera del Crystal)',
    'Stratford, Avon River': 'Stratford, río Avon',
    'Niagara Falls (Ontario side)': 'Niagara Falls (lado de Ontario)',
    'CN Tower (main pod)': 'CN Tower (cápsula principal)',
    'Kensington Market (street panorama)': 'Kensington Market (panorámica de la calle)',
    'Treetop Trekking (Horseshoe Resort hill)': 'Treetop Trekking (colina de Horseshoe Resort)'
  };
  const LICENCE_ES = { 'Public domain': 'Dominio público' };

  const LICENCES = {
    'CC0': 'https://creativecommons.org/publicdomain/zero/1.0/',
    'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
    'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
    'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
    'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
    'CC BY-SA 2.5 CA': 'https://creativecommons.org/licenses/by-sa/2.5/ca/',
    'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
    'Open Government Licence – Ontario': 'https://www.ontario.ca/page/open-government-licence-ontario'
  };

  const FOLDERS = ['home', 'nature', 'culture', 'flavours', 'adventure'];
  const REF_GROUPS = ['transport', 'weather', 'access', 'before', 'seasons', 'exp'];

  I18N.extend({
    en: {
      'title.credits': 'Credits & References — Ontario Tourism Experiences',
      'meta.credits': 'Photographs, authors and licences, information sources in APA 7 style, map, software and typography used in this guide.',
      'credits.eyebrow': 'Credits & References',
      'credits.title': 'Where everything<br><em>comes from.</em>',
      'credits.lede': 'Every photograph, fact and tool used in this guide, with its author, licence and source.',
      'credits.s1': 'Photographs',
      'credits.s2': 'Information sources',
      'credits.s3': 'Pages',
      'credits.index': 'Contents',

      'credits.photos.title': 'Photography',
      'credits.photos.lede': 'All images come from Wikimedia Commons. They were resized and converted to WebP for the web (images/thumbs/ holds 640px copies of the 24 experience photos, same authors and licences). Attribution follows the TASL practice: title, author, source and licence.',
      'credits.photos.file': 'File',
      'credits.photos.subject': 'Subject',
      'credits.photos.author': 'Author',
      'credits.photos.licence': 'Licence',
      'credits.photos.source': 'Source',
      'credits.photos.commons': 'Wikimedia Commons',
      'credits.folder.home': 'Home (several reused on other pages)',
      'credits.folder.nature': 'Nature',
      'credits.folder.culture': 'Culture',
      'credits.folder.flavours': 'Flavours',
      'credits.folder.adventure': 'Adventure',
      'credits.photos.reuse': 'Plan Your Trip, Ontario by Season, My Favourites, the Travel Guide and this page reuse these same photographs: no new images were added.',

      'credits.refs.title': 'Information sources',
      'credits.refs.lede': 'Official and institutional sources used for the facts on Ontario by Season, the Travel Guide and the indicative prices of the world pages, in APA 7 style. All were consulted on September 28, 2026; pages without a date are cited as (n.d.) with their retrieval date.',
      'credits.refs.transport': 'Transport and roads',
      'credits.refs.weather': 'Weather and health',
      'credits.refs.access': 'Accessibility',
      'credits.refs.before': 'Before you go',
      'credits.refs.seasons': 'Seasons and attractions',
      'credits.refs.exp': 'Experiences and admission',
      'credits.refs.texts': 'The descriptions of the 24 experiences on the four world pages were written for this project from publicly available information. Their key facts and indicative prices were checked in September 2026 against the official sources listed above (Butterfly Conservatory: Niagara Parks, under Seasons and attractions).',

      'credits.tech.title': 'Map, software and typography',
      'credits.tech.map': 'Base map',
      'credits.tech.lib': 'Map library',
      'credits.tech.fonts': 'Typography',
      'credits.tech.fontsText': 'Cormorant Garamond and Manrope, served by Google Fonts under the SIL Open Font License 1.1.',
      'credits.tech.stack': 'Built with HTML, CSS and JavaScript, without frameworks. The planner, the quiz and the favourites run entirely in the browser.',

      'credits.about.title': 'About this project',
      'credits.about.text': 'Independent academic multimedia project. It is not affiliated with Destination Ontario, the Government of Ontario or any of the attractions mentioned. Names of places and attractions belong to their owners.'
    },
    es: {
      'title.credits': 'Créditos y referencias — Experiencias Turísticas de Ontario',
      'meta.credits': 'Fotografías, autores y licencias, fuentes de información en formato APA 7, mapa, software y tipografía utilizados en esta guía.',
      'credits.eyebrow': 'Créditos y referencias',
      'credits.title': 'De dónde<br><em>viene todo.</em>',
      'credits.lede': 'Cada fotografía, dato y herramienta utilizados en esta guía, con su autor, licencia y fuente.',
      'credits.s1': 'Fotografías',
      'credits.s2': 'Fuentes de información',
      'credits.s3': 'Páginas',
      'credits.index': 'Contenido',

      'credits.photos.title': 'Fotografía',
      'credits.photos.lede': 'Todas las imágenes proceden de Wikimedia Commons. Se redimensionaron y convirtieron a WebP para la web (images/thumbs/ contiene copias de 640px de las fotos de las 24 experiencias, con los mismos autores y licencias). La atribución sigue la práctica TASL: título, autor, fuente y licencia.',
      'credits.photos.file': 'Archivo',
      'credits.photos.subject': 'Motivo',
      'credits.photos.author': 'Autor',
      'credits.photos.licence': 'Licencia',
      'credits.photos.source': 'Fuente',
      'credits.photos.commons': 'Wikimedia Commons',
      'credits.folder.home': 'Inicio (varias se reutilizan en otras páginas)',
      'credits.folder.nature': 'Naturaleza',
      'credits.folder.culture': 'Cultura',
      'credits.folder.flavours': 'Sabores',
      'credits.folder.adventure': 'Aventura',
      'credits.photos.reuse': 'Planifica tu viaje, Ontario por temporada, Mis favoritos, la Guía para tu viaje y esta página reutilizan estas mismas fotografías: no se añadieron imágenes nuevas.',

      'credits.refs.title': 'Fuentes de información',
      'credits.refs.lede': 'Fuentes oficiales e institucionales utilizadas para los datos de Ontario por temporada, de la Guía para tu viaje y de los precios orientativos de las páginas de mundos, en formato APA 7. Todas se consultaron el 28 de septiembre de 2026; las páginas sin fecha se citan como (s. f.) con su fecha de recuperación.',
      'credits.refs.transport': 'Transporte y carreteras',
      'credits.refs.weather': 'Clima y salud',
      'credits.refs.access': 'Accesibilidad',
      'credits.refs.before': 'Antes de viajar',
      'credits.refs.seasons': 'Temporadas y atracciones',
      'credits.refs.exp': 'Experiencias y entradas',
      'credits.refs.texts': 'Las descripciones de las 24 experiencias en las cuatro páginas de mundos se redactaron para este proyecto a partir de información pública. Sus datos clave y precios orientativos se comprobaron en septiembre de 2026 con las fuentes oficiales indicadas arriba (Butterfly Conservatory: Niagara Parks, en Temporadas y atracciones).',

      'credits.tech.title': 'Mapa, software y tipografía',
      'credits.tech.map': 'Mapa base',
      'credits.tech.lib': 'Biblioteca de mapas',
      'credits.tech.fonts': 'Tipografía',
      'credits.tech.fontsText': 'Cormorant Garamond y Manrope, servidas por Google Fonts bajo la SIL Open Font License 1.1.',
      'credits.tech.stack': 'Construido con HTML, CSS y JavaScript, sin frameworks. El planificador, el cuestionario y los favoritos funcionan por completo en el navegador.',

      'credits.about.title': 'Sobre este proyecto',
      'credits.about.text': 'Proyecto multimedia académico independiente. No está afiliado a Destination Ontario, al Gobierno de Ontario ni a ninguna de las atracciones mencionadas. Los nombres de lugares y atracciones pertenecen a sus propietarios.'
    }
  });

  const doc = document;
  const t = (k, v) => I18N.t(k, v);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function renderPhotos() {
    const box = doc.querySelector('[data-credits-photos]');
    if (!box) return;
    const es = I18N.getLang() === 'es';
    box.innerHTML = FOLDERS.map((folder) => {
      const rows = PHOTOS.filter((p) => p[0].split('/')[0] === folder).map(([file, subject, author, licence, url]) => {
        const licName = (es && LICENCE_ES[licence]) || licence;
        const lic = LICENCES[licence] ? `<a href="${LICENCES[licence]}" target="_blank" rel="noopener">${esc(licName)}</a>` : esc(licName);
        return `<tr>
          <td class="credits-file">${esc(file.split('/')[1])}</td>
          <td>${esc((es && SUBJECT_ES[subject]) || subject)}</td>
          <td>${esc(author)}</td>
          <td>${lic}</td>
          <td><a href="${esc(url)}" target="_blank" rel="noopener">${esc(t('credits.photos.commons'))}</a></td>
        </tr>`;
      }).join('');
      return `
        <h3 class="credits-sub">${esc(t(`credits.folder.${folder}`))} <span>images/${folder}/</span></h3>
        <table class="credits-table">
          <thead><tr>
            <th scope="col">${esc(t('credits.photos.file'))}</th>
            <th scope="col">${esc(t('credits.photos.subject'))}</th>
            <th scope="col">${esc(t('credits.photos.author'))}</th>
            <th scope="col">${esc(t('credits.photos.licence'))}</th>
            <th scope="col">${esc(t('credits.photos.source'))}</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>`;
    }).join('');
  }

  function renderRefs() {
    const box = doc.querySelector('[data-credits-refs]');
    if (!box) return;
    const lang = I18N.getLang();
    box.innerHTML = REF_GROUPS.map((g) => {
      const ids = Object.keys(REFS.list).filter((id) => REFS.list[id].group === g)
        .sort((a, b) => (REFS.list[a].org.localeCompare(REFS.list[b].org)) || (REFS.list[a].title.localeCompare(REFS.list[b].title)));
      return `
        <h3 class="credits-sub">${esc(t(`credits.refs.${g}`))}</h3>
        <ul class="credits-apa">${ids.map((id) => `<li>${REFS.apa(id, lang)}</li>`).join('')}</ul>`;
    }).join('');
  }

  // Map, software and fonts — APA 7 (no date on these pages → n.d. / s. f.)
  function renderTech() {
    const es = I18N.getLang() === 'es';
    const nd = es ? 's. f.' : 'n.d.';
    const retrieved = es ? 'Recuperado el 28 de septiembre de 2026, de' : 'Retrieved September 28, 2026, from';
    const a = (url) => `<a href="${url}" target="_blank" rel="noopener">${esc(url)}</a>`;
    const set = (sel, html) => { const el = doc.querySelector(sel); if (el) el.innerHTML = html; };
    set('[data-apa-map]', `Natural Resources Canada. (${nd}). <i>Canada Base Map – Transportation (CBMT)</i> [${es ? 'Servicio de teselas de mapa' : 'Map tile service'}]. ${retrieved} ${a('https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer')}. ${es ? 'Contiene información con licencia de la' : 'Contains information licensed under the'} <a href="https://open.canada.ca/en/open-government-licence-canada" target="_blank" rel="noopener">Open Government Licence – Canada</a>.`);
    set('[data-apa-leaflet]', `Leaflet. (${nd}). <i>Leaflet</i> (${es ? 'Versión' : 'Version'} 1.9.4) [${es ? 'Software' : 'Computer software'}]. ${a('https://leafletjs.com')}. ${es ? 'Licencia' : 'Licence'}: BSD-2-Clause.`);
    set('[data-apa-fonts]', `Google Fonts. (${nd}). <i>Cormorant Garamond</i>. ${retrieved} ${a('https://fonts.google.com/specimen/Cormorant+Garamond')}<br>Google Fonts. (${nd}). <i>Manrope</i>. ${retrieved} ${a('https://fonts.google.com/specimen/Manrope')}`);  }

  function render() {
    renderPhotos();
    renderRefs();
    renderTech();
    const n = doc.querySelector('[data-count-photos]');
    if (n) n.textContent = String(PHOTOS.length);
    const r = doc.querySelector('[data-count-refs]');
    if (r) r.textContent = String(Object.keys(REFS.list).length);
  }

  doc.addEventListener('DOMContentLoaded', () => {
    if (!doc.querySelector('[data-credits]')) return;
    render();
    doc.addEventListener('languagechange', render);
  });
})();