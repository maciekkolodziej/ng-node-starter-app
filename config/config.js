'use strict';

const dotEnvPath = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({ path: dotEnvPath });

const REQUIRED_KEYS = [
  'DB_URL',
  'JWT_TOKEN',
  'TOKEN_EXPIRATION_TIME',
];

REQUIRED_KEYS.forEach((key) => {
  if (!(key in process.env)) {
    throw new Error(`Missing required config key: ${key}`);
  }
});

const {
  JWT_TOKEN,
  TOKEN_EXPIRATION_TIME,
} = process.env;

module.exports = {
  JWT_TOKEN,
  TOKEN_EXPIRATION_TIME: Number(TOKEN_EXPIRATION_TIME),
};
