const bcrypt = require('bcrypt');

const { User } = require('../../models');

const correctUser = {
  username: 'JohnDoe',
  password: 'password',
};

require('should');

describe('user model', () => {
  let user;
  beforeEach(done => {
    User.destroy({ where: {} })
      .then(() => User.create(correctUser))
      .then(createdUser => {
        user = createdUser;
        done()
      });
  });

  it('should exist', (done) => {
    user.should.be.ok;
    done();
  });

  it('doesn\'t allow duplicate username', done => {
    User.create(correctUser)
      .catch(error => {
        error.fields.should.have.property('username');
        done();
      });
  });

  it('hashes password before create', done => {
    bcrypt.compare(correctUser.password, user.password)
      .then(isCorrectPassword => {
        isCorrectPassword.should.be.ok;
        done();
      })
      .catch(done);
  });

  it('successfully updates password', done => {
    const fakePassword = 'secret';

    user.update({ password: fakePassword })
      .then(updatedUser => bcrypt.compare(fakePassword, updatedUser.password))
      .then(isCorrectPassword => {
        isCorrectPassword.should.be.ok;
        done();
      })
      .catch(done);

  });

  it('doesn\'t update password if it wasn\'t changed', done => {
    user.update({ username: 'JaneDoe' })
      .then(updatedUser => bcrypt.compare(correctUser.password, updatedUser.password))
      .then(isCorrectPassword => {
        isCorrectPassword.should.be.ok;
        done();
      })
      .catch(done);
  });

  it('isValidPassword returns true for valid password', done => {
    user.isValidPassword(correctUser.password)
      .then(isValid => {
        isValid.should.be.ok();
        done();
      })
      .catch(done);
  });

  it('isValidPassword returns false for invalid password', done => {
    user.isValidPassword('invalid')
      .then(isValid => {
        isValid.should.not.be.ok();
        done();
      })
      .catch(done);
  });

});
