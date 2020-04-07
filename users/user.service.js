const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

const User = db.User;

module.exports = {
    authenticate,
    create
};

async function authenticate({ email, password }) {

    const user = await User.findOne({ email }).select("+password +salt");
    
    if (user && user.isTheCorrectPassword(password)) {
        user.generateToken();
        await user.save();
        return user;
    } else {
        throw new Error("UnauthorizedCredentials");
    }
}

async function create(userParam) {

    // validate
    if (await User.findOne({ email: userParam.email })) {
        throw new Error("EmailAlreadyExists");
    }

    const user = new User(userParam);

    // hash pass
    user.hashPass();
    user.generateToken();

    await user.save();
    return user;
}