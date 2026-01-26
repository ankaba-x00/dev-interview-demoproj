export function withinLoginRange(lastLogin, range) {
  if (!range || !lastLogin) return true;

  const now = Date.now();
  const loginTime = new Date(lastLogin).getTime();

  const ranges = {
    '24h': 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '4w': 28 * 24 * 60 * 60 * 1000,
  };

  return now - loginTime <= ranges[range];
};

export function withinCustomRange(lastLogin, from, to) {
  if (!lastLogin) return false;

  const time = Date.parse(lastLogin);

  if (from) {
    const fromTime = Date.parse(`${from}T00:00:00.000Z`);
    if (time < fromTime) return false;
  }

  if (to) {
    const toTime = Date.parse(`${to}T23:59:59.999Z`);
    if (time > toTime) return false;
  }

  return true;
};
