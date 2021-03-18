import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './domain/user.repository';
import { OnMemoryUserRepository } from './infra/on-memory/user.repository';
import { UserAppService } from './application/user.service';

export const userRepositoryProvider = {
  provide: UserRepository,
  useClass: OnMemoryUserRepository,
};

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserAppService, userRepositoryProvider],
})
export class AppModule {}
