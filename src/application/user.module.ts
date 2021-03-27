import { Module } from '@nestjs/common';
import { UserAppService, UserDomainService } from './user.service';
import { MongoUserModule } from '../infra/mongo/user.module';

@Module({
  imports: [MongoUserModule],
  providers: [UserAppService, UserDomainService],
  exports: [UserAppService],
})
export class UserModule {}
