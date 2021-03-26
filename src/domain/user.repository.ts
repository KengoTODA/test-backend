import { User, UserId } from './user.interface';

export abstract class UserRepository {
  abstract list(): Promise<IterableIterator<User>>;
  abstract create(user: User): Promise<void>;
  abstract update(user: User): Promise<void>;
  abstract load(id: UserId): Promise<User | undefined>;
  abstract delete(id: UserId): Promise<boolean>;
}
