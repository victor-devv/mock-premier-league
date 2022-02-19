import express, { Express, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator';

import { CommonRoutesConfig } from './common.routes';
import commonMiddleware from '../middlewares/common.middleware'; 
import authController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import jwtMiddleware from '../middlewares/jwt.middleware';

import debug from 'debug';
const log: debug.IDebugger = debug('app:auth-routes');

export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes', 'auth', express.Router());
    }

    configureRoutes(): express.Application {
        this.router.post(`/login`, [
            body('email').isEmail(),
            body('password').isString(),
            commonMiddleware.verifyBodyFieldsErrors,
            authMiddleware.verifyUserPassword,
            authController.createJWT,
        ]);

        this.router.post(`/auth/refresh-token`, [
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.validRefreshNeeded,
            authController.createJWT,
        ]);

        const prefix: any = process.env.ROUTE_PREFIX
        this.app.use(prefix + this.getPrefix(), this.router)
        return this.app;
    }
}