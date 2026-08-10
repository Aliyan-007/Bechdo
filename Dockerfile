# ==============================================================================
# RASTA — PAKISTAN AUTOMOTIVE ARCHIVE: DOCKER PRODUCTION BUILDER
# ==============================================================================
# Run locally with Docker Compose:
#   docker compose up --build
# ==============================================================================

FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Step 1: Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Step 2: Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma Client & compile Next.js production build
RUN npx prisma generate
RUN npm run build

# Step 3: Production runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy required files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dev.db ./dev.db
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

CMD ["npm", "start"]
