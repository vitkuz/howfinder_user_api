const express = require('express');
const router = express.Router();

const UsersRouter = require('./users/index');
const handleError404 = require('../../../middlewares/error404');
const handleError500 = require('../../../middlewares/error500');

router.use('/', UsersRouter);

router.use(handleError404); //handle 404 error
router.use(handleError500); //handle 500 error

module.exports = router;