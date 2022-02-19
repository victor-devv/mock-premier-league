import express, { Express, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator';

import { CommonRoutesConfig } from './common.routes';

import { PermissionFlag } from '../enums/permissionflag.enum';

import CommonMiddleware from '../middlewares/common.middleware';
import jwtMiddleware from '../middlewares/jwt.middleware';
import TeamMiddleware from '../middlewares/team.middleware';

import TeamController from '../controllers/team.controller';

export class TeamRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'TeamRoutes', 'team', express.Router());
    }

    configureRoutes(): express.Application {
        const prefix: any = process.env.ROUTE_PREFIX

        // Add team
        this.router
            .route(`/create`)
            .post(
                jwtMiddleware.validJWTNeeded,
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                body('name').isString(),
                body('squad').custom(CommonMiddleware.isArray),
                CommonMiddleware.verifyBodyFieldsErrors,
                TeamMiddleware.validateTeamDoesntExist,
                TeamController.createTeam
            )

        //View all teams
        this.app
            .route(`${prefix}teams`)
            .get(
                jwtMiddleware.validJWTNeeded,
                TeamController.getallTeams
            )

        // Search teams robustly (open to public)
        this.app
            .route(`${prefix}teams/search`)
            .post(
                TeamController.searchTeams
            )

        //Edit, View and Remove Team
        this.router
            .route(`/:teamId`)
            .all(
                jwtMiddleware.validJWTNeeded,
                TeamMiddleware.validateTeamExists,
            )
            .get(
                TeamController.getTeam
            )
            .put(
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                body('name').isString(),
                body('squad').custom(CommonMiddleware.isArray),
                CommonMiddleware.verifyBodyFieldsErrors,
                TeamController.editTeam
            )
            .delete(
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                TeamController.deleteTeam
            );

        this.app.use(prefix + this.getPrefix(), this.router)
        return this.app;
    }

}