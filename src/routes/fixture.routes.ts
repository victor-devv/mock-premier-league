import express, { Express, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator';

import { CommonRoutesConfig } from './common.routes';

import { PermissionFlag } from '../enums/permissionflag.enum';

import CommonMiddleware from '../middlewares/common.middleware';
import jwtMiddleware from '../middlewares/jwt.middleware';
import TeamMiddleware from '../middlewares/team.middleware';
import FixtureMiddleware from '../middlewares/fixture.middleware';

import FixtureController from '../controllers/fixture.controller';


export class FixturesRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'FixtureRoutes', 'fixture', express.Router());
    }

    configureRoutes(): express.Application {
        const prefix: any = process.env.ROUTE_PREFIX

        // Add Fixture
        this.router
            .route(`/create`)
            .post(
                jwtMiddleware.validJWTNeeded,
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                body('teamA').isString(),
                body('teamB').isString(),
                body('stadium').isString(),
                body('date').isDate(),
                CommonMiddleware.verifyBodyFieldsErrors,
                TeamMiddleware.compareTeams,
                TeamMiddleware.validateTeamsExist,
                FixtureMiddleware.validateFixtureNotPending,
                FixtureController.createFixture
            )

        //View all fixtures
        this.app
            .route(`${prefix}fixtures`)
            .get(
                jwtMiddleware.validJWTNeeded,
                FixtureController.getallFixtures
            )

        //View all completed fixtures
        this.app
            .route(`${prefix}fixtures/completed`)
            .get(
                jwtMiddleware.validJWTNeeded,
                FixtureController.getCompletedFixtures
            )

        //View all completed fixtures
        this.app
            .route(`${prefix}fixtures/pending`)
            .get(
                jwtMiddleware.validJWTNeeded,
                FixtureController.getPendingFixtures
            )

        // Search teams robustly (open to public)
        this.app
            .route(`${prefix}fixtures/search`)
            .post(
                FixtureController.searchFixtures
            )

        //Edit, View and Remove Fixture
        this.router
            .route(`/:fixtureId`)
            .all(
                jwtMiddleware.validJWTNeeded,
                FixtureMiddleware.validateFixtureExists,
            )
            .get(
                FixtureController.getFixture
            )
            .put(
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                body('teamA').isString(),
                body('teamB').isString(),
                body('stadium').isString(),
                body('date').isDate(),
                CommonMiddleware.verifyBodyFieldsErrors,
                FixtureController.editFixture
            )
            .delete(
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                FixtureController.deleteFixture
            );
        
        //Generate fixture link
        this.router
            .route(`link/:fixtureId`)
            .all(
                jwtMiddleware.validJWTNeeded,
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                FixtureMiddleware.validateFixtureExists,
            )
            .get(
                FixtureController.getFixture
            )


        this.app.use(prefix + this.getPrefix(), this.router)
        return this.app;
    }

}