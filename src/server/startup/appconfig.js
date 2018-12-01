const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const expressSanitizer = require('express-sanitizer');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const responseTime = require('response-time');
const express = require('express');

const setLocele = require('../middlewares/setLocale')

const { ENV, PORT, MONGO_URI, EXPRESS_SESSION_SECRET } = require('../../../config/config');

module.exports = function (app) {

    app.use(cors());
    app.use(helmet());

    // app.use(compression());
    // app.use(responseTime());

    app.disable('x-powered-by');

    app.set('port', PORT);
    app.set('trust proxy', true);


    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: true}))
    // parse application/json
    app.use(bodyParser.json());

    // Mount express-sanitizer here

    app.use(cookieParser());
    app.use(setLocele);


    app.use(expressSanitizer());

    return app;
};