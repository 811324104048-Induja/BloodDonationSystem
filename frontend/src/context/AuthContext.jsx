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

  const login = async (email, password) => {

    const data = await authService.login({
      email,
      password
    });

    console.log(
      "AuthContext login response:",
      data
    );

    if (!data || !data.user) {
      throw new Error(
        "Invalid login response."
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