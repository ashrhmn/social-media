FROM node:20 as base

RUN npm install -g pnpm
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base as builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base as production
WORKDIR /app
# Setting NODE_ENV to production is mandatory to run in prod mode
ENV NODE_ENV=production
COPY .env .
COPY public ./public
COPY server.js .
COPY --from=builder /app/.next /app/.next

EXPOSE 3000
CMD [ "pnpm","start" ]