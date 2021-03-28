import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.interface';
import { UserAppService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private readonly user: UserAppService) {}

  /**
   * Create or find a {@link User} for the GitHub account provided by
   *
   * @param accessToken GitHub access token
   * @param cb callback function to call when authentication finishes
   */
  logIn(accessToken: string, cb: (e: Error, u: User) => void) {
    this.user
      .createOrGetFromGitHub(accessToken)
      .then((created) => {
        cb(null, created);
      })
      .catch((e) => {
        cb(e, null);
      });
  }
}
