
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