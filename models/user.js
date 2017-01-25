const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function hashPassword(user) {
  if (user.changed('password')) {
    return bcrypt.hash(user.password, SALT_ROUNDS)
      .then((hashedPass) => { user.password = hashedPass; });
  }
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
    },
    classMethods: {
      // TODO: delete lint disabling when `models` is used
      associate(models) { // eslint-disable-line no-unused-vars
        // associations can be defined here
      },
    },
    instanceMethods: {
      isValidPassword(password) {
        return bcrypt.compare(password, this.password);
      },
    },
  });
  return User;
};
