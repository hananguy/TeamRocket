
// import PollsMemoryManagement from '../src/repositories/PollsMemoryManagement.js';
// import Poll from '../src/models/Poll.js';

// describe('PollsMemoryManagement Class', () => {
//   let pollRepo;

//   beforeEach(() => {
//     pollRepo = new PollsMemoryManagement();
//   });

//   describe('addPoll', () => {
//     test('should add a poll to the repository', () => {
//       // Arrange
//       const poll = new Poll('What is your favorite color?', ['Red', 'Blue'], 'creator');

//       // Act
//       pollRepo.addPoll(poll);

//       // Assert
//       expect(pollRepo.getPoll(poll.uuid)).toBe(poll);
//     });
//   });

//   describe('getPoll', () => {
//     test('should return null for a non-existent poll ID', () => {
//       // Act
//       const result = pollRepo.getPoll('non-existent-id');

//       // Assert
//       expect(result).toBeNull();
//     });
//   });

//   describe('votePoll', () => {
//     test('should register a vote for a valid option', () => {
//       // Arrange
//       const poll = new Poll('What is your favorite color?', ['Red', 'Blue'], 'creator');
//       pollRepo.addPoll(poll);

//       // Act
//       pollRepo.votePoll(poll.uuid, 'Red');

//       // Assert
//       expect(poll.results['Red']).toBe(1);
//       expect(poll.totalVotes).toBe(1);
//     });

//     test('should throw an error when voting for an invalid option', () => {
//       // Arrange
//       const poll = new Poll('What is your favorite color?', ['Red', 'Blue'], 'creator');
//       pollRepo.addPoll(poll);

//       // Act & Assert
//       expect(() => pollRepo.votePoll(poll.uuid, 'Green')).toThrow('Invalid option: "Green"');
//     });

//     test('should throw an error when voting for a non-existent poll', () => {
//       // Act & Assert
//       expect(() => pollRepo.votePoll('non-existent-id', 'Red')).toThrow('MemoryManager: Poll with ID non-existent-id not found.');
//     });
//   });

//   describe('getAllPolls', () => {
//     test('should return all polls in the repository', () => {
//       // Arrange
//       const poll1 = new Poll('What is your favorite color?', ['Red', 'Blue'], 'creator1');
//       const poll2 = new Poll('What is your favorite food?', ['Pizza', 'Burger'], 'creator2');
//       pollRepo.addPoll(poll1);
//       pollRepo.addPoll(poll2);

//       // Act
//       const polls = pollRepo.getAllPolls();

//       // Assert
//       expect(polls).toContain(poll1);
//       expect(polls).toContain(poll2);
//       expect(polls.length).toBe(2);
//     });

//     test('should return an empty array if no polls exist', () => {
//       // Act
//       const polls = pollRepo.getAllPolls();

//       // Assert
//       expect(polls).toEqual([]);
//     });
//   });

//   describe('deletePoll', () => {
//     test('should delete a poll if the username matches the creator', () => {
//       // Arrange
//       const poll = new Poll('What is your favorite color?', ['Red', 'Blue'], 'creator');
//       pollRepo.addPoll(poll);

//       // Act
//       pollRepo.deletePoll(poll.uuid, 'creator');

//       // Assert
//       expect(pollRepo.getPoll(poll.uuid)).toBeNull();
//     });

//     test('should throw an error if the username does not match the creator', () => {
//       // Arrange
//       const poll = new Poll('What is your favorite color?', ['Red', 'Blue'], 'creator');
//       pollRepo.addPoll(poll);

//       // Act & Assert
//       expect(() => pollRepo.deletePoll(poll.uuid, 'wrongUser')).toThrow('Only the creator can delete this poll.');
//     });

//     test('should throw an error if the poll does not exist', () => {
//       // Act & Assert
//       expect(() => pollRepo.deletePoll('non-existent-id', 'creator')).toThrow('Poll with ID non-existent-id not found.');
//     });
//   });
// });

// // test/PollsMemoryManagement.test.js
// import PollsMemoryManagement from '../src/repositories/PollsMemoryManagement.js';

// describe('PollRepository Class', () => {
//     let pollRepo;

//     // Reset repository for each test
//     beforeEach(() => {
//         pollRepo = new PollsMemoryManagement();
//     });

//     describe('Basic Functionality Tests', () => {
//         test('should create a poll with valid question and options', () => {
//             // Arrange
//             const question = 'What is your favorite color?';
//             const options = ['Red', 'Blue', 'Green'];

//             // Act
//             const poll = pollRepo.createPoll(question, options, 'creator');

//             // Assert
//             expect(poll).toBeDefined();
//             expect(poll.question).toBe(question);
//             expect(poll.options).toEqual(options);
//             expect(poll.totalVotes).toBe(0);
//             expect(poll.results).toEqual({
//                 'Red': 0,
//                 'Blue': 0,
//                 'Green': 0
//             });
//         });

//         test('should auto-increment poll id on each creation', () => {
//             // Arrange
//             const question1 = 'Favorite fruit?';
//             const options1 = ['Apple', 'Banana'];
//             const question2 = 'Favorite season?';
//             const options2 = ['Summer', 'Winter'];

//             // Act
//             const poll1 = pollRepo.createPoll(question1, options1);
//             const poll2 = pollRepo.createPoll(question2, options2);

//             // Assert
//             expect(poll1.uuid).toBe(1);
//             expect(poll2.uuid).toBe(2);
//         });       
//     });

//     describe('Individual Requirement Tests', () => {
//         test('getPoll returns the correct poll for a valid id', () => {
//             //Arrange
//             const question = 'Favorite programming language?';
//             const options = ['JavaScript', 'Python', 'Ruby'];
//             const createdPoll = pollRepo.createPoll(question, options, 'creator');

//             // Act
//             const retrievedPoll = pollRepo.getPoll(createdPoll.uuid);

//             // Assert
//             expect(retrievedPoll).toBeDefined();
//             expect(retrievedPoll.uuid).toBe(createdPoll.uuid);
//             expect(retrievedPoll.question).toBe(question);
//         });

//         test('getPoll returns null for a non-existent poll id', () => {
//             // Arrange & Act
//             const poll = pollRepo.getPoll(9999);
      
//             // Assert
//             expect(poll).toBeNull();
//         });
//     });

//     // Negative (Exception) Tests
//   describe('Negative (Exception) Tests', () => {
//     test('should throw an error when creating a poll with a non-string question', () => {
//       // Arrange
//       const question = 12345; // invalid type
//       const options = ['Yes', 'No'];

//       // Act & Assert
//       expect(() => pollRepo.createPoll(question, options, 'creator')).toThrow(TypeError);
//     });

//     test('should throw an error when creating a poll with an empty question string', () => {
//       // Arrange
//       const question = '';
//       const options = ['Yes', 'No'];

//       // Act & Assert
//       expect(() => pollRepo.createPoll(question, options, 'creator')).toThrow(TypeError);
//     });

//     test('should throw an error when creating a poll with a question of only whitespace', () => {
//       // Arrange
//       const question = '   ';
//       const options = ['Yes', 'No'];

//       // Act & Assert
//       expect(() => pollRepo.createPoll(question, options,'creator')).toThrow(TypeError);
//     });

//     test('should throw an error when creating a poll with non-array options', () => {
//       // Arrange
//       const question = 'Valid question';
//       const options = 'Not an array'; // invalid type

//       // Act & Assert
//       expect(() => pollRepo.createPoll(question, options,'creator')).toThrow(TypeError);
//     });

//     test('should throw an error when creating a poll with an empty options array', () => {
//       // Arrange
//       const question = 'Question with no options';
//       const options = []; // empty array

//       // Act & Assert
//       expect(() => pollRepo.createPoll(question, options,'creator')).toThrow(TypeError);
//     });

//     test('should throw an error when creating a poll with options array containing an empty string', () => {
//       // Arrange
//       const question = 'Question with invalid options';
//       const options = ['Yes', '', 'Maybe']; // one option is empty

//       // Act & Assert
//       expect(() => pollRepo.createPoll(question, options,'creator')).toThrow(TypeError);
//     });

//     test('should throw an error when creating a poll with options array containing a string of only whitespace', () => {
//       // Arrange
//       const question = 'Question with invalid options';
//       const options = ['Yes', '   ', 'Maybe']; // one option is only whitespace

//       // Act & Assert
//       expect(() => pollRepo.createPoll(question, options,'creator')).toThrow(TypeError);
//     });
//   });

//   describe('Combination Tests (Entire Flows)', () => {
//     test('should create a poll and update votes correctly', () => {
//       // Arrange
//       const question = 'Best ice cream flavor?';
//       const options = ['Vanilla', 'Chocolate', 'Strawberry'];
//       const poll = pollRepo.createPoll(question, options,'creator');

//       // Act
//       poll.vote('Vanilla');
//       poll.vote('Chocolate');
//       poll.vote('Vanilla');

//       // Assert
//       expect(poll.totalVotes).toBe(3);
//       expect(poll.results['Vanilla']).toBe(2);
//       expect(poll.results['Chocolate']).toBe(1);
//       expect(poll.results['Strawberry']).toBe(0);
//     });

//     test('should throw an error when voting for an invalid option', () => {
//       // Arrange
//       const question = 'Favorite sport?';
//       const options = ['Soccer', 'Basketball'];
//       const poll = pollRepo.createPoll(question, options,'creator');

//       // Act & Assert
//       expect(() => poll.vote('Baseball')).toThrow(Error);
//     });

//     test('should correctly retrieve multiple polls from the repository', () => {
//       // Arrange
//       const poll1 = pollRepo.createPoll('Q1?', ['A', 'B'], 'creator');
//       const poll2 = pollRepo.createPoll('Q2?', ['C', 'D'], 'creator');

//       // Act
//       const retrievedPoll1 = pollRepo.getPoll(poll1.uuid);
//       const retrievedPoll2 = pollRepo.getPoll(poll2.uuid);

//       // Assert
//       expect(retrievedPoll1).toBeDefined();
//       expect(retrievedPoll1.question).toBe('Q1?');
//       expect(retrievedPoll2).toBeDefined();
//       expect(retrievedPoll2.question).toBe('Q2?');
//     });
//   });

// });
