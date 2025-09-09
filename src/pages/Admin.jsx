import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Admin = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("tom_admin_user");
    if (saved) setUserid(saved);
  }, []);

  const validate = () => {
    if (!userid.trim()) return "User ID is required.";
    if (!/\S+@\S+\.\S+/.test(userid)) return "Please enter a valid email.";
    if (!password.trim()) return "Password is required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 400)); // demo delay
      if (userid === "admin@gmail.com" && password === "123") {
        if (remember) localStorage.setItem("tom_admin_user", userid);
        navigate("/admin/home");
      } else {
        setError("Invalid credentials. Try admin@gmail.com / 123 (demo).");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Decorative background pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(600px 300px at 120% -10%, rgba(255,82,0,0.08), transparent 60%), radial-gradient(400px 300px at -10% 120%, rgba(16,185,129,0.08), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-stretch">
          {/* LEFT — Brand / Hero */}
          <div className="hidden lg:flex">
            <div className="relative w-full rounded-3xl border bg-white/70 backdrop-blur-md shadow-sm p-10 overflow-hidden">
              <div className="absolute -right-24 -top-24 h-60 w-60 rotate-12 rounded-full bg-[#FF5200]/10 blur-2xl" />
              <div className="absolute -left-16 bottom-10 h-40 w-40 -rotate-12 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="flex items-center gap-4">
                <img
                  src="/logo1 (2).svg"
                  alt="Taste of Madurai Logo"
                  className="h-16 w-auto rounded-xl"
                  draggable="false"
                />
                <div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                    Taste of Madurai
                  </h1>
                  <p className="text-sm text-slate-600 -mt-1">(TOM) • Admin Console</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border p-5 hover:shadow-sm transition">
                  <p className="text-base font-semibold text-slate-800">
                    Curate Menus
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Manage veg, non-veg, vegan & gluten-free tags.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      Vegan
                    </span>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      Gluten-free
                    </span>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-rose-50 text-rose-700">
                      Chef’s special
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border p-5 hover:shadow-sm transition">
                  <p className="text-base font-semibold text-slate-800">
                    Pricing & Offers
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Edit rates, combos & festive discounts in one place.
                  </p>
                  <div className="mt-3 h-2 w-32 rounded bg-[#FF5200]/80" />
                </div>

                <div className="rounded-2xl border p-5 hover:shadow-sm transition">
                  <p className="text-base font-semibold text-slate-800">
                    Kitchen Insights
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Track prep times & dish popularity.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <div className="h-2 w-10 rounded bg-emerald-500/70" />
                    <div className="h-2 w-8 rounded bg-indigo-500/50" />
                    <div className="h-2 w-6 rounded bg-[#FF5200]/70" />
                  </div>
                </div>

                <div className="rounded-2xl border p-5 hover:shadow-sm transition">
                  <p className="text-base font-semibold text-slate-800">
                    Secure Access
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Role-based controls & activity audit.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      Manager
                    </span>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-900/90 text-white">
                      Admin
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border bg-white p-4">
                <p className="text-xs text-slate-600">
                  Tip: Use <span className="font-mono">admin@gmail.com</span> /{" "}
                  <span className="font-mono">123</span> to explore the panel (demo).
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Larger Login Card */}
          <Card className="w-full max-w-xl mx-auto shadow-2xl rounded-3xl border-slate-200/80">
            <CardHeader className="space-y-3 pt-8">
              <div className="flex flex-col items-center gap-3">
                <img
                  src="/logo1 (2).svg"
                  alt="TOM Logo"
                  className="h-14 w-auto"
                  draggable="false"
                />
                <div className="text-center">
                  <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                    TOM Admin
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sign in to manage Taste of Madurai
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-2">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[15px]">User ID</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={18} />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@gmail.com"
                      className="h-12 pl-10 text-[15px] rounded-xl"
                      value={userid}
                      onChange={(e) => setUserid(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[15px]">Password</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </span>
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pl-10 pr-12 text-[15px] rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-sm text-slate-700 hover:underline"
                    title="Forgot password"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold rounded-xl bg-[#FF5200] hover:bg-[#e64900]"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? "Signing in…" : "Login"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pb-8">
              <div className="rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Chef’s Note:</span>{" "}
                Add a “Today’s Special” every evening for the dinner crowd.
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                By continuing, you agree to our{" "}
                <a href="#" className="underline hover:text-slate-700">Terms</a> and{" "}
                <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-2 text-sm text-slate-600">
          <div className="h-px w-48 bg-slate-200" />
          <p>
            © {new Date().getFullYear()} Taste of Madurai (TOM) • Crafted with{" "}
            <span className="text-[#FF5200]">♥</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
