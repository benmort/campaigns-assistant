'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function VerifyEmail() {
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Ensure `token` is defined before fetching data
    if (token) {
      fetch(`/api/auth/verify-email?token=${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setMessage('Email verified successfully! You can now log in.');
          } else {
            setMessage(`Error: ${data.error}`);
          }
        })
        .catch(() => {
          setMessage('An error occurred while verifying your email.');
        });
    }
  }, [token]);

  if (!token) {
    // Render fallback while `token` is undefined
    return (
      <div>
        <h1>Verify Your Email</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Verify Your Email</h1>
      <p>{message || 'Verifying your email...'}</p>
    </div>
  );
}
