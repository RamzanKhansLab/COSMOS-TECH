import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import { Btn, Card, Input, Shell } from "../components/Ui.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sellerStoreName, setSellerStoreName] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setErr("");
      await register({ name, email, password, role, sellerStoreName: role === "seller" ? sellerStoreName : undefined });
      navigate(role === "seller" ? "/seller" : "/");
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-md">
          <Card className="p-6">
            <h1 className="text-2xl font-black">Register</h1>
            <p className="mt-1 text-sm text-slate-300">Create a seller or customer account. Admins cannot register.</p>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <div className="text-xs text-slate-300">Role</div>
                <select
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>
              <div>
                <div className="text-xs text-slate-300">Name</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <div className="text-xs text-slate-300">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div>
                <div className="text-xs text-slate-300">Password</div>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {role === "seller" ? (
                <div>
                  <div className="text-xs text-slate-300">Store name</div>
                  <Input value={sellerStoreName} onChange={(e) => setSellerStoreName(e.target.value)} placeholder="Your store" />
                </div>
              ) : null}

              {err ? <div className="text-sm text-rose-300">{err}</div> : null}
              <Btn className="w-full" type="submit">
                Create account
              </Btn>
            </form>

            <div className="mt-4 text-sm text-slate-300">
              Already have an account?{" "}
              <Link to="/login" className="text-sky-300 hover:text-sky-200">
                Login
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}


