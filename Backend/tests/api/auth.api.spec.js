const request = require('supertest');
const app = require('../setup/testApp');
const mongo = require('../setup/testMongo');

/*
Tests:
1) Registers a new user
2) Logs in user with valid credentials
3) Rejects login when user not found
4) Rejects login with wrong password
5) Rejects login with missing credentials
6) Rejects invalid registration input
7) Rejects duplicate email registration
*/

describe('Auth endpoint', () => {
  beforeAll(async () => {
    await mongo.connect();
  });

  afterEach(async () => {
    await mongo.clear();
  });

  afterAll(async () => {
    await mongo.close();
  });

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/v1/auth/register')
      .send({
        email: 'test@test.de',
        password: 'Secret123!',
        confirmPassword: 'Secret123!',
      });
    
    expect(res.status).toBe(201);
  });

  it('logs in user with valid credentials', async () => {
    await request(app)
      .post('/v1/auth/register')
      .send({
        email: 'test@test.de',
        password: 'Secret123!',
        confirmPassword: 'Secret123!',
      });

    const res = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'test@test.de',
        password: 'Secret123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('rejects login with wrong password', async () => {
    await request(app)
      .post('/v1/auth/register')
      .send({
        email: 'test@test.de',
        password: 'Secret123!',
      });

    const res = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'test@test.de',
        password: 'WrongSecret!',
      });

    expect(res.status).toBe(401);
  });

  it('rejects login when user not found', async () => {
    const res = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'no@test.de',
        password: 'Secret123!',
      });

    expect(res.status).toBe(401);
  });

  it('rejects login with missing credentials', async () => {
    const res = await request(app)
      .post('/v1/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });

  it('rejects invalid registration input', async () => {
    const res = await request(app)
      .post('/v1/auth/register')
      .send({
        email: 'invalid-email',
      });

    expect(res.status).toBe(400);
  });

  it('rejects duplicate email registration', async () => {
    await request(app)
      .post('/v1/auth/register')
      .send({
        email: 'dup@test.de',
        password: 'Secret123!',
        confirmPassword: 'Secret123!',
      });

    const res = await request(app)
      .post('/v1/auth/register')
      .send({
        email: 'dup@test.de',
        password: 'Secret123!',
        confirmPassword: 'Secret123!',
      });

    expect(res.status).toBe(409);
  });
});