const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const { User } = require('../../../models');

const correctUser = {
  username: 'JohnDoe',
  password: 'password',
};

describe('controllers', () => {
  describe('users', () => {
    beforeEach(() => User.destroy({ where: {} }));

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

      describe('with existing username', () => {
        it('should respond with 409 Conflict code', done => {
          User.create(correctUser)
            .then(() => {
              request(server)
                .post('/api/users')
                .send(correctUser)
                .expect(409)
                .end(error => {
                  should.not.exist(error);
                  done();
                });
            });
        });
      });

      describe('with correct params', () => {
        it('should create and respond with new user account', (done) => {
          request(server)
            .post('/api/users')
            .send(correctUser)
            .expect(201)
            .end((err, res) => {
              should.not.exist(err);

              res.body.username.should.eql(correctUser.username);

              User.find({ where: { id: res.body.id } })
                .then((registeredUser) => {
                  should.exist(registeredUser);
                  done();
                });
            });
        });
      });
    });


    describe('POST /users/login', () => {
      describe('with valid parameters', () => {
        it('responds with token', done => {
          User.create(correctUser)
            .then(() => {
              request(server)
                .post('/api/users/login')
                .send(correctUser)
                .expect(200)
                .end((error, res) => {
                  should.not.exist(error);
                  should.exist(res.body.token);
                  done();
                });
            });
        });
      });

      describe('with invalid parameters', () => {
        it('returns 401 code', done => {
          User.create(correctUser)
            .then(() => {
              request(server)
                .post('/api/users/login')
                .send({ username: correctUser.username, password: 'wrong' })
                .expect(401)
                .end(error => {
                  should.not.exist(error);
                  done();
                });
            });
        });
      });
    });

  });
});
