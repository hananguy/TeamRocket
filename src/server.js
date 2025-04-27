import express from 'express';
import PollsManager from './services/PollsManager.js';
import UserManager from './services/UserManager.js';

const app = express();
app.use(express.json());

const pollsManager = new PollsManager();
const userManager  = new UserManager();

// --- Users ---
// יצירת משתמש
app.post('/users', async (req, res) => {
  try {
    const { username } = req.body;
    await userManager.createUser(username.trim());
    res.status(201).json({ message: `User "${username}" created.` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Polls ---
// יצירת סקר
app.post('/polls', async (req, res) => {
  try {
    const { question, options, username } = req.body;
    const exists = await userManager.userExists(username.trim());
    if (!exists) return res.status(404).json({ error: `User "${username}" not found.` });

    const poll = await pollsManager.createPoll(question, options, username.trim());
    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// קבלת כל הסקרים
app.get('/polls', async (req, res) => {
  const polls = await pollsManager.getPolls();
  res.json(polls);
});

// הצבעת משתמש על סקר
app.post('/polls/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, optionIndex } = req.body;
    await pollsManager.vote(id, optionIndex, username.trim());
    res.json({ message: 'Vote recorded.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// תוצאות סקר
app.get('/polls/:id/results', async (req, res) => {
  try {
    const results = await pollsManager.getResults(req.params.id);
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
