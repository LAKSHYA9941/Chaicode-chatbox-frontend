'use client';

import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AppShell, Container } from '../../components/layout/AppShell';
import { AuthForm } from '../../components/auth/AuthForm';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';

function RegisterContent() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, loginWithGoogleIdToken } = useAuth();
  const router = useRouter();
  const rememberMeRef = useRef(true);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Failed to get credential from Google');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithGoogleIdToken(
        credentialResponse.credential,
        rememberMeRef.current
      );

      if (res.success) {
        router.push('/Dashboard');
      } else {
        setError(res.message || 'Google sign-in failed');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Failed to sign in with Google');
  };

  /**
   * Handle registration form submission with Remember Me support
   * @param {Object} formData - Form data including all registration fields and rememberMe
   */
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    const { username, email, password, firstname, lastname, rememberMe } = formData;
    rememberMeRef.current = !!rememberMe;

    // Validate required fields
    if (!username || !email || !password || !firstname || !lastname) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Additional validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Attempt registration with Remember Me preference
      const result = await register(username, email, password, firstname, lastname, rememberMe);

      if (result.success) {
        console.log('🎉 Registration successful');
        
        // If Remember Me was enabled and auto-login succeeded, redirect to dashboard
        if (rememberMe && result.message.includes('logged in')) {
          router.push('/Dashboard');
        } else {
          // Otherwise redirect to login page
          router.push('/Login');
        }
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
            mode="register"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            className="animate-in fade-in-0 slide-in-from-bottom-6 duration-500"
            googleButton={
              <GoogleAuthButton
                mode="register"
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

export default function Register() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '756674380246-d6e09p1kfk6dca45kmm1gn8nphe137gv.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <RegisterContent />
    </GoogleOAuthProvider>
  );
}
