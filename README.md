# PrintLabNL Configurator — Deploy package

Deze map bevat alles wat je nodig hebt om de Designstudio te hosten op je Strato-subdomein en te koppelen aan Shopify.

## Bestanden

```
printlabnl-configurator/
├── index.html          ← hoofdbestand (open dit)
├── css/
│   └── styles.css      ← alle styling
├── js/
│   └── app.js          ← alle logica + Three.js compositie
└── README.md           ← dit bestand
```

## 1. Uploaden naar Strato

1. Log in op **Strato Klantenlogin** → **Bestandsbeheer** (of gebruik FileZilla / SFTP).
2. Ga naar de map van je **subdomein** (bijv. `configurator.jouwdomein.nl` of de map die Strato daarvoor heeft aangemaakt).
3. Upload de **inhoud** van deze map:
   - `index.html` in de root van het subdomein
   - map `css/` met `styles.css`
   - map `js/` met `app.js`
4. Zorg dat **HTTPS** actief is (Strato → SSL / Let's Encrypt). Moderne browsers eisen dit voor canvas, camera (niet gebruikt) en localStorage over Shopify.

Na upload is de configurator bereikbaar op:
`https://jouw-subdomein.strato.nl` (of jouw eigen subdomein)

## 2. Testen

Open de URL op desktop én mobiel. Controleer:

- [ ] 2D-canvas werkt
- [ ] 3D-preview (Three.js) laadt
- [ ] Foto uploaden / tekst / clipart
- [ ] Lagen, opacity, volgorde
- [ ] Prijs update
- [ ] Opslaan (localStorage)
- [ ] Geen console-fouten (F12)

## 3. Koppelen aan Shopify

### Optie A — Eenvoudig: iframe op een Shopify-pagina (aanbevolen om te starten)

1. In Shopify Admin → **Online Store → Pages → Add page**.
2. Titel bijv. "Designstudio" of "Maak je eigen tegel".
3. In de editor kies **Show HTML** (of `< >`).
4. Plak:

```html
<div style="position:relative;width:100%;height:90vh;min-height:700px;">
  <iframe
    src="https://JOUW-SUBDOMEIN.nl"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;"
    allow="fullscreen"
    loading="lazy"
    title="PrintLabNL Designstudio">
  </iframe>
</div>
```

5. Sla op en publiceer de pagina.
6. Link ernaar vanaf productpagina's of menu.

**Let op:** Shopify's Content Security Policy kan in zeldzame gevallen iframes van externe domeinen beperken. Meestal werkt het gewoon. Test in een incognito-venster.

### Optie B — Directe link vanaf product

Op de productpagina van een tegel een knop "Ontwerp zelf" die naar `https://jouw-subdomein.nl` verwijst.  
Handig + geen iframe-problemen.

### Optie C — Volledige winkelwagen-integratie (later)

De huidige "In winkelwagen"-knop is nog **UI-only**. Om écht naar de Shopify-cart te sturen heb je nodig:

1. Een (custom) product in Shopify met line-item properties voor het ontwerp.
2. Of Shopify Cart Ajax API / Storefront API.
3. Aanpassing in `js/app.js` van de cart-functie zodat die een POST doet naar `/cart/add.js` met o.a.:
   - `id` = variant_id
   - `quantity`
   - `properties` = { Design: data-url of design-id, Formaat, Afwerking, ... }

Dit kan in een volgende stap worden gebouwd zodra de basis live staat.

## 4. Extra tips voor Strato

- Zet in de map een `.htaccess` (Apache) als je force-HTTPS of caching wilt:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Caching voor CSS/JS
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
</IfModule>
```

- Bestandsrechten: mappen 755, bestanden 644.
- Geen PHP nodig — pure static hosting.

## 5. Updates later

Wanneer je de configurator aanpast:

1. Bewerk lokaal (of via deze map).
2. Upload alleen de gewijzigde bestanden (`index.html`, `css/styles.css` of `js/app.js`).
3. Hard-refresh in de browser (Ctrl+F5) om cache te omzeilen.

---

**Huidige status:**  
De configurator is volledig zelfstandig. Geen backend of database nodig voor ontwerpen (die gaan in localStorage van de bezoeker).  
Shopify-koppeling voor echte orders volgt in een volgende fase.
