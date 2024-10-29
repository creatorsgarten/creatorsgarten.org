FROM node:22-alpine as deps-prod

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm -r i --frozen-lockfile --prod

# ? -------------------------

FROM node:22-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm -r i --frozen-lockfile

COPY astro.config.mjs tailwind.config.cjs tsconfig.json ./
COPY public ./public
COPY src ./src

RUN pnpm build

# ? -------------------------

FROM gcr.io/distroless/nodejs20-debian12:nonroot as runner

USER nonroot
EXPOSE 8080

ENV NODE_ENV production
ENV PORT 8080
ENV TZ="Asia/Bangkok"

COPY package.json ./
COPY --chown=nonroot:nonroot --from=deps-prod /app/node_modules ./node_modules
COPY --chown=nonroot:nonroot --from=builder /app/dist ./dist
COPY server.mjs ./

CMD ["./server.mjs"]
