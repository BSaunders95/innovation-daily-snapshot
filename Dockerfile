FROM node:10.0.0-alpine

RUN apk update && apk upgrade && apk add bash

COPY . .

RUN npm install case mongodb vue-json-excel vue2-highcharts --save

CMD ./start_server.sh && ./start_client.sh

EXPOSE 8080
