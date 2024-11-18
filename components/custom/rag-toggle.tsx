'use client';

import { useState, useEffect } from 'react';

import { setRagCookie, getRagCookie } from '@/lib/utils/cookies-client';

import { CheckCirclFillIcon } from './icons';
import { Button } from "../ui/button";

export const RagToggle = () => {
  const [isRagEnabled, setIsRagEnabled] = useState(false);

  useEffect(() => {
    // Initialize with the current cookie value on mount
    setIsRagEnabled(getRagCookie());
  }, []);

  const toggleRag = () => {
    const newValue = !isRagEnabled;
    setRagCookie(newValue);
    setIsRagEnabled(newValue);
    // Optionally reload or trigger any side effect here
  };

  return (
    <Button
      onClick={toggleRag}
      className="py-1.5 px-2 h-fit font-normal"
      variant={isRagEnabled ? "default" : "secondary"}
    >
      {isRagEnabled ? "RAG Enabled" : "RAG Disabled"}
      {isRagEnabled && <CheckCirclFillIcon />}
    </Button>
  );
};
