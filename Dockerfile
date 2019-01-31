FROM node:11.4.0

RUN mkdir /app

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./tsconfig.json /app/tsconfig.json
COPY ./ormconfig.json /app/ormconfig.json

RUN npm install --silent

COPY ./src  /app/src
EXPOSE 3306
EXPOSE 8080

CMD ["npm", "run", "start"]
