function usersToCSV(users, admin = false) {
  const headers = [
    "name",
    "email",
    "location",
    "isActive",
    "isBlocked",
    ...(admin ? ["lastLogin", "ipAddress"] : []),
  ];

  const rows = users.map(u =>
    headers.map(h => {
      const val = u[h];
      if (val === null || val === undefined) return "";
      if (val instanceof Date) return val.toISOString();
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
};

module.exports = usersToCSV;