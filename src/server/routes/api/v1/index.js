const express = require('express');
const router = express.Router();

const UsersRouter = require('./users/index');

router.use('/', UsersRouter);

module.exports = router;