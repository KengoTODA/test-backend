import { Injectable } from '@nestjs/common';
import { User, UserID } from './interfaces/user.interface';

@Injectable()
export class UserService {
  listUser(): User[] {
    // TODO use stream instead of array
    return [];
  }
  getUser(id: UserID): User | null {
    return null;
  }
}
