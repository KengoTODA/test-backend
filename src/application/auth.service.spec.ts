import { Test, TestingModule } from '@nestjs/testing';
import * as nock from 'nock';
import { UserRepository } from '../domain/user.repository';
import { OnMemoryUserRepository } from '../infra/on-memory/user.repository';
import { AuthService } from './auth.service';
import { User, UserAppService } from './user.service';
import { UserNotFoundException } from '../domain/user.exception';
import { promisify } from 'util';

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

class FailingUserRepository implements UserRepository {
  list(): Promise<IterableIterator<User>> {
    return Promise.reject(new Error('Not implemented'));
  }
  create(): Promise<User> {
    return Promise.reject(new Error('Failed to operate'));
  }
  update(): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }
  find(): Promise<User> {
    return Promise.reject(new Error('Not implemented'));
  }
  findByName(): Promise<User> {
    return Promise.reject(new UserNotFoundException());
  }
  delete(): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }
  deleteAll(): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let repo: UserRepository;

  beforeEach(async () => {
    const userRepositoryProvider = {
      provide: UserRepository,
      useClass: OnMemoryUserRepository,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [userRepositoryProvider, AuthService, UserAppService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get<UserRepository>(UserRepository);
  });

  beforeEach(() => {
    repo.deleteAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logIn', () => {
    describe('for first sign-in', () => {
      it('creates a user', async () => {
        const scope = nock('https://api.github.com')
          .get('/user')
          .reply(200, authenticated);
        const logIn = promisify(service.logIn).bind(service);
        const user = await logIn('token');
        expect(user).toHaveProperty('name', 'octocat');
        scope.done();
      });
    });

    describe('for 2nd sign-in', () => {
      let createdAt: Date;
      beforeEach(async () => {
        const scope = nock('https://api.github.com')
          .get('/user')
          .reply(200, authenticated);
        const logIn = promisify(service.logIn).bind(service);
        const created: User = await logIn('token');
        scope.done();
        createdAt = created.createdAt;
      });

      it('returns an existing user', async () => {
        const scope = nock('https://api.github.com')
          .get('/user')
          .reply(200, authenticated);
        const logIn = promisify(service.logIn).bind(service);
        const user = await logIn('token');
        expect(user).toHaveProperty('createdAt', createdAt);
        scope.done();
      });

      it('rejects in case of GitHub API error', async () => {
        const scope = nock('https://api.github.com').get('/user').reply(500);
        const logIn = promisify(service.logIn).bind(service);
        return expect(logIn('token'))
          .rejects.toThrow()
          .then(() => {
            scope.done();
          });
      }, 5000);
    });
  });
});

describe('AuthService with broken datastore', () => {
  let service: AuthService;

  beforeEach(async () => {
    const userRepositoryProvider = {
      provide: UserRepository,
      useClass: FailingUserRepository,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [userRepositoryProvider, AuthService, UserAppService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('logIn', () => {
    describe('for first sign-in', () => {
      it('throws an error if failed to create a user', async () => {
        const scope = nock('https://api.github.com')
          .get('/user')
          .reply(200, authenticated);
        const logIn = promisify(service.logIn).bind(service);
        return expect(logIn('token'))
          .rejects.toThrow()
          .finally(() => {
            scope.done();
          });
      });
    });
  });
});
