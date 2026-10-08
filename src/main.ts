import { sieve } from "./js/algorithms";

const out = document.getElementById("output");

if (!out) {
  throw new Error("Das Ausgabe-Element #output wurde nicht gefunden.");
}

const t0 = performance.now();
const result = sieve(10_000_000);
const t1 = performance.now();

out.textContent = `Primzahlen bis 10.000.000: ${result}\nZeit: ${(t1 - t0).toFixed(1)} ms`;
