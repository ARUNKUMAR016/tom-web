import { jsonFetch, BASE } from "./foodapi";

// Public: Submit a review
export const createReview = (payload) => {
  return jsonFetch(`${BASE}/api/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Public: Get featured reviews for website display
export const getFeaturedReviews = () => {
  return jsonFetch(`${BASE}/api/reviews/featured`);
};

// Admin: Get all reviews
export const getAllReviews = () => {
  return jsonFetch(`${BASE}/api/reviews/all`);
};

// Admin: Update review (toggle featured, etc.)
export const updateReview = (id, updates) => {
  return jsonFetch(`${BASE}/api/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

// Admin: Delete review
export const deleteReview = (id) => {
  return jsonFetch(`${BASE}/api/reviews/${id}`, {
    method: "DELETE",
  });
};
