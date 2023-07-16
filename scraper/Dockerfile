FROM node:16-alpine

RUN apk add --no-cache chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD npx ts-node scraper.ts