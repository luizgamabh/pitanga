# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js app (nx sync for CI environments)
RUN npx nx sync && npx nx build pitanga --configuration=production

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
