const {
  validateCreateUser,
  validateUpdateUser,
} = require('../../service/utils/validation/userValidation');

/*
Tests: validateCreateUser
1) accepts valid user data
2) rejects missing required fields
3) rejects invalid email format
4) rejects name shorter than 3 characters
5) rejects location shorter than 2 characters
6) rejects unknown fields
7) returns multiple errors when input is invalid (abortEarly: false) 0ms
Tests: validateUpdateUser
1) accepts partial updates
2) accepts empty object (no updates)
3) rejects invalid email format
4) rejects unknown fields
5) returns multiple errors for invalid update input
*/

describe('userValidation', () => {
  describe('validateCreateUser', () => {
    it('accepts valid user data', () => {
      const { error, value } = validateCreateUser({
        name: 'John Doe',
        email: 'test@test.de',
        location: 'Test',
        isActive: true,
        isBlocked: false,
      });

      expect(error).toBeUndefined();
      expect(value.name).toBe('John Doe');
    });

    it('rejects missing required fields', () => {
      const { error } = validateCreateUser({});

      expect(error).toBeDefined();
      expect(error.details.map(d => d.path[0])).toEqual(
        expect.arrayContaining(['name', 'email', 'location'])
      );
    });

    it('rejects invalid email format', () => {
      const { error } = validateCreateUser({
        name: 'John Doe',
        email: 'not-an-email',
        location: 'Test',
      });

      expect(error).toBeDefined();
      expect(error.details.some(d => d.path[0] === 'email')).toBe(true);
    });

    it('rejects name shorter than 3 characters', () => {
      const { error } = validateCreateUser({
        name: 'Jo',
        email: 'test@test.de',
        location: 'Test',
      });

      expect(error).toBeDefined();
      expect(error.details.some(d => d.path[0] === 'name')).toBe(true);
    });

    it('rejects location shorter than 2 characters', () => {
      const { error } = validateCreateUser({
        name: 'John Doe',
        email: 'test@test.de',
        location: 'B',
      });

      expect(error).toBeDefined();
      expect(error.details.some(d => d.path[0] === 'location')).toBe(true);
    });

    it('rejects unknown fields', () => {
      const { error } = validateCreateUser({
        name: 'John Doe',
        email: 'test@test.de',
        location: 'Test',
        unknownField: 'not allowed',
      });

      expect(error).toBeDefined();
      expect(error.details.some(d => d.type === 'object.unknown')).toBe(true);
    });

    it('returns multiple errors when input is invalid (abortEarly: false)', () => {
      const { error } = validateCreateUser({
        name: 'J',
        email: 'bad-email',
        location: '',
      });

      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(1);
    });
  });

  describe('validateUpdateUser', () => {
    it('accepts partial updates', () => {
      const { error } = validateUpdateUser({
        name: 'Updated Name',
      });

      expect(error).toBeUndefined();
    });

    it('accepts empty object (no updates)', () => {
      const { error } = validateUpdateUser({});

      expect(error).toBeUndefined();
    });

    it('rejects invalid email format', () => {
      const { error } = validateUpdateUser({
        email: 'invalid-email',
      });

      expect(error).toBeDefined();
      expect(error.details.some(d => d.path[0] === 'email')).toBe(true);
    });

    it('rejects unknown fields', () => {
      const { error } = validateUpdateUser({
        foo: 'bar',
      });

      expect(error).toBeDefined();
      expect(error.details.some(d => d.type === 'object.unknown')).toBe(true);
    });

    it('returns multiple errors for invalid update input', () => {
      const { error } = validateUpdateUser({
        name: 'J',
        email: 'bad-email',
        location: 'X',
      });

      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(1);
    });
  });
});