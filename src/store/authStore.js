import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Simulación de API de autenticación
const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@aurelio.com' && password === 'admin123') {
      return {
        id: '1',
        email: 'admin@aurelio.com',
        name: 'Aurelio Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        createdAt: new Date().toISOString(),
      };
    }
    
    if (email === 'user@aurelio.com' && password === 'user123') {
      return {
        id: '2',
        email: 'user@aurelio.com',
        name: 'Aurelio User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        createdAt: new Date().toISOString(),
      };
    }
    
    throw new Error('Invalid credentials');
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const user = await mockAuth.login(email, password);
          
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Login failed';
            state.isLoading = false;
          });
          throw error;
        }
      },

      logout: () => {
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
        });
      },

      setUser: (user: User | null) => {
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
        });
      },

      setLoading: (isLoading: boolean) => {
        set((state) => {
          state.isLoading = isLoading;
        });
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);