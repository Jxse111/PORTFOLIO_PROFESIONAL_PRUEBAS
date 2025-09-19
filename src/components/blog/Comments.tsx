'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Text } from '@once-ui-system/core';

declare global {
  interface Window {
    giscus: any;
  }
}

interface CommentsProps {
  repo: string;
  repoId: string;
  category?: string;
  categoryId: string;
  mapping?: string;
  reactionsEnabled?: '0' | '1';
  emitMetadata?: '0' | '1';
  inputPosition?: 'top' | 'bottom';
  theme?: 'light' | 'dark' | 'preferred_color_scheme';
  lang?: string;
  loading?: 'lazy' | 'eager';
}

export function Comments({
  repo,
  repoId,
  category = 'Announcements',
  categoryId,
  mapping = 'pathname',
  reactionsEnabled = '1',
  emitMetadata = '0',
  inputPosition = 'bottom',
  theme = 'preferred_color_scheme',
  lang = 'es',
  loading = 'lazy',
}: CommentsProps) {
  const { resolvedTheme } = useTheme();
  const commentsRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const commentsEl = commentsRef.current;
    if (!commentsEl) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-reactions-enabled', reactionsEnabled);
    script.setAttribute('data-emit-metadata', emitMetadata);
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-lang', lang);
    script.setAttribute('data-loading', loading);
    script.setAttribute(
      'data-theme',
      resolvedTheme === 'dark' ? 'dark' : 'light'
    );

    commentsEl.appendChild(script);

    return () => {
      const existingScript = commentsEl.querySelector('script[src*="giscus.app"]');
      if (existingScript) {
        commentsEl.removeChild(existingScript);
      }
    };
  }, [resolvedTheme]);

  return (
    <div className="mt-12">
      <Text variant="heading-strong-l" marginBottom="24">
        Comentarios
      </Text>
      <div ref={commentsRef} />
    </div>
  );
}
