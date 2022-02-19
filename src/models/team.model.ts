import mongooseService from '../services/mongoose.service';
import moment from 'moment';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongooseService.getMongoose().Schema;

const teamSchema = new Schema({
    _id: String,
    name: {
        type: String,
        unique: true,
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
    squad: [{
        name: {
            type: String, lowercase: true, required: true
        },
        position: {
            type: String,
            enum: {
                values: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
                message: 'Invalid player position'
            },
            required: true
        },
        // type: Array
    }],
    createdAt: { type: Date, default: moment(Date.now()).format('LLLL') },
    updatedAt: { type: Date, default: moment(Date.now()).format('LLLL') },
}, { id: false });

teamSchema.plugin(uniqueValidator);

const Team = mongooseService.getMongoose().model('Teams', teamSchema);

export default Team;