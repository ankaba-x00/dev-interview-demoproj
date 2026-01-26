const { csvToUsers } = require('../../service/utils/csv/index');

/*
Tests: 
1) Parses a valid CSV and returns normalized users
2) Normalizes headers correctly (case, spaces, suffixes)
3) Throws error if CSV is empty
4) Rejects rows with missing required fields
5) Rejects rows with invalid formats
6) Rejects duplicate emails inside the CSV
7) Rejects partial uploads (some valid, some invalid rows)
8) Parses boolean isActive values correctly
9) Throws a detailed error when CSV parsing fails
*/

describe('csvToUsers', () => {
  it('parses a valid CSV and returns normalized users', async () => {
    const csv = Buffer.from(
      `email,name,location,isActive
       test@test.de, john   doe , Test ,true`
    );

    const users = await csvToUsers(csv);

    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      email: 'test@test.de',
      name: 'John Doe',
      location: 'Test',
      isActive: true,
    });
  });

  it('normalizes headers correctly (case, spaces, suffixes)', async () => {
    const csv = Buffer.from(
      `E-Mail,NaMe,LoCaTiOn,Is Active
       test@test.de,Jane Doe,Test,true`
    );

    const users = await csvToUsers(csv);

    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      email: 'test@test.de',
      name: 'Jane Doe',
      location: 'Test',
      isActive: true,
    });
  });

  it('throws error if CSV is empty', async () => {
    const csv = Buffer.from(`email,name,location`);

    await expect(csvToUsers(csv)).rejects.toThrow(
      'File rejected: empty file'
    );
  });

  it('rejects rows with missing required fields', async () => {
    const csv = Buffer.from(
      `email,name,location
       ,John Doe,Test`
    );

    try {
      await csvToUsers(csv);
      throw new Error('Expected rejection');
    } catch (err) {
      expect(err.message).toBe('Data rejected: validation failed');
      expect(err.details).toEqual([
        {
          row: 1,
          errors: ['email is required'],
        },
      ]);
    }
  });

  it('rejects rows with invalid formats', async () => {
    const csv = Buffer.from(
      `email,name,location
       invalid-email,John123,Test!`
    );

    try {
      await csvToUsers(csv);
      throw new Error('Expected rejection');
    } catch (err) {
      expect(err.message).toBe('Data rejected: validation failed');
      expect(err.details[0].errors).toEqual(
        expect.arrayContaining([
          'email format is invalid',
          'name format is invalid',
          'location format is invalid',
        ])
      );
    }
  });

  it('rejects duplicate emails inside the CSV', async () => {
    const csv = Buffer.from(
      `email,name,location
       test@test.de,John Doe,Test-A
       test@test.de,Jane Doe,Test-B`
    );

    try {
      await csvToUsers(csv);
      throw new Error('Expected rejection');
    } catch (err) {
      expect(err.message).toBe('Data rejected: validation failed');
      expect(err.details).toEqual([
        {
          row: 2,
          errors: ['duplicate email in CSV'],
        },
      ]);
    }
  });

  it('rejects partial uploads (some valid, some invalid rows)', async () => {
    const csv = Buffer.from(
      `email,name,location
       good@test.de,John Doe,Test-A
       bad@test.de,,Test-B`
    );

    try {
      await csvToUsers(csv);
      throw new Error('Expected rejection');
    } catch (err) {
      expect(err.message).toBe('Data rejected: validation failed');
      expect(err.details).toEqual([
        {
          row: 2,
          errors: ['name is required'],
        },
      ]);
    }
  });

  it('parses boolean isActive values correctly', async () => {
    const csv = Buffer.from(
      `email,name,location,isActive
       true@test.de,John Doe,Test-A,true
       false@test.de,Jane Doe,Test-B,false`
    );

    const users = await csvToUsers(csv);

    expect(users[0].isActive).toBe(true);
    expect(users[1].isActive).toBe(false);
  });

  it('throws a detailed error when CSV parsing fails', async () => {
    const csv = Buffer.from(
      `"email","name","location"\n"test@test.de","John Doe`
    );

    try {
      await csvToUsers(csv);
      throw new Error('Expected rejection');
    } catch (err) {
      expect(err.message).toBe('CSV parsing failed');
      expect(err.details).toBeDefined();
    }
  });
});
