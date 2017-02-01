'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var config    = require('config');
var basename  = path.basename(module.filename);
var db        = {};

const DB_CONFIG = config.get('db');

if (DB_CONFIG.use_env_variable) {
  var sequelize = new Sequelize(process.env[DB_CONFIG.use_env_variable]);
} else {
  var sequelize = new Sequelize(DB_CONFIG.name, DB_CONFIG.username, DB_CONFIG.password, DB_CONFIG);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
