import {
  UserFoundException,
  UserNotFoundException,
} from '../../domain/user.exception';
import { OnMemoryUserRepository } from './user.repository';

describe('OnMemory infra tier', () => {
  const repo = new OnMemoryUserRepository();

  beforeEach(() => {
    repo.deleteAll();
  });

  describe('create()', () => {
    it('throws an error if ID is already used', async () => {
      const user = {
        id: 'id',
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      };
      await repo.create(user);
      expect(repo.create(user)).rejects.toThrow(UserFoundException);
    });
    it('creates a User', async () => {
      const user = {
        id: 'id',
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      };
      await repo.create(user);
      expect(repo.load(user.id)).resolves.toBeDefined();
    });
  });

  describe('load()', () => {
    it('throws an error if UserId is invalid', async () => {
      expect(repo.load('')).rejects.toThrow(UserNotFoundException);
    });
    it('throws an error if user not found', async () => {
      expect(repo.load('id')).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('update()', () => {
    it('throws an error if UserId is invalid', async () => {
      expect(
        repo.update({
          id: '',
          name: 'name',
          dob: new Date(),
          address: 'address',
          description: 'description',
          createdAt: new Date(),
        }),
      ).rejects.toThrow(UserNotFoundException);
    });
    it('throws an error if user not found', async () => {
      expect(
        repo.update({
          id: 'id',
          name: 'name',
          dob: new Date(),
          address: 'address',
          description: 'description',
          createdAt: new Date(),
        }),
      ).rejects.toThrow(UserNotFoundException);
    });
    it('updates property', async () => {
      const user = {
        id: 'id',
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      };
      await repo.create(user);
      await repo.update({
        ...user,
        name: 'new name',
      });
      expect(repo.load(user.id)).resolves.toHaveProperty('name', 'new name');
    });
  });

  describe('delete()', () => {
    it('throws an error if UserId is invalid', async () => {
      expect(repo.delete('')).rejects.toThrow(UserNotFoundException);
    });
    it('throws an error if user not found', async () => {
      expect(repo.delete('id')).rejects.toThrow(UserNotFoundException);
    });
    it('delete a user', async () => {
      const user = {
        id: 'id',
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      };
      await repo.create(user);
      await repo.delete(user.id);
      expect(repo.load(user.id)).rejects.toThrow(UserNotFoundException);
    });
  });
});
