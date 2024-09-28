import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/config/api';

interface CreateHomeData {
  name: string;
}

export const useCreateHome = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createHome = async (data: CreateHomeData) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token) {
        setError('You are not authenticated. Please log in.');
        router.push('/login');
        return null;
      }

      const response = await axios.post(
        apiUrl('/homes/create-home'),
        { ...data, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.home && response.data.home.id) {
        const newHomeId = response.data.home.id;
        localStorage.setItem('currentHomeId', newHomeId);
        return newHomeId;
      } else {
        setError('Home created but no ID returned. Please try again.');
        return null;
      }
    } catch (err) {
      console.error('Error:', err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Authentication failed. Please log in again.');
        router.push('/login');
      } else {
        setError('An error occurred while creating your home');
      }
      return null;
    }
  };

  return { createHome, error };
};