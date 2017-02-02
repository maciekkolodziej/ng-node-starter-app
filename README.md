# Node.js Starter App
[![CircleCI](https://circleci.com/gh/netguru/ng-node-starter-app.svg?style=svg&circle-token=e9e20e72111fea648cfc150acf1206f694dcc954)](https://circleci.com/gh/netguru/ng-node-starter-app)

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

#### Prepare configuration:
```
cp .env.development.example .env.development
```
And then fill necessary variables

#### Edit swagger definition:
```
swagger project edit
```

#### Migrations and seeding
Create migration file:
```
npm run create-migration
```
Create seed file:
```
npm run create-seed
```
Seed database:
```
npm run seed
```
Migrate database:
```
npm run migrate
```

### Run the server
```
swagger project start
```

Project will automatically live-reload (triggered by any `*.js` file changes)


#### Test
```
npm run test
```

## Modules

| Module        | Purpose                                                    |
|:--------------|:----------------------------------------------------------:|
| Express       | Minimalistic Core framework wrapping Node.js internals     |
| Passport      | Authentication, authorization, oauth                       |
| PG            | Postgres database driver                                   |
| Sequelize     | SQL ORM & migrations                                       |
| JWT-simple    | Json Web Tokens generator and validator                    |
| Eslint        | Code style vertification                                   |
| Should        | Assertions library                                         |
| Supertest     | REST API calls/integration testing                         |

## Guides
#### Creating model
1. Run `npm run create-migration`
2. Rename created file (``) to something meaningful but maintain timestamp at the beggining of the file
3. Edit schema definition inside the file. More on that [here](http://docs.sequelizejs.com/en/v3/docs/migrations/).
4. Run `sequelize db:migrate` in order to alter database
5. [Create model definition](http://docs.sequelizejs.com/en/v3/docs/models-definition/) inside `/models` directory. 
6. Now you can import your model in controller or any other file like this:
```
const { YourNewModel } = require('../../models');
```

How to create, read, update, delete models: [Sequelize Docs](http://docs.sequelizejs.com/en/v3/docs/querying/)

#### Creating route and controller

#### Adding middleware

#### Adding new environment variables


## Contributing
If something is unclear, confusing, or needs to be refactored, please let us know. Pull requests are always welcome, but due to the minimalistic nature of this project, We wouldn't accept all of them.

## License
The MIT License (MIT)

Copyright (c) 2017 [netguru.co](http://netguru.co)
