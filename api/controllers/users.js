'use strict';

const jwt = require('jwt-simple');
const passport = require('passport');
const { compose } = require('compose-middleware');

const { User } = require('../../models');
const {
  JWT_TOKEN,
  TOKEN_EXPIRATION_TIME,
} = require('../../config/config');

module.exports = {
  userRegister(req, res) {
    User.create(req.body)
      .then(user => res.status(201).send(user))
      .catch((error) => {
        if ('username' in error.fields) {
          return res.status(409).send(error);
        }
        return res.status(500).send(error);
      });
  },
  login: compose([
    passport.authenticate('local'),
    (req, res) => {
      const token = jwt.encode({
        id: req.user.id,
        expirationDate: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
      }, JWT_TOKEN);

      res.status(200).send({ token });
    },
  ]),
  getAccount: compose([
    passport.authenticate('bearer'),
    (req, res) => res.status(200).send(req.user),
  ]),
};
