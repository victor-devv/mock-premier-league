import User from '../models/user.model';
import { UserSignUpDto, PutUserDto, PatchUserDto } from '../dtos/user.dto';
import shortid from 'shortid';
import config from 'config'

export class UserDAO {
    users: Array<UserSignUpDto> = [];

    async createUser(payload: UserSignUpDto) {
        const userId = shortid.generate();
        //const userId = shortid.generate();
        const user: any = new User({
            _id: userId,
            ...payload,
            permissionFlags: 1,
        });
        await user.save();
        return userId;
    }

    async getUserByEmail(email: string) {
        return User.findOne({ email: email }).exec();
    }

    async getUserByEmailWithPassword(email: string) {
        return User.findOne({ email: email })
            .select('_id email permissionFlags password')
            .exec();
    }
 
    async getUserById(userId: string) {
        return User.findOne({ _id: userId }).exec();
    }

    async getUsers(limit = 25, page = 0) {
        return User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async removeUserById(userId: string) {
        return User.deleteOne({ _id: userId }).exec();
    }

    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();

        return existingUser;
    }

}

export default new UserDAO();