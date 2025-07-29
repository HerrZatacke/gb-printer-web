import { useMemo } from 'react';

export default function useProcessMarkdownLinks(markdown: string): string {
  return useMemo(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    return markdown.replace(/\[([^\]]+)]\(\/([^)]*)\)/g, (_, linkText, path) => {
      if (path === '') {
        // Handle root path "/"
        return `[${linkText}](${basePath}/)`;
      } else {
        // Handle paths like "/import", "/gallery", etc.
        return `[${linkText}](${basePath}/${path})`;
      }
    });
  }, [markdown]);
}
