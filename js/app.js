
/* =========================================================
   PRODUCT DATA
========================================================= */

const products={

  tile:{
    name:"Wandtegel",
    sizes:{
      "11×11 cm":{price:7.95,width:11,height:11},
      "15×15 cm":{price:9.95,width:15,height:15},
      "20×20 cm":{price:12.95,width:20,height:20},
      "20×25 cm":{price:21.95,width:20,height:25},
      "20×30 cm":{price:24.95,width:20,height:30}
    }
  },

  coaster:{
    name:"Onderzetter",
    sizes:{
      "1 stuk":{price:6.95},
      "4 stuks":{price:19.95}
    }
  },

  aluminium:{
    name:"Aluminium paneel",
    sizes:{
      "20×30 cm":{price:19.95},
      "30×40 cm":{price:29.95},
      "40×60 cm":{price:39.95}
    }
  },

  mouse:{
    name:"Muismat",
    sizes:{
      "Standaard":{price:12.95},
      "XL":{price:19.95},
      /* Verkoopprijs n.t.b. — €1,55 is inkoopreferentie, géén verkoopprijs */
      "Ronde Ø 20 cm":{price:9.95}
    }
  },

  mug:{
    name:"Mok",
    sizes:{
      "Standaard":{price:11.95}
    }
  }

};

/*
  =========================================================
  PRODUCT ENGINE — FASE 1 (catalog + helpers)
  =========================================================
  Doel: centrale ProductCatalog / ProductDef + pure helpers.
  Runtime (UI, 2D, 3D, opslaan, API) blijft de bestaande
  `products`-tabel en globale state gebruiken tot Fase 2.

  BELANGRIJK:
  - Wandtegel-gedrag is bevroren. Catalogus is 1-op-1 met
    de huidige tile-config (prijzen, cm, oriëntatie, edge).
  - Helpers mogen intern dezelfde formules gebruiken als de
    huidige tile-logica; ze sturen de editor NOG NIET aan.
  - Oude productlogica blijft bewust bestaan als
    compatibility layer tot Fase 2.
  =========================================================
*/

const PRODUCT_CATALOG = {

  tile: {
    id: "tile",
    name: "Wandtegel",
    type: "ceramic_tile",
    shape: "rounded_rect",
    supportsOrientation: true,
    supportsFinish: true,
    finishes: ["mat", "gloss"],
    supportsEdge: true,
    edgeSurcharge: 1.50,
    /* px inset op 1200×1200 canvas — huidige stippellijn */
    safeZoneInset: 20,
    modelBuilder: "tile",
    turntable: true,
    sizes: {
      "11×11 cm": {
        price: 7.95,
        widthCm: 11,
        heightCm: 11,
        orientation: false,
        depth: 0.18,
        cornerRadius: 0.016
      },
      "15×15 cm": {
        price: 9.95,
        widthCm: 15,
        heightCm: 15,
        orientation: false,
        depth: 0.18,
        cornerRadius: 0.018
      },
      "20×20 cm": {
        price: 12.95,
        widthCm: 20,
        heightCm: 20,
        orientation: false,
        depth: 0.20,
        cornerRadius: 0.020
      },
      "20×25 cm": {
        price: 21.95,
        widthCm: 20,
        heightCm: 25,
        orientation: true,
        orientations: {
          portrait:  { widthCm: 20, heightCm: 25, label: "20 × 25 cm · verticaal" },
          landscape: { widthCm: 25, heightCm: 20, label: "25 × 20 cm · horizontaal" }
        },
        depth: 0.20,
        cornerRadius: 0.020
      },
      "20×30 cm": {
        price: 24.95,
        widthCm: 20,
        heightCm: 30,
        orientation: true,
        orientations: {
          portrait:  { widthCm: 20, heightCm: 30, label: "20 × 30 cm · verticaal" },
          landscape: { widthCm: 30, heightCm: 20, label: "30 × 20 cm · horizontaal" }
        },
        depth: 0.20,
        cornerRadius: 0.020
      }
    }
  },

  /* Overige producten: minimale Fase-1 stubs (zelfde keys/prijzen
     als de bestaande `products`-tabel). Uitbreiding in latere fases. */
  coaster: {
    id: "coaster",
    name: "Onderzetter",
    type: "coaster",
    category: "coaster",
    /* Standaardvorm; actieve variant bepaalt circle vs square */
    shape: "circle",
    supportsOrientation: false,
    supportsFinish: false,
    supportsEdge: false,
    supportsShape: true,
    supportsMaterial: true,
    modelBuilder: "coaster",
    turntable: false,
    /* BestSublimation24-varianten — prijzen blijven de bestaande
       pack-prijzen (1 stuk / 4 stuks) tot definitieve verkoopprijzen. */
    variants: {
      round_mdf_cork: {
        id: "round_mdf_cork",
        shape: "circle",
        material: "MDF + kurk",
        materialKey: "mdf_cork",
        widthCm: 9.5,
        heightCm: 9.5,
        diameterCm: 9.5,
        thicknessMm: 3,
        formatLabel: "Ø 9,5 cm",
        label: "Rond · MDF + kurk"
      },
      square_mdf_cork: {
        id: "square_mdf_cork",
        shape: "square",
        material: "MDF + kurk",
        materialKey: "mdf_cork",
        widthCm: 9.5,
        heightCm: 9.5,
        thicknessMm: 3,
        formatLabel: "9,5 × 9,5 cm",
        label: "Vierkant · MDF + kurk"
      },
      square_aluminium_cork: {
        id: "square_aluminium_cork",
        shape: "square",
        material: "Aluminium + kurk",
        materialKey: "aluminium_cork",
        widthCm: 9.5,
        heightCm: 9.5,
        thicknessMm: 3,
        formatLabel: "9,5 × 9,5 cm",
        label: "Vierkant · Aluminium + kurk"
      }
    },
    defaultVariant: "round_mdf_cork",
    sizes: {
      "1 stuk":  { price: 6.95 },
      "4 stuks": { price: 19.95 }
    }
  },

  aluminium: {
    id: "aluminium",
    name: "Aluminium paneel",
    type: "panel",
    shape: "rounded_rect",
    supportsOrientation: false,
    supportsFinish: false,
    supportsEdge: false,
    modelBuilder: "box",
    turntable: false,
    sizes: {
      "20×30 cm": { price: 19.95, widthCm: 20, heightCm: 30 },
      "30×40 cm": { price: 29.95, widthCm: 30, heightCm: 40 },
      "40×60 cm": { price: 39.95, widthCm: 40, heightCm: 60 }
    }
  },

  mouse: {
    id: "mouse",
    name: "Muismat",
    type: "mousepad",
    category: "mouse",
    shape: "rounded_rect",
    supportsOrientation: false,
    /* Eén vaste landscape-verhouding; geen Portret/Landschap. */
    supportsFinish: false,
    supportsEdge: false,
    supportsShape: false,
    supportsMaterial: false,
    modelBuilder: "mouse",
    turntable: false,
    defaultSize: "Standaard",
    /*
      Geen fysieke cm in de originele Studio-code.
      printW/printH/cornerRadius = exact de bestaande 2D-bounds (1100×630, r=35).
      Prijzen: bestaande cataloguswaarden — geen nieuwe prijzen.
    */
    sizes: {
      "Standaard": {
        id: "standaard",
        label: "Standaard",
        price: 12.95,
        shape: "rectangle",
        /* Definitieve productmaat: 23,5 × 19,5 cm (verhouding ≈ 1,205) */
        widthCm: 23.5,
        heightCm: 19.5,
        /* printW/H afgeleid van cm-verhouding op 1200-canvas (max 1130) */
        printW: 1130,
        printH: 938,
        cornerRadius: 28,
        modelBuilder: "mouse",
        disabled: false,
        availability: "available"
      },
      "XL": {
        id: "xl",
        label: "XL",
        /* Interne catalogusprijs — niet tonen zolang coming_soon */
        price: 19.95,
        shape: "rounded_rect",
        widthCm: null,
        heightCm: null,
        printW: 1100,
        printH: 630,
        cornerRadius: 35,
        modelBuilder: "mouse",
        disabled: true,
        availability: "coming_soon"
      },
      "Ronde Ø 20 cm": {
        id: "round_20cm",
        label: "Ronde Ø 20 cm",
        /* Verkoopprijs PrintLab €9,95 incl. btw. Inkoopreferentie BestSublimation24: €1,55 (niet verkopen). */
        price: 9.95,
        pricePlaceholder: false,
        purchaseRefEur: 1.55,
        shape: "circle",
        widthCm: 20,
        heightCm: 20,
        diameterCm: 20,
        printW: 900,
        printH: 900,
        cornerRadius: 450,
        modelBuilder: "mouse",
        disabled: false,
        availability: "available"
      }
    }
  },

  mug: {
    id: "mug",
    name: "Mok",
    type: "mug",
    shape: "wrap",
    supportsOrientation: false,
    supportsFinish: false,
    supportsEdge: false,
    modelBuilder: "mugWrap",
    turntable: false,
    sizes: {
      "Standaard": { price: 11.95 }
    }
  }

};

/** @returns {object|null} ProductDef uit de catalogus */
function getProduct(productId){
  if(!productId) return null;
  return PRODUCT_CATALOG[productId] || null;
}

/** @returns {object|null} Size-def voor product + size-key */
function getSize(productId, sizeKey){
  const p = getProduct(productId);
  if(!p || !p.sizes) return null;
  return p.sizes[sizeKey] || null;
}

/**
 * Effectieve breedte/hoogte in cm, rekening houdend met oriëntatie.
 * Spiegel van de huidige tile-logica (landscape swap alleen bij
 * 20×25 / 20×30 wanneer size.orientation === true).
 * @returns {{ widthCm: number, heightCm: number }|null}
 */
function getEffectiveDimensions(productId, sizeKey, orientation){
  const sz = getSize(productId, sizeKey);
  if(!sz) return null;

  let w = Number(sz.widthCm);
  let h = Number(sz.heightCm);
  if(!isFinite(w) || !isFinite(h)) return null;

  if(
    sz.orientation === true &&
    orientation === "landscape" &&
    sz.orientations &&
    sz.orientations.landscape
  ){
    w = Number(sz.orientations.landscape.widthCm);
    h = Number(sz.orientations.landscape.heightCm);
  }

  return { widthCm: w, heightCm: h };
}

/**
 * Aspect ratio (breedte/hoogte) voor CSS --tile-ar e.d.
 * Zelfde rekenwijze als syncProductAspectRatio() voor tile.
 * @returns {number} ratio (default 1)
 */
function getAspectRatio(productId, sizeKey, orientation){
  const dim = getEffectiveDimensions(productId, sizeKey, orientation);
  if(!dim || !dim.heightCm) return 1;
  return dim.widthCm / dim.heightCm;
}

/**
 * Welke productopties de UI mag tonen voor dit product+size.
 * @returns {{
 *   orientation: boolean,
 *   finish: boolean,
 *   finishes: string[],
 *   edge: boolean,
 *   edgeSurcharge: number,
 *   shape: boolean,
 *   material: boolean
 * }}
 */
function getAvailableOptions(productId, sizeKey){
  const p = getProduct(productId);
  const sz = getSize(productId, sizeKey);
  const empty = {
    orientation: false,
    finish: false,
    finishes: [],
    edge: false,
    edgeSurcharge: 0,
    shape: false,
    material: false
  };
  if(!p) return empty;

  const showOrientation =
    !!p.supportsOrientation &&
    !!(sz && sz.orientation === true);

  return {
    orientation: showOrientation,
    finish: !!p.supportsFinish,
    finishes: Array.isArray(p.finishes) ? p.finishes.slice() : [],
    edge: !!p.supportsEdge,
    edgeSurcharge: typeof p.edgeSurcharge === "number" ? p.edgeSurcharge : 0,
    shape: !!p.supportsShape,
    material: !!p.supportsMaterial
  };
}

/** @returns {object|null} Actieve coaster-variant uit de catalogus */
function getCoasterVariant(variantId){
  const p = getProduct("coaster");
  if(!p || !p.variants) return null;
  const id = variantId || coasterVariant || p.defaultVariant;
  return p.variants[id] || p.variants[p.defaultVariant] || null;
}

/** Alle variant-ids voor een gegeven vorm (circle|square) */
function getCoasterVariantsByShape(shape){
  const p = getProduct("coaster");
  if(!p || !p.variants) return [];
  return Object.keys(p.variants).filter(function(id){
    return p.variants[id].shape === shape;
  });
}

/**
 * Zet actieve onderzetter-variant en ververst UI/2D/3D.
 * Alleen van toepassing bij product === "coaster".
 */
function setCoasterVariant(variantId){
  const v = getCoasterVariant(variantId);
  if(!v) return;
  coasterVariant = v.id;
  if(typeof syncProductOptionsUI === "function") syncProductOptionsUI();
  if(typeof syncProductAspectRatio === "function") syncProductAspectRatio();
  if(typeof syncProductCard === "function") syncProductCard();
  if(typeof updatePrice === "function") updatePrice();
  if(typeof draw === "function") draw();
  if(typeof refresh3D === "function") refresh3D();
}

function setCoasterShape(shape){
  if(shape !== "circle" && shape !== "square") return;
  const list = getCoasterVariantsByShape(shape);
  if(!list.length) return;
  const current = getCoasterVariant(coasterVariant);
  /* Behoud materiaal indien beschikbaar in de nieuwe vorm */
  let next = list[0];
  if(current){
    const sameMat = list.find(function(id){
      const vv = getCoasterVariant(id);
      return vv && vv.materialKey === current.materialKey;
    });
    if(sameMat) next = sameMat;
  }
  setCoasterVariant(next);
}

function setCoasterMaterial(materialKey){
  const current = getCoasterVariant(coasterVariant);
  const shape = current ? current.shape : "circle";
  const list = getCoasterVariantsByShape(shape);
  const match = list.find(function(id){
    const vv = getCoasterVariant(id);
    return vv && vv.materialKey === materialKey;
  });
  if(match) setCoasterVariant(match);
}

/**
 * Eenheidsprijs inclusief optionele edge-toeslag.
 * Zelfde regels als updatePrice() voor tile (+ €1,50 bij edge).
 * @param {object} [opts]
 * @param {boolean} [opts.edge]
 * @returns {number}
 */
function getUnitPrice(productId, sizeKey, opts){
  const sz = getSize(productId, sizeKey);
  if(!sz || typeof sz.price !== "number") return 0;

  let unit = sz.price;
  const p = getProduct(productId);
  if(
    p &&
    p.supportsEdge &&
    opts &&
    opts.edge === true &&
    typeof p.edgeSurcharge === "number"
  ){
    unit += p.edgeSurcharge;
  }
  return unit;
}

/* Einde Product Engine Fase 1 */


let product="tile";
let size="11×11 cm";
let tileOrientation="portrait";
let finish="mat";
let edge=false;
let qty=1;
/* Actieve onderzetter-variant (PRODUCT_CATALOG.coaster.variants) */
let coasterVariant="round_mdf_cork";

let objects=[];
let selected=null;
let drag=null;

let cart=0;

let history=[];
let historyIndex=-1;

const canvas=
  document.getElementById("editorCanvas");

const ctx=
  canvas.getContext("2d");

const W=1200;
const H=1200;


/* =========================================================
   HELPERS
========================================================= */

function money(n){

  return new Intl.NumberFormat(
    "nl-NL",
    {
      style:"currency",
      currency:"EUR"
    }
  ).format(n);

}

function toast(message){

  const t=
    document.getElementById("toast");

  t.textContent=message;

  t.classList.add("show");

  clearTimeout(
    window.toastTimer
  );

  window.toastTimer=
    setTimeout(
      ()=>t.classList.remove("show"),
      2200
    );

}

function esc(value){

  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


/* =========================================================
   HISTORY
========================================================= */

function serialiseObjects(){

  return objects.map(
    o=>{
      const x={...o};
      delete x.img;
      delete x._filterCanvas;
      delete x._filterKey;
      if(o.type==="image" && o.img){
        if(!o._imgId){
          o._imgId="img_"+Math.random().toString(36).slice(2,10);
        }
        imageStore[o._imgId]=o.img;
        x._imgId=o._imgId;
      }
      return x;
    }
  );

}

function deserialiseObjects(arr){

  return (arr||[]).map(o=>{
    if(o.type==="image" && o._imgId && imageStore[o._imgId]){
      o.img=imageStore[o._imgId];
    }
    o._filterCanvas=null;
    o._filterKey=null;
    return o;
  });

}

function saveHistory(){

  history=
    history.slice(
      0,
      historyIndex+1
    );

  history.push(
    JSON.stringify(
      serialiseObjects()
    )
  );

  historyIndex=
    history.length-1;

}

function undo(){

  if(historyIndex<=0){
    toast("Niets om ongedaan te maken");
    return;
  }

  historyIndex--;

  objects=
    deserialiseObjects(
      JSON.parse(history[historyIndex])
    );

  selected=null;

  draw();
  layers();
  refresh3D();
  if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();
  if(typeof updateToolbarPhotoState==="function") updateToolbarPhotoState();

}

function redo(){

  if(
    historyIndex>=history.length-1
  )
    return;

  historyIndex++;

  objects=
    deserialiseObjects(
      JSON.parse(history[historyIndex])
    );

  selected=null;

  draw();
  layers();
  refresh3D();

}


/* =========================================================
   PRODUCT
========================================================= */

function syncProductCard(){
  const name=(products[product]&&products[product].name)||"Product";
  const opts=typeof getAvailableOptions==="function"
    ? getAvailableOptions(product, size)
    : { finish: product==="tile" };
  let fin=opts.finish?(finish==="gloss"?"Glans":"Mat"):"";
  let sz=size||"";
  if(product==="coaster"){
    const v=typeof getCoasterVariant==="function"?getCoasterVariant(coasterVariant):null;
    if(v){
      fin=v.material||"";
      sz=(v.formatLabel||sz)+(size?" · "+size:"");
    }
  }
  ["productCardName","productCardNameLegacy"].forEach(function(id){
    const el=document.getElementById(id);
    if(el) el.textContent=name;
  });
  ["productCardFinish","productCardFinishLegacy"].forEach(function(id){
    const el=document.getElementById(id);
    if(el) el.textContent=fin;
  });
  ["productCardSize","productCardSizeLegacy"].forEach(function(id){
    const el=document.getElementById(id);
    if(el) el.textContent=sz;
  });
  const label=fin?`${name} · ${sz} · ${fin}`:`${name} · ${sz}`;
  const badge=document.getElementById("badge");
  if(badge){
    try{ badge.textContent=label; }catch(_){}
  }
  const hb=document.getElementById("headerBadgeText");
  if(hb){
    try{ hb.textContent=label; }catch(_){}
  }
}

function syncProductAspectRatio(){
  if(typeof document==="undefined") return;
  let ratio=1;
  if(product==="tile"){
    const cfg=products.tile.sizes[size]||{};
    let w=Number(cfg.width)||11;
    let h=Number(cfg.height)||11;
    if((size==="20×25 cm" || size==="20×30 cm") && tileOrientation==="landscape"){
      [w,h]=[h,w];
    }
    ratio=w/h;
  }else if(product==="mouse"){
    const sz = typeof getSize === "function" ? getSize("mouse", size) : null;
    if(sz && Number(sz.widthCm) > 0 && Number(sz.heightCm) > 0){
      ratio = Number(sz.widthCm) / Number(sz.heightCm);
    }else{
      const w = (sz && sz.printW) ? Number(sz.printW) : 1100;
      const h = (sz && sz.printH) ? Number(sz.printH) : 630;
      if(h) ratio = w / h;
    }
  }else if(product==="coaster"){
    ratio = 1;
  }
  document.documentElement.style.setProperty("--tile-ar", `${ratio} / 1`);
  syncTileOrientationUI();
}

/**
 * Fase 2 — capability-gestuurde zichtbaarheid van productopties in de UI.
 * Gebruikt getAvailableOptions() i.p.v. product==="tile".
 * Raakt géén 2D/3D/bounds/opslag aan.
 */
function setOptionSectionVisible(section, show, hiddenClass){
  if(!section) return;
  const cls=hiddenClass||"option-section-hidden";
  if(show){
    section.hidden=false;
    section.classList.remove(cls);
    if(cls==="orientation-hidden") section.classList.remove("orientation-hidden");
    section.style.removeProperty("display");
    section.style.removeProperty("visibility");
    section.style.removeProperty("height");
    section.style.removeProperty("margin");
    section.style.removeProperty("padding");
    section.style.removeProperty("overflow");
    section.style.removeProperty("border");
  }else{
    section.hidden=true;
    section.classList.add(cls);
    section.style.display="none";
  }
}

function syncProductOptionsUI(){
  const opts=typeof getAvailableOptions==="function"
    ? getAvailableOptions(product, size)
    : { orientation:false, finish:false, edge:false, shape:false, material:false };

  const finishSec=document.getElementById("productFinishSection");
  const edgeSec=document.getElementById("productEdgeSection");
  const orientSec=document.getElementById("tileOrientationSection");
  const tileOpts=document.getElementById("tileOptions");
  const coasterOpts=document.getElementById("coasterOptions");

  setOptionSectionVisible(finishSec, !!opts.finish, "option-section-hidden");
  setOptionSectionVisible(edgeSec, !!opts.edge, "option-section-hidden");
  /* Oriëntatie gebruikt bestaande class orientation-hidden (CSS) */
  setOptionSectionVisible(orientSec, !!opts.orientation, "orientation-hidden");

  /* Container tonen als minstens één tile-productoptie beschikbaar is */
  if(tileOpts){
    const any=!!(opts.finish || opts.edge || opts.orientation);
    tileOpts.style.display=any?"block":"none";
  }

  /* Onderzetter vorm + materiaal */
  if(coasterOpts){
    const showCoaster=!!(opts.shape || opts.material);
    coasterOpts.style.display=showCoaster?"block":"none";
    if(showCoaster) syncCoasterVariantUI();
  }

  /* Desktop edge-float alleen bij supportsEdge */
  const edgeFloat=document.getElementById("edgePrintFloat");
  if(edgeFloat){
    edgeFloat.style.display=opts.edge?"":"none";
  }

  /* Active states + labels voor oriëntatie (alleen zinvol als zichtbaar) */
  const portrait=document.getElementById("tileOrientationPortrait");
  const landscape=document.getElementById("tileOrientationLandscape");
  if(portrait) portrait.classList.toggle("active", tileOrientation==="portrait");
  if(landscape) landscape.classList.toggle("active", tileOrientation==="landscape");

  const portraitLabel=document.getElementById("tileOrientationPortraitLabel");
  const landscapeLabel=document.getElementById("tileOrientationLandscapeLabel");
  const szDef=typeof getSize==="function"?getSize(product, size):null;
  if(szDef && szDef.orientations){
    if(portraitLabel && szDef.orientations.portrait)
      portraitLabel.textContent=szDef.orientations.portrait.label||portraitLabel.textContent;
    if(landscapeLabel && szDef.orientations.landscape)
      landscapeLabel.textContent=szDef.orientations.landscape.label||landscapeLabel.textContent;
  }else if(size==="20×25 cm"){
    if(portraitLabel) portraitLabel.textContent="20 × 25 cm · verticaal";
    if(landscapeLabel) landscapeLabel.textContent="25 × 20 cm · horizontaal";
  }else{
    if(portraitLabel) portraitLabel.textContent="20 × 30 cm · verticaal";
    if(landscapeLabel) landscapeLabel.textContent="30 × 20 cm · horizontaal";
  }
}

/** Bouwt/vernieuwt vorm- en materiaalknoppen voor onderzetters. */
function syncCoasterVariantUI(){
  const v = getCoasterVariant(coasterVariant);
  if(!v) return;

  const shapeGrid=document.getElementById("coasterShapeGrid");
  const matGrid=document.getElementById("coasterMaterialGrid");
  const formatEl=document.getElementById("coasterFormatLabel");

  if(shapeGrid){
    const shapes=[
      { key:"circle", label:"Rond", icon:"◯" },
      { key:"square", label:"Vierkant", icon:"▣" }
    ];
    shapeGrid.innerHTML="";
    shapes.forEach(function(s){
      const b=document.createElement("button");
      b.type="button";
      b.className="finish"+(v.shape===s.key?" active":"");
      b.innerHTML="<strong>"+s.icon+" "+s.label+"</strong>";
      b.onclick=function(){ setCoasterShape(s.key); };
      shapeGrid.appendChild(b);
    });
  }

  if(matGrid){
    const list=getCoasterVariantsByShape(v.shape);
    matGrid.innerHTML="";
    list.forEach(function(id){
      const vv=getCoasterVariant(id);
      if(!vv) return;
      const b=document.createElement("button");
      b.type="button";
      b.className="finish"+(coasterVariant===id?" active":"");
      b.innerHTML="<strong>"+vv.material+"</strong><br><small>"+(vv.formatLabel||"")+"</small>";
      b.onclick=function(){ setCoasterVariant(id); };
      matGrid.appendChild(b);
    });
  }

  if(formatEl){
    formatEl.textContent=v.formatLabel||"";
  }
}

/* Compat: bestaande aanroepen blijven werken */
function syncTileOrientationUI(){
  syncProductOptionsUI();
}

function setTileOrientation(value){
  const opts=typeof getAvailableOptions==="function"
    ? getAvailableOptions(product, size)
    : null;
  if(!opts || !opts.orientation) return;
  if(value!=="portrait" && value!=="landscape") return;
  tileOrientation=value;
  syncProductAspectRatio();
  draw();
  refresh3D();
}

/** Size is selecteerbaar (niet disabled / coming_soon). */
function isSizeSelectable(productId, sizeKey){
  const sz = typeof getSize === "function" ? getSize(productId, sizeKey) : null;
  if(sz){
    if(sz.disabled === true) return false;
    if(sz.availability === "coming_soon") return false;
  }
  return true;
}

/** Eerste selecteerbare size-key voor een product. */
function getDefaultSelectableSize(productId){
  const p = typeof getProduct === "function" ? getProduct(productId) : null;
  const legacy = products[productId] && products[productId].sizes
    ? Object.keys(products[productId].sizes)
    : [];
  const keys = (p && p.sizes) ? Object.keys(p.sizes) : legacy;
  for(let i = 0; i < keys.length; i++){
    if(isSizeSelectable(productId, keys[i])) return keys[i];
  }
  return keys[0] || null;
}

function renderSizes(){

  const el=
    document.getElementById("sizes");

  el.innerHTML="";

  /* Als huidige size disabled is (bijv. XL), val terug op eerste beschikbare */
  if(product && size && !isSizeSelectable(product, size)){
    const fallback = getDefaultSelectableSize(product);
    if(fallback) size = fallback;
  }

  Object.entries(
    products[product].sizes
  ).forEach(
    ([key,data])=>{

      const catalogSz = typeof getSize === "function" ? getSize(product, key) : null;
      const comingSoon = catalogSz && (
        catalogSz.disabled === true ||
        catalogSz.availability === "coming_soon"
      );
      const selectable = !comingSoon && isSizeSelectable(product, key);

      const b=
        document.createElement("button");

      b.type = "button";
      b.className =
        "size-btn " +
        (key === size && selectable ? "active" : "") +
        (comingSoon ? " size-btn-disabled size-btn-coming-soon" : "");

      if(comingSoon){
        b.disabled = true;
        b.setAttribute("aria-disabled", "true");
        b.setAttribute("tabindex", "-1");
        b.title = "Binnenkort beschikbaar";
        b.innerHTML =
          key + "<br><span class=\"size-btn-soon\">Binnenkort beschikbaar</span>";
        /* Geen selectie via click/keyboard */
        b.onclick = function(e){
          if(e){ e.preventDefault(); e.stopPropagation(); }
          return false;
        };
      }else{
        b.disabled = false;
        b.removeAttribute("aria-disabled");
        const priceLabel = (catalogSz && typeof catalogSz.price === "number")
          ? money(catalogSz.price)
          : money(data.price);
        b.innerHTML = key + "<br>" + priceLabel;
        b.onclick = function(){
          if(!isSizeSelectable(product, key)) return;

          size = key;

          const sizeOpts = typeof getAvailableOptions === "function"
            ? getAvailableOptions(product, size)
            : null;
          if(!sizeOpts || !sizeOpts.orientation){
            tileOrientation = "portrait";
          }

          renderSizes();
          syncProductAspectRatio();
          updatePrice();
          if(typeof syncProductCard === "function") syncProductCard();
          draw();
          refresh3D();
        };
      }

      el.appendChild(b);

    }
  );

  /* Forceer de zichtbaarheid opnieuw nadat de formaatknoppen zijn opgebouwd. */
  syncTileOrientationUI();

}

function changeProduct(){

  product=
    document.getElementById("product").value;

  /* Eerste selecteerbare size (overslaat coming_soon / disabled, o.a. XL muismat) */
  size = typeof getDefaultSelectableSize === "function"
    ? getDefaultSelectableSize(product)
    : Object.keys(products[product].sizes)[0];

  const sizeOpts=typeof getAvailableOptions==="function"
    ? getAvailableOptions(product, size)
    : null;
  if(!sizeOpts || !sizeOpts.orientation){
    tileOrientation="portrait";
  }
  /* Edge alleen zinvol bij supportsEdge; uitzetten bij wissel naar product zonder edge */
  if(!sizeOpts || !sizeOpts.edge){
    edge=false;
  }
  /* Onderzetter: default variant herstellen */
  if(product==="coaster"){
    const p=typeof getProduct==="function"?getProduct("coaster"):null;
    coasterVariant=(p && p.defaultVariant)||"round_mdf_cork";
  }

  /* Zichtbaarheid via capabilities (niet product==="tile") */
  if(typeof syncProductOptionsUI==="function"){
    syncProductOptionsUI();
  }else{
    const tileOptsEl=document.getElementById("tileOptions");
    if(tileOptsEl) tileOptsEl.style.display=product==="tile"?"block":"none";
  }

  renderSizes();
  syncProductAspectRatio();
  updatePrice();
  if(typeof syncProductCard==="function") syncProductCard();
  if(typeof syncEdgeUI==="function") syncEdgeUI();
  updateHelp();
  draw();
  refresh3D();

}

function setFinish(value){

  finish=value;

  document
    .getElementById("mat")
    .classList.toggle(
      "active",
      value==="mat"
    );

  document
    .getElementById("gloss")
    .classList.toggle(
      "active",
      value==="gloss"
    );

  updatePrice();
  if(typeof syncProductCard==="function") syncProductCard();
  draw();
  refresh3D();

}

function toggleEdge(){

  const opts=typeof getAvailableOptions==="function"
    ? getAvailableOptions(product, size)
    : { edge: product==="tile" };
  if(!opts.edge) return;

  edge=!edge;

  const el=document.getElementById("edge");
  if(el) el.classList.toggle("on", edge);

  updatePrice();
  refresh3D();
  if(typeof syncEdgeUI==="function") syncEdgeUI();

}

function quantity(amount){

  qty=
    Math.max(
      1,
      qty+amount
    );

  document
    .getElementById("qty")
    .value=qty;

  updatePrice();

}

function setQty(value){

  qty=
    Math.max(
      1,
      parseInt(value)||1
    );

  const q=document.getElementById("qty");
  if(q) q.value=qty;
  const qm=document.getElementById("qtyMobile");
  if(qm) qm.value=qty;

  updatePrice();

}

function updatePrice(){

  const opts=typeof getAvailableOptions==="function"
    ? getAvailableOptions(product, size)
    : { finish: product==="tile", edge: product==="tile", edgeSurcharge: 1.50 };

  let unit=
    products[product]
      .sizes[size]
      .price;

  /* Edge-toeslag via capability (tile: €1,50 — zelfde als voorheen) */
  if(opts.edge && edge){
    unit += (typeof opts.edgeSurcharge==="number" ? opts.edgeSurcharge : 1.50);
  }

  const unitStr=money(unit);
  const totalStr=money(unit*qty);

  const u=document.getElementById("unit");
  if(u) u.textContent=unitStr;
  const um=document.getElementById("unitMobile");
  if(um) um.textContent=unitStr;

  const ql=document.getElementById("qtyLabel");
  if(ql) ql.textContent=qty;
  const ql2=document.getElementById("qtyLabel2");
  if(ql2) ql2.textContent=qty;
  const qlm=document.getElementById("qtyLabelMobile");
  if(qlm) qlm.textContent=qty;
  const plur=document.getElementById("qtyPlural");
  if(plur) plur.textContent=qty===1?"":"s";

  const t=document.getElementById("total");
  if(t) t.textContent=totalStr;
  const tm=document.getElementById("totalMobile");
  if(tm) tm.textContent=totalStr;

  const q=document.getElementById("qty");
  if(q) q.value=qty;
  const qm=document.getElementById("qtyMobile");
  if(qm) qm.value=qty;

  const ep=document.getElementById("edgePrice");
  if(ep) ep.style.display=(opts.edge && edge)?"":"none";

  const finishPart=opts.finish
    ?` · ${finish==="mat"?"Mat":"Glans"}`
    :"";
  document
    .getElementById("badge")
    .textContent=
      `${products[product].name} · ${size}`+finishPart;

}


/* =========================================================
   PRODUCT BOUNDS
========================================================= */

function bounds(){

  if(product==="tile"){
    const cfg=products.tile.sizes[size]||{};
    let pw=Number(cfg.width)||11;
    let ph=Number(cfg.height)||11;
    if((size==="20×25 cm" || size==="20×30 cm") && tileOrientation==="landscape"){
      [pw,ph]=[ph,pw];
    }
    const maxW=1130;
    const maxH=1130;
    const ratio=pw/ph;
    let w=maxW;
    let h=maxH;

    if(ratio>1){
      h=Math.round(w/ratio);
    }else if(ratio<1){
      w=Math.round(h*ratio);
    }

    return {
      x:Math.round((1200-w)/2),
      y:Math.round((1200-h)/2),
      w,
      h,
      r:6
    };
  }

  if(product==="coaster"){
    /* 1:1 printzone op basis van actieve variant (Ø 9,5 of 9,5×9,5).
       Tile-branch hierboven blijft ongewijzigd. */
    const v = typeof getCoasterVariant === "function" ? getCoasterVariant(coasterVariant) : null;
    const shape = v && v.shape ? v.shape : "circle";
    if(shape === "square"){
      return {
        x:150,
        y:150,
        w:900,
        h:900,
        r:18,
        shape: "square"
      };
    }
    return {
      x:150,
      y:150,
      w:900,
      h:900,
      r:450,
      shape: "circle"
    };
  }

  if(product==="aluminium")
    return {
      x:90,
      y:190,
      w:1020,
      h:700,
      r:18
    };

  if(product==="mouse"){
    /* Printzone uit PRODUCT_CATALOG via widthCm/heightCm (of printW/H fallback).
       Standaard: 23,5 × 19,5 cm → verhouding ≈ 1,205 (niet meer 1100×630).
       Ronde Ø 20 cm: 1:1 cirkel. */
    const sz = typeof getSize === "function" ? getSize("mouse", size) : null;
    const shape = (sz && sz.shape) ? sz.shape : "rectangle";
    let w, h, r;
    if(sz && Number(sz.widthCm) > 0 && Number(sz.heightCm) > 0){
      const ratio = Number(sz.widthCm) / Number(sz.heightCm);
      const maxW = 1130;
      const maxH = 1130;
      w = maxW;
      h = maxH;
      if(ratio > 1){
        h = Math.round(w / ratio);
      }else if(ratio < 1){
        w = Math.round(h * ratio);
      }
      r = (typeof sz.cornerRadius === "number")
        ? sz.cornerRadius
        : (shape === "circle" ? w / 2 : 28);
    }else{
      w = (sz && sz.printW) ? Number(sz.printW) : 1100;
      h = (sz && sz.printH) ? Number(sz.printH) : 630;
      r = (sz && typeof sz.cornerRadius === "number")
        ? sz.cornerRadius
        : (shape === "circle" ? w / 2 : 35);
    }
    return {
      x: Math.round((1200 - w) / 2),
      y: Math.round((1200 - h) / 2),
      w,
      h,
      r,
      shape: shape
    };
  }

  return {
    x:250,
    y:120,
    w:700,
    h:960,
    r:90
  };

}


/* =========================================================
   BACKGROUND
========================================================= */

/* Geselecteerde tegel-achtergrond (onder foto/tekst/kader) */
let tileBg="empty";
let templateLibraryOpen=false;
let templateCategory="all";

const TEMPLATE_CATEGORIES=[
  {id:"all",label:"Alles"},
  {id:"popular",label:"Populair"},
  {id:"new",label:"Nieuw"},
  {id:"marble",label:"Marmer"},
  {id:"concrete",label:"Beton"},
  {id:"wood",label:"Hout"},
  {id:"nature",label:"Natuur"},
  {id:"floral",label:"Bloemen"},
  {id:"water",label:"Water"},
  {id:"landscape",label:"Landschappen"},
  {id:"abstract",label:"Abstract"},
  {id:"city",label:"Steden"},
  {id:"travel",label:"Reizen"},
  {id:"animals",label:"Dieren"},
  {id:"space",label:"Sterren & ruimte"},
  {id:"dark",label:"Donker / luxe"},
  {id:"classic",label:"Klassiek"},
  {id:"art",label:"Kunst"},
  {id:"kids",label:"Kids"},
  {id:"gold",label:"Goud & luxe"}
];

/* Centrale sjabloon-dataset — eenvoudig uit te breiden */
const TEMPLATE_LIBRARY=[
  {id:"empty",name:"Leeg",category:"classic",fill:"#f3ede3",style:"solid",popular:true},
  {id:"marbleGold",name:"Marmer Goud",category:"marble",fill:"#eee6d8",style:"marble",popular:true},
  {id:"blackMarble",name:"Zwart Marmer",category:"marble",fill:"#1a1a1e",style:"marbleDark",popular:true,tags:["dark"]},
  {id:"concrete",name:"Beton",category:"concrete",fill:"#9a9690",style:"concrete",popular:true},
  {id:"wood",name:"Hout",category:"wood",fill:"#8b5a2b",style:"wood",popular:true},
  {id:"nature",name:"Natuur",category:"nature",fill:"#3d6b4f",style:"nature",popular:true},
  {id:"abstract",name:"Abstract",category:"abstract",fill:"#4a3f6b",style:"abstract",popular:true},
  {id:"floral",name:"Bloemen",category:"floral",fill:"#8a4a5c",style:"floral",popular:true},
  {id:"travel",name:"Reis",category:"travel",fill:"#4a7ab0",style:"travel",popular:true},
  {id:"family",name:"Familie",category:"classic",fill:"#e8d5b0",style:"family",popular:true},
  {id:"whiteMarble",name:"Wit Marmer",category:"marble",fill:"#f5f2ec",style:"marble",popular:true,isNew:true},
  {id:"roseMarble",name:"Roze Marmer",category:"marble",fill:"#e8d0d4",style:"marble",isNew:true},
  {id:"greenMarble",name:"Groen Marmer",category:"marble",fill:"#2a4a3a",style:"marbleDark",tags:["dark"]},
  {id:"concreteLight",name:"Licht Beton",category:"concrete",fill:"#c4c0b8",style:"concrete"},
  {id:"concreteDark",name:"Donker Beton",category:"concrete",fill:"#5a5854",style:"concrete",tags:["dark"]},
  {id:"oak",name:"Eiken",category:"wood",fill:"#c49a5c",style:"wood"},
  {id:"walnut",name:"Walnoot",category:"wood",fill:"#4a2e18",style:"wood",tags:["dark"]},
  {id:"bamboo",name:"Bamboe",category:"wood",fill:"#c8b86a",style:"wood",isNew:true},
  {id:"forest",name:"Bos",category:"nature",fill:"#1e3d28",style:"nature",tags:["dark"]},
  {id:"meadow",name:"Weide",category:"nature",fill:"#7aab5a",style:"nature",popular:true},
  {id:"moss",name:"Mos",category:"nature",fill:"#4a6b3a",style:"nature"},
  {id:"roses",name:"Rozen",category:"floral",fill:"#a03a4a",style:"floral",popular:true},
  {id:"lavender",name:"Lavendel",category:"floral",fill:"#7a6a9a",style:"floral",isNew:true},
  {id:"sunflower",name:"Zonnebloem",category:"floral",fill:"#d4a020",style:"floral"},
  {id:"ocean",name:"Oceaan",category:"water",fill:"#1a4a6b",style:"water",popular:true,tags:["dark"]},
  {id:"lake",name:"Meer",category:"water",fill:"#3a7a9a",style:"water"},
  {id:"wave",name:"Golven",category:"water",fill:"#2a6a8a",style:"water",isNew:true},
  {id:"mountains",name:"Bergen",category:"landscape",fill:"#4a5a6a",style:"landscape",popular:true},
  {id:"desert",name:"Woestijn",category:"landscape",fill:"#c4a06a",style:"landscape"},
  {id:"sunset",name:"Zonsondergang",category:"landscape",fill:"#c46a3a",style:"landscape",popular:true},
  {id:"aurora",name:"Noorderlicht",category:"landscape",fill:"#1a3a4a",style:"aurora",isNew:true,tags:["dark"]},
  {id:"geo",name:"Geometrie",category:"abstract",fill:"#3a3a4a",style:"abstract"},
  {id:"neon",name:"Neon",category:"abstract",fill:"#1a1a2e",style:"neon",tags:["dark"],isNew:true},
  {id:"pastel",name:"Pastel",category:"abstract",fill:"#d8c8e0",style:"pastel"},
  {id:"skyline",name:"Skyline",category:"city",fill:"#2a2a3a",style:"city",popular:true,tags:["dark"]},
  {id:"paris",name:"Parijs",category:"city",fill:"#6a7a9a",style:"city"},
  {id:"tokyo",name:"Tokio",category:"city",fill:"#1a2a4a",style:"city",tags:["dark"],isNew:true},
  {id:"beach",name:"Strand",category:"travel",fill:"#e8d8a0",style:"travel"},
  {id:"safari",name:"Safari",category:"travel",fill:"#8a6a3a",style:"travel"},
  {id:"alpine",name:"Alpen",category:"travel",fill:"#5a7a9a",style:"travel"},
  {id:"cat",name:"Kat",category:"animals",fill:"#8a7a6a",style:"animal"},
  {id:"dog",name:"Hond",category:"animals",fill:"#6a5a4a",style:"animal"},
  {id:"bird",name:"Vogel",category:"animals",fill:"#4a7a8a",style:"animal",isNew:true},
  {id:"stars",name:"Sterren",category:"space",fill:"#0a0a1a",style:"stars",popular:true,tags:["dark"]},
  {id:"galaxy",name:"Melkweg",category:"space",fill:"#1a0a2a",style:"galaxy",tags:["dark"],isNew:true},
  {id:"moon",name:"Maan",category:"space",fill:"#2a2a3a",style:"moon",tags:["dark"]},
  {id:"noir",name:"Noir",category:"dark",fill:"#121214",style:"solid",popular:true,tags:["dark"]},
  {id:"obsidian",name:"Obsidiaan",category:"dark",fill:"#1a1a22",style:"marbleDark",tags:["dark"]},
  {id:"velvet",name:"Velvet",category:"dark",fill:"#2a1a28",style:"solid",tags:["dark"]},
  {id:"ivory",name:"Ivoor",category:"classic",fill:"#f2ebe0",style:"solid",popular:true},
  {id:"linen",name:"Linnen",category:"classic",fill:"#e8e0d4",style:"concrete"},
  {id:"sepia",name:"Sepia",category:"classic",fill:"#a08060",style:"solid"},
  {id:"watercolor",name:"Aquarel",category:"art",fill:"#8ab0c4",style:"pastel",isNew:true},
  {id:"ink",name:"Inkt",category:"art",fill:"#1a1a2a",style:"abstract",tags:["dark"]},
  {id:"canvas",name:"Canvas",category:"art",fill:"#d8c8a8",style:"concrete"},
  {id:"rainbow",name:"Regenboog",category:"kids",fill:"#e07070",style:"rainbow",popular:true,isNew:true},
  {id:"clouds",name:"Wolken",category:"kids",fill:"#d0e0f0",style:"pastel"},
  {id:"dino",name:"Dino",category:"kids",fill:"#5a8a4a",style:"nature"},
  {id:"goldLeaf",name:"Goudblad",category:"gold",fill:"#c4a040",style:"gold",popular:true},
  {id:"champagne",name:"Champagne",category:"gold",fill:"#e8d5b0",style:"gold",isNew:true},
  {id:"bronze",name:"Brons",category:"gold",fill:"#8a6030",style:"gold"}
];

const TILE_BACKGROUNDS=TEMPLATE_LIBRARY.reduce(function(acc,t){
  acc[t.id]={name:t.name,fill:t.fill,style:t.style||"solid"};
  return acc;
},{});

function paintTileBackgroundPattern(ctx, id, x, y, w, h){
  const meta=TILE_BACKGROUNDS[id]||TILE_BACKGROUNDS.empty;
  const style=meta.style||"solid";
  const fill=meta.fill||"#f3ede3";
  ctx.fillStyle=fill;
  ctx.fillRect(x,y,w,h);
  if(id==="empty"||style==="solid") return;

  /* Deterministische pseudo-random op basis van id */
  let seed=0;
  for(let i=0;i<(id||"").length;i++) seed=(seed*31+(id.charCodeAt(i)||0))>>>0;
  function rnd(){ seed=(seed*1664525+1013904223)>>>0; return (seed&0xffff)/0xffff; }

  if(style==="marble"||style==="marbleDark"){
    ctx.strokeStyle=style==="marbleDark"?"rgba(255,255,255,.12)":"rgba(180,150,90,.25)";
    ctx.lineWidth=1;
    for(let i=0;i<12;i++){
      ctx.beginPath();
      ctx.moveTo(x+rnd()*w,y);
      ctx.bezierCurveTo(x+w*0.3,y+h*0.4,x+w*0.7,y+h*0.6,x+rnd()*w,y+h);
      ctx.stroke();
    }
  }else if(style==="concrete"){
    ctx.fillStyle="rgba(0,0,0,.06)";
    for(let i=0;i<40;i++) ctx.fillRect(x+rnd()*w,y+rnd()*h,2+rnd()*3,2);
  }else if(style==="wood"){
    ctx.strokeStyle="rgba(60,30,10,.25)";
    ctx.lineWidth=2;
    for(let i=0;i<8;i++){
      const yy=y+(i+0.5)*(h/8);
      ctx.beginPath();
      ctx.moveTo(x,yy);
      ctx.bezierCurveTo(x+w*0.3,yy+6,x+w*0.7,yy-6,x+w,yy);
      ctx.stroke();
    }
  }else if(style==="travel"||style==="landscape"||style==="city"){
    const g=ctx.createLinearGradient(x,y,x+w,y+h);
    g.addColorStop(0,fill); g.addColorStop(0.5,"#1e3a5c"); g.addColorStop(1,"#c4a46a");
    ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  }else if(style==="nature"){
    const g=ctx.createLinearGradient(x,y,x,y+h);
    g.addColorStop(0,fill); g.addColorStop(1,"#1e3d2a");
    ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  }else if(style==="abstract"||style==="neon"){
    try{
      const g=ctx.createConicGradient(1.2,x+w/2,y+h/2);
      g.addColorStop(0,fill); g.addColorStop(0.33,"#2a4a5c"); g.addColorStop(0.66,"#6b4a3f"); g.addColorStop(1,fill);
      ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
    }catch(_){
      const g=ctx.createLinearGradient(x,y,x+w,y+h);
      g.addColorStop(0,fill); g.addColorStop(1,"#2a4a5c");
      ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
    }
  }else if(style==="floral"||style==="pastel"){
    const g=ctx.createRadialGradient(x+w*0.3,y+h*0.3,10,x+w/2,y+h/2,w*0.7);
    g.addColorStop(0,"#f0c0c8"); g.addColorStop(0.5,fill); g.addColorStop(1,"#3a2030");
    ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  }else if(style==="family"||style==="gold"){
    const g=ctx.createLinearGradient(x,y,x+w,y+h);
    g.addColorStop(0,fill); g.addColorStop(0.5,"#c4a06a"); g.addColorStop(1,"#8a6a40");
    ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  }else if(style==="water"){
    const g=ctx.createLinearGradient(x,y,x,y+h);
    g.addColorStop(0,"#6ab0d0"); g.addColorStop(0.5,fill); g.addColorStop(1,"#0a2a3a");
    ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
    ctx.strokeStyle="rgba(255,255,255,.15)";
    ctx.lineWidth=1.5;
    for(let i=0;i<6;i++){
      const yy=y+(i+0.5)*(h/6);
      ctx.beginPath();
      ctx.moveTo(x,yy);
      ctx.bezierCurveTo(x+w*0.3,yy+8,x+w*0.7,yy-8,x+w,yy);
      ctx.stroke();
    }
  }else if(style==="stars"||style==="galaxy"||style==="moon"||style==="aurora"){
    ctx.fillStyle=fill; ctx.fillRect(x,y,w,h);
    ctx.fillStyle="rgba(255,255,255,.7)";
    for(let i=0;i<30;i++){
      const sx=x+rnd()*w, sy=y+rnd()*h, r=0.5+rnd()*1.5;
      ctx.beginPath(); ctx.arc(sx,sy,r,0,Math.PI*2); ctx.fill();
    }
    if(style==="aurora"){
      const g=ctx.createLinearGradient(x,y,x+w,y+h);
      g.addColorStop(0,"rgba(40,200,120,.25)"); g.addColorStop(0.5,"rgba(60,120,220,.2)"); g.addColorStop(1,"rgba(180,80,220,.15)");
      ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
    }
  }else if(style==="rainbow"){
    const g=ctx.createLinearGradient(x,y,x+w,y);
    g.addColorStop(0,"#e07070"); g.addColorStop(0.2,"#e0a040"); g.addColorStop(0.4,"#e0e050");
    g.addColorStop(0.6,"#50c070"); g.addColorStop(0.8,"#5080e0"); g.addColorStop(1,"#a050c0");
    ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  }else if(style==="animal"){
    const g=ctx.createRadialGradient(x+w/2,y+h/2,10,x+w/2,y+h/2,w*0.6);
    g.addColorStop(0,fill); g.addColorStop(1,"#1a1210");
    ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  }
}

/** Clip-pad voor onderzetter: cirkel of afgerond vierkant op basis van variant. */
function pathCoasterShape(ctx, b){
  const shape = (b && b.shape) || "circle";
  ctx.beginPath();
  if(shape === "square"){
    ctx.roundRect(b.x, b.y, b.w, b.h, b.r || 18);
  }else{
    ctx.arc(W/2, H/2, b.w/2, 0, Math.PI*2);
  }
}

/**
 * Clip-pad op basis van bounds.shape (muismat e.d.).
 * Onafhankelijk van coaster-variantlogica.
 */
function pathBoundsShape(ctx, b){
  const shape = (b && b.shape) || "rectangle";
  ctx.beginPath();
  if(shape === "circle"){
    ctx.arc(W/2, H/2, Math.min(b.w, b.h) / 2, 0, Math.PI * 2);
  }else{
    /* rectangle / rounded_rect */
    ctx.roundRect(b.x, b.y, b.w, b.h, b.r || 0);
  }
}

function drawBackground(){

  const b=bounds();

  ctx.save();

  if(product==="coaster"){

    pathCoasterShape(ctx, b);
    ctx.clip();
    paintTileBackgroundPattern(ctx, tileBg||"empty", b.x, b.y, b.w, b.h);

  }else if(product==="mouse"){

    /* Ronde of rechthoekige muismat — shape uit bounds/catalogus */
    pathBoundsShape(ctx, b);
    ctx.clip();
    if(tileBg==="empty"||!tileBg){
      ctx.fillStyle="#252321";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }else{
      paintTileBackgroundPattern(ctx, tileBg||"empty", b.x, b.y, b.w, b.h);
    }

  }else{

    ctx.beginPath();

    ctx.roundRect(
      b.x,
      b.y,
      b.w,
      b.h,
      b.r
    );

    ctx.clip();
    paintTileBackgroundPattern(ctx, tileBg||"empty", b.x, b.y, b.w, b.h);

  }

  ctx.restore();

}

function clipProduct(){

  const b=bounds();

  if(product==="coaster"){

    pathCoasterShape(ctx, b);

  }else if(product==="mouse"){

    pathBoundsShape(ctx, b);

  }else{

    ctx.beginPath();

    ctx.roundRect(
      b.x,
      b.y,
      b.w,
      b.h,
      b.r
    );

  }

  ctx.clip();

}


/* =========================================================
   DRAW OBJECT
========================================================= */


const PHOTO_FILTER_CSS={
  none:"none",
  grayscale:"grayscale(1)",
  sepia:"sepia(1)",
  saturate:"saturate(1.8) contrast(1.05)",
  soft:"brightness(1.06) contrast(0.9) saturate(0.8)",
  cool:"saturate(0.85) hue-rotate(18deg) brightness(1.02)",
  warm:"sepia(0.35) saturate(1.25) brightness(1.03)"
};

const PHOTO_FILTER_LABELS={
  none:"Origineel",
  grayscale:"Zwart-wit",
  sepia:"Sepia",
  saturate:"Meer kleur",
  soft:"Zacht",
  warm:"Warm",
  cool:"Koel"
};

/* Bewaar Image-objecten voor undo/redo (niet serialiseerbaar) */
const imageStore={};

function photoAdj(o){
  return {
    brightness: typeof o.brightness==="number"?o.brightness:0,   /* -100..100 */
    contrast: typeof o.contrast==="number"?o.contrast:0,         /* -100..100 */
    saturation: typeof o.saturation==="number"?o.saturation:0,   /* -100..100 */
    warmth: typeof o.warmth==="number"?o.warmth:0,               /* -100..100 */
    sharpness: typeof o.sharpness==="number"?o.sharpness:0,      /* 0..100 */
    shadows: typeof o.shadows==="number"?o.shadows:0,            /* -100..100 */
    highlights: typeof o.highlights==="number"?o.highlights:0,   /* -100..100 */
    blur: typeof o.blur==="number"?o.blur:0                      /* 0..20 */
  };
}

function photoAdjKey(o){
  const a=photoAdj(o);
  return [o.filter||"none",a.brightness,a.contrast,a.saturation,a.warmth,a.sharpness,a.shadows,a.highlights,a.blur].join("|");
}

function photoAdjIsDefault(a){
  return !a.brightness && !a.contrast && !a.saturation && !a.warmth && !a.sharpness && !a.shadows && !a.highlights && !a.blur;
}

function applyPixelFilter(imageData, key){
  const d=imageData.data;
  for(let i=0;i<d.length;i+=4){
    let r=d[i], g=d[i+1], b=d[i+2];
    if(key==="grayscale"){
      const y=0.299*r+0.587*g+0.114*b;
      d[i]=d[i+1]=d[i+2]=y;
    }else if(key==="sepia"){
      const nr=Math.min(255, 0.393*r+0.769*g+0.189*b);
      const ng=Math.min(255, 0.349*r+0.686*g+0.168*b);
      const nb=Math.min(255, 0.272*r+0.534*g+0.131*b);
      d[i]=nr; d[i+1]=ng; d[i+2]=nb;
    }else if(key==="saturate"){
      const y=0.299*r+0.587*g+0.114*b;
      d[i]=Math.min(255, y+(r-y)*1.8);
      d[i+1]=Math.min(255, y+(g-y)*1.8);
      d[i+2]=Math.min(255, y+(b-y)*1.8);
    }else if(key==="soft"){
      d[i]=Math.min(255, r*0.92+18);
      d[i+1]=Math.min(255, g*0.92+18);
      d[i+2]=Math.min(255, b*0.92+18);
    }else if(key==="warm"){
      d[i]=Math.min(255, r*1.08+8);
      d[i+1]=Math.min(255, g*1.02);
      d[i+2]=Math.max(0, b*0.92);
    }else if(key==="cool"){
      d[i]=Math.max(0, r*0.94);
      d[i+1]=Math.min(255, g*1.02);
      d[i+2]=Math.min(255, b*1.1+6);
    }
  }
  return imageData;
}

function applyPhotoAdjustments(imageData, a){
  if(photoAdjIsDefault(a)) return imageData;
  const d=imageData.data;
  const br=1+(a.brightness/100)*0.8;
  const ct=1+(a.contrast/100)*0.9;
  const sat=1+(a.saturation/100)*1.0;
  const warm=a.warmth/100;
  const sh=a.shadows/100;
  const hi=a.highlights/100;
  for(let i=0;i<d.length;i+=4){
    let r=d[i], g=d[i+1], b=d[i+2];
    /* brightness */
    r*=br; g*=br; b*=br;
    /* contrast */
    r=(r-128)*ct+128; g=(g-128)*ct+128; b=(b-128)*ct+128;
    /* saturation */
    const y=0.299*r+0.587*g+0.114*b;
    r=y+(r-y)*sat; g=y+(g-y)*sat; b=y+(b-y)*sat;
    /* warmth */
    if(warm){
      r+=warm*28;
      b-=warm*22;
    }
    /* shadows / highlights (lift darks / compress brights) */
    if(sh||hi){
      const lum=(0.299*r+0.587*g+0.114*b)/255;
      if(sh && lum<0.55){
        const t=(0.55-lum)/0.55;
        const lift=sh*t*40;
        r+=lift; g+=lift; b+=lift;
      }
      if(hi && lum>0.45){
        const t=(lum-0.45)/0.55;
        const pull=hi*t*35;
        r-=pull; g-=pull; b-=pull;
      }
    }
    d[i]=r<0?0:r>255?255:r;
    d[i+1]=g<0?0:g>255?255:g;
    d[i+2]=b<0?0:b>255?255:b;
  }
  return imageData;
}

function applySimpleSharpen(ctx, w, h, amount){
  if(amount<=0) return;
  const str=Math.min(1, amount/100)*0.55;
  let src;
  try{ src=ctx.getImageData(0,0,w,h); }catch(_){ return; }
  const d=src.data;
  const out=ctx.createImageData(w,h);
  const o=out.data;
  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const i=(y*w+x)*4;
      for(let c=0;c<3;c++){
        const v=d[i+c]*5
          -d[((y-1)*w+x)*4+c]
          -d[((y+1)*w+x)*4+c]
          -d[(y*w+x-1)*4+c]
          -d[(y*w+x+1)*4+c];
        const base=d[i+c];
        const nv=base+(v-base)*str;
        o[i+c]=nv<0?0:nv>255?255:nv;
      }
      o[i+3]=d[i+3];
    }
  }
  /* randen kopiëren */
  for(let x=0;x<w;x++){
    for(let c=0;c<4;c++){
      o[x*4+c]=d[x*4+c];
      o[((h-1)*w+x)*4+c]=d[((h-1)*w+x)*4+c];
    }
  }
  for(let y=0;y<h;y++){
    for(let c=0;c<4;c++){
      o[(y*w)*4+c]=d[(y*w)*4+c];
      o[(y*w+w-1)*4+c]=d[(y*w+w-1)*4+c];
    }
  }
  ctx.putImageData(out,0,0);
}

/*
  Filter-pipeline: preset + handmatige correcties.
  Cache-key = filter + alle slider-waarden.
*/
function getFilteredImageSource(o){
  if(!o || !o.img) return o && o.img;
  const key=photoAdjKey(o);
  const a=photoAdj(o);
  const preset=o.filter||"none";
  if(preset==="none" && photoAdjIsDefault(a)){
    o._filterKey=key;
    o._filterCanvas=null;
    return o.img;
  }
  if(o._filterKey===key && o._filterCanvas){
    return o._filterCanvas;
  }
  const w=o.img.naturalWidth||o.img.width||0;
  const h=o.img.naturalHeight||o.img.height||0;
  if(w<1 || h<1) return o.img;

  /* Live-preview: max 900px lange zijde voor snelheid; print later full-res bij export */
  const maxSide=900;
  let dw=w, dh=h;
  if(Math.max(w,h)>maxSide){
    const sc=maxSide/Math.max(w,h);
    dw=Math.max(1, Math.round(w*sc));
    dh=Math.max(1, Math.round(h*sc));
  }

  const c=document.createElement("canvas");
  c.width=dw;
  c.height=dh;
  const x=c.getContext("2d", {willReadFrequently:true});

  const cssParts=[];
  if(preset!=="none" && PHOTO_FILTER_CSS[preset] && PHOTO_FILTER_CSS[preset]!=="none"){
    cssParts.push(PHOTO_FILTER_CSS[preset]);
  }
  if(a.brightness) cssParts.push("brightness("+(1+(a.brightness/100)*0.8).toFixed(3)+")");
  if(a.contrast) cssParts.push("contrast("+(1+(a.contrast/100)*0.9).toFixed(3)+")");
  if(a.saturation) cssParts.push("saturate("+(1+(a.saturation/100)).toFixed(3)+")");
  if(a.blur>0) cssParts.push("blur("+(a.blur*0.12).toFixed(2)+"px)");

  try{
    if(cssParts.length && typeof x.filter!=="undefined"){
      x.filter=cssParts.join(" ");
      x.drawImage(o.img,0,0,dw,dh);
      x.filter="none";
    }else{
      x.drawImage(o.img,0,0,dw,dh);
      if(preset!=="none"){
        const id=x.getImageData(0,0,dw,dh);
        applyPixelFilter(id, preset);
        x.putImageData(id,0,0);
      }
    }
  }catch(_){
    try{
      x.filter="none";
      x.drawImage(o.img,0,0,dw,dh);
      if(preset!=="none"){
        const id=x.getImageData(0,0,dw,dh);
        applyPixelFilter(id, preset);
        x.putImageData(id,0,0);
      }
    }catch(err){
      return o.img;
    }
  }

  /* Pixel-pass voor warmth / shadows / highlights (niet in CSS) */
  if(a.warmth || a.shadows || a.highlights){
    try{
      const id=x.getImageData(0,0,dw,dh);
      applyPhotoAdjustments(id, {brightness:0,contrast:0,saturation:0,warmth:a.warmth,sharpness:0,shadows:a.shadows,highlights:a.highlights,blur:0});
      x.putImageData(id,0,0);
    }catch(_){}
  }
  if(a.sharpness>5){
    try{ applySimpleSharpen(x, dw, dh, a.sharpness); }catch(_){}
  }

  o._filterCanvas=c;
  o._filterKey=key;
  return c;
}


function drawObject(o){

  if(o.visible===false)
    return;

  ctx.save();

  const alpha=typeof o.opacity==="number"?Math.max(0,Math.min(1,o.opacity)):1;
  ctx.globalAlpha=alpha;
  if(o.blendMode && o.blendMode!=="source-over" && o.blendMode!=="normal"){
    try{ ctx.globalCompositeOperation=o.blendMode; }catch(_){}
  }

  if(o.type==="template"){
    const b=bounds();
    const id=o.templateId||"empty";
    if(id!=="empty"){
      paintTileBackgroundPattern(ctx, id, b.x, b.y, b.w, b.h);
    }
    ctx.restore();
    return;
  }

  if(o.type==="pattern"){
    const b=bounds();
    if(typeof paintStructurePattern==="function"){
      paintStructurePattern(ctx, o, b.x, b.y, b.w, b.h);
    }
    ctx.restore();
    return;
  }

  if(o.type==="image"){

    ctx.translate(
      o.x,
      o.y
    );

    ctx.rotate(
      o.rotation*Math.PI/180
    );

    const src=
      getFilteredImageSource(o);

    const w=
      o.img.width*
      o.scale;

    const h=
      o.img.height*
      o.scale;

    ctx.drawImage(
      src,
      -w/2,
      -h/2,
      w,
      h
    );

  }

  if(o.type==="text"){

    ctx.translate(
      o.x,
      o.y
    );

    ctx.rotate(
      (o.rotation||0)*Math.PI/180
    );

    paintStyledText(ctx, o, 1);

  }

  if(o.type==="frame"){
    paintFrame(ctx, o, bounds(), 1);
  }

  if(o.type==="clipart"){
    ctx.translate(o.x, o.y);
    ctx.rotate((o.rotation||0)*Math.PI/180);
    const sz=o.size||72;
    ctx.font=`${sz}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(o.emoji||"⭐", 0, 0);
  }

  ctx.restore();

}


/* =========================================================
   MAIN DRAW
========================================================= */
let textureRender = false;

/* Persistente offscreen buffer voor 3D-texture. */
let designBuffer=null;
let designBufferCtx=null;
function ensureDesignBuffer(){
  if(!designBuffer){
    designBuffer=document.createElement("canvas");
    designBuffer.width=W;
    designBuffer.height=H;
    designBufferCtx=designBuffer.getContext("2d");
  }
  return designBufferCtx;
}

function draw(){

  ctx.clearRect(
    0,
    0,
    W,
    H
  );

  drawBackground();

  ctx.save();

  clipProduct();

  objects.forEach(drawObject);

  ctx.restore();

  /*
    Stippellijn alleen in de 2D-editor, nooit in de
    3D-texture (anders blijft er een "rand" zichtbaar).
  */
  if(product==="tile" && !textureRender){

    const b=bounds();

    ctx.save();

    ctx.strokeStyle=
      "rgba(0,0,0,0.12)";

    ctx.lineWidth=2;
    ctx.setLineDash([8,8]);

    ctx.roundRect(
      b.x+20,
      b.y+20,
      b.w-40,
      b.h-40,
      Math.max(2, b.r-10)
    );

    ctx.stroke();

    ctx.restore();

  }

  if(selected && !textureRender)
    selectionBox();

}


/* =========================================================
   SELECTION
========================================================= */

function selectionBox(){

  if(
    selected.type==="frame"
  )
    return;

  ctx.save();

  ctx.strokeStyle="#c7a97d";
  ctx.lineWidth=3;
  ctx.setLineDash([9,7]);

  if(selected.type==="image"){

    ctx.translate(
      selected.x,
      selected.y
    );

    ctx.rotate(
      selected.rotation*Math.PI/180
    );

    const w=
      selected.img.width*
      selected.scale;

    const h=
      selected.img.height*
      selected.scale;

    ctx.strokeRect(
      -w/2,
      -h/2,
      w,
      h
    );

  }

  if(selected.type==="text"){

    ctx.translate(
      selected.x,
      selected.y
    );

    ctx.rotate(
      selected.rotation*Math.PI/180
    );

    ctx.font=
      `${selected.weight} ${selected.size}px ${selected.font}`;

    const w=
      ctx.measureText(
        selected.text
      ).width;

    ctx.strokeRect(
      -w/2-15,
      -selected.size/2-15,
      w+30,
      selected.size+30
    );

  }

  ctx.restore();

}


/* =========================================================
   PHOTO
========================================================= */

/* Recente uploads (dataURL) voor Foto-paneel */
const recentPhotos=[];

function pushRecentPhoto(dataUrl, name){
  if(!dataUrl) return;
  recentPhotos.unshift({src:dataUrl, name:name||"Foto", t:Date.now()});
  if(recentPhotos.length>12) recentPhotos.length=12;
}

function getSelectedImage(){
  if(selected&&selected.type==="image") return selected;
  return objects.find(o=>o.type==="image"&&o.visible!==false)||null;
}

function photoPosPct(axis){
  const img=getSelectedImage();
  if(!img) return 0;
  const b=typeof bounds==="function"?bounds():{x:0,y:0,w:W,h:H};
  const cx=b.x+b.w/2, cy=b.y+b.h/2;
  if(axis==="x") return Math.round(((img.x-cx)/b.w)*100);
  return Math.round(((img.y-cy)/b.h)*100);
}

function photoScalePct(){
  const img=getSelectedImage();
  if(!img||!img.img) return 100;
  const b=typeof bounds==="function"?bounds():{w:1000,h:1000};
  const fit=Math.max(b.w/img.img.width, b.h/img.img.height);
  const sc=typeof img.scale==="number"?img.scale:fit;
  return Math.round((sc/fit)*100);
}

function photoRotDeg(){
  const img=getSelectedImage();
  if(!img) return 0;
  let r=img.rotation||0;
  r=((r%360)+360)%360;
  return Math.round(r);
}

function nudgePhoto(dx, dy){
  const img=getSelectedImage();
  if(!img){ toast("Selecteer eerst een foto"); return; }
  selected=img;
  const b=typeof bounds==="function"?bounds():{w:1000,h:1000};
  const step=Math.max(4, b.w*0.02);
  img.x+=(dx||0)*step;
  img.y+=(dy||0)*step;
  if(typeof clearFitActive==="function") clearFitActive();
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(80);
  updatePhotoPanelValues();
}

function setPhotoScalePct(pct){
  const img=getSelectedImage();
  if(!img||!img.img) return;
  selected=img;
  const b=typeof bounds==="function"?bounds():{w:1000,h:1000};
  const fit=Math.max(b.w/img.img.width, b.h/img.img.height);
  const n=Math.max(5, Math.min(400, parseFloat(pct)||100));
  img.scale=fit*(n/100);
  if(typeof clearFitActive==="function") clearFitActive();
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(60);
  updatePhotoPanelValues();
}

function setPhotoRotationAbs(deg){
  const img=getSelectedImage();
  if(!img) return;
  selected=img;
  img.rotation=((parseFloat(deg)||0)%360+360)%360;
  if(typeof clearFitActive==="function") clearFitActive();
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(60);
  updatePhotoPanelValues();
}

function updatePhotoPanelValues(){
  const xEl=document.getElementById("photoPosX");
  const yEl=document.getElementById("photoPosY");
  const scEl=document.getElementById("photoScaleVal");
  const scIn=document.getElementById("photoScaleSlider");
  const rotEl=document.getElementById("photoRotVal");
  const rotIn=document.getElementById("photoRotSlider");
  if(xEl) xEl.textContent=photoPosPct("x")+"%";
  if(yEl) yEl.textContent=photoPosPct("y")+"%";
  const sp=photoScalePct();
  if(scEl) scEl.textContent=sp+" %";
  if(scIn) scIn.value=String(sp);
  const rd=photoRotDeg();
  if(rotEl) rotEl.textContent=rd+"°";
  if(rotIn) rotIn.value=String(rd);
}

function selectRecentPhoto(idx){
  const entry=recentPhotos[idx];
  if(!entry||!entry.src) return;
  /* Zoek bestaande laag met zelfde src, anders opnieuw toevoegen via dataURL */
  const existing=objects.find(function(o){
    return o.type==="image"&&o.img&&(o.img.src===entry.src||o.img.currentSrc===entry.src);
  });
  if(existing){
    selected=existing;
    if(typeof selected.opacity!=="number") selected.opacity=1;
    layers();
    if(typeof renderRpLayers==="function") renderRpLayers();
    draw();
    if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();
    updatePhotoPanelValues();
    toast("Foto geselecteerd");
    return;
  }
  const img=new Image();
  img.onload=function(){
    const b=bounds();
    const scale=Math.max(b.w/img.width, b.h/img.height);
    selected={
      type:"image", name:entry.name||"Mijn foto", img,
      x:W/2, y:H/2, scale, rotation:0, filter:"none",
      opacity:1, blendMode:"source-over", visible:true, locked:false
    };
    objects.push(selected);
    saveHistory();
    draw(); layers(); refresh3D();
    if(typeof renderPhotoPanel==="function") renderPhotoPanel();
    toast("Foto toegevoegd");
  };
  img.src=entry.src;
}

function renderPhotoPanel(){
  const left=document.getElementById("left");
  if(!left) return;
  left.classList.add("open","photo-panel");
  if(typeof openSheetDefault==="function") openSheetDefault();
  if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();

  const img=getSelectedImage();
  const hasImg=!!img;
  const xPct=photoPosPct("x");
  const yPct=photoPosPct("y");
  const scPct=photoScalePct();
  const rot=photoRotDeg();
  const opPct=img&&typeof img.opacity==="number"?Math.round(img.opacity*100):100;

  /* Recente: recentPhotos + huidige object-lagen */
  let recentHtml="";
  const thumbs=[];
  recentPhotos.forEach(function(r,i){
    if(r&&r.src) thumbs.push({src:r.src, idx:i, fromRecent:true});
  });
  objects.forEach(function(o){
    if(o.type==="image"&&o.img){
      const src=o.img.currentSrc||o.img.src;
      if(src&&!thumbs.some(function(t){ return t.src===src; })){
        thumbs.push({src:src, obj:o, fromRecent:false});
      }
    }
  });
  if(thumbs.length){
    recentHtml=`
      <div class="section">
        <div class="photo-sec-title">
          <span>Recente foto's</span>
          <button type="button" class="photo-all-link" onclick="toast('Alle recente foto\\'s')">Alles ›</button>
        </div>
        <div class="photo-recent">
          ${thumbs.slice(0,10).map(function(t,i){
            const act=img&&(img.img&&(img.img.src===t.src||img.img.currentSrc===t.src))?" active":"";
            if(t.fromRecent){
              return '<button type="button" class="photo-recent-thumb'+act+'" onclick="selectRecentPhoto('+t.idx+')"><img src="'+t.src+'" alt=""></button>';
            }
            const oi=objects.indexOf(t.obj);
            return '<button type="button" class="photo-recent-thumb'+act+'" onclick="select('+oi+');updatePhotoPanelValues()"><img src="'+t.src+'" alt=""></button>';
          }).join("")}
        </div>
      </div>`;
  }

  const isMob=typeof isMobile==="function"&&isMobile();
  const actionsRow=`
    <div class="photo-actions photo-actions-top">
      <button class="action" type="button" onclick="duplicate()">⧉ Laag dupliceren</button>
      <button class="action danger" type="button" onclick="removeSelectedPhoto()">🗑 Verwijderen</button>
    </div>`;
  /* Desktop: acties bovenaan onder Foto kiezen. Mobiel: sticky onderaan (ongewijzigd). */
  const actionsTop=isMob?"":('<div class="section photo-actions-section">'+actionsRow+"</div>");
  const actionsBottom=isMob?('<div class="photo-sticky-footer"><div class="photo-actions">'+
    '<button class="action" type="button" onclick="duplicate()">⧉ Laag dupliceren</button>'+
    '<button class="action danger" type="button" onclick="removeSelectedPhoto()">🗑 Verwijderen</button>'+
    "</div></div>"):"";

  const body=`
    <div class="panel-sub">Upload je foto en plaats hem precies op de tegel.</div>

    <div class="section">
      <label class="upload">
        <input class="file" id="photoInput" type="file" accept="image/png,image/jpeg,image/webp,image/*">
        <strong>＋ Foto kiezen</strong>
        <small>PNG · JPG · WEBP</small>
      </label>
    </div>

    ${actionsTop}

    ${recentHtml}

    <div class="section">
      <div class="photo-sec-title"><span>Positie</span></div>
      <div class="photo-pos-row">
        <button type="button" class="photo-nudge" onclick="nudgePhoto(-1,0)" title="Links">←</button>
        <button type="button" class="photo-center-btn" onclick="center()">Centreer</button>
        <button type="button" class="photo-nudge" onclick="nudgePhoto(1,0)" title="Rechts">→</button>
      </div>
      <div class="photo-xy">
        <div class="photo-xy-card"><span>X</span><strong id="photoPosX">${xPct}%</strong></div>
        <div class="photo-xy-card"><span>Y</span><strong id="photoPosY">${yPct}%</strong></div>
      </div>
    </div>

    <div class="section">
      <div class="photo-sec-title"><span>Schaal</span></div>
      <div class="photo-slider-row">
        <input type="range" id="photoScaleSlider" min="5" max="400" value="${scPct}"
          oninput="setPhotoScalePct(this.value)">
        <span class="photo-slider-val" id="photoScaleVal">${scPct} %</span>
      </div>
    </div>

    <div class="section">
      <div class="photo-sec-title"><span>Rotatie</span></div>
      <div class="photo-slider-row">
        <input type="range" id="photoRotSlider" min="0" max="360" value="${rot}"
          oninput="setPhotoRotationAbs(this.value)">
        <span class="photo-slider-val" id="photoRotVal">${rot}°</span>
      </div>
    </div>

    <div class="section" id="layerOpacitySection">
      <div class="photo-sec-title"><span>Transparantie</span></div>
      <div class="photo-slider-row">
        <input type="range" id="layerOpSlider" class="layer-op-slider" data-layer-opacity min="0" max="100"
          value="${opPct}" oninput="setSelectedOpacity(this.value/100);updatePhotoPanelValues()">
        <span class="photo-slider-val layer-op-label" id="layerOpLabel">${opPct}%</span>
      </div>
      <div class="label" style="margin-top:10px;font-size:11px;color:var(--muted)">Overvloeien</div>
      <select id="layerBlendSelect" class="layer-blend-select" data-layer-blend onchange="setSelectedBlend(this.value)"
        style="width:100%;margin-top:4px;padding:8px;border-radius:8px;background:var(--panel2);color:var(--text);border:1px solid var(--border)">
        <option value="source-over">Normaal</option>
        <option value="multiply">Vermenigvuldigen</option>
        <option value="screen">Scherm</option>
        <option value="overlay">Overlay</option>
        <option value="soft-light">Zacht licht</option>
      </select>
    </div>

    <div class="section">
      <div class="photo-sec-title"><span>Kleurfilter</span></div>
      <div class="option-grid">
        <button type="button" class="option" onclick="setPhotoFilter('none')">Origineel</button>
        <button type="button" class="option" onclick="setPhotoFilter('grayscale')">Zwart-wit</button>
        <button type="button" class="option" onclick="setPhotoFilter('sepia')">Sepia</button>
        <button type="button" class="option" onclick="setPhotoFilter('saturate')">Meer kleur</button>
        <button type="button" class="option" onclick="setPhotoFilter('soft')">Zacht</button>
        <button type="button" class="option" onclick="setPhotoFilter('warm')">Warm</button>
      </div>
    </div>

    ${actionsBottom}
  `;

  left.innerHTML=typeof sheetWrap==="function"?sheetWrap("Foto", body):body;

  const input=document.getElementById("photoInput");
  if(input){
    input.addEventListener("change", function(e){
      addPhoto(e.target.files&&e.target.files[0]);
    });
  }
  if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();
  updatePhotoPanelValues();
  if(typeof updateFitButton==="function") updateFitButton();
  if(typeof syncMobileLayerActionVisibility==="function") syncMobileLayerActionVisibility();
}

function removeSelectedPhoto(){
  if(!selected||selected.type!=="image"){
    const img=getSelectedImage();
    if(img) selected=img;
  }
  if(!selected||selected.type!=="image"){
    toast("Selecteer eerst een foto");
    return;
  }
  removeSelected();
  if(typeof renderPhotoPanel==="function") renderPhotoPanel();
}

function addPhoto(file){

  if(!file)
    return;

  const reader=
    new FileReader();

  reader.onload=e=>{
    const dataUrl=e.target.result;
    pushRecentPhoto(dataUrl, file.name||"Mijn foto");

    const img=
      new Image();

    img.onload=()=>{

      const b=bounds();

      const scale=
        Math.max(
          b.w/img.width,
          b.h/img.height
        );

      selected={

        type:"image",

        name:"Mijn foto",

        img,

        x:W/2,
        y:H/2,

        scale,

        rotation:0,

        filter:"none",

        opacity:1,

        blendMode:"source-over",

        visible:true,

        locked:false

      };

      objects.push(selected);

      saveHistory();

      draw();

      layers();

      refresh3D();

      toast(
        "Foto toegevoegd"
      );

      /* Mobiel: groot Foto-paneel sluiten na succesvolle upload */
      if(typeof isMobile==="function" && isMobile()){
        if(typeof closeSheet==="function") closeSheet();
        if(typeof closeDesignSlider==="function") closeDesignSlider();
      }else if(typeof renderPhotoPanel==="function"){
        renderPhotoPanel();
      }
      if(typeof updateToolbarPhotoState==="function") updateToolbarPhotoState();

    };

    img.src=dataUrl;

  };

  reader.readAsDataURL(file);

}


/* =========================================================
   TEXT — styling + compact menu
========================================================= */

function fontFaceCSS(family){
  const f=family||"Georgia";
  return /\s/.test(f)?`"${f}"`:f;
}

function fontStack(weight, sizePx, family){
  return `${weight||400} ${sizePx}px ${fontFaceCSS(family)}`;
}

/** Gedeelde canvas-render voor tekst (2D + 3D-texture) */
function paintStyledText(c, o, scale){
  const s=scale||1;
  const size=Math.max(8, (o.size||40)*s);
  const text=o.text||"";
  c.font=fontStack(o.weight||400, size, o.font||"Georgia");
  c.textAlign="center";
  c.textBaseline="middle";

  /* Schaduw */
  if(o.shadow){
    const str=typeof o.shadowStrength==="number"?o.shadowStrength:0.35;
    const dist=(typeof o.shadowDistance==="number"?o.shadowDistance:4)*s;
    const soft=typeof o.shadowSoftness==="number"?o.shadowSoftness:1.2;
    c.shadowColor=o.shadowColor||("rgba(0,0,0,"+Math.max(0,Math.min(1,str))+")");
    c.shadowBlur=Math.max(0, dist*soft);
    c.shadowOffsetY=Math.max(0, dist);
    c.shadowOffsetX=Math.max(0, dist*0.35);
  }else{
    c.shadowColor="transparent";
    c.shadowBlur=0;
    c.shadowOffsetX=0;
    c.shadowOffsetY=0;
  }

  /* Fill / gradient */
  let fill;
  if(o.colorMode==="gradient"){
    const metrics=c.measureText(text||" ");
    const tw=Math.max(20, metrics.width);
    const th=size;
    const dir=o.gradientDir||"horizontal";
    let grd;
    if(dir==="vertical") grd=c.createLinearGradient(0,-th/2,0,th/2);
    else if(dir==="diagonal") grd=c.createLinearGradient(-tw/2,-th/2,tw/2,th/2);
    else grd=c.createLinearGradient(-tw/2,0,tw/2,0);
    grd.addColorStop(0, o.color||"#2d476b");
    grd.addColorStop(1, o.color2||"#c9a66b");
    fill=grd;
  }else{
    fill=o.color||"#2d476b";
  }

  /* Bevel & Emboss: licht/donker offset */
  if(o.bevel){
    const depth=(typeof o.bevelDepth==="number"?o.bevelDepth:3)*s;
    const light=typeof o.bevelLight==="number"?o.bevelLight:0.55;
    const shade=typeof o.bevelShade==="number"?o.bevelShade:0.4;
    const angle=(typeof o.bevelAngle==="number"?o.bevelAngle:135)*Math.PI/180;
    const ox=Math.cos(angle)*depth;
    const oy=Math.sin(angle)*depth;
    const prevSC=c.shadowColor, prevSB=c.shadowBlur, prevSX=c.shadowOffsetX, prevSY=c.shadowOffsetY;
    c.shadowColor="transparent";
    c.shadowBlur=0;
    c.shadowOffsetX=0;
    c.shadowOffsetY=0;
    const style=o.bevelStyle||"outer";
    if(style==="inner"){
      c.fillStyle=`rgba(255,255,255,${light})`;
      c.fillText(text, ox*0.5, oy*0.5);
      c.fillStyle=`rgba(0,0,0,${shade})`;
      c.fillText(text, -ox*0.5, -oy*0.5);
    }else{
      c.fillStyle=`rgba(0,0,0,${shade})`;
      c.fillText(text, ox, oy);
      c.fillStyle=`rgba(255,255,255,${light})`;
      c.fillText(text, -ox, -oy);
    }
    if(o.shadow){
      c.shadowColor=prevSC;
      c.shadowBlur=prevSB;
      c.shadowOffsetX=prevSX;
      c.shadowOffsetY=prevSY;
    }
  }

  /* Outline / lijn */
  if(o.outline){
    const strength=Math.max(0.5, (typeof o.outlineStrength==="number"?o.outlineStrength:4)*s);
    const dist=(typeof o.outlineDistance==="number"?o.outlineDistance:0)*s;
    c.lineWidth=strength+dist;
    c.strokeStyle=o.outlineColor||"#000000";
    c.lineJoin="round";
    c.miterLimit=2;
    c.strokeText(text, 0, 0);
  }

  c.fillStyle=fill;
  c.fillText(text, 0, 0);

  c.shadowColor="transparent";
  c.shadowBlur=0;
  c.shadowOffsetX=0;
  c.shadowOffsetY=0;
}

function buildFontOptionsHTML(current){
  const cur=current||"Georgia";
  const groups=[
    ["Normaal", [
      ["Arial","Arial"],["Helvetica","Helvetica"],["Roboto","Roboto"],
      ["Open Sans","Open Sans"],["Lato","Lato"],["Montserrat","Montserrat"],["Poppins","Poppins"]
    ]],
    ["Klassiek / luxe", [
      ["Georgia","Georgia"],["Times New Roman","Times New Roman"],
      ["Playfair Display","Playfair Display"],["Cormorant Garamond","Cormorant Garamond"],["Cinzel","Cinzel"]
    ]],
    ["Sans / modern", [
      ["Bebas Neue","Bebas Neue"],["Oswald","Oswald"],["Anton","Anton"],
      ["Raleway","Raleway"],["League Spartan","League Spartan"]
    ]],
    ["Sierletters / script", [
      ["Great Vibes","Great Vibes"],["Allura","Allura"],["Pacifico","Pacifico"],
      ["Dancing Script","Dancing Script"],["Sacramento","Sacramento"],["Lobster","Lobster"],["Satisfy","Satisfy"]
    ]],
    ["Handwritten", [
      ["Caveat","Caveat"],["Indie Flower","Indie Flower"],
      ["Permanent Marker","Permanent Marker"],["Patrick Hand","Patrick Hand"]
    ]]
  ];
  let html="";
  groups.forEach(function(g){
    html+=`<optgroup label="${g[0]}">`;
    g[1].forEach(function(pair){
      const val=pair[0], label=pair[1];
      html+=`<option value="${val}" style="font-family:${fontFaceCSS(val)},sans-serif" ${cur===val?"selected":""}>${label}</option>`;
    });
    html+=`</optgroup>`;
  });
  return html;
}

function buildTextEditorHTML(s){
  const ss=Math.round((s.shadowStrength??0.35)*100);
  const sd=s.shadowDistance??4;
  const soft=Math.round((s.shadowSoftness??1.2)*100);
  const mode=s.colorMode||"solid";
  const outlineOn=!!s.outline;
  const bevelOn=!!s.bevel;
  return `
  <div class="text-form-grid">
    <div class="section-block">
      <div class="label">Tekst</div>
      <input id="textValue" type="text" value="${esc(s.text)}" oninput="updateText()" class="td-input" style="min-height:38px">
    </div>
    <div class="section-block">
      <div class="label">Lettertype</div>
      <select id="textFont" onchange="updateText()" class="td-input" style="font-family:${fontFaceCSS(s.font||"Georgia")},sans-serif">
        ${buildFontOptionsHTML(s.font)}
      </select>
    </div>

    <div class="section-block">
      <div class="label">Grootte <span id="sizeDisplay">${s.size||72} px</span></div>
      <input id="textSize" type="range" min="12" max="180" value="${s.size||72}" oninput="updateText()" class="td-range">
    </div>
    <div class="section-block">
      <div class="label">Dikte</div>
      <select id="textWeight" onchange="updateText()" class="td-input">
        <option value="400" ${Number(s.weight)===400?"selected":""}>Normaal</option>
        <option value="600" ${Number(s.weight)===600?"selected":""}>Semi-bold</option>
        <option value="700" ${Number(s.weight)===700?"selected":""}>Vet</option>
        <option value="900" ${Number(s.weight)===900?"selected":""}>Extra vet</option>
      </select>
    </div>

    <div class="section-block span2">
      <div class="label">Kleur</div>
      <div class="row-inline" style="margin-bottom:6px">
        <label class="td-radio"><input type="radio" name="colorMode" value="solid" ${mode==="solid"?"checked":""} onchange="updateText();showText()"> Effen</label>
        <label class="td-radio"><input type="radio" name="colorMode" value="gradient" ${mode==="gradient"?"checked":""} onchange="updateText();showText()"> Gradient</label>
      </div>
      <div class="colors-pair">
        <div style="display:flex;align-items:center;gap:6px">
          <input id="textColor" type="color" value="${s.color||"#2d476b"}" oninput="updateText()" onchange="updateText()" class="td-color">
          <span class="td-muted">${mode==="gradient"?"Kleur 1":"Tekstkleur"}</span>
        </div>
        <div id="gradientExtras" style="display:${mode==="gradient"?"flex":"none"};align-items:center;gap:6px">
          <input id="textColor2" type="color" value="${s.color2||"#c9a66b"}" oninput="updateText()" onchange="updateText()" class="td-color">
          <span class="td-muted">Kleur 2</span>
        </div>
      </div>
      <div id="gradientDirWrap" style="display:${mode==="gradient"?"block":"none"};margin-top:6px">
        <select id="gradientDir" onchange="updateText()" class="td-input">
          <option value="horizontal" ${(s.gradientDir||"horizontal")==="horizontal"?"selected":""}>Horizontaal</option>
          <option value="vertical" ${s.gradientDir==="vertical"?"selected":""}>Verticaal</option>
          <option value="diagonal" ${s.gradientDir==="diagonal"?"selected":""}>Diagonaal</option>
        </select>
      </div>
    </div>

    <div class="section-block">
      <label class="td-check">
        <input id="textShadow" type="checkbox" ${s.shadow?"checked":""} onchange="updateText();showText()">
        Schaduw
      </label>
      <div id="shadowSliders" style="display:${s.shadow?"block":"none"}">
        <div class="label">Sterkte <span id="shadowStrengthLabel">${ss}%</span></div>
        <input id="shadowStrength" type="range" min="0" max="100" value="${ss}" oninput="updateText()" class="td-range">
        <div class="label">Afstand <span id="shadowDistanceLabel">${sd} px</span></div>
        <input id="shadowDistance" type="range" min="0" max="24" value="${sd}" oninput="updateText()" class="td-range">
        <div class="label">Zachtheid <span id="shadowSoftLabel">${soft}%</span></div>
        <input id="shadowSoftness" type="range" min="20" max="300" value="${soft}" oninput="updateText()" class="td-range">
        <div class="label" style="margin-top:4px">Kleur</div>
        <input id="shadowColor" type="color" value="${s.shadowColor&&s.shadowColor[0]==="#"?s.shadowColor:"#000000"}" oninput="updateText()" class="td-color">
      </div>
    </div>

    <div class="section-block">
      <label class="td-check">
        <input id="textOutline" type="checkbox" ${outlineOn?"checked":""} onchange="updateText();showText()">
        Lijn / omtrek
      </label>
      <div id="outlineSliders" style="display:${outlineOn?"block":"none"}">
        <div class="label">Kleur</div>
        <input id="outlineColor" type="color" value="${s.outlineColor||"#000000"}" oninput="updateText()" class="td-color">
        <div class="label">Sterkte <span id="outlineStrengthLabel">${s.outlineStrength??4} px</span></div>
        <input id="outlineStrength" type="range" min="1" max="24" value="${s.outlineStrength??4}" oninput="updateText()" class="td-range">
        <div class="label">Afstand <span id="outlineDistanceLabel">${s.outlineDistance??0} px</span></div>
        <input id="outlineDistance" type="range" min="0" max="16" value="${s.outlineDistance??0}" oninput="updateText()" class="td-range">
      </div>
    </div>

    <div class="section-block span2">
      <label class="td-check">
        <input id="textBevel" type="checkbox" ${bevelOn?"checked":""} onchange="updateText();showText()">
        Bevel &amp; Emboss
      </label>
      <div id="bevelSliders" style="display:${bevelOn?"grid":"none"};grid-template-columns:1fr 1fr;gap:6px 10px;margin-top:4px">
        <div>
          <div class="label">Stijl</div>
          <select id="bevelStyle" onchange="updateText()" class="td-input">
            <option value="outer" ${(s.bevelStyle||"outer")==="outer"?"selected":""}>Buiten</option>
            <option value="inner" ${s.bevelStyle==="inner"?"selected":""}>Binnen</option>
          </select>
        </div>
        <div>
          <div class="label">Richting <span id="bevelAngleLabel">${s.bevelAngle??135}°</span></div>
          <input id="bevelAngle" type="range" min="0" max="360" value="${s.bevelAngle??135}" oninput="updateText()" class="td-range">
        </div>
        <div>
          <div class="label">Diepte <span id="bevelDepthLabel">${s.bevelDepth??3}</span></div>
          <input id="bevelDepth" type="range" min="1" max="12" value="${s.bevelDepth??3}" oninput="updateText()" class="td-range">
        </div>
        <div>
          <div class="label">Licht <span id="bevelLightLabel">${Math.round((s.bevelLight??0.55)*100)}%</span></div>
          <input id="bevelLight" type="range" min="10" max="100" value="${Math.round((s.bevelLight??0.55)*100)}" oninput="updateText()" class="td-range">
        </div>
        <div>
          <div class="label">Schaduw <span id="bevelShadeLabel">${Math.round((s.bevelShade??0.4)*100)}%</span></div>
          <input id="bevelShade" type="range" min="10" max="100" value="${Math.round((s.bevelShade??0.4)*100)}" oninput="updateText()" class="td-range">
        </div>
      </div>
    </div>
  </div>`;
}

function addText(){

  selected={

    type:"text",

    name:"Nieuwe tekst",

    text:"Jouw tekst",

    x:W/2,

    y:H/2,

    size:72,

    font:"Georgia",

    weight:700,

    color:"#2d476b",

    color2:"#c9a66b",

    colorMode:"solid",

    gradientDir:"horizontal",

    rotation:0,

    shadow:false,

    shadowStrength:0.35,

    shadowDistance:4,

    shadowSoftness:1.2,

    shadowColor:"#000000",

    outline:false,

    outlineColor:"#000000",

    outlineStrength:4,

    outlineDistance:0,

    bevel:false,

    bevelStyle:"outer",

    bevelDepth:3,

    bevelAngle:135,

    bevelLight:0.55,

    bevelShade:0.4,

    visible:true,

    locked:false

  };

  objects.push(selected);

  saveHistory();

  draw();

  layers();

  if(typeof refresh3D==="function") refresh3D();
  if(typeof updateText3dBar==="function") updateText3dBar();

  showText();

}

function updateText(){

  if(!selected || selected.type!=="text")
    return;

  const tv=document.getElementById("textValue");
  if(tv) selected.text=tv.value||" ";

  const ts=document.getElementById("textSize");
  if(ts) selected.size=Number(ts.value)||selected.size||40;

  const tf=document.getElementById("textFont");
  if(tf){
    selected.font=tf.value;
    tf.style.fontFamily=fontFaceCSS(tf.value)+",sans-serif";
  }

  const tc=document.getElementById("textColor");
  if(tc) selected.color=tc.value;

  const tc2=document.getElementById("textColor2");
  if(tc2) selected.color2=tc2.value;

  const cm=document.querySelector('input[name="colorMode"]:checked');
  if(cm) selected.colorMode=cm.value;

  const gd=document.getElementById("gradientDir");
  if(gd) selected.gradientDir=gd.value;

  const tw=document.getElementById("textWeight");
  if(tw) selected.weight=Number(tw.value)||400;

  const sh=document.getElementById("textShadow");
  if(sh) selected.shadow=!!sh.checked;

  const ss=document.getElementById("shadowStrength");
  const sd=document.getElementById("shadowDistance");
  const soft=document.getElementById("shadowSoftness");
  const sc=document.getElementById("shadowColor");
  if(ss) selected.shadowStrength=Number(ss.value)/100;
  if(sd) selected.shadowDistance=Number(sd.value);
  if(soft) selected.shadowSoftness=Number(soft.value)/100;
  if(sc) selected.shadowColor=sc.value;

  const ol=document.getElementById("textOutline");
  if(ol) selected.outline=!!ol.checked;
  const oc=document.getElementById("outlineColor");
  const os=document.getElementById("outlineStrength");
  const od=document.getElementById("outlineDistance");
  if(oc) selected.outlineColor=oc.value;
  if(os) selected.outlineStrength=Number(os.value);
  if(od) selected.outlineDistance=Number(od.value);

  const bv=document.getElementById("textBevel");
  if(bv) selected.bevel=!!bv.checked;
  const bs=document.getElementById("bevelStyle");
  const bd=document.getElementById("bevelDepth");
  const ba=document.getElementById("bevelAngle");
  const bl=document.getElementById("bevelLight");
  const bsh=document.getElementById("bevelShade");
  if(bs) selected.bevelStyle=bs.value;
  if(bd) selected.bevelDepth=Number(bd.value);
  if(ba) selected.bevelAngle=Number(ba.value);
  if(bl) selected.bevelLight=Number(bl.value)/100;
  if(bsh) selected.bevelShade=Number(bsh.value)/100;

  selected.name=selected.text;

  const sizeEl=document.getElementById("sizeDisplay");
  if(sizeEl) sizeEl.textContent=selected.size+" px";

  const ssLab=document.getElementById("shadowStrengthLabel");
  const sdLab=document.getElementById("shadowDistanceLabel");
  const softLab=document.getElementById("shadowSoftLabel");
  if(ssLab && ss) ssLab.textContent=ss.value+"%";
  if(sdLab && sd) sdLab.textContent=sd.value+" px";
  if(softLab && soft) softLab.textContent=soft.value+"%";

  const osLab=document.getElementById("outlineStrengthLabel");
  const odLab=document.getElementById("outlineDistanceLabel");
  if(osLab && os) osLab.textContent=os.value+" px";
  if(odLab && od) odLab.textContent=od.value+" px";

  const bdLab=document.getElementById("bevelDepthLabel");
  const baLab=document.getElementById("bevelAngleLabel");
  const blLab=document.getElementById("bevelLightLabel");
  const bshLab=document.getElementById("bevelShadeLabel");
  if(bdLab && bd) bdLab.textContent=bd.value;
  if(baLab && ba) baLab.textContent=ba.value+"°";
  if(blLab && bl) blLab.textContent=bl.value+"%";
  if(bshLab && bsh) bshLab.textContent=bsh.value+"%";

  const wrap=document.getElementById("shadowSliders");
  if(wrap) wrap.style.display=selected.shadow?"block":"none";
  const olw=document.getElementById("outlineSliders");
  if(olw) olw.style.display=selected.outline?"block":"none";
  const bvw=document.getElementById("bevelSliders");
  if(bvw) bvw.style.display=selected.bevel?"grid":"none";

  const gx=document.getElementById("gradientExtras");
  if(gx) gx.style.display=selected.colorMode==="gradient"?"flex":"none";
  const gdw=document.getElementById("gradientDirWrap");
  if(gdw) gdw.style.display=selected.colorMode==="gradient"?"block":"none";

  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(150);
  else if(typeof refresh3D==="function") refresh3D();

}


/* =========================================================
   TOOL PANELS
========================================================= */


function hasUploadedPhoto(){
  return objects.some(o=>o.type==="image" && o.visible!==false);
}

function updateToolbarPhotoState(){
  const bar=document.querySelector(".toolbar");
  const photoBtn=document.getElementById("toolPhoto");
  if(!bar) return;
  const has=hasUploadedPhoto();
  bar.classList.toggle("has-photo", has);
  if(photoBtn){
    if(has){
      photoBtn.classList.remove("active");
    }
  }
  /* Product links onderaan op mobiel wanneer Foto weg is */
  const prod=bar.querySelector(".tool-product");
  if(prod && isMobile()){
    if(has){
      bar.insertBefore(prod, bar.firstChild);
    }
  }
}



function setupKeyboardGuard(){
  if(!window.visualViewport) return;
  const onResize=()=>{
    const vv=window.visualViewport;
    const covered=window.innerHeight - vv.height > 120;
    document.body.classList.toggle("kb-open", covered && isMobile());
    if(typeof resize3D==="function" && threeReady){
      try{ resize3D(); }catch(_){}
    }
  };
  visualViewport.addEventListener("resize", onResize);
  visualViewport.addEventListener("scroll", onResize);
  window.addEventListener("resize", function(){
    if(typeof updateTextDockHeight==="function") updateTextDockHeight();
    if(typeof fitMobileStage==="function") fitMobileStage();
  });
}

function isMobile(){
  return window.matchMedia("(max-width:760px)").matches;
}

/* =========================================================
   MOBIEL: sleepbaar bottom-sheet (Zakeke-achtig)
   Omlaag slepen → sheet kleiner → product groter
   Omhoog slepen → sheet groter → product kleiner
========================================================= */

let sheetHeightPx=0;
let sheetDrag=null;

function sheetLimits(){
  const vh=window.innerHeight||600;
  /* Max ~42% zodat studio/tegel altijd zichtbaar blijft boven het menu */
  return {
    min: Math.round(vh*0.18),
    mid: Math.round(vh*0.32),
    max: Math.round(vh*0.42)
  };
}

/** Mobiel: stage altijd product-AR (default 1:1), past binnen workspace zonder stretch */
function fitMobileStage(){
  if(typeof isMobile!=="function" || !isMobile()) return;
  const ws=document.querySelector(".workspace");
  const stage=document.querySelector(".stage");
  if(!ws||!stage) return;
  const pad=8;
  const aw=Math.max(40, ws.clientWidth - pad);
  const ah=Math.max(40, ws.clientHeight - pad);
  let ar=1;
  try{
    const raw=(getComputedStyle(document.documentElement).getPropertyValue("--tile-ar")||"1").trim();
    if(raw.indexOf("/")>=0){
      const p=raw.split("/");
      ar=(parseFloat(p[0])||1)/(parseFloat(p[1])||1);
    }else if(parseFloat(raw)>0){
      ar=parseFloat(raw);
    }
  }catch(_){}
  if(!(ar>0)) ar=1;
  /* Alleen CSS-weergavegrootte — canvas buffer (1200×1200) blijft intact */
  const outW=Math.floor(Math.min(aw, ah*ar));
  const outH=Math.floor(outW/ar);
  stage.style.width=outW+"px";
  stage.style.height=outH+"px";
  stage.style.maxWidth=outW+"px";
  stage.style.maxHeight=outH+"px";
  stage.style.aspectRatio=ar+" / 1";
  /* Nooit canvas.width/height wijzigen hier — voorkomt kwaliteitsverlies */
}

function applySheetHeight(px, animate){
  if(!isMobile()){
    document.documentElement.style.setProperty("--sheet-h","0px");
    document.body.classList.remove("panel-open");
    return;
  }
  const lim=sheetLimits();
  sheetHeightPx=Math.max(lim.min, Math.min(lim.max, Math.round(px)));
  const root=document.documentElement;
  if(animate===false){
    root.classList.add("sheet-no-anim");
  }
  root.style.setProperty("--sheet-h", sheetHeightPx+"px");
  document.body.classList.toggle("panel-open", sheetHeightPx > 0 || (parseFloat(getComputedStyle(root).getPropertyValue("--text-dock-h"))||0) > 0);
  /* Studio inklinken + tegel opnieuw passend (AR behouden) */
  if(typeof fitMobileStage==="function"){
    fitMobileStage();
    requestAnimationFrame(function(){ fitMobileStage(); });
  }
  if(typeof resize3D==="function"){
    try{ resize3D(); }catch(_){}
  }
  if(animate===false){
    requestAnimationFrame(()=>root.classList.remove("sheet-no-anim"));
  }
}

function openSheetDefault(){
  if(!isMobile()) return;
  const lim=sheetLimits();
  applySheetHeight(lim.mid, true);
}

function closeSheet(){
  const left=document.getElementById("left");
  if(left){
    left.classList.remove("open","dragging","sheet-text");
    left.innerHTML="";
  }
  const right=document.querySelector(".right");
  if(right){
    right.classList.remove("open","mobile-sheet","dragging");
  }
  document
    .querySelectorAll(".tool")
    .forEach(b=>b.classList.remove("active"));
  if(isMobile()){
    applySheetHeight(0, true);
    document.documentElement.style.setProperty("--sheet-h","0px");
    sheetHeightPx=0;
    document.body.classList.remove("has-selected-layer");
    if(typeof fitMobileStage==="function"){
      requestAnimationFrame(function(){ fitMobileStage(); });
    }
  }
  if(typeof closeTextDock==="function") closeTextDock();
}

function bindSheetDrag(container){
  if(!container || !isMobile()) return;
  const handle=container.querySelector(".sheet-handle");
  if(!handle || handle.dataset.dragBound) return;
  handle.dataset.dragBound="1";

  const onStart=(e)=>{
    const y=e.touches?e.touches[0].clientY:e.clientY;
    sheetDrag={
      startY:y,
      startH: sheetHeightPx || sheetLimits().mid,
      el:container
    };
    container.classList.add("dragging");
    e.preventDefault();
  };

  const onMove=(e)=>{
    if(!sheetDrag) return;
    const y=e.touches?e.touches[0].clientY:e.clientY;
    /* vinger omlaag → sheet kleiner; omhoog → groter */
    const dy=sheetDrag.startY - y;
    applySheetHeight(sheetDrag.startH + dy, false);
    e.preventDefault();
  };

  const onEnd=()=>{
    if(!sheetDrag) return;
    const el=sheetDrag.el;
    sheetDrag=null;
    el.classList.remove("dragging");
    const lim=sheetLimits();
    /* Snap naar dichtstbijzijnde: min / mid / max of dichtdoen */
    const h=sheetHeightPx;
    if(h < lim.min + (lim.mid-lim.min)*0.35){
      closeSheet();
      return;
    }
    if(h < (lim.mid+lim.max)/2){
      applySheetHeight(lim.mid, true);
    }else{
      applySheetHeight(lim.max, true);
    }
  };

  handle.addEventListener("pointerdown", onStart, {passive:false});
  window.addEventListener("pointermove", onMove, {passive:false});
  window.addEventListener("pointerup", onEnd);
  window.addEventListener("pointercancel", onEnd);
}

function sheetWrap(title, bodyHtml){
  return `
    <div class="sheet-handle" role="presentation" aria-label="Sleep omhoog of omlaag"></div>
    <div class="sheet-header">
      <div class="panel-title">${title}</div>
      <button type="button" class="sheet-close" onclick="closeConfigPanelNav(event)" title="Paneel inklappen" aria-label="Paneel inklappen">✕</button>
    </div>
    <div class="sheet-body">
      ${bodyHtml}
    </div>
  `;
}

/** Desktop: grote sidebar inklappen; mobiel: sheet sluiten */
function closeConfigPanelNav(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  if(typeof isMobile==="function" && isMobile()){
    if(typeof closeSheet==="function") closeSheet();
    return;
  }
  closeLeftConfigPanel();
}

function openLeftConfigPanel(){
  if(typeof isMobile==="function" && isMobile()) return;
  document.body.classList.add("left-panel-open");
  const left=document.getElementById("left");
  if(left) left.classList.add("open");
  /* Geen resize3D / draw — preview blijft pixelvast */
}

function closeLeftConfigPanel(){
  if(typeof isMobile==="function" && isMobile()) return;
  document.body.classList.remove("left-panel-open");
  const left=document.getElementById("left");
  if(left){
    /* Inhoud behouden voor snelle heropen; panel is visueel dicht */
    left.classList.remove("open");
  }
  /* Geen resize3D — tegel/camera/zoom blijven staan */
}

function tool(name,button){

  document
    .querySelectorAll(".tool")
    .forEach(
      b=>b.classList.remove("active")
    );

  if(button) button.classList.add("active");

  /*
    Desktop: smalle icon-rail → klik opent altijd het grote configpaneel
    met de gekozen sectie. Overlay: geen preview-shift.
  */
  const isDesktopNav=!(typeof isMobile==="function" && isMobile());
  if(isDesktopNav && name!=="product"){
    if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();
  }

  const left=
    document.getElementById("left");

  const right=
    document.querySelector(".right");

  /* Product: desktop = open/expand rechterpaneel; mobiel = sheet */
  if(name==="product"){
    if(!(typeof isMobile==="function" && isMobile())){
      /*
        Productpaneel opent rechts. Klap het linker configuratiemenu
        automatisch dicht zodat er op laptop niet drie panelen tegelijk
        openstaan en de tegel onnodig klein wordt.
      */
      const leftConfig=document.getElementById("left");
      if(leftConfig) leftConfig.classList.remove("open");
      document.body.classList.remove("left-panel-open");
      if(typeof closeLeftConfigPanel==="function") closeLeftConfigPanel();
    }

    if(typeof isMobile==="function" && isMobile()){
      left.classList.remove("open");
      left.innerHTML="";
      if(right){
        right.classList.add("mobile-sheet","open");
        if(!right.querySelector(".sheet-handle")){
          const chrome=document.createElement("div");
          chrome.innerHTML=`
            <div class="sheet-handle" role="presentation"></div>
            <div class="sheet-header">
              <div class="panel-title">Product</div>
              <button type="button" class="sheet-close" onclick="closeSheet()" aria-label="Sluiten">✕</button>
            </div>
          `;
          while(chrome.firstChild){
            right.insertBefore(chrome.firstChild, right.firstChild);
          }
          const keep=[];
          Array.from(right.children).forEach(ch=>{
            if(
              ch.classList.contains("sheet-handle")||
              ch.classList.contains("sheet-header")||
              ch.classList.contains("sheet-scroll")||
              ch.classList.contains("right-header")||
              ch.classList.contains("right-scroll")
            ) return;
            keep.push(ch);
          });
          const scrollHost=right.querySelector(".right-scroll")||right;
          if(!right.querySelector(".sheet-scroll")){
            const sc=document.createElement("div");
            sc.className="sheet-scroll";
            keep.forEach(n=>sc.appendChild(n));
            scrollHost.appendChild(sc);
          }
        }
        /* Product-sheet hoger openen zodat winkelwagen bereikbaar is */
        if(typeof sheetLimits==="function" && typeof applySheetHeight==="function"){
          const lim=sheetLimits();
          applySheetHeight(Math.round(Math.max(lim.mid*1.35, lim.max*0.72)), true);
        }else if(typeof openSheetDefault==="function"){
          openSheetDefault();
        }
        bindSheetDrag(right);
      }
      return;
    }
    /* Desktop Formaat: EXACT dezelfde actie als de ☰-knop — NIET Aanpassen */
    if(typeof toggleLayerMenu==="function"){
      toggleLayerMenu();
    }
    return;
  }

  /* Overige tools: maximáál één menu — Aanpassen dicht, linker config open */
  if(isDesktopNav && typeof toggleAanpassenPanel==="function" && typeof aanpassenOpen!=="undefined" && aanpassenOpen){
    try{ toggleAanpassenPanel(false); }catch(_){}
  }

  if(name==="filters"){
    if(typeof openColorFiltersPanel==="function") openColorFiltersPanel();
    if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();
    return;
  }

  if(name==="layers"){
    if(typeof showLayersInLeft==="function") showLayersInLeft();
    else if(typeof toggleLayersPanel==="function") toggleLayersPanel();
    if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();
    return;
  }

  if(name==="help"){
    if(!left) return;
    left.classList.add("open");
    if(typeof openSheetDefault==="function") openSheetDefault();
    if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();
    left.innerHTML=typeof sheetWrap==="function"?sheetWrap("Help", `
      <div class="panel-sub">Snel starten met de designstudio.</div>
      <div class="section">
        <div class="label">Selecteren</div>
        <p style="margin:0 0 10px;font-size:12px;line-height:1.45;color:var(--muted)">Dubbelklik (desktop) of dubbeltik (mobiel) op een foto of tekst om te selecteren.</p>
        <div class="label">Verplaatsen</div>
        <p style="margin:0 0 10px;font-size:12px;line-height:1.45;color:var(--muted)">Sleep de geselecteerde laag. Op lege ruimte draai je de 3D-tegel.</p>
        <div class="label">Menu</div>
        <p style="margin:0;font-size:12px;line-height:1.45;color:var(--muted)">Gebruik de smalle icon-balk links. ✕ klapt het grote paneel in; de tegel blijft staan.</p>
      </div>
    `):"";
    return;
  }

  if(right){
    right.classList.remove("open","mobile-sheet");
  }

  if(typeof closeTextDock==="function" && name!=="text") closeTextDock();

  left.classList.add("open");
  openSheetDefault();
  if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();

  if(name==="photo"){
    if(typeof renderPhotoPanel==="function"){
      renderPhotoPanel();
    }else{
      left.innerHTML=typeof sheetWrap==="function"?sheetWrap("Foto", "<div class=\"panel-sub\">Upload een foto.</div>"):"";
    }
    bindSheetDrag(left);
  }

  if(name==="text")
    showText();

  if(name==="frames"){
    showFramesPanel();
  }

  if(name==="clipart"){
    if(typeof showClipartPanel==="function") showClipartPanel();
    return;
  }

  if(name==="background"){
    if(typeof showBackgroundPanel==="function") showBackgroundPanel();
    return;
  }

  if(name==="layers"){

    left.innerHTML=sheetWrap("Lagen", `

      <div class="panel-sub">
        Beheer zichtbaarheid en volgorde.
      </div>

      <div class="section">

        <button
          class="action"
          type="button"
          onclick="moveLayer(-1)">
          ↑ Naar voren
        </button>

        <button
          class="action"
          type="button"
          onclick="moveLayer(1)">
          ↓ Naar achteren
        </button>

        <div class="mobile-layer-actions">
        <button
          class="action"
          type="button"
          onclick="duplicate()">
          ⧉ Dupliceren
        </button>

        <button
          class="action"
          type="button"
          onclick="removeSelected()">
          🗑 Verwijderen
        </button>
        </div>

      </div>
    `);

    bindSheetDrag(left);

  }

}


/* =========================================================
   TEXT PANEL
========================================================= */


function closeTextDock(){
  const dock=document.getElementById("textDock");
  if(dock){
    dock.classList.remove("open","td-move-compact");
  }
  document.documentElement.style.setProperty("--text-dock-h","0px");
  const left=document.getElementById("left");
  if(left){
    left.classList.remove("open","sheet-text","dragging");
  }
  document.querySelectorAll(".tool").forEach(b=>{
    if((b.textContent||"").includes("Tekst")) b.classList.remove("active");
  });
  /* Mobiel: X = direct einde tekstselectie + verplaatsmodus + text-bar weg */
  if(typeof isMobile==="function" && isMobile()){
    text3dEdit=false;
    text3dDrag=null;
    if(typeof exitMobileTextMoveMode==="function") exitMobileTextMoveMode();
    document.body.classList.remove("text-move-mode","has-text-selected");
    const b=document.getElementById("btnText3dEdit");
    if(b) b.classList.remove("active");
    if(selected && selected.type==="text"){
      selected=null;
    }
    if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();
    const bar=document.getElementById("text3dBar");
    if(bar){
      bar.style.display="none";
      bar.classList.remove("show");
    }
    const m3=document.getElementById("mobile3dBar");
    if(m3) m3.classList.remove("text-controls-active");
    if(typeof layers==="function") layers();
    if(typeof draw==="function") draw();
  }
  const sh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sheet-h")) || 0;
  if(sh <= 0) document.body.classList.remove("panel-open");
  if(typeof resize3D==="function"){ try{resize3D();}catch(_){}}
  if(typeof fitMobileStage==="function") fitMobileStage();
  if(typeof updateText3dBar==="function") updateText3dBar();
  if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
}

function updateTextDockHeight(){
  if(!isMobile()) return;
  const dock=document.getElementById("textDock");
  if(!dock || !dock.classList.contains("open")){
    document.documentElement.style.setProperty("--text-dock-h","0px");
    const sh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sheet-h")) || 0;
    if(sh <= 0) document.body.classList.remove("panel-open");
    return;
  }
  /* dock content-hoogte, met max zodat tegel ruimte houdt */
  const h=Math.min(dock.offsetHeight||0, Math.round((window.innerHeight||600)*0.48));
  document.documentElement.style.setProperty("--text-dock-h", h+"px");
  document.body.classList.add("panel-open");
  if(typeof resize3D==="function"){ try{resize3D();}catch(_){}}
}

function openTextDock(title, bodyHtml){
  const dock=document.getElementById("textDock");
  const body=document.getElementById("textDockBody");
  const tit=document.getElementById("textDockTitle");
  if(!dock || !body) return false;
  if(tit) tit.textContent=title||"Tekst";
  body.innerHTML=bodyHtml;
  dock.classList.add("open");
  document.body.classList.add("panel-open");
  /* Compacte tekstbediening verbergen zolang het uitgebreide menu open is */
  const compact=document.getElementById("text3dBar");
  if(compact){
    compact.style.display="none";
    compact.classList.remove("show");
  }
  requestAnimationFrame(()=>{
    updateTextDockHeight();
    requestAnimationFrame(updateTextDockHeight);
  });
  return true;
}

function showText(){

  const left=document.getElementById("left");

  /* ===== MOBIEL: één text-dock onder de tegel, boven 2D/3D ===== */
  if(isMobile()){
    /* geen oude bottom-sheet / left panel */
    if(left){
      left.classList.remove("open","sheet-text","dragging");
      left.innerHTML="";
    }
    document.documentElement.style.setProperty("--sheet-h","0px");
    sheetHeightPx=0;

    /* Bestaande tekstlaag hergebruiken i.p.v. altijd "toevoegen" */
    if(!selected || selected.type!=="text"){
      if(typeof ensureTextSelected==="function" && ensureTextSelected()){
        /* selected is nu de bestaande tekst → door naar editor hieronder */
      } else {
        openTextDock("Tekst", `
          <div class="section" style="margin-top:0">
            <button class="action beige" type="button" onclick="addText()">＋ Tekst toevoegen</button>
          </div>
        `);
        return;
      }
    }

    openTextDock("Tekst", `
      <div class="td-compact">
        <div class="td-row3" style="grid-template-columns:1.5fr 0.7fr 0.7fr 0.7fr;gap:5px;margin-bottom:5px">
          <button type="button" class="action td-btn ${text3dEdit?"beige":""}" id="dockTextMoveBtn"
            onclick="toggleText3dEdit()" style="margin:0;font-size:11px;padding:6px 5px;min-height:38px">
            Tekst verplaatsen
          </button>
          <button type="button" class="action td-btn" onclick="text3dSize(-8)">A−</button>
          <button type="button" class="action td-btn" onclick="text3dSize(8)">A+</button>
          <button type="button" class="action td-btn td-trash" onclick="removeSelectedText()" title="Tekst verwijderen">🗑</button>
        </div>
        ${buildTextEditorHTML(selected)}
        <button type="button" class="action td-delete" onclick="removeSelectedText()">
          🗑 Tekst verwijderen
        </button>
      </div>
    `);
    return;
  }

  /* ===== DESKTOP: left-panel, 2-koloms compact ===== */
  if(left) left.classList.add("open","sheet-text");
  openSheetDefault();
  if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();

  if(!selected || selected.type!=="text"){
    if(typeof ensureTextSelected==="function" && ensureTextSelected()){
      /* bestaande tekst geselecteerd → editor hieronder */
    } else {
      left.innerHTML=sheetWrap("Tekst", `
        <div class="section">
          <button class="action beige" type="button" onclick="addText()">＋ Tekst toevoegen</button>
        </div>
      `);
      return;
    }
  }

  left.innerHTML=sheetWrap("Tekst", `
    <div class="td-compact">
      ${buildTextEditorHTML(selected)}
      <button type="button" class="action td-delete" onclick="removeSelectedText()" style="margin-top:8px">
        🗑 Tekst verwijderen
      </button>
    </div>
  `);

}


/* =========================================================
   FRAMES — catalogus + procedurele tekening
========================================================= */

const FRAME_CATALOG=[
  /* Klassiek / Delfts */
  {id:"delft-classic",cat:"klassiek",name:"Delft klassiek",color:"#3d70a8",accent:"#aac1dd"},
  {id:"delft-ornament",cat:"klassiek",name:"Delft ornament",color:"#2f5f96",accent:"#9bb8d9"},
  {id:"delft-flower",cat:"klassiek",name:"Delft bloem",color:"#3a6ea5",accent:"#c5d6ea"},
  {id:"delft-scroll",cat:"klassiek",name:"Delft krul",color:"#355f8f",accent:"#b7cce0"},
  /* Bloemen & botanisch */
  {id:"flora-corners",cat:"bloemen",name:"Bloemhoeken",color:"#6b8f71",accent:"#a8c4a0"},
  {id:"flora-vine",cat:"bloemen",name:"Ranken",color:"#58775d",accent:"#8fad8a"},
  {id:"flora-rose",cat:"bloemen",name:"Rozenhoek",color:"#8b5a6b",accent:"#c9a0ab"},
  {id:"flora-leaf",cat:"bloemen",name:"Bladerrand",color:"#4f7a55",accent:"#9fbf9a"},
  {id:"flora-dense",cat:"bloemen",name:"Botanisch dicht",color:"#5c7a58",accent:"#b5c9b0"},
  /* Sierlijk / vintage */
  {id:"vintage-scroll",cat:"vintage",name:"Vintage krul",color:"#6b5a4a",accent:"#c4b4a0"},
  {id:"vintage-baroque",cat:"vintage",name:"Barok hoek",color:"#5a4a3a",accent:"#d4c4b0"},
  {id:"vintage-lace",cat:"vintage",name:"Kantlijn",color:"#7a6a5a",accent:"#e0d4c8"},
  {id:"vintage-tile",cat:"vintage",name:"Tegelornament",color:"#8a6a4a",accent:"#dcc8a8"},
  /* Modern */
  {id:"modern-double",cat:"modern",name:"Dubbele lijn",color:"#3a3a3a",accent:"#8a8a8a"},
  {id:"modern-thin",cat:"modern",name:"Fijne lijn",color:"#4a4a4a",accent:"#b0b0b0"},
  {id:"modern-geo",cat:"modern",name:"Geometrisch",color:"#2d476b",accent:"#8aa0b8"},
  {id:"modern-corner",cat:"modern",name:"Minimal hoek",color:"#333333",accent:"#999999"},
  {id:"modern-inset",cat:"modern",name:"Inset kader",color:"#444444",accent:"#aaaaaa"},
  /* Luxe */
  {id:"gold-classic",cat:"luxe",name:"Goud klassiek",color:"#b68b42",accent:"#ead7ad"},
  {id:"gold-ornament",cat:"luxe",name:"Goud ornament",color:"#c9a24a",accent:"#f0e0b8"},
  {id:"gold-double",cat:"luxe",name:"Goud dubbel",color:"#a67c32",accent:"#e8d5a0"},
  {id:"gold-filigree",cat:"luxe",name:"Filigraan",color:"#b8954a",accent:"#f5e6c0"},
  /* Speels */
  {id:"play-stars",cat:"speels",name:"Sterretjes",color:"#c9a66b",accent:"#f0ddc0"},
  {id:"play-hearts",cat:"speels",name:"Hartjes",color:"#c07080",accent:"#f0c0c8"},
  {id:"play-dots",cat:"speels",name:"Stippenrand",color:"#6a8a9a",accent:"#c0d4e0"},
  {id:"play-leaves",cat:"speels",name:"Blaadjes",color:"#7a9a60",accent:"#c8dcb0"},
  /* Scandinavisch */
  {id:"nordic-simple",cat:"nordic",name:"Nordic lijn",color:"#5a6a6a",accent:"#b0b8b8"},
  {id:"nordic-leaf",cat:"nordic",name:"Nordic blad",color:"#6a7a6a",accent:"#c0ccc0"},
  {id:"nordic-geo",cat:"nordic",name:"Nordic geo",color:"#4a5a5a",accent:"#a8b0b0"},
  {id:"nordic-quiet",cat:"nordic",name:"Rustige rand",color:"#7a8a8a",accent:"#d0d8d8"}
];

const FRAME_CAT_LABELS={
  all:"Alle",
  klassiek:"Klassiek",
  bloemen:"Bloemen",
  vintage:"Vintage",
  modern:"Modern",
  luxe:"Luxe",
  speels:"Speels",
  nordic:"Scandi"
};

function frameMeta(id){
  return FRAME_CATALOG.find(f=>f.id===id)||FRAME_CATALOG[0];
}

function paintFrame(ctx, o, b, scale){
  if(!b||!o) return;
  const s=scale||1;
  const meta=frameMeta(o.style);
  const color=o.color||meta.color||"#3d70a8";
  const accent=o.accent||meta.accent||color;
  const alpha=typeof o.opacity==="number"?o.opacity:1;
  const thick=(typeof o.thickness==="number"?o.thickness:1)*s;
  const inset=(o.inset!=null?o.inset:18)*s;
  const x=b.x+inset, y=b.y+inset, w=b.w-inset*2, h=b.h-inset*2;
  if(w<20||h<20) return;

  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.lineCap="round";
  ctx.lineJoin="round";

  const id=o.style||meta.id;

  /* —— helpers —— */
  function border(pad, lw, col){
    ctx.strokeStyle=col;
    ctx.lineWidth=Math.max(0.5,lw*thick);
    ctx.strokeRect(x+pad, y+pad, w-pad*2, h-pad*2);
  }
  function cornerFlourish(cx,cy,rot,size,col){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(rot);
    ctx.strokeStyle=col;
    ctx.lineWidth=Math.max(1,2.2*thick);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(size*0.15,-size*0.4, size*0.55,-size*0.55, size*0.85,-size*0.2);
    ctx.bezierCurveTo(size*1.05,size*0.05, size*0.7,size*0.35, size*0.35,size*0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size*0.12,size*0.08);
    ctx.bezierCurveTo(size*0.35,-size*0.15, size*0.65,-size*0.1, size*0.75,size*0.15);
    ctx.stroke();
    ctx.restore();
  }
  function cornerFlower(cx,cy,rot,size,col){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(rot);
    ctx.fillStyle=col;
    ctx.strokeStyle=col;
    ctx.lineWidth=Math.max(0.8,1.5*thick);
    for(let i=0;i<5;i++){
      const a=(i/5)*Math.PI*2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a)*size*0.35, Math.sin(a)*size*0.35, size*0.28, size*0.16, a, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0,0,size*0.14,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
  function cornerLeaf(cx,cy,rot,size,col){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(rot);
    ctx.strokeStyle=col;
    ctx.fillStyle=col;
    ctx.lineWidth=Math.max(0.8,1.4*thick);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.quadraticCurveTo(size*0.4,-size*0.35, size*0.9,0);
    ctx.quadraticCurveTo(size*0.4,size*0.35, 0,0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size*0.1,0);
    ctx.lineTo(size*0.75,0);
    ctx.stroke();
    ctx.restore();
  }
  function cornerGeo(cx,cy,rot,size,col){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(rot);
    ctx.strokeStyle=col;
    ctx.lineWidth=Math.max(1,2*thick);
    ctx.beginPath();
    ctx.moveTo(0,size);
    ctx.lineTo(0,0);
    ctx.lineTo(size,0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size*0.25,size*0.55);
    ctx.lineTo(size*0.25,size*0.25);
    ctx.lineTo(size*0.55,size*0.25);
    ctx.stroke();
    ctx.restore();
  }
  function cornerScroll(cx,cy,rot,size,col){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(rot);
    ctx.strokeStyle=col;
    ctx.lineWidth=Math.max(1,2*thick);
    ctx.beginPath();
    ctx.moveTo(size*0.05,size*0.9);
    ctx.bezierCurveTo(size*0.05,size*0.2, size*0.2,size*0.05, size*0.9,size*0.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size*0.35,size*0.35,size*0.18, Math.PI*0.2, Math.PI*1.6);
    ctx.stroke();
    ctx.restore();
  }
  function alongBorder(fn, step){
    const top=Math.max(3, Math.floor(w/step));
    const side=Math.max(3, Math.floor(h/step));
    for(let i=1;i<top;i++){
      const px=x+(i/top)*w;
      fn(px, y, 0);
      fn(px, y+h, Math.PI);
    }
    for(let i=1;i<side;i++){
      const py=y+(i/side)*h;
      fn(x, py, -Math.PI/2);
      fn(x+w, py, Math.PI/2);
    }
  }
  function smallStar(cx,cy,r,col){
    ctx.fillStyle=col;
    ctx.beginPath();
    for(let i=0;i<5;i++){
      const a=-Math.PI/2+i*Math.PI*2/5;
      const a2=a+Math.PI/5;
      const r1=r, r2=r*0.4;
      if(i===0) ctx.moveTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
      else ctx.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
      ctx.lineTo(cx+Math.cos(a2)*r2, cy+Math.sin(a2)*r2);
    }
    ctx.closePath();
    ctx.fill();
  }
  function smallHeart(cx,cy,r,col){
    ctx.fillStyle=col;
    ctx.beginPath();
    ctx.moveTo(cx, cy+r*0.35);
    ctx.bezierCurveTo(cx-r, cy-r*0.2, cx-r*0.5, cy-r, cx, cy-r*0.35);
    ctx.bezierCurveTo(cx+r*0.5, cy-r, cx+r, cy-r*0.2, cx, cy+r*0.35);
    ctx.fill();
  }

  const cs=Math.min(w,h)*0.12;

  /* backward-compat oude ids */
  if(id==="delft") id="delft-classic";
  if(id==="gold") id="gold-classic";
  if(id==="botanical") id="flora-vine";
  if(id==="modern") id="modern-double";

  switch(id){
    case "delft-classic":
      border(0, 28, color); border(28, 4, accent);
      break;
    case "delft-ornament":
      border(0, 22, color); border(24, 3, accent);
      cornerFlourish(x+8*s,y+8*s,0,cs,color);
      cornerFlourish(x+w-8*s,y+8*s,Math.PI/2,cs,color);
      cornerFlourish(x+w-8*s,y+h-8*s,Math.PI,cs,color);
      cornerFlourish(x+8*s,y+h-8*s,-Math.PI/2,cs,color);
      break;
    case "delft-flower":
      border(0, 18, color); border(22, 3, accent);
      cornerFlower(x+14*s,y+14*s,0,cs*0.9,color);
      cornerFlower(x+w-14*s,y+14*s,0,cs*0.9,color);
      cornerFlower(x+w-14*s,y+h-14*s,0,cs*0.9,color);
      cornerFlower(x+8*s+6*s,y+h-14*s,0,cs*0.9,color);
      break;
    case "delft-scroll":
      border(0, 16, color); border(20, 2.5, accent);
      cornerScroll(x+6*s,y+6*s,0,cs*1.2,color);
      cornerScroll(x+w-6*s,y+6*s,Math.PI/2,cs*1.2,color);
      cornerScroll(x+w-6*s,y+h-6*s,Math.PI,cs*1.2,color);
      cornerScroll(x+6*s,y+h-6*s,-Math.PI/2,cs*1.2,color);
      break;
    case "flora-corners":
      border(0, 10, color);
      cornerFlower(x+16*s,y+16*s,0,cs,color);
      cornerFlower(x+w-16*s,y+16*s,0,cs,color);
      cornerFlower(x+w-16*s,y+h-16*s,0,cs,color);
      cornerFlower(x+16*s,y+h-16*s,0,cs,color);
      cornerLeaf(x+30*s,y+10*s,0.2,cs*0.7,accent);
      cornerLeaf(x+w-30*s,y+10*s,-0.2,cs*0.7,accent);
      break;
    case "flora-vine":
      border(0, 8, color);
      alongBorder(function(px,py,rot){
        ctx.save();
        ctx.translate(px,py);
        ctx.rotate(rot);
        ctx.strokeStyle=color;
        ctx.lineWidth=Math.max(0.8,1.2*thick);
        ctx.beginPath();
        ctx.moveTo(-6*s,0);
        ctx.quadraticCurveTo(0,-8*s,6*s,0);
        ctx.stroke();
        ctx.restore();
      }, Math.min(w,h)*0.12);
      break;
    case "flora-rose":
      border(0, 12, color); border(16, 2, accent);
      cornerFlower(x+18*s,y+18*s,0,cs*1.1,color);
      cornerFlower(x+w-18*s,y+18*s,0,cs*1.1,color);
      cornerFlower(x+w-18*s,y+h-18*s,0,cs*1.1,color);
      cornerFlower(x+18*s,y+h-18*s,0,cs*1.1,color);
      break;
    case "flora-leaf":
      border(0, 9, color);
      alongBorder(function(px,py,rot){
        cornerLeaf(px,py,rot+Math.PI/2,cs*0.45,color);
      }, Math.min(w,h)*0.14);
      break;
    case "flora-dense":
      border(0, 14, color); border(18, 2.5, accent);
      alongBorder(function(px,py,rot){
        cornerLeaf(px,py,rot,cs*0.35,color);
      }, Math.min(w,h)*0.09);
      cornerFlower(x+20*s,y+20*s,0,cs*0.7,color);
      cornerFlower(x+w-20*s,y+20*s,0,cs*0.7,color);
      cornerFlower(x+w-20*s,y+h-20*s,0,cs*0.7,color);
      cornerFlower(x+20*s,y+h-20*s,0,cs*0.7,color);
      break;
    case "vintage-scroll":
      border(0, 14, color); border(18, 2, accent);
      cornerScroll(x+8*s,y+8*s,0,cs*1.3,color);
      cornerScroll(x+w-8*s,y+8*s,Math.PI/2,cs*1.3,color);
      cornerScroll(x+w-8*s,y+h-8*s,Math.PI,cs*1.3,color);
      cornerScroll(x+8*s,y+h-8*s,-Math.PI/2,cs*1.3,color);
      break;
    case "vintage-baroque":
      border(0, 16, color);
      cornerFlourish(x+10*s,y+10*s,0,cs*1.4,color);
      cornerFlourish(x+w-10*s,y+10*s,Math.PI/2,cs*1.4,color);
      cornerFlourish(x+w-10*s,y+h-10*s,Math.PI,cs*1.4,color);
      cornerFlourish(x+10*s,y+h-10*s,-Math.PI/2,cs*1.4,color);
      border(22, 2, accent);
      break;
    case "vintage-lace":
      border(0, 6, color);
      alongBorder(function(px,py){
        ctx.strokeStyle=color;
        ctx.lineWidth=Math.max(0.6,1*thick);
        ctx.beginPath();
        ctx.arc(px,py,4*s,0,Math.PI*2);
        ctx.stroke();
      }, Math.min(w,h)*0.08);
      border(14, 2, accent);
      break;
    case "vintage-tile":
      border(0, 20, color); border(24, 3, accent);
      cornerGeo(x+10*s,y+10*s,0,cs,color);
      cornerGeo(x+w-10*s,y+10*s,Math.PI/2,cs,color);
      cornerGeo(x+w-10*s,y+h-10*s,Math.PI,cs,color);
      cornerGeo(x+10*s,y+h-10*s,-Math.PI/2,cs,color);
      break;
    case "modern-double":
      border(0, 8, color); border(14, 3, accent);
      break;
    case "modern-thin":
      border(0, 3, color); border(10, 1.5, accent);
      break;
    case "modern-geo":
      border(0, 6, color);
      cornerGeo(x+6*s,y+6*s,0,cs*0.9,color);
      cornerGeo(x+w-6*s,y+6*s,Math.PI/2,cs*0.9,color);
      cornerGeo(x+w-6*s,y+h-6*s,Math.PI,cs*0.9,color);
      cornerGeo(x+6*s,y+h-6*s,-Math.PI/2,cs*0.9,color);
      border(18, 2, accent);
      break;
    case "modern-corner":
      cornerGeo(x+4*s,y+4*s,0,cs*1.1,color);
      cornerGeo(x+w-4*s,y+4*s,Math.PI/2,cs*1.1,color);
      cornerGeo(x+w-4*s,y+h-4*s,Math.PI,cs*1.1,color);
      cornerGeo(x+4*s,y+h-4*s,-Math.PI/2,cs*1.1,color);
      break;
    case "modern-inset":
      border(8, 5, color); border(20, 2, accent); border(28, 1, color);
      break;
    case "gold-classic":
      border(0, 26, color); border(28, 4, accent);
      break;
    case "gold-ornament":
      border(0, 20, color); border(24, 3, accent);
      cornerFlourish(x+10*s,y+10*s,0,cs,color);
      cornerFlourish(x+w-10*s,y+10*s,Math.PI/2,cs,color);
      cornerFlourish(x+w-10*s,y+h-10*s,Math.PI,cs,color);
      cornerFlourish(x+10*s,y+h-10*s,-Math.PI/2,cs,color);
      break;
    case "gold-double":
      border(0, 14, color); border(18, 5, accent); border(28, 2, color);
      break;
    case "gold-filigree":
      border(0, 10, color); border(14, 2, accent);
      cornerScroll(x+8*s,y+8*s,0,cs*1.15,color);
      cornerScroll(x+w-8*s,y+8*s,Math.PI/2,cs*1.15,color);
      cornerScroll(x+w-8*s,y+h-8*s,Math.PI,cs*1.15,color);
      cornerScroll(x+8*s,y+h-8*s,-Math.PI/2,cs*1.15,color);
      cornerFlourish(x+cs*0.6,y+cs*0.6,0,cs*0.7,accent);
      cornerFlourish(x+w-cs*0.6,y+cs*0.6,Math.PI/2,cs*0.7,accent);
      cornerFlourish(x+w-cs*0.6,y+h-cs*0.6,Math.PI,cs*0.7,accent);
      cornerFlourish(x+cs*0.6,y+h-cs*0.6,-Math.PI/2,cs*0.7,accent);
      break;
    case "play-stars":
      border(0, 5, color);
      alongBorder(function(px,py){ smallStar(px,py,5*s,color); }, Math.min(w,h)*0.11);
      cornerGeo(x+6*s,y+6*s,0,cs*0.6,accent);
      cornerGeo(x+w-6*s,y+6*s,Math.PI/2,cs*0.6,accent);
      cornerGeo(x+w-6*s,y+h-6*s,Math.PI,cs*0.6,accent);
      cornerGeo(x+6*s,y+h-6*s,-Math.PI/2,cs*0.6,accent);
      break;
    case "play-hearts":
      border(0, 5, color);
      alongBorder(function(px,py){ smallHeart(px,py,6*s,color); }, Math.min(w,h)*0.12);
      break;
    case "play-dots":
      border(0, 4, color);
      alongBorder(function(px,py){
        ctx.fillStyle=color;
        ctx.beginPath();
        ctx.arc(px,py,3.5*s,0,Math.PI*2);
        ctx.fill();
      }, Math.min(w,h)*0.07);
      border(14, 2, accent);
      break;
    case "play-leaves":
      border(0, 6, color);
      alongBorder(function(px,py,rot){ cornerLeaf(px,py,rot,cs*0.4,color); }, Math.min(w,h)*0.13);
      break;
    case "nordic-simple":
      border(0, 5, color); border(12, 1.5, accent);
      break;
    case "nordic-leaf":
      border(0, 4, color);
      cornerLeaf(x+12*s,y+12*s,0.4,cs*0.8,color);
      cornerLeaf(x+w-12*s,y+12*s,-0.4,cs*0.8,color);
      cornerLeaf(x+w-12*s,y+h-12*s,Math.PI+0.4,cs*0.8,color);
      cornerLeaf(x+12*s,y+h-12*s,Math.PI-0.4,cs*0.8,color);
      border(16, 1.5, accent);
      break;
    case "nordic-geo":
      border(0, 4, color);
      cornerGeo(x+8*s,y+8*s,0,cs*0.7,color);
      cornerGeo(x+w-8*s,y+8*s,Math.PI/2,cs*0.7,color);
      cornerGeo(x+w-8*s,y+h-8*s,Math.PI,cs*0.7,color);
      cornerGeo(x+8*s,y+h-8*s,-Math.PI/2,cs*0.7,color);
      break;
    case "nordic-quiet":
      border(0, 3, color);
      break;
    default:
      border(0, 16, color); border(20, 3, accent);
  }

  ctx.restore();
}

function drawFramePreview(canvas, styleId){
  if(!canvas) return;
  const ctx=canvas.getContext("2d");
  const W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle="#f3ede3";
  ctx.fillRect(0,0,W,H);
  const meta=frameMeta(styleId);
  paintFrame(ctx, {
    style:styleId,
    color:meta.color,
    accent:meta.accent,
    thickness:1,
    opacity:1,
    inset:8
  }, {x:0,y:0,w:W,h:H}, W/120);
}

let frameFilterCat="all";

function showFramesPanel(){
  const left=document.getElementById("left");
  if(!left) return;
  if(typeof isMobile==="function" && isMobile()){
    /* mobiel: sheet */
  }
  left.classList.add("open","sheet-text");
  if(typeof openSheetDefault==="function") openSheetDefault();
  if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();

  const cats=["all","klassiek","bloemen","vintage","modern","luxe","speels","nordic"];
  const tabs=cats.map(c=>`
    <button type="button" class="frame-tab ${frameFilterCat===c?"active":""}"
      onclick="frameFilterCat='${c}';showFramesPanel()">${FRAME_CAT_LABELS[c]||c}</button>
  `).join("");

  const list=FRAME_CATALOG.filter(f=>frameFilterCat==="all"||f.cat===frameFilterCat);
  const grid=list.map(f=>`
    <button type="button" class="frame-card" data-action="frame" data-value="${f.id}" title="${f.name}">
      <canvas class="frame-preview" width="96" height="96" data-style="${f.id}"></canvas>
      <span class="frame-card-name">${f.name}</span>
    </button>
  `).join("");

  const hasFrame=objects.some(o=>o.type==="frame"&&o.visible!==false);
  const cur=objects.find(o=>o.type==="frame"&&o.visible!==false);

  left.innerHTML=(typeof sheetWrap==="function"?sheetWrap("Kaders", ""):"")+"";
  /* sheetWrap wraps — build body then assign */
  const body=`
    <div class="panel-sub">Decoratieve rand als aparte laag op de tegel</div>
    <div class="frame-tabs">${tabs}</div>
    <div class="frame-grid">${grid}</div>
    ${hasFrame?`
      <div class="section frame-controls">
        <div class="label">Kader aanpassen</div>
        <div class="label">Kleur</div>
        <input type="color" id="frameColor" value="${(cur&&cur.color)||frameMeta(cur.style).color}"
          oninput="updateFrameProps()" style="width:48px;height:36px;border:0;background:transparent">
        <div class="label">Dikte <span id="frameThickLabel">${Math.round(((cur&&cur.thickness)||1)*100)}%</span></div>
        <input type="range" id="frameThickness" min="40" max="180" value="${Math.round(((cur&&cur.thickness)||1)*100)}"
          oninput="updateFrameProps()" style="width:100%;accent-color:var(--beige)">
        <div class="label">Transparantie <span id="frameOpLabel">${Math.round(((cur&&cur.opacity)!=null?cur.opacity:1)*100)}%</span></div>
        <input type="range" id="frameOpacity" min="20" max="100" value="${Math.round(((cur&&cur.opacity)!=null?cur.opacity:1)*100)}"
          oninput="updateFrameProps()" style="width:100%;accent-color:var(--beige)">
        <button type="button" class="action" style="margin-top:8px" onclick="removeFrames()">🗑 Kader verwijderen</button>
      </div>
    `:""}
  `;
  left.innerHTML=typeof sheetWrap==="function"?sheetWrap("Kaders", body):body;
  if(typeof bindSheetDrag==="function") bindSheetDrag(left);
  if(typeof bindPanelActions==="function") bindPanelActions(left);

  requestAnimationFrame(function(){
    left.querySelectorAll("canvas.frame-preview").forEach(function(cv){
      drawFramePreview(cv, cv.getAttribute("data-style"));
    });
  });
}

function addFrame(style){
  const meta=frameMeta(style);
  /* Vervang bestaande kaders — één actief kader houdt het overzichtelijk */
  objects=objects.filter(o=>o.type!=="frame");
  selected={
    type:"frame",
    name:"Kader — "+(meta.name||style),
    style:style,
    color:meta.color,
    accent:meta.accent,
    thickness:1,
    opacity:1,
    inset:18,
    visible:true,
    locked:false
  };
  objects.push(selected);
  saveHistory();
  draw();
  layers();
  if(typeof refresh3D==="function") refresh3D();
  showFramesPanel();
  toast(meta.name||"Kader toegevoegd");
}

function updateFrameProps(){
  const fr=objects.find(o=>o.type==="frame"&&o.visible!==false);
  if(!fr) return;
  const c=document.getElementById("frameColor");
  const t=document.getElementById("frameThickness");
  const op=document.getElementById("frameOpacity");
  if(c) fr.color=c.value;
  if(t){
    fr.thickness=Number(t.value)/100;
    const lab=document.getElementById("frameThickLabel");
    if(lab) lab.textContent=t.value+"%";
  }
  if(op){
    fr.opacity=Number(op.value)/100;
    const lab=document.getElementById("frameOpLabel");
    if(lab) lab.textContent=op.value+"%";
  }
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(120);
}

function removeFrames(){
  objects=objects.filter(o=>o.type!=="frame");
  if(selected&&selected.type==="frame") selected=null;
  saveHistory();
  draw();
  layers();
  if(typeof refresh3D==="function") refresh3D();
  showFramesPanel();
  toast("Kader verwijderd");
}

/* =========================================================
   CLIPART + ACHTERGROND (touch-vriendelijk)
========================================================= */

const CLIPART_ITEMS=[
  {id:"star", emoji:"⭐", name:"Ster"},
  {id:"heart", emoji:"❤️", name:"Hart"},
  {id:"flower", emoji:"🌸", name:"Bloem"},
  {id:"leaf", emoji:"🍃", name:"Blaadje"},
  {id:"sun", emoji:"☀️", name:"Zon"},
  {id:"moon", emoji:"🌙", name:"Maan"},
  {id:"sparkles", emoji:"✨", name:"Sterren"},
  {id:"crown", emoji:"👑", name:"Kroon"}
];

function bindPanelActions(root){
  if(!root) return;
  /* pointerup + swipe-threshold: scroll ≠ klik (iPhone clipart) */
  if(root.dataset.panelBound==="1") return;
  root.dataset.panelBound="1";
  let _pt={x:0,y:0,moved:false};
  root.addEventListener("pointerdown", function(e){
    _pt={x:e.clientX,y:e.clientY,moved:false};
  }, {passive:true});
  root.addEventListener("pointermove", function(e){
    if(Math.abs(e.clientX-_pt.x)>10 || Math.abs(e.clientY-_pt.y)>10) _pt.moved=true;
  }, {passive:true});
  root.addEventListener("pointerup", function(e){
    if(_pt.moved) return; /* swipe → alleen scroll, geen selectie */
    const t=e.target.closest("[data-action]");
    if(!t || !root.contains(t)) return;
    e.preventDefault();
    e.stopPropagation();
    const action=t.getAttribute("data-action");
    const val=t.getAttribute("data-value")||"";
    if(action==="bg") setTileBackground(val);
    else if(action==="pattern") addPatternLayer(val);
    else if(action==="clip") addClipart(val);
    else if(action==="frame") addFrame(val);
  }, {passive:false});
}

function showClipartPanel(){
  const left=document.getElementById("left");
  if(!left) return;
  left.classList.add("open","sheet-text");
  if(typeof openSheetDefault==="function") openSheetDefault();
  if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();

  const grid=CLIPART_ITEMS.map(function(c){
    return `<button type="button" class="clip-card" data-action="clip" data-value="${c.id}" title="${c.name}">
      <span class="clip-emoji">${c.emoji}</span>
      <span class="frame-card-name">${c.name}</span>
    </button>`;
  }).join("");

  const body=`
    <div class="panel-sub">Tik op een icoon om het als laag op de tegel te plaatsen.</div>
    <div class="section">
      <div class="frame-grid">${grid}</div>
    </div>
  `;
  left.innerHTML=typeof sheetWrap==="function"?sheetWrap("Clipart", body):body;
  if(typeof bindSheetDrag==="function") bindSheetDrag(left);
  bindPanelActions(left);
}

function addClipart(id){
  const item=CLIPART_ITEMS.find(c=>c.id===id)||CLIPART_ITEMS[0];
  const b=typeof bounds==="function"?bounds():{x:35,y:35,w:1130,h:1130};
  const obj={
    type:"clipart",
    name:"Clipart — "+item.name,
    emoji:item.emoji,
    clipId:item.id,
    x:b.x+b.w/2,
    y:b.y+b.h/2,
    size:96,
    rotation:0,
    visible:true,
    locked:false
  };
  objects.push(obj);
  selected=obj;
  saveHistory();
  draw();
  layers();
  if(typeof refresh3D==="function") refresh3D();
  if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
  toast(item.name+" toegevoegd");
}

/* =========================================================
   STRUCTUREN & PATRONEN — aparte lagen
========================================================= */
const PATTERN_LIBRARY=[
  /* STRUCTUUR */
  {id:"concreteP",name:"Beton",emoji:"🧱",kind:"structure",color:"#9a9690"},
  {id:"stone",name:"Steen",emoji:"🪨",kind:"structure",color:"#7a7a72"},
  {id:"marbleP",name:"Marmer",emoji:"◇",kind:"structure",color:"#e8e0d4"},
  {id:"woodgrain",name:"Houtnerf",emoji:"🪵",kind:"structure",color:"#8b5a2b"},
  {id:"metal",name:"Metaal",emoji:"⚙️",kind:"structure",color:"#8a9098"},
  {id:"fabric",name:"Stof",emoji:"🧵",kind:"structure",color:"#6a5a4a"},
  {id:"leather",name:"Leer",emoji:"🟤",kind:"structure",color:"#5a3a28"},
  {id:"ceramic",name:"Keramiek",emoji:"🏺",kind:"structure",color:"#c8b8a0"},
  {id:"grain",name:"Korrel",emoji:"·",kind:"structure",color:"#a09080"},
  {id:"sand",name:"Zand",emoji:"🏖️",kind:"structure",color:"#d4c08a"},
  /* PATRONEN */
  {id:"grass",name:"Graspatroon",emoji:"🌿",kind:"pattern",color:"#3d7a3a"},
  {id:"foam",name:"Schuimpatroon",emoji:"☁️",kind:"pattern",color:"#d8e8f0"},
  {id:"dots",name:"Stippen",emoji:"⋯",kind:"pattern",color:"#6a5a7a"},
  {id:"grid",name:"Raster",emoji:"▦",kind:"pattern",color:"#4a4a55"},
  {id:"geo",name:"Geometrisch",emoji:"⬡",kind:"pattern",color:"#5a4a6a"},
  {id:"lines",name:"Lijnen",emoji:"═",kind:"pattern",color:"#5a6a7a"},
  {id:"waves",name:"Golven",emoji:"〰",kind:"pattern",color:"#2a6a8a"},
  {id:"hex",name:"Hexagon",emoji:"⬡",kind:"pattern",color:"#4a5a6a"},
  {id:"diamond",name:"Ruit",emoji:"◇",kind:"pattern",color:"#6a4a5a"},
  {id:"starsP",name:"Sterren",emoji:"✦",kind:"pattern",color:"#1a1a2e"},
  {id:"circles",name:"Cirkelpatroon",emoji:"◯",kind:"pattern",color:"#4a6a7a"},
  {id:"waterP",name:"Golfpatroon",emoji:"💧",kind:"pattern",color:"#3a7a9a"},
  {id:"gloss",name:"Glans",emoji:"✨",kind:"pattern",color:"#c8d0e0"},
  {id:"mist",name:"Mist",emoji:"🌫",kind:"pattern",color:"#b0b8c0"}
];

function paintStructurePattern(ctx, o, x, y, w, h){
  if(!o||!ctx) return;
  const id=o.patternId||"grass";
  const intensity=typeof o.intensity==="number"?o.intensity:0.65;
  const dens=typeof o.density==="number"?o.density:0.55;
  const sc=typeof o.patternScale==="number"?o.patternScale:0.4;
  const rot=((o.rotation||0)*Math.PI)/180;
  const freq=typeof o.frequency==="number"?o.frequency:0.5;
  const lineW=typeof o.lineWidth==="number"?o.lineWidth:0.4;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.clip();
  ctx.translate(x+w/2, y+h/2);
  ctx.rotate(rot);
  ctx.translate(-(x+w/2), -(y+h/2));

  const cell=Math.max(6, 18*(0.35+sc*1.4));
  const step=cell*(0.55+dens*0.7);
  const a=0.15+intensity*0.75;

  let seed=0;
  const key=id+(o.name||"");
  for(let i=0;i<key.length;i++) seed=(seed*31+key.charCodeAt(i))>>>0;
  function rnd(){ seed=(seed*1664525+1013904223)>>>0; return (seed&0xffff)/0xffff; }

  if(id==="grass"){
    ctx.strokeStyle="rgba(40,100,40,"+a+")";
    ctx.lineWidth=1.2;
    for(let yy=y-cell;yy<y+h+cell;yy+=step){
      for(let xx=x-cell;xx<x+w+cell;xx+=step*0.55){
        const ox=(rnd()-0.5)*step*0.4;
        const oy=(rnd()-0.5)*step*0.2;
        const len=cell*(0.5+rnd()*0.8);
        ctx.beginPath();
        ctx.moveTo(xx+ox, yy+oy);
        ctx.quadraticCurveTo(xx+ox+(rnd()-0.5)*6, yy+oy-len*0.5, xx+ox+(rnd()-0.5)*4, yy+oy-len);
        ctx.stroke();
      }
    }
  }else if(id==="foam"){
    for(let i=0;i<Math.floor(40+dens*80);i++){
      const cx=x+rnd()*w, cy=y+rnd()*h, r=3+rnd()*cell*0.6;
      ctx.beginPath();
      ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.fillStyle="rgba(255,255,255,"+(a*0.35+rnd()*0.2)+")";
      ctx.fill();
    }
  }else if(id==="stone"||id==="concreteP"){
    ctx.fillStyle="rgba(0,0,0,"+(a*0.12)+")";
    for(let i=0;i<Math.floor(30+dens*50);i++){
      ctx.fillRect(x+rnd()*w, y+rnd()*h, 2+rnd()*4, 1+rnd()*3);
    }
    ctx.strokeStyle="rgba(255,255,255,"+(a*0.08)+")";
    for(let i=0;i<12;i++){
      ctx.beginPath();
      ctx.moveTo(x+rnd()*w,y+rnd()*h);
      ctx.lineTo(x+rnd()*w,y+rnd()*h);
      ctx.stroke();
    }
  }else if(id==="sand"){
    ctx.fillStyle="rgba(180,150,80,"+(a*0.35)+")";
    for(let i=0;i<Math.floor(80+dens*120);i++){
      ctx.fillRect(x+rnd()*w, y+rnd()*h, 1+rnd()*2, 1);
    }
  }else if(id==="woodgrain"){
    ctx.strokeStyle="rgba(60,30,10,"+a+")";
    ctx.lineWidth=1.5+lineW*2;
    for(let i=0;i<Math.floor(6+dens*10);i++){
      const yy=y+(i+0.5)*(h/(6+dens*10));
      ctx.beginPath();
      ctx.moveTo(x,yy);
      ctx.bezierCurveTo(x+w*0.3,yy+8*(sc+0.2),x+w*0.7,yy-8*(sc+0.2),x+w,yy);
      ctx.stroke();
    }
  }else if(id==="waterP"||id==="waves"){
    ctx.strokeStyle="rgba(100,180,220,"+a+")";
    ctx.lineWidth=1.5;
    const rows=Math.floor(5+dens*12+freq*8);
    for(let i=0;i<rows;i++){
      const yy=y+(i+0.5)*(h/rows);
      ctx.beginPath();
      ctx.moveTo(x,yy);
      for(let t=0;t<=1;t+=0.05){
        ctx.lineTo(x+t*w, yy+Math.sin(t*Math.PI*2*(2+freq*4)+i)*cell*0.4);
      }
      ctx.stroke();
    }
  }else if(id==="gloss"){
    const g=ctx.createLinearGradient(x,y,x+w,y+h);
    g.addColorStop(0,"rgba(255,255,255,"+(a*0.35)+")");
    g.addColorStop(0.45,"rgba(255,255,255,0)");
    g.addColorStop(0.55,"rgba(255,255,255,0)");
    g.addColorStop(1,"rgba(255,255,255,"+(a*0.2)+")");
    ctx.fillStyle=g;
    ctx.fillRect(x,y,w,h);
  }else if(id==="grid"){
    ctx.strokeStyle="rgba(255,255,255,"+(a*0.45)+")";
    ctx.lineWidth=0.8+lineW*2;
    for(let xx=x;xx<=x+w;xx+=step){
      ctx.beginPath(); ctx.moveTo(xx,y); ctx.lineTo(xx,y+h); ctx.stroke();
    }
    for(let yy=y;yy<=y+h;yy+=step){
      ctx.beginPath(); ctx.moveTo(x,yy); ctx.lineTo(x+w,yy); ctx.stroke();
    }
  }else if(id==="dots"){
    ctx.fillStyle="rgba(255,255,255,"+(a*0.5)+")";
    for(let yy=y;yy<y+h;yy+=step){
      for(let xx=x;xx<x+w;xx+=step){
        ctx.beginPath();
        ctx.arc(xx,yy,1.5+sc*3,0,Math.PI*2);
        ctx.fill();
      }
    }
  }else if(id==="geo"){
    ctx.strokeStyle="rgba(212,175,110,"+(a*0.55)+")";
    ctx.lineWidth=1;
    for(let yy=y;yy<y+h;yy+=step){
      for(let xx=x;xx<x+w;xx+=step){
        const s=cell*0.35;
        ctx.beginPath();
        ctx.moveTo(xx,yy-s); ctx.lineTo(xx+s,yy); ctx.lineTo(xx,yy+s); ctx.lineTo(xx-s,yy); ctx.closePath();
        ctx.stroke();
      }
    }
  }else if(id==="mist"){
    for(let i=0;i<8;i++){
      const g=ctx.createRadialGradient(x+rnd()*w,y+rnd()*h,10,x+rnd()*w,y+rnd()*h,cell*3);
      g.addColorStop(0,"rgba(255,255,255,"+(a*0.25)+")");
      g.addColorStop(1,"rgba(255,255,255,0)");
      ctx.fillStyle=g;
      ctx.fillRect(x,y,w,h);
    }
  }else if(id==="starsP"){
    ctx.fillStyle="rgba(255,255,220,"+a+")";
    for(let i=0;i<Math.floor(20+dens*60);i++){
      const sx=x+rnd()*w, sy=y+rnd()*h, r=0.6+rnd()*2*(0.5+sc);
      ctx.beginPath(); ctx.arc(sx,sy,r,0,Math.PI*2); ctx.fill();
    }
  }else if(id==="marbleP"){
    ctx.strokeStyle="rgba(120,110,100,"+(a*0.35)+")";
    ctx.lineWidth=1;
    for(let i=0;i<14;i++){
      ctx.beginPath();
      ctx.moveTo(x+rnd()*w,y);
      ctx.bezierCurveTo(x+w*0.3,y+h*0.4,x+w*0.7,y+h*0.6,x+rnd()*w,y+h);
      ctx.stroke();
    }
  }else if(id==="metal"){
    const g=ctx.createLinearGradient(x,y,x+w,y+h);
    g.addColorStop(0,"rgba(220,225,230,"+(a*0.4)+")");
    g.addColorStop(0.5,"rgba(120,130,140,"+(a*0.2)+")");
    g.addColorStop(1,"rgba(200,210,220,"+(a*0.35)+")");
    ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
    ctx.strokeStyle="rgba(255,255,255,"+(a*0.15)+")";
    for(let i=0;i<6;i++){
      const yy=y+(i+0.5)*(h/6);
      ctx.beginPath(); ctx.moveTo(x,yy); ctx.lineTo(x+w,yy); ctx.stroke();
    }
  }else if(id==="fabric"||id==="leather"){
    ctx.strokeStyle=id==="leather"?"rgba(40,20,10,"+(a*0.35)+")":"rgba(255,255,255,"+(a*0.2)+")";
    ctx.lineWidth=0.8;
    for(let xx=x;xx<x+w;xx+=step*0.7){
      ctx.beginPath(); ctx.moveTo(xx,y); ctx.lineTo(xx,y+h); ctx.stroke();
    }
    for(let yy=y;yy<y+h;yy+=step*0.7){
      ctx.beginPath(); ctx.moveTo(x,yy); ctx.lineTo(x+w,yy); ctx.stroke();
    }
  }else if(id==="ceramic"||id==="grain"){
    ctx.fillStyle="rgba(0,0,0,"+(a*0.1)+")";
    for(let i=0;i<Math.floor(60+dens*80);i++){
      ctx.fillRect(x+rnd()*w,y+rnd()*h,1+rnd()*2,1+rnd()*2);
    }
  }else if(id==="lines"){
    ctx.strokeStyle="rgba(255,255,255,"+(a*0.45)+")";
    ctx.lineWidth=1+lineW*2;
    for(let yy=y;yy<=y+h;yy+=step){
      ctx.beginPath(); ctx.moveTo(x,yy); ctx.lineTo(x+w,yy); ctx.stroke();
    }
  }else if(id==="hex"||id==="diamond"){
    ctx.strokeStyle="rgba(212,175,110,"+(a*0.5)+")";
    ctx.lineWidth=1;
    for(let yy=y;yy<y+h;yy+=step){
      for(let xx=x;xx<x+w;xx+=step){
        const s=cell*0.35;
        ctx.beginPath();
        if(id==="hex"){
          for(let k=0;k<6;k++){
            const ang=(Math.PI/3)*k-Math.PI/6;
            const px=xx+Math.cos(ang)*s, py=yy+Math.sin(ang)*s;
            if(k===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
          }
          ctx.closePath();
        }else{
          ctx.moveTo(xx,yy-s); ctx.lineTo(xx+s,yy); ctx.lineTo(xx,yy+s); ctx.lineTo(xx-s,yy); ctx.closePath();
        }
        ctx.stroke();
      }
    }
  }else if(id==="circles"){
    ctx.strokeStyle="rgba(255,255,255,"+(a*0.4)+")";
    ctx.lineWidth=1;
    for(let yy=y;yy<y+h;yy+=step){
      for(let xx=x;xx<x+w;xx+=step){
        ctx.beginPath(); ctx.arc(xx,yy,cell*0.25,0,Math.PI*2); ctx.stroke();
      }
    }
  }else{
    ctx.fillStyle="rgba(255,255,255,"+(a*0.15)+")";
    for(let i=0;i<40;i++) ctx.fillRect(x+rnd()*w,y+rnd()*h,2,2);
  }
  ctx.restore();
}

function addPatternLayer(patternId){
  const meta=PATTERN_LIBRARY.find(p=>p.id===patternId)||PATTERN_LIBRARY[0];
  const obj={
    type:"pattern",
    patternId:meta.id,
    name:meta.name,
    emoji:meta.emoji||"▣",
    opacity:0.65,
    intensity:0.65,
    patternScale:0.4,
    density:0.55,
    rotation:0,
    frequency:0.5,
    lineWidth:0.4,
    blendMode:"source-over",
    visible:true,
    locked:false
  };
  objects.push(obj);
  selected=obj;
  saveHistory();
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(80);
  else if(typeof refresh3D==="function") refresh3D();
  layers();
  if(typeof renderRpLayers==="function") renderRpLayers();
  if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();
  if(typeof showBackgroundPanel==="function"){
    showBackgroundPanel(meta.kind==="pattern"?"patterns":"structure");
  }
  toast(meta.name+" toegevoegd");
}

function setPatternProp(prop, value){
  if(!selected||selected.type!=="pattern") return;
  const n=parseFloat(value);
  if(!isFinite(n)) return;
  if(prop==="opacity") selected.opacity=Math.max(0,Math.min(1,n));
  else if(prop==="intensity") selected.intensity=Math.max(0,Math.min(1,n));
  else if(prop==="patternScale") selected.patternScale=Math.max(0.05,Math.min(1,n));
  else if(prop==="density") selected.density=Math.max(0.05,Math.min(1,n));
  else if(prop==="rotation") selected.rotation=((n%360)+360)%360;
  else if(prop==="frequency") selected.frequency=Math.max(0,Math.min(1,n));
  else if(prop==="lineWidth") selected.lineWidth=Math.max(0,Math.min(1,n));
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(50);
  if(typeof renderRpLayers==="function") renderRpLayers();
  if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();
  /* Live labels in panel */
  const map={
    intensity:"patIntLabel", patternScale:"patScaleLabel", density:"patDensLabel",
    rotation:"patRotLabel", opacity:"patOpLabel", frequency:"patFreqLabel", lineWidth:"patLineLabel"
  };
  const lab=document.getElementById(map[prop]);
  if(lab){
    if(prop==="rotation") lab.textContent=Math.round(selected.rotation)+"°";
    else lab.textContent=Math.round((prop==="opacity"?selected.opacity:selected[prop])*100)+"%";
  }
}

function showBackgroundPanel(tab){
  const left=document.getElementById("left");
  if(!left) return;
  left.classList.add("open","sheet-text");
  if(typeof openSheetDefault==="function") openSheetDefault();
  if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();

  const activeTab=tab==="patterns"?"patterns":"structure";
  const list=(PATTERN_LIBRARY||[]).filter(function(p){
    if(activeTab==="patterns") return p.kind==="pattern";
    return p.kind==="structure"||!p.kind;
  });
  const grid=list.map(function(p){
    return `<button type="button" class="bg-card" data-action="pattern" data-value="${p.id}" title="${p.name}">
      <span class="bg-swatch" style="background:${p.color||"#333"};display:flex;align-items:center;justify-content:center;font-size:22px">${p.emoji||""}</span>
      <span class="frame-card-name">${p.name}</span>
    </button>`;
  }).join("");

  let settingsHtml="";
  if(selected&&selected.type==="pattern"){
    const s=selected;
    const pct=function(v){ return Math.round((typeof v==="number"?v:0.5)*100); };
    settingsHtml=`
      <div class="section" style="margin-top:8px;border-top:1px solid rgba(255,255,255,.08);padding-top:12px">
        <div class="label" style="margin-bottom:8px;color:var(--beige2)">${s.emoji||""} ${s.name||"Structuur"}</div>
        <div class="label">Intensiteit — <span id="patIntLabel">${pct(s.intensity)}%</span></div>
        <input type="range" min="0" max="100" value="${pct(s.intensity)}" oninput="setPatternProp('intensity',this.value/100)" style="width:100%">
        <div class="label" style="margin-top:8px">Schaal — <span id="patScaleLabel">${pct(s.patternScale)}%</span></div>
        <input type="range" min="5" max="100" value="${pct(s.patternScale)}" oninput="setPatternProp('patternScale',this.value/100)" style="width:100%">
        <div class="label" style="margin-top:8px">Dichtheid — <span id="patDensLabel">${pct(s.density)}%</span></div>
        <input type="range" min="5" max="100" value="${pct(s.density)}" oninput="setPatternProp('density',this.value/100)" style="width:100%">
        <div class="label" style="margin-top:8px">Rotatie — <span id="patRotLabel">${Math.round(s.rotation||0)}°</span></div>
        <input type="range" min="0" max="360" value="${Math.round(s.rotation||0)}" oninput="setPatternProp('rotation',this.value)" style="width:100%">
        <div class="label" style="margin-top:8px">Transparantie — <span id="patOpLabel">${pct(typeof s.opacity==="number"?s.opacity:0.65)}%</span></div>
        <input type="range" min="0" max="100" value="${pct(typeof s.opacity==="number"?s.opacity:0.65)}" oninput="setPatternProp('opacity',this.value/100)" style="width:100%">
      </div>`;
  }

  const body=`
    <div class="panel-sub">Voeg een structuur of patroon toe als aparte laag. Opacity per laag in Laag overzicht.</div>
    <div class="section" style="display:flex;gap:8px;margin-bottom:10px">
      <button type="button" class="action${activeTab==="structure"?" primary":""}" style="flex:1" onclick="showBackgroundPanel('structure')">Structuur</button>
      <button type="button" class="action${activeTab==="patterns"?" primary":""}" style="flex:1" onclick="showBackgroundPanel('patterns')">Patronen</button>
    </div>
    <div class="section">
      <div class="frame-grid">${grid}</div>
    </div>
    ${settingsHtml}
  `;
  left.innerHTML=typeof sheetWrap==="function"?sheetWrap("Structuur &amp; patronen", body):body;
  if(typeof bindSheetDrag==="function") bindSheetDrag(left);
  bindPanelActions(left);
}

function getActiveTemplateId(){
  const tpl=objects.find(o=>o.type==="template"&&o.visible!==false);
  return tpl?tpl.templateId:"empty";
}

function filterTemplates(cat){
  const list=TEMPLATE_LIBRARY||[];
  if(!cat||cat==="all") return list.slice();
  if(cat==="popular") return list.filter(t=>t.popular);
  if(cat==="new") return list.filter(t=>t.isNew);
  return list.filter(t=>t.category===cat||(t.tags&&t.tags.indexOf(cat)>=0));
}

function tplCardHtml(t, activeId){
  const active=t.id===activeId?" active":"";
  const fill=t.fill||"#333";
  return '<button type="button" class="tpl-card'+active+'" data-bg="'+t.id+'" onclick="setTileBackground(\''+t.id+'\')">'+
    '<span class="tpl-thumb" style="background:'+fill+'"></span>'+
    '<span>'+t.name+'</span></button>';
}

function renderTemplateStrip(){
  const strip=document.getElementById("templateStrip");
  if(!strip) return;
  const activeId=getActiveTemplateId();
  const popular=(TEMPLATE_LIBRARY||[]).filter(t=>t.popular||t.id==="empty");
  strip.innerHTML=popular.map(t=>tplCardHtml(t, activeId)).join("");
}

function renderTemplateCats(){
  const el=document.getElementById("templateCats");
  if(!el) return;
  el.innerHTML=(TEMPLATE_CATEGORIES||[]).map(function(c){
    const act=c.id===templateCategory?" active":"";
    return '<button type="button" class="tpl-cat'+act+'" data-cat="'+c.id+'" onclick="setTemplateCategory(\''+c.id+'\')">'+c.label+'</button>';
  }).join("");
}

function renderTemplateLibrary(){
  const lib=document.getElementById("templateLibrary");
  if(!lib) return;
  const activeId=getActiveTemplateId();
  const items=filterTemplates(templateCategory);
  lib.innerHTML=items.map(t=>tplCardHtml(t, activeId)).join("");
}

function setTemplateCategory(cat){
  templateCategory=cat||"all";
  renderTemplateCats();
  renderTemplateLibrary();
}

function toggleTemplateLibrary(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  const bar=document.getElementById("templateBar");
  const btn=document.getElementById("templateMoreBtn");
  const cats=document.getElementById("templateCats");
  const lib=document.getElementById("templateLibrary");
  if(!bar) return;
  templateLibraryOpen=!templateLibraryOpen;
  bar.classList.toggle("is-library-open", templateLibraryOpen);
  if(cats){
    if(templateLibraryOpen) cats.removeAttribute("hidden");
    else cats.setAttribute("hidden","");
  }
  if(lib){
    if(templateLibraryOpen){
      lib.removeAttribute("hidden");
      renderTemplateCats();
      renderTemplateLibrary();
    }else{
      lib.setAttribute("hidden","");
    }
  }
  if(btn) btn.textContent=templateLibraryOpen?"Bekijk minder ▴":"Bekijk meer ▾";
  if(typeof syncDesktopMenuDockToTemplateBar==="function") syncDesktopMenuDockToTemplateBar();
}

function setTileBackground(id){
  if(!TILE_BACKGROUNDS[id]) id="empty";
  /*
    Sjabloon als echte laag BOVEN foto/tekst — foto blijft behouden.
    "Leeg" verwijdert alleen de sjabloonlaag.
  */
  const prevTpl=objects.find(o=>o.type==="template");
  const keepOp=prevTpl && typeof prevTpl.opacity==="number"?prevTpl.opacity:1;
  const keepBlend=prevTpl && prevTpl.blendMode?prevTpl.blendMode:"source-over";

  objects=objects.filter(o=>o.type!=="template");

  if(id==="empty"){
    tileBg="empty";
    if(selected && selected.type==="template") selected=null;
  }else{
    /* Neutrale ondergrond behouden; sjabloon is overlay-laag */
    tileBg="empty";
    const tpl={
      type:"template",
      templateId:id,
      name:(TILE_BACKGROUNDS[id]&&TILE_BACKGROUNDS[id].name)||"Sjabloon",
      opacity:keepOp,
      blendMode:keepBlend,
      visible:true,
      locked:false
    };
    objects.push(tpl);
    selected=tpl;
  }

  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(80);
  else if(typeof refresh3D==="function") refresh3D();
  if(typeof layers==="function") layers();
  if(typeof renderRpLayers==="function") renderRpLayers();
  if(typeof refreshLayersPanel==="function") refreshLayersPanel();
  if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();

  const left=document.getElementById("left");
  if(left){
    left.querySelectorAll(".bg-card").forEach(function(btn){
      btn.classList.toggle("active", btn.getAttribute("data-value")===id);
    });
  }
  document.querySelectorAll(".tpl-card[data-bg]").forEach(function(btn){
    btn.classList.toggle("active", btn.getAttribute("data-bg")===id);
  });
  toast(id==="empty"?"Sjabloon verwijderd":((TILE_BACKGROUNDS[id]&&TILE_BACKGROUNDS[id].name)||"Sjabloon"));
  if(typeof renderTemplateStrip==="function") renderTemplateStrip();
  if(templateLibraryOpen && typeof renderTemplateLibrary==="function") renderTemplateLibrary();
}

function getSelectedOpacityPct(){
  if(!selected) return 100;
  const op=typeof selected.opacity==="number"?selected.opacity:1;
  return Math.round(Math.max(0,Math.min(1,op))*100);
}

function getSelectedBlendMode(){
  if(!selected) return "source-over";
  const m=selected.blendMode||"source-over";
  return m==="normal"?"source-over":m;
}

/** Sync opacity-slider + blend-select met de ACTIEF geselecteerde laag (bron = selected.opacity) */
function syncSelectedLayerUI(){
  if(selected && typeof selected.opacity!=="number") selected.opacity=1;
  const pct=getSelectedOpacityPct();
  const blend=getSelectedBlendMode();
  const name=selected?(typeof layerLabel==="function"?layerLabel(selected):(selected.name||selected.type||"Laag")):"—";

  document.querySelectorAll("#layerOpLabel, .layer-op-label").forEach(function(lab){
    lab.textContent=pct+"%";
  });
  document.querySelectorAll("#layerOpName, .layer-op-name").forEach(function(el){
    el.textContent=name;
  });
  document.querySelectorAll("#layerOpSlider, .layer-op-slider, input[data-layer-opacity]").forEach(function(sl){
    /* Forceer UI-waarde vanuit layer state — niet de vorige sliderwaarde */
    sl.value=String(pct);
    try{ sl.setAttribute("value", String(pct)); }catch(_){}
  });
  document.querySelectorAll("#layerBlendSelect, .layer-blend-select, select[data-layer-blend]").forEach(function(sel){
    const v=blend;
    if([...sel.options].some(function(o){ return o.value===v; })) sel.value=v;
    else sel.value="source-over";
  });
  /* Extra: title van het transparantie-label */
  document.querySelectorAll(".layer-op-title").forEach(function(el){
    el.textContent=selected?"Transparantie — "+name: "Laag transparantie";
  });
}

function setSelectedOpacity(v){
  if(!selected) return;
  const n=Math.max(0,Math.min(1, parseFloat(v)));
  selected.opacity=n;
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(60);
  /* Eerst UI van selected, daarna layer-lijst percentages */
  syncSelectedLayerUI();
  if(typeof renderRpLayers==="function") renderRpLayers();
  if(typeof layers==="function"){
    /* layers() roept renderRpLayers opnieuw aan — sync daarna opnieuw */
    layers();
    syncSelectedLayerUI();
  }
}

function setSelectedBlend(mode){
  if(!selected) return;
  const map={
    normal:"source-over",
    "source-over":"source-over",
    multiply:"multiply",
    screen:"screen",
    overlay:"overlay",
    "soft-light":"soft-light"
  };
  selected.blendMode=map[mode]||mode||"source-over";
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(60);
  syncSelectedLayerUI();
}


/* =========================================================
   LAYERS
========================================================= */

function layers(){

  const el=document.getElementById("layers");
  if(el){
    el.innerHTML="";

    [...objects]
      .reverse()
      .forEach(
        o=>{

          const index=objects.indexOf(o);

          const div=document.createElement("div");

          div.className=
            "layer "+
            (o===selected?"selected":"");

          div.innerHTML=`

            <div class="layer-main">

              <button
                class="layer-btn"
                onclick="toggleVisibility(${index})">

                ${
                  o.visible===false
                    ?"◌"
                    :"◉"
                }

              </button>

              <button
                class="layer-btn"
                onclick="select(${index})">

                ${
                  o.type==="image"
                    ?"📷"
                    :
                  o.type==="template"
                    ?"✨"
                    :
                  o.type==="text"
                    ?"T"
                    :
                  o.type==="clipart"
                    ?(o.emoji||"✦")
                    :
                    "▣"
                }

              </button>

              <span
                class="layer-name"
                onclick="select(${index})">

                ${esc(o.name)}

              </span>

            </div>

            <div class="layer-actions">

              <button
                onclick="select(${index});moveLayer(-1)">
                ↑
              </button>

              <button
                onclick="select(${index});moveLayer(1)">
                ↓
              </button>

              <button
                onclick="select(${index});duplicate()">
                ⧉
              </button>

              <button
                onclick="toggleLock(${index})">

                ${o.locked?"🔒":"🔓"}

              </button>

              <button
                onclick="select(${index});removeSelected()">
                🗑
              </button>

            </div>
          `;

          el.appendChild(div);

        }
      );
  }

  /* Desktop referentie LAAG OVERZICHT */
  renderRpLayers();

  if(typeof refreshLayersPanel==="function"){
    const panel=document.getElementById("layersPanel");
    if(panel && !panel.hidden) refreshLayersPanel();
  }

}

let _rpOpOpenIndex=null;

function removeLayerAt(index){
  if(index<0||index>=objects.length) return;
  const o=objects[index];
  if(!o) return;
  if(selected===o) selected=null;
  if(_rpOpOpenIndex===index) _rpOpOpenIndex=null;
  else if(typeof _rpOpOpenIndex==="number" && _rpOpOpenIndex>index) _rpOpOpenIndex--;
  objects.splice(index,1);
  saveHistory();
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(60);
  else if(typeof refresh3D==="function") refresh3D();
  layers();
  if(typeof renderRpLayers==="function") renderRpLayers();
  if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();
  if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
  toast("Laag verwijderd");
}

function setLayerOpacityAt(index, value){
  const o=objects[index];
  if(!o) return;
  const n=Math.max(0,Math.min(1, parseFloat(value)));
  if(!isFinite(n)) return;
  o.opacity=n;
  if(selected===o){
    if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();
  }
  const wrap=document.querySelector('.rp-layer-wrap[data-layer-index="'+index+'"]');
  if(wrap){
    const pct=Math.round(n*100);
    const opEl=wrap.querySelector(".rp-layer-opacity");
    if(opEl) opEl.textContent=pct+"%";
    const lab=wrap.querySelector(".rp-op-pct");
    if(lab) lab.textContent=pct+"%";
  }
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(40);
}

function toggleRpLayerOpacity(index, e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  if(_rpOpOpenIndex===index) _rpOpOpenIndex=null;
  else _rpOpOpenIndex=index;
  if(typeof select==="function") select(index);
  /* select toggles off if already selected — force selected */
  if(objects[index]) selected=objects[index];
  if(typeof renderRpLayers==="function") renderRpLayers();
  if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();
}

function renderRpLayers(){
  const host=document.getElementById("rpLayers");
  if(!host) return;
  host.innerHTML="";

  /* Object-lagen (top = eerste in reverse = visueel boven) */
  [...objects].reverse().forEach(function(o){
    const index=objects.indexOf(o);
    const wrap=document.createElement("div");
    wrap.className="rp-layer-wrap"+(_rpOpOpenIndex===index?" op-open":"");
    wrap.dataset.layerIndex=String(index);

    const row=document.createElement("div");
    row.className="rp-layer"+(o===selected?" active":"");
    row.dataset.layerIndex=String(index);
    row.onclick=function(e){
      if(e.target.closest(".rp-layer-eye")||e.target.closest(".rp-layer-drag")||e.target.closest(".rp-layer-del")||e.target.closest(".rp-layer-opacity")||e.target.closest(".rp-layer-op-panel")) return;
      _rpOpOpenIndex=null;
      select(index);
    };

    let ico="▣";
    let thumbHtml="";
    let displayName=o.name||o.type||"Laag";
    if(o.type==="image"){
      ico="📷";
      displayName=o.name&&o.name!=="Foto"?o.name:"Afbeelding";
      try{
        const src=o.img&&(o.img.currentSrc||o.img.src);
        if(src) thumbHtml=`<img src="${src}" alt="" loading="lazy">`;
      }catch(_){}
    }else if(o.type==="template"){
      ico="✨";
      displayName=o.name||"Sjabloon";
    }else if(o.type==="pattern"){
      ico=o.emoji||"▣";
      displayName=o.name||"Patroon";
    }else if(o.type==="text"){
      ico="T";
      displayName="Tekst";
      if(o.text) displayName="Tekst";
    }else if(o.type==="clipart"){
      ico=o.emoji||"✦";
      displayName=o.name||"Clipart";
    }else if(o.type==="frame"){
      ico="▣";
      displayName=o.name||"Kader";
    }

    const eye=o.visible===false?"◌":"👁";
    const opPct=typeof o.opacity==="number"?Math.round((o.opacity<=1?o.opacity*100:o.opacity)):100;

    row.innerHTML=`
      <button type="button" class="rp-layer-eye" onclick="event.stopPropagation();toggleVisibility(${index})" title="Zichtbaarheid" aria-label="Zichtbaarheid">${eye}</button>
      <div class="rp-layer-thumb">${thumbHtml||ico}</div>
      <div class="rp-layer-info">
        <div class="rp-layer-name">${esc(displayName)}</div>
        <div class="rp-layer-opacity" onclick="toggleRpLayerOpacity(${index},event)" title="Transparantie">${opPct}%</div>
      </div>
      <div class="rp-layer-actions">
        <span class="rp-layer-drag" data-drag-index="${index}" title="Sleep om volgorde te wijzigen" role="button" aria-label="Laag verslepen">⠿</span>
        <button type="button" class="rp-layer-del" onclick="event.stopPropagation();removeLayerAt(${index})" title="Laag verwijderen" aria-label="Verwijderen">🗑</button>
      </div>
    `;

    const panel=document.createElement("div");
    panel.className="rp-layer-op-panel";
    panel.innerHTML=`
      <div class="rp-op-label"><span>Transparantie</span><span class="rp-op-pct">${opPct}%</span></div>
      <input type="range" min="0" max="100" value="${opPct}"
        oninput="setLayerOpacityAt(${index}, this.value/100)"
        onclick="event.stopPropagation()" ontouchstart="event.stopPropagation()">
    `;

    wrap.appendChild(row);
    wrap.appendChild(panel);
    host.appendChild(wrap);

    const handle=row.querySelector(".rp-layer-drag");
    if(handle) bindRpLayerDrag(handle, row, index);
  });

  /* Achtergrond onderaan — niet verwijderbaar */
  const bgRow=document.createElement("div");
  bgRow.className="rp-layer";
  bgRow.innerHTML=`
    <button type="button" class="rp-layer-eye" title="Achtergrond" aria-label="Achtergrond">👁</button>
    <div class="rp-layer-thumb" style="background:linear-gradient(135deg,#2a2a30,#1a1a1e)"></div>
    <div class="rp-layer-info">
      <div class="rp-layer-name">Achtergrond</div>
      <div class="rp-layer-opacity" style="cursor:default">100%</div>
    </div>
    <div class="rp-layer-actions">
      <span class="rp-layer-drag" title="Volgorde" style="opacity:.25;cursor:default">⠿</span>
    </div>
  `;
  host.appendChild(bgRow);
}

function syncMobileLayerActionVisibility(){
  try{
    const on=!!selected && (selected.type==="image"||selected.type==="text"||selected.type==="clipart"||selected.type==="pattern"||selected.type==="template");
    document.body.classList.toggle("has-selected-layer", on);
  }catch(_){}
}

function select(index){

  const o=objects[index];
  if(!o) return;

  /* Opnieuw klikken op actieve laag → deselecteren */
  if(selected===o){
    selected=null;
  }else{
    selected=o;
    if(typeof selected.opacity!=="number") selected.opacity=1;
    if(!selected.blendMode) selected.blendMode="source-over";
  }

  layers();
  if(typeof renderRpLayers==="function") renderRpLayers();
  if(typeof refreshLayersPanel==="function") refreshLayersPanel();
  /* Direct + na frame: slider volgt ALTIJD selected.opacity */
  if(typeof syncSelectedLayerUI==="function"){
    syncSelectedLayerUI();
    requestAnimationFrame(function(){ syncSelectedLayerUI(); });
  }
  draw();
  if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
  if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
  if(typeof syncMobileLayerActionVisibility==="function") syncMobileLayerActionVisibility();
  if(typeof updateText3dBar==="function") updateText3dBar();
  /* Patroon geselecteerd → toon instellingen in Achtergrond-paneel */
  if(selected&&selected.type==="pattern"&&typeof showBackgroundPanel==="function"){
    try{ showBackgroundPanel("patterns"); }catch(_){}
  }
}

function layerLabel(o){
  if(!o) return "Laag";
  if(o.type==="image") return o.name||"Foto";
  if(o.type==="template") return o.name||"Sjabloon";
  if(o.type==="pattern") return o.name||"Patroon";
  if(o.type==="text") return "Tekst \""+((o.text||"").slice(0,28))+"\"";
  if(o.type==="frame") return o.name||("Kader — "+(o.style||""));
  return o.name||"Laag";
}

function layerIcon(o){
  if(o&&o.type==="template") return "✨";
  if(o&&o.type==="pattern") return o.emoji||"▣";
  if(!o) return "•";
  if(o.type==="image") return "📷";
  if(o.type==="text") return "T";
  if(o.type==="clipart") return o.emoji||"✦";
  if(o.type==="frame") return "▣";
  return "•";
}

function toggleLayersPanel(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  const panel=document.getElementById("layersPanel");
  if(!panel) return;
  if(panel.hidden){
    panel.hidden=false;
    refreshLayersPanel();
    const btn=document.getElementById("btnLayersPanel");
    if(btn) btn.classList.add("active");
  }else{
    closeLayersPanel();
  }
}

function closeLayersPanel(){
  const panel=document.getElementById("layersPanel");
  if(panel) panel.hidden=true;
  const btn=document.getElementById("btnLayersPanel");
  if(btn) btn.classList.remove("active");
}

function refreshLayersPanel(){
  const list=document.getElementById("layersPanelList");
  if(!list) return;
  list.innerHTML="";
  if(!objects.length){
    list.innerHTML='<div class="lp-empty">Nog geen lagen.<br>Voeg een foto, tekst of kader toe.</div>';
    return;
  }
  /* Bovenste laag eerst (zichtvolgorde) */
  [...objects].reverse().forEach(function(o){
    const index=objects.indexOf(o);
    const row=document.createElement("div");
    row.className="lp-row"+(o===selected?" active":"");
    const canDel=o.type!=="background";
    row.innerHTML=`
      <button type="button" class="lp-vis" title="Zichtbaarheid" onclick="event.stopPropagation();toggleVisibility(${index});refreshLayersPanel()">${o.visible===false?"◌":"👁"}</button>
      <span class="lp-ico">${layerIcon(o)}</span>
      <span class="lp-name">${esc(layerLabel(o))}</span>
      ${canDel?`<button type="button" class="lp-del" title="Verwijderen" onclick="event.stopPropagation();removeLayerAt(${index});refreshLayersPanel()">🗑</button>`:""}
      <button type="button" class="lp-up" title="Naar voren" onclick="event.stopPropagation();select(${index});moveLayer(1)">↑</button>
      <button type="button" class="lp-dn" title="Naar achteren" onclick="event.stopPropagation();select(${index});moveLayer(-1)">↓</button>
    `;
    row.addEventListener("click", function(ev){
      if(ev.target.closest("button")) return;
      select(index);
      refreshLayersPanel();
    });
    list.appendChild(row);
  });
}

/* Klik buiten panel → sluiten */
document.addEventListener("pointerdown", function(e){
  const panel=document.getElementById("layersPanel");
  if(!panel || panel.hidden) return;
  if(panel.contains(e.target)) return;
  if(e.target.closest && e.target.closest("#btnLayersPanel")) return;
  closeLayersPanel();
}, true);

function toggleVisibility(index){

  objects[index].visible=
    objects[index].visible===false;

  saveHistory();

  layers();

  draw();

  /*
    Alleen één rebuild nadat de wijziging klaar is.
  */

  refresh3D();

}

function toggleLock(index){

  objects[index].locked=
    !objects[index].locked;

  saveHistory();

  layers();

}

function moveLayer(direction){

  if(!selected)
    return;

  const i=
    objects.indexOf(selected);

  const target=
    i+direction;

  if(
    target<0 ||
    target>=objects.length
  )
    return;

  [
    objects[i],
    objects[target]
  ]=[
    objects[target],
    objects[i]
  ];

  saveHistory();

  layers();

  draw();

  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  else if(typeof refresh3D==="function") refresh3D();

}

/** Verplaats laag van fromIndex naar toIndex in objects[] (render-volgorde) */
function reorderLayer(fromIndex, toIndex){
  if(fromIndex===toIndex) return;
  if(fromIndex<0||toIndex<0||fromIndex>=objects.length||toIndex>=objects.length) return;
  const item=objects.splice(fromIndex,1)[0];
  objects.splice(toIndex,0,item);
  if(typeof saveHistory==="function") saveHistory();
  if(typeof layers==="function") layers();
  if(typeof renderRpLayers==="function") renderRpLayers();
  if(typeof syncSelectedLayerUI==="function") syncSelectedLayerUI();
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  else if(typeof refresh3D==="function") refresh3D();
}

let _rpDrag=null;

function bindRpLayerDrag(handle, row, layerIndex){
  if(!handle || handle.dataset.dragBound==="1") return;
  handle.dataset.dragBound="1";

  const onDown=function(e){
    if(e.button!==undefined && e.button!==0) return;
    e.preventDefault();
    e.stopPropagation();
    const host=document.getElementById("rpLayers");
    if(!host) return;
    _rpDrag={
      fromIndex:layerIndex,
      startY:e.clientY,
      row:row,
      host:host,
      moved:false
    };
    row.classList.add("rp-layer-dragging");
    handle.style.cursor="grabbing";
    try{ handle.setPointerCapture(e.pointerId); }catch(_){}
  };

  const onMove=function(e){
    if(!_rpDrag || _rpDrag.row!==row) return;
    e.preventDefault();
    const dy=e.clientY-_rpDrag.startY;
    if(Math.abs(dy)>4) _rpDrag.moved=true;
    if(!_rpDrag.moved) return;

    const host=_rpDrag.host;
    const rows=[...host.querySelectorAll(".rp-layer[data-layer-index]")];
    let targetRow=null;
    for(let i=0;i<rows.length;i++){
      const r=rows[i].getBoundingClientRect();
      if(e.clientY>=r.top && e.clientY<=r.bottom){
        targetRow=rows[i];
        break;
      }
    }
    rows.forEach(function(r){ r.classList.remove("rp-layer-drop-target"); });
    if(targetRow && targetRow!==row){
      targetRow.classList.add("rp-layer-drop-target");
      _rpDrag.toIndex=parseInt(targetRow.dataset.layerIndex,10);
    }else{
      _rpDrag.toIndex=undefined;
    }
  };

  const onUp=function(e){
    if(!_rpDrag || _rpDrag.row!==row) return;
    const from=_rpDrag.fromIndex;
    const to=typeof _rpDrag.toIndex==="number"?_rpDrag.toIndex:from;
    const host=_rpDrag.host;
    row.classList.remove("rp-layer-dragging");
    handle.style.cursor="grab";
    if(host) host.querySelectorAll(".rp-layer-drop-target").forEach(function(r){ r.classList.remove("rp-layer-drop-target"); });
    _rpDrag=null;
    try{ handle.releasePointerCapture(e.pointerId); }catch(_){}
    if(from!==to){
      reorderLayer(from, to);
    }
  };

  handle.addEventListener("pointerdown", onDown, {passive:false});
  handle.addEventListener("pointermove", onMove, {passive:false});
  handle.addEventListener("pointerup", onUp, {passive:false});
  handle.addEventListener("pointercancel", onUp, {passive:false});
}

function duplicate(){

  if(!selected)
    return;

  const copy={
    ...selected
  };

  if(
    selected.type==="image"
  )
    copy.img=
      selected.img;

  copy.x=
    (copy.x||600)+25;

  copy.y=
    (copy.y||600)+25;

  copy.name=
    copy.name+" kopie";

  objects.push(copy);

  selected=copy;

  saveHistory();

  layers();

  draw();

  refresh3D();

}

function removeSelected(){

  if(!selected)
    return;

  objects=
    objects.filter(
      o=>o!==selected
    );

  selected=null;

  saveHistory();

  layers();

  draw();

  refresh3D();
  if(typeof updateToolbarPhotoState==="function") updateToolbarPhotoState();
  if(typeof syncMobileLayerActionVisibility==="function") syncMobileLayerActionVisibility();

}

/** Verwijder alleen de geselecteerde tekst (niet foto/kader). */
function removeSelectedText(){
  if(!selected || selected.type!=="text"){
    /* probeer alsnog een tekst te selecteren */
    if(typeof ensureTextSelected==="function") ensureTextSelected();
  }
  if(!selected || selected.type!=="text"){
    toast("Selecteer eerst een tekst");
    return;
  }
  removeSelected();
  if(typeof updateText3dBar==="function") updateText3dBar();
  if(typeof showText==="function") showText();
  toast("Tekst verwijderd");
}


/* =========================================================
   TRANSFORM
========================================================= */

function setPhotoFilter(value){

  let imgObj=null;
  if(selected && selected.type==="image"){
    imgObj=selected;
  }else{
    imgObj=objects.find(
      o=>o.type==="image" && o.visible!==false
    );
  }
  if(!imgObj || !imgObj.img){
    toast("Upload eerst een foto");
    return;
  }

  const next=value||"none";
  selected=imgObj;
  selected.filter=next;
  selected._filterKey=null;
  selected._filterCanvas=null;

  /* Pre-bake zodat 2D meteen de juiste pixels toont */
  getFilteredImageSource(selected);

  saveHistory();
  draw();
  layers();
  markFilterButtonsActive(next);

  /* 3D texture altijd vernieuwen bij filterwijziging */
  if(typeof refresh3D==="function") refresh3D();

  toast(PHOTO_FILTER_LABELS[next]||"Filter toegepast");

}

function markFilterButtonsActive(activeKey){
  const grid=document.getElementById("filterGrid");
  if(!grid) return;
  grid.querySelectorAll("[data-filter]").forEach(btn=>{
    const on=btn.getAttribute("data-filter")===activeKey;
    btn.classList.toggle("filter-active", on);
  });
}


/* =========================================================
   MOBIEL: formaat/rotatie sliders + foto-opties
========================================================= */

let designSliderMode=null;
const SCALE_MIN=0.04;
const SCALE_MAX=2.5;

function ensureImageSelected(){
  if(selected && selected.type==="image") return true;
  const img=objects.find(o=>o.type==="image" && o.visible!==false);
  if(img){
    selected=img;
    layers();
    draw();
    return true;
  }
  toast("Selecteer of upload eerst een foto");
  return false;
}

function scaleToSlider(scale){
  const s=Math.max(SCALE_MIN, Math.min(SCALE_MAX, scale||SCALE_MIN));
  return Math.round(((s-SCALE_MIN)/(SCALE_MAX-SCALE_MIN))*100);
}

function sliderToScale(v){
  const n=Math.max(0, Math.min(100, Number(v)||0))/100;
  return SCALE_MIN + n*(SCALE_MAX-SCALE_MIN);
}

function ensureTransformableSelected(){
  if(selected && (selected.type==="image"||selected.type==="text"||selected.type==="clipart")) return true;
  /* Probeer laatste transformeerbare laag */
  for(let i=objects.length-1;i>=0;i--){
    const o=objects[i];
    if(o.visible===false) continue;
    if(o.type==="image"||o.type==="text"||o.type==="clipart"){
      selected=o;
      layers();
      draw();
      return true;
    }
  }
  toast("Selecteer eerst een foto, tekst of clipart");
  return false;
}

function openScaleSlider(){
  if(!ensureImageSelected()) return;
  designSliderMode="scale";
  const bar=document.getElementById("designSliderBar");
  const title=document.getElementById("designSliderTitle");
  const val=document.getElementById("designSliderValue");
  const sl=document.getElementById("designSlider");
  if(title) title.textContent="Formaat wijzigen";
  if(sl){
    sl.min="0";
    sl.max="100";
    sl.step="1";
    sl.value=String(scaleToSlider(selected.scale));
  }
  if(val) val.textContent="";
  if(bar) bar.classList.add("show");
}

function normalizeRotationDeg(r){
  let x=((Number(r)||0)%360+360)%360;
  if(x>180) x-=360;
  return x;
}

function openRotateSlider(){
  if(!ensureTransformableSelected()) return;
  designSliderMode="rotate";
  const bar=document.getElementById("designSliderBar");
  const title=document.getElementById("designSliderTitle");
  const val=document.getElementById("designSliderValue");
  const sl=document.getElementById("designSlider");
  const rot=normalizeRotationDeg(selected.rotation);
  if(title) title.textContent="Roteren";
  if(sl){
    sl.min="-180";
    sl.max="180";
    sl.step="1";
    sl.value=String(Math.round(rot));
  }
  if(val) val.textContent=Math.round(rot)+"°";
  if(bar) bar.classList.add("show");
  const btn=document.getElementById("btnWsRotate");
  if(btn) btn.classList.add("active");
}

function toggleRotateSlider(){
  const bar=document.getElementById("designSliderBar");
  if(designSliderMode==="rotate" && bar && bar.classList.contains("show")){
    closeDesignSlider();
    return;
  }
  openRotateSlider();
}

function closeDesignSlider(){
  designSliderMode=null;
  const bar=document.getElementById("designSliderBar");
  if(bar) bar.classList.remove("show");
  const btn=document.getElementById("btnWsRotate");
  if(btn) btn.classList.remove("active");
  const val=document.getElementById("designSliderValue");
  if(val) val.textContent="";
  saveHistory();
}

let _sliderLiveRaf=0;
let _sliderDirty=false;

function onDesignSliderInput(value){
  /* Realtime: alleen state + lichte live texture. Geen full rebuild3D per tick. */
  if(designSliderMode==="scale"){
    if(!ensureImageSelected()) return;
    selected.scale=sliderToScale(value);
  }else if(designSliderMode==="rotate"){
    if(!ensureTransformableSelected()) return;
    const deg=Math.max(-180, Math.min(180, Number(value)||0));
    selected.rotation=deg;
    const val=document.getElementById("designSliderValue");
    if(val) val.textContent=Math.round(deg)+"°";
  }else{
    return;
  }
  _sliderDirty=true;
  if(!_sliderLiveRaf){
    _sliderLiveRaf=requestAnimationFrame(function(){
      _sliderLiveRaf=0;
      if(!_sliderDirty) return;
      _sliderDirty=false;
      draw();
      if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
      if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
    });
  }
}

function onDesignSliderCommit(){
  /* Eén keer history + eventuele full sync na loslaten */
  if(_sliderLiveRaf){
    cancelAnimationFrame(_sliderLiveRaf);
    _sliderLiveRaf=0;
  }
  if(_sliderDirty){
    _sliderDirty=false;
    draw();
    if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  }
  saveHistory();
  if(typeof refresh3D==="function") refresh3D();
  if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
}

/* Bind commit-events één keer */
(function bindDesignSliderCommit(){
  function bind(){
    const sl=document.getElementById("designSlider");
    if(!sl || sl.dataset.commitBound) return;
    sl.dataset.commitBound="1";
    sl.addEventListener("pointerup", onDesignSliderCommit);
    sl.addEventListener("change", onDesignSliderCommit);
    sl.addEventListener("touchend", onDesignSliderCommit, {passive:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();

function openMobilePhotoUpload(){
  /* Direct file picker — geen fotomenu */
  let input=document.getElementById("mobilePhotoPicker");
  if(!input){
    input=document.createElement("input");
    input.type="file";
    input.accept="image/*";
    input.id="mobilePhotoPicker";
    input.style.display="none";
    document.body.appendChild(input);
    input.addEventListener("change", function(e){
      const f=e.target.files && e.target.files[0];
      if(f && typeof addPhoto==="function"){
        addPhoto(f);
        toast("Foto geüpload");
      }
      input.value="";
    });
  }
  input.click();
}


function openColorFiltersPanel(){
  if(!ensureImageSelected()) return;
  const left=document.getElementById("left");
  if(!left) return;
  const right=document.querySelector(".right");
  if(right) right.classList.remove("open","mobile-sheet");
  document.querySelectorAll(".tool").forEach(b=>b.classList.remove("active"));
  left.classList.add("open");
  if(typeof openSheetDefault==="function") openSheetDefault();
  if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();
  if(isMobile() && typeof applySheetHeight==="function"){
    const lim=sheetLimits();
    applySheetHeight(Math.round(lim.mid*1.05), true);
  }

  const img=selected;
  const cur=(img&&img.filter)||"none";
  const a=photoAdj(img||{});
  const body = `
    <div class="panel-sub">Presets en fine-tuning — alleen op de geselecteerde foto.</div>
    <div class="section">
      <div class="label">Presets</div>
      <div class="option-grid" id="filterGrid">
        <button type="button" class="option" data-filter="none">Origineel</button>
        <button type="button" class="option" data-filter="grayscale">Zwart-wit</button>
        <button type="button" class="option" data-filter="sepia">Sepia</button>
        <button type="button" class="option" data-filter="saturate">Meer kleur</button>
        <button type="button" class="option" data-filter="soft">Zacht</button>
        <button type="button" class="option" data-filter="warm">Warm</button>
        <button type="button" class="option" data-filter="cool">Koel</button>
      </div>
    </div>
    <div class="section filter-sliders">
      <div class="label">Helderheid <span id="adjBrightnessVal">${a.brightness}</span></div>
      <input type="range" id="adjBrightness" min="-100" max="100" value="${a.brightness}" oninput="onPhotoAdjInput('brightness',this.value)">
      <div class="label">Contrast <span id="adjContrastVal">${a.contrast}</span></div>
      <input type="range" id="adjContrast" min="-100" max="100" value="${a.contrast}" oninput="onPhotoAdjInput('contrast',this.value)">
      <div class="label">Verzadiging <span id="adjSaturationVal">${a.saturation}</span></div>
      <input type="range" id="adjSaturation" min="-100" max="100" value="${a.saturation}" oninput="onPhotoAdjInput('saturation',this.value)">
      <div class="label">Warmte <span id="adjWarmthVal">${a.warmth}</span></div>
      <input type="range" id="adjWarmth" min="-100" max="100" value="${a.warmth}" oninput="onPhotoAdjInput('warmth',this.value)">
      <div class="label">Scherpte <span id="adjSharpnessVal">${a.sharpness}</span></div>
      <input type="range" id="adjSharpness" min="0" max="100" value="${a.sharpness}" oninput="onPhotoAdjInput('sharpness',this.value)">
      <div class="label">Schaduwen <span id="adjShadowsVal">${a.shadows}</span></div>
      <input type="range" id="adjShadows" min="-100" max="100" value="${a.shadows}" oninput="onPhotoAdjInput('shadows',this.value)">
      <div class="label">Hooglichten <span id="adjHighlightsVal">${a.highlights}</span></div>
      <input type="range" id="adjHighlights" min="-100" max="100" value="${a.highlights}" oninput="onPhotoAdjInput('highlights',this.value)">
      <div class="label">Vervagen <span id="adjBlurVal">${a.blur}</span></div>
      <input type="range" id="adjBlur" min="0" max="20" value="${a.blur}" oninput="onPhotoAdjInput('blur',this.value)">
      <button type="button" class="action" style="margin-top:10px" onclick="resetPhotoAdjustments()">↺ Correcties resetten</button>
    </div>
  `;

  left.innerHTML = typeof sheetWrap==="function" ? sheetWrap("Kleurfilters", body) : body;
  if(typeof bindSheetDrag==="function") bindSheetDrag(left);

  const grid=document.getElementById("filterGrid");
  if(grid){
    grid.querySelectorAll("[data-filter]").forEach(btn=>{
      btn.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        setPhotoFilter(this.getAttribute("data-filter"));
      });
    });
    markFilterButtonsActive(cur);
  }
}

let _photoAdjRaf=0;
function onPhotoAdjInput(prop, value){
  if(!ensureImageSelected()) return;
  const n=Number(value)||0;
  selected[prop]=n;
  const lab=document.getElementById("adj"+prop.charAt(0).toUpperCase()+prop.slice(1)+"Val");
  if(lab) lab.textContent=String(n);
  selected._filterKey=null;
  selected._filterCanvas=null;
  if(!_photoAdjRaf){
    _photoAdjRaf=requestAnimationFrame(function(){
      _photoAdjRaf=0;
      getFilteredImageSource(selected);
      draw();
      if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
    });
  }
}

function resetPhotoAdjustments(){
  if(!ensureImageSelected()) return;
  selected.brightness=0;
  selected.contrast=0;
  selected.saturation=0;
  selected.warmth=0;
  selected.sharpness=0;
  selected.shadows=0;
  selected.highlights=0;
  selected.blur=0;
  selected._filterKey=null;
  selected._filterCanvas=null;
  saveHistory();
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(120);
  openColorFiltersPanel();
  toast("Correcties gereset");
}

function syncEdgeUI(){
  const opts=typeof getAvailableOptions==="function"
    ? getAvailableOptions(product, size)
    : { edge: product==="tile" };
  const el=document.getElementById("edge");
  if(el) el.classList.toggle("on", !!edge);
  const btn=document.getElementById("edgeToggleBtn");
  if(btn){
    btn.classList.toggle("on", !!edge);
    btn.setAttribute("aria-pressed", edge?"true":"false");
  }
  const lab=document.getElementById("edgeStateLabel");
  if(lab) lab.textContent=edge?"AAN":"UIT";
  const ep=document.getElementById("edgePrice");
  if(ep) ep.style.display=(opts.edge && edge)?"":"none";
  const edgeFloat=document.getElementById("edgePrintFloat");
  if(edgeFloat) edgeFloat.style.display=opts.edge?"":"none";
}

function toggleEdgeFromSide(){
  if(typeof toggleEdge==="function"){
    toggleEdge();
  } else {
    edge=!edge;
    updatePrice();
    refresh3D();
  }
  syncEdgeUI();
  toast(edge?"Randen meebedrukken: AAN":"Randen meebedrukken: UIT");
}

function toggleEdgeSafe(){
  toggleEdgeFromSide();
}




function updateWorkspaceControlsState(){
  const bar=document.getElementById("workspaceControls");
  if(!bar) return;
  const active=!!(selected && (selected.type==="image"||selected.type==="text"||selected.type==="clipart"));
  bar.classList.toggle("has-selection", active);
  /*
    −/+ blijven altijd actief:
    - geen selectie → 3D view-zoom
    - wel selectie → laag schalen
    ↻ en ⦿ alleen actief bij selectie.
    ⛶ en ⌫ altijd actief.
  */
  bar.querySelectorAll("button").forEach(function(btn){
    const oc=btn.getAttribute("onclick")||"";
    const isZoom=oc.indexOf("zoomSelected")>=0;
    const isCycle=oc.indexOf("selectNextLayer")>=0;
    const isUndo=oc.indexOf("undo")>=0;
    const isLayers=oc.indexOf("toggleLayersPanel")>=0 || btn.id==="btnLayersPanel";
    if(isZoom||isCycle||isUndo||isLayers){
      btn.disabled=false;
      return;
    }
    /* ↻ en ⦿ */
    btn.disabled=!active;
  });
}

function zoom(amount){
  /* Compat: oude callers → zoomSelected */
  zoomSelected(amount);
}

function zoomViewOnly(amount){
  /* Alleen camera-afstand — compositie (foto/tekst/kader) blijft ongewijzigd */
  distance=Math.max(3.5, Math.min(14, distance*(amount>0?1/(1+amount):1+(-amount))));
  if(camera) camera.position.z=distance;
  if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
}

function zoomSelected(amount){
  /*
    🔒 Vergrendeld → altijd view-zoom (hele compositie blijft één geheel).
    Geen selectie → 3D view-zoom (camera distance).
    Wel selectie → schaal van de geselecteerde laag.
  */
  if(typeof tileRotationLocked!=="undefined" && tileRotationLocked){
    zoomViewOnly(amount);
    return;
  }

  if(!selected || (selected.type!=="image" && selected.type!=="text" && selected.type!=="clipart")){
    zoomViewOnly(amount);
    return;
  }

  if(selected.type==="image"){
    const base=typeof selected.scale==="number"?selected.scale:1;
    selected.scale=Math.max(0.03, Math.min(8, base*(1+amount)));
    if(typeof clearFitActive==="function") clearFitActive();
  }else if(selected.type==="text"){
    const base=typeof selected.size==="number"?selected.size:40;
    selected.size=Math.max(12, Math.min(180, Math.round(base*(1+amount))));
    const sizeEl=document.getElementById("sizeDisplay");
    if(sizeEl) sizeEl.textContent=selected.size+" px";
    const ts=document.getElementById("textSize");
    if(ts) ts.value=String(selected.size);
  }else if(selected.type==="clipart"){
    const base=typeof selected.size==="number"?selected.size:72;
    selected.size=Math.max(24, Math.min(240, Math.round(base*(1+amount))));
  }

  /* Live 2D + lichte 3D texture; history niet bij elke tik */
  draw();
  if(typeof liveUpdateFrontTexture==="function") liveUpdateFrontTexture();
  if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
  if(typeof scheduleRefresh3D==="function") scheduleRefresh3D(150);
}

function rotate(amount){

  if(!selected)
    return;

  selected.rotation=
    (selected.rotation||0)+amount;

  saveHistory();

  draw();

  refresh3D();

}

function center(){

  if(!selected){
    toast("Selecteer eerst een laag");
    return;
  }

  /* Frames hebben geen vrije positie */
  if(selected.type==="frame"){
    toast("Kader is al vast op de rand");
    return;
  }

  const b=bounds();

  selected.x=
    b.x+b.w/2;

  selected.y=
    b.y+b.h/2;

  saveHistory();

  draw();
  if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
  refresh3D();
  if(typeof updatePhotoPanelValues==="function") updatePhotoPanelValues();
  toast("Gecentreerd");

}

let fitActive=false;

function applyFitToSelected(){
  if(!selected || selected.type!=="image" || !selected.img) return false;
  const b=bounds();
  selected.scale=Math.max(b.w/selected.img.width, b.h/selected.img.height);
  selected.x=b.x+b.w/2;
  selected.y=b.y+b.h/2;
  selected.rotation=0;
  return true;
}

function updateFitButton(){
  const btn=document.getElementById("sideFitBtn");
  if(btn) btn.classList.toggle("active", !!fitActive);
}

/** Passend: selecteren / deselecteren (toggle) */
function toggleFit(){
  if(!selected || selected.type!=="image"){
    toast("Selecteer eerst een foto");
    return;
  }
  fitActive=!fitActive;
  if(fitActive){
    applyFitToSelected();
    saveHistory();
    draw();
    refresh3D();
    toast("Passend aan");
  }else{
    toast("Passend uit");
  }
  updateFitButton();
}

function fit(){
  /* Compat: oude callers → eenmalig passend + actief */
  if(!selected || selected.type!=="image") return;
  fitActive=true;
  applyFitToSelected();
  saveHistory();
  draw();
  refresh3D();
  updateFitButton();
}

/** Bij handmatig verplaatsen/schalen: Passend uitzetten */
function clearFitActive(){
  if(!fitActive) return;
  fitActive=false;
  updateFitButton();
}

/**
 * ⛶ toggle:
 * - iets geselecteerd → deselecteren
 * - niets geselecteerd → eerste beschikbare laag selecteren
 * (meerdere lagen: volgende in de lijst als je opnieuw selecteert na deselect)
 */
let _layerCycleIndex=-1;
function selectNextLayer(){
  const list=objects.filter(function(o){
    return o.visible!==false && (o.type==="image"||o.type==="text"||o.type==="frame"||o.type==="clipart");
  });
  if(!list.length){
    toast("Geen lagen om te selecteren");
    return;
  }

  /* Als er iets geselecteerd is → deselecteren */
  if(selected && (selected.type==="image"||selected.type==="text"||selected.type==="frame"||selected.type==="clipart")){
    const cur=list.indexOf(selected);
    if(cur>=0) _layerCycleIndex=cur;
    selected=null;
    layers();
    draw();
    if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();
    if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
    toast("Selectie uit");
    return;
  }

  /* Niets geselecteerd → volgende laag selecteren */
  _layerCycleIndex=(_layerCycleIndex+1)%list.length;
  selected=list[_layerCycleIndex];
  layers();
  draw();
  if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
  if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
  const label=
    selected.type==="image"?"Foto":
    selected.type==="text"?("Tekst: "+(selected.text||"").slice(0,24)):
    selected.type==="clipart"?("Clipart: "+(selected.name||selected.emoji||"")):
    selected.type==="frame"?("Kader — "+(selected.style||"")):
    (selected.name||"Laag");
  toast(label);
}


/* =========================================================
   2D INTERACTION
========================================================= */

function pointer(e){

  const r=
    canvas.getBoundingClientRect();

  return {

    x:
      (e.clientX-r.left)*
      W/r.width,

    y:
      (e.clientY-r.top)*
      H/r.height

  };

}

function hit(x,y){

  for(
    let i=objects.length-1;
    i>=0;
    i--
  ){

    const o=
      objects[i];

    if(
      o.visible===false ||
      o.locked
    )
      continue;

    if(o.type==="image"){

      const w=
        o.img.width*
        o.scale;

      const h=
        o.img.height*
        o.scale;

      if(
        x>o.x-w/2 &&
        x<o.x+w/2 &&
        y>o.y-h/2 &&
        y<o.y+h/2
      )
        return o;

    }

    if(o.type==="text"){

      ctx.font=
        `${o.weight} ${o.size}px ${o.font}`;

      const w=
        ctx.measureText(
          o.text
        ).width;

      if(
        x>o.x-w/2-25 &&
        x<o.x+w/2+25 &&
        y>o.y-o.size &&
        y<o.y+o.size
      )
        return o;

    }

    if(o.type==="clipart"){
      const sz=(o.size||72)*0.6;
      if(x>o.x-sz && x<o.x+sz && y>o.y-sz && y<o.y+sz)
        return o;
    }

  }

  return null;

}


/*
  Tijdens het slepen van een object wordt
  ALLEEN de 2D-editor getekend.

  Hierdoor hoeft de 3D texture niet bij iedere
  muisbeweging opnieuw opgebouwd te worden.
*/

let _dragRaf=0;

let _2dDbl={t:0,x:0,y:0,key:null};
function _2dPickKey(o){
  if(!o) return null;
  return o.type+"|"+(o.name||"")+"|"+(o.text||"")+"|"+(o.emoji||"");
}
canvas.addEventListener(
  "pointerdown",
  e=>{

    const p=pointer(e);
    const o=hit(p.x, p.y);

    /* MOBIEL: alleen dubbeltik selecteert; enkele tik leeg = deselect */
    if(typeof isMobile==="function" && isMobile()){
      if(o && selected && o===selected){
        drag={ox:p.x-o.x, oy:p.y-o.y};
        try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
        e.preventDefault();
        return;
      }
      if(o && (o.type==="text" || o.type==="image" || o.type==="clipart")){
        const now=performance.now();
        const key=_2dPickKey(o);
        const dt=now-_2dDbl.t;
        const dist=Math.hypot(e.clientX-_2dDbl.x, e.clientY-_2dDbl.y);
        if(dt<320 && dist<28 && key && key===_2dDbl.key){
          _2dDbl={t:0,x:0,y:0,key:null};
          selected=o;
          drag={ox:p.x-o.x, oy:p.y-o.y};
          try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
          layers();
          if(typeof updateText3dBar==="function") updateText3dBar();
          if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
          e.preventDefault();
          return;
        }
        _2dDbl={t:now,x:e.clientX,y:e.clientY,key:key};
        /* enkele tik: niet selecteren */
        return;
      }
      if(selected){
        if(selected.type==="text" && typeof clearTextSelection==="function") clearTextSelection();
        else{
          selected=null;
          if(typeof layers==="function") layers();
          if(typeof draw==="function") draw();
          if(typeof updateText3dBar==="function") updateText3dBar();
        }
      }
      return;
    }

    if(!o) return;
    selected=o;
    drag={
      ox:p.x-o.x,
      oy:p.y-o.y
    };
    try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
    layers();
    e.preventDefault();

  },
  {passive:false}
);

canvas.addEventListener(
  "pointermove",
  e=>{

    if(!drag || !selected) return;

    const p=pointer(e);
    selected.x=p.x-drag.ox;
    selected.y=p.y-drag.oy;

    /* Direct 2D — max 1 draw per frame, geen 3D tijdens slepen */
    if(!_dragRaf){
      _dragRaf=requestAnimationFrame(()=>{
        _dragRaf=0;
        draw();
      });
    }
    e.preventDefault();

  },
  {passive:false}
);

window.addEventListener(
  "pointerup",
  ()=>{

    if(drag){
      if(_dragRaf){
        cancelAnimationFrame(_dragRaf);
        _dragRaf=0;
      }
      draw();
      saveHistory();
      /* Eén 3D-update na loslaten */
      refresh3D();
    }
    drag=null;

  }
);


/* =========================================================
   THREE.JS VARIABLES
========================================================= */

let renderer=null;
let scene=null;
let camera=null;
let model=null;
let turntable=null;

let threeReady=false;

let rx=-.18;
let ry=-.48;

/*
  Start verder uitgezoomd.
*/

let distance=7.2;


let text3dEdit=false;
let text3dDrag=null;

function hasTextObject(){
  return objects.some(o=>o.type==="text" && o.visible!==false);
}

function ensureTextSelected(){
  if(selected && selected.type==="text") return true;
  const tx=objects.find(o=>o.type==="text" && o.visible!==false);
  if(tx){
    selected=tx;
    layers();
    draw();
    return true;
  }
  return false;
}

function updateText3dBar(){
  const bar=document.getElementById("text3dBar");
  if(!bar) return;
  const dock=document.getElementById("textDock");
  const dockOpen=dock && dock.classList.contains("open");
  const moveMode=document.body.classList.contains("text-move-mode");
  const textSelected=!!(selected && selected.type==="text");
  const mobile=typeof isMobile==="function" && isMobile();
  /*
    ÉÉN bron van waarheid: knoppen alleen als selected.type === "text".
    Bij geen selectie of gesloten menu → direct verbergen, ☰+🔒 terug.
  */
  if(!mobile || !textSelected){
    bar.style.display="none";
    bar.classList.remove("show");
    document.body.classList.remove("has-text-selected");
    if(!textSelected){
      text3dEdit=false;
      const b=document.getElementById("btnText3dEdit");
      if(b) b.classList.remove("active");
      if(moveMode){
        document.body.classList.remove("text-move-mode");
        const done=document.getElementById("mobileTextDoneBtn");
        if(done){ try{ done.remove(); }catch(_){ done.style.display="none"; } }
      }
    }
  }else if(textSelected && !dockOpen && !moveMode){
    bar.style.display="flex";
    bar.classList.add("show");
    document.body.classList.add("has-text-selected");
  }else{
    /* dock open of move-mode: compacte bar niet tonen */
    bar.style.display="none";
    bar.classList.remove("show");
    if(textSelected) document.body.classList.add("has-text-selected");
    else document.body.classList.remove("has-text-selected");
  }
  const m3=document.getElementById("mobile3dBar");
  if(m3 && mobile){
    if(textSelected || moveMode){
      m3.classList.add("text-controls-active");
    }else{
      m3.classList.remove("text-controls-active");
    }
  }
}

/** Deselecteer actieve tekstlaag (object blijft bestaan) */
function clearTextSelection(){
  if(!selected || selected.type!=="text") return;
  selected=null;
  text3dEdit=false;
  text3dDrag=null;
  document.body.classList.remove("text-move-mode","has-text-selected");
  const b=document.getElementById("btnText3dEdit");
  if(b) b.classList.remove("active");
  if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();
  if(typeof layers==="function") layers();
  if(typeof draw==="function") draw();
  if(typeof updateText3dBar==="function") updateText3dBar();
  if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
}

function toggleText3dEdit(){
  if(!ensureTextSelected()){
    toast("Voeg eerst tekst toe in Ontwerpen");
    return;
  }
  text3dEdit=!text3dEdit;
  const b=document.getElementById("btnText3dEdit");
  if(b) b.classList.toggle("active", text3dEdit);
  const help=document.getElementById("help");
  if(help){
    if(typeof updateHelp==="function") updateHelp();
    if(text3dEdit){
      help.textContent="✋ Sleep om tekst te verplaatsen · A− / A+ voor grootte";
    }
  }
  /* Mobiel: speciale verplaatsmodus → groot tegel + minimale UI */
  if(typeof isMobile==="function" && isMobile()){
    if(text3dEdit){
      enterMobileTextMoveMode();
    }else{
      exitMobileTextMoveMode();
    }
    return;
  }
  toast(text3dEdit?"Tekst verplaatsen aan":"Tekst verplaatsen uit");
}

/** Mobiel: geen groot dock — alleen fixed A−/A+/KLAAR, maximale tegelruimte */
function enterMobileTextMoveMode(){
  if(typeof isMobile!=="function" || !isMobile()) return;
  ensureTextSelected();
  text3dEdit=true;
  document.body.classList.add("text-move-mode");
  /* Verberg volledig text-dock → maximale canvas-hoogte */
  const dock=document.getElementById("textDock");
  if(dock){
    dock.classList.remove("open","td-move-compact");
  }
  document.documentElement.style.setProperty("--text-dock-h","0px");
  document.documentElement.style.setProperty("--sheet-h","0px");
  if(typeof sheetHeightPx!=="undefined") sheetHeightPx=0;
  /* Compacte fixed control strip: A− | A+ | KLAAR */
  let strip=document.getElementById("mobileTextMoveStrip");
  if(!strip){
    strip=document.createElement("div");
    strip.id="mobileTextMoveStrip";
    strip.setAttribute("aria-label","Tekst verplaatsen");
    strip.innerHTML=
      '<button type="button" class="mtm-size" onclick="text3dSize(-8)" aria-label="Kleiner">A−</button>'+
      '<button type="button" class="mtm-size" onclick="text3dSize(8)" aria-label="Groter">A+</button>'+
      '<button type="button" class="mtm-done" id="mobileTextDoneBtn" onclick="finishMobileTextMoveMode()">KLAAR</button>';
    document.body.appendChild(strip);
  }
  strip.style.display="flex";
  /* Reserveer alleen de strip-hoogte (~56px), niet een groot menu */
  document.documentElement.style.setProperty("--text-dock-h","56px");
  document.body.classList.add("panel-open");
  requestAnimationFrame(function(){
    if(typeof fitMobileStage==="function") fitMobileStage();
    if(typeof resize3D==="function"){ try{resize3D();}catch(_){}}
    /* Geen canvas buffer-resize — alleen CSS stage-size; draw behoudt 1200px resolutie */
    if(typeof draw==="function") draw();
    if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
  });
  toast("Sleep de tekst · pinch of A−/A+ voor grootte");
}

function exitMobileTextMoveMode(){
  document.body.classList.remove("text-move-mode");
  const dock=document.getElementById("textDock");
  if(dock) dock.classList.remove("td-move-compact");
  const strip=document.getElementById("mobileTextMoveStrip");
  if(strip){
    strip.style.display="none";
    try{ strip.remove(); }catch(_){}
  }
  const done=document.getElementById("mobileTextDoneBtn");
  if(done && done.parentNode && done.parentNode.id!=="mobileTextMoveStrip"){
    try{ done.remove(); }catch(_){}
  }
  document.documentElement.style.setProperty("--text-dock-h","0px");
}

function finishMobileTextMoveMode(){
  text3dEdit=false;
  const b=document.getElementById("btnText3dEdit");
  if(b) b.classList.remove("active");
  exitMobileTextMoveMode();
  if(typeof clearTextSelection==="function") clearTextSelection();
  else if(typeof updateText3dBar==="function") updateText3dBar();
  const sh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sheet-h"))||0;
  if(sh<=0) document.body.classList.remove("panel-open");
  if(typeof fitMobileStage==="function") requestAnimationFrame(fitMobileStage);
  toast("Tekst opgeslagen");
}

function text3dSize(delta){
  if(!ensureTextSelected()) return;
  selected.size=Math.max(12, Math.min(180, (selected.size||40)+delta));
  draw();
  if(typeof refresh3D==="function") refresh3D();
}


let threeDrag=false;
let tileRotationLocked=false;
let layerMenuOpen=false;

const FRONT_RX=-0.18;
const FRONT_RY=-0.48;

function resetTileFrontView(animate){
  const targetRx=FRONT_RX;
  const targetRy=FRONT_RY;
  if(!animate || !model){
    rx=targetRx;
    ry=targetRy;
    if(model){
      model.rotation.x=rx;
      model.rotation.y=ry;
    }
    return;
  }
  const startRx=rx, startRy=ry;
  const t0=performance.now();
  const dur=220;
  function step(now){
    const t=Math.min(1,(now-t0)/dur);
    const e=1-Math.pow(1-t,3);
    rx=startRx+(targetRx-startRx)*e;
    ry=startRy+(targetRy-startRy)*e;
    if(model){
      model.rotation.x=rx;
      model.rotation.y=ry;
    }
    if(t<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* =========================================================
   DESKTOP: productpaneel inklappen / openen
========================================================= */
let productPanelOpen=true;
let aanpassenOpen=false;

function setProductPanelOpen(open){
  productPanelOpen=!!open;
  const main=document.querySelector(".main");
  if(!main) return;
  main.classList.toggle("product-collapsed", !productPanelOpen);
  main.classList.toggle("product-open-overlay", productPanelOpen && window.innerWidth<=1200 && window.innerWidth>760);
  if(!productPanelOpen && aanpassenOpen){
    aanpassenOpen=false;
    main.classList.remove("ap-open");
    const btnA=document.getElementById("btnAanpassen");
    if(btnA) btnA.classList.remove("active");
  }
  const btn=document.getElementById("toolProduct");
  if(btn) btn.classList.toggle("active", productPanelOpen);
  const collapseBtn=document.getElementById("rightCollapseBtn");
  if(collapseBtn){
    /* Open = ← (dichtklappen) · Dicht = → (openen) */
    collapseBtn.textContent=productPanelOpen?"←":"→";
    collapseBtn.title=productPanelOpen?"Productpaneel inklappen":"Productpaneel openen";
    collapseBtn.setAttribute("aria-label", collapseBtn.title);
  }
  /* Overlay-panelen: preview-positie blijft stabiel — geen camera/zoom reset */
}

function toggleProductPanel(force){
  if(typeof force==="boolean") setProductPanelOpen(force);
  else setProductPanelOpen(!productPanelOpen);
}

/* =========================================================
   AANPASSEN-PANEL (desktop: links van Product)
========================================================= */
function toggleAanpassenPanel(force){
  if(typeof isMobile==="function" && isMobile()) return;
  const main=document.querySelector(".main");
  if(!main) return;
  const next=typeof force==="boolean"?force:!aanpassenOpen;

  /* Desktop: bij het openen van AANPASSEN moet het linker menu
     volledig dicht, zodat de editor niet smaller wordt. */
  if(next && !(typeof isMobile==="function" && isMobile())){
    if(typeof closeLeftConfigPanel==="function"){
      closeLeftConfigPanel();
    }else{
      document.body.classList.remove("left-panel-open");
      const left=document.getElementById("left");
      if(left) left.classList.remove("open");
    }
  }

  aanpassenOpen=next;
  main.classList.toggle("ap-open", aanpassenOpen);

  if(aanpassenOpen){
    syncTileOrientationUI();
  }
  const btn=document.getElementById("btnAanpassen");
  if(btn) btn.classList.toggle("active", aanpassenOpen);

  const block=document.getElementById("productOptionsBlock");
  const apBody=document.getElementById("apBody");
  const rightScroll=document.getElementById("rightScroll");
  if(block && apBody && rightScroll){
    if(aanpassenOpen){
      if(block.parentElement!==apBody) apBody.appendChild(block);
    }else{
      if(block.parentElement!==rightScroll){
        /* terugzetten na de rp-secties / product-card */
        const insertAfter=rightScroll.querySelector(".product-card")||rightScroll.querySelector(".rp-section:last-of-type");
        if(insertAfter && insertAfter.nextSibling){
          rightScroll.insertBefore(block, insertAfter.nextSibling);
        }else{
          rightScroll.appendChild(block);
        }
      }
    }
  }

  /* Geen camera/zoom/preview reset — alleen layout */
  requestAnimationFrame(function(){
    if(typeof resize3D==="function" && threeReady){
      try{ resize3D(); }catch(_){}
    }
    if(typeof draw==="function") try{ draw(); }catch(_){}
  });
}

function showLayersInLeft(){
  const left=document.getElementById("left");
  if(!left) return;
  const right=document.querySelector(".right");
  if(right && typeof isMobile==="function" && isMobile()){
    right.classList.remove("open","mobile-sheet");
  }
  left.classList.add("open");
  if(typeof openSheetDefault==="function") openSheetDefault();
  if(typeof openLeftConfigPanel==="function") openLeftConfigPanel();

  /* Mobiel: per laag oogje + prullenbak (onafhankelijke acties) */
  let rows="";
  if(!objects.length){
    rows='<div class="panel-sub">Nog geen lagen. Voeg een foto, tekst of kader toe.</div>';
  }else{
    [...objects].reverse().forEach(function(o){
      const index=objects.indexOf(o);
      const active=o===selected;
      const ico=typeof layerIcon==="function"?layerIcon(o):(o.type==="image"?"📷":o.type==="text"?"T":"▣");
      const name=typeof layerLabel==="function"?layerLabel(o):(o.name||o.type);
      const op=typeof o.opacity==="number"?Math.round(o.opacity*100):100;
      const eye=o.visible===false?"◌":"👁";
      const canDelete=o.type!=="background";
      const delBtn=canDelete
        ?`<button type="button" class="ml-del" aria-label="Verwijderen" onclick="event.preventDefault();event.stopPropagation();removeLayerAt(${index});if(typeof showLayersInLeft==='function')showLayersInLeft()">🗑</button>`
        :`<span class="ml-del-spacer"></span>`;
      rows+=`<div class="ml-row${active?" active":""}${o.visible===false?" hidden-layer":""}">
        <button type="button" class="ml-eye" aria-label="Zichtbaarheid" onclick="event.preventDefault();event.stopPropagation();toggleVisibility(${index});if(typeof showLayersInLeft==='function')showLayersInLeft()">${eye}</button>
        <button type="button" class="ml-main" onclick="select(${index});if(typeof showLayersInLeft==='function')showLayersInLeft()">
          <span class="ml-ico">${ico}</span>
          <span class="ml-meta">
            <span class="ml-name">${esc(name)}</span>
            <span class="ml-op">${op}%</span>
          </span>
        </button>
        ${delBtn}
      </div>`;
    });
  }
  const body=`
    <div class="panel-sub">👁 zichtbaarheid · 🗑 verwijderen · tik op naam om te selecteren</div>
    <div class="section ml-list">${rows}</div>
    <button type="button" class="action" onclick="selected=null;layers();draw();if(typeof updateWorkspaceControlsState==='function')updateWorkspaceControlsState();showLayersInLeft()">○ Deselecteren</button>
  `;
  left.innerHTML=typeof sheetWrap==="function"?sheetWrap("Lagen", body):body;
  if(typeof bindSheetDrag==="function") bindSheetDrag(left);
}

function toggleTileLock(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  tileRotationLocked=!tileRotationLocked;
  const btn=document.getElementById("wsLockBtn");
  if(btn){
    btn.classList.toggle("locked", tileRotationLocked);
    btn.textContent=tileRotationLocked?"🔒":"🔓";
    btn.title=tileRotationLocked?"Compositie ontgrendelen":"Compositie vergrendelen";
  }
  if(tileRotationLocked){
    /* Compositie-lock: geen laag-selectie/slepen; zoom = alleen camera */
    threeDrag=false;
    text3dDrag=null;
    selected=null;
    if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();
    if(typeof layers==="function") layers();
    if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
  }
}

let _lockFeedbackTimer=null;
let _lockDragAttempt=false;
let _lockFeedbackShown=false;

/** Korte visuele feedback wanneer gebruiker probeert te draaien terwijl vergrendeld */
function showTileLockFeedback(){
  if(!tileRotationLocked) return;
  const btn=document.getElementById("wsLockBtn");
  if(!btn) return;

  btn.classList.remove("lock-pulse");
  void btn.offsetWidth; /* herstart animatie */
  btn.classList.add("lock-pulse");

  let tip=document.getElementById("lockTip");
  if(!tip){
    tip=document.createElement("div");
    tip.id="lockTip";
    tip.className="lock-tip";
    tip.setAttribute("role","status");
    /* Naast/bij het slotje in dezelfde parent */
    const parent=btn.parentElement||document.querySelector(".workspace")||document.body;
    parent.appendChild(tip);
  }
  tip.textContent="Ontgrendel om te draaien";
  tip.classList.add("show");

  if(_lockFeedbackTimer) clearTimeout(_lockFeedbackTimer);
  _lockFeedbackTimer=setTimeout(function(){
    tip.classList.remove("show");
    btn.classList.remove("lock-pulse");
    _lockFeedbackTimer=null;
  }, 900);
}

function toggleLayerMenu(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  layerMenuOpen=!layerMenuOpen;
  document.body.classList.toggle("ws-layer-menu-open", layerMenuOpen);

  /*
    Desktop: zodra het Aanpassen/laagsmenu opent, klapt het grote
    linker configuratiemenu automatisch dicht. Zo blijft de studio
    voldoende breed en staan er niet drie panelen tegelijk open.
  */
  if(layerMenuOpen && !(typeof isMobile==="function" && isMobile())){
    if(typeof closeLeftConfigPanel==="function"){
      closeLeftConfigPanel();
    }else{
      document.body.classList.remove("left-panel-open");
      const left=document.getElementById("left");
      if(left) left.classList.remove("open");
    }
  }
  const btn=document.getElementById("wsMenuToggle");
  if(btn){
    btn.classList.toggle("active", layerMenuOpen);
    btn.textContent=layerMenuOpen?"×":"☰";
    btn.title=layerMenuOpen?"Menu sluiten":"Laagmenu";
  }
  const fab=document.getElementById("desktopMenuFab");
  if(fab){
    fab.classList.toggle("active", layerMenuOpen);
    fab.textContent=layerMenuOpen?"×":"☰";
    fab.title=layerMenuOpen?"Menu sluiten":"Laagmenu";
  }
  /* Mobiel: zorg dat de bar/menu zichtbaar blijft */
  if(typeof isMobile==="function" && isMobile()){
    const bar=document.getElementById("mobile3dBar");
    if(bar){
      bar.style.display="flex";
      bar.style.overflow="visible";
      bar.style.zIndex=layerMenuOpen?"135":"120";
    }
    const controls=document.getElementById("workspaceControls");
    if(controls){
      controls.style.pointerEvents=layerMenuOpen?"auto":"";
    }
  }
}

function openLayerMenuForEdit(){
  if(typeof isMobile==="function" && isMobile()){
    if(!layerMenuOpen){
      layerMenuOpen=true;
      document.body.classList.toggle("ws-layer-menu-open", true);
      const btn=document.getElementById("wsMenuToggle");
      if(btn) btn.classList.add("active");
    }
  }
  resetTileFrontView(true);
}

let lastX=0;
let lastY=0;


/* =========================================================
   TILE DIMENSIONS
========================================================= */

function tileDimensions(){

  const cfg=products.tile.sizes[size]||{};
  let pw=Number(cfg.width)||11;
  let ph=Number(cfg.height)||11;
  if((size==="20×25 cm" || size==="20×30 cm") && tileOrientation==="landscape"){
    [pw,ph]=[ph,pw];
  }
  const maxSide=2.86;
  const scale=maxSide/Math.max(pw,ph);

  return {

    width:pw*scale,

    height:ph*scale,

    depth:
      size==="20×20 cm" || size==="20×25 cm" || size==="20×30 cm"
        ?0.20
        :.18,

    /* Subtiele afronding — keramische tegel */
    radius:
      size==="20×20 cm" || size==="20×25 cm" || size==="20×30 cm"
        ?0.020
        :
      size==="15×15 cm"
        ?0.018
        :
        0.016

  };

}

/* =========================================================
   INITIAL PRODUCT ASPECT
========================================================= */
syncProductAspectRatio();

/* =========================================================
   ROUNDED TILE SHAPE
========================================================= */

function createRoundedTileShape(){

  const d=
    tileDimensions();

  const x=
    d.width/2;

  const y=
    d.height/2;

  const r=
    d.radius;

  const shape=
    new THREE.Shape();

  shape.moveTo(
    -x+r,
    -y
  );

  shape.lineTo(
    x-r,
    -y
  );

  shape.quadraticCurveTo(
    x,
    -y,
    x,
    -y+r
  );

  shape.lineTo(
    x,
    y-r
  );

  shape.quadraticCurveTo(
    x,
    y,
    x-r,
    y
  );

  shape.lineTo(
    -x+r,
    y
  );

  shape.quadraticCurveTo(
    -x,
    y,
    -x,
    y-r
  );

  shape.lineTo(
    -x,
    -y+r
  );

  shape.quadraticCurveTo(
    -x,
    -y,
    -x+r,
    -y
  );

  return shape;

}


/* =========================================================
   CERAMIC BODY
========================================================= */

function roundedTile(){

  const d=
    tileDimensions();

  const geometry=
    new THREE.ExtrudeGeometry(
      createRoundedTileShape(),
      {

        depth:d.depth,

        bevelEnabled:true,

        bevelSegments:2,

        bevelSize:.008,

        bevelThickness:.006,

        curveSegments:6,

        steps:1

      }
    );

  geometry.center();

  geometry.computeVertexNormals();

  return geometry;

}


/* =========================================================
   CERAMIC MATERIAL — luxe / massief
========================================================= */

function ceramic(){

  /* Duidelijk zichtbaar verschil Mat vs Glans op keramiek */
  const gloss=finish==="gloss";

  return new THREE.MeshPhysicalMaterial({
    color:0xf0e9de,
    metalness:0,
    roughness:gloss?0.12:0.82,
    clearcoat:gloss?1.0:0.05,
    clearcoatRoughness:gloss?0.05:0.55,
    reflectivity:gloss?0.6:0.15,
    sheen:gloss?0:0.15,
    sheenRoughness:0.8,
    sheenColor:new THREE.Color(0xf5efe6)
  });

}


/* =========================================================
   IMPORTANT:
   CORRECT DESIGN TEXTURE
========================================================= */

function createDesignTexture(){

  /*
    3D-texture = exacte 2D-compositie.
    Strategie:
    1) Forceer schone draw() op editorCanvas (tijdelijk zichtbaar)
    2) Kopieer productvlak naar 2048² texture
    3) Fallback: offline tekenen van objects[] als canvas leeg lijkt
  */
  const b=bounds();
  const TW=2048, TH=2048;

  /* --- Stap 1: schone draw op main canvas --- */
  const prevSelected=selected;
  const prevVis=canvas.style.visibility;
  const prevDisp=canvas.style.display;
  const prevPE=canvas.style.pointerEvents;
  canvas.style.display="block";
  canvas.style.visibility="hidden";
  canvas.style.pointerEvents="none";

  selected=null;
  textureRender=true;
  try{ draw(); }catch(e){ console.warn("draw for texture", e); }
  textureRender=false;
  selected=prevSelected;

  /* --- Stap 2: kopieer productvlak --- */
  const textureCanvas=document.createElement("canvas");
  textureCanvas.width=TW;
  textureCanvas.height=TH;
  const tctx=textureCanvas.getContext("2d");
  tctx.fillStyle=product==="mouse"?"#252321":"#f3ede3";
  tctx.fillRect(0,0,TW,TH);

  let copied=false;
  try{
    tctx.drawImage(canvas, b.x, b.y, b.w, b.h, 0, 0, TW, TH);
    copied=true;
  }catch(e){
    console.warn("canvas copy failed", e);
  }

  /* --- Stap 3: offline altijd volle layer-stack (foto+sjabloon+opacity) --- */
  const hasDesign=objects.some(o=>o.visible!==false) || (tileBg && tileBg!=="empty");
  if(hasDesign){
    paintLayerStackToTexture(tctx, TW, TH, b);
  }

  /* Herstel canvas-stijl */
  canvas.style.visibility=prevVis||"";
  canvas.style.display=prevDisp||"";
  canvas.style.pointerEvents=prevPE||"";
  if((prevVis||"")!=="hidden" && (prevDisp||"")!=="none"){
    try{ draw(); }catch(_){}
  }

  const texture=new THREE.CanvasTexture(textureCanvas);
  if(THREE.SRGBColorSpace) texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=THREE.ClampToEdgeWrapping;
  texture.wrapT=THREE.ClampToEdgeWrapping;
  texture.minFilter=THREE.LinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=false;
  texture.flipY=true;
  texture.needsUpdate=true;
  return texture;

}


/* =========================================================
   PRINT MATERIAL
========================================================= */

function printMaterial(texture){

  /*
    Front-plane: compositie-texture + Mat/Glans-afwerking.
  */
  const gloss=finish==="gloss";
  const material=new THREE.MeshPhysicalMaterial({
    map:texture,
    color:0xffffff,
    side:THREE.FrontSide,
    metalness:0,
    roughness:gloss?0.18:0.88,
    clearcoat:gloss?0.85:0.02,
    clearcoatRoughness:gloss?0.08:0.6,
    depthTest:true,
    depthWrite:false,
    transparent:false,
    polygonOffset:true,
    polygonOffsetFactor:-4,
    polygonOffsetUnits:-4
  });
  material.needsUpdate=true;
  return material;
}

/* =========================================================
   FRONT PRINT — compositie op het voorvlak
========================================================= */

function tilePrintedFront(){

  const texture = createDesignTexture();
  texture.needsUpdate = true;

  const d = tileDimensions();

  /*
    Rand UIT: print iets kleiner → keramische rand zichtbaar.
    Rand AAN: print dekt het volledige voorvlak.
  */
  const margin = edge ? 0 : Math.max(0.016, d.radius * 1.4);
  const oversize = edge ? 0.001 : -(margin * 2);
  const printWidth = Math.max(0.1, d.width + oversize);
  const printHeight = Math.max(0.1, d.height + oversize);

  /*
    PlaneGeometry: betrouwbare UVs (0..1), normal +Z.
    Geen ShapeGeometry-winding/UV-problemen.
  */
  const geometry = new THREE.PlaneGeometry(printWidth, printHeight);
  const material = printMaterial(texture);
  const mesh = new THREE.Mesh(geometry, material);

  /* Net vóór het voorvlak; polygonOffset doet de rest tegen z-fighting */
  mesh.position.z = d.depth / 2 + 0.012;
  mesh.renderOrder = 10;
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  return mesh;
}

/* =========================================================
   EDGE PRINT (niet gebruikt; rand via inset op front print)
========================================================= */

function tilePrintedEdge(){
  return null;
}


function tileModel(){

  const group=new THREE.Group();

  /*
    Structuur:
    - Body (ExtrudeGeometry): solid keramiek op ALLE vlakken
      (voor, achter, zijkanten) — GEEN klantfoto
    - Front plane: alleen VOORKANT krijgt de 2D-compositie
    (draaiplateau is APARTE scene-object: turntable)
  */
  const body=new THREE.Mesh(roundedTile(), ceramic());
  body.castShadow=true;
  body.receiveShadow=true;
  group.add(body);

  const texture=createDesignTexture();
  const front=tilePrintedFrontWithTexture(texture);
  group.add(front);

  return group;

}

/* Alleen 3D-presentatie — geen print/2D/export */
function createTurntable(){
  const d=typeof tileDimensions==="function"?tileDimensions():{width:2,height:2,depth:.2};
  const group=new THREE.Group();
  group.name="turntable";

  /* Diameter ~10% breder dan tegel (5–15% bereik) */
  const plateR=Math.max(d.width,d.height)*0.55;
  const plateH=0.055;
  const gap=0.02;
  const plateY=-(d.height/2)-gap-(plateH/2);

  const plate=new THREE.Mesh(
    new THREE.CylinderGeometry(plateR, plateR*1.02, plateH, 96),
    new THREE.MeshPhysicalMaterial({
      color:0x141418,
      metalness:0.48,
      roughness:0.38,
      clearcoat:0.4,
      clearcoatRoughness:0.22
    })
  );
  plate.position.set(0, plateY, 0);
  plate.receiveShadow=true;
  plate.castShadow=true;
  group.add(plate);

  const rim=new THREE.Mesh(
    new THREE.TorusGeometry(plateR*0.985, 0.01, 12, 96),
    new THREE.MeshStandardMaterial({
      color:0xd4af6e,
      metalness:0.9,
      roughness:0.25,
      emissive:0x2a1e0c,
      emissiveIntensity:0.18
    })
  );
  rim.rotation.x=Math.PI/2;
  rim.position.set(0, plateY+plateH/2-0.001, 0);
  group.add(rim);

  const base=new THREE.Mesh(
    new THREE.CylinderGeometry(plateR*1.04, plateR*1.06, 0.022, 96),
    new THREE.MeshStandardMaterial({
      color:0x0c0c10,
      metalness:0.35,
      roughness:0.55
    })
  );
  base.position.set(0, plateY-plateH/2-0.01, 0);
  base.receiveShadow=true;
  group.add(base);

  return group;
}

function tilePrintedFrontWithTexture(texture){
  const d=tileDimensions();

  /*
    Rand UIT: iets smaller → keramische rand van de body zichtbaar.
    Rand AAN: full-bleed over het voorvlak.
  */
  const margin=edge?0:Math.max(0.016, d.radius*1.4);
  const oversize=edge?0.002:-(margin*2);
  const printWidth=Math.max(0.1, d.width+oversize);
  const printHeight=Math.max(0.1, d.height+oversize);

  const geometry=new THREE.PlaneGeometry(printWidth, printHeight);
  const material=printMaterial(texture);
  const mesh=new THREE.Mesh(geometry, material);

  /* Net vóór het voorvlak; polygonOffset voorkomt dambord-z-fighting */
  mesh.position.z=d.depth/2+0.012;
  mesh.renderOrder=10;
  mesh.castShadow=false;
  mesh.receiveShadow=false;
  return mesh;
}


/* =========================================================
   OTHER PRODUCTS
========================================================= */

function otherModel(){

  const texture=
    createDesignTexture();

  const group=
    new THREE.Group();

  if(product==="coaster"){

    const v = typeof getCoasterVariant === "function" ? getCoasterVariant(coasterVariant) : null;
    const isSquare = v && v.shape === "square";
    const isMetal = v && v.materialKey === "aluminium_cork";

    if(isSquare){
      const bodyMat = isMetal
        ? new THREE.MeshPhysicalMaterial({ color:0xbab7b0, metalness:.55, roughness:.35 })
        : ceramic();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.86, 2.86, 0.12),
        bodyMat
      );
      group.add(body);
      const front = new THREE.Mesh(
        new THREE.PlaneGeometry(2.84, 2.84),
        printMaterial(texture)
      );
      front.position.z = 0.07;
      group.add(front);
    }else{
      const body =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            1.43,
            1.43,
            .16,
            96
          ),
          ceramic()
        );
      body.rotation.x = Math.PI/2;
      group.add(body);
      const front =
        new THREE.Mesh(
          new THREE.CircleGeometry(
            1.425,
            96
          ),
          printMaterial(texture)
        );
      front.position.z = .09;
      group.add(front);
    }

  }

  if(product==="aluminium"){

    const body=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          3.2,
          2.3,
          .08
        ),
        new THREE.MeshPhysicalMaterial({

          color:0xbab7b0,

          metalness:.72,

          roughness:.25

        })
      );

    group.add(body);

    const front=
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          3.18,
          2.28
        ),
        new THREE.MeshPhysicalMaterial({

          map:texture,

          roughness:.25,

          side:THREE.DoubleSide

        })
      );

    front.position.z=.045;

    group.add(front);

  }

  if(product==="mouse"){

    const sz = typeof getSize === "function" ? getSize("mouse", size) : null;
    const isRound = sz && sz.shape === "circle";
    const matBody = new THREE.MeshPhysicalMaterial({
      color: 0x242220,
      roughness: .85
    });
    const matPrint = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: .72,
      side: THREE.DoubleSide
    });

    if(isRound){
      /* Eenvoudige ronde muismat — bestaande architectuur, geen grote refactor */
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 0.08, 64),
        matBody
      );
      body.rotation.x = Math.PI / 2;
      group.add(body);
      const front = new THREE.Mesh(
        new THREE.CircleGeometry(1.58, 64),
        matPrint
      );
      front.position.z = 0.045;
      group.add(front);
    }else{
      /*
        Rechthoekige muismat: breedte/hoogte uit catalogus (cm).
        Standaard 23,5 × 19,5 → zelfde max-zijde als voorheen (~4.2), dikte 0.08 behouden.
        Zonder widthCm/heightCm (bijv. XL): legacy 4.2 × 2.55.
      */
      let bw = 4.2;
      let bh = 2.55;
      const depth = 0.08;
      if(sz && Number(sz.widthCm) > 0 && Number(sz.heightCm) > 0){
        const cw = Number(sz.widthCm);
        const ch = Number(sz.heightCm);
        const maxSide = 4.2;
        const scale = maxSide / Math.max(cw, ch);
        bw = cw * scale;
        bh = ch * scale;
      }
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(bw, bh, depth),
        matBody
      );
      group.add(body);
      const inset = 0.03;
      const front = new THREE.Mesh(
        new THREE.PlaneGeometry(
          Math.max(0.1, bw - inset),
          Math.max(0.1, bh - inset)
        ),
        matPrint
      );
      front.position.z = 0.045;
      group.add(front);
    }

  }

  if(product==="mug"){

    /* Keramische sublimatiemok – print ALLEEN op buitenwand
       UV: U = 0→1 rondom (één omtrek), V = 0→1 over printzone
       Bron: bounds() via paintLayerStackToTexture (niet full canvas)
       Geen print op binnenkant / rand / bodem / handvat
    */
    const bodyMaterial = ceramic();
    const outerR = 1.15;
    const innerR = 1.05;
    const height = 2.40;
    const bottomThick = 0.09;
    const printMargin = 0.13;

    /* Binnenwand – BackSide zodat alleen de binnenkant wit is */
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0e9de,
      metalness: 0,
      roughness: finish === "gloss" ? 0.12 : 0.82,
      clearcoat: finish === "gloss" ? 1.0 : 0.05,
      clearcoatRoughness: finish === "gloss" ? 0.05 : 0.55,
      side: THREE.BackSide
    });
    const innerWall = new THREE.Mesh(
      new THREE.CylinderGeometry(innerR, innerR, height - bottomThick, 64, 1, true),
      innerMat
    );
    innerWall.position.y = bottomThick * 0.5;
    group.add(innerWall);

    /* Binnenbodem */
    const bottomInner = new THREE.Mesh(
      new THREE.CircleGeometry(innerR - 0.001, 48),
      bodyMaterial
    );
    bottomInner.rotation.x = -Math.PI / 2;
    bottomInner.position.y = -height / 2 + bottomThick;
    group.add(bottomInner);

    /* Buitenbodem */
    const bottomOuter = new THREE.Mesh(
      new THREE.CircleGeometry(outerR, 48),
      bodyMaterial
    );
    bottomOuter.rotation.x = Math.PI / 2;
    bottomOuter.position.y = -height / 2;
    group.add(bottomOuter);

    /* Witte buitenbanden boven/onder de printzone */
    const bandH = printMargin;
    const topBand = new THREE.Mesh(
      new THREE.CylinderGeometry(outerR, outerR, bandH, 64, 1, true),
      bodyMaterial
    );
    topBand.position.y = height / 2 - bandH / 2;
    group.add(topBand);

    const botBand = new THREE.Mesh(
      new THREE.CylinderGeometry(outerR, outerR, bandH, 64, 1, true),
      bodyMaterial
    );
    botBand.position.y = -height / 2 + bandH / 2;
    group.add(botBand);

    /* Bovenrand */
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry((outerR + innerR) / 2, (outerR - innerR) / 2 * 0.95, 10, 48),
      bodyMaterial
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = height / 2;
    group.add(rim);

    /* === PRINT TEXTURE: alleen bounds()-zone, 1× rondom === */
    const b = bounds();
    const TW = 2048;
    const TH = 1024;
    const mugCanvas = document.createElement("canvas");
    mugCanvas.width = TW;
    mugCanvas.height = TH;
    const mctx = mugCanvas.getContext("2d");
    mctx.fillStyle = "#f3ede3";
    mctx.fillRect(0, 0, TW, TH);

    if (typeof paintLayerStackToTexture === "function") {
      paintLayerStackToTexture(mctx, TW, TH, b);
    } else {
      try {
        mctx.drawImage(canvas, b.x, b.y, b.w, b.h, 0, 0, TW, TH);
      } catch (_) {}
    }

    const mugTexture = new THREE.CanvasTexture(mugCanvas);
    if (THREE.SRGBColorSpace) mugTexture.colorSpace = THREE.SRGBColorSpace;
    /* Één keer rondom: Clamp, geen Repeat */
    mugTexture.wrapS = THREE.ClampToEdgeWrapping;
    mugTexture.wrapT = THREE.ClampToEdgeWrapping;
    mugTexture.minFilter = THREE.LinearFilter;
    mugTexture.magFilter = THREE.LinearFilter;
    mugTexture.generateMipmaps = false;
    mugTexture.flipY = true;
    mugTexture.needsUpdate = true;

    const printH = height - printMargin * 2;
    const printMat = new THREE.MeshPhysicalMaterial({
      map: mugTexture,
      color: 0xffffff,
      metalness: 0,
      roughness: finish === "gloss" ? 0.10 : 0.35,
      clearcoat: finish === "gloss" ? 0.85 : 0.25,
      clearcoatRoughness: finish === "gloss" ? 0.08 : 0.40,
      side: THREE.FrontSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });

    /* Print-mesh = buitenwand in de printzone (géén witte shell eronder:
       die zou de print op de verre helft afdekken) */
    const printGeo = new THREE.CylinderGeometry(
      outerR + 0.002,
      outerR + 0.002,
      printH,
      128,
      1,
      true
    );
    /* Standaard CylinderGeometry UV: U 0→1 rondom, V 0→1 bottom→top.
       Normals wijzen naar buiten → FrontSide toont alleen de buitenkant. */
    const mugPrint = new THREE.Mesh(printGeo, printMat);
    mugPrint.position.y = 0;
    mugPrint.renderOrder = 10;
    mugPrint.castShadow = false;
    mugPrint.receiveShadow = false;
    group.add(mugPrint);

    /* C-handvat (wit, geen print) */
    const handleMajor = 0.40;
    const handleTube = 0.085;
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(handleMajor, handleTube, 16, 48, Math.PI * 1.40),
      bodyMaterial
    );
    handle.rotation.y = Math.PI / 2;
    handle.position.set(outerR + handleMajor * 0.12, 0, 0);
    group.add(handle);

  }

  return group;

}


/* =========================================================
   THREE INITIALIZATION
========================================================= */

function initThree(){

  if(threeReady)
    return;

  const container=
    document.getElementById("three");

  scene=
    new THREE.Scene();

  camera=
    new THREE.PerspectiveCamera(
      35,
      1,
      .01,
      100
    );

  distance=7.2;

  camera.position.z=
    distance;

  renderer=
    new THREE.WebGLRenderer({

      antialias:true,

      alpha:true,

      powerPreference:"high-performance"

    });

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );

  renderer.outputColorSpace=
    THREE.SRGBColorSpace;

  renderer.toneMapping=
    THREE.ACESFilmicToneMapping;

  renderer.toneMappingExposure=
    1.05;

  container.appendChild(
    renderer.domElement
  );


  /* LIGHTING */
  scene.add(
    new THREE.HemisphereLight(
      0xfff8ec,
      0x302a24,
      2.5
    )
  );

  const key=
    new THREE.DirectionalLight(
      0xffffff,
      3.6
    );
  key.position.set(5, 6, 8);
  scene.add(key);

  const fill=
    new THREE.DirectionalLight(
      0xe5c69d,
      1.2
    );
  fill.position.set(-5, 2, 4);
  scene.add(fill);

  const glossLight=
    new THREE.DirectionalLight(
      0xffffff,
      1.4
    );
  glossLight.position.set(-2, 8, 4);
  scene.add(glossLight);

  const rim=
    new THREE.DirectionalLight(
      0xffead1,
      0.9
    );
  rim.position.set(0, -4, -5);
  scene.add(rim);

  threeReady=true;

  setupThree();

  rebuild3D();

  resize3D();

  animate();

}


/* =========================================================
   DISPOSE
========================================================= */

function disposeModel(object){

  if(!object)
    return;

  object.traverse(
    child=>{

      if(child.geometry)
        child.geometry.dispose();

      if(child.material){

        const materials=
          Array.isArray(
            child.material
          )
            ?child.material
            :[child.material];

        materials.forEach(
          material=>{

            if(material.map)
              material.map.dispose();

            material.dispose();

          }
        );

      }

    }
  );

}


/* =========================================================
   REBUILD 3D
========================================================= */

function rebuild3D(){

  if(!threeReady)
    return;

  /*
    Rebuild gebeurt alleen wanneer het ontwerp,
    product of de instellingen daadwerkelijk
    veranderen.

    NIET tijdens 3D draaien.
  */

  if(model){

    scene.remove(model);

    disposeModel(model);

    model=null;

  }

  if(turntable){
    scene.remove(turntable);
    disposeModel(turntable);
    turntable=null;
  }

  model=
    product==="tile"
      ?tileModel()
      :otherModel();

  model.rotation.x=
    rx;

  model.rotation.y=
    ry;

  scene.add(model);

  /* Draaiplateau: apart van printbaar model, zelfde rx/ry */
  if(product==="tile" && typeof createTurntable==="function"){
    turntable=createTurntable();
    turntable.rotation.x=rx;
    turntable.rotation.y=ry;
    scene.add(turntable);
  }

  camera.position.z=
    distance;

  if(typeof updateText3dSelectBox==="function"){
    requestAnimationFrame(updateText3dSelectBox);
  }

}


/* =========================================================
   3D INTERACTION
========================================================= */

/* =========================================================
   3D TEXT PICK / DRAG (desktop: klik tekst → sleep)
   Mapt pointer → front plane → compositie-coördinaten.
   Selectie-UI is overlay (nooit in texture).
========================================================= */

let _threeBound=false;
let _text3dRay=null;
let _text3dNdc=null;
let _text3dDragRaf=0;

function getFrontPrintMesh(){
  if(!model) return null;
  let found=null;
  model.traverse(function(c){
    if(c.isMesh && c.renderOrder===10) found=c;
  });
  return found;
}

function clientToComposition3D(clientX, clientY){
  if(!camera || !model || !renderer) return null;
  const el=renderer.domElement;
  const rect=el.getBoundingClientRect();
  if(rect.width<1||rect.height<1) return null;

  if(!_text3dNdc) _text3dNdc=new THREE.Vector2();
  if(!_text3dRay) _text3dRay=new THREE.Raycaster();

  _text3dNdc.x=((clientX-rect.left)/rect.width)*2-1;
  _text3dNdc.y=-((clientY-rect.top)/rect.height)*2+1;
  _text3dRay.setFromCamera(_text3dNdc, camera);

  const front=getFrontPrintMesh();
  if(!front) return null;

  const hits=_text3dRay.intersectObject(front, false);
  if(!hits.length) return null;

  const local=front.worldToLocal(hits[0].point.clone());
  const geo=front.geometry;
  geo.computeBoundingBox();
  const bb=geo.boundingBox;
  const pw=Math.max(0.001, bb.max.x-bb.min.x);
  const ph=Math.max(0.001, bb.max.y-bb.min.y);

  /* Plane local: +X rechts, +Y omhoog → canvas: +Y omlaag */
  const u=(local.x-bb.min.x)/pw;
  const v=(local.y-bb.min.y)/ph;
  const b=bounds();
  return {
    x:b.x+u*b.w,
    y:b.y+(1-v)*b.h,
    u,v
  };
}

function hitTextAtComposition(cx, cy){
  for(let i=objects.length-1;i>=0;i--){
    const o=objects[i];
    if(o.visible===false||o.locked||o.type!=="text") continue;
    try{
      ctx.font=`${o.weight||400} ${o.size||40}px ${o.font||"Georgia"}`;
      const w=ctx.measureText(o.text||" ").width;
      const pad=Math.max(20, (o.size||40)*0.35);
      if(
        cx>o.x-w/2-pad &&
        cx<o.x+w/2+pad &&
        cy>o.y-(o.size||40)*0.85 &&
        cy<o.y+(o.size||40)*0.65
      ) return o;
    }catch(_){}
  }
  return null;
}

function hitImageAtComposition(cx, cy){
  for(let i=objects.length-1;i>=0;i--){
    const o=objects[i];
    if(o.visible===false||o.locked||o.type!=="image"||!o.img) continue;
    const iw=(o.img.naturalWidth||o.img.width||0)*(o.scale||1);
    const ih=(o.img.naturalHeight||o.img.height||0)*(o.scale||1);
    if(iw<1||ih<1) continue;
    /* Eenvoudige AABB (rotatie genegeerd voor hit-tolerance) */
    if(
      cx>o.x-iw/2 &&
      cx<o.x+iw/2 &&
      cy>o.y-ih/2 &&
      cy<o.y+ih/2
    ) return o;
  }
  return null;
}

function hitClipartAtComposition(cx, cy){
  for(let i=objects.length-1;i>=0;i--){
    const o=objects[i];
    if(o.visible===false||o.locked||o.type!=="clipart") continue;
    const sz=Math.max(28, o.size||72);
    const pad=sz*0.15;
    if(
      cx>o.x-sz/2-pad &&
      cx<o.x+sz/2+pad &&
      cy>o.y-sz/2-pad &&
      cy<o.y+sz/2+pad
    ) return o;
  }
  return null;
}

function isMovableDesignObject(o){
  return !!(o && (o.type==="image"||o.type==="text"||o.type==="clipart") && o.visible!==false && !o.locked);
}

/** Topmost verplaatsbaar object (tekst > clipart > foto) */
function hitDesignAtComposition(cx, cy){
  /* Zelfde volgorde als visuele stack: bovenste laag eerst (reverse) */
  for(let i=objects.length-1;i>=0;i--){
    const o=objects[i];
    if(!isMovableDesignObject(o)) continue;
    if(o.type==="text"){
      try{
        ctx.font=`${o.weight||400} ${o.size||40}px ${o.font||"Georgia"}`;
        const w=ctx.measureText(o.text||" ").width;
        const pad=Math.max(20, (o.size||40)*0.35);
        if(
          cx>o.x-w/2-pad &&
          cx<o.x+w/2+pad &&
          cy>o.y-(o.size||40)*0.85 &&
          cy<o.y+(o.size||40)*0.65
        ) return o;
      }catch(_){}
    }else if(o.type==="clipart"){
      const sz=Math.max(28, o.size||72);
      const pad=sz*0.15;
      if(
        cx>o.x-sz/2-pad &&
        cx<o.x+sz/2+pad &&
        cy>o.y-sz/2-pad &&
        cy<o.y+sz/2+pad
      ) return o;
    }else if(o.type==="image" && o.img){
      const iw=(o.img.naturalWidth||o.img.width||0)*(o.scale||1);
      const ih=(o.img.naturalHeight||o.img.height||0)*(o.scale||1);
      if(iw>=1&&ih>=1 &&
        cx>o.x-iw/2 && cx<o.x+iw/2 &&
        cy>o.y-ih/2 && cy<o.y+ih/2
      ) return o;
    }
  }
  return null;
}

function hitText3D(clientX, clientY){
  const p=clientToComposition3D(clientX, clientY);
  if(!p) return null;
  return hitTextAtComposition(p.x, p.y);
}

function hitDesign3D(clientX, clientY){
  const p=clientToComposition3D(clientX, clientY);
  if(!p) return null;
  return hitDesignAtComposition(p.x, p.y);
}

/**
 * Tekent de volledige layer-stack (incl. opacity/blend/sjabloon)
 * op een texture-context — zelfde compositie als 2D.
 */
function paintLayerStackToTexture(tctx, TW, TH, b){
  if(!tctx || !b) return;
  const sx=TW/b.w, sy=TH/b.h;
  tctx.save();
  tctx.beginPath();
  if(product==="coaster"){
    tctx.arc(TW/2,TH/2,Math.min(TW,TH)/2,0,Math.PI*2);
  }else{
    tctx.rect(0,0,TW,TH);
  }
  tctx.clip();
  if(typeof paintTileBackgroundPattern==="function"){
    paintTileBackgroundPattern(tctx, tileBg||"empty", 0, 0, TW, TH);
  }else{
    tctx.fillStyle=product==="mouse"?"#252321":"#f3ede3";
    tctx.fillRect(0,0,TW,TH);
  }

  objects.forEach(function(o){
    if(o.visible===false) return;
    const alpha=typeof o.opacity==="number"?Math.max(0,Math.min(1,o.opacity)):1;
    tctx.save();
    tctx.globalAlpha=alpha;
    if(o.blendMode && o.blendMode!=="source-over" && o.blendMode!=="normal"){
      try{ tctx.globalCompositeOperation=o.blendMode; }catch(_){}
    }

    if(o.type==="template"){
      const id=o.templateId||"empty";
      if(id!=="empty" && typeof paintTileBackgroundPattern==="function"){
        paintTileBackgroundPattern(tctx, id, 0, 0, TW, TH);
      }
    }else if(o.type==="pattern"){
      if(typeof paintStructurePattern==="function"){
        paintStructurePattern(tctx, o, 0, 0, TW, TH);
      }
    }else if(o.type==="image" && o.img){
      const imgW=o.img.naturalWidth||o.img.width||0;
      const imgH=o.img.naturalHeight||o.img.height||0;
      if(imgW>=1&&imgH>=1){
        tctx.translate((o.x-b.x)*sx,(o.y-b.y)*sy);
        tctx.rotate((o.rotation||0)*Math.PI/180);
        let srcImg=o.img;
        try{ srcImg=getFilteredImageSource(o)||o.img; }catch(_){}
        const iw=imgW*(o.scale||1)*sx;
        const ih=imgH*(o.scale||1)*sy;
        try{ tctx.drawImage(srcImg,-iw/2,-ih/2,iw,ih); }catch(_){}
      }
    }else if(o.type==="text"){
      tctx.translate((o.x-b.x)*sx,(o.y-b.y)*sy);
      tctx.rotate((o.rotation||0)*Math.PI/180);
      paintStyledText(tctx, o, sx);
    }else if(o.type==="clipart"){
      tctx.translate((o.x-b.x)*sx,(o.y-b.y)*sy);
      tctx.rotate((o.rotation||0)*Math.PI/180);
      const sz=(o.size||72)*sx;
      tctx.font=`${sz}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
      tctx.textAlign="center"; tctx.textBaseline="middle";
      tctx.fillText(o.emoji||"⭐",0,0);
    }else if(o.type==="frame"){
      paintFrame(tctx, o, {x:0,y:0,w:TW,h:TH}, Math.min(sx,sy));
    }
    tctx.restore();
  });
  tctx.restore();
}

/**
 * Lichte live update van de bestaande front CanvasTexture.
 * Geen mesh rebuild — alleen pixels + needsUpdate.
 * Gebruikt dezelfde layer-stack als 2D (incl. sjabloon + opacity).
 */
function liveUpdateFrontTexture(){
  const front=typeof getFrontPrintMesh==="function"?getFrontPrintMesh():null;
  if(!front || !front.material || !front.material.map) return;
  const tex=front.material.map;
  const src=tex.image;
  if(!src || !src.getContext) return;

  const TW=src.width, TH=src.height;
  if(TW<8||TH<8) return;
  const tctx=src.getContext("2d");
  const b=bounds();
  paintLayerStackToTexture(tctx, TW, TH, b);
  tex.needsUpdate=true;
  if(typeof renderer!=="undefined" && renderer && typeof scene!=="undefined" && scene && camera){
    try{ renderer.render(scene, camera); }catch(_){}
  }
}

function ensureText3dSelectBox(){
  const container=document.getElementById("three");
  if(!container) return null;
  let box=document.getElementById("text3dSelectBox");
  if(!box){
    box=document.createElement("div");
    box.id="text3dSelectBox";
    container.appendChild(box);
  }
  return box;
}

function hideText3dSelectBox(){
  const box=document.getElementById("text3dSelectBox");
  if(box) box.style.display="none";
}

function updateText3dSelectBox(){
  const box=ensureText3dSelectBox();
  if(!box || !selected || !model || !camera || !renderer){
    hideText3dSelectBox();
    return;
  }
  if(selected.type!=="text" && selected.type!=="image" && selected.type!=="clipart"){
    hideText3dSelectBox();
    return;
  }
  const front=getFrontPrintMesh();
  if(!front){ hideText3dSelectBox(); return; }

  try{
    let corners;
    const pad=12;
    if(selected.type==="text"){
      ctx.font=`${selected.weight||400} ${selected.size||40}px ${selected.font||"Georgia"}`;
      const tw=ctx.measureText(selected.text||" ").width;
      const th=selected.size||40;
      corners=[
        [selected.x-tw/2-pad, selected.y-th*0.75-pad],
        [selected.x+tw/2+pad, selected.y-th*0.75-pad],
        [selected.x+tw/2+pad, selected.y+th*0.55+pad],
        [selected.x-tw/2-pad, selected.y+th*0.55+pad]
      ];
    }else if(selected.type==="clipart"){
      const sz=Math.max(28, selected.size||72);
      const p=pad+sz*0.08;
      corners=[
        [selected.x-sz/2-p, selected.y-sz/2-p],
        [selected.x+sz/2+p, selected.y-sz/2-p],
        [selected.x+sz/2+p, selected.y+sz/2+p],
        [selected.x-sz/2-p, selected.y+sz/2+p]
      ];
    }else{
      const imgW=(selected.img&&(selected.img.naturalWidth||selected.img.width))||100;
      const imgH=(selected.img&&(selected.img.naturalHeight||selected.img.height))||100;
      const iw=imgW*(selected.scale||1);
      const ih=imgH*(selected.scale||1);
      corners=[
        [selected.x-iw/2-pad, selected.y-ih/2-pad],
        [selected.x+iw/2+pad, selected.y-ih/2-pad],
        [selected.x+iw/2+pad, selected.y+ih/2+pad],
        [selected.x-iw/2-pad, selected.y+ih/2+pad]
      ];
    }

    const geo=front.geometry;
    geo.computeBoundingBox();
    const bb=geo.boundingBox;
    const pw=Math.max(0.001, bb.max.x-bb.min.x);
    const ph=Math.max(0.001, bb.max.y-bb.min.y);
    const b=bounds();
    const el=renderer.domElement;
    const rect=el.getBoundingClientRect();
    const container=document.getElementById("three");
    const crect=container.getBoundingClientRect();

    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    const v=new THREE.Vector3();
    for(let i=0;i<4;i++){
      const cx=corners[i][0], cy=corners[i][1];
      const u=(cx-b.x)/b.w;
      const vv=1-(cy-b.y)/b.h;
      const lx=bb.min.x+u*pw;
      const ly=bb.min.y+vv*ph;
      v.set(lx, ly, 0);
      front.localToWorld(v);
      v.project(camera);
      const sx=(v.x*0.5+0.5)*rect.width+(rect.left-crect.left);
      const sy=(-v.y*0.5+0.5)*rect.height+(rect.top-crect.top);
      if(sx<minX) minX=sx;
      if(sy<minY) minY=sy;
      if(sx>maxX) maxX=sx;
      if(sy>maxY) maxY=sy;
    }

    /* Verberg als box achter camera of te klein/raar */
    if(!isFinite(minX) || maxX-minX<4 || maxY-minY<4){
      hideText3dSelectBox();
      return;
    }

    box.style.display="block";
    box.style.left=minX+"px";
    box.style.top=minY+"px";
    box.style.width=(maxX-minX)+"px";
    box.style.height=(maxY-minY)+"px";
  }catch(_){
    hideText3dSelectBox();
  }
}

function setupThree(){

  const container=document.getElementById("three");
  if(!container || _threeBound) return;
  _threeBound=true;

  /*
    Object (foto/tekst/clipart) → selecteren + slepen; tegel blijft stil.
    Lege ruimte / geen object → 3D-rotatie.
    Touch: 1 vinger op leegte = rotatie, 2 vingers = pinch-zoom.
  */
  let _dblPick={t:0,x:0,y:0,key:null};
  let _spinVelY=0;
  let _spinVelX=0;
  let _lastMoveT=0;
  let _rotMoved=false;

  function designPickKey(o){
    if(!o) return null;
    return o.type+"|"+(o.name||"")+"|"+(o.text||"")+"|"+(o.emoji||"")+"|"+(o.style||"");
  }

  function isDoublePick(e, hit){
    if(!hit) return false;
    const now=performance.now();
    const key=designPickKey(hit);
    const dt=now-_dblPick.t;
    const dist=Math.hypot(e.clientX-_dblPick.x, e.clientY-_dblPick.y);
    /* Mobiel: ~300ms double-tap; max 28px drift zodat sleep ≠ dubbeltik */
    const win=(typeof isMobile==="function" && isMobile())?320:380;
    const maxDist=(typeof isMobile==="function" && isMobile())?28:36;
    if(dt<win && dist<maxDist && key && key===_dblPick.key){
      _dblPick={t:0,x:0,y:0,key:null};
      return true;
    }
    _dblPick={t:now,x:e.clientX,y:e.clientY,key:key};
    return false;
  }

  function startDesignDrag(e, obj){
    if(!obj) return;
    const p=clientToComposition3D(e.clientX, e.clientY);
    text3dDrag={
      mode:"comp",
      ox:obj.x-(p?p.x:0),
      oy:obj.y-(p?p.y:0),
      x:e.clientX,
      y:e.clientY,
      sox:obj.x,
      soy:obj.y
    };
    threeDrag=false;
    _rotMoved=false;
    _spinVelY=0;
    _spinVelX=0;
    try{ e.preventDefault(); e.stopPropagation(); }catch(_){}
    try{ container.setPointerCapture(e.pointerId); }catch(_){}
    container.style.cursor="grabbing";
    updateText3dSelectBox();
  }

  container.addEventListener(
    "pointerdown",
    e=>{
      lastX=e.clientX;
      lastY=e.clientY;

      /* 🔒 Compositie vergrendeld: geen selectie/slepen van lagen, geen rotatie */
      if(tileRotationLocked){
        text3dDrag=null;
        threeDrag=false;
        _lockDragAttempt=true;
        _lockFeedbackShown=false;
        if(selected){
          selected=null;
          layers();
          draw();
          hideText3dSelectBox();
          if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
        }
        return;
      }

      const hit=hitDesign3D(e.clientX, e.clientY);

      /* MOBIEL: alleen DUBBELTIK selecteert foto/tekst; enkele tik = deselect of rotatie */
      if(typeof isMobile==="function" && isMobile()){
        const selectable=hit && (hit.type==="text" || hit.type==="image" || hit.type==="clipart");
        /* Al geselecteerd object: enkele tik erop = slepen (geen nieuwe selectie nodig) */
        if(selected && selectable && (hit===selected || designPickKey(hit)===designPickKey(selected))){
          if(text3dEdit || selected.type==="text" || selected.type==="image" || selected.type==="clipart"){
            startDesignDrag(e, selected);
            return;
          }
        }
        /* Dubbeltik op object → selecteren */
        if(selectable && isDoublePick(e, hit)){
          selected=hit;
          if(typeof layers==="function") layers();
          if(typeof draw==="function") draw();
          if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
          if(typeof updateText3dBar==="function") updateText3dBar();
          if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
          startDesignDrag(e, selected);
          return;
        }
        /* Enkele tik op leegte of ander object → deselecteren */
        if(selected && (!hit || hit!==selected)){
          if(selected.type==="text" && typeof clearTextSelection==="function"){
            clearTextSelection();
          }else{
            selected=null;
            text3dEdit=false;
            if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();
            if(typeof layers==="function") layers();
            if(typeof draw==="function") draw();
            if(typeof updateText3dBar==="function") updateText3dBar();
            if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();
          }
          if(typeof exitMobileTextMoveMode==="function") exitMobileTextMoveMode();
          /* door naar rotatie */
        }
        /* Enkele tik op niet-geselecteerd object: NIET selecteren, wel rotatie */
      }

      /* Mobiele “Tekst verplaatsen”-modus: sleep geselecteerde tekst */
      if(text3dEdit && selected && selected.type==="text"){
        startDesignDrag(e, selected);
        return;
      }

      /*
        3D: object alleen verplaatsen als het AL via LAAG OVERZICHT
        geselecteerd is. Klik op object selecteert NIET automatisch.
        - hit === selected → object-drag (tegel stil)
        - anders → altijd tegel/camera-rotatie
      */
      if(
        hit &&
        selected &&
        isMovableDesignObject(selected) &&
        (hit===selected || designPickKey(hit)===designPickKey(selected))
      ){
        startDesignDrag(e, selected);
        return;
      }

      /* Standaard: 3D-rotatie. Selectie blijft ongewijzigd (alleen via lagenpaneel). */
      text3dDrag=null;
      _lockDragAttempt=false;
      threeDrag=true;
      _rotMoved=false;
      _spinVelY=0;
      _spinVelX=0;
      _lastMoveT=performance.now();
      if(typeof stopAutoRotate==="function") stopAutoRotate();
      try{ container.setPointerCapture(e.pointerId); }catch(_){}
      container.style.cursor="grabbing";
    }
  );

  container.addEventListener(
    "pointermove",
    e=>{
      /* Geblokkeerde draai-poging: feedback pas bij echte beweging */
      if(tileRotationLocked && _lockDragAttempt && !_lockFeedbackShown){
        const dx=e.clientX-lastX;
        const dy=e.clientY-lastY;
        if(Math.abs(dx)+Math.abs(dy)>10){
          _lockFeedbackShown=true;
          if(typeof showTileLockFeedback==="function") showTileLockFeedback();
        }
      }

      if(tileRotationLocked){
        text3dDrag=null;
        threeDrag=false;
      }

      /* Object-drag actief → alleen object bewegen, NOOIT tegelrotatie */
      if(text3dDrag && selected && isMovableDesignObject(selected)){
        threeDrag=false;
        if(e.cancelable) try{ e.preventDefault(); }catch(_){}
        if(selected.type==="image" && typeof clearFitActive==="function") clearFitActive();
        const p=clientToComposition3D(e.clientX, e.clientY);
        if(p && text3dDrag.mode==="comp"){
          selected.x=p.x+text3dDrag.ox;
          selected.y=p.y+text3dDrag.oy;
        }else{
          const c=document.getElementById("three");
          const scale=W/Math.max(180,(c&&c.clientWidth)||400);
          selected.x=text3dDrag.sox+(e.clientX-text3dDrag.x)*scale;
          selected.y=text3dDrag.soy+(e.clientY-text3dDrag.y)*scale;
        }
        if(!_text3dDragRaf){
          _text3dDragRaf=requestAnimationFrame(function(){
            _text3dDragRaf=0;
            draw();
            liveUpdateFrontTexture();
            updateText3dSelectBox();
          });
        }
        return;
      }

      if(!threeDrag || !model || text3dEdit || tileRotationLocked || text3dDrag)
        return;

      /* Voorkom page-scroll tijdens touch-rotatie */
      if(e.cancelable && (e.pointerType==="touch" || e.pointerType==="pen")){
        e.preventDefault();
      }

      /* Handmatig draaien stopt de draaishow */
      if(typeof autoRotate!=="undefined" && autoRotate && typeof stopAutoRotate==="function") stopAutoRotate();

      const now=performance.now();
      const dt=Math.max(8, now-_lastMoveT);
      const dx=e.clientX-lastX;
      const dy=e.clientY-lastY;
      lastX=e.clientX;
      lastY=e.clientY;
      _lastMoveT=now;

      /* Touch iets gevoeliger; desktop blijft precies */
      const sens=e.pointerType==="touch"?0.012:0.008;
      const sensX=e.pointerType==="touch"?0.009:0.006;
      ry+=dx*sens;
      rx+=dy*sensX;
      rx=Math.max(-1.15, Math.min(1.15, rx));
      model.rotation.x=rx;
      model.rotation.y=ry;

      /* Snelheid voor lichte inertia na loslaten */
      _spinVelY=(dx*sens)/(dt/16);
      _spinVelX=(dy*sensX)/(dt/16);
      if(Math.abs(dx)+Math.abs(dy)>2) _rotMoved=true;

      if(selected && isMovableDesignObject(selected)) updateText3dSelectBox();
    },
    {passive:false}
  );

  container.addEventListener(
    "pointermove",
    e=>{
      if(text3dDrag || threeDrag || isMobile()) return;
      const hit=hitDesign3D(e.clientX, e.clientY);
      container.style.cursor=hit?"grab":"";
    },
    {passive:true}
  );

  container.addEventListener(
    "pointerup",
    e=>{
      if(text3dDrag){
        if(_text3dDragRaf){
          cancelAnimationFrame(_text3dDragRaf);
          _text3dDragRaf=0;
        }
        text3dDrag=null;
        saveHistory();
        draw();
        liveUpdateFrontTexture();
        if(typeof refresh3D==="function") refresh3D();
        updateText3dSelectBox();
        _spinVelY=0;
        _spinVelX=0;
      }

      /* Alleen inertia na echte sleep-rotatie (niet na tik) */
      if(!threeDrag || !_rotMoved){
        _spinVelY=0;
        _spinVelX=0;
      }else{
        /* Begrens fling zodat het rustig uitloopt */
        _spinVelY=Math.max(-0.35, Math.min(0.35, _spinVelY));
        _spinVelX=Math.max(-0.2, Math.min(0.2, _spinVelX));
      }

      threeDrag=false;
      _rotMoved=false;
      _lockDragAttempt=false;
      _lockFeedbackShown=false;
      container.style.cursor="";

      try{
        container.releasePointerCapture(e.pointerId);
      }catch(_){}
    }
  );

  container.addEventListener(
    "pointercancel",
    ()=>{
      text3dDrag=null;
      threeDrag=false;
      _rotMoved=false;
      _spinVelY=0;
      _spinVelX=0;
      _lockDragAttempt=false;
      _lockFeedbackShown=false;
      container.style.cursor="";
    }
  );

  /* Inertia-spin na touch/muis-loslaten (alleen handmatige rotatie) */
  function applySpinInertia(){
    if(threeDrag || text3dDrag || tileRotationLocked) return;
    if(typeof autoRotate!=="undefined" && autoRotate) return;
    if(Math.abs(_spinVelY)<0.0004 && Math.abs(_spinVelX)<0.0004){
      _spinVelY=0;
      _spinVelX=0;
      return;
    }
    ry+=_spinVelY;
    rx+=_spinVelX;
    rx=Math.max(-1.15, Math.min(1.15, rx));
    _spinVelY*=0.94;
    _spinVelX*=0.94;
  }
  /* Hook in bestaande animate-loop via globale callback */
  window._threeSpinInertia=applySpinInertia;


  /*
    MOUSE WHEEL ZOOM
  */

  container.addEventListener(
    "wheel",
    e=>{

      e.preventDefault();

      distance+=
        e.deltaY*.004;

      distance=
        Math.max(
          3.4,
          Math.min(
            11,
            distance
          )
        );

      camera.position.z=
        distance;

    },
    {
      passive:false
    }
  );


  /*
    PINCH ZOOM — of tekstgrootte bij Tekst-verplaatsmodus
  */

  let pinchDistance=null;
  let textPinchStartSize=null;

  container.addEventListener(
    "touchstart",
    e=>{

      if(
        e.touches.length===2
      ){

        const dx=
          e.touches[0].clientX-
          e.touches[1].clientX;

        const dy=
          e.touches[0].clientY-
          e.touches[1].clientY;

        pinchDistance=
          Math.sqrt(
            dx*dx+
            dy*dy
          );

        /* Tekst-verplaatsmodus: pinch = font size, geen drag */
        if(text3dEdit && selected && selected.type==="text"){
          text3dDrag=null;
          threeDrag=false;
          textPinchStartSize=selected.size||72;
          try{ e.preventDefault(); }catch(_){}
        }else{
          textPinchStartSize=null;
        }

      }

    },
    {
      passive:false
    }
  );


  container.addEventListener(
    "touchmove",
    e=>{

      if(
        e.touches.length!==2 ||
        pinchDistance===null
      )
        return;

      e.preventDefault();

      const dx=
        e.touches[0].clientX-
        e.touches[1].clientX;

      const dy=
        e.touches[0].clientY-
        e.touches[1].clientY;

      const current=
        Math.sqrt(
          dx*dx+
          dy*dy
        );

      /* Mobiel + tekst-verplaatsmodus: pinch schaalt alleen de tekst */
      if(text3dEdit && selected && selected.type==="text" && textPinchStartSize!=null && pinchDistance>0){
        text3dDrag=null;
        const ratio=current/pinchDistance;
        const next=Math.round(Math.max(12, Math.min(300, textPinchStartSize*ratio)));
        if(next!==selected.size){
          selected.size=next;
          if(typeof draw==="function") draw();
          if(typeof refresh3D==="function") refresh3D();
          if(typeof updateText3dSelectBox==="function") updateText3dSelectBox();
        }
        return;
      }

      distance-=
        (
          current-
          pinchDistance
        )*.006;

      distance=
        Math.max(
          3.4,
          Math.min(
            11,
            distance
          )
        );

      camera.position.z=
        distance;

      pinchDistance=
        current;

    },
    {
      passive:false
    }
  );


  container.addEventListener(
    "touchend",
    ()=>{
      pinchDistance=null;
      textPinchStartSize=null;
    }
  );

}


/* =========================================================
   RESIZE
========================================================= */

function resize3D(){

  if(!renderer)
    return;

  const container=
    document.getElementById("three");

  const width=
    container.clientWidth;

  const height=
    container.clientHeight;

  if(
    !width ||
    !height
  )
    return;

  camera.aspect=
    width/height;

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height,
    false
  );

}

window.addEventListener(
  "resize",
  resize3D
);


/* =========================================================
   ANIMATION
========================================================= */

let autoRotate=false;
const AUTO_ROTATE_SPEED=0.0065; /* langzaam, vloeiend */

function toggleAutoRotate(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  /* Start altijd vanuit 3D */
  if(typeof setView==="function"){
    const c3=document.getElementById("three");
    if(!c3 || c3.style.display==="none" || getComputedStyle(c3).display==="none"){
      setView("3d");
    }
  }
  autoRotate=!autoRotate;
  const btn=document.getElementById("btnAutoRotate");
  if(btn){
    btn.classList.toggle("active", autoRotate);
    btn.setAttribute("aria-pressed", autoRotate?"true":"false");
    btn.textContent=autoRotate?"⏸ Draaishow":"▶ Draaishow";
  }
  const btnM=document.getElementById("btnAutoRotateMobile");
  if(btnM){
    btnM.classList.toggle("active", autoRotate);
    btnM.setAttribute("aria-pressed", autoRotate?"true":"false");
    btnM.textContent=autoRotate?"⏸":"↻";
  }
  if(autoRotate){
    threeDrag=false;
    text3dDrag=null;
  }
}

function stopAutoRotate(){
  if(!autoRotate) return;
  autoRotate=false;
  const btn=document.getElementById("btnAutoRotate");
  if(btn){
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed","false");
    btn.textContent="▶ Draaishow";
  }
  const btnM=document.getElementById("btnAutoRotateMobile");
  if(btnM){
    btnM.classList.remove("active");
    btnM.setAttribute("aria-pressed","false");
    btnM.textContent="↻";
  }
}

function animate(){

  requestAnimationFrame(
    animate
  );

  /*
    Geen rebuild.
    Alleen renderen van de bestaande scene.
  */

  if(model){
    if(autoRotate && !threeDrag && !text3dDrag){
      ry+=AUTO_ROTATE_SPEED;
    }else if(typeof window._threeSpinInertia==="function"){
      window._threeSpinInertia();
    }
    model.rotation.x=rx;
    model.rotation.y=ry;
  }

  if(turntable){
    turntable.rotation.x=rx;
    turntable.rotation.y=ry;
  }

  if(renderer){

    renderer.render(
      scene,
      camera
    );

  }

}


/* =========================================================
   VIEW
========================================================= */

function setView(view){

  const canvas2d=
    document.getElementById(
      "editorCanvas"
    );

  const canvas3d=
    document.getElementById(
      "three"
    );

  const b2=
    document.getElementById(
      "view2d"
    );

  const b3=
    document.getElementById(
      "view3d"
    );

  const help=
    document.getElementById(
      "help"
    );

  if(view==="3d"){

    /*
      NOOIT display:none op de editor-canvas.
      Browsers (esp. mobile Safari) wissen of bevriezen
      de canvas-bitmap bij display:none → witte 3D-texture.
      visibility:hidden behoudt de pixelbuffer en layout.
    */
    canvas2d.style.visibility="hidden";
    canvas2d.style.pointerEvents="none";
    canvas2d.style.display="block";

    canvas3d.style.display=
      "block";

    if(b2) b2.classList.remove("active");
    if(b3) b3.classList.add("active");
    document.querySelectorAll(".badge-view-switch .bv-2d").forEach(function(b){ b.classList.remove("active"); });
    document.querySelectorAll(".badge-view-switch .bv-3d").forEach(function(b){ b.classList.add("active"); });

    help.style.display=
      "block";

    document.body.classList.add("view-3d-active");
    /* Draaishow-knop blijft beschikbaar */

    /*
      3D start altijd zonder selectie:
      gebruiker bekijkt/draait de tegel eerst;
      selectie pas via dubbelklik / dubbeltik.
    */
    selected=null;
    text3dDrag=null;
    threeDrag=false;
    if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();
    if(typeof layers==="function") layers();
    if(typeof updateWorkspaceControlsState==="function") updateWorkspaceControlsState();

    /*
      Alleen bij het openen van 3D
      opnieuw opbouwen.
      Op mobiel iets verder uitgezoomd starten.
    */

    /* Mobiel: dichterbij = grotere tegel, nog steeds volledig in beeld */
    /* Mobiel: verder uit + minder naar beneden kijken → draaischijf volledig zichtbaar */
    if(typeof isMobile==="function" && isMobile()){
      distance=6.6;
      if(typeof rx==="number") rx=Math.max(rx, -0.08);
    }else{
      distance=7.2;
    }

    if(!threeReady)
      initThree();

    camera.position.z=
      distance;

    resize3D();

    rebuild3D();

    updateHelp();
    if(typeof updateText3dBar==="function") updateText3dBar();
    if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();

  }else{

    if(typeof stopAutoRotate==="function") stopAutoRotate();
    if(typeof hideText3dSelectBox==="function") hideText3dSelectBox();

    canvas2d.style.visibility="visible";
    canvas2d.style.pointerEvents="auto";
    canvas2d.style.display=
      "block";

    canvas3d.style.display=
      "none";

    if(b2) b2.classList.add("active");
    if(b3) b3.classList.remove("active");
    document.querySelectorAll(".badge-view-switch .bv-2d").forEach(function(b){ b.classList.add("active"); });
    document.querySelectorAll(".badge-view-switch .bv-3d").forEach(function(b){ b.classList.remove("active"); });

    document.body.classList.remove("view-3d-active");

    help.style.display=
      "none";

    text3dEdit=false;
    if(typeof updateText3dBar==="function") updateText3dBar();

  }

}


/* =========================================================
   HELP
========================================================= */

function updateHelp(){

  const help=
    document.getElementById(
      "help"
    );
  if(!help) return;

  const mobile=typeof isMobile==="function" && isMobile();
  const selectHint=mobile
    ?"Dubbeltik voor selecteren"
    :"Dubbelklik voor selecteren";

  if(product==="tile"){
    help.textContent=mobile
      ?(selectHint+" · 👆 Sleep om te draaien · 🔍 Knijp om te zoomen")
      :(selectHint+" · 🖱 Sleep om te draaien · 🔍 Scroll om te zoomen");
    return;
  }

  if(product==="mug"){
    help.textContent="☕ Draai de mok om je ontwerp rondom te bekijken · "+selectHint;
    return;
  }

  if(product==="coaster"){
    help.textContent="◯ Draai en zoom de onderzetter · "+selectHint;
    return;
  }

  if(product==="mouse"){
    help.textContent="🖱️ Draai en zoom de muismat · "+selectHint;
    return;
  }

  if(product==="aluminium"){
    help.textContent="▭ Draai en zoom het paneel · "+selectHint;
    return;
  }

  help.textContent=selectHint;

}


/* =========================================================
   3D REFRESH
========================================================= */

let _refresh3dTimer=null;
function scheduleRefresh3D(delay){
  if(_refresh3dTimer) clearTimeout(_refresh3dTimer);
  _refresh3dTimer=setTimeout(()=>{
    _refresh3dTimer=null;
    refresh3D();
  }, Math.max(40, delay||80));
}

function refresh3D(){

  const container=
    document.getElementById(
      "three"
    );

  /*
    Alleen rebuilden als 3D daadwerkelijk
    zichtbaar is.

    Nooit tijdens het draaien.
  */

  if(
    threeReady &&
    container &&
    container.style.display!=="none"
  ){

    rebuild3D();

  }

}


/* =========================================================
   CART
========================================================= */

function addCart(){

  cart+=qty;

  document
    .getElementById(
      "cartCount"
    )
    .textContent=cart;

  toast(
    `${qty}× ${products[product].name} toegevoegd`
  );

}


/* =========================================================
   SAVE
========================================================= */

function saveDesign(){

  const data={

    product,

    size,

    tileOrientation,

    finish,

    edge,

    qty,

    coasterVariant,

    /* Muismat: size-key is de variant (Standaard / XL); expliciet meegenomen voor backward compat */
    variant: product === "mouse" ? size : (product === "coaster" ? coasterVariant : null),

    objects:
      serialiseObjects()

  };

  localStorage.setItem(
    "labprintNL-v43",
    JSON.stringify(data)
  );

  toast(
    "Ontwerp opgeslagen"
  );

}


/* =========================================================
   TOOLBAR VERPLAATSEN / VERBERGEN (desktop)
========================================================= */

let _tbDrag=null;

function closeMainToolbar(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  if(typeof isMobile==="function" && isMobile()) return;
  document.body.classList.add("toolbar-hidden");
  const tb=document.getElementById("mainToolbar");
  if(tb){
    tb.dataset.wasFloating=tb.classList.contains("floating")?"1":"0";
    if(tb.classList.contains("floating")){
      tb.dataset.floatLeft=tb.style.left||"";
      tb.dataset.floatTop=tb.style.top||"";
    }
    tb.classList.remove("floating");
    tb.style.left="";
    tb.style.top="";
    const main=document.querySelector(".main");
    if(main && tb.parentElement===document.body){
      const leftEl=document.getElementById("left");
      if(leftEl) main.insertBefore(tb, leftEl);
      else main.insertBefore(tb, main.firstChild);
    }
  }
  document.body.classList.remove("toolbar-floating");
  const re=document.getElementById("toolbarReopen");
  if(re) re.hidden=false;
}

function openMainToolbar(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  document.body.classList.remove("toolbar-hidden");
  const tb=document.getElementById("mainToolbar");
  const re=document.getElementById("toolbarReopen");
  if(re) re.hidden=true;
  if(!tb) return;
  if(tb.dataset.wasFloating==="1"){
    if(tb.parentElement!==document.body) document.body.appendChild(tb);
    tb.classList.add("floating");
    document.body.classList.add("toolbar-floating");
    if(tb.dataset.floatLeft) tb.style.left=tb.dataset.floatLeft;
    if(tb.dataset.floatTop) tb.style.top=tb.dataset.floatTop;
  }else{
    document.body.classList.remove("toolbar-floating");
    tb.classList.remove("floating");
    tb.style.left="";
    tb.style.top="";
    const main=document.querySelector(".main");
    if(main && tb.parentElement!==main){
      const leftEl=document.getElementById("left");
      if(leftEl) main.insertBefore(tb, leftEl);
      else main.insertBefore(tb, main.firstChild);
    }
  }
}

function initToolbarDrag(){
  /* Handje verwijderd — toolbar is vast, niet versleepbaar */
  return;
  const grip=document.getElementById("toolbarGrip");
  const tb=document.getElementById("mainToolbar");
  if(!grip || !tb) return;
  if(grip.dataset.dragBound==="1") return;
  grip.dataset.dragBound="1";

  const onDown=(e)=>{
    if(typeof isMobile==="function" && isMobile()) return;
    if(e.button!==undefined && e.button!==0) return;
    e.preventDefault();
    e.stopPropagation();
    const rect=tb.getBoundingClientRect();
    if(!tb.classList.contains("floating")){
      /* Uit .main → op body: kan layout/preview NOOIT meer beïnvloeden */
      tb.classList.add("floating");
      tb.style.position="fixed";
      tb.style.left=rect.left+"px";
      tb.style.top=rect.top+"px";
      tb.style.bottom="auto";
      tb.style.right="auto";
      tb.style.margin="0";
      tb.style.zIndex="120";
      if(tb.parentElement!==document.body) document.body.appendChild(tb);
      document.body.classList.add("toolbar-floating");
    }
    _tbDrag={
      ox:e.clientX-(parseFloat(tb.style.left)||rect.left),
      oy:e.clientY-(parseFloat(tb.style.top)||rect.top),
      pid:e.pointerId
    };
    try{ grip.setPointerCapture(e.pointerId); }catch(_){}
    grip.style.cursor="grabbing";
  };

  const clampToolbarPos=(nx, ny)=>{
    const w=tb.offsetWidth||68;
    const h=tb.offsetHeight||320;
    const headerEl=document.querySelector("header");
    const headerH=headerEl ? headerEl.getBoundingClientRect().bottom : 52;
    const tpl=document.getElementById("templateBar");
    let bottomLimit=window.innerHeight;
    if(tpl && !tpl.classList.contains("is-collapsed") && tpl.offsetParent!==null){
      const tr=tpl.getBoundingClientRect();
      if(tr.top>0) bottomLimit=Math.min(bottomLimit, tr.top);
    }
    /* Minimaal de grip (bovenkant paneel) blijft bereikbaar */
    const minVisible=36;
    const maxLeft=Math.max(4, window.innerWidth-Math.min(w, minVisible)-4);
    const maxTop=Math.max(headerH+4, bottomLimit-Math.min(h, minVisible)-4);
    const minLeft=4;
    const minTop=headerH+4;
    return {
      x: Math.max(minLeft, Math.min(maxLeft, nx)),
      y: Math.max(minTop, Math.min(maxTop, ny))
    };
  };

  const onMove=(e)=>{
    if(!_tbDrag) return;
    e.preventDefault();
    e.stopPropagation();
    let nx=e.clientX-_tbDrag.ox;
    let ny=e.clientY-_tbDrag.oy;
    const p=clampToolbarPos(nx, ny);
    tb.style.left=p.x+"px";
    tb.style.top=p.y+"px";
  };

  const onUp=(e)=>{
    if(!_tbDrag) return;
    _tbDrag=null;
    grip.style.cursor="grab";
    if(tb.classList.contains("floating")){
      const p=clampToolbarPos(parseFloat(tb.style.left)||0, parseFloat(tb.style.top)||0);
      tb.style.left=p.x+"px";
      tb.style.top=p.y+"px";
      tb.dataset.floatLeft=p.x+"px";
      tb.dataset.floatTop=p.y+"px";
    }
  };

  const reclampFloating=()=>{
    if(!tb.classList.contains("floating")) return;
    const p=clampToolbarPos(parseFloat(tb.style.left)||0, parseFloat(tb.style.top)||0);
    tb.style.left=p.x+"px";
    tb.style.top=p.y+"px";
  };

  grip.addEventListener("pointerdown", onDown, {passive:false});
  window.addEventListener("pointermove", onMove, {passive:false});
  window.addEventListener("pointerup", onUp, {passive:true});
  window.addEventListener("pointercancel", onUp, {passive:true});
  window.addEventListener("resize", reclampFloating, {passive:true});
}

/* =========================================================
   START
========================================================= */

renderSizes();

updatePrice();
if(typeof syncProductCard==="function") syncProductCard();

tool(
  "photo",
  document.querySelector(
    ".tool"
  )
);

setupKeyboardGuard();

draw();

saveHistory();

if(typeof renderTemplateStrip==="function") renderTemplateStrip();
if(typeof renderTemplateCats==="function") renderTemplateCats();

/* =========================================================
   DESKTOP TOOLS DOCK — anker + verticale tools als één blok
========================================================= */
let _fabDrag=null;

function initDesktopMenuFabDrag(){
  /* Desktop mid-☰ is vast gepositioneerd — niet versleepbaar */
  const dock=document.getElementById("desktopToolsDock");
  const fab=document.getElementById("desktopMenuFab");
  if(dock){
    dock.classList.remove("floating");
    dock.style.left="";
    dock.style.top="";
    dock.style.right="";
    dock.style.bottom="";
    dock.style.position="";
    dock.style.transform="";
  }
  if(fab){
    fab.style.cursor="pointer";
    fab.title="Laagmenu";
    if(!fab.getAttribute("onclick")) fab.setAttribute("onclick","toggleLayerMenu(event)");
  }
  return;
  if(!dock || !fab || dock.dataset.dragBound==="1") return;
  dock.dataset.dragBound="1";
  const THRESH=6;

  const onDown=(e)=>{
    if(typeof isMobile==="function" && isMobile()) return;
    if(e.button!==undefined && e.button!==0) return;
    /* Alleen sleep starten vanaf anker; tool-knoppen behouden klik */
    if(e.target.closest(".workspace-controls button")) return;
    if(e.target!==fab && !fab.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    const rect=dock.getBoundingClientRect();
    _fabDrag={
      startX:e.clientX,
      startY:e.clientY,
      ox:e.clientX-rect.left,
      oy:e.clientY-rect.top,
      moved:false,
      pid:e.pointerId
    };
    try{ fab.setPointerCapture(e.pointerId); }catch(_){}
  };

  const onMove=(e)=>{
    if(!_fabDrag) return;
    e.preventDefault();
    e.stopPropagation();
    const dx=e.clientX-_fabDrag.startX;
    const dy=e.clientY-_fabDrag.startY;
    if(!_fabDrag.moved && (Math.abs(dx)>THRESH || Math.abs(dy)>THRESH)){
      _fabDrag.moved=true;
      const rect=dock.getBoundingClientRect();
      dock.classList.add("floating");
      dock.style.position="fixed";
      dock.style.left=rect.left+"px";
      dock.style.top=rect.top+"px";
      dock.style.right="auto";
      dock.style.bottom="auto";
      dock.style.margin="0";
      dock.style.zIndex="130";
      /* Buiten layout → preview beweegt niet mee */
      if(dock.parentElement!==document.body) document.body.appendChild(dock);
    }
    if(!_fabDrag.moved) return;
    const w=dock.offsetWidth||48;
    const h=dock.offsetHeight||48;
    const headerEl=document.querySelector("header");
    const headerH=headerEl ? headerEl.getBoundingClientRect().bottom : 52;
    const tpl=document.getElementById("templateBar");
    let bottomLimit=window.innerHeight;
    if(tpl && !tpl.classList.contains("is-collapsed") && tpl.offsetParent!==null){
      const tr=tpl.getBoundingClientRect();
      if(tr.top>0) bottomLimit=Math.min(bottomLimit, tr.top);
    }
    const minVisible=28;
    let nx=e.clientX-_fabDrag.ox;
    let ny=e.clientY-_fabDrag.oy;
    nx=Math.max(4, Math.min(Math.max(4, window.innerWidth-Math.min(w, minVisible)-4), nx));
    ny=Math.max(headerH+4, Math.min(Math.max(headerH+4, bottomLimit-Math.min(h, minVisible)-4), ny));
    dock.style.left=nx+"px";
    dock.style.top=ny+"px";
  };

  const onUp=(e)=>{
    if(!_fabDrag) return;
    const wasMoved=_fabDrag.moved;
    _fabDrag=null;
    fab.style.cursor="grab";
    if(!wasMoved){
      if(typeof toggleLayerMenu==="function") toggleLayerMenu(e||event);
    }
  };

  fab.addEventListener("pointerdown", onDown, {passive:false});
  window.addEventListener("pointermove", onMove, {passive:false});
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
}

function syncDesktopMenuDockToTemplateBar(){
  if(typeof isMobile==="function" && isMobile()) return;
  const dock=document.getElementById("desktopToolsDock");
  const bottomCtrl=document.getElementById("bottomControls");
  const bar=document.getElementById("templateBar");
  const collapsed=!bar || bar.classList.contains("is-collapsed") || bar.offsetParent===null;
  if(collapsed){
    if(dock) dock.style.bottom="14px";
    if(bottomCtrl) bottomCtrl.style.bottom="16px";
    return;
  }
  requestAnimationFrame(function(){
    const h=bar.offsetHeight||0;
    const margin=10;
    const bottom=Math.max(14, Math.round(h+margin));
    const maxBottom=Math.max(14, window.innerHeight-80);
    const b=Math.min(bottom, maxBottom)+"px";
    if(dock) dock.style.bottom=b;
    if(bottomCtrl) bottomCtrl.style.bottom=b;
  });
}
if(typeof window!=="undefined"){
  window.addEventListener("resize", function(){
    if(typeof syncDesktopMenuDockToTemplateBar==="function") syncDesktopMenuDockToTemplateBar();
  }, {passive:true});
}

function toggleTemplateBar(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  if(typeof isMobile==="function" && isMobile()) return;
  const bar=document.getElementById("templateBar");
  const fab=document.getElementById("templateFab");
  const btn=document.getElementById("templateCollapseBtn");
  if(!bar) return;
  const collapsed=bar.classList.toggle("is-collapsed");
  if(fab){
    if(collapsed) fab.removeAttribute("hidden");
    else fab.setAttribute("hidden","");
  }
  if(btn){
    btn.setAttribute("aria-expanded", collapsed?"false":"true");
    btn.title=collapsed?"Sjablonen openen":"Sjablonen inklappen";
    btn.setAttribute("aria-label", btn.title);
  }
  if(typeof syncDesktopMenuDockToTemplateBar==="function"){
    syncDesktopMenuDockToTemplateBar();
  }
  /* Geen resize3D / draw — preview blijft staan */
}

function togglePurchaseBar(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  if(typeof isMobile==="function" && isMobile()) return;
  const bar=document.getElementById("purchaseBar");
  const fab=document.getElementById("purchaseFab");
  const btn=document.getElementById("purchaseCollapseBtn");
  if(!bar) return;
  const collapsed=bar.classList.toggle("is-collapsed");
  if(fab){
    if(collapsed){
      const total=document.getElementById("total");
      const priceEl=document.getElementById("purchaseFabPrice");
      if(priceEl && total) priceEl.textContent=total.textContent.trim();
      fab.removeAttribute("hidden");
    }else{
      fab.setAttribute("hidden","");
    }
  }
  if(btn){
    btn.setAttribute("aria-expanded", collapsed?"false":"true");
    btn.title=collapsed?"Winkelwagen openen":"Winkelwagen inklappen";
    btn.setAttribute("aria-label", btn.title);
  }
  /* Geen preview-shift */
}

/* Houd compacte winkelwagenprijs synchroon met totaal */
(function syncPurchaseFabPrice(){
  const total=document.getElementById("total");
  if(!total || typeof MutationObserver==="undefined") return;
  const priceEl=document.getElementById("purchaseFabPrice");
  if(!priceEl) return;
  const update=()=>{ priceEl.textContent=total.textContent.trim(); };
  update();
  new MutationObserver(update).observe(total,{childList:true,characterData:true,subtree:true});
})();


initToolbarDrag();
initDesktopMenuFabDrag();
if(typeof syncDesktopMenuDockToTemplateBar==="function") syncDesktopMenuDockToTemplateBar();

