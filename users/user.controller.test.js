const app = require('../server') 
const supertest = require('supertest')
const mongoose = require('mongoose');

const db = require('_helpers/db');

const User = db.User;

const request = supertest(app);
beforeAll(async () => {
    await mongoose.connection.collections['users'].deleteMany();
})

afterAll(async () => {
    await mongoose.connection.collections['users'].deleteMany();
    await mongoose.connection.close();
})

describe('Testando a criação de usuários', () => {

    test('Criação de usuários com email válido', async done => {

        var userReceived = {
            email: "test@test.com",
            password: "qwerty",
            name: "test"
        };

        const response = await request.post('/users/register').send(userReceived);
      
        expect(response.status).toBe(201);

        done();
    });

    test('Criação de usuários com email repetido', async done => {

        var userReceived = {
            email: "test2@test.com",
            password: "qwerty",
            name: "test"
        };

        const user = new User(userReceived);
        user.hashPass();
        user.save();

        const responseBAD = await request.post('/users/register').send(userReceived);
        expect(responseBAD.status).toBe(409);

        done()
    });
})

describe('Testando a autenticação dos usuários', () => {

    test('Usuário com credenciais válidas', async done => {

        var userReceived = {
            email: "test3@test.com",
            password: "qwerty",
            name: "test"
        };

        const user = new User(userReceived);
        user.hashPass();
        user.save();

        const responseAuth = await request.post('/users/authenticate')
            .send({email: userReceived.email, password: userReceived.password});
        
        expect(responseAuth.status).toBe(200);

        done();
    });

    test('Usuário com credenciais inválidas', async done => {

        var userReceived = {
            email: "test4@test.com",
            password: "qwerty",
            name: "test"
        };

        const response = await request.post('/users/authenticate')
            .send({email: userReceived.email, password: userReceived.password});
        expect(response.status).toBe(401);

        done();
    });

    test('Usuário efetuando operação com token inválido', async done => {

        var researcherUser = {
            email: "test6@test.com",
            password: "qwerty",
            name: "test"
        };

        const researcher = new User(researcherUser);
        researcher.hashPass();

        await researcher.save();
        var token = researcher.generateToken() + "\o/";
        
        const response = await request.get('/users/me')
            .set("Authorization", "Bearer " + token);
        
        expect(response.status).toBe(401);

        done();
    });
})