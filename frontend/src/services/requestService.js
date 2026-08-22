import api from "./api";

const requestService = {
  createRequest: async (data) => {
    const response = await api.post("/requests", data);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get("/requests/my");
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  cancelRequest: async (id) => {
    const response = await api.patch(`/requests/${id}/cancel`);
    return response.data;
  },

  acceptMatch: async (matchId) => {
    const response = await api.patch(`/matches/${matchId}/accept`);
    return response.data;
  },
};

export default requestService;