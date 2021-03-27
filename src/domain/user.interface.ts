export type UserId = string;

export interface NewUser {
  name: string;
  dob: Date;
  address: string;
  description: string;
  createdAt: Date;
}

export type User = NewUser & {
  id: UserId;
};

export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`No user found with user ID ${id}`);
  }
}
