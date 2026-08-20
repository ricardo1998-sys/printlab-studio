/* Mijn ontwerpen - premium dark-luxury modal, Fase 1 */
(() => {
  const API_BASE = location.protocol === 'https:' ? 'https://api.printlabnl.nl' : 'http://api.printlabnl.nl';

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  function previewUrl(path) {
    if (!path) return '';
    let url = path;
    // Relative path → absolute on API host
    if (!/^https?:\/\//i.test(url)) {
      url = `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    // SSL on api.printlabnl.nl is broken → always use HTTP for previews
    url = url.replace(/^https:\/\/api\.printlabnl\.nl/i, 'http://api.printlabnl.nl');
    return url;
  }

  function formatDate(value) {
    if (!value) return '';
    const d = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString('nl-NL', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function friendlyError(error) {
    if (window.printLabApiStorage?.friendlyError) {
      return window.printLabApiStorage.friendlyError(error, 'Je ontwerpen konden momenteel niet worden geladen.');
    }
    const msg = (error && error.message) ? String(error.message) : '';
    console.error('[PrintLab Designs]', msg, error);
    if (/failed to fetch|network/i.test(msg)) {
      return 'Geen verbinding met de server. Controleer je internetverbinding en probeer het opnieuw.';
    }
    return 'Je ontwerpen konden momenteel niet worden geladen. Probeer het opnieuw.';
  }

  function addStyles() {
    if (document.getElementById('printlabDesignStyles')) return;
    const style = document.createElement('style');
    style.id = 'printlabDesignStyles';
    style.textContent = `
      #printlabMyDesignsBtn{
        position:fixed;left:16px;bottom:16px;z-index:9998;
        border:1px solid rgba(201,166,107,.5);background:#141414;color:#e8d8b5;
        border-radius:12px;padding:11px 16px;font-weight:700;font-size:14px;
        cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.4);
        font-family:Inter,system-ui,sans-serif;letter-spacing:.02em;
        transition:background .2s,border-color .2s,transform .15s;
      }
      #printlabMyDesignsBtn:hover{background:#1c1c1c;border-color:rgba(201,166,107,.75);transform:translateY(-1px)}
      #printlabMyDesignsBtn:active{transform:translateY(0)}

      #printlabDesignModal{
        position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.78);
        display:none;align-items:center;justify-content:center;padding:16px;
        backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
      }
      .printlab-design-box{
        width:min(920px,100%);max-height:90vh;overflow:auto;
        background:linear-gradient(165deg,#161616 0%,#121212 100%);
        color:#eee;border:1px solid #3a3228;border-radius:18px;
        padding:0;box-shadow:0 24px 80px rgba(0,0,0,.65);
        display:flex;flex-direction:column;
      }
      .printlab-design-head{
        display:flex;justify-content:space-between;align-items:center;
        padding:20px 22px 16px;border-bottom:1px solid #2a2520;flex-shrink:0;
      }
      .printlab-design-head h2{
        margin:0;font-size:1.25rem;font-weight:700;color:#f0e6d2;
        letter-spacing:.03em;font-family:Inter,system-ui,sans-serif;
      }
      .printlab-close{
        border:0;background:#252525;color:#ccc;width:36px;height:36px;
        border-radius:10px;cursor:pointer;font-size:20px;line-height:1;
        transition:background .15s,color .15s;
      }
      .printlab-close:hover{background:#333;color:#fff}

      #printlabDesignList{padding:16px 20px 22px;overflow:auto;flex:1}

      /* Grid */
      .printlab-grid{
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
        gap:16px;
      }
      @media(max-width:540px){
        .printlab-grid{grid-template-columns:1fr}
      }
      @media(min-width:541px) and (max-width:720px){
        .printlab-grid{grid-template-columns:repeat(2,1fr)}
      }

      .printlab-card{
        background:#1a1a1a;border:1px solid #2e2a24;border-radius:14px;
        overflow:hidden;display:flex;flex-direction:column;
        transition:border-color .2s,box-shadow .2s;
      }
      .printlab-card:hover{border-color:rgba(201,166,107,.45);box-shadow:0 8px 24px rgba(0,0,0,.35)}

      .printlab-card-preview{
        aspect-ratio:1;background:#222;display:flex;align-items:center;justify-content:center;
        position:relative;overflow:hidden;
      }
      .printlab-card-preview img{
        width:100%;height:100%;object-fit:cover;display:block;
      }
      .printlab-card-placeholder{
        color:#666;font-size:13px;text-align:center;padding:16px;
        display:flex;flex-direction:column;align-items:center;gap:8px;
      }
      .printlab-card-placeholder svg{width:36px;height:36px;opacity:.5}

      .printlab-card-body{padding:14px 14px 12px;flex:1;display:flex;flex-direction:column;gap:6px}
      .printlab-card-title{
        font-weight:700;font-size:14px;color:#f2e9d8;line-height:1.3;
        display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
      }
      .printlab-card-meta{font-size:12px;color:#999;line-height:1.4}
      .printlab-card-meta span{display:block}

      .printlab-card-actions{
        display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 14px;
      }
      .printlab-card-actions button{
        flex:1;min-width:0;border:0;border-radius:9px;padding:9px 10px;
        font-weight:700;font-size:12px;cursor:pointer;
        font-family:Inter,system-ui,sans-serif;transition:opacity .15s,background .15s;
      }
      .printlab-card-actions button:disabled{opacity:.5;cursor:wait}
      .pl-btn-edit{background:#c9a66b;color:#111}
      .pl-btn-edit:hover{background:#d4b57a}
      .pl-btn-dup{background:#2a2a2a;color:#e0d4b8;border:1px solid #3a352c !important}
      .pl-btn-dup:hover{background:#333}
      .pl-btn-del{background:#2a1e1e;color:#e8a0a0;border:1px solid #3d2a2a !important}
      .pl-btn-del:hover{background:#3a2525}

      /* Empty / loading / error */
      .printlab-state{
        text-align:center;padding:40px 20px 32px;color:#aaa;
      }
      .printlab-state h3{margin:0 0 10px;color:#e8dcc0;font-size:1.1rem;font-weight:700}
      .printlab-state p{margin:0 0 20px;font-size:14px;line-height:1.55;max-width:360px;margin-left:auto;margin-right:auto}
      .printlab-state-icon{font-size:42px;margin-bottom:12px;opacity:.7}
      .printlab-btn-primary{
        display:inline-flex;align-items:center;justify-content:center;gap:8px;
        background:#c9a66b;color:#111;border:0;border-radius:11px;
        padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;
        font-family:Inter,system-ui,sans-serif;transition:background .15s,transform .15s;
      }
      .printlab-btn-primary:hover{background:#d4b57a;transform:translateY(-1px)}
      .printlab-btn-secondary{
        display:inline-flex;align-items:center;justify-content:center;
        background:#252525;color:#ddd;border:1px solid #3a3a3a;border-radius:11px;
        padding:11px 20px;font-weight:600;font-size:14px;cursor:pointer;
        font-family:Inter,system-ui,sans-serif;margin-top:10px;
      }
      .printlab-btn-secondary:hover{background:#303030}

      .printlab-loading{
        display:flex;flex-direction:column;align-items:center;gap:14px;
        padding:48px 20px;color:#bbb;
      }
      .printlab-spinner{
        width:36px;height:36px;border:3px solid #333;border-top-color:#c9a66b;
        border-radius:50%;animation:pl-spin .7s linear infinite;
      }
      @keyframes pl-spin{to{transform:rotate(360deg)}}

      /* Confirm dialog */
      .printlab-confirm-overlay{
        position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.7);
        display:flex;align-items:center;justify-content:center;padding:20px;
      }
      .printlab-confirm-box{
        background:#1a1a1a;border:1px solid #3a3228;border-radius:16px;
        padding:24px;max-width:360px;width:100%;text-align:center;
        box-shadow:0 20px 60px rgba(0,0,0,.5);
      }
      .printlab-confirm-box p{margin:0 0 20px;color:#ddd;font-size:15px;line-height:1.45}
      .printlab-confirm-actions{display:flex;gap:10px;justify-content:center}
      .printlab-confirm-actions button{
        flex:1;border:0;border-radius:10px;padding:11px 16px;font-weight:700;
        font-size:14px;cursor:pointer;font-family:Inter,system-ui,sans-serif;
      }
      .pl-confirm-cancel{background:#2a2a2a;color:#ccc}
      .pl-confirm-cancel:hover{background:#333}
      .pl-confirm-ok{background:#8b3a3a;color:#fff}
      .pl-confirm-ok:hover{background:#a04444}
    `;
    document.head.appendChild(style);
  }

  function createUi() {
    if (document.getElementById('printlabMyDesignsBtn')) return;

    const button = document.createElement('button');
    button.id = 'printlabMyDesignsBtn';
    button.type = 'button';
    button.textContent = 'Mijn ontwerpen';
    button.setAttribute('aria-label', 'Mijn opgeslagen ontwerpen bekijken');
    button.onclick = () => openDesigns();

    const modal = document.createElement('div');
    modal.id = 'printlabDesignModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'printlabDesignTitle');
    modal.innerHTML = `
      <div class="printlab-design-box">
        <div class="printlab-design-head">
          <h2 id="printlabDesignTitle">Mijn ontwerpen</h2>
          <button type="button" class="printlab-close" id="printlabCloseDesigns" aria-label="Sluiten">×</button>
        </div>
        <div id="printlabDesignList"></div>
      </div>`;
    modal.addEventListener('click', (e) => { if (e.target === modal) closeDesigns(); });

    document.body.appendChild(button);
    document.body.appendChild(modal);
    document.getElementById('printlabCloseDesigns').onclick = closeDesigns;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') closeDesigns();
    });
  }

  async function fetchDesigns() {
    const response = await fetch(`${API_BASE}/designs`, { headers: { Accept: 'application/json' } });
    let data = {};
    try { data = await response.json(); } catch { data = {}; }
    if (!response.ok || data.status !== 'ok') {
      throw new Error(data.message || `API HTTP ${response.status}`);
    }
    let designs = Array.isArray(data.designs) ? data.designs : [];

    // Client-side isolation: only show designs this guest has interacted with
    const myIds = (window.printLabApiStorage && window.printLabApiStorage.getMyDesignIds)
      ? window.printLabApiStorage.getMyDesignIds()
      : [];
    if (myIds.length > 0) {
      const set = new Set(myIds.map(String));
      const filtered = designs.filter((d) => set.has(String(d.id)));
      // If filter yields nothing but API has designs, still prefer filter
      // (user may have cleared localStorage — then they see empty, which is safer)
      designs = filtered;
    } else {
      // No known IDs yet → show empty (prevents seeing other guests' designs)
      designs = [];
    }
    return designs;
  }

  function renderLoading(list) {
    list.innerHTML = `
      <div class="printlab-loading">
        <div class="printlab-spinner" aria-hidden="true"></div>
        <span>Ontwerpen laden...</span>
      </div>`;
  }

  function renderEmpty(list) {
    list.innerHTML = `
      <div class="printlab-state">
        <div class="printlab-state-icon" aria-hidden="true">✦</div>
        <h3>Je hebt nog geen ontwerpen opgeslagen</h3>
        <p>Maak je eerste persoonlijke ontwerp en bewaar het hier zodat je er later verder aan kunt werken.</p>
        <button type="button" class="printlab-btn-primary" id="printlabNewDesignBtn">Nieuw ontwerp maken</button>
      </div>`;
    const btn = document.getElementById('printlabNewDesignBtn');
    if (btn) {
      btn.onclick = () => {
        closeDesigns();
        if (typeof window.startNewDesign === 'function') {
          window.startNewDesign();
        } else if (window.printLabApiStorage?.startNew) {
          window.printLabApiStorage.startNew();
        } else if (typeof toast === 'function') {
          toast('Start een nieuw ontwerp via de editor');
        }
      };
    }
  }

  function renderError(list, message) {
    list.innerHTML = `
      <div class="printlab-state">
        <div class="printlab-state-icon" aria-hidden="true">⚠</div>
        <h3>Kon ontwerpen niet laden</h3>
        <p>${escapeHtml(message)}</p>
        <button type="button" class="printlab-btn-primary" id="printlabRetryBtn">Opnieuw proberen</button>
      </div>`;
    const btn = document.getElementById('printlabRetryBtn');
    if (btn) btn.onclick = () => openDesigns();
  }

  function resolvePreview(design) {
    const fromApi = previewUrl(design.preview_url);
    if (fromApi) return fromApi;
    // Fallback: local cache (when preview.php is blocked by CORS)
    try {
      const cached = window.printLabApiStorage?.getCachedPreview?.(design.id);
      if (cached && String(cached).startsWith('data:image/')) return cached;
    } catch (_) {}
    return '';
  }

  function cardHtml(design) {
    const preview = resolvePreview(design);
    const title = escapeHtml(design.name || 'Naamloos ontwerp');
    const product = escapeHtml(design.product_type || 'Product');
    const date = escapeHtml(formatDate(design.updated_at || design.created_at));
    const id = escapeHtml(String(design.id));

    let previewHtml;
    if (preview) {
      previewHtml = `<img src="${escapeHtml(preview)}" alt="" loading="lazy" decoding="async"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="printlab-card-placeholder" style="display:none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          Geen preview
        </div>`;
    } else {
      previewHtml = `<div class="printlab-card-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        Nog geen preview
      </div>`;
    }

    return `
      <article class="printlab-card" data-id="${id}">
        <div class="printlab-card-preview">${previewHtml}</div>
        <div class="printlab-card-body">
          <div class="printlab-card-title">${title}</div>
          <div class="printlab-card-meta">
            <span>${product}</span>
            <span>${date}</span>
          </div>
        </div>
        <div class="printlab-card-actions">
          <button type="button" class="pl-btn-edit" data-edit="${id}">Bewerken</button>
          <button type="button" class="pl-btn-dup" data-dup="${id}">Dupliceren</button>
          <button type="button" class="pl-btn-del" data-del="${id}">Verwijderen</button>
        </div>
      </article>`;
  }

  function confirmDelete(message) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'printlab-confirm-overlay';
      overlay.innerHTML = `
        <div class="printlab-confirm-box" role="alertdialog" aria-modal="true">
          <p>${escapeHtml(message)}</p>
          <div class="printlab-confirm-actions">
            <button type="button" class="pl-confirm-cancel">Annuleren</button>
            <button type="button" class="pl-confirm-ok">Verwijderen</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      const cleanup = (result) => {
        overlay.remove();
        resolve(result);
      };
      overlay.querySelector('.pl-confirm-cancel').onclick = () => cleanup(false);
      overlay.querySelector('.pl-confirm-ok').onclick = () => cleanup(true);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(false); });
    });
  }

  async function openDesign(id) {
    try {
      if (typeof window.loadDesignFromAPI === 'function') {
        await window.loadDesignFromAPI(id);
      } else {
        throw new Error('Studio laadfunctie ontbreekt');
      }
      closeDesigns();
    } catch (error) {
      const msg = friendlyError(error);
      if (typeof toast === 'function') toast(msg);
      else alert(msg);
    }
  }

  async function duplicateDesign(id) {
    const card = document.querySelector(`.printlab-card[data-id="${CSS.escape(String(id))}"]`);
    const btns = card ? card.querySelectorAll('button') : [];
    btns.forEach((b) => { b.disabled = true; });
    try {
      if (typeof window.duplicateDesignById === 'function') {
        await window.duplicateDesignById(id);
        closeDesigns();
      } else {
        throw new Error('Dupliceren niet beschikbaar');
      }
    } catch (error) {
      const msg = friendlyError(error);
      if (typeof toast === 'function') toast(msg);
      btns.forEach((b) => { b.disabled = false; });
    }
  }

  async function deleteDesign(id) {
    const ok = await confirmDelete('Weet je zeker dat je dit ontwerp wilt verwijderen? Dit kan niet ongedaan worden gemaakt.');
    if (!ok) return;

    const card = document.querySelector(`.printlab-card[data-id="${CSS.escape(String(id))}"]`);
    if (card) card.style.opacity = '0.5';

    try {
      if (typeof window.deleteDesignById === 'function') {
        await window.deleteDesignById(id);
      } else {
        const response = await fetch(`${API_BASE}/designs/${encodeURIComponent(id)}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok || data.status !== 'ok') throw new Error(data.message || `HTTP ${response.status}`);
      }
      if (typeof toast === 'function') toast('Ontwerp verwijderd');
      await openDesigns();
    } catch (error) {
      if (card) card.style.opacity = '1';
      const msg = friendlyError(error);
      if (typeof toast === 'function') toast(msg);
    }
  }

  async function openDesigns() {
    const modal = document.getElementById('printlabDesignModal');
    const list = document.getElementById('printlabDesignList');
    if (!modal || !list) return;
    modal.style.display = 'flex';
    renderLoading(list);

    try {
      const designs = await fetchDesigns();
      if (!designs.length) {
        renderEmpty(list);
        return;
      }

      list.innerHTML = `<div class="printlab-grid">${designs.map(cardHtml).join('')}</div>`;

      list.querySelectorAll('[data-edit]').forEach((btn) => {
        btn.onclick = () => openDesign(btn.dataset.edit);
      });
      list.querySelectorAll('[data-dup]').forEach((btn) => {
        btn.onclick = () => duplicateDesign(btn.dataset.dup);
      });
      list.querySelectorAll('[data-del]').forEach((btn) => {
        btn.onclick = () => deleteDesign(btn.dataset.del);
      });
    } catch (error) {
      renderError(list, friendlyError(error));
    }
  }

  function closeDesigns() {
    const modal = document.getElementById('printlabDesignModal');
    if (modal) modal.style.display = 'none';
  }

  function init() {
    addStyles();
    createUi();
  }

  window.openPrintLabDesigns = openDesigns;
  window.closePrintLabDesigns = closeDesigns;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
