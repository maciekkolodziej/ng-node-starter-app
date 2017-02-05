'use strict';

const bunyan = require('bunyan');

const requestSerializer = req => ({
  method: req.method,
  url: req.url,
  headers: req.headers,
});

const logger = bunyan.createLogger({
  name: 'ng-node-starter-app',
  serializers: { req: requestSerializer },
  streams: [{
    stream: process.stdout,
  }, {
    type: 'rotating-file',
    path: 'logs/ng-node-starter-app.log',
    period: '1d',
  }],
});

const loggerMiddleware = level => (req, res, next) => {
  logger[level || 'info']({ req });
  next();
};

module.exports = loggerMiddleware;
