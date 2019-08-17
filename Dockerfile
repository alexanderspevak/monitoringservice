FROM node:11.4.0

RUN mkdir /monitoringservice

WORKDIR /monitoringservice

COPY ./package.json /monitoringservice/package.json
COPY ./package-lock.json /monitoringservice/package-lock.json
COPY ./tsconfig.json /monitoringservice/tsconfig.json
COPY ./ormconfig.json /monitoringservice/ormconfig.json
COPY ./src  /monitoringservice/src
RUN npm install --silent

COPY ./src  /monitoringservice/src
EXPOSE 8080


CMD ["npm", "run", "start"]
