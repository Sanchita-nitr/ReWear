"use client";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  // On mount, get token from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
    setLoading(false); // Mark as loaded
  }, []);

  // Fetch user whenever token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        setToken(null);
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  // Don't render children until loading is done
  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};