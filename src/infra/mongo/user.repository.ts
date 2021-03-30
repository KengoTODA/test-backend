import { User, UserId } from '../../domain/user.interface';
import { UserFoundError, UserNotFoundError } from '../../domain/user.error';
import { UserRepository } from '../../domain/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserInMongo, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

const CONTEXT = 'MongoUserRepository';

function isValidId(id: UserId): boolean {
  return !!id && id.length > 0;
}

/**
 * Remove params generated by Mongoose, to return it to caller
 * @param doc the {@link UserDocument} to map from
 * @returns mapped {@link User} value
 */
function mapToEntity(doc: UserDocument): User {
  return {
    id: doc.id,
    name: doc.name,
    dob: doc.dob,
    description: doc.description,
    createdAt: doc.createdAt,
    address: doc.address,
  };
}

export class MongoUserRepository extends UserRepository {
  constructor(
    @InjectModel(UserInMongo.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async list(): Promise<User[]> {
    const documents = await this.userModel.find()
    .sort({id: 'asc'})
    .exec();
    return documents.map(mapToEntity);
  }

  async create(user: User): Promise<void> {
    const found = await this.userModel.findOne({ id: user.id }).exec();
    if (found) {
      throw new UserFoundError(user.id);
    }
    const createdUser = new this.userModel(user);
    await createdUser.save();
  }

  async update(user: User): Promise<void> {
    if (!isValidId(user.id)) {
      Logger.debug(
        `Given UserId is unexpectedly formatted as UserId: ${user.id}`,
        CONTEXT,
      );
      throw new UserNotFoundError(user.id);
    }
    const result = await this.userModel.updateOne({ id: user.id }, user).exec();
    if (result.n !== 1) {
      Logger.debug(
        `Mongo updated no user, probably we have no User with the given UserId: ${user.id}. Value of n returned from Mongo is ${result.n}`,
        CONTEXT,
      );
      throw new UserNotFoundError(user.id);
    }
  }

  async load(id: UserId): Promise<User | undefined> {
    if (!isValidId(id)) {
      Logger.debug(
        `Given UserId is unexpectedly formatted as UserId: ${id}`,
        CONTEXT,
      );
      throw new UserNotFoundError(id);
    }
    const found = await this.userModel.findOne({ id }).exec();
    if (found) {
      return mapToEntity(found);
    } else {
      throw new UserNotFoundError(id);
    }
  }

  async delete(id: UserId): Promise<void> {
    if (!isValidId(id)) {
      Logger.debug(
        `Given UserId is unexpectedly formatted as UserId: ${id}`,
        CONTEXT,
      );
      throw new UserNotFoundError(id);
    }
    const result = await this.userModel.deleteOne({ id }).exec();

    if (result.deletedCount !== 1) {
      Logger.debug(
        `Mongo deleted no user, probably we have no User with the given UserId: ${id}`,
        CONTEXT,
      );
      throw new UserNotFoundError(id);
    }
  }

  async deleteAll(): Promise<void> {
    await this.userModel.deleteMany({}).exec();
  }
}
