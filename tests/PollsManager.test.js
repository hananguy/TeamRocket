import PollsManager from '../src/services/PollsManager.js';
import PollsMemoryManagement from '../src/repositories/PollsMemoryManagement.js';

describe('PollsManager Unit Tests', () => {
  let manager;

  beforeEach(() => {
    manager = new PollsManager(new PollsMemoryManagement());
  });

  test('Create poll successfully', async () => {
    const poll = await manager.createPoll("Best JS framework?", ["React", "Vue"], "daniel");
    expect(poll.question).toBe("Best JS framework?");
  });

  test('Throw on invalid poll options', async () => {
    await expect(() => manager.createPoll("Q", ["OnlyOne"], "daniel"))
      .rejects.toThrow("Poll must have at least 2 options");
  });
});