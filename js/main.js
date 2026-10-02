/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   main.js — Shared layout + interactions used on every page

   1. Page registry  (which HTML files really exist)
   2. Shared layout  (header, footer, toast)
   3. Safe links     (no 404: "Coming soon" notice on click only)
   4. Scroll engine  (navbar, progress, hero, parallax, scrubs)
   5. Scroll reveal + stagger
   6. Counters
   7. Micro-interactions (magnetic buttons, image badges, teaser)
   8. Marquee, image loading

   MOTION SYSTEM (keep it consistent when adding pages)
   - Text ........ .reveal            fade + rise
   - Titles ...... .reveal--title     fade + rise + soft focus
   - Groups ...... [data-stagger]     children one after another
   - Images ...... .reveal-img        unmask + subtle scale
   - Numbers ..... [data-depth]       very soft parallax
   - Big images .. [data-scrub]       grow to full bleed on scroll
   - Buttons ..... label roll + arrow line
   ========================================================= */

(function () {
  'use strict';

  const doc = document;
  const body = doc.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactNav = window.matchMedia('(max-width: 1279px)');   // see section 99 of style.css
  const i18n = () => window.OTE_I18N;

  /* ---------------------------------------------------------
     1. PAGE REGISTRY
     Set ready: true when a page is built. Links to pages that
     are not ready look and feel normal, but never navigate
     (no 404 possible): a click shows the "Coming soon" notice.
     On GitHub Pages (http/https) pages not marked ready are
     also checked automatically and connected if they exist.
     --------------------------------------------------------- */
  const PAGES = {
    'index.html':              { ready: true,  key: 'nav.home' },
    // The four worlds (their two collections are anchors inside
    // each page: nature.html#water-beaches, food.html#markets…)
    'nature.html':             { ready: true,  key: 'section.nature' },
    'culture.html':            { ready: true,  key: 'section.culture' },
    'food.html':               { ready: true,  key: 'section.food' },
    'entertainment.html':      { ready: true,  key: 'section.adventure' },
    // Separate subsection pages are not planned for now
    'water-beaches.html':      { ready: false, key: 'sub.water' },
    'parks-landscapes.html':   { ready: false, key: 'sub.parks' },
    'landmarks.html':          { ready: false, key: 'sub.landmarks' },
    'museums-art.html':        { ready: false, key: 'sub.museums' },
    'markets.html':            { ready: false, key: 'sub.markets' },
    'flavours.html':           { ready: false, key: 'sub.flavours' },
    'family-attractions.html': { ready: false, key: 'sub.family' },
    'adventure.html':          { ready: false, key: 'sub.seasonal' },
    // Interactive pages (js/map.js, js/quiz.js, data in js/experiences.js)
    'map.html':                { ready: true,  key: 'nav.map', soonKey: 'soon.map' },
    'find-your-ontario.html':  { ready: true,  key: 'nav.quiz', soonKey: 'soon.quiz' },
    // Planning pages (js/plan.js, js/seasons.js, js/favourites-page.js, js/guide.js)
    'plan-your-trip.html':     { ready: true,  key: 'nav.plan' },
    'seasons.html':            { ready: true,  key: 'nav.seasons' },
    'favourites.html':         { ready: true,  key: 'nav.favourites' },
    'travel-guide.html':       { ready: true,  key: 'nav.guide' },
    'credits.html':            { ready: true,  key: 'nav.credits' }
  };

  const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* ---------------------------------------------------------
     2. SHARED LAYOUT
     --------------------------------------------------------- */
  // Bar: Home · Explore ▾ · Plan ▾ · Find Your Ontario · Credits (then ♡ and ES | EN)
  const HOME_ITEM = { id: 'home', href: 'index.html', key: 'nav.home' };
  const QUIZ_ITEM = { id: 'quiz', href: 'find-your-ontario.html', key: 'nav.quiz', feature: true };
  const CREDITS_ITEM = { id: 'credits', href: 'credits.html', key: 'nav.credits', short: 'nav.creditsShort' };

  // Drop-down menus of the bar (see initNavMenus)
  const NAV_MENUS = [
    { id: 'explore', key: 'nav.exploreMenu', groups: [
      { group: 'nav.groupWorlds', items: [
        { id: 'nature', href: 'nature.html', key: 'nav.nature', hint: 'nav.natureHint' },
        { id: 'culture', href: 'culture.html', key: 'nav.culture', hint: 'nav.cultureHint' },
        { id: 'flavours', href: 'food.html', key: 'nav.flavours', hint: 'nav.flavoursHint' },
        { id: 'adventure', href: 'entertainment.html', key: 'nav.adventure', hint: 'nav.adventureHint' }
      ] },
      { group: 'nav.groupMap', items: [
        { id: 'map', href: 'map.html', key: 'nav.map', hint: 'nav.mapHint' }
      ] }
    ] },
    { id: 'plan', key: 'nav.planMenu', groups: [
      { group: 'nav.groupPlan', items: [
        { id: 'plan', href: 'plan-your-trip.html', key: 'nav.plan', hint: 'nav.planHint' },
        { id: 'seasons', href: 'seasons.html', key: 'nav.seasons', hint: 'nav.seasonsHint' },
        { id: 'guide', href: 'travel-guide.html', key: 'nav.guide', hint: 'nav.guideHint' }
      ] }
    ] }
  ];

  // Footer columns
  const FOOTER_EXPLORE = [
    HOME_ITEM,
    { id: 'nature', href: 'nature.html', key: 'nav.nature' },
    { id: 'culture', href: 'culture.html', key: 'nav.culture' },
    { id: 'flavours', href: 'food.html', key: 'nav.flavours' },
    { id: 'adventure', href: 'entertainment.html', key: 'nav.adventure' },
    { id: 'map', href: 'map.html', key: 'nav.map' }
  ];
  const FOOTER_DISCOVER = [
    { id: 'quiz', href: 'find-your-ontario.html', key: 'nav.quiz' },
    { id: 'seasons', href: 'seasons.html', key: 'nav.seasons' }
  ];
  const FOOTER_PLAN = [
    { id: 'plan', href: 'plan-your-trip.html', key: 'nav.plan' },
    { id: 'favourites', href: 'favourites.html', key: 'nav.favourites' },
    { id: 'guide', href: 'travel-guide.html', key: 'nav.guide' }
  ];
  const FOOTER_INFO = [
    { id: 'credits', href: 'credits.html', key: 'nav.credits' }
  ];

  const HEART_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.3s-7.4-4.5-9.2-9.1C1.5 7.9 3.5 4.6 6.9 4.6c2.1 0 3.7 1.1 5.1 3 1.4-1.9 3-3 5.1-3 3.4 0 5.4 3.3 4.1 6.6-1.8 4.6-9.2 9.1-9.2 9.1z"/></svg>';

  function langSwitch(extraClass) {
    return `
      <div class="lang-switch ${extraClass || ''}" role="group" data-i18n-attr="aria-label:lang.label">
        <button type="button" class="lang-switch__btn" data-lang="es" lang="es" data-i18n-attr="aria-label:lang.es">ES</button>
        <span class="lang-switch__sep" aria-hidden="true">|</span>
        <button type="button" class="lang-switch__btn" data-lang="en" lang="en" data-i18n-attr="aria-label:lang.en">EN</button>
      </div>`;
  }

  function navLink(item) {
    return `
      <li>
        <a class="main-nav__link${item.feature ? ' main-nav__link--feature' : ''}" href="${item.href}" data-nav="${item.id}">
          ${item.feature ? '<span class="pulse-dot" aria-hidden="true"></span>' : ''}
          <span data-i18n="${item.short || item.key}"></span>
        </a>
      </li>`;
  }

  // Disclosure menu (button + list of links), see initNavMenus
  function navMenuTemplate(menu) {
    const groups = menu.groups.map((g) => `
      <div class="nav-menu__group">
        <p class="nav-menu__title" data-i18n="${g.group}"></p>
        <ul>${g.items.map((item) => `
          <li><a class="nav-menu__link" href="${item.href}" data-nav="${item.id}">
            <span class="nav-menu__name"><span data-i18n="${item.key}"></span></span>
            <span class="nav-menu__hint" data-i18n="${item.hint}"></span>
          </a></li>`).join('')}
        </ul>
      </div>`).join('');
    const single = menu.groups.length === 1 ? ' nav-menu--single' : '';
    return `
      <li class="main-nav__group">
        <button type="button" class="main-nav__link main-nav__toggle" aria-expanded="false" aria-controls="nav-${menu.id}-menu">
          <span data-i18n="${menu.key}"></span><span class="main-nav__caret" aria-hidden="true"></span>
        </button>
        <div class="nav-menu${single}" id="nav-${menu.id}-menu" hidden>${groups}</div>
      </li>`;
  }

  function headerTemplate() {
    const links = navLink(HOME_ITEM)
      + NAV_MENUS.map(navMenuTemplate).join('')
      + navLink(QUIZ_ITEM)
      + navLink(CREDITS_ITEM);

    return `
      <header class="site-header" id="site-header">
        <div class="site-header__inner">
          <a class="brand" href="index.html" data-i18n-attr="aria-label:nav.homeLabel">
            <span class="brand__mark" aria-hidden="true">ONTARIO</span>
            <span class="brand__name" data-i18n="site.name"></span>
          </a>
          <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav">
            <span class="nav-toggle__icon" aria-hidden="true"></span>
            <span class="nav-toggle__label" data-i18n="nav.menu"></span>
          </button>
          <nav class="main-nav" id="site-nav" data-i18n-attr="aria-label:nav.label">
            <ul class="main-nav__list">${links}</ul>
          </nav>
          <a class="nav-fav" href="favourites.html" data-nav="favourites" data-i18n-attr="aria-label:nav.favourites|title:nav.favourites">
            ${HEART_ICON}<span class="nav-fav__count" data-fav-count hidden></span>
          </a>
          ${langSwitch()}
        </div>
        <span class="scroll-progress" aria-hidden="true"></span>
      </header>`;
  }

  function footerTemplate() {
    const footerLinks = (items) => items
      .map((i) => `<li><a class="footer-link" href="${i.href}" data-i18n="${i.key}"></a></li>`).join('');
    const navLinks = footerLinks(FOOTER_EXPLORE);

    // Page-specific photo credits come from <template id="page-credits">
    const creditsTpl = doc.getElementById('page-credits');
    const credits = creditsTpl ? `
      <div class="site-footer__credits">
        <p class="footer-heading" data-i18n="footer.photos"></p>
        <ul class="credits-inline">${creditsTpl.innerHTML}</ul>
        <p class="credits-note">
          <span data-i18n="footer.photosNote"></span>
          <a class="text-link" href="credits.html" data-i18n="nav.credits"></a>.
        </p>
      </div>` : '';

    return `
      <footer class="site-footer">
        <div class="site-footer__top" data-stagger>
          <div class="site-footer__brand">
            <a class="brand brand--footer" href="index.html" data-i18n-attr="aria-label:nav.homeLabel">
              <span class="brand__mark" aria-hidden="true">ONTARIO</span>
              <span class="brand__name" data-i18n="site.name"></span>
            </a>
            <p class="site-footer__motto" data-i18n-html="footer.motto"></p>
          </div>
          <nav class="site-footer__col" aria-labelledby="footer-nav-title">
            <p class="footer-heading" id="footer-nav-title" data-i18n="footer.explore"></p>
            <ul>${navLinks}</ul>
          </nav>
          <nav class="site-footer__col" aria-labelledby="footer-discover-title">
            <p class="footer-heading" id="footer-discover-title" data-i18n="footer.discover"></p>
            <ul>${footerLinks(FOOTER_DISCOVER)}</ul>
            <p class="footer-heading footer-heading--next" id="footer-info-title" data-i18n="footer.info"></p>
            <ul aria-labelledby="footer-info-title">${footerLinks(FOOTER_INFO)}</ul>
          </nav>
          <nav class="site-footer__col" aria-labelledby="footer-plan-title">
            <p class="footer-heading" id="footer-plan-title" data-i18n="footer.plan"></p>
            <ul>${footerLinks(FOOTER_PLAN)}</ul>
          </nav>
          <div class="site-footer__col">
            <p class="footer-heading" data-i18n="footer.language"></p>
            ${langSwitch('lang-switch--footer')}
            <a class="back-top" href="#top">
              <span data-i18n="footer.top"></span>
              <span class="arrow arrow--up" aria-hidden="true"></span>
            </a>
          </div>
        </div>
        ${credits}
        <div class="site-footer__bottom">
          <p data-i18n="footer.copyright" data-i18n-vars='{"year":"${new Date().getFullYear()}"}'></p>
          <p data-i18n="footer.disclaimer"></p>
        </div>
        <p class="site-footer__watermark" aria-hidden="true" data-depth="-0.08">ONTARIO</p>
      </footer>`;
  }

  function overlaysTemplate() {
    return `
      <div class="toast" role="status" aria-live="polite">
        <span class="toast__dot" aria-hidden="true"></span>
        <div class="toast__body">
          <p class="toast__label" data-i18n="soon.label"></p>
          <p class="toast__text"></p>
        </div>
        <button type="button" class="toast__close" data-i18n-attr="aria-label:soon.close"><span aria-hidden="true">×</span></button>
      </div>`;
  }

  const COMPONENTS = {
    'site-header': headerTemplate,
    'site-footer': footerTemplate
  };

  function renderLayout() {
    doc.querySelectorAll('[data-component]').forEach((slot) => {
      const template = COMPONENTS[slot.dataset.component];
      if (template) slot.outerHTML = template();
    });
    body.insertAdjacentHTML('beforeend', overlaysTemplate());
  }

  /* ---------------------------------------------------------
     3. SAFE LINKS
     --------------------------------------------------------- */
  function fileFromHref(href) {
    return href.split(/[?#]/)[0].toLowerCase();
  }

  function isInternalPage(href) {
    return href && !/^(https?:|mailto:|tel:|#)/i.test(href) && /\.html?([?#]|$)/i.test(href);
  }

  // The link keeps its normal text, badge and hover styles:
  // only the click is intercepted (see initSafeLinks).
  function makeSoon(link, file) {
    link.dataset.href = link.getAttribute('href');
    link.dataset.soonPage = file;
    link.removeAttribute('href');                 // cannot navigate → cannot 404
    link.setAttribute('role', 'link');
    if (link.getAttribute('tabindex') !== '-1') link.setAttribute('tabindex', '0');
    link.classList.add('is-soon');
  }

  function restoreLink(link) {
    link.setAttribute('href', link.dataset.href);
    ['role', 'tabindex'].forEach((a) => link.removeAttribute(a));
    link.classList.remove('is-soon');
  }

  function initSafeLinks() {
    const pending = {};

    doc.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!isInternalPage(href)) return;
      const file = fileFromHref(href);
      const page = PAGES[file];

      if (page && page.ready) {
        // Links to the page we are on: glide to the top instead of reloading
        if (file === currentFile && !/[?#]/.test(href)) {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
          });
        }
        return;
      }

      makeSoon(link, file);
      (pending[file] = pending[file] || []).push(link);
    });

    // Published site: connect pages that already exist even if not marked ready
    if (/^https?:$/.test(window.location.protocol) && window.fetch) {
      Object.keys(pending).forEach((file) => {
        fetch(file, { method: 'HEAD', cache: 'no-store' })
          .then((res) => { if (res.ok) pending[file].forEach(restoreLink); })
          .catch(() => { /* stays as "coming soon" */ });
      });
    }

    const activate = (link) => showToast(link.dataset.soonPage);

    doc.addEventListener('click', (event) => {
      const link = event.target.closest('.is-soon');
      if (!link) return;
      event.preventDefault();
      activate(link);
    });
    doc.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      const link = event.target.closest && event.target.closest('.is-soon');
      if (link) activate(link);
    });
  }

  /* "Explore" and "Plan" menus — disclosures, only one open at a time.
     Mouse: hovering opens, leaving closes after a short grace period
     (a hover bridge covers the gap under the button); a click while
     hover-opened pins the menu open, a second click closes it.
     Keyboard / touch: click · Enter · Space toggle, ↓ / ↑ open on the
     first / last link, ↑ ↓ Home End move, Escape closes. */
  function initNavMenus() {
    const HOVER_CLOSE_DELAY = 280;
    const menus = Array.from(doc.querySelectorAll('.main-nav__group')).map((group) => {
      const toggle = group.querySelector('.main-nav__toggle');
      return { group, toggle, panel: doc.getElementById(toggle.getAttribute('aria-controls')), pinned: false, timer: 0 };
    });
    if (!menus.length) return { closeAll() {} };

    const isOpen = (m) => m.toggle.getAttribute('aria-expanded') === 'true';
    const links = (m) => Array.from(m.panel.querySelectorAll('a'));

    function setOpen(m, on, focus) {
      clearTimeout(m.timer);
      if (on) menus.forEach((other) => { if (other !== m && isOpen(other)) setOpen(other, false); });
      if (!on) m.pinned = false;
      m.toggle.setAttribute('aria-expanded', String(on));
      m.panel.hidden = !on;
      m.group.classList.toggle('is-open', on);
      if (on && focus) {
        const all = links(m);
        all[focus === 'last' ? all.length - 1 : 0].focus();
      }
    }

    menus.forEach((m) => {
      m.toggle.addEventListener('click', () => {
        if (isOpen(m) && !m.pinned && m.group.matches(':hover')) m.pinned = true;
        else if (isOpen(m)) setOpen(m, false);
        else { setOpen(m, true); m.pinned = true; }
      });
      m.toggle.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(m, true, 'first'); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setOpen(m, true, 'last'); }
      });
      m.panel.addEventListener('keydown', (e) => {
        const all = links(m);
        const i = all.indexOf(doc.activeElement);
        const go = { ArrowDown: (i + 1) % all.length, ArrowUp: (i - 1 + all.length) % all.length, Home: 0, End: all.length - 1 }[e.key];
        if (go !== undefined) { e.preventDefault(); all[go].focus(); }
      });

      // Hover only drives the desktop bar; in the compact panel the
      // groups are accordions that open and close with a tap or click
      m.group.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || compactNav.matches) return;
        clearTimeout(m.timer);
        if (!isOpen(m)) setOpen(m, true);
      });
      m.group.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse' || compactNav.matches || m.pinned || !isOpen(m)) return;
        m.timer = setTimeout(() => {
          if (!m.panel.contains(doc.activeElement)) setOpen(m, false);   // keyboard user inside: keep
        }, HOVER_CLOSE_DELAY);
      });
      m.group.addEventListener('focusout', (e) => {
        if (isOpen(m) && e.relatedTarget && !m.group.contains(e.relatedTarget)) setOpen(m, false);
      });
    });

    doc.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      menus.forEach((m) => {
        if (!isOpen(m)) return;
        const hadFocus = m.group.contains(doc.activeElement);
        setOpen(m, false);
        if (hadFocus) m.toggle.focus();
      });
    });
    doc.addEventListener('click', (e) => {
      menus.forEach((m) => { if (isOpen(m) && !m.group.contains(e.target)) setOpen(m, false); });
    });

    return { closeAll() { menus.forEach((m) => { if (isOpen(m)) setOpen(m, false); }); } };
  }

  /* Compact navigation (below 1280px, same query as the CSS).
     The bar keeps the brand, ♡ and ES | EN, plus a Menu button; the
     same <nav> becomes a full-height panel under the bar, with Explore
     and Plan as accordions. Tap / click / Enter / Space toggle it;
     Escape or choosing a page closes it. While it is open the page
     behind is inert (no focus, no clicks) and does not scroll. */
  function initCompactNav(navMenus) {
    const header = doc.getElementById('site-header');
    const toggle = header && header.querySelector('.nav-toggle');
    const panel = toggle && doc.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    const behind = () => Array.from(body.children).filter((el) => el !== header && el.tagName !== 'SCRIPT' && el.tagName !== 'TEMPLATE');

    function setOpen(on, returnFocus) {
      if (on === isOpen()) return;
      toggle.setAttribute('aria-expanded', String(on));
      header.classList.toggle('is-nav-open', on);
      doc.documentElement.classList.toggle('nav-locked', on);
      behind().forEach((el) => { el.inert = on; });
      if (!on) {
        navMenus.closeAll();
        if (returnFocus) toggle.focus();
      }
    }

    toggle.addEventListener('click', () => setOpen(!isOpen()));
    panel.addEventListener('click', (e) => { if (e.target.closest('a[href]')) setOpen(false); });
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) setOpen(false, true);
    });
    // Back to the wide bar (rotation, resize) or back from the history cache: closed
    const reset = () => { if (!compactNav.matches || isOpen()) setOpen(false); };
    if (compactNav.addEventListener) compactNav.addEventListener('change', reset);
    window.addEventListener('pageshow', reset);
  }

  /* Toast — explains why the link does not navigate yet */
  let toastTimer;
  function showToast(file) {
    const toast = doc.querySelector('.toast');
    if (!toast || !i18n()) return;
    const page = PAGES[file] || {};
    const t = i18n().t;
    toast.querySelector('.toast__text').textContent = page.soonKey
      ? t(page.soonKey)
      : t('soon.page', { page: page.key ? t(page.key) : file });
    toast.classList.remove('is-visible');
    void toast.offsetWidth;                      // restart the entrance
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4800);
  }
  function hideToast() {
    const toast = doc.querySelector('.toast');
    if (toast) toast.classList.remove('is-visible');
  }

  function initToast() {
    const close = doc.querySelector('.toast__close');
    if (close) close.addEventListener('click', hideToast);
    doc.addEventListener('languagechange', hideToast);
  }

  /* ---------------------------------------------------------
     4. SCROLL ENGINE — one rAF-throttled loop for everything
     that depends on scroll position. Only elements currently
     near the viewport are processed.
     --------------------------------------------------------- */
  function initScrollEngine() {
    const header = doc.getElementById('site-header');
    const progress = header && header.querySelector('.scroll-progress');
    const hero = doc.querySelector('.hero');
    const transparentNav = body.dataset.nav === 'transparent';

    // Active link (subsection pages use data-section to light up their parent)
    if (header) {
      const current = body.dataset.section || body.dataset.page;
      header.querySelectorAll('[data-nav]').forEach((link) => {
        if (link.dataset.nav === current) link.setAttribute('aria-current', 'page');
      });
      // A page inside a drop-down menu also lights up its button
      header.querySelectorAll('.main-nav__group').forEach((group) => {
        if (group.querySelector('.nav-menu [aria-current="page"]')) group.querySelector('.main-nav__toggle').classList.add('has-current');
      });
      if (!transparentNav) header.classList.add('is-solid');
    }

    const depthEls = Array.from(doc.querySelectorAll('[data-depth]'));
    const scrubEls = Array.from(doc.querySelectorAll('[data-scrub]'));
    const inView = new Set();

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
        requestTick();
      }, { rootMargin: '25% 0px 25% 0px' });
      depthEls.concat(scrubEls).forEach((el) => io.observe(el));
    } else {
      scrubEls.forEach((el) => el.style.setProperty('--enter', 1));
    }

    let vh = window.innerHeight;
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY;

      if (header) {
        if (transparentNav) header.classList.toggle('is-solid', y > 60);
        if (progress) {
          const max = doc.documentElement.scrollHeight - vh;
          progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        }
      }

      if (reduceMotion) return;

      // Hero: content drifts up and fades as the next chapter arrives
      if (hero && y < vh * 1.2) {
        const p = Math.min(y / (hero.offsetHeight || vh), 1);
        hero.style.setProperty('--hero-p', p.toFixed(4));
      }

      inView.forEach((el) => {
        if (el.hasAttribute('data-depth')) {
          const anchor = el.parentElement.getBoundingClientRect();
          const offset = (anchor.top + anchor.height / 2) - vh / 2;
          const shift = Math.max(-140, Math.min(140, offset * Number(el.dataset.depth)));
          el.style.setProperty('--py', `${shift.toFixed(1)}px`);
        }
        if (el.hasAttribute('data-scrub')) {
          const r = el.getBoundingClientRect();
          const enter = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.85)));
          el.style.setProperty('--enter', enter.toFixed(4));
        }
      });
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', () => { vh = window.innerHeight; requestTick(); });
    update();
  }

  /* ---------------------------------------------------------
     5. SCROLL REVEAL + STAGGER
     --------------------------------------------------------- */
  function initReveal() {
    // Stagger groups: give each child its position in the sequence
    doc.querySelectorAll('[data-stagger]').forEach((group) => {
      Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
    });

    const items = doc.querySelectorAll('.reveal, .reveal-img, [data-stagger]');
    if (!items.length) return;

    // With reduced motion the CSS turns these into simple fades
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    let observerAlive = false;
    const observer = new IntersectionObserver((entries) => {
      observerAlive = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    // Images start fully clipped (clip-path), and Chromium counts the
    // target's own clip-path, so an observer would never see them.
    // They are checked by position instead (same 15% / -6% rule).
    let pendingImgs = Array.from(items).filter((el) => el.classList.contains('reveal-img'));
    items.forEach((el) => { if (!el.classList.contains('reveal-img')) observer.observe(el); });

    let imgTick = false;
    const checkImgs = () => {
      imgTick = false;
      const bottom = window.innerHeight * 0.94;
      pendingImgs = pendingImgs.filter((el) => {
        const r = el.getBoundingClientRect();
        const seen = Math.min(r.bottom, bottom) - Math.max(r.top, 0);
        if (r.height && seen >= Math.min(r.height, bottom) * 0.15) {
          el.classList.add('is-visible');
          return false;
        }
        return true;
      });
      if (!pendingImgs.length) {
        window.removeEventListener('scroll', requestImgs);
        window.removeEventListener('resize', requestImgs);
      }
    };
    const requestImgs = () => {
      if (!imgTick) { imgTick = true; window.requestAnimationFrame(checkImgs); }
    };
    if (pendingImgs.length) {
      window.addEventListener('scroll', requestImgs, { passive: true });
      window.addEventListener('resize', requestImgs);
      checkImgs();
    }

    // Safety net: the observer always reports once right after observe().
    // If it never does (unusual browsers), show everything — content must
    // never stay hidden.
    setTimeout(() => {
      if (!observerAlive) items.forEach((el) => el.classList.add('is-visible'));
    }, 2000);
  }

  /* ---------------------------------------------------------
     6. COUNTERS  —  <span data-count="24" data-pad="2">
     --------------------------------------------------------- */
  function initCounters() {
    const counters = doc.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const format = (el, value) => String(value).padStart(Number(el.dataset.pad || 0), '0');

    const run = (el) => {
      const target = Number(el.dataset.count);
      if (reduceMotion) {
        el.textContent = format(el, target);
        return;
      }
      const duration = 1500;
      const start = performance.now();
      const step = (now) => {
        // rAF timestamps can be slightly earlier than `start`: clamp to 0–1
        const progress = Math.max(0, Math.min((now - start) / duration, 1));
        el.textContent = format(el, Math.round(target * (1 - Math.pow(1 - progress, 4))));
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    let observerAlive = false;
    const observer = new IntersectionObserver((entries) => {
      observerAlive = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => {
      el.textContent = format(el, 0);
      observer.observe(el);
    });
    setTimeout(() => { if (!observerAlive) counters.forEach(run); }, 2000);
  }

  /* ---------------------------------------------------------
     7. MICRO-INTERACTIONS
     --------------------------------------------------------- */

  // Buttons lean slightly toward the cursor (uses `translate`,
  // so it never conflicts with other transforms)
  function initMagnetic() {
    if (reduceMotion) return;
    doc.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.translate = `${(dx * 0.14).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.translate = '0 0'; });
    });
  }

  // Image badge follows the cursor inside the photo
  function initMediaBadges() {
    doc.querySelectorAll('.world__media').forEach((media) => {
      media.addEventListener('mousemove', (e) => {
        const r = media.getBoundingClientRect();
        media.style.setProperty('--mx', `${e.clientX - r.left}px`);
        media.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // Find Your Ontario teaser: selectable answers, 3D tilt, rotating questions
  function initQuizTeaser() {
    const teaser = doc.querySelector('[data-quiz-teaser]');
    if (!teaser) return;

    const options = teaser.querySelectorAll('.teaser-option');
    options.forEach((option) => {
      option.addEventListener('click', () => {
        options.forEach((o) => o.setAttribute('aria-pressed', 'false'));
        option.setAttribute('aria-pressed', 'true');
        teaser.classList.add('has-choice');
      });
    });

    const stage = teaser.closest('.fyo__preview');
    if (stage && !reduceMotion) {
      stage.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        teaser.style.transform = `rotateY(${(x * 6).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg)`;
      });
      stage.addEventListener('mouseleave', () => { teaser.style.transform = ''; });
    }

    // Ghost card previews the next questions of the real quiz
    const ghost = doc.querySelector('[data-question-cycle]');
    if (!ghost) return;
    const keys = ghost.dataset.questionCycle.split(',');
    const question = ghost.querySelector('.teaser__question');
    const step = ghost.querySelector('.teaser__step');
    let index = 0;
    let visible = false;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(ghost);
    }

    setInterval(() => {
      if (!visible || doc.hidden || !i18n()) return;
      index = (index + 1) % keys.length;
      ghost.classList.add('is-changing');
      setTimeout(() => {
        question.dataset.i18n = keys[index];
        question.textContent = i18n().t(keys[index]);
        step.textContent = `${String(index + 3).padStart(2, '0')} / 07`;
        ghost.classList.remove('is-changing');
      }, reduceMotion ? 0 : 380);
    }, 3400);
  }

  /* ---------------------------------------------------------
     8. MARQUEE & IMAGE LOADING
     --------------------------------------------------------- */
  function initMarquee() {
    doc.querySelectorAll('[data-marquee]').forEach((marquee) => {
      const track = marquee.querySelector('.marquee__track');
      if (!track) return;
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.querySelector('.marquee__inner').appendChild(clone);
    });
  }

  // Fade images in once decoded, so reveals never show a blank box
  function initImageLoading() {
    doc.querySelectorAll('main img').forEach((img) => {
      const done = () => img.classList.add('is-loaded');
      if (img.complete && img.naturalWidth) done();
      else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      }
    });
  }

  /* ---------------------------------------------------------
     BOOT
     --------------------------------------------------------- */
  renderLayout();
  initSafeLinks();
  initCompactNav(initNavMenus());
  initToast();
  initReveal();
  initScrollEngine();
  initCounters();
  initMagnetic();
  initMediaBadges();
  initQuizTeaser();
  initMarquee();
  initImageLoading();
})();
