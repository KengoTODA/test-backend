export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`No user found with user ID ${id}`);
  }
}
export class UserFoundException extends Error {
  constructor(id: string) {
    super(`User found with user ID ${id}`);
  }
}
