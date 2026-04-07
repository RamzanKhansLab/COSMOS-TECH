export function parseAdminCreds(adminCredsRaw) {
  return String(adminCredsRaw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const idx = pair.lastIndexOf(":");
      if (idx <= 0) return null;
      const email = pair.slice(0, idx).trim().toLowerCase();
      const password = pair.slice(idx + 1).trim();
      if (!email || !password) return null;
      return { email, password };
    })
    .filter(Boolean);
}

