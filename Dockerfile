FROM node:10.0.0-alpine

RUN apk update && apk upgrade && apk add bash

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build

CMD npm run start

EXPOSE 8080 27017
