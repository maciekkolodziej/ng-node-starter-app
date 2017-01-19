const { User } = require('../../models');

require('should');

describe('user model', () => {
  it('should exist', (done) => {
    User.create({
      username: 'JohnDoe',
      password: 'password',
    }).then((user) => {
        user.should.be.ok;
        done();
      });
  });
});
