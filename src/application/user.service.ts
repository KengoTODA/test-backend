import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { NewUser, User, UserId } from '../domain/user.interface';
import { UserNotFoundException } from '../domain/user.exception';
import { UserRepository } from '../domain/user.repository';

@Injectable()
// TODO put this class into the domain tier
export class UserDomainService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Check existance of user with the given name.
   *
   * @param name user name to search
   * @returns Whether user with the given name exists
   */
  async existWithName(name: string): Promise<boolean> {
    try {
      await this.userRepository.findByName(name);
      return Promise.resolve(true);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return Promise.resolve(false);
      }
      return Promise.reject(e);
    }
  }
}

@Injectable()
export class UserAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly domainService: UserDomainService,
  ) {}

  async listUser(): Promise<IterableIterator<User>> {
    return this.userRepository.list();
  }

  /**
   * @param id UserId of the target user
   * @returns the user data found by the given UserId
   */
  async getUser(id: UserId): Promise<User> {
    return this.userRepository.load(id);
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

  /**
   * Create a user based on GitHub user who provides the access token.
   *
   * @param token GitHub access token
   * @returns the created user
   */
  async createOrGetFromGitHub(token: string): Promise<User> {
    const octokit = new Octokit({ auth: token });
    const user = await octokit.users.getAuthenticated();
    const exists = await this.domainService.existWithName(user.data.login);
    if (exists) {
      return this.userRepository.findByName(user.data.login);
    }

    return this.userRepository.create({
      name: user.data.login,
      dob: null,
      address: user.data.location,
      description: user.data.bio,
      createdAt: new Date(),
    });
  }
}

export { User, NewUser, UserId } from '../domain/user.interface';
export { UserNotFoundException } from '../domain/user.exception';
