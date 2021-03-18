export type UserID = string;

export interface User {
  id: UserID;
  name: string;
  dob: Date;
  address: string;
  description: string;
  createdAt: Date;
}
