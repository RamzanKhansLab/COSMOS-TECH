import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import { Badge, Btn, Card, Input, Shell } from "../components/Ui.jsx";
import Stars from "../components/Stars.jsx";

function ProductCard({ p }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/10] w-full bg-black/20">
        {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="line-clamp-1 text-sm font-extrabold">{p.name}</div>
          <Badge>{p.category}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <Stars value={p.avgRating} />
          <div className="text-sm font-bold text-sky-300">₹{p.price}</div>
        </div>
        <Link to={`/p/${p._id}`} className="block">
          <Btn className="w-full">View</Btn>
        </Link>
      </div>
    </Card>
  );
}

export default function Home() {
  const [q, setQ] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) => p.name.toLowerCase().includes(query));
  }, [q, products]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      setLoading(true);
      const res = await http.get("/products");
      if (!ignore) setProducts(res.data.products || []);
      if (!ignore) setLoading(false);
    }
    run().catch(() => setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Shop{" "}
              <span className="bg-gradient-to-r from-sky-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                Tech
              </span>{" "}
              Essentials
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Premium keyboards, mice, laptops, and components from franchise sellers — powered by RBAC and a secure admin panel.
            </p>
          </div>
          <div className="w-full md:w-80">
            <div className="text-xs text-slate-300">Search products</div>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="keyboard, laptop, CPU cooler..." />
          </div>
        </div>

        
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden p-5">
            <img
              src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80"
              alt="Setup"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="relative">
              <div className="text-xs font-bold text-slate-200/90">COSMOS Collections</div>
              <div className="mt-1 text-lg font-black">Creator Setup</div>
              <div className="mt-2 text-sm text-slate-300">Keyboards, mice, monitors, hubs — everything for a clean desk.</div>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-5">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
              alt="Components"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="relative">
              <div className="text-xs font-bold text-slate-200/90">Performance</div>
              <div className="mt-1 text-lg font-black">PC Components</div>
              <div className="mt-2 text-sm text-slate-300">Coolers, SSDs and upgrades to keep your build fast.</div>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-5">
            <img
              src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=1200&q=80"
              alt="Audio"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="relative">
              <div className="text-xs font-bold text-slate-200/90">Everyday</div>
              <div className="mt-1 text-lg font-black">Audio + Accessories</div>
              <div className="mt-2 text-sm text-slate-300">Headphones, chargers, cables and travel essentials.</div>
            </div>
          </Card>
        </div>
        {loading ? (
          <div className="text-sm text-slate-300">Loading products…</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </Shell>
  );
}



