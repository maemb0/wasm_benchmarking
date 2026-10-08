def sieve(n):
    if n < 2:
        return 0
    composite = bytearray(n + 1)   # Byte-Array mit Nullen, wie Uint8Array

    i = 2
    while i * i <= n:
        if not composite[i]:
            for j in range(i * i, n + 1, i):
                composite[j] = 1
        i += 1

    count = 0
    for i in range(2, n + 1):
        if not composite[i]:
            count += 1
    return count


def matMul(n):
    size = n * n
    a = [0.0] * size
    b = [0.0] * size
    c = [0.0] * size

    for i in range(n):
        for j in range(n):
            a[i * n + j] = float((i + j) % 10)
            b[i * n + j] = float((i * j) % 10)

    for i in range(n):
        for k in range(n):
            aik = a[i * n + k]
            for j in range(n):
                c[i * n + j] += aik * b[k * n + j]

    total = 0.0
    for i in range(size):
        total += c[i]
    return total


def monte_carlo_pi(samples, seed):
    x = seed
    inside = 0
    for _ in range(samples):
        x = (x * 16807) % 2147483647
        px = x / 2147483647
        x = (x * 16807) % 2147483647
        py = x / 2147483647
        if px * px + py * py <= 1.0:
            inside += 1
    return 4.0 * inside / samples