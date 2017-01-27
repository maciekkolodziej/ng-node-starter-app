# Node 6.9.4 LTS version (boron)
FROM node:boron

RUN mkdir -p /usr/src/props-node
WORKDIR /usr/src/props-node

COPY package.json /usr/src/props-node

RUN npm install

COPY . /usr/src/props-node

RUN npm install -g sequelize-cli

RUN apt-get update

RUN apt-get install -y postgresql-9.4 postgresql-contrib

RUN createuser props_node

RUN createdb props_node_test
RUN createdb props_node_development

RUN sequelize db:migrate
RUN NODE_ENV=test sequelize db:migrate

EXPOSE 10010

CMD [ "npm", "start" ]
