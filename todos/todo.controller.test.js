const app = require('../server') 
const supertest = require('supertest')
const mongoose = require('mongoose');

const db = require('_helpers/db');

const User = db.User;
const Todo = db.Todo;

const request = supertest(app);
beforeAll(async () => {
    await mongoose.connection.collections['users'].deleteMany();
    await mongoose.connection.collections['todos'].deleteMany();
})

// afterEach
afterAll(async () => {
    await mongoose.connection.collections['users'].deleteMany();
    await mongoose.connection.collections['todos'].deleteMany();
})

describe('Testando a criação de TODOs', () => {

    test('Criação de TODO', async done => {

        var userReceived = {
            email: "test22@test.com",
            password: "qwerty",
            name: "test"
        };

        const user = new User(userReceived);
        user.hashPass();
        var token = user.generateToken();
        user.save();

        var todoReceived = {
             content: "textToDo",
             user: user.id
        };

        const response = await request.post('/todos/').send(todoReceived)
             .set("Authorization", "Bearer " + token);
      
        expect(response.status).toBe(201);

        done();
    });
})