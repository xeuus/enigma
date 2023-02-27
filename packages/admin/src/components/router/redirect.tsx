import React, { FC, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RouterContext } from './routerContext';

export const Redirect: FC<{
  to: string;
  temporary?: boolean;
}> = ({ to, temporary }) => {
  const navigate = useNavigate();
  const routerContext = useContext(RouterContext);
  if (routerContext) {
    routerContext.status = temporary ? 302 : 301;
    routerContext.redirect = to;
  }
  useEffect(() => {
    navigate(to, { replace: true });
  }, [to]);
  return null;
};
