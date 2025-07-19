import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { DialoqQuestionType } from '@/consts/dialog';
import useDialogsStore from '@/stores/dialogsStore';
import useSettingsStore from '@/stores/settingsStore';
import { DialogQuestionSelect, DialogResult } from '@/types/Dialog';
import { PortSettings } from '@/types/ports';

const baudRates = [2400, 4800, 9600, 19200, 28800, 38400, 57600, 76800, 115200, 230400, 250000, 460800, 576000, 921600, 1000000];

interface UseGetPortSettings {
  querySettings: () => Promise<PortSettings | null>,
}

export const useGetPortSettings = (): UseGetPortSettings => {
  const t = useTranslations('useGetPortSettings');
  const { setDialog, dismissDialog } = useDialogsStore();
  const { setLastBaudRate } = useSettingsStore();

  const querySettings = useCallback((): Promise<PortSettings | null> => {
    // get lastBaudRate from store without triggering a dependency update by directly calling it from the store
    const lastBaudRate = useSettingsStore.getState().lastBaudRate;

    return new Promise((resolve) => {
      setDialog({
        confirm: async (values: DialogResult) => {
          dismissDialog(0);
          const baudRate = parseInt(values?.baudRate as string || '115200', 10);
          resolve({ baudRate });
          setLastBaudRate(baudRate);
        },
        deny: async () => {
          dismissDialog(0);
          resolve(null);
        },
        message: t('specifyBaudrate'),
        questions: (): DialogQuestionSelect[] => {
          return [{
            key: 'baudRate',
            label: t('baudRateLabel'),
            type: DialoqQuestionType.SELECT,
            options: baudRates.map((baudRate) => ({
              value: baudRate.toString(10),
              name: baudRate.toString(10),
              selected: baudRate === lastBaudRate,
            })),
          }];
        },
      });
    });
  }, [dismissDialog, setDialog, setLastBaudRate, t]);

  return{
    querySettings,
  };
};
