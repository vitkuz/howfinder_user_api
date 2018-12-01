const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_KEY
    }
});

async function send() {

    const mailOptions = {
        to: 'admin@howfinder.ru',
        from: `Vitali Kuzmenka <admin@howfinder.ru>`,
        subject: `Вы создали учетную запись на сайте «Howfinder». Подтвердите свой email`,
    };
    template = `dfsffsdfsdfsdsdf`;

    mailOptions.html = template;

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, result) => {
            console.log(err, result)
            resolve({
                err,
                result
            })
        });
    })
}

send();