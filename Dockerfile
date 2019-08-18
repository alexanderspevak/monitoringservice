FROM node:11.4.0

RUN mkdir /monitoringservice

WORKDIR /monitoringservice

COPY . .

RUN npm install --silent
RUN npm run build

EXPOSE 8080


CMD ["node", "dist/src/index"]
