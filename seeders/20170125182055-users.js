'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: function (queryInterface, Sequelize) {
    const users = [...Array(10)].map((item, index) => ({
      username: `user${index}`,
      password: bcrypt.hashSync('password', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert('Users', users, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
