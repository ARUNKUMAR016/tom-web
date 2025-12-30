import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackVisit } from "../api/visitApi";

export default function SiteLayout() {
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited_today");
    if (!hasVisited) {
      trackVisit();
      sessionStorage.setItem("visited_today", "true");
    }
  }, []);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
