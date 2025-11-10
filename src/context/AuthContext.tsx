import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { type User } from "../types/user";
import { auth } from "../FirebaseConfig/firebase";
import { AuthService } from "../services/auth-service";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate =useNavigate()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        
        const converted = await AuthService.convertFirebaseUser(firebaseUser)
        setUser(converted);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
 

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/')
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
