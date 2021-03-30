import { Injectable } from '@nestjs/common';
import { NewUser, User, UserId } from '../domain/user.interface';
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
  async getUser(id: UserId): Promise<User> {
    return this.userRepository.find(id);
  }

  /**
   * @param name name (= GitHub login name) of the target user
   * @returns the user data found by the given name
   * @throws {@link UserNotFoundException}
   * Thrown if specified user does not exist
   */
  async getUserByName(name: string): Promise<User> {
    return this.userRepository.findByName(name);
  }

  async createUser(newUser: NewUser): Promise<User> {
    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }

  async updateUser(user: User) {
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

export { User, NewUser, UserId } from '../domain/user.interface';
export { UserNotFoundException } from '../domain/user.exception';
