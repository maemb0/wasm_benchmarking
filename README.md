# WebAssembly Benchmark

Wir vergleichen, wie schnell rechenintensive Funktionen in
WebAssembly (C, AssemblyScript, Python) im Vergleich zu JavaScript im Browser laufen.

## Schnellstart

**Voraussetzungen:** [Git](https://git-scm.com/) und [Docker Desktop](https://www.docker.com/products/docker-desktop/) (muss gestartet sein, Status „Engine running“).
Node.js, Emscripten und AssemblyScript sind im Container enthalten, es muss nichts weiter installiert werden.

```bash
git clone https://github.com/DEIN-USERNAME/wasm-benchmark.git
cd wasm-benchmark
docker compose up --build
```

1. Im Browser **http://localhost:5173** öffnen
2. Auf **„Benchmark starten“** klicken
3. Warten, bis beide Tabellen gefüllt sind (ca. 1–2 Minuten, Python braucht am längsten)

Beenden mit `Strg + C` und anschließend:

```bash
docker compose down
```

> **Hinweis:** Beim ersten Start lädt der Browser den Python-Interpreter (Pyodide, ca. 10 MB) aus dem Internet.

## Was wurde gemacht

1. **Drei rechenintensive Funktionen** ausgewählt, die unterschiedliche Stärken testen (Schleifen, Speicherzugriffe, Gleitkomma- und Ganzzahl-Arithmetik).
2. Jede Funktion **in vier Sprachen identisch implementiert**: JavaScript als Referenz, C und AssemblyScript kompiliert zu WebAssembly, Python über Pyodide.
3. Eine **Benchmark-Webseite** gebaut, die alle Varianten im Browser ausführt, die Zeiten misst und mit JavaScript vergleicht.
4. Die gesamte Entwicklungsumgebung in einen **Docker-Container** gepackt, damit das Projekt auf jedem Rechner ohne Installation läuft.

## Aufgaben

| Funktion | Beschreibung | Größe | Erwartetes Ergebnis |
| --- | --- | --- | --- |
| Primzahl-Sieb | Sieb des Eratosthenes – zählt alle Primzahlen bis n | n = 10.000.000 | 664.579 |
| Matrixmultiplikation | Multipliziert zwei n×n-Matrizen, gibt die Summe aller Elemente zurück | 300 × 300 | 443.475.000 |
| Monte-Carlo-π | Schätzt π mit Zufallspunkten im Einheitsquadrat | 10.000.000 Punkte | 3,141768 |

Damit die Ergebnisse vergleichbar sind:
- Die Matrizen werden mit einem **festen Muster** gefüllt statt mit Zufallswerten.
- Monte-Carlo-π nutzt einen **eigenen Zufallsgenerator** (Park-Miller) statt `Math.random()`. So erzeugen alle Sprachen exakt dieselbe Zahlenfolge, und das Ergebnis ist überprüfbar.

## Sprachen

| Sprache | Wie läuft sie im Browser? |
| --- | --- |
| **JavaScript** | direkt in der JS-Engine des Browsers, Referenz |
| **C** | mit Emscripten (`emcc -O3`) zu WebAssembly kompiliert |
| **AssemblyScript** | TypeScript-ähnliche Sprache, zu WebAssembly kompiliert |
| **Python** | über Pyodide: Der Python-Interpreter selbst ist nach WebAssembly kompiliert und führt den Code zur Laufzeit aus |

## Messmethode

Die Seite zeigt zwei Tabellen:

- **Kalt – erster Aufruf:** die allererste Ausführung jeder Funktion nach dem Laden der Seite, ohne Aufwärmen. Für eine echte Kalt-Messung muss die Seite vorher neu geladen werden (`Strg + Shift + R`).
- **Warm – Median nach Aufwärmen:** Jede Funktion läuft 2× zum Aufwärmen (damit der JIT-Compiler von JavaScript optimieren kann), danach wird 5× gemessen und der Median genommen. Python wird wegen seiner Laufzeit nur 3× ohne Aufwärmen gemessen.

Gemessen wird mit `performance.now()`.


## Projektstruktur

```
src/
├── main.ts              Benchmark-Webseite (lädt alle Sprachen, füllt die Tabellen)
├── bench.ts             Messlogik (Aufwärmen, Median, erster Aufruf)
├── js/algorithms.ts     JavaScript-Version (Referenz)
└── wasm/                Kompilierte WebAssembly-Dateien (c.wasm, as.wasm + Lader)
wasm/
├── c/
│   ├── algorithms.c     C-Quellcode
│   ├── test.c           Test der C-Funktionen ohne Browser
│   └── Makefile         Build-Befehle für C
├── assemblyscript/
│   └── assembly/index.ts  AssemblyScript-Quellcode
└── python/
    └── algorithms.py    Python-Quellcode
index.html               Benchmark-Seite
Dockerfile               Container mit Emscripten + Node.js
docker-compose.yml       Startet den Container und den Vite-Server
```