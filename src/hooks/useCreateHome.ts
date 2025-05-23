import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/config/api';

interface CreateHomeData {
  name: string;
  address: string;
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

      // OPTION 1: Essayez d'abord cette version (endpoint simple)
      const response = await axios.post(
        apiUrl('/api/homes/create-home'),
        {
          name: data.name,
          address: data.address,
          userId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Si ça ne marche pas, essayez l'OPTION 2 ci-dessous
      
      if (response.data.home && response.data.home.id) {
        const newHomeId = response.data.home.id;
        localStorage.setItem('currentHomeId', newHomeId);
        return newHomeId;
      } else if (response.data.id) {
        // Au cas où la réponse retourne directement l'ID
        const newHomeId = response.data.id;
        localStorage.setItem('currentHomeId', newHomeId);
        return newHomeId;
      } else {
        console.log('Response structure:', response.data);
        setError('Home created but no ID returned. Please try again.');
        return null;
      }
    } catch (err) {
      console.error('Error creating home:', err);
      
      if (axios.isAxiosError(err)) {
        console.log('API Error details:', {
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url
        });
        
        if (err.response?.status === 403) {
          setError('Authentication failed. Please log in again.');
          router.push('/login');
        } else if (err.response?.status === 404) {
          setError('API endpoint not found. Please check the server configuration.');
        } else {
          const errorMessage = err.response?.data?.message || err.message;
          setError(`Failed to create home: ${errorMessage}`);
        }
      } else {
        setError('An error occurred while creating your home');
      }
      return null;
    }
  };

  return { createHome, error };
};