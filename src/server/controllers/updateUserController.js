const User = require('../models/User');
const _ = require('lodash');

const { ENV } = require('../../../config/config');

const hashUserPassword = require('../utils/hashUserPassword');
const buildResponseObject = require('../utils/buildResponseObject');

async function updateUserController(req,res) {
    const response = buildResponseObject(req,res);

    const id = req.params.id = req.sanitize(req.params.id);
    const username = req.body.username = req.sanitize(req.body.username);
    const email = req.body.email = req.sanitize(req.body.email);

    if (email) {
        response.messages.error.push({text:'You can\'t update email'})
    }

    let firstname, lastname, website, vk, google,
        facebook, odnoklassniki, twitter, youtube, instagram;

    if (req.body.profile) {
        firstname = req.body.profile.firstname = req.sanitize(req.body.profile.firstname);
        lastname = req.body.profile.lastname = req.sanitize(req.body.profile.lastname);
        website = req.body.profile.website = req.sanitize(req.body.profile.website);

        vk = req.body.profile.vk = req.sanitize(req.body.profile.vk);
        facebook = req.body.profile.facebook = req.sanitize(req.body.profile.facebook);
        google = req.body.profile.google = req.sanitize(req.body.profile.google);
        odnoklassniki = req.body.profile.odnoklassniki = req.sanitize(req.body.profile.odnoklassniki);
        twitter = req.body.profile.twitter = req.sanitize(req.body.profile.twitter);
        youtube = req.body.profile.youtube = req.sanitize(req.body.profile.youtube);
        instagram = req.body.profile.instagram = req.sanitize(req.body.profile.instagram);
    }


    // const password2 = req.body.password2 = req.sanitize(req.body.password2);

    const updated = {
        username,
        profile: {
            firstname,
            lastname,
            website,
            vk,
            google,
            facebook,
            odnoklassniki,
            twitter,
            youtube,
            instagram
        }
    };

    let foundUser = await User.findById(id);
    if (!foundUser) {
        return res.status(400).json({error: 'User not found'});
    }

    const password = req.body.password = req.sanitize(req.body.password);
    const newPassword = req.body.newPassword = req.sanitize(req.body.newPassword);
    if (newPassword && password) {
        const hashedPassword = await hashUserPassword(password);

        if (foundUser.password === hashedPassword) {
            updated.password = await hashUserPassword(newPassword);
            response.messages.success.push({ text: "Password has been changed!" })
        } else {
            response.messages.error.push({ text: "Password hasn't been changed!" })
        }
    }

    foundUser.set(updated);

    let updatedUser = await foundUser.save();
    if (!updatedUser) return res.status(400).json({error: 'Error saving user'});

    response.messages.success.push({ text: "User has been saved!" });

    if (ENV === 'development') {
        response.user = updatedUser;
    } else {
        response.user = _.pick(updatedUser, ['_id', 'username', 'email', 'isActive']);
    }

    res.json(response);
}

module.exports = updateUserController;
