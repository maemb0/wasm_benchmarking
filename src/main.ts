import { sieve, matMul, monteCarloPi } from './js/algorithms';
import { measure } from './bench';
import createModule from './wasm/c.js';

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

  const c = (await createModule()) as CModule;

  const tasks = [
    {
      name: 'Primzahl-Sieb',
      size: 'n = 10.000.000',
      js: () => sieve(10_000_000),
      c: () => c._sieve(10_000_000),
    },
    {
      name: 'Matrixmultiplikation',
      size: '300 × 300',
      js: () => matMul(300),
      c: () => c._matMul(300),
    },
    {
      name: 'Monte-Carlo-π',
      size: '10.000.000 Punkte',
      js: () => monteCarloPi(10_000_000, 42),
      c: () => c._monte_carlo_pi(10_000_000, 42),
    },
  ];

  for (const task of tasks) {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${task.name}</td>
      <td>${task.size}</td>
      <td>…</td>
      <td class="num">…</td>
      <td class="num">…</td>
      <td class="num">…</td>`;
    await nextFrame();

    const rJs = measure(task.js);
    row.cells[2].textContent = format(rJs.value);
    row.cells[3].textContent = `${rJs.median.toFixed(1)} ms`;
    await nextFrame();

    const rC = measure(task.c);
    row.cells[4].textContent = `${rC.median.toFixed(1)} ms`;

    if (rJs.value !== rC.value) {
      row.cells[2].textContent += ` ⚠️ C: ${format(rC.value)}`;
    }

    const factor = rJs.median / rC.median;
    row.cells[5].textContent =
      factor >= 1
        ? `${factor.toFixed(2)}× schneller`
        : `${(1 / factor).toFixed(2)}× langsamer`;
  }

  button.disabled = false;
  button.textContent = 'Nochmal starten';
});