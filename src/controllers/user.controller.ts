import { Request, Response, NextFunction } from 'express'
import argon2 from 'argon2';

import UserService from '../services/user.service';

import debug from 'debug';
const log: debug.IDebugger = debug('app:user-controller');

class UserController {
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            req.body.password = await argon2.hash(req.body.password);

            const result = await UserService.create(req.body);

            res.status(201).json({
                "status": 'success',
                "message": "User sign-up successful",
                "data": {
                    "id": result
                }
            })

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error creating user",
            })
        }
    }

    async listUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.list(100, 0);
            res.status(200).json({
                "status": "success",
                "message": "Users fetched successfully",
                "data": {
                    "users": users
                }
            });

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error fetching users",
            })
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.readById(req.params.userId);

            res.status(200).json({
                "status": "success",
                "message": "User fetched successfully",
                "data": {
                    "users": user
                }
            });

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error fetching user",
            })

        }
    }

    async patch(req: Request, res: Response, next: NextFunction) {

        try {
            if (req.body.password) {
                req.body.password = await argon2.hash(req.body.password);
            }

            log(await UserService.patchById(req.params.userId, req.body));

            res.status(204).json({
                "status": "success",
                "message": "User updated successfully",
            });

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error updating user",
            })
        }
    }

    async put(req: Request, res: Response, next: NextFunction) {
        try {
            req.body.password = await argon2.hash(req.body.password);
            log(await UserService.putById(req.params.userId, req.body));

            res.status(204).json({
                "status": "success",
                "message": "User updated successfully",
            });
        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error updating user",
            })
        }
    }

    async removeUser(req: Request, res: Response, next: NextFunction) {
        try {
            log(await UserService.deleteById(req.params.userId));

            res.status(204).json({
                "status": "success",
                "message": "User deleted successfully",
            });

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error deleting user",
            })
        }
    }
}

export default new UserController();

 