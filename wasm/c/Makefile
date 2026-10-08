SRC  = algorithms.c
TEST = test.c
OUT  = ../../src/wasm/c.js

NODE := $(shell command -v node)

# "make build": algorithms.c → WebAssembly für den Browser
build:
	mkdir -p ../../src/wasm
	emcc -O3 $(SRC) -o $(OUT) \
		-sMODULARIZE \
		-sEXPORT_ES6 \
		-sENVIRONMENT=web \
		-sALLOW_MEMORY_GROWTH

# "make test": Korrektheit in Node prüfen
test:
	emcc -O3 $(TEST) $(SRC) -o test.js
	$(NODE) test.js

clean:
	rm -f test.js test.wasm $(OUT) ../../src/wasm/c.wasm

.PHONY: build test clean