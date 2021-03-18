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
import { UserNotFoundException, UserService } from './user.service';
import { NewUser, User, UserID } from './interfaces/user.interface';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  listUser(): User[] {
    // TODO handle as stream
    return Array.from(this.userService.listUser());
  }

  @Get(':id')
  @Bind(Param('id'))
  findUser(id: UserID): User {
    const user = this.userService.getUser(id);
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
  createUser(user: NewUser): User {
    const createdUser = this.userService.createUser(user);
    return createdUser;
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  updateUser(id: string, user: NewUser): User {
    try {
      const updated = { ...user, id };
      this.userService.updateUser(updated);
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
  deleteUser(id: UserID) {
    const success = this.userService.deleteUser(id);
    if (!success) {
      throw new HttpException(
        `No user found with user ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
