const request = require('supertest');
const express = require('express');
const importLimiter = require('../../service/middleware/importLimiter');

/*
Tests:
1) Allows requests under the limit
2) Blocks requests exceeding the limit
3) Sets standard rate limit headers
4) Does not set legacy X-RateLimit headers
*/

describe('importLimiter middleware', () => {
  let app;

  beforeEach(() => {
    app = express();

    app.post('/import', importLimiter, (req, res) => {
      res.status(200).json({ ok: true });
    });
  });

  it('allows requests under the limit', async () => {
    const res1 = await request(app).post('/import');
    const res2 = await request(app).post('/import');
    const res3 = await request(app).post('/import');

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res3.status).toBe(200);
  });

  it('blocks requests exceeding the limit', async () => {
    await request(app).post('/import');
    await request(app).post('/import');
    await request(app).post('/import');

    const res = await request(app).post('/import');

    expect(res.status).toBe(429);
    expect(res.body).toEqual({
      message: 'Import limit exceeded: max 3 imports per 5 minutes',
    });
  });

  it('sets standard rate limit headers', async () => {
    const res = await request(app).post('/import');

    expect(res.headers).toHaveProperty('ratelimit-limit');
    expect(res.headers).toHaveProperty('ratelimit-remaining');
    expect(res.headers).toHaveProperty('ratelimit-reset');
  });

  it('does not set legacy X-RateLimit headers', async () => {
    const res = await request(app).post('/import');

    expect(res.headers['x-ratelimit-limit']).toBeUndefined();
    expect(res.headers['x-ratelimit-remaining']).toBeUndefined();
    expect(res.headers['x-ratelimit-reset']).toBeUndefined();
  });
});
