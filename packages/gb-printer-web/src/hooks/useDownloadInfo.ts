import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { imagesByHashesQueryOptions } from '@/stores/items/queries/images';
import { useInteractionsStore, useSettingsStore } from '@/stores/stores';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { bitmapFileTypes, supportedCanvasImageFormats, TestFileType } from '@/tools/supportedCanvasImageFormats';

interface UseDownloadInfo {
  exportFileTypes: string[];
  supportedExportFileTypes: string[];
  fileTypeCounts: Record<string, number>;
  rgbnCount: number;
  monochromeCount: number;
  downloadTotal: number;
}

export const useDownloadInfo = (): UseDownloadInfo => {
  const { downloadHashes } = useInteractionsStore();
  const queryClient = useQueryClient();
  const { exportFileTypes } = useSettingsStore();

  const [supportedExportFileTypes, setSupportedExportFileTypes] = useState<TestFileType[]>([]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSupportedExportFileTypes(supportedCanvasImageFormats());
    }, 1);

    return () => window.clearTimeout(handle);
  }, []);

  const [rgbnFlags, setRgbnFlags] = useState<(boolean)[]>([]);

  useEffect(() => {
    let cancelled = false;
    queryClient.fetchQuery(imagesByHashesQueryOptions(downloadHashes))
      .then(({ items: downloadImages }) => {
        if (!cancelled) {
          setRgbnFlags(downloadImages.map(isRGBNImage));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [downloadHashes, queryClient]);

  const fileTypeCounts: Record<string, number> = useMemo(() => {
    return supportedExportFileTypes.reduce((acc, fileType) => {
      if (fileType === TestFileType.JSON) {
        acc[fileType] = 1;
        return acc;
      }

      const supportsRGBN = bitmapFileTypes.includes(fileType);

      let count = 0;

      for (const isRGBN of rgbnFlags) {
        if (isRGBN === null) continue;

        if (isRGBN) {
          if (supportsRGBN) {
            count += 1;
          }
        } else {
          count += 1;
        }
      }

      acc[fileType] = count;
      return acc;
    }, {} as Record<string, number>);
  }, [rgbnFlags, supportedExportFileTypes]);

  const rgbnCount = useMemo(() => (
    rgbnFlags.filter((flag) => flag === true).length
  ), [rgbnFlags]);

  const monochromeCount = useMemo(() => (
    rgbnFlags.filter((flag) => flag === false).length
  ), [rgbnFlags]);

  const downloadTotal = useMemo(() => (
    supportedExportFileTypes.reduce((sum: number, fileType): number => (
      sum + (exportFileTypes.includes(fileType) ? fileTypeCounts[fileType] : 0)
    ), 0)
  ), [exportFileTypes, fileTypeCounts, supportedExportFileTypes]);

  return {
    exportFileTypes,
    supportedExportFileTypes,
    fileTypeCounts,
    rgbnCount,
    monochromeCount,
    downloadTotal,
  };
};
