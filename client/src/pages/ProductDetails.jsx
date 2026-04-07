import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { http } from "../api/http";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import Stars from "../components/Stars.jsx";
import { Badge, Btn, Card, Input, Shell } from "../components/Ui.jsx";
import { addToCart } from "../state/cart.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [err, setErr] = useState("");

  const canReview = user?.role === "customer";
  const inStock = useMemo(() => (product?.stock ?? 0) > 0, [product]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      const res = await http.get(`/products/${id}`);
      if (ignore) return;
      setProduct(res.data.product);
      setReviews(res.data.reviews || []);
    }
    run().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [id]);

  async function directBuy() {
    if (!user) return navigate("/login");
    if (user.role !== "customer") return setErr("Only customers can purchase.");
    try {
      setErr("");
      await http.post("/orders", { items: [{ productId: product._id, qty: Number(qty) }] });
      navigate("/orders");
    } catch (e) {
      setErr(e?.response?.data?.message || "Purchase failed");
    }
  }

  async function submitReview() {
    try {
      setErr("");
      const res = await http.post(`/reviews/${product._id}`, { rating: Number(rating), title, comment });
      setReviews((r) => [res.data.review, ...r]);
      const refetch = await http.get(`/products/${id}`);
      setProduct(refetch.data.product);
      setTitle("");
      setComment("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Review failed");
    }
  }

  if (!product) {
    return (
      <Shell>
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-300">Loading…</main>
      </Shell>
    );
  }

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Link to="/" className="text-sm text-slate-300 hover:text-white">
          ← Back to shop
        </Link>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="aspect-[16/11] bg-black/20">
              {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : null}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-2xl font-black">{product.name}</div>
                <div className="mt-2 flex items-center gap-3">
                  <Stars value={product.avgRating} />
                  <div className="text-xs text-slate-300">({product.ratingsCount} ratings)</div>
                </div>
              </div>
              <Badge>{product.category}</Badge>
            </div>
            <p className="mt-4 text-sm text-slate-200/90">{product.description}</p>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-2xl font-black text-sky-300">₹{product.price}</div>
              <div className="text-sm text-slate-300">{inStock ? `${product.stock} in stock` : "Out of stock"}</div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-28">
                <div className="text-xs text-slate-300">Qty</div>
                <Input
                  type="number"
                  min={1}
                  max={Math.max(1, product.stock || 1)}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <Btn
                variant="ghost"
                className="w-full"
                disabled={!inStock}
                onClick={() => {
                  addToCart(product, Number(qty));
                  navigate("/cart");
                }}
              >
                Add to cart
              </Btn>
              <Btn className="w-full" disabled={!inStock} onClick={directBuy}>
                Buy now
              </Btn>
            </div>

            {err ? <div className="mt-3 text-sm text-rose-300">{err}</div> : null}
          </Card>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="p-5 md:col-span-2">
            <div className="text-lg font-extrabold">Reviews</div>
            <div className="mt-4 space-y-4">
              {reviews.length === 0 ? <div className="text-sm text-slate-300">No reviews yet.</div> : null}
              {reviews.map((r) => (
                <div key={r._id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <Stars value={r.rating} />
                    <div className="text-xs text-slate-300">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-sm font-bold">{r.title || "Review"}</div>
                  <div className="mt-1 text-sm text-slate-200/90">{r.comment}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-lg font-extrabold">Add a review</div>
            {!canReview ? (
              <div className="mt-3 text-sm text-slate-300">Login as a customer and purchase this product to review.</div>
            ) : (
              <div className="mt-3 space-y-3">
                <div>
                  <div className="text-xs text-slate-300">Rating (1-5)</div>
                  <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} />
                </div>
                <div>
                  <div className="text-xs text-slate-300">Title</div>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short headline" />
                </div>
                <div>
                  <div className="text-xs text-slate-300">Comment</div>
                  <textarea
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-500/20"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                  />
                </div>
                <Btn onClick={submitReview}>Submit</Btn>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}


