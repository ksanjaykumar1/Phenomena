const User = require('../model/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((error) => (validationErrors[error.param] = error.msg));
    return res.status(400).send({ validationErrors: validationErrors });
  }
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = { username, email, password: hash };
  await User.create(user);
  return res.status(200).send({ message: 'User created' });
};

const findUserByEmail = (email) => {
  return User.findOne({ where: { email: email } });
};

module.exports = {
  register,
  findUserByEmail,
};
