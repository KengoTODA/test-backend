import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createResponse } from 'node-mocks-http';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return empty list', () => {
      expect(userController.listUser()).toStrictEqual([]);
    });
  });
  describe('/:id', () => {
    it('should return 404 by default', () => {
      const res = createResponse();
      userController.findUser({ id: 'foo' }, res);
      expect(res.statusCode).toBe(404);
    });
  });
});
