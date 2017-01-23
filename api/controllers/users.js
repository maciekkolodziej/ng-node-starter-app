const bcrypt = require('bcrypt');

const { User } = require('../../models');
const passport = require('../../initializers/passport');

const SALT_ROUNDS = 10;

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
  login(req, res, next) {
    return passport.authenticate('local', (error, user) => {
      if (error) { return res.status(401).send(error); }
      if (!user) { return res.status(401).json('Not authorized'); }

      return res.status(200).json(user);
    })(req, res, next);
  },
};
