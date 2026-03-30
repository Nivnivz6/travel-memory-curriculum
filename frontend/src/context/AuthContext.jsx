import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const register = useCallback((data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);

    const user = { id: data._id, username: data.username, email: data.email };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsLoading(false);
    setIsAuthenticated(true);
  }, []);

  const login = useCallback((data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);

    const user = { id: data._id, username: data.username, email: data.email };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsLoading(false);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) setToken(token);
    if (user) setUser(JSON.parse(user));
    if (token && user) setIsAuthenticated(true);
  }, []);

  return <AuthContext.Provider value={{ user, token, login, logout, register, setIsLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthContext;
