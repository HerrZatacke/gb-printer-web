import { useRef, useCallback, type RefObject } from 'react';

export interface UseLimitCounter {
  increaseLimit: () => Promise<void>;
  limit: RefObject<number>;
}

export const useLimitCounter = (cooldownMs: number, maxQueue: number): UseLimitCounter => {
  const limit = useRef(0);
  const queue = useRef<(() => void)[]>([]);

  const increaseLimit = useCallback((): Promise<void> => {
    return new Promise<void>((resolve) => {
      const attempt = () => {
        if (limit.current < maxQueue) {
          limit.current += 1;
          resolve();

          // schedule decrement
          setTimeout(() => {
            limit.current -= 1;
            // try to process queued increments immediately
            while (queue.current.length > 0 && limit.current < maxQueue) {
              const next = queue.current.shift();
              next?.();
            }
          }, cooldownMs);
        } else {
          // queue for next available slot
          queue.current.push(attempt);
        }
      };

      attempt();
    });
  }, [cooldownMs, maxQueue]);

  return {
    increaseLimit,
    limit,
  };
};
