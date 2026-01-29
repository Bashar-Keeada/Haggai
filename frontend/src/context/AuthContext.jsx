import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Passwords from environment variables
// Site password removed - public access allowed
const MEMBERS_PASSWORD = process.env.REACT_APP_MEMBERS_PASSWORD || 'Haggai2030!';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin2030!';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Site is now publicly accessible - always authenticated
  const [isAuthenticated] = useState(true);
  const [isMembersAuthenticated, setIsMembersAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has members area access
    const membersAuthStatus = localStorage.getItem('haggai-members-auth');
    if (membersAuthStatus === 'true') {
      setIsMembersAuthenticated(true);
    }
    // Check if user has admin access
    const adminAuthStatus = localStorage.getItem('haggai-admin-auth');
    if (adminAuthStatus === 'true') {
      setIsAdminAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Site login not needed anymore - always return true
  const login = () => {
    return true;
  };

  const loginMembers = (password) => {
    if (password === MEMBERS_PASSWORD) {
      setIsMembersAuthenticated(true);
      localStorage.setItem('haggai-members-auth', 'true');
      return true;
    }
    return false;
  };

  const loginAdmin = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('haggai-admin-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsMembersAuthenticated(false);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('haggai-members-auth');
    localStorage.removeItem('haggai-admin-auth');
  };

  const logoutMembers = () => {
    setIsMembersAuthenticated(false);
    localStorage.removeItem('haggai-members-auth');
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('haggai-admin-auth');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isMembersAuthenticated,
      isAdminAuthenticated,
      isLoading, 
      login, 
      loginMembers,
      loginAdmin,
      logout,
      logoutMembers,
      logoutAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
