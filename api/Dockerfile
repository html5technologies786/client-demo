# ──────────────────────────────────────────────
#  Stage 1 — deps
#  Install production dependencies only
# ──────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

# ──────────────────────────────────────────────
#  Stage 2 — runner
#  Lean final image with no dev tooling
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Run as non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY server.js ./

USER appuser

EXPOSE 5000

CMD ["node", "server.js"]
