FROM cgr.dev/chainguard/node:18 as deps-prod

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npx pnpm -r i --frozen-lockfile --prod

# ? -------------------------

FROM cgr.dev/chainguard/node:18 as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npx pnpm -r i --frozen-lockfile

COPY astro.config.mjs tailwind.config.cjs tsconfig.json ./
COPY public ./public
COPY src ./src

RUN npx pnpm build

# ? -------------------------

# Use -dev variant for debugging with bash attatched
# https://edu.chainguard.dev/chainguard/chainguard-images/reference/node/image_specs/

FROM cgr.dev/chainguard/node:18 AS runner

USER nonroot
EXPOSE 8080

ENV NODE_ENV production
ENV PORT 8080

COPY package.json ./
COPY --chown=nonroot:nonroot --from=deps-prod /app/node_modules ./node_modules
COPY --chown=nonroot:nonroot --from=builder /app/dist ./dist
COPY server.mjs ./

CMD ["./server.mjs"]
