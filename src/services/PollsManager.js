import PollsMemoryManagement from '../repositories/PollsMemoryManagement.js';

/**
 * Service layer for handling poll business logic.
 * Provides methods to create polls, register votes, and retrieve poll results.
 *
 * @example
 * const pollService = new PollService();
 * const poll = pollService.createPoll('What is your favorite color?', ['Red', 'Green', 'Blue']);
 * pollService.vote(poll.id, 'Red');
 * const results = pollService.getResults(poll.id);
 */
export default class PollsManager {
  /**
   * Creates an instance of PollService.
   *
   * @param {PollsMemoryManagement} [PollsMemoryManagement=new PollsMemoryManagement()] - An instance of PollsMemoryManagement used for data storage.
   */
  constructor(pollsMemoryManagement) {
    this.PollsMemoryManagement = pollsMemoryManagement || new PollsMemoryManagement();
  }

  /**
   * Retrieves the PollsMemoryManagement instance.
   *
   * @returns {PollsMemoryManagement} The current PollsMemoryManagement instance.
   *
   * @example
   * const pollRepo = pollService.getPolls();
   */
  getPolls() {
    return this.PollsMemoryManagement;
  }

  /**
   * Creates a new poll with the provided question and options.
   *
   * @param {string} question - A non-empty string representing the poll question.
   * @param {string[]} options - An array of non-empty strings representing poll options (minimum 2 options).
   * @returns {Poll} The newly created Poll instance.
   * @throws {Error} Throws an error if the question is empty or not a valid string.
   * @throws {Error} Throws an error if options is not an array of at least 2 non-empty strings.
   *
   * @example
   * const poll = pollService.createPoll("Favorite programming language?", ["JavaScript", "Python"]);
   */
  createPoll(question, options) {
    // Validate question
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      throw new Error('Poll question cannot be empty.');
    }

    // Validate options
    if (
      !Array.isArray(options) ||
      !options.every(opt => typeof opt === 'string' && opt.trim().length > 0) ||
      options.length < 2
    ) {
      throw new Error('Poll must have at least 2 options.');
    }

    return this.PollsMemoryManagement.createPoll(question, options);
  }

  /**
   * Registers a vote for a specified option in a poll.
   *
   * @param {number} pollId - The unique identifier of the poll.
   * @param {string} optionText - The text of the option to vote for.
   * @throws {Error} Throws an error if the poll with the given ID is not found.
   * @throws {Error} Throws an error if the specified option does not exist in the poll.
   *
   * @example
   * pollService.vote(1, "Blue");
   */
  vote(pollId, optionText) {
    const poll = this.PollsMemoryManagement.getPoll(pollId);
    if (!poll) {
      throw new Error(`Poll with ID ${pollId} not found.`);
    }

    const optionExists = poll.options.includes(optionText);
    if (!optionExists) {
      throw new Error(`Option "${optionText}" does not exist in poll ${pollId}.`);
    }
    
    this.PollsMemoryManagement.votePoll(pollId, optionText);
  }

  /**
   * Retrieves the results of a specified poll.
   *
   * @param {number} pollId - The unique identifier of the poll.
   * @returns {Object} An object containing the poll's question, total vote count, and the vote counts for each option.
   * @throws {TypeError} Throws if pollId is not a number.
   * @throws {Error} Throws if the poll with the given ID is not found.
   *
   * @example
   * const results = pollService.getResults(1);
   * // results: { question: "Favorite programming language?", totalVotes: 5, results: { "JavaScript": 3, "Python": 2 } }
   */
  getResults(pollId) {
    if (typeof pollId !== 'number') {
      throw new TypeError('id must be a string or number');
    }
    const poll = this.PollsMemoryManagement.getPoll(pollId);
    if (!poll) {
      throw new Error(`Poll with ID ${pollId} not found.`);
    }

    return {
      question: poll.question,
      totalVotes: poll.totalVotes,
      results: poll.results
    };
  }

  /**
   * Deletes a poll with the specified ID and username.
   *
   * @param {number} pollId - The unique identifier of the poll.
   * @param {string} username - The username of the person requesting the deletion.
   */
  deletePoll(pollId, username) {
    this.PollsMemoryManagement.deletePoll(pollId, username);
  }
}
