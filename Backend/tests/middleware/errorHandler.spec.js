const request = require('supertest');
const express = require('express');
const multer = require('multer');
const errorHandler = require('../../service/middleware/errorHandler');

/*
Tests:
1) Handles MulterError correctly
2) Handles generic errors correctly
3) Uses fallback message if error has no message
4) Calls next() when no error is present
*/

describe('errorHandler middleware', () => {
  let app;

  beforeEach(() => {
    app = express();

    app.post('/test', (req, res, next) => {
      next(req.app.locals.error);
    });

    app.use(errorHandler);

    app.use((req, res) => {
      res.status(500).json({ message: 'Unexpected fallback' });
    });
  });

  it('handles MulterError correctly', async () => {
    app.locals.error = new multer.MulterError(
      'LIMIT_FILE_SIZE',
      'file'
    );

    const res = await request(app)
      .post('/test')
      .expect(400);

    expect(res.body).toEqual({
      message:
        'Upload limits exceeded: max 5MB, accepted type: csv, 1 file per upload',
      code: 'LIMIT_FILE_SIZE',
      error: app.locals.error.message,
    });
  });

  it('handles generic errors correctly', async () => {
    app.locals.error = new Error('Something went wrong');

    const res = await request(app)
      .post('/test')
      .expect(400);

    expect(res.body).toEqual({
      message: 'Something went wrong',
    });
  });

  it('uses fallback message if error has no message', async () => {
    app.locals.error = {};

    const res = await request(app)
      .post('/test')
      .expect(400)

    expect(res.body).toEqual({
      message: 'Invalid file upload',
    });
  });

  it('calls next() when no error is present', async () => {
    const cleanApp = express();
    let reached = false;

    cleanApp.post(
      '/test',
      (req, res, next) => next(),
      (req, res) => {
        reached = true;
        res.status(200).json({ ok: true });
      }
    );

    cleanApp.use(errorHandler);

    const res = await request(cleanApp)
      .post('/test')
      .expect(200);

    expect(res.body.ok).toBe(true);
    expect(reached).toBe(true);
  });
});