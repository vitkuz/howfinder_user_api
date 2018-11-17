const express = require('express');
const router = express.Router();

const isAuthorized = require('../../../../middlewares/isAuthorized');
const asyncWrapper = require('../../../../middlewares/asyncWrapper');

const loginUserController = require('../../../../controllers/loginUserController');
const getUserController = require('../../../../controllers/getUserController');
const registerUserController = require('../../../../controllers/registerUserController');
const deleteUserController = require('../../../../controllers/deleteUserController');
const verifyUserEmailController = require('../../../../controllers/verifyUserEmailController');
const sendResetPasswordLinkController = require('../../../../controllers/sendResetPasswordLinkController');
const resetPasswordController = require('../../../../controllers/resetPasswordController');
const updateUserController = require('../../../../controllers/updateUserController');
const listUsersController = require('../../../../controllers/listUsersController');


router.post('/user/login', isAuthorized, asyncWrapper(loginUserController));
router.post('/user/register', isAuthorized, asyncWrapper(registerUserController));

router.post('/user/verify', isAuthorized, asyncWrapper(verifyUserEmailController));

router.post('/user/reset/password', isAuthorized, asyncWrapper(resetPasswordController));
router.post('/user/send/password', isAuthorized, asyncWrapper(sendResetPasswordLinkController));

// /api/v1/users
router.get('/users', isAuthorized, asyncWrapper(listUsersController));
router.post('/users', isAuthorized, asyncWrapper(registerUserController));

router.get('/users/:id', isAuthorized, asyncWrapper(getUserController));

router.delete('/users/:id', isAuthorized, asyncWrapper(deleteUserController));
router.put('/users/:id', isAuthorized, asyncWrapper(updateUserController));

module.exports = router;
