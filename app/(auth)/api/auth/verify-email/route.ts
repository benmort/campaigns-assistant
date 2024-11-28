import { getUserByVerificationToken, updateUserVerificationStatus } from '@/lib/db/queries';

export async function GET(request: Request) {
  // Parse query parameters using the URL object
  const url = new URL(request.url);
  const token = url.searchParams.get('token'); // Retrieve the 'token' parameter

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await getUserByVerificationToken(token);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await updateUserVerificationStatus(user.id, true);

  return new Response(JSON.stringify({ message: 'Email verified successfully!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
