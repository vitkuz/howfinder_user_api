const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');
const Joi = require('joi');


const {JWT_SECRET} = require('../../../config/config');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 20,
        unique: true
    },
    uuid: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    tokens: {
        activationToken: {
            type: String
        },
        resetPasswordToken: {
            type: String
        },
    },
    profile: {
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        gender: {
            type: String
        },
        birthday: {
            type: Date
        },
        picture: {
            type: String
        },
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        youtube: {
            type: String
        },
        instagram: {
            type: String
        },
        vk: {
            type: String
        },
        odnoklassniki: {
            type: String
        },
        website: {
            type: String
        },
        bio: {
            type: String
        }
    },
    following: {
        users: {},
        questions: {},
        topics: {}
    },
    settings: {
        language: {
            type: String,
            default: 'ru'
        }
    },
    stats: {},
    limits: {
        pageViewsInSession: {
            type: Number,
            default: 50
        }
    },
    // history: [
    //     {
    //         date: Date
    //     }
    // ],
    followed: {},
    roles: [{
        type: String,
        default: 'member'
    }],
    points: {
        type: Number
    },
    activated: {type: Date},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

UserSchema.pre("save", async function (next) {
    var user = this;

    if (user.uuid === '' || !user.uuid) {
        user.uuid = uuid()
    }

    //!user.isModified || !user.isNew

    next();
});

UserSchema.methods.generateToken = function () {
    const token = jwt.sign({_id: this._id, username: this.username, roles: this.roles}, JWT_SECRET);
    return token;
};

UserSchema.statics.validatePasswordChangeRequest = function (requestBody) {
    const schema = Joi.object({
        resetPasswordToken: Joi
            .string()
            .required(),
        password: Joi
            .string()
            .regex(/^[a-zA-Z0-9]{3,30}$/)
            .required()
    });

    return Joi.validate(requestBody, schema); // {error, value}
};

UserSchema.statics.validateSendPasswordLinkRequest = function (requestBody) {
    const schema = Joi.object({
        email: Joi.string().email({minDomainAtoms: 2}).required()
    });
    return Joi.validate(requestBody, schema); // {error, value}
};

UserSchema.statics.validateActivationRequest = function (requestBody) {
    const schema = Joi.object({
        activationToken: Joi.string().required()
    });
    return Joi.validate(requestBody, schema); // {error, value}
};

UserSchema.statics.validateRegistrationRequest = function (requestBody) {
    const schema = Joi.object({
        username: Joi
            .string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .label('User name'),
        password: Joi
            .string()
            .regex(/^[a-zA-Z0-9]{3,30}$/)
            .required(),
        email: Joi.string().email({minDomainAtoms: 2}).required()
    });

    return Joi.validate(requestBody, schema); // {error, value}
};

UserSchema.statics.validateLoginRequest = function (requestBody) {
    const schema = Joi.object({
        email: Joi
            .string()
            .required()
            .label('User email'),
        password: Joi
            .string()
            .regex(/^[a-zA-Z0-9]{3,30}$/)
            .required()
    });

    return Joi.validate(requestBody, schema); // {error, value}
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
