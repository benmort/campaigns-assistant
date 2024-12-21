import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendVerificationEmail(email: string, token: string) {
  if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error("SENDGRID_FROM_EMAIL environment variable is not set");
  }

  const verificationUrl = `${process.env.NEXTAUTH_URL!}/api/auth/verify-email?token=${token}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL, // Your verified SendGrid sender
    subject: 'Verify your email',
    text: `Click this link to verify your email: ${verificationUrl}`,
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  };

  await sgMail.send(msg);
}
