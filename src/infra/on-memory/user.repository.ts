import { NewUser, User, UserId } from '../../domain/user.interface';
import { UserRepository } from '../../domain/user.repository';

export class OnMemoryUserRepository extends UserRepository {
  constructor(private readonly map: Map<UserId, User>) {
    super();
    this.map = new Map<UserId, User>();
  }

  private createRandomId(): string {
    return 'a';
  }

  list(): Promise<IterableIterator<User>> {
    return Promise.resolve(this.map.values());
  }

  create(user: NewUser) {
    const id = this.createRandomId();
    const createdUser = { id, ...user };
    this.map.set(id, createdUser);
    return Promise.resolve(createdUser);
  }

  update(user: User) {
    this.map.set(user.id, user);
    return Promise.resolve(void 0);
  }

  load(id: UserId): Promise<User | undefined> {
    return Promise.resolve(this.map.get(id));
  }

  delete(id: UserId): Promise<boolean> {
    return Promise.resolve(this.map.delete(id));
  }

  deleteAll(): Promise<void> {
    this.map.clear();
    return Promise.resolve(void 0);
  }
}
