import Poll from '../models/Poll.js';

export default class PollsMemoryManagement {
  #polls;

  constructor() {
    this.#polls = new Map();
  }

  async addPoll(poll) {
    if (!(poll instanceof Poll)) {
      throw new Error("The provided object is not an instance of Poll.");
    }
    this.#polls.set(poll.uuid, poll);
  }

  async getPoll(pollId) {
    return this.#polls.get(pollId) || null;
  }

  async votePoll(pollId, optionIndex, username) {
    const poll = await this.getPoll(pollId);
    if (!poll) {
      throw new Error(`Poll with ID ${pollId} not found.`);
    }
    poll.vote(optionIndex, username);
  }

  async getAllPolls() {
    return Array.from(this.#polls.values());
  }

  async deletePoll(pollId) {
    this.#polls.delete(pollId);
  }
}