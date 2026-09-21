import api from "./api";

const patientService = {

  // Get logged-in patient's profile
  getProfile: async () => {
    const response = await api.get("/patients/profile");
    return response.data;
  },

  // Update logged-in patient's profile
  updateProfile: async (data) => {
    const response = await api.put("/patients/profile", data);
    return response.data;
  }

};

export default patientService;