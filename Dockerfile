FROM node:10.0.0-alpine

RUN apk update && apk upgrade && apk add bash

COPY . .

RUN npm install
RUN npm run build

CMD npm run start

EXPOSE 8080 27017
