/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   guide.js — Travel Guide (travel-guide.html)

   Practical information only (the 24 experiences are not
   repeated here). Five chapters: getting around · distances &
   regions · weather & what to pack · accessibility · before
   you go. Every factual item cites its official source from
   js/references.js (consulted 2026-09-28); items marked
   "advice" are general recommendations, not facts.
   Distances are calculated, not quoted: straight line between
   the centres of the six regions (js/experiences.js).
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const DATA = window.OTE_EXPERIENCES;
  const REFS = window.OTE_REFS;
  if (!I18N || !DATA || !REFS) return;

  /* Line icons (24 × 24, stroke) */
  const ICONS = {
    plane: 'M3 11l18-8-8 18-2-8-8-2z',
    train: 'M7 3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zM4 10h16M8 21l2-4M16 21l-2-4M8.5 13.5h.01M15.5 13.5h.01',
    tram: 'M6 5h12v11H6zM6 11h12M9 2h6M9 20l-1 2M15 20l1 2M8 16v4M16 16v4',
    ferry: 'M2 18c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M4 15l1.5-6h13l1.5 6M9 9V5h6v4',
    car: 'M3 13l2-6h14l2 6v5H3zM3 13h18M7 18v2M17 18v2M7 15.5h.01M17 15.5h.01',
    road: 'M8 3L4 21M16 3l4 18M12 5v3M12 11v3M12 17v3',
    tree: 'M12 3l6 8h-4l5 6H5l5-6H6zM12 17v4',
    thermo: 'M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0zM12 9v8',
    info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5h.01',
    layers: 'M3 8l9-5 9 5-9 5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
    alert: 'M12 3l10 17H2zM12 10v4M12 17h.01',
    snow: 'M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2',
    access: 'M12 3.5a1.5 1.5 0 1 0 0 .01M5 8l7 1.2L19 8M12 9.2V14l-3 7M12 14l3 7',
    card: 'M3 6h18v12H3zM3 10h18M7 15h4',
    passport: 'M6 3h12v18H6zM12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6M9 17h6',
    percent: 'M19 5L5 19M7 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4M17 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4',
    glass: 'M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v7M8 21h8',
    phone: 'M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z'
  };

  /* The chapters — texts in the dictionaries below: guide.i.<key>.t / .x / .u */
  const CHAPTERS = {
    around: [
      { key: 'air', icon: 'plane', fig: '28', refs: ['upx'] },
      { key: 'go', icon: 'train', refs: ['go-about', 'go-niagara'] },
      { key: 'via', icon: 'train', fig: '132', refs: ['via-niagara', 'amtrak-ml', 'via-stratford'] },
      { key: 'ttc', icon: 'tram', refs: ['ttc-fares'] },
      { key: 'ferry', icon: 'ferry', refs: ['to-ferry'] },
      { key: 'parks', icon: 'car', refs: ['op-algonquin', 'foap-directions', 'pc-bruce-directions'] },
      { key: 'drive', icon: 'car', fig: '3', refs: ['on-drive'] },
      { key: 'roads', icon: 'road', fig: '511', refs: ['on-511'] }
    ],
    weather: [
      { key: 'forecast', icon: 'info', refs: ['eccc-weather'] },
      { key: 'pack', icon: 'layers', advice: true },
      { key: 'ticks', icon: 'alert', refs: ['on-ticks'] },
      { key: 'winter', icon: 'snow', fig: '25%', refs: ['on-winter'] }
    ],
    access: [
      { key: 'aoda', icon: 'access', fig: '2005', refs: ['on-aoda', 'on-aoda-review'] },
      { key: 'transit', icon: 'train', refs: ['go-access', 'ttc-access', 'via-access'] },
      { key: 'access2', icon: 'card', fig: '500+', refs: ['es-access2'] },
      { key: 'parks2', icon: 'tree', refs: ['pc-bruce-access'] },
      { key: 'check', icon: 'info', advice: true }
    ],
    before: [
      { key: 'eta', icon: 'passport', fig: 'CAD $7', refs: ['ircc-eta', 'ircc-eta-fee'] },
      { key: 'money', icon: 'percent', fig: '13%', refs: ['cra-hst', 'boc-notes'] },
      { key: 'permits', icon: 'tree', refs: ['op-permit', 'pc-grotto'] },
      { key: 'age', icon: 'glass', fig: '19', refs: ['agco-age'] },
      { key: 'emergency', icon: 'phone', fig: '911', refs: ['pc-emergency'] },
      { key: 'official', icon: 'info', refs: ['do-who'] }
    ]
  };

  const MAX_HOP_KM = 230;              // same limit as js/plan.js

  /* Climate by season — Environment and Climate Change Canada,
     Canadian Climate Normals 1991–2020, station TORONTO (CITY),
     Climate ID 6158350 (reference 'eccc-normals', page modified
     2026-08-10). Official monthly normals, January → December:
       min = "Daily Minimum (°C)" — mean of the daily low temperatures
       max = "Daily Maximum (°C)" — mean of the daily high temperatures
     Same table, "Days with Maximum Temperature" (code C: ≥ 20 years)
     and "Days with Minimum Temperature" (code A: WMO 3-and-5 rule):
       above30 = days with a high > 30 °C · above35 = high > 35 °C
       below10 = days with a low < −10 °C · below20 = low < −20 °C
     (average number of days per month, 1991–2020).
     Records ("Extreme Maximum / Minimum") are NOT used.

     Method, per season (Mar–May · Jun–Aug · Sep–Nov · Dec–Feb):
     1. Typical temperature = from the "Daily Minimum" of the coldest
        month to the "Daily Maximum" of the warmest month of the season
        (direct values, rounded to whole degrees). It covers the usual
        daily lows and highs of every month of the season:
          Spring −1.8 (Mar) → 18.8 (May)  ≈ −2 – 19 °C
          Summer 15.3 (Jun) → 27.0 (Jul)  ≈ 15 – 27 °C
          Fall    2.3 (Nov) → 22.0 (Sep)  ≈ 2 – 22 °C
          Winter −6.7 (Jan) →  2.6 (Dec)  ≈ −7 – 3 °C
     2. Second line (sum of the three monthly values, rounded):
          Summer: days above 30 °C 3.1 + 6.0 + 3.2 = 12.3 → about 12;
                  above 35 °C 0.04 + 0.25 + 0.15 = 0.44 (< 1) → "rare"
          Winter: lows below −10 °C 3.4 + 9.6 + 6.8 = 19.8 → about 20;
                  below −20 °C 0.12 + 1.0 + 0.33 = 1.45 → "1 or 2"
          Spring / Fall: change of the average high between the first
                  and the last month (5 → 19 °C · 22 → 8 °C).
     The device date only decides which season is highlighted as the
     current one: no weather service is queried. */
  const NORMALS = {
    min: [-6.7, -6.0, -1.8, 3.9, 10.0, 15.3, 18.1, 17.7, 13.8, 7.7, 2.3, -2.7],
    max: [-0.3, 0.6, 5.1, 11.7, 18.8, 24.2, 27.0, 26.1, 22.0, 14.6, 8.1, 2.6],
    above30: [0.0, 0.0, 0.0, 0.0, 0.41, 3.1, 6.0, 3.2, 1.1, 0.04, 0.0, 0.0],
    above35: [0.0, 0.0, 0.0, 0.0, 0.0, 0.04, 0.25, 0.15, 0.0, 0.0, 0.0, 0.0],
    below10: [9.6, 6.8, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.21, 3.4],
    below20: [1.0, 0.33, 0.07, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.12]
  };
  const SEASON_MONTHS = { spring: [2, 3, 4], summer: [5, 6, 7], autumn: [8, 9, 10], winter: [11, 0, 1] };
  const seasonOf = (month) => Object.keys(SEASON_MONTHS).find((s) => SEASON_MONTHS[s].includes(month));
  const round = (n) => Math.round(n) + 0;                                                // + 0 avoids −0
  const monthly = (k, s) => SEASON_MONTHS[s].map((m) => NORMALS[k][m]);
  const seasonRange = (s) => [round(Math.min(...monthly('min', s))), round(Math.max(...monthly('max', s)))];
  const seasonDays = (k, s) => monthly(k, s).reduce((a, b) => a + b, 0);
  // Second line of each season: its i18n key and the figures it quotes
  const seasonMore = (s) => {
    const first = NORMALS.max[SEASON_MONTHS[s][0]];
    const last = NORMALS.max[SEASON_MONTHS[s][2]];
    if (s === 'summer') return { key: 'hot', vars: { n: round(seasonDays('above30', s)) } };
    if (s === 'winter') return { key: 'cold', vars: { n: round(seasonDays('below10', s)) } };
    return { key: s, vars: { a: round(first), b: round(last) } };
  };
  const deg = (n) => (n < 0 ? `−${-n}` : String(n));                                    // typographic minus

  I18N.extend({
    en: {
      'title.guide': 'Travel Guide — Ontario Tourism Experiences',
      'meta.guide': 'Practical information for travelling between the six regions of this guide: getting around, distances, weather, accessibility and paperwork, with official sources.',
      'guide.eyebrow': 'Travel Guide',
      'guide.title': 'Before you<br><em>set off.</em>',
      'guide.lede': 'Practical information for travelling between the six regions of this guide: transport, distances, weather, accessibility and paperwork. Every fact links to its official source.',
      'guide.s1': 'Regions',
      'guide.s2': 'Emergencies',
      'guide.s3': 'Sales tax',
      'guide.chapters': 'Five chapters',
      'guide.checked': 'Information checked on September 28, 2026. Rules, prices and schedules change: confirm with the official source before you travel.',
      'guide.photo': 'Avon River, Stratford',
      'guide.source': 'Source',
      'guide.sources': 'Sources',
      'guide.advice': 'Our advice — a general recommendation',

      'guide.c.around': 'Getting around',
      'guide.c.around.lede': 'Toronto is the transport hub of this guide. Trains and buses link the city with Niagara; the parks and small towns further north are easier to reach by car.',
      'guide.c.distances': 'Distances & regions',
      'guide.c.distances.lede': 'The six regions of this guide and how far apart they are, measured in a straight line between the centre of each region (the average position of its experiences). Roads are always longer: check a route planner before you go.',
      'guide.c.weather': 'Weather & what to pack',
      'guide.c.weather.lede': 'Four very different seasons. Know what to expect and check the official forecast for each region before you leave.',
      'guide.c.access': 'Accessibility',
      'guide.c.access.lede': 'What the law says, what transit offers and where to check before you visit.',
      'guide.c.before': 'Before you go',
      'guide.c.before.lede': 'Paperwork, money, permits and the numbers worth knowing.',

      'guide.i.air.t': 'From the airport to downtown',
      'guide.i.air.u': 'minutes',
      'guide.i.air.x': 'UP Express links Toronto Pearson airport with Union Station, in downtown Toronto, in 28 minutes, with stops at Weston, Mount Dennis and Bloor.',
      'guide.i.go.t': 'GO Transit, the regional network',
      'guide.i.go.x': 'Trains and buses from Hamilton and Kitchener-Waterloo to Peterborough, and from Orangeville and Barrie to Niagara Falls. GO has service to Niagara Falls all year round; check schedules for track work.',
      'guide.i.via.t': 'Intercity trains',
      'guide.i.via.u': 'km by rail',
      'guide.i.via.x': 'VIA Rail lists a 132 km Toronto – Niagara Falls route, and Amtrak’s Maple Leaf continues from Toronto through Niagara Falls to New York. Stratford has a VIA Rail station: check current schedules in VIA Rail’s booking tool before planning around it.',
      'guide.i.ttc.t': 'Getting around Toronto',
      'guide.i.ttc.x': 'The TTC accepts PRESTO cards (physical or in a mobile wallet), PRESTO tickets, debit and credit cards, and cash.',
      'guide.i.ferry.t': 'To the Toronto Islands',
      'guide.i.ferry.x': 'Ferries leave Jack Layton Ferry Terminal all year. From mid-April to mid-October they serve Centre Island, Hanlan’s Point and Ward’s Island; in winter, only Ward’s Island.',
      'guide.i.parks.t': 'Parks and small towns: think car',
      'guide.i.parks.x': 'Highway 60 crosses Algonquin Provincial Park and is open year-round; Ontario Parks notes that the park is serviced by Parkbus. Bruce Peninsula National Park is reached by Highway 6 from the south, or by the MS Chi-Cheemaun ferry from the north in spring, summer and fall.',
      'guide.i.drive.t': 'Driving as a visitor',
      'guide.i.drive.u': 'months',
      'guide.i.drive.x': 'Visiting Ontario for less than 3 months? You can drive with a valid licence from your own province, state or country. Visitors from another country staying longer need an International Driver’s Permit from their home country.',
      'guide.i.roads.t': 'Road conditions',
      'guide.i.roads.u': 'Ontario 511',
      'guide.i.roads.x': 'Ontario 511 reports incidents, roadwork, road conditions and closures on provincial highways: check 511on.ca before a long drive.',

      'guide.normals.kicker': 'Toronto (City) · Climate normals 1991–2020',
      'guide.normals.t': 'Climate by season',
      'guide.normals.range': 'Typical temperature',
      'guide.normals.legend': 'from the average daily low of the coldest month to the average daily high of the warmest month',
      'guide.normals.current': 'Current season',
      'guide.normals.aria': 'Typical temperature: about {min} to {max} °C',
      'guide.normals.spring.k': 'Big change:',
      'guide.normals.spring.x': 'the average high goes from {a} °C in March to {b} °C in May.',
      'guide.normals.hot.k': 'Hot days:',
      'guide.normals.hot.x': 'about {n} a summer above 30 °C; above 35 °C is rare.',
      'guide.normals.autumn.k': 'Cooling fast:',
      'guide.normals.autumn.x': 'the average high drops from {a} °C in September to {b} °C in November.',
      'guide.normals.cold.k': 'Very cold days:',
      'guide.normals.cold.x': 'about {n} a winter with lows below −10 °C; below −20 °C, 1 or 2.',
      'guide.normals.x': 'Historical averages, not records: warmer and colder days do occur. Hot and very cold days are the average number per season. Toronto is used as a climate reference: conditions can vary considerably in other regions of Ontario. Check the official forecast before you travel or head out.',
      'guide.normals.period': 'Data: Canadian Climate Normals 1991–2020 (historical average) · official page updated August 10, 2026.',
      'guide.i.forecast.t': 'The official forecast',
      'guide.i.forecast.x': 'Environment and Climate Change Canada publishes forecasts and 24/7 weather alerts for communities across the country at weather.gc.ca.',
      'guide.i.pack.t': 'What to pack',
      'guide.i.pack.x': 'All year: layers for changing weather, a rain jacket and comfortable walking shoes. In summer, add sun protection, swimwear and insect repellent; in winter, a warm coat, hat, gloves and waterproof boots.',
      'guide.i.ticks.t': 'Ticks in parks and forests',
      'guide.i.ticks.x': 'Blacklegged ticks can carry Lyme disease. The probability is low, but an infected tick can be found almost anywhere in Ontario, mostly in spring and summer. Wear light-coloured clothing, use a repellent with DEET or icaridin, and check yourself after walks.',
      'guide.i.winter.t': 'Driving in winter',
      'guide.i.winter.u': 'shorter braking',
      'guide.i.winter.x': 'The Government of Ontario recommends winter tires, which can shorten braking distances by as much as 25%, checking Ontario 511 before leaving and carrying a winter survival kit.',

      'guide.i.aoda.t': 'An accessibility law',
      'guide.i.aoda.u': 'AODA',
      'guide.i.aoda.x': 'The Accessibility for Ontarians with Disabilities Act, 2005 sets out a process to develop and enforce accessibility standards. Its target was an accessible Ontario by January 1, 2025; the 2023 legislative review described that goal as difficult to achieve.',
      'guide.i.transit.t': 'Accessible transit',
      'guide.i.transit.x': 'GO Transit has accessible trains, buses and stations, with trained staff to help. The entire TTC subway fleet is accessible and more than half of its stations are wheelchair and scooter friendly. VIA Rail advises booking at least 48 hours in advance.',
      'guide.i.access2.t': 'Access 2 card',
      'guide.i.access2.u': 'venues',
      'guide.i.access2.x': 'With the Easter Seals Access 2 card, the cardholder’s support person gets free admission at more than 500 participating theatres, attractions and recreation venues across Canada (the cardholder pays regular admission).',
      'guide.i.parks2.t': 'National parks',
      'guide.i.parks2.x': 'Parks Canada publishes accessibility information and easier-access visits for Bruce Peninsula National Park.',
      'guide.i.check.t': 'Check each place',
      'guide.i.check.x': 'Accessibility varies from one attraction to another. Before you go, read the accessibility page of the official website of each experience you choose.',

      'guide.i.eta.t': 'Entering Canada',
      'guide.i.eta.u': 'eTA',
      'guide.i.eta.x': 'Depending on your nationality, your travel document and how you arrive, you may need a visa or an electronic travel authorization (eTA). Visa-exempt travellers need an eTA to fly to or transit through a Canadian airport, but not to arrive by car, bus, train or boat. U.S. citizens are exempt, as are lawful U.S. permanent residents travelling with proof of status and a valid passport. The eTA costs CAD $7. Check the official requirement for your situation before you travel.',
      'guide.i.money.t': 'Money and tax',
      'guide.i.money.u': 'HST',
      'guide.i.money.x': 'Canada’s bank notes are issued by the Bank of Canada. The Harmonized Sales Tax (HST) rate in Ontario is 13%.',
      'guide.i.permits.t': 'Park permits and parking',
      'guide.i.permits.x': 'Ontario Parks sells daily vehicle permits for most parks up to five days before your visit (Algonquin is among the participating parks). In Bruce Peninsula National Park, parking reservations are required for the Grotto from May 1 to October 31.',
      'guide.i.age.t': 'Wine country',
      'guide.i.age.u': 'legal drinking age',
      'guide.i.age.x': 'The legal drinking age in licensed establishments in Ontario is 19. For tastings, plan a designated driver or a tour.',
      'guide.i.emergency.t': 'Emergencies',
      'guide.i.emergency.u': 'police · fire · ambulance',
      'guide.i.emergency.x': 'Call 911 for police, fire or ambulance.',
      'guide.i.official.t': 'Official tourism information',
      'guide.i.official.x': 'Destination Ontario is the lead tourism marketing organization for Ontario, an agency of the Government of Ontario. This guide is an independent project, not affiliated with it.',

      'guide.dist.lines': 'Lines join the regions that Plan Your Trip can combine in one trip: up to 230 km apart in a straight line.',
      'guide.dist.label': 'Diagram of the six regions of this guide, placed by their coordinates',
      'guide.dist.caption': 'Straight-line distance between the centres of the regions, in km',
      'guide.dist.far': 'More than 230 km: never combined in one trip',
      'guide.dist.note': 'Calculated from the coordinates of this guide (great-circle distance). Not a road distance or a travel time.',
      'guide.dist.cta': 'Plan a realistic route',

      'guide.next.title': 'Ready?<br><em>Plan your trip.</em>'
    },
    es: {
      'title.guide': 'Guía para tu viaje — Experiencias Turísticas de Ontario',
      'meta.guide': 'Información práctica para viajar entre las seis regiones de esta guía: cómo moverse, distancias, clima, accesibilidad y trámites, con fuentes oficiales.',
      'guide.eyebrow': 'Guía para tu viaje',
      'guide.title': 'Antes de<br><em>ponerte en marcha.</em>',
      'guide.lede': 'Información práctica para viajar entre las seis regiones de esta guía: transporte, distancias, clima, accesibilidad y trámites. Cada dato enlaza a su fuente oficial.',
      'guide.s1': 'Regiones',
      'guide.s2': 'Emergencias',
      'guide.s3': 'Impuesto sobre ventas',
      'guide.chapters': 'Cinco capítulos',
      'guide.checked': 'Información comprobada el 28 de septiembre de 2026. Normas, precios y horarios cambian: confírmalos en la fuente oficial antes de viajar.',
      'guide.photo': 'Río Avon, Stratford',
      'guide.source': 'Fuente',
      'guide.sources': 'Fuentes',
      'guide.advice': 'Nuestro consejo: una recomendación general',

      'guide.c.around': 'Cómo moverse',
      'guide.c.around.lede': 'Toronto es el centro de transporte de esta guía. Trenes y autobuses unen la ciudad con Niagara; a los parques y pueblos más al norte se llega mejor en coche.',
      'guide.c.distances': 'Distancias y regiones',
      'guide.c.distances.lede': 'Las seis regiones de esta guía y la distancia entre ellas, medida en línea recta entre el centro de cada región (la posición media de sus experiencias). Por carretera siempre es más: consulta un planificador de rutas antes de salir.',
      'guide.c.weather': 'Clima y qué llevar',
      'guide.c.weather.lede': 'Cuatro estaciones muy distintas. Ten claro qué esperar y consulta la previsión oficial de cada región antes de salir.',
      'guide.c.access': 'Accesibilidad',
      'guide.c.access.lede': 'Qué dice la ley, qué ofrece el transporte y dónde comprobarlo antes de la visita.',
      'guide.c.before': 'Antes de viajar',
      'guide.c.before.lede': 'Trámites, dinero, permisos y los números que conviene saber.',

      'guide.i.air.t': 'Del aeropuerto al centro',
      'guide.i.air.u': 'minutos',
      'guide.i.air.x': 'UP Express une el aeropuerto Toronto Pearson con Union Station, en el centro de Toronto, en 28 minutos, con paradas en Weston, Mount Dennis y Bloor.',
      'guide.i.go.t': 'GO Transit, la red regional',
      'guide.i.go.x': 'Trenes y autobuses de Hamilton y Kitchener-Waterloo a Peterborough, y de Orangeville y Barrie a Niagara Falls. GO tiene servicio a Niagara Falls todo el año; consulta los horarios por obras en las vías.',
      'guide.i.via.t': 'Trenes interurbanos',
      'guide.i.via.u': 'km en tren',
      'guide.i.via.x': 'VIA Rail indica una ruta Toronto – Niagara Falls de 132 km, y el Maple Leaf de Amtrak sigue desde Toronto por Niagara Falls hasta Nueva York. Stratford tiene estación de VIA Rail: consulta los horarios vigentes en el sistema de reservas de VIA Rail antes de contar con ella.',
      'guide.i.ttc.t': 'Moverse por Toronto',
      'guide.i.ttc.x': 'La TTC acepta tarjetas PRESTO (físicas o en el monedero del móvil), billetes PRESTO, tarjetas de débito y crédito, y efectivo.',
      'guide.i.ferry.t': 'A las Toronto Islands',
      'guide.i.ferry.x': 'Los ferris salen de Jack Layton Ferry Terminal todo el año. De mediados de abril a mediados de octubre van a Centre Island, Hanlan’s Point y Ward’s Island; en invierno, solo a Ward’s Island.',
      'guide.i.parks.t': 'Parques y pueblos: piensa en coche',
      'guide.i.parks.x': 'La Highway 60 atraviesa Algonquin Provincial Park y está abierta todo el año; Ontario Parks indica que el parque tiene servicio de Parkbus. A Bruce Peninsula National Park se llega por la Highway 6 desde el sur, o en el ferry MS Chi-Cheemaun desde el norte en primavera, verano y otoño.',
      'guide.i.drive.t': 'Conducir como visitante',
      'guide.i.drive.u': 'meses',
      'guide.i.drive.x': '¿Visitas Ontario menos de 3 meses? Puedes conducir con un permiso de conducir válido de tu provincia, estado o país. Quienes llegan de otro país y se quedan más tiempo necesitan un Permiso Internacional de Conducir de su país.',
      'guide.i.roads.t': 'Estado de las carreteras',
      'guide.i.roads.u': 'Ontario 511',
      'guide.i.roads.x': 'Ontario 511 informa de incidentes, obras, estado de las carreteras y cortes en las autopistas provinciales: consulta 511on.ca antes de un trayecto largo.',

      'guide.normals.kicker': 'Toronto (City) · Normales climáticas 1991–2020',
      'guide.normals.t': 'Clima por estación',
      'guide.normals.range': 'Temperatura habitual',
      'guide.normals.legend': 'de la mínima media diaria del mes más frío a la máxima media diaria del mes más cálido',
      'guide.normals.current': 'Estación actual',
      'guide.normals.aria': 'Temperatura habitual: aproximadamente de {min} a {max} °C',
      'guide.normals.spring.k': 'Gran variación:',
      'guide.normals.spring.x': 'la máxima media pasa de {a} °C en marzo a {b} °C en mayo.',
      'guide.normals.hot.k': 'Días calurosos:',
      'guide.normals.hot.x': 'unos {n} por verano superan los 30 °C; superar los 35 °C es raro.',
      'guide.normals.autumn.k': 'Descenso marcado:',
      'guide.normals.autumn.x': 'la máxima media baja de {a} °C en septiembre a {b} °C en noviembre.',
      'guide.normals.cold.k': 'Días muy fríos:',
      'guide.normals.cold.x': 'unos {n} por invierno con mínimas por debajo de −10 °C; por debajo de −20 °C, 1 o 2.',
      'guide.normals.x': 'Promedios históricos, no récords: puede haber días más cálidos o más fríos. Los días calurosos y muy fríos son el número medio por estación. Toronto se utiliza como referencia climática: las condiciones pueden variar considerablemente en otras regiones de Ontario. Consulta el pronóstico oficial antes de viajar o salir.',
      'guide.normals.period': 'Datos: normales climáticas de Canadá 1991–2020 (promedio histórico) · página oficial actualizada el 10 de agosto de 2026.',
      'guide.i.forecast.t': 'La previsión oficial',
      'guide.i.forecast.x': 'Environment and Climate Change Canada publica previsiones y alertas meteorológicas las 24 horas para localidades de todo el país en weather.gc.ca.',
      'guide.i.pack.t': 'Qué llevar',
      'guide.i.pack.x': 'Todo el año: capas para un tiempo cambiante, un impermeable y calzado cómodo para caminar. En verano, añade protección solar, bañador y repelente de insectos; en invierno, abrigo, gorro, guantes y botas impermeables.',
      'guide.i.ticks.t': 'Garrapatas en parques y bosques',
      'guide.i.ticks.x': 'La garrapata de patas negras puede transmitir la enfermedad de Lyme. La probabilidad es baja, pero puede encontrarse una garrapata infectada casi en cualquier lugar de Ontario, sobre todo en primavera y verano. Viste ropa clara, usa un repelente con DEET o icaridina y revísate después de caminar.',
      'guide.i.winter.t': 'Conducir en invierno',
      'guide.i.winter.u': 'menos distancia de frenado',
      'guide.i.winter.x': 'El Gobierno de Ontario recomienda neumáticos de invierno, que pueden acortar la distancia de frenado hasta un 25%, consultar Ontario 511 antes de salir y llevar un kit de supervivencia invernal.',

      'guide.i.aoda.t': 'Una ley de accesibilidad',
      'guide.i.aoda.u': 'AODA',
      'guide.i.aoda.x': 'La Accessibility for Ontarians with Disabilities Act, 2005 establece un proceso para desarrollar y aplicar normas de accesibilidad. Su meta era un Ontario accesible el 1 de enero de 2025; la revisión legislativa de 2023 calificó ese objetivo de difícil de alcanzar.',
      'guide.i.transit.t': 'Transporte accesible',
      'guide.i.transit.x': 'GO Transit tiene trenes, autobuses y estaciones accesibles, con personal formado para ayudar. Toda la flota del metro de la TTC es accesible y más de la mitad de sus estaciones están adaptadas a sillas de ruedas y scooters. VIA Rail aconseja reservar con al menos 48 horas de antelación.',
      'guide.i.access2.t': 'Tarjeta Access 2',
      'guide.i.access2.u': 'lugares',
      'guide.i.access2.x': 'Con la tarjeta Access 2 de Easter Seals, la persona de apoyo del titular entra gratis en más de 500 teatros, atracciones y centros recreativos participantes de todo Canadá (el titular paga la entrada normal).',
      'guide.i.parks2.t': 'Parques nacionales',
      'guide.i.parks2.x': 'Parks Canada publica información de accesibilidad y visitas de acceso más fácil para Bruce Peninsula National Park.',
      'guide.i.check.t': 'Consulta cada lugar',
      'guide.i.check.x': 'La accesibilidad cambia de una atracción a otra. Antes de ir, lee la página de accesibilidad de la web oficial de cada experiencia que elijas.',

      'guide.i.eta.t': 'Entrar en Canadá',
      'guide.i.eta.u': 'eTA',
      'guide.i.eta.x': 'Según tu nacionalidad, tu documento de viaje y cómo llegues, puedes necesitar un visado o una autorización electrónica de viaje (eTA). Quienes están exentos de visado necesitan una eTA para volar a un aeropuerto canadiense o hacer escala en él, pero no para llegar en coche, autobús, tren o barco. Los ciudadanos de EE. UU. están exentos, igual que los residentes permanentes legales de EE. UU. que viajan con prueba de su estatus y un pasaporte válido. La eTA cuesta CAD $7. Comprueba el requisito oficial para tu situación antes de viajar.',
      'guide.i.money.t': 'Dinero e impuestos',
      'guide.i.money.u': 'HST',
      'guide.i.money.x': 'Los billetes de Canadá los emite el Bank of Canada. El impuesto armonizado sobre las ventas (HST) en Ontario es del 13%.',
      'guide.i.permits.t': 'Permisos y aparcamiento en parques',
      'guide.i.permits.x': 'Ontario Parks vende permisos diarios de vehículo para la mayoría de los parques hasta cinco días antes de la visita (Algonquin está entre los parques participantes). En Bruce Peninsula National Park hay que reservar aparcamiento para The Grotto del 1 de mayo al 31 de octubre.',
      'guide.i.age.t': 'Región vinícola',
      'guide.i.age.u': 'edad legal para beber',
      'guide.i.age.x': 'La edad legal para consumir alcohol en establecimientos con licencia en Ontario es 19 años. Para las catas, organiza un conductor designado o un tour.',
      'guide.i.emergency.t': 'Emergencias',
      'guide.i.emergency.u': 'policía · bomberos · ambulancia',
      'guide.i.emergency.x': 'Llama al 911 para policía, bomberos o ambulancia.',
      'guide.i.official.t': 'Información turística oficial',
      'guide.i.official.x': 'Destination Ontario es la principal organización de promoción turística de Ontario, una agencia del Gobierno de Ontario. Esta guía es un proyecto independiente, sin afiliación con ella.',

      'guide.dist.lines': 'Las líneas unen las regiones que Planifica tu viaje puede combinar en un mismo viaje: hasta 230 km en línea recta.',
      'guide.dist.label': 'Diagrama de las seis regiones de esta guía, situadas según sus coordenadas',
      'guide.dist.caption': 'Distancia en línea recta entre los centros de las regiones, en km',
      'guide.dist.far': 'Más de 230 km: nunca se combinan en un viaje',
      'guide.dist.note': 'Calculado a partir de las coordenadas de esta guía (distancia ortodrómica). No es una distancia por carretera ni un tiempo de viaje.',
      'guide.dist.cta': 'Planifica una ruta realista',

      'guide.next.title': '¿Todo listo?<br><em>Planifica tu viaje.</em>'
    }
  });

  const doc = document;
  const t = (k, v) => I18N.t(k, v);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name) => `<svg class="guide-item__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${ICONS[name]}"/></svg>`;

  function itemTemplate(chapter, it) {
    const base = `guide.i.${it.key}`;
    const src = it.advice
      ? `<p class="guide-item__src guide-item__src--advice">${esc(t('guide.advice'))}</p>`
      : `<p class="guide-item__src"><span>${esc(t(it.refs.length > 1 ? 'guide.sources' : 'guide.source'))}:</span> ${it.refs.map((r) => REFS.cite(r)).join(' · ')}</p>`;
    return `
      <article class="guide-item${it.fig ? ' guide-item--fig' : ''}">
        ${it.fig ? `<p class="guide-item__fig"><strong>${esc(it.fig)}</strong><span>${esc(t(`${base}.u`))}</span></p>` : icon(it.icon)}
        <h3 class="guide-item__title">${esc(t(`${base}.t`))}</h3>
        <p class="guide-item__text">${esc(t(`${base}.x`))}</p>
        ${src}
      </article>`;
  }

  function renderChapters() {
    doc.querySelectorAll('[data-guide-items]').forEach((box) => {
      const chapter = box.dataset.guideItems;
      box.innerHTML = CHAPTERS[chapter].map((it) => itemTemplate(chapter, it)).join('');
    });
    // Climate by season (typical ranges from the official monthly normals)
    const normals = doc.querySelector('[data-guide-normals]');
    if (normals) {
      const now = seasonOf(new Date().getMonth());
      const seasons = Object.keys(SEASON_MONTHS).map((s) => {
        const [lo, hi] = seasonRange(s);
        const more = seasonMore(s);
        const current = s === now;
        return `
          <div class="guide-season${current ? ' is-current' : ''}">
            <dt>
              <span class="guide-season__name">${esc(t(`season.${s}`))}</span>
              <span class="guide-season__months">${esc(t(`season.months.${s}`))}</span>
              ${current ? `<span class="guide-season__now">${esc(t('guide.normals.current'))}</span>` : ''}
            </dt>
            <dd class="guide-season__range" aria-label="${esc(t('guide.normals.aria', { min: deg(lo), max: deg(hi) }))}">
              <span class="guide-season__approx" aria-hidden="true">≈</span>${deg(lo)}<small>°</small><span class="guide-season__dash" aria-hidden="true">—</span>${deg(hi)}<small>°C</small>
            </dd>
            <dd class="guide-season__more"><strong>${esc(t(`guide.normals.${more.key}.k`))}</strong> ${esc(t(`guide.normals.${more.key}.x`, more.vars))}</dd>
          </div>`;
      }).join('');
      normals.innerHTML = `
        <p class="guide-normals__kicker">${esc(t('guide.normals.kicker'))}</p>
        <h3 class="guide-normals__title">${esc(t('guide.normals.t'))}</h3>
        <p class="guide-normals__legend"><span>${esc(t('guide.normals.range'))}</span> ${esc(t('guide.normals.legend'))}</p>
        <dl class="guide-normals__seasons">${seasons}</dl>
        <p class="guide-item__text">${esc(t('guide.normals.x'))}</p>
        <p class="guide-item__src"><span>${esc(t('guide.source'))}:</span> ${REFS.cite('eccc-normals')}<br>${esc(t('guide.normals.period'))}</p>`;
    }
  }

  /* ---------- Distances: diagram + matrix ---------- */
  const REGION_KEYS = Object.keys(DATA.regions);
  const regionKm = (a, b) => Math.round(DATA.km(DATA.regions[a], DATA.regions[b]));

  function renderDistances() {
    const svgBox = doc.querySelector('[data-guide-diagram]');
    const tableBox = doc.querySelector('[data-guide-matrix]');
    if (!svgBox || !tableBox) return;

    // Equirectangular projection of the region centres (enough at this scale)
    const W = 600;
    const H = 440;
    const lngMin = -82;
    const lngMax = -78;
    const latMin = 42.9;
    const latMax = 45.9;
    const kx = Math.cos(44.4 * Math.PI / 180);
    const scale = Math.min((W - 80) / ((lngMax - lngMin) * kx), (H - 80) / (latMax - latMin));
    const pos = (r) => {
      const g = DATA.regions[r];
      return { x: 40 + (g.lng - lngMin) * kx * scale, y: 40 + (latMax - g.lat) * scale };
    };

    const lines = [];
    REGION_KEYS.forEach((a, i) => REGION_KEYS.slice(i + 1).forEach((b) => {
      if (regionKm(a, b) <= MAX_HOP_KM) {
        const p = pos(a);
        const q = pos(b);
        lines.push(`<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}"/>`);
      }
    }));
    const LABEL_SIDE = { toronto: 'right', niagara: 'right', bruce: 'up', 'blue-mountains': 'right', algonquin: 'left', stratford: 'left' };
    const dots = REGION_KEYS.map((r) => {
      const p = pos(r);
      const side = LABEL_SIDE[r];
      const dx = side === 'right' ? 16 : side === 'left' ? -16 : 0;
      const dy = side === 'up' ? -18 : 5;
      const anchor = side === 'right' ? 'start' : side === 'left' ? 'end' : 'middle';
      const n = DATA.regions[r].count;
      return `<g class="guide-map__region">
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(6 + Math.sqrt(n) * 2.4).toFixed(1)}"/>
        <text x="${(p.x + dx).toFixed(1)}" y="${(p.y + dy).toFixed(1)}" text-anchor="${anchor}">${esc(t(DATA.regions[r].key))}</text>
      </g>`;
    }).join('');

    svgBox.innerHTML = `
      <svg class="guide-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('guide.dist.label'))}">
        <g class="guide-map__links">${lines.join('')}</g>
        ${dots}
        <text class="guide-map__n" x="${W - 24}" y="34" text-anchor="end">N ↑</text>
      </svg>
      <p class="guide-map__legend"><span class="guide-map__line" aria-hidden="true"></span>${esc(t('guide.dist.lines'))}</p>`;

    const head = REGION_KEYS.map((r) => `<th scope="col"><span>${esc(t(DATA.regions[r].key))}</span></th>`).join('');
    const rows = REGION_KEYS.map((a) => `
      <tr><th scope="row">${esc(t(DATA.regions[a].key))}</th>${REGION_KEYS.map((b) => {
        if (a === b) return '<td class="is-self" aria-label="—"><span aria-hidden="true">·</span></td>';
        const km = regionKm(a, b);
        const far = km > MAX_HOP_KM;
        return `<td class="${far ? 'is-far' : ''}"${far ? ` title="${esc(t('guide.dist.far'))}"` : ''}>${km}${far ? `<span class="sr-only"> — ${esc(t('guide.dist.far'))}</span>` : ''}</td>`;
      }).join('')}</tr>`).join('');

    tableBox.innerHTML = `
      <table class="guide-matrix">
        <caption>${esc(t('guide.dist.caption'))}</caption>
        <thead><tr><td></td>${head}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="guide-matrix__legend"><span class="guide-matrix__swatch" aria-hidden="true"></span>${esc(t('guide.dist.far'))}</p>
      <p class="guide-matrix__note">${esc(t('guide.dist.note'))}</p>`;
  }

  function render() {
    renderChapters();
    renderDistances();
  }

  doc.addEventListener('DOMContentLoaded', () => {
    if (!doc.querySelector('[data-guide]')) return;
    render();
    doc.addEventListener('languagechange', render);
  });
})();
