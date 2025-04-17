export default class UserManager {
  constructor() {
    this.users = new Set(); // Store usernames
  }

  /**
   * Creates a new user.
   * @param {string} username - The username to create.
   * @throws {Error} If the username already exists.
   */
  createUser(username) {
    if (this.users.has(username)) {
      throw new Error(`Username "${username}" already exists.`);
    }
    this.users.add(username);
  }
}