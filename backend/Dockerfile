# ==========================================
# STAGE 1: Builder & Bundler Stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY index.js ./

# Bundle index.js and all npm dependencies into a single file using esbuild (CommonJS target for Node built-in compatibility)
RUN npx esbuild index.js --bundle --platform=node --target=node22 --format=cjs --outfile=dist/server.js

# ==========================================
# STAGE 2: Production Minimal Runner (~38 MB)
# ==========================================
FROM alpine:3.24 AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Install zero-vulnerability nodejs runtime from alpine 3.24 & create non-root user
# hadolint ignore=DL3018
RUN apk add --no-cache nodejs && \
    addgroup -g 1000 node && \
    adduser -u 1000 -G node -s /bin/sh -D node

# Copy ONLY the single bundled JavaScript binary file (No node_modules required!)
COPY --chown=node:node --from=builder /usr/src/app/dist/server.js ./server.js

# Enforce Non-Root Execution (UID 1000)
USER node

EXPOSE 5000

# Native Node Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
