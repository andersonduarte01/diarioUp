// src/contexto/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/Api';

export const AuthContext = createContext({
  user: null,
  authTokens: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Salvar tokens
  const saveTokens = async (tokens) => {
    setAuthTokens(tokens);
    api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    await AsyncStorage.setItem('@authTokens', JSON.stringify(tokens));
  };

  // Remover tokens
  const removeTokens = async () => {
    setAuthTokens(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('@authTokens');
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('api/token/', { email, password });
      const tokens = response.data;
      await saveTokens(tokens);

      const userResponse = await api.get('api/usuario-logado/');
      setUser(userResponse.data);

      setLoading(false);
      return true;
    } catch (error) {
      console.log('Erro no login:', error);
      setLoading(false);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    await removeTokens();
  };

  // Carregar tokens inicial
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokensString = await AsyncStorage.getItem('@authTokens');
        if (tokensString) {
          const tokens = JSON.parse(tokensString);
          setAuthTokens(tokens);
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

          const userResponse = await api.get('api/usuario-logado/');
          setUser(userResponse.data);
        }
      } catch (error) {
        console.log('Erro ao carregar tokens:', error);
        await removeTokens();
      }
      setLoading(false);
    };

    loadTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
