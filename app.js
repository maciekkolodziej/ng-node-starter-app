'use strict';

const SwaggerExpress = require('swagger-express-mw');
const passport = require('passport');
const app = require('express')();

const bunyanLoggerMiddleware = require('./middlewares/bunyan-logger');
const winstonLoggerMiddleware = require('./middlewares/winston-logger');

const config = {
  appRoot: __dirname, // required config
};

require('./initializers/passport');

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  app.use(passport.initialize());
  swaggerExpress.register(app);

  app.use(bunyanLoggerMiddleware()); // optionally we can set log level app.use(bunyanLoggerMiddleware('warn'))
  app.use(winstonLoggerMiddleware()); // optionally we can set log level app.use(winstonLoggerMiddleware('warn'))

  const port = process.env.PORT || 10010;
  app.listen(port);

  console.log(`Listening on port ${port}`);
});

module.exports = app; // for testing
