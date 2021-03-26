import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserModule } from './application/user.module';
import { MongoUserModule } from './infra/mongo/user.module';

@Module({
  imports: [UserModule, MongoUserModule],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
