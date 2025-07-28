import { useMemo } from 'react';

export default function useProcessMarkdownLinks(markdown: string): string {
  return useMemo(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    // Replace markdown links that start with "/" with base path prefix
    return markdown.replace(/\[([^\]]+)]\(\/([^)]+)\)/g, `[$1](${basePath}/$2)`);
  }, [markdown]);
}
