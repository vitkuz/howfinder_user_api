const User = require('../models/User');
const hashUserPassword = require('../utils/hashUserPassword');
const uuid = require('uuid/v1');
const _ = require('lodash');
const { ENV } = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');

// const sendEmail = require('../../services/sendmail/sendMail');

async function registerUserController(req,res) {
    const response = buildResponseObject(req,res);

    const username = req.body.username = req.sanitize(req.body.username);
    const email = req.body.email = req.sanitize(req.body.email);
    const password = req.body.password = req.sanitize(req.body.password);

    const { error } = User.validateRegistrationRequest(req.body);
    if (error) return res.status(400).json({error: error.message});

    const foundUser = await User.findOne({email});
    if (foundUser) return res.status(400).json({error: 'Err: User found in database'});

    const hashedPassword = await hashUserPassword(password);
    const user = new User({
        username,
        email,
        roles:['member'],
        isActive: true, // <-------- change to false
        password: hashedPassword,
        activationToken: uuid()
    });


    const createdUser = await user.save();
    if (!createdUser) return res.status(400).json({error: 'Error saving user'});


    // sendEmail('userRegisterEmailTemplate', {user:created});

    response.addMessage('success', 'You\'ve successfully registered!');

    if (ENV === 'development') {
        response.user = createdUser;
    } else {
        response.user = _.pick(createdUser, ['_id', 'username', 'email', 'isActive','activationToken'])
    }

    res.status(200).json(response.logTime());
};

module.exports = registerUserController;
