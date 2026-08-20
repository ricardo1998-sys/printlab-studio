/* PrintLab Studio -> API opslag + echte previews */
(() => {
  const API_BASE_URL = location.protocol === 'https:' ? 'https://api.printlabnl.nl' : 'http://api.printlabnl.nl';
  const API_ID_KEY = 'labprintNL-api-design-id';
  const ACTIVE_ID_KEY = 'labprintNL-active-design-id';
  const originalSaveDesign = window.saveDesign;

  const getActiveId = () => sessionStorage.getItem(ACTIVE_ID_KEY) || null;
  const setActiveId = (id) => {
    if (id) {
      sessionStorage.setItem(ACTIVE_ID_KEY, String(id));
      localStorage.setItem(API_ID_KEY, String(id));
    }
  };
  const clearActiveId = () => {
    sessionStorage.removeItem(ACTIVE_ID_KEY);
    localStorage.removeItem(API_ID_KEY);
  };

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

  function buildPayload() {
    const productData = products && products[product] ? products[product] : null;
    return {
      name: `Mijn ${productData?.name || 'PrintLab'} ontwerp`,
      product_type: productData?.name ? productData.name.toLowerCase() : String(product || 'custom'),
      status: 'saved',
      design_data: {
        product: product || null,
        size: size || null,
        finish: finish || null,
        edge: !!edge,
        qty: Number(qty || 1)
      },
      objects: apiObjects()
    };
  }

  async function requestJson(url, method, payload) {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    let data = {};
    try { data = await response.json(); }
    catch { throw new Error(`API gaf geen geldige JSON terug (HTTP ${response.status})`); }
    return { response, data };
  }

  async function saveRecord() {
    const payload = buildPayload();
    const activeId = getActiveId();

    if (!activeId) {
      const result = await requestJson(`${API_BASE_URL}/designs`, 'POST', payload);
      if (!result.response.ok || result.data.status !== 'ok') {
        throw new Error(result.data.message || `POST /designs mislukt (HTTP ${result.response.status})`);
      }
      const id = result.data.design_id;
      if (id) setActiveId(id);
      return { ...result.data, design_id: id };
    }

    const update = await requestJson(`${API_BASE_URL}/designs/${encodeURIComponent(activeId)}`, 'PUT', payload);
    if (update.response.status === 404) {
      clearActiveId();
      const create = await requestJson(`${API_BASE_URL}/designs`, 'POST', payload);
      if (!create.response.ok || create.data.status !== 'ok') {
        throw new Error(create.data.message || `POST /designs mislukt (HTTP ${create.response.status})`);
      }
      const id = create.data.design_id;
      if (id) setActiveId(id);
      return { ...create.data, design_id: id };
    }

    if (!update.response.ok || update.data.status !== 'ok') {
      throw new Error(update.data.message || `PUT /designs/${activeId} mislukt (HTTP ${update.response.status})`);
    }
    return { ...update.data, design_id: Number(activeId) };
  }

  function capturePreview() {
    if (typeof canvas === 'undefined' || !canvas || typeof canvas.toDataURL !== 'function') {
      throw new Error('Editorcanvas niet beschikbaar');
    }

    try {
      const data = canvas.toDataURL('image/jpeg', 0.72);
      if (!data || !data.startsWith('data:image/')) {
        throw new Error('Canvas gaf geen geldige afbeelding terug');
      }
      return data;
    } catch (error) {
      throw new Error('Canvas-preview kon niet worden gemaakt: ' + (error?.message || String(error)));
    }
  }

  async function savePreview(designId) {
    const previewData = capturePreview();

    const result = await requestJson(`${API_BASE_URL}/preview.php`, 'POST', {
      design_id: Number(designId),
      preview_data: previewData
    });

    if (!result.response.ok || result.data.status !== 'ok') {
      const detail = result.data.detail ? ` — ${result.data.detail}` : '';
      const writable = typeof result.data.writable === 'boolean'
        ? ` — writable=${result.data.writable}`
        : '';
      throw new Error(
        (result.data.message || `Preview upload mislukt (HTTP ${result.response.status})`) + detail + writable
      );
    }

    return result.data;
  }

  window.saveDesign = async function saveDesignWithApi() {
    if (typeof originalSaveDesign === 'function') {
      try { originalSaveDesign(); } catch (error) { console.warn('Lokale opslag mislukt:', error); }
    }

    try {
      const record = await saveRecord();
      try {
        await savePreview(record.design_id);
        if (typeof toast === 'function') toast('Ontwerp + preview opgeslagen');
      } catch (previewError) {
        console.warn('Preview opslaan mislukt:', previewError);
        if (typeof toast === 'function') {
          toast('Preview mislukt: ' + (previewError?.message || String(previewError)));
        }
      }
      return record;
    } catch (error) {
      console.error('PrintLab API opslag mislukt:', error);
      if (typeof toast === 'function') toast('Opslaan naar database mislukt: ' + (error?.message || String(error)));
      throw error;
    }
  };

  window.loadDesignFromAPI = async function loadDesignFromAPI(designId) {
    const response = await fetch(`${API_BASE_URL}/designs/${encodeURIComponent(designId)}`, { headers: { Accept: 'application/json' } });
    const data = await response.json();
    if (!response.ok || data.status !== 'ok' || !data.design) throw new Error(data.message || `API HTTP ${response.status}`);

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
    if (typeof renderSizes === 'function') renderSizes();
    if (typeof updatePrice === 'function') updatePrice();
    if (typeof syncProductCard === 'function') syncProductCard();
    if (typeof draw === 'function') draw();
    if (typeof layers === 'function') layers();
    if (typeof refresh3D === 'function') refresh3D();
    if (typeof toast === 'function') toast('Ontwerp uit database geladen');
    return design;
  };

  window.printLabApiStorage = {
    apiBaseUrl: API_BASE_URL,
    getCurrentDesignId: getActiveId,
    clearCurrentDesignId: clearActiveId,
    save: saveRecord,
    savePreview
  };
})();
