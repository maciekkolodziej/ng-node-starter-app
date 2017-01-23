const passport = require('passport');
const jwt = require('jwt-simple');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const { User } = require('../models');

const JWT_TOKEN = 'secret';

passport.use(new LocalStrategy({ session: false }, (username, password, done) => {
  User.find({ where: { username } })
    .then(user => {
      if (!user) { return done(null, false); }
      return Promise.all([user, user.isValidPassword(password)]);
    })
    .then(([user, isValid]) => {
      if (!isValid) { return done(null, false); }
      return done(null, user);
    })
    .catch(done);
}));

passport.use(new BearerStrategy({ session: false }, (token, done) => {
  const decodedToken = jwt.decode(token, JWT_TOKEN);
  const userId = decodedToken && decodedToken.id;

  User.findById(userId)
    .then(user => done(null, user))
    .catch(done);
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.find({ where: { id } })
    .then(user => done(null, user))
    .catch(done);
});
