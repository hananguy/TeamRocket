import express from 'express';
import PollsManager from '../services/PollsManager.js';
import UserManager from '../services/UserManager.js';

const router = express.Router();
const pollsManager = new PollsManager();
const userManager = new UserManager();

// Create a new user
router.post('/users', (req, res) => {
  const { username } = req.body;
  try {
    userManager.createUser(username);
    res.status(201).send({ message: `User "${username}" created successfully.` });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// List all polls
router.get('/polls', (req, res) => {
  try {
    const polls = pollsManager.getPolls();
    res.status(200).send(polls);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// List polls created by a specific user
router.get('/polls/creator/:username', (req, res) => {
  const { username } = req.params;
  try {
    const polls = pollsManager.listPollsByCreator(username);
    res.status(200).send(polls);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// List polls a user has voted in
router.get('/polls/voter/:username', (req, res) => {
  const { username } = req.params;
  try {
    const polls = pollsManager.listPollsVotedByUser(username);
    res.status(200).send(polls);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Vote on a poll
router.post('/polls/:id/vote', (req, res) => {
  const { id } = req.params;
  const { option, username } = req.body;
  try {
    pollsManager.vote(id, option, username);
    res.status(200).send({ message: `Vote recorded for option "${option}" by user "${username}".` });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a poll
router.delete('/polls/:id', (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    pollsManager.deletePoll(Number(id), username);
    res.status(200).send({ message: 'Poll deleted successfully.' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;