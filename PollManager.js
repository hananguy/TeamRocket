import { Poll } from './Poll.js';

export class PollManager {
  constructor() {
    this.polls = new Map(); // key = question, value = Poll instance
  }

  createPoll(question, options) {
    if (this.polls.has(question)) {
      throw new Error('Duplicate poll question');
    }
    const poll = new Poll(question, options);
    this.polls.set(question, poll);
  }

  vote(question, option) {
    const poll = this.polls.get(question);
    if (!poll) {
      throw new Error('Poll does not exist');
    }
    poll.vote(option);
  }

  getResults(question) {
    const poll = this.polls.get(question);
    if (!poll) {
      throw new Error('Poll does not exist');
    }
    return poll.getResults();
  }
}
