FROM node:24-alpine as deps-prod

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g corepack@latest && corepack enable && pnpm -r i --frozen-lockfile --prod

# ? -------------------------

FROM node:24-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g corepack@latest && corepack enable && pnpm -r i --frozen-lockfile

COPY astro.config.mjs tailwind.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src

RUN pnpm astro sync && pnpm build

# ? -------------------------

FROM gcr.io/distroless/nodejs22-debian12:nonroot as runner

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
