'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function SystemPage() {
  const content = useTranslations('content');
  const [promptContent, setPromptContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchSystemPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/system-prompt');
        if (!response.ok) throw new Error(content('error_loading_prompt'));
        const data = await response.json();
        setPromptContent(data.content.message);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSystemPrompt();
  }, [content]);

  const handleSave = async () => {
    setShowConfirmDialog(false);
    const savePromise = fetch('/api/system-prompt', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { message: promptContent }}),
    });

    toast.promise(savePromise, {
      loading: content('saving'),
      success: content('prompt_updated'),
      error: content('error_updating_prompt'),
    });
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">{content('admin.system')}</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {content('admin.system_explanation')}.
          </p>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-16">
          {loading ? (
            <p>{content('loading')}</p>
          ) : (
            <>
              <Textarea
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                className="mb-4"
                rows={6}
                placeholder={content('enter_prompt')}
              />
              <Button variant="outline" onClick={() => setShowConfirmDialog(true)}>
                {content('save')}
              </Button>
              {error && <p className="text-red-500 mt-2">{content('error')}: {error}</p>}
            </>
          )}
          <ul className="space-y-4 mt-4">
            <li>
              <Link href="/admin" className="text-blue-500 underline hover:text-blue-700">
                {content('back')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{content('confirm_update')}</AlertDialogTitle>
            <AlertDialogDescription>
              {content('confirm_update_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              {content('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              {content('continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
