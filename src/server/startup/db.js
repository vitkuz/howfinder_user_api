const mongoose = require('mongoose');
const { MONGO_URI } = require('../../../config/config');

module.exports = function(app) {
    mongoose.connect(MONGO_URI, {useNewUrlParser: true}).then(() => {
        console.log('Connected to database');
    }).catch(err => console.log('Can\'t connect to db', err));
}
