const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

const User = db.User;

module.exports = {
    authenticate,
    create,
    getProfile
};

async function authenticate({ email, password }) {

    const user = await User.findOne({ email }).select("+password +salt");
    
    if (user && user.isTheCorrectPassword(password)) {
        var token = user.generateToken();
        await user.save();
        
        var userO = user.toJSON();
        return {...userO, token: token};
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

    await user.save();
    return user;
}

async function getProfile(id) {
    var user = await User.findById(id);
    return user;
}
