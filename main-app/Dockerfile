FROM node:16-alpine as node-build

WORKDIR /app

COPY package*.json ./

COPY ./ ./

RUN npm install

RUN npm run build



FROM node:16-alpine 

WORKDIR /main-app

COPY --from=node-build ./app/build ./build

CMD npx serve -s build