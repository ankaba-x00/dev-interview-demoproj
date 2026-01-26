const request = require('supertest');
const app = require('../setup/testApp');
const mongo = require('../setup/testMongo');
const mongoose = require('mongoose');

/*
Tests:
1) Returns 200 when database is reachable
2) Returns 503 when database is unreachable
*/

describe('Healthz endpoint', () => {
  beforeAll(async () => {
    await mongo.connect();
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongo.connect();
    }
  });

  afterAll(async () => {
    await mongo.close();
  });

  it('returns 200 when database is reachable', async () => {
    const res = await request(app).get('/healthz');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('connected');
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('number');
  });

  it('returns 503 when database is unreachable', async () => {
    await mongoose.connection.close();

    const res = await request(app).get('/healthz');

    expect(res.status).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.db).toBe('disconnected');
    expect(typeof res.body.timestamp).toBe('number');
  });
});