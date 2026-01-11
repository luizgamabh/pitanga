# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build the API (--skip-sync for non-interactive CI environments)
RUN npx nx sync && npx nx build pitanga-api --configuration=production

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder /app/apps/pitanga-api/dist ./

# Install production dependencies only
RUN npm ci --omit=dev && \
    npm cache clean --force

# Change ownership
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3333

CMD ["node", "main.js"]
