'use strict';

module.exports = {
  db: {
    username: 'props_node',
    password: '',
    name: 'props_node_development',
    host: 'localhost',
    dialect: 'postgres',
  },
  jwt: {
    secret: 'secret',
    expirationTime: 7 * 24 * 60 * 60 * 1000, // one week
  },
};
