'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Urban Wraps</h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'login' ? 'Welcome back!' : 'Join us today!'}
          </p>
        </div>

        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <SignUpForm onSuccess={handleSuccess} />
        )}

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'}
          </Button>
        </div>
      </div>
    </div>
  );
}
