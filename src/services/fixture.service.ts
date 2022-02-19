import { CRUD } from '../interfaces/crud.interface';
import FixtureDAO from '../daos/fixture.dao';
import { CreateFixtureDto, FixtureTeam, PatchFixtureDto, SearchFixturesDto } from '../dtos/fixture.dto';

import debug from 'debug';
const log: debug.IDebugger = debug('app:team-services');

class FixtureService {
    async create(resource: CreateFixtureDto) {
        return FixtureDAO.createFixture(resource);
    }

    async read(resource: CreateFixtureDto) {
        return FixtureDAO.getFixture(resource);
    }

    async readById(id: string) {
        return FixtureDAO.getFixtureById(id);
    }

    async update(id: string, resource: CreateFixtureDto) {
        return FixtureDAO.updateFixtureById(id, resource);
    }

    async delete(id: string) {
        return FixtureDAO.removeFixtureById(id);
    }

    async list(limit: number, page: number) {
        return FixtureDAO.getFixtures();
    }

    async listCompleted(limit: number, page: number) {
        return FixtureDAO.getCompletedFixtures();
    }

    async listPending(limit: number, page: number) {
        return FixtureDAO.getPendingFixtures();
    }

    async search(resource: SearchFixturesDto) {
        return FixtureDAO.searchFixtures(resource);
    }
}

export default new FixtureService();