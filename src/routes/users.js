const express = require('express');
const router = express.Router();
const { register } = require('../controller/users');

const validateUsername = (req, res, next) => {
  const user = req.body;
  if (user.username === null) {
    return res.status(400).send({
      validationErrors: {
        username: 'Username cannot be null',
      },
    });
  }
  next();
};

router.post('/', validateUsername, register);

module.exports = router;
