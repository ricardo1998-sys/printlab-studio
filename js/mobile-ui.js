/* PrintLab Studio — Mobile UX v3
   Fixes only:
   1) Cart: preserve #cartCount + robust addCart call
   2) Share: reliable HTTP-safe share/copy
   3) Templates: mobile sheet using TEMPLATE_LIBRARY + setTileBackground
   Topbar styling left as-is (logo / 2D3D / cart icon). */
(() => {
  const MQ = '(max-width: 760px)';

  function isMob() {
    try { return window.matchMedia(MQ).matches; }
    catch (_) { return window.innerWidth <= 760; }
  }

  function injectStyles() {
    if (document.getElementById('printlabMobileUiStyles')) {
      document.getElementById('printlabMobileUiStyles').remove();
    }
    const style = document.createElement('style');
    style.id = 'printlabMobileUiStyles';
    style.textContent = `
@media (max-width: 760px) {
  /* Topbar — same as previous working version */
  header .logo-block,
  header .logo,
  header .header-tagline { display: none !important; }
  header .logo-group { max-width: none !important; flex: 0 0 auto !important; gap: 0 !important; }
  header .logo-printer { height: 34px !important; width: auto !important; display: block !important; }

  header .header-center {
    display: flex !important; flex: 1 1 auto !important;
    justify-content: center !important; min-width: 0 !important;
  }
  header .header-product-row {
    display: flex !important; flex-direction: row !important;
    align-items: center !important; gap: 6px !important; max-width: 100% !important;
  }
  header .header-badge-text { display: none !important; }
  header .header-product-row .badge-view-switch,
  header #viewSwitchBadge {
    display: flex !important; flex: 0 0 auto !important; gap: 2px !important;
    padding: 3px !important; border-radius: 999px !important;
    background: rgba(22,22,24,.92) !important;
    border: 1px solid var(--border, rgba(255,255,255,.1)) !important;
  }
  header .badge-view-switch button {
    display: inline-flex !important; align-items: center !important; justify-content: center !important;
    min-height: 32px !important; min-width: 40px !important; padding: 4px 10px !important;
    font-size: 11px !important; font-weight: 800 !important; border: 0 !important;
    border-radius: 999px !important; background: transparent !important;
    color: var(--muted, #9a9084) !important;
  }
  header .badge-view-switch button.active {
    background: linear-gradient(135deg, #e8d5b0 0%, var(--gold, #c9a66b) 55%, var(--gold-deep, #a8844a) 100%) !important;
    color: #1a1510 !important;
  }

  header .header-actions .header-btn:not(.pl-cart-icon) { display: none !important; }
  header .header-actions { display: flex !important; gap: 6px !important; flex: 0 0 auto !important; }

  header .header-actions .pl-cart-icon {
    display: inline-flex !important; align-items: center !important; justify-content: center !important;
    position: relative !important; width: 44px !important; height: 44px !important;
    min-width: 44px !important; min-height: 44px !important; padding: 0 !important;
    border-radius: 12px !important; border: 1px solid rgba(201,166,107,.35) !important;
    background: rgba(201,166,107,.12) !important; color: var(--gold, #c9a66b) !important;
    font-size: 20px !important; line-height: 1 !important; box-shadow: none !important;
  }
  header .header-actions .pl-cart-icon .pl-cart-badge,
  header .header-actions .pl-cart-icon #cartCount {
    position: absolute; top: 2px; right: 2px; min-width: 16px; height: 16px;
    padding: 0 4px; border-radius: 999px;
    background: linear-gradient(135deg, #e8d5b0, var(--gold, #c9a66b));
    color: #1a1510; font-size: 10px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
  }

  #printlabMyDesignsBtn {
    left: 12px !important;
    bottom: calc(var(--toolbar-h, 56px) + 12px + env(safe-area-inset-bottom, 0px)) !important;
    min-height: 44px; z-index: 9990;
  }

  /* Templates FAB */
  #plTemplatesFab {
    position: fixed;
    right: 12px;
    bottom: calc(var(--toolbar-h, 56px) + 12px + env(safe-area-inset-bottom, 0px));
    z-index: 9990;
    min-height: 44px;
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid rgba(201,166,107,.35);
    background: rgba(18,18,20,.94);
    color: #f0e6d8;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 6px 20px rgba(0,0,0,.4);
    -webkit-tap-highlight-color: transparent;
  }

  #printlabDesignModal {
    padding: max(8px, env(safe-area-inset-top, 0px)) 10px max(10px, env(safe-area-inset-bottom, 0px)) !important;
    align-items: flex-end !important;
  }
  #printlabDesignModal .printlab-design-box {
    width: 100% !important; max-width: 100% !important;
    max-height: min(92dvh, 92vh) !important; border-radius: 16px 16px 0 0 !important;
  }
  #printlabDesignModal .printlab-grid { grid-template-columns: 1fr !important; }
  #printlabDesignModal .printlab-card-actions button { min-height: 44px !important; }

  body, .app, .main, header { max-width: 100vw; overflow-x: hidden; }
}

/* Shared sheets */
#plCartSheetBackdrop, #plTplSheetBackdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.55);
  z-index: 10040; opacity: 0; pointer-events: none; transition: opacity .2s ease;
}
#plCartSheetBackdrop.open, #plTplSheetBackdrop.open {
  opacity: 1; pointer-events: auto;
}
#plCartSheet, #plTplSheet {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 10050;
  background: #161616; border: 1px solid rgba(201,166,107,.22); border-bottom: 0;
  border-radius: 18px 18px 0 0;
  padding: 12px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  transform: translateY(110%);
  transition: transform .28s cubic-bezier(.2,.8,.2,1);
  box-shadow: 0 -12px 40px rgba(0,0,0,.5);
  max-height: min(78dvh, 560px);
  overflow-y: auto; -webkit-overflow-scrolling: touch;
}
#plCartSheet.open, #plTplSheet.open { transform: translateY(0); }
.pl-sheet-handle {
  width: 40px; height: 4px; border-radius: 4px;
  background: rgba(255,255,255,.18); margin: 0 auto 14px;
}
.pl-sheet-title {
  font-size: 15px; font-weight: 700; color: #f0e6d8;
  margin: 0 0 4px; text-align: center;
}
.pl-sheet-price {
  text-align: center; color: var(--gold, #c9a66b);
  font-size: 20px; font-weight: 800; margin: 0 0 16px;
}
.pl-sheet-actions { display: flex; flex-direction: column; gap: 10px; }
.pl-sheet-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 48px; width: 100%; border-radius: 12px;
  border: 1px solid rgba(255,255,255,.1); background: #222; color: #f0e6d8;
  font-size: 15px; font-weight: 600; cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.pl-sheet-btn:active { transform: scale(.98); }
.pl-sheet-btn.primary {
  background: linear-gradient(135deg, #e8d5b0 0%, #c9a66b 55%, #a8844a 100%);
  color: #1a1510; border-color: transparent; font-weight: 800;
}
.pl-sheet-btn:disabled { opacity: .6; pointer-events: none; }
.pl-sheet-close { margin-top: 4px; background: transparent; border-color: transparent; color: #9a9084; font-weight: 500; }

#plTplSheet .pl-tpl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 12px 0 8px;
}
#plTplSheet .pl-tpl-card {
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 12px;
  overflow: hidden;
  background: #1e1e22;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  min-height: 88px;
  display: flex;
  flex-direction: column;
}
#plTplSheet .pl-tpl-card.active {
  border-color: var(--gold, #c9a66b);
  box-shadow: 0 0 0 1px rgba(201,166,107,.35);
}
#plTplSheet .pl-tpl-swatch {
  height: 56px;
  width: 100%;
}
#plTplSheet .pl-tpl-name {
  padding: 6px 4px;
  font-size: 11px;
  font-weight: 600;
  color: #e8dfd2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@keyframes pl-save-pulse {
  0%,100%{ opacity:1 } 50%{ opacity:.55 }
}
.pl-saving { animation: pl-save-pulse .9s ease-in-out infinite; }
`;
    document.head.appendChild(style);
  }

  /* ---------- helpers ---------- */
  function safeToast(msg) {
    try {
      if (typeof toast === 'function') toast(msg);
      else if (typeof window.toast === 'function') window.toast(msg);
      else console.info('[PrintLab]', msg);
    } catch (e) {
      console.info('[PrintLab]', msg);
    }
  }

  function callAddCart() {
    try {
      // Ensure #cartCount exists (addCart writes to it)
      ensureCartCountNode();
      if (typeof window.addCart === 'function') {
        window.addCart();
        return true;
      }
      if (typeof addCart === 'function') {
        addCart();
        return true;
      }
      safeToast('Winkelwagen niet beschikbaar');
      return false;
    } catch (err) {
      console.warn('[PrintLab] addCart error', err);
      // Fallback: increment locally + toast
      try {
        if (typeof cart === 'number') {
          // eslint-disable-next-line no-undef
          window.cart = (window.cart || 0) + (typeof qty === 'number' ? qty : 1);
        }
        ensureCartCountNode();
        const el = document.getElementById('cartCount');
        if (el) el.textContent = String(window.cart || 1);
        safeToast('Toegevoegd aan winkelwagen');
      } catch (_) {
        safeToast('Kon niet toevoegen aan winkelwagen');
      }
      return false;
    }
  }

  function ensureCartCountNode() {
    let el = document.getElementById('cartCount');
    if (el) return el;
    const btn = document.querySelector('.header-actions .pl-cart-icon');
    if (!btn) return null;
    el = document.createElement('span');
    el.id = 'cartCount';
    el.className = 'pl-cart-badge';
    el.textContent = '0';
    el.style.display = 'none';
    btn.appendChild(el);
    return el;
  }

  /* ---------- Share ---------- */
  function getShareUrl() {
    const id =
      (window.printLabApiStorage && window.printLabApiStorage.getCurrentDesignId && window.printLabApiStorage.getCurrentDesignId()) ||
      sessionStorage.getItem('labprintNL-active-design-id') ||
      localStorage.getItem('labprintNL-api-design-id') ||
      '';
    const base = location.origin + location.pathname.replace(/\/?$/, '/');
    return id ? base + '?design=' + encodeURIComponent(id) : base;
  }

  function copyTextFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    ta.remove();
    return ok;
  }

  async function shareDesign() {
    const hasId =
      (window.printLabApiStorage && window.printLabApiStorage.getCurrentDesignId && window.printLabApiStorage.getCurrentDesignId()) ||
      sessionStorage.getItem('labprintNL-active-design-id');

    if (!hasId && typeof window.saveDesign === 'function') {
      safeToast('Eerst opslaan…');
      try { await window.saveDesign(); } catch (_) {
        safeToast('Sla het ontwerp eerst op om te delen');
        return;
      }
    }

    const url = getShareUrl();
    const payload = {
      title: 'Mijn PrintLabNL ontwerp',
      text: 'Bekijk mijn ontwerp bij PrintLabNL',
      url
    };

    // 1) Native share
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }

    // 2) Clipboard API
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        safeToast('Ontwerplink gekopieerd');
        return;
      }
    } catch (_) {}

    // 3) execCommand fallback (works on HTTP)
    if (copyTextFallback(url)) {
      safeToast('Ontwerplink gekopieerd');
      return;
    }

    // 4) Last resort: prompt
    try {
      window.prompt('Kopieer deze ontwerplink:', url);
    } catch (_) {
      safeToast('Delen niet beschikbaar');
    }
  }
  window.shareDesign = shareDesign;

  /* ---------- Save ---------- */
  let saving = false;
  async function doSave() {
    if (saving) return;
    saving = true;
    const btns = document.querySelectorAll('[data-pl-save]');
    btns.forEach((b) => {
      b.disabled = true;
      b.classList.add('pl-saving');
      if (!b.dataset.plLabel) b.dataset.plLabel = b.textContent;
      b.textContent = 'Bezig…';
    });
    try {
      if (typeof window.saveDesign === 'function') await window.saveDesign();
      safeToast('Ontwerp opgeslagen');
      btns.forEach((b) => { b.textContent = 'Opgeslagen'; });
      setTimeout(() => {
        btns.forEach((b) => {
          b.textContent = b.dataset.plLabel || 'Ontwerp opslaan';
          b.disabled = false;
          b.classList.remove('pl-saving');
        });
      }, 1100);
    } catch (_) {
      btns.forEach((b) => {
        b.textContent = b.dataset.plLabel || 'Ontwerp opslaan';
        b.disabled = false;
        b.classList.remove('pl-saving');
      });
      safeToast('Opslaan mislukt');
    } finally {
      saving = false;
    }
  }

  function readPriceText() {
    const ids = ['purchaseFabPrice', 'totalPrice', 'unitMobile', 'cartTotal'];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        const t = (el.textContent || '').trim();
        if (t && /€|\d/.test(t)) return t;
      }
    }
    const fab = document.querySelector('.purchase-fab-price');
    if (fab) {
      const t = (fab.textContent || '').trim();
      if (t) return t;
    }
    return '';
  }

  function syncSheetPrice() {
    const el = document.getElementById('plCartSheetPrice');
    if (el) el.textContent = readPriceText() || '—';
  }

  function syncCartBadge() {
    ensureCartCountNode();
    const el = document.getElementById('cartCount');
    if (!el) return;
    const n = (el.textContent || '0').trim();
    el.style.display = n && n !== '0' ? 'flex' : 'none';
  }

  /* ---------- Cart sheet ---------- */
  function ensureCartSheet() {
    if (document.getElementById('plCartSheet')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'plCartSheetBackdrop';
    backdrop.addEventListener('click', closeCartSheet);

    const sheet = document.createElement('div');
    sheet.id = 'plCartSheet';
    sheet.setAttribute('role', 'dialog');
    sheet.innerHTML = `
      <div class="pl-sheet-handle" aria-hidden="true"></div>
      <div class="pl-sheet-title">Mijn ontwerp</div>
      <div class="pl-sheet-price" id="plCartSheetPrice">—</div>
      <div class="pl-sheet-actions">
        <button type="button" class="pl-sheet-btn" data-pl-save data-pl-label="Ontwerp opslaan">💾 Ontwerp opslaan</button>
        <button type="button" class="pl-sheet-btn" data-pl-share>↗ Ontwerp delen</button>
        <button type="button" class="pl-sheet-btn primary" data-pl-cart>🛒 Toevoegen aan winkelmandje</button>
        <button type="button" class="pl-sheet-btn pl-sheet-close" data-pl-close>Sluiten</button>
      </div>
    `;

    sheet.querySelector('[data-pl-save]').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      doSave();
    });
    sheet.querySelector('[data-pl-share]').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      shareDesign();
    });
    sheet.querySelector('[data-pl-cart]').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      callAddCart();
      syncCartBadge();
      // Keep sheet open briefly so user sees toast, then close
      setTimeout(closeCartSheet, 400);
    });
    sheet.querySelector('[data-pl-close]').addEventListener('click', closeCartSheet);

    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
  }

  function openCartSheet() {
    if (!isMob()) {
      callAddCart();
      return;
    }
    ensureCartSheet();
    syncSheetPrice();
    syncCartBadge();
    requestAnimationFrame(() => {
      document.getElementById('plCartSheetBackdrop')?.classList.add('open');
      document.getElementById('plCartSheet')?.classList.add('open');
    });
  }

  function closeCartSheet() {
    document.getElementById('plCartSheetBackdrop')?.classList.remove('open');
    document.getElementById('plCartSheet')?.classList.remove('open');
  }

  /* ---------- Templates sheet ---------- */
  function getTemplateList() {
    if (typeof TEMPLATE_LIBRARY !== 'undefined' && Array.isArray(TEMPLATE_LIBRARY)) {
      return TEMPLATE_LIBRARY;
    }
    if (window.TEMPLATE_LIBRARY && Array.isArray(window.TEMPLATE_LIBRARY)) {
      return window.TEMPLATE_LIBRARY;
    }
    return [];
  }

  function ensureTplSheet() {
    if (document.getElementById('plTplSheet')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'plTplSheetBackdrop';
    backdrop.addEventListener('click', closeTplSheet);

    const sheet = document.createElement('div');
    sheet.id = 'plTplSheet';
    sheet.setAttribute('role', 'dialog');
    sheet.innerHTML = `
      <div class="pl-sheet-handle" aria-hidden="true"></div>
      <div class="pl-sheet-title">Sjablonen</div>
      <div class="pl-tpl-grid" id="plTplGrid"></div>
      <div class="pl-sheet-actions">
        <button type="button" class="pl-sheet-btn pl-sheet-close" data-pl-close>Sluiten</button>
      </div>
    `;
    sheet.querySelector('[data-pl-close]').addEventListener('click', closeTplSheet);

    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
  }

  function renderTplGrid() {
    const grid = document.getElementById('plTplGrid');
    if (!grid) return;
    const list = getTemplateList();
    if (!list.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#9a9084;font-size:13px">Geen sjablonen gevonden</p>';
      return;
    }
    grid.innerHTML = list.map((t) => {
      const id = t.id || 'empty';
      const name = t.name || id;
      const fill = t.fill || '#333';
      return `<button type="button" class="pl-tpl-card" data-tpl-id="${id}">
        <div class="pl-tpl-swatch" style="background:${fill}"></div>
        <div class="pl-tpl-name">${name}</div>
      </button>`;
    }).join('');

    grid.querySelectorAll('[data-tpl-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-tpl-id');
        try {
          if (typeof window.setTileBackground === 'function') window.setTileBackground(id);
          else if (typeof setTileBackground === 'function') setTileBackground(id);
          else safeToast('Sjabloon niet beschikbaar');
        } catch (err) {
          console.warn(err);
          safeToast('Sjabloon laden mislukt');
        }
        grid.querySelectorAll('.pl-tpl-card').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        setTimeout(closeTplSheet, 250);
      });
    });
  }

  function openTplSheet() {
    ensureTplSheet();
    renderTplGrid();
    requestAnimationFrame(() => {
      document.getElementById('plTplSheetBackdrop')?.classList.add('open');
      document.getElementById('plTplSheet')?.classList.add('open');
    });
  }

  function closeTplSheet() {
    document.getElementById('plTplSheetBackdrop')?.classList.remove('open');
    document.getElementById('plTplSheet')?.classList.remove('open');
  }

  function ensureTplFab() {
    if (!isMob()) return;
    if (document.getElementById('plTemplatesFab')) return;
    const fab = document.createElement('button');
    fab.id = 'plTemplatesFab';
    fab.type = 'button';
    fab.textContent = '✨ Sjablonen';
    fab.addEventListener('click', (e) => {
      e.preventDefault();
      openTplSheet();
    });
    document.body.appendChild(fab);
  }

  /* ---------- Header cart icon (preserve #cartCount) ---------- */
  function enhanceHeader() {
    const actions = document.querySelector('.header-actions');
    if (!actions) return;

    actions.querySelectorAll('.header-btn').forEach((btn) => {
      const label = (btn.textContent || '').toLowerCase();
      if (label.includes('bestellen') || label.includes('winkel') || btn.classList.contains('primary')) {
        btn.classList.add('pl-cart-icon');
        // Preserve cartCount id so app.js addCart() keeps working
        const prev = (document.getElementById('cartCount')?.textContent || '0').trim();
        btn.innerHTML = '🛒<span id="cartCount" class="pl-cart-badge">' + prev + '</span>';
        btn.removeAttribute('onclick');
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openCartSheet();
        };
        btn.setAttribute('aria-label', 'Winkelwagen en acties');
        btn.title = 'Winkelwagen';
      }
    });
    syncCartBadge();
  }

  function init() {
    injectStyles();
    enhanceHeader();
    ensureCartSheet();
    ensureTplFab();
    // Re-check fab on resize
    window.addEventListener('resize', () => {
      if (isMob()) ensureTplFab();
      else {
        document.getElementById('plTemplatesFab')?.remove();
        closeTplSheet();
        closeCartSheet();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
