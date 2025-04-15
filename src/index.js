import readline from 'readline';
import PollsManager from './services/PollsManager.js'; // Updated to use PollsManager

// Create a readline interface for user input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Instantiate the poll manager
const pollsManager = new PollsManager();

/**
 * Displays the main menu for the poll application and handles user input.
 *
 * @function mainMenu
 * @returns {void} This function does not return a value.
 */
function mainMenu() {
  console.log("\n--- Poll Application ---");
  console.log("1. Create a new poll");
  console.log("2. Vote on a poll");
  console.log("3. Get poll results");
  console.log("4. Exit");
  rl.question("Select an option: ", (choice) => {
    switch (choice.trim()) {
      case '1':
        createPoll();
        break;
      case '2':
        votePoll();
        break;
      case '3':
        getResults();
        break;
      case '4':
        console.log("Goodbye!");
        rl.close();
        break;
      default:
        console.log("Invalid option. Please try again.");
        mainMenu();
        break;
    }
  });
}

/**
 * Prompts the user to create a new poll by entering a question and options.
 */
function createPoll() {
  rl.question("Enter poll question (e.g., 'What is your favorite programming language?'): ", (question) => {
    rl.question("Enter poll options (comma separated, e.g., 'JavaScript, Python, Java'): ", (optionsInput) => {
      const options = optionsInput.split(",").map(opt => opt.trim()).filter(opt => opt.length > 0);
      try {
        const poll = pollsManager.createPoll(question, options);
        console.log(`Poll created with ID: ${poll.uuid}`);
      } catch (error) {
        console.error("Error creating poll:", error.message);
      }
      mainMenu();
    });
  });
}

/**
 * Prompts the user to vote on an existing poll.
 */
function votePoll() {
  const polls = pollsManager.getPolls().getAllPolls();
  if (polls.length === 0) {
    console.log("No polls available. Please create a poll first.");
    return mainMenu();
  }

  console.log("Available polls:");
  polls.forEach(poll => {
    console.log(`ID: ${poll.uuid} - Question: ${poll.question}`);
  });

  rl.question("Enter poll ID: ", (idInput) => {
    const pollId = parseInt(idInput.trim(), 10);
    const poll = pollsManager.getPolls().getPoll(pollId);
    if (!poll) {
      console.log(`Poll with ID ${pollId} not found.`);
      return mainMenu();
    }

    console.log(`Options for poll "${poll.question}":`);
    poll.options.forEach(option => {
      console.log(`- ${option}`);
    });

    rl.question("Enter option to vote for: ", (optionText) => {
      try {
        pollsManager.vote(pollId, optionText.trim());
        console.log(`Vote recorded for option "${optionText.trim()}" in poll ${pollId}.`);
      } catch (error) {
        console.error("Error recording vote:", error.message);
      }
      mainMenu();
    });
  });
}

/**
 * Prompts the user to retrieve and display the results of a poll.
 */
function getResults() {
  const polls = pollsManager.getPolls().getAllPolls();
  if (polls.length === 0) {
    console.log("No polls available. Please create a poll first.");
    return mainMenu();
  }

  console.log("Available polls:");
  polls.forEach(poll => {
    console.log(`ID: ${poll.uuid} - Question: ${poll.question}`);
  });

  rl.question("Enter poll ID: ", (idInput) => {
    const pollId = parseInt(idInput.trim(), 10);
    try {
      const results = pollsManager.getResults(pollId);
      const formattedResults = Object.entries(results.results).map(([option, votes]) => ({ option, votes }));
      const output = {
        question: results.question,
        totalVotes: results.totalVotes,
        results: formattedResults
      };
      console.log("Poll Results:", output);
    } catch (error) {
      console.error("Error retrieving poll results:", error.message);
    }
    mainMenu();
  });
}

// Start the interactive prompt
mainMenu();
