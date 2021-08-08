const User = require('../model/User');
const bcrypt = require('bcrypt');

const register =async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = { ...req.body, password: hash };
    await User.create(user);
    return res.status(200).send({ message: 'User created' });
  }

module.exports = {
    register
}