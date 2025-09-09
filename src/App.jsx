// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout"; // create this wrapper
import Home from "./pages/website/Home";
import MenuPage from "./pages/website/MenuPage";
import Admin from "./pages/Admin/Admin";       // login page
import AdminHome from "./pages/Admin/AdminHome";
import FoodItem from "./pages/Admin/FoodItem";
import AllItems from "./pages/Admin/AllItems";
import ItemDetail from "./pages/website/ItemDetail";
import Dashboard from "./pages/Admin/Dashboard";
function PrivateRoute({ children }) {
  const user = localStorage.getItem("tom_admin_user");
  return user ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public site (has public Header/Footer) */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="menu" element={<MenuPage />} />
        {/* any other public pages */}
      </Route>

      {/* Admin login (no public header) */}
      <Route path="/admin" element={<Admin />} />

      {/* Admin app (own layout; guarded) */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        {/* <Route path="home" element={<AdminHome />} /> */}
        <Route path="home" element={<Dashboard />} />
        <Route path="items" element={<AllItems />} />
        <Route path="items/new" element={<FoodItem />} />
        <Route path="items/:id" element={<ItemDetail />} />
      </Route>
    </Routes>
  );
}
