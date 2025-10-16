import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { useSnackbarContext } from '../context/SnackbarContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useLogin = () => {
  const { login } = useAuthContext();
  const { openSnackBar } = useSnackbarContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const { token, data: { user } } = data;
      login(user, token);
      openSnackBar('success', 'Login successful!');
      navigate('/home');
    },
    onError: (error) => {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      openSnackBar('error', errorMessage);
    },
  });
};

export const useSignup = () => {
  const { login } = useAuthContext();
  const { openSnackBar } = useSnackbarContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      return response.data;
    },
    onSuccess: (data) => {
      const { token, data: { user } } = data;
      login(user, token);
      openSnackBar('success', 'Registration successful!');
      navigate('/home');
    },
    onError: (error) => {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      openSnackBar('error', errorMessage);
    },
  });
};