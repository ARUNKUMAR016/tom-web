import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  Settings,
  Menu,
  ImageIcon,
  MessageSquare,
  Tag,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    try {
      // Clear all auth related keys
      localStorage.removeItem("tom_admin_user");

      // Cleanup any legacy keys if they exist
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.error("Logout cleanup failed", e);
    }
    // Replace history entry to prevent back-button navigation
    navigate("/admin", { replace: true });
  };

  const navItems = [
    { path: "/admin/home", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/items", label: "Menu Items", icon: UtensilsCrossed },
    { path: "/admin/offers", label: "Offers", icon: Tag },
    { path: "/admin/moments", label: "Gallery", icon: ImageIcon },
    { path: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-brand-cream overflow-hidden font-sans text-brand-dark selection:bg-brand-primary/20">
      {/* Sidebar - Dark & Premium */}
      <aside className="w-72 bg-brand-dark text-white flex flex-col z-20 shadow-xl">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center font-display font-bold text-white shadow-lg">
              T
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-wide uppercase">
                TOM Admin
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                Command Center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "text-white bg-brand-primary shadow-lg shadow-brand-primary/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  location.pathname === item.path
                    ? "text-white"
                    : "text-white/40 group-hover:text-white"
                }`}
              />
              <span className="relative z-10">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-white font-display font-bold shadow-md border-2 border-brand-dark">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin User</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-white/50 font-medium">Online</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all
                     bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 border border-white/5 hover:border-red-500/30"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-brand-cream">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-dark/5 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4 text-brand-dark/40 text-sm font-medium">
            <span className="hover:text-brand-dark transition-colors">
              Admin
            </span>
            <span>/</span>
            <span className="capitalize text-brand-primary font-bold">
              {location.pathname.split("/").pop()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-green-100/50 text-green-700 text-xs font-bold border border-green-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Online
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth relative z-0">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
