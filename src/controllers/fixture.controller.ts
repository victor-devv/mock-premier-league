import { Request, Response, NextFunction } from 'express'

import FixtureService from '../services/fixture.service';
import { CreateFixtureDto, FixtureTeam } from '../dtos/fixture.dto';

import debug from 'debug';
const log: debug.IDebugger = debug('app:team-controller');

class FixtureController {
    
    async createFixture(req: Request, res: Response, next: NextFunction) {
        const { teamA, teamB, stadium, date } = req.body;

        try {
            const resource: any = {
                teamA: {
                    name: teamA,
                    score : 0
                },
                teamB: {
                    name: teamB,
                    score: 0
                },
                matchInfo :{
                    date: date,
                    stadium: stadium
                }
            }
    
            const result = await FixtureService.create(resource);

            res.status(201).json({
                "status": 'success',
                "message": "Fixture created successfully",
                "data": {
                    "fixture": result
                }
            })
        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error creating fixture",
            })
        }


    }

    async getFixture(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FixtureService.readById(req.params.fixtureId);

            res.status(200).json({
                "status": 'success',
                "message": "Fixture fetched successfully",
                "data": {
                    "fixture": result
                }
            })
        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error fetching fixture",
            })
        }

    }

    async getallFixtures(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FixtureService.list(100, 0);

            res.status(200).json({
                "status": 'success',
                "message": "Fixtures fetched successfully",
                "data": {
                    "fixtures": result
                }
            })
        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error fetching fixtures",
            })
        }

    }

    async getCompletedFixtures(req: Request, res: Response, next: NextFunction) {
        try {
            const result: any = await FixtureService.listCompleted(100, 0);

            if (result && result.count > 0) {
                res.status(200).json({
                    "status": 'success',
                    "message": "Fixtures fetched successfully",
                    "data": {
                        "count": result.length,
                        "fixtures": result
                    }
                })

            } else {
                res.status(200).json({
                    "status": 'success',
                    "message": "Hey Fan! No fixture has been completed",
                })
            }

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error fetching fixtures",
            })
        }

    }

    async getPendingFixtures(req: Request, res: Response, next: NextFunction) {
        try {
            const result:any = await FixtureService.listPending(100, 0);
            
            if (result && result.count > 0) {
                res.status(200).json({
                    "status": 'success',
                    "message": "Fixtures fetched successfully",
                    "data": {
                        "count": result.length,
                        "fixtures": result
                    }
                })

            } else {
                res.status(200).json({
                    "status": 'success',
                    "message": "Hey Fan! All fixtures have been completed",
                })
            }

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error fetching fixtures",
            })
        }

    }

    async searchFixtures(req: Request, res: Response, next: NextFunction) {
        const { name, date, stadium, status } = req.body;

        if (name || date ||stadium || status) { 

            try {
                const result = await FixtureService.search(req.body);

                res.status(200).json({
                    "status": 'success',
                    "message": "Fixture search completed",
                    "data": {
                        "results": result
                    }
                })
            } catch (error) {
                res.status(500).json({
                    "status": 'failed',
                    "message": "Error searching fixtures",
                })
            }

        } else {
            res.status(400).json({
                "status": 'failed',
                "message": "Please provide a valid search parameter",
            })
        }
    }

    async editFixture(req: Request, res: Response, next: NextFunction) {
        const { teamA, teamB, stadium, date } = req.body;

        try {
            const resource: any = {
                teamA: {
                    name: teamA,
                    score: 0
                },
                teamB: {
                    name: teamB,
                    score: 0
                },
                matchInfo: {
                    date: date,
                    stadium: stadium
                }
            }

            await FixtureService.update(req.params.fixtureId, resource);

            res.status(200).json({
                "status": 'success',
                "message": "Fixture edited successfully",
            })

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error editing fixture",
            })

        }
    }

    async deleteFixture(req: Request, res: Response, next: NextFunction) {

        try {
            await FixtureService.delete(req.params.fixtureId);

            res.status(200).json({
                "status": 'success',
                "message": "Fixture deleted successfully",
            })

        } catch (error) {
            res.status(500).json({
                "status": 'failed',
                "message": "Error editing fixture",
            })

        }
    }
}

export default new FixtureController();
