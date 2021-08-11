const User = require('../model/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const Email = require('./email');
const sequelize = require('../config/database');
const EmailException = require('../errors/EmailException')
const generateToken = (length) => {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
};
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors.array().forEach((error) => (validationErrors[error.param] = error.msg));
      return res.status(400).send({ validationErrors: validationErrors });
    }
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = { username, email, password: hash, activationToken: generateToken(16) };
    const transaction = await sequelize.transaction();
    // returns the transaction
    await User.create(user, { transaction });

    try {
      await Email.sendAccountActivation(email, user.activationToken);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw new EmailException();
    }
    return res.status(200).send({ message: 'User created' });
  } catch (err) {
    return res.status(502).send({ message: err.message });
  }
};

const findUserByEmail = (email) => {
  return User.findOne({ where: { email: email } });
};

module.exports = {
  register,
  findUserByEmail,
};
