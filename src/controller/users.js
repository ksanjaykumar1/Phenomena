const User = require('../model/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const crypto = require('crypto')
const {sendAccountActivation} =require('./email')

const generateToken =(length)=>{
    return crypto.randomBytes(length).toString('hex').substring(0,length)
}
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((error) => (validationErrors[error.param] = error.msg));
    return res.status(400).send({ validationErrors: validationErrors });
  }
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = { username, email, password: hash,activationToken: generateToken(16) };
  await sendAccountActivation(email,user.activationToken)
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
