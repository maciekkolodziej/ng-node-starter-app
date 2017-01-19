// winston - easier way to make custom formatting & timestamps

const winston = require('winston');

winston.configure({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return `[${new Date().toLocaleString()}]`;
      },
      formatter: function(options) {
        return `${options.timestamp()} ${options.level.toUpperCase()} ${(options.message ? options.message : '')}` +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
      }
    }),
    new (winston.transports.File)({ filename: './logs/props-node.log' })
  ]
});

const loggerMiddleware = (level) => {
  return (req, res, next) => {
    level ? winston[level](req) : winston.info(req.headers);
    
    next();  
  }
}

module.exports = loggerMiddleware;
