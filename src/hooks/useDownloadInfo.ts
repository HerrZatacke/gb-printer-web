import { useEffect, useMemo, useState } from 'react';
import { useInteractionsStore, useItemsStore, useSettingsStore } from '@/stores/stores';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { bitmapFileTypes, supportedCanvasImageFormats, type TestFileType } from '@/tools/supportedCanvasImageFormats';

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
  const { images } = useItemsStore();
  const { exportFileTypes } = useSettingsStore();

  const [supportedExportFileTypes, setSupportedExportFileTypes] = useState<TestFileType[]>([]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSupportedExportFileTypes(supportedCanvasImageFormats());
    }, 1);

    return () => window.clearTimeout(handle);
  }, []);

  const rgbnFlags = useMemo(() => {
    return downloadHashes.map((downloadHash) => {
      const image = images.find(({ hash }) => hash === downloadHash);
      return image ? isRGBNImage(image) : null;
    });
  }, [downloadHashes, images]);

  const fileTypeCounts: Record<string, number> = useMemo(() => {
    return supportedExportFileTypes.reduce((acc, fileType) => {
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
