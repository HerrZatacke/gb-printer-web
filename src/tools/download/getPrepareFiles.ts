import { BW_PALETTE, BW_PALETTE_HEX, getMonochromeImageBlob, getRGBNImageBlob } from 'gb-image-decoder';
import type { RGBNTiles, ExportFrameMode, RGBNPalette } from 'gb-image-decoder';
import type { FileNameStyle } from '@/consts/fileNameStyles';
import generateFileName from '@/tools/generateFileName';
import { getImagePalettes } from '@/tools/getImagePalettes';
import { getMonochromeImageCreationParams } from '@/tools/getMonochromeImageCreationParams';
import { getPaletteSettings } from '@/tools/getPaletteSettings';
import { isRGBNImage } from '@/tools/isRGBNImage';
import type { Image, MonochromeImage } from '@/types/Image';
import type { Palette } from '@/types/Palette';
import type { DownloadInfo } from '@/types/Sync';
import { getTxtFile } from './getTxtFile';

const getPrepareFiles =
  (
    exportScaleFactors: number[],
    exportFileTypes: string[],
    handleExportFrame: ExportFrameMode,
    palettes: Palette[],
    fileNameStyle: FileNameStyle,
  ) => async (
    image: Image,
    tiles: string[] | RGBNTiles,
    imageStartLine: number,
  ): Promise<DownloadInfo[]> => {

    const isRGBN = isRGBNImage(image);
    const lockFrame = image.lockFrame || false;
    const rotation = image.rotation || 0;

    const { palette, framePalette } = getImagePalettes(palettes, image);

    if (!palette) {
      throw new Error('Palette missing?');
    }

    const getBlob = async (fileType: string, scaleFactor: number): Promise<Blob> => {
      if (isRGBN) {
        return getRGBNImageBlob({
          tiles: tiles as RGBNTiles,
          palette: palette as RGBNPalette,
          lockFrame,
          imageStartLine,
          rotation,
          scaleFactor,
          handleExportFrame,
        }, fileType);
      }

      const { invertPalette, invertFramePalette } = getPaletteSettings(image as MonochromeImage);

      const updateParams = getMonochromeImageCreationParams({
        imagePalette: (palette as Palette).palette || BW_PALETTE_HEX,
        framePalette: (framePalette as Palette)?.palette || BW_PALETTE_HEX,
        invertPalette,
        invertFramePalette,
      });

      return getMonochromeImageBlob({
        tiles: tiles as string[],
        rotation,
        scaleFactor,
        handleExportFrame,
        ...updateParams,
        imageStartLine,
      }, fileType);
    };

    const validExportScaleFactors = [...exportScaleFactors].filter((factor) => (
      typeof factor === 'number'
    ));

    const validExportFileTypes = [...exportFileTypes];

    if (!validExportScaleFactors.length) {
      validExportScaleFactors.push(4);
    }

    if (!validExportFileTypes.length) {
      validExportFileTypes.push('png');
    }

    const images = validExportScaleFactors.map((exportScaleFactor): Promise<null | DownloadInfo>[] => (
      validExportFileTypes.map((fileType) => (
        new Promise((resolve) => {

          const filename = generateFileName({
            image,
            palette,
            exportScaleFactor,
            fileNameStyle,
          });

          // export the raw tildata of an image
          switch (fileType) {
            case 'txt': {
              // not for rgbn images
              if (isRGBN) {
                resolve(null);
                return;
              }

              // this loads the basic raw data without applying a frame
              getTxtFile(image.hash, image.title, filename).then(resolve);
              break;
            }

            case 'pgm': {
              // not for rgbn images
              if (isRGBN) {
                resolve(null);
                return;
              }

              getBlob('image/png', exportScaleFactor)
                .then(createImageBitmap)
                .then((imageBitmap) => {
                  const canvas = document.createElement('canvas');
                  canvas.width = imageBitmap.width;
                  canvas.height = imageBitmap.height;
                  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
                  context.drawImage(imageBitmap, 0, 0);

                  const paletteValues = (palette as Palette).palette;

                  if (!context || !paletteValues?.length) {
                    resolve(null);
                    return;
                  }

                  const pgm = [
                    'P2',
                    '#',
                    `# Exported from ${window.location.origin}`,
                    '#',
                    `# hash: ${image.hash}`,
                    `# created: ${image.created}`,
                    `# title: ${image.title}`,
                    `# tags: ${image.tags.join(', ')}`,
                    `# dimension: ${canvas.width}*${canvas.height} pixels`,
                    '#',
                    `${canvas.width} ${canvas.height}`,
                    '3', // 4 greyscale values (0-3)
                    '#',
                  ];

                  for (let y = 0; y < canvas.height; y += 1) {
                    const line = [];
                    for (let x = 0; x < canvas.width; x += 1) {

                      const imageData = context.getImageData(x, y, 1, 1).data;

                      const hexColor = [
                        '#',
                        imageData[0].toString(16).padStart(2, '0'),
                        imageData[1].toString(16).padStart(2, '0'),
                        imageData[2].toString(16).padStart(2, '0'),
                      ].join('');

                      let colorIndex = (palette as Palette).palette.indexOf(hexColor);

                      if (colorIndex === -1) {
                        colorIndex = BW_PALETTE.indexOf(parseInt(hexColor.slice(1), 16));
                      }

                      line.push(3 - colorIndex);
                    }

                    pgm.push(line.join(' '));
                  }

                  resolve({
                    filename: `${filename}.${fileType}`,
                    blob: new Blob([pgm.join('\n')], {
                      type: 'text/plain',
                    }),
                    title: image.title,
                  });
                });

              break;
            }

            default: {
              getBlob(`image/${fileType}`, exportScaleFactor)
                .then((blob: Blob) => {
                  resolve({
                    filename: `${filename}.${fileType}`,
                    blob,
                    title: image.title,
                  });
                })
                .catch(() => resolve(null));

              break;
            }
          }
        })
      ))
    ));

    const imgs: (DownloadInfo | null)[] = await Promise.all(images.flat());
    return imgs.reduce((acc: DownloadInfo[], fileInfo: DownloadInfo | null) => {
      if (!fileInfo) {
        return acc;
      }

      return [...acc, fileInfo];
    }, []);
  };

export type PrepareFilesReturnType = ReturnType<typeof getPrepareFiles>;

export default getPrepareFiles;
