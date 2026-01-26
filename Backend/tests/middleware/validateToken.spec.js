const jwt = require('jsonwebtoken');
const verify = require('../../service/middleware/validateToken');

/*
Tests:
1) Rejects request when Authorization header is missing
2) Rejects request when token is invalid
3) Attaches decoded user to req and calls next for valid token
4) Rejects token with wrong secret
*/

describe('validateToken middleware', () => {
  const SECRET = 'test-secret';

  let req;
  let res;
  let next;

  beforeAll(() => {
    process.env.TOKEN_KEY = SECRET;
  });

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it('rejects request when Authorization header is missing', () => {
    verify(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith('You are not authenticated');
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects request when token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token';

    verify(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token is not valid',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches decoded user to req and calls next for valid token', () => {
    const payload = {
      id: '123',
      role: 'ADMIN',
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${token}`;

    verify(req, res, next);

    expect(req.user).toEqual(
      expect.objectContaining({
        id: payload.id,
        role: payload.role,
      })
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('rejects token with wrong secret', () => {
    const token = jwt.sign(
      { id: '123', role: 'USER' },
      'wrong-secret'
    );

    req.headers.authorization = `Bearer ${token}`;

    verify(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token is not valid',
    });
    expect(next).not.toHaveBeenCalled();
  });
});