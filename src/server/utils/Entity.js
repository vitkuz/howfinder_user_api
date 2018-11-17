const mongoose = require('mongoose');

function getEntityByQuery(Model,query) {
    return new Promise((resolve, reject) => {

        Model.find({title: new RegExp(query, "gmi")}).then(docs => {
            resolve(docs)
        });
    })
}

function getEntityById(Model,id) {
    return new Promise((resolve, reject) => {
        Model.findById({_id: id }).select('-password').then(docs => {
            resolve(docs)
        });
    })
}

function getEntities(Model, limit, page, skip, sort) {
    return new Promise((resolve, reject) => {

        Model.find({})
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .then(docs => {
                resolve(docs);
            });
    })
}

function findOrCreate(fieldName = 'title', value, Model) {
    return new Promise((resolve,reject) => {

        const search = {};
        search[fieldName] = value;

        Model.findOne(search, function(err,found) {
            if(err) return console.log(err);
            if (found) {
                console.log('found',found);
                resolve(found)
            } else {
                Model.create(search, function(err,created) {
                    if(err) return console.log(err);
                    console.log('created',found);
                    resolve(created)
                })
            }
        })
    });
}

function deleteEntityById(Model,id) {
    return new Promise((resolve, reject) => {
        Model.findOneAndDelete({_id: id}, function (err, doc) {
            if (!err) {
                console.log("Deleted. deleteEntityById()");
                resolve(doc)
            }
        });
    })
}

function updateEntityById(Model, id, payload) {
    return new Promise((resolve, reject) => {
        Model.findByIdAndUpdate(id, {$set: payload}, {new: true}).then(doc => {
            resolve(doc)
        }).catch(err => console.log('Err in updateEntityById():',err));
    })
}

function getEntityByFieldValue(Model, field, value) {
    return new Promise((resolve, reject) => {

        const search = {};
        search[field] = { $in: {_id: value}};

        Model.find(search).then(docs => {
            resolve(docs)
        });
    })
}

function getNumberOf (Model) {
    return new Promise((resolve,reject) => {

        Model.countDocuments({})
            .then(docs => {
                resolve(docs)
            })
            .catch(err => console.log('Err in getNumberOf():',err));

    })
}


module.exports = {
    getNumberOf,
    getEntityByQuery,
    getEntityById,
    getEntityByFieldValue,
    deleteEntityById,
    getEntities,
    updateEntityById
}