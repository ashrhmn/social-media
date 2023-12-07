FROM node:20 as base

RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY prisma ./prisma
RUN pnpm prisma generate

FROM base as build

WORKDIR /app
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base as production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY .env .
CMD ["pnpm", "start:prod"]