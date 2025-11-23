'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AppShell, Container } from '../../components/layout/AppShell';
import { AuthForm } from '../../components/auth/AuthForm';
import { Button } from '../../components/ui/Button';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';

function LoginContent() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogleIdToken } = useAuth();
  const router = useRouter();
  const rememberMeRef = useRef(true);

  // Handle Google login success
  const handleGoogleSuccess = async (response) => {
    console.log('Google login success:', response);
    if (!response.accessToken && !response.credential) {
      setError('Failed to get token from Google');
      return;
    }

    setIsLoading(true);
    try {
      // Pass the response object (containing accessToken or credential/idToken)
      const res = await loginWithGoogleIdToken(
        response,
        rememberMeRef.current
      );

      if (res.success) {
        router.push('/Dashboard');
      } else {
        setError(res.message || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login error
  const handleGoogleError = () => {
    console.error('Google login failed');
    setError('Failed to sign in with Google');
  };

  // Handle form submission with Remember Me support
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    const { email, password, rememberMe } = formData;
    rememberMeRef.current = !!rememberMe;

    // Validate required fields
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Attempt login with Remember Me preference
      const result = await login(email, password, rememberMe);

      if (result.success) {
        console.log('🎉 Login successful, redirecting to dashboard');
        router.push('/Dashboard');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell showBackground={true}>
      <Container size="sm" className="min-h-screen flex items-center justify-center py-16">
        <div className="w-full max-w-lg">
          <AuthForm
            mode="login"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            className="animate-in fade-in-0 slide-in-from-bottom-6 duration-500"
            googleButton={
              <GoogleAuthButton
                mode="login"
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                loading={isLoading}
                className="mx-auto max-w-xs"
              />
            }
          />
        </div>
      </Container>
    </AppShell>
  );
}

export default function Login() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '756674380246-d6e09p1kfk6dca45kmm1gn8nphe137gv.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}