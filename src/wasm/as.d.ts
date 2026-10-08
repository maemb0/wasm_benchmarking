/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * wasm/assemblyscript/assembly/index/sieve
 * @param n `i32`
 * @returns `i32`
 */
export declare function sieve(n: number): number;
/**
 * wasm/assemblyscript/assembly/index/matMul
 * @param n `i32`
 * @returns `f64`
 */
export declare function matMul(n: number): number;
/**
 * wasm/assemblyscript/assembly/index/monte_carlo_pi
 * @param samples `i32`
 * @param seed `i32`
 * @returns `f64`
 */
export declare function monte_carlo_pi(samples: number, seed: number): number;
