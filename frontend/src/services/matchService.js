import api from "./api";

const matchService = {

  getMatchesForRequest: async (requestId) => {
    const response = await api.get(`/matches/request/${requestId}`);
    return response.data;
  },

  generateMatches: async (requestId) => {
    const response = await api.post(`/matches/generate/${requestId}`);
    return response.data;
  },

  getDonorMatches: async (donorId) => {
    const response = await api.get(`/matches/donor/${donorId}`);
    return response.data;
  },

  // Get matches for currently logged-in donor
  getMyMatches: async () => {
    const response = await api.get("/matches/my-matches");
    return response.data;
  },

  acceptMatch: async (matchId) => {
    const response = await api.patch(`/matches/${matchId}/accept`);
    return response.data;
  },

  rejectMatch: async (matchId) => {
    const response = await api.patch(`/matches/${matchId}/reject`);
    return response.data;
  },
};

export default matchService;