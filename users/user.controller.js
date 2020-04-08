const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const jwt = require('jsonwebtoken');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/me', getProfile);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(userCreated => res.status(201).json(userCreated))
        .catch(err => next(err));
}

function getProfile(req, res, next) {

    var token = req.headers.authorization.split(" ")[1];
    var userId = jwt.decode(token).sub.id;
    
    userService.getProfile(userId)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}