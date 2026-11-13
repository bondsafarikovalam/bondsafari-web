# Bond Safari website: Next.js standalone server for AWS App Runner / ECS Fargate.
#   docker build --build-arg NEXT_PUBLIC_SITE_URL=https://www.bondsafarikovalam.com -t bondsafari-web .
#   docker run -p 3000:3000 --env-file .env.production bondsafari-web
# NEXT_PUBLIC_* values are baked in at build time; every other variable (API keys, S3) is read at run time.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL=https://www.bondsafarikovalam.com
ARG NEXT_PUBLIC_EVENTS_MEDIA_BASE_URL=https://logout.world/media
ARG NEXT_PUBLIC_TAWK_PROPERTY_ID=
ARG NEXT_PUBLIC_TAWK_WIDGET_ID=
ARG SITE_NOINDEX=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_EVENTS_MEDIA_BASE_URL=$NEXT_PUBLIC_EVENTS_MEDIA_BASE_URL \
    NEXT_PUBLIC_TAWK_PROPERTY_ID=$NEXT_PUBLIC_TAWK_PROPERTY_ID \
    NEXT_PUBLIC_TAWK_WIDGET_ID=$NEXT_PUBLIC_TAWK_WIDGET_ID \
    SITE_NOINDEX=$SITE_NOINDEX \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
