
// contexts/AuthContext.js

import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here you would check for the user's session (e.g., checking a token in the localStorage)
    // For demonstration, we're using a timeout to simulate the delay of a request
    const session = localStorage.getItem('userSession');
    
    if (session) {
      setUser(JSON.parse(session));
    }

    setLoading(false);
  }, []);

  const signIn = (userData) => {
    // Here, you can authenticate the user and set the user data
    // Setting user data in localStorage to persist the session
    localStorage.setItem('userSession', JSON.stringify(userData));
    setUser(userData);  // This updates the user state in context
};

  const signOut = () => {
    // Here, you would handle the sign-out process, like removing the token/session from localStorage
    localStorage.removeItem('userSession');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook that simplifies the process of importing useContext and AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
