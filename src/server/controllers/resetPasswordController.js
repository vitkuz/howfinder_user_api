const User = require('../models/User');
const hashUserPassword = require('../utils/hashUserPassword');
const _ = require('lodash');
const { ENV } = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');

async function resetPasswordController(req,res) {
    const response = buildResponseObject(req,res);

    const resetPasswordToken = req.body.resetPasswordToken = req.sanitize(req.body.resetPasswordToken);
    if (!resetPasswordToken) return res.status(400).json({error: req.localization.translate('Provide token')});

    const password = req.body.password = req.sanitize(req.body.password);

    let { error } = User.validatePasswordChangeRequest({
        resetPasswordToken,
        password
    });
    if (error) return res.status(400).json({error: error.message});

    const hashedPassword = await hashUserPassword(password);

    const foundUser = await User.findOne({'tokens.resetPasswordToken':resetPasswordToken});
    if (!foundUser) return res.status(400).json({error: req.localization.translate('User with this token not found')});

    foundUser.set({
        tokens: {
            resetPasswordToken: '',
        },
        password: hashedPassword,
        isActive: true
    });

    const updatedUser = await foundUser.save();
    if (!updatedUser) return res.status(400).json({error: req.localization.translate('Error saving user')});

    response.addMessage('success', req.localization.translate('Your password was successfully changed'));

    if (ENV === 'development') {
        response.user = updatedUser;
    } else {
        response.user = _.pick(updatedUser, ['_id', 'username', 'email', 'isActive']);
    }

    return res.status(200).json(response.logTime());
};

module.exports = resetPasswordController;
