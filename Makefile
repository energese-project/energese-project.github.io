IMAGE_APP        := energese-site
CONTAINER_BIN    := container
NODE_VERSION     := $(shell cat .node-version)
WORKDIR          := /app
RUN              := $(CONTAINER_BIN) run --rm -v $(shell pwd):$(WORKDIR) $(IMAGE_APP)

.PHONY: help start image install dev build preview typecheck test-unit test check clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

# --------------------------------------------------
# Container daemon and image
# --------------------------------------------------

start: ## Start the Apple container system daemon
	$(CONTAINER_BIN) system start

image: start ## Build the dev image (node:$(NODE_VERSION)-slim + Chromium)
	$(CONTAINER_BIN) build -f Containerfile -t $(IMAGE_APP) --build-arg NODE_VERSION=$(NODE_VERSION) .

# --------------------------------------------------
# Development
# --------------------------------------------------

install: start ## Install npm dependencies inside the container
	$(RUN) npm install

dev: start ## Vite dev server on :5173
	$(CONTAINER_BIN) run --rm -it -p 5173:5173 -v $(shell pwd):$(WORKDIR) --name energese-site-dev $(IMAGE_APP) npm run dev

build: start ## Build the static site into dist/
	$(RUN) npm run build

preview: start ## Serve the built site on :4173
	$(CONTAINER_BIN) run --rm -it -p 4173:4173 -v $(shell pwd):$(WORKDIR) $(IMAGE_APP) npm run preview

# --------------------------------------------------
# Checks — the same three CI runs
# --------------------------------------------------

typecheck: start ## tsc --noEmit
	$(RUN) npm run typecheck

test-unit: start ## Unit tests (node --test)
	$(RUN) npm test

test: start ## Playwright end-to-end tests, dev server and built bundle
	$(RUN) npm run e2e

check: typecheck test-unit test ## Everything CI runs. Must pass before pushing.

clean: ## Remove build output and dependencies
	rm -rf node_modules dist .vite playwright-report test-results
