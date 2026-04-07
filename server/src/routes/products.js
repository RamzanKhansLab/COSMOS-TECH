import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";

export const productsRouter = express.Router();

const productCreateSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  category: z.string().trim().min(2),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().optional()
});

const productUpdateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().min(10).optional(),
  category: z.string().trim().min(2).optional(),
  price: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().optional()
});

productsRouter.get("/", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();

  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (category) filter.category = category;

  const products = await Product.find(filter).sort({ createdAt: -1 }).limit(200);
  return res.json({ products });
});

productsRouter.get("/me/mine", requireAuth, requireRole("seller"), async (req, res) => {
  const products = await Product.find({ sellerId: req.auth.sub }).sort({ createdAt: -1 });
  return res.json({ products });
});

productsRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 }).limit(50);
  return res.json({ product, reviews });
});

productsRouter.post("/", requireAuth, requireRole("seller"), async (req, res) => {
  const parsed = productCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const data = parsed.data;
  const product = await Product.create({
    ...data,
    imageUrl: data.imageUrl || "",
    sellerId: req.auth.sub
  });
  return res.status(201).json({ product });
});

productsRouter.patch("/:id", requireAuth, requireRole("seller"), async (req, res) => {
  const parsed = productUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (String(product.sellerId) !== String(req.auth.sub)) return res.status(403).json({ message: "Forbidden" });

  Object.assign(product, parsed.data);
  await product.save();
  return res.json({ product });
});

productsRouter.delete("/:id", requireAuth, requireRole("seller"), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (String(product.sellerId) !== String(req.auth.sub)) return res.status(403).json({ message: "Forbidden" });
await Review.deleteMany({ productId: product._id });
  await Product.deleteOne({ _id: product._id });
  return res.json({ ok: true });
});

