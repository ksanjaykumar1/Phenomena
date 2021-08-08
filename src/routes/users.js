const express = require('express');
const router = express.Router();
const { register } = require('../controller/users');
const { check, validationResult } = require('express-validator');

router.post(
  '/',
  check('username').notEmpty().withMessage('Username cannot be null'),
  check('email').notEmpty().withMessage('Email cannot be null'),
  register
);

module.exports = router;
