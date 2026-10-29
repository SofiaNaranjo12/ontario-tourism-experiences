/* =========================================================
   ONTARIO TOURISM EXPERIENCES
   favourites.js — My Favourites (shared by every page)

   - Saved experiences live in localStorage under "ote-favourites"
     as a list of short ids (newest first): ["algonquin","rom"].
     No account, no server. If storage is not available (private
     modes), the buttons still work for the current page.
   - Reusable button: OTE_FAV.button(experience, { variant })
       variant "label" (♡ Save / ♥ Saved) · "icon" (heart only)
     Any element with data-fav="<id>" is a toggle: clicks are
     handled here once for the whole page (delegation).
   - Every change fires "favouriteschange" on document, and other
     open tabs are kept in sync through the "storage" event.
   - World pages: a discreet button is added to each experience
     (article.exp) automatically, next to its facts, with a
     "View on map" link (map.html?experience=<id>).
   ========================================================= */

(function () {
  'use strict';

  const I18N = window.OTE_I18N;
  const DATA = window.OTE_EXPERIENCES;
  if (!I18N || !DATA) return;

  const KEY = 'ote-favourites';
  const doc = document;

  I18N.extend({
    en: {
      'fav.save': 'Save',
      'fav.saved': 'Saved',
      'fav.aria': 'Save {name} to My Favourites',
      'fav.added': 'Saved to My Favourites',
      'fav.removed': 'Removed from My Favourites',
      'fav.view': 'View favourites',
      'fav.undo': 'Undo',
      'fav.close': 'Close notification'
    },
    es: {
      'fav.save': 'Guardar',
      'fav.saved': 'Guardado',
      'fav.aria': 'Guardar {name} en Mis favoritos',
      'fav.added': 'Guardado en Mis favoritos',
      'fav.removed': 'Eliminado de Mis favoritos',
      'fav.view': 'Ver favoritos',
      'fav.undo': 'Deshacer',
      'fav.close': 'Cerrar aviso'
    }
  });

  const t = (k, v) => I18N.t(k, v);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------------------------------------------------
     STORAGE
     --------------------------------------------------------- */
  let memory = null;                   // fallback when localStorage fails

  function read() {
    let raw = memory;
    try { raw = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { /* keep memory */ }
    if (!Array.isArray(raw)) raw = [];
    // Only known experiences, once each (accepts ids or page anchors)
    const ids = [];
    raw.forEach((v) => {
      const e = DATA.find(v);
      if (e && !ids.includes(e.id)) ids.push(e.id);
    });
    return ids;
  }

  function write(ids) {
    memory = ids.slice();
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) { /* memory only */ }
  }

  const list = () => read();
  const has = (id) => { const e = DATA.find(id); return !!e && read().includes(e.id); };

  function set(id, saved) {
    const e = DATA.find(id);
    if (!e) return false;
    const ids = read().filter((x) => x !== e.id);
    if (saved) ids.unshift(e.id);
    write(ids);
    changed(e.id, saved);
    return saved;
  }

  const toggle = (id) => set(id, !has(id));

  function changed(id, saved) {
    sync();
    doc.dispatchEvent(new CustomEvent('favouriteschange', { detail: { id, saved, list: read() } }));
  }

  /* ---------------------------------------------------------
     BUTTON COMPONENT
     --------------------------------------------------------- */
  const HEART = '<svg class="fav-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.3s-7.4-4.5-9.2-9.1C1.5 7.9 3.5 4.6 6.9 4.6c2.1 0 3.7 1.1 5.1 3 1.4-1.9 3-3 5.1-3 3.4 0 5.4 3.3 4.1 6.6-1.8 4.6-9.2 9.1-9.2 9.1z"/></svg>';

  function button(e, opts) {
    opts = opts || {};
    const variant = opts.variant || 'label';
    const saved = has(e.id);
    const vars = esc(JSON.stringify({ name: e.name }));
    return `<button type="button" class="fav-btn fav-btn--${variant}${opts.extraClass ? ` ${opts.extraClass}` : ''}${saved ? ' is-saved' : ''}" data-fav="${e.id}" aria-pressed="${saved}" aria-label="${esc(t('fav.aria', { name: e.name }))}" data-i18n-attr="aria-label:fav.aria" data-i18n-vars='${vars}'>${HEART}${variant === 'label' ? `<span class="fav-btn__label" data-fav-label>${t(saved ? 'fav.saved' : 'fav.save')}</span>` : ''}</button>`;
  }

  // Updates every toggle (and the header counter) to the stored state
  function sync(scope) {
    const ids = read();
    (scope || doc).querySelectorAll('[data-fav]').forEach((btn) => {
      const saved = ids.includes(btn.dataset.fav);
      btn.setAttribute('aria-pressed', String(saved));
      btn.classList.toggle('is-saved', saved);
      const label = btn.querySelector('[data-fav-label]');
      if (label) label.textContent = t(saved ? 'fav.saved' : 'fav.save');
    });
    doc.querySelectorAll('[data-fav-count]').forEach((el) => {
      el.textContent = ids.length ? String(ids.length) : '';
      el.hidden = !ids.length;
    });
  }

  /* ---------------------------------------------------------
     FEEDBACK — small notification with a link (or undo)
     --------------------------------------------------------- */
  let toastEl = null;
  let toastTimer = null;
  let lastRemoved = null;

  function toast(e, saved) {
    if (!toastEl) {
      doc.body.insertAdjacentHTML('beforeend', `
        <div class="fav-toast" role="status" aria-live="polite">
          <svg class="fav-toast__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.3s-7.4-4.5-9.2-9.1C1.5 7.9 3.5 4.6 6.9 4.6c2.1 0 3.7 1.1 5.1 3 1.4-1.9 3-3 5.1-3 3.4 0 5.4 3.3 4.1 6.6-1.8 4.6-9.2 9.1-9.2 9.1z"/></svg>
          <div class="fav-toast__body">
            <p class="fav-toast__label"></p>
            <p class="fav-toast__name"></p>
          </div>
          <a class="fav-toast__action" href="favourites.html"></a>
          <button type="button" class="fav-toast__undo" hidden></button>
          <button type="button" class="fav-toast__close"><span aria-hidden="true">×</span></button>
        </div>`);
      toastEl = doc.body.lastElementChild;
      toastEl.querySelector('.fav-toast__close').addEventListener('click', hideToast);
      toastEl.querySelector('.fav-toast__undo').addEventListener('click', () => {
        if (lastRemoved) set(lastRemoved, true);
        hideToast();
      });
    }
    const onFavPage = doc.body.dataset.page === 'favourites';
    lastRemoved = saved ? null : e.id;
    toastEl.classList.toggle('is-removed', !saved);
    toastEl.querySelector('.fav-toast__label').textContent = t(saved ? 'fav.added' : 'fav.removed');
    toastEl.querySelector('.fav-toast__name').textContent = e.name;
    const action = toastEl.querySelector('.fav-toast__action');
    action.textContent = t('fav.view');
    action.hidden = onFavPage || !saved;
    const undo = toastEl.querySelector('.fav-toast__undo');
    undo.textContent = t('fav.undo');
    undo.hidden = saved;
    toastEl.querySelector('.fav-toast__close').setAttribute('aria-label', t('fav.close'));
    toastEl.classList.remove('is-visible');
    void toastEl.offsetWidth;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 5200);
  }

  function hideToast() {
    if (toastEl) toastEl.classList.remove('is-visible');
  }

  /* ---------------------------------------------------------
     WORLD PAGES — one button per experience article
     --------------------------------------------------------- */
  function decorateWorldPages() {
    doc.querySelectorAll('article.exp[id] .exp__body').forEach((bodyEl) => {
      const e = DATA.find(bodyEl.closest('article').id);
      if (!e || bodyEl.querySelector('[data-fav]')) return;
      // ♡ Save + a direct link that opens this experience on the Explore Map
      bodyEl.insertAdjacentHTML('beforeend', `<div class="exp__save">${button(e)}<a class="link-arrow exp__map" href="map.html?experience=${e.id}"><span data-i18n="exp.viewMap">${t('exp.viewMap')}</span><span class="map-pin-icon" aria-hidden="true"></span></a></div>`);
    });
  }

  /* ---------------------------------------------------------
     EVENTS + BOOT
     --------------------------------------------------------- */
  doc.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-fav]');
    if (!btn) return;
    event.preventDefault();
    const e = DATA.find(btn.dataset.fav);
    if (!e) return;
    const saved = toggle(e.id);
    btn.classList.remove('is-popping');
    void btn.offsetWidth;
    if (saved) btn.classList.add('is-popping');
    toast(e, saved);
  });

  // Another tab changed the favourites: follow it
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY) return;
    sync();
    doc.dispatchEvent(new CustomEvent('favouriteschange', { detail: { id: null, saved: null, list: read() } }));
  });

  doc.addEventListener('languagechange', () => { sync(); hideToast(); });

  window.OTE_FAV = { list, has, toggle, set, button, sync, count: () => read().length };

  decorateWorldPages();
  doc.addEventListener('DOMContentLoaded', () => sync());
})();
