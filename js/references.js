/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   references.js — Sources of factual information (single list)

   Every fact on seasons.html and travel-guide.html points to one
   of these entries; credits.html lists them all in APA 7 style.
   Group "exp": facts and indicative admission prices of the world
   pages (price.* keys in js/worlds-i18n.js).
   All pages were consulted on 2026-09-28 (ACCESSED). "date" is
   the publication / last-modified date shown on the page, or
   null when the page shows none (→ "n.d." + retrieval date).
   Titles are kept exactly as published (English).
   ========================================================= */

(function () {
  'use strict';

  const ACCESSED = '2026-09-28';

  const REFS = {
    /* ---------- Transport ---------- */
    'upx':              { org: 'UP Express', title: 'UP Express | Pearson Airport to Downtown Toronto in 28 minutes', url: 'https://www.upexpress.com/', date: null, group: 'transport' },
    'go-about':         { org: 'GO Transit', title: 'What is GO?', url: 'https://www.gotransit.com/en/about-go/what-is-go', date: null, group: 'transport' },
    'go-niagara':       { org: 'GO Transit', title: 'Take GO Transit to Niagara Falls', url: 'https://www.gotransit.com/en/niagara', date: null, group: 'transport' },
    'via-niagara':      { org: 'VIA Rail Canada', title: 'Train from Toronto to Niagara Falls', url: 'https://www.viarail.ca/en/explore-our-destinations/trains/ontario-and-quebec/toronto-niagara-falls', date: null, group: 'transport' },
    'amtrak-ml':        { org: 'Amtrak', title: 'Maple Leaf', url: 'https://www.amtrak.com/maple-leaf-train', date: null, group: 'transport' },
    'via-stratford':    { org: 'VIA Rail Canada', title: 'Stratford train station', url: 'https://www.viarail.ca/en/explore-our-destinations/stations/ontario/stratford', date: null, group: 'transport' },
    'ttc-fares':        { org: 'Toronto Transit Commission', title: 'Fares and passes', url: 'https://www.ttc.ca/Fares-and-passes', date: null, group: 'transport' },
    'to-ferry':         { org: 'City of Toronto', title: 'Ferry Routes & Schedules', url: 'https://www.toronto.ca/explore-enjoy/toronto-island-ferries/ferry-routes-schedules/', date: null, group: 'transport' },
    'op-algonquin':     { org: 'Ontario Parks', title: 'Algonquin Provincial Park', url: 'https://www.ontarioparks.ca/park/algonquin', date: null, group: 'transport' },
    'foap-directions':  { org: 'The Friends of Algonquin Park', title: 'Directions to Algonquin Park', url: 'https://www.algonquinpark.on.ca/visit/general_park_info/directions-to-algonquin-park.php', date: null, group: 'transport' },
    'pc-bruce-directions': { org: 'Parks Canada', title: 'How to get here - Bruce Peninsula National Park', url: 'https://parks.canada.ca/pn-np/on/bruce/visit/directions', date: '2024-05-07', group: 'transport' },
    'on-drive':         { org: 'Government of Ontario', title: 'Drive in Ontario: visitors', url: 'https://www.ontario.ca/page/drive-ontario-visitors', date: '2021-05-14', group: 'transport' },
    'on-511':           { org: 'Ontario 511', title: 'Ontario 511', url: 'https://511on.ca/', date: null, group: 'transport' },

    /* ---------- Weather & health ---------- */
    'eccc-weather':     { org: 'Environment and Climate Change Canada', title: 'Weather Information', url: 'https://weather.gc.ca/', date: '2026-09-03', group: 'weather' },
    'eccc-normals':     { org: 'Environment and Climate Change Canada', title: '1991 to 2020 Canadian Climate Normals Data: Toronto (City)', url: 'https://climate.weather.gc.ca/climate_normals/results_1991_2020_e.html?searchType=stnName_1991&txtStationName_1991=Toronto&searchMethod=contains&txtCentralLatMin=0&txtCentralLatSec=0&txtCentralLongMin=0&txtCentralLongSec=0&climate_id=6158350&dispBack=0', date: '2026-08-10', group: 'weather' },
    'on-ticks':         { org: 'Government of Ontario', title: 'Tick-borne diseases', url: 'https://www.ontario.ca/page/lyme-disease', date: '2026-02-04', group: 'weather' },
    'on-winter':        { org: 'Government of Ontario', title: 'Winter driving', url: 'https://www.ontario.ca/page/winter-driving', date: '2022-12-29', group: 'weather' },

    /* ---------- Accessibility ---------- */
    'on-aoda':          { org: 'Government of Ontario', title: 'About accessibility laws', url: 'https://www.ontario.ca/page/about-accessibility-laws', date: '2026-03-23', group: 'access' },
    'on-aoda-review':   { org: 'Government of Ontario', title: '2023 Legislative Review of the Accessibility for Ontarians with Disabilities Act, 2005', url: 'https://www.ontario.ca/page/2023-legislative-review-accessibility-ontarians-disabilities-act-2005', date: '2023-06-30', group: 'access' },
    'go-access':        { org: 'GO Transit', title: 'Accessibility', url: 'https://www.gotransit.com/en/travelling-on-go/accessibility', date: null, group: 'access' },
    'via-access':       { org: 'VIA Rail Canada', title: 'Accessibility on board our trains', url: 'https://www.viarail.ca/en/plan/accessibility', date: null, group: 'access' },
    'ttc-access':       { org: 'Toronto Transit Commission', title: 'Easier access on the TTC', url: 'https://www.ttc.ca/accessibility/Easier-access-on-the-TTC', date: null, group: 'access' },
    'pc-bruce-access':  { org: 'Parks Canada', title: 'Accessibility and easier access visits - Bruce Peninsula National Park', url: 'https://parks.canada.ca/pn-np/on/bruce/visit/accessible', date: '2026-08-18', group: 'access' },
    'es-access2':       { org: 'Easter Seals Canada', title: 'Access 2 Card Program', url: 'https://easterseals.ca/en/access-2-card-program/', date: null, group: 'access' },

    /* ---------- Before you go ---------- */
    'ircc-eta':         { org: 'Immigration, Refugees and Citizenship Canada', title: 'Find out about electronic travel authorization (eTA)', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/facts.html', date: '2024-04-23', group: 'before' },
    'ircc-eta-fee':     { org: 'Immigration, Refugees and Citizenship Canada', title: 'Electronic travel authorization', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html', date: '2026-06-05', group: 'before' },
    'cra-hst':          { org: 'Canada Revenue Agency', title: 'GST/HST calculator (and rates)', url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html', date: '2025-04-01', group: 'before' },
    'boc-notes':        { org: 'Bank of Canada', title: 'Bank notes', url: 'https://www.bankofcanada.ca/banknotes/', date: null, group: 'before' },
    'op-permit':        { org: 'Ontario Parks', title: 'Get a Permit', url: 'https://www.ontarioparks.ca/dayuse/getapermit', date: null, group: 'before' },
    'pc-grotto':        { org: 'Parks Canada', title: 'Planning your trip to the Grotto & Cyprus Lake area, Halfway Log Dump or Little Cove - Bruce Peninsula National Park', url: 'https://parks.canada.ca/pn-np/on/bruce/activ/emplacements-locations/parking', date: '2026-09-02', group: 'before' },
    'agco-age':         { org: 'Alcohol and Gaming Commission of Ontario', title: 'Legal drinking age and photo identification (ID)', url: 'https://www.agco.ca/en/alcohol/information-sheet-legal-drinking-age-and-photo-id', date: null, group: 'before' },
    'pc-emergency':     { org: 'Parks Canada', title: 'Emergency contacts', url: 'https://parks.canada.ca/voyage-travel/securite-safety/urgence-emergency', date: '2026-09-24', group: 'before' },
    'do-who':           { org: 'Destination Ontario', title: 'Who we are', url: 'https://www.destinationontario.com/en-ca/corporate/who-we-are', date: '2026-08-17', group: 'before' },

    /* ---------- Seasons ---------- */
    'np-cruise':        { org: 'Niagara Parks', title: 'Niagara City Cruises | Niagara Falls Boat Tour', url: 'https://www.niagaraparks.com/visit/attractions/hornblower-niagara-cruises/', date: null, group: 'seasons' },
    'np-butterfly':     { org: 'Niagara Parks', title: 'Butterfly Conservatory | Niagara Falls', url: 'https://www.niagaraparks.com/visit/attractions/butterfly-conservatory/', date: null, group: 'seasons' },
    'treetop':          { org: 'Treetop Trekking', title: 'Barrie - Infos', url: 'https://treetoptrekking.com/parks/barrie/infos', date: null, group: 'seasons' },
    'cw-opening':       { org: 'Canada’s Wonderland', title: 'Opening Day', url: 'https://www.sixflags.com/canadaswonderland/events/opening-day', date: null, group: 'seasons' },
    'cw-haunt':         { org: 'Canada’s Wonderland', title: 'Halloween Haunt', url: 'https://www.sixflags.com/canadaswonderland/events/haunt', date: null, group: 'seasons' },
    'sbp-sauble':       { org: 'Town of South Bruce Peninsula', title: 'Sauble Beach', url: 'https://www.southbrucepeninsula.com/en/explore-and-play/sauble-beach.aspx', date: '2026-09-11', group: 'seasons' },
    'caves-warm':       { org: 'Scenic Caves Nature Adventures', title: '2026 Warm Season Pass', url: 'https://sceniccaves.com/products/warm-season-pass', date: null, group: 'seasons' },
    'caves-nordic':     { org: 'Scenic Caves Nature Adventures', title: 'Nordic Centre', url: 'https://sceniccaves.com/pages/nordic-centre', date: null, group: 'seasons' },
    'bm-home':          { org: 'Blue Mountain Resort', title: 'Ontario’s Winter & Summer Destination', url: 'https://www.bluemountain.ca/en', date: null, group: 'seasons' },
    'op-blog-colours':  { org: 'Ontario Parks', title: 'Fall colours at Algonquin Provincial Park', url: 'https://blog.ontarioparks.ca/fall-colours-at-algonquin-provincial-park/', date: '2026-09-01', group: 'seasons' },
    'op-fallcolour':    { org: 'Ontario Parks', title: 'Fall Colours at Ontario Parks', url: 'https://www.ontarioparks.ca/fallcolour', date: null, group: 'seasons' },
    'wco-harvest':      { org: 'Wine Country Ontario', title: 'Grape & Wine Discovery Pass', url: 'https://winecountryontario.ca/events/grape-wine-discovery-pass-4/', date: null, group: 'seasons' },
    'wco-icewine':      { org: 'Wine Country Ontario', title: 'Icewine', url: 'https://winecountryontario.ca/icewine/', date: null, group: 'seasons' },
    'ngwf-icewine':     { org: 'Niagara Grape & Wine Festival', title: 'Icewine Festival', url: 'https://niagarawinefestival.com/icewine-series-events', date: null, group: 'seasons' },
    'nft-wfol':         { org: 'Niagara Falls Tourism', title: 'Winter Festival of Lights', url: 'https://www.niagarafallstourism.com/WFOL/', date: null, group: 'seasons' },
    'distillery-wv':    { org: 'The Distillery Historic District', title: 'Winter Village Vendors', url: 'https://www.thedistillerydistrict.com/wintervillagevendors/', date: null, group: 'seasons' },
    'cw-winterfest':    { org: 'Canada’s Wonderland', title: 'WinterFest', url: 'https://www.sixflags.com/canadaswonderland/events/winterfest', date: null, group: 'seasons' },
    'horseshoe-home':   { org: 'Horseshoe Valley Resort', title: '4 Seasons of Adventure in Barrie, Ontario', url: 'https://www.horseshoeresort.com/', date: null, group: 'seasons' },

    /* ---------- Experiences: facts and indicative admission ---------- */
    'to-ferry-fares':   { org: 'City of Toronto', title: 'Ferry Ticket & Passenger Information', url: 'https://www.toronto.ca/explore-enjoy/toronto-island-ferries/ferry-ticket-passenger-information/', date: null, group: 'exp' },
    'op-dayuse-fees':   { org: 'Ontario Parks', title: 'Day Use Fees - 2026', url: 'https://www.ontarioparks.ca/fees/dayuse/2026', date: null, group: 'exp' },
    'foap-fees':        { org: 'The Friends of Algonquin Park', title: 'Day Use Fees', url: 'https://www.algonquinpark.on.ca/visit/general_park_info/fees-day-use.php', date: null, group: 'exp' },
    'pc-bruce-fees':    { org: 'Parks Canada', title: 'Fees - Bruce Peninsula National Park', url: 'https://parks.canada.ca/pn-np/on/bruce/visit/tarifs-fees', date: '2025-12-05', group: 'exp' },
    'caves-fees':       { org: 'Scenic Caves Nature Adventures', title: 'Warm Season', url: 'https://sceniccaves.com/collections/warm-seasons', date: null, group: 'exp' },
    'cn-history':       { org: 'CN Tower', title: 'History', url: 'https://www.cntower.ca/history', date: null, group: 'exp' },
    'cn-tickets':       { org: 'CN Tower', title: 'Tickets and hours', url: 'https://www.cntower.ca/plan-your-visit/tickets-and-hours/tickets', date: null, group: 'exp' },
    'casaloma-visit':   { org: 'Casa Loma', title: 'Plan Your Visit', url: 'https://casaloma.ca/plan-your-visit-2/', date: null, group: 'exp' },
    'rom-about':        { org: 'Royal Ontario Museum', title: 'About ROM', url: 'https://www.rom.on.ca/about-rom', date: null, group: 'exp' },
    'hhof-tickets':     { org: 'Hockey Hall of Fame', title: 'Tickets & Hours', url: 'https://www.hhof.com/visit/ticketsandhours.html', date: null, group: 'exp' },
    'stratford-choc':   { org: 'Destination Stratford', title: 'The Chocolate Trail Burns Calories. Good Thing.', url: 'https://www.visitstratford.ca/chocolatetrail/', date: null, group: 'exp' },
    'cw-leviathan':     { org: 'Canada’s Wonderland', title: 'Leviathan', url: 'https://www.sixflags.com/canadaswonderland/attractions/leviathan', date: null, group: 'exp' },
    'treetop-rates':    { org: 'Treetop Trekking', title: 'Pricing', url: 'https://www.treetoptrekking.com/rates', date: null, group: 'exp' }
  };

  const MONTHS = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function dateParts(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return { y, m: m - 1, d };
  }

  // APA 7 — web page by an organisation (author = site name, so the
  // site name is not repeated). With no date: (n.d.) + retrieval date.
  function apa(id, lang) {
    const r = REFS[id];
    if (!r) return '';
    lang = lang === 'es' ? 'es' : 'en';
    const acc = dateParts(ACCESSED);
    let date;
    if (r.date) {
      const p = dateParts(r.date);
      date = lang === 'es' ? `(${p.y}, ${p.d} de ${MONTHS.es[p.m]})` : `(${p.y}, ${MONTHS.en[p.m]} ${p.d})`;
    } else {
      date = lang === 'es' ? '(s. f.)' : '(n.d.)';
    }
    const link = `<a href="${r.url}" target="_blank" rel="noopener">${esc(r.url)}</a>`;
    const retrieved = r.date ? '' : (lang === 'es'
      ? `Recuperado el ${acc.d} de ${MONTHS.es[acc.m]} de ${acc.y}, de `
      : `Retrieved ${MONTHS.en[acc.m]} ${acc.d}, ${acc.y}, from `);
    return `${esc(r.org)}. ${date}. <i>${esc(r.title)}</i>. ${retrieved}${link}`;
  }

  // Short inline citation used next to a fact: "Source: Org — Title"
  function cite(id) {
    const r = REFS[id];
    return r ? `<a href="${r.url}" target="_blank" rel="noopener">${esc(r.org)} — ${esc(r.title)}</a>` : '';
  }

  window.OTE_REFS = { list: REFS, apa, cite, accessed: ACCESSED };
})();
