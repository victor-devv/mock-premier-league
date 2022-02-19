import { CRUD } from '../interfaces/crud.interface';
import TeamDAO from '../daos/team.dao';
import { CreateTeamDto, PutTeamDto, PatchTeamDto, SearchTeamsDto } from '../dtos/team.dto';

import debug from 'debug';
const log: debug.IDebugger = debug('app:team-services');

class TeamService implements CRUD {
    async create(resource: CreateTeamDto) {
        return TeamDAO.createTeam(resource);
    }

    async read(name: string) {
        return TeamDAO.getTeam(name);
    }

    async readById(id: string) {
        return TeamDAO.getTeamById(id);
    }

    async update(id: string, resource: PatchTeamDto) {
        return TeamDAO.updateTeamById(id, resource);
    }

    async delete(id: string) {
        return TeamDAO.removeTeamById(id);
    }

    async list(limit: number, page: number) {
        return TeamDAO.getTeams();
    }

    async search(resource: SearchTeamsDto) {
        return TeamDAO.searchTeams(resource);
    }
}

export default new TeamService();