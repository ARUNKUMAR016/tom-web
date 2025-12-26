// src/pages/Home.jsx
import React, { Suspense, lazy } from "react";
import HeroSection from "./HeroSection";

const ContentSection = lazy(() => import("./ContentSection"));
const ChefsRecommended = lazy(() => import("./ChefsRecommended3D"));
const FeedbackPopup = lazy(() => import("./Feedback"));
const Testimonials = lazy(() => import("./Testimonials"));
const VisualGallery = lazy(() => import("./VisualGallery"));
const SpecialOffers = lazy(() => import("./SpecialOffers"));
const LocationHours = lazy(() => import("./LocationHours"));
const Newsletter = lazy(() => import("./Newsletter"));

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Lazy-load below-the-fold content */}
      <Suspense
        fallback={
          <div className="h-40 flex items-center justify-center text-[#728175] font-cutive">
            Loading sections...
          </div>
        }
      >
        <ContentSection />
        <ChefsRecommended />
        <FeedbackPopup />
        <Testimonials />
        <SpecialOffers />
        <LocationHours />
        <Newsletter />
        <VisualGallery />
      </Suspense>
    </>
  );
}
