import { User, UserId } from '../../domain/user.interface';
import { UserRepository } from '../../domain/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserInMongo, UserDocument } from './user.schema';
import { Model } from 'mongoose';

export class MongoUserRepository extends UserRepository {
  constructor(
    @InjectModel(UserInMongo.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async list(): Promise<IterableIterator<User>> {
    const documents = await this.userModel.find().exec();
    return documents.values();
  }

  create(user: User): Promise<void> {
    const createdUser = new this.userModel(user);
    createdUser.save();
    return Promise.resolve(void 0);
  }

  update(user: User) {
    const updatedUser = new this.userModel(user);
    return updatedUser.updateOne().exec();
  }

  async load(id: UserId): Promise<User | undefined> {
    return this.userModel.findOne({ id }).exec();
  }

  delete(id: UserId): Promise<boolean> {
    return new Promise((resolve) => {
      this.userModel
        .deleteOne({ id })
        .exec()
        .then((result) => {
          resolve(1 === result.ok);
        });
    });
  }
}
