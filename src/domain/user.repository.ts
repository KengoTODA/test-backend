import { NewUser, User, UserId } from './user.interface';

export abstract class UserRepository {
  abstract list(): Promise<IterableIterator<User>>;
  abstract create(user: NewUser): Promise<User>;
  abstract update(user: User): Promise<void>;
  abstract load(id: UserId): Promise<User | undefined>;
  abstract delete(id: UserId): Promise<boolean>;
  /**
   * Delete all users in repository. This method is provided for unit test.
   */
  abstract deleteAll(): Promise<void>;
}
