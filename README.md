# WebAssembly Benchmark

Wir vergleichen, wie schnell rechenintensive Funktionen in
WebAssembly (C, AssemblyScript, Python) im Vergleich zu JavaScript laufen.

## Aufgaben

Jede Funktion ist in allen Sprachen identisch umgesetzt:

| Funktion             | Beschreibung                                        |
| -------------------- | --------------------------------------------------- |
| Primzahl-Sieb        | Sieb des Eratosthenes – zählt alle Primzahlen bis n |
| Matrixmultiplikation | Multipliziert zwei n×n-Matrizen                     |
| Monte-Carlo-π        | Schätzt π mit Zufallspunkten                        |

## Sprachen

- **JavaScript** – Referenz, läuft direkt im Browser
- **C** → WebAssembly
- **AssemblyScript** (TypeScript-ähnlich) → WebAssembly
- **Python** → läuft über Pyodide (Python-Interpreter in WebAssembly)

## Projektstruktur

    src/            Benchmark-Webseite + JavaScript-Version
    wasm/c/         C-Quellcode
    wasm/assemblyscript/  AssemblyScript-Quellcode
    wasm/python/    Python-Quellcode
    public/wasm/    Kompilierte .wasm-Dateien

## Starten

### Voraussetzungen

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (muss laufen)

Node.js, Emscripten und AssemblyScript sind bereits im Container enthalten.

### Projekt starten

```bash
git clone https://github.com/DEIN-USERNAME/wasm-benchmark.git
cd wasm-benchmark
docker compose up --build
```

Dann im Browser **http://localhost:5173** öffnen.

Beenden mit `Strg + C` und anschließend:

```bash
docker compose down
```

### Wasm-Dateien neu bauen (optional)

Die kompilierten `.wasm`-Dateien liegen bereits in `public/wasm/`.
Nur wer den C- oder AssemblyScript-Code ändert, muss neu bauen:

```bash
docker compose exec app npm run build:wasm
```

## Ergebnisse

_Folgt._
