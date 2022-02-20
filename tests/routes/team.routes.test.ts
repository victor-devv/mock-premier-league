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

let teamId = '';

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

describe("POST /team/create", () => {
    it("should create a team", async () => {
        const result = await request(app).post(`${baseUrl}/team/create`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send({
                "name": "Chelsea",
                "squad": [
                    {
                        "name": "Mason Mount",
                        "position": "Midfielder"
                    },
                    {
                        "name": "Hakim Ziyech",
                        "position": "Forward"
                    }
                ]
            });
        expect(result.status).toEqual(201);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Team created successfully');
        teamId = result.body.data.team._id
    });

    it("should fail because authorization header is not set", async () => {
        const result = await request(app).post(`${baseUrl}/team/create`)
            .send({
                "name": "Chelsea",
                "squad": [
                    {
                        "name": "Mason Mount",
                        "position": "Midfielder"
                    },
                    {
                        "name": "Hakim Ziyech",
                        "position": "Forward"
                    }
                ]
            });
        //console.log(result)
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Authorization Header Required');
    });

    it("should fail because bearer token is not set", async () => {
        const result = await request(app).post(`${baseUrl}/team/create`)
            .set({ Authorization: `Basic ${adminAccessToken}` })
            .send({
                "name": "Chelsea",
                "squad": [
                    {
                        "name": "Mason Mount",
                        "position": "Midfielder"
                    },
                    {
                        "name": "Hakim Ziyech",
                        "position": "Forward"
                    }
                ]
            });
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Bearer Token Required');
    });

    it("should fail because user is not an admin", async () => {
        const result = await request(app).post(`${baseUrl}/team/create`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                "name": "Chelsea",
                "squad": [
                    {
                        "name": "Mason Mount",
                        "position": "Midfielder"
                    },
                    {
                        "name": "Hakim Ziyech",
                        "position": "Forward"
                    }
                ]
            });
        expect(result.status).toEqual(403);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Forbidden');
    });

    it("should fail because team exists", async () => {
        const result = await request(app).post(`${baseUrl}/team/create`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send({
                "name": "Manchester City",
                "squad": [
                    {
                        "name": "Kevin De Bruyne",
                        "position": "Midfielder"
                    },
                    {
                        "name": "Raheem Sterling",
                        "position": "Forward"
                    }
                ]
            });
        expect(result.status).toEqual(400);
        expect(result.body.status).toEqual('failed');
    });

    it("should fail because request body is incomplete", async () => {
        const result = await request(app).post(`${baseUrl}/team/create`).send({
            "squad": [
                {
                    "name": "Kevin De Bruyne",
                    "position": "Midfielder"
                },
                {
                    "name": "Raheem Sterling",
                    "position": "Forward"
                }
            ]
        });
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
    });
});

describe("GET /teams", () => {
    it("should return all teams", async () => {
        const result = await request(app).get(`${baseUrl}/teams`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Teams fetched successfully')
    });

    it("should fail because bearer token isn't set", async () => {
        const result = await request(app).get(`${baseUrl}/teams`)
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Authorization Header Required')
    });

    it("should fail because authorization header is not Bearer", async () => {
        const result = await request(app).get(`${baseUrl}/teams`)
            .set({ Authorization: `Basic ${accessToken}` })
            .send();
        expect(result.status).toEqual(401);
        expect(result.body.status).toEqual('error');
        expect(result.body.data.message).toEqual('Bearer Token Required')
    });
});

describe("POST /teams/search", () => {
    it("should return teams based on keywords provided", async () => {
        const result = await request(app).post(`${baseUrl}/teams/search`)
            .send({
                "name": "Manchester United",
                "player": "jadon sancho",
                "position": "Forward"
            });
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Team search completed');
    });
});

describe("resource /:teamId", () => {
    it("should return a team", async () => {
        const result = await request(app).get(`${baseUrl}/team/${teamId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual('success');
        expect(result.body.message).toEqual('Team fetched successfully')
    });

    it("should fail because team id doesn't match any team", async () => {
        const result = await request(app).get(`${baseUrl}/team/abcderdjksg`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(404);
        expect(result.body.status).toEqual('failed');
    });

    it("should delete a team", async () => {
        const result = await request(app).delete(`${baseUrl}/team/${teamId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(204);
    });

    it("should not delete a non-existent team", async () => {
        const result = await request(app).delete(`${baseUrl}/team/${teamId}`)
            .set({ Authorization: `Bearer ${adminAccessToken}` })
            .send();
        expect(result.status).toEqual(404);
        expect(result.body.status).toEqual('failed');
    });
});