const usersApiRoutes = require('../routes/api/v1/users');

module.exports = function (app) {
    app.use('/api/v1', usersApiRoutes);
    return app;
};
