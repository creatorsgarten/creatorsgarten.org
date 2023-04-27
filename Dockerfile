FROM node:18-alpine as deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npx pnpm -r i --frozen-lockfile

# ? -------------------------

FROM node:18-alpine as deps-prod

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npx pnpm -r i --frozen-lockfile --prod

# ? -------------------------

FROM node:18-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* astro.config.mjs tailwind.config.cjs tsconfig.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY public ./public
COPY src ./src

RUN npx pnpm build

# ? -------------------------

FROM gcr.io/distroless/nodejs18-debian11 as runner

ENV NODE_ENV production

COPY package.json pnpm-lock.yaml ./
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENV PORT 8080
ENV HOST 0.0.0.0

CMD ["./dist/server/entry.mjs"]
