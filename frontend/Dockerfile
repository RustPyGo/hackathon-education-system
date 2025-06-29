FROM oven/bun:latest AS base

FROM oven/bun:latest
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN adduser --system --uid 1001 nextjs

COPY . .

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["bun", "run", "dev"]
