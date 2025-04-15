import express from 'express';
import PollsManager from '../services/PollsManager.js';

const router = express.Router();
const pollsManager = new PollsManager();

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