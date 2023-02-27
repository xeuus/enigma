import React, { createContext, FC, PropsWithChildren, useContext } from 'react';
import { Provider } from './stateful';

const StateContext = createContext<{
  state: Provider['state'];
}>({
  state: 'none',
});
export const Switch: FC<
  PropsWithChildren<{
    state: Provider['state'];
  }>
> = ({ state, children }) => {
  return (
    <StateContext.Provider value={{ state }}>{children}</StateContext.Provider>
  );
};

export const State: FC<
  PropsWithChildren<{
    condition: Provider['state'];
  }>
> = ({ condition, children }) => {
  const context = useContext(StateContext);
  return <>{context.state === condition ? children : null}</>;
};
