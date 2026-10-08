import { sieve, matMul, monteCarloPi } from "./js/algorithms";
import { measure } from "./bench";

const tasks = [
  {
    name: "Primzahl-Sieb",
    size: "n = 10.000.000",
    run: () => sieve(10_000_000),
  },
  { name: "Matrixmultiplikation", size: "300 × 300", run: () => matMul(300) },
  {
    name: "Monte-Carlo-π",
    size: "10.000.000 Punkte",
    run: () => monteCarloPi(10_000_000, 42),
  },
];

const button = document.getElementById("start") as HTMLButtonElement;
const tbody = document.getElementById("results") as HTMLTableSectionElement;

const nextFrame = () => new Promise((r) => setTimeout(r, 0));

button.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Läuft …";
  tbody.innerHTML = "";

  for (const task of tasks) {
    const row = tbody.insertRow();
    row.innerHTML = `<td>${task.name}</td><td>${task.size}</td><td>…</td><td class="num">…</td>`;
    await nextFrame();

    const r = measure(task.run);
    row.cells[2].textContent = Number.isInteger(r.value)
      ? r.value.toLocaleString("de-AT")
      : r.value.toFixed(6);
    row.cells[3].textContent = `${r.median.toFixed(1)} ms`;
  }

  button.disabled = false;
  button.textContent = "Nochmal starten";
});
