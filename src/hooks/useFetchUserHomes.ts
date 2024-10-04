import { useState, useEffect } from 'react';
import { apiUrl } from '@/config/api';

interface Home {
  id: string;
  name: string;
}

export const useFetchUserHomes = () => {
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(apiUrl('/homes/user-homes'), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch homes');
        }

        const data = await response.json();
        setHomes(data);
      } catch (err) {
        setError('Error fetching homes. Please try again later.');
        console.error('Error fetching homes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

  return { homes, loading, error };
};