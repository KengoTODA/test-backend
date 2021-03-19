/**
 * @fileoverview In the context of NestJS, DTO is a class represents the value given to Controller.
 * Each property need to be decorated with class-validator decorators, to validate user input.
 *
 * @see {@link https://docs.nestjs.com/techniques/validation}
 */

import { UserId } from 'src/domain/user.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  id: UserId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  dob: Date;

  @IsString()
  address: string;

  @IsString()
  description: string;

  @IsString()
  createdAt: Date;
}

export type NewUserDto = Omit<UserDto, 'id'>;
