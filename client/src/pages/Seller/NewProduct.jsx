import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import Footer from "../../components/Footer.jsx";
import { Btn, Card, Input, Shell } from "../../components/Ui.jsx";
import { http } from "../../api/http.js";

export default function NewProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Keyboards");
  const [price, setPrice] = useState(1999);
  const [stock, setStock] = useState(10);
  const [imageUrl, setImageUrl] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setErr("");
      await http.post("/products", {
        name,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
        imageUrl
      });
      navigate("/seller");
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Create failed");
    }
  }

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-xl">
          <Card className="p-6">
            <h1 className="text-2xl font-black">Add Product</h1>
            <p className="mt-1 text-sm text-slate-300">Only sellers can create products.</p>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <div className="text-xs text-slate-300">Name</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <div className="text-xs text-slate-300">Description</div>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-500/20"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-300">Category</div>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div>
                  <div className="text-xs text-slate-300">Price (₹)</div>
                  <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-300">Stock</div>
                  <Input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
                <div>
                  <div className="text-xs text-slate-300">Image URL</div>
                  <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>

              {err ? <div className="text-sm text-rose-300">{err}</div> : null}
              <Btn type="submit" className="w-full">
                Create
              </Btn>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}


