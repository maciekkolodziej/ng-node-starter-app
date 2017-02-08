# Node 6.9.4 LTS version (boron)
FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

RUN npm install -g sequelize-cli nodemon 

RUN apt-get update

RUN sequelize db:migrate
RUN NODE_ENV=test sequelize db:migrate

EXPOSE 10010

CMD [ "nodemon" ]
