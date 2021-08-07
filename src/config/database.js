const Sequelize = require('sequelize');
// creating our sequlize instance
const sequelize = new Sequelize('hoaxify', 'my-db-user', 'db-pass', {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

module.exports = sequelize;
