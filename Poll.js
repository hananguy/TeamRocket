export class Poll {
  constructor(question, options) {
    if (!question || typeof question !== 'string' || question.trim() === '') {
      throw new Error('Invalid question');
    }
    if (!Array.isArray(options) || options.length < 2 || options.some(opt => typeof opt !== 'string' || opt.trim() === '')) {
      throw new Error('Invalid options');
    }

    this.question = question;
    this.options = options;
    this.votes = new Map();
    options.forEach(option => this.votes.set(option, 0));
  }

  vote(option) {
    if (!this.votes.has(option)) {
      throw new Error('Option does not exist');
    }
    this.votes.set(option, this.votes.get(option) + 1);
  }

  getResults() {
    return {
      question: this.question,
      results: this.options.map(option => ({ option, votes: this.votes.get(option) }))
    };
  }
}
