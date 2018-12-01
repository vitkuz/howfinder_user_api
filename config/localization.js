const Localize = require('localize');

const myLocalize = new Localize({
    'Incorrect username or password': {
        'ru': 'Неверное имя пользователя или пароль',
    },
    'User is not active. Please verify your email': {
        'ru': 'Пользователь неактивен. Проверьте свой адрес электронной почты.'
    },
    'You have successfully login': {
        'ru': 'Вы успешно вошли на сайт'
    },
    'You\'ve successfully registered': {
        'ru': 'Вы успешно зарегистрировались'
    },
    'User with this email already exists' : {
        'ru': 'Пользователь с такой электронной почтой уже существует'
    },
    'User with this username already exists' : {
        'ru': 'Пользователь с такой именем уже существует'
    },
    'Error saving user' : {
        'ru': 'Ошибка при сохранении пользователя'
    },
    'User not found' : {
        'ru': 'Пользователь не найден'
    },
    'User was deleted' : {
        'ru': 'Пользователь был удален'
    },
    'You can\'t update email. Create new account' : {
        'ru': '«Вы не можете обновлять электронную почту. Создайте новый аккаунт'
    },
    'Password has been changed' : {
        'ru': 'Пароль успешно изменен'
    },
    'Password hasn\'t been changed': {
        'ru': 'Пароль не был изменен'
    },
    'User has been updated and save': {
        'ru': 'Пользователь обновлен и сохранен'
    },
    'We\'ve sent you a letter with reset link': {
        'ru': 'Мы отправим вам письмо с ссылкой на сброс пароля'
    },
    'Your password was successfully changed': {
        'ru': 'Ваш пароль был успешно изменен'
    },
    'User with this token not found': {
        'ru': 'Пользователь с этим токеном не найден'
    },
    'Email was verified. Now you can login': {
        'ru': 'Электронная почта была подтверждена. Теперь вы можете войти на сайт'
    }
});

module.exports = myLocalize;