import api from "./api";

const matchService = {
  getMatchesForRequest: async (requestId) => {
    const response = await api.get(`/matches/request/${requestId}`);
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