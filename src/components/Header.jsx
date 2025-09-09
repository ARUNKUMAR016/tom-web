import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // icons

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/posts", label: "Posts" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/careers", label: "Careers" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl text-[#7A1F1F]">
          TOM
        </Link>

        {/* Desktop Nav */}
        <nav className="ml-auto hidden md:flex gap-6">
          {navItems.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                "text-sm transition-colors " +
                (isActive
                  ? "text-[#7A1F1F] font-semibold"
                  : "text-slate-700 hover:text-[#7A1F1F]")
              }
            >
              {i.label}
            </NavLink>
          ))}
        </nav>

        {/* Call to Action (always visible) */}
        <a
          href="tel:+46734991206"
          className="px-3 py-2 rounded-md bg-[#FF6B00] text-white text-sm ml-2"
        >
          Call to Order
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {navItems.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                "block text-sm " +
                (isActive
                  ? "text-[#7A1F1F] font-semibold"
                  : "text-slate-700 hover:text-[#7A1F1F]")
              }
            >
              {i.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;
