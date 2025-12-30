// src/pages/Admin/Reviews.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Star,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { getAllReviews, updateReview, deleteReview } from "../../api/reviewApi";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      toast.error(error.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFeatured = async (review) => {
    try {
      const updated = await updateReview(review._id, {
        isFeatured: !review.isFeatured,
      });
      setReviews((prev) =>
        prev.map((r) => (r._id === review._id ? updated : r))
      );
      toast.success(
        updated.isFeatured
          ? "Review featured on website"
          : "Review removed from website"
      );
    } catch (error) {
      toast.error(error.message || "Failed to update review");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-display uppercase tracking-tight">
              Customer Reviews
            </h1>
            <p className="text-sm text-brand-dark/40 font-medium">
              Manage customer feedback & feature testimonials
            </p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-brand-dark/5 shadow-sm">
          <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-2">
            Total Reviews
          </p>
          <p className="text-3xl font-bold text-brand-dark font-display">
            {reviews.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-brand-dark/5 shadow-sm">
          <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-2">
            Featured
          </p>
          <p className="text-3xl font-bold text-brand-secondary font-display">
            {reviews.filter((r) => r.isFeatured).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-brand-dark/5 shadow-sm">
          <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-2">
            Avg Rating
          </p>
          <p className="text-3xl font-bold text-brand-dark font-display flex items-center gap-2">
            {reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
              : "0.0"}
            <Star className="w-6 h-6 fill-brand-secondary text-brand-secondary" />
          </p>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-brand-dark/5 animate-pulse"
            >
              <div className="h-4 bg-brand-cream rounded w-1/4 mb-4" />
              <div className="h-3 bg-brand-cream rounded w-full mb-2" />
              <div className="h-3 bg-brand-cream rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-brand-dark/5">
          <MessageSquare className="h-16 w-16 text-brand-dark/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            No reviews yet
          </h3>
          <p className="text-brand-dark/40 text-sm">
            Customer reviews will appear here once submitted
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                review.isFeatured
                  ? "border-brand-secondary shadow-lg shadow-brand-secondary/10"
                  : "border-brand-dark/5 shadow-sm"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-brand-dark text-lg">
                      {review.name}
                    </h3>
                    {review.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-secondary/20 border border-brand-secondary/30 text-[10px] font-bold text-brand-secondary uppercase tracking-wider">
                        ⭐ FEATURED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-brand-secondary text-brand-secondary"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-brand-dark/40 ml-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-brand-dark/70 text-sm leading-relaxed mb-4">
                "{review.content}"
              </p>

              {/* Contact Info */}
              {(review.email || review.phone) && (
                <div className="flex flex-wrap gap-3 mb-4 text-xs text-brand-dark/40">
                  {review.email && <span>📧 {review.email}</span>}
                  {review.phone && <span>📱 {review.phone}</span>}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-brand-dark/5">
                <button
                  onClick={() => toggleFeatured(review)}
                  className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                    review.isFeatured
                      ? "bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20"
                      : "bg-brand-cream text-brand-dark/60 hover:bg-brand-primary hover:text-white"
                  }`}
                >
                  {review.isFeatured ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide from Website
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show on Website
                    </>
                  )}
                </button>
                <button
                  onClick={() => setDeleteConfirm(review._id)}
                  className="h-10 px-4 flex items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs uppercase tracking-widest transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">
              Delete Review?
            </h3>
            <p className="text-brand-dark/60 mb-6">
              This action cannot be undone. The review will be permanently
              deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-11 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-11 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
