export default class UserManager {
  #users;

  constructor() {
    this.#users = new Set();
  }

  async createUser(username) {
    if (typeof username !== 'string' || username.trim().length === 0) {
      throw new Error('Username must be a non-empty string.');
    }
    if (this.#users.has(username)) {
      throw new Error(`Username "${username}" already exists.`);
    }
    this.#users.add(username);
  }

  async userExists(username) {
    return this.#users.has(username);
  }

  async getAllUsers() {
    return Array.from(this.#users);
  }
}