FROM node:26-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY prisma.config.ts .
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate
