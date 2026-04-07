import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing auth token" });
  }
  try {
    const decoded = verifyToken(token);
    req.auth = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth?.role) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.auth.role)) return res.status(403).json({ message: "Forbidden" });
    return next();
  };
}

