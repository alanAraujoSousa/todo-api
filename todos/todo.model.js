const mongoose = require('mongoose');
const uuid = require('node-uuid');

const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, default: uuid.v1},
    content: { 
        type: String, 
        required: [true, "The content can't be blank"]
    },
    user: {
        type: String,
        ref: 'User',
        required: [true, "The user must be provided"]
    },
    createdAt: { type: Date, default: Date.now }
});

schema.methods.toJSON = function() {
    var obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model('Todo', schema);