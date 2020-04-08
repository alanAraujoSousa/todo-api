const db = require('_helpers/db');

const Todo = db.Todo;
const User = db.User;

module.exports = {
    create,
    listByUser,
    deleteByIdAndUser
};

async function create(userParam, userId) {
    
    var user = await User.findById(userId);
    
    const todo = new Todo(userParam);
    todo.user = user;

    await todo.save();
    return todo;
}

async function listByUser(userId) {
    var todos = await Todo.find({ user: userId });
    return todos;
}

async function deleteByIdAndUser(id, userId) {
    var wasDeleted = await Todo.deleteOne({ id: id, user: userId });
    return wasDeleted;
}