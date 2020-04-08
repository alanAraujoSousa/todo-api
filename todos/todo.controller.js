const express = require('express');
const router = express.Router();
const todoService = require('./todo.service');
const jwt = require('jsonwebtoken');

// routes
router.post('/', create);
router.get('/', listTodosByUser);

module.exports = router;

function create(req, res, next) {
    todoService.create(req.body)
        .then(todoCreated => res.status(201).json(todoCreated))
        .catch(err => next(err));
}

function listTodosByUser(req, res, next) {

    var token = req.headers.authorization.split(" ")[1];
    var userId = jwt.decode(token).sub.id;
    
    todoService.listByUser(userId)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
