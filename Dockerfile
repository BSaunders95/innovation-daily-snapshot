FROM node:10.0.0-alpine

RUN apk update && apk upgrade && apk add bash

RUN mkdir -p /app
COPY . /app
WORKDIR /app
EXPOSE 8080 27017

ENV MONGODB_URL=mongodb://chs-mongo:27017/
ENV API_URL=http://localhost:8080

RUN npm install
RUN npm run build
CMD npm run start
