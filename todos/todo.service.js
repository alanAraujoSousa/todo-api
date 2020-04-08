const db = require('_helpers/db');

const Todo = db.Todo;
const User = db.User;

module.exports = {
    create,
    listByUser,
    deleteByIdAndUser
};

async function create(userParam) {
    
    var userId = userParam.user;
    var user = await User.findById(userId);
    
    const todo = new Todo(userParam);
    todo.user = user;

    await todo.save();
}

async function listByUser(userId) {
    var todos = await Todo.find({ user: userId });
    return todos;
}

async function deleteByIdAndUser(id, userId) {
    var wasDeleted = await Todo.deleteOne({ id: id, user: userId });
    return wasDeleted;
}