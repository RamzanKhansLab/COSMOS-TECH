import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar.jsx";
import Footer from "../../components/Footer.jsx";
import { Badge, Btn, Card, Input, Shell } from "../../components/Ui.jsx";
import { http } from "../../api/http.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [err, setErr] = useState("");

  const filteredUsers = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
  }, [q, users]);

  const filteredProducts = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
  }, [q, products]);

  const filteredReviews = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return reviews;
    return reviews.filter((r) => {
      const productName = r?.productId?.name || "";
      const userName = r?.userId?.name || "";
      const userEmail = r?.userId?.email || "";
      return (
        String(productName).toLowerCase().includes(query) ||
        String(userName).toLowerCase().includes(query) ||
        String(userEmail).toLowerCase().includes(query)
      );
    });
  }, [q, reviews]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      const [sRes, uRes, pRes, rRes] = await Promise.all([
        http.get("/admin/overview"),
        http.get("/admin/users"),
        http.get("/admin/products"),
        http.get("/admin/reviews")
      ]);
      if (ignore) return;
      setStats(sRes.data.stats);
      setUsers(uRes.data.users || []);
      setProducts(pRes.data.products || []);
      setReviews(rRes.data.reviews || []);
    }
    run().catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  async function deleteProduct(id) {
    try {
      setErr("");
      await http.delete(`/admin/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
      setReviews((r) => r.filter((x) => x?.productId?._id !== id));
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Delete failed");
    }
  }

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Admin Overview</h1>
            <p className="mt-1 text-sm text-slate-300">
              All sellers & customers, search by name/email, view products, ratings, reviews, and delete products.
            </p>
          </div>
          <div className="w-full md:w-96">
            <div className="text-xs text-slate-300">Search (users, products, reviews)</div>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, product..." />
          </div>
        </div>

        {stats ? (
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Card className="p-5">
              <div className="text-sm font-extrabold">Customers</div>
              <div className="mt-3 text-3xl font-black">{stats.customers}</div>
            </Card>
            <Card className="p-5">
              <div className="text-sm font-extrabold">Sellers</div>
              <div className="mt-3 text-3xl font-black">{stats.sellers}</div>
            </Card>
            <Card className="p-5">
              <div className="text-sm font-extrabold">Products</div>
              <div className="mt-3 text-3xl font-black">{stats.products}</div>
            </Card>
            <Card className="p-5">
              <div className="text-sm font-extrabold">Reviews</div>
              <div className="mt-3 text-3xl font-black">{stats.reviews}</div>
            </Card>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="text-lg font-extrabold">Users</div>
            <div className="mt-3 space-y-3">
              {filteredUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="min-w-0">
                    <div className="line-clamp-1 text-sm font-bold">{u.name}</div>
                    <div className="text-xs text-slate-300 line-clamp-1">{u.email}</div>
                    {u.role === "seller" ? <div className="text-xs text-slate-300">Store: {u.sellerStoreName}</div> : null}
                  </div>
                  <Badge>{u.role}</Badge>
                </div>
              ))}
              {filteredUsers.length === 0 ? <div className="text-sm text-slate-300">No users.</div> : null}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-lg font-extrabold">Products</div>
            <div className="mt-3 space-y-3">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="min-w-0">
                    <div className="line-clamp-1 text-sm font-bold">{p.name}</div>
                    <div className="text-xs text-slate-300">
                      <Badge>{p.category}</Badge> <span className="ml-2">₹{p.price}</span>{" "}
                      <span className="ml-2">★ {Number(p.avgRating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                  <Btn variant="danger" onClick={() => deleteProduct(p._id)}>
                    Delete
                  </Btn>
                </div>
              ))}
              {filteredProducts.length === 0 ? <div className="text-sm text-slate-300">No products.</div> : null}
            </div>
            {err ? <div className="mt-3 text-sm text-rose-300">{err}</div> : null}
          </Card>
        </div>

        <div className="mt-6">
          <Card className="p-5">
            <div className="text-lg font-extrabold">Latest Reviews</div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {filteredReviews.slice(0, 10).map((r) => (
                <div key={r._id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">★ {r.rating}</div>
                    <div className="text-xs text-slate-300">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-1 text-sm font-bold line-clamp-1">{r?.productId?.name || "(deleted product)"}</div>
                  <div className="mt-1 text-xs text-slate-300 line-clamp-1">by {r?.userId?.name || "User"}</div>
                  <div className="mt-2 text-sm line-clamp-2">{r.title || "Review"}</div>
                  <div className="mt-1 text-xs text-slate-300 line-clamp-3">{r.comment}</div>
                </div>
              ))}
              {filteredReviews.length === 0 ? <div className="text-sm text-slate-300">No reviews.</div> : null}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}


