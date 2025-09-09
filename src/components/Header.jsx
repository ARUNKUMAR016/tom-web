import React from "react";
import { NavLink, Link } from "react-router-dom";

const active =
  "relative text-[#253428] font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-6 after:rounded-full after:bg-[#728175] transition-colors";
const base =
  "text-[#253428]/80 hover:text-[#253428] transition-colors";


const Header = () => {
  return (
    <header className="flex justify-between items-center py-6 px-10 bg-[#CDBF9C]/20 shadow-sm">
      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo1 (2).svg"
            alt="Taste of Madurai Logo"
            className="h-10 w-10 object-contain"
            style={{
              filter:
                "invert(15%) sepia(10%) saturate(900%) hue-rotate(120deg) brightness(95%) contrast(90%)",
            }}
          />
          <div className="cutive-font text-2xl font-bold text-[#253428]">
            <span>Taste of Madurai</span>
            <span className="text-[#728175]">.</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav>
        <ul className="hidden md:flex space-x-6 text-sm cutive-font">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? active : base)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Menu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kki"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Order Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <a
              href="https://www.instagram.com/taste_ofmadurai"
              target="_blank"
              rel="noopener noreferrer"
              className={base}
            >
              Follow Us
            </a>
          </li>
        </ul>
      </nav>

      {/* Button */}
      <div className="cutive-font bg-[#253428] border border-[#728175]/40 text-[#CDBF9C] font-bold px-4 py-2 rounded-full text-sm shadow-sm">
        Sat & Sun · 10:00 – 19:00
      </div>
    </header>
  );
};

export default Header;
