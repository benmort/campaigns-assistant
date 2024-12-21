import React, { useRef, useState, useCallback, type ChangeEvent } from 'react';
import { toast } from 'sonner';

import { PlusIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { generateUUID } from '@/lib/utils';

import { PreviewAttachment } from './preview-attachment';

export function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [attachments, setAttachments] = useState<Array<{ url: string; name: string; contentType: string }>>([]);

  // Function to generate embeddings by calling an API route
  const generateEmbeddingsForFile = useCallback(async (file: File): Promise<{ embeddings: any; text: any }> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/embed', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { embeddings, text } = await response.json();
        return { embeddings, text };
      } else {
        const { error } = await response.json();
        toast.error(error);
        return { embeddings: null, text: '' }; // Fallback
      }
    } catch (error) {
      toast.error('Failed to generate embeddings, please try again!');
      return { embeddings: null, text: '' }; // Fallback
    }
  }, []); // No dependencies

  // Function to upload the embeddings to Pinecone
  const uploadToPinecone = useCallback(async (id: string, vector: number[], metadata: Record<string, any>) => {
    try {
      const response = await fetch('/api/vector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, vector, metadata }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        toast.error(`Failed to save embedding to Pinecone: ${error}`);
      }
    } catch (error) {
      console.error('Error uploading to Pinecone:', error);
      toast.error('Error uploading to Pinecone.');
    }
  }, []); // No dependencies

  // Function to upload file to Blob storage
  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`/api/files/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const { url, pathname, contentType } = data;

          // Generate embeddings for the file
          const embeddingsResult = await generateEmbeddingsForFile(file);

          if (!embeddingsResult) {
            toast.error('Failed to generate embeddings for the file.');
            return;
          }
          
          const { embeddings, text } = embeddingsResult

          const id = generateUUID();
          // Upload embeddings to Pinecone
          await uploadToPinecone(id, embeddings, { url, name: pathname, contentType, textContent: text });

          return { url, name: pathname, contentType };
        } else {
          const { error } = await response.json();
          toast.error(error);
        }
      } catch (error) {
        toast.error('Failed to upload file, please try again!');
      }
    },
    [generateEmbeddingsForFile, uploadToPinecone] // Dependencies
  );

  // Handle file input change event
  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [uploadFile] // Dependency
  );

  return (
    <div className="relative w-full flex flex-col gap-4">
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll items-end">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: '',
                name: filename,
                contentType: '',
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Button
        className="order-1 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
      >
        <PlusIcon />
        <span className="md:sr-only">Upload</span>
      </Button>
    </div>
  );
}
