import React, { FC, PropsWithChildren, ReactNode, useContext } from 'react';

export const Container: FC<PropsWithChildren> = ({ children }) => {
  return <div className='flex h-screen'>{children}</div>;
};

export const Panel: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex flex-col grow p-4 px-4 md:px-8 lg:px-12'>
      {children}
    </div>
  );
};
