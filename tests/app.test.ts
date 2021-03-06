import supertest from 'supertest';
import app from '../src/app'
import mongoose from 'mongoose';

afterAll((done) => {
    app.close(() => {
        mongoose.connection.close(done);
    });
});

test("app returns 404 for unregistered routes", done => {
    supertest(app)
        .get("/unregisteredRoute")
        .expect("Content-Type", /json/)
        .expect({
            "status": "error",
            "data": {
                "message": "Resource Not Found"
            }
        })
        .expect(404, done);
});

