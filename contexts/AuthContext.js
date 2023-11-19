
// contexts/AuthContext.js
import jwtDecode from 'jwt-decode';
import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    const token = localStorage.getItem('token');

    if (session && token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if the token has expired
      if (decodedToken.exp < currentTime) {
        signOut(); // Token has expired, log out the user
      } else {
        setUser(JSON.parse(session));
      }
    }

    setLoading(false);
  }, []);

  const signIn = (userData) => {
    localStorage.setItem('userSession', JSON.stringify(userData));
    setUser(userData);  // This updates the user state in context
};

const signOut = () => {
  localStorage.removeItem('userSession');
  localStorage.removeItem('token'); // Ensure the token is also removed
  setUser(null);
  router.push('/users/login');
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
