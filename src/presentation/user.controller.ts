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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private readonly UserAppService: UserAppService) {}

  @Get()
  @ApiOperation({
    summary: 'List all users registered to the system',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully listed.',
  })
  async listUser(): Promise<UserWithIdDto[]> {
    // TODO handle as stream
    return Array.from(await this.UserAppService.listUser());
  }

  @Get(':id')
  @Bind(Param('id'))
  @ApiOperation({
    summary: 'Get a user with the specified UserID',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
  async findUser(id: UserId): Promise<UserWithIdDto> {
    const user = await this.UserAppService.getUser(id);
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
  @ApiOperation({
    summary: 'Create a user with specified properties',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  createUser(user: UserDto): Promise<UserWithIdDto> {
    return this.UserAppService.createUser(user);
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  @ApiOperation({
    summary: 'Update the user with the specified properties',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
  async updateUser(id: string, user: UserDto): Promise<UserWithIdDto> {
    try {
      const updated = { ...user, id };
      await this.UserAppService.updateUser(updated);
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
  @ApiOperation({
    summary: 'Delete the user with the specified UserID',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
  async deleteUser(id: UserId) {
    const success = await this.UserAppService.deleteUser(id);
    if (!success) {
      throw new HttpException(
        `No user found with user ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
