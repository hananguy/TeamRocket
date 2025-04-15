// tests/Poll.test.js
import Poll from '../src/models/Poll.js';

describe('Poll Class', () => {
  // Basic Functionality & Individual Requirement Test
  test('should create a poll with valid id, question, and options', () => {
    // Arrange
    const question = 'What is your favorite color?';
    const options = ['Red', 'Blue', 'Green'];

    // Act
    const poll = new Poll(question, options);

    // Assert
    expect(poll.question).toBe(question);
    expect(poll.options).toEqual(options);
    expect(poll.totalVotes).toBe(0);
    expect(poll.results).toEqual({ Red: 0, Blue: 0, Green: 0 });
  });

  // Negative Test: invalid question type
  test('should throw error if question is not a string', () => {
    // Arrange
    const question = 12345;
    const options = ['Option1'];

    // Act & Assert
    expect(() => new Poll(question, options, 'creator')).toThrow(TypeError);
    expect(() => new Poll(question, options, 'creator')).toThrow('question must be a string');
  });

  // Negative Test: options is not an array
  test('should throw error if options is not an array', () => {
    // Arrange
    const question = 'Test non-array options';
    const options = 'Not an array';

    // Act & Assert
    expect(() => new Poll(question, options,'creator')).toThrow(TypeError);
    expect(() => new Poll(question, options,'creator')).toThrow('options must be an array of string');
  });

  // Negative Test: options array contains non-string element
  test('should throw error if options array contains non-string element', () => {
    // Arrange
    const question = 'Test non-string options';
    const options = ['Valid', 123];

    // Act & Assert
    expect(() => new Poll(question, options, 'creator')).toThrow(TypeError);
    expect(() => new Poll(question, options, 'creator')).toThrow('options must be an array of string');
  });

  // Basic Functionality: Valid voting behavior
  test('should correctly record a vote for a valid option', () => {
    // Arrange
    const poll = new Poll('Vote test?', ['OptionA', 'OptionB'],'creator');
    
    // Act
    poll.vote('OptionA');

    // Assert
    expect(poll.results['OptionA']).toBe(1);
    expect(poll.totalVotes).toBe(1);
  });

  // Negative Test: Voting for an invalid option
  test('should throw error when voting for an invalid option', () => {
    // Arrange
    const poll = new Poll('Invalid vote test?', ['Yes', 'No'], 'creator');

    // Act & Assert
    expect(() => poll.vote('Maybe')).toThrow(Error);
    expect(() => poll.vote('Maybe')).toThrow('Invalid option: "Maybe"');
  });

  // Combination Test: Multiple votes across options
  test('should correctly accumulate multiple votes', () => {
    // Arrange
    const poll = new Poll('Multiple votes test?', ['A', 'B', 'C'], 'creator');

    // Act
    poll.vote('A'); // A: 1
    poll.vote('B'); // B: 1
    poll.vote('A'); // A: 2
    poll.vote('C'); // C: 1
    poll.vote('B'); // B: 2

    // Assert
    expect(poll.results).toEqual({ A: 2, B: 2, C: 1 });
    expect(poll.totalVotes).toBe(5);
  });

  // Edge Case: Vote for an option that is an empty string (if allowed)
  test('should handle voting for an empty string option', () => {
    // Arrange
    const poll = new Poll('Empty string option test?', ['', 'Non-empty'], 'creator');
    
    // Act
    poll.vote('');
    
    // Assert
    expect(poll.results['']).toBe(1);
    expect(poll.totalVotes).toBe(1);
  });

  // Edge Case: Poll with empty options array
  test('should create poll with empty options and throw error on vote attempt', () => {
    // Arrange
    const poll = new Poll('Empty options test?', [], 'creator');
    
    // Act & Assert
    expect(poll.options).toEqual([]);
    expect(poll.results).toEqual({});
    expect(() => poll.vote('anything')).toThrow(Error);
  });

  // Combination Test: Full flow (create poll, vote multiple times, and verify final state)
  test('should handle full poll flow correctly', () => {
    // Arrange
    const poll = new Poll('Full flow test?', ['Yes', 'No', 'Maybe'], 'creator');
    
    // Act
    poll.vote('Yes');
    poll.vote('No');
    poll.vote('Yes');
    poll.vote('Maybe');
    poll.vote('No');
    poll.vote('Yes');

    // Assert
    expect(poll.results).toEqual({
      Yes: 3,
      No: 2,
      Maybe: 1
    });
    expect(poll.totalVotes).toBe(6);
  });

  // Combination Test: Multiple poll instances maintain independent state
  test('should maintain independent state for multiple poll instances', () => {
    // Arrange
    const poll1 = new Poll('Poll 1?', ['Opt1', 'Opt2'], 'creator1');
    const poll2 = new Poll('Poll 2?', ['OptA', 'OptB'], 'creator2');

    // Act
    poll1.vote('Opt1');
    poll1.vote('Opt2');
    poll2.vote('OptA');
    poll2.vote('OptA');

    // Assert
    expect(poll1.results).toEqual({ Opt1: 1, Opt2: 1 });
    expect(poll1.totalVotes).toBe(2);
    expect(poll2.results).toEqual({ OptA: 2, OptB: 0 });
    expect(poll2.totalVotes).toBe(2);
  });
});
