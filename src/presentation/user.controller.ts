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
import { UserDto, UserWithIdDto } from './user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private readonly UserAppService: UserAppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully listed.',
  })
  listUser(): UserWithIdDto[] {
    // TODO handle as stream
    return Array.from(this.UserAppService.listUser());
  }

  @Get(':id')
  @Bind(Param('id'))
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
  findUser(id: UserId): UserWithIdDto {
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
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  createUser(user: UserDto): UserWithIdDto {
    const createdUser = this.UserAppService.createUser(user);
    return createdUser;
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
  updateUser(id: string, user: UserDto): UserWithIdDto {
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
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
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
