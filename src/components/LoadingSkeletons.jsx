// src/components/LoadingSkeletons.jsx
import React from "react";

/**
 * Reusable skeleton components for consistent loading states
 */

// Generic skeleton box
export function Skeleton({ className = "", animate = true }) {
  return (
    <div
      className={`bg-brand-cream rounded-lg ${
        animate ? "animate-pulse" : ""
      } ${className}`}
    />
  );
}

// Menu card skeleton
export function MenuCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-brand-dark/5 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[1/1] bg-brand-cream" />

      {/* Content skeleton */}
      <div className="p-8 space-y-4">
        <div className="h-8 bg-brand-cream rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-brand-cream rounded w-full" />
          <div className="h-4 bg-brand-cream rounded w-2/3" />
        </div>
        <div className="pt-6 border-t border-brand-dark/5 flex justify-between">
          <div className="h-4 bg-brand-cream rounded w-24" />
          <div className="h-10 w-10 bg-brand-cream rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Gallery moment skeleton
export function GalleryMomentSkeleton({ large = false }) {
  return (
    <div
      className={`bg-brand-cream rounded-3xl animate-pulse ${
        large ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"
      }`}
    />
  );
}

// Review card skeleton
export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-brand-cream rounded-2xl" />
        <div className="w-8 h-8 bg-brand-cream rounded" />
      </div>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-brand-cream rounded" />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-brand-cream rounded w-full" />
        <div className="h-4 bg-brand-cream rounded w-full" />
        <div className="h-4 bg-brand-cream rounded w-3/4" />
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-brand-cream rounded w-32" />
        <div className="h-4 bg-brand-cream rounded w-24" />
      </div>
    </div>
  );
}

// Chef's pick card skeleton (Dark mode compatible)
export function ChefPickSkeleton() {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[400px] h-[500px] rounded-[2rem] bg-white/5 animate-pulse border border-white/10">
      {/* Image placeholder */}
      <div className="h-full w-full bg-white/5" />
    </div>
  );
}

// Admin item card skeleton
export function AdminItemSkeleton() {
  return (
    <div className="rounded-3xl bg-white border border-brand-dark/5 animate-pulse">
      <div className="h-52 bg-brand-cream" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-brand-cream rounded w-2/3" />
        <div className="space-y-2">
          <div className="h-4 bg-brand-cream rounded w-full" />
          <div className="h-4 bg-brand-cream rounded w-1/2" />
        </div>
        <div className="flex gap-2 pt-4">
          <div className="flex-1 h-11 bg-brand-cream rounded-xl" />
          <div className="h-11 w-11 bg-brand-cream rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-brand-dark/5 animate-pulse">
      <div className="w-12 h-12 bg-brand-cream rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-brand-cream rounded w-1/4" />
        <div className="h-3 bg-brand-cream rounded w-1/3" />
      </div>
      <div className="w-24 h-8 bg-brand-cream rounded-lg" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} large={i === 0 || i === 4} />
      ))}
    </div>
  );
}
