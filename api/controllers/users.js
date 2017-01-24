const jwt = require('jwt-simple');
const passport = require('passport');

const { User } = require('../../models');
const { JWT_TOKEN } = require('../../initializers/passport');

const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // one week

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
  login(req, res) {
    const next = function (nextReq, nextRes) {
      const token = jwt.encode({
        id: nextReq.user.id,
        expiration_date: new Date(Date.now() + EXPIRATION_TIME)
        }, JWT_TOKEN);

      return nextRes.status(200).send({ token });
    }.bind(null, req, res);

    passport.authenticate('local')(req, res, next);
  },
  listAll(req, res) {
    const next = function (nextReq, nextRes) {
      User.findAll()
        .then(users => nextRes.status(200).send(users))
        .catch(error => nextRes.status(500).send(error));
    }.bind(null, req, res);

    passport.authenticate('bearer')(req, res, next);
  },
};
