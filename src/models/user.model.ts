import mongooseService from '../services/mongoose.service';
import moment from 'moment';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongooseService.getMongoose().Schema;

const userSchema = new Schema({
    _id: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    permissionFlags: Number,
    createdAt: { type: Date, default: moment(Date.now()).format('LLLL') },
    updatedAt: { type: Date, default: moment(Date.now()).format('LLLL') },
}, { id: false });

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongoosePaginate);

const User = mongooseService.getMongoose().model('Users', userSchema);

export default User;