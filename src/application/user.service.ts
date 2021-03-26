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
  getUser(id: UserId): Promise<User | undefined> {
    return this.userRepository.load(id);
  }

  async createUser(newUser: NewUser): Promise<User> {
    const id = this.createUserId();
    const createdUser = { ...newUser, id };
    await this.userRepository.create(createdUser);
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
  deleteUser(id: UserId): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  private createUserId(): string {
    // TODO generate user id randomly
    return 'a';
  }
}

export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`No user found with user ID ${id}`);
  }
}

export { User, NewUser, UserId } from '../domain/user.interface';
