import {
  Bind,
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import passport, { authenticate, use } from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { config } from 'dotenv';
import * as express from 'express';
import { ApiOperation, ApiResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { UserNotFoundExceptionFilter } from './user.filter';
import { UserAppService } from '../application/user.service';
config();

@ApiTags('accounts')
@Controller('/accounts')
@UseFilters(new UserNotFoundExceptionFilter())
@ApiOAuth2(['github:user'])
export class AccountController {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserAppService,
  ) {
    use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_REDIRECT_URL,
          scope: ['user'],
        },
        function (accessToken, refreshToken, profile, cb) {
          user
            .createOrGetFromGitHub(accessToken)
            .then((created) => {
              cb(null, created);
            })
            .catch(cb);
        },
      ),
    );
  }

  @UseGuards(AuthGuard('github'))
  @Get()
  @Bind(Request())
  get(req: express.Request) {
    return req.user;
  }

  @Post('logout')
  @Bind(Request())
  async logout(req: express.Request) {
    req.logout();
  }

  @Get('login/callback')
  @Bind(Request())
  callback(req: express.Request) {
    authenticate('github');
    return req.user;
  }
}