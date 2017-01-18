const { User } = require('../../models');

module.exports = {
  userRegister(req, res) {
    User.create(req.body)
      .then(user => user.save())
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  },
};
