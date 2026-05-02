// src/pages/Home.jsx
import React, { Suspense, lazy } from "react";
import HeroSection from "./HeroSection";
import { useTranslation } from "react-i18next";

const ContentSection = lazy(() => import("./ContentSection"));
const ChefsRecommended = lazy(() => import("./ChefsRecommended"));
const FeedbackPopup = lazy(() => import("./Feedback"));
const Testimonials = lazy(() => import("./Testimonials"));
const VisualGallery = lazy(() => import("./VisualGallery"));
const LocationHours = lazy(() => import("./LocationHours"));
const Newsletter = lazy(() => import("./Newsletter"));

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <HeroSection />

      {/* Lazy-load below-the-fold content */}
      <Suspense
        fallback={
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-24 space-y-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-4 skeleton-shimmer rounded-full" />
              <div className="w-72 sm:w-[400px] h-10 sm:h-16 skeleton-shimmer rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="w-full h-80 sm:h-[450px] skeleton-shimmer rounded-[2.5rem]" />
               <div className="w-full h-80 sm:h-[450px] skeleton-shimmer rounded-[2.5rem]" />
            </div>
          </div>
        }
      >
        <ContentSection />
        <ChefsRecommended />
        <FeedbackPopup />
        <Testimonials />
        <LocationHours />
        <Newsletter />
        <VisualGallery />
      </Suspense>
    </>
  );
}
