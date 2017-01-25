'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var users = [...Array(10).keys()].map(function(index) {
      return {
        username: `user${index}`,
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('Users', users, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {}, { primartKeys: [], primaryKeyAttributes:[] });
  }
};
