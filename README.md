# Dienstreiseplaner+ Pilot (LK Gifhorn)

Öffentliche Pilotversion: Planung, Erstattung, PDF-Ausgabe (Antrag & Abrechnung).
Keine Speicherung personenbezogener Daten.

**Hosting:** Cloudflare Pages + Functions  
**Frontend:** statisch (HTML/CSS/JS)  
**API:** `/api/plan` (Demo; später OSRM/OCM)

## Ordner
- `public/` – statische Dateien (index.html, styles.css, app.js)
- `public/templates/` – PDF-Vorlagen (genehmigung.pdf, abrechnung.pdf)
- `public/vendor/` – Bibliotheken (pdf-lib.min.js)
- `functions/` – Pages Functions (API, Security-Headers)

## Erste Schritte
1. Dateien in GitHub hochladen (oder Repo clonen).
2. In `public/templates/` die beiden PDFs ablegen: `genehmigung.pdf`, `abrechnung.pdf`.
3. In `public/vendor/` `pdf-lib.min.js` ablegen (lokal, kein CDN).
4. Cloudflare Pages: Build = None, Output = `public` → Deploy.

## Nächste Schritte
- AcroForm-Befüllung statt Koordinaten
- OSRM/OCM integrieren
- KI-Eingabehilfe aktivieren
