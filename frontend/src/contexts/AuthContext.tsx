import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import apiService from '../services/api';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modo desenvolvimento - usuário mock
  const mockUser: User = {
    id: 1,
    name: 'Usuario Desenvolvimento',
    email: 'dev@exemplo.com',
    role: 'doctor',
    active: true,
    registration_number: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        // Modo desenvolvimento - autenticar automaticamente
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        if (isDevelopment) {
          console.log('🚀 Modo desenvolvimento: Login automático ativado');
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('token', 'mock-token-dev');
        } else {
          const token = localStorage.getItem('token');
          const userData = localStorage.getItem('user');

          if (token && userData) {
            try {
              const parsedUser = JSON.parse(userData);
              // Verificar se o token ainda é válido
              await apiService.getCurrentUser();
              setUser(parsedUser);
            } catch (error) {
              // Token inválido, limpar dados
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar autenticação:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Modo desenvolvimento - sempre aceitar login
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (isDevelopment) {
        console.log('🚀 Login em modo desenvolvimento');
        setUser(mockUser);
        localStorage.setItem('token', 'mock-token-dev');
        localStorage.setItem('user', JSON.stringify(mockUser));
        return;
      }
      
      // Tentar login real
      const response: AuthResponse = await apiService.login(credentials);
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      // Em desenvolvimento, fazer fallback para mock
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Backend indisponível, usando mock user');
        setUser(mockUser);
        localStorage.setItem('token', 'mock-token-dev');
        localStorage.setItem('user', JSON.stringify(mockUser));
      } else {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Modo desenvolvimento - sempre aceitar registro
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (isDevelopment) {
        console.log('🚀 Registro em modo desenvolvimento');
        const newUser = { ...mockUser, name: data.name, email: data.email };
        setUser(newUser);
        localStorage.setItem('token', 'mock-token-dev');
        localStorage.setItem('user', JSON.stringify(newUser));
        return;
      }
      
      // Tentar registro real
      const response: AuthResponse = await apiService.register(data);
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      // Em desenvolvimento, fazer fallback para mock
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Backend indisponível, usando mock user para registro');
        const newUser = { ...mockUser, name: data.name, email: data.email };
        setUser(newUser);
        localStorage.setItem('token', 'mock-token-dev');
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    try {
      apiService.logout().catch(() => {
        // Ignorar erros de logout no servidor
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
