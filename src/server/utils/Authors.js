const Author = require('../models/Author');
const mongoose = require('mongoose');

function getAuthorsByQuery(title) {
    return new Promise((resolve, reject) => {

        Author.find({title: new RegExp(title, "gmi")}).then(authors => {
                resolve(authors)
            });

    })
}

module.exports = {
    getAuthorsByQuery: getAuthorsByQuery,
}