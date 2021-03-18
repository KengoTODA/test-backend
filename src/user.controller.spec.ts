import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userRepositoryProvider } from './app.module';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, userRepositoryProvider],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return empty list', () => {
      const list = Array.from(userController.listUser());
      expect(list.length).toBe(0);
    });

    it('should return a list after we create a user', () => {
      const created = userController.createUser({
        name: 'Name',
        dob: new Date(),
        address: '',
        description: '',
        createdAt: new Date(),
      });

      const list = Array.from(userController.listUser());
      expect(list.length).toBe(1);
      expect(list[0]).toEqual(created);
    });
  });

  describe('/:id', () => {
    it('should return 404 by default', () => {
      expect(() => userController.findUser('foo')).toThrow(
        new HttpException(
          'No user found with user ID foo',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('should return a user after we create a user', () => {
      const created = userController.createUser({
        name: 'Name',
        dob: new Date(),
        address: '',
        description: '',
        createdAt: new Date(),
      });
      const found = userController.findUser(created.id);
      expect(found).toEqual(created);
    });
  });
});
