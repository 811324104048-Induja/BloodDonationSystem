import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {

    // Don't attach old JWT to authentication requests
    const isAuthRequest =
      config.url === "/auth/login" ||
      config.url === "/auth/signup" ||
      config.url === "/auth/verify-otp";

    if (!isAuthRequest) {

      const token =
        localStorage.getItem("token");

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;