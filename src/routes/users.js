const express = require('express');
const router = express.Router();
const { register, findUserByEmail } = require('../controller/users');
const { check, validationResult } = require('express-validator');
const User = require('../model/User');

router.post(
  '/',
  check('username')
    .notEmpty()
    .withMessage('Username cannot be null')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('Must have min 4 and max 37 characters'),
  check('email')
    .notEmpty()
    .withMessage('Email cannot be null')
    .bail()
    .isEmail()
    .withMessage('E-mail is is not vaild')
    .bail()
    .custom(async (email) => {
      const user = await findUserByEmail(email);
      if (user) {
        throw new Error('E-mail in use');
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('Password cannot be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('Password must have at least 1 uppercare 1 lowercase 1 number 1 special character'),
  register
);

module.exports = router;
