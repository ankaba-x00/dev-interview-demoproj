const validateAuthUser = require('../../service/utils/validation/authUserValidation');

/*
Tests: 
1) Accepts valid auth user data
2) Rejects missing required fields
3) Rejects invalid email format
4) Rejects password shorter than 8 characters
5) Rejects password longer than 25 characters
6) Rejects mismatching passwords with custom message
7) Rejects unknown fields
8) Returns multiple validation errors (abortEarly: false)
*/

describe('authUserValidation', () => {
  it('accepts valid auth user data', () => {
    const { error, value } = validateAuthUser({
      email: 'test@test.de',
      password: 'Secret123!',
      confirmPassword: 'Secret123!',
    });

    expect(error).toBeUndefined();
    expect(value.email).toBe('test@test.de');
  });

  it('rejects missing required fields', () => {
    const { error } = validateAuthUser({});

    expect(error).toBeDefined();
    expect(error.details.map(d => d.path[0])).toEqual(
      expect.arrayContaining(['email', 'password', 'confirmPassword'])
    );
  });

  it('rejects invalid email format', () => {
    const { error } = validateAuthUser({
      email: 'not-an-email',
      password: 'Secret123!',
      confirmPassword: 'Secret123!',
    });

    expect(error).toBeDefined();
    expect(error.details.some(d => d.path[0] === 'email')).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    const { error } = validateAuthUser({
      email: 'test@test.de',
      password: 'short',
      confirmPassword: 'short',
    });

    expect(error).toBeDefined();
    expect(error.details.some(d => d.path[0] === 'password')).toBe(true);
  });

  it('rejects password longer than 25 characters', () => {
    const longPassword = 'a'.repeat(26);

    const { error } = validateAuthUser({
      email: 'test@test.de',
      password: longPassword,
      confirmPassword: longPassword,
    });

    expect(error).toBeDefined();
    expect(error.details.some(d => d.path[0] === 'password')).toBe(true);
  });

  it('rejects mismatching passwords with custom message', () => {
    const { error } = validateAuthUser({
      email: 'test@test.de',
      password: 'Secret123!',
      confirmPassword: 'Different123!',
    });

    expect(error).toBeDefined();
    expect(error.details.some(d => d.message === 'Passwords do not match')).toBe(true);
  });

  it('rejects unknown fields', () => {
    const { error } = validateAuthUser({
      email: 'test@test.de',
      password: 'Secret123!',
      confirmPassword: 'Secret123!',
      extraField: 'not-allowed',
    });

    expect(error).toBeDefined();
    expect(error.details.some(d => d.type === 'object.unknown')).toBe(true);
  });

  it('returns multiple validation errors (abortEarly: false)', () => {
    const { error } = validateAuthUser({
      email: 'bad-email',
      password: 'short',
      confirmPassword: 'different',
    });

    expect(error).toBeDefined();
    expect(error.details.length).toBeGreaterThan(1);
  });
});