const bcrypt = require('bcrypt');

const { User } = require('../../models');

const correctUser = {
  username: 'JohnDoe',
  password: 'password',
};

require('should');

describe('user model', () => {
  beforeEach(() => User.destroy({ where: {} }));

  it('should exist', (done) => {
    User.create(correctUser).then((user) => {
      user.should.be.ok;
      done();
    });
  });

  it('doesn\'t allow duplicate username', done => {
    User.create(correctUser)
      .then(() => User.create(correctUser))
      .catch(error => {
        if ('username' in error.fields) {
          return done();
        }
        done(error);
      });
  });

  it('hashes password before create', done => {
    User.create(correctUser)
      .then(user => bcrypt.compare(correctUser.password, user.password))
      .then(isCorrectPassword => {
        isCorrectPassword.should.be.ok;
        done();
      })
      .catch(done);
  });

  it('successfully updates password', done => {
    const fakePassword = 'secret';

    User.create(correctUser)
      .then(user => user.update({ password: fakePassword }))
      .then(updatedUser => bcrypt.compare(fakePassword, updatedUser.password))
      .then(isCorrectPassword => {
        isCorrectPassword.should.be.ok;
        done();
      })
      .catch(done);

  });

  it('doesn\'t update password if it wasn\'t changed', done => {
    User.create(correctUser)
      .then(user => user.update({ username: 'JaneDoe' }))
      .then(updatedUser => bcrypt.compare(correctUser.password, updatedUser.password))
      .then(isCorrectPassword => {
        isCorrectPassword.should.be.ok;
        done();
      })
      .catch(done);
  });
});
