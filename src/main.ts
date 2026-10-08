import { sieve, matMul, monteCarloPi } from './js/algorithms';
import { measure } from './bench';
// @ts-ignore – von Emscripten erzeugt, hat keine Typ-Datei
import createModule from './wasm/c.js';
import * as AS from './wasm/as.js';
import { loadPyodide, version as pyodideVersion } from 'pyodide';
// @ts-ignore – von Vite erzeugt, hat keine Typ-Datei
import pySource from '../wasm/python/algorithms.py?raw';

interface CModule {
  _sieve(n: number): number;
  _matMul(n: number): number;
  _monte_carlo_pi(samples: number, seed: number): number;
}

const button = document.getElementById('start') as HTMLButtonElement;
const tbodyCold = document.getElementById('results-cold') as HTMLTableSectionElement;
const tbodyWarm = document.getElementById('results-warm') as HTMLTableSectionElement;
const coldNote = document.getElementById('cold-note') as HTMLParagraphElement;

const langs = ['js', 'c', 'as', 'py'] as const;

let pageFresh = true;

const nextFrame = () => new Promise((r) => setTimeout(r, 0));

const format = (v: number) =>
  Number.isInteger(v) ? v.toLocaleString('de-AT') : v.toFixed(6);

function newRow(tbody: HTMLTableSectionElement, name: string, size: string) {
  const row = tbody.insertRow();
  row.innerHTML =
    `<td>${name}</td><td>${size}</td><td>…</td>` +
    langs.map(() => '<td class="num">…</td>').join('');
  return row;
}

function showTime(cell: HTMLTableCellElement, time: number, jsTime: number, isJs: boolean) {
  if (isJs) {
    cell.textContent = `${time.toFixed(1)} ms`;
    return;
  }
  const factor = jsTime / time;
  const vs = factor >= 1
    ? `${factor.toFixed(2)}× schneller`
    : `${(1 / factor).toFixed(2)}× langsamer`;
  cell.textContent = `${time.toFixed(1)} ms (${vs})`;
}

button.addEventListener('click', async () => {
  button.disabled = true;
  tbodyCold.innerHTML = '';
  tbodyWarm.innerHTML = '';

  coldNote.textContent = pageFresh
    ? ''
    : '⚠️ Nicht kalt: Die Funktionen liefen schon einmal. Für eine echte Kalt-Messung die Seite neu laden (Strg + Shift + R).';


  button.textContent = 'Lade C …';
  const c = (await createModule()) as CModule;

  button.textContent = 'Lade Python …';
  const pyodide = await loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/npm/pyodide@${pyodideVersion}/`,
  });
  pyodide.runPython(pySource); 

  const py = {
    sieve: pyodide.globals.get('sieve'),
    matMul: pyodide.globals.get('matMul'),
    monte_carlo_pi: pyodide.globals.get('monte_carlo_pi'),
  };

  button.textContent = 'Läuft …';


  const tasks = [
    {
      name: 'Primzahl-Sieb',
      size: 'n = 10.000.000',
      run: {
        js: () => sieve(10_000_000),
        c:  () => c._sieve(10_000_000),
        as: () => AS.sieve(10_000_000),
        py: () => py.sieve(10_000_000),
      },
    },
    {
      name: 'Matrixmultiplikation',
      size: '300 × 300',
      run: {
        js: () => matMul(300),
        c:  () => c._matMul(300),
        as: () => AS.matMul(300),
        py: () => py.matMul(300),
      },
    },
    {
      name: 'Monte-Carlo-π',
      size: '10.000.000 Punkte',
      run: {
        js: () => monteCarloPi(10_000_000, 42),
        c:  () => c._monte_carlo_pi(10_000_000, 42),
        as: () => AS.monte_carlo_pi(10_000_000, 42),
        py: () => py.monte_carlo_pi(10_000_000, 42),
      },
    },
  ];


  for (const task of tasks) {
    const rowCold = newRow(tbodyCold, task.name, task.size);
    const rowWarm = newRow(tbodyWarm, task.name, task.size);
    await nextFrame();

    let jsResult = 0;
    let jsFirst = 0;
    let jsMedian = 0;

    for (const [i, lang] of langs.entries()) {
      const r = lang === 'py'
        ? measure(task.run[lang], 3, 0)
        : measure(task.run[lang]);

      const isJs = lang === 'js';
      if (isJs) {
        jsResult = r.value;
        jsFirst = r.first;
        jsMedian = r.median;
        rowCold.cells[2].textContent = format(r.value);
        rowWarm.cells[2].textContent = format(r.value);
      }

      const cellCold = rowCold.cells[3 + i]; 
      const cellWarm = rowWarm.cells[3 + i];

      showTime(cellCold, r.first, jsFirst, isJs);
      showTime(cellWarm, r.median, jsMedian, isJs);

      if (r.value !== jsResult) cellWarm.textContent += ` ⚠️ ${format(r.value)}`;

      await nextFrame();
    }
  }

  pageFresh = false; 
  button.disabled = false;
  button.textContent = 'Nochmal starten';
});