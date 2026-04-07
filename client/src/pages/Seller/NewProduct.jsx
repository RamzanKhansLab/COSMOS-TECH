import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import Footer from "../../components/Footer.jsx";
import { Btn, Card, Input, Shell } from "../../components/Ui.jsx";
import ImageDrop from "../../components/ImageDrop.jsx";
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
  const [busy, setBusy] = useState(false);
  const IMAGE_LIBRARY = [
    { label: "Keyboard", url: "/products/keyboard.svg" },
    { label: "Mouse", url: "/products/mouse.svg" },
    { label: "Laptop", url: "/products/laptop.svg" },
    { label: "Cooler", url: "/products/cooler.svg" },
    { label: "SSD", url: "/products/ssd.svg" },
    { label: "Monitor", url: "/products/monitor.svg" },
    { label: "Headphones", url: "/products/headphones.svg" },
    { label: "USB-C Hub", url: "/products/hub.svg" },
    { label: "Charger", url: "/products/charger.svg" },
    { label: "Webcam", url: "/products/webcam.svg" },
    { label: "Cable", url: "/products/cable.svg" },
    { label: "Router", url: "/products/router.svg" }
  ];

  async function submit(e) {
    e.preventDefault();
    try {
      setErr("");
      setBusy(true);
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
      const data = ex?.response?.data;
      const issue = Array.isArray(data?.issues) && data.issues[0] ? data.issues[0].message : "";
      setErr((data?.message || "Create failed") + (issue ? `: ${issue}` : ""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black">Add Product</h1>
                <p className="mt-1 text-sm text-slate-300">Sellers can add products. Drag & drop an image for offline-friendly preview.</p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <div className="text-xs text-slate-300">Name</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: COSMOS Mech Keyboard K87" />
              </div>

              <div>
                <div className="text-xs text-slate-300">Description</div>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-500/20"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a clear, customer-friendly description (features, compatibility, warranty, etc.)"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-300">Category</div>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Keyboards / Mouse / Laptops ..." />
                </div>
                <div>
                  <div className="text-xs text-slate-300">Price (₹)</div>
                  <Input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-300">Stock</div>
                  <Input type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value || 0))} />
                </div>
                <div className="text-xs text-slate-400 flex items-end">
                  Tip: Keep stock updated; you can delete a listing anytime if you sell it offline.
                </div>
              </div>

              <ImageDrop value={imageUrl} onChange={setImageUrl} />
              <div>
                <div className="text-sm font-extrabold">COSMOS Image Library (recommended)</div>
                <div className="mt-1 text-xs text-slate-400">These images are shipped inside the GitHub repo and work on deployment.</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {IMAGE_LIBRARY.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={[
                        "overflow-hidden rounded-xl border bg-black/20 text-left transition",
                        imageUrl === img.url ? "border-sky-400/60" : "border-white/10 hover:border-white/20"
                      ].join(" ")}
                    >
                      <img src={img.url} alt={img.label} className="h-20 w-full object-cover" />
                      <div className="px-3 py-2 text-xs text-slate-300">{img.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-300">Or paste an image URL (optional)</div>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
              </div>

              {err ? <div className="text-sm text-rose-300">{err}</div> : null}
              <Btn type="submit" className="w-full" disabled={busy}>
                {busy ? "Creating…" : "Create"}
              </Btn>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}




