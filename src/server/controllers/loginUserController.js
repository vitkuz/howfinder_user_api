const User = require('../models/User');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { ENV } = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');

async function loginUserController(req,res) {
    const response = buildResponseObject(req,res);

    // const username = req.body.username = req.sanitize(req.body.username);
    const email = req.body.email = req.sanitize(req.body.email);
    const password = req.body.password = req.sanitize(req.body.password);

    const { error } = User.validateLoginRequest(req.body);
    if (error) return res.status(400).json({error: error.message});

    let foundUser = await User.findOne({email});
    if (!foundUser) {
        return res.status(400).json({error: 'Incorrect username or password'});
    }


    const passwordsIsEqual = await bcrypt.compare(password, foundUser.password);
    if (!passwordsIsEqual) {
        return res.status(400).json({error: 'Incorrect username or password'});
    }

    if (!foundUser.isActive) {
        return res.status(400).json({error: 'User is not active. Please verify your email'})
    };

    const jwtToken = foundUser.generateToken();

    res.header('x-auth', jwtToken);
    res.cookie('_jwt',jwtToken, { maxAge: 900000, httpOnly: true });

    response.messages.success.push({text:'You have successfully login'})

    if (ENV === 'development') {
        response.user = foundUser;
    } else {
        response.user = _.pick(foundUser, ['_id','username','email','limits']);
    }

    res.status(200).json(response);
};

module.exports = loginUserController;
