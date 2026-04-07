import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";

export const adminRouter = express.Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/overview", async (req, res) => {
  const [customers, sellers, productsCount, reviewsCount] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "seller" }),
    Product.countDocuments({}),
    Review.countDocuments({})
  ]);
  return res.json({ stats: { customers, sellers, products: productsCount, reviews: reviewsCount } });
});

adminRouter.get("/users", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const role = String(req.query.role || "").trim();
  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (role && ["customer", "seller"].includes(role)) filter.role = role;

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .limit(300)
    .select("name email role sellerStoreName createdAt");
  return res.json({ users });
});

adminRouter.get("/products", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  const products = await Product.find(filter).sort({ createdAt: -1 }).limit(300);
  return res.json({ products });
});

adminRouter.get("/reviews", async (req, res) => {
  const reviews = await Review.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .populate({ path: "productId", select: "name category" })
    .populate({ path: "userId", select: "name email" });

  return res.json({ reviews });
});

adminRouter.delete("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await Review.deleteMany({ productId: product._id });
  await Product.deleteOne({ _id: product._id });
  return res.json({ ok: true });
});
