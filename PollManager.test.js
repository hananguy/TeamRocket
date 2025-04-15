import { PollManager } from '../PollManager.js';

describe('PollManager', () => {
  let manager;
  beforeEach(() => {
    manager = new PollManager();
  });

  // 1. Basic Functionality Tests
  test('should create a poll and retrieve results', () => {
    manager.createPoll('Best color?', ['Red', 'Blue']);
    const results = manager.getResults('Best color?');
    expect(results.question).toBe('Best color?');
    expect(results.results).toEqual([
      { option: 'Red', votes: 0 },
      { option: 'Blue', votes: 0 }
    ]);
  });

  test('should allow voting and reflect correct results', () => {
    manager.createPoll('Best fruit?', ['Apple', 'Banana']);
    manager.vote('Best fruit?', 'Banana');
    const results = manager.getResults('Best fruit?');
    expect(results.results).toEqual([
      { option: 'Apple', votes: 0 },
      { option: 'Banana', votes: 1 }
    ]);
  });

  // 2. Individual Requirements
  test('should not allow duplicate poll question', () => {
    manager.createPoll('Do you like pizza?', ['Yes', 'No']);
    expect(() => manager.createPoll('Do you like pizza?', ['Yes', 'No'])).toThrow('Duplicate poll question');
  });

  test('should allow multiple votes on same option', () => {
    manager.createPoll('Favorite season?', ['Winter', 'Summer']);
    manager.vote('Favorite season?', 'Winter');
    manager.vote('Favorite season?', 'Winter');
    const results = manager.getResults('Favorite season?');
    expect(results.results).toEqual([
      { option: 'Winter', votes: 2 },
      { option: 'Summer', votes: 0 }
    ]);
  });

  // 3. Edge Case Tests
  test('should throw when creating poll with empty question', () => {
    expect(() => manager.createPoll('', ['A', 'B'])).toThrow('Invalid question');
  });

  test('should throw when creating poll with less than 2 options', () => {
    expect(() => manager.createPoll('Only one option?', ['Yes'])).toThrow('Invalid options');
  });

  test('should throw when creating poll with empty option strings', () => {
    expect(() => manager.createPoll('Empty option?', ['Yes', ''])).toThrow('Invalid options');
  });

  // 4. Negative Tests
  test('should throw when voting on non-existent poll', () => {
    expect(() => manager.vote('Unknown poll', 'Yes')).toThrow('Poll does not exist');
  });

  test('should throw when voting for non-existent option', () => {
    manager.createPoll('Tea or Coffee?', ['Tea', 'Coffee']);
    expect(() => manager.vote('Tea or Coffee?', 'Juice')).toThrow('Option does not exist');
  });

  test('should throw when getting results for non-existent poll', () => {
    expect(() => manager.getResults('Fake poll')).toThrow('Poll does not exist');
  });

  // 5. Combination Flow Test
  test('full flow: create, vote, vote again, get results', () => {
    manager.createPoll('Dog or Cat?', ['Dog', 'Cat']);
    manager.vote('Dog or Cat?', 'Dog');
    manager.vote('Dog or Cat?', 'Cat');
    manager.vote('Dog or Cat?', 'Dog');
    const results = manager.getResults('Dog or Cat?');
    expect(results.results).toEqual([
      { option: 'Dog', votes: 2 },
      { option: 'Cat', votes: 1 }
    ]);
  });
});
