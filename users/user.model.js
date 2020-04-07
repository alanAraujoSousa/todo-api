const mongoose = require('mongoose');
const uuid = require('node-uuid');
const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, default: uuid.v1},
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    name: { type: String, required: true },
    password: { type: String, required: true, select: false},
    salt: { type: String, required: true, select: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

schema.set('toObject', { getters: true, virtuals: true });

schema.methods.generateToken = function() {
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 30), // 30 min expires
        sub: { id: this.id, name: this.name } 
    }, config.secret, { algorithm: 'HS256'});

    this.lastLogin = Date.now();
    
    return token;
}

schema.methods.isTheCorrectPassword = function(pass) {
    return bcrypt.hashSync(pass, this.salt) === this.password;
}

schema.methods.hashPass = function() {
    var saltToEncrypt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, saltToEncrypt);
    this.salt = saltToEncrypt;
}

schema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.__v;
    delete obj.password;
    delete obj.salt;
    return obj;
}

module.exports = mongoose.model('User', schema);