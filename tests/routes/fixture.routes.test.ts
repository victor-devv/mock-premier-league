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

let fixtureId = '';

let userEmail = `test.user@gmail.com`;
let userPassword = 'Sup3rSecret!23';
let accessToken = '';
let refreshToken = '';

let adminEmail = 'admin@test.com';
let adminPassword = '@dm1nAutH';
let adminAccessToken = '';
let adminRefreshToken = '';

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
});

describe("POST /fixture/create", () => {
    it("should create a fixture", async () => {
        const result = await request(app).post(`${baseUrl}/fixture/create`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send({
                "teamA": "Manchester City",
                "teamB": "Chelsea",
                "stadium": "Old Trafford",
                "date": "2022/02/20"
            });
        expect(result.status).toEqual(201);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Fixture created successfully');
        fixtureId = result.body.data.fixture._id
    });

    it("should fail because authorization header is not set", async () => {
        const result = await request(app).post(`${baseUrl}/fixture/create`)
            .send({
                "teamA": "Arsenal",
                "teamB": "Manchester United",
                "stadium": "Old Trafford",
                "date": "2022/02/19"
            });
        //console.log(result)
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Authorization Header Required');
    });

    it("should fail because bearer token is not set", async () => {
        const result = await request(app).post(`${baseUrl}/fixture/create`)
            .set({ Authorization: `Basic ${adminAccessToken}` })
            .send({
                "teamA": "Arsenal",
                "teamB": "Manchester United",
                "stadium": "Old Trafford",
                "date": "2022/02/19"
            });
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Bearer Token Required');
    });

    it("should fail because user is not an admin", async () => {
        const result = await request(app).post(`${baseUrl}/fixture/create`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                "teamA": "Arsenal",
                "teamB": "Manchester United",
                "stadium": "Old Trafford",
                "date": "2022/02/19"
            });
        expect(result.status).toEqual(403);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Forbidden');
    });

    it("should fail because fixture exists", async () => {
        const result = await request(app).post(`${baseUrl}/fixture/create`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send({
                "teamA": "Arsenal",
                "teamB": "Manchester United",
                "stadium": "Old Trafford",
                "date": "2022/02/19"
            });
        expect(result.status).toEqual(400);
        expect(result.body.status).toEqual('failed');
    });

    it("should fail because request body is incomplete", async () => {
        const result = await request(app).post(`${baseUrl}/fixture/create`).send({
            "teamA": "Arsenal",
            "date": "2022/02/19"
        });
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
    });
});

describe("GET /fixtures", () => {
    it("should return all fixtures", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Fixtures fetched successfully')
    });

    it("should fail because bearer token isn't set", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures`)
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Authorization Header Required')
    });

    it("should fail because authorization header is not Bearer", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures`)
            .set({ Authorization: `Basic ${accessToken}` })
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Bearer Token Required')
    });
});

describe("GET /fixtures/pending && /completed", () => {
    it("should return pending fixtures", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures/pending`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Fixtures fetched successfully')
    });

    it("should fail because bearer token isn't set", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures/pending`)
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Authorization Header Required')
    });

    it("should fail because authorization header is not Bearer", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures/pending`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Bearer Token Required')
    });
    
    it("should return completed fixtures", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures/completed`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Fixtures fetched successfully')
    });

    it("should fail because bearer token isn't set", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures/completed`)
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Authorization Header Required')
    });

    it("should fail because authorization header is not Bearer", async () => {
        const result = await request(app).get(`${baseUrl}/fixtures/completed`)
            .set({ Authorization: `Basic ${accessToken}` })
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Bearer Token Required')
    });

});

describe("POST /fixtures/search", () => {
    it("should return fixtures based on keywords provided", async () => {
        const result = await request(app).post(`${baseUrl}/fixtures/search`)
            .send({
                "name": "Arsenal"
            });
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Fixture search completed');
    });
})

describe("resource /:fixtureId", () => {
    it("should return a fixture", async () => {
        const result = await request(app).get(`${baseUrl}/fixture/${fixtureId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Fixture fetched successfully')
    });

    it("should fail because fixture id doesn't match any fixture", async () => {
        const result = await request(app).get(`${baseUrl}/fixture/abcderdjksg`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(404);
        expect(result.body.status).toEqual('failed');
    });

    it("should delete a fixture", async () => {
        const result = await request(app).delete(`${baseUrl}/fixture/${fixtureId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(204);
    });

    it("should not delete a non-existent fixture", async () => {
        const result = await request(app).delete(`${baseUrl}/fixture/${fixtureId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(404);
        expect(result.body.status).toEqual('failed');
    });
});