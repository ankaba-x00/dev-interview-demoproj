const { usersToCSV } = require('../../service/utils/csv/index');

/*
Tests: 
1) Generates CSV with correct headers for non-admin
2) Generates full CSV with correct headers for admins
3) Escapes double quotes correctly
4) Outputs empty fields for null or undefined values
5) Returns only header row when users array is empty
*/

describe('usersToCSV', () => {
  it('generates CSV with correct headers for non-admin', () => {
    const users = [
      {
        email: 'user@test.de',
        name: 'Test User',
        location: 'Test',
        isActive: true,
        isBlocked: false,
        lastLogin: new Date('2024-01-01T10:00:00Z'),
        ipAddress: '127.0.0.1',
      },
    ];

    const csv = usersToCSV(users, false);
    const lines = csv.split('\n');

    expect(lines[0]).toBe(
      'location,isActive,email,name,isBlocked'
    );

    expect(lines[0]).not.toContain('lastLogin');
    expect(lines[0]).not.toContain('ipAddress');
  });

  it('generates full CSV with correct headers for admins', () => {
    const users = [
      {
        email: 'admin@test.de',
        name: 'Admin User',
        location: 'Test',
        isActive: true,
        isBlocked: false,
        lastLogin: new Date('2024-01-01T10:00:00Z'),
        ipAddress: '192.168.1.1',
      },
    ];

    const csv = usersToCSV(users, true);
    const lines = csv.split('\n');

    expect(lines[0]).toBe(
      'location,isActive,email,name,isBlocked,lastLogin,ipAddress'
    );

    expect(lines[1]).toContain(
      '2024-01-01T10:00:00.000Z'
    );
    expect(lines[1]).toContain('"192.168.1.1"');
  });

  it('escapes double quotes correctly', () => {
    const users = [
      {
        email: 'test@test.de',
        name: 'John "Danger" Doe',
        location: 'Test',
        isActive: true,
        isBlocked: false,
      },
    ];

    const csv = usersToCSV(users, false);
    const lines = csv.split('\n');

    expect(lines[1]).toContain('"John ""Danger"" Doe"');
  });

  it('outputs empty fields for null or undefined values', () => {
    const users = [
      {
        email: 'empty@test.de',
        name: null,
        location: undefined,
        isActive: true,
        isBlocked: false,
      },
    ];

    const csv = usersToCSV(users, false);
    const lines = csv.split('\n');

    const cells = lines[1].split(',');

    expect(cells[0]).toBe(''); // location
    expect(cells[1]).toBe('"true"'); // isActive
    expect(cells[2]).toBe('"empty@test.de"'); // email
    expect(cells[3]).toBe(''); // name
    expect(cells[4]).toBe('"false"'); // isBlocked
  });

  it('returns only header row when users array is empty', () => {
    const csv = usersToCSV([], false);

    expect(csv).toBe(
      'location,isActive,email,name,isBlocked'
    );
  });
});

