const { User } = require('../../models');

require('should');

describe('user model', () => {
  it('should exist', (done) => {
    User.create({})
      .then((user) => {
        user.should.be.ok;
        done();
      });
  });
});
