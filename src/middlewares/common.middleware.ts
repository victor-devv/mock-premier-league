import { Router } from "express";
import cors from "cors";
import compression from "compression";
import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import { PermissionFlag } from '../enums/permissionflag.enum';

import debug from 'debug';
const log: debug.IDebugger = debug('app:common-middleware');

class CommonMiddleware {
    handleCors = (router: Router) => router.use(cors({ credentials: true, origin: true }))

    handleCompression = (router: Router) => {
        router.use(compression());
    };

    verifyBodyFieldsErrors(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
            .json({
                "status": "failed",
                "message" : "Required fields for this route missing",
                "data": errors.array()
            });
        }
        next();
    }

    permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                const userPermissionFlags = parseInt(
                    res.locals.jwt.permissionFlags
                );
                if (userPermissionFlags & requiredPermissionFlag) {
                    next();
                } else {
                    return res.status(403).json(
                        {
                            "status": "error",
                            "data": {
                                "message": "Forbidden"
                            }
                        }
                    );
                }
            } catch (e) {
                log(e);
            }
        };
    }
 
    async onlySameUserOrAdminCanDoThisAction(req: express.Request, res: express.Response, next: express.NextFunction) {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
        if (req.params && req.params.userId && req.params.userId === res.locals.jwt.userId) {
            return next();
        } else {
            if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).json(
                    {
                        "status": "error",
                        "data": {
                            "message": "Forbidden"
                        }
                    }
                );
            }
        }
    }

    isArray: CustomValidator = (value) => {
        return Array.isArray(value);
    }

    notEmpty: CustomValidator = (array) => {
        return array.length > 0;
    }

    gte: CustomValidator = (param, num) => {
        return param >= num;
    }
}

export default new CommonMiddleware();