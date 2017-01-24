const should = require('should');
const request = require('supertest');
const jwt = require('jwt-simple');

const server = require('../../../app');
const { User } = require('../../../models');

const { JWT_TOKEN } = require('../../../initializers/passport');
const { EXPIRATION_TIME } = require('../../../api/controllers/users');
const correctUser = {
  username: 'JohnDoe',
  password: 'password',
};

describe('controllers', () => {
  describe('users', () => {
    beforeEach(done => {
      User.destroy({ where: {} })
        .then(() => User.create(correctUser))
        .then(() => done());
    });

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

      describe('with correct params', () => {
        it('should create and respond with new user account', (done) => {
          const user = { username: 'user', password: 'pass' };

          request(server)
            .post('/api/users')
            .send(user)
            .expect(201)
            .end((err, res) => {
              should.not.exist(err);

              res.body.username.should.eql(user.username);

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
      describe('with valid password', () => {
        it('responds with token', done => {
          request(server)
            .post('/api/users/login')
            .send(correctUser)
            .expect(200)
            .end((error, res) => {
              should.not.exist(error);
              const token = jwt.decode(res.body.token, JWT_TOKEN);
              const userId = token.id;
              const expires = Date.parse(token.expirationDate);

              User.findById(userId)
                .then(user => {
                  should.exist(user);
                  expires.should.be.above(Date.now());
                  done();
                });
            });
        });
      });

      describe('with invalid password', () => {
        it('returns 401 code', done => {
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

    describe('GET /users', () => {
      describe('with valid authentication token', () => {
        let token;
        beforeEach(done => {
          User.find({ where: { username: correctUser.username } })
            .then(user => {
              token = jwt.encode({
                id: user.id,
                expirationDate: new Date(Date.now() + EXPIRATION_TIME),
              }, JWT_TOKEN);

              done();
            });
        });

        it('responds with users', done => {
          request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((error, res) => {
              should.not.exist(error);

              User.findAll()
                .then(users => {
                  res.body.length.should.eql(users.length);
                  done();
                });
            });
        });
      });

      describe('with invalid authentication token', () => {
        const token = jwt.encode({
          id: Math.floor(Math.random() * 100),
        }, JWT_TOKEN);

        it('responds with 401 Unauthorized code', done => {
          request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
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
