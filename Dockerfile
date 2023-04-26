FROM node:18-alpine as deps

WORKDIR /app
RUN npm i -g pnpm

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN pnpm -r i --frozen-lockfile

# ? -------------------------

FROM node:18-alpine as deps-prod

WORKDIR /app
RUN npm i -g pnpm

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN pnpm -r i --frozen-lockfile --prod --shamefully-hoist

# ? -------------------------

FROM node:18-alpine as builder

WORKDIR /app
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml* astro.config.mjs tailwind.config.cjs tsconfig.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY public ./public
COPY src ./src

RUN pnpm build

# ? -------------------------

FROM gcr.io/distroless/nodejs:18 as runner

ENV NODE_ENV production

COPY package.json pnpm-lock.yaml ./
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENV PORT 8080

CMD ["./dist/server/entry.mjs"]
