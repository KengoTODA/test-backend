import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserModule } from './application/user.module';

@Module({
  imports: [UserModule],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
