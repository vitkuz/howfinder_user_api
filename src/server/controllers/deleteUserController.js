const User = require('../models/User');

const { ENV } = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');
const { deleteEntityById } = require('../utils/Entity');

async function deleteUserController(req,res) {
    const response = buildResponseObject(req,res);
    const id = req.sanitize(req.params.id);

    const deletedUser = await User.findOneAndDelete({_id: id});
    if (!deletedUser) {
        return res.status(400).json({error: 'User not found'});
    }

    response.messages.success.push({ text: "User was deleted!" });

    if (ENV === 'development') {
        response.user = deletedUser;
    } else {
        response.user = _.pick(deletedUser, ['_id','username','email','limits']);
    }
    res.status(200).json(response);
}

module.exports = deleteUserController;
