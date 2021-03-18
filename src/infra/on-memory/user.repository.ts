import { User, UserID } from '../../domain/user.interface';
import { UserRepository } from '../../domain/user.repository';

export class OnMemoryUserRepository extends UserRepository {
  constructor(private readonly map: Map<UserID, User>) {
    super();
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
