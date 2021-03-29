import { UserNotFoundException } from '../../domain/user.exception';
import { OnMemoryUserRepository } from './user.repository';

describe('OnMemory infra tier', () => {
  const repo = new OnMemoryUserRepository();

  beforeEach(() => {
    repo.deleteAll();
  });

  describe('create()', () => {
    it('creates a User', async () => {
      const created = await repo.create({
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      });
      expect(await repo.find(created.id)).toBeDefined();
    });
    it('generates ID automatic', async () => {
      const created = await repo.create({
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      });
      expect(created.id).toBeDefined();
    });
  });

  describe('find()', () => {
    it('throws an error if UserId is invalid', async () => {
      expect(repo.find('unknown')).rejects.toThrow(UserNotFoundException);
    });
    it('throws an error if user not found', async () => {
      expect(repo.find('12characters')).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('findByName()', () => {
    it('throws an error if user does not exist', async () => {
      expect(repo.findByName('unknown')).rejects.toThrow(UserNotFoundException);
    });
    it('gets a user', async () => {
      const user = await repo.create({
        name: 'KengoTODA',
        createdAt: new Date(),
        dob: null,
        description: null,
        address: null,
      });
      expect(repo.findByName('KengoTODA')).resolves.toStrictEqual(user);
    });
  });

  describe('update()', () => {
    it('throws an error if user not found', async () => {
      async function tryUpdate() {
        await repo.update({
          id: 'unknown',
          name: 'name',
          dob: new Date(),
          address: 'address',
          description: 'description',
          createdAt: new Date(),
        });
      }
      expect(async () => {
        await tryUpdate();
      }).rejects.toThrow(UserNotFoundException);
    });
    it('updates property', async () => {
      const created = await repo.create({
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      });
      await repo.update({
        ...created,
        name: 'new name',
      });
      expect(repo.find(created.id)).resolves.toHaveProperty('name', 'new name');
    });
  });

  describe('delete()', () => {
    it('throws an error if UserId is invalid', async () => {
      expect(repo.delete('unknown')).rejects.toThrow(UserNotFoundException);
    });
    it('throws an error if user not found', async () => {
      expect(repo.delete('12characters')).rejects.toThrow(
        UserNotFoundException,
      );
    });
    it('delete a user', async () => {
      const created = await repo.create({
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      });
      await repo.delete(created.id);
      expect(repo.find(created.id)).rejects.toThrow(UserNotFoundException);
    });
  });
});
