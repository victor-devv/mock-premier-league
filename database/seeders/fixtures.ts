import moment from 'moment';
import shortid from 'shortid';
const co = require('co'), test = require('assert');
import Fixture from '../../src/models/fixture.model'

function testBox() {
    co(async () => {
        try {
            const r: any = await Fixture.create(
                {
                    _id: shortid.generate(),
                    teamA: [{ name: 'Arsenal', score: 0 }],
                    teamB: [{ name: 'Chelsea', score: 0 }],
                    status: 'completed',
                    matchInfo: [{ date: '2022-02-25T16:24:32.674+00:00' }, { stadium: 'Craven Cottage' }],
                    createdAt: moment(Date.now()).format('LLLL'),
                    updatedAt: moment(Date.now()).format('LLLL')
                },
                {
                    _id: shortid.generate(),
                    teamA: [{ name: 'Brighton and Hove Albion', score: 0 }],
                    teamB: [{ name: 'Aston Villa', score: 0 }],
                    status: 'pending',
                    matchInfo: [{ date: '2022-03-09T16:24:32.674+00:00' }, { stadium: 'Vitality Stadium' }],
                    createdAt: moment(Date.now()).format('LLLL'),
                    updatedAt: moment(Date.now()).format('LLLL')
                },
                {
                    _id: shortid.generate(),
                    teamA: [{ name: 'Arsenal', score: 0 }],
                    teamB: [{ name: 'Brighton and Hove Albion', score: 0 }],
                    status: 'pending',
                    matchInfo: [{ date: '2022-03-04T16:24:32.674+00:00' }, { stadium: 'Vicarage Road' }],
                    createdAt: moment(Date.now()).format('LLLL'),
                    updatedAt: moment(Date.now()).format('LLLL')
                },
                {
                    _id: shortid.generate(),
                    teamA: [{ name: 'Aston Villa', score: 0 }],
                    teamB: [{ name: 'Chelsea', score: 0 }],
                    status: 'completed',
                    matchInfo: [{ date: '2022-04-26T16:24:32.674+00:00' }, { stadium: 'Craven Cottage' }],
                    createdAt: moment(Date.now()).format('LLLL'),
                    updatedAt: moment(Date.now()).format('LLLL')
                }
            );
            test.equal(4, r.insertedCount);
        } catch (e) {
            console.log(e);
        }
    });

}

testBox();
