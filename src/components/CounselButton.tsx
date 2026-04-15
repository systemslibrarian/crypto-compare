'use client';

import React from 'react';

const COUNSEL_BASE = 'https://systemslibrarian.github.io/crypto-counsel/';

interface CounselButtonProps {
  /** Pre-filled question. If omitted, opens the counsel homepage. */
  question?: string;
  /** Visual variant */
  variant?: 'inline' | 'floating' | 'category';
  /** Accessible label override */
  ariaLabel?: string;
}

export function CounselButton({
  question,
  variant = 'inline',
  ariaLabel,
}: CounselButtonProps) {
  const url = question
    ? `${COUNSEL_BASE}?q=${encodeURIComponent(question)}`
    : COUNSEL_BASE;

  const label = ariaLabel ?? (question ? `Ask Counsel about ${question}` : 'Open Crypto Counsel');

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full
                   bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg
                   transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-emerald-400
                   md:px-5 md:py-3"
      >
        <span aria-hidden="true">⚷</span>
        <span>Ask the Counsel</span>
      </a>
    );
  }

  if (variant === 'category') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700
                   bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-400
                   transition-colors hover:border-emerald-500 hover:text-emerald-300
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-emerald-400"
      >
        <span aria-hidden="true">⚷</span>
        Ask the Counsel →
      </a>
    );
  }

  // inline (default) — used on algorithm cards
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs
                 text-emerald-500 transition-colors hover:text-emerald-300
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-emerald-400"
    >
      <span aria-hidden="true">⚷</span>
      Ask →
    </a>
  );
}
