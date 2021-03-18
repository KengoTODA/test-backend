import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController, UserController],
  providers: [AppService, UserAppService, userRepositoryProvider],
})
export class AppModule {}
