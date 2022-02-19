import mongooseService from '../services/mongoose.service';
import moment from 'moment';

const Schema = mongooseService.getMongoose().Schema;

const team = {
    ref: 'Teams',
    type: Array,
    name: {
        type: String,
        enum: {
            values:
                [
                    'Arsenal', 'Aston Villa', 'Brentford', 'Brighton & Hove Albion', 'Burnley', 'Chelsea',
                    'Crystal Palace', 'Everton', 'Leeds United', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle United', ' Norwich City', 'Southampton', 'Tottenham Hotspur', 'Watford',
                    'West Ham United', 'Wolverhampton Wanderers'
                ],
            message: 'Team provided is not in the premier league'
        }
    },
    score: { type: Number, default: 0 }
};

const fixtureSchema = new Schema({
    _id: String,
    teamA: team,
    teamB: team,
    status: { type: String, default: 'pending' },
    matchInfo: {
        type: Array,
        date: Date,
        stadium: {
            type: String,
            enum: {
                values:
                    [
                        'Vitality Stadium', 'The Amex', 'Turf Moor', 'Cardiff City Stadium',
                        "John Smith's Stadium", 'King Power Stadium', 'Goodison Park', 'Anfield',
                        'Emirates Stadium', 'Stamford Bridge', 'Selhurst Park', 'Craven Cottage',
                        'Wembley Stadium', 'London Stadium', 'Etihad Stadium', 'Old Trafford',
                        'St James Park', "St Mary's Stadium", 'Vicarage Road', 'Molineux Stadium'                    
                    ],
                message: 'Stadium provided is not in the premier league'
            }
        }
    },
    createdAt: { type: Date, default: moment(Date.now()).format('LLLL') },
    updatedAt: { type: Date, default: moment(Date.now()).format('LLLL') },
}, { id: false });


const Fixture = mongooseService.getMongoose().model('Fixtures', fixtureSchema);

export default Fixture;

