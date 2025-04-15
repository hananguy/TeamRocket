import express from 'express';
import pollRoutes from './route/PollRoute.js';

const app = express();
app.use(express.json());
app.use('/api', pollRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});