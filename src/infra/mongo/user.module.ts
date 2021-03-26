import { Module } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { MongoUserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';

export const userRepositoryProvider = {
  provide: UserRepository,
  useClass: MongoUserRepository,
};

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
  controllers: [],
  providers: [userRepositoryProvider],
  exports: [],
})
export class MongoUserModule {}
