export interface Result {
  first: number;  
  median: number; 
  min: number;
  max: number;
  value: number; 
}

export function measure(fn: () => number, runs = 5, warmup = 2): Result {
  let value = 0;
  let first = -1;


  const timeOnce = () => {
    const t0 = performance.now();
    value = fn();
    return performance.now() - t0;
  };


  for (let i = 0; i < warmup; i++) {
    const t = timeOnce();
    if (first < 0) first = t;
  }

 
  const times: number[] = [];
  for (let i = 0; i < runs; i++) {
    const t = timeOnce();
    if (first < 0) first = t;
    times.push(t);
  }

  times.sort((a, b) => a - b);
  return {
    first,
    median: times[Math.floor(times.length / 2)],
    min: times[0],
    max: times[times.length - 1],
    value,
  };
}