const User = require('../models/User');
const uuid = require('uuid/v1');
const _ = require('lodash');

const {ENV, EMAIL_ADMIN} = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');
const sendMail = require('../services/sendgrid/sendMail');

async function sendResetPasswordLink(req, res) {
    const response = buildResponseObject(req, res);

    const email = req.body.email = req.sanitize(req.body.email);

    let {error} = User.validateSendPasswordLinkRequest(req.body);
    if (error) return res.status(400).json({error: error.message});

    let foundUser = await User.findOne({email});
    if (!foundUser) return res.status(400).json({error: req.localization.translate('There is no user with this email')});

    const token = uuid();

    foundUser.set({
        tokens: {
            resetPasswordToken: token,
        }
    });

    const updatedUser = await foundUser.save();
    if (!updatedUser) return res.status(400).json({error: req.localization.translate('Error saving user')});

    try {
        sendMail({
            key: 'userResetPasswordTemplate',
            to: updatedUser.email,
            from: EMAIL_ADMIN,
            context: {user: updatedUser}
        });
    } catch (e) {
        console.log(e);
    }

    response.addMessage('success', req.localization.translate('We\'ve sent you a letter with reset link'));

    if (ENV === 'development') {
        response.user = updatedUser;
    } else {
        response.user = _.pick(updatedUser, ['_id', 'username', 'email', 'isActive', 'resetPasswordToken']);
    }

    return res.status(200).json(response.logTime());

};

module.exports = sendResetPasswordLink;
