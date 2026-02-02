import { v4 } from 'uuid';
import { create } from 'zustand';

export enum LogType {
  ERROR = 'error',
  DONE = 'done',
  MESSAGE = 'message',
}

export interface LogItem {
  timestamp: number,
  message: string,
  type: LogType,
}

export interface ProgressLog {
  git: LogItem[],
  dropbox: LogItem[],
}

export interface Progress {
  id: string,
  label: string,
  value: number,
}

interface Values {
  progress: Progress[],
  progressLog: ProgressLog,
}

interface Actions {
  resetProgressLog: () => void,
  startProgress: (label: string) => string,
  setProgress: (id: string, progress: number) => void,
  stopProgress: (id: string) => void,
  setProgressLog: (which: keyof ProgressLog, logItem: LogItem) => void,
}

export type ProgressState = Values & Actions;

export const createProgressStore = () => (
  create<ProgressState>((set, get) => ({
    progress: [],
    progressLog: { git: [], dropbox: [] },

    resetProgressLog: () => set({ progressLog: { git: [], dropbox: [] } }),

    startProgress: (label: string): string => {
      const newProgress: Progress = {
        id: v4(),
        label,
        value: 0,
      };
      set(({ progress }) => ({ progress: [...progress, newProgress] }));
      return newProgress.id;
    },

    setProgress: (id: string, progressValue: number) => {
      set(({ progress }) => ({
        progress: progress.map((progressEntry): Progress => (
          (progressEntry.id !== id) ? progressEntry : {
            ...progressEntry,
            value: progressValue,
          }
        )),
      }));
    },

    stopProgress: (id: string) => {
      set(({ progress }) => ({
        progress: progress.filter((progressEntry) => (progressEntry.id !== id)),
      }));
    },

    setProgressLog: (which: keyof ProgressLog, logItem: LogItem) => {
      const { progressLog } = get();
      set({
        progressLog: {
          ...progressLog,
          [which]: [
            logItem,
            ...progressLog[which],
          ],
        },
      });
    },
  }))
);
