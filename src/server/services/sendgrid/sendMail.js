const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { ENV,
    EMAIL_ADMIN,
    SENDGRID_USER,
    SENDGRID_KEY,
    WEBSITENAME,
    HOST } = require('../../../../config/config');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: SENDGRID_USER,
        pass: SENDGRID_KEY
    }
});

const mailOptions = {
    userRegisterEmailTemplate: (to, from, context) => {

        if (ENV === 'development') {
            to = EMAIL_ADMIN;
        }

        const mailOptions = {
            to: 'admin@howfinder.ru',
            from: from || `Vitali Kuzmenka <${EMAIL_ADMIN}>`,
            subject: `Создание аккаунта на сайте ${WEBSITENAME}. Подтвердите свой email`,
        };

        const templatePath = path.join(__dirname,'templates','userRegisterEmailTemplate.html');
        console.log(templatePath);
        let template = fs.readFileSync(templatePath, {encoding:'utf-8'});
        template = template.replace('{{title}}', 'Верификация мыла');

        template = template.replace('{{body}}',`
        <p>${context.user.username},</p>
        
        <p>Администратор сайта «${WEBSITENAME}» создал для вас учётную запись. 
        Можете войти на сайт, щёлкнув по следующей ссылке, 
        или скопировав её в адресную строку браузера:</p>
        
        <a href="${HOST}/user/verify/${context.user.activationToken}">ACTIVATE</a>
        <p>Эта одноразовая ссылка для входа на сайт ведёт на страницу задания своего пароля.</p>
        <p>После установки пароля войти на сайт можно на странице [site:login-url], введя:</p>
        
        <p>пользователь: ${context.user.username}
        пароль: ваш пароль</p>
        
        <p>-- Команда сайта ${WEBSITENAME}</p>
    `);

        mailOptions.html = template;
        return mailOptions;
    },
    userResetPasswordTemplate: (to, from, context) => {

        if (ENV === 'development') {
            to = EMAIL_ADMIN;
        }

        const mailOptions = {
            to: to || EMAIL_ADMIN,
            from: from || `Vitali Kuzmenka <${EMAIL_ADMIN}>`,
            subject: `Изменение пароля на сайте «${WEBSITENAME}»`,
        };

        const templatePath = path.join(__dirname,'templates','userResetPasswordTemplate.html');
        console.log(templatePath);
        let template = fs.readFileSync(templatePath, {encoding:'utf-8'});

        template = template.replace('{{title}}', 'Верификация мыла');
        template = template.replace('{{body}}',`
        <p>${context.user.username},</p>
        
        <p>Администратор сайта «${WEBSITENAME}» создал для вас учётную запись. 
        Можете войти на сайт, щёлкнув по следующей ссылке, 
        или скопировав её в адресную строку браузера:</p>
        
        <a href="${HOST}/user/reset/password/${context.user.resetPasswordToken}">ACTIVATE</a>
        <p>Эта одноразовая ссылка для входа на сайт ведёт на страницу задания своего пароля.</p>
        <p>После установки пароля войти на сайт можно на странице [site:login-url], введя:</p>
        
        <p>пользователь: ${context.user.username}
        пароль: ваш пароль</p>
        
        <p>-- Команда сайта «${WEBSITENAME}»</p>
    `);

        mailOptions.html = template;

        return mailOptions;
    }
}

module.exports = ({ key, to, from, context }) => {
    const createMailOption = mailOptions[key];
    const options = createMailOption(to,from,context);
    if (!options) throw new Error('There is no mailoption for this key');
    return new Promise((resolve,reject) => {
        transporter.sendMail(options, (err, result) => {
            console.log(err, result);
            resolve({
                err,
                result
            })
        });
    })
};
