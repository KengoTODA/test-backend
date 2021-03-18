export type UserID = string;

export interface NewUser {
  name: string;
  dob: Date;
  address: string;
  description: string;
  createdAt: Date;
}

export type User = NewUser & {
  id: UserID;
};
