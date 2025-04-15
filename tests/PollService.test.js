import PollService from '../src/services/PollService.js';
import { jest } from '@jest/globals';


describe('PollService', () => {
  let pollRepository;
  let pollService;

  beforeEach(() => {
    // Arrange: create a fake pollRepository with jest mock functions.
    pollRepository = {
      createPoll: jest.fn(),
      getPoll: jest.fn(),
      votePoll: jest.fn()
    };
    pollService = new PollService(pollRepository);
  });

  // Basic Functionality Tests

  test('getPolls should return the pollRepository instance', () => {
    // Act
    const result = pollService.getPolls();
    // Assert
    expect(result).toBe(pollRepository);
  });

  test('createPoll should call repository.createPoll with valid question and options', () => {
    // Arrange
    const question = 'What is your favorite color?';
    const options = ['Red', 'Blue'];
    const createdPoll = { id: 1, question, options };
    pollRepository.createPoll.mockReturnValue(createdPoll);
    
    // Act
    const result = pollService.createPoll(question, options);
    
    // Assert
    expect(pollRepository.createPoll).toHaveBeenCalledWith(question, options);
    expect(result).toEqual(createdPoll);
  });

  // Individual Requirement & Edge Case Tests

  test('createPoll should throw error when question is empty', () => {
    // Arrange
    const question = '';
    const options = ['Option1', 'Option2'];
    // Act & Assert
    expect(() => pollService.createPoll(question, options))
      .toThrow('Poll question cannot be empty.');
  });

  test('createPoll should throw error when question is only whitespace', () => {
    // Arrange
    const question = '   ';
    const options = ['Option1', 'Option2'];
    // Act & Assert
    expect(() => pollService.createPoll(question, options))
      .toThrow('Poll question cannot be empty.');
  });

  test('createPoll should throw error when options is not an array', () => {
    // Arrange
    const question = 'Valid Question?';
    const options = 'Not an array';
    // Act & Assert
    expect(() => pollService.createPoll(question, options))
      .toThrow('Poll must have at least 2 options.');
  });

  test('createPoll should throw error when options array has less than 2 items', () => {
    // Arrange
    const question = 'Valid Question?';
    const options = ['Only one option'];
    // Act & Assert
    expect(() => pollService.createPoll(question, options))
      .toThrow('Poll must have at least 2 options.');
  });

  test('createPoll should throw error when one of the options is an empty string', () => {
    // Arrange
    const question = 'Valid Question?';
    const options = ['Option1', ''];
    // Act & Assert
    expect(() => pollService.createPoll(question, options))
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
    pollRepository.getPoll.mockReturnValue(poll);

    // Act & Assert
    expect(() => pollService.vote(pollId, optionText)).not.toThrow();
  });

  test('vote should throw error when poll is not found', () => {
    // Arrange
    const pollId = 1;
    const optionText = 'Option1';
    pollRepository.getPoll.mockReturnValue(undefined);

    // Act & Assert
    expect(() => pollService.vote(pollId, optionText))
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
    pollRepository.getPoll.mockReturnValue(poll);

    // Act & Assert
    expect(() => pollService.vote(pollId, optionText))
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
    pollRepository.getPoll.mockReturnValue(poll);

    // Act
    const results = pollService.getResults(pollId);

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
    pollRepository.getPoll.mockReturnValue(undefined);

    // Act & Assert
    expect(() => pollService.getResults(pollId))
      .toThrow(`Poll with ID ${pollId} not found.`);
  });

  test('getResults should throw TypeError when pollId is not a number', () => {
    // Arrange
    const pollId = '1'; // pollId as string instead of number

    // Act & Assert
    expect(() => pollService.getResults(pollId))
      .toThrow('id must be a string or number');
  });
});
