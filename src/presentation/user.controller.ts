import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  UserId,
  UserNotFoundException,
  UserAppService,
} from '../application/user.service';
import { NewUserDto, UserDto } from './user.dto';
@Controller('/users')
export class UserController {
  constructor(private readonly UserAppService: UserAppService) {}

  @Get()
  listUser(): UserDto[] {
    // TODO handle as stream
    return Array.from(this.UserAppService.listUser());
  }

  @Get(':id')
  @Bind(Param('id'))
  findUser(id: UserId): UserDto {
    const user = this.UserAppService.getUser(id);
    if (user === undefined) {
      throw new HttpException(
        `No user found with user ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      return user;
    }
  }

  @Post()
  @Bind(Body())
  createUser(user: NewUserDto): UserDto {
    const createdUser = this.UserAppService.createUser(user);
    return createdUser;
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  updateUser(id: string, user: NewUserDto): UserDto {
    try {
      const updated = { ...user, id };
      this.UserAppService.updateUser(updated);
      return updated;
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new HttpException(
          `No user found with user ID ${id}`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  @Delete(':id')
  @Bind(Param('id'))
  deleteUser(id: UserId) {
    const success = this.UserAppService.deleteUser(id);
    if (!success) {
      throw new HttpException(
        `No user found with user ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
