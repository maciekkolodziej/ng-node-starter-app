'use strict';

const dotEnvPath = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({ path: dotEnvPath });

const REQUIRED_KEYS = [
  'DB_URL',
  'JWT_TOKEN',
];

REQUIRED_KEYS.forEach((key) => {
  if (!(key in process.env)) {
    throw new Error(`Missing required config key: ${key}`);
  }
});

const {
  JWT_TOKEN,
} = process.env;

module.exports = {
  JWT_TOKEN,
  TOKEN_EXPIRATION_TIME: 7 * 24 * 60 * 60 * 1000, // one week
};
