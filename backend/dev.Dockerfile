FROM node:24-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY prisma.config.ts .
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate
