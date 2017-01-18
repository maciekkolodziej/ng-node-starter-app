const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const { User } = require('../../../models');

describe('controllers', () => {
  describe('users', () => {
    before(() => User.destroy({ where: {} }));

    describe('POST /users', () => {
      describe('with missing password', () => {
        it('should return 400 status code', (done) => {
          request(server)
            .post('/api/users')
            .send({ username: 'JohnDoe' })
            .expect(400)
            .end((err) => {
              should.not.exist(err);
              done();
            });
        });
      });

      describe('with correct params', () => {
        it('should create and respond with new user account', (done) => {
          const userData = {
            username: 'JohnDoe',
            password: 'password',
          };
          request(server)
            .post('/api/users')
            .send(userData)
            .expect(201)
            .end((err, res) => {
              should.not.exist(err);

              res.body.username.should.eql(userData.username);

              User.find({ where: { id: res.body.id } })
                .then((registeredUser) => {
                  should.exist(registeredUser);
                  done();
                });
            });
        });
      });
    });
  });
});
