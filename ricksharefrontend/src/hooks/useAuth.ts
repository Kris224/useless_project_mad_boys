import { useState, useEffect } from 'react';
import axios from 'axios';

// Replace with your actual API endpoints
const API_BASE_URL = 'http://localhost:8000/api';
const REFRESH_TOKEN_URL = `${API_BASE_URL}/user/get-access-token/`;

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [loading,setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true)
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false)
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(REFRESH_TOKEN_URL, {
        'refreshToken':refreshToken
      },{
        headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
      });
      const newAccessToken = response.data.response.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token', error);
      logout();
      throw error;
    }
  };

  return {
    isLoggedIn,
    login,
    logout,
    loading,
    refreshAccessToken,
  };
};

export default useAuth;