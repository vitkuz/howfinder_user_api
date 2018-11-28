const User = require('../models/User');
const _ = require('lodash');
const { ENV } = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');

async function verifyUserEmailController(req,res) {
    const response = buildResponseObject(req,res);

    //1 Check user exists, if exist send error
    const activationToken = req.body.activationToken = req.sanitize(req.body.activationToken);
    if (!activationToken) return res.status(400).json({error: 'Provide token'});

    const foundUser = await User.findOne({activationToken});
    if (!foundUser) return res.status(400).json({error: 'User with this token not found'});

    foundUser.set({
        activated: Date.now(),
        activationToken: '',
        isActive: true
    });

    const updatedUser = await foundUser.save();
    if (!updatedUser) return res.status(400).json({error: 'Error saving user'});

    response.addMessage('success', 'Email was verified! Now you can login');

    if (ENV === 'development') {
        response.user = updatedUser;
    } else {
        response.user = _.pick(updatedUser, ['_id', 'username', 'email', 'isActive']);
    }

    return res.status(200).json(response.logTime());

};

module.exports = verifyUserEmailController;
