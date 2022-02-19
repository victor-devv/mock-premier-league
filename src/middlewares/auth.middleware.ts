import express from 'express';
import UserService from '../services/user.service';
import * as argon2 from 'argon2';

import debug from 'debug';
const log: debug.IDebugger = debug('app:auth-middleware');

class AuthMiddleware {
    async verifyUserPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
        
        const user: any = await UserService.getUserByEmailWithPassword(
            req.body.email
        );

        if (user) {
            const passwordHash = user.password;

            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    permissionFlags: user.permissionFlags,
                };
                return next();
            }
        }
        // Giving the same message in both cases
        // helps protect against cracking attempts:
        res.status(400).json({ 
            "status" : "failed",
            "message": "Invalid email and/or password"
        });
    }
}

export default new AuthMiddleware(); 