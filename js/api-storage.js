/* PrintLab Studio -> API opslag + echte previews + guest/session binding
   Fase 1: robuust design-ID systeem, update vs create, guest isolation */
(() => {
  const API_BASE_URL = location.protocol === 'https:' ? 'https://api.printlabnl.nl' : 'http://api.printlabnl.nl';
  const API_ID_KEY = 'labprintNL-api-design-id';
  const ACTIVE_ID_KEY = 'labprintNL-active-design-id';
  const GUEST_ID_KEY = 'printlab_guest_id';
  const MY_IDS_KEY = 'printlab_my_design_ids';
  const PREVIEW_CACHE_KEY = 'printlab_preview_cache';
  const originalSaveDesign = window.saveDesign;

  /* ---------- Guest / session identifier ---------- */
  function getGuestId() {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id || id.length < 8) {
      id = 'g_' + ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
      try { localStorage.setItem(GUEST_ID_KEY, id); } catch (_) {}
    }
    return id;
  }

  function getMyDesignIds() {
    try {
      const raw = localStorage.getItem(MY_IDS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch { return []; }
  }

  function addMyDesignId(id) {
    if (!id) return;
    const ids = getMyDesignIds();
    const s = String(id);
    if (!ids.includes(s)) {
      ids.unshift(s);
      try { localStorage.setItem(MY_IDS_KEY, JSON.stringify(ids.slice(0, 200))); } catch (_) {}
    }
  }

  function removeMyDesignId(id) {
    const s = String(id);
    const ids = getMyDesignIds().filter((x) => x !== s);
    try { localStorage.setItem(MY_IDS_KEY, JSON.stringify(ids)); } catch (_) {}
  }

  /* ---------- Active design ID ---------- */
  const getActiveId = () => sessionStorage.getItem(ACTIVE_ID_KEY) || localStorage.getItem(API_ID_KEY) || null;

  const setActiveId = (id) => {
    if (id) {
      sessionStorage.setItem(ACTIVE_ID_KEY, String(id));
      localStorage.setItem(API_ID_KEY, String(id));
      addMyDesignId(id);
    }
  };

  const clearActiveId = () => {
    sessionStorage.removeItem(ACTIVE_ID_KEY);
    localStorage.removeItem(API_ID_KEY);
  };

  /* ---------- Payload builders ---------- */
  function apiObjects() {
    if (!Array.isArray(objects)) return [];
    return objects.map((o) => {
      const copy = { ...o };
      delete copy.img;
      delete copy._filterCanvas;
      delete copy._filterKey;
      if (o.type === 'image' && o.img) {
        const src = o.img.currentSrc || o.img.src || '';
        if (src) copy.image_data = src;
      }
      return copy;
    });
  }

  function buildPayload(overrides = {}) {
    const productData = products && products[product] ? products[product] : null;
    const defaultName = `Mijn ${productData?.name || 'PrintLab'} ontwerp`;
    return {
      name: overrides.name || defaultName,
      product_type: productData?.name ? productData.name.toLowerCase() : String(product || 'custom'),
      status: 'saved',
      guest_id: getGuestId(),
      design_data: {
        product: product || null,
        size: size || null,
        finish: finish || null,
        edge: !!edge,
        qty: Number(qty || 1),
        guest_id: getGuestId()
      },
      objects: apiObjects(),
      ...overrides
    };
  }

  async function requestJson(url, method, payload) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    };
    if (payload !== undefined) opts.body = JSON.stringify(payload);
    const response = await fetch(url, opts);
    let data = {};
    try {
      data = await response.json();
    } catch {
      throw new Error(`API gaf geen geldige JSON terug (HTTP ${response.status})`);
    }
    return { response, data };
  }

  function friendlyError(error, fallback) {
    const msg = (error && error.message) ? String(error.message) : String(error || '');
    console.error('[PrintLab API]', msg, error);
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(msg)) {
      return 'Geen verbinding met de server. Controleer je internetverbinding en probeer het opnieuw.';
    }
    if (/http 5\d\d|500|502|503/i.test(msg)) {
      return 'De server is tijdelijk niet bereikbaar. Probeer het zo opnieuw.';
    }
    if (/http 404|niet gevonden/i.test(msg)) {
      return 'Dit ontwerp kon niet worden gevonden. Het is mogelijk verwijderd.';
    }
    if (/http 4\d\d/i.test(msg)) {
      return 'Het verzoek kon niet worden verwerkt. Probeer het opnieuw.';
    }
    return fallback || 'Er is iets misgegaan. Probeer het opnieuw.';
  }

  /* ---------- Save (create or update) ---------- */
  async function saveRecord(options = {}) {
    const forceNew = !!options.forceNew;
    const nameOverride = options.name || null;
    const payload = buildPayload(nameOverride ? { name: nameOverride } : {});
    let activeId = forceNew ? null : getActiveId();

    if (!activeId) {
      const result = await requestJson(`${API_BASE_URL}/designs`, 'POST', payload);
      if (!result.response.ok || result.data.status !== 'ok') {
        throw new Error(result.data.message || `Opslaan mislukt (HTTP ${result.response.status})`);
      }
      const id = result.data.design_id;
      if (id) setActiveId(id);
      return { ...result.data, design_id: id, created: true };
    }

    const update = await requestJson(
      `${API_BASE_URL}/designs/${encodeURIComponent(activeId)}`,
      'PUT',
      payload
    );

    if (update.response.status === 404) {
      clearActiveId();
      removeMyDesignId(activeId);
      const create = await requestJson(`${API_BASE_URL}/designs`, 'POST', payload);
      if (!create.response.ok || create.data.status !== 'ok') {
        throw new Error(create.data.message || `Opslaan mislukt (HTTP ${create.response.status})`);
      }
      const id = create.data.design_id;
      if (id) setActiveId(id);
      return { ...create.data, design_id: id, created: true };
    }

    if (!update.response.ok || update.data.status !== 'ok') {
      throw new Error(update.data.message || `Bijwerken mislukt (HTTP ${update.response.status})`);
    }
    return { ...update.data, design_id: Number(activeId) || activeId, created: false };
  }


  function readPreviewCache() {
    try {
      const raw = localStorage.getItem(PREVIEW_CACHE_KEY);
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === 'object' ? obj : {};
    } catch { return {}; }
  }

  function writePreviewCache(map) {
    try {
      // Keep cache bounded
      const ids = Object.keys(map);
      if (ids.length > 80) {
        ids.slice(0, ids.length - 80).forEach((k) => delete map[k]);
      }
      localStorage.setItem(PREVIEW_CACHE_KEY, JSON.stringify(map));
    } catch (e) {
      console.warn('[PrintLab] preview cache write failed', e);
    }
  }

  function cachePreviewDataUrl(designId, dataUrl) {
    if (!designId || !dataUrl) return;
    const map = readPreviewCache();
    map[String(designId)] = dataUrl;
    writePreviewCache(map);
  }

  function getCachedPreview(designId) {
    if (!designId) return '';
    const map = readPreviewCache();
    return map[String(designId)] || '';
  }

  function capturePreview() {
    // Prefer a downscaled offscreen copy — more reliable + smaller payload
    const sources = [];
    if (typeof canvas !== 'undefined' && canvas) sources.push(canvas);
    if (typeof designBuffer !== 'undefined' && designBuffer) sources.push(designBuffer);

    let lastErr = null;
    for (const src of sources) {
      try {
        const sw = src.width || 1200;
        const sh = src.height || 1200;
        const maxSide = 480;
        const scale = Math.min(1, maxSide / Math.max(sw, sh));
        const tw = Math.max(1, Math.round(sw * scale));
        const th = Math.max(1, Math.round(sh * scale));
        const off = document.createElement('canvas');
        off.width = tw;
        off.height = th;
        const octx = off.getContext('2d');
        octx.fillStyle = '#ffffff';
        octx.fillRect(0, 0, tw, th);
        octx.drawImage(src, 0, 0, sw, sh, 0, 0, tw, th);
        const data = off.toDataURL('image/jpeg', 0.82);
        if (data && data.startsWith('data:image/') && data.length > 500) {
          return data;
        }
      } catch (error) {
        lastErr = error;
        console.warn('[PrintLab] preview source failed', error);
      }
    }

    // Last resort: direct toDataURL on main canvas
    try {
      if (typeof canvas !== 'undefined' && canvas && canvas.toDataURL) {
        const data = canvas.toDataURL('image/jpeg', 0.7);
        if (data && data.startsWith('data:image/')) return data;
      }
    } catch (error) {
      lastErr = error;
    }

    throw new Error(
      'Canvas-preview kon niet worden gemaakt' +
      (lastErr ? (': ' + (lastErr.message || String(lastErr))) : '')
    );
  }

  async function savePreview(designId) {
    const previewData = capturePreview();
    console.info('[PrintLab] preview payload bytes≈', previewData.length);

    // Always cache locally so Mijn Ontwerpen can show a preview even if API upload is blocked (CORS)
    cachePreviewDataUrl(designId, previewData);

    // Try API upload. preview.php currently lacks CORS for studio.printlabnl.nl → may fail in browser.
    let previewUrl = '';
    try {
      const result = await requestJson(`${API_BASE_URL}/preview.php`, 'POST', {
        design_id: Number(designId),
        image: previewData,
        guest_id: getGuestId()
      });
      if (!result.response.ok || result.data.status !== 'ok') {
        const detail = result.data.detail ? ` — ${result.data.detail}` : '';
        throw new Error(
          (result.data.message || `Preview upload mislukt (HTTP ${result.response.status})`) + detail
        );
      }
      previewUrl = result.data.preview_url || result.data.url || '';
      if (previewUrl) {
        previewUrl = String(previewUrl).replace(/^https:\/\/api\.printlabnl\.nl/i, 'http://api.printlabnl.nl');
        if (previewUrl.startsWith('/')) {
          previewUrl = API_BASE_URL.replace(/\/$/, '') + previewUrl;
        }
        try {
          await requestJson(
            `${API_BASE_URL}/designs/${encodeURIComponent(designId)}`,
            'PUT',
            { preview_url: previewUrl }
          );
        } catch (e) {
          console.warn('[PrintLab] PUT preview_url failed', e);
        }
      }
      return { ...(result.data || {}), preview_url: previewUrl || null, cached: true };
    } catch (error) {
      // CORS / network: local cache already set — still a usable preview for this browser
      console.warn('[PrintLab] preview API upload mislukt (vaak CORS). Lokale preview blijft beschikbaar.', error);
      return { status: 'cached', design_id: designId, preview_url: null, cached: true };
    }
  }

  /* ---------- Public: saveDesign (overwrites window) ---------- */
  window.saveDesign = async function saveDesignWithApi(options = {}) {
    if (typeof toast === 'function') toast('Ontwerp opslaan...');

    if (typeof originalSaveDesign === 'function') {
      try { originalSaveDesign(); } catch (error) { console.warn('Lokale opslag mislukt:', error); }
    }

    try {
      const record = await saveRecord(options);
      try {
        await savePreview(record.design_id);
        if (typeof toast === 'function') {
          toast(record.created ? 'Nieuw ontwerp opgeslagen' : 'Ontwerp bijgewerkt');
        }
      } catch (previewError) {
        console.warn('Preview opslaan mislukt:', previewError);
        if (typeof toast === 'function') {
          toast('Ontwerp opgeslagen (preview kon niet worden gemaakt)');
        }
      }
      return record;
    } catch (error) {
      const friendly = friendlyError(error, 'Opslaan mislukt. Probeer het opnieuw.');
      if (typeof toast === 'function') toast(friendly);
      throw error;
    }
  };

  /* ---------- Load design from API ---------- */
  window.loadDesignFromAPI = async function loadDesignFromAPI(designId) {
    if (typeof toast === 'function') toast('Ontwerp openen...');

    const response = await fetch(
      `${API_BASE_URL}/designs/${encodeURIComponent(designId)}`,
      { headers: { Accept: 'application/json' } }
    );
    let data = {};
    try { data = await response.json(); } catch { data = {}; }

    if (!response.ok || data.status !== 'ok' || !data.design) {
      throw new Error(data.message || `API HTTP ${response.status}`);
    }

    const design = data.design;
    let designData = design.design_data;
    if (typeof designData === 'string') {
      try { designData = JSON.parse(designData || '{}'); } catch { designData = {}; }
    }

    if (designData?.product && products?.[designData.product]) product = designData.product;
    if (designData?.size) size = designData.size;
    if (designData?.finish) finish = designData.finish;
    edge = !!designData?.edge;
    qty = Math.max(1, Number(designData?.qty || 1));

    const rows = Array.isArray(design.objects) ? design.objects : [];
    const loadedObjects = await Promise.all(rows.map(async (row) => {
      let value = row.object_data;
      if (typeof value === 'string') {
        try { value = JSON.parse(value); } catch { value = {}; }
      }
      const object = { ...(value || {}), type: row.object_type || value?.type || 'unknown' };
      if (object.type === 'image' && object.image_data) {
        await new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            object.img = image;
            object.width = object.width || image.naturalWidth || image.width || 1;
            object.height = object.height || image.naturalHeight || image.height || 1;
            resolve();
          };
          image.onerror = resolve;
          image.src = object.image_data;
        });
      }
      return object;
    }));

    objects = loadedObjects;
    selected = null;
    setActiveId(design.id);
    addMyDesignId(design.id);

    if (typeof renderSizes === 'function') renderSizes();
    if (typeof updatePrice === 'function') updatePrice();
    if (typeof syncProductCard === 'function') syncProductCard();
    if (typeof draw === 'function') draw();
    if (typeof layers === 'function') layers();
    if (typeof refresh3D === 'function') refresh3D();
    if (typeof toast === 'function') toast('Ontwerp geladen');
    return design;
  };

  /* ---------- Start a completely new design ---------- */
  window.startNewDesign = function startNewDesign() {
    clearActiveId();
    objects = [];
    selected = null;
    if (typeof qty !== 'undefined') qty = 1;
    if (typeof edge !== 'undefined') edge = false;
    if (typeof draw === 'function') draw();
    if (typeof layers === 'function') layers();
    if (typeof refresh3D === 'function') refresh3D();
    if (typeof updatePrice === 'function') updatePrice();
    if (typeof syncProductCard === 'function') syncProductCard();
    if (typeof toast === 'function') toast('Nieuw ontwerp gestart');
  };

  /* ---------- Duplicate current design (or given id) ---------- */
  window.duplicateDesignById = async function duplicateDesignById(sourceId) {
    if (typeof toast === 'function') toast('Ontwerp dupliceren...');

    const response = await fetch(
      `${API_BASE_URL}/designs/${encodeURIComponent(sourceId)}`,
      { headers: { Accept: 'application/json' } }
    );
    let data = {};
    try { data = await response.json(); } catch { data = {}; }
    if (!response.ok || data.status !== 'ok' || !data.design) {
      throw new Error(data.message || `API HTTP ${response.status}`);
    }

    const design = data.design;
    let designData = design.design_data;
    if (typeof designData === 'string') {
      try { designData = JSON.parse(designData || '{}'); } catch { designData = {}; }
    }

    if (designData?.product && products?.[designData.product]) product = designData.product;
    if (designData?.size) size = designData.size;
    if (designData?.finish) finish = designData.finish;
    edge = !!designData?.edge;
    qty = Math.max(1, Number(designData?.qty || 1));

    const rows = Array.isArray(design.objects) ? design.objects : [];
    objects = await Promise.all(rows.map(async (row) => {
      let value = row.object_data;
      if (typeof value === 'string') {
        try { value = JSON.parse(value); } catch { value = {}; }
      }
      const object = { ...(value || {}), type: row.object_type || value?.type || 'unknown' };
      if (object.type === 'image' && object.image_data) {
        await new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            object.img = image;
            object.width = object.width || image.naturalWidth || image.width || 1;
            object.height = object.height || image.naturalHeight || image.height || 1;
            resolve();
          };
          image.onerror = resolve;
          image.src = object.image_data;
        });
      }
      return object;
    }));
    selected = null;

    const baseName = design.name || 'Mijn ontwerp';
    const newName = baseName.startsWith('Kopie van ') ? baseName : `Kopie van ${baseName}`;

    clearActiveId();
    const record = await saveRecord({ forceNew: true, name: newName });

    try { await savePreview(record.design_id); } catch (e) { console.warn('Preview bij duplicaat mislukt', e); }

    setActiveId(record.design_id);
    if (typeof renderSizes === 'function') renderSizes();
    if (typeof updatePrice === 'function') updatePrice();
    if (typeof syncProductCard === 'function') syncProductCard();
    if (typeof draw === 'function') draw();
    if (typeof layers === 'function') layers();
    if (typeof refresh3D === 'function') refresh3D();
    if (typeof toast === 'function') toast('Kopie gemaakt en geopend');
    return record;
  };

  /* ---------- Delete ---------- */
  window.deleteDesignById = async function deleteDesignById(designId) {
    const response = await fetch(
      `${API_BASE_URL}/designs/${encodeURIComponent(designId)}`,
      { method: 'DELETE', headers: { Accept: 'application/json' } }
    );
    let data = {};
    try { data = await response.json(); } catch { data = {}; }
    if (!response.ok || data.status !== 'ok') {
      throw new Error(data.message || `Verwijderen mislukt (HTTP ${response.status})`);
    }
    removeMyDesignId(designId);
    if (String(getActiveId()) === String(designId)) clearActiveId();
    return true;
  };

  /* ---------- List helpers for my-designs.js ---------- */
  window.printLabApiStorage = {
    apiBaseUrl: API_BASE_URL,
    getGuestId,
    getCurrentDesignId: getActiveId,
    clearCurrentDesignId: clearActiveId,
    setCurrentDesignId: setActiveId,
    getMyDesignIds,
    addMyDesignId,
    removeMyDesignId,
    save: saveRecord,
    savePreview,
    friendlyError,
    startNew: window.startNewDesign,
    getCachedPreview,
    cachePreviewDataUrl
  };
})();
