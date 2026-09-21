import api from "./api";

const matchService = {
  // Get matched donors for a blood request
  getMatchesForRequest: async (requestId) => {
    const response = await api.get(`/matches/request/${requestId}`);
    return response.data;
  },

  // Generate matches for a blood request
  generateMatches: async (requestId) => {
    const response = await api.post(`/matches/generate/${requestId}`);
    return response.data;
  },

  // Get matches for a donor
  getDonorMatches: async (donorId) => {
    const response = await api.get(`/matches/donor/${donorId}`);
    return response.data;
  },

  // Accept a match
  acceptMatch: async (matchId) => {
    const response = await api.patch(`/matches/${matchId}/accept`);
    return response.data;
  },

  // Reject a match
  rejectMatch: async (matchId) => {
    const response = await api.patch(`/matches/${matchId}/reject`);
    return response.data;
  },
};

export default matchService;