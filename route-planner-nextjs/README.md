# Route Planner

Eine Route-Planner-Webseite mit Next.js, Prisma und SQLite.

## Voraussetzungen

- Node.js 20 oder neuer
- npm

## Lokal starten

Repository klonen und in das Next.js-Projekt wechseln:

```bash
git clone https://github.com/10U1S/routeplanner.git
cd routeplanner/route-planner-nextjs
```

Abhaengigkeiten installieren:

```bash
npm ci
```

`npm ci` erzeugt automatisch den benoetigten Prisma-Client. Eine bereits
befuellte SQLite-Datenbank ist im Repository enthalten, damit die Webseite
direkt denselben Beispieldatenbestand anzeigt.

Entwicklungsserver starten:

```bash
npm run dev
```

Danach [http://localhost:3000](http://localhost:3000) oeffnen.

## Datenbank neu aufsetzen

Falls die lokale Datenbank fehlt oder neu erstellt werden soll:

```bash
npm run db:setup
```

Der Befehl spielt die Migrationen ein und legt die Beispielrouten neu an.

## Produktions-Build

```bash
npm run build
npm start
```
