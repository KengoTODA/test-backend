import { User, UserId } from '../../domain/user.interface';
import { UserFoundError, UserNotFoundError } from '../../domain/user.error';
import { UserRepository } from '../../domain/user.repository';

export class OnMemoryUserRepository extends UserRepository {
  private readonly map: Map<UserId, User>;
  constructor() {
    super();
    this.map = new Map<UserId, User>();
  }

  private createRandomId(): string {
    return 'a';
  }

  list(): Promise<User[]> {
    const list = Array.from(this.map.values());
    list.sort((a, b) => a.id.localeCompare(b.id));
    return Promise.resolve(list);
  }

  create(user: User) {
    if (this.map.has(user.id)) {
      return Promise.reject(new UserFoundError(user.id));
    }
    this.map.set(user.id, user);
    return Promise.resolve(void 0);
  }

  update(user: User) {
    if (!this.map.has(user.id)) {
      return Promise.reject(new UserNotFoundError(user.id));
    }
    this.map.set(user.id, user);
    return Promise.resolve(void 0);
  }

  load(id: UserId): Promise<User | undefined> {
    if (!this.map.has(id)) {
      return Promise.reject(new UserNotFoundError(id));
    }
    return Promise.resolve(this.map.get(id));
  }

  delete(id: UserId): Promise<void> {
    if (!this.map.has(id)) {
      return Promise.reject(new UserNotFoundError(id));
    }
    this.map.delete(id);
    return Promise.resolve(void 0);
  }

  deleteAll(): Promise<void> {
    this.map.clear();
    return Promise.resolve(void 0);
  }
}
