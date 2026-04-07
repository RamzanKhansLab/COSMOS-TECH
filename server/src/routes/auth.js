import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { parseAdminCreds } from "../utils/adminCreds.js";
import { signToken } from "../utils/jwt.js";

export const authRouter = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["customer", "seller"]),
  sellerStoreName: z.string().optional()
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const { name, email, password, role, sellerStoreName } = parsed.data;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    sellerStoreName: role === "seller" ? (sellerStoreName || `${name}'s Store`) : undefined
  });

  const token = signToken({ sub: String(user._id), role: user.role, email: user.email, name: user.name });
  return res.json({ token, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ sub: String(user._id), role: user.role, email: user.email, name: user.name });
  return res.json({ token, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
});

authRouter.post("/admin/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const { email, password } = parsed.data;
  const admins = parseAdminCreds(env.adminCreds);
  const match = admins.find((a) => a.email === email.toLowerCase() && a.password === password);
  if (!match) return res.status(401).json({ message: "Invalid admin credentials" });

  const token = signToken({ sub: `admin:${match.email}`, role: "admin", email: match.email, name: "Admin" });
  return res.json({ token, user: { id: `admin:${match.email}`, name: "Admin", email: match.email, role: "admin" } });
});

