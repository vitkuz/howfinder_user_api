const User = require('../models/User');
const { ENV } = require('../../../config/config');

const buildResponseObject = require('../utils/buildResponseObject');
const { getEntities } = require('../utils/Entity');
const validateListQuery = require('../utils/validateListQuery');
const createPagination = require('../utils/createPagination');

async function listUserController(req, res) {
    const response = buildResponseObject(req,res);
    const startTime = Date.now();

    let { limit, page, skip, sort } = validateListQuery(req);
    const users = await getEntities(User, limit, page, skip, sort);

    const countDocuments = await User.find({}).countDocuments();
    const pagination = createPagination(countDocuments, page, limit);

    const time = Date.now() - startTime;

    if (response.users.length > 0) {
        response.users = users;
    } else {
        response.users = [];
    }

    res.status(200).json({
        meta: {
            limit,
            page,
            skip,
            sort
        },
        pagination,
        time: time+'ms'
    });
}

module.exports = listUserController;
