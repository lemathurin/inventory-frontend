'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_BASE = 'http://localhost:4000';
const apiUrl = (path: string) => `${API_BASE}${path}`;

const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("🚀 Tentative d'inscription avec:", data);

      // ENDPOINT FINAL CORRIGÉ
      const response = await axios.post(apiUrl('/api/users/register'), data);

      console.log('✅ Réponse reçue:', response);
      console.log('📦 Data de la réponse:', response.data);

      const { token, id } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', id.toString());
        console.log('💾 Token stocké:', token);
        console.log('👤 User ID stocké:', id);
        console.log('🔄 Redirection vers /onboarding');
        router.push('/onboarding');
      } else {
        console.log('❌ Pas de token dans la réponse');
        setError(
          'Registration successful, but no token received. Please try logging in.'
        );
      }
    } catch (err) {
      console.error("❌ Erreur d'inscription:", err);

      if (axios.isAxiosError(err)) {
        console.log("🔍 Détails de l'erreur API:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });

        const errorMessage = err.response?.data?.message || err.message;
        setError(`Inscription échouée: ${errorMessage}`);
      } else {
        console.log('🔍 Erreur non-Axios:', err);
        setError("Une erreur inattendue s'est produite");
      }
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-4'>
            {error && (
              <Alert variant='destructive' data-testid='error-message'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                type='text'
                placeholder='Your name'
                data-testid='username-input'
                {...register('name')}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                data-testid='email-input'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                data-testid='password-input'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button
              type='submit'
              className='w-full'
              data-testid='register-button'
            >
              Sign Up
            </Button>
            <p className='text-sm text-center text-gray-600'>
              Already have an account?{' '}
              <Link href='/login' className='text-primary hover:underline'>
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
