# Node.js Starter App
[![CircleCI](https://circleci.com/gh/netguru/ng-node-starter-app.svg?style=svg&circle-token=e9e20e72111fea648cfc150acf1206f694dcc954)](https://circleci.com/gh/netguru/ng-node-starter-app)

A boilerplate for Node.js REST API back-ends.

## Features

- Specification-first routing & validation sourced from [Swagger](http://swagger.io/) specification.
- Basic [Sequelize](http://sequelizejs.com) ORM setup with functional, tested User model.
- Working, tested registration/login/account endpoints.
- [Passport.js](http://passportjs.org/) with [Local](https://github.com/jaredhanson/passport-local) (username + password), [Bearer](https://github.com/jaredhanson/passport-http-bearer) (JSON Web Tokens) authentication strategies.
- Configuration based on environment variables loaded from `.env.*` files.
- Robust logging system with daily log rotation file.
- Functional [Dockerfile](https://docs.docker.com/engine/reference/builder/) to launch application within [Docker](https://www.docker.com/) container (most likely deployment scenario).

## Technology stack

Key pillars of chosen application stack are:
* [swagger-node](https://github.com/swagger-api/swagger-node) - specification-first routing, request validation, using [Express](https://expressjs.com/) underneath.
* [Sequelize](http://sequelizejs.com) - promise-based SQL ORM, used for interacting with PostgreSQL database. Expect to use [sequelize-cli](https://github.com/sequelize/cli) for most common database-related tasks.

It's key to get properly acquainted with them before starting development of any application seeded from this repository - follow links provided above and make sure that you understand their basic usage patterns.

Additionally, several other dependencies are installed and chosen to be universally used:
* [Passport](http://passportjs.org/) - de-facto standard authentication middleware in Node.js
* [node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) - used for hashing passwords associated with example User model
* [node-jwt-simple](https://github.com/hokaccha/node-jwt-simple) - encoding/decoding JSON Web Tokens, used for basic route authentication
* [dotenv](https://github.com/motdotla/dotenv) - loading of environment variables from `.env.*` files, where environment-specific configuration options are being held.
* [SuperTest](https://github.com/visionmedia/supertest) - request-based controller tests.
* [should.js](https://github.com/shouldjs/should.js) - test assertion library. (Note: other assertion styles are by no means forbidden.)
* [nodemon](https://github.com/remy/nodemon) - Node.js process manager, if any files change, nodemon will automatically restart your node application.

## Basic setup

To get base application up and running, make sure you have recent versions of [Node.js](https://nodejs.org/en/) and [PostgreSQL database](https://www.postgresql.org) installed locally, then execute following commands in your terminal:

```bash
npm install # install all dependencies listed in package.json file
npm install -g swagger sequelize-cli # install CLI tools necessary for development
cp .env.development.sample .env.development
cp .env.test.sample .env.test
```

Now you'll need to create development, test databases and their user(s). Using default settings from sample `.env.*` files and CLI wrappers around basic PostgreSQL SQL statements ([createuser](https://www.postgresql.org/docs/current/static/app-createuser.html), [createdb](https://www.postgresql.org/docs/current/static/app-createdb.html)):

```bash
createuser root
createdb database_development
createdb database_test
```

Run database migrations, using [sequelize-cli](https://github.com/sequelize/cli):

```bash
sequelize db:migrate
NODE_ENV=test sequelize db:migrate
```

That's it! Now you should be able to run automated application tests using `npm test` command, or start API server running locally with `nodemon` (by default listening on port 10010).

## Application structure

```
.
├── api
|    ├── controllers    # actual API request handlers
|    └── swagger        # current API Swagger specification is held here (swagger.yaml file)
├── initializers        # single-run setup operations - to be required in main app.js file upon application launch
├── middlewares         # custom middlewares
├── config              # files exporting configuration options - config.js being main one
├── models              # Sequelize models, including index.js file properly loading and grouping them
├── migrations          # Sequelize database migrations
├── seeders             # Sequelize database seeds
└── test                # tests for controllers, models, other logical units - within properly reflected file structure
```

It's strongly encouraged to follow above file structure for already defined logical units. It's perfectly allowed to extend it as seen fit during actual development. Good example of this may be service objects - an example one likely held as `api/services/some-service.js`, with unit tests describing it located under `test/api/services/some-service.spec.js`.

## Code style

Follow [Airbnb style guide](https://github.com/airbnb/javascript). [ESLint](http://eslint.org/) together with [Airbnb base config](https://www.npmjs.com/package/eslint-config-airbnb-base) is set-up to lint your code.

## Common development scenarios

Following are some of the most common, practical scenarios that will probably happen in day-to-day development.

### New resource with basic CRUD endpoints

1. Execute `npm edit` command. This will launch and open editor for Swagger definition describing your API. Assuming _Prop_ resource, you'd most likely want to describe following endpoints:
- `POST /props` - create a _Prop_
- `GET /props` - fetch list of existing _Props_
- `GET /props/:id` - fetch specific _Prop_
- `PUT /props/:id` - edit an existing _Prop_
- `DELETE /props/:id` - delete an existing _Prop_

Refer to existing documentation for _User_-related endpoints and [Swagger specification docs](http://swagger.io/specification/) for more detailed information.

2. Create controller file defining route handlers for described endpoints. These files should reside in `api/controllers` directory and follow resource-based naming pattern, i.e. `api/controllers/props.js`. See `api/controllers/users.js` file for example implementation.
3. Create test file for your controller - i.e. `test/api/controllers/props.js`.
4. Add actual handler implementations (in i.e. `api/controllers/props.js` file) file together with request-based tests (in i.e. `test/api/controllers/props.js` file).

### New database-backed data model

1. Use [sequelize-cli](https://github.com/sequelize/cli) `model:create` command to generate initial model-defining file in `models/` directory together with corresponding database migration in `migrations/` directory. Example for basic _Prop_ model may look like this:
```bash
sequelize model:create --name Prop --attributes 'text:string'
```
2. Execute created database migration:
```bash
sequelize db:migrate
```
3. Create corresponding model test file, i.e. `test/models/prop.spec.js`
4. Add custom model methods, tests for them as necessary.
5. Created model is now available as export of `models/index.js` file:
```javascript
const { Prop } = require('./models');
```
See [Sequelize model usage docs](http://docs.sequelizejs.com/en/latest/docs/models-usage/) for further details on its usage.

### Changes to existing database-backed data model

1. Use [sequelize-cli](https://github.com/sequelize/cli) `migration:create` command to generate placeholder database migration file in `migrations/` directory:
```bash
sequelize migration:create --name "add-first-name-to-user"
```
2. Modify created file with timestamp, i.e. `migrations/20170101111111-add-first-name-to-user.js`, to apply necessary database structure changes - see [appropriate section](http://docs.sequelizejs.com/en/v3/docs/migrations/#functions) in Sequelize documentation.
3. Apply created database migration, or rollback as necessary:
```bash
sequelize db:migrate # executes all migrations
sequelize db:migrate:undo # reverts latest database migration
```

### Custom middleware (global/per-route)

1. Create new `.js` file in `middlewares` directory.
2. Define your own middleware function inside and export it.
3. Globally used middleware: require that file in `app.js` file and use it like this:
```javascript
app.use(customMiddleware);
```
4. Per-route middleware: require that file in your controller file, i.e. `api/controllers/users.js`, and compose controller action using bundled [compose-middleware](https://github.com/blakeembrey/compose-middleware) helper:
```javascript
module.exports = {
  someAction: compose([
    customMiddleware,
    function(req, res) { res.status(200).send(...) },
  ]),
};
```

### Adding custom configuration

1. Add appropriate key/value pair to your `.env.*` and `.env.*.sample` files, i.e.:
```
SOME_SERVICE_TOKEN=123
```
2. Edit `config/config.js` file to pass it through from `process.env` object, optionally marking as required (see `REQUIRED_KEYS` array).
3. Wherever you need to use your new config option - simply require it, i.e.:
```javascript
const { SOME_SERVICE_TOKEN } = require('../config/config');
```

## Contributing

If something is unclear, confusing, or needs to be refactored, please let us know. Pull requests are always welcome, but note the minimalistic nature of the repository - it's designed as lean, universal starting point for actual projects, and nothing more.

## License
The MIT License (MIT)

Copyright (c) 2017 [netguru.co](http://netguru.co)
