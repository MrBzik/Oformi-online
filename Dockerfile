# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci && npm install --no-save --platform=linuxmusl --arch=x64 --cpu=x64 --os=linux sharp lightningcss @tailwindcss/oxide; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_OPTIONS="--max-old-space-size=2048"

ENV NEXT_DISABLE_ESLINT=1


ARG S3_BUCKET=${S3_BUCKET}
ARG S3_SECRET=${S3_SECRET}
ARG S3_ENDPOINT=${S3_ENDPOINT}
ARG DATABASE_URI=${DATABASE_URI}
ARG PAYLOAD_SECRET=${PAYLOAD_SECRET}
ARG RESEND_API_KEY=${RESEND_API_KEY}
ARG NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ARG S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ARG YANDEX_CLIENT_ID=${YANDEX_CLIENT_ID}
ARG NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ARG GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ARG YANDEX_CLIENT_SECRET=${YANDEX_CLIENT_SECRET}
ARG NEXT_PUBLIC_ROOT_DOMAIN=${NEXT_PUBLIC_ROOT_DOMAIN}
ARG NEXT_PUBLIC_STREAM_API_KEY=${NEXT_PUBLIC_STREAM_API_KEY}
ARG STREAM_API_SECRET_KEY=${STREAM_API_SECRET_KEY}
ARG NEXTAUTH_URL=${NEXTAUTH_URL}



RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then NODE_OPTIONS="--max-old-space-size=2048" npm run build -- --no-lint; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]