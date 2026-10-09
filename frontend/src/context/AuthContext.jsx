import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const currentUser =
      authService.getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }

    setLoading(false);

  }, []);

  // STEP 1: Email + Password
  const login = async (email, password) => {

    const data = await authService.login({
      email,
      password
    });

    console.log(
      "AuthContext login response:",
      data
    );

    // New OTP-based login
    if (data && data.otpRequired) {
      return data;
    }

    // Normal login fallback
    if (!data || !data.user) {
      throw new Error(
        "Invalid login response."
      );
    }

    setUser(data.user);

    return data;
  };

  // STEP 2: OTP verification
  const verifyOtp = async (email, otp) => {

    const data = await authService.verifyOtp({
      email,
      otp
    });

    console.log(
      "AuthContext OTP response:",
      data
    );

    if (!data || !data.token || !data.user) {
      throw new Error(
        "Invalid OTP verification response."
      );
    }

    setUser(data.user);

    return data;
  };

  const signup = async (formData) => {

    const data =
      await authService.signup(formData);

    return data;
  };

  const logout = () => {

    authService.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        verifyOtp,
        signup,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};