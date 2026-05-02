// src/components/LoadingSkeletons.jsx
import React from "react";

/**
 * Reusable skeleton components with shimmer gradient animation
 */

// Generic skeleton box with shimmer
export function Skeleton({ className = "", dark = false }) {
  return (
    <div
      className={`rounded-lg ${dark ? "skeleton-shimmer-dark" : "skeleton-shimmer"} ${className}`}
    />
  );
}

// Menu card skeleton
export function MenuCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-brand-dark/5">
      {/* Image skeleton */}
      <div className="aspect-[4/3] skeleton-shimmer rounded-[1.5rem] sm:rounded-[2rem] m-3 sm:m-4" />

      {/* Content skeleton */}
      <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-3">
        <div className="h-6 sm:h-8 skeleton-shimmer rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-3 sm:h-4 skeleton-shimmer rounded w-full" />
          <div className="h-3 sm:h-4 skeleton-shimmer rounded w-2/3" />
        </div>
        <div className="pt-4 border-t border-brand-dark/5 flex justify-between items-center">
          <div className="h-3 skeleton-shimmer rounded w-20" />
          <div className="h-9 sm:h-10 w-9 sm:w-10 skeleton-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Gallery moment skeleton
export function GalleryMomentSkeleton({ large = false }) {
  return (
    <div
      className={`rounded-2xl sm:rounded-3xl skeleton-shimmer ${
        large ? "md:col-span-2 md:row-span-2" : ""
      }`}
    />
  );
}

// Review card skeleton
export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-brand-dark/5">
      <div className="flex justify-between items-start mb-5 sm:mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 skeleton-shimmer rounded-2xl" />
        <div className="w-7 h-7 sm:w-8 sm:h-8 skeleton-shimmer rounded" />
      </div>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 skeleton-shimmer rounded" />
        ))}
      </div>
      <div className="space-y-2 mb-5 sm:mb-6">
        <div className="h-3.5 sm:h-4 skeleton-shimmer rounded w-full" />
        <div className="h-3.5 sm:h-4 skeleton-shimmer rounded w-full" />
        <div className="h-3.5 sm:h-4 skeleton-shimmer rounded w-3/4" />
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <div className="h-5 sm:h-6 skeleton-shimmer rounded w-28 sm:w-32" />
        <div className="h-3.5 sm:h-4 skeleton-shimmer rounded w-20 sm:w-24" />
      </div>
    </div>
  );
}

// Chef's pick card skeleton (dark)
export function ChefPickSkeleton() {
  return (
    <div className="flex-shrink-0 w-[85vw] sm:w-[420px] h-[500px] sm:h-[560px] rounded-[2rem] sm:rounded-[2.5rem] skeleton-shimmer-dark border border-white/10" />
  );
}

// Admin item card skeleton
export function AdminItemSkeleton() {
  return (
    <div className="rounded-3xl bg-white border border-brand-dark/5">
      <div className="h-48 sm:h-52 skeleton-shimmer rounded-t-3xl" />
      <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
        <div className="h-5 sm:h-6 skeleton-shimmer rounded w-2/3" />
        <div className="space-y-1.5 sm:space-y-2">
          <div className="h-3.5 sm:h-4 skeleton-shimmer rounded w-full" />
          <div className="h-3.5 sm:h-4 skeleton-shimmer rounded w-1/2" />
        </div>
        <div className="flex gap-2 pt-3 sm:pt-4">
          <div className="flex-1 h-10 sm:h-11 skeleton-shimmer rounded-xl" />
          <div className="h-10 sm:h-11 w-10 sm:w-11 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-brand-dark/5">
      <div className="w-10 h-10 sm:w-12 sm:h-12 skeleton-shimmer rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5 sm:space-y-2">
        <div className="h-3.5 sm:h-4 skeleton-shimmer rounded w-1/4" />
        <div className="h-3 sm:h-3 skeleton-shimmer rounded w-1/3" />
      </div>
      <div className="w-20 sm:w-24 h-7 sm:h-8 skeleton-shimmer rounded-lg shrink-0" />
    </div>
  );
}

// Loading grid wrapper
export function LoadingGrid({ count = 6, variant = "menu" }) {
  const SkeletonComponent =
    {
      menu: MenuCardSkeleton,
      gallery: GalleryMomentSkeleton,
      review: ReviewCardSkeleton,
      chefPick: ChefPickSkeleton,
      admin: AdminItemSkeleton,
    }[variant] || MenuCardSkeleton;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} large={i === 0 || i === 4} />
      ))}
    </div>
  );
}
