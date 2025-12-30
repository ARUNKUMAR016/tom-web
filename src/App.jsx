// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "@/components/Loader"; // add a small spinner or skeleton here

// ✅ Lazy-load all pages to reduce initial bundle size
const SiteLayout = lazy(() => import("./layouts/SiteLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));

const Home = lazy(() => import("./pages/website/Home"));
const MenuPage = lazy(() => import("./pages/website/MenuPage"));
const ItemDetail = lazy(() => import("./pages/website/ItemDetail"));

const Admin = lazy(() => import("./pages/Admin/Admin")); // login
const AdminHome = lazy(() => import("./pages/Admin/AdminHome"));
const AllItems = lazy(() => import("./pages/Admin/AllItems"));
const FoodItem = lazy(() => import("./pages/Admin/FoodItem"));
const Settings = lazy(() => import("./pages/Admin/Settings"));
const Moments = lazy(() => import("./pages/Admin/Moments"));
const Reviews = lazy(() => import("./pages/Admin/Reviews"));
const Offers = lazy(() => import("./pages/Admin/Offers")); // Fixed case

/* ---------------- Private Route Wrapper ---------------- */
function PrivateRoute({ children }) {
  const user = localStorage.getItem("tom_admin_user");
  return user ? children : <Navigate to="/admin" replace />;
}

/* ---------------- Main App ---------------- */
export default function App() {
  return (
    <Suspense fallback={<FullPageFallback />}>
      <Routes>
        {/* 🌿 Public site (Header/Footer from SiteLayout) */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="menu/:id" element={<ItemDetail />} />
          {/* add other public routes here */}
        </Route>

        {/* 🔐 Admin login (no layout) */}
        <Route path="/admin" element={<Admin />} />

        {/* 🧭 Admin dashboard (guarded + own layout) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<AdminHome />} />
          <Route path="items" element={<AllItems />} />
          <Route path="items/new" element={<FoodItem />} />
          <Route path="items/:id" element={<ItemDetail />} />
          <Route path="offers" element={<Offers />} />
          <Route path="moments" element={<Moments />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 🌐 Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

/* ---------------- Fallback Loader ---------------- */
function FullPageFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F8F4EC]">
      <Loader />
      <p className="ml-2 font-cutive text-[#728175]">
        {useTranslation().t("common.loading")}
      </p>
    </div>
  );
}
