import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import FoodItem from "./pages/FoodItem";
import AdminHome from "./pages/AdminHome";
import AllItems from "./pages/AllItems";
import ItemDetail from "./pages/ItemDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/fooditems" element={<FoodItem />} />
      <Route path="/allitems" element={<AllItems />} />
      <Route path="/items/:id" element={<ItemDetail />} />
    </Routes>
  );
}

export default App;
