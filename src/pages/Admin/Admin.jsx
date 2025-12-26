import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
    // Simple email check
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
      toast.error(msg);
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 800)); // demo delay
      // Hardcoded credentials for demo
      if (userid === "admin@gmail.com" && password === "123") {
        if (remember) {
          localStorage.setItem("tom_admin_user", userid);
        } else {
          // If not remembering, we still need to set it for the session
          // For now, let's just set it. In a real app we'd use sessionStorage or similar.
          localStorage.setItem("tom_admin_user", userid);
        }
        toast.success("Welcome back, Chef!");
        navigate("/admin/home", { replace: true });
      } else {
        setError("Invalid credentials. Try admin@gmail.com / 123");
        toast.error("Invalid credentials");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-brand-dark">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md px-4 relative z-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-6 shadow-2xl p-4">
            <img
              src="/logo1.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tight mb-2">
            Admin <span className="text-brand-primary">Portal</span>
          </h1>
          <p className="text-white/60 font-sans text-sm">
            Secure access for Taste of Madurai staff
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-widest ml-1">
                User ID
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 group-focus-within/input:text-brand-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full bg-brand-cream/50 border border-brand-dark/5 rounded-xl py-4 pl-12 pr-4 text-brand-dark placeholder-brand-dark/30 font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 group-focus-within/input:text-brand-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-cream/50 border border-brand-dark/5 rounded-xl py-4 pl-12 pr-12 text-brand-dark placeholder-brand-dark/30 font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/30 hover:text-brand-dark transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    remember
                      ? "bg-brand-primary border-brand-primary"
                      : "border-brand-dark/20 group-hover:border-brand-primary"
                  }`}
                >
                  {remember && (
                    <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="hidden"
                />
                <span className="text-brand-dark/60 font-medium group-hover:text-brand-dark transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-brand-primary font-bold hover:text-brand-secondary transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {submitting ? (
                "Signing in..."
              ) : (
                <>
                  Access Dashboard <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-brand-dark/5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-dark/5 text-xs text-brand-dark/40 font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3 text-brand-primary" />
              <span>Secure System v2.1</span>
            </div>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-8 font-medium">
          &copy; {new Date().getFullYear()} Taste of Madurai. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Admin;
