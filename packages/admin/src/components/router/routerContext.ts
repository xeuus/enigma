import { createContext } from 'react';
export type RouterContextProps = {
  redirect?: string;
  status: number;
};
export const RouterContext = createContext<RouterContextProps>({
  status: 200,
});
