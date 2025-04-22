import express from 'express';
import request from 'supertest';
import pollRoutes from '../../src/route/PollRoute.js';

const app = express();
app.use(express.json());
app.use('/api', pollRoutes);

describe('E2E API Tests', () => {
  test('Full poll flow', async () => {
    await request(app).post('/api/users').send({ username: 'daniel' }).expect(201);
    const createRes = await request(app).post('/api/polls').send({
      question: 'Favorite color?',
      options: ['Red', 'Blue'],
      username: 'daniel'
    }).expect(201);

    const pollId = createRes.body.uuid;
    await request(app).post(`/api/polls/${pollId}/vote`).send({ option: 0, username: 'daniel' }).expect(200);
    await request(app).get(`/api/polls/voter/daniel`).expect(200);
    await request(app).delete(`/api/polls/${pollId}`).send({ username: 'daniel' }).expect(200);
  });
});
