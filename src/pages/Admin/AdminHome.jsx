// src/pages/AdminHome.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle, Package, Pencil, ClipboardList, Shield, BarChart3, Settings,
} from "lucide-react";
import NavHeader from "../../components/NavHeader";

export default function AdminHome() {
 const tiles = [
  { 
    label: "Add Item",  
    desc: "Create a new menu/stock item", 
    to: "/admin/items/new",  
    Icon: PlusCircle 
  },
  { 
    label: "All Items", 
    desc: "Browse & manage items",        
    to: "/admin/items",     
    Icon: Package 
  },
  { 
    label: "Edit Web", 
    desc: "Update Timings and Customize the Moto", 
    to: "/admin/editmenu", 
    Icon: Pencil 
  },
  { 
    label: "Orders",    
    desc: "View live & past orders",      
    to: "/admin/orders",     
    Icon: ClipboardList 
  },
  { 
    label: "Users & Roles", 
    desc: "Admin/staff access control", 
    to: "/admin/users", 
    Icon: Shield 
  },
  { 
    label: "Reports",   
    desc: "Sales & inventory insights",   
    to: "/admin/reports",    
    Icon: BarChart3 
  },
  { 
    label: "Settings",  
    desc: "Store, taxes, printers…",      
    to: "/admin/settings",   
    Icon: Settings 
  },
];


  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <NavHeader title="TOM Admin" subtitle="Taste of Madurai — Control Panel" />

      <div className="px-5 py-6 bg-[#fff7ed]">
        <section
          aria-label="Admin quick links"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {tiles.map(({ label, desc, to, Icon }) => (
            <Link
              key={label}
              to={to}
              className="group rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF5200]/40"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-orange-100 bg-orange-50 p-2">
                  <Icon className="h-5 w-5 text-[#FF5200] group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0f172a]">{label}</h3>
                  <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
                </div>
              </div>
              <span className="mt-3 block h-0.5 w-0 bg-[#FF5200]/70 transition-all group-hover:w-full" />
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <h4 className="text-sm font-semibold text-[#9a3412]">Quick Tips</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-[#9a3412]/90">
            <li>Use <span className="font-medium">Users & Roles</span> to grant/revoke full access.</li>
            <li>Check <span className="font-medium">Reports</span> for daily sales & low-stock alerts.</li>
            <li>Keep <span className="font-medium">Settings</span> updated (tax rates, printer, hours).</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
