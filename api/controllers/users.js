const bcrypt = require('bcrypt');

const { User } = require('../../models');
const passport = require('../../initializers/passport');

const SALT_ROUNDS = 10;

function login(req, res, next) {
  return passport.authenticate('local', (error, user) => {
    if (error) { return res.status(401).send(error); }
    if (!user) { return res.status(401).json('Not authorized'); }

    return res.status(200).json(user);
  })(req, res, next);
}

function userRegister(req, res) {
  const { username, password } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then(hashedPass => User.create({ username, password: hashedPass }))
    .then(user => user.save())
    .then(user => res.status(201).send(user))
    .catch(error => res.status(500).send(error));
}

module.exports = {
  userRegister,
  login,
};
