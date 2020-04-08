const express = require('express');
const router = express.Router();
const todoService = require('./todo.service');
const jwt = require('jsonwebtoken');

// routes
router.post('/', create);
router.get('/', listByUser);
router.delete('/:id', deleteByIdAndUser);

module.exports = router;

function create(req, res, next) {
    todoService.create(req.body)
        .then(res.sendStatus(201))
        .catch(err => next(err));
}

function listByUser(req, res, next) {

    var token = req.headers.authorization.split(" ")[1];
    var userId = jwt.decode(token).sub.id;
    
    todoService.listByUser(userId)
        .then(todos => todos && todos.length > 0 ? res.json(todos) : res.sendStatus(404))
        .catch(err => next(err));
}

function deleteByIdAndUser(req, res, next) {
   
    var token = req.headers.authorization.split(" ")[1];
    var userId = jwt.decode(token).sub.id;

    todoService.deleteByIdAndUser(token, userId)
        .then(wasDeleted => wasDeleted.n > 0 ? res.sendStatus(200) : res.sendStatus(404))
        .catch(err => next(err));
}