const User = require('../models/User');
const hashUserPassword = require('../utils/hashUserPassword');
const uuid = require('uuid/v1');
const _ = require('lodash');
const {ENV, VERIFY_USERS, EMAIL_ADMIN} = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');
const sendMail = require('../services/sendgrid/sendMail');

async function registerUserController(req, res) {
    const response = buildResponseObject(req, res);

    const username = req.body.username = req.sanitize(req.body.username);
    const email = req.body.email = req.sanitize(req.body.email);
    const password = req.body.password = req.sanitize(req.body.password);

    const {error} = User.validateRegistrationRequest(req.body);
    if (error) return res.status(400).json({error: error.message});

    let foundUser = await User.findOne({email});
    if (foundUser) return res.status(400).json({error: req.localization.translate('User with this email already exists')});
    foundUser = await User.findOne({username});
    if (foundUser) return res.status(400).json({error: req.localization.translate('User with this username already exists')});

    const hashedPassword = await hashUserPassword(password);
    const user = new User({
        username,
        email,
        roles: ['member'],
        isActive: VERIFY_USERS ? false : true,
        password: hashedPassword,
        activationToken: uuid()
    });

    const createdUser = await user.save();
    if (!createdUser) return res.status(400).json({error: req.localization.translate('Error saving user')});

    if (VERIFY_USERS) {
        try {
            sendMail({
                key: 'userRegisterEmailTemplate',
                to: createdUser.email,
                from: EMAIL_ADMIN,
                context: {user: createdUser}
            });
        } catch (e) {
            console.log(e);
        }
    }

    response.addMessage('success', req.localization.translate('You\'ve successfully registered'));

    if (ENV === 'development') {
        response.user = createdUser;
    } else {
        response.user = _.pick(createdUser, ['_id', 'username', 'email', 'isActive', 'activationToken'])
    }

    res.status(200).json(response.logTime());
};

module.exports = registerUserController;
