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

    test('Criação de TODO com informações válidas', async done => {

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

describe('Testando a obtenção da listagem de TODOs', () => {

    test('Listando todos por um usuário existente', async done => {

        var userReceived = {
            email: "test23@test.com",
            password: "qwerty",
            name: "test"
        };

        const user = new User(userReceived);
        user.hashPass();
        var token = user.generateToken();
        user.save();

        var todoReceived = {
             content: "textToDo1",
             user: user.id
        }; 

        var todoReceived2 = {
            content: "textToDo2",
            user: user.id
        };

        const todo = new Todo(todoReceived);
        todo.user = user;
        await todo.save();

        const todo2 = new Todo(todoReceived2);
        todo2.user = user;
        await todo2.save();

        const response = await request.get('/todos/')
             .set("Authorization", "Bearer " + token);
      
        expect(response.status).toBe(200);

        done();
    });
})