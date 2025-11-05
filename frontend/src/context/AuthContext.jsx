import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => 
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access") || null
  );

  const login = async (email, password) => {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", { email, password });
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setAccessToken(res.data.access);
    setUser(res.data.user);
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
