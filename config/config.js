'use strict';

const dotEnvPath = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({ path: dotEnvPath });

const REQUIRED_KEYS = [
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'DB_HOST',
  'DB_DIALECT',
];

REQUIRED_KEYS.forEach((key) => {
  if (!(key in process.env)) {
    throw new Error(`Missing required config key: ${key}`);
  }
});

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_HOST,
  DB_DIALECT,
  JWT_TOKEN,
} = process.env;

module.exports = {
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  dialect: DB_DIALECT,
  jwtToken: JWT_TOKEN,
  tokenExpirationTime: 7 * 24 * 60 * 60 * 1000, // one week
};
