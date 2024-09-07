import type { RGBNTiles, RGBNPalette } from 'gb-image-decoder';
import { BW_PALETTE, BW_PALETTE_HEX, Decoder, RGBNDecoder } from 'gb-image-decoder';
import generateFileName from '../generateFileName';
import { getTxtFile } from './getTxtFile';
import { getRotatedCanvas } from '../applyRotation';
import type { State } from '../../app/store/State';
import type { Palette } from '../../../types/Palette';
import type { Image, MonochromeImage } from '../../../types/Image';
import { isRGBNImage } from '../isRGBNImage';
import type { DownloadInfo } from '../../../types/Sync';
import { getDecoderUpdateParams } from '../getDecoderUpdateParams';

const getPrepareFiles =
  (
    state: State,
  ) => (
    palette: RGBNPalette | Palette,
    image: Image,
  ) => async (
    tiles: string[] | RGBNTiles,
    imageStartLine: number,
  ): Promise<DownloadInfo[]> => {
    const { exportScaleFactors, exportFileTypes, handleExportFrame } = state;

    let decoder: Decoder | RGBNDecoder;
    const isRGBN = isRGBNImage(image);
    const lockFrame = image.lockFrame || false;
    const invertPalette = (image as MonochromeImage).invertPalette || false;
    const rotation = image.rotation || 0;


    if (isRGBN) {
      decoder = new RGBNDecoder();
      decoder.update({
        canvas: null,
        tiles: tiles as RGBNTiles,
        palette: palette as RGBNPalette,
        lockFrame,
      });
    } else {
      decoder = new Decoder();
      const pal = (palette as Palette).palette;

      const invertFramePalette = invertPalette;
      const framePalette = lockFrame ? BW_PALETTE_HEX : pal;

      const updateParams = getDecoderUpdateParams({
        palette: pal,
        framePalette,
        invertPalette,
        invertFramePalette,
      });

      decoder.update({
        canvas: null,
        tiles: tiles as string[],
        ...updateParams,
        imageStartLine,
      });
    }

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

              const canvas = getRotatedCanvas(decoder.getScaledCanvas(1, handleExportFrame), rotation);

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

              const context = canvas.getContext('2d');

              if (!context) {
                resolve(null);
                break;
              }

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

                  let colorIndex = (palette as Palette).palette?.indexOf(hexColor) || -1;

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

              break;
            }

            default: {
              const canvas = getRotatedCanvas(decoder.getScaledCanvas(exportScaleFactor, handleExportFrame), rotation);

              const onBlobComplete = (blob: Blob | null) => {
                if (!blob) {
                  resolve(null);
                } else {
                  resolve({
                    filename: `${filename}.${fileType}`,
                    blob,
                    title: image.title,
                  });
                }
              };

              canvas.toBlob(onBlobComplete, `image/${fileType}`, 1);
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
