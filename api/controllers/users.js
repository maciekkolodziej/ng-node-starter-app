const { User } = require('../../models');

module.exports = {
  userRegister(req, res) {
    User.create(req.body)
      .then(user => res.status(201).send(user))
      .catch(error => res.status(500).send(error));
  }
};
