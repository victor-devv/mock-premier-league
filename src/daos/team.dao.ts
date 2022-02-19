import Team from '../models/team.model';
import { CreateTeamDto, PutTeamDto, PatchTeamDto, SearchTeamsDto } from '../dtos/team.dto';
import shortid from 'shortid';


export class TeamDAO {
    teams: Array<CreateTeamDto> = [];

    async createTeam(payload: CreateTeamDto) {
        const teamId = shortid.generate();

        const team: any = new Team({
            _id: teamId,
            ...payload,
        });
        const res = await team.save();
        return res;
    }

    async getTeam(name: string) {
        return Team.findOne({ name: name }).exec();
    }

    async getTeams(limit = 25, page = 0) {
        return Team.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async getTeamById(id: string) {
        return Team.findOne({ _id: id }).exec();
    }

    async searchTeams(payload: SearchTeamsDto) {
        const { name, player, position } = payload;

        return Team.find({
                $or: [
                    { name: new RegExp(`^${name}$`, 'i') },
                    { 'squad.0.name': new RegExp(`^${player}$`, 'i') },
                    { 'squad.0.position': new RegExp(`^${position}$`, 'i') }
                ]
            })
            .exec();
            
    }

    async removeTeamById(id: string) {
        return Team.deleteOne({ _id: id }).exec();
    }

    async updateTeamById(
        id: string,
        resource: PutTeamDto | PatchTeamDto
    ) {
        const existingTeam = await Team.findOneAndUpdate(
            { _id: id },
            { $set: resource },
            { new: true }
        ).exec();

        return existingTeam;
    }
}

export default new TeamDAO();