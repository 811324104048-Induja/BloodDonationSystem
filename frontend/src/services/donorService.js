import api from "./api";

const donorService = {
  getProfile: async () => {
    const response = await api.get("/donors/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/donors/profile", data);
    return response.data;
  },

  getDonationHistory: async () => {
    const response = await api.get("/donors/donations");
    return response.data;
  },

  updateAvailability: async (available) => {
    const response = await api.patch("/donors/availability", {
      available,
    });

    return response.data;
  },

  getMatchedRequests: async () => {
    const response = await api.get("/matches/donor");
    return response.data;
  },
};

export default donorService;