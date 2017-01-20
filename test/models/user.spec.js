const bcrypt = require('bcrypt');

const { User } = require('../../models');

const SALT_ROUNDS = 10;
const correctUser = {
  username: 'JohnDoe',
  password: 'password',
};

require('should');

describe('user model', () => {
  it('should exist', (done) => {
    User.create(correctUser).then((user) => {
      user.should.be.ok;
      done();
    });
  });

  it('hashes password before create', done => {
    User.create(correctUser)
      .then(user => bcrypt.compare(correctUser.password, user.password))
      .then(isCorrect => {
        if (isCorrect) { return done(); }
        throw new Error('Password is not hashed');
      })
      .catch(done);
  });

  it('doesn\'t update password if it wasn\'t changed', done => {
    User.create(correctUser)
      .then(user => user.update({ username: 'JaneDoe' }))
      .then(updatedUser => bcrypt.compare(correctUser.password, updatedUser.password))
      .then(isCorrect => {
        if (isCorrect) { return done(); }
        throw new Error('Password was updated');
      })
      .catch(done);
  });
});
