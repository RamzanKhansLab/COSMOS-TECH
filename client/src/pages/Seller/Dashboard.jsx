import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import Footer from "../../components/Footer.jsx";
import { Badge, Btn, Card, Shell } from "../../components/Ui.jsx";
import { http } from "../../api/http.js";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let ignore = false;
    async function run() {
      const [pRes, oRes, rRes] = await Promise.all([
        http.get("/products/me/mine"),
        http.get("/orders/seller/me"),
        http.get("/reviews/seller/me")
      ]);
      if (ignore) return;
      setProducts(pRes.data.products || []);
      setOrders(oRes.data.orders || []);
      setReviews(rRes.data.reviews || []);
    }
    run().catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  async function deleteProduct(p) {
    if (Number(p.stock || 0) > 0) return;
    const ok = window.confirm(`Delete "${p.name}" from COSMOS Tech? This cannot be undone.`);
    if (!ok) return;

    try {
      setErr("");
      setBusyId(p._id);
      await http.delete(`/products/${p._id}`);
      setProducts((prev) => prev.filter((x) => x._id !== p._id));
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Delete failed");
    } finally {
      setBusyId("");
    }
  }

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black">Seller Dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">Manage your products only. View orders and reviews for your listings.</p>
          </div>
          <Link to="/seller/new">
            <Btn>Add product</Btn>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="text-sm font-extrabold">My products</div>
            <div className="mt-3 text-3xl font-black">{products.length}</div>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-extrabold">Orders containing my items</div>
            <div className="mt-3 text-3xl font-black">{orders.length}</div>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-extrabold">Reviews on my products</div>
            <div className="mt-3 text-3xl font-black">{reviews.length}</div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div>
              <div className="text-lg font-extrabold">Products</div>
              <div className="mt-1 text-xs text-slate-400">Delete is enabled only when stock is 0 (offline/out of stock).</div>
            </div>
            <div className="mt-3 space-y-3">
              {products.map((p) => (
                <div key={p._id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="min-w-0">
                    <div className="line-clamp-1 text-sm font-bold">{p.name}</div>
                    <div className="text-xs text-slate-300">
                      <Badge>{p.category}</Badge> <span className="ml-2">₹{p.price}</span> <span className="ml-2">stock: {p.stock}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/p/${p._id}`} className="text-sm text-sky-300 hover:text-sky-200">
                      View
                    </Link>
                    <Btn
                      variant="danger"
                      disabled={Number(p.stock || 0) > 0 || busyId === p._id}
                      onClick={() => deleteProduct(p)}
                      className="whitespace-nowrap"
                    >
                      Delete
                    </Btn>
                  </div>
                </div>
              ))}
              {products.length === 0 ? <div className="text-sm text-slate-300">No products yet.</div> : null}
            </div>
            {err ? <div className="mt-3 text-sm text-rose-300">{err}</div> : null}
          </Card>

          <Card className="p-5">
            <div className="text-lg font-extrabold">Latest reviews</div>
            <div className="mt-3 space-y-3">
              {reviews.slice(0, 6).map((r) => (
                <div key={r._id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">★ {r.rating}</div>
                    <div className="text-xs text-slate-300">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-1 text-sm">{r.title || "Review"}</div>
                  <div className="mt-1 text-xs text-slate-300 line-clamp-2">{r.comment}</div>
                </div>
              ))}
              {reviews.length === 0 ? <div className="text-sm text-slate-300">No reviews yet.</div> : null}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}
