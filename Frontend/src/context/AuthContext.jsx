import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, Info, XCircle } from 'lucide-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

  const apiCall = async (endpoint, data, successMessage, Icon = CheckCircle) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      setLoading(false);

      if (!response.ok || result.error) {
        throw new Error(result.error || result.detail || "Something went wrong.");
      }

      if (successMessage && result.message) {
        toast.success(result.message || successMessage, {
          icon: <Icon className={Icon === Info ? "text-primary-500" : "text-emerald-500"} size={20} />,
        });
      }
      return result;
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Network error. Please try again.", {
        icon: <XCircle className="text-rose-500" size={20} />,
      });
      throw error;
    }
  };

  const login = async (credentials) => {
    const result = await apiCall('/login', credentials, "Login successful!", CheckCircle);
    setUser({ email: result.user?.email || credentials.email, name: result.user?.name || "User" });
    localStorage.setItem('user', JSON.stringify({ email: credentials.email }));
    return result;
  };

  const register = async (userData) => {
    return await apiCall('/register', userData, "Registration successful!", CheckCircle);
  };

  const verifyOTP = async (data) => {
    return await apiCall('/verify-otp', data, "Email verified successfully!", CheckCircle);
  };

  const forgotPassword = async (email) => {
    return await apiCall('/send-otp', { email }, "OTP sent to your email!", CheckCircle);
  };

  const resetPassword = async (data) => {
    return await apiCall('/reset-password', data, "Password reset successful!", CheckCircle);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully", {
      icon: <Info className="text-primary-500" size={20} />,
    });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      verifyOTP, 
      forgotPassword, 
      resetPassword, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
