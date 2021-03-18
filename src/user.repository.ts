import { User, UserID } from './interfaces/user.interface';

export class UserRepository {
  constructor(private readonly map: Map<UserID, User>) {
    this.map = new Map<UserID, User>();
  }

  list(): IterableIterator<User> {
    return this.map.values();
  }

  store(user: User) {
    this.map.set(user.id, user);
  }

  load(id: UserID): User | undefined {
    return this.map.get(id);
  }

  delete(id: UserID): boolean {
    return this.map.delete(id);
  }
}
