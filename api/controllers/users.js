const jwt = require('jwt-simple');
const passport = require('passport');

const { User } = require('../../models');

const JWT_TOKEN = 'secret';

module.exports = {
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
      const token = jwt.encode({ id: nextReq.user.id }, JWT_TOKEN);
      return res.status(200).send({ token });
    }.bind(null, req, res);

    passport.authenticate('local', { session: false })(req, res, next);
  },
  listAll(req, res) {
    const next = function (nextReq, nextRes) {
      User.findAll()
        .then(users => nextRes.status(200).send(users))
        .catch(error => nextRes.status(500).send(error));
    }.bind(null, req, res);

    passport.authenticate('bearer', { session: false })(req, res, next);
  },
};
