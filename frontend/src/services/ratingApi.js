import api from './api';

export const ratingApi = {
  addReview: async (reviewData) => {
    return api.post('/rating/add', reviewData);
  },

  getMessReviews: async (messId) => {
    return api.get(`/rating/mess/${messId}`);
  }
};
