const Sequelize = require('sequelize');
const config = require('config');
// to get the configuration from the config folder at the start
// in package.json we wrote a script which set the node envirnonment
// For development , NODE_ENV is set to development which passed to index which in turn passes to app, then config selects the development.json from the config folder
// For test, NODE_ENV is set test 
const dbConfig = config.get('database');

// creating our sequlize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: false,
});

module.exports = sequelize;
