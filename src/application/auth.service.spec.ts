import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../domain/user.repository';
import { OnMemoryUserRepository } from '../infra/on-memory/user.repository';
import { AuthService } from './auth.service';
import { UserAppService, UserDomainService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const userRepositoryProvider = {
      provide: UserRepository,
      useClass: OnMemoryUserRepository,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        userRepositoryProvider,
        AuthService,
        UserAppService,
        UserDomainService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
