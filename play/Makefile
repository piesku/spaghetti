SOURCES := $(shell find .. -type f -name "*.ts")

all: index.html

game.esbuild.js: $(SOURCES)
	npx tsc --noEmit
	npx esbuild ../src/index.ts \
		--preserve-symlinks \
		--define:DEBUG=false \
		--define:OUTDIR=\".\" \
		--target=es2022 \
		--bundle \
		--analyze \
	> $@

game.sed.js: game.esbuild.js sed.txt
	sed  -f sed.txt  $< > $@

game.terser.js: game.sed.js terser_compress.txt node_modules
	npx --quiet terser $< \
		--ecma 2022 \
		--mangle toplevel \
		--mangle-props keep_quoted,regex=/^[A-Z]/ \
		--compress $(shell paste -sd, terser_compress.txt) \
	> $@

index.html: game.html game.terser.js game.css debug.css posthtml.cjs node_modules
	node posthtml.cjs $< > $@

.PHONY: clean
clean:
	rm -f *.js index.html

node_modules:
	npm install
