export const TestFileType = {
  JPEG: 'jpeg',
  PNG: 'png',
  WEBP: 'webp',
  BPM: 'bmp',
  GIF: 'gif',
  TXT: 'txt',
  PGM: 'pgm',
  JSON: 'json',
} as const;

export type TestFileType = typeof TestFileType[keyof typeof TestFileType];

export const testFileTypes: TestFileType[] = Object.values(TestFileType);

export const bitmapFileTypes : TestFileType[] = [TestFileType.JPEG, TestFileType.PNG, TestFileType.WEBP, TestFileType.BPM, TestFileType.GIF];

const supports: Partial<Record<TestFileType, boolean>> = {};

const supportsFileType = (fileType: TestFileType) => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (supports[fileType] !== undefined) {
    return supports[fileType];
  }

  let isSupported = false;

  switch (fileType) {
    case TestFileType.JPEG:
    case TestFileType.PNG:
    case TestFileType.WEBP:
    case TestFileType.BPM:
    case TestFileType.GIF: {
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 2;
      const imgData = canvas.toDataURL(`image/${fileType}`);

      isSupported = imgData.indexOf(`data:image/${fileType};base64`) === 0;
      break;
    }

    case TestFileType.TXT:
    case TestFileType.PGM:
    case TestFileType.JSON: {
      isSupported = true;
      break;
    }
  }

  supports[fileType] = isSupported;
  return isSupported;
};

export const supportedCanvasImageFormats = () => (
  testFileTypes.filter((fileType) => supportsFileType(fileType))
);
