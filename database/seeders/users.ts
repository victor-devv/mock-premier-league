import moment from 'moment';
import argon2 from 'argon2';
import shortid from 'shortid';
const co = require('co'), test = require('assert');
import User from '../../src/models/user.model'

co(async () => {
    try {

        const r: any = await User.create(
            {
                _id: shortid.generate(),
                email: 'admin@test.com',
                password: await argon2.hash('@dm1nAutH'),
                firstName: 'Admin',
                lastName: 'Admin',
                permissionFlags: 2,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                email: 'sanaa@test.com',
                password: await argon2.hash('sanaajaa'),
                firstName: 'Sanaa',
                lastName: 'Lathan',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                email: 'samuelman@gmail.com',
                password: await argon2.hash('lamanyjhdf'),
                firstName: 'Samuel',
                lastName: 'Laman',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            }, 
            {
                _id: shortid.generate(),
                email: 'denishennyworh@test.com',
                password: await argon2.hash('Kazeem27$'),
                firstName: 'Denis',
                lastName: 'Hennyworth',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            }, {
                _id: shortid.generate(),
                email: 'juse@test.com',
                password: await argon2.hash('jusdaujher'),
                firstName: 'Tester',
                lastName: 'Jude',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                email: 'bot@test.com',
                password: await argon2.hash('bot#ahs'),
                firstName: 'request',
                lastName: 'bot',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                email: 'markcumber@test.com',
                password: await argon2.hash('cumbbjhygsdf'),
                firstName: 'MArk',
                lastName: 'Cumber',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                email: 'dreizzy.harley@test.com',
                password: await argon2.hash('ouwebjbd'),
                firstName: 'Dreizzy',
                lastName: 'Harley',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                email: 'testernames@test.com',
                password: await argon2.hash('bvjkerbfa'),
                firstName: 'Tester',
                lastName: 'Names',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                email: 'suppd@test.com',
                password: await argon2.hash('Kazeem27$'),
                firstName: 'Suppd',
                lastName: 'Alamander',
                permissionFlags: 1,
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            }

        );

        test.equal(10, r.insertedCount);

    } catch (e) {
        console.log(e);
    }
});
