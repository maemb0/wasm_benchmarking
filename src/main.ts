import { sieve, matMul, monteCarloPi } from './js/algorithms';
import { measure } from './bench';
// @ts-ignore – von Emscripten erzeugt, hat keine Typ-Datei
import createModule from './wasm/c.js';
import * as AS from './wasm/as.js';

// Welche C-Funktionen es im Wasm-Modul gibt (Emscripten setzt ein "_" davor)
interface CModule {
  _sieve(n: number): number;
  _matMul(n: number): number;
  _monte_carlo_pi(samples: number, seed: number): number;
}

const button = document.getElementById('start') as HTMLButtonElement;
const tbody = document.getElementById('results') as HTMLTableSectionElement;

const nextFrame = () => new Promise((r) => setTimeout(r, 0));

const format = (v: number) =>
  Number.isInteger(v) ? v.toLocaleString('de-AT') : v.toFixed(6);

button.addEventListener('click', async () => {
  button.disabled = true;
  button.textContent = 'Läuft …';
  tbody.innerHTML = '';

  // C-Modul laden (AssemblyScript ist schon durch den Import geladen)
  const c = (await createModule()) as CModule;

  // Jede Aufgabe mit einer Funktion pro Sprache
  const tasks = [
    {
      name: 'Primzahl-Sieb',
      size: 'n = 10.000.000',
      run: {
        js: () => sieve(10_000_000),
        c:  () => c._sieve(10_000_000),
        as: () => AS.sieve(10_000_000),
      },
    },
    {
      name: 'Matrixmultiplikation',
      size: '300 × 300',
      run: {
        js: () => matMul(300),
        c:  () => c._matMul(300),
        as: () => AS.matMul(300),
      },
    },
    {
      name: 'Monte-Carlo-π',
      size: '10.000.000 Punkte',
      run: {
        js: () => monteCarloPi(10_000_000, 42),
        c:  () => c._monte_carlo_pi(10_000_000, 42),
        as: () => AS.monte_carlo_pi(10_000_000, 42),
      },
    },
  ];

  // Reihenfolge der Spalten in der Tabelle
  const langs = ['js', 'c', 'as'] as const;

  for (const task of tasks) {
    // Neue Zeile: Name, Größe, Ergebnis + eine Zelle pro Sprache
    const row = tbody.insertRow();
    row.innerHTML =
      `<td>${task.name}</td><td>${task.size}</td><td>…</td>` +
      langs.map(() => '<td class="num">…</td>').join('');
    await nextFrame();

    let jsResult = 0;
    let jsTime = 0;

    for (const [i, lang] of langs.entries()) {
      const r = measure(task.run[lang]);
      const cell = row.cells[3 + i];   // Spalte 3 = JS, 4 = C, 5 = AS

      if (lang === 'js') {
        // JavaScript ist die Referenz
        jsResult = r.value;
        jsTime = r.median;
        row.cells[2].textContent = format(r.value);
        cell.textContent = `${r.median.toFixed(1)} ms`;
      } else {
        // Wasm-Sprachen: Zeit + Vergleich mit JavaScript
        const factor = jsTime / r.median;
        const vs = factor >= 1
          ? `${factor.toFixed(2)}× schneller`
          : `${(1 / factor).toFixed(2)}× langsamer`;
        cell.textContent = `${r.median.toFixed(1)} ms (${vs})`;

        // Liefert die Sprache dasselbe Ergebnis wie JavaScript?
        if (r.value !== jsResult) cell.textContent += ` ⚠️ ${format(r.value)}`;
      }
      await nextFrame();
    }
  }

  button.disabled = false;
  button.textContent = 'Nochmal starten';
});