const request = require('supertest');
const express = require('express');
const uploadLimiter = require('../../service/middleware/uploadLimiter');

/*
Tests:
1) Accepts a valid CSV file
2) Rejects non-CSV mime types
3) Rejects files with wrong extension even if mime is csv
4) Rejects files larger than 5MB
5) Rejects multiple file uploads
*/

describe('uploadLimiter middleware', () => {
  let app;

  beforeEach(() => {
    app = express();

    app.post(
      '/upload',
      uploadLimiter.single('file'),
      (req, res) => {
        res.status(200).json({
          filename: req.file.originalname,
          size: req.file.size,
        });
      }
    );

    app.use((err, req, res, next) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  });

  it('accepts a valid CSV file', async () => {
    const csv = Buffer.from('email,name\nuser@test.de,Test User');

    const res = await request(app)
      .post('/upload')
      .attach('file', csv, 'users.csv');

    expect(res.status).toBe(200);
    expect(res.body.filename).toBe('users.csv');
    expect(res.body.size).toBe(csv.length);
  });

  it('rejects non-CSV mime types', async () => {
    const txt = Buffer.from('not a csv');

    const res = await request(app)
      .post('/upload')
      .attach('file', txt, 'file.txt');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Only CSV files are allowed');
  });

  it('rejects files with wrong extension even if mime is csv', async () => {
    const csv = Buffer.from('email,name\nuser@test.de,Test User');

    const res = await request(app)
      .post('/upload')
      .attach('file', csv, {
        filename: 'users.txt',
        contentType: 'text/csv',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Only CSV files are allowed');
  });

  it('rejects files larger than 5MB', async () => {
    const bigCsv = Buffer.alloc(5 * 1024 * 1024 + 1, 'a');

    const res = await request(app)
      .post('/upload')
      .attach('file', bigCsv, 'users.csv');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/File too large/i);
  });

  it('rejects multiple file uploads', async () => {
    const csv1 = Buffer.from('a,b\n1,2');
    const csv2 = Buffer.from('c,d\n3,4');

    const res = await request(app)
      .post('/upload')
      .attach('file', csv1, 'one.csv')
      .attach('file', csv2, 'two.csv');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Too many files/i);
  });
});