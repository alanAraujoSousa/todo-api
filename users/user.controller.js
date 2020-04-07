const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function register(req, res, next) {
    var userReceived = req.body;
    userService.create(userReceived)
        .then(userCreated => res.status(201).json(userCreated))
        .catch(err => next(err));
}