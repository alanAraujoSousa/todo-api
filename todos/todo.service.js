const db = require('_helpers/db');

const Todo = db.Todo;
const User = db.User;

module.exports = {
    create,
    listByUser
};

async function create(userParam) {
    
    var userId = userParam.user;
    var user = await User.findById(userId);
    
    const todo = new Todo(userParam);
    todo.user = user;

    await todo.save();
}

async function listByUser(userId) {

}
