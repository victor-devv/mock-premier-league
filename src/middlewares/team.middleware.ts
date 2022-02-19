import express from "express";

import TeamServices from "../services/team.service";
import debug from 'debug';
const log: debug.IDebugger = debug('app:team-middleware');

const titleCase = (str: string) => {
    let splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
}

class TeamMiddleware {

    async validateTeamDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
        const team = await TeamServices.read(req.params.name);

        if (team) {
            res.status(400).json({
                "status": 'failed',
                "message": "Team already exists",
            });
        } else {
            next();
        }
    }

    async validateTeamExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        //we could check by team name since it's unique
        //const team = await TeamServices.read(req.body.name);
        //or

        const team = await TeamServices.readById(req.params.teamId);

        if (team) {
            res.locals.team = team;
            next();
        } else {
            res.status(404).json({
                "status": 'failed',
                "message": "Team does not exist",
            });
        }
    }

    async validateTeamsExist(req: express.Request, res: express.Response, next: express.NextFunction) {
        const { teamA, teamB } = req.body

        const teamAres = await TeamServices.read(titleCase(teamA));
        const teamBres = await TeamServices.read(titleCase(teamB));

        if (teamAres && teamBres) {
            next();
        } else {
            res.status(404).json({
                "status": 'failed',
                "message": "One or more teams provided do not exist",
            });
        }
    }

    async compareTeams(req: express.Request, res: express.Response, next: express.NextFunction) {
        const { teamA, teamB } = req.body

        if (teamA == teamB) {
            res.status(409).json({
                "status": 'failed',
                "message": "Both teams cannot be the same",
            })
        } else {
            next();
        }
    }
}

export default new TeamMiddleware();