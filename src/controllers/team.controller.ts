import { Request, Response, NextFunction } from 'express'

import TeamService from '../services/team.service';

import debug from 'debug';
const log: debug.IDebugger = debug('app:team-controller');

class TeamController {
    async createTeam(req: Request, res: Response, next: NextFunction) {

        try {
            const result = await TeamService.create(req.body);

            res.status(201).json({
                "status": 'success',
                "message": "Team created successfully",
                "data": {
                    "team": result
                }
            })
        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error creating team",
            })
        }

    }

    async getTeam(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await TeamService.readById(req.params.teamId);

            res.status(200).json({
                "status": 'success',
                "message": "Team fetched successfully",
                "data": {
                    "team": result
                }
            })
        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error fetching team",
            })
        }

    }

    async getallTeams(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await TeamService.list(100, 0);

            res.status(200).json({
                "status": 'success',
                "message": "Teams fetched successfully",
                "data": {
                    "team": result
                }
            })
        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error fetching teams",
            })
        }

    }

    async searchTeams(req: Request, res: Response, next: NextFunction) {
        const { name, player, position } = req.body;

        if (name || player || position) { 
            try {
                const result = await TeamService.search(req.body);

                res.status(200).json({
                    "status": 'success',
                    "message": "Team search completed",
                    "data": {
                        "results": result
                    }
                })
            } catch (error) {
                res.status(500).json({
                    "status": 'failed',
                    "message": "Error searching teams",
                })
            }
        } else {
            res.status(400).json({
                "status": 'failed',
                "message": "Please provide a valid search parameter",
            })
        }

    }

    async editTeam(req: Request, res: Response, next: NextFunction) {

        try {
            await TeamService.update(req.params.teamId, req.body);

            res.status(200).json({
                "status": 'success',
                "message": "Team edited successfully",
            })

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error editing team",
            })

        }
    }

    async deleteTeam(req: Request, res: Response, next: NextFunction) {

        try {
            await TeamService.delete(req.params.teamId);

            res.status(204).json({
                "status": 'success',
                "message": "Team deleted successfully",
            })

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error editing team",
            })

        }
    }
}

export default new TeamController();
