const express = require('express');
const app = express();
const users = require('./routes/users')


app.use(express.json());
app.use('/api/1.0/users',users)

module.exports = app;
