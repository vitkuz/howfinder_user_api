const bcrypt = require('bcryptjs');

async function hashUserPassword(passwordString) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordString, salt);
    return hashedPassword;
}

module.exports = hashUserPassword;