import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserModule } from './application/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './application/auth.module';
import { AccountController } from './presentation/accounts.controller';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    AuthModule,
  ],
  controllers: [UserController, AccountController],
})
export class AppModule {}
