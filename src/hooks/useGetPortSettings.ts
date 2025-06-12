import { useCallback } from 'react';
import { DialoqQuestionType } from '@/consts/dialog';
import useDialogsStore from '@/stores/dialogsStore';
import { DialogQuestionSelect, DialogResult } from '@/types/Dialog';
import { PortSettings } from '@/types/ports';

const baudRates = [2400, 4800, 9600, 19200, 28800, 38400, 57600, 76800, 115200, 230400, 250000, 460800, 576000, 921600, 1000000];

interface UseGetPortSettings {
  querySettings: () => Promise<PortSettings | null>,
}

export const useGetPortSettings = (): UseGetPortSettings => {
  const { setDialog, dismissDialog } = useDialogsStore();

  const querySettings = useCallback((): Promise<PortSettings | null> => {
    return new Promise((resolve) => {
      setDialog({
        confirm: async (values: DialogResult) => {
          dismissDialog(0);
          resolve({
            baudRate: parseInt(values?.baudRate as string || '115200', 10),
          });
        },
        deny: async () => {
          dismissDialog(0);
          resolve(null);
        },
        message: 'Specify Baudrate for Port',
        questions: (): DialogQuestionSelect[] => {
          return [{
            key: 'baudRate',
            label: 'Baud Rate',
            type: DialoqQuestionType.SELECT,
            options: baudRates.map((baudRate) => ({
              value: baudRate.toString(10),
              name: baudRate.toString(10),
              selected: baudRate === 115200,
            })),
          }];
        },
      });
    });
  }, [dismissDialog, setDialog]);

  return{
    querySettings,
  };
};
