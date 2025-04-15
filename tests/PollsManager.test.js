import PollsManager from '../src/services/PollsManager.js';
import { jest } from '@jest/globals';


describe('PollsManager', () => {
  let pollsMemoryManagement;
  let pollsManager;

  beforeEach(() => {
    // Arrange: create a fakePollsMemoryManagement with jest mock functions.
   pollsMemoryManagement = {
      createPoll: jest.fn(),
      getPoll: jest.fn(),
      votePoll: jest.fn()
    };
  pollsManager = new PollsManager(pollsMemoryManagement);
  });

  // Basic Functionality Tests

  test('getPolls should return thePollsMemoryManagement instance', () => {
    // Act
    const result = pollsManager.getPolls();
    // Assert
    expect(result).toBe(pollsMemoryManagement);
  });

  test('createPoll should call repository.createPoll with valid question and options', () => {
    // Arrange
    const question = 'What is your favorite color?';
    const options = ['Red', 'Blue'];
    const createdPoll = { id: 1, question, options };
   pollsMemoryManagement.createPoll.mockReturnValue(createdPoll);
    
    // Act
    const result = pollsManager.createPoll(question, options);
    
    // Assert
    expect(pollsMemoryManagement.createPoll).toHaveBeenCalledWith(question, options);
    expect(result).toEqual(createdPoll);
  });

  // Individual Requirement & Edge Case Tests

  test('createPoll should throw error when question is empty', () => {
    // Arrange
    const question = '';
    const options = ['Option1', 'Option2'];
    // Act & Assert
    expect(() => pollsManager.createPoll(question, options))
      .toThrow('Poll question cannot be empty.');
  });

  test('createPoll should throw error when question is only whitespace', () => {
    // Arrange
    const question = '   ';
    const options = ['Option1', 'Option2'];
    // Act & Assert
    expect(() => pollsManager.createPoll(question, options))
      .toThrow('Poll question cannot be empty.');
  });

  test('createPoll should throw error when options is not an array', () => {
    // Arrange
    const question = 'Valid Question?';
    const options = 'Not an array';
    // Act & Assert
    expect(() => pollsManager.createPoll(question, options))
      .toThrow('Poll must have at least 2 options.');
  });

  test('createPoll should throw error when options array has less than 2 items', () => {
    // Arrange
    const question = 'Valid Question?';
    const options = ['Only one option'];
    // Act & Assert
    expect(() => pollsManager.createPoll(question, options))
      .toThrow('Poll must have at least 2 options.');
  });

  test('createPoll should throw error when one of the options is an empty string', () => {
    // Arrange
    const question = 'Valid Question?';
    const options = ['Option1', ''];
    // Act & Assert
    expect(() => pollsManager.createPoll(question, options))
      .toThrow('Poll must have at least 2 options.');
  });

  // Vote Method Tests

  test('vote should not throw error for a valid vote', () => {
    // Arrange
    const pollId = 1;
    const optionText = 'Option1';
    const poll = {
      id: pollId,
      options: ['Option1','Option2']
    };
   pollsMemoryManagement.getPoll.mockReturnValue(poll);

    // Act & Assert
    expect(() => pollsManager.vote(pollId, optionText)).not.toThrow();
  });

  test('vote should throw error when poll is not found', () => {
    // Arrange
    const pollId = 1;
    const optionText = 'Option1';
    pollsMemoryManagement.getPoll.mockReturnValue(undefined);

    // Act & Assert
    expect(() => pollsManager.vote(pollId, optionText))
      .toThrow(`Poll with ID ${pollId} not found.`);
  });

  test('vote should throw error when option does not exist in poll', () => {
    // Arrange
    const pollId = 1;
    const optionText = 'Nonexistent Option';
    const poll = {
      id: pollId,
      options: [
        { option: 'Option1' },
        { option: 'Option2' }
      ]
    };
    pollsMemoryManagement.getPoll.mockReturnValue(poll);

    // Act & Assert
    expect(() => pollsManager.vote(pollId, optionText))
      .toThrow(`Option "${optionText}" does not exist in poll ${pollId}.`);
  });

  // getResults Method Tests

  test('getResults should return correct poll results for a valid poll', () => {
    // Arrange
    const pollId = 1;
    const poll = {
      id: pollId,
      question: 'Valid Question?',
      totalVotes: 10,
      results: [
        { option: 'Option1', votes: 6 },
        { option: 'Option2', votes: 4 }
      ]
    };
    pollsMemoryManagement.getPoll.mockReturnValue(poll);

    // Act
    const results = pollsManager.getResults(pollId);

    // Assert
    expect(results).toEqual({
      question: poll.question,
      totalVotes: poll.totalVotes,
      results: poll.results
    });
  });

  test('getResults should throw error when poll is not found', () => {
    // Arrange
    const pollId = 1;
    pollsMemoryManagement.getPoll.mockReturnValue(undefined);

    // Act & Assert
    expect(() => pollsManager.getResults(pollId))
      .toThrow(`Poll with ID ${pollId} not found.`);
  });

  test('getResults should throw TypeError when pollId is not a number', () => {
    // Arrange
    const pollId = '1'; // pollId as string instead of number

    // Act & Assert
    expect(() => pollsManager.getResults(pollId))
      .toThrow('id must be a string or number');
  });
});
