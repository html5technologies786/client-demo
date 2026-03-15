# ──────────────────────────────────────────────
#  Stage 1 — deps
#  Install all dependencies for the build step
# ──────────────────────────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ──────────────────────────────────────────────
#  Stage 2 — builder
#  Build the Next.js production bundle
# ──────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# API_URL is available at build time for server components
ARG API_URL
ENV API_URL=$API_URL

RUN npm run build

# ──────────────────────────────────────────────
#  Stage 3 — runner
#  Minimal image — only the built output
# ──────────────────────────────────────────────
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only what Next.js needs to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
