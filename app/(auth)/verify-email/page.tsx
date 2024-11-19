import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function VerifyEmail() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/verify-email?token=${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setMessage('Email verified successfully! You can now log in.');
          } else {
            setMessage(`Error: ${data.error}`);
          }
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Verify Your Email</h1>
      <p>{message || 'Verifying your email...'}</p>
    </div>
  );
}
