const User = require('../models/User');

const { ENV } = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');
const { deleteEntityById } = require('../utils/Entity');

async function deleteUserController(req,res) {
    const response = buildResponseObject(req,res);
    const id = req.params.id = req.sanitize(req.params.id);

    const deletedUser = await User.findOneAndDelete({_id: id});
    if (!deletedUser) {
        return res.status(400).json({error: req.localization.translate('User not found')});
    }

    response.addMessage('success', req.localization.translate('User was deleted'));

    if (ENV === 'development') {
        response.user = deletedUser;
    } else {
        response.user = _.pick(deletedUser, ['_id','username','email','limits']);
    }
    res.status(200).json(response.logTime());
}

module.exports = deleteUserController;
