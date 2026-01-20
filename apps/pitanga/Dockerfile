# syntax=docker/dockerfile:1.4

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Copy workspace package.json files (needed for yarn workspaces)
COPY apps/pitanga-api/package.json ./apps/pitanga-api/
COPY apps/pitanga/package.json ./apps/pitanga/
COPY libs/auth-types/package.json ./libs/auth-types/
COPY libs/api-client/package.json ./libs/api-client/

# Install all dependencies with cache mount for faster builds
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the Next.js app with NX and Next.js cache
RUN --mount=type=cache,target=/app/.nx/cache \
    --mount=type=cache,target=/app/apps/pitanga/.next/cache \
    yarn nx sync && yarn nx build @pitanga/pitanga

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/pitanga/.next/standalone ./

# Copy public assets (must be relative to server.js location)
COPY --from=builder --chown=nextjs:nodejs /app/apps/pitanga/public ./apps/pitanga/public

# Copy static files
COPY --from=builder --chown=nextjs:nodejs /app/apps/pitanga/.next/static ./apps/pitanga/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/pitanga/server.js"]
