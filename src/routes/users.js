const express = require('express');
const router = express.Router();
const { register } = require('../controller/users');

const validateUsername = (req, res, next) => {
  const user = req.body;

  if (user.username === null) {
    req.validationErrors = {
      username: 'Username cannot be null',
    };
  }
  next();
};

const validateEmail = (req, res, next) => {
  const user = req.body;
  if (user.email === null) {
    req.validationErrors = { ...req.validationErrors, email: 'Email cannot be null' };
  }
  next();
};


router.post('/', [validateUsername, validateEmail], register);

module.exports = router;
