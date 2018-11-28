const { AUTH_API_KEY } = require('../../../config/config');

module.exports = function isAuthorized(req, res, next) {
    const apiKey = req.query.apiKey = req.sanitize(req.query.apiKey);
    if (apiKey === AUTH_API_KEY) {
        next();
    } else {
        return res.send('You didn\'t provided valid auth key');
    }
};
