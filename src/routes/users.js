const express = require('express');
const router = express.Router();
const {register} = require('../controller/users')

router.post('/',register);

module.exports = router;
