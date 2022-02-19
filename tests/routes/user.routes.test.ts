import request from 'supertest'
import app from '../../src/app'
import mongoose from 'mongoose';
import shortid from 'shortid';

beforeAll(async () => {
});

afterAll((done) => {
    app.close(() => {
        mongoose.connection.close(done);
    });
});

let baseUrl = '/api/v1';

let userId = '';
let userEmail = `test.user+${shortid.generate()}@gmail.com`;
let userPassword = 'Sup3rSecret!23';
let accessToken = '';
let refreshToken = '';

let adminId = 'UdJuCXY_5';
let adminEmail = 'admin@test.com';
let adminPassword = '@dm1nAutH';
let adminAccessToken = '';
let adminRefreshToken = '';

describe("POST /users/signup", () => {
    it("should sign up a user", async () => {
        const result = await request(app).post(`${baseUrl}/users/signup`).send({
            "email": userEmail,
            "password": userPassword,
            "firstName": "Test",
            "lastName": "User"
        });
        expect(result.status).toEqual(201);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('User sign-up successful');
        userId = result.body.data.id
    });

    it("should fail because user exists", async () => {
        const result = await request(app).post(`${baseUrl}/users/signup`).send({
            "email": "test.user@gmail.com",
            "password": "Sup3rSecret!23",
            "firstName": "Test",
            "lastName": "User"
        });
        expect(result.status).toEqual(400);
        expect(result.body.status).toEqual('failed');
    });

    it("should fail because request body is incomplete", async () => {
        const result = await request(app).post(`${baseUrl}/users/signup`).send({
            "email": "test.user@gmail.com",
            "password": "Sup3rSecret!23",
        });
        expect(result.status).toEqual(400);
        expect(result.body.status).toEqual('failed');
    });
});

describe("POST /auth/login", () => {
    it("should log in a user", async () => {
        const result = await request(app).post(`${baseUrl}/auth/login`).send({
            "email": userEmail,
            "password": "Sup3rSecret!23",
        });
        expect(result.status).toEqual(201);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('User login successful');
        accessToken = result.body.data.accessToken
        refreshToken = result.body.data.refreshToken
    });

    it("should log in an admin", async () => {
        const result = await request(app).post(`${baseUrl}/auth/login`).send({
            "email": adminEmail,
            "password": adminPassword,
        });
        expect(result.status).toEqual(201);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('User login successful');
        adminAccessToken = result.body.data.accessToken
        adminRefreshToken = result.body.data.refreshToken
    });

    it("should fail because request body is incomplete", async () => {
        const result = await request(app).post(`${baseUrl}/auth/login`).send({
            "email": `test.user@gmail.com`,
        });
        expect(result.status).toEqual(400);
        expect(result.body.status).toEqual('failed');
    });

    it("should fail because email is incorrect", async () => {
        const result = await request(app).post(`${baseUrl}/auth/login`).send({
            "email": `testsss.user@gmail.com`,
            "password": "abcde"
        });
        expect(result.status).toEqual(400);
        expect(result.body.status).toEqual('failed');
        expect(result.body.message).toEqual('Invalid email and/or password')
    });

    it("should fail because password is incorrect", async () => {
        const result = await request(app).post(`${baseUrl}/auth/login`).send({
            "email": `test.user@gmail.com`,
            "password" : "abcde"
        });
        expect(result.status).toEqual(400);
        expect(result.body.status).toEqual('failed');
        expect(result.body.message).toEqual('Invalid email and/or password')
    });
});

describe("GET /users", () => {
    it("should return all users", async () => {
        const result = await request(app).get(`${baseUrl}/users/all`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Users fetched successfully')
    });

    it("should fail because user is not an admin", async () => {
        const result = await request(app).get(`${baseUrl}/users/all`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(result.status).toEqual(403);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Forbidden')
    });

    it("should fail because bearer token isn't set", async () => {
        const result = await request(app).get(`${baseUrl}/users/all`)
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Authorization Header Required')
    });

    it("should fail because authorization header is not Bearer", async () => {
        const result = await request(app).get(`${baseUrl}/users/all`)
            .set({ Authorization: `Basic ${accessToken}` })
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Bearer Token Required')
    });
});

describe("resource /:userId", () => {
    it("should return a user", async () => {
        const result = await request(app).get(`${baseUrl}/users/${userId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('User fetched successfully')
    });

    it("should fail because user sending the request is not an admin", async () => {
        const result = await request(app).get(`${baseUrl}/users/${userId}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(result.status).toEqual(403);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Forbidden')
    });

    it("should fail because user id doesn't match any user", async () => {
        const result = await request(app).get(`${baseUrl}/users/abcderdjksg`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(404);
        expect(result.body.status).toEqual('failed');
    });

    it("should delete a user", async () => {
        const result = await request(app).delete(`${baseUrl}/users/${userId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(204);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('User deleted successfully')

    });

    it("should not delete a non-existent user", async () => {
        const result = await request(app).delete(`${baseUrl}/users/${userId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(404);
        expect(result.body.status).toEqual('failed');
    });
});