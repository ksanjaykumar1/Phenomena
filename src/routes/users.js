const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

router.post('/', (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = { ...req.body, password: hash };
    User.create(user).then(() => {
      return res.status(200).send({ message: 'User created' });
    });
  });
});

module.exports = router;
