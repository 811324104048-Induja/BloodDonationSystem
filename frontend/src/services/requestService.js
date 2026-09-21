import api from "./api";

const requestService = {

  // Create a new blood request
  createRequest: async (data) => {

    const response = await api.post(
      "/blood-requests",
      data
    );

    return response.data;
  },

  // Get all requests of logged-in patient
  getMyRequests: async () => {

    const response = await api.get(
      "/blood-requests/my-requests"
    );

    return response.data;
  },

  // Get one blood request
  getRequestById: async (id) => {

    const response = await api.get(
      `/blood-requests/${id}`
    );

    return response.data;
  },

  // Cancel blood request
  cancelRequest: async (id) => {

    const response = await api.put(
      `/blood-requests/${id}/cancel`
    );

    return response.data;
  },

  // Accept matched donor
  acceptMatch: async (matchId) => {

    const response = await api.patch(
      `/matches/${matchId}/accept`
    );

    return response.data;
  }
};

export default requestService;