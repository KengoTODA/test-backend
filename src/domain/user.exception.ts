export class UserNotFoundException extends Error {
  constructor(id?: string) {
    if (id) {
      super(`No user found with user ID ${id}`);
    } else {
      super('No user found');
    }
  }
}
