import "./i18n"; // <-- MUST be imported before App renders

// 🚨 FORCE UNREGISTER ANY OLD SERVICE WORKERS (Fixes "pwa-react-app" cache issue)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      console.log("Unregistering old service worker:", registration);
      registration.unregister();
    }
  });
}

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";
import "tw-animate-css";

// Fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/700.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" richColors closeButton />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
