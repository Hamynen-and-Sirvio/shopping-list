FROM node:22-alpine

ENV NODE_ENV="production"
ENV HOST="0.0.0.0"

WORKDIR /app

COPY package.json package-lock.json .
RUN npm clean-install

COPY . .

RUN npx prisma generate

CMD ["node", "src/index.ts"]
