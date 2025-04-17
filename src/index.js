import readline from 'readline';
import PollsManager from './services/PollsManager.js';
import UserManager from './services/UserManager.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pollsManager = new PollsManager();
const userManager = new UserManager();

function mainMenu() {
  console.log("\n--- Poll Application ---");
  console.log("1. Create a new user");
  console.log("2. Create a new poll");
  console.log("3. Vote on a poll");
  console.log("4. Get poll results");
  console.log("5. List all polls");
  console.log("6. List polls created by a user");
  console.log("7. List polls a user has voted in");
  console.log("8. Exit");
  rl.question("Select an option: ", (choice) => {
    switch (choice.trim()) {
      case '1':
        createUser();
        break;
      case '2':
        createPoll();
        break;
      case '3':
        votePoll();
        break;
      case '4':
        getResults();
        break;
      case '5':
        listAllPolls();
        break;
      case '6':
        listPollsByUser();
        break;
      case '7':
        listPollsVotedByUser();
        break;
      case '8':
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

function createUser() {
  rl.question("Enter a username: ", (username) => {
    try {
      userManager.createUser(username.trim());
      console.log(`User "${username}" created successfully.`);
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
    mainMenu();
  });
}

function createPoll() {
  rl.question("Enter poll question: ", (question) => {
    rl.question("Enter poll options (comma separated): ", (optionsInput) => {
      rl.question("Enter your username: ", (username) => {
        if (!userManager.users.has(username.trim())) {
          console.error(`User "${username}" does not exist. Please create the user first.`);
          return mainMenu();
        }
        const options = optionsInput.split(",").map(opt => opt.trim()).filter(opt => opt.length > 0);
        try {
          const poll = pollsManager.createPoll(question, options, username.trim());
          console.log(`Poll created with ID: ${poll.uuid}`);
        } catch (error) {
          console.error("Error creating poll:", error.message);
        }
        mainMenu();
      });
    });
  });
}

function votePoll() {
  rl.question("Enter poll ID: ", (pollId) => {
    const poll = pollsManager.getPoll(pollId.trim());
    if (!poll) {
      console.log(`Poll with ID "${pollId}" not found.`);
      return mainMenu();
    }

    console.log(`Options for poll "${poll.question}":`);
    poll.options.forEach((option, index) => {
      console.log(`${index}: ${option}`);
    });

    rl.question("Enter option index to vote for: ", (optionIndex) => {
      rl.question("Enter your username: ", (username) => {
        const optionText = poll.options[parseInt(optionIndex)]; // Map index to option text
        if (!optionText) {
          console.error("Invalid option index.");
          return mainMenu();
        }
        try {
          pollsManager.vote(pollId.trim(), optionText, username.trim());
          console.log(`Vote recorded for option "${optionText}" by user "${username}".`);
        } catch (error) {
          console.error("Error voting:", error.message);
        }
        mainMenu();
      });
    });
  });
}

function getResults() {
  rl.question("Enter poll ID: ", (pollId) => {
    try {
      const results = pollsManager.getResults(pollId.trim());
      console.log("Poll Results:");
      console.log(`Question: ${results.question}`);
      console.log(`Total Votes: ${results.totalVotes}`);
      console.log("Results:");
      Object.entries(results.results).forEach(([option, votes]) => {
        console.log(`- ${option}: ${votes} votes`);
      });
    } catch (error) {
      console.error("Error retrieving poll results:", error.message);
    }
    mainMenu();
  });
}

function listAllPolls() {
  const polls = pollsManager.getPolls();
  if (polls.length === 0) {
    console.log("No polls available.");
  } else {
    console.log("All Polls:");
    polls.forEach(poll => {
      console.log(`ID: ${poll.uuid} - Question: ${poll.question}`);
    });
  }
  mainMenu();
}

function listPollsByUser() {
  rl.question("Enter username: ", (username) => {
    try {
      const polls = pollsManager.listPollsByCreator(username.trim());
      if (polls.length === 0) {
        console.log(`No polls found for user "${username}".`);
      } else {
        console.log(`Polls created by "${username}":`);
        polls.forEach(poll => {
          console.log(`ID: ${poll.uuid} - Question: ${poll.question}`);
        });
      }
    } catch (error) {
      console.error("Error listing polls:", error.message);
    }
    mainMenu();
  });
}

function listPollsVotedByUser() {
  rl.question("Enter username: ", (username) => {
    try {
      const polls = pollsManager.listPollsVotedByUser(username.trim());
      if (polls.length === 0) {
        console.log(`No polls found that user "${username}" has voted in.`);
      } else {
        console.log(`Polls voted by "${username}":`);
        polls.forEach(poll => {
          console.log(`ID: ${poll.uuid} - Question: ${poll.question}`);
        });
      }
    } catch (error) {
      console.error("Error listing polls:", error.message);
    }
    mainMenu();
  });
}

// Start the interactive prompt
mainMenu();
