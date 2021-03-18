import { Bind, Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserID } from './interfaces/user.interface';
import { Response } from 'express';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  listUser(): User[] {
    return this.userService.listUser();
  }

  @Get(':id')
  @Bind(Param(), Res())
  findUser(params: { id: UserID }, res: Response) {
    const user = this.userService.getUser(params.id);
    if (user === null) {
      res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: `No user found with user ID ${params.id}` });
    } else {
      res.status(HttpStatus.OK).send(user);
    }
  }
}
