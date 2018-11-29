const User = require('../models/User');
const _ = require('lodash');

const { ENV } = require('../../../config/config');

const hashUserPassword = require('../utils/hashUserPassword');
const buildResponseObject = require('../utils/buildResponseObject');

async function updateUserController(req,res) {
    const response = buildResponseObject(req,res);

    const id = req.params.id = req.sanitize(req.params.id);

    let foundUser = await User.findById(id);
    if (!foundUser) {
        return res.status(400).json({error: 'User not found'});
    }

    const username = req.body.username = req.sanitize(req.body.username);
    foundUser.username = username || foundUser.username;

    const email = req.body.email = req.sanitize(req.body.email);


    if (email) {
        // foundUser.email = email || foundUser.email;
        response.addMessage('warning', 'You can\'t update email. Create new account')
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


        foundUser.profile = foundUser.profile || {};

        foundUser.profile.firstname = firstname || foundUser.profile.firstname;
        foundUser.profile.lastname = lastname || foundUser.profile.lastname;
        foundUser.profile.website = lastname || foundUser.profile.website;

        foundUser.profile.vk = vk || foundUser.profile.vk;
        foundUser.profile.facebook = facebook || foundUser.profile.facebook;
        foundUser.profile.google = google || foundUser.profile.google;
        foundUser.profile.odnoklassniki = odnoklassniki || foundUser.profile.odnoklassniki;
        foundUser.profile.twitter = twitter || foundUser.profile.twitter;
        foundUser.profile.youtube = youtube || foundUser.profile.youtube;
        foundUser.profile.instagram = instagram || foundUser.profile.instagram;
    }



    // const password2 = req.body.password2 = req.sanitize(req.body.password2);



    const password = req.body.password = req.sanitize(req.body.password);
    const newPassword = req.body.newPassword = req.sanitize(req.body.newPassword);
    if (newPassword && password) {
        const hashedPassword = await hashUserPassword(password);

        if (foundUser.password === hashedPassword) {
            foundUser.password = await hashUserPassword(newPassword);
            response.addMessage('success', 'Password has been changed!');
        } else {
            response.addMessage('error', 'Password hasn\'t been changed!');
        }
    }

    let updatedUser = await foundUser.save();
    if (!updatedUser) return res.status(400).json({error: 'Error saving user'});

    response.addMessage('success', 'User has been saved!');

    if (ENV === 'development') {
        response.user = updatedUser;
    } else {
        response.user = _.pick(updatedUser, ['_id', 'username', 'email', 'isActive']);
    }

    res.json(response.logTime());
}

module.exports = updateUserController;
