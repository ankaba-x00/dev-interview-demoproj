const request = require('supertest');
const app = require('../setup/testApp');
const mongo = require('../setup/testMongo');
const User = require('../../service/entity/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/*
Tests:
1) Rejects access without auth
2) Lists users sanitized as non-admin
3) Lists users fully as admin
4) Rejects create user as non-admin
5) Creates user as admin
6) Updates user as admin
7) Deletes user as admin
8) Blocks and unblocks user as admin
*/

function signToken(user_role = 'USER') {
  return jwt.sign(
    { id: 'test-user-id', role: user_role },
    process.env.TOKEN_KEY,
    { expiresIn: '1h' }
  );
}

describe('Users endpoint', () => {
  beforeAll(async () => {
    process.env.TOKEN_KEY = 'test-secret';
    await mongo.connect();
  });

  afterEach(async () => {
    await mongo.clear();
  });

  afterAll(async () => {
    await mongo.close();
  });

  it('rejects access without auth', async () => {
    const res = await request(app).get('/v1/users');
    expect(res.status).toBe(401);
  });

  it('lists users sanitized as non-admin', async () => {
    await User.create({
      email: 'user@test.de',
      name: 'User Test',
      location: 'Test',
      lastLogin: new Date(),
      ipAddress: '127.0.0.1',
    });

    const token = signToken('USER');

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);

    const user = res.body.data[0];
    expect(user.email).toBe('user@test.de');
    expect(user.lastLogin).toBeUndefined();
    expect(user.ipAddress).toBeUndefined();
  });

  it('lists users fully as admin', async () => {
    await User.create({
      email: 'admin@test.de',
      name: 'Admin Test',
      location: 'Test',
      lastLogin: new Date(),
      ipAddress: '127.0.0.1',
    });

    const token = signToken('ADMIN');

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data[0].lastLogin).toBeDefined();
    expect(res.body.data[0].ipAddress).toBeDefined();
  });

  it('rejects create user as non-admin', async () => {
    const token = signToken('USER');

    const res = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'test@test.de',
        name: 'New Test',
        location: 'Test',
      });

    expect(res.status).toBe(403);
  });

  it('creates user as admin', async () => {
    const token = signToken('ADMIN');

    const res = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'create@test.de',
        name: 'Created User',
        location: 'Test',
      });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('create@test.de');
  });

  it('updates user as admin', async () => {
    const user = await User.create({
      email: 'update@test.de',
      name: 'Old Name',
      location: 'Berlin',
    });

    const token = signToken('ADMIN');

    const res = await request(app)
      .patch(`/v1/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
  });

  it('deletes user as admin', async () => {
    const user = await User.create({
      email: 'delete@test.de',
      name: 'Delete User',
      location: 'Test',
    });

    const token = signToken('ADMIN');

    const res = await request(app)
      .delete(`/v1/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);

    const found = await User.findById(user._id);
    expect(found).toBeNull();
  });

  it('blocks and unblocks user as admin', async () => {
    const user = await User.create({
      email: 'block@test.de',
      name: 'Block User',
      location: 'Test',
      isBlocked: false,
    });

    const token = signToken('ADMIN');

    const blockRes = await request(app)
      .patch(`/v1/users/${user._id}/block`)
      .set('Authorization', `Bearer ${token}`);

    expect(blockRes.status).toBe(204);

    let updated = await User.findById(user._id);
    expect(updated.isBlocked).toBe(true);

    const unblockRes = await request(app)
      .patch(`/v1/users/${user._id}/unblock`)
      .set('Authorization', `Bearer ${token}`);

    expect(unblockRes.status).toBe(204);

    updated = await User.findById(user._id);
    expect(updated.isBlocked).toBe(false);
  });
});
