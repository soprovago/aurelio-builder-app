import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { 
  auth,
} from "../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Monitor auth state changes
  useEffect(() => {
    console.log("Aurelio AuthProvider - Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Aurelio AuthProvider - Auth state changed:", { 
        hasUser: !!user,
        timestamp: new Date().toISOString()
      });
      
      if (user) {
        try {
          // Transform Firebase user into Aurelio Builder user format
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || "Usuario Aurelio",
            photoURL: user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            emailVerified: user.emailVerified,
            // Aurelio Builder specific preferences
            preferences: {
              theme: 'dark',
              autoSave: true,
              gridSnap: true,
              showGuides: true,
              defaultViewport: 'desktop'
            },
            // Default professional info
            role: "Diseñador",
            company: "",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          console.log("Aurelio AuthProvider - User data transformed:", {
            uid: userData.uid,
            email: userData.email,
            name: userData.name,
            hasPhoto: !!userData.photoURL
          });
          
          setUser(userData);
        } catch (error) {
          console.error("Aurelio AuthProvider - Error transforming user data:", error);
          setError("Error al procesar los datos del usuario");
        }
      } else {
        console.log("Aurelio AuthProvider - No user found, clearing user state");
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log("Aurelio AuthProvider - Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      console.log("Aurelio AuthProvider - Attempting login with email/password");
      setError(null);
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Aurelio AuthProvider - Email login successful");
      
      // Don't manually set user here - onAuthStateChanged will handle it
      return userCredential.user;
    } catch (err) {
      console.error("Aurelio AuthProvider - Login error:", err);
      setError(handleFirebaseError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loginWithGoogle = useCallback(async () => {
    try {
      console.log("Aurelio AuthProvider - Attempting Google login");
      setError(null);
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Aurelio AuthProvider - Google login successful");
      
      // Don't manually set user here - onAuthStateChanged will handle it
      return result.user;
    } catch (err) {
      console.error("Aurelio AuthProvider - Google login error:", err);
      setError(handleFirebaseError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logout = useCallback(async () => {
    try {
      console.log("Aurelio AuthProvider - Logging out user");
      setIsLoading(true);
      await signOut(auth);
      setUser(null);
      console.log("Aurelio AuthProvider - User logged out successfully");
    } catch (err) {
      console.error("Aurelio AuthProvider - Error during logout:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper function to handle Firebase error messages
  const handleFirebaseError = (error) => {
    switch (error.code) {
      case "auth/user-not-found":
        return "No existe una cuenta con este correo electrónico.";
      case "auth/wrong-password":
        return "Contraseña incorrecta.";
      case "auth/invalid-email":
        return "El correo electrónico no es válido.";
      case "auth/user-disabled":
        return "Esta cuenta ha sido deshabilitada.";
      case "auth/popup-closed-by-user":
        return "Inicio de sesión cancelado.";
      case "auth/invalid-credential":
        return "Credenciales inválidas. Verifica tu email y contraseña.";
      default:
        return error.message;
    }
  };

  // Function to update user preferences
  const updateUserPreferences = useCallback((preferences) => {
    console.log("Aurelio AuthProvider - Updating user preferences", preferences);
    setUser(prevUser => {
      if (prevUser) {
        return {
          ...prevUser,
          preferences: {
            ...prevUser.preferences,
            ...preferences
          }
        };
      }
      return prevUser;
    });
    console.log("Aurelio AuthProvider - User preferences updated");
  }, []);
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      error, 
      login, 
      loginWithGoogle, 
      logout,
      updateUserPreferences
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};