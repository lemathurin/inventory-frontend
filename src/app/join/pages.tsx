'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { apiUrl } from '@/config/api';

export default function JoinRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const token = localStorage.getItem('token');

    if (!code || !token) {
      router.replace('/');
      return;
    }

    axios
      .post(
        apiUrl('/homes/join'),
        { invitationCode: code },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const homeId = res.data.homeId;
        router.replace(`/home/${homeId}`);
      })
      .catch(() => {
        router.replace('/error?reason=invalid-invite');
      });
  }, []);

  return null;
}
