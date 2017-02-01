'use strict';

const should = require('should');
const request = require('supertest');
const jwt = require('jwt-simple');
const config = require('config');

const server = require('../../../app');
const { User } = require('../../../models');

const JWT_TOKEN = config.get('jwt.secret');
const EXPIRATION_TIME = config.get('jwt.expirationTime');

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
        beforeEach(() => User.create(correctUser));

        it('should respond with 409 Conflict code', (done) => {
          request(server)
            .post('/api/users')
            .send(correctUser)
            .expect(409)
            .end((error) => {
              should.not.exist(error);
              done();
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

              User.findById(res.body.id)
                .then((registeredUser) => {
                  should.exist(registeredUser);
                  done();
                });
            });
        });
      });
    });

    describe('POST /users/login', () => {
      let user;

      beforeEach(() => User.create(correctUser)
          .then((createdUser) => {
            user = createdUser;
          }));

      describe('with valid password', () => {
        it('responds with token', (done) => {
          request(server)
            .post('/api/users/login')
            .send(correctUser)
            .expect(200)
            .end((error, res) => {
              should.not.exist(error);
              const token = jwt.decode(res.body.token, JWT_TOKEN);
              const userId = token.id;
              const expires = new Date(token.expirationDate);

              userId.should.eql(user.id);
              expires.should.be.above(Date.now());
              done();
            });
        });
      });

      describe('with invalid password', () => {
        it('returns 401 code', (done) => {
          request(server)
            .post('/api/users/login')
            .send({ username: user.username, password: 'wrong' })
            .expect(401)
            .end((error) => {
              should.not.exist(error);
              done();
            });
        });
      });
    });

    describe('GET /users/me', () => {
      describe('with invalid authentication token', () => {
        const token = jwt.encode({
          id: Math.floor(Math.random() * 100),
        }, JWT_TOKEN);

        it('responds with 401 Unauthorized code', (done) => {
          request(server)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .end((error) => {
              should.not.exist(error);
              done();
            });
        });
      });

      describe('with valid authentication token', () => {
        let token;
        let user;

        beforeEach(() => User.create(correctUser)
            .then((createdUser) => {
              user = createdUser;
              token = jwt.encode({
                id: user.id,
                expirationDate: new Date(Date.now() + EXPIRATION_TIME),
              }, JWT_TOKEN);
            }));

        it('responds with data of currently logged-in user', (done) => {
          request(server)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((error, res) => {
              should.not.exist(error);
              res.body.id.should.eql(user.id);

              done();
            });
        });
      });
    });
  });
});
