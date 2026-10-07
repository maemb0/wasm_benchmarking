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

_Folgt._

## Ergebnisse

_Folgt._
