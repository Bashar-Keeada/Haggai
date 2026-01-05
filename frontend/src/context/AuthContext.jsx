import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Simple password for site access - can be changed here
const SITE_PASSWORD = 'Keeada2030';
// Password for members area
const MEMBERS_PASSWORD = 'Haggai2030!';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMembersAuthenticated, setIsMembersAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('haggai-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    // Check if user has members area access
    const membersAuthStatus = localStorage.getItem('haggai-members-auth');
    if (membersAuthStatus === 'true') {
      setIsMembersAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    if (password === SITE_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('haggai-auth', 'true');
      return true;
    }
    return false;
  };

  const loginMembers = (password) => {
    if (password === MEMBERS_PASSWORD) {
      setIsMembersAuthenticated(true);
      localStorage.setItem('haggai-members-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsMembersAuthenticated(false);
    localStorage.removeItem('haggai-auth');
    localStorage.removeItem('haggai-members-auth');
  };

  const logoutMembers = () => {
    setIsMembersAuthenticated(false);
    localStorage.removeItem('haggai-members-auth');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isMembersAuthenticated, 
      isLoading, 
      login, 
      loginMembers,
      logout,
      logoutMembers 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
