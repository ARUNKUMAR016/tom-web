// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Adjust these to your auth storage keys
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}
    navigate("/admin");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        // Brand theme variables
        // Deep green, Sage, Sand
        // Use via var(--brand-*)
        ["--brand-deep"]: "#253428",
        ["--brand-sage"]: "#728175",
        ["--brand-sand"]: "#CDBF9C",
      }}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--brand-deep)] text-[var(--brand-sand)] p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="font-bold text-lg tracking-wide">TOM Admin</h2>
          <p className="text-xs opacity-80">Control Panel</p>
        </div>

        <nav className="space-y-1 text-sm flex-1">
          <NavLink
            to="/admin/home"
            className={({ isActive }) =>
              [
                "block rounded-md px-3 py-2 transition",
                isActive
                  ? "bg-[var(--brand-sage)] text-[var(--brand-deep)] font-medium"
                  : "hover:bg-white/5",
              ].join(" ")
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/items"
            className={({ isActive }) =>
              [
                "block rounded-md px-3 py-2 transition",
                isActive
                  ? "bg-[var(--brand-sage)] text-[var(--brand-deep)] font-medium"
                  : "hover:bg-white/5",
              ].join(" ")
            }
          >
            Items
          </NavLink>

          {/* Add more links as needed */}
          {/* <NavLink to="/admin/orders" ...>Orders</NavLink> */}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition
                     bg-white/10 hover:bg-white/15 text-[var(--brand-sand)]"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      {/* Content area with top bar */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header
          className="h-14 flex items-center justify-between px-6 border-b"
          style={{ backgroundColor: "var(--brand-sand)", borderColor: "#e6dec7" }}
        >
          <div className="text-sm text-[color:var(--brand-deep)]/80">
            Admin &nbsp;›&nbsp; <span className="font-medium">Console</span>
          </div>

          {/* Optional quick action or avatar space */}
          <div className="text-xs text-[color:var(--brand-deep)]/70">
            Welcome back
          </div>
        </header>

        {/* Page body */}
        <main
          className="flex-1 p-6"
          style={{ background: "linear-gradient(180deg, #f7f3e6 0%, #efe8d4 100%)" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
