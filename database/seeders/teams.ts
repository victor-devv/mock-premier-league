import moment from 'moment';
import shortid from 'shortid';
const co = require('co'), test = require('assert');
import Team from '../../src/models/team.model'

co(async () => {
    try {
        const r: any = await Team.create(
            {
                _id: shortid.generate(),
                name: 'Arsenal',
                squad: [
                    { name: 'Sead Kolasinac', position: 'Defender' }, { name: 'Calum Chambers', role: 'Defender' }, { name: 'Kieran Tierney', role: 'Defender' }, { name: 'David Luiz', role: 'Defender' },
                    { name: 'Tolaji Bola', role: 'Defender' }, { name: 'Mesut Ozil', role: 'Midfielder' }, { name: 'Lucas Torreira', role: 'Midfielder' }, { name: 'Ainsley Maitland-Niles', role: 'Midfielder' },
                    { name: 'Matteo Guendouzi', role: 'Midfielder' }, { name: 'Granit Xhaka', role: 'Midfielder' }, { name: 'Joe Willock', role: 'Midfielder' }, { name: 'Emile Smith Rowe', role: 'Midfielder' },
                    { name: 'Gabriel Martinelli', role: 'Midfielder' }, { name: 'Dani Ceballos', role: 'Midfielder' }, { name: 'Robbie Burton', role: 'Midfielder' }, { name: 'Alexandre Locazatte', role: 'Forward' },
                    { name: 'Pierre-Emerick Aubameyang', role: 'Forward' }, { name: 'Reiss Nelson', role: 'Forward' }, { name: 'Nicolas Pepe', role: 'Forward' }, { name: 'Bukayo Saka', role: 'Forward' },
                    { name: 'Folarin Balogun', role: 'Forward' }
                ],
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                name: 'Aston Villa',
                teamMembers: [
                    { name: 'Orjan Nyland', role: 'Gaol Keeper' }, { name: 'Jed Steer', role: 'Gaol Keeper' }, { name: 'Lovre Kalinic', role: 'Gaol Keeper' }, { name: 'Tom Heaton', role: 'Defender' },
                    { name: 'Neil Taylor', role: 'Defender' }, { name: 'James Chester', role: 'Defender' }, { name: 'Ahmed El Mohamady', role: 'Defender' }, { name: 'Frederic', role: 'Defender' },
                    { name: 'Matt Targett', role: 'Defender' }, { name: 'Kortney Hause', role: 'Defender' }, { name: 'Tyrone Mings', role: 'Defender' }, { name: 'Ezri Kansa Ngoyo', role: 'Defender' },
                    { name: 'Bjorn Engels', role: 'Defender' }, { name: 'John McGinn', role: 'Midfielder' }, { name: 'Henri Lansbury', role: 'Midfielder' }, { name: 'Jack Grealish', role: 'Midfielder' },
                    { name: 'Conor Hourihane', role: 'Midfielder' }, { name: 'Keinan Davis', role: 'Midfielder' }, { name: 'Jota', role: 'Midfielder' }, { name: 'Anwar El Ghazi', role: 'Midfielder' },
                    { name: 'Trezeguet', role: 'Midfielder' }, { name: 'Douglas Luiz', role: 'Midfielder' }, { name: 'Marvelous Nakamba', role: 'Midfielder' }, { name: 'Jacob Ramsey', role: 'Midfielder' },
                    { name: 'Jonathan Kodija', role: 'Forward' }, { name: 'Wesley', role: 'Forward' }, { name: 'Cameron Archer', role: 'Forward' }
                ],
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            },
            {
                _id: shortid.generate(),
                name: 'Brighton and Hove Albion',
                squad: [
                    { name: 'David Button', role: 'Gaol Keeper' }, { name: 'Robert Sánchez', role: 'Gaol Keeper' }, { name: 'Mathew Ryan', role: 'Gaol Keeper' }, { name: 'Jason Steele', role: 'Gaol Keeper' },
                    { name: 'Leon Balogun', role: 'Defender' }, { name: 'Bernardo', role: 'Defender' }, { name: 'Gaëtan Bong', role: 'Defender' }, { name: 'Bruno', role: 'Defender' },
                    { name: 'Dan Burn', role: 'Defender' }, { name: 'Shane Duffy', role: 'Defender' }, { name: 'Lewis Dunk', role: 'Defender' }, { name: 'Martín Montoya', role: 'Defender' },
                    { name: 'Leo Østigård', role: 'Defender' }, { name: 'Yves Bissouma', role: 'Midfielder' },
                    { name: 'Will Collar', role: 'Midfielder' }, { name: 'Pascal Groß', role: 'Midfielder' }, { name: 'Biram Kayal', role: 'Midfielder' }, { name: 'Anthony Knockaert', role: 'Midfielder' },
                    { name: 'Solomon March', role: 'Midfielder' }, { name: 'Jayson Molumby', role: 'Midfielder' }, { name: 'Davy Pröpper', role: 'Midfielder' }, { name: 'Max Sanders', role: 'Midfielder' },
                    { name: 'Dale Stephens', role: 'Midfielder' },
                    { name: 'Viktor Gyökeres', role: 'Forward' }, { name: 'José Izquierdo', role: 'Forward' }, { name: 'Alireza Jahanbakhsh', role: 'Forward' }, { name: 'Jürgen Locadia', role: 'Forward' },
                    { name: 'Glenn Murray', role: 'Forward' }
                ],
                createdAt: moment(Date.now()).format('LLLL'),
                updatedAt: moment(Date.now()).format('LLLL')
            }
        );
        test.equal(3, r.insertedCount);
    } catch (e) {
        console.log(e);
    }
});
