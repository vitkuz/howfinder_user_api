const config  = {
    all: {
        ENV: process.env.NODE_ENV,
        PORT: process.env.PORT || 3000,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        AUTH_API_KEY: process.env.AUTH_API_KEY,
        VERIFY_USERS: process.env.VERIFY_USERS,
        JWT_SECRET: process.env.JWT_SECRET
    },
    development: {
        MONGO_URI: process.env.MONGO_URI,
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
console.log(`
APP CONFIG:
-----------
${final}`);
module.exports = final;