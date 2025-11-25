import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Initializing User from Storage:", storedUser);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() => {
    const storedToken = localStorage.getItem("access");
    console.log("Initializing Token from Storage:", storedToken);
    return storedToken || null;
  });

  // Setup axios interceptor for automatic token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // If successful, just return the response
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
              // No refresh token, logout
              logout();
              return Promise.reject(error);
            }

            // Try to refresh the token
            const res = await axios.post("http://127.0.0.1:8000/api/auth/token/refresh/", {
              refresh: refreshToken
            });

            // Update the access token
            const newAccessToken = res.data.access;
            localStorage.setItem("access", newAccessToken);
            setAccessToken(newAccessToken);

            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            console.error("Token refresh failed:", refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", { email, password });
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setAccessToken(res.data.access);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
