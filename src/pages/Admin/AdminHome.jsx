import React from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Package,
  Pencil,
  ClipboardList,
  Shield,
  BarChart3,
  Settings,
  ArrowRight,
} from "lucide-react";

export default function AdminHome() {
  const tiles = [
    {
      label: "Add Item",
      desc: "Create a new menu/stock item",
      to: "/admin/items/new",
      Icon: PlusCircle,
      color: "text-brand-primary",
    },
    {
      label: "All Items",
      desc: "Browse & manage items",
      to: "/admin/items",
      Icon: Package,
      color: "text-brand-secondary",
    },
    {
      label: "Edit Web",
      desc: "Update Timings and Customize the Moto",
      to: "/admin/editmenu",
      Icon: Pencil,
      color: "text-brand-dark",
    },
    {
      label: "Orders",
      desc: "View live & past orders",
      to: "/admin/orders",
      Icon: ClipboardList,
      color: "text-blue-600",
    },
    {
      label: "Users & Roles",
      desc: "Admin/staff access control",
      to: "/admin/users",
      Icon: Shield,
      color: "text-purple-600",
    },
    {
      label: "Reports",
      desc: "Sales & inventory insights",
      to: "/admin/reports",
      Icon: BarChart3,
      color: "text-green-600",
    },
    {
      label: "Settings",
      desc: "Store, taxes, printers…",
      to: "/admin/settings",
      Icon: Settings,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-brand-dark uppercase tracking-wide mb-2">
          Dashboard
        </h1>
        <p className="text-brand-dark/60 font-medium">
          Welcome back, get detailed analytics and manage your restaurant.
        </p>
      </div>

      <div className="space-y-8">
        <section
          aria-label="Admin quick links"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {tiles.map(({ label, desc, to, Icon, color }) => (
            <Link
              key={label}
              to={to}
              className="group relative overflow-hidden rounded-[2rem] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-brand-dark/5"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>

                  <h3 className="text-xl font-display font-bold text-brand-dark uppercase tracking-wide group-hover:text-brand-primary transition-colors">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm text-brand-dark/50 font-medium leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-brand-dark/40 text-sm font-bold uppercase tracking-widest group-hover:text-brand-primary transition-colors">
                  <span>Manage</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-[2.5rem] bg-white p-8 sm:p-10 border border-brand-dark/5 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-brand-secondary/10">
              <BarChart3 className="w-5 h-5 text-brand-secondary" />
            </div>
            <h4 className="text-lg font-display font-bold text-brand-dark uppercase tracking-wide">
              Quick Tips
            </h4>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-brand-cream/50">
              <h5 className="font-bold text-brand-dark mb-2">User Access</h5>
              <p className="text-sm text-brand-dark/60 mb-3">
                control who sees what.
              </p>
              <Link
                to="/admin/users"
                className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:underline"
              >
                Manage Users
              </Link>
            </div>
            <div className="p-6 rounded-3xl bg-brand-cream/50">
              <h5 className="font-bold text-brand-dark mb-2">Daily Sales</h5>
              <p className="text-sm text-brand-dark/60 mb-3">
                Check EOD reports daily.
              </p>
              <Link
                to="/admin/reports"
                className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:underline"
              >
                View Reports
              </Link>
            </div>
            <div className="p-6 rounded-3xl bg-brand-cream/50">
              <h5 className="font-bold text-brand-dark mb-2">Store Settings</h5>
              <p className="text-sm text-brand-dark/60 mb-3">
                Update hours & tax info.
              </p>
              <Link
                to="/admin/settings"
                className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:underline"
              >
                Go to Settings
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
