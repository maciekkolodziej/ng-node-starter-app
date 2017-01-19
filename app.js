'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

var bunyanLoggerMiddleware = require('./middlewares/bunyan-logger');
var winstonLoggerMiddleware = require('./middlewares/winston-logger');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  app.use(bunyanLoggerMiddleware()); // optionally we can set log level app.use(bunyanLoggerMiddleware('warn'))
  app.use(winstonLoggerMiddleware()); // optionally we can set log level app.use(winstonLoggerMiddleware('warn'))

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
