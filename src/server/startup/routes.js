const usersApiRoutes = require('../routes/api/v1/users');

const handleError404 = require('../middlewares/error404');
const handleError500 = require('../middlewares/error500');

module.exports = function (app) {
    app.use('/api/v1', usersApiRoutes);

    app.use(handleError404); //handle 404 error
    app.use(handleError500); //handle 500 error

    return app;
};
