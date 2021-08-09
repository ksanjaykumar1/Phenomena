// A model is an abstraction that represents a table in your database. In Sequelize, it is a class that extends Model.
// The model tells Sequelize several things about the entity it represents, such as the name of the table in the database and which columns it has (and their data types).
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Model = Sequelize.Model;

class User extends Model {}

User.init(
  {
    username: {
      type: Sequelize.DataTypes.STRING,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    inactive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    activationToken: {
      type : Sequelize.STRING
    }
  },
  {
    sequelize,
    modelName: 'user',
  }
);

module.exports = User;
