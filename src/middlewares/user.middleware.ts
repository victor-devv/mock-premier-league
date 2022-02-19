import express from "express";

import { UserSignUpDto } from '../dtos/user.dto';
import userServices from "../services/user.service";

import debug from 'debug';
const log: debug.IDebugger = debug('app:user-middleware');

class UserMiddleware {

    constructor() {
    }

    async validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({
                error: `Missing required fields email and password`,
            });
        }
    }

    async validateRequiredLoginFields(req: express.Request, res: express.Response, next: express.NextFunction) {

        if (req.body && req.body.quantity) {
            next();
        } else {
            res.status(400).send({
                status: `Failed`,
                error: `Required Field Missing`,
            });
        }

    }

    async validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await userServices.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).json({ 
                "status": 'failed',
                "message": "User email already exists",
            });
        } else {
            next();
        }
    }

    async validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (res.locals.user._id === req.params.userId) {
            next();
        } else {
            res.status(400).send({ error: `Invalid email` });
        }
    }

    async validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await userServices.readById(req.params.userId);
        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.userId} not found`,
            });
        }
    }

    async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.userId;
        next();
    }

    validatePatchEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.body.email) {
            log('Validating email', req.body.email);

            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };

    async userCantChangePermission(req: express.Request, res: express.Response, next: express.NextFunction) {
        if ('permissionFlags' in req.body && req.body.permissionFlags !== res.locals.user.permissionFlags) {
            res.status(400).send({
                errors: ['User cannot change permission flags'],
            });
        } else {
            next();
        }
    }
}

export default new UserMiddleware();