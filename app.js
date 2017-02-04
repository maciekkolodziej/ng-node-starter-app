'use strict';

const SwaggerExpress = require('swagger-express-mw');
const passport = require('passport');
const app = require('express')();

const loggerMiddleware = require('./middlewares/logger');

const config = {
  appRoot: __dirname, // required config
};

require('./initializers/passport');

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  app.use(passport.initialize());
  swaggerExpress.register(app);

  app.use(loggerMiddleware());

  const port = process.env.PORT || 8080;
  app.listen(port);

  console.log(`Listening on port ${port}`);
});

module.exports = app; // for testing
