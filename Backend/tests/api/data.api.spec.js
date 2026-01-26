const request = require('supertest');
const app = require('../setup/testApp');
const mongo = require('../setup/testMongo');
const jwt = require('jsonwebtoken');

/*
Tests:
1) Rejects export without auth
2) Exports users as CSV for authenticated user
3) Rejects import for non-admin
4) Rejects import without file
5) Imports users successfully as admin
*/

function signToken(userRole = 'USER') {
  return jwt.sign(
    { id: '123', role: userRole },
    process.env.TOKEN_KEY,
    { expiresIn: '1h' }
  );
}

describe('Data endpoint', () => {
  beforeAll(async () => {
    await mongo.connect();
    process.env.TOKEN_KEY = 'test-secret';
  });

  afterEach(async () => {
    await mongo.clear();
  });

  afterAll(async () => {
    await mongo.close();
  });

  it('rejects export without auth', async () => {
    const res = await request(app).get('/v1/data/export');
    expect(res.status).toBe(401);
  });

  it('exports users as CSV for authenticated user', async () => {
    const userToken = signToken('USER');

    const res = await request(app)
      .get('/v1/data/export')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
  });

  it('rejects import for non-admin', async () => {
    const userToken = signToken('USER');

    const res = await request(app)
      .post('/v1/data/import')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('rejects import without file', async () => {
    const adminToken = signToken('ADMIN');

    const res = await request(app)
      .post('/v1/data/import')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
  });

  it('imports users successfully as admin', async () => {
    const adminToken = signToken('ADMIN');

    const csv = Buffer.from(
      'email,name,location\ncsv@test.de,CSV User,Berlin'
    );

    const res = await request(app)
      .post('/v1/data/import')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', csv, 'users.csv');

    expect(res.status).toBe(201);
    expect(res.body.count).toBe(1);
  });
});