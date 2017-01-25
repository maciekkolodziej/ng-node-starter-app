const bcrypt = require('bcrypt');

const { User } = require('../../models');

const correctUser = {
  username: 'JohnDoe',
  password: 'password',
};

require('should');

describe('user model', () => {
  let user;

  beforeEach(() => User.destroy({ where: {} })
      .then(() => User.create(correctUser))
      .then((createdUser) => { user = createdUser; }));

  it('should exist', (done) => {
    user.should.be.ok();
    done();
  });

  describe('validations', () => {
    it('doesn\'t allow duplicate username', (done) => {
      User.create(correctUser)
        .catch((error) => {
          error.fields.should.have.property('username');
          done();
        });
    });
  });

  describe('password hashing', () => {
    it('hashes password when creating new user', () => {
      bcrypt.compareSync(correctUser.password, user.password)
        .should.be.ok();
    });

    it('successfully updates password', (done) => {
      const newPassword = 'secret';

      user.update({ password: newPassword })
        .then((updatedUser) => {
          bcrypt.compareSync(newPassword, updatedUser.password)
            .should.be.ok();
          done();
        })
        .catch(done);
    });

    it('doesn\'t update password if it wasn\'t changed', (done) => {
      user.update({ username: 'JaneDoe' })
        .then((updatedUser) => {
          bcrypt.compareSync(correctUser.password, updatedUser.password)
            .should.be.ok();
          done();
        })
        .catch(done);
    });
  });

  describe('isValidPassword method', () => {
    it('returns true for valid password', (done) => {
      user.isValidPassword(correctUser.password)
        .then((isValid) => {
          isValid.should.be.ok();
          done();
        })
        .catch(done);
    });

    it('returns false for invalid password', (done) => {
      user.isValidPassword('invalid')
        .then((isValid) => {
          isValid.should.not.be.ok();
          done();
        })
        .catch(done);
    });
  });
});
