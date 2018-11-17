const User = require('../models/User');
const ERRORS = require('../../../config/constants/errors');
const { ENV } = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');
const { getEntityById } = require('../utils/Entity');

async function getUserController(req,res) {
    const response = buildResponseObject(req,res);

    const id = req.sanitize(req.params.id);

    let foundUser = await User.findById(id);
    if (!foundUser) {
        return res.status(400).json({error: 'User not found'});
    }

    if (ENV === 'development') {
        response.user = foundUser;
    } else {
        response.user = _.pick(foundUser, ['_id','username','email','limits']);
    }

    res.status(200).json(response);

};

module.exports = getUserController;