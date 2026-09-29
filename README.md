# Ontario Tourism Experiences · Experiencias Turísticas de Ontario

Bilingual (EN | ES) multimedia tourism guide to 24 curated experiences in Ontario, Canada.
Static site: HTML5 + CSS3 + vanilla JavaScript. Designed for GitHub Pages.

**Current stage:** 12 pages — Home, the four world pages (24 experiences), Find Your Ontario
(quiz), Explore Map, Plan Your Trip, Ontario by Season, My Favourites, Travel Guide and
Credits & References. Desktop only (≥ 1280px).

Each page answers one question: the worlds say **what** each place is · the quiz says **which**
experience fits you · the map says **where** · seasons say **when** · the planner says **how** to
combine them · favourites let you **remember** them · the travel guide covers **what to know
before you go** · credits say **where everything comes from**.

## Structure

```
index.html            Home
nature.html           World 01 · Nature     (#water-beaches, #parks-landscapes)
culture.html          World 02 · Culture    (#landmarks, #museums-art)
food.html             World 03 · Flavours   (#markets, #local-flavours)
entertainment.html    World 04 · Adventure  (#family-attractions, #seasonal-adventure)
find-your-ontario.html  Find Your Ontario: 7-question quiz → 1 recommendation + 2 alternatives
map.html              Explore Map: Leaflet + Canada Basemap (NRCan), list + map, filters, shareable URLs
plan-your-trip.html   Plan Your Trip: 5 choices → day-by-day itinerary grouped by region
seasons.html          Ontario by Season: 4 seasons, recommended experiences, verified facts, year matrix
favourites.html       My Favourites: experiences saved with ♡ (localStorage), plan / map them
travel-guide.html     Travel Guide: getting around, distances, weather, accessibility, before you go
credits.html          Credits & References: photos (TASL), sources (APA 7), map, software, AI
css/style.css         Design system (tokens at the top) · world pages 16 · quiz 18 · map 19 ·
                      shared planning components 20 · planner 21 · seasons 22 · favourites 23 ·
                      travel guide 24 · credits 25
js/language.js        Translations (EN/ES) + language engine + localStorage
js/worlds-i18n.js     Texts of the four world pages (EN/ES), plugged in with OTE_I18N.extend()
js/experiences.js     The 24 experiences as data (category, region, anchor, coordinates,
                      photos, quiz traits, seasonal affinity, suggested time) — single source
                      for the quiz, the map, the planner, seasons and favourites
js/quiz.js            Quiz questions, scoring and interface (+ its EN/ES texts)
js/map.js             Map, filters, list, card and URL state (+ its EN/ES texts)
js/favourites.js      Favourites storage + reusable ♡ button + notification (every page)
js/cards.js           Compact experience card (seasons, favourites)
js/plan.js            Planner engine (deterministic) + interface (+ its EN/ES texts)
js/seasons.js         Ontario by Season (+ its EN/ES texts and verified seasonal facts)
js/favourites-page.js My Favourites page
js/references.js      Every factual source (org, title, URL, date) + APA 7 formatter
js/guide.js           Travel Guide chapters, distance diagram and matrix (+ EN/ES texts)
js/credits.js         Credits page: photo list, references, map/software/AI (+ EN/ES texts)
js/main.js            Shared header/footer + interactions (reveal, counters, navbar…)
images/home/          Home photography (also reused on the world pages)
images/nature|culture|flavours|adventure/   World page photography
images/thumbs/        640px copies of the 24 experience photos (map card, quiz alternatives)
```

## How to…

- **Change colours / fonts:** edit the `:root` tokens in `css/style.css`.
- **Edit or fix a translation:** edit `TRANSLATIONS.en` / `TRANSLATIONS.es` in `js/language.js`.
- **Translate a new element:** add `data-i18n="my.key"` (text), `data-i18n-html` (text with `<br>`/`<em>`)
  or `data-i18n-attr="alt:my.key|aria-label:other.key"`, then add the key in both languages.
- **Change the navigation:** edit `HOME_ITEM`, `NAV_MENUS`, `QUIZ_ITEM`, `CREDITS_ITEM` in `js/main.js` (updates every page).
- **Add a page:** copy the `<head>` of `index.html`, keep the `data-component` slots for header and
  footer, and set `data-page`, `data-page-title` (and `data-section` for subsection pages) on `<body>`.
  Use `data-nav="transparent"` only on pages that start with a full-screen hero.
- **Force a language by link:** `index.html?lang=es`.
- **Publish a new page:** create the file, then set `ready: true` for it in `PAGES` (top of `js/main.js`).
  Until then links to it look normal but do not navigate: a click shows a small "Coming soon /
  Próximamente" notice instead of a 404. On GitHub Pages, existing files are also detected and
  connected automatically.
- **Four Worlds secondary photos:** `.world__shot` figures inside each `.world`; position and size
  are set per photo with `--x`, `--y`/`--b`, `--w`, `--ar` in `css/style.css` (section 08).
- **World pages:** every page follows hero → intro → two collections (3 experiences each) →
  next world. Each experience is an `<article class="exp exp--…">` with an anchor `id`; mix the
  layouts `--a`, `--a-flip`, `--b`, `--b-flip`, `--c`, `--c-flip` (described in `css/style.css`,
  section 16). Texts live in `js/worlds-i18n.js` (`exp.<name>.text`, `exp.<name>.why`…).
- **Photographic rhythm (world pages):** after the intro, `.film` shows the six experiences; each
  collection opens with a full-bleed photo (`.collection__media`); `exp--pano` and `exp--cine` are the
  wide / cinematic layouts; a `.world__shot` inside an `.exp` adds a secondary detail photo.
  Home: `.bleed` is the full-bleed photo bridge between Nature and Culture.
- **Motion system:** `.reveal` (text), `.reveal--title` (titles), `[data-stagger]` (groups),
  `.reveal-img` (images), `[data-depth]` (soft parallax), `[data-scrub]` (full-bleed image).
  All of it respects `prefers-reduced-motion` (fades only, no movement).
- **Edit an experience (name, place, coordinates, photo):** `js/experiences.js`. Its description
  and "why go" text stay in `js/worlds-i18n.js` (`exp.<id>.text`, `exp.<id>.why`).
- **Tune the quiz:** answer weights are in `QUESTIONS` (`js/quiz.js`); each experience's affinity
  (0–3 per trait) is `traits` in `js/experiences.js`. The score is the cosine similarity between
  the traveller's profile (sum of the chosen answers) and each experience's profile; a season the
  experience does not suit multiplies it by 0.8. Ties go to the lower number (01–24), so the same
  answers always give the same result. `window.OTE_QUIZ.rank(answers)` can be used from the console
  to check a combination.
- **Map links:** `map.html?region=toronto|niagara|bruce|blue-mountains|algonquin|stratford`,
  `map.html?category=nature|culture|flavours|adventure` (also `food`, `entertainment`),
  `map.html?experience=algonquin` (short id from `js/experiences.js` or the page anchor, e.g.
  `algonquin-provincial-park`). Parameters can be combined; the URL follows the filters, so any
  state can be shared. The quiz adds `&from=quiz` to show the "Your Ontario" badge.
- **Map tiles:** Canada Basemap – Transportation (CBMT) from Natural Resources Canada, EPSG:3857
  cached tiles (`CBMT_CBCT_GEOM_3857` geometry + `CBMT_TXT_3857` English labels), free and without
  key under the Open Government Licence – Canada (attribution required, kept in the map and the
  footer). Standard OpenStreetMap tiles are not used: their policy requires a valid Referer, which
  pages opened from disk (`file://`) do not send, so they answer 403. Softened with a CSS filter in
  `css/style.css` (section 19). Leaflet 1.9.4 is loaded from unpkg with an integrity hash. Without
  a connection the list, filters and card keep working and a notice replaces the map.
- **Thumbnails:** `images/thumbs/<id>.webp` are 640px WebP copies of the photos listed in
  `js/experiences.js` (same authors and licences as the originals below).
- **Navigation:** the bar shows Home, an **Explore** menu (the four worlds + Explore Map), a
  **Plan** menu (Plan Your Trip · Ontario by Season · Travel Guide) — both in `NAV_MENUS`,
  `js/main.js` — Find Your Ontario, Credits and a ♡ with the number of saved experiences. The
  footer groups Explore · Discover · Info · Plan.
- **Favourites:** `localStorage["ote-favourites"]` = list of short ids, newest first. Any element
  with `data-fav="<id>"` is a toggle; `OTE_FAV.button(experience)` renders the ♡ button. Changes
  fire `favouriteschange` and sync other open tabs. World pages get their buttons automatically.
- **Plan Your Trip:** the whole method is documented at the top of `js/plan.js` (scoring, regions,
  days, blocks). Rules: each day stays in one region; regions are combined only if their centres
  are ≤ 230 km apart in a straight line (150 km for 2 days); a change of base takes the morning;
  morning / midday / afternoon blocks instead of invented timetables. URL:
  `plan-your-trip.html?days=3&with=couple&interests=nature,flavours&region=all&season=autumn`
  (`&favs=1` = prioritise favourites; `?season=winter` alone pre-selects the season).
  Console check: `OTE_PLAN.plan({ days: 3, company: 'couple', interests: ['nature'], region: 'all', season: 'autumn' })`.
- **Seasons:** each experience has `seasons` (0–3 per season) and `why` (reason code) in
  `js/experiences.js`; texts `season.why.<code>` in `js/seasons.js`. These are editorial
  recommendations; verified facts ("Good to know") point to `js/references.js`.
  `seasons.html?season=winter` opens a season (default: the current one).
- **Map selections:** `map.html?experiences=cntower,rom,stlawrence&from=trip|favourites|season`
  shows only those experiences (filters work inside the selection; "Show all 24" clears it).
- **Experience layouts and spacing:** consecutive experiences alternate the side of the text
  (e.g. Adventure: Wonderland text right · Ripley's left · Zoo right). Full-bleed layouts
  (`--pano`, `--cine`, `--wide`) are the intentional exceptions; `--cine` keeps its text on the
  left because the gradient and the photos are composed for it. The space between text and photos
  is one token, `--exp-air` on `.exp` (`clamp(48px, 4vw, 72px)`): side padding of the `--pano`
  panels, clearance above detail photos in `--b`/`--c` layouts, gap before the `--wide` side photo.
- **Travel Guide climate by season:** `NORMALS` in `js/guide.js` holds official monthly values of
  ECCC, Canadian Climate Normals 1991–2020, station TORONTO (CITY), Climate ID 6158350 ("Daily
  Minimum", "Daily Maximum", "Days with Maximum Temperature > 30 / > 35 °C", "Days with Minimum
  Temperature < −10 / < −20 °C"). Typical temperature of a season = from the Daily Minimum of its
  coldest month to the Daily Maximum of its warmest month (spring ≈ −2–19 °C, summer ≈ 15–27 °C,
  fall ≈ 2–22 °C, winter ≈ −7–3 °C). Second line: summer ≈ 12 days above 30 °C (sum Jun–Aug),
  winter ≈ 20 days with lows below −10 °C (sum Dec–Feb); spring / fall: change of the average
  high between the first and last month. Records are not used. The device date
  (`new Date().getMonth()`) only chooses which season is marked "Current season"; no weather
  service is queried. Toronto is a reference, not the climate of all of Ontario.
- **Seasons "Possible*":** `alt` in the `SEASONS` table of `js/experiences.js` marks a season in which
  the usual experience is closed or different but the place offers something else (Wonderland in
  winter: WinterFest; Treetop Trekking in winter: closed, Horseshoe Valley Resort winter activities).
  Display only: the matrix shows ○* with a sourced note; the affinity stays 0, so the planner still
  leaves them out of winter trips.
- **Sources:** add or correct a factual source in `js/references.js` (it feeds the inline
  citations and the APA list on `credits.html`). All sources were consulted on 2026-09-28.

## Photo credits

All images from Wikimedia Commons, resized and converted to WebP for the web.
Each page also lists its own photo credits in the footer, and `credits.html` lists them all
(same data as below, in `js/credits.js`). The five planning pages reuse these photographs:
no new images were added for them.

### Home (`images/home/`, several reused on the world pages)

| File | Author | Licence | Source |
|---|---|---|---|
| hero-algonquin-autumn.webp | Tony Webster | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Fall_Colors_at_Algonquin_Provincial_Park,_Canada_-_Autumn_on_Lake_of_Two_Rivers_(29648245373).jpg) |
| map-bruce-peninsula.webp | The Cosmonaut | CC BY-SA 2.5 CA | [Commons](https://commons.wikimedia.org/wiki/File:Bruce_Peninsula_National_Park_cliffs.jpg) |
| nature-niagara-falls.webp | Thomaswm | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_Canadian_Falls_(Horseshoe_Falls)_and_the_Hornblower_Niagara_Cruises_boat;_Niagara_Falls.JPG) |
| culture-toronto-skyline.webp | Jchmrt | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg) |
| flavours-st-lawrence-market.webp | Alexandre Moreau | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:St_Lawrence_Market_Toronto_2010.jpg) |
| adventure-blue-mountain.webp | Makeworldpedia | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Blue_Mountain_Ontario_at_night_(landscape).jpg) |
| quiz-ragged-lake.webp | Wllewis | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Ragged_Lake_mirror.jpg) |
| nature-sauble-beach.webp (Sauble Beach) | Peter K Burian | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Sauble_Beach,_Ontario_(Lake_Huron).jpg) |
| nature-scenic-caves.webp (Scenic Caves Nature Adventures) | Jasonrocca1 | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Scenic_caves_Collingwood.jpg) |
| nature-algonquin-canoe-lake.webp (Algonquin Provincial Park) | Sarthkr | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Algonquin_Canoe_Lake.jpg) |
| culture-nathan-phillips-square.webp (Nathan Phillips Square) | Kevin Mullarkey | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Nathan_Philips_Square_Toronto.jpg) |
| culture-casa-loma.webp (Casa Loma) | Bintyamin20248 | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Casa_Loma_Toronto,_Canada.jpg) |
| culture-royal-ontario-museum.webp (Royal Ontario Museum) | Maksim Sokolov (Maxergon) | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Royal_Ontario_Museum_in_Fall_2021.jpg) |
| flavours-distillery-district.webp (Distillery Historic District) | Chicken4War | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Distillery_District,_looking_northeast_2026.jpg) |
| flavours-kensington-market.webp (Kensington Market) | Arild Vågen | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Kensington_Market_Toronto_August_2017_04.jpg) |
| flavours-niagara-wine-country.webp (Niagara Wine Country) | Hannah Clover | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Grapevines_in_Niagara-on-the-Lake.jpg) |
| adventure-ripleys-aquarium.webp (Ripley's Aquarium of Canada) | RipleysAquaCA | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Dangerous_Lagoon_-_Sharks-9.jpg) |
| adventure-butterfly-conservatory.webp (Niagara Parks Butterfly Conservatory) | The Cosmonaut | CC BY-SA 2.5 CA | [Commons](https://commons.wikimedia.org/wiki/File:Morpho_peleides_Niagara_Parks_Butterfly_Conservatory.jpg) |
| adventure-canadas-wonderland.webp (Canada's Wonderland) | Jeremy Thompson | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Leviathan_descending_hill.jpg) |

### World pages

| File | Experience | Author | Licence | Source |
|---|---|---|---|---|
| nature/hero-indian-head-cove.webp | Nature hero (Bruce Peninsula NP) | Jaimie Snelgrove | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_Head_Cove,_Bruce_National_Park,_May_2018.jpg) |
| nature/toronto-islands.webp | Toronto Islands | Josh Evnin | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Centre_Island_Beach_Toronto_2010.jpg) |
| culture/hero-toronto-skyline-night.webp | Culture hero | Allen McGregor | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Toronto_Skyline_from_Polson_Pier_(5461949752).jpg) |
| culture/cn-tower.webp | CN Tower | Scott Webb | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:CN_Tower,_Toronto,_Canada_(Unsplash_DJ_kOgH5u0o).jpg) |
| culture/art-gallery-of-ontario.webp | Art Gallery of Ontario | Jeff Hitchcock | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Art_Gallery_of_Ontario_(38661357472).jpg) |
| culture/hockey-hall-of-fame.webp | Hockey Hall of Fame | Adam Bishop | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Hockey_Hall_of_Fame_summer_2022.jpg) |
| flavours/hero-st-lawrence-market.webp | Flavours hero (St. Lawrence Market) | stu_spivack | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:St._Lawrence_Market_interior.jpg) |
| flavours/stratford-chocolate-trail.webp | Stratford Chocolate Trail (Chocolate Barr's Candies) | Chris Woodrich | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Chocolate_Barr%27s_Candies,_Stratford,_Ontario,_2025-08-04_03.jpg) |
| flavours/apple-pie-trail.webp | Apple Pie Trail (apple harvest, Clarksburg, 1983) | Archives of Ontario, I0004608 | Open Government Licence – Ontario | [Commons](https://commons.wikimedia.org/wiki/File:Men_picking_apples,_Georgian_triangle_apples,_Clarksburg_(I0004608).jpg) |
| adventure/hero-blue-mountain-village.webp | Adventure hero (Blue Mountain) | Andrew Skujins | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Blue_Mountain_Resort_-_Summer_view.jpg) |
| adventure/toronto-zoo.webp | Toronto Zoo | ImagePerson | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Orangutan_Toronto_Zoo_2292.jpg) |
| adventure/treetop-trekking-horseshoe.webp | Treetop Trekking (Horseshoe Resort entrance) | P199 | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Horseshoe_Resort_2.JPG) |
| home/bridge-toronto-islands-ferry.webp | Home photo bridge (Toronto Islands ferry) | Lord of the Wings | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Toronto_Skyline_from_Ward%27s_Island_Ferry_(19745155876).jpg) |
| home/culture-cn-tower-vertical.webp | CN Tower (Home, Culture) | Wladyslaw | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Toronto_-_ON_-_Toronto_Harbourfront7.jpg) |
| nature/opener-niagara-panorama.webp | Water & Beaches opener (Niagara Falls) | Robert F. Tobler | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Niagara_Falls_USA_Canada_from_Skylon_Tower_on_2002-05-28,_full_size.jpg) |
| nature/opener-algonquin-sunset.webp | Parks & Landscapes opener (Algonquin) | Maksim Sokolov | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Sunset_in_Algolquin_Provincial_Park.jpg) |
| nature/algonquin-autumn-lake.webp | Algonquin Provincial Park | Maksim Sokolov | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:A_small_lake_in_Algonquin_Provincial_Park.jpg) |
| nature/bruce-peninsula-cliffs.webp | Bruce Peninsula National Park | The Cosmonaut | CC BY-SA 2.5 CA | [Commons](https://commons.wikimedia.org/wiki/File:Bruce_Peninsula_National_Park_cliffs.jpg) |
| nature/scenic-caves-bridge.webp | Scenic Caves (suspension bridge) | Niels Elgaard Larsen | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:ScenicCaveBridgeOn.jpg) |
| culture/opener-toronto-skyline.webp | Landmarks opener | Benson Kua | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Toronto_on_a_summer_day.jpg) |
| culture/nathan-phillips-square-panorama.webp | Nathan Phillips Square | Paolo Costa Baldi | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Nathan_Phillips_square_-_Toronto.jpg) |
| culture/casa-loma-great-hall.webp | Casa Loma (Great Hall) | Dillan Payne | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Great_Hall_of_Casa_Loma,_September_27_2025_(02).jpg) |
| culture/opener-rom-dinosaurs.webp | Museums & Art opener (ROM) | KristyVan | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Barosaurus,_Royal_Ontario_Museum,_side.jpg) |
| culture/rom-crystal-staircase.webp | Royal Ontario Museum (Crystal staircase) | Maksim Sokolov | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Staircase_of_the_Michael_Lee-Chin_Crystal.jpg) |
| flavours/opener-st-lawrence-south-market.webp | Markets opener (St. Lawrence Market) | Canmenwalker | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:St._Lawrence_Market_South_Interior_2021.jpg) |
| flavours/peameal-bacon-sandwich.webp | St. Lawrence Market (Carousel Bakery) | Leventio | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Peameal_bacon_sandwich.jpg) |
| flavours/distillery-district-wide.webp | Distillery Historic District | Chicken4War | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Distillery_District,_looking_northeast_2026.jpg) |
| flavours/opener-niagara-grapes.webp | Local Flavours opener (Niagara-on-the-Lake) | Graham | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Wikivoyage_banner_wines_of_ontario_3.jpg) |
| flavours/niagara-vineyard.webp | Niagara Wine Country | M Readey | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Wine_Grapes_in_the_Niagara_Peninsula.jpg) |
| flavours/icewine-grapes-inniskillin.webp | Niagara Wine Country (Inniskillin) | James G. Milles | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Icewine_grapes,_Inniskillin_Winery,_Niagara_on_the_Lake_(2772415951).jpg) |
| flavours/rheo-thompson-candies.webp | Stratford Chocolate Trail | Chris Woodrich | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Rheo_Thompson_Candies,_Stratford,_Ontario,_2025-08-04.jpg) |
| adventure/opener-leviathan-riders.webp | Family Attractions opener (Canada's Wonderland) | GolhaMedia | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Canada_Wonderland_rollercoaster_2015.jpg) |
| adventure/ripleys-jellyfish.webp | Ripley's Aquarium of Canada | Gzzz | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Chrysaora_fuscescens_Ripley%27s_Aquarium_of_Canada_1.JPG) |
| adventure/toronto-zoo-entrance.webp | Toronto Zoo | JasonParis | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Toronto_Zoo_(Scarborough_-_Rouge)_(5530655023).jpg) |
| adventure/opener-blue-mountain-view.webp | Seasonal & Outdoor opener (Blue Mountain) | XeresNelro | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:View_From_Blue_Mountain_4.jpg) |
| adventure/blue-mountain-night.webp | Blue Mountain Resort | Makeworldpedia | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Blue_Mountain_Ontario_at_night_(landscape).jpg) |
| adventure/blue-mountain-ridge-runner.webp | Blue Mountain Resort (Ridge Runner) | Chicken4War | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Blue_Mountain_Ridge_Runner,_2026.jpg) |
| home/region-stratford-avon.webp | Six regions band (Stratford, Avon River) | Ken Lund | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Bridge,_Avon_River,_Stratford,_Ontario_(21651644568).jpg) |
| flavours/intro-st-lawrence-peameal.webp | Flavours intro (St. Lawrence Market) | Mack Male | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:St._Lawrence_Market_(6037463892).jpg) |
| adventure/intro-ripleys-kelp.webp | Adventure intro (Ripley's Aquarium) | Ken Lund | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Ripley%27s_Aquarium_of_Canada,_Toronto,_Ontario_(29709376480).jpg) |
| home/bridge-leviathan-climb.webp | Home photo bridge Flavours → Adventure (Leviathan) | Jason Zhang | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Leviathan_ascending_(2).jpg) |
| nature/niagara-horseshoe-canadian-side.webp | Niagara Falls (Ontario side) | Yinan Chen | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Gfp-canada-niagara-falls-fury-of-the-falls.jpg) |
| culture/cn-tower-pod.webp | CN Tower (main pod) | Wladyslaw | CC BY 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Toronto_-_ON_-_CN_Tower_Turmkorb.jpg) |
| flavours/kensington-market-street.webp | Kensington Market (street panorama) | Arild Vågen | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Kensington_Market_Toronto_August_2017_01.jpg) |
| adventure/wonderland-drop-tower.webp | Canada's Wonderland (Drop Tower) | K2HWY | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Drop_Tower_in_Canada%27s_Wonderland.jpg) |
| adventure/horseshoe-resort-hill.webp | Treetop Trekking (Horseshoe Resort hill) | Misskatewiki | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Horseshoe_Resort_Hill.jpg) |
| adventure/butterfly-hamadryas.webp | Niagara Parks Butterfly Conservatory | The Cosmonaut | CC BY-SA 2.5 CA | [Commons](https://commons.wikimedia.org/wiki/File:Hamadryas_februa_Niagara_Parks_Butterfly_Conservatory.jpg) |

Fonts: Cormorant Garamond & Manrope (Google Fonts, SIL Open Font License).

Map: Canada Basemap – Transportation © Natural Resources Canada. Contains information licensed under the
[Open Government Licence – Canada](https://open.canada.ca/en/open-government-licence-canada) · [Leaflet](https://leafletjs.com) (BSD-2-Clause).
