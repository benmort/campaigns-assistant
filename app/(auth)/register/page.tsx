'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {useTranslations} from 'next-intl';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );
  const content = useTranslations('content');

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error(content('account_exists_notice'));
    } else if (state.status === "failed") {
      toast.error(content('acount_create_failed_notice'));
    } else if (state.status === "invalid_data") {
      toast.error(content('failed_validation_notice'));
    } else if (state.status === 'invalid_domain') {
      toast.error(content('invalid_domain_notice'));
    } else if (state.status === "success") {
      toast.success(content('account_created_notice'));
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state, router, content]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">{ content('sign_up') }</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            { content('create_account') }
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>{ content('sign_up') }</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            { content('already_have_account') }{" "}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              { content('log_in') }{" "}
            </Link>
            { content('instead') }{"."}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
