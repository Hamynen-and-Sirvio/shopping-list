FROM node:24-alpine AS build-stage

ENV NODE_ENV=production

WORKDIR /build

COPY package.json package-lock.json .
RUN npm clean-install

COPY prisma.config.ts .
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate


FROM node:24-alpine

ENV NODE_ENV=production
ENV HOST=0.0.0.0

WORKDIR /app

COPY . .
COPY --from=build-stage /build/node_modules/ node_modules/
COPY --from=build-stage /build/generated/ generated/

RUN adduser -D appuser
USER appuser

CMD ["node", "src/index.ts"]
