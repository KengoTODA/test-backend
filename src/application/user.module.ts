import { Module } from '@nestjs/common';
import { UserAppService } from './user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserAppService],
  exports: [UserAppService],
})
export class UserModule {}
