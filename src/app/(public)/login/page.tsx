'use client';

<<<<<<< HEAD:src/app/login/page.tsx
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
=======
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
>>>>>>> dev:src/app/(public)/login/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
<<<<<<< HEAD:src/app/login/page.tsx
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiUrl } from '@/config/api';
=======
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin } from "@/domains/user/hooks/useLogin";
>>>>>>> dev:src/app/(public)/login/page.tsx

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { handleLogin, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
<<<<<<< HEAD:src/app/login/page.tsx
      // CORRIGÉ: Utiliser le bon endpoint
      const response = await axios.post(apiUrl('/api/users/login'), data);

      console.log('Full response:', response);
      console.log('Response data:', response.data);

      const { token, id, homeId } = response.data;
      console.log('homeId received:', homeId);

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', id.toString());

        // Si l'utilisateur a déjà un home, aller directement dessus
        if (homeId) {
          localStorage.setItem('currentHomeId', homeId.toString());
          router.push(`/home/${homeId}`);
        } else {
          // Sinon, aller sur onboarding pour créer un home
          router.push('/onboarding');
        }
      } else {
        setError('Login successful, but no authentication token received.');
      }
    } catch (err) {
      console.error('Login error:', err);

      // Améliorer la gestion d'erreur
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || 'Invalid credentials';
        setError(`Login failed: ${errorMessage}`);
      } else {
        setError('An error occurred during login. Please try again.');
      }
=======
      await handleLogin(data);
    } catch (err) {
      console.error("Login error:", err);
>>>>>>> dev:src/app/(public)/login/page.tsx
    }
  }

  return (
<<<<<<< HEAD:src/app/login/page.tsx
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
=======
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
>>>>>>> dev:src/app/(public)/login/page.tsx
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-4'>
            {error && (
              <Alert variant='destructive' data-testid='error-message'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                data-testid='email-input'
                placeholder='you@example.com'
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
                {...register('password')}
                data-testid='password-input'
              />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' data-testid='login-button'>
              Login
            </Button>
            <span className='text-sm text-center text-gray-600'>
              Don&#39;t have an account?{' '}
              <Link href='/signup' className='text-primary hover:underline'>
                Sign up
              </Link>
            </span>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
