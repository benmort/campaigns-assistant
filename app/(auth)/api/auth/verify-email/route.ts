import { getUserByVerificationToken, updateUserVerificationStatus } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { token } = request.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const user = await getUserByVerificationToken(token);

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  await updateUserVerificationStatus(user.id, true);

  return res.status(200).json({ message: 'Email verified successfully!' });
}
