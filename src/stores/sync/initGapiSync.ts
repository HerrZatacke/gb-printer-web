import { hash as ohash } from 'ohash';
import type { StoreApi } from 'zustand';
import type { ItemsState } from '@/stores/itemsStore';
import type { StoragesState } from '@/stores/storagesStore';
import { reduceImagesMonochrome, reduceImagesRGBN } from '@/tools/isRGBNImage';
import { objectsToSheet } from '@/tools/sheetConversion/objectsToSheet';
import { sheetToObjects } from '@/tools/sheetConversion/sheetToObjects';
import { type ColumnSpec, ColumnType } from '@/tools/sheetConversion/types';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { Image, MonochromeImage, RGBNImage } from '@/types/Image';
import type { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin } from '@/types/Plugin';
import type { GapiSettings } from '@/types/Sync';

type FnTeardown = () => void;

export const initGapiSync = (
  storagesStore: StoreApi<StoragesState>,
  itemsStore: StoreApi<ItemsState>,
): FnTeardown => {
  if (typeof window === 'undefined') {
    return () => { /**/ };
  }

  return () => { /**/ };

  let gapiInitialized = false;
  let gapiStorageConfig: GapiSettings = storagesStore.getState().gapiStorage;
  let itemsState: ItemsState = itemsStore.getState();

  const applyToken = (): boolean => {
    const { use, token } = gapiStorageConfig;

    if (!use || !token) {
      return false;
    }

    if (gapi.client.getToken()?.access_token === token) {
      return true;
    }

    gapi.client.setToken({
      access_token: token,
      // expires_in: // ToDo
    });
    return true;
  };

  const initClient = async (): Promise<boolean> => (
    new Promise((resolve) => {
      if (typeof window.gapi === 'undefined') {
        resolve(false);
        return;
      }

      if (!gapiInitialized) {
        gapi.load('client', async () => {
          await gapi.client.init({
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          });
          gapiInitialized = true;
          resolve(applyToken());
        });
      } else {
        resolve(applyToken());
      }
    })
  );

  // let testHandle: number;
  // let pollingStarted = false;
  // const startPolling = () => {
  //   if (pollingStarted) {
  //     return;
  //   }
  //
  //   console.log('🤖 start polling');
  //   pollingStarted = true;
  //
  //   clearInterval(testHandle);
  //   testHandle = window.setInterval(async () => {
  //     const { use, sheetId } = gapiStorageConfig;
  //     if (use && sheetId) {
  //       console.log('Polling interval');
  //     }
  //   }, 15000);
  // };
  //
  // // wait for possible initially loaded client

  window.setTimeout(async () => {
    const initialized = await initClient();
    if (initialized) {
      // startPolling();
    }
  }, 4000);

  const updateItems = async <T extends object>({
    sheetId,
    sheetName,
    columns,
    keyColumn,
    items,
    updateFn,
  }: {
    sheetId: string,
    sheetName: string,
    columns: ColumnSpec<T>[],
    keyColumn: keyof T,
    items: T[],
    updateFn: (items: T[]) => void,
  }): Promise<void> => {
    const startTime = Date.now();

    const options = {
      key: keyColumn,
      columns,
    };

    const { result: { values: remoteValues } } = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
    });

    const { result: { sheets: remoteSheets } } = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const remoteSheet = (remoteSheets || []).find(({ properties }) => (
      properties?.title === sheetName
    ));

    const targetSheetId = remoteSheet?.properties?.sheetId;

    if (!remoteSheet || targetSheetId === undefined) {
      throw new Error(`remote sheet "${sheetName}" missing`);
    }

    // console.log(remoteSheet);

    const sheetItems = objectsToSheet(items, {
      ...options,
      deleteMissing: true,
      existing: remoteValues,
    });

    // console.log({
    //   items,
    //   sheetName,
    //   remoteValues,
    //   sheetItems,
    // });

    // update Values
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: sheetItems },
    });

    // update sheet properties:
    // fix header row
    // crop sheet size to sheetItems to delete excess items
    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: targetSheetId,
                gridProperties: {
                  frozenRowCount: 1,
                  // Todo: instead of cropping, maybe delete indices row-by-row? -> More requests, but less network overhead?
                  // these dimensions crop the last items if fewer new rows than before
                  rowCount: sheetItems.length + 1,
                  columnCount: columns.length,
                },
              },
              fields: 'gridProperties(rowCount,columnCount,frozenRowCount)',
            },
          },
          {
            sortRange: {
              range: {
                sheetId: targetSheetId,
                startRowIndex: 1,
                startColumnIndex: 0,
              },
              sortSpecs: [
                {
                  dimensionIndex: 0,
                  sortOrder: 'ASCENDING',
                },
              ],
            },
          },
          {
            createDeveloperMetadata: {
              // ToDo: prevent adding a new item every time... :/
              developerMetadata: {
                metadataKey: 'lastUpdate',
                metadataValue: Date.now().toString(10),
                visibility: 'DOCUMENT',
                location: {
                  sheetId: targetSheetId,
                },
              },
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: targetSheetId,
                dimension: 'COLUMNS',
              },
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: targetSheetId,
                startColumnIndex: 0,
                endColumnIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.85,
                    green: 0.85,
                    blue: 0.85,
                  },
                },
              },
              fields: 'userEnteredFormat.backgroundColor',
            },
          },
        ],
      },
    });

    console.log(`Pushed ${sheetName} in ${Date.now() - startTime}ms`);

    // Update
    const { result: { values: updatedValues } } = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
    });
    const importItems = sheetToObjects<T>(updatedValues as string[][], options);
    updateFn(importItems);
  };


  const unsubscribeConfig = storagesStore.subscribe(async (state) => {
    if (ohash(state.gapiStorage) !== ohash(gapiStorageConfig)) {
      console.log('🤖 gapiStorageConfig has changed!');
      gapiStorageConfig = state.gapiStorage;

      const initialized = await initClient();
      if (initialized) {
        // startPolling();
      }
    }
  });


  let itemsDebounceHandle: number;
  const unsubscribeItems = itemsStore.subscribe((state) => {
    if (state !== itemsState) {
      itemsState = state;
      window.clearTimeout(itemsDebounceHandle);
      itemsDebounceHandle = window.setTimeout(async () => {
        console.log('🤖 itemsState has changed!');
        const { use, sheetId } = gapiStorageConfig;

        if (!use || !sheetId || !gapi.client) {
          console.log('oi?', use, sheetId, gapi.client);
          return;
        }

        console.log('🤖 -> updating items start');

        await updateItems<Palette>({
          columns: [
            { prop: 'shortName', column: 'ShortName', type: ColumnType.STRING },
            { prop: 'name', column: 'Name', type: ColumnType.STRING },
            { prop: 'palette', column: 'Palette', type: ColumnType.JSON },
            { prop: 'origin', column: 'Origin', type: ColumnType.STRING },
          ],
          items: itemsState.palettes.filter(({ isPredefined }) => !isPredefined),
          keyColumn: 'shortName',
          sheetId,
          sheetName: 'palettes',
          // updateFn: itemsStore.getState().setPalettes,
          updateFn: console.log.bind(console),
        });

        const imagesCommonProps: ColumnSpec<Image>[] = [
          { prop: 'hash', column: 'Hash', type: ColumnType.STRING },
          { prop: 'created', column: 'Created', type: ColumnType.STRING },
          { prop: 'title', column: 'Title', type: ColumnType.STRING },
          { prop: 'frame', column: 'Frame', type: ColumnType.STRING },
          { prop: 'tags', column: 'Tags', type: ColumnType.JSON },
          { prop: 'lockFrame', column: 'Lock Frame', type: ColumnType.BOOLEAN },
          { prop: 'rotation', column: 'Rotation', type: ColumnType.NUMBER },
          { prop: 'meta', column: 'Meta', type: ColumnType.JSON },
        ];

        await updateItems<MonochromeImage>({
          columns: [
            ...imagesCommonProps,
            // From Monochrome Image
            { prop: 'palette', column: 'Palette', type: ColumnType.STRING },
            { prop: 'lines', column: 'Lines', type: ColumnType.NUMBER },
            { prop: 'invertPalette', column: 'Invert Palette', type: ColumnType.BOOLEAN },
            { prop: 'framePalette', column: 'Frame Palette', type: ColumnType.STRING },
            { prop: 'invertFramePalette', column: 'Invert Frame Palette', type: ColumnType.BOOLEAN },
            // ToDo: "database relations"
            // =XLOOKUP(INDEX(A:A, ROW()), images_bin!$A:$A, images_bin!$B:$B)
            // =ADDRESS(MATCH(INDEX(A:A, ROW()),images_bin!$A:$A, 0), 2, 4, TRUE, "images_bin")
            // =MATCH(INDEX(A:A, ROW()), images_bin!$A:$A, 0)
          ],
          items: itemsState.images.reduce(reduceImagesMonochrome, []),
          keyColumn: 'hash',
          sheetId,
          sheetName: 'images',
          // updateFn: itemsStore.getState().setImages,
          updateFn: console.log.bind(console),
        });


        await updateItems<RGBNImage>({
          columns: [
            ...imagesCommonProps,
            // From RGBN Image
            { prop: 'palette', column: 'Palette', type: ColumnType.JSON },
            { prop: 'hashes', column: 'Hashes', type: ColumnType.JSON },
          ],
          items: itemsState.images.reduce(reduceImagesRGBN, []),
          keyColumn: 'hash',
          sheetId,
          sheetName: 'rgbnimages',
          // updateFn: itemsStore.getState().setImages,
          updateFn: console.log.bind(console),
        });


        await updateItems<Frame>({
          columns: [
            { prop: 'id', column: 'ID', type: ColumnType.STRING },
            { prop: 'hash', column: 'Hash', type: ColumnType.STRING },
            { prop: 'name', column: 'Name', type: ColumnType.STRING },
            { prop: 'lines', column: 'Lines', type: ColumnType.NUMBER },
          ],
          items: itemsState.frames,
          keyColumn: 'id',
          sheetId,
          sheetName: 'frames',
          updateFn: console.log.bind(console),
        });

        await updateItems<FrameGroup>({
          columns: [
            { prop: 'id', column: 'ID', type: ColumnType.STRING },
            { prop: 'name', column: 'Name', type: ColumnType.STRING },
          ],
          items: itemsState.frameGroups,
          keyColumn: 'id',
          sheetId,
          sheetName: 'framegroups',
          updateFn: console.log.bind(console),
        });

        await updateItems<Plugin>({
          columns: [
            { prop: 'url', column: 'URL', type: ColumnType.STRING },
            { prop: 'name', column: 'Name', type: ColumnType.STRING },
            { prop: 'description', column: 'Description', type: ColumnType.STRING },
            { prop: 'config', column: 'Config', type: ColumnType.JSON },
            { prop: 'configParams', column: 'Config Params', type: ColumnType.JSON },
          ],
          items: itemsState.plugins,
          keyColumn: 'url',
          sheetId,
          sheetName: 'plugins',
          updateFn: console.log.bind(console),
        });

        await updateItems<SerializableImageGroup>({
          columns: [
            { prop: 'id', column: 'ID', type: ColumnType.STRING },
            { prop: 'title', column: 'Title', type: ColumnType.STRING },
            { prop: 'slug', column: 'Slug', type: ColumnType.STRING },
            { prop: 'created', column: 'Created', type: ColumnType.STRING },
            { prop: 'coverImage', column: 'Cover Image Hash', type: ColumnType.STRING },
            { prop: 'images', column: 'Images', type: ColumnType.JSON },
            { prop: 'groups', column: 'Sub-Groups', type: ColumnType.JSON },
          ],
          items: itemsState.imageGroups,
          keyColumn: 'id',
          sheetId,
          sheetName: 'imagegroups',
          updateFn: console.log.bind(console),
        });

        console.log('🤖 Data saved!');
      }, 5000);
    }
  });

  return () => {
    unsubscribeConfig();
    unsubscribeItems();
  };
};
