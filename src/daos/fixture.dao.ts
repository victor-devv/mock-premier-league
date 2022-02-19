import Fixture from '../models/fixture.model';
import { CreateFixtureDto, SearchFixturesDto } from '../dtos/fixture.dto';
import shortid from 'shortid';

class FixtureDAO {
    fixtures: Array<CreateFixtureDto> = [];

    async createFixture(payload: CreateFixtureDto) {
        const { teamA, teamB, matchInfo } = payload;

        const fixtureId = shortid.generate();

        const fixture: any = new Fixture({
            _id: fixtureId,
            teamA,
            teamB,
            matchInfo
        });

        return await fixture.save();

    }


    async getFixture(payload: any) {
        const { teamA, teamB, stadium, date } = payload

        return Fixture.find({
                    $or: [
                        { teamA: new RegExp(`^${teamA}$`, 'i') },
                        { teamB: new RegExp(`^${teamB}$`, 'i') },
                        { 'matchInfo.stadium': new RegExp(`^${stadium}$`, 'i') },
                    ]
                })
                .exec();

        // return Fixture.find({ teamA, teamB, matchInfo }).exec();
    }

    async getFixtures(limit = 25, page = 0) {
        return Fixture.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async getCompletedFixtures(limit = 25, page = 0) {
        return Fixture.find({ status: 'completed' })
            .skip(limit * page)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
    }

    async getPendingFixtures(limit = 25, page = 0) {
        return Fixture.find({ status: 'pending' })
            .skip(limit * page)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
    }

    async getFixtureById(id: string) {
        return Fixture.findOne({ _id: id }).exec();
    }

    async searchFixtures(payload: SearchFixturesDto) {
        const { name, date, status } = payload;
        let { stadium } = payload;
        
        let stadiumC = new RegExp(`^${stadium}$`, 'i');
        return Fixture.find({
                $or: [
                    { status },
                    { 'teamA.0.name': new RegExp(`^${name}$`, 'i') },
                    { 'teamB.0.name': new RegExp(`^${name}$`, 'i') },
                    { matchInfo: { $elemMatch: { date, stadiumC } } }
                ]
            })
            .skip(25 * 0)
            .limit(25)
            .sort({ createdAt: -1 })
            .exec();
    }

    async removeFixtureById(id: string) {
        return Fixture.deleteOne({ _id: id }).exec();
    }

    async updateFixtureById(
        id: string,
        resource: CreateFixtureDto
    ) {
        const existingFixture = await Fixture.findOneAndUpdate(
            { _id: id },
            { $set: resource },
            { new: true }
        ).exec();

        return existingFixture;
    }
}

export default new FixtureDAO();