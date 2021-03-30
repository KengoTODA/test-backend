import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { UserNotFoundException } from '../domain/user.exception';
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
  async logIn(accessToken: string, cb: (e: Error, u: User) => void) {
    const octokit = new Octokit({ auth: accessToken });
    let githubUser: RestEndpointMethodTypes['users']['getAuthenticated']['response'];

    try {
      githubUser = await octokit.users.getAuthenticated();
      const found = await this.user.getUserByName(githubUser.data.login);
      cb(null, found);
      return;
    } catch (e) {
      if (!(e instanceof UserNotFoundException)) {
        cb(e, null);
        return;
      }
    }

    // this is the first login (= sign up), create a user from GitHub profile
    try {
      const created = await this.user.createUser({
        name: githubUser.data.login,
        dob: null,
        address: githubUser.data.location,
        description: githubUser.data.bio,
        createdAt: new Date(),
      });
      cb(null, created);
      return;
    } catch (e) {
      cb(e, null);
      return;
    }
  }
}
