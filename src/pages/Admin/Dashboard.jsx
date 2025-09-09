// src/pages/Admin/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle, Package, Pencil, ClipboardList, Shield, BarChart3, Settings,
} from "lucide-react";

export default function Dashboard() {
  const tiles = [
    { label: "Add Item",  desc: "Create a new menu/stock item", to: "/admin/items/new",  Icon: PlusCircle },
    { label: "All Items", desc: "Browse & manage items",        to: "/admin/items",      Icon: Package },
    { label: "Edit Web",  desc: "Update timings & the motto",   to: "/admin/editmenu",   Icon: Pencil },
    { label: "Orders",    desc: "View live & past orders",      to: "/admin/orders",     Icon: ClipboardList },
    { label: "Users & Roles", desc: "Admin / staff access",     to: "/admin/users",      Icon: Shield },
    { label: "Reports",   desc: "Sales & inventory insights",   to: "/admin/reports",    Icon: BarChart3 },
    { label: "Settings",  desc: "Store, taxes, printers…",      to: "/admin/settings",   Icon: Settings },
  ];

  // Inline brand vars to keep consistent with AdminLayout
  const brand = {
    deep: "#253428",
    sage: "#728175",
    sand: "#CDBF9C",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: brand.deep }}
      >
        Dashboard
      </h1>

      <section
        aria-label="Admin quick links"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {tiles.map(({ label, desc, to, Icon }) => (
          <Link
            key={label}
            to={to}
            className="group rounded-xl border p-4 shadow-sm transition
                       hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "#fff",
              borderColor: brand.sand,
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="rounded-lg p-2 border"
                style={{ backgroundColor: `${brand.sand}22`, borderColor: brand.sand }}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-105"
                      style={{ color: brand.deep }} />
              </div>
              <div>
                <h3 className="text-base font-semibold" style={{ color: brand.deep }}>
                  {label}
                </h3>
                <p className="mt-0.5 text-sm" style={{ color: "#475569" }}>
                  {desc}
                </p>
              </div>
            </div>

            {/* Accent underline */}
            <span
              className="mt-3 block h-0.5 w-0 transition-all group-hover:w-full"
              style={{ backgroundColor: brand.sage }}
            />
          </Link>
        ))}
      </section>
    </div>
  );
}
