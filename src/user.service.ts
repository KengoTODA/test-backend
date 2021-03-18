import { Injectable } from '@nestjs/common';
import { NewUser, User, UserID } from './interfaces/user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  listUser(): IterableIterator<User> {
    return this.userRepository.list();
  }

  /**
   * @param id UserID of the target user
   * @returns the user data found by the given UserID
   */
  getUser(id: UserID): User | undefined {
    return this.userRepository.load(id);
  }

  createUser(newUser: NewUser): User {
    const id = this.createUserID();
    const createdUser = { ...newUser, id };
    this.userRepository.store(createdUser);
    return createdUser;
  }

  updateUser(user: User) {
    const old = this.userRepository.load(user.id);
    if (!old) {
      throw new UserNotFoundException(user.id);
    }
    this.userRepository.store(user);
  }

  /**
   * @param id UserID of the target user
   * @returns true if user is found and deleted
   */
  deleteUser(id: UserID): boolean {
    return this.userRepository.delete(id);
  }

  private createUserID(): string {
    // TODO generate user id randomly
    return 'a';
  }
}

export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`No user found with user ID ${id}`);
  }
}
