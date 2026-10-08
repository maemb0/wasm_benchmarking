#include <stdio.h>

int sieve(int n);
double matmul(int n);
double monte_carlo_pi(int samples, int seed);

int main(void) {
    printf("sieve(10000000)          = %d\n",   sieve(10000000));
    printf("matmul(300)              = %.0f\n", matmul(300));
    printf("monte_carlo_pi(10 Mio.)  = %.6f\n", monte_carlo_pi(10000000, 42));
    return 0;
}