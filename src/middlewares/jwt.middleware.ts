import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Jwt } from '../types/jwt.types';
import UserService from '../services/user.service';

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;

class JwtMiddleware {
    verifyRefreshBodyField(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.refreshToken) {
            return next();
        } else {
            return res
                .status(400)
                .json({
                    "status": "failed",
                    "message": "Missing required field: refreshToken"
                });
        }
    }

    async validRefreshNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await UserService.getUserByEmailWithPassword(
            res.locals.jwt.email
        );
        const salt = crypto.createSecretKey(
            Buffer.from(res.locals.jwt.refreshKey.data)
        );
        const hash = crypto
            .createHmac('sha512', salt)
            .update(res.locals.jwt.userId + jwtSecret)
            .digest('base64');
        if (hash === req.body.refreshToken) {
            req.body = {
                userId: user._id,
                email: user.email,
                permissionFlags: user.permissionFlags,
            };
            return next();
        } else {
            return res.status(400).json({
                "status": "failed",
                "message": "Invalid refresh token"
            });
        }
    }

    validJWTNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).json(
                        {
                            "error": {
                                "errors": [
                                    {
                                        "domain": "global",
                                        "reason": "required",
                                        "message": "Bearer Token Required",
                                        "locationType": "header",
                                        "location": "Authorization"
                                    }
                                ],
                                "code": 401,
                                "message": "Bearer Token Required"
                            }
                        }
                    );
                } else {
                    res.locals.jwt = jwt.verify(
                        authorization[1],
                        jwtSecret
                    ) as Jwt;
                    next();
                }
            } catch (err) {
                return res.status(403).json(
                    {
                        "error": {
                            "errors": [
                                {
                                    "domain": "global",
                                    "reason": "forbidden",
                                    "message": "Forbidden"
                                }
                            ],
                            "code": 403,
                            "message": "Forbidden"
                        }
                    }
                );
            }
        } else {
            return res.status(401).json(
                {
                    "error": {
                        "errors": [
                            {
                                "domain": "global",
                                "reason": "required",
                                "message": "Authorization Header Required",
                                "locationType": "header",
                                "location": "Authorization"
                            }
                        ],
                        "code": 401,
                        "message": "Authorization Header Required"
                    }
                }
            );
        }
    }
}

export default new JwtMiddleware();