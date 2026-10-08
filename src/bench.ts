export interface Result {
  median: number; 
  min: number;
  max: number;
  value: number; 
}

export function measure(fn: () => number, runs = 5, warmup = 2): Result {
  let value = 0;

  
  for (let i = 0; i < warmup; i++) value = fn();

  // Messen
  const times: number[] = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    value = fn();
    times.push(performance.now() - t0);
  }

  times.sort((a, b) => a - b);
  return {
    median: times[Math.floor(times.length / 2)],
    min: times[0],
    max: times[times.length - 1],
    value,
  };
}
