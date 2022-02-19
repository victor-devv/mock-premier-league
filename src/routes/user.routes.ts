import express, { Express, Request, Response, NextFunction } from 'express'
import { CommonRoutesConfig } from './common.routes';
//import config from 'config'
import { body } from 'express-validator';

import CommonMiddleware from '../middlewares/common.middleware';
import UserMiddleware from '../middlewares/user.middleware';
import UserController from '../controllers/user.controller';

import debug from 'debug';
const log: debug.IDebugger = debug('app:user-routes');

import jwtMiddleware from '../middlewares/jwt.middleware';
import { PermissionFlag } from '../enums/permissionflag.enum';

// import PerishablesMiddleware from '../middleware/perishables.middleware';
// import PerishablesController from '../controllers/perishables.controller'

export class UserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserRoutes', 'users', express.Router());
    }

    configureRoutes(): express.Application {

        //Get all users
        this.router
            .route(`/all`)
            .get(
                jwtMiddleware.validJWTNeeded,
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                UserController.listUsers
            )

        //Sign up
        this.router.post(`/signup`,
            body('email').isEmail(),
            body('password').isLength({ min: 5 }).withMessage('Must include password (5+ characters)'),
            body('firstName').isString(),
            body('lastName').isString(),
            CommonMiddleware.verifyBodyFieldsErrors,
            UserMiddleware.validateSameEmailDoesntExist,
            UserController.createUser
        )
        //note that login route is in auth.routes

        
        this.app.param(`userId`, UserMiddleware.extractUserId);

        this.router
            .route(`/:userId`)
            .all(
                UserMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                CommonMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),

                // CommonMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(UserController.getUserById)
            .delete(UserController.removeUser);

        this.router.put(`/:userId`, [
            UserMiddleware.validateRequiredUserBodyFields,
            UserMiddleware.validateSameEmailBelongToSameUser,
            UserMiddleware.userCantChangePermission,
            UserController.put,
        ]);

        this.router.patch(`/:userId`, [
            UserMiddleware.validatePatchEmail,
            UserMiddleware.userCantChangePermission,
            UserController.patch,
        ]);

        //const prefix = config.get<string>('routePrefix')
        const prefix: any = process.env.ROUTE_PREFIX
        this.app.use(prefix + this.getPrefix(), this.router)
        return this.app;
    }

}