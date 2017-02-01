# Node.js Starter App

A boilerplate for Node.js REST API backends.

## Features

- Local Authentication using Email & Password
- Authentication using token bearer strategy
- Routing & validation handled by Swagger definition
- Authenticated routes integrated with Swagger
- Boilerplate for Models, Controllers & Tests
- `.env` or environment variables driven configuration
- Robust logging system with daily log rotation file
- Fully dockerized

## How to use

#### Prerequisities
- [Node.js](https://nodejs.org/en/) (_preferably latest LTS_)
- [Postgres](https://www.postgresql.org)
- [swagger-node] (https://github.com/swagger-api/swagger-node) (installed globally)

#### Install the Node dependencies:
```
npm instal -g swagger
npm install
```

If you're running production you can skip dev dependencies by adding `--production` flag:
```
npm install --production
```

#### Edit swagger definition:
```
swagger project edit
```

#### Run the server
```
swagger project start
```

Project will automatically live-reload (triggered by any `*.js` file changes)


#### Test
```
npm run test
```

## Contributing
If something is unclear, confusing, or needs to be refactored, please let us know. Pull requests are always welcome, but due to the minimalistic nature of this project, We wouldn't accept all of them.

## License
The MIT License (MIT)

Copyright (c) 2017 [netguru.co](http://netguru.co)
