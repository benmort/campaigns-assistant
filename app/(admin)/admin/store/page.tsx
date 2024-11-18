'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { FileUploader } from '@/components/custom/file-uploader';
import { TrashIcon } from '@/components/custom/icons';
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

export default function StorePage() {
  const content = useTranslations('content');
  const [documents, setDocuments] = useState([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch('/api/vector');
      const data = await response.json();
      setDocuments(data);
    };

    fetchDocuments();
  }, []);

  // Function to handle document deletion
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch('/api/vector', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteId }),
      });

      if (response.ok) {
        // Remove the deleted document from the state
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc: any) => doc.id !== deleteId)
        );
        console.log('Document deleted successfully');
      } else {
        console.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">{content('admin.store')}</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {content('admin.store_explainer')}
          </p>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-16">
          <div className="flex flex-col gap-2">
            <FileUploader />
          </div>
          <div className="flex flex-col gap-2">
            <ul className="space-y-4">
              {documents.length > 0 ? (
                documents.map((doc: any) => (
                  <li key={doc.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">{content('admin.id')}:</span> {doc.id}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">{content('admin.file')}:</span>{' '}
                          <Link href={doc.metadata.url} target="_blank" className="text-blue-500 underline">
                            {doc.metadata.name}
                          </Link>
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">{content('admin.content_type')}:</span> {doc.metadata.contentType}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="ml-auto md:ml-0 md:h-fit px-2 md:px-2 order-1 md:order-1"
                        onClick={(event) => {
                          event.preventDefault();
                          setDeleteId(doc.id);
                          setShowConfirmDialog(true);
                        }}
                      >
                        <TrashIcon />
                        <span className="md:sr-only">{content('delete')}</span>
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">{content('admin.no_documents')}.</p>
              )}
            </ul>
          </div>
          <ul>
            <li>
              <Link href="/admin" className="text-blue-500 underline">
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
            <AlertDialogTitle>{content('confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {content('confirm_delete_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              {content('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {content('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
