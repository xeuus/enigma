import React, { FC, useCallback, useState } from 'react';

export type Provider<T = any> = {
  state: 'none' | 'loading' | 'succeed' | 'failed';
  error?: Error | null;
  response?: T | null;
  onClick: () => void;
};

type StateOptions = Omit<Provider, 'onClick'>;

export const Stateful = <T>({
  before,
  action,
  finish,
  pause = 1000,
  children,
}: {
  pause?: number;
  before?: () => Promise<void> | void;
  action: () => Promise<T> | T;
  finish?: (err: Error | null | undefined, response: T ) => Promise<void> | void;
  children: (provider: Provider<T>) => React.ReactElement | null;
}) => {
  const [state, setState] = useState<StateOptions>({ state: 'none' });
  const revert = useCallback(
    (state: Provider['state'], error?: Error | null, response?: any) => {
      setState({
        state,
        error,
        response,
      });
      setTimeout(async () => {
        try {
          await finish?.(error, response);
        } catch (e) {
          console.error(e);
        }
        setState({
          state: 'none',
          error,
          response,
        });
      }, pause);
    },
    [state, finish],
  );

  return children({
    state: state.state,
    async onClick() {
      console.log('hello')
      setState({
        state: 'loading',
      });

      try {
        await before?.();
      } catch (e) {
        console.error(e);
      }

      
      try {
        const response = await action();
        revert('succeed', null, response);
      } catch (e: any) {
        revert('failed', e, null);
        throw e;
      }
    },
  });
};
