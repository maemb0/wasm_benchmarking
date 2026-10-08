export function sieve(n: number): number {
  if (n < 2) return 0;

  const composite = new Uint8Array(n + 1);

  for (let i = 2; i * i <= n; i++) {
    if (!composite[i]) {
      for (let j = i * i; j <= n; j += i) {
        composite[j] = 1;
      }
    }
  }

  let count = 0;
  for (let i = 2; i <= n; i++) {
    if (!composite[i]) count++;
  }
  return count;
}

export function matMul(n: number): number {
  const size = n * n;
  const a = new Float64Array(size);
  const b = new Float64Array(size);
  const c = new Float64Array(size); // startet automatisch mit lauter Nullen

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      a[i * n + j] = (i + j) % 10;
      b[i * n + j] = (i * j) % 10;
    }
  }

  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const aik = a[i * n + k];
      for (let j = 0; j < n; j++) {
        c[i * n + j] += aik * b[k * n + j];
      }
    }
  }

  let sum = 0;
  for (let i = 0; i < size; i++) sum += c[i];
  return sum;
}

export function monteCarloPi(samples: number, seed: number): number {
  let x = seed; // Startwert, darf nicht 0 sein
  let inside = 0;

  for (let i = 0; i < samples; i++) {
    x = (x * 16807) % 2147483647;
    const px = x / 2147483647;

    x = (x * 16807) % 2147483647;
    const py = x / 2147483647;

    if (px * px + py * py <= 1) inside++;
  }

  return (4 * inside) / samples;
}
