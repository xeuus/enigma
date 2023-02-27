import { useCallback, useEffect, useRef } from 'react';
export function useTimer(
  handler: (options: {
    elapsed: number;
    isFinished: boolean;
    percent: number;
  }) => void,
  {
    autoStart = true,
    interval = 1000,
    duration = null,
  }: {
    autoStart?: boolean;
    interval?: number;
    duration?: number | null;
  },
) {
  const timerPointer = useRef<{
    pointer?: NodeJS.Timeout;
    startedAt: number | null;
    isRunning?: boolean;
  }>({ startedAt: null });

  const iterate = useCallback(() => {
    const { isRunning, startedAt } = timerPointer.current;
    const diffTime = startedAt !== null ? Date.now() - startedAt : 0;
    if (duration !== null && diffTime >= duration) {
      return handler({
        elapsed: duration,
        isFinished: true,
        percent: 1,
      });
    }
    const percent = duration !== null ? diffTime / duration : 0;
    handler({
      elapsed: diffTime,
      isFinished: false,
      percent,
    });
    timerPointer.current.pointer = setTimeout(() => {
      if (!isRunning) return;
      iterate();
    }, interval);
  }, [interval, handler, duration]);

  const stop = useCallback(() => {
    timerPointer.current.isRunning = false;
    clearTimeout(timerPointer.current.pointer);
  }, []);

  const start = useCallback(() => {
    clearTimeout(timerPointer.current.pointer);
    timerPointer.current.isRunning = true;
    timerPointer.current.startedAt = Date.now();
    iterate();
  }, [iterate]);

  useEffect(() => {
    if (autoStart) start();
  }, [autoStart, start]);

  return { start, stop };
}
