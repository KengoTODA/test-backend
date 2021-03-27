import { Injectable } from '@nestjs/common';
import {
  NewUser,
  User,
  UserId,
  UserNotFoundException,
} from '../domain/user.interface';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async listUser(): Promise<IterableIterator<User>> {
    return this.userRepository.list();
  }

  /**
   * @param id UserId of the target user
   * @returns the user data found by the given UserId
   */
  getUser(id: UserId): Promise<User> {
    return this.userRepository.load(id);
  }

  async createUser(newUser: NewUser): Promise<User> {
    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }

  async updateUser(user: User) {
    const old = await this.userRepository.load(user.id);
    if (!old) {
      throw new UserNotFoundException(user.id);
    }
    return this.userRepository.update(user);
  }

  /**
   * @param id UserId of the target user
   * @returns true if user is found and deleted
   */
  deleteUser(id: UserId): Promise<void> {
    return this.userRepository.delete(id);
  }
}

export {
  User,
  NewUser,
  UserId,
  UserNotFoundException,
} from '../domain/user.interface';
