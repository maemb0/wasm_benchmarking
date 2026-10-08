
export function sieve(n: i32): i32 {
  if (n < 2) return 0;
  const composite = new StaticArray<u8>(n + 1);   

  for (let i: i32 = 2; i * i <= n; i++) {
    if (!composite[i]) {
      for (let j: i32 = i * i; j <= n; j += i) {
        composite[j] = 1;
      }
    }
  }

  let count: i32 = 0;
  for (let i: i32 = 2; i <= n; i++) {
    if (!composite[i]) count++;
  }
  return count;
}


export function matMul(n: i32): f64 {
  const size = n * n;
  const a = new StaticArray<f64>(size);
  const b = new StaticArray<f64>(size);
  const c = new StaticArray<f64>(size);

  for (let i: i32 = 0; i < n; i++) {
    for (let j: i32 = 0; j < n; j++) {
      a[i * n + j] = <f64>((i + j) % 10);
      b[i * n + j] = <f64>((i * j) % 10);
    }
  }

  for (let i: i32 = 0; i < n; i++) {
    for (let k: i32 = 0; k < n; k++) {
      const aik = a[i * n + k];
      for (let j: i32 = 0; j < n; j++) {
        c[i * n + j] += aik * b[k * n + j];
      }
    }
  }

  let sum: f64 = 0;
  for (let i: i32 = 0; i < size; i++) sum += c[i];
  return sum;
}

export function monte_carlo_pi(samples: i32, seed: i32): f64 {
  let x: i64 = seed;   
  let inside: i32 = 0;

  for (let i: i32 = 0; i < samples; i++) {
    x = (x * 16807) % 2147483647;
    const px = <f64>x / 2147483647.0;

    x = (x * 16807) % 2147483647;
    const py = <f64>x / 2147483647.0;

    if (px * px + py * py <= 1.0) inside++;
  }
  return 4.0 * <f64>inside / <f64>samples;
}