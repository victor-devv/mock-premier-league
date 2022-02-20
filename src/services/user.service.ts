import UserDAO from '../daos/user.dao';
import { CRUD } from '../interfaces/crud.interface';
import { UserSignUpDto, PutUserDto, PatchUserDto } from '../dtos/user.dto'

import debug from 'debug';
const log: debug.IDebugger = debug('app:user-services');

class UserService implements CRUD {
    async create(resource: UserSignUpDto) {
        return UserDAO.createUser(resource);
    }

    async createAdmin(resource: UserSignUpDto) {
        return UserDAO.createAdmin(resource);
    }

    async read(id: string) {
        return UserDAO.getUserById(id);
    }

    async readById(id: string) {
        return UserDAO.getUserById(id);
    }

    async list(limit: number, page: number) {
        return UserDAO.getUsers();
    }

    async getUserByEmail(email: string) {
        return UserDAO.getUserByEmail(email);
    }

    async getUserByEmailWithPassword(email: string) {
        return UserDAO.getUserByEmailWithPassword(email);
    }
    
    async update(id: string, resource: PatchUserDto) {
        return UserDAO.updateUserById(id, resource);
    }

    async patchById(id: string, resource: PatchUserDto) {
        return UserDAO.updateUserById(id, resource);
    }

    async putById(id: string, resource: PutUserDto) {
        return UserDAO.updateUserById(id, resource);
    }

    async delete(id: string) {
        return UserDAO.removeUserById(id);
    }

    async deleteById(id: string) {
        return UserDAO.removeUserById(id);
    }
}

export default new UserService();