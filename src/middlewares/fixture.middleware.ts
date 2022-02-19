import express from "express";

import FixtureServices from "../services/fixture.service";

import debug from 'debug';
const log: debug.IDebugger = debug('app:fixture-middleware');

class FixtureMiddleware {

    async validateFixtureNotPending(req: express.Request, res: express.Response, next: express.NextFunction) {
        //xDKtn5Fgs
        //4UELizWRT
        //0TlMO1vV1
        //1d3t4I_wk
        const fixtures: any = await FixtureServices.read(req.body);

        const pendingFixtures = fixtures.filter(
            (fixtures: any) => fixtures.status === 'pending'
        );

        if (pendingFixtures.length >= 1) {
            res.status(400).json({
                "status": 'failed',
                "message": "Fixture already exists",
            });
        } else {
            next();
        }
    }

    async validateFixtureExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const fixture = await FixtureServices.readById(req.params.fixtureId);

        if (fixture) {
            res.locals.fixture = fixture;
            next();
        } else {
            res.status(404).json({
                "status": 'failed',
                "message": "Fixture does not exist",
            });
        }
    }
}

export default new FixtureMiddleware();