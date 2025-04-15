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
   * @private
   * @type {Map<number, Poll>}
   */
  #polls;

  /**
   * @private
   * @type {number}
   */
  #nextId;

  /**
   * Creates an instance of PollRepository.
   */
  constructor() {
    // In-memory storage for polls: Key => pollId, Value => Poll instance.
    this.#polls = new Map();
    this.#nextId = 1; // For auto-incrementing IDs.
  }

  /**
   * Creates a new poll and stores it in memory.
   *
   * @param {string} question - A non-empty string representing the poll question.
   * @param {string[]} options - An array of non-empty strings representing the poll options.
   * @returns {Poll} The newly created Poll instance.
   * @throws {TypeError} If the question is not a non-empty string or if options is not an array of non-empty strings.
   *
   * @example
   * const poll = repo.createPoll("Favorite programming language?", ["JavaScript", "Python", "Java"]);
   */
  createPoll(question, options) {
    if (typeof question !== 'string' || question.trim().length === 0) {
      throw new TypeError('question must be a non-empty string');
    }
    if (
      !Array.isArray(options) ||
      !options.every(opt => typeof opt === 'string' && opt.trim().length > 0) ||
      options.length === 0
    ) {
      throw new TypeError('options must be an array of non-empty strings');
    }

    const id = this.#nextId++;
    const poll = new Poll(id, question, options);
    this.#polls.set(id, poll);
    return poll;
  }

  /**
   * Retrieves a poll by its ID.
   *
   * @param {number} pollId - The unique identifier of the poll.
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
   * @param {number} pollId - The unique identifier of the poll.
   * @param {string} option - The option for which the vote is cast.
   * @throws {Error} If the poll does not exist or if the specified option is invalid.
   *
   * @example
   * repo.votePoll(1, "Blue");
   */
  votePoll(pollId, option) {
    const poll = this.getPoll(pollId);
    if (!poll) {
      throw new Error(`Poll with ID ${pollId} not found.`);
    }
    poll.vote(option);
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
}
