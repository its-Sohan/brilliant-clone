FROM node:22-alpine

RUN npm install -g pnpm@latest
RUN npm install -g prisma@6
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/

RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN prisma generate --schema=apps/web/prisma/schema.prisma
RUN pnpm --filter web build

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "start"]
