import api from "./api";

const authService = {

  // STEP 1: Email + Password
  login: async (data) => {

    const response =
      await api.post("/auth/login", data);

    // IMPORTANT:
    // First login only sends OTP.
    // JWT will be saved after OTP verification.

    if (response.data.token) {
      localStorage.setItem(
        "token",
        response.data.token
      );
    }

    if (response.data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    }

    return response.data;
  },


  // STEP 2: OTP Verification
  verifyOtp: async (data) => {

    const response =
      await api.post(
        "/auth/verify-otp",
        data
      );

    // JWT is returned only after
    // successful OTP verification.

    if (response.data.token) {
      localStorage.setItem(
        "token",
        response.data.token
      );
    }

    if (response.data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    }

    return response.data;
  },


  // SIGNUP
  signup: async (data) => {

    const response =
      await api.post(
        "/auth/signup",
        data
      );

    return response.data;
  },


  // LOGOUT
  logout: () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },


  // GET CURRENT USER
  getCurrentUser: () => {

    const user =
      localStorage.getItem("user");

    return user
      ? JSON.parse(user)
      : null;
  },


  // CHECK AUTHENTICATION
  isAuthenticated: () => {

    return !!localStorage.getItem("token");
  }
};

export default authService;