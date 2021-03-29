import { Test, TestingModule } from '@nestjs/testing';
import * as nock from 'nock';
import { UserRepository } from '../domain/user.repository';
import { OnMemoryUserRepository } from '../infra/on-memory/user.repository';
import { AuthService } from './auth.service';
import { UserAppService } from './user.service';

/**
 * Mocked response from api.github.com/user
 * @see https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
 */
const authenticated = {
  login: 'octocat',
  id: 1,
  node_id: 'MDQ6VXNlcjE=',
  avatar_url: 'https://github.com/images/error/octocat_happy.gif',
  gravatar_id: '',
  url: 'https://api.github.com/users/octocat',
  html_url: 'https://github.com/octocat',
  followers_url: 'https://api.github.com/users/octocat/followers',
  following_url: 'https://api.github.com/users/octocat/following{/other_user}',
  gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
  organizations_url: 'https://api.github.com/users/octocat/orgs',
  repos_url: 'https://api.github.com/users/octocat/repos',
  events_url: 'https://api.github.com/users/octocat/events{/privacy}',
  received_events_url: 'https://api.github.com/users/octocat/received_events',
  type: 'User',
  site_admin: false,
  name: 'monalisa octocat',
  company: 'GitHub',
  blog: 'https://github.com/blog',
  location: 'San Francisco',
  email: 'octocat@github.com',
  hireable: false,
  bio: 'There once was...',
  twitter_username: 'monatheoctocat',
  public_repos: 2,
  public_gists: 1,
  followers: 20,
  following: 0,
  created_at: '2008-01-14T04:33:35Z',
  updated_at: '2008-01-14T04:33:35Z',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const userRepositoryProvider = {
      provide: UserRepository,
      useClass: OnMemoryUserRepository,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [userRepositoryProvider, AuthService, UserAppService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logIn', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('creates a user', (done) => {
      const scope = nock('https://api.github.com')
        .get('/user')
        .reply(200, authenticated);
      service.logIn('token', (e, user) => {
        expect(user).toHaveProperty('name', 'octocat');
        scope.done();
        done();
      });
    });
  });
});
