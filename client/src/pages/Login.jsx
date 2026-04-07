import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import { Btn, Card, Input, Shell } from "../components/Ui.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setErr("");
      await login({ email, password, isAdmin });
      navigate(isAdmin ? "/admin" : "/");
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Login failed");
    }
  }

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-md">
          <Card className="p-6">
            <h1 className="text-2xl font-black">Login</h1>
            <p className="mt-1 text-sm text-slate-300">Customers & sellers can login. Admin login uses `.env` credentials.</p>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <div className="text-xs text-slate-300">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div>
                <div className="text-xs text-slate-300">Password</div>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                Login as admin
              </label>

              {err ? <div className="text-sm text-rose-300">{err}</div> : null}
              <Btn className="w-full" type="submit">
                Login
              </Btn>
            </form>

            <div className="mt-4 text-sm text-slate-300">
              New here?{" "}
              <Link to="/register" className="text-sky-300 hover:text-sky-200">
                Create an account
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}


