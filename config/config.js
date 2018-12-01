const config  = {
    all: {
        ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3000,
        HOST: process.env.HOST || 'http://localhost:3000',
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        AUTH_API_KEY: process.env.AUTH_API_KEY,
        VERIFY_USERS: process.env.VERIFY_USERS,
        JWT_SECRET: process.env.JWT_SECRET,
        WEBSITENAME: process.env.WEBSITENAME,
        EMAIL_ADMIN: process.env.EMAIL_ADMIN,
    },
    development: {
        MONGO_URI: process.env.MONGO_URI,
        SENDGRID_USER: process.env.SENDGRID_USER,
        SENDGRID_KEY: process.env.SENDGRID_KEY
    },
    staging: {
        MONGO_URI: process.env.MONGO_URI,
        SENDGRID_KEY: process.env.SENDGRID_KEY
    },
    testing: {

    }
};

const final = Object.assign({}, config.all, config[process.env.NODE_ENV]);
console.log(final);
module.exports = final;