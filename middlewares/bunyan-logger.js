// bunyan - we have rotating log files for free and also amount of back in time copies
// pretty-printing is available in CLI mode

const bunyan = require('bunyan')

const requestSerializer = (req) => {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers
  };
}

const logger = bunyan.createLogger({ 
  name: 'props-node',
  serializers: { req: requestSerializer },
  streams: [{
    stream: process.stdout
  }, {
    type: 'rotating-file',
    path: 'logs/props-node.log',
    period: '1d'
    //we can specify also 'count' here which is amount of kept back copies
  }]
});

const loggerMiddleware = (level) => {
  return (req, res, next) => {
    level ? logger[level]({ req }) : logger.info({ req });
    
    next();  
  }
}

module.exports = loggerMiddleware;
