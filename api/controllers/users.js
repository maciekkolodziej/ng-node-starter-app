const jwt = require('jwt-simple');
const passport = require('passport');
const { compose } = require('compose-middleware');

const { User } = require('../../models');
const { JWT_TOKEN } = require('../../initializers/passport'); // TODO - as env. variable

const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // one week - TODO - as env. variable

module.exports = {
  EXPIRATION_TIME,
  userRegister(req, res) {
    User.create(req.body)
      .then(user => res.status(201).send(user))
      .catch(error => {
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
        expirationDate: new Date(Date.now() + EXPIRATION_TIME),
      }, JWT_TOKEN);

      res.status(200).send({ token });
    },
  ]),
  getAccount: compose([
    passport.authenticate('bearer'),
    (req, res) => res.status(200).send(req.user),
  ]),
};
