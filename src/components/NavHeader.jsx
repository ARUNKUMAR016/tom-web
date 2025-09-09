import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function NavHeader({
  title = "TOM Admin",
  subtitle = "Taste of Madurai — Control Panel",
  right = null,
  showLogout = true,
}) {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="bg-gradient-to-r from-[#FF5200] via-[#ff6a1a] to-[#ff8a3d] text-white">
        <div className="px-5 py-6">
          <header className="flex items-center justify-between">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-3">
              {/* Logo from public */}
              <img
                src="/logo1%20(2).svg"
                alt="TOM Logo"
                className="h-12 w-12     p-1"
                style={{ filter: "invert(1) brightness(200%)" }} // makes it white
              />

              <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-white/85 text-sm">{subtitle}</p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              {right}
              {showLogout && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              )}
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}
