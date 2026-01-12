# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=apps/pitanga-api/prisma/schema.prisma

# Build the API
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

# Copy package files for production install
COPY --from=builder /app/package.json /app/package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/apps/pitanga-api/dist ./

# Copy Prisma schema (needed for migrations in production)
COPY --from=builder /app/apps/pitanga-api/prisma ./prisma

# Change ownership
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3333

CMD ["node", "main.js"]
