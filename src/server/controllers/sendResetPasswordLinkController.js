const User = require('../models/User');
const uuid = require('uuid/v1');
const _ = require('lodash');

const { ENV } = require('../../../config/config');
const buildResponseObject = require('../utils/buildResponseObject');

// const sendEmail = require('../../services/sendmail/sendMail');

async function sendResetPasswordLink(req,res) {
    const response = buildResponseObject(req,res);

    const email = req.body.email = req.sanitize(req.body.email);

    let { error } = User.validateSendPasswordLinkRequest(req.body);
    if (error) return res.status(400).json({error: error.message});

    let foundUser = await User.findOne({email});
    if (!foundUser) return res.status(400).json({error: 'There is no user with this email'});

    foundUser.set({
        resetPasswordToken: uuid(),
    });

    const updatedUser = await foundUser.save();
    if (!updatedUser) return res.status(400).json({error: 'Error saving user'});

    // sendEmail('userResetPasswordTemplate', {user:found});
    response.messages.success.push({ text: 'We\'ve send you a letter with rest link' });

    if (ENV === 'development') {
        response.user = updatedUser;
    } else {
        response.user = _.pick(updatedUser, ['_id', 'username', 'email', 'isActive', 'resetPasswordToken']);
    }

    return res.status(200).json(response);

};

module.exports = sendResetPasswordLink;
