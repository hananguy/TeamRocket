import Poll from '../models/Poll.js';

/**
 * Manages in-memory storage of Poll instances.
 * This repository handles the direct data management with no business logic.
 *
 * @example
 * const repo = new PollRepository();
 * const poll = repo.createPoll("What is your favorite color?", ["Red", "Green", "Blue"]);
 * poll.vote("Red");
 * console.log(repo.getPoll(poll.id));
 */
export default class PollsMemoryManagement {
  /**
   * @type {Map<string, Poll>}
   */
  #polls;
  /**
   * Creates an instance of PollRepository.
   */
  constructor() {
    // In-memory storage for polls: Key => pollId, Value => Poll instance.
    this.#polls = new Map();
  }


  /**
   * Adds a new poll to the in-memory storage.
   *
   * @param {Poll} poll - The poll object to be added.
   */
  addPoll(poll) {
    if (!(poll instanceof Poll)) {
      throw new Error("The provided object is not an instance of Poll.");
    }
    this.#polls.set(poll.uuid, poll);
  }

  /**
   * Retrieves a poll by its ID.
   *
   * @param {string} pollId - The unique identifier of the poll.
   * @returns {Poll|null} The Poll instance if found; otherwise, null.
   *
   * @example
   * const poll = repo.getPoll(1);
   */
  getPoll(pollId) {
    return this.#polls.get(pollId) || null;
  }

  /**
   * Registers a vote for a specified option in a given poll.
   *
   * @param {string} pollId - The unique identifier of the poll.
   * @param {number} optionIndex - The option for which the vote is cast.
   * @throws {Error} If the poll does not exist or if the specified option is invalid.
   *
   * @example
   * repo.votePoll(1, "Blue");
   */
  votePoll(pollId, optionIndex, username) {
    console.log('Id Entered:', pollId);
    const poll = this.getPoll(pollId);
    if (!poll) {
      throw new Error(`MemoryManager: Poll with ID ${pollId} not found.`);
    }
    poll.vote(optionIndex, username);
  }

  /**
   * Retrieves all polls stored in the repository.
   *
   * @returns {Poll[]} An array of all Poll instances.
   *
   * @example
   * const polls = repo.getAllPolls();
   */
  getAllPolls() {
    return Array.from(this.#polls.values());
  }

  /**
   * Deletes a poll by its ID if the username matches the creator.
   *
   * @param {string} pollId - The unique identifier of the poll.
   * @param {string} username - The username of the poll creator.
   * @throws {Error} If the poll does not exist or if the username does not match the creator.
   *
   * @example
   * repo.deletePoll(1, "creatorUsername");
   */
  deletePoll(pollId, username) {
    this.#polls.delete(pollId);
  }
  
}


