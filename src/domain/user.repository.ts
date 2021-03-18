import { User, UserID } from './user.interface';

export abstract class UserRepository {
  abstract list(): IterableIterator<User>;
  abstract store(user: User): void;
  abstract load(id: UserID): User | undefined;
  abstract delete(id: UserID): boolean;
}
