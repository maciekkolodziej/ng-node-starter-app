const { User } = require('../../models');

function register(req, res) {
  User.create(req.body)
    .then(user => res.status(201).send(user))
    .catch(error => res.status(500).send(error));
}

module.exports = {
  userRegister: register,
};
