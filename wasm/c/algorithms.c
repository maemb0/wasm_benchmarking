#include <stdlib.h>      
#include <stdint.h>      
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int sieve(int n) {
    if (n < 2) return 0;

    uint8_t *composite = calloc(n + 1, sizeof(uint8_t));
    if (composite == NULL) return -1;   

    for (int i = 2; i * i <= n; i++) {
        if (!composite[i]) {
            for (int j = i * i; j <= n; j += i) {
                composite[j] = 1;
            }
        }
    }

    int count = 0;
    for (int i = 2; i <= n; i++) {
        if (!composite[i]) count++;
    }

    free(composite);   
    return count;
}

EMSCRIPTEN_KEEPALIVE
double matMul(int n) {
    int size = n * n;

    double *a = malloc(size * sizeof(double));
    double *b = malloc(size * sizeof(double));
    double *c = calloc(size, sizeof(double));   

    if (a == NULL || b == NULL || c == NULL) {
        free(a); free(b); free(c);
        return -1.0;
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            a[i * n + j] = (i + j) % 10;
            b[i * n + j] = (i * j) % 10;
        }
    }

    for (int i = 0; i < n; i++) {
        for (int k = 0; k < n; k++) {
            double aik = a[i * n + k];
            for (int j = 0; j < n; j++) {
                c[i * n + j] += aik * b[k * n + j];
            }
        }
    }

    double sum = 0.0;
    for (int i = 0; i < size; i++) sum += c[i];

    free(a); free(b); free(c);
    return sum;
}

EMSCRIPTEN_KEEPALIVE
double monte_carlo_pi(int samples, int seed) {
    int64_t x = seed;   
    int inside = 0;

    for (int i = 0; i < samples; i++) {
        x = (x * 16807) % 2147483647;
        double px = (double)x / 2147483647.0;

        x = (x * 16807) % 2147483647;
        double py = (double)x / 2147483647.0;

        if (px * px + py * py <= 1.0) inside++;
    }

    return 4.0 * inside / samples;
}